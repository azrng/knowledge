---
title: 网关
lang: zh-CN
date: 2023-10-01
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: wangguan
slug: bpucgd
docsId: '32034089'
---

## 介绍
API网关是微服务架构中的唯一入口，它提供一个单独且统一的API入口用于访问内部一个或多个API。它可以具有身份验证，监控，负载均衡，缓存，请求分片与管理，静态响应处理等。API网关方式的核心要点是，所有的客户端和消费端都通过统一的网关接入微服务，在网关层处理所有的非业务功能。通常，网关也是提供REST/HTTP的访问API。服务端通过API-GW注册和管理服务。
Ocelot是用.net Core实现的一款开源的网关,Ocelot其实就是一组按照顺序排列的.net core中间件。它接受到请求之后用request builder构建一个HttpRequestMessage对象并发送到下游服务，当下游请求返回到Ocelot管道时再由一个中间件将HttpRequestMessage映射到HttpResponse上返回客户端。

下游服务器指的是提供API服务的REST Service Server（比如WebAPI、WCF App等），而上游服务器则指的是提供Web网页服务的Web Server（比如MVC Application，可能需要访问REST Service）

感觉可以这样理解，kong的底层就是openresty，openresty的底层是nginx
openresty本身是nginx模块 kong是基于openresty开发的网关

## 方案

### Apisix

https://mp.weixin.qq.com/s/g0fvxOnsn4G0_RBpiy9xag | Apisix 使用docker快速搭建步骤

https://mp.weixin.qq.com/s/2q3FQZyEOoMzGbYGia9J6A | APISIX集成统一鉴权中心

## 操作

### 限流
限流可以防止上下游服务器因为过载而崩溃，可以使用RateLimitOptions来配置限流
```csharp
{
  "RateLimitOptions": {
    "ClientWhitelist": [ "“127.0.0.1”" ],
    "EnableRateLimiting": true,
    "Period": "5s",
    "PeriodTimespan": 1,
    "Limit": 10
  }
}
```

- ClientWihteList:白名单，不受限流控制。
- EnableRateLimiting:使用启用限流。
- Period:限流控制的时间段 1s, 5m, 1h, 1d。
- PeroidTimeSpan:超过限流限制的次数后,需要等待重置的时间（单位是秒）。
- Limit:在限流控制时间段内最大访问数。

对于除了请求头中ClientId=127.0.0.1的意外所有求情启用限流，5秒该api最多10次,如果达到10次需要从第10次请求闭合后等待一秒进行下一次访问。
超过限流后会返回429状态码，并在在返回头（Response Header）的Retry-After属性中返回等待重置时间。
限流提示：
API calls quota exceeded! maximum admitted 3 per 5m.
![image.png](/common/1614394990388-da2a3a48-6cb5-4ad5-913a-9e009aeffb51.png)
限流的默认提示,code码,和限制标志都是可以自己配置的
```csharp
{
  "GlobalConfiguration": {
    "BaseUrl": "www.baidu.com",
    "RateLimitOptions": {
      "DisableRateLimitHeaders": false,
      "QuotaExceededMessage": "接口限流!",
      "HttpStatusCode": 200,
      "ClientIdHeader": "ClientId"
    }
  }
```
![image.png](/common/1614395011038-ff0cec97-439f-42be-92cc-7a6bd727bd79.png)

### 熔断
熔断是在下游服务故障或者请求无响应时候停止将请求转发到下游服务
```csharp
{
  "QoSOptions": {
   "ExceptionsAllowedBeforeBreaking": 3,
    "DurationOfBreak": 20,
    "TimeoutValue": 5000
  }
}
```

- ExceptionsAllowedBeforeBreaking:允许多少个异常请求。
- DurationOfBreak:熔断的时间(秒)。
- TimeoutValue:下游请求的处理时间超过多少则将请求设置为超时。

### 缓存
Ocelot可以对下游请求结果进行缓存，主要是依赖于cacheManager来实现的
```csharp
{
  "FileCacheOptions": {
    "TtlSeconds": 60,
    "Region": "key"
  }
}
```

- TtlSeconds:缓存时间(秒)。
- Region:缓存分区名

我们可以调用Ocelot的API来移除某个区下面的缓存 。

## 资料

> 资料：
> Ocelot 资源汇总：https://www.cnblogs.com/shanyou/p/10363360.html

> netcore使用Ocelot网关：[https://www.cnblogs.com/linhuiy/p/12029652.html](https://www.cnblogs.com/linhuiy/p/12029652.html)

> netcore网关鉴权认证：[https://www.cnblogs.com/linhuiy/p/12060277.html](https://www.cnblogs.com/linhuiy/p/12060277.html) 

