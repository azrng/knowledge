---
title: 服务器缓存OutputCache
lang: zh-CN
date: 2023-08-20
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: fuwuqihuancunoutputcache
slug: nkrt9z3lwn0iuziv
docsId: '136801020'
---

## 概述
该方案是在.Net7以及之上版本才有的一种缓存方式

## 操作

### 内存缓存
可以直接注册输出缓存服务，以及使用服务等
```csharp
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();

// 注册
builder.Services.AddOutputCache();

var app = builder.Build();


// 使用过
app.UseOutputCache();

app.UseAuthorization();

app.MapControllers();

app.Run();

```

然后在需要进行缓存的接口上标注特性
```csharp
[ApiController]
[Route("[controller]")]
public class WeatherForecastController : ControllerBase
{
    private static readonly string[] Summaries = new[]
    {
        "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
    };

    private readonly ILogger<WeatherForecastController> _logger;

    public WeatherForecastController(ILogger<WeatherForecastController> logger)
    {
        _logger = logger;
    }

    [HttpGet]
    [OutputCache(Duration = 5)] // Duration单位是秒
    public IEnumerable<WeatherForecast> Get()
    {
        return Enumerable.Range(1, 5).Select(index => new WeatherForecast
        {
            Date = DateTime.Now.AddDays(index),
            TemperatureC = Random.Shared.Next(-20, 55),
            Summary = Summaries[Random.Shared.Next(Summaries.Length)]
        })
        .ToArray();
    }
}
```

### 分布式缓存
> 需要.net8及以上版本

借助Microsoft.Extensions.Caching.StackExchangeRedis包实现输出缓存的分布式方案。

首先先安装nuget包
```csharp
<PackageReference Include="Microsoft.Extensions.Caching.StackExchangeRedis" Version="8.0.0-preview.7.23375.9" />
```
在内存缓存配置的基础上增加redis信息配置
```csharp
using StackExchange.Redis;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 注册
builder.Services.AddOutputCache()
    .AddStackExchangeRedisOutputCache(x =>
    {
        // .ConnectionMultiplexerFactory = async () => await ConnectionMultiplexer.ConnectAsync("localhost:6379");
        x.InstanceName = "test";
        x.Configuration = "localhost:6379,password=123456";
    });

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// 使用
app.UseOutputCache();

app.UseAuthorization();

app.MapControllers();

app.Run();
```

然后就是在需要增加输出缓存的上面配置OutputCache特性
```csharp
[ApiController]
[Route("[controller]")]
public class WeatherForecastController : ControllerBase
{
    private static readonly string[] Summaries = new[]
    {
        "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
    };

    private readonly ILogger<WeatherForecastController> _logger;

    public WeatherForecastController(ILogger<WeatherForecastController> logger)
    {
        _logger = logger;
    }

    [HttpGet]
    [OutputCache(Duration = 5)] // Duration单位是秒
    public IEnumerable<WeatherForecast> Get()
    {
        return Enumerable.Range(1, 5).Select(index => new WeatherForecast
        {
            Date = DateTime.Now.AddDays(index),
            TemperatureC = Random.Shared.Next(-20, 55),
            Summary = Summaries[Random.Shared.Next(Summaries.Length)]
        })
        .ToArray();
    }
}
```
经过一次访问后，我们可以通过可视化redis客户端查看到redis中已经存储了内容

对应的redis的key为：test__MSOCV_GETHTTPLOCALHOST:5000/WEATHERFORECASTQ*=，内容如下
```csharp
��������Content-Typeapplication/json; charset=utf-8DateSun, 20 Aug 2023 06:36:07 GMT�[{"date":"2023-08-21T14:36:07.6551731+08:00","temperatureC":-7,"temperatureF":20,"summary":"Freezing"},{"date":"2023-08-22T14:36:07.6556008+08:00","temperatureC":-7,"temperatureF":20,"summary":"Freezing"},{"date":"2023-08-23T14:36:07.655602+08:00","temperatureC":34,"temperatureF":93,"summary":"Hot"},{"date":"2023-08-24T14:36:07.6556021+08:00","temperatureC":3,"temperatureF":37,"summary":"Sweltering"},{"date":"2023-08-25T14:36:07.6556023+08:00","temperatureC":12,"temperatureF":53,"summary":"Balmy"}]
```


### 其他操作

#### 让指定标签的缓存失效
有些时候我们需要让指定标签的缓存失效，所以首先我们需要给输出缓存接口设置对应的标签
```csharp
[OutputCache(Duration = 50, Tags = new string[] { "weather" })]
```

然后我们可以编写一个让缓存失效的接口，通过注入IOutputCacheStore
```csharp
/// <summary>
/// 让对应标签缓存失效
/// </summary>
/// <param name="store"></param>
/// <returns></returns>
[HttpGet]
public async Task Inval([FromServices] IOutputCacheStore store)
{
    await store.EvictByTagAsync("weather", CancellationToken.None);
}
```
这样子我们就可以实现让部分接口对应的缓存内容失效了
