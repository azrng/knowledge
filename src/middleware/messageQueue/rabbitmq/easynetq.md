---
title: EasyNetQ
lang: zh-CN
date: 2023-04-01
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: easynetq
slug: diser3
docsId: '26377719'
---

### 介绍
作者在核心的IBus接口中尽量避免暴露AMQP中的交换机、队列、绑定这些概念，使用者即时不去了解这些概念，也能完成消息的发送接收，但是在某些应用场景下，我们还是需要自定义交换机、队列、绑定这些信息，这个时候通过IAdvanceBus接口实现。

### 连接字符串
    host  这个字段是必选的。如要具体指定你要连接服务器端口，你用标准格式 host:port。假如你省略了端口号，AMQP默认端口是5672。如果连接到RabbitMQ集群，需要指定每一个集群节点用逗号（.）分隔
    virtualhost   默认虚拟主机是'/'
    username  默认是'guest'
    password  默认为'guest'
    requestedHearbeat   默认为10秒钟。没有心跳设置为0
    prefetchcount  默认为50.这个值是在EasyNetQ发送ack之前发送给RabbitMQ的消息数。不限制设置为0（不推荐）. 为了在消费者之间保持公平和平衡设置为1.
    persistentMessages  默认为true。这个决定了在发送消息时采用什么样的delivery_mode。设置为true，RabbitMQ将会把消息持久化到磁盘，并且在服务器重启后仍会存在。设置为false可以提高性能收益。
    timeout  模式值为10秒。不限制超时时间设置为0.当超时事时抛出System.TimeoutException.
完整字符串：host=47.104.255.61;virtualHost=/;username=admin;password=123456;timeout=60

### 消息模式
应用使用rabbitmq需要经过总线接口IBus或者IAdvanceBus，大部分时候我们使用的是IBus，它提供了三种消息模式：Publish/Subscribe, Request/Response和 Send/Receive，可以满足大多数需求。
发布/订阅、发送/接受、

控制台：[https://www.cnblogs.com/shanfeng1000/p/12359190.html](https://www.cnblogs.com/shanfeng1000/p/12359190.html)
进阶：[https://www.cnblogs.com/shanfeng1000/p/13035758.html](https://www.cnblogs.com/shanfeng1000/p/13035758.html)
 
> 官方文档：[https://github.com/EasyNetQ/EasyNetQ/wiki/Quick-Start](https://github.com/EasyNetQ/EasyNetQ/wiki/Quick-Start)
> focus-lei，《[.net core使用EasyNetQ做EventBus](https://www.cnblogs.com/focus-lei/p/9121095.html)》
> 常山造纸农，《[RabbitMQ安装配置和基于EasyNetQ驱动的基础使用](https://www.cnblogs.com/struggle999/p/6937530.html)》


