---
title: Zipkin
lang: zh-CN
date: 2023-07-06
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: zipkin
slug: wirm5e
docsId: '44227866'
---

## 介绍
Zipkin是由Twitter开源的一款基于Java语言开发的分布式实时数据追踪系统(Distributed Tracking System),其主要功能是采集来自各个系统的实时监控数据。该系统让开发者可通过一个 Web 前端轻松的收集和分析数据，例如用户每次请求服务的处理时间等，可方便的监测系统中存在的瓶颈。

相对于SkyWalking来说相对轻量级，使用相对来说比较偏原生的方式，而且支持Http的形式查询和提交链路数据。

