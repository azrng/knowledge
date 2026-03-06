---
title: 简介
lang: zh-CN
date: 2023-02-08
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: jianjie
slug: wvkklg
docsId: '49682621'
---

## 介绍
首先它要具有队列的特性，再给它附加一个延迟消费队列消息的功能，也就是说可以指定队列中的消息在哪个时间点被消费。

## 使用场景
延迟队列在项目中的应用还是比较多的，尤其像电商类平台：

1. 订单成功后，在30分钟内没有支付，自动取消订单
2. 外卖平台发送订餐通知，下单成功后60s给用户推送短信。
3. 如果订单一直处于某一个未完结状态时，及时处理关单，并退还库存
4. 淘宝新建商户一个月内还没上传商品信息，将冻结商铺等

## 方案

### Redis过期监听
实现方式是：定时任务离线扫描并删除部分过期键；在访问键时惰性检查是否过期并删除过期键。

注意：
不保证在设定的过期时间立即删除并发送通知，数据量大的时候会延迟，在数量达到3w的时候，有些会延迟到120s
不保证一定送达
发送即忘策略，不包含持久化

### RabbitMQ死信
Rabbit 官方推出了延迟投递插件 rabbitmq-delayed-message-exchange ，推荐使用官方插件来做延时消息。

### 时间轮
时间轮是一种很优秀的定时任务的数据结构，然而绝大多数时间轮实现是纯内存没有持久化的。

#### Redisson DelayQueue
Redisson DelayQueue 是一种基于 Redis Zset 结构的延时队列实现。DelayQueue 中有一个名为 timeoutSetName 的有序集合，其中元素的 score 为投递时间戳。

DelayQueue 会定时使用 zrangebyscore 扫描已到投递时间的消息，然后把它们移动到就绪消息列表中。
DelayQueue 保证 Redis 不崩溃的情况下不会丢失消息，在没有更好的解决方案时不妨一试。
在数据库索引设计良好的情况下，定时扫描数据库中未完成的订单产生的开销并没有想象中那么大。
在使用 Redisson DelayQueue 等定时任务中间件时可以同时使用扫描数据库的方法作为补偿机制，避免中间件故障造成任务丢失。

### Hangfire延迟任务

### 计时管理器
