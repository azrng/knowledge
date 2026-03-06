---
title: 过滤器实现-基于IP请求限制
lang: zh-CN
date: 2022-08-14
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: guolvqishixian-jiyuipqingqiuxianzhi
slug: pbtvg7
docsId: '30622201'
---

## 场景一

### 使用场景
限制每一个ip客户端对于指定的接口每次请求多少次之后需要停止指定的时间缓冲，防止恶意攻击。

### 操作 
增加请求限制过滤器
```csharp
/// <summary>
/// 根据ip接口请求限制(请求次数达到指定次数的时候，会停止访问多少秒)
/// </summary>
[AttributeUsage(AttributeTargets.Method)]
public class RequestLimitFilter : ActionFilterAttribute
{
    private string Name { get; }
    private int LimitRequestNum { get; }
    private int Seconds { get; }

    private MemoryCache Cache { get; } = new MemoryCache(new MemoryCacheOptions());

    /// <summary>
    /// 请求限制属性
    /// </summary>
    /// <param name="name">key</param>
    /// <param name="limitRequestNum">限制的次数</param>
    /// <param name="seconds">限制时间</param>
    public RequestLimitFilter(string name, int limitRequestNum = 5, int seconds = 10)
    {
        Name = name;
        LimitRequestNum = limitRequestNum;
        Seconds = seconds;
    }

    public override void OnActionExecuting(ActionExecutingContext context)
    {
        var ipAddress = context.HttpContext.Request.HttpContext.Connection.RemoteIpAddress;
        var key = $"{Name}-{ipAddress}";

        var prevReqCount = Cache.Get<int>(key);
        if (prevReqCount >= LimitRequestNum)
        {
            context.Result = new ContentResult
            {
                Content = $"Request limit is exceeded. Try again in {Seconds} seconds.",
            };
            context.HttpContext.Response.StatusCode = (int)HttpStatusCode.TooManyRequests;
        }
        else
        {
            Cache.Set(key, (prevReqCount + 1), TimeSpan.FromSeconds(Seconds));
        }
    }
}
```
使用的时候只需要在接口头部增加
```csharp
[HttpGet]
[RequestLimit("DataGet", 5, 30)]
public IEnumerable<WeatherForecast> Get()
{
    ...
}
```
这就代表这该接口同一个客户端请求5次后需要停止访问30秒后才能继续请求。

## 场景二

### 使用场景
对于指定的ip限制，多少秒内只能请求多少次。

## 多久请求一次
设置多久只能请求一次，仅用于学习，实际场景中应该没有会这么使用的情况。

示例代码
```csharp
/// <summary>
/// 设置多久可以请求一次(设置每秒只能访问一次)
/// </summary>
public class RequestLimit3Filter : IAsyncActionFilter
{
    private MemoryCache Cache { get; } = new MemoryCache(new MemoryCacheOptions());
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var ip = context.HttpContext.Connection.RemoteIpAddress.ToString();
        var cacheKey = $"lastvisittick:{ip}";

        var lastVisit = Cache.Get<long?>(cacheKey);
        if (lastVisit==null || Environment.TickCount64-lastVisit>1000)
        {
            //避免长期不访问的用户，占据缓存内存
            Cache.Set(cacheKey, Environment.TickCount64, TimeSpan.FromSeconds(10));
            await next();
        }
        else
        {
            context.Result=new ObjectResult("访问太频繁")
            {
                StatusCode=429
            };
        }
    }
}
```
使用代码
```csharp
[HttpGet]
[RequestLimit3Filter]
public GetPatientResult GetPatient()
{
    return new GetPatientResult().GetDetails();
}
```

## 总结
通过借助内存缓存来存储，实现请求限制。
