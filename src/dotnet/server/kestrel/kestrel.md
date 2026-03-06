---
title: Kestrel
lang: zh-CN
date: 2023-07-02
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: kestrel
slug: icondd
docsId: '32029463'
---

## 介绍
Kestrel是一个跨平台的Web服务器，支持在windows、masos、linux等操作系统中运行。主要由两种使用模式：
1.直接作为Web服务器，直接接受并处理各类Http请求：
![image.png](/common/1614391550541-1b0048ad-8301-4c84-bc12-a3d9f11e2c1e.png)
2.与各类反向代理服务器（例如Nginx、Apache、IIS）配合使用，反向代理服务器接受Http请求，将这些请求转发到Kestrel Web服务器
![image.png](/common/1614391550544-8d3fc256-5b15-422c-afbf-9d0392c6cf4a.png)
优点：
对外暴露有限的HTTP服务器
反向代理服务器做了一层过滤、防护和转发
通过反向代理服务器实现负载均衡和动态请求分发路由
减少域名使用，降低WAF防火墙防护成本
安全通讯配置，HTTPS转HTTP，仅反向代理服务器需要证书，并且该服务器内部可以使用普通的HTTP协议与内部网络的应用服务器通信。

## 使用方式
kestrel有两种使用方式:
1.直接使用kestrel代理然后访问项目
2.用过iis、nginx、apache反向代理配置然后调用kestrel

## 选项设置
Kestrel Web服务提供了哪些选项设置：
1.KeepAliveTime：保持活动会话超时时间
默认2分钟，可以用以下代码进行设置
serverOptions.Limits.KeepAliveTimeout = TimeSpan.FromMinutes(2);
2. 客户端最大连接数： MaxConcurrentConnections、 MaxConcurrentUpgradedConnections
  默认情况下，最大连接数不受限制；
  可以通过 MaxConcurrentConnections，设置整个应用设置并发打开的最大 TCP 连接数。
  对于已从 HTTP 或 HTTPS 升级到另一个协议（例如，Websocket 请求）的连接，有一个单独的限制MaxConcurrentUpgradedConnections。 连接升级后，不会计入 MaxConcurrentConnections 限制。
  可以用以下代码进行设置：
serverOptions.Limits.MaxConcurrentConnections = 100;
serverOptions.Limits.MaxConcurrentUpgradedConnections = 100;
3. 请求正文最大大小： MaxRequestBodySize
  默认的请求正文最大大小为 30,000,000 字节，大约 28.6 MB
serverOptions.Limits.MaxRequestBodySize = 10 * 1024;
  在 ASP.NET Core MVC 应用中替代限制的推荐方法是在操作方法上使用 RequestSizeLimitAttribute 属性：
[RequestSizeLimit(100000000)]
public IActionResult MyActionMethod()
4.请求正文最小数据速率 MinRequestBodyDataRate MinResponseDataRate
   Kestrel 每秒检查一次数据是否以指定的速率（字节/秒）传入。 如果速率低于最小值，则连接超时。
   宽限期是 Kestrel 提供给客户端用于将其发送速率提升到最小值的时间量；在此期间不会检查速率。 宽限期可以尽可能地避免最初由于 TCP 慢启动而以较慢速率发送数据的连接中断。
   默认的最小速率为 240 字节/秒，包含 5 秒的宽限期。
   最小速率也适用于HttpResponse响应。 除了属性和接口名称中具有 RequestBody 或 Response 以外，用于设置请求限制和响应限制的代码相同。   
serverOptions.Limits.MinRequestBodyDataRate = new MinDataRate(bytesPerSecond: 100, gracePeriod: TimeSpan.FromSeconds(10));
serverOptions.Limits.MinResponseDataRate = new MinDataRate(bytesPerSecond: 100, gracePeriod: TimeSpan.FromSeconds(10));
 5. 请求Header超时 RequestHeadersTimeout
  获取或设置服务器接收请求标头所花费的最大时间量。 默认值为 30 秒。  
