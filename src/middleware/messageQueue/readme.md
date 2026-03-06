---
title: 概述
lang: zh-CN
date: 2023-10-18
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: gaishu
slug: ittcs9
docsId: '26370584'
---

## 什么是消息队列？
消息（Message）是指在应用间传送的数据。消息可以非常简单，比如只包含文本字符串，也可以更复杂，可能包含嵌入对象。
消息队列（Message Queue）是一种应用间的通信方式，消息发送后可以立即返回，由消息系统来确保消息的可靠传递。消息发布者只管把消息发布到 MQ 中而不用管谁来取，消息使用者只管从 MQ 中取消息而不管是谁发布的。这样发布者和使用者都不用知道对方的存在。

## 使用场景
不需要立即生效的操作拆分出来异步执行，比如发放红包、发短信通知等。这种场景下就可以用 MQ ，在下单的主流程（比如扣减库存、生成相应单据）完成之后发送一条消息到 MQ 让主流程快速完结，而由另外的单独线程拉取MQ的消息（或者由 MQ 推送消息），当发现 MQ 中有发红包或发短信之类的消息时，执行相应的业务逻辑。
 不需要立即获取结果，但是并发量又需要控制的时候，就是要使用消息队列的时候。

## 优点
异步、流量削峰与流控、解耦


## 缺点
> 需要保证高可用：如果mq服务器崩了，就完蛋了
> 数据安全：必须保证数据不能丢失，也就是要考虑最终的一致性，做好补偿机制合理消费。

## 认证和鉴权

主流消息队列的认证和鉴权！:[https://mp.weixin.qq.com/s/FRZfTg5QiX78ww89AoideA](https://mp.weixin.qq.com/s/FRZfTg5QiX78ww89AoideA)

## 常用框架

- [RabbitMQ](https://www.rabbitmq.com/tutorials/tutorial-one-dotnet.html)
- RocketMq
- [Apache Kafka](https://github.com/confluentinc/confluent-kafka-dotnet)
- Redis
- [ActiveMQ](https://github.com/apache/activemq)
- [Azure Service Bus](https://docs.microsoft.com/zh-cn/azure/service-bus-messaging/service-bus-messaging-overview)

### 对比
Kafka
一个非常成熟的消息队列产品，无论在数据可靠性、稳定性和功能特性等方面都可以满足绝大多数场景的需求，而且拥有着极致性能。跟周边生态系统的兼容性是最好的没有之一，尤其在大数据和流计算领域，几乎所有的相关开源软件系统都会优先支持 Kafka。但是其致命伤在于Kafka是为了性能选择了异步批量发送模式，导致延时太高，无法满足在线业务场景，常用于日志数据分析等场景！

RabbitMQ
特点是Messaging that just works，“开箱即用的消息队列”。也就是说，RabbitMQ 是一个相当轻量级的消息队列，非常容易部署和使用。号称是世界上使用最广泛的开源消息队列，其社区资源丰富、对各种开发语言支持友好、还有各种定制化插件，对于.NETer是非常友好的。还有个独特的Exchange设计，非常实用。虽然也有并发不如其他队列高的问题，但是集群下大部分应用场景是毫无问题的，推荐！

RocketMQ
源自阿里的开源消息队列，经历过多次“双十一”考验，它的性能、稳定性和可靠性都是值得信赖的。作为优秀的国产消息队列，近年来越来越多的被国内众多大厂使用。唯一的原罪是为Java开发的国产消息队列，与周边生态系统的集成和兼容程度要略逊一筹，对.NET支持就很不友好，果断放弃不折腾！

ZeroMQ
严格来说 ZeroMQ 并不是消息队列，而是一个基于消息队列的多线程网络库，如果你的需求是将消息队列的功能集成到你的系统进程中，可以考虑使用 ZeroMQ，否则是跟异步化独立架构矛盾的，Pass！

Redis-List
互联网开发必备的Nosql-Redis，其List数据结构就是一个轻巧型的队列。优势是Redis的普及性，缺陷是现代化消息队列很多必备功能和特性缺失，只能满足中小型项目需求！

MSMQ
微软自家重量级队列，内置在Windows Server，除了安装省事儿外，几乎没别的优势，在.NET Core跨平台时代里，已经基本淘汰！

ActiveMQ
最老牌的开源消息队列，想当年是开源消息队列首选，不过眼下已进入老年期，社区不活跃了。无论是功能还是性能，ActiveMQ 都已经与现代的消息队列存在明显的差距，它存在的意义在于兼容那些还在用老系统，比如2013年我给广东电信做外包项目时接入的还是ActiveMQ，该选项可以基本排除！


## 调试工具

### Mqtt.fx
使用说明：[https://blog.csdn.net/Mculover666/article/details/103799033](https://blog.csdn.net/Mculover666/article/details/103799033)
下载地址：[http://www.jensd.de/apps/mqttfx/1.7.1/](http://www.jensd.de/apps/mqttfx/1.7.1/)

