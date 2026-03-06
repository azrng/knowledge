---
title: HTTP日志配置
lang: zh-CN
date: 2025-08-24
publish: true
author: 寒冰
isOriginal: true
category:
  - dotNET
tag:
  - http
  - log
---

## 说明

记录HTTP请求和响应能帮助开发者快速排查问题、监控性能并审计用户行为。ASP.NET Core通过内置的HttpLogging中间件提供了开箱即用的支持，您可以根据需求灵活配置和扩展。

本期内容深度涵盖：
*  在ASP.NET Core项目中启用和配置HTTP日志
* 日志选项与设置详解
* 自定义日志与端点级配置
* 敏感数据脱敏技术
* 记录HttpClient发出的请求和响应

## 操作

### 启用HttpLogging

**只需两个简单步骤**：

1️⃣ 在Program.cs中添加中间件：

```csharp
var builder = WebApplication.CreateBuilder(args);

// 启用HTTP日志服务
builder.Services.AddHttpLogging(options =>
{
    options.LoggingFields = HttpLoggingFields.Request | HttpLoggingFields.Response;
});

var app = builder.Build();

// 添加到HTTP请求管道
app.UseHttpLogging();

app.Run();
```

2️⃣ 在appsettings.json调整日志级别：

```csharp
{
  "Logging":{
    "LogLevel":{
      "Default":"Information",
      "Microsoft.AspNetCore":"Warning",
      "Microsoft.AspNetCore.Hosting.Diagnostics":"Warning",
      "Microsoft.AspNetCore.HttpLogging.HttpLoggingMiddleware":"Information"
    }
}
}
```

**输出示例**：

```csharp
info: Microsoft.AspNetCore.HttpLogging.HttpLoggingMiddleware[1]
      Request:
      Protocol: HTTP/1.1
      Method: GET
      Scheme: https
      PathBase: 
      Path: /
      Headers:
        Host: localhost:5001
        User-Agent: Mozilla/5.0...
      Response:
      StatusCode: 200
      Headers:
        Content-Type: text/plain; charset=utf-8
```

### 高级配置技巧

#### 自定义日志字段

```csharp
builder.Services.AddHttpLogging(options =>
{
    options.LoggingFields = 
        HttpLoggingFields.RequestMethod |
        HttpLoggingFields.RequestPath |
        HttpLoggingFields.RequestQuery |
        HttpLoggingFields.RequestHeaders |
        HttpLoggingFields.ResponseStatusCode |
        HttpLoggingFields.Duration;
});
```

#### 限制记录的Header

```csharp
builder.Services.AddHttpLogging(options =>
{
    options.RequestHeaders.Add("X-API-Version");
    options.RequestHeaders.Add("User-Agent");
    options.ResponseHeaders.Add("Content-Type");
});
```

#### 环境差异化配置

```csharp
builder.Services.AddHttpLogging(options =>
{
    // 基础配置
    options.LoggingFields = ...;
    
    // 开发环境记录请求/响应体
    if (builder.Environment.IsDevelopment())
    {
        options.LoggingFields |= HttpLoggingFields.RequestBody | HttpLoggingFields.ResponseBody;
        options.RequestBodyLogLimit = 1024 * 32; // 32 KB
        options.ResponseBodyLogLimit = 1024 * 32;
    }
});
```

### 使用拦截器自定义日志

```csharp
public classCustomLoggingInterceptor : IHttpLoggingInterceptor
{
    public ValueTask OnRequestAsync(HttpLoggingInterceptorContext context)
    {
        // 动态移除敏感Header
        context.HttpContext.Request.Headers.Remove("X-API-Key");
        
        // 添加追踪ID
        context.AddParameter("RequestId", Guid.NewGuid().ToString());
        return ValueTask.CompletedTask;
    }

    public ValueTask OnResponseAsync(HttpLoggingInterceptorContext context)
    {
        // 移除Set-Cookie等敏感Header
        context.HttpContext.Response.Headers.Remove("Set-Cookie");
        return ValueTask.CompletedTask;
    }
}

// 注册拦截器
builder.Services.AddSingleton<IHttpLoggingInterceptor, CustomLoggingInterceptor>();
```

