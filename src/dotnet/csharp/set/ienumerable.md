---
title: IEnumerable
lang: zh-CN
date: 2023-10-22
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 无
filename: ienumerable
slug: gynli5
docsId: '49851115'
---

## IEnumerable

最常用的接口，它可以标识任何类型的集合，包括数组、列表、集合、字典、文件、网络流等，实现该`IEnumerable<T>`的类型或者接口可以使用foreach进行遍历，还可以使用yield语句返回值。
设置默认值
```csharp
public IEnumerable<AddTimePeriodDto> TimePeriod { get; set; } = Enumerable.Empty<AddTimePeriodDto>();
```

## IQueryable

实现了`IEnumerable<T>`，包含`IEnumerable<T>`的全部功能，在System.Linq的命名空间中，通过下面的代码来比较IQueryable和IEnumerable
```csharp
// 当遇到 ToList() 等方法后，在数据库中执行，执行的 SQL 语句会是 `TOP(3)` 这种，只查前3条 
IQueryable<Person> persons = _dbContext.Persons.Where(......);
persons = persons.Take<Person>(3);

// 将所有符合 Where() 条件的数据都查到内存中，再取 3 条
IEnumerable<Person> persons = _dbContext.Persons.Where(......);
persons = persons.Take<Person>(3); 
```
如果需要在数据源上执行linq操作来提高效率，那么就使用IQueryable，如果想将一些处理在内存中处理，那么这个时候就需要使用到IEnumerable

## `ICollection<T>`

继承了`IEnumerable<T>`, IEnumerable，包含`IEnumerable<T>`的全部功能，还支持添加、删除集合中的元素，使用Add()和Remove()等方法。

### 数组T[]

继承自`ICollection<T>`

### `IList<T>`

继承自`ICollection<T>`,`IEnumerable<T>`，在原来的基础上增加了IndexOf、Insert、RemoveAt等方法

### `List<T>`

继承自`ICollection<T>`, `IEnumerable<T>`, `IEnumerable`, `IList<T>`, `IReadOnlyCollection<T>`, `IReadOnlyList<T>`, `ICollection`, `IList`在原有的基础上增加了不少方法

## IReadonlyCollection

不可变集合，增加了count属性

### `IReadOnlyList<T>`

继承自：`IEnumerable<T>`, `IEnumerable`, `IReadOnlyCollection<T>`，在原有的基础上增加了通过索引获取值的方法。

## BlockingCollection

[https://www.cnblogs.com/baibaomen-org/p/17162795.html](https://www.cnblogs.com/baibaomen-org/p/17162795.html)

如果你想玩转C## 里面多线程，工厂模式，生产者/消费者,队列等高级操作，就可以和我一起探索这个强大的线程安全提供阻塞和限制功能的.Net神器类

## CollectionsMarshal

基础使用示例

``` xml
var list = new List<string>();
var aaa = CollectionsMarshal.AsSpan(list);
```

## 集合选择
只考虑各种集合类型的功能，得出的初步但不完全合适的规则：

1. 当需要添加和删除集合中的元素时，用 `ICollection<T>`；
2. 当需要在数据源上执行 LINQ 操作以提升效率时，选择 `IQueryable<T>`，典型场景是使用 EF Core 等 ORM 框架时；
3. 其他情况选择 `IEnumerable<T>`。

进一步考虑可维护性等元素，得出的规则：

1. 当你的方法需要一个集合类型的输入参数时，可以选择 `IEnumerable<T>`；
2. 返回集合类型时选择 `IReadOnlyCollection<T>` 或它的子类。

促使我们不把 `IEnumerable<T>` 作为返回集合类型实际上还有一个原因。就是 `IEnumerable<T>` 有“延迟评估”的特性。
资料：[https://cat.aiursoft.cn/post/2023/3/10/a-guide-to-ienumerable-iqueryable-and-icollection](https://cat.aiursoft.cn/post/2023/3/10/a-guide-to-ienumerable-iqueryable-and-icollection)

## 常用方法

### Distinct


自定义去重
```csharp
public class UserInfo
{
    public string UserName { get; set; }
    public string Password { get; set; }
}

public class CustomerComparer : IEqualityComparer<UserInfo>
{
    public bool Equals(UserInfo x, UserInfo y)
    {
        if (x == null)
        {
            return y == null;
        }

        return x.UserName == y?.UserName;
    }

    public int GetHashCode(UserInfo obj)
    {
        return obj.UserName?.GetHashCode() ?? 0;
    }
}
```

操作

```csharp
var list = new List<UserInfo>
{
 new UserInfo {  UserName="张三", Password="李四"},
 new UserInfo {  UserName="张三", Password="李四"}
};

var distinctList = list.Distinct().ToList(); // 2条
var customerDistinctList= list.Distinct(new CustomerComparer()).ToList(); // 1条
```

### OrderBy


自定义排序支持，通过安装nuget包：NaturalSort.Extension
更新日志：[https://dotnet.libhunt.com/naturalsort-extension-changelog](https://dotnet.libhunt.com/naturalsort-extension-changelog)

### Yield

关于 yield 关键字（C#）[https://www.cnblogs.com/czzj/p/yield.html](https://www.cnblogs.com/czzj/p/yield.html)

## 资料
[https://mp.weixin.qq.com/s/iJKWQ7Zfv3QLBSLE3kA-_A](https://mp.weixin.qq.com/s/iJKWQ7Zfv3QLBSLE3kA-_A) | .NET性能优化之快速遍历List集合
