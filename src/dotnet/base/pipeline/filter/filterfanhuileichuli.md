---
title: 过滤器实现-返回类处理
lang: zh-CN
date: 2023-09-13
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: guolvqishixian-fanhuileichuli
slug: ktbvol
docsId: '63500239'
---

## 目的
通过返回过滤器实现返回类的处理，在最外层包一层公共返回类。

## 操作

### 准备
里面的ResultModel使用的是nuget的东西
```csharp
<PackageReference Include="AzrngCommon" Version="1.2.4" />
```

### 同步示例
返回过滤器处理
```csharp
/// <summary>
/// 方案一：返回类处理(让返回结果外面包一层公共业务返回类)
/// </summary>
[AttributeUsage(AttributeTargets.All)]
public class CustomResultPackFilter : Attribute, IResultFilter
{
    public void OnResultExecuted(ResultExecutedContext context)
    {
    }

    public void OnResultExecuting(ResultExecutingContext context)
    {
        if (context.ActionDescriptor.FilterDescriptors.Any(x => x.Filter.GetType() == typeof(NoWrapperAttribute)))
        {
            return;
        }

        if (context.Result is EmptyResult)
        {
            context.Result = new OkObjectResult(new ResultModel
            {
                Code = "200",
                IsSuccess = true,
                Message = "成功"
            });
            return;
        }

        context.Result = new OkObjectResult(new ResultModel<object>
        {
            Code = "200",
            IsSuccess = true,
            Data = ((ObjectResult)context.Result).Value
        });
    }
}

/// <summary>
/// 方案二：返回类处理(让返回结果外面包一层公共业务返回类增加返回code和消息)
/// </summary>
[AttributeUsage(AttributeTargets.All)]
public class CustomResultPack2Filter : ActionFilterAttribute
{
    public override void OnActionExecuted(ActionExecutedContext context)
    {
        if (context.ActionDescriptor.FilterDescriptors.Any(x => x.Filter.GetType() == typeof(NoWrapperAttribute)))
        {
            return;
        }

        if (context.Result is EmptyResult)
        {
            context.Result = new OkObjectResult(
                new ResultModel
                {
                    Code = "200",
                    IsSuccess = true,
                    Message = "成功"
                }
            );
            return;
        }

        context.Result = new OkObjectResult(
            new ResultModel<object>
            {
                Code = "200",
                IsSuccess = true,
                Data = ((ObjectResult)context.Result).Value
            }
        );
    }
}
```
对于一些不想包装一层的方法设置该特性
```csharp
/// <summary>
/// 不使用全局的 ResultWrapperFilter 包装器
/// </summary>
public class NoWrappeAttribute : ActionFilterAttribute
{
}
```
注册全局过滤器
```csharp
services.AddControllers(options => 
{
    options.Filters.Add(typeof(CustomResultPackFilter));
});
```

### 异步示例
```csharp
public class ResultFilter : IAsyncResultFilter
{
    /// <summary>
    ///
    /// </summary>
    /// <param name="context"></param>
    /// <param name="next"></param>
    public async Task OnResultExecutionAsync(ResultExecutingContext context, ResultExecutionDelegate next)
    {
        // 可以这里做处理，不想返回类包装的在此处返回
        
        var data = GetResult(context.Result);

        var result = new ApiResult<object?>(StatusCodes.Status200OK, true, data);
        context.Result = new OkObjectResult(result);

        await next();
    }

    private object? GetResult(IActionResult result)
    {
        return result switch
        {
            // 处理内容结果
            ContentResult content => content.Content,
            // 处理对象结果
            ObjectResult obj => obj.Value,
            // 处理 JSON 对象
            JsonResult json => json.Value,
            _ => null,
        };
    }
}
```
