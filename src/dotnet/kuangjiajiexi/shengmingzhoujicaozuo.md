---
title: 生命周期操作
lang: zh-CN
date: 2023-10-14
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: shengmingzhoujicaozuo
slug: mp2sux
docsId: '53815481'
---

## 获取启动的端口
使用场景：服务注册
> 方案来源自：微信公众号【MY IO】


### Srart启动获取
正常我们是使用WebApplication.Run方法进行启动的，但是我们现在为了获取启动后的端口，我们可以不用Run方法启动，而是等待Start完成：
```csharp
//注释
//app.Run();

await app.StartAsync();
Console.WriteLine(app.Urls.First());
await app.WaitForShutdownAsync();

-- 输出信息
http://localhost:5259
```
> 这是.Net6的才支持的实现方式。

查看源码后底层就是以下代码，那么就可以在其他版本中也使用了
```csharp
public static async Task Main(string[] args)
{
    var host = CreateHostBuilder(args).Build();
    await host.StartAsync();

    var server = host.Services.GetService(typeof(IServer)) as IServer;     
    Console.WriteLine(server.Features.Get<IServerAddressesFeature>().Addresses.First());

    await host.WaitForShutdownAsync();
}
```

### BackgroundService中获取

#### .NetCore3.x/.NET5
考虑到在.NetCore3.x/.NET5中HostService执行的比较早，这个时候程序可能还未启动，所以需要使用下面的方式等待

方案一：循环判断是否启动成功
```csharp
public class HostAndGetStartPortService : BackgroundService
{
    private readonly IServiceProvider _services;
    private volatile bool _ready;
    private readonly ILogger<HostAndGetStartPortService> _logger;
    public HostAndGetStartPortService(IServiceProvider services,
        IHostApplicationLifetime lifetime,
        ILogger<HostAndGetStartPortService> logger)
    {
        _services = services;
        lifetime.ApplicationStarted.Register(() => _ready = true); //如果启动，在这里更新
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!_ready)
        {
            _logger.LogInformation("程序还未启动 等待ing");
            // 如果app没有启动，则等待
            await Task.Delay(1_000);
        }
        _logger.LogInformation("程序启动成功 无需继续等待");
        PrintAddresses(_services);
        await DoSomethingAsync();
    }
    public async Task DoSomethingAsync()
    {
        await Console.Out.WriteLineAsync("DoSomethingAsync");
        await Task.Delay(1000);
    }

    /// <summary>
    /// 打印地址
    /// </summary>
    /// <param name="services"></param>
    public void PrintAddresses(IServiceProvider services)
    {
        _logger.LogInformation("Checking addresses...");
        var server = services.GetRequiredService<IServer>();
        var addressFeature = server.Features.Get<IServerAddressesFeature>();
        foreach (var address in addressFeature.Addresses)
        {
            _logger.LogInformation("Listing on address: " + address);
        }
    }
}
```

方案二：这里面使用到了一个信号灯SemaphoreSlim，在ExecuteAsync方法中等待信号灯，在启动后释放信号灯
```csharp
public class HostAndGetStartPortService : BackgroundService
{
    private readonly IServiceProvider _services;
    private string _url;// 地址
    private readonly ILogger<HostAndGetStartPortService> _logger;

    //信号灯
    private static readonly SemaphoreSlim _semaphoreSlim = new SemaphoreSlim(0, 1);

    public HostAndGetStartPortService(IServiceProvider services,
        IHostApplicationLifetime lifetime,
        ILogger<HostAndGetStartPortService> logger)
    {
        _services = services;
        lifetime.ApplicationStarted.Register(OnAppStarted);
        _logger = logger;
    }

    public void OnAppStarted()
    {
        _logger.LogInformation("启动");
        var server = _services.GetService<IServer>();
        _url = server.Features.Get<IServerAddressesFeature>()!.Addresses.First();
        _semaphoreSlim.Release();
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("开始等待启动");
        await _semaphoreSlim.WaitAsync();

        _logger.LogInformation("BackgroundService 启动成功");
        _logger.LogInformation(_url);// 输出启动地址

        await Task.CompletedTask;
    }
}
```

