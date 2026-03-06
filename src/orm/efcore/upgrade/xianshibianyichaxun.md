---
title: 显式编译查询
lang: zh-CN
date: 2022-05-22
publish: true
author: azrng
isOriginal: true
category:
  - orm
tag:
  - 无
filename: xianshibianyichaxun
slug: vsuk47
docsId: '78202802'
---
简单来说，就是在查询数据时，预先编译好查询语句，便于在请求数据时能够立即响应。
EF Core 本身使用了查询表达式的散列，来实现自动编译和缓存查询，当我们的代码需要重用以前执行的查询时，EF Core 会使用散列查找，从缓存中返回已编译的查询语句。
但有时候我们可能更希望直接使用编译结果查询，绕过散列计算和缓存查找。
显式编译查询就为我们提供了进一步提高查询性能的可能。
比如我们通过主键查询 Blog，同时使用贪婪加载文章的集合列表，代码如下：
```csharp
using var context = new BloggingContext();

var blog = context.Blogs
    .AsNoTracking()
    .Include(c => c.Posts)
    .FirstOrDefault(c => c.Id == 1);
```
当进行查询时，此时要经过编译翻译阶段，最终返回实际结果。
在实际应用中，我们一般会将查询封装为方法来使用，这样就无法优化结果和查询方式。
那么，我们就能够通过编译查询来提前保存好编译结果，以达到缓存的效果。
通过 EF 静态类中的 CompileQuery 扩展方法，可以实现编译查询，我们这里改造一下刚才的查询示例：
```csharp
var query = EF.CompileAsyncQuery(
  (BloggingContext bloggingContext, int id) =>
       bloggingContext.Blogs
       .Include(c => c.Posts)
       .FirstOrDefault(c => c.Id == id));

var blog1 = query(context, 1).Result;
```
之后，我们再来测试一下常规查询和显式编译查询的性能。
为了更好的演示，接下来的示例，使用 EF Core 提供的内存库来测试。
因为真实的数据库会进行查询计划优化和缓存，而使用内存数据库就可以避免这些干扰。
首先，测试常规查询，查询一百万次：
```csharp
using var context = new BloggingContext();

// 常规查询
Func<BloggingContext, Blog> unCompileQuery = (context) =>
{
    return context.Blogs.Include(c => c.Posts)
        .OrderBy(o => o.Id)
        .FirstOrDefault();
};

var stopWatch = new Stopwatch();
stopWatch.Start();
for (var i = 0; i < 1_000_000; i++)
{

    var blog = unCompileQuery(context);
}
stopWatch.Stop();
Console.WriteLine("常规查询:" + stopWatch.Elapsed);
```
运行程序，可以看到常规查询是 18 秒左右：

接下来，我们再来看看显式编译查询：
```csharp
using var context = new BloggingContext();

// 编译查询
Func<BloggingContext, Blog> compileQuery = 
  EF.CompileQuery((BloggingContext context) =>
    context.Blogs.Include(c => c.Posts)
        .OrderBy(o => o.Id)
        .FirstOrDefault());

var stopWatch = new Stopwatch();
stopWatch.Start();
for (var i = 0; i < 1_000_000; i++)
{

    var blog = compileQuery(context);
}
stopWatch.Stop();
Console.WriteLine("编译查询:" + stopWatch.Elapsed);
```
运行程序，可以看到显式编译查询只有 3 秒左右。后续又测试了不同基数的情况。

总结：只有当查询基数足够大时，我们才可以使用编译查询来优化性能。
