---
title: REST 开源库
lang: zh-CN
date: 2023-06-24
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: restkaiyuanku
slug: zhnfuf
docsId: '32029763'
---

## ReFit
Refit 是一个类型安全的 REST 开源库，是一套基于 RESTful 架构的 .NET 客户端实现，内部使用 HttpClient 类封装，可通过 Refit 更加简单安全地访问 Web API 接口，要使用Refit 框架，只需要在项目中通过 NuGet 包安装器安装即可。声明式调用
github：[https://github.com/reactiveui/refit](https://github.com/reactiveui/refit)

参考示例：[https://www.cnblogs.com/tx1185498724/p/15737061.html](https://www.cnblogs.com/tx1185498724/p/15737061.html)

## WebApiClientCore
声明式调用的请求方式。

仓库地址：[https://github.com/dotnetcore/WebApiClient](https://github.com/dotnetcore/WebApiClient)

官方文档：[https://webapiclient.github.io/guide/](https://webapiclient.github.io/guide/)

参考文档：[https://www.cnblogs.com/kewei/p/12939866.html](https://www.cnblogs.com/kewei/p/12939866.html)

## RestSharp
官网：[https://restsharp.dev/](https://restsharp.dev/)
调用api接口的组件
```csharp
 var client = new RestClient("http://example.com");
 // client.Authenticator = new HttpBasicAuthenticator(username, password);
 var request = new RestRequest("resource/{id}");
 request.AddParameter("thing1", "Hello");
 request.AddParameter("thing2", "world");
 request.AddHeader("header", "value");
 request.AddFile("file", path);
 var response = client.Post(request);
 var content = response.Content; // Raw content as string
 var response2 = client.Post<Person>(request);
 var name = response2.Data.Name;
```
FormData上传文件
```csharp
var client = new RestClient();
var request = new RestRequest(url, Method.Post);
request.AddFile("file", stream, "file.zip");
var response = await client.ExecuteAsync(request);
Console.WriteLine(response.Content);
```

## Flurl.Http
拥有便捷易用的API接口，底层使用的是HttpClient，而且支持移植，可以在Nuget上获取
```csharp
var responseString = await "http://www.example.com/recepticle.aspx"
    .PostUrlEncodedAsync(new { thing1 = "hello", thing2 = "world" })
    .ReceiveString();

var responseString = await "http://www.example.com/recepticle.aspx"
    .GetStringAsync();
```
FormData
上传文件
```csharp
static async Task<string> SendPostFileBytesByFormDataAsync(string url, byte[] bytes, string fileName,
     string formParamKey = "file", string headKey = "Content-Type",
     string headKeyValue = "multipart/form-data", int timeout = 10)
{
    using var formData = new MultipartFormDataContent();
    using var byteContent = new ByteArrayContent(bytes);
    byteContent.Headers.ContentDisposition = new ContentDispositionHeaderValue("form-data")
    {
        Name = formParamKey,
        FileName = fileName
    };
    formData.Add(byteContent);

    return await url.WithHeader(headKey, headKeyValue)
        .WithTimeout(TimeSpan.FromMinutes(timeout))
        .PostAsync(formData).ReceiveString();

}

static async Task<string> SendPostFileStreamByFormDataAsync(string url, Stream bytes, string fileName,
     string formParamKey = "file", string headKey = "Content-Type",
     string headKeyValue = "multipart/form-data", int timeout = 10)
{
    using var formData = new MultipartFormDataContent();
    using var byteContent = new StreamContent(bytes);
    byteContent.Headers.ContentDisposition = new ContentDispositionHeaderValue("form-data")
    {
        Name = formParamKey,
        FileName = fileName
    };
    formData.Add(byteContent);

    return await url.WithHeader(headKey, headKeyValue)
        .WithTimeout(TimeSpan.FromMinutes(timeout))
        .PostAsync(formData).ReceiveString();

}
```
> 这个文件名必须传，很重要

