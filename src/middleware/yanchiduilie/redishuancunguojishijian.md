---
title: redis缓存过期事件
lang: zh-CN
date: 2022-07-12
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: redishuancunguojishijian
slug: bdar8s
docsId: '81512453'
---

## 介绍
redis自2.8.0之后版本提供Keyspace Notifications功能，允许客户订阅Pub / Sub频道，以便以某种方式接收影响Redis数据集事件。

## 操作

### 配置
修改redis.config配置开启过期通知功能，然后重启redis，修改方法如下
打开注释：notify-keyspace-events  “Ex”。( 例如，“Kx”表示想监控某个Key的失效事件。 )
注释掉：notify-keyspace-events  ""

### 实现
事件通过 Redis 的订阅与发布功能（pub/sub）来进行分发,
故需要订阅 __keyevent@0__:expired 通道0表示db0 根据自己的dbindex选择合适的数字。
[redis发布订阅](https://www.yuque.com/docs/share/a93bae1b-15fa-4419-90c3-aae33e573daa?view=doc_embed)

## 注意
Redis缓存Key过期通知只能收到的是key，value已经过期无法收到，所以需要在key上标记业务数据。只能通过变相的去实现处理业务数据，比如写入数据的时候写两份，一份作为key存储，一份作为value存储！
这是不可靠的实现? 首先Redis Pub/Sub 是一种并不可靠地消息机制，他不会做信息的存储，只是在线转发，那么肯定也没有ack确认机制，另外只有订阅段监听时才会转发，所以不是可靠的通知。
