---
title: Serilog
lang: zh-CN
date: 2023-10-02
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: netcoreshiyongserilog
slug: dvop8i
docsId: '31219217'
---

## 1. 概述
与.NET的许多其他库一样，Serilog也提供对文件，控制台和[ 其他地方的](https://github.com/serilog/serilog/wiki/Provided-Sinks)诊断日志记录 。它易于设置，具有简洁的API，并且可以在最新的.NET平台之间移植。还在构建时考虑了强大的结构化事件数据。
> 官网：[https://serilog.net/](https://serilog.net/)
> GitHub：[https://github.com/serilog/serilog](https://github.com/serilog/serilog)

## 2. NuGet

Nuget包说明

- Serilog 提供了对基本的结构化日志的功能支持
- Serilog.AspNetCore 基于AspNetCore框架整合的Serilog日志记录程序包，包含了Serilog基本库和控制台日志的实现。

- Serilog.Extensions.Logging 包含了注入了Serilog的拓展方法。
- Serilog.Sinks.Async 实现了日志异步收集。
- Serilog.Sinks.Console 实现了控制台输出日志。
- Serilog.Sinks.Debug 实现了调试台输出日志。
- Serilog.Sinks.File 实现了文件输出日志。
- Serilog.Settings.Configuration 打通了serilog和Configuration，这样子就可以直接从appsettings.json中读取配置
- Serilog.Sinks.RollingFile 实现了对滚动文件的支持
> 根据情况选择不同的组件

## 3. 操作

### .Net6下Api配置

实现在.Net5Api中输入日志到控制台和文件

#### 安装Nuget包

```
Serilog.Extensions.Logging.File
```

#### 硬编码方案

Program文件如下

```
namespace SerilogLogger
{
    public static class Program
    {
        public static void Main(string[] args)
        {
            //非结构化日志
            Log.Logger = new LoggerConfiguration()
                .MinimumLevel.Information() //配置日志最低级别
                .MinimumLevel.Override("Microsoft", LogEventLevel.Information)
                .Enrich.FromLogContext()
                .WriteTo.Console()
                .WriteTo.File("log.txt", rollingInterval: RollingInterval.Day, rollOnFileSizeLimit: true)
                .CreateLogger();

            try
            {
                Log.Information("Starting web host");
                CreateHostBuilder(args).Build().Run();
            }
            catch (Exception ex)
            {
                Log.Fatal(ex, "Host terminated unexpectedly");
            }
            finally
            {
                Log.CloseAndFlush();
            }
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder => { webBuilder.UseStartup<Startup>(); })
                .UseSerilog(dispose: true);
    }
}
```

#### 配置文件方案

修改appsettings文件，通过配置文件来指定
```csharp
{
    "Serilog": {
        "WriteTo": [
            {
                "Name": "RollingFile",
                "Args": {
                    "pathFormat": "Serilogs\\{Date}.txt",
                    "RestrictedToMinimumLevel": "Warning",
                    "rollingInterval": "Day",
                    "outputTemplate": "{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} [{Level:u3}] {Message:lj}{NewLine}{Exception}"
                }
            },
            {
                "Name": "Console",
                "Args": {}
            }
        ],
        "MinimumLevel": {
            "Default": "Debug",
            "Override": {
                "Microsoft": "Information",
                "System": "Information"
            }
        }
    },
    "AllowedHosts": "*"
}
```
修改Program方法
```csharp
public class Program
{
    public static void Main(string[] args)
    {
        CreateHostBuilder(args).Build().Run();
    }

    public static IHostBuilder CreateHostBuilder(string[] args) =>
        Host.CreateDefaultBuilder(args)
            .ConfigureWebHostDefaults(webBuilder =>
            {
                webBuilder.UseStartup<Startup>();
            }).UseSerilog((hostingContext, loggerConfiguration) =>
            {
                // 通过读取appsettings.json配置控制日志
                loggerConfiguration.ReadFrom.Configuration(hostingContext.Configuration)
                .Enrich.FromLogContext();
            });
}
```


#### 控制器中使用

```csharp
[ApiController]
[Route("[controller]")]
public class HomeController : ControllerBase
{
    private readonly ILogger<HomeController> _logger;

    public HomeController(ILogger<HomeController> logger)
    {
        _logger = logger;
    }

    [HttpGet]
    public string Get()
    {
        _logger.LogTrace("0 Trace日志");
        _logger.LogDebug("1 我是一个调试日志");
        _logger.LogInformation("2  我是一个info日志");
        _logger.LogWarning("3  我是一个警告日志");
        _logger.LogError("4   我是一个错误日志");
        _logger.LogCritical("5   LogCritical 立刻修复");

        return "成功";
    }
}
```

### dotNet6+使用
结构化日志：[https://cat.aiursoft.cn/post/2023/3/12/why-is-my-web-api-so-slow-1-structured-logging-with-serilog](https://cat.aiursoft.cn/post/2023/3/12/why-is-my-web-api-so-slow-1-structured-logging-with-serilog)
计时和诊断日志：[https://cat.aiursoft.cn/post/2023/3/12/why-is-my-web-api-so-slow-2-timing-and-diagnostic](https://cat.aiursoft.cn/post/2023/3/12/why-is-my-web-api-so-slow-2-timing-and-diagnostic)

#### 安装nuget包

```
Serilog.Settings.Configuration
```

#### 硬编码配置

注册日志
```csharp
using Serilog;
using Serilog.Events;
using Serilog.Formatting.Compact;

// 配置Serilog
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Override("Microsoft", LogEventLevel.Information) // 排除Microsoft的日志
    .MinimumLevel.Information()
    .Enrich.FromLogContext() // 注册日志上下文
    .WriteTo.Console(new CompactJsonFormatter()) // 输出到控制台
    //.WriteTo.MySQL(connectionString: builder.Configuration.GetConnectionString("DbConnectionString"), tableName: "Logs") // 输出到数据库
    .WriteTo.Logger(configure => configure // 输出到文件
        .MinimumLevel.Debug()
        .WriteTo.File( //单个日志文件，总日志，所有日志存到这里面
            $"logs\\log.txt",
            rollingInterval: RollingInterval.Day,
            outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} [{Level:u3}] {Message:lj}{NewLine}{Exception}"))
    .CreateLogger();

var builder = WebApplication.CreateBuilder(args);

builder.Host.UseSerilog();

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();

app.MapControllers();

app.Run();
```

#### 配置文件方案

编辑配置文件
```csharp
{
  "Serilog": {
    "Using": [
      "Serilog.Sinks.Console"],
    "MinimumLevel": {
      "Default": "Information",
      "Override": {
        "Microsoft": "Information"
      }
    },
    "WriteTo": [
      {
        "Name": "Console"
      },
      {
        "Name": "File",
        "Args": {
          "path": "log.txt",
          "rollingInterval": "Day"
        }
      }
    ],
    "Enrich": [
      "FromLogContext",
      "WithMachineName",
      "WithThreadId"
    ]
  }
}
```
在Program中使用配置
```csharp
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// 启用日志
builder.Host.UseSerilog((context, configuration) => configuration.ReadFrom.Configuration(context.Configuration));

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();

app.MapControllers();

app.Run();
```

#### 控制器中使用

```c#
using Microsoft.AspNetCore.Mvc;

namespace SerilogLoggerNew.Controllers;

[ApiController]
[Route("[controller]")]
public class HomeController : ControllerBase
{
    private readonly ILogger<HomeController> _logger;

    public HomeController(ILogger<HomeController> logger)
    {
        _logger = logger;
    }

    [HttpGet]
    public string Get()
    {
        _logger.LogTrace("0 Trace日志");
        _logger.LogDebug("1 我是一个调试日志");
        _logger.LogInformation("2  我是一个info日志");
        _logger.LogWarning("3  我是一个警告日志");
        _logger.LogError("4   我是一个错误日志");
        _logger.LogCritical("5   LogCritical 立刻修复");

        return "成功";
    }
}
```

### 请求日志记录

您可以安装该库，以便为 ASP.NET Core 请求管道添加 Serilog 日志记录。 它添加了 ASP。NET 对与应用程序事件相同的 Serilog 接收器的内部操作。`Serilog.AspNetCore`，需要调用方法

```c#
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// 启用日志记录
app.UseSerilogRequestLogging();

app.UseAuthorization();

app.MapControllers();

app.Run();
```

### 使用 CorrelationId 扩充日志

如何跟踪属于同一请求的所有日志？您可以向结构化日志添加`CorrelationId`属性。

这也适用于多个应用程序。 您需要使用 HTTP 标头传递。 例如，您可以使用自定义标头。`X-Correlation-Id`

```c#
public class RequestHeaderContextLoggingMiddleware
{
    private const string CorrelationIdHeaderName = "X-Correlation-Id";
    private readonly RequestDelegate _next;

    public RequestHeaderContextLoggingMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public Task Invoke(HttpContext context)
    {
        string correlationId = GetCorrelationId(context);

        using (LogContext.PushProperty("CorrelationId", correlationId))
        {
            return _next.Invoke(context);
        }
    }

    private static string GetCorrelationId(HttpContext context)
    {
        context.Request.Headers.TryGetValue(
            CorrelationIdHeaderName, out StringValues correlationId);

        return correlationId.FirstOrDefault() ?? context.TraceIdentifier;
    }
}
```

创建一个添加中间件的扩展方法， 请注意，注册中间件的顺序很重要。 如果你想在记录所有日志中，那么你应该将这个中间件放在开头。

```c#
public static class IApplicationBuilderExtensions
{
    public static IApplicationBuilder UseRequestHeaderContextLogging(
        this IApplicationBuilder app)
    {
        app.UseMiddleware<RequestHeaderContextLoggingMiddleware>();

        return app;
    }
}
```

### 记录重要的应用程序事件

搭配MediatR一起来为所有应用程序请求添加日志记录

```c#
internal sealed class RequestLoggingPipelineBehavior<TRequest, TResponse>
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : class
    where TResponse : Result
{
    private readonly ILogger _logger;

    public RequestLoggingPipelineBehavior(ILogger logger)
    {
        _logger = logger;
    }

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        string requestName = typeof(TRequest).Name;

        _logger.LogInformation(
            "Processing request {RequestName}", requestName);

        TResponse result = await next();

        if (result.IsSuccess)
        {
            _logger.LogInformation(
                "Completed request {RequestName}", requestName);
        }
        else
        {
            using (LogContext.PushProperty("Error", result.Error, true))
            {
                _logger.LogError(
                    "Completed request {RequestName} with error", requestName);
            }
        }

        return result;
    }
}
```

参考资料：https://www.milanjovanovic.tech/blog/5-serilog-best-practices-for-better-structured-logging#log-important-application-events

## 输出格式

json输出格式

```c#
Log.Logger = new LoggerConfiguration()
 .MinimumLevel.Information()//配置日志最低级别
 .MinimumLevel.Override("Microsoft", LogEventLevel.Information)
 .Enrich.FromLogContext()
 .WriteTo.Console(new RenderedCompactJsonFormatter())//保存为json格式
 .WriteTo.File(new CompactJsonFormatter(), "log.txt", rollingInterval: RollingInterval.Day, rollOnFileSizeLimit: true)
 .CreateLogger();
```

非结构化输出

```c#
Log.Logger = new LoggerConfiguration()
.MinimumLevel.Debug()//配置日志最低级别
.MinimumLevel.Override("Microsoft", LogEventLevel.Information)
.Enrich.FromLogContext()
.WriteTo.Console()
.WriteTo.File("log.txt", rollingInterval: RollingInterval.Day, rollOnFileSizeLimit: true)
.CreateLogger();
```

## 参考文档

[https://github.com.cnpmjs.org/serilog/serilog/wiki](https://github.com.cnpmjs.org/serilog/serilog/wiki)
极客时间教程
[https://mp.weixin.qq.com/s/WUp_wVasUd44l0huuhkOVA](https://mp.weixin.qq.com/s/WUp_wVasUd44l0huuhkOVA) | Serilog 最佳实践

5个最佳实践：https://www.milanjovanovic.tech/blog/5-serilog-best-practices-for-better-structured-logging

中心化结构化日志服务：[https://cat.aiursoft.cn/post/2023/3/13/why-is-my-web-api-so-slow-3-seq-centralized-structured-logs](https://cat.aiursoft.cn/post/2023/3/13/why-is-my-web-api-so-slow-3-seq-centralized-structured-logs)

