---
title: 优化
lang: zh-CN
date: 2022-08-17
publish: true
author: azrng
isOriginal: true
category:
  - orm
tag:
  - 无
filename: youhua
slug: wucu19
docsId: '29500546'
---

## 使用DbContext池
在Core Mvc中,如果使用 AddDbContextPool 方法，那么在控制器请求 DbContext 实例时，我们会首先检查池中有无可用的实例。 请求处理完成后，实例的任何状态都将被重置，并且实例本身会返回池中。 从概念上讲，此方法类似于 ADO.NET 连接池的运行原理，并具有节约 DbContext 实例初始化成本的优势。
poolSize 参数 AddDbContextPool 设置池保留的最大实例数 中128。 一旦 poolSize 超出，就不会缓存新的上下文实例，EF 会回退到按需创建实例的非池行为。
```csharp
services.AddDbContextPool<BloggingContext>( options => options.UseSqlServer(connectionString));
```
> 注意：如果同时使用数据库池和延迟加载，那么就出现内存上升问题，详情看：[https://masuit.org/2049?t=uhwxjhl4ecqo](https://masuit.org/2049?t=uhwxjhl4ecqo)


## 连接池原理
概念：连接到数据源可能需要很长时间。 为了最大程度地降低打开连接的成本，ADO.NET 使用一种称为连接池的优化技术，这会最大程度地降低重复打开和关闭连接的成本。
A. 当一个程序执行Connection.open()时候，ADO.Net就需要判断，此连接是否支持Connection Pool (Pooling 默认为True)
　①：如果指定为False, ADO.Net就与数据库之间创建一个连接，然后返回给程序。
　②：如果指定为 True，ADO.Net就会根据ConnectString创建一个Connection Pool，然后向Connection Pool中填充Connection。填充多少个Connection由Min Pool Size (默认为0)属性来决定。例如如果指定为5，则ADO.Net会一次与SQL数据库之间打开5个连接，然后将4个Connection，保存在 Connection Pool中，1个Connection返回给程序。
B. 当程序执行到Connection.close() 的时候。如果Pooling 为True，ADO.net 就把当前的Connection放到Connection Pool并且保持与数据库之间的连接。
同时还会判断Connection Lifetime(默认为0)属性，0代表无限大，如果Connection存在的时间超过了Connection LifeTime，ADO.net就会关闭的Connection同时断开与数据库的连接，而不是重新保存到Connection Pool中。
C. 当下一次Connection.Open() 执行的时候，ADO.Net就会判断新的ConnectionString与之前保存在Connection Pool中的Connection的connectionString是否一致。
D. ADO.Net需要判断当前的Connection Pool中是否有可以使用的Connection(没有被其他程序所占用)，如果没有的话，ADO.Net就需要判断ConnectionString设 置的Max Pool Size （默认为100）
　①. 如果Connection Pool中的所有Connection没有达到Max Pool Size，ADO.net则会再次连接数据库，创建一个连接，然后将Connection返回给程序。
　②. 如果已经达到了 Max Pool Size，ADO.Net就不会再次创建任何新的连接，而是等待Connection Pool中被其他程序所占用的Connection释放，这个等待时间受SqlConnection.ConnectionTimeout（默认是15 秒）限制，也就是说如果时间超过了15秒，SqlConnection就会抛出超时错误。
E. 如果有可用的Connection，从Connection Pool 取出的Connection也不是直接就返回给程序，ADO.Net还需要检查ConnectionString的ConnectionReset属性 (默认为True)是否需要对Connection 做一次reset。

## 批处理
当操作数量大于等于3条时候，会进行批处理(将添加的sql合成一个)，可以手动设置批处理的条数MaxBatchSize，默认值很大。
```csharp
optionsBuilder.UseSqlServer("Server=localhost;Database=EFDB01;User ID=sa;Password=123456;", b => b.MaxBatchSize(10));
```

## 关闭状态追踪
当决定只查询数据，不更改数据时候，应当使用非追踪模式，非追踪查询执行更快

- 单体查询关闭：AsNoTracking()
- 整个上下文关闭
   - context.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
   - 开启：context.ChangeTracker.DetectChanges();

非跟踪添加
```csharp
_dataContext.Entry(region).State = EntityState.Added;
int res = await _dataContext.SaveChangesAsync();
```
非跟踪修改
```csharp
_dataContext.Entry(region).State = EntityState.Modified;
int res = await _dataContext.SaveChangesAsync();
```
非跟踪删除
```csharp
_dataContext.Entry(region).State = EntityState.Deleted;
int res = await _dataContext.SaveChangesAsync();
```

## 包含关系
比如现在已知一堆用户名称p1,p2,p3,p4,x2,y4，现在需要这几个用户的信息
正确的做法是：将字符串转换成list，然后再使用contains
```csharp
string str = "p1,p2,p3,p4,x2,y4";
 var strList = str.Split(',').ToList();
 var data5 = dbContext.T_UserInfor.Where(u => strList.Contains(u.userName)).ToList();
```

## Find查询
多使用Find()方法，建议在查询的时候使用Find()方法，会有限走内存缓存，如果内存已经存在，就不会去数据库中去查询数据；

## EF.CompileAsyncQuery

EF.CompileAsyncQuery是EF Core的一个扩展方法，它可以将LINQ表达式编译为一个异步查询。相比于动态生成LINQ查询，使用EF.CompileAsyncQuery可以提高查询性能，减少不必要的内存分配。

编译后的查询可以多次调用，而不必每次动态生成查询表达式。这样可以避免不必要的内存分配和查询优化开销，提高查询性能。

在EF Core 5.0及以上版本中，EF.CompileAsyncQuery已经成为了标准的扩展方法，无需进行任何特殊的安装或配置即可使用。

它适用于查询条件固定的情况，当然也可以重新编译，不过频繁的编译会造成内存和性能的开销。

示例如下：

```c
using Microsoft.EntityFrameworkCore.Query;
// 定义一个异步查询
private static readonly Func<MyDbContext, int, Task<Order>> GetOrderById =
    EF.CompileAsyncQuery((MyDbContext context, int id) =>
        context.Orders.FirstOrDefaultAsync(o => o.Id == id));
// 调用异步查询
var order = await GetOrderById(context, 1);
```

