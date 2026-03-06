---
title: 数据库函数
lang: zh-CN
date: 2023-07-19
publish: true
author: azrng
isOriginal: true
category:
  - orm
tag:
  - 无
filename: shujukuhanshu
slug: zogd3yacs5huzxek
docsId: '110610875'
---

## 前言
有些数据库的函数在.Net中有对应的函数映射，但是其中一些是没有的，这样子做是为了保持实体框架API在不同的数据库提供程序之间保持一致。

但是你可以编写代码来补充，通过注册函数，可以在EFCore中来使用数据库的函数。

## EF.Functions

DbFunctions扩展方法说明：[此处](https://learn.microsoft.com/zh-cn/dotnet/api/microsoft.entityframeworkcore.dbfunctions?view=efcore-8.0)

### 公共函数

#### Like

EF.Functions.Like ：支持通配符% 、_、[]、[^]

> 使用 EF.Functions.Like进行模糊查询要比 StartsWith、Contains 和 EndsWith 方法生成的SQL语句性能更优。

```csharp
var result= dataContext.Categories.Where(item => EF.Functions.Like(item.CategoryName, $"%{name}%")).ToList();
```

对比：EF.Functions.Like 和Contains(包含)的区别

```csharp
// _context.Set<User>().Where(t => t.Account.Contains(account)).ToListAsync();
SELECT `u`.`Id`, `u`.`Account`, `u`.`CreateTime`, `u`.`IsValid`, `u`.`PassWord`
FROM `user` AS `u`
WHERE (@__account_0 LIKE '') OR (LOCATE(@__account_0, `u`.`Account`) > 0)

//_context.Set<User>().Where(t => EF.Functions.Like(t.Account, $"%{account}%")).ToListAsync();
Executed DbCommand (2ms) [Parameters=[@__Format_1='?' (Size = 20)], CommandType='Text', CommandTimeout='30']
SELECT `u`.`Id`, `u`.`Account`, `u`.`CreateTime`, `u`.`IsValid`, `u`.`PassWord`
FROM `user` AS `u`
WHERE `u`.`Account` LIKE @__Format_1
```

StartsWith：以某一个字符串开头
Contains：是否包含在某一个字符串中
EndsWith：以某一个字符串结尾

> 结论： 在EF Core中提供EF.Functions.Like()方法的根本原因是在 TSQL 语句中 Like 关键字支持通配符，而在.Net中StartsWith、Contains和EndsWith方法是不支持通配符的；在EF Core中StartsWith、Contains和EndsWith模糊查询实际分别被解析成为Left、CharIndex和Right，而不是Like。

#### DateDiffDay

EF.Functions.DateDiffDay (DateDiffHour、DateDiffMonth),求天、小时、月之间的数量

### Npgsql

支持的映射方法：[https://www.npgsql.org/efcore/mapping/translations.html](https://www.npgsql.org/efcore/mapping/translations.html)

需要安装nuget包

```xml
<PackageReference Include="Npgsql.EntityFrameworkCore.PostgreSQL" Version="6.0.2" />
```

#### JsonContains

json字段是否包含某一个值

##### 场景：文本是否包含某一个值

举例：我们要存储一个学生对应的爱好的ID数组，那么我们会创建一个jsonb格式的列hobby，然后里面存储的内容格式如下

```json
[111,222,333]
```

对应到代码中，为了方便操作，我们将其实体类型映射为List&gt;int&lt;格式，如下

```c#
public List<int> Hobby { get; set; }
```

光做这个还不行，还需要在EFCore配置中将其配置自动转换

```c#
entity.Property(e => e.Hobby).HasJsonConversion().HasColumnType("jsonb").HasComment("爱好列表");
```

这里的HasJsonConversion来自于我们编写的自定义扩展

```c#
public static class PropertyBuilderExtensions
{
    /// <summary>
    /// 对象转json存数据库
    /// </summary>
    /// <param name="propertyBuilder"></param>
    /// <typeparam name="T"></typeparam>
    /// <returns></returns>
    public static PropertyBuilder<T> HasJsonConversion<T>(this PropertyBuilder<T> propertyBuilder)
    where T : class, new()
    {
        var converter = new ValueConverter<T, string>
        (
            v => v.ToJson(),
            v => v.ToObject<T>()
        );

        var comparer = new ValueComparer<T>
        (
            (l, r) => l.ToJson() == r.ToJson(),
            v => v == null ? 0 : v.ToJson().GetHashCode(),
            v => v.ToJson().ToObject<T>()
        );

        propertyBuilder.HasConversion(converter);
        propertyBuilder.Metadata.SetValueConverter(converter);
        propertyBuilder.Metadata.SetValueComparer(comparer);
        return propertyBuilder;
    }
}
```

这个时候当我们查询列表的时候，Hobby字段取到的值默认就是一个List集合了。



但是当我们想查询该列是否存在某一个列的值为11的时候，那么我们就应该使用下面的函数了

```c#
var result = _dbContext.User.Where(x => EF.Functions.JsonContains(x.Hobby, '11')).ToList(); 
```

该方法翻译为SQL是使用到了pgsql数据库的@>函数，示例如下

```sql
select '[1,8,19]'::jsonb @> '[8]'
```

## 内置函数

::: tip

该内置函数的定义必须出现在DbContext的继承类中，这是因为`DbFunction` 需要依赖于`DbContext`的数据库上下文来进行查询和执行。因此，将其定义在`DbContext`类中能确保功能的完整性和一致性。`DbContext`负责管理数据库连接和事务。将`DbFunction`定义在`DbContext`类中，使得这些方法能正确地通过`DbContext`执行，并与EF Core的数据库操作紧密集成。

:::

支持通过修改数据库上下文来增加对数据库内置函数的调用，
举例以使用pgsql的内置函数to_char为例，我们有一个数据库上下文OpenDbContext，修改OpenDbContext在该类中增加如下方法

> 请注意，我们没有实现方法，我们只是提供了正确的签名

```csharp
/// <summary>
/// pg to_char内置函数
/// </summary>
/// <param name="input">要转换的值</param>
/// <param name="format">转换的格式</param>
/// <returns></returns>
/// <exception cref="NotImplementedException"></exception>
[DbFunction(Name = "to_char", IsBuiltIn = true, IsNullable = false)]
public static string ToChar(DateTime input, string format = "yyyy-MM-dd HH24:mi:ss")
{
    throw new NotImplementedException();
}
```
> IsBuiltIn指是否为内置函数
> IsNullable指是否可以为null


然后我一个简单的查询操作
```csharp
[HttpGet("time/tochar")]
public async Task<string> TimeToChar()
{
    var list = await _openDbContext.Users
        .Select(t => OpenDbContext.ToChar(t.CreateTime, "yyyy-MM-dd HH24:mi:ss"))
        .ToListAsync();

    return "success";
}
```
执行查询的时候，会生成以下SQL语句
```csharp
SELECT to_char(u.create_time, 'yyyy-MM-dd HH24:mi:ss')
FROM sample."user" AS u
```

## 自定义函数
除了可以使用内置函数以外，还可以创建自己的sql函数并且以这种方式进行添加，下面使用pgsql创建一个简单的数据库函数
```csharp
CREATE OR REPLACE FUNCTION sample.add_credit(source_credit double precision, addCredit int4)
    RETURNS double precision AS
$$
SELECT source_credit + addCredit;
$$
LANGUAGE SQL;
```
现在还在数据库上下文中注册
```csharp
/// <summary>
/// 添加学分的自定义函数
/// </summary>
/// <param name="sourceCredit">原始学分</param>
/// <param name="addCredit">要添加的学分</param>
/// <returns></returns>
/// <exception cref="NotImplementedException"></exception>
[DbFunction(Name = "add_credit", Schema = "sample", IsBuiltIn = false)]
public static double AddCredit(double sourceCredit, int addCredit)
{
    throw new NotImplementedException();
}
```
然后我编写一个简单的查询操作
```csharp
/// <summary>
/// 学分相加
/// </summary>
/// <returns></returns>
[HttpGet("double/tochar")]
public async Task<string> DoubleAdd()
{
    var list = await _openDbContext.Users
        .Select(t => OpenDbContext.AddCredit(t.Credit, 10))
        .ToListAsync();

    return "success";
}
```
执行查询的时候，会生成以下SQL语句
```csharp
SELECT sample.add_credit(u.credit, 10)
FROM sample."user" AS u
```

## 总结
使用 DbFunctions 是一种在EFCore查询中利用特定数据库功能的有用方法，但是需要注意。因为您正在使用数据库特定的功能，所以如果您想这样做，后期考虑移植到其他数据库就会变得更加困难。

## 参考文档
docs：https://docs.microsoft.com/zh-cn/ef/core/querying/database-functions

数据库函数：[https://timdeschryver.dev/blog/consuming-sql-functions-with-entity-framework](https://timdeschryver.dev/blog/consuming-sql-functions-with-entity-framework#conclusion)

一个函数扩展的示例：https://www.cnblogs.com/GuZhenYin/p/14657024.html