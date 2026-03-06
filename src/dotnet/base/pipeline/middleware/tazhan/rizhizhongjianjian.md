---
title: 日志中间件
lang: zh-CN
date: 2023-04-11
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: rizhizhongjianjian
slug: gortb4
docsId: '30054010'
---
创建不记录日志的特性
```csharp
/// <summary>
/// 不记录日志特性
/// </summary>
public class NoLogsAttriteFilter : Attribute
{
}
```
创建中间件
```csharp
/// <summary>
/// 带传入参数的中间件
/// </summary>
public class LogsMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<LogsMiddleware> _logger;

    public LogsMiddleware(RequestDelegate next, ILogger<LogsMiddleware> logger)
    {
        _next = next;
        _logger=logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var endpoint = context.Features.Get<IEndpointFeature>()?.Endpoint;
        if (endpoint == null)
        {
            await _next(context);
            return;
        }

        var attruibutes = endpoint.Metadata.OfType<NoLogsAttriteFilter>();
        if (attruibutes==null || !attruibutes.Any())
        {
            _logger.LogInformation($" url :{context.Request.Path},访问时间：{DateTime.Now}");
        }
        await _next(context);
    }
}
```
封装中间件
```csharp
public static class MiddlewareExtensions
{
    public static IApplicationBuilder UseLogMiddleware(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<LogsMiddleware>();
    }
}
```
引用中间件
```csharp
app.UseLogMiddleware();
```
当有接口不需要记录日志的时候才标注上面的不记录日志特性，其他的不用处理直接就记录日志。
