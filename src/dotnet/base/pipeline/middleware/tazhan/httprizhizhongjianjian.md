---
title: HTTP日志中间件
lang: zh-CN
date: 2022-08-14
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: httprizhizhongjianjian
slug: gzvbac
docsId: '46082121'
---

## 介绍
`HttpLogging` 是一个新的内置中间件(.Net 6)，可以记录 HTTP 请求和 HTTP 响应的信息，包括头信息和整个 Body。
`HttpLogging` 中间件提供了以下日志：

- HTTP 请求信息
- 普通属性
- 头信息
- 请求 Body
- HTTP 响应信息

## 操作
调用中指定 `HttpLoggingOptions`
```csharp
//http日志记录
builder.Services.AddHttpLogging(logging =>
{
    // Customize HTTP logging here.
    logging.LoggingFields = HttpLoggingFields.All;
    logging.RequestHeaders.Add("My-Request-Header");
    logging.ResponseHeaders.Add("My-Response-Header");
    logging.MediaTypeOptions.AddText("application/javascript");
    logging.RequestBodyLogLimit = 4096;
    logging.ResponseBodyLogLimit = 4096;
});
```
这会在日志中产生新的带有 `Microsoft.AspNetCore.HttpLogging.HttpLoggingMiddleware` 类别的 HTTP 请求信息。
```csharp
app.UseHttpLogging();
```

## 参考文档
> [https://docs.microsoft.com/zh-cn/aspnet/core/fundamentals/http-logging/?view=aspnetcore-6.0](https://docs.microsoft.com/zh-cn/aspnet/core/fundamentals/http-logging/?view=aspnetcore-6.0)

