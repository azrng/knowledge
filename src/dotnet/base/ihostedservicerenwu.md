---
title: 后台任务
lang: zh-CN
date: 2023-10-14
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - backgroud
---

## 后台任务配置

可以通过配置来操作后台任务的设置

```c#
builder.Services.Configure<HostOptions>(options =>
{
    // 当后台任务抛出异常的时候该如何处理
    options.BackgroundServiceExceptionBehavior = BackgroundServiceExceptionBehavior.StopHost;
});
```

## IHostedService	

注册托管服务的后台任务
```csharp
services.AddHostedService<MyHostedService>();
```
MyHostedService类内容
```csharp
public class MyHostedService : IHostedService
{
    public async Task StartAsync(CancellationToken cancellationToken)
    {
        await Task.Delay(10000, cancellationToken);
        //只执行一次
        Console.WriteLine($"开始执行 {DateTime.Now} ");
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        Console.WriteLine("执行结束");
        return Task.CompletedTask;
    }
}
```

在.Net6中你会发现程序在等待十秒后输出开始执行xxx，然后启动了项目，这个行为是让人很奇怪的操作，但是在.Net8中可以通过下面的配置来让应用程序不等待该任务处理

```c#
builder.Services.Configure<HostOptions>(options =>
{
    options.ServicesStartConcurrently = true;
    options.ServicesStopConcurrently = false;
});
```

### 执行顺序

在.NetCore3.x/.NET5中，执行顺序为先执行ConfigureServices=>Build=>HostService=>Configure ,但是在 .NET 6 中，随着最小托管 API 的引入，情况再次发生了轻微变化，在创建和启动方式方面存在一些差异，HostServices服务在配置中间件和端点后才启动
```csharp
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 注册服务
builder.Services.AddHostedService<Sample1HostService>();

var app = builder.Build();
Console.WriteLine("build完成");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();

app.MapControllers();

Console.WriteLine("run之前");

app.Run(); // Sample1HostService在这里启动
```

## BackgroundService

简单示例

```csharp
public class MyBackgroundService : BackgroundService
{
    private readonly ILogger<MyBackgroundService> _logger;

    public MyBackgroundService(ILogger<MyBackgroundService> logger)
    {
        _logger = logger;
    }

    public override Task StopAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("MyBackgroundService is stopped");
        return Task.CompletedTask;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            //xxx 逻辑处理
            _logger.LogInformation($"MyBackgroundService is working. {DateTime.Now}");
            await Task.Delay(TimeSpan.FromSeconds(2), stoppingToken);
        }
    }
}
```
我们的这个服务继承了BackgroundService，就一定要实现里面的ExecuteAsync，至于StartAsync和StopAsync等方法可以选择性的重写。我们ExecuteAsync在里面就是输出了一下日志，然后休眠在配置文件中指定的秒数。这个任务可以说是最简单的例子了，其中还用到了依赖注入，然后我们还需要注册该服务

```csharp
builder.Services.AddHostedService<MyBackgroundService>();
```

## IHostedLifecycleService
.NET 8 中引入了一个 IHostedLifecycleService 作为 IHostedService 的补充，我们在服务开始、结束之前和之后添加自定义的处理逻辑

:::tip

可以进行更精细的任务控制

:::

[https://mp.weixin.qq.com/s/IA7RgBEIOYCIrwRuKB24tw](https://mp.weixin.qq.com/s/IA7RgBEIOYCIrwRuKB24tw) | .NET 8 中的 IHostedLifecycleService


## 实践

### PeriodicTimer定时

后台任务搭配PeriodicTimer实现每隔一段时间处理一次

```csharp
public class JobDaemonHostedService : BackgroundService
{
    private readonly IServiceScopeFactory _factory;
    private readonly ILogger<JobDaemonHostedService> _logger;

    public JobDaemonHostedService(ILogger<JobDaemonHostedService> logger, IServiceScopeFactory factory)
    {
        _logger = logger;
        _factory = factory;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        try
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                // 每十秒处理一次
                using PeriodicTimer timer = new(TimeSpan.FromMinutes(10));
                while (await timer.WaitForNextTickAsync(stoppingToken))
                {
                    await WorkTaskAsync();
                }
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"定时脚本同步异常  message:{ex.Message}");
        }
    }

    private async Task WorkTaskAsync()
    {
        try
        {
            _logger.LogInformation($"转发推送任务开始 时间:{DateTime.Now}");
            using var scope = _factory.CreateScope();
            // var emailService = scope.ServiceProvider.GetRequiredService<IEmailService>();
            // await emailService.TranspondEmailToQiYeRobot();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"转发推送任务执行失败  message:{ex.Message}");
        }
        finally
        {
            _logger.LogInformation($"转发推送任务结果 时间:{DateTime.Now}");
        }
    }
}
```

### Time定时处理

搭配Timer来实现定时跑的功能

```c#
public class TimedHostedService : IHostedService, IDisposable
{
    private int executionCount = 0;
    private readonly ILogger<TimedHostedService> _logger;
    private Timer? _timer = null;

    public TimedHostedService(ILogger<TimedHostedService> logger)
    {
        _logger = logger;
    }

    public Task StartAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Timed Hosted Service running.");

        _timer = new Timer(DoWork, null, TimeSpan.Zero,
            TimeSpan.FromSeconds(5));

        return Task.CompletedTask;
    }

    private void DoWork(object? state)
    {
        var count = Interlocked.Increment(ref executionCount);

        _logger.LogInformation(
            "Timed Hosted Service is working. Count: {Count}", count);
    }

    public Task StopAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Timed Hosted Service is stopping.");

        _timer?.Change(Timeout.Infinite, 0);

        return Task.CompletedTask;
    }

    public void Dispose()
    {
        _timer?.Dispose();
    }
}
```

## 资料

使用托管服务实现后台任务：[https://learn.microsoft.com/zh-cn/aspnet/core/fundamentals/host/hosted-services?view=aspnetcore-6.0&tabs=visual-studio](https://learn.microsoft.com/zh-cn/aspnet/core/fundamentals/host/hosted-services?view=aspnetcore-6.0&tabs=visual-studio)
