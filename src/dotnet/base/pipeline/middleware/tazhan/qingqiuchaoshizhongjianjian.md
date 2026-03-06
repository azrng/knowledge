---
title: 请求超时中间件
lang: zh-CN
date: 2023-09-17
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: qingqiuchaoshizhongjianjian
slug: afymugn0pw0qh2p2
docsId: '140126579'
---

## 概述
> 该中间件是框架自带的，但是需要.Net8版本

使用RequestTimeoutsMiddleware更方便地实现 request 超时的处理

## 操作

### 基础操作
```csharp
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddRequestTimeouts(options =>
{
    options.DefaultPolicy = new RequestTimeoutPolicy()
    {
        Timeout = TimeSpan.FromSeconds(1)
    };
});
var app = builder.Build();
app.UseRequestTimeouts();
app.Map("/", () => "Hello world");
await app.RunAsync();
```

### 自定义配置超时时间
```csharp
app.MapGet("/timeout", async (CancellationToken cancellationToken) =>
{
    await Task.Delay(TimeSpan.FromSeconds(5), cancellationToken);
    return Results.Content("No timeout!", "text/plain");
});
```

### 响应头处理
默认的 response status code 是 504，我们也可以配置 response 的 statusCode 和 timeout 的 response
```csharp
builder.Services.AddRequestTimeouts(options =>
{
    options.DefaultPolicy = new RequestTimeoutPolicy()
    {
        Timeout = TimeSpan.FromSeconds(1),
        // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/408
        TimeoutStatusCode = 408,
        WriteTimeoutResponse = context =>
        {
            return context.Response.WriteAsync("timeout");
        }
    };
```

## 资料
asp.net 8 中的 RequestTimeoutsMiddleware：[https://mp.weixin.qq.com/s/2_Zlbo1BTMXfq0uSozMH_w](https://mp.weixin.qq.com/s/2_Zlbo1BTMXfq0uSozMH_w)
