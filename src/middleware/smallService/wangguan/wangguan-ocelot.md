---
title: 网关-Ocelot
lang: zh-CN
date: 2022-09-12
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: wangguan-ocelot
slug: ez80ie
docsId: '32034292'
---
网关配置：

| **key** | **value** |
| --- | --- |
| ReRoutes | 告诉Ocelot如何处理上游的请求。 |
| DownstreamPathTemplate | 下游的路由模板，即真实处理请求的路径模板如：/api/... |
| DownstreamScheme | 请求的方式，如：http,htttps |
| DownstreamHostAndPorts | 下游的IP以及端口,可以有多个(如果使用负载均衡)，方便实现负载均衡，当然你也可以使用服务发现，实现下游服务的自动注册与发现，这篇文章不会讲解。 |
| UpstreamPathTemplate | 上游请求的模板，即用户真实请求的链接 |
| UpstreamHttpMethod | 上游请求的http方法，是个数组，你可以写多个。 |
| GlobalConfiguration | 顾名思义就是全局配置，此节点的配置允许覆盖ReRoutes里面的配置，你可以在这里进行通用的一些配置信息。 |

 

| 名称 | key | value | 示例 | 备注 |
| --- | --- | --- | --- | --- |
| 负载均衡 | LoadBalancerOptions | 
 |   "LoadBalancerOptions": {
        "Type":   "RoundRobin"
      } |   |
| 请求缓存 | FileCacheOptions | 
 | "FileCacheOptions": { "TtlSeconds": 10, "Region": "somename" } | 目前只支持get方式 |
| 限流 | RateLimitOptions | 
 |     "RateLimitOptions": {
            "ClientWhitelist": [ "admin" ], // 白名单
            "EnableRateLimiting": true, // 是否启用限流
            "Period": "1m", // 统计时间段：1s, 5m, 1h, 1d
            "PeriodTimespan": 15, // 多少秒之后客户端可以重试
            "Limit": 5 // 在统计时间段内允许的最大请求数量
          } | 对请求进行限流可以防止下游服务器因为访问过载而崩溃 |
| 熔断器 | QoSOptions | 
 |    "QoSOptions": {
              "ExceptionsAllowedBeforeBreaking": 2, // 允许多少个异常请求
            "DurationOfBreak": 5000, // 熔断的时间，单位为毫秒
            "TimeoutValue": 3000 // 如果下游请求的处理时间超过多少则视如该请求超时
          } | 下游出现故障时候停止转发 |

 

## 网关负载均衡
当下游拥有多个节点的时候，我们可以通过DownstreamHostAndPorts来配置
```csharp
{
  "UpstreamPathTemplate": "/Api_A/{controller}/{action}",
  "DownstreamPathTemplate": "/api/{controller}/{action}",
  "DownstreamScheme": "https",
  "LoadBalancer": "LeastConnection",
  "UpstreamHttpMethod": [ "GET", "POST", "DELETE", "PUT" ],
  "DownstreamHostAndPorts": [
    {
      "Host": "127.0.0.1",
      "Port": 5001
    },
    {
      "Host": "127.00.1",
      "Port": 5002
    }
  ]
}
```
**LoadBalancer是来决定负载的算法**

- LeastConnection:将请求发往最空闲的那个服务器
- RoundRobin:轮流转发
- NoLoadBalance:总是发往第一个请求或者是服务发现

## 请求缓存
ocelot支持对下游服务的url进行缓存，并可以设置一个秒为单位的TTL使缓存过期。我们可以通过调用ocelot的管理API来清除某个region的缓存
为了在路由中使用缓存，需要在reroute中加入
"FileCacheOptions": { "TtlSeconds": 10, "Region": "somename" }
该命令标识：缓存时间10秒，region（范围）。目前只支持get方式。

