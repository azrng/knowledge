---
title: 说明
lang: zh-CN
date: 2023-10-17
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: signalr
slug: kl3p1r
docsId: '32030064'
---

## 概述
SinalR for ASP.Net Core 是 SignalR 的浴火重生版，允许你在 ASP.Net Core 中实现实时通讯，这里的 `实时` 意味着双方都能快速的感知对方发来的消息，比如：一旦 server 端有需要推送的内容将会直接 push 到 client，这和原始的 http 单向请求有着本质的区别。

官方文档：[https://docs.microsoft.com/zh-cn/aspnet/core/signalr/introduction?view=aspnetcore-3.1](https://docs.microsoft.com/zh-cn/aspnet/core/signalr/introduction?view=aspnetcore-3.1)  
中心文档：[https://docs.microsoft.com/zh-cn/aspnet/core/signalr/hubs?view=aspnetcore-3.1 ](https://docs.microsoft.com/zh-cn/aspnet/core/signalr/hubs?view=aspnetcore-3.1) 
配置文件：[https://docs.microsoft.com/zh-cn/aspnet/core/signalr/configuration?view=aspnetcore-3.1&tabs=dotnet](https://docs.microsoft.com/zh-cn/aspnet/core/signalr/configuration?view=aspnetcore-3.1&tabs=dotnet)


## 场景

- 需要从服务器进行高频率更新的应用。 示例包括游戏、社交网络、投票、拍卖、地图和 GPS 应用。
- 仪表板和监视应用。 示例包括公司仪表板、即时销售更新或旅行警报。
- 协作应用。 协作应用的示例包括白板应用和团队会议软件。
- 需要通知的应用。 社交网络、电子邮件、聊天、游戏、旅行警报和很多其他应用都需使用通知。

## 连接方式

默认采用的回落机制来进行传输和连接，也可以禁用回落机制，只采用一种传输方式。  
Long polling => Server Sent Events => Web Scoket，优先选择传输最好的
![image.png](/common/1614392596148-7270f71a-b34e-4f59-a3c2-5d9e788fc0fe.png)

## 概念

RPC：远程调用，优点就是可以像调用本地方法一样调用远程服务
signalr采用rpc范式来进行客户端与服务器端之间的通信。服务端调用客户端是利用底层传输实现的。

Hub
是signalr的一个组件，运行在后台，是服务器端的一个类
Hub使用RPC接受从客户端发来的消息，也能将消息发送到客户端，所以它就是一个通信的中心。
signalr可以将参数序列化和反序列化，这个参数被序列化的格式叫做Hub协议，所以Hub协议就是一种用来序列化和反序列化的格式，这个协议默认是JSON，也可以是MessagePack(二进制，更紧凑，处理起来更快)，也可以扩展其他协议。

横向扩展
如果后台服务要搭建负载均衡，使用web socket时候并没有什么问题，但是在长轮询的情况下，需要使用Sticky Sessions (粘性会话).

## 资料

> 系列博客推荐：[https://www.cnblogs.com/qianxingmu/tag/SignalR/](https://www.cnblogs.com/qianxingmu/tag/SignalR/)

