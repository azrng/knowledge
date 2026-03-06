---
title: redis消息队列
lang: zh-CN
date: 2021-08-07
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - 无
filename: redisxiaoxiduilie
slug: glrsau
docsId: '29714618'
---
一、消息队列是在消息传输过程汇总保存消息的容器。
为了解决类似于双十一或者其他时候，用户点击按钮访问数据库，并发了过大，超过系统最大负载能力而出现的问题。
通过消息队列，将短时间内高并发产生的事务消息存储在消息队列中，从而削平高峰期的并发事务，改善网站系统的性能。
