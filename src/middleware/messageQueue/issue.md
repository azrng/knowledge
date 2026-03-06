---
title: 常见问题
lang: zh-CN
date: 2021-05-14
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: changjianwenti
slug: lnx4uo
docsId: '44443756'
---
## 如何防止消息重复消费

在生产方根据业务特点生成消息ID，例如：给用户添加因为下单而赠送积分的消息ID，就可以根据userid_orderid积分数量来生成唯一的消息ID。
通过该消息ID，消费端就可以把已经消费的消息ID存储到本地或者存储到redis中，如果消费端是多个消费者在并行进行消费，在判断重复消息的时候你会需要锁来保证同样数据的顺序化。
