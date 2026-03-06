---
title: 生成SQL语句
lang: zh-CN
date: 2023-07-03
publish: true
author: azrng
isOriginal: true
category:
  - orm
tag:
  - 无
filename: shengchengsqlyugou
slug: ep6ccn
docsId: '30832788'
---

## 标准日志

新建一个API项目，然后默认使用的ILogger日志框架，在配置EFCore好的基础上，日志的默认的配置如下

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft": "Warning",
      "Microsoft.Hosting.Lifetime": "Information"
    }
  }
}
```

该配置情况下，EFCore执行的过程中是不会输出执行sql的，所以需要修改该日志配置(**但是这样子就修改了全局Microsoft的日志级别**)

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft": "Information", // 👈 此处有修改
      "Microsoft.Hosting.Lifetime": "Information"
    }
  }
}
```

然后就可以看到输出了日志，如果不想修改全局日志级别，那么可以采用下面的方案。

### Startup配置(推荐)
```csharp
services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseNpgsql(configuration.GetConnectionString("Pgsql"), mi =>
    {
        mi.MigrationsAssembly(migrationsAssembly);
        mi.MigrationsHistoryTable("migrations_history", "sample");
    }).UseLoggerFactory(LoggerFactory.Create(builder =>
    {
        //日志过滤
        builder.AddFilter((category, level) =>
                category == DbLoggerCategory.Database.Command.Name && level == LogLevel.Information)
            .AddConsole(); // 用于控制台程序的输出
    }));
});
```
到这里我们就可以看到刚执行的SQL脚本了，如果想显示匿名信息那么还得配置，在数据库上下文的OnConfiguring中添加

```csharp
protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
{
    // 显示敏感数据日志，默认为true
    optionsBuilder.EnableSensitiveDataLogging();
}
```

如果你对接了其他第三方日志，比如使用Serilog接管默认的日志并且还使用了`seq`，那么在AddDbContext的地方就需要加上`AddSerilog`,这时候如果不写，那么比如Serilog对接的`seq`中就看不到输出的sql

![image-20240418221307957](/dotnet/image-20240418221307957.png)

没必要在写`AddConsole`了，因为会导致重复输出

![image-20240418221416958](/dotnet/image-20240418221416958.png)

只需要保留下面的代码即可，控制台可以输出，`seq`中也可以输出

```c#
services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseNpgsql(configuration.GetConnectionString("Pgsql"), mi =>
    {
        mi.MigrationsAssembly(migrationsAssembly);
        mi.MigrationsHistoryTable("migrations_history", "sample");
    }).UseLoggerFactory(LoggerFactory.Create(builder =>
    {
        //日志过滤
        builder.AddFilter((category, level) =>
                category == DbLoggerCategory.Database.Command.Name && level == LogLevel.Information)
            .AddSerilog();
    }));
});
```

![image-20240418221638961](/dotnet/image-20240418221638961.png)

### DbContext配置

```csharp
protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
{
    //显示敏感数据日志 默认为true
    optionsBuilder.EnableSensitiveDataLogging();
    //输出标准日志
    optionsBuilder.UseLoggerFactory(MyLogFactory);
}

private static readonly ILoggerFactory MyLogFactory = LoggerFactory.Create(build =>
{
    //日志过滤
    build.AddFilter((category, level) => category == DbLoggerCategory.Database.Command.Name && level == LogLevel.Information)
        .AddConsole() // 用于控制台程序的输出
        .AddDebug(); // 用于VS调试，输出窗口的输出
});
```

如果遇到使用`Serilog`等，操作可以参考Startup配置的写法即可

## 简单日志

如果想研究efcore执行过程可以看这个日志
```csharp
protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
{
    optionsBuilder.EnableSensitiveDataLogging(true);//显示敏感数据日志

    //输出简单日志  如果不配置日志级别或者日志级别低一点可以看到整个ef执行的日志过程
    //optionsBuilder.LogTo(msg => Console.WriteLine(msg), LogLevel.Information);
    
    //简单过滤
    optionsBuilder.LogTo(msg =>
    {
        if (!msg.Contains("CommandExecuting"))
            return;
        Console.WriteLine(msg);
    });

    base.OnConfiguring(optionsBuilder);
}
```

## ToQueryString
通过执行IQueryable扩展方法ToQueryString来生成执行的语句。
```csharp
var query = db.Users.Where(t=>t.Name=="张三");
var sql = query.ToQueryString();
```
不需要真的执行查询才能获取SQL语句；只能获取查询的操作。

## 总结
写测试代码，用简单日志(因为有些测试代码是没有装日志包的)。
正式需要记录SQL给审核人员或者排查故障，用标准日志。
开发阶段，需要从许多查询中立即看到SQL，使用ToQueryString。

## 资料
杨老师教程学习有感。
