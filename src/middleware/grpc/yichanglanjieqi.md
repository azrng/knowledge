---
title: 异常拦截器
lang: zh-CN
date: 2023-09-12
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: yichanglanjieqi
slug: ag0di8
docsId: '57088154'
---
通过使用Grpc.Core.RpcException来捕捉异常，也可以通过注入拦截器来捕捉异常

Interceptor类是gRPC服务拦截器的基类，是一个抽象类，它定义了几个虚方法如下
```csharp
public virtual TResponse BlockingUnaryCall<TRequest, TResponse>();
public virtual AsyncUnaryCall<TResponse> AsyncUnaryCall<TRequest, TResponse>();
public virtual AsyncServerStreamingCall<TResponse> AsyncServerStreamingCall<TRequest, TResponse>();
public virtual AsyncClientStreamingCall<TRequest, TResponse> AsyncClientStreamingCall<TRequest, TResponse>();
public virtual AsyncDuplexStreamingCall<TRequest, TResponse> AsyncDuplexStreamingCall<TRequest, TResponse>();
public virtual Task<TResponse> UnaryServerHandler<TRequest, TResponse>();
public virtual Task<TResponse> ClientStreamingServerHandler<TRequest, TResponse>();
public virtual Task ServerStreamingServerHandler<TRequest, TResponse>();
public virtual Task DuplexStreamingServerHandler<TRequest, TResponse>();
```
各个方法作用如下：

| 方法名称 | 作用 |
| --- | --- |
| BlockingUnaryCall | 拦截阻塞调用 |
| AsyncUnaryCall | 拦截异步调用 |
| AsyncServerStreamingCall | 拦截异步服务端流调用 |
| AsyncClientStreamingCall | 拦截异步客户端流调用 |
| AsyncDuplexStreamingCall | 拦截异步双向流调用 |
| UnaryServerHandler | 用于拦截和传入普通调用服务器端处理程序 |
| ClientStreamingServerHandler | 用于拦截客户端流调用的服务器端处理程序 |
| ServerStreamingServerHandler | 用于拦截服务端流调用的服务器端处理程序 |
| DuplexStreamingServerHandler | 用于拦截双向流调用的服务器端处理程序 |

在实际使用中，可以根据自己的需要来使用对应的拦截方法。


## 参考文档
[https://www.cnblogs.com/stulzq/p/11840535.html](https://www.cnblogs.com/stulzq/p/11840535.html)
