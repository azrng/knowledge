---
title: 说明
lang: zh-CN
date: 2023-10-18
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: readme
slug: vlgr58uq099gk26d
docsId: '112774377'
---

## 概述
一种发布/订阅结构，通过发布订阅模式解决业务之间的解耦，订阅者之间相互不认识也互不干扰。

### 事件总线类型
跨进程事件总线：发布方与订阅方不在同一个进程中，订阅方是一个新的请求。组件：CAP、MasaFramework
进程内事件总线：发布方与订阅方在同一个进程中，订阅方出错会引起当前请求的出错。组件：Mediatr、MasaFramework

### 常用的模型
事件总线常用的模型：内存模型、传统的队列模型、发布-订阅模型。

- 内存模型：进程内模型，事件总线在内部遍历消费者列表传递数据
- 队列模型：消息或者事件持久化到传统消息队列(Queue)即返回，以实时性降低换取吞吐能力提升
- 发布-订阅模型：事件源(EventSource)得到强化，出现如分布式、持久化、消费复制/分区等特性。

### 事务类型

最终一致性、 saga、 tcc 

## 对比消息队列
事件总线(EventBus)是一个模式，是事件集散中心，负责收集、散发事件，但是它本身不消费事件。
mq是一种技术，一般是事件处理者，接收到事件之后，内部消费掉。

事件总线是一种消息传递的模型，它提供了一种架构，用于实现多个系统之间消息传递。消息队列是一种消息传递的机制，它将消息从发送方发送到接收方的队列中，以便在接收时进行处理。事件总线可以使用消息队列来实现。事件总线将消息发布到消息队列，然后交给消费者来处理。

一个不恰当例子：
消息队列=美团骑手。
消息总线=本地外卖骑手管理公司，统一接各大外卖平台的单子然后分发给骑手，可以发给美团骑手，但是也可以发给饿了吗骑手！

## 常用框架

- [MassTransit](https://github.com/MassTransit/MassTransit)
- [NServiceBus](https://github.com/Particular/NServiceBus)
- [WolverineFx ](https://www.nuget.org/packages/WolverineFx)
- [CAP](https://github.com/dotnetcore/CAP)
- Rabbitmq
- Jaina
- MediatR
- SlimMessageBus

## 资料
开源项目示例：[https://github.com/EasilyNET/EasilyNET/tree/1.5.1/src/EasilyNET.RabbitBus](https://github.com/EasilyNET/EasilyNET/tree/1.5.1/src/EasilyNET.RabbitBus)

事件总线：https://dotnet.libhunt.com/slimmessagebus-alternatives

在 .NET 8 中使用 WireMock.NET 进行集成测试：https://mp.weixin.qq.com/s/GX0J3sSwFU1BmPULY0WoLQ
