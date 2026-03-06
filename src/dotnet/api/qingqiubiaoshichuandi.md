---
title: 请求标识传递
lang: zh-CN
date: 2023-07-06
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: qingqiubiaoshichuandi
slug: uspwz7plvkt2qgzp
docsId: '131763887'
---

## 概述
请求头链路传播

## 操作

### HeaderPropagation
源码地址：[https://github.com/dotnet/aspnetcore/tree/main/src/Middleware/HeaderPropagation](https://github.com/dotnet/aspnetcore/tree/main/src/Middleware/HeaderPropagation)

#### 基本使用
引用nuget包
```powershell
Microsoft.AspNetCore.HeaderPropagation
```
基本使用
```powershell
services.AddHeaderPropagation(options =>
{
    // 如果请求头中含 X-BetaFeatures 字段，则传播该字段对应的值
    options.Headers.Add("X-RequestId");

    //// 如果请求头中不含 X-BetaFeatures 字段，则生成一个新的值并进行传播
    //options.Headers.Add("X-BetaFeatures", context =>
    //{
    //    return Guid.NewGuid().ToString("N");
    //});
});

// 正确使用 传播所有注册过的请求头，也可以传播部分请求头
services.AddHttpClient("ServiceB", options =>
{
    options.BaseAddress = new Uri("http://localhost:5001");
}).AddHeaderPropagation();

// 错误示例
//services.AddHttpClient().AddHeaderPropagation();
```
还需要使用中间件
```powershell
// 需要在UseRouting之前
app.UseHeaderPropagation();
```
然后就可以正常请求并传播请求头的数据了
```powershell
[Route("api/[controller]")]
[ApiController]
public class HeaderForwarderController : ControllerBase
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ILogger<HeaderForwarderController> _logger;

    public HeaderForwarderController(IHttpClientFactory httpClientFactory,
        ILogger<HeaderForwarderController> logger)
    {
        _httpClientFactory = httpClientFactory;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult> TestRequestAsync()
    {
        var headers = Request.Headers;
        foreach (var kv in headers)
        {
            _logger.LogInformation($"{kv.Key}:{kv.Value}");
        }
        var client = _httpClientFactory.CreateClient("ServiceB");
        var result = await client.GetAsync("test");
        return Ok(result.StatusCode);
    }
}
```

#### 源码简述
内部维护了一个HeaderPropagationValues的对象示例，生命周期是单例的，然后每次请求的时候，将读取请求头保存到该示例中，当我们注入HttpClient的时候，中间件会创建HeaderPropagationMessageHandler，它继承自DelegatingHandler，通过这个handler来实现，将保存的请求头添加到对应的httpclient实例上，然后就可以传递了。
```csharp
builder.AddHttpMessageHandler(services =>
{
    var options = new HeaderPropagationMessageHandlerOptions();
    var middlewareOptions = services.GetRequiredService<IOptions<HeaderPropagationOptions>>();
    for (var i = 0; i < middlewareOptions.Value.Headers.Count; i++)
    {
        var header = middlewareOptions.Value.Headers[i];
        options.Headers.Add(header.CapturedHeaderName, header.CapturedHeaderName);
    }
    return new HeaderPropagationMessageHandler(options, services.GetRequiredService<HeaderPropagationValues>());
});
```

#### 资料
标头传播实现分布式链路追踪：[https://blog.yuanpei.me/posts/asp-net-core-using-headerpropagation-for-distributed-tracking/](https://blog.yuanpei.me/posts/asp-net-core-using-headerpropagation-for-distributed-tracking/)

### HeaderForwarder
将老师写的自动转发接收的请求报头代码
仓库地址：[https://kgithub.com/jiangjinnan/HeaderForwarder](https://kgithub.com/jiangjinnan/HeaderForwarder)
文档地址：[https://www.cnblogs.com/artech/p/HeaderForwarder.html](https://www.cnblogs.com/artech/p/HeaderForwarder.html)

### 后台服务请求标识
给服务增加一个请求标识让服务的调用串联起来。
correlationId
仓库地址：[https://github.com/WeihanLi/SamplesInPractice/blob/master/BalabalaSample/CorrelationIdSample.cs](https://github.com/WeihanLi/SamplesInPractice/blob/master/BalabalaSample/CorrelationIdSample.cs)
参考资料：[https://mp.weixin.qq.com/s/mbPAwY0BX4-ISlOaZ0c2Wg](https://mp.weixin.qq.com/s/mbPAwY0BX4-ISlOaZ0c2Wg)
