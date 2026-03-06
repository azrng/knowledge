---
title: NBomber压测
lang: zh-CN
date: 2023-03-26
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: nbomberyace
slug: yrxlhn
docsId: '70054450'
---

## 概述
NBomber是一个开源的 .NET 框架，开源协议是Apache 2.0， NBomber 用于对多种服务进行负载测试，包括 Web、消息队列、数据库等。  今年5月份发布了 NBomber 2.0版本。NBomber 类似于JMeter，但是和JMeter 不一样的地方是， NBomber 是通过F#/C#/JSON 代码来表达测试场景。

1. NBomber 背后的主要原因是为编写负载测试提供了一个**轻量级**框架，您可以使用它来测试**任何**系统并模拟**任何**生产工作负载。我们只想提供一些抽象，以便我们可以描述任何类型的负载，并且仍然有一个简单、直观的 API。
2. 另一个目标是提供构建块，通过应用任何复杂的负载分布来验证您的 POC（概念验证）项目。
3. 使用 NBomber，您可以测试任何 PULL 或 PUSH 系统（HTTP、WebSockets、GraphQl、gRPC、SQL Databse、MongoDb、Redis 等）。
4. 使用 NBomber，**您可以轻松地将一些集成测试转换为负载测试**。

仓库地址：[https://github.com/PragmaticFlow/NBomber](https://github.com/PragmaticFlow/NBomber)

## 优点
NBomber 作为一个现代框架提供：

- 零依赖协议（HTTP/WebSockets/AMQP/SQL）
- 对语义模型的零依赖（Pull/Push）
- 非常灵活的配置和非常简单的 API (F#/C#/JSON)
- 集群支持
- 实时报告
- CI/CD 集成
- 数据馈送支持

## 操作

### 基本操作
创建一个控制台，引用组件包
```csharp
<PackageReference Include="NBomber" Version="2.1.5" />
```
代码
```csharp
var step = Step.Create("step", async context =>
{
    // you can define and execute any logic here,
    // for example: send http request, SQL query etc
    // NBomber will measure how much time it takes to execute your logic

    await Task.Delay(TimeSpan.FromSeconds(1));
    return Response.Ok();
});

// second, we add our step to the scenario
var scenario = ScenarioBuilder.CreateScenario("hello_world", step);

NBomberRunner.RegisterScenarios(scenario)
     .Run();
```
行测试后，您将获得一份报告，文件夹下有有4种格式（txt、csv、html、md）的报告，其中Html 页面的报告比较直观.

## 资料
[https://mp.weixin.qq.com/s/n3uWijjb7KwVHcxFIW1ZTw](https://mp.weixin.qq.com/s/n3uWijjb7KwVHcxFIW1ZTw) | 开源的负载测试/压力测试工具 NBomber
