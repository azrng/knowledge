---
title: EFCore并发处理
lang: zh-CN
date: 2023-09-02
publish: true
author: azrng
isOriginal: true
category:
  - orm
tag:
  - 锁
  - efcore
filename: efcoreConcurrency
docsId: 'c7c29acc-ab67-4a43-9d8b-4b6484de196d'
---

## 概述

在大多数情况下，数据库由多个应用程序实例并发使用，每个实例对数据分别执行修改。 在同一时间修改相同的数据时，可能会出现不一致和数据损坏，例如，当两个客户端修改同一行中以某种方式关联的不同列时。 本文来讨论确保数据在发生此类并发更改时保持一致的机制。



EFCore不直接提供悲观锁。如果想使用悲观锁，需要开发人员自己编写原生SQL语句来使用悲观并发控制。

## 目的

避免多个用户同时操作资源造成的并发冲突问题。举例：统计点击量

最好的解决方案：非数据库解决方案
数据库层面的两种策略：悲观、乐观。

悲观并发和乐观并发
1)悲观并发：比如有两个用户a,b,同时登陆一个系统操作一个文档，如果a先进去修改，系统就把该文档锁住，b就没办法打开了，只有等a修改完，完全退出之后b才能进入修改。
2)乐观开发:a,b两个用户同时登录，如果a先进去修改紧接着b也进入修改了，a修改文档的同时b也在修改，如果a保存之后b在保存他的修改，此时系统检测到数据库中的文档记录和b刚进入时候的不一致，b保存时候会抛出异常，修改失败。

## 准备知识

锁是和事务相关的，所以需要开启一个事务，并且需要在所有操作完成之后提交事务。

## 悲观锁

一般采用行锁、表锁等排他锁对资源局进行锁定，确保只有一个使用者操作被锁定的资源。
缺点：锁是独占、排他的，如果系统并发量很大的话，会严重影响性能(会等待锁释放)，如果使用不当的话，设置会导致死锁。

> 需要开发人员编写原生SQL实现，并且每个数据库的操作方式还不一样。

### pgsql原生操作



```csharp
public async Task<TicketType> GetWithLockAsync(Guid id)
{
    return await context
        .TicketTypes
        .FromSql(
            $@"
            SELECT id, event_id, name, price, currency, quantity
            FROM ticketing.ticket_types
            WHERE id = {id}
            FOR UPDATE NOWAIT") // PostgreSQL: Lock or fail immediately
        .SingleAsync();
}
```

* `FOR UPDATE NOWAIT` ：这是PostgreSQL中悲观锁的核心。它告诉数据库“抓取这一行，为我锁定它，如果它已经锁定，现在就引发一个错误
* 错误处理：我们将 `GetWithLockAsync` 调用包装在 `try-catch` 块中，以优雅地处理锁定失败，重试或通知用户。



`NO WAIT` -如果无法锁定行而不是等待，则报告错误；`SKIP LOCKED` -跳过任何无法锁定的选定行；

