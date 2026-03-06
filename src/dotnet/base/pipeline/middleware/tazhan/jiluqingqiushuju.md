---
title: 记录请求数据
lang: zh-CN
date: 2023-04-11
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: jiluqingqiushuju
slug: ao0zhn
docsId: '30053893'
---
```csharp
/// <summary>
/// 记录请求和响应中间件
/// </summary>
public class RequestResponseMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<RequestResponseMiddleware> _logger;

    public RequestResponseMiddleware(RequestDelegate next,
        ILogger<RequestResponseMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // 过滤，只有接口的时候报错才记录请求的参数
        if (context.Request.Path.Value.Contains("api"))
        {
            //_logger.LogInformation($"Header: {JsonConvert.SerializeObject(context.Request.Headers, Formatting.Indented)}");
            //设置可以多次读取
            context.Request.EnableBuffering();
            var sr = new StreamReader(context.Request.Body);
            var data = await sr.ReadToEndAsync().ConfigureAwait(false);
            _logger.LogInformation(
                $"Time:{DateTime.Now:yyyy-MM-dd HH:mm:ss} requestUrl:{context.Request.Path}  Method:{context.Request.Method}  requestBodyData: " +
                data);
            //读取到Body后，重新设置Stream到起始位置
            context.Request.Body.Seek(0, SeekOrigin.Begin);
            _logger.LogInformation($"Host: {context.Request.Host.Host}");
            _logger.LogInformation($"Client IP: {context.Connection.RemoteIpAddress}");

            await _next(context).ConfigureAwait(false);
        }
        else
        {
            await _next(context).ConfigureAwait(false);
        }
    }
}
```
使用中间件，在Configure中使用
```csharp
app.UseMiddleware<RequestResponseMiddleware>();
```
另一个写法
```csharp
namespace Onsolve.ONE.WebApi.Middlewares
{
    public sealed class RequestHandlerMiddleware
    {
        private readonly RequestDelegate next;
        private readonly ILogger logger;

        public RequestHandlerMiddleware(ILogger<RequestHandlerMiddleware> logger, RequestDelegate next)
        {
            this.next = next;
            this.logger = logger;
        }

        public async Task Invoke(HttpContext context)
        {
            logger.LogInformation($"Header: {JsonConvert.SerializeObject(context.Request.Headers, Formatting.Indented)}");

            context.Request.EnableBuffering();
            var body = await new StreamReader(context.Request.Body).ReadToEndAsync();
            logger.LogInformation($"Body: {body}");
            context.Request.Body.Position = 0;

            logger.LogInformation($"Host: {context.Request.Host.Host}");
            logger.LogInformation($"Client IP: {context.Connection.RemoteIpAddress}");
            await next(context);
        }

    }
}
```
