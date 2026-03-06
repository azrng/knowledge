---
title: DotNetRateLimiter
lang: zh-CN
date: 2023-08-06
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: dotnetratelimiter
slug: zkhdxsm75nfc7wtu
docsId: '135422573'
---

## 概述
在构建 .NET API 时，您可能希望控制用户请求的频率以防止恶意攻击。换句话说，您可能希望限制短时间内来自某个 IP 地址的请求数量，以减轻拒绝服务攻击，这也称为限流。有很多 Nuget 包使用中间件来处理用户请求，但中间件存在一个问题，那就是它们会影响所有传入请求！但是，如果您只想控制一些关键的接口，有没有简单的方案， 当然有，使用 DotNetRateLimiter 就可以实现！

仓库地址：[https://github.com/sa-es-ir/DotNet.RateLimit](https://github.com/sa-es-ir/DotNet.RateLimit)

## 操作

### 基础使用

1. 1. 使用 Nuget 安装 DotNetRateLimiter
2. 2. 修改 Program.cs, 添加限流服务，如下
```
using DotNet.RateLimiter;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRateLimitService(builder.Configuration);
```
现在我们可以直接在接口的方法上，使用限流，通过添加 RateLimit 特性，如下
```
[HttpGet]
[RateLimit(PeriodInSec = 60, Limit = 3)]
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
```
RateLimit(PeriodInSec = 60, Limit = 3) 这个接口方法每分钟只允许 3 个请求， 如果调用 api 超过 3 次，就会收到 429（请求过多）, 我们可以在 swagger 中进行测试。

还可以搭配路由参数一起使用：
```
[HttpGet("by-route/{id}")]
[RateLimit(PeriodInSec = 60, Limit = 3, RouteParams = "id")]
public IEnumerable<WeatherForecast> Get(int id)
{
   ....
}
```
直接在控制器上进行使用：
```
[RateLimit(Limit = 3, PeriodInSec = 60, Scope = RateLimitScope.Controller)]
public class RateLimitOnAllController : ControllerBase
{ .... }
```
如果您希望自定义错误响应内容，返回更友好的提示， 可以在 appsetting.json 中进行配置，如下
```
"RateLimitOption": {
    "EnableRateLimit": true, 
    "HttpStatusCode": 429, /
    "ErrorMessage": "请求过多", 
    "IpHeaderName": "X-Forwarded-For"  
    "RedisConnection": "127.0.0.1:6379",  
    "IpWhiteList": ["::1"], 
    "ClientIdentifier": "X-Client-Id"    
  }
```
RateLimit 默认使用内存缓存，并且支持配置 Redis 连接， 这样可以对分布式应用进行限流。

## 参考资料
[https://mp.weixin.qq.com/s/SljGcSKdIrBJKO2u32XNOA](https://mp.weixin.qq.com/s/SljGcSKdIrBJKO2u32XNOA) | 简单好用！.NET 基于 ActionFilters 的限流库！
