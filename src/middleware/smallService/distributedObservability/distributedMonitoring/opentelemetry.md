---
title: OpenTelemetry说明
lang: zh-CN
date: 2023-09-29
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - OpenTelemetry
---

## 概述

OpenTelemetry 是一个由 CNCF（Cloud Native Computing Foundation）托管的开源项目，旨在为观察性（Observability）提供一套全面的工具，包括度量（Metrics）、日志（Logs）和追踪（Traces）。它的目标是为所有类型的遥测数据提供一种标准化的方法。OpenTelemetry 提供了一套 API 和 SDK，使得开发者可以在他们的应用程序中生成和收集遥测数据。此外，OpenTelemetry 还提供了一套收集器（Collector），可以接收、处理和导出遥测数据，以便于后续的分析和可视化。



OpenTelemetry 的自身定位很明确：数据采集和标准规范的统一，对于数据如何去使用、存储、展示、告警，官方是不涉及的。
OpenTelemetry 要解决的是对可观测性的大一统，它提供了一组 API 和 SDK 来标准化遥测数据的采集和传输，OpenTelemetry 并不想对所有的组件都进行重写，而是最大程度复用目前业界在各大领域常用工具，通过提供了一个安全，厂商中立的能用协议、组件，这样就可以按照需要形成 pipeline 将数据发往不同的后端。  
官网：[https://opentelemetry.io/](https://opentelemetry.io/)

中文文档：[https://opentelemetry.opendocs.io/docs/what-is-opentelemetry/](https://opentelemetry.opendocs.io/docs/what-is-opentelemetry/)

## 功能

检测应用程序生成遥测数据，数据包括

* 跟踪(Traces)：表示分布式系统的请求流，显示服务之间的时间和关系。
* 指标(Metrics)：系统行为随时间变化的数值测量(例如，请求技术、错误率、内存使用情况)
* 日志(Logs)：具有丰富的上下文信息事件的文本记录，结构化日志。

### Traces

`OpenTelemetry Traces` 是 `OpenTelemetry` 提供的一种遥测数据类型，用于记录和描述在分布式系统中的单个操作或工作单元的生命周期。 在 `OpenTelemetry` 中，一个 `Trace` 可以被视为由一系列相关的事件组成的时间线，这些事件被称为 `Spans`。每个 `Span` 可以包含多个属性、注释和事件，用于描述在该 Span 的生命周期中发生的特定操作或事件。 例如，一个 HTTP 请求可以被表示为一个 `Span`，其中包含了请求的开始时间、结束时间、HTTP 方法、URL、状态码等信息。如果这个请求还调用了其他的服务或数据库，那么这些调用也可以被表示为与原始请求 `Span` 相关联的子 `Span`。

> 注意：`Span` 是 `OpenTelemetry` 定义的概念，在 .NET 中使用 `Activity` 表示一个 `Span`。

## 操作

OpenTelemetry 提供库和 SDK，用于将代码（检测）添加到 .NET 应用程序中。这些检测会自动捕获我们感兴趣的跟踪、指标和日志。

### 基础获取统计的数据
在.Net8中可以简单配置获取统计的数据，新建一个WebApi的程序，然后引用下面的包
```csharp
<ItemGroup>
    <PackageReference Include="Microsoft.AspNetCore.OpenApi" Version="8.0.0-rc.1.23421.29"/>
    <PackageReference Include="Swashbuckle.AspNetCore" Version="6.4.0"/>
    <PackageReference Include="OpenTelemetry.Exporter.Prometheus.AspNetCore" Version="1.6.0-rc.1"/>
    <PackageReference Include="OpenTelemetry.Extensions.Hosting" Version="1.6.0"/>
</ItemGroup>
```
然后我们可以注册服务来配置我们监控的信息

```csharp
using OpenTelemetry.Metrics;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 配置监控
builder.Services.AddOpenTelemetry()
    .WithMetrics(x =>
    {
        x.AddPrometheusExporter();

        x.AddMeter("Microsoft.AspNetCore.Hosting", "Microsoft.AspNetCore.Server.Kestrel");
        x.AddView("request-duration", new ExplicitBucketHistogramConfiguration
        {
            Boundaries = new[] { 0, 0.005, 0.01, 0.025, 0.05 }
        });
    });

var app = builder.Build();
```
然后我们就使用我们注入的内容
```csharp
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapPrometheusScrapingEndpoint();
```
这个时候我们启用服务，并访问地址地址：`ip+metrics `就可以看到我们监控的信息，如：`http://localhost:5010/metrics`

可以尝试进行展示好看的仪表盘：https://github.com/dotnet/aspire/tree/main/src/Grafana

### 标准导出可观测性信息

安装nuget包

```xml
<PackageReference Include="OpenTelemetry.Exporter.OpenTelemetryProtocol" />
<PackageReference Include="OpenTelemetry.Instrumentation.AspNetCore" />
<PackageReference Include="OpenTelemetry.Instrumentation.EntityFrameworkCore" />
<PackageReference Include="OpenTelemetry.Instrumentation.GrpcNetClient" />
<PackageReference Include="OpenTelemetry.Instrumentation.Http" />
<PackageReference Include="OpenTelemetry.Instrumentation.Runtime" />
<PackageReference Include="OpenTelemetry.Extensions.Hosting"/>
```

配置统计日志信息

```csharp
builder.Logging.AddOpenTelemetry(logging => logging.AddOtlpExporter());
```

配置OpenTelemetry

```csharp
// 自动从环境变量中取值：OTEL_EXPORTER_OTLP_ENDPOINT
services.AddOpenTelemetry()
        .ConfigureResource(resource => resource.AddService(Environment.ApplicationName))
        .WithMetrics(builder =>
        {
            builder.AddPrometheusExporter(); // 输出 OpenTelemetry metrics 给 Prometheus
            builder.AddRuntimeInstrumentation() // 启用运行时检测
                   .AddAspNetCoreInstrumentation()
                   .AddHttpClientInstrumentation();

            builder.AddOtlpExporter(); // 导出数据使用OpenTelemetry协议(OTLP)。
        })
        .WithTracing(tracing =>
        {
            tracing.AddAspNetCoreInstrumentation()
                   .AddHttpClientInstrumentation()
                   .AddEntityFrameworkCoreInstrumentation();

            tracing.AddOtlpExporter();
        });
```

如果需要导出数据到其他UI界面，比如Asprise等，那么可以通过环境变量配置地址，比如

```
"OTEL_EXPORTER_OTLP_ENDPOINT": "http://localhost:4317",
"DASHBOARD__OTLP__PRIMARYAPIKEY": "apikey"
```

### 汇总介绍

我们将安装以下 NuGet 包：

```shell
# Automatic tracing, metrics
Install-Package OpenTelemetry.Extensions.Hosting

# Telemetry data exporter
Install-Package OpenTelemetry.Exporter.OpenTelemetryProtocol

# Instrumentation packages
Install-Package OpenTelemetry.Instrumentation.Http
Install-Package OpenTelemetry.Instrumentation.AspNetCore
Install-Package OpenTelemetry.Instrumentation.EntityFrameworkCore
Install-Package OpenTelemetry.Instrumentation.StackExchangeRedis
Install-Package Npgsql.OpenTelemetry
```

安装这些 NuGet 包后，就可以配置一些服务了。

```c#
services
    .AddOpenTelemetry()
    .ConfigureResource(resource => resource.AddService(serviceName))
    .WithTracing(tracing =>
    {
        tracing
            .AddAspNetCoreInstrumentation()
            .AddHttpClientInstrumentation()
            .AddEntityFrameworkCoreInstrumentation()
            .AddRedisInstrumentation()
            .AddNpgsql();

        tracing.AddOtlpExporter();
    });
```

- `AddAspNetCoreInstrumentation` - 这将启用 ASP.NET Core 检测。
- `AddHttpClientInstrumentation` - 这样可以检测传出请求。 `HttpClient``
- `AddEntityFrameworkCoreInstrumentation` - 这将启用 EF Core 检测。
- `AddRedisInstrumentation` - 这将启用 Redis 检测。
- `AddNpgsql` - 这将启用 PostgreSQL 检测。

配置完所有这些检测后，我们的应用程序将在运行时开始收集大量有价值的跟踪。

### 自定义Traces

https://mp.weixin.qq.com/s/DAtFrcYfNl6eJPuFZWdXkw

## 参考资料

在 .NET 中使用 OpenTelemetry 进行分布式跟踪简介：https://www.milanjovanovic.tech/blog/introduction-to-distributed-tracing-with-opentelemetry-in-dotnet?utm_source=newsletter&utm_medium=email&utm_campaign=tnw86

## 资料

微服务生产环境故障难调试？OpenTelemetry 了解一下？：[https://cat.aiursoft.cn/post/2023/3/19/troubleshooting-production-issues-get-to-know-opentelemetry](https://cat.aiursoft.cn/post/2023/3/19/troubleshooting-production-issues-get-to-know-opentelemetry)
在.net8中使用OpenTelemetry来metric：[https://mp.weixin.qq.com/s/321ZU2OdO2drFFFIN7Oavw](https://mp.weixin.qq.com/s/321ZU2OdO2drFFFIN7Oavw)
我终于在 .NET 中找到了登录的用途！[https://martinjt.me/2023/07/14/i-finally-found-a-use-for-logging-in-net/](https://martinjt.me/2023/07/14/i-finally-found-a-use-for-logging-in-net/)在错误配置对 OpenTelemetry 的跟踪时获取错误日志的技术。由于导出器在后台运行，即使发生错误，也不会出现在表中，因此事件由EventListener获取。
