---
title: 概述
lang: zh-CN
date: 2023-09-17
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: gaishu
slug: ghx3vy
docsId: '74887689'
---

## 微服务体系
- 域：一个域是一套注册中心、配置中心、监控中心、网关等组成的结构体系，一个域中可以有多个系统。
- 系统：一个系统相当于一个容器集群，这个容器系统内可以部署多个应用节点。
- 节点：实现微服务的轻耦合节点(应用)

微软官网：[https://dotnet.microsoft.com/zh-cn/learn/aspnet/microservices-architecture](https://dotnet.microsoft.com/zh-cn/learn/aspnet/microservices-architecture)

### 拆分微服务的场景
1.多个需求并行开发和上线，且由多个团队独立开发的时候
2.项目过大，聚焦度不够，出一个新需求看代码时间比写代码时间都长
3.线上bug不断，而系统的范围又过大，很难及时排除问题恢复业务。

## 基础设施
[NET Core with 微服务 - 什么是微服务](https://www.cnblogs.com/kklldog/p/netcore-with-microservices-01.html)
[.Net Core with 微服务 - 架构图](https://www.cnblogs.com/kklldog/p/netcore-with-microservices-02.html)
[.Net Core with 微服务 - Ocelot 网关](https://www.cnblogs.com/kklldog/p/netcore-with-microservices-03.html)
[.Net Core with 微服务 - Consul 注册中心](https://www.cnblogs.com/kklldog/p/netcore-with-microservices-04.html)
[.Net Core with 微服务 - Seq 日志聚合](https://www.cnblogs.com/kklldog/p/netcore-with-microservices-05.html)
[.Net Core with 微服务 - Elastic APM](https://www.cnblogs.com/kklldog/p/netcore-with-microservices-06.html)
[.Net Core with 微服务 - Consul 配置中心](https://www.cnblogs.com/kklldog/p/netcore-with-microservices-07.html)

ci、cd，限流，熔断，管理协作，分布式技术
网关，服务监控，日志收集，重复代码
配置中心，负载均衡，发布成本
领域划分和明确
容器相关技术栈

### 微服务维护
对于微服务的维护分为三个部分：

- 度量(Metrics)：用于监控和报警
- 分布式追踪(Tracing)：用于记录系统中所有的跟踪信息
- 日志(Loggin)：记录每个服务中的日志信息

这三部分并不是独立开来的，例如 Metrics 可以监控 Tracing 、Logging 服务是否正常运行。Tacing 和 Metrics 服务在运行过程中会产生日志。

![](/common/1615169134762-b8103ab1-8c94-4b9a-9d59-e2ca26058cda.png)

## 优缺点

### 优点
1.拓展容易，相互独立，自动弹性应对
2.可以采用多种语言，采用不用的技术栈进行开发，只要遵循约定的协议即可
3.降低系统之间的耦合性
4.可以快速开发，可以快速采用k8s部署
5.可靠性，如果某一个单独的模块挂点了，那么受影响的只是它自己，而不是整个服务。

### 缺点
1.服务数量大，运维难度比较大
2.想要实现微服务之间的分布式事务有一定的难度，尤其是当服务间采用异步操作时候
3.服务模块划分困难，如果划分不好可能就出现非常多的跨库查询，非常多的跨库事务。
4.服务之间的调用会话费更多的执行时间，调用链太长，定位问题困难，由于调用的微服务过多，而且异常有扩散的属性，快速定位问题复杂。
5.需要自动化支撑，如果没有自动化支撑，部署多个服务，测试多个接口异常麻烦。

## 其他 

### 微服务和分布式系统对比
微服务是架构设计方式，分布式是系统部署方式，两者概念不同
微服务是指很小的服务，可以小到只完成一个功能，这个服务可以单独部署运行，不同服务之间通过rpc调用。
分布式是指服务部署在不同的机器上，一个服务可以提供一个或多个功能，服务之间也是通过rpc来交互或者是webservice来交互的。
两者的关系是，系统应用部署在超过一台服务器或虚拟机上，且各分开部署的部分彼此通过各种通讯协议交互信息，就可算作分布式部署，生产环境下的微服务肯定是分布式部署的，分布式部署的应用不一定是微服务架构的，比如集群部署，它是把相同应用复制到不同服务器上，但是逻辑功能上还是单体应用。

### 历史流
需要处理的问题：服务间的通讯、服务治理与服务发现、网关和安全认证、限流与容错、监视
第一代微服务：Dubbo(Java)、Orleans(.Net)等 和语言绑定紧密；
第二代微服务：Spring Cloud等 适合混合开发
第二代微服务：Service Mesh(Service Fabric(微软内部使用的、开源的)、lstio、Conduit等)
目前：第三方微服务还在快速发展中，更新迭代比较快（还不完善）
.NetCore 微服务选型
为什么是.net Core?虽然.Net Framework也可以实现微服务，但是.Net Core是为云而生，用来实现微服务更方便，而且.Net Core可以跨平台。（.Net Framewordk不会再有.Net5.x 下一代就是.Net Core）
第二代微服务架构：Consul+Ocelot+.Net Core+Polly+.....;
腾讯.net大队长张善友把腾讯内部的架构实战整理出一个开源项目NanoFabric（Github上可以搜到），NanoFabric不是一个独立的技术，它只是帮我们搭建好了，配置好了的一个脚手架，只是一个胶水项目，文档不全，仅供我们参考。
在SpringCloud中:EurekaServer做服务治理和服务发现、Hystrix做熔断降级、Zuul做网关;
在NanoFabric中:Consul做服务治理和服务发现、Polly做熔断降级、Ocelot做网关;
在微服务中，服务之间的通讯有俩种主要形式：
1）Restful，也就是传输Json格式数据。.net中就是对应的webapi技术 效率比较低，数据冗余，短连接
2）二进制RPC:二进制传输协议，比restful用的http通讯效率更高，但是耦合性更强。技术有Thrift、gRPC等
**健康检查**：A服务使用服务名称通过注册中心去调用B服务，集群的情况下，一个注册中心会同时拥有多个B服务，那么注册中心会定期检查每一个服务是否正常访问，移除不可访问的服务，这就是健康检查。

## 微服务框架
[https://aspdotnetcore.net/](https://aspdotnetcore.net/)

## 参考文档
> 微服务开源项目：[https://github.com/geffzhang/NanoFabric](https://github.com/geffzhang/NanoFabric)
> 微服务系列文章：[https://www.cnblogs.com/xhznl/p/13259036.html](https://www.cnblogs.com/xhznl/p/13259036.html)
> 周旭龙微服务架构系列文章：[https://www.cnblogs.com/edisonchou/p/dotnetcore_microservice_foundation_blogs_index_final.html](https://www.cnblogs.com/edisonchou/p/dotnetcore_microservice_foundation_blogs_index_final.html)
> [进击的辣条netcore微服务初体验](https://www.cnblogs.com/wyt007/p/9150116.html)
> [微服务架构学习与实践系列](https://www.cnblogs.com/edisonchou/p/dotnetcore_microservice_foundation_blogs_index_final.html)

> [谈谈微服务中的API网关](https://www.cnblogs.com/savorboard/p/api-gateway.html)

[https://mp.weixin.qq.com/s/TO9JzMpROiptR3Eq3ILBjg](https://mp.weixin.qq.com/s/TO9JzMpROiptR3Eq3ILBjg) | 最接地气的 .NET 微服务框架
