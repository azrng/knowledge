---
title: Sejil
lang: zh-CN
date: 2023-09-02
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: sejil
slug: xpa3qt4fe6vsms6w
docsId: '138134486'
---

## 概述
Sejil 是一个 .NET 组件库，使您能够直接从应用程序捕获、查看和过滤 ASP.net Core 应用程序的日志事件。它支持结构化日志记录、查询以及保存日志事件查询。
Sejil 的特点是，轻量级，开箱即用，带管理界面，非常适合在小型项目中使用。

> 现在已经不更新了


仓库地址：[https://github.com/alaatm/Sejil](https://github.com/alaatm/Sejil)

## 操作
安装nuget包
```bash
dotnet add package Sejil --version 3.0.4
```
将以下代码添加到 Program.cs：
```csharp
public static IWebHost BuildWebHost(string[] args) =>
    Host.CreateDefaultBuilder(args)
    .UseSejil()  // <-- Add this line
    .ConfigureWebHostDefaults(webBuilder => webBuilder.UseStartup<Startup>());
```
将以下代码添加到Startup.cs
```csharp
using Sejil;

public class Startup
{    
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        // ...
        app.UseSejil();  // <-- Add this line
        // ...
    }
}
```
（可选）查看日志时需要身份验证：
```csharp
public void ConfigureServices(IServiceCollection services)
    {
        services.ConfigureSejil(options =>
        {
            options.AuthenticationScheme = /* Your authentication scheme */
        });
    }
```
（可选）更改日志页面标题（如果未设置，则默认为Sejil）：
```csharp
public void ConfigureServices(IServiceCollection services)
    {
        services.ConfigureSejil(options =>
        {
            options.Title = "My title";
        });
    }
```
