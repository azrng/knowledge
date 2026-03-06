---
title: 过滤器实现-入参校验
lang: zh-CN
date: 2023-09-16
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: guolvqishixian-rucanjiaoyan
slug: vx0qxa
docsId: '67037787'
---

## 目的
通过Action过滤器实现对一些常见的请求入参的校验。比如我们的接口中经常有患者ID字段，我们可以全局对该字段进行限制。

## 操作
编写过滤器
```csharp
/// <summary>
/// 对模型验证过滤器
/// </summary>
public class ModelValidationFilter : ActionFilterAttribute
{
    //实现目的：比如接口中的常用参数有患者ID，我们可以写过滤器统一校验患者ID是否有效
    private readonly ILogger<ModelValidationFilter> _logger;

    public ModelValidationFilter(ILogger<ModelValidationFilter> logger)
    {
        _logger = logger;
    }

    public override void OnActionExecuting(ActionExecutingContext context)
    {
        if (!context.ModelState.IsValid)
        {
            context.Result = new BadRequestObjectResult(context.ModelState);
        }

        if (context.HttpContext.Request.Query.TryGetValue("patientId", out StringValues patientIdValue))
        {
            if (int.TryParse(patientIdValue.FirstOrDefault(), out int patientId))
            {
                if (patientId == 0)
                {
                    _logger.LogWarning($"{context.HttpContext.Request.Path} 患者标识无效");
                    context.Result = new BadRequestObjectResult("患者标识无效");
                }
            }
        }

        if (context.HttpContext.Request.Method == "POST" || context.HttpContext.Request.Method == "PUT")
        {
            context.HttpContext.Request.Body.Seek(0, SeekOrigin.Begin);//读取到Body后，重新设置Stream到起始位置
            var stream = new StreamReader(context.HttpContext.Request.Body);
            string body = stream.ReadToEndAsync().GetAwaiter().GetResult();
            JObject jobject = JObject.Parse(body);
            if (int.TryParse(jobject["patientId"].ToString(), out int patientId))
            {
                if (patientId == 0)
                {
                    _logger.LogWarning($"{context.HttpContext.Request.Path} 患者标识无效");
                    context.Result = new BadRequestObjectResult("患者标识无效");
                }
            }
            context.HttpContext.Request.Body.Seek(0, SeekOrigin.Begin);//读取到Body后，重新设置Stream到起始位置
        }
    }
}
```
全局使用
```csharp
builder.Services.AddControllers(option =>
{
    //添加全局过滤器
    option.Filters.Add(typeof(ModelValidationFilter));
});
```
因为设计到读取请求体的操作，还需要借助中间件来设置可以重复读取流
```csharp
//读取请求体设置可以重复读取
app.Use((context, next) =>
 {
     context.Request.EnableBuffering();
     return next(context);
 });
```

## 总结
可以实现URL、请求体中参数校验。
