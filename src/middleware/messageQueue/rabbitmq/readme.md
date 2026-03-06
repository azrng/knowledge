---
title: 说明
lang: zh-CN
date: 2023-08-27
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: rabbitmq
slug: lrw7o0
docsId: '26370883'
---

## 说明
实现了高级消息队列协议(AMQP)的开源消息代码软件，由以高性能、健壮以及伸缩性出名的Erlang语言写成。

## 主要的端口
```csharp
4369 -- erlang发现口
5672 --client端通信口
15672 -- 管理界面ui端口
25672 -- server间内部通信口

如何我们要访问rabbitmq管理界面就需要访问：
http://localhost:15672/
 
我们需要连接rabbitmq就需要client端通信端口：
server: amqp://guest:guest@localhost:5672/
```
> 其他详细端口查询官方网站：[此处](https://www.rabbitmq.com/networking.html?__cf_chl_captcha_tk__=d5c748449db4407253ac09ecacff18ed3354715c-1596596042-0-AXJknuCjXnYrYnkcljAnVrSRstM0NIajMsfG4l_mm4CvF0jAYnR8IFdi45Whj1_aI4RG-idiQXvMzU12E6xweK5ZInVR2i-oGQvAtdT2wZ5JDnVPl-01QKfedtmfwDQUz5FxcHXoIrfs92QDvoD4xqEMaaz8Xk3M1-OuP4-rNrEgfnPDvBgcNpngMw4aPoSQwqHbbYbCMyK__daku8BS-7_gVlGWPTYG66XyZedAYErn99NOvpLmqm_M-ycaz0R-wnUDASbtKc4RGQ7Pdmn_u9IYBie5SGXsL_EvhApx3h8-mvh1aSn3g2sGhuuzZMppGdbtkrWvIumOYbMADdzIqR9U8zYzOETsAEvcUP691SRnwkVc445zBqaKdfxRgPan1RI-lv0RiTJdAUm2PAmNvNb6x-XH61lupI8829enXZRG8DlxoMizygsGHCDEt08dBEuyU8uVaST_IYpXDYgRi9Ke6ZlViny2EEjVmNpwZ2klFmzObbOCyXjAfnPhNjviZRnxaIK4rQA6uAI-sQJvs2U)


## 组件的特点

- 可靠性（Reliability）

RabbitMQ 使用一些机制来保证可靠性，如持久化、传输确认、发布确认。

- 灵活的路由（Flexible Routing）

在消息进入队列之前，通过 Exchange 来路由消息的。对于典型的路由功能，RabbitMQ 已经提供了一些内置的 Exchange 来实现。针对更复杂的路由功能，可以将多个Exchange 绑定在一起，也通过插件机制实现自己的 Exchange 。

- 消息集群（Clustering）

多个 RabbitMQ 服务器可以组成一个集群，形成一个逻辑 Broker 。

- 高可用（Highly Available Queues）

队列可以在集群中的机器上进行镜像，使得在部分节点出问题的情况下队列仍然可用。

- 多种协议（Multi-protocol）

RabbitMQ 支持多种消息队列协议，比如 STOMP、MQTT 等等。

- 多语言客户端（Many Clients）

RabbitMQ 几乎支持所有常用语言，比如 Java、.NET、Ruby 等等。

- 管理界面（Management UI）

RabbitMQ 提供了一个易用的用户界面，使得用户可以监控和管理消息 Broker 的许多方面。

- 跟踪机制（Tracing）

如果消息异常，RabbitMQ 提供了消息跟踪机制，使用者可以找出发生了什么。

- 插件机制（Plugin System）

RabbitMQ 提供了许多插件，来从多方面进行扩展，也可以编写自己的插件。

## 消息模型
消费者（consumer）订阅某个队列。生产者（producer）创建消息，然后发布到队列（queue）中，最后将消息发送到监听的消费者。

![](/common/1608789316458-f026d617-974c-42ff-8b89-1afcb76266b0.webp)

## 基本概念
![](/common/1608789670207-de5be96a-13f0-4e04-85b1-bd8b0e034067.webp)

- Message
消息，消息是不具名的，它由消息头和消息体组成。消息体是不透明的，而消息头则由一系列的可选属性组成，这些属性包括routing-key（路由键）、priority（相对于其他消息的优先权）、delivery-mode（指出该消息可能需要持久性存储）等。
- Publisher
消息的生产者，也是一个向交换器发布消息的客户端应用程序。
- Exchange
交换器，用来接收生产者发送的消息并将这些消息路由给服务器中的队列，把消息路由到一个或者多个队列中
- Binding
绑定，用于消息队列和交换器之间的关联。一个绑定就是基于路由键将交换器和消息队列连接起来的路由规则，所以可以将交换器理解成一个由绑定构成的路由表。决定交换器的消息应该发送到哪个队列上。
- Queue
消息队列，用来保存消息直到发送给消费者。它是消息的容器，也是消息的终点。一个消息可投入一个或多个队列。生产者把消息放到队列中，消费者从队列中获取数据。
- Connection
网络连接，比如一个TCP连接。
- Channel
信道，多路复用连接中的一条独立的双向数据流通道。信道是建立在真实的TCP连接内地虚拟连接，AMQP 命令都是通过信道发出去的，不管是发布消息、订阅队列还是接收消息，这些动作都是通过信道完成。因为对于操作系统来说建立和销毁 TCP 都是非常昂贵的开销，所以引入了信道的概念，以复用一条 TCP 连接。
- Consumer
消息的消费者，表示一个从消息队列中取得消息的客户端应用程序。
- Virtual Host
虚拟主机，表示一批交换器、消息队列和相关对象。虚拟主机是共享相同的身份认证和加密环境的独立服务器域。每个 vhost 本质上就是一个 mini 版的 RabbitMQ 服务器，拥有自己的队列、交换器、绑定和权限机制。vhost 是 AMQP 概念的基础，必须在连接时指定，RabbitMQ 默认的 vhost 是 / 。
- Broker
表示消息队列服务器实体。
> 一个交换机可以有多个路由键
> 一个队列可以有多个路由键


## 资料
[https://mp.weixin.qq.com/s/0NJClZdZJGAs6GkABson-A](https://mp.weixin.qq.com/s/0NJClZdZJGAs6GkABson-A) | .Net Core & RabbitMQ 死信队列
[https://mp.weixin.qq.com/s/WzZBNGFGMFmmwdaW5pf0jQ](https://mp.weixin.qq.com/s/WzZBNGFGMFmmwdaW5pf0jQ) | 它把RabbitMQ的复杂全屏蔽了，我朋友用它后被老板一夜提拔为.NET架构师
[https://mp.weixin.qq.com/s/J-ZKimtgC4eAYAXRXXttZA](https://mp.weixin.qq.com/s/J-ZKimtgC4eAYAXRXXttZA) | .Net Core&RabbitMQ消息存储可靠机制
[https://mp.weixin.qq.com/s/U1gi6v42FOCrpFOeYkMzAw](https://mp.weixin.qq.com/s/U1gi6v42FOCrpFOeYkMzAw) | .NET Core 中使用 RabbitMQ 六种队列模式
[https://mp.weixin.qq.com/s/TvbyC-nulUrBuOkuttCEpg](https://mp.weixin.qq.com/s/TvbyC-nulUrBuOkuttCEpg) | 32张图带你解决RocketMQ所有场景问题-《高性能利器》
[https://mp.weixin.qq.com/s/3lEWQMos8UmY3xBAHOSiCQ](https://mp.weixin.qq.com/s/3lEWQMos8UmY3xBAHOSiCQ) | 理论修炼之RabbitMQ，消息队列服务的稳健者
[https://mp.weixin.qq.com/s/IMkQ_PkeHCUK5QoBv7mRXg](https://mp.weixin.qq.com/s/IMkQ_PkeHCUK5QoBv7mRXg) | 面霸篇：MQ 的 5 大关键问题详解
[https://www.cnblogs.com/zhixie/p/14918619.html](https://www.cnblogs.com/zhixie/p/14918619.html) | 『假如我是面试官』RabbitMQ我会这样问 - Java旅途 - 博客园
[https://mp.weixin.qq.com/s/y0dHiZaANcXD6nNBFgJFng](https://mp.weixin.qq.com/s/y0dHiZaANcXD6nNBFgJFng) | RabbitMQ 高可用集群搭建及电商平台使用经验总结
死信队列 延迟队列 [https://www.cnblogs.com/wei325/p/15204179.html](https://www.cnblogs.com/wei325/p/15204179.html)

[https://mp.weixin.qq.com/s/8opt_fC9-9rRQMm_X3l8wQ](https://mp.weixin.qq.com/s/8opt_fC9-9rRQMm_X3l8wQ) | 如何在C#中使用Channels进行异步排队
[https://mp.weixin.qq.com/s/EEWhT95yMERLljqNjzyaVA](https://mp.weixin.qq.com/s/EEWhT95yMERLljqNjzyaVA) | .NET 6 优先队列 PriorityQueue 实现分析
[https://mp.weixin.qq.com/s/iWKRWeJFl1KLNT-WJUCTtw](https://mp.weixin.qq.com/s/iWKRWeJFl1KLNT-WJUCTtw) | MQ | 消息队列核心基础学习总结
[https://mp.weixin.qq.com/s/TCT0536_iW4kzBV2l0gyYw](https://mp.weixin.qq.com/s/TCT0536_iW4kzBV2l0gyYw) 封装分布式事件总线

在`ASP.NET Core`微服务架构下使用RabbitMQ如何实现CQRS模式https://www.cnblogs.com/powertoolsteam/p/17951775

api中使用rabbitmq：https://mp.weixin.qq.com/s/5G7Malo_h4z3u52Knzrvew

https://mp.weixin.qq.com/s/5G7Malo_h4z3u52Knzrvew | 在 WebApi 项目中快速开始使用 RabbitMQ

### 系列教程

[https://mp.weixin.qq.com/s/Xo3f70EXkd1_61PWShc_2g](https://mp.weixin.qq.com/s/Xo3f70EXkd1_61PWShc_2g) | 万字长文：从 C# 入门学会 RabbitMQ 消息队列编程

开源一款功能强大的 .NET 消息队列通讯模型框架 Maomi.MQ:[https://mp.weixin.qq.com/s/GYN40Mh_tec-06ExNDqr5w](https://mp.weixin.qq.com/s/GYN40Mh_tec-06ExNDqr5w)