参考资料：[一种在EFCore中实现悲观锁的巧妙方法](https://www.milanjovanovic.tech/blog/a-clever-way-to-implement-pessimistic-locking-in-ef-core?utm_source=newsletter&utm_medium=email&utm_campaign=tnw85)

### MySQL原生操作

```csharp
public async Task PessimismLock()
{
    using var db = new OpenDbContext();

    //添加测试数据
    //var groupInfo = new Group("我是班级名称1");
    //await db.Groups.AddAsync(groupInfo);
    //await db.SaveChangesAsync();

    var guid = Guid.NewGuid().ToString();
    Console.WriteLine("当前名称是" + guid);
    using var tran = await db.Database.BeginTransactionAsync();
    Console.WriteLine(DateTime.Now + "准备select update");
    //通过表锁来实现一个人操作资源  当执行到这发现有其他人在访问，那么就会卡主等待行锁释放继续执行
    var groupInfo2 = await db.Groups.FromSqlInterpolated($"select  * from `groups` where id=6938925881452843009 for update").SingleOrDefaultAsync();
    Console.WriteLine(DateTime.Now + "结束 select update");
    if (groupInfo2.Name != "我是班级名称1")
    {
        if (groupInfo2.Name == guid)
        {
            Console.WriteLine("该班级已经属于你了");
        }
        else
        {
            Console.WriteLine($"该班级上个名称叫做 {groupInfo2.Name} ");
        }
    }
    groupInfo2.Name = guid;
    await Task.Delay(5000);
    Console.WriteLine(DateTime.Now + "恭喜你抢到了锁");
    await db.SaveChangesAsync();
    Console.WriteLine(DateTime.Now + "保存成功");
    await tran.CommitAsync();
    Console.WriteLine("结束");
}
```

### Serializable

使用**Serializable**事务的模式来进行实现类似悲观锁的操作

```c#
using var db = new OpenDbContext();
var tran = await db.Database.BeginTransactionAsync(IsolationLevel.Serializable);
var user = await db.Users.Where(t => t.Account == "admin11").FirstOrDefaultAsync();
if (user is null)
    return;

user.Name = "测试";
await db.SaveChangesAsync();
await tran.CommitAsync();
```

## 乐观锁

原理：使用了类似update employee set name=新值 where id=1 and name=老值，当更新的时候，如果数据库中name的值已经被其他操作者更新为其他值，那么where语句的值就会为false，因此和这个修改语句影响的行数就是0，EDCore就知道“发生并发冲突”； 因此SaveChanges()方法就会抛出DbUpdateConcurrencyException异常。

### 并发令牌
将不能被并发修改的属性设置为并发令牌
```csharp
//把被并发修改的属性使用IsConcurrencyToken设置为并发令牌
builder.Property(t => t.Name).IsConcurrencyToken();
```
然后编写乐观锁的代码
```csharp
public async Task OptimismLock()
{
    //需要在IEntityTypeConfiguration中配置builder.Property(t => t.Name).IsConcurrencyToken();

    var guid = Guid.NewGuid().ToString();
    Console.WriteLine("将班级名称设置为：" + guid);
    using var db = new OpenDbContext();
    var groupInfo2 = await db.Groups.SingleAsync(t => t.Id == 6938925881452843009);
    if (groupInfo2.Name != "我是班级名称1")
    {
        if (groupInfo2.Name == guid)
        {
            Console.WriteLine("该班级已经属于你了");
        }
        else
        {
            Console.WriteLine($"该班级上个名称叫做 {groupInfo2.Name} ");
        }
    }
    groupInfo2.Name = guid;
    await Task.Delay(5000);

    try
    {
        /*
            执行SQL效果：会把并发令牌旧的值传入作为校验
            UPDATE `groups` SET `name` = @p0
            WHERE `id` = @p1 AND `name` = @p2;
            SELECT ROW_COUNT();
            */
        await db.SaveChangesAsync();
        Console.WriteLine(DateTime.Now + "恭喜你抢到了锁");
        Console.WriteLine(DateTime.Now + "保存成功");
        Console.WriteLine("结束");
    }
    catch (DbUpdateConcurrencyException ex)
    {
        //获取新值
        var entry = ex.Entries[0];
        var dbValues = await entry.GetDatabaseValuesAsync();
        string newName = dbValues.GetValue<string>(nameof(Group.Name));

        Console.WriteLine($"并发访问冲突，没有抢到锁,被{newName}提前设置了班级名称 结束");
    }
}
```
或者直接在属性上标记以下特性
```csharp
[ConcurrencyCheck]
public DateTime? UpdateTime { get; set; }
```
然后查询出来更新该条数据的值的时候
```csharp
//乐观锁更新
entity.UpdateTime = DateTime.Now.ToNowDateTime()
```
生成的sql如下
```csharp
UPDATE meta_data.meta_data_element SET update_time = @p0 WHERE id = @p1 AND update_time IS NULL; // 这点update_time IS NULL是因为updatetime原来的值为null
```

### RowVersion
SqlServer数据库可以使用一个byte[]类型的属性做并发控制，然后使用使用IsRowVersion()把这个属性设置为RowVersion类型，这样子这属性对应的数据库列就会被设置为RowVersion类型(数据类型是timestamp)。每次插入或者更新的时候，数据库自动为这一行的rowversion类型的列生成新值。

MySQL中没有像SqlServer那样子的东西，所以我们可以模仿着乐观锁的原理，自己新增一列比如说guid类型或者雪花id类型，然后将该列设置为并发令牌，在每次添加或者修改的时候去生成新值，也能达到我们上面的效果。
增加RowVersion列
```csharp
/// <summary>
/// 对应MySql数据库中的字段类型是longblob
/// </summary>
public byte[] RowVersion { get; set; }
```
配置模型约定
```csharp
//乐观锁：引入额外的列设置并发令牌
builder.Property(t => t.RowVersion).IsConcurrencyToken();
```
最后，也是最重要的，我们自己需要在添加或者修改的时候赋新值，那么重写SaveChanges。
```csharp
/// <summary>
/// 重写SaveChanges(乐观锁引入新列使用)
/// </summary>
/// <returns></returns>
public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
{
    //检查数据库更改
    this.ChangeTracker.DetectChanges();

    //筛选新增/修改的实体对象
    var modifiedEntities = this.ChangeTracker
        .Entries()
        .Where(x => x.State == EntityState.Modified || x.State == EntityState.Added)
        .Select(x => x.Entity)
        .ToList();
    foreach (var entity in modifiedEntities)
    {
        //存储一个新的Guid值
        entity?.GetType().GetProperty("RowVersion")
            ?.SetValue(entity, Encoding.Default.GetBytes(Guid.NewGuid().ToString()));
    }
    return base.SaveChangesAsync(cancellationToken);
}
```
编写实现代码
```csharp
public async Task RowVersionOptimismLock()
{
    //需要在IEntityTypeConfiguration中配置builder.Property(t => t.RowVersion).IsConcurrencyToken();
    using var db = new OpenDbContext();

    //添加测试数据
    //var groupInfo = new Group("我是班级名称1");
    //await db.Groups.AddAsync(groupInfo);
    //await db.SaveChangesAsync();

    var guid = Guid.NewGuid().ToString();
    Console.WriteLine("将班级名称设置为：" + guid);
    var groupInfo2 = await db.Groups.SingleAsync(t => t.Id == 6939017060314206209);
    if (groupInfo2.Name != "我是班级名称1")
    {
        if (groupInfo2.Name == guid)
        {
            Console.WriteLine("该班级已经属于你了");
        }
        else
        {
            Console.WriteLine($"该班级上个名称叫做 {groupInfo2.Name} ");
        }
    }
    groupInfo2.Name = guid;
    await Task.Delay(5000);

    try
    {
        /*
            执行SQL效果：会把并发令牌旧的值传入作为校验
            UPDATE `groups` SET `name` = @p0, `row_version` = @p1
            WHERE `id` = @p2 AND `row_version` = @p3;
            SELECT ROW_COUNT();
            */
        await db.SaveChangesAsync();
        Console.WriteLine(DateTime.Now + "恭喜你抢到了锁");
        Console.WriteLine(DateTime.Now + "保存成功");
        Console.WriteLine("结束");
    }
    catch (DbUpdateConcurrencyException ex)
    {
        //获取新值
        var entry = ex.Entries[0];
        var dbValues = await entry.GetDatabaseValuesAsync();
        string newName = dbValues.GetValue<string>(nameof(Group.Name));

        Console.WriteLine($"并发访问冲突，没有抢到锁,被{newName}提前设置了班级名称 结束");
    }
}
```

### 总结
乐观并发控制能够避免悲观锁带来的性能、死锁等问题，因此更推荐。
如果有一个确定的字段要被并发控制，那么直接将该字段设置为并发令牌即可。
如果无法确定要一个唯一的并发令牌列，那么就引入一个额外的属性设置为并发令牌，并且在每次更新数据的时候，手动更新这一列的值(有的数据库提供了RowVersion列，那么就不用我们额外手动处理了)。

## 资料

[官网处理并发文档](https://learn.microsoft.com/zh-cn/ef/core/saving/concurrency?tabs=data-annotations) 

isconcurrencytoken vs isrowversion：https://www.cnblogs.com/qianxingmu/p/13376164.html

杨老师教程
官网：[https://docs.microsoft.com/zh-cn/ef/core/modeling/concurrency?tabs=data-annotations](https://docs.microsoft.com/zh-cn/ef/core/modeling/concurrency?tabs=data-annotations)

在EFCore中使用乐观并发：https://www.cnblogs.com/JackyGz/p/17935350.html
