---
title: 模拟 Http 响应
lang: zh-CN
date: 2023-10-14
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: monihttpxiangying
slug: wxaqwk
docsId: '68054704'
---

## 前言
在我们的业务代码中往往会有很多调用内部其他 team 或者是第三方的一些服务，在编写单元测试代码时，往往需要 Mock Http Response 来模拟更好可能的返回结果，我封装了一个简单的 Http Handler 来简化 Mock 过程，让基于 HttpClient Http Response 的模拟更为简单。

## 示例
首先来看一个简单的使用示例，也是一个测试用例
```csharp
[Theory]
[InlineData(HttpStatusCode.OK)]
[InlineData(HttpStatusCode.BadRequest)]
[InlineData(HttpStatusCode.Unauthorized)]
[InlineData(HttpStatusCode.Forbidden)]
[InlineData(HttpStatusCode.NotFound)]
[InlineData(HttpStatusCode.InternalServerError)]
public async Task HttpStatusTest(HttpStatusCode httpStatusCode)
{
    var httpHandler = new MockHttpHandler(req => new HttpResponseMessage(httpStatusCode));
    using var httpClient = new HttpClient(httpHandler);
    using var response = await httpClient.GetAsync("http://localhost:32123/api/values");
    Assert.Equal(httpStatusCode, response.StatusCode);
}
```
如果有需要在测试的过程中修改模拟的行为，可以通过 SetResponseFactory 方法来
```csharp
[Fact]
public async Task SetResponseFactoryTest()
{
    var httpHandler = new MockHttpHandler();
    using var httpClient = new HttpClient(httpHandler);
    var response = await httpClient.GetAsync("http://localhost:32123/api/values");
    Assert.Equal(HttpStatusCode.OK, response.StatusCode);

    httpHandler.SetResponseFactory(req => new HttpResponseMessage(HttpStatusCode.BadRequest));
    response = await httpClient.GetAsync("http://localhost:32123/api/values");
    Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
}
```
上面的方式都是直接指定了 response，我们也可以根据请求信息动态地返回 response
```csharp
[Fact]
public async Task DynamicResponseTest()
{
    var httpHandler = new MockHttpHandler(req => new HttpResponseMessage(HttpStatusCode.OK)
    {
        Content = new StringContent(req.Method.Method)
    });
    using var httpClient = new HttpClient(httpHandler);
    var response = await httpClient.GetStringAsync("http://localhost:32123/api/values");
    Assert.Equal(HttpMethod.Get.Method, response);

    using var httpResponse = await httpClient.PostAsync("http://localhost:32123/api/values", new StringContent(""));
    response = await httpResponse.Content.ReadAsStringAsync();
    Assert.Equal(HttpMethod.Post.Method, response);
}
```

## 实现
实现代码很简单，大致如下，根据自定义的逻辑去返回 response 即可
```csharp
public sealed class MockHttpHandler : HttpMessageHandler
{
    private Func<HttpRequestMessage, Task<HttpResponseMessage>> _responseFactory;

    public MockHttpHandler() : this(_ => Task.FromResult(new HttpResponseMessage(HttpStatusCode.OK)))
    {
    }

    public MockHttpHandler(Func<HttpRequestMessage, HttpResponseMessage> responseFactory)
    {
        Guard.NotNull(responseFactory);
        _responseFactory = req => Task.FromResult(responseFactory(req));
    }

    public MockHttpHandler(Func<HttpRequestMessage, Task<HttpResponseMessage>> responseFactory)
    {
        Guard.NotNull(responseFactory);
        _responseFactory = responseFactory;
    }

    public void SetResponseFactory(Func<HttpRequestMessage, HttpResponseMessage> responseFactory)
    {
        Guard.NotNull(responseFactory);
        _responseFactory = req => Task.FromResult(responseFactory(req));
    }

    public void SetResponseFactory(Func<HttpRequestMessage, Task<HttpResponseMessage>> responseFactory)
    {
        Guard.NotNull(responseFactory);
        _responseFactory = responseFactory;
    }

    protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
    {
        return _responseFactory(request);
    }
}
```
在需要模拟 Http API 的响应时，可以考虑使用这种方式

## 资料

mockhttpclient：https://blog.elmah.io/mocking-httpclient-requests-for-csharp-unit-tests/

## 参考资料

[https://mp.weixin.qq.com/s/iPD2b6OIZ9B_3FXOwzZlvw](https://mp.weixin.qq.com/s/iPD2b6OIZ9B_3FXOwzZlvw) | .NET 中更方便地模拟 Http 响应
