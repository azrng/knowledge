---
title: Rabbitmq图例
lang: zh-CN
date: 2023-04-01
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: rabbitmqtuli
slug: kk8k6d
docsId: '29412212'
---
![image.jpeg](/common/1609400262296-95dbc05d-da59-4ccd-9cef-143fcd0c9067.jpeg)



消息从生产=>消息的整个流程

![image.jpeg](/common/1609400262008-2904c994-035a-4957-9029-f4e39d86d350.jpeg)



Note：首先这个过程走分三个部分，1、客户端（生产消息队列），2、RabbitMQ服务端（负责路由规则的绑定与消息的分发），

3、客户端（消费消息队列中的消息）

![image.jpeg](/common/1609400262016-2d013322-70ec-43b0-b671-8bcc4045b388.jpeg)



Note:由图可以看出，一个消息可以走一次网络却被分发到不同的消息队列中，然后被多个的客户端消费，那么这个过程就是RabbitMQ的核心机制，RabbitMQ的路由类型与消费模式
