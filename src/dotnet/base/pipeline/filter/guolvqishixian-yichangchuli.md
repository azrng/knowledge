---
title: 过滤器实现-异常处理
lang: zh-CN
date: 2023-08-07
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: guolvqishixian-yichangchuli
slug: yky2ka
docsId: '63500277'
---
> 更新时间：2022年8月14日14:17:22


## 目的
通过异常过滤器实现业务异常捕捉，并且将异常信息进行记录并返回统一的响应报文(比如在开发环境返回具体的异常堆栈，在其他环境返回统一错误信息)。

## 操作
引用辅助包
```csharp
<PackageReference Include="AzrngCommon" Version="1.2.6" />
```
> 主要使用该包内的返回类


### 同步用法
```csharp
/// <summary>
/// 自定义全局异常过滤器
/// </summary>
public class CustomExceptionFilter : IExceptionFilter
{
    private readonly IWebHostEnvironment _hostEnvironment;
    private readonly ILogger<CustomExceptionFilter> _logger;

    public CustomExceptionFilter(ILogger<CustomExceptionFilter> logger,
        IWebHostEnvironment hostEnvironment)
    {
        _logger = logger;
        _hostEnvironment = hostEnvironment;
    }

    public void OnException(ExceptionContext context)
    {
        //如果异常没有处理
        if (context.ExceptionHandled)
            return;
        var result = new ResultModel
        {
            Code = "500",
            IsSuccess = false,
            Message = "系统异常，请联系管理员",
        };
        _logger.LogError($"异常 path:{context.Result} message:{context.Exception.Message} StackTrace:{context.Exception.StackTrace}");
        if (_hostEnvironment.IsDevelopment())
        {
            result.Message += "," + context.Exception.Message;
        }

        context.Result = new JsonResult(result);
        //异常已处理
        context.ExceptionHandled = true;
    }
}
```
全局使用
```csharp
builder.Services.AddControllers(option =>
{
    //添加全局过滤器
    option.Filters.Add(typeof(CustomExceptionFilter));
});
```

### 异步用法
```csharp
public class ExceptionFilter : IAsyncExceptionFilter
{
    /// <summary>
    ///
    /// </summary>
    /// <param name="context"></param>
    public async Task OnExceptionAsync(ExceptionContext context)
    {
        //判断异常是否已经处理
        if (!context.ExceptionHandled)
        {
            var result = new ApiResult(StatusCodes.Status500InternalServerError, false, context.Exception.Message);

            context.Result = new JsonResult(result);

            context.ExceptionHandled = true;
        }
    }
}
```

## 总结
不能拦截处理Action以外的错误。
