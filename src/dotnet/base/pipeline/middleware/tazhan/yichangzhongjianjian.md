---
title: 异常中间件
lang: zh-CN
date: 2023-09-14
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: yichangzhongjianjian
slug: ybg0gz
docsId: '30054036'
---
一些开发者在action中使用try-catch代码块，这种方法明显没有任何问题，但是我们希望action尽量保持简洁。因为此我们从action中删除try-catch，并将其放在一个集中的地方会是一个更好的方式，netcore中为我们提供了一种处理全局异常的方式，只需要稍加修改，就可以使用内置且完善的中间件。通过创建自定义的中间件来实现我们的自定义异常处理。
```csharp
/// <summary>
/// 异常中间件
/// </summary>
public class CustomExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<CustomExceptionMiddleware> _logger;

    public CustomExceptionMiddleware(RequestDelegate next, ILogger<CustomExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task Invoke(HttpContext httpContext)
    {
        try
        {
            await _next(httpContext);
        }
        catch (Exception ex)
        {
            _logger.LogError("系统出错" + ex);
            await HandleExceptionAsync(httpContext, ex);
        }
    }

    private static async Task HandleExceptionAsync(HttpContext httpContext, Exception ex)
    {
        if (ex == null) return;
        await WriteExceptionAsync(httpContext, ex);
    }

    private static async Task WriteExceptionAsync(HttpContext context, Exception exception)
    {
        //返回友好的提示
        var response = context.Response;

        //状态码
        if (exception is UnauthorizedAccessException)
            response.StatusCode = (int)HttpStatusCode.Unauthorized;
        else if (exception is Exception)
            response.StatusCode = (int)HttpStatusCode.BadRequest;

        response.ContentType = context.Request.Headers["token"];
        //可以用来验证比如说是否在头部传递了token，验证token是否有效

        response.ContentType = "application/json";

        var result = new ResultModel { Message = "系统异常", IsSuccess = false };
        await response.WriteAsync(JsonConvert.SerializeObject(result));
    }
}
```
封装中间件的使用
```csharp
public static class MiddlewareExtensions
{
    public static IApplicationBuilder UseCustomExceptionMiddleware(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<CustomExceptionMiddleware>();
    }
}
```
使用中间件
```csharp
app.UseCustomExceptionMiddleware();
```
