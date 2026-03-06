---
title: 输出执行中间件
lang: zh-CN
date: 2023-06-27
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: shuchuzhihangzhongjianjian
slug: li9elf0kgs7qwoyg
docsId: '121335795'
---

## 概述
输出都执行了哪些中间件

## 操作

### 安装nuget包
需要添加两个Nuget包分别是：Microsoft.AspNetCore.MiddlewareAnalysis和Microsoft.Extensions.DiagnosticAdapter，前者是分析记录中间件核心代码实现后者是用来接收日志输出的，由于是用的DiagnosticSource方式记录日志，所以需要使用DiagnosticListener对象的SubscribeWithAdapter方法来订阅。

### 实现分析诊断适配器
这个适配器是为了方便我们把从DiagnosticSource接收到的日志对象输出到控制台，具体代码实现如下
```
    public class AnalysisDiagnosticAdapter
    {
        private readonly ILogger<AnalysisDiagnosticAdapter> _logger;
        public AnalysisDiagnosticAdapter(ILogger<AnalysisDiagnosticAdapter> logger)
        {
            _logger = logger;
        }

        [DiagnosticName("Microsoft.AspNetCore.MiddlewareAnalysis.MiddlewareStarting")]
        public void OnMiddlewareStarting(HttpContext httpContext, string name, Guid instance, long timestamp)
        {
            _logger.LogInformation($"中间件-启动: '{name}'; Request Path: '{httpContext.Request.Path}'");
        }

        [DiagnosticName("Microsoft.AspNetCore.MiddlewareAnalysis.MiddlewareException")]
        public void OnMiddlewareException(Exception exception, HttpContext httpContext, string name, Guid instance, long timestamp, long duration)
        {
            _logger.LogInformation($"中间件-异常: '{name}'; '{exception.Message}'");
        }

        [DiagnosticName("Microsoft.AspNetCore.MiddlewareAnalysis.MiddlewareFinished")]
        public void OnMiddlewareFinished(HttpContext httpContext, string name, Guid instance, long timestamp, long duration)
        {
            _logger.LogInformation($"中间件-结束: 耗时[{duration/10000}] '{name}'; Status: '{httpContext.Response.StatusCode}'");
        }
    }
```

### 注册服务启用中间件
注册中间件分析服务
```
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddMiddlewareAnalysis();
```
订阅我们的分析诊断适配器
```
var listener = app.Services.GetRequiredService<DiagnosticListener>();
var observer = ActivatorUtilities.CreateInstance<AnalysisDiagnosticAdapter>(app.Services);
using var disposable = listener.SubscribeWithAdapter(observer);
```
这样基本就完成了分析记录中间件的功能，启动程序看看效果

日志已经成功的输出到我们的控制台了，不过才四个中间件，应该不止这么少的，再在注册中间件分析服务哪里添加一句代码
```csharp
var builder = WebApplication.CreateBuilder(args);
// 新增的下面这句代码
builder.Services.Insert(0, ServiceDescriptor.Transient<IStartupFilter, AnalysisStartupFilter>());
builder.Services.AddMiddlewareAnalysis();
```
现在再来看看效果，发现变成8个中间件了多了四个

## 参考资料
ASP.NET Core如何知道一个请求执行了哪些中间件：[https://www.cnblogs.com/Ax0ne/p/17300692.html](https://www.cnblogs.com/Ax0ne/p/17300692.html)
