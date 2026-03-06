---
title: HttpContext
lang: zh-CN
date: 2022-03-12
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: httpcontext
slug: to3zp3
docsId: '45182640'
---

## 介绍

## 源码解答
```csharp
context.User.AddIdentities(claimIdentiies);

context.User = new ClaimsPrincipal(claimsIdentity);
```
HttpContext对象用来表示抽象的Http上下文，而HttpContext对象的核心又体现在用于描述请求的Request和描述响应的的Response的属性上。除此之外，它还包含一些与当前请求相关的其他上下文信息，比如描述当前HTTP连接的ConnectionInfo对象，控制器WebSocket的WebSockerManger，代表当前用户的ClaimsPrincipal对象的Session，等等。
```csharp
public abstract class HttpContext
{
    public abstract IFeatureCollection Features { get; }
    public abstract HttpRequest Request { get; }
    public abstract HttpResponse Response { get; }
    public abstract ConnectionInfo Connection { get; }
    public abstract WebSocketManager WebSockets { get; }
    public abstract ClaimsPrincipal User { get; set; }
    public abstract IDictionary<object, object> Items { get; set; }
    public abstract IServiceProvider RequestServices { get; set; }
    public abstract CancellationToken RequestAborted { get; set; }
    public abstract string TraceIdentifier { get; set; }
    public abstract ISession Session { get; set; }
    public abstract void Abort();
}
```

## 资料
> HttpContext解析：[https://www.cnblogs.com/RainingNight/p/httpcontext-in-asp-net-core.html](https://www.cnblogs.com/RainingNight/p/httpcontext-in-asp-net-core.html)

