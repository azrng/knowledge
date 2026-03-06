---
title: .NET Aspire
lang: zh-CN
date: 2023-11-25
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - aspire
---
## 概述

.NET Aspire 是一个云就绪堆栈，用于构建可观察的、生产就绪的分布式应用程序。

:::tip

.NET Aspire 的业务流程旨在通过简化云原生应用的配置和互连管理来增强**本地开发**体验。官方表示并不是用来替代比如K8s等系统。

:::

官方文档：[https://learn.microsoft.com/zh-cn/dotnet/aspire/get-started/aspire-overview](https://learn.microsoft.com/zh-cn/dotnet/aspire/get-started/aspire-overview)

### 为什么选择

.NET Aspire 旨在改善生成 .NET 云原生应用的体验。它提供了一组一致的工具和模式，可帮助你构建和运行分布式应用。NET Aspire 旨在帮助您：

* 业务流程：Aspire提供了用于运行和连接多项目应用程序以及本地开发环境依赖项的功能。
* 组件：Aspire提供了常用服务的Nuget包，具有标准化接口，可以确保它们与应用一致缺无缝连接
* 工具：Aspire覆盖了适用于VS和CLI的项目模板



Aspire的目的是提供一组抽象，用来简化服务发现、环境变量配置和容器配置的设置，无需处理低级实现细节，这些抽象可以确保多个组件和服务之间的设置保持一致，然后在开发期间轻松管理复杂的应用程序。

## 运行环境

- .NET 8(强依赖，小于此版本无法运行）
- Aspire的工作负载
- Docker Desktop
- VS 2022 17.10或者更高版本

## 安装

```shell
# 确认当前已安装项
dotnet workload list

# 安装Aspire
dotnet workload install aspire

# 更新工作负载
dotnet workload update
```

## 操作

### 项目模板

.NET Aspire 应用遵循围绕默认 .NET Aspire 项目模板设计的标准化结构。大多数 .NET Aspire 应用至少有三个项目：

- **MyFirstAspireApp**：入门应用，可以是任何常见的 .NET 项目，例如 Blazor UI 或最小 API。当应用扩展时，可以向应用添加更多项目，并使用 **.AppHost** 和 **.ServiceDefaults** 项目。
- **MyFirstAspireApp.AppHost**：**.AppHost** 项目用于管理应用的高级业务流程问题。业务流程涉及将应用的各个部分（如 API、服务容器和可执行文件）组合在一起，并设置它们如何相互查找和通信。
- **MyFirstAspireApp.ServiceDefaults**：**.ServiceDefaults** 项目包含默认的 .NET Aspire 应用配置，可以根据需要进行扩展和自定义。这些配置包括设置运行状况检查、OpenTelemetry 设置等问题。

目前有两个 .NET Aspire 入门模板可用于帮助您开始使用此结构：

- **.NET Aspire 应用程序**：仅包含 **AspireSample.AppHost** 和 **AspireSample.ServiceDefaults** 项目的基本入门模板。此模板旨在仅提供供您构建的基本要素。
- **.NET Aspire 初学者应用程序**：此模板包括 **AspireSample.AppHost** 和 **AspireSample.ServiceDefaults** 项目，但也包括样板 UI 和 API 项目。这些项目预先配置了服务发现和常见 .NET Aspire 功能的其他基本示例。

### 快速上手

使用Vs创建.Net Aspire Starter应用程序，或者使用命令行创建

```shell
dotnet new aspire-starter --use-redis-cache --output AspireApp1
```

然后在磁盘上就可以看到Aspire项目，项目内容如下

* AspireApp1.ApiService     --- Api服务，向前端提供数据。此项目依赖于共享的AspireApp1.ServiceDefaults项目
* AspireApp1.AppHost        --- 一个业务流程协调程序，用于连接和配置应用的不同项目和服务，依赖于AspireApp1.ApiService和AspireApp1.Web项目
* AspireApp1.ServiceDefaults   ---Aspire共享项目，用于管理解决方案中复原能力、服务发现、遥测、健康检查等跨项目重复使用的配置
* AspireApp1.Web --- 具有默认 .NET Aspire 服务配置的 ASP.NET Core Blazor 应用项目，此项目依赖于共享的AspireApp1.ServiceDefaults项目

四个目录中，和Aspire关系最密切的项目就是中间的AppHost和ServiceDefaults这两个项目，另外两个项目（ApiService和Web）属于业务性项目。接下来我们分别来说说这两个项目。 

**AppHost**：这个项目从名字上我们就不难看出，这是个宿主项目，官方对这个项目的定义是协调器项目，用于协调Aspire项目中的各种资源。从个人在实践过程中的感觉来说，除了官方说的协调各种资源外，他还具备如下职责：

- 在开发阶段中，他最重要的职责是，做为Aspire的可视化宿主，也叫Dashboard的启动器。
- 在发布阶段，他最重要的职责是，生成可以直接被容器化平台使用的脚本。目前原生支持Azure（毕竟是亲生的），有第三方工具提供了K8s和Docker Compose的支持（ Aspir8）

**ServiceDefaults：**这个项目，属于公共库，他要被ApiService以及Web这两个业务项目引用，并在Program.cs中调用如下方法：

```
builder.AddServiceDefaults();
```

通过这个方法，把Aspire的相关特性，分别注入到两个业务项目中。



可以在启动docker的情况下，然后将**AspireSample.AppHost**项目设置为启动项目，然后运行应用程序，就可以在Aspire仪表盘上看到下面信息

- **资源**：列出 .NET Aspire 应用中所有单个 .NET 项目的基本信息，例如应用状态、终结点地址和加载到的环境变量。

- **控制台**：显示应用中每个项目的控制台输出。

- **结构化**：以表格式显示结构化日志。这些日志还支持基本筛选、自由格式搜索和日志级别筛选。您应该会看到`apiservice` 和 `webfrontend`的日志。您可以通过选择行右端的**“查看**”按钮来展开每个日志条目的详细信息。

- **跟踪**：显示应用程序的跟踪，这些跟踪可以跟踪通过应用程序的请求路径。找到**对 /weather** 的请求，然后选择页面右侧的**“查看**”。仪表板应分阶段显示请求，因为它在应用的不同部分中传输。

  

  ![image-20240525154328740](/dotnet/image-20240525154328740.png)

- **指标**：显示应用公开的各种仪器和仪表及其相应的尺寸。指标会根据筛选条件的可用维度有条件地公开筛选条件。



一个入门项目示例仓库：[https://github.com/microsoftdocs/mslearn-dotnet-cloudnative-devops](https://github.com/microsoftdocs/mslearn-dotnet-cloudnative-devops)

### 已有项目中使用Aspire

官方教程：[https://learn.microsoft.com/zh-cn/dotnet/aspire/get-started/add-aspire-existing-app](https://learn.microsoft.com/zh-cn/dotnet/aspire/get-started/add-aspire-existing-app)

### 前端Js项目处理

将 .NET Aspire 添加到现有应用：前端 JavaScript 项目处理：[https://mp.weixin.qq.com/s/36WTTH9yalbV38c2LOXbuA](https://mp.weixin.qq.com/s/36WTTH9yalbV38c2LOXbuA)

## Visual Studio工具

通过UI界面添加组件包：[https://learn.microsoft.com/zh-cn/dotnet/aspire/fundamentals/setup-tooling?tabs=windows&pivots=visual-studio#add-a-component-package](https://learn.microsoft.com/zh-cn/dotnet/aspire/fundamentals/setup-tooling?tabs=windows&pivots=visual-studio#add-a-component-package)

## 常用术语

### 应用模型

构成分布式应用程序 （[DistributedApplication](https://learn.microsoft.com/en-us/dotnet/api/aspire.hosting.distributedapplication)） 的资源集合。有关更正式的定义，请参阅[定义应用模型](https://learn.microsoft.com/zh-cn/dotnet/aspire/fundamentals/app-host-overview#define-the-app-model)。

### 应用主机项目

负责协调*应用模型*的所有应用程序，比如下面描述了一个具有两个项目和一个Redis缓存的应用程序

```csharp
var builder = DistributedApplication.CreateBuilder(args);

var cache = builder.AddRedis("cache");

var apiservice = builder.AddProject<Projects.AspireApp_ApiService>("apiservice");

builder.AddProject<Projects.AspireApp_Web>("webfrontend")
       .WithReference(cache)
       .WithReference(apiservice);

builder.Build().Run();
```

### 资源

[资源](https://learn.microsoft.com/zh-cn/dotnet/aspire/fundamentals/app-host-overview#built-in-resource-types)表示应用程序的一部分，每个资源必须具有唯一的名称。，无论是 .NET 项目、容器或可执行文件，还是其他一些资源（如数据库、缓存或云服务）（如存储服务）。



公共资源：[https://learn.microsoft.com/zh-cn/dotnet/aspire/fundamentals/app-host-overview#apis-for-adding-and-expressing-resources](https://learn.microsoft.com/zh-cn/dotnet/aspire/fundamentals/app-host-overview#apis-for-adding-and-expressing-resources)

### 引用

引用定义资源之间的连接，表示为依赖关系，比如

```csharp
var cache = builder.AddRedis("cache");

builder.AddProject<Projects.AspireApp_Web>("webfrontend")
       .WithReference(cache);
```

“webfrontend”项目资源使用 WithReference 添加对“缓存”容器资源的依赖项。这些依赖项可以表示连接字符串或服务发现信息。在前面的示例中，将环境变量注入到名为 的“webfronend”资源中。此环境变量包含一个连接字符串，webfrontend 可以使用该字符串通过 .NET Aspire Redis 组件连接到 redis，例如 . `ConnectionStrings__cache` `ConnectionStrings__cache="localhost:62354"`

#### 终结点引用

项目资源之间也可能存在依赖关系，比如下面代码

```csharp
var cache = builder.AddRedis("cache");

var apiservice = builder.AddProject<Projects.AspireApp_ApiService>("apiservice");

builder.AddProject<Projects.AspireApp_Web>("webfrontend")
       .WithReference(cache)
       .WithReference(apiservice);
```

项目到项目的引用是注入支持服务发现的环境变量

| Method                      | Environment variable 环境变量                                |
| :-------------------------- | :----------------------------------------------------------- |
| `WithReference(cache)`      | `ConnectionStrings__cache="localhost:62354"`                 |
| `WithReference(apiservice)` | `services__apiservice__http__0="http://localhost:5455"` `services__apiservice__https__0="https://localhost:7356"` |

添加对“apiservice”项目的引用会导致将服务发现环境变量添加到前端。这是因为通常，项目到项目的通信是通过 HTTP/gRPC 进行的。



可以使用 WithEndpoint 并调用 GetEndpoint 从容器或可执行文件中获取特定终结点：

```csharp
var customContainer = builder.AddContainer("myapp", "mycustomcontainer")
                             .WithHttpEndpoint(port: 9043, name: "endpoint");

var endpoint = customContainer.GetEndpoint("endpoint");

var apiservice = builder.AddProject<Projects.AspireApp_ApiService>("apiservice")
                        .WithReference(endpoint);
```

| Method                    | Environment variable 环境变量                         |
| :------------------------ | :---------------------------------------------------- |
| `WithReference(endpoint)` | `services__myapp__endpoint__0=https://localhost:9043` |

该参数是容器正在侦听的端口。

## Dashboard仪表盘

一个中心化的应用监控面板，，可以显示服务信息以及服务日志、指标和追踪信息。

使用教程：[https://learn.microsoft.com/zh-cn/dotnet/aspire/fundamentals/dashboard/explore](https://learn.microsoft.com/zh-cn/dotnet/aspire/fundamentals/dashboard/explore)  

![image-20240526100739950](/dotnet/image-20240526100739950.png)

该仪表盘界面将开发的时候所有诊断数据汇集在一起，可以方便我们进行故障排查

### 独立部署

独立部署仪表盘：[https://learn.microsoft.com/zh-cn/dotnet/aspire/fundamentals/dashboard/standalone](https://learn.microsoft.com/zh-cn/dotnet/aspire/fundamentals/dashboard/standalone)

通过下面内容可以部署出来一个支持日志、跟踪、指标的Dashboard

```yaml
services:
  aspire_dashboard: # aspire 可观测面板  登录界面的密码去容器内拷贝
    image: mcr.microsoft.com/dotnet/nightly/aspire-dashboard:8.0.0-preview.6
    container_name: aspire_dashboard
    environment:
      - TZ=Asia/Shanghai
      - DASHBOARD__OTLP__AUTHMODE=ApiKey # 认证模式
      - DASHBOARD__OTLP__PRIMARYAPIKEY=rVmuMdaqCEruWEbKANjmcIQMnKIhDiLUYSFHaZAVlMktmwDhMUAPIZyfizmoLuSwAePPVhhPigpJUIsAsPZcwfmaMnBxxRuxatrrHNSOKUxUVGFlYQtGtbqtOPasMvPd # 密钥
    ports:
      - "18888:18888"
      - "4317:18889"
```

### Serilog对接

将日志输出到支持OTLP协议Aspire中展示，安装nuget包

```xml
<ItemGroup>
<PackageReference Include="Serilog.AspNetCore" Version="8.0.0" />
<PackageReference Include="Serilog.Sinks.Async" Version="1.5.0" />
<PackageReference Include="Serilog.Sinks.OpenTelemetry" Version="3.0.0-dev-00298" />
<PackageReference Include="Swashbuckle.AspNetCore" Version="6.4.0" />
</ItemGroup>
```

示例代码如下

```csharp
builder.Host.UseSerilog((hbc, lc) =>
{
    var logLevel = LogEventLevel.Error;
    if (hbc.HostingEnvironment.IsDevelopment())
        logLevel = LogEventLevel.Information;

    lc.ReadFrom.Configuration(hbc.Configuration)
      .MinimumLevel.Override("Microsoft", logLevel)
      .MinimumLevel.Override("System", logLevel)
      .Enrich.FromLogContext()
      .WriteTo.Async(wt =>
      {
          if (hbc.HostingEnvironment.IsDevelopment())
          {
              wt.Debug();
          }

          wt.Console(theme: AnsiConsoleTheme.Code);
          wt.OpenTelemetry(c =>
          {
              c.Protocol = OtlpProtocol.Grpc;
              c.Endpoint = "http://localhost:4317";
              c.Headers = new Dictionary<string, string>
                          {
                              ["x-otlp-api-key"] =
                                  "rVmuMdaqCEruWEbKANjmcIQMnKIhDiLUYSFHaZAVlMktmwDhMUAPIZyfizmoLuSwAePPVhhPigpJUIsAsPZcwfmaMnBxxRuxatrrHNSOKUxUVGFlYQtGtbqtOPasMvPd"
                          };
              c.ResourceAttributes = new Dictionary<string, object>
                                     {
                                         ["service.name"] = builder.Environment.ApplicationName, ["service.version"] = "1.0.0"
                                     };
          });
      });
});
```

## 组件

组件信息：[https://learn.microsoft.com/zh-cn/dotnet/aspire/fundamentals/components-overview?tabs=dotnet-cli]()https://learn.microsoft.com/zh-cn/dotnet/aspire/fundamentals/components-overview?tabs=dotnet-cli



组件必须执行以下操作才能被视为可以使用：

1. 提供详细的架构化配置。
2. 设置运行状况检查以跟踪和响应远程服务运行状况。
3. 提供默认的、可配置的复原模式（重试、超时等），以最大限度地提高可用性。
4. 提供集成的日志记录、指标和跟踪，使组件可观察。

## 部署

[如何部署 .NET 8 的新 .NET Aspire 栈](https://www.bilibili.com/video/BV1CN4y1m7gR?spm_id_from=333.1245.0.0)

## 资料

[在 .NET 中正确测量和可视化度量指标](https://www.bilibili.com/video/BV19a4y167Fr?spm_id_from=333.1245.0.0)

Aspire 的 EF中使用 EF Interceptor 注入：https://mp.weixin.qq.com/s/_LhjQld3QEPViKThBKv-sQ

### 参考资料

快速入门：构建您的第一个 .NET Aspire 应用程序https://www.cnblogs.com/powertoolsteam/p/17835864.html

.NET Aspire 的系列文章：https://qiita.com/takashiuesaka/items/137cb1450c3d9fbc8d1e

https://haacked.com/archive/2024/07/01/dotnet-aspire-vs-docker/比较使用 .NET Aspire 和 Docker 配置 .NET 项目和 PostgreSQL 的步骤。

