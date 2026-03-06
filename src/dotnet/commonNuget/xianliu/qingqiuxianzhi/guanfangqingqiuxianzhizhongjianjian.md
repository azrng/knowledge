---
title: 官方请求限制中间件
lang: zh-CN
date: 2023-07-27
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: guanfangqingqiuxianzhizhongjianjian
slug: agyal79esuimgxg5
docsId: '105105156'
---

## 概述
微软在.Net7中提供了官方的限流中间件

## 注册限流策略
因为是大于等于.Net7版本内置的，所以在这些版本不需要安装nuget包，然后直接可以使用AddRateLimiter扩展方法来注册限流服务并添加限流策略，然后使用UseRateLimiter来启用限流中间件
```csharp
builder.Services.AddRateLimiter(limiterOptions =>
{
    // 配置限流策略
});

app.UseRateLimiter();

app.MapGet("LimitTest", async () =>
{
    await Task.Delay(TimeSpan.FromSeconds(1));
    return Results.Ok($"Limiter");
}).RequireRateLimiting("my_policy");
```
提供了四种常用的限流算法：

- FixedWindowLimiter：固定窗口限流器
- SlidingWindowLimiter：滑动窗口限流器
- TokenBucketLimiter：令牌桶限流器
- ConcurrencyLimiter：并发限流器

### FixedWindowLimiter
优缺点
优点：实现简单、占用内存低
缺点：1、当请求流量达到阈值的时候，请求会被切断，不能平滑处理突发请求；2、如果在前一个窗口最后一点时间一下子来了好多个请求，当前窗口的开始一下子来了很多请求，会导致在指定时间内处理超过阈值的请求。

注入示例
```csharp
builder.Services.AddRateLimiter(limiterOptions =>
{
    // 添加固定窗口限流策略，并指定策略名，含义：在窗口大小为60s内，每个窗口的范围内，最多能请求4次
    limiterOptions.AddFixedWindowLimiter(policyName: "fixed", fixedOptions =>
    {
        // 窗口阈值，最多允许请求的个数
        fixedOptions.PermitLimit = 4;
        // 窗口大小
        fixedOptions.Window = TimeSpan.FromSeconds(60);
        // 当请求数达到最大的时候，后续请求会进入排队。这里设置排队队列的大小
        fixedOptions.QueueLimit = 2;
        // 排队请求的处理顺序，这里设置有限处理先来的请求
        fixedOptions.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        // 指示新窗口是否自定重置请求限制
        fixedOptions.AutoReplenishment = true;
    });
});
```

## 应用限流策略

### RequireRateLimiting & DisableRateLimiting
可以一次性为所有 controller 应用限流策略
```csharp
app.MapControllers().RequireRateLimiting("fixed");
```
也可以为指定路由应用限流策略
```csharp
app.MapGet("LimitTest", () =>{ }).RequireRateLimiting("fixed");
```
实质上，RequireRateLimiting和DisableRateLimiting是通过向终结点元数据中EnableRateLimiting和DisableRateLimiting两个特性来实现的。
```csharp
public static class RateLimiterEndpointConventionBuilderExtensions
{
    public static TBuilder RequireRateLimiting<TBuilder>(this TBuilder builder, string policyName) where TBuilder : IEndpointConventionBuilder
    {
        builder.Add(endpointBuilder => endpointBuilder.Metadata.Add(new EnableRateLimitingAttribute(policyName)));
        return builder;
    }

    public static TBuilder RequireRateLimiting<TBuilder, TPartitionKey>(this TBuilder builder, IRateLimiterPolicy<TPartitionKey> policy) where TBuilder : IEndpointConventionBuilder
    {
        builder.Add(endpointBuilder =>
                    {
            endpointBuilder.Metadata.Add(new EnableRateLimitingAttribute(new 
                                                                         DefaultRateLimiterPolicy(
                    RateLimiterOptions.ConvertPartitioner<TPartitionKey>(null, policy.GetPartition), policy.OnRejected)));
        });
        return builder;
    }

    public static TBuilder DisableRateLimiting<TBuilder>(this TBuilder builder) where TBuilder : IEndpointConventionBuilder
    {
        builder.Add(endpointBuilder => endpointBuilder.Metadata.Add(DisableRateLimitingAttribute.Instance));
        return builder;
    }
}
```

### EnableRateLimitingAttribute & DisableRateLimitingAttribute
在Controller层面，我们可以方便的使用特性来标注使用或禁用限流策略。这两个特性可以标注在Controller类上，也可以标注在类的方法上。
但需要注意的时，如果前面使用了RequireRateLimiting或DisableRateLimiting扩展方法，由于它们在元数据中添加特性比直接使用特性标注要晚，所以它们的优先级很高，会覆盖掉这里使用的策略。建议不要针对所有 Controller 使用RequireRateLimiting或DisableRateLimiting。
下面是一个应用示例：
```csharp
[EnableRateLimiting("fixed")]   // 针对整个 Controller 使用限流策略 fixed
public class WeatherForecastController : ControllerBase
{
    // 会使用 Controller 类上标注的 fixed 限流策略
    [HttpGet(Name = "GetWeatherForecast")]
    public string Get() => "Get";
    
    [HttpGet("Hello")]
    [EnableRateLimiting("my_policy")]   // 会使用 my_policy 限流策略，而不会使用 fixed
    public string Hello() => "Hello";
    
    [HttpGet("disable")]
    [DisableRateLimiting]   // 禁用任何限流策略
    public string Disable() => "Disable";
}
```

## 参考资料
[https://www.cnblogs.com/xiaoxiaotank/p/17560251.html](https://www.cnblogs.com/xiaoxiaotank/p/17560251.html) | 理解ASP.NET Core - 限流（Rate Limiting） - xiaoxiaotank - 博客园

## 资料

使用原生的接口限流功能：[https://mp.weixin.qq.com/s/HGNkb9-ir_IcdnPBqASDyA](https://mp.weixin.qq.com/s/HGNkb9-ir_IcdnPBqASDyA)
