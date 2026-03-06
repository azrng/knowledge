---
title: ILogger
lang: zh-CN
date: 2023-09-02
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: ilogger
slug: qnrinf
docsId: '29412699'
---

## 介绍
这是asp.net core中内置的一个通用日志接口组件。

## 日志级别
**日志级别说明**：每一个日志都有指定的日志级别值，日志级别判断指示严重性或重要性。使用日志等级可以很好的过滤想要的日志，记录日志记录问题的同时，甚至为我们提供非常详细的日志信息。
**LogLevel 严重性：Trace < Debug < Information < Warning < Error < Critical < None。**

| **日志级别** | **常用场景** |
| --- | --- |
| **Trace = 0** | 记录一些对程序员调试问题有帮助的信息,   其中可能包含一些敏感信息, 所以应该避免在 生产环境中启用Trace日志，因此不应该用于生产环境。默认应禁用。 |
| **Debug = 1** | 记录一些在开发和调试阶段有用的短时变   量(Short-term usefulness), 所以除非为了临时排除生产环境的   故障，开发人员应该尽量避免在生产环境中启用Debug日志，默认情况下这是最详细的日志。 |
| **Information = 2** | 记录跟踪应用程序的一些流程,   例如，记录当前api请求的url。 |
| **Warning = 3** | 记录应用程序中发生出现错误或其它导致程序停止的流程异常信息。   这些信息中可能包含错误消息或者错误产生的条件, 可供后续调查，例如, 文件未找到 |
| **Error = 4** | 记录应用程序中某个操作产生的错误和异常信息。这些消息应该指明当前活动或操作（比如当前的   HTTP 请求），而不是应用程序范围的故障。 |
| **Critical = 5** | 记录一些需要立刻修复，急需被关注的问题，应当记录关键级别的日志。例如数据丢失，磁盘空间不足等。 |


## 日志配置
> 注意：日志配置通常取决于 appsettings {Environment}.json 文件的 Logging配置节，支持多个LogPrivider、过滤日志、定制特定种类的日志收集级别。

配置文件
```csharp
{
  "Logging": {
    "Debug": {
      "LogLevel": {
        "Default": "Information"
      }
    },
    "Console": {
      "LogLevel": {
       "Microsoft.AspNetCore.Mvc.Razor.Internal": "Warning",
       "Microsoft.AspNetCore.Mvc.Razor.Razor": "Debug",
       "Microsoft.AspNetCore.Mvc.Razor": "Error",
       "Default": "Information"
      }
    },
    "LogLevel": {
      "Microsoft": "Warning",
      "Microsoft.AspNetCore.Hosting.Diagnostics": "Information",    // 提供给第三方调用API日志
      "Microsoft.Hosting.Lifetime": "Information",
      "Microsoft.EntityFrameworkCore.Database.Command": "Information",  //数据库操作sql日志
      "System.Net.Http.HttpClient": "Information",    // 应用内部发起的Http请求日志
      "Default": "Warning"    // 除以上日志之外，记录Warning+级别日志
    }
  }
}
```
此 JSON 将创建 6 条筛选规则：Debug中1 条用于调试提供程序，Console中 4 条用于控制台提供程序，最后一条LogLevel 用于所有提供程序。 创建 ILogger 对象时，为每个提供程序选择一个规则。

## 命名空间

