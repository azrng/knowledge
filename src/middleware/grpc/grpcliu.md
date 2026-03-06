---
title: gRPC 流
lang: zh-CN
date: 2023-09-12
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: grpcliu
slug: kvrcdk
docsId: '29772641'
---

## 为什么gRPC 支持流
gRPC 通信是基于 HTTP/2 实现的，它的双向流映射到 HTTP/2 流。HTTP/2 具有流的概念，流是为了实现HTTP/2的多路复用。流是服务器和客户端在HTTP/2连接内用于交换帧数据的独立双向序列，逻辑上可看做一个较为完整的交互处理单元，即表达一次完整的资源请求、响应数据交换流程；一个业务处理单元，在一个流内进行处理完毕，这个流生命周期完结。
特点如下：

- 一个HTTP/2连接可同时保持多个打开的流，任一端点交换帧
- 流可被客户端或服务器单独或共享创建和使用
- 流可被任一端关闭
- 在流内发送和接收数据都要按照顺序
- 流的标识符自然数表示，1~2^31-1区间，有创建流的终端分配
- 流与流之间逻辑上是并行、独立存在
