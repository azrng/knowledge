---
title: 默认图片中间件
lang: zh-CN
date: 2021-10-03
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: morentupianzhongjianjian
slug: pnpso2
docsId: '26485761'
---

### 使用场景
web上如果图片不存在的话这个时候使用默认的图片代替，现在使用中间件的方式统一设置，一次设置全局起作用

### 操作
创建中间件
```csharp
public class DefaultImageMiddleware
{
    private readonly RequestDelegate _next;
    public static string DefaultImagePath { get; set; }

    public DefaultImageMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task Invoke(HttpContext context)
    {
        await _next(context);

        if (context.Response.StatusCode == 404)
        {
            var contentType = context.Request.Headers["accept"].ToString().ToLower();
            if (contentType.StartsWith("image"))
            {
                await SetDefaultImage(context);
            }
        }
    }

    private async Task SetDefaultImage(HttpContext context)
    {
        try
        {
            string path = Path.Combine(Directory.GetCurrentDirectory(), DefaultImagePath);
            FileStream fs = File.OpenRead(path);
            byte[] bytes = new byte[fs.Length];
            await fs.ReadAsync(bytes, 0, bytes.Length);

            await context.Response.Body.WriteAsync(bytes, 0, bytes.Length);
        }
        catch (Exception ex)
        {
            await context.Response.WriteAsync(ex.Message);
        }
    }
}

public static class DefaultImageMiddlewareExtensions
{
    public static IApplicationBuilder UseDefaultImage(this IApplicationBuilder app, string defaultImagePath)
    {
        DefaultImageMiddleware.DefaultImagePath = defaultImagePath;

        return app.UseMiddleware<DefaultImageMiddleware>();
    }
}
```
使用中间件
```csharp
app.UseDefaultImage(defaultImagePath: Configuration["defaultImagePath"]);
```