该部分内容摘抄自[痴者工良文档](https://maomi.whuanle.cn/3.0.gz_log.html#%E6%97%A5%E5%BF%97%E7%AD%89%E7%BA%A7)

在日志配置文件中，我们常常看到这样的配置

```json
"MinimumLevel": {
  "Default": "Debug",
  "Override": {
    "Default": "Debug",
    "Microsoft": "Warning",
    "System": "Warning"
  }
```

MinimumLevel 属性配置了日志打印的最低等级限制，低于此等级的日志不会输出。Override 则可以对不同的命名空间进行自定义限制。

比如，我们希望能够将程序的业务日志详细打印出来，所以我们默认等级可以设置为 Debug，但是 System、Microsoft 开头的命名空间也会打印大量的日志，这些日志用处不大，所以我们可以设置等级为 `Warning`，这样日志程序针对 System、Microsoft 开头的命名空间，只会输出 Warning 等级以上的日志。

当然，System、Microsoft 中也有一些类库打印的日志比较重要，因此我们可以单独配置此命名空间的输出等级：

```json
  "Override": {
    "Default": "Debug",
    "Microsoft.AspNetCore.HttpLogging.HttpLoggingMiddleware": "Information",
    "Microsoft": "Warning",
    "System": "Warning"
  }
```

在 ASP.NET Core 中，以下命名空间各有不同的用途，读者可以单独为这些命名空间进行配置最小日志打印等级。

| 类别                                  | 说明                                                         |
| :------------------------------------ | :----------------------------------------------------------- |
| `Microsoft.AspNetCore`                | 常规 ASP.NET Core 诊断。                                     |
| `Microsoft.AspNetCore.DataProtection` | 考虑、找到并使用了哪些密钥。                                 |
| `Microsoft.AspNetCore.HostFiltering`  | 所允许的主机。                                               |
| `Microsoft.AspNetCore.Hosting`        | HTTP 请求完成的时间和启动时间。 加载了哪些承载启动程序集。   |
| `Microsoft.AspNetCore.Mvc`            | MVC 和 Razor 诊断。 模型绑定、筛选器执行、视图编译和操作选择。 |
| `Microsoft.AspNetCore.Routing`        | 路由匹配信息。                                               |
| `Microsoft.AspNetCore.Server`         | 连接启动、停止和保持活动响应。 HTTP 证书信息。               |
| `Microsoft.AspNetCore.StaticFiles`    | 提供的文件。                                                 |

## 简单操作

### WebAPI操作
> 在类库中使用需要先引用指定组件using Microsoft.Extensions.Logging;

配置文件中进行配置
```csharp
{
  "Logging": {
    "LogLevel": {
      "Default": "Debug", //大于等于这个级别的才会被输出
      "Microsoft": "Warning", //类别适用于以 "Microsoft" 开头的所有类别
      "Microsoft.Hosting.Lifetime": "Information" //类别比 "Microsoft" 类别更具体，因此 "Microsoft.Hosting.Lifetime" 类别在日志级别“Information”和更高级别记录。
    }
  }
}

```
 代码中使用：
```csharp
private readonly ILogger<HomeController> _logger;

public HomeController(ILogger<HomeController> logger)
{
    _logger = logger;
}

[HttpGet]
public string Get()
{
    /*
      日志配置通常由 appsettings {Environment}.json 文件的 Logging 部分提供
     */
    _logger.LogTrace("0 Trace日志");
    _logger.LogDebug("1 我是一个Debug日志");
    _logger.LogInformation("2  我是一个info日志");
    _logger.LogWarning("3  我是一个警告日志");
    _logger.LogError("4   我是一个错误日志");
    _logger.LogCritical("5   LogCritical 立刻修复");
    return "成功";
}
```
 运行查看输出效果
![image.png](/common/1619945473634-900e7717-5bff-4fbf-b485-1ff1102cd69a.png)

### 控制台操作
安装组件
```xml
<ItemGroup>
  <PackageReference Include="Microsoft.Extensions.Configuration.Json" Version="5.0.0" />
  <PackageReference Include="Microsoft.Extensions.Logging" Version="5.0.0" />
  <PackageReference Include="Microsoft.Extensions.Logging.Console" Version="5.0.0" />
  <PackageReference Include="Microsoft.Extensions.Logging.Debug" Version="5.0.0" />
  <PackageReference Include="Microsoft.Extensions.Logging.TraceSource" Version="5.0.0" />
</ItemGroup>
```
配置appsettings文件
```json
{
  "Logging": {
    "LogLevel": { //用于记录所选类别的最低级别    LogLevel是全局日志类别  还有Console类别和Debug类别
      "Default": "Information", //默认情况下级别大于等于info的才会输出
      "Microsoft": "Warning", //microsoft类别中大于等于warn级别的才会输出
      "Microsoft.Hosting.Lifetime": "Information"
    },
    "Console": {
      "LogLevel": {
        "Default": "Debug",
        "alogger": "Warning",
        "DefaultILoggerConsole.OrderService": "Information"
      }
    }
  },
  "AllowedHosts": "*"
}
```
#### 配置数据和容器

```csharp
//从文件中读取配置
IConfigurationBuilder configBuilder = new ConfigurationBuilder();
configBuilder.AddJsonFile("appsettings.json", false, true);
var config = configBuilder.Build();

//构建容器
IServiceCollection serviceCollection = new ServiceCollection();
serviceCollection.AddSingleton<IConfiguration>(p => config);

//配置日志
serviceCollection.AddLogging(builder =>
{
    builder.AddConfiguration(config.GetSection("Logging"));
    builder.AddConsole();
});

IServiceProvider service = serviceCollection.BuildServiceProvider();
```
#### 自定义创建日志对象

```csharp
ILoggerFactory loggerFactory = service.GetService<ILoggerFactory>();

var alogger = loggerFactory.CreateLogger("alogger");
alogger.LogDebug(2001, "ceshi");
alogger.LogInformation("hello");

var ex = new Exception("出错了");
alogger.LogError(ex, ex.Message);
```
#### 通过依赖注入方式来获取日志

创建服务

```csharp
public class OrderService
{
    //好处是不用自己定义名字，默认会将 命令空间.类名 当作日志记录器名字
    private readonly ILogger<OrderService> _logger;

    public OrderService(ILogger<OrderService> logger)
    {
        _logger = logger;
    }

    public void ShowLogger()
    {
        _logger.LogInformation($"show time {DateTime.Now}");
    }
}
```
注入服务并调用
```csharp
// 注入服务
serviceCollection.AddTransient<OrderService>();

//调用
var order = service.GetService<OrderService>();
order.ShowLogger();
```
> 使用自己创建日志对象可以自定义日志名称，而使用依赖注入默认使用的是命名空间.类名作为日志名称，但是都可以对日志级别进行控制。


### 静态类中使用
如果想在静态类中使用logger去输出日志可以采用下面的方法
```csharp
public static class HttpHelper
{
    private static readonly ILogger _logger;

    static HttpHelper()
    {
        _logger = LoggerFactory.Create(builder =>
        {
            builder.AddConsole();
            builder.AddDebug();
        }).CreateLogger("ConfigurationManagerConfig");
    }

    public static Task<string> GetAsync(string url)
    {
        _logger.LogInformation("日志信息" + url);
        return Task.FromResult("success");
    }
}
```
也可以创建一个静态的ServiceProviderHelper(AzrngCommon包中包含)类来存储IServiceProvider，然后其他地方需要服务就通过该类进行获取，比如
```csharp
public static ILogger Logger => ServiceProviderHelper.GetRequiredService<ILoggerFactory>()
            ?.CreateLogger("EFCoreExtensions");
```

## 日志作用域
目的是通过输出的作用域信息，来标识这些日志是同一次请求输出的信息
```json
var logger = service.GetService<ILogger<Program>>();
using (logger.BeginScope("scoped :{scopedId}", Guid.NewGuid().ToString()))
{
    logger.LogInformation("info");
    logger.LogError("error");
    logger.LogWarning("warn");
}
```
appsettings的Logging、Console增加"IncludeScopes": true,//日志作用域

## LoggerMessage
与ILogger记录器扩展方法（例如LogInformation和LogDebug）相比，LoggerMessage具有以下性能优势：

- 记录器扩展方法需要将值类型（例如 int）“装箱”（转换）到 object中。LoggerMessage模式使用带强类型参数的静态Action字段和扩展方法来避免装箱。
- 记录器扩展方法每次写入日志消息时必须分析消息模板（命名的格式字符串）。如果已定义消息，那么LoggerMessage只需分析一次模板即可。
> 参考资料：[https://docs.microsoft.com/zh-cn/dotnet/core/extensions/high-performance-logging](https://docs.microsoft.com/zh-cn/dotnet/core/extensions/high-performance-logging)

```csharp
private static readonly Action<ILogger, string, Exception?> _logWeatherForecast =
    LoggerMessage.Define<string>(
        logLevel: LogLevel.Information,
        eventId: 0,
        formatString: "LoggerMessage: {aa}");

private readonly ILogger<WeatherForecastController> _logger;

public WeatherForecastController(ILogger<WeatherForecastController> logger)
{
    _logger = logger;
}

[HttpGet]
public ActionResult<string> GetInfo(string id)
{
    _logWeatherForecast(_logger, $"GetInfo请求:{id}", null);
    return Ok("success");
}
```
输出信息
```csharp
 LoggerMessage: GetInfo请求:123456
```

## 扩展

### 自定义扩展日志

::: tip

该逻辑摘抄自[痴者工良文档](https://maomi.whuanle.cn/3.1.design_log.html)

:::

添加自定义日志选项配置

```csharp
/// <summary>
/// 自定义日志选项配置
/// </summary>
public class MyLoggerOptions
{
    /// <summary>
    /// 最小日志等级zidng
    /// </summary>
    public LogLevel DefaultLevel { get; set; } = LogLevel.Debug;
}
```

创建自定义日志记录器继承自ILogger

```csharp
/// <summary>
/// 自定义的日志记录器
/// </summary>
public class MyConsoleLogger : ILogger
{
    /// <summary>
    /// 日志名称
    /// </summary>
    private readonly string _name;
    private readonly MyLoggerOptions _options;

    public MyConsoleLogger(string name, MyLoggerOptions options)
    {
        _name = name;
        _options = options;
    }

    public IDisposable BeginScope<TState>(TState state) where TState : notnull => default!;

    /// <summary>
    /// 判断是否启用日志等级
    /// </summary>
    /// <param name="logLevel"></param>
    /// <returns></returns>
    public bool IsEnabled(LogLevel logLevel)
    {
        return logLevel >= _options.DefaultLevel;
    }

    /// <summary>
    /// 记录日志，formatter 由框架提供的字符串格式化器
    /// </summary>
    /// <param name="logLevel"></param>
    /// <param name="eventId"></param>
    /// <param name="state"></param>
    /// <param name="exception"></param>
    /// <param name="formatter"></param>
    /// <typeparam name="TState"></typeparam>
    public void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception exception, Func<TState, Exception, string> formatter)
    {
        if (!IsEnabled(logLevel))
        {
            return;
        }

        switch (logLevel)
        {
            case LogLevel.Critical:
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine($"[{logLevel}] {_name} {formatter(state, exception)} {exception}");
                Console.ResetColor();
                break;
            case LogLevel.Error:
                Console.ForegroundColor = ConsoleColor.DarkRed;
                Console.WriteLine($"[{logLevel}] {_name} {formatter(state, exception)} {exception}");
                Console.ResetColor();
                break;
            default:
                Console.WriteLine($"[{logLevel}] {_name} {formatter(state, exception)} {exception}");
                break;
        }
    }
}
```

创建自定义日志提供器继承自ILoggerProvider

```csharp
/// <summary>
/// 自定义日志提供器
/// </summary>
[ProviderAlias("MyConsole")]
public sealed class MyLoggerProvider : ILoggerProvider
{
    private readonly MyLoggerOptions _options;

    private readonly ConcurrentDictionary<string, MyConsoleLogger> _loggers = new(StringComparer.OrdinalIgnoreCase);

    public MyLoggerProvider(MyLoggerOptions options)
    {
        _options = options;
    }

    public ILogger CreateLogger(string categoryName)
    {
        return _loggers.GetOrAdd(categoryName, name => new MyConsoleLogger(name, _options));
    }

    public void Dispose()
    {
        _loggers.Clear();
    }
}
```

最后编写自定义日志提供器扩展

```csharp
/// <summary>
/// 自定义日志提供器
/// </summary>
/// <param name="builder"></param>
/// <param name="action"></param>
/// <returns></returns>
/// <remarks>参考资料：https://maomi.whuanle.cn/3.1.design_log.html</remarks>
public static ILoggingBuilder AddMyConsoleLogger(this ILoggingBuilder builder, Action<MyLoggerOptions>? action)
{
    MyLoggerOptions options = new();
    action?.Invoke(options);

    builder.AddConfiguration();
    builder.Services.TryAddEnumerable(ServiceDescriptor.Singleton<ILoggerProvider>(new MyLoggerProvider(options)));
    return builder;
}
```

该自定义日志提供器在WebApi服务中使用方法如下

```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Logging.ClearProviders(); // 按需是否要清空之前的提供器
builder.Logging.AddMyConsoleLogger(options =>
{
    options.DefaultLevel = LogLevel.Information;
});
```

如果在控制台中使用，那么使用方法为

```csharp
//从文件中读取配置
IConfigurationBuilder configBuilder = new ConfigurationBuilder();
configBuilder.AddJsonFile("appsettings.json", false, true);
var config = configBuilder.Build();

//构建容器
IServiceCollection serviceCollection = new ServiceCollection();
serviceCollection.AddSingleton<IConfiguration>(p => config);

serviceCollection.AddTransient<OrderService>();

//配置日志
serviceCollection.AddLogging(builder =>
{
    builder.AddConfiguration(config.GetSection("Logging"));
    builder.AddConsole(); //日志输出到控制台
    builder.AddDebug(); //日志输出到调试信息框

    // 添加自定义日志  此处修改
    builder.AddMyConsoleLogger(options =>
    {
        options.DefaultLevel = LogLevel.Debug;
    });
});

IServiceProvider service = serviceCollection.BuildServiceProvider();
var logger = service.GetService<ILogger<Program>>();
using (logger.BeginScope("scoped :{scopedId}", Guid.NewGuid().ToString()))
{
    logger.LogInformation("info");
    logger.LogError("error");
    logger.LogWarning("warn");
}
```

### 保存日志到文件

[https://mp.weixin.qq.com/s/gC8nf66A1rfmrV2n4eUEhQ](https://mp.weixin.qq.com/s/gC8nf66A1rfmrV2n4eUEhQ) | .NET 扩展官方 Logger 实现将日志保存到本地文件

仓库地址：https://github.com/berkerdong/NetEngine

## 注意

- 日志记录优化
> 该东西存在疑问，因为目前没有测试出来这个效果，只是见教程是这么写的

```csharp
//按照位置的方式来注入的  不满足日志条件时候不执行操作
_logger.LogInformation("show time {time}", DateTime.Now);

//这种不论日志级别是否满足都会执行
_logger.LogInformation($"show time {DateTime.Now}");
```

- 日志记录注意事项
   - 避免记录敏感信息，比如密码、密钥
   - 要记录关键的日志信息，不需要对任意数据都进行记录

## 资料
极客时间教程
