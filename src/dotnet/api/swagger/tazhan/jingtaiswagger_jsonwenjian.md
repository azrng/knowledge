---
title: 静态swagger.json文件
lang: zh-CN
date: 2023-09-17
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: jingtaiswagger_jsonwenjian
slug: yv22w1
docsId: '65259175'
---

## 说明
ASP.NET Core Web API默认集成了Swashbuckle，可以在运行时显示Swagger UI：
而Swagger UI实际上是解析的动态生成的swagger.json：
```csharp
app.UseSwagger();
app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "WebApplication3 v1"));
```
其实，部署ASP.NET Core Web API完成后，swagger.json的内容就不会改变了，完全可以用静态文件替代。

## 实现
创建ASP.NET Core Web API项目，然后安装Swashbuckle CLI
```csharp
dotnet tool install SwashBuckle.AspNetCore.Cli
```

### 生成静态文件
引用Nuget包Swashbuckle.AspNetCore.Annotations，并在项目下创建wwwroot\swagger\v1目录，然后编写生成后事件命令行：
```csharp
dotnet swagger tofile --output ./wwwroot/swagger/v1/swagger.json $(OutputPath)$(AssemblyName).dll v1
```
这样，每次编译项目，就会在目录下生成swagger.json静态文件。

### 使用静态文件
修改Startup.cs：
```csharp
//app.UseSwagger();
app.UseStaticFiles();
app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "WebApplication3 v1"));
```
可以看到，我们注释掉了app.UseSwagger()，这会移除SwaggerMiddleware，不会再在运行时生成swagger.json。
运行程序，访问Swagger UI，和以前没有任何区别。

## 结论
相对于运行时生成swagger.json，静态文件性能更好，而且方便提供给第三方。

## 资料
[https://mp.weixin.qq.com/s/Na2W93TcQMyDvHNMLQS8zQ](https://mp.weixin.qq.com/s/Na2W93TcQMyDvHNMLQS8zQ)
