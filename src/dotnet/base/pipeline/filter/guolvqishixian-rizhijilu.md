---
title: 过滤器实现-日志记录
lang: zh-CN
date: 2022-07-19
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: guolvqishixian-rizhijilu
slug: ov2ag8
docsId: '67038030'
---

## 目的
通过Action过滤器实现对请求日志的记录。

## 操作
编写过滤器
```csharp
/// <summary>
/// 日志记录
/// </summary>
public class RequestParamRecordFilter : ActionFilterAttribute
{
    //目的：记录请求的消息
    private readonly ILogger<ModelValidationFilter> _logger;

    public RequestParamRecordFilter(ILogger<ModelValidationFilter> logger)
    {
        _logger = logger;
    }

    public override void OnActionExecuting(ActionExecutingContext context)
    {
        //设置可以多次读取
        context.HttpContext.Request.Body.Seek(0, SeekOrigin.Begin);//读取到Body后，重新设置Stream到起始位置
        var sr = new StreamReader(context.HttpContext.Request.Body);
        var data =  sr.ReadToEndAsync().GetAwaiter().GetResult();
        _logger.LogInformation(
            $"Time:{DateTime.Now:yyyy-MM-dd HH:mm:ss} requestUrl:{context.HttpContext.Request.Path}  Method:{context.HttpContext.Request.Method}  requestBodyData: " +
            data);
        //读取到Body后，重新设置Stream到起始位置
        context.HttpContext.Request.Body.Seek(0, SeekOrigin.Begin);
        _logger.LogInformation($"Host: {context.HttpContext.Request.Host.Host}");
        _logger.LogInformation($"Client IP: {context.HttpContext.Connection.RemoteIpAddress}");

    }
}
```
全局使用
```csharp
builder.Services.AddControllers(option =>
{
    //添加全局过滤器
    option.Filters.Add(typeof(RequestParamRecordFilter));
});
```
因为涉及到读取请求体的操作，还需要借助中间件来设置可以重复读取流
```csharp
//读取请求体设置可以重复读取
app.Use((context, next) =>
 {
     context.Request.EnableBuffering();
     return next(context);
 });
```
输出结果：
```csharp
info: NetCoreFilterSample.CustomFilter.ModelValidationFilter[0]
      Time:2022-02-19 00:07:04 requestUrl:/api/WeatherForecast/AddPatientEat  Method:POST  requestBodyData: {
        "patientId": 10,
        "eat": "string222"
      }
info: NetCoreFilterSample.CustomFilter.ModelValidationFilter[0]
      Host: localhost
info: NetCoreFilterSample.CustomFilter.ModelValidationFilter[0]
      Client IP: ::1
```

## 总结
可以实现请求地址入参等参数记录。
