---
title: 结构化日志
lang: zh-CN
date: 2022-02-08
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: jiegouhuarizhi
slug: giz49x
docsId: '54558231'
---

## 场景
- 实现日志告警
- 实现上下文的关联
- 实现追踪系统集成

## 好处

- 易于检索
- 易于分析统计

## 记录内容
标准化日志事件属性使您能够充分利用日志搜索和分析工具。在适用的情况下使用以下属性：

| ApplicationName | 生成日志事件的应用程序的名称 |
| --- | --- |
| ClientIP | 发出请求的客户端的 IP 地址 |
| CorrelationId | 可用于跨多个应用程序边界跟踪请求的 ID |
| Elapsed | 操作完成所用的时间（以毫秒为单位） |
| EventType | 用于确定消息类型的消息模板的哈希值 |
| MachineName | 运行应用程序的机器的名称 |
| Outcome | 手术的结果 |
| RequestMethod | HTTP 请求方法，例如 POST |
| RequestPath | HTTP 请求路径 |
| SourceContext | 日志源自的组件/类的名称 |
| StatusCode | HTTP 响应状态码 |
| UserAgent | HTTP 用户代理 |
| Version | 正在运行的应用程序的版本 |

上面的很多属性都来自于 Serilog 自己的扩展，例如Serilog Timings[3]（用于计时操作）和Serilog 请求日志记录[4]。

## 资料
[3] Serilog Timings: https://github.com/nblumhardt/serilog-timings
[4] Serilog 请求日志记录: https://github.com/serilog/serilog-aspnetcore
 
