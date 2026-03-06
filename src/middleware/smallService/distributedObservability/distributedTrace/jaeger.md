---
title: Jaeger
lang: zh-CN
date: 2023-07-06
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - jaeger
filename: jaeger
slug: oa4w7d
docsId: '72941592'
---

## 介绍
Jaeger 是一个分布式跟踪系统，它基于 OpenTracing 规范进行设计和实现。在 Jaeger 中，跟踪信息通过上下文传递，通常使用父 Span 的上下文作为子 Span 的上下文，并随请求一起传递到下一个服务。

通过在MiniAPI项目中引入Jaeger和OpenTracing的库，来向Jaeger推送跟踪数据，然后通过Jaeger来查看跟踪结果。  
文档：[https://www.jaegertracing.io/docs/1.32/](https://www.jaegertracing.io/docs/1.32/)  
下载地址：[https://www.jaegertracing.io/download/](https://www.jaegertracing.io/download/)

## 安装

### docker

```shell
docker run -d -p 4317:4317 -p 16686:16686 jaegertracing/all-in-one:latest
```

## 资料

[https://mp.weixin.qq.com/s/qPLvGBWP6qgAzhIfyyRU6A](https://mp.weixin.qq.com/s/qPLvGBWP6qgAzhIfyyRU6A)

