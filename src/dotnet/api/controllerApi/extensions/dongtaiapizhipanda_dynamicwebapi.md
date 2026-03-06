---
title: 动态API之Panda.DynamicWebApi
lang: zh-CN
date: 2023-10-05
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: dongtaiapizhipanda_dynamicwebapi
slug: wdrknnztv72fl7w9
docsId: '126075654'
---

## 概述
源自于ABP的一个可独立使用的，可自动为你的业务逻辑层生成 ASP.NET Core WebApi 层的开源组件。它生成的API符合Restful风格，可以根据符合条件的类来生成WebApi，由MVC框架直接调用逻辑，无性能问题，完美兼容Swagger来构建API说明文档。
仓库地址：[https://github.com/dotnetauth/Panda.DynamicWebApi](https://github.com/dotnetauth/Panda.DynamicWebApi)

## 操作

### 基础操作
安装nuget包
```csharp
<PackageReference Include="Panda.DynamicWebApi" Version="1.2.1" />
```
新建一个IApplicationService，然后继承自IDynamicWebApi并标注特性DynamicWebApi
```csharp
[DynamicWebApi]
public interface IApplicationService : IDynamicWebApi
{
}
```
然后让我们的业务服务继承自该IApplicationService
```csharp
public interface IUservice : IApplicationService
{

}
```
然后注入服务
```csharp
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "WebApi", Version = "v1" });

    // 提供一个自定义策略去选择action  改为默认返回true
    options.DocInclusionPredicate((docName, description) => true);
});

// 放在注入控制器之后
builder.Services.AddDynamicWebApi(options =>
{
    options.DefaultApiPrefix = "api";
});
```
然后启动就发现已经将业务服务暴露成API接口了。

## 资料
[https://www.cnblogs.com/stulzq/p/11007770.html](https://www.cnblogs.com/stulzq/p/11007770.html) | ASP.NET Core 奇淫技巧之动态WebApi - 晓晨Master - 博客园
