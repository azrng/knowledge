---
title: StreamJsonRpc 
lang: zh-CN
date: 2025-06-08
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - json
  - stream
---

## 概述

StreamJsonRpc 是微软开发的一个开源库，用于在 .NET 平台中实现基于 JSON-RPC 2.0 规范 的远程过程调用（RPC）。它通过流（如管道、网络流等）实现高效的跨进程或跨网络通信，特别适用于需要轻量级、灵活通信的场景。以下是对 StreamJsonRpc 的详细介绍，结合你提供的参考文章中的关键点：

## 适用场景

- 微服务间通信

  ：轻量级替代 gRPC 或 REST。

- AI应用：ModelContextProtocol(MCP)和Agent2Agent(A2A)协议都是使用JSON-RPC 2.0。

- 桌面应用插件系统

  ：主进程与插件进程通信。

- 实时应用

  ：如聊天、实时数据推送（结合 WebSocket）。

- 跨语言集成

  ：通过标准 JSON-RPC 与其他语言（如 Python、JavaScript）交互。

## 操作

安装nuget包：StreamJsonRpc

### ASP.NET Core使用

参考文章展示了如何将 StreamJsonRpc 集成到 ASP.NET Core 应用中，实现基于 HTTP 或 WebSocket 的 RPC 通信。以下是关键步骤，定义 RPC 接口

```csharp
public interface IGreeterRpcService
{
    Task<string> GreetAsync(string name);
}
```

实现服务

```csharp
public class GreeterRpcService : IGreeterRpcService
{
    public Task<string> GreetAsync(string name) => Task.FromResult($"Hello, {name}!");
}
```

**配置 ASP.NET Core 中间件** 使用 `UseWebSockets()` 启用 WebSocket 支持，并处理 RPC 请求：

```csharp
app.UseWebSockets();

app.Use(async (context, next) =>
{
    if (context.WebSockets.IsWebSocketRequest)
    {
        using var webSocket = await context.WebSockets.AcceptWebSocketAsync();
        var service = new GreeterRpcService();
        await StreamJsonRpc.Attach(webSocket, service);
    }
    else await next();
});
```

客户端实现

客户端通过 WebSocket 或其他流连接到服务端，并调用远程方法

```csharp
var webSocket = new ClientWebSocket();

await webSocket.ConnectAsync(new Uri("ws://localhost:5000"), CancellationToken.None);
var greeter = StreamJsonRpc.JsonRpc.Attach<IGreeterRpcService>(webSocket);

string result = await greeter.GreetAsync("World");

Console.WriteLine(result); // 输出 "Hello, World!"
```

## 资料

- 官方文档：https://github.com/microsoft/vs-streamjsonrpc

- JSON-RPC 2.0 规范：jsonrpc.org

- 示例项目：https://github.com/tpeczek/Demo.AspNetCore.StreamJsonRpc