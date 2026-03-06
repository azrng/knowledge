---
title: Skywalking
lang: zh-CN
date: 2023-10-15
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: skywalking
slug: ob5r42
docsId: '32487702'
---

## 介绍


## 架构简析
![](/common/1644416759609-54d3df8b-31b5-43c4-81d1-f7719ebea1b6.webp)

## 核心组件

#### Skywalking OAP Server
Skywalking收集器，接受写入请求与UI数据查询。

#### Skywalking UI
有调用链路记录、网络拓扑图、性能指标展示等。

#### Skywalking客户端代理
提供了多种语言的SDK（Java, .NET Core, NodeJS, PHP,  Python等），在应用程序进行网络请求的时候进行埋点拦截，整理成需要的指标发送到Skywalking OAP Server

## 安装
可参考：https://www.cnblogs.com/sunyuliang/p/11422576.html

## 参考文档
> 文档地址：[https://www.cnblogs.com/savorboard/p/asp-net-core-skywalking.html](https://www.cnblogs.com/savorboard/p/asp-net-core-skywalking.html)
> [https://mp.weixin.qq.com/s/vqiBMdNJv7si02PjJ2LzTg](https://mp.weixin.qq.com/s/vqiBMdNJv7si02PjJ2LzTg)

[https://mp.weixin.qq.com/s/M37_Xql6II5XEwALF05hIA](https://mp.weixin.qq.com/s/M37_Xql6II5XEwALF05hIA) | Skywalking APM监控系列(一丶.NET+接入Skywalking监听)
