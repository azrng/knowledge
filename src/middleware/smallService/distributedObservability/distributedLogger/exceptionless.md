---
title: 分布式日志-Exceptionless
lang: zh-CN
date: 2023-07-27
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: fenbushirizhi-exceptionless
slug: nh6bsy
docsId: '29913902'
---

## 介绍
为您提供跟踪错误，日志和事件的工具，同时指导您寻求可行的解决方案。开源的实时的微服务日志收集框架。

### 组成

- WebUI
- WebAPI
- BackgroudTask

通过这三部分组成，分别是可视化的UI视图，webapi(主要用于程序发送日志和提供WebUI所需要的接口)，后台任务(发送日志到es，跑webhook等)

## 使用方式

- 在官方创建帐号，并新建应用程序以及项目，然后生成apikey

参考文档：[https://www.cnblogs.com/Leo_wl/p/11068336.html](https://www.cnblogs.com/Leo_wl/p/11068336.html)

- 自己搭建环境，本地部署

### windows部署方案
参考文档：[https://www.cnblogs.com/yilezhu/p/9193723.html](https://www.cnblogs.com/yilezhu/p/9193723.html)

### Docker部署方案
```csharp
version: '3'

services:
  myexceptionLess:  #exceptionLess
    container_name: myexceptionLess
    image: exceptionless/exceptionless:latest
    ports: 
      - "5000:80"
    restart: always
    environment: 
      TZ: Asia/Shanghai
```
> 理解：该程序只是展示日志，日志的存储是在es里面


## 操作
引用组件
```yaml
<PackageReference Include="Exceptionless.AspNetCore" Version="4.3.2027" />
```

## 参考文档
> 教程：分布式系统日志收集 [https://www.cnblogs.com/savorboard/p/exceptionless.html](https://www.cnblogs.com/savorboard/p/exceptionless.html)
> .NET Core 中的日志与分布式链路追踪：[https://mp.weixin.qq.com/s/TTaDuNMGGwn5WD7r9lLnIQ](https://mp.weixin.qq.com/s/TTaDuNMGGwn5WD7r9lLnIQ)