serverOptions.Limits.RequestHeadersTimeout = TimeSpan.FromMinutes(1);
6. 每个连接的最大的请求流的数量 MaxStreamsPerConnection
   Http2.MaxStreamsPerConnection 限制每个 HTTP/2 连接的并发请求流的数量。 拒绝过多的流。   
serverOptions.Limits.Http2.MaxStreamsPerConnection = 100;
7. 标题表大小
   HPACK 解码器解压缩 HTTP/2 连接的 HTTP 标头。 Http2.HeaderTableSize 限制 HPACK 解码器使用的标头压缩表的大小。 该值以八位字节提供，且必须大于零 (0)。　   
serverOptions.Limits.Http2.HeaderTableSize = 4096;
8. 最大帧大小 Http2.MaxFrameSize
    Http2.MaxFrameSize 表示服务器接收或发送的 HTTP/2 连接帧有效负载的最大允许大小。 该值以八位字节提供，必须介于 2^14 (16,384) 和 2^24-1 (16,777,215) 之间。  
serverOptions.Limits.Http2.MaxFrameSize = 16384;
9. 最大请求头大小 Http2.MaxRequestHeaderFieldSize
 Http2.MaxRequestHeaderFieldSize 表示请求标头值的允许的最大大小（用八进制表示）。 此限制适用于名称和值的压缩和未压缩表示形式。 该值必须大于零 (0)。     
serverOptions.Limits.Http2.MaxRequestHeaderFieldSize = 8192;
10. 初始连接窗口大小  Http2.InitialConnectionWindowSize
    Http2.InitialConnectionWindowSize 表示服务器一次性缓存的最大请求主体数据大小（每次连接时在所有请求（流）中汇总，以字节为单位）。 请求也受 Http2.InitialStreamWindowSize 限制。 该值必须大于或等于 65,535，并小于 2^31 (2,147,483,648)。   
    默认值为 128 KB (131,072)
serverOptions.Limits.Http2.InitialConnectionWindowSize = 131072;
11. 初始流窗口大小 Http2.InitialStreamWindowSize
    Http2.InitialStreamWindowSize 表示服务器针对每个请求（流）的一次性缓存的最大请求主体数据大小（以字节为单位）。 请求也受 Http2.InitialConnectionWindowSize 限制。 该值必须大于或等于 65,535，并小于 2^31 (2,147,483,648)。
    默认值为 96 KB (98,304)    
serverOptions.Limits.Http2.InitialStreamWindowSize = 98304;
12. 同步IO  AllowSynchronousIO
     AllowSynchronousIO 控制是否允许对请求和响应使用同步 IO。 默认值为 false。这个设置需要注意一下：
     大量的阻止同步 IO 操作可能会导致线程池资源不足，进而导致应用无响应。 仅在使用不支持异步 IO 的库时，才启用 AllowSynchronousIO。
serverOptions.AllowSynchronousIO = true;
 
 

## 设置端口
.Net6之前写法
```csharp
UseUrls("http://localhost:5001")
UseUrls("http://localhost:5001", "http://localhost:5002", "http://*:5003")//多个地址 *代表绑定所有本机地址 可以局域网访问，拥有外网ip 就可以外网访问
UseUrls("http://*:8089")
```
.Net6
```csharp
var app = WebApplication.Create(args);

app.MapGet("/", () => "Hello World!");

//app.Run("http://localhost:3000");
app.Run("http://*:8080");
```
设置多个端口
```csharp
var app = WebApplication.Create(args);

app.Urls.Add("http://localhost:3000");
app.Urls.Add("http://localhost:4000");

app.MapGet("/", () => "Hello World");

app.Run();
```
> [https://docs.microsoft.com/zh-cn/aspnet/core/fundamentals/minimal-apis?view=aspnetcore-6.0#working-with-ports](https://docs.microsoft.com/zh-cn/aspnet/core/fundamentals/minimal-apis?view=aspnetcore-6.0#working-with-ports)


## 资料
教程：https://www.cnblogs.com/Leo_wl/p/8405711.html
 
