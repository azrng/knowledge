---
title: 公共工具
lang: zh-CN
date: 2023-05-14
publish: true
author: azrng
isOriginal: true
category:
  - orm
tag:
  - 无
filename: shuiming
slug: tef7m6sxxumcvn9n
docsId: '124688259'
---

## 工具和扩展
工具和扩展为 Entity Framework Core 提供了额外功能。  
文档地址：[https://learn.microsoft.com/zh-cn/ef/core/extensions/](https://learn.microsoft.com/zh-cn/ef/core/extensions/)

## EFCore.NamingConventions

实体框架表和列的命名约定。

仓库地址：[https://github.com/efcore/EFCore.NamingConventions](https://github.com/efcore/EFCore.NamingConventions)

注意

- 适用于任何数据库提供程序，并且与 PostgreSQL 或 Npgsql 没有任何关系。
- 执行此操作时要非常小心（该过程目前涉及删除和重新创建主键）
- 是一个社区维护的插件

### 命名约定

- UseSnakeCaseNamingConvention: FullName becomes full_name
- UseLowerCaseNamingConvention: FullName becomes fullname
- UseCamelCaseNamingConvention: FullName becomes fullName
- UseUpperCaseNamingConvention: FullName becomes FULLNAME
- UseUpperSnakeCaseNamingConvention: FullName becomes FULL_NAME

### 操作

蛇形命名法

```csharp
protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    => optionsBuilder
        .UseNpgsql(...)
        .UseSnakeCaseNamingConvention();
```

## Zack.EFCore.Batch

Entity Framework Core用户可以使用LINQ语句删除或者更新多条数据库记录，操作一条SQL语句并且不需要首先执行把对象加载到内存中。

仓库地址：[https://github.com/yangzhongke/Zack.EFCore.Batch/blob/main/README_CN.md](https://github.com/yangzhongke/Zack.EFCore.Batch/blob/main/README_CN.md)

### 支持的数据库

SQLServer: Install-Package Zack.EFCore.Batch.MSSQL_NET6  
MySQL: Install-Package Zack.EFCore.Batch.MySQL.Pomelo_NET6  
Postgresql: Install-Package Zack.EFCore.Batch.Npgsql_NET6  
Sqlite: Install-Package Zack.EFCore.Batch.Sqlite_NET6  
Oracle: Install-Package Zack.EFCore.Batch.Oracle_NET6  
In Memory(内存数据库)：Install-Package Zack.EFCore.Batch.InMemory_NET6

## UnitOfWork

Microsoft.EntityFrameworkCore 的插件，用于支持存储库、工作单元模式和支持分布式事务的多个数据库。
仓库地址：[https://github.com/Arch/UnitOfWork](https://github.com/Arch/UnitOfWork)

### 支持MySQL多库多表分片

> 在 MySQL 中，从物理上讲，模式与数据库同义。您可以在 MySQL SQL 语法中替换关键字 SCHEMA 而不是 DATABASE，例如使用 CREATE SCHEMA 而不是 CREATE DATABASE。其他一些数据库产品也有区别。例如，在 Oracle 数据库产品中，模式仅代表数据库的一部分：单个用户拥有的表和其他对象。

因此，对于 MySQL 来说，支持此功能的简单方法是在运行时动态更改 SCHEMA。

### 快速开始

引用nuget包

```xml
<PackageReference Include="Microsoft.EntityFrameworkCore.UnitOfWork" Version="3.1.0" />
```

#### 如何使用工作单元

```c#
public void ConfigureServices(IServiceCollection services)
{
    // use in memory for testing.
    services
        .AddDbContext<QuickStartContext>(opt => opt.UseInMemoryDatabase())
        .AddUnitOfWork<QuickStartContext>()
        .AddCustomRepository<Blog, CustomBlogRepository>();
}

private readonly IUnitOfWork _unitOfWork;

// 1. IRepositoryFactory used for readonly scenario;
// 2. IUnitOfWork used for read/write scenario;
// 3. IUnitOfWork<TContext> used for multiple databases scenario;
public ValuesController(IUnitOfWork unitOfWork)
{
    _unitOfWork = unitOfWork;

    // Change database only work for MySQL right now.
    unitOfWork.ChangeDatabase($"uow_db_{DateTime.Now.Year}");

    var userRepo = unitOfWork.GetRepository<User>();
    var postRepo = unitOfWork.GetRepository<Post>();

    var ym = DateTime.Now.ToString("yyyyMM");

    userRepo.ChangeTable($"user_{ym}");
    postRepo.ChangeTable($"post_{ym}");

    var user = new User
    {
        UserName = "rigofunc",
        Password = "password"
    };

    userRepo.Insert(user);

    var post = new Post
    {
        UserId = user.UserId,
        Content = "What a piece of junk!"
    };

    postRepo.Insert(post);

    unitOfWork.SaveChanges();

    var find = userRepo.Find(user.UserId);

    find.Password = "p@ssword";

    unitOfWork.SaveChanges();

    // projection

}
```

#### 投影和包含

```c#
// projection
var pagedList = _unitOfWork.GetRepository<Blog>().GetPagedList(b => new { Name = b.Title, Link = b.Url }, pageIndex: pageIndex, pageSize: pageSize);
var projection = _unitOfWork.GetRepository<Blog>().GetFirstOrDefault(b => new { Name = b.Title, Link = b.Url }, predicate: x => x.Title.Contains(term));

// including
[HttpGet]
public async Task<IPagedList<Blog>> Get()
{
    return await _unitOfWork.GetRepository<Blog>().GetPagedListAsync(include: source => source.Include(blog => blog.Posts).ThenInclude(post => post.Comments));
}
```

## AutoHistory

Microsoft.EntityFrameworkCore的一个插件，支持自动记录数据更改历史记录。
仓库地址：[https://github.com/Arch/AutoHistory](https://github.com/Arch/AutoHistory)
