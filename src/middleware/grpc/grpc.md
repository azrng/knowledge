---
title: gRPC
lang: zh-CN
date: 2023-10-18
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: grpc
slug: piprwr
docsId: '29770924'
---

## 概述
![image.png](/common/1625569084899-bc895ae4-ce5b-4750-95fc-9d1dadf23b27.png)
gRPC是一个由google开发的，跨语言的，高性能远程调用框架，使客户端和服务端应用程序可以透明的进行通讯，并简化了连接系统的构建，使用http/2作为通信协议，使用protocol buffers作为序列化协议。客户端应用程序可以直接在其他计算机上的服务器应用程序上调用该方法，就好像它是本地对象一样。我感觉有点像webservice。
> gRPC官网：[https://www.grpc.io](https://www.grpc.io)

在服务器端，服务器实现此接口并运行grpc服务器以处理客户端调用(需要使用HTTP/2(https证书))。在客户端，客户端具有一个存根，提供与服务器相同的方法。

## 优点

### 描述
现代高性能轻量级 RPC 框架。
约定优先的 API 开发，默认使用 Protocol Buffers 作为描述语言，允许与语言无关的实现。
可用于多种语言的工具，以生成强类型的服务器和客户端。
支持客户端，服务器双向流调用。
通过Protocol Buffers二进制序列化减少网络使用。
基于 HTTP/2 进行传输

## 推荐场景
高性能轻量级微服务 - gRPC设计为低延迟和高吞吐量通信，非常适合需要高性能的轻量级微服务。
多语言混合开发 - gRPC工具支持所有流行的开发语言，使gRPC成为多语言开发环境的理想选择。
点对点实时通信 - gRPC对双向流调用提供出色的支持。gRPC服务可以实时推送消息而无需轮询。
网络受限环境 - 使用 Protocol Buffers二进制序列化消息，该序列化始终小于等效的JSON消息，对网络带宽需求比JSON小。

## 不建议场景
浏览器可访问的API - 浏览器不完全支持gRPC。虽然gRPC-Web可以提供浏览器支持，但是它有局限性，引入了服务器代理
广播实时通信 - gRPC支持通过流进行实时通信，但不存在向已注册连接广播消息的概念
进程间通信 - 进程必须承载HTTP/2才能接受传入的gRPC调用，对于Windows，进程间通信管道是一种更快速的方法。
> 注：尽管http/2协议没有明确规定需要使用https，但是为了安全在浏览器实现都要求使用https，所以现在的http/2话题https基本上是一对。


## .Net支持情况

- 提供了基于HttpClient的原生框架实现
- 提供原生的ASP.NET Core集成库
- 提供完整的代码生成工具
- 编译器提供对proto文件的智能提示	

## TLS
gRPC基于Http2，默认情况下Http2是使用了Http的加密协议，用于 gRPC 的 Kestrel 终结点应使用TLS 进行保护。 
在开发环境中，当存在ASP.NET Core 开发证书时，会在 [https://localhost:5001](https://localhost:5001) 自动创建使用 TLS 进行保护的终结点。 不需要任何配置。 https 前缀验证 Kestrel 终结点是否正在使用TLS。
在生产环境中，必须显式配置 TLS。 以下 appsettings.json 示例中提供了使用 TLS 进行保护的 HTTP/2 终结点 ：
```csharp
{
 "Kestrel": {
   "Endpoints": {
     "HttpsInlineCertFile": {
       "Url": "https://localhost:5001",
       "Protocols": "Http2",
       "Certificate": {
         "Path": "<path to .pfx file>",
         "Password": "<certificate password>"
        }
      }
    }
  }
}
```

## 参考教程 
grpc在netcore官网文档：[https://docs.microsoft.com/zh-cn/aspnet/core/grpc/?view=aspnetcore-5.0](https://docs.microsoft.com/zh-cn/aspnet/core/grpc/?view=aspnetcore-5.0)
官方教程：[https://www.grpc.io/docs/quickstart/csharp/](https://www.grpc.io/docs/quickstart/csharp/)
知乎文章：[https://zhuanlan.zhihu.com/p/148139089](https://zhuanlan.zhihu.com/p/148139089)
晓晨系列教程：[https://www.cnblogs.com/stulzq/p/11897704.html](https://www.cnblogs.com/stulzq/p/11897704.html)
NET Core3高性能RPC框架：[https://www.cnblogs.com/Leo_wl/p/11593681.html](https://www.cnblogs.com/Leo_wl/p/11593681.html)
如何使gRPC 获得最佳性能：[https://mp.weixin.qq.com/s/3--85-0CMMi81xyJC-8xjA](https://mp.weixin.qq.com/s/3--85-0CMMi81xyJC-8xjA)
code综艺圈：[https://mp.weixin.qq.com/s/4DGZQTCm0DOxRrM8Nna_1w](https://mp.weixin.qq.com/s/4DGZQTCm0DOxRrM8Nna_1w)