### 端点级日志配置

```csharp
// 禁用特定端点日志
app.MapGet("/health", () => Results.Ok()).DisableHttpLogging();

// 自定义端点日志行为
app.MapPost("/api/orders", (OrderRequest request) => Results.Created())
   .WithHttpLogging(logging =>
   {
       logging.LoggingFields = HttpLoggingFields.RequestBody | HttpLoggingFields.ResponseStatusCode;
   });
```

### 敏感数据脱敏实战

**为何必须脱敏**：

- • 安全风险：日志中的令牌/密码会导致未授权访问
- • 合规要求：GDPR/HIPAA等法规明令保护敏感数据
- • 用户信任：保护隐私是赢得用户信任的基础

#### 解决方案

```csharp
public classSensitiveDataRedactionInterceptor : IHttpLoggingInterceptor
{
    public ValueTask OnRequestAsync(HttpLoggingInterceptorContext context)
    {
        // 路径脱敏
        if (context.TryDisable(HttpLoggingFields.RequestPath))
            context.AddParameter("Path", "[REDACTED]");

        // Header脱敏
        foreach (var header in context.HttpContext.Request.Headers)
            context.AddParameter(header.Key, "[REDACTED]");
        
        return ValueTask.CompletedTask;
    }
}
```

**脱敏后日志示例**：

```csharp
info: Microsoft.AspNetCore.HttpLogging.HttpLoggingMiddleware[1]
      Request:
      Path: [REDACTED]
      Authorization: [REDACTED]
      Method: GET
```

### 记录HttpClient请求

```csharp
public classHttpLoggingHandler : DelegatingHandler
{
    protected override async Task<HttpResponseMessage> SendAsync(
        HttpRequestMessage request, CancellationToken ct)
    {
        // 记录请求
        var traceId = Guid.NewGuid().ToString();
        _logger.LogDebug($"[REQUEST] {traceId}\n{request.Method}: {request.RequestUri}");

        // 执行请求
        var response = awaitbase.SendAsync(request, ct);

        // 记录响应
        _logger.LogDebug($"[RESPONSE] {traceId}\nStatus: {response.StatusCode}");
        return response;
    }
}

// 注册到HttpClient
builder.Services.AddHttpClient<ITodoClient, TodoClient>()
    .AddHttpMessageHandler(provider => 
        new HttpLoggingHandler(provider.GetRequiredService<ILogger>()));
```

**输出示例**：

```
dbug: [REQUEST] 4d251738-5aeb-4342-824e-5d23ddf738a2
      GET: https://jsonplaceholder.typicode.com/todos/50
dbug: [RESPONSE] 4d251738-5aeb-4342-824e-5d23ddf738a2
      Status: 200 OK
```

### 安全日志实践清单

| ✅ 最佳实践              | ❌ 危险做法               |
| ----------------------- | ------------------------ |
| 默认排除敏感数据        | 记录所有Header和Body     |
| 开发环境启用详细日志    | 生产环境记录敏感信息     |
| 使用正则表达式精准脱敏  | 手动过滤敏感字段         |
| 自动化测试验证脱敏规则  | 假设日志不会泄露敏感数据 |
| 按需启用请求/响应体记录 | 全程记录大型Body         |

> 当3AM的生产告警响起时，完善的HTTP日志将是您排查问题的救生索。遵循本文指南，构建既强大又安全的日志系统！

## 摘抄目录

ASP.NET Core HTTP日志终极指南：从基础配置到敏感数据脱敏实战：https://mp.weixin.qq.com/s/VQSUXDpeqFgoaJ4wh5YZ4g