---
title: Seq
lang: zh-CN
date: 2023-07-27
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: seq
slug: xz72rx
docsId: '73442318'
---

## 概述
[Seq](https://datalust.co/seq) 是为结构化日志数据构建的自托管搜索、分析和警报服务器。 它可以免费用于本地开发。 它为结构化日志数据提供高级搜索和过滤功能。
官网：[https://datalust.co/seq](https://datalust.co/seq)
文档：[https://docs.datalust.co/docs](https://docs.datalust.co/docs)

## 支持组件

- Serilog
- Microsoft.Extensions.Logging
- NLog
- log4Net

## 操作
### Serilog对接

安装nuget包

```csharp
<PackageReference Include="Serilog.AspNetCore" Version="8.0.0" />
<PackageReference Include="Serilog.Sinks.Seq" Version="6.0.0" />
```

配置我们的appsettings.Development.json文件以使用 Seq 接收器
```csharp
{
  "Serilog": {
    "Using": [ "Serilog.Sinks.Console", "Serilog.Sinks.File" ],
    "MinimumLevel": {
      "Default": "Information",
      "Override": {
        "Microsoft": "Warning",
        "System": "Warning"
      }
    },
    "WriteTo": [
      { "Name": "Console" },
      {
        "Name": "File",
        "Args": {
          "path": "./logs/log-.txt",
          "rollingInterval": "Day",
          "rollOnFileSizeLimit": true,
          "formatter": "Serilog.Formatting.Compact.CompactJsonFormatter, Serilog.Formatting.Compact"
        }
      },
      // 新增了这一节
      {
        "Name": "Seq",
        "Args": { "serverUrl": "http://localhost:5341" }
      }
    ],
    "Enrich": [ "FromLogContext", "WithMachineName", "WithThreadId" ]
  },
  "AllowedHosts": "*"
}
```
在Program中使用配置

```csharp
builder.Host.UseSerilog((_, config) => config.ReadFrom.Configuration(builder.Configuration));
```

或者使用硬编码配置方案

```c#
Log.Logger = new LoggerConfiguration()
                .MinimumLevel.Debug()
				.Enrich.FromLogContext() // 注册日志上下文
                .WriteTo.Console(new CompactJsonFormatter()) // 输出到控制台
                .WriteTo.Seq("http://localhost:5341/")
                .CreateLogger();
```

### 借助OpenTelemetry使Logger输出Seq

从OpenTelemetry引入日志记录：[https://docs.datalust.co/docs/ingestion-with-opentelemetry](https://docs.datalust.co/docs/ingestion-with-opentelemetry)

OpenTelemetry使用文档：[https://docs.datalust.co/docs/opentelemetry-net-sdk](https://docs.datalust.co/docs/opentelemetry-net-sdk)

此处只用来演示对接OpenTelemetry的logs效果，需要安装nuget包

:::tip

还没搞好

:::

```xml
<ItemGroup>
    <PackageReference Include="OpenTelemetry.Exporter.OpenTelemetryProtocol" Version="1.8.1"/>
    <PackageReference Include="OpenTelemetry.Extensions.Hosting" Version="1.8.1"/>
    <PackageReference Include="OpenTelemetry.Instrumentation.AspNetCore" Version="1.8.1"/>
</ItemGroup>
```

```csharp
builder.Services.AddLogging(logging => logging.AddOpenTelemetry(options =>
{
    options.SetResourceBuilder(ResourceBuilder.CreateEmpty()
                                              .AddService(builder.Environment.ApplicationName) // 设置服务名
                                              .AddAttributes(new Dictionary<string, object>
                                                             {
                                                                 // 添加资源属性
                                                                 ["deployment.environment"] = "development"
                                                             }));

    // Some important options to improve data quality
    options.IncludeScopes = true;
    options.IncludeFormattedMessage = true;

    options.AddOtlpExporter(exporter =>
    {
        exporter.Protocol = OtlpExportProtocol.HttpProtobuf;
        exporter.Endpoint = new Uri("http://localhost:5341/ingest/otlp/v1/logs");
        exporter.Headers = "X-Seq-ApiKey=12345678901234567890"; // 配置apiKey
    });

}));
```

## 安装

我们通常在 docker 中启动 Seq 作为单独的 docker-compose 文件 ( docker-compose-logging.hml) 的一部分

```csharp
version: '3.4'

services:
  seq:
    image: datalust/seq:latest
    container_name: seq
    environment:
      - ACCEPT_EULA=Y
    ports:
      - 5341:5341
      - 8081:80
```

docker命令

```csharp
docker run  --name seq -d -e ACCEPT_EULA=Y -p 8081:80 -p 5341:5341 datalust/seq
```

