---
title: Eureka
lang: zh-CN
date: 2022-10-21
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: eureka
slug: gx9hiz
docsId: '97445786'
---
首先先安装nuget组件：Steeltoe.Discovery.ClientCore
```csharp
//然后在ConfigureServices中进行注入
services.AddDiscoveryClient(Configuration);
 
Configure中引用
app.UseDiscoveryClient();
 
 
Appsettings中编写
{
  "Logging": {
    "IncludeScopes": false,
    "LogLevel": {
      "Default": "Warning",
    "Pivotal": "Debug",
      "Steeltoe": "Debug"
 
    }
  },
  "spring": {
    "application": {
      "name": "order-service"
    }
  },
  "eureka": {
    "client": {
      "serviceUrl": "http://192.168.130.132:8761/eureka/",
      "shouldRegisterWithEureka": true,//默认值是true
     "shouldFetchRegistry": false,//设置指示客户端不要获取注册表，因为该应用无需发现服务。它只想注册服务
      "validate_certificates": false
    },
    "instance": {
     "hostName": "192.168.130.148",//默认是在运行时自动确认的  不加上这个的话网关找不到服务
      "port": 14802,//设置该服务中注册的端口
     "leaseRenewalIntervalInSeconds": 30,
     "leaseExpirationDurationInSeconds": 90
    }
  }
}
```

