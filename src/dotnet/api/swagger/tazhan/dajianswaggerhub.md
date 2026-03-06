---
title: 搭建SwaggerHub
lang: zh-CN
date: 2023-04-12
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: dajianswaggerhub
slug: hnbp7siuh01yllh8
docsId: '121630634'
---

## 概述
就是将多个系统的swagger集成到一块，成为swagger中心。

## 操作
在NetCore的世界里, 我们可以使用 [Swashbuckle.AspNetCore](https://github.com/domaindrivendev/Swashbuckle.AspNetCore)来构建一个我们自己的SwaggerHub. 而且特别简单, 我们仅需要一行代码即可
```csharp
var swaggerUIOptions = new SwaggerUIOptions();
swaggerUIOptions.ConfigObject.Urls = new[] {
    new UrlDescriptor() {
        Name = "swagger name",
        Url= "swagger.json"
        }
};

app.UseSwaggerUI(swaggerUIOptions);
```
我们只需要配置Urlsoption, 增加多个swagger json 配置就完事儿了, 如此, Hub就完成了. 本文章到这里也就算完事儿了.
剩下的就是根据公司情况如同, 采用的方案不同而要解决的一些实际问题了.

对swaggerUIOptions对象的任何更改都是实时生效的, 所以我们可以做到只要改配置即可实时生效.
Url 可以配置为一个endpoint, 直接由swaggerui在浏览器中下载指定的文件.
```csharp
new UrlDescriptor(){Url="https://www.cnblogs.com/swagger.json"}
```
Uri也可以是在任何地方的一个文件
```csharp
//配置url从当前项目的一个地址下载文件.
new UrlDescriptor(){Url="/swagger-file/swagger.json"}
 
// 从本地读取swagger文件
[HttpGet("/swagger-file/{swaggerName}.json")]
public IActionResult GetSwaggerFileAsync([FromRoute] string swaggerName)
{
    return this.File($"static-file-dir/swaggers/{serviceName}.json", "application/json");
}
```
当然, 我们也可以读取任何地方的swagger文件, 例如在github, 各种云存储(aws/s3, aliyun/oss)等等.

给swagger设置server地址
每个swagger可能代表这不同的服务, 大概率就有不同的endpoint, 也可以是多个环境配置地址(dev,uat,staging,pro).
给swagger.json增加servers节点即可.
```csharp
{
    "servers":["server-endpoint1","server-endpoint2"]
}
```
可以使用各个JSON组件动态插入, 也可以用Microsoft.OpenApi.Readers 组件来解析和改写所有swagger的内容
```csharp
var doc = new OpenApiStreamReader().Read(sourceSwaggerJson, out _);
doc.Servers.Add(new OpenApiServer() { Url = "my-dev-server-endpoint" });
doc.Servers.Add(new OpenApiServer() { Url = "my-pro-server-endpoint" });
string swaggerJsonContent = targetDoc.SerializeAsJson(Microsoft.OpenApi.OpenApiSpecVersion.OpenApi3_0);
```
[Microsoft.OpenApi.Readers](https://github.com/microsoft/OpenAPI.NET) 可以用来解析openAPI 格式的文档. 支持v2,v3等版本, 支持json,yaml格式. 详情可查看官方文档. 所以这个netcore 的 swaggerhub 自然而然的就支持读取任何语言支持的openAPI文档(java, nodejs, 等等).

合并文档成一个
单一的一个服务由多个不同的服务提供服务支持. 举个例子, 商品服务由商品服务+商品搜索服务共同组成, 2个单独的服务由2个单独的team负责维护, 但是对外提供服务的时候暴露在同一个domian下, 根据path route到不同的服务上. 这个时候我们还是使用Microsoft.OpenApi.Readers 来做合并这个事情.
```csharp
//demo代码
var productDoc= download();
var productSearchDoc= download();
var targetDoc = new OpenApiDocument() { Components = new(), Paths = new() };
 
targetDoc.Paths.Add(productDoc.Paths)
targetDoc.Paths.Add(productSearchDoc.Paths)
targetDoc.Components.Schemas.Add(...)
//巴拉巴拉
string swaggerJsonContent = targetDoc.SerializeAsJson(Microsoft.OpenApi.OpenApiSpecVersion.OpenApi3_0);
```
上面只是列出了我碰到的几个具体情况, 不同的公司不同的场景下还有更多可能的case. 这个就得case by case了. 但是一个万变不离其宗, 总之就是对openAPI生成是swagger文件进行自定义. 这个时候用Microsoft.OpenApi.Readers就完事了.

## 总结
SwaggerHub, SwaggerUI 用Swashbuckle.AspNetCore搭建.
OpenAPI Swagger Doc 用Microsoft.OpenApi.Readers做定制化修改.

## 参考资料
NetCore 使用 Swashbuckle 搭建 SwaggerHub：[https://www.cnblogs.com/calvinK/p/netcore-buiding-swaggerhub.html](https://www.cnblogs.com/calvinK/p/netcore-buiding-swaggerhub.html)
