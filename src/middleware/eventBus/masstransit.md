---
title: MassTransit
lang: zh-CN
date: 2023-10-19
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: masstransit
slug: fxchnp
docsId: '100489651'
---

## 概述
MassTransit 是一个用于 .NET 的开源分布式应用程序框架，它在受支持的消息传输之上提供一致的抽象。MassTransit 提供的接口降低了基于消息的应用程序复杂性，并允许开发人员将精力集中在增加业务价值上。

文档地址：[https://masstransit.io/](https://masstransit.io/)



有些场景无法避免的需要实时、同步场景下进行，可以借助Saga事务来解决这个困惑。

## 功能

* 基于消息路由的发布/订阅
* 异常重试
* 支持内存单元测试
* 支持OTEL去实现可观测性
* 支持依赖注入
* 支持延迟传输、Quartz.Net、Hangfire
* 支持Sagas、状态机
* 支持补偿分布式、容错时间编排

## 安装

### Rabbitmq

```shell
docker run -p 15672:15672 -p 5672:5672 masstransit/rabbitmq
```

## 资料

[https://mp.weixin.qq.com/s/hhqSMErNDcBr7Dej3N9vIA](https://mp.weixin.qq.com/s/hhqSMErNDcBr7Dej3N9vIA) | AspNetCore&MassTransit Courier实现分布式事务
本地代码存储：\开发\docs\AspNetCore&MassTransit Courier实现分布式事务.png

[https://mp.weixin.qq.com/s/l8Odd4qCHC2wiO7FZUHpeg](https://mp.weixin.qq.com/s/l8Odd4qCHC2wiO7FZUHpeg) | MassTransit中Request&Response基本使用
本地代码存储：\开发\docs\MassTransit中Request&Response基本使用.png

.Net分布式应用框架：[https://mp.weixin.qq.com/s/pgrpX8YgnJtSYvtlPS-DTg](https://mp.weixin.qq.com/s/pgrpX8YgnJtSYvtlPS-DTg)

分布式事件总线：https://www.milanjovanovic.tech/blog/using-masstransit-with-rabbitmq-and-azure-service-bus

使用 MassTransit 的请求响应消息传递模式：https://www.milanjovanovic.tech/blog/request-response-messaging-pattern-with-masstransit?utm_source=newsletter&utm_medium=email&utm_campaign=tnw87
