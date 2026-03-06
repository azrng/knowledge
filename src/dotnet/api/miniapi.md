---
title: MiniApi
lang: zh-CN
date: 2023-09-02
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: miniapi
slug: kwzpgu
docsId: '71197069'
---

## 概述

官网文档地址：[https://learn.microsoft.com/zh-cn/aspnet/core/fundamentals/minimal-apis?view=aspnetcore-7.0](https://learn.microsoft.com/zh-cn/aspnet/core/fundamentals/minimal-apis?view=aspnetcore-7.0)

## 参数
获取args参数
```csharp
var debugEnabled = args.Contains("--debug", StringComparer.OrdinalIgnoreCase);
var logAsJson = args.Contains("--logAsJson", StringComparer.OrdinalIgnoreCase);
```

## 测试
编写单元测试Program是访问不到的，需要在修改配置
```csharp
  <ItemGroup>
    <InternalsVisibleTo Include="MiniAPI19UnitTestUT"/>
  </ItemGroup>
```
> 参考资料：[https://mp.weixin.qq.com/s/qeD--UrxhKCt94dXa3rU3Q](https://mp.weixin.qq.com/s/qeD--UrxhKCt94dXa3rU3Q)


## 中间件
设置只对部分控制器起作用的中间件
```csharp
public class UserEndpointFilter : IEndpointFilter
{
    public async ValueTask<object?> InvokeAsync(EndpointFilterInvocationContext context,
        EndpointFilterDelegate next)
    {
        Console.WriteLine("我是用户中间件");
        return await next(context);
    }
}
```
使用方法
```csharp
var userGroup = _app.MapGroup("user").AddEndpointFilter<UserEndpointFilter>().WithTags("user");

// 从body中获取参数
userGroup.MapPost("/", async (OpenDbContext db, User user) =>
{
    await db.AddAsync(user);
    return await db.SaveChangesAsync();
});
```

## 返回多部分内容
对接口返回多部分内容，比如想返回一个图片文件和一些文本信息，要解决这个问题，我们需要自己写一个返回值处理器，它需要将 MultipartFormDataContent 对象转换成 Stream 对象，然后把 Stream 对象写入 HTTP 响应中。
```csharp
app.MapGet("/GetFile", () =>
{
    // 实例化multipart表单模型
    var formData = new MultipartFormDataContent("----myioboundary");
    // 设定文本类型表单项，使用StringContent存放字符串
    formData.Add(new StringContent("测试图片"), "desc");
    // 设定文件类型表单项，使用StreamContent存放文件流
    formData.Add(new StreamContent(new FileStream(@"demo.jpg", FileMode.Open, FileAccess.Read)), "file", "a.jpg");

    return new MultipartFormDataContentResult(formData);
});
 
public class MultipartFormDataContentResult : IResult
{
    private readonly MultipartFormDataContent _content;

    public MultipartFormDataContentResult(MultipartFormDataContent content)
    {
        _content = content;
    }

    public async Task ExecuteAsync(HttpContext httpContext)
    {
        httpContext.Response.ContentType = _content.Headers.ContentType.ToString();
        await _content.CopyToAsync(httpContext.Response.Body);
    }
}
```