方案三：使用TaskCompletionSource来处理
这里还考虑了假如程序存在问题，导致系统永远无法启动，令牌一直未触发的问题。在下面示例中通过使用stoppingToken传递给ExecuteAsync和另一个TaskCompletionSource来解决此问题
```csharp
public class TestHostedService: BackgroundService
{
    private readonly IServiceProvider _services;
    private readonly IHostApplicationLifetime _lifetime;
    private readonly TaskCompletionSource _source = new();
    public TestHostedService(IServiceProvider services, IHostApplicationLifetime lifetime)
    {
        _services = services;
        _lifetime = lifetime;

        _lifetime.ApplicationStarted.Register(() => _source.SetResult());
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        // 建立一个 stoppingToken的 TaskCompletionSource
        var tcs = new TaskCompletionSource();
        stoppingToken.Register(() => tcs.SetResult());

        // 等待任意一个源完成
        await Task.WhenAny(tcs.Task, _source.Task).ConfigureAwait(false);

        // 如果是停止，则返回
        if (stoppingToken.IsCancellationRequested)
        {
            return;
        }

        // 否则, App已经准备好了，干吧，兄弟。
        PrintAddresses(_services);
        await DoSomethingAsync();
    }
}

// 优化后：将其提取到一个方便的辅助方法中
public class TestHostedService: BackgroundService
{
    private readonly IServiceProvider _services;
    private readonly IHostApplicationLifetime _lifetime;
    public TestHostedService(IServiceProvider services, IHostApplicationLifetime lifetime)
    {
        _services = services;
        _lifetime = lifetime;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        if (!await WaitForAppStartup(_lifetime, stoppingToken))
        {
            return;
        }

        PrintAddresses(_services);
        await DoSomethingAsync();
    }

    static async Task<bool> WaitForAppStartup(IHostApplicationLifetime lifetime, CancellationToken stoppingToken)
    {
        var startedSource = new TaskCompletionSource();
        var cancelledSource = new TaskCompletionSource();

        using var reg1 = lifetime.ApplicationStarted.Register(() => startedSource.SetResult());
        using var reg2 = stoppingToken.Register(() => cancelledSource.SetResult());

        Task completedTask = await Task.WhenAny(
            startedSource.Task,
            cancelledSource.Task).ConfigureAwait(false);

        // If the completed tasks was the "app started" task, return true, otherwise false
        return completedTask == startedSource.Task;
    }
}
```
> 来源：[https://mp.weixin.qq.com/s/-l7sCZLvcJou14kxpRwubg](https://mp.weixin.qq.com/s/-l7sCZLvcJou14kxpRwubg)


最后记得要注册HostService服务
```csharp
services.AddHostedService<HostAndGetStartPortService>();
```

#### .NET6+
在.Net6+版本中是Program中app.Run()的时候执行HostService的，所以还需要模仿老版本的方案去处理

在app.Run的源码中调用的是
```csharp
await app.StartAsync();
await app.WaitForShutdownAsync();
```
那么我们创建一个BackgroundService
```csharp
public class HostAndGetStartPortService : BackgroundService
{
    private readonly IServiceProvider _services;
    private readonly ILogger<HostAndGetStartPortService> _logger;

    public HostAndGetStartPortService(IServiceProvider services,
        ILogger<HostAndGetStartPortService> logger)
    {
        _services = services;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("BackgroundService 启动成功");
        var server = _services.GetService<IServer>();
        // 这时候还未启动
        // var _url = server.Features.Get<IServerAddressesFeature>()!.Addresses.First();
        //_logger.LogInformation(_url);// 输出启动地址

        await Task.CompletedTask;
    }
}
```
然后注入并添加启动注释
```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddHostedService<HostAndGetStartPortService>();

var app = builder.Build();
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseAuthorization();
app.MapControllers();
Console.WriteLine("Configure 结束");
await app.StartAsync();
Console.WriteLine("Start 启动");
Console.WriteLine("start" + app.Urls.First());
await app.WaitForShutdownAsync();
Console.WriteLine("WaitForShutdown");

// 输出结果如下
Configure 结束
info: WebApplication2.HostAndGetStartPortService[0]
      BackgroundService 启动成功                   
info: Microsoft.Hosting.Lifetime[14]         
      Now listening on: http://localhost:5082
info: Microsoft.Hosting.Lifetime[0]                              
      Application started. Press Ctrl+C to shut down.            
info: Microsoft.Hosting.Lifetime[0]                              
      Hosting environment: Development                           
info: Microsoft.Hosting.Lifetime[0]                              
      Content root path: D:\Test\WebApplication1\WebApplication1\
Start 启动                                                       
starthttp://localhost:5082  
```
在BackgroundService服务启动的时候还获取不到地址，所以需要使用上面的方法处理

## IApplicationLifetime
注意：高版本该类已经被弃用

IApplicationLifetime用来实现 ASP.NET Core 的生命周期钩子，我们可以在 ASP.NET Core 停止时做一些优雅的操作，如资源的清理等。它有如下定义：
```csharp
public interface IApplicationLifetime
{
    CancellationToken ApplicationStarted { get; }

    CancellationToken ApplicationStopping { get; }

    CancellationToken ApplicationStopped { get; }

    void StopApplication();
}
```
IApplicationLifetime已被 ASP.NET Core 注册到 DI 系统中，我们使用的时候，只需要注入即可。它有三个CancellationToken类型的属性，是异步方法终止执行的信号，表示 ASP.NET Core 生命周期的三个阶段：启动，开始停止，已停止。
```csharp
public void Configure(IApplicationBuilder app, IApplicationLifetime appLifetime)
{
    appLifetime.ApplicationStarted.Register(() => Console.WriteLine("Started"));
    appLifetime.ApplicationStopping.Register(() => Console.WriteLine("Stopping"));
    appLifetime.ApplicationStopped.Register(() =>
    {
        Console.WriteLine("Stopped");
        Console.ReadKey();
    });

    app.Use(next =>
    {
        return async (context) =>
        {
            await context.Response.WriteAsync("Hello ASP.NET Core!");
            appLifetime.StopApplication();
        };
    });
}
```
执行结果如下：
![image.png](/common/1632197193604-9676a5f0-05ce-40ed-8e4a-02048e0730c5.png)

## IHostApplicationLifetime
在稍微高一点的版本中IApplicationLifetime已经被弃用，这个时候可以使用IHostApplicationLifetime来操作，此接口包括 3 个属性，可以通知您有关应用程序生命周期的各个阶段，以及一种触发应用程序关闭的方法。
```csharp
public interface IHostApplicationLifetime
{
    CancellationToken ApplicationStarted { get; }
    CancellationToken ApplicationStopping { get; }
    CancellationToken ApplicationStopped { get; }
    void StopApplication();
}
```
可以使用下面的方式去使用
```csharp
var app = builder.Build();

PrintMessage(app);

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();

app.MapControllers();

app.Run();

void PrintMessage(IApplicationBuilder builder)
{
    var scope = builder.ApplicationServices.CreateScope();
    var lifetime = scope.ServiceProvider.GetRequiredService<IHostApplicationLifetime>();
    lifetime.ApplicationStarted.Register(() => Console.WriteLine("App has started!"));

    // 当你在调试控制台输入Ctrl+C或者调用代码关闭的时候会触发停止事件
    lifetime.ApplicationStopped.Register(() => Console.WriteLine("App has stopped!"));
}
```
或者也可以通过构造函数注入IHostApplicationLifetime

### 关闭程序
如何实现通过调用接口关闭应用程序
```csharp
[HttpGet]
public void StopApplication([FromServices] IHostApplicationLifetime lifetime)
{
    lifetime.StopApplication();
}
```
通过注入IHostApplicationLifetime然后执行StopApplication来停止应用程序。

## 设置启动地址
可以通过代码WebApplication.Urls.Add 方法添加启动地址
```csharp
app.Urls.Add("http://localhost:8080");
app.Urls.Add("http://localhost:5259");
app.Run();
```
如果上面自定义了以后，会覆盖launchSettings里面的配置。

## 获取本机IP
```csharp
/// <summary>
/// 获取本地Ip地址
/// </summary>
/// <returns></returns>
static string GetLocalIp()
{
    var addressList = System.Net.Dns.GetHostEntry(System.Net.Dns.GetHostName()).AddressList;
    var ips = addressList.Where(address => address.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork)
        .Select(address => address.ToString()).ToArray();
    if (ips.Length == 1)
    {
        return ips[0];
    }
    return ips.Where(address => !address.EndsWith(".1")).FirstOrDefault() ?? ips.FirstOrDefault();
}
```

## 获取环境信息
```csharp
[ApiController]
[Route("[controller]")]
public class WeatherForecastController : ControllerBase
{
    private readonly IWebHostEnvironment _environment;

    public WeatherForecastController(IWebHostEnvironment environment)
    {
        _environment=environment;
    }

    [HttpGet("environment")]
    public string GetEnvironment()
    {
        return $"EnvironmentName:{_environment.EnvironmentName} ApplicationName:{_environment.ApplicationName}";
    }
}
```

## 资料
运行原理解析：[https://www.cnblogs.com/RainingNight/p/hosting-configure-in-asp-net-core.html](https://www.cnblogs.com/RainingNight/p/hosting-configure-in-asp-net-core.html)