## 限流
对请求进行限流防止下游服务器因为访问过载而崩溃，我们只需要在路由下加一些简单配置就好。
对于限流，我们对每个服务进行如下配置：
```csharp
"RateLimitOptions": {
        "ClientWhitelist": [ "admin" ], // 白名单
        "EnableRateLimiting": true, // 是否启用限流
        "Period": "1m", // 统计时间段：1s, 5m, 1h, 1d
        "PeriodTimespan": 15, // 多少秒之后客户端可以重试
        "Limit": 5 // 在统计时间段内允许的最大请求数量
      }
```
如果一个接口在一分钟内请求超出5次，那么就提示
![image.png](/common/1614395265214-520da731-f1f8-425a-b04f-8751384a372b.png)
同时，我们可以做一些全局配置，在GlobalConfiguration下配置
```csharp
"RateLimitOptions": {
      "DisableRateLimitHeaders": false, // Http头  X-Rate-Limit 和 Retry-After 是否禁用
      "QuotaExceededMessage": "Too many requests, are you OK?", // 当请求过载被截断时返回的消息
      "HttpStatusCode": 999, // 当请求过载被截断时返回的http status
      "ClientIdHeader": "client_id" // 用来识别客户端的请求头，默认是 ClientId
    }
```
当请求超过限制会提示
![image.png](/common/1614395265220-a433b08a-5d72-4da7-a473-e7ef0ec5eae6.png)
带header（client_id:admin）访问clientservice，可以不受限制地访问API
![image.png](/common/1614395265226-688e16bd-4e85-4350-8910-978077902779.png)

## 熔断器
停止将请求转发到下游服务。这个是下游服务已经出现故障的时候自动停止访问。
```csharp
"QoSOptions": {
       "ExceptionsAllowedBeforeBreaking": 2, // 允许多少个异常请求
        "DurationOfBreak": 5000, // 熔断的时间，单位为毫秒
        "TimeoutValue": 3000 // 如果下游请求的处理时间超过多少则视如该请求超时
      },
```

## 动态路由
如果我们一个网关里面涉及好多个API服务，那么就不能一个一个配置，之前的请求方式http://localhost:5000/A/home/get种也不再满足我们的需求，那么这个时候就应该使用动态路由
[http://网关ip:网关端口/服务名/请求地址](http://网关ip:网关端口/服务名/请求地址) 例子：http://localhost:5000/AService/api/home/get
动态路由配置：
```csharp
{
  //动态路由
  "ReRoutes": [],
  "Aggregates": [],
  "GlobalConfiguration": {
    "RequestIdKey": null,
    "ServiceDiscoveryProvider": {
      "Host": "192.168.130.148", // Consul Service IP
      "Port": 8500 // Consul Service Port
    },
    "RateLimitOptions": {
      "DisableRateLimitHeaders": false, // Http头  X-Rate-Limit 和 Retry-After 是否禁用
      "QuotaExceededMessage": "Too many requests, are you OK?", // 当请求过载被截断时返回的消息
      "HttpStatusCode": 999, // 当请求过载被截断时返回的http status
      "ClientIdHeader": "client_id", // 用来识别客户端的请求头，默认是 ClientId
      "ClientWhitelist": [ "admin" ], // 白名单
      "EnableRateLimiting": true, // 是否启用限流
      "Period": "1m", // 统计时间段：1s, 5m, 1h, 1d
      "PeriodTimespan": 10, // 多少秒之后客户端可以重试
      "Limit": 5 // 在统计时间段内允许的最大请求数量
    },
    "QoSOptions": {
     "ExceptionsAllowedBeforeBreaking": 3, //允许多少个异常请求
      "DurationOfBreak": 10000, //熔断时间，单位毫秒
      "TimeoutValue": 5000 //如果下游请求的处理时间超过多少则视如该请求超时
    },
    "BaseUrl": null,
    "LoadBalancerOptions": {
      "Type": "LeastConnection",
      "Key": null,
      "Expiry": 0
    },
    "DownstreamScheme": "http",
    "HttpHandlerOptions": {
      "AllowAutoRedirect": false,
      "UseCookieContainer": false,
      "UseTracing": false
    }
  }
}
```

