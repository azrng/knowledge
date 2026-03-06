---
title: MCP
lang: zh-CN
date: 2025-04-03
publish: true
author:  azrng
isOriginal: true
category:
  - ai
tag:
  - mcp
---

## 概述

MCP（Model Context Protocol，模型上下文协议）是一种开放协议，由 Anthropic 在 2024 年推出。它就像 AI 应用的“USB-C 接口”，让大型语言模型（LLM）能够安全、高效地连接外部数据源和工具。通过 MCP，AI 应用可以访问数据库、文件、API 等资源，还能调用各种工具来执行任务。简单来说，MCP 就是 AI 的“通用翻译器”，让 AI 能更好地与外部世界互动。



MCP 的主要目的在于解决当前 AI 模型因数据孤岛限制而无法充分发挥潜力的难题，MCP 使得 AI 应用能够安全地访问和操作本地及远程数据，为 AI 应用提供了连接万物的接口。

MCP 官方文档：https://modelcontextprotocol.io/introduction

各个 clients 对 MCP 的支持情况：https://modelcontextprotocol.io/clients



MCP 之后又一 AI Agent 协议刷屏了：AG-UI 协议架构设计剖析：https://mp.weixin.qq.com/s/69WNlIh2E6kr6BiSRFMpuA

模型上下文协议（MCP）：基于Python的端到端实践教程：https://mp.weixin.qq.com/s/5kaMv46SOTxvuWe8itq6kQ

## Mpc商店

mcpstore：[https://www..site/](https://www.mcpstore.site/)

smithery：https://smithery.ai/

魔塔社区：https://modelscope.cn/mcp

AIbase：https://mcp.aibase.cn/explore

## mcp-containers

`mcp-containers` 通过容器化封装实现 MCP 服务器的工业化部署，其技术特性包括：分钟级服务部署能力、持续集成支持的版本更新机制、符合企业级要求的安全架构。该方案已成为 AI 开发者实现复杂系统集成的基础设施，有效支撑从原型验证到生产部署的全流程需求。

仓库地址：https://github.com/metorial/mcp-containers

## 代码使用

### Python Sdk

MCP Python SDK：MCP Client 和 Server 官方 SDK：https://github.com/modelcontextprotocol/python-sdk



安装依赖包

```shell
uv add "mcp[cli]"
```

### .Net Sdk

官方 C# SDK 由原来的 mcpdotnet 发展而来，基于 Microsoft.Extensions.AI 实现。

仓库地址：[https://github.com/modelcontextprotocol/csharp-sdk](https://github.com/modelcontextprotocol/csharp-sdk)

文档地址：[https://modelcontextprotocol.github.io/csharp-sdk/api/ModelContextProtocol.html](https://modelcontextprotocol.github.io/csharp-sdk/api/ModelContextProtocol.html)



[Semantic Kernel也能充当MCP Client](https://mp.weixin.qq.com/s/FTXTZUWwU45sefqMjq6fUw)

如何把ASP.NET Core WebApi打造成Mcp Server：https://mp.weixin.qq.com/s/0fygcmuxZKWBIuAS2oSK4g
