---
title: 请求限制AspNetCoreRateLimit
lang: zh-CN
date: 2023-07-27
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: qingqiuxianzhiaspnetcoreratelimit
slug: gbxx29
docsId: '30622189'
---

## 描述
是一个.NetCore访问速率限制的解决方案，基于IP地址和客户端Id用于控制WebApi客户端访问速率。
包含了IpRateLimitMiddleware and a ClientRateLimitMiddleware两个中间件，用这两个中间件你根据不同的场景能设置几种不同的限制，比如限制一个客户端或者一个ip在几秒或者15分钟内访问最大限制。您可以定义这些限制来处理对某个API的所有请求，也可以将这些限制限定在指定范围的每个API URL或HTTP请求路径上。

## 操作
引用nuget包
```csharp
dotnet add package AspNetCoreRateLimit --version 5.0.0
```

### IP限流
配置文件
```csharp
//对普遍ip的限制，适用于大多数情况
services.Configure<IpRateLimitOptions>(Configuration.GetSection("IpRateLimiting"));
//对特殊ip限制的配置
services.Configure<IpRateLimitPolicies>(Configuration.GetSection("IpRateLimitPolicies"));
```

## 配置文件
IpRateLimiting
```csharp
  "IpRateLimiting": {
    "EnableEndpointRateLimiting": false,
    "StackBlockedRequests": false,
    "RealIpHeader": "X-Real-IP",
    "ClientIdHeader": "X-ClientId",
    "HttpStatusCode": 429,
    "IpWhitelist": [ "127.0.0.1", "::1/10", "192.168.0.0/24" ],
    "EndpointWhitelist": [ "get:/api/license", "*:/api/status" ],
    "ClientWhitelist": [ "dev-id-1", "dev-id-2" ],
    "GeneralRules": [
      {
        "Endpoint": "*",
        "Period": "1s",
        "Limit": 2
      },
      {
        "Endpoint": "*",
        "Period": "15m",
        "Limit": 100
      },
      {
        "Endpoint": "*",
        "Period": "12h",
        "Limit": 1000
      },
      {
        "Endpoint": "*",
        "Period": "7d",
        "Limit": 10000
      }
    ]
  }
```
IpRateLimitPolicies
```csharp
 "IpRateLimitPolicies": {
    "IpRules": [
      {
        "Ip": "84.247.85.224",
        "Rules": [
          {
            "Endpoint": "*",
            "Period": "1s",
            "Limit": 10
          },
          {
            "Endpoint": "*",
            "Period": "15m",
            "Limit": 200
          }
        ]
      },
      {
        "Ip": "192.168.3.22/25",
        "Rules": [
          {
            "Endpoint": "*",
            "Period": "1s",
            "Limit": 5
          },
          {
            "Endpoint": "*",
            "Period": "15m",
            "Limit": 150
          },
          {
            "Endpoint": "*",
            "Period": "12h",
            "Limit": 500
          }
        ]
      }
    ]
  }
```

## 资料
使用说明：[https://github.com/stefanprodan/AspNetCoreRateLimit/wiki/IpRateLimitMiddleware#setup](https://github.com/stefanprodan/AspNetCoreRateLimit/wiki/IpRateLimitMiddleware#setup)
项目地址：[https://github.com/stefanprodan/AspNetCoreRateLimit](https://github.com/stefanprodan/AspNetCoreRateLimit)
.Net Core结合AspNetCoreRateLimit实现限流： [https://www.cnblogs.com/EminemJK/p/12720691.html](https://www.cnblogs.com/EminemJK/p/12720691.html)
[https://www.cnblogs.com/aoximin/p/15315102.html](https://www.cnblogs.com/aoximin/p/15315102.html) | .NET Core 源码阅读 AspNetCoreRateLimit

