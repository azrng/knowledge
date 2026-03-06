---
title: 架构图
lang: zh-CN
date: 2023-06-24
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: jiagoutu
slug: gq6ptl
docsId: '31211537'
---

## 架构图
![](/common/1624497455143-104691ec-981b-435c-b6db-3389013aed54.webp)

这个图我感觉挺对，聚合服务层根据情况使用

## 架构示例

### 前端

ES6、Vue全家桶、Element UI、Sass、axios、dayjs、echarts

### 后端

.Net Core、EFCore、JWT、RabbitMq、Swagger、WebSocket

### 数据库

MySQL、postgres、sqlserver、oracle、达梦数据库、人大金仓

### 数据缓存

redis

### 文件存储

本地存储、Minio、OSS

### 中间件

Nacos(服务发现、服务配置)、Consul、Skywalking、Es、logstash、Kibana

### Devops

GitLab、Jenkins、Harbor(私有镜像仓库)、Nexus(包管理)、Npm、Docker、Kubernetes

### 基础设施

私有云、公有云(阿里云、腾讯云)、容器(docker、kubernetes)、虚拟机(vm)



参考自下图

![73c1f13202d127de8ac7c544b112111](/softwareDesign/73c1f13202d127de8ac7c544b112111.jpg)

## 组件选型

.NET Core+Swagger+Consul+Polly+Ocelot+IdentityServer4+Exceptionless+Apollo+SkyWalking

### 网关
API网关是微服务架构中的唯一入口，它提供一个单独且统一的API入口用于访问内部一个或多个API。它可以具有身份验证，监控，负载均衡，缓存，限流，请求分片与管理，静态响应处理等。

常用组件：Ocelot、kong、zuul、Envoy。

选型方案一：
Kong和KongA作为我们的API网关，Kong是一个在Nginx运行的Lua应用程序，由lua-nginx-module实现。Kong和OpenResty一起打包发行，其中已经包含了lua-nginx-module。基本功能有路由、负载均衡、基本认证、限流、跨域、日志等功能，其他功能例如jwt认证可以通过插件进行扩展。
选择kong的理由：kong比Ocelot性能好，并且kong很多功能可以通过插件式按需使用与开发


### 服务注册发现
免去维护多个服务的配置信息(比如a服务被n个服务依赖，那么如果a服务地址一变动，那么n个服务都需要跟着改动)，可以直接通过服务名获取服务信息然后调用。
大致流程

- 服务B启动后向服务注册发现服务注册自己的信息

- 服务A从注册中心服务获取服务B的信息

- 服务A调用服务B

  

常用组件：Consul、Eureka、Nacos

选型方案一：
选用Consul+Consul Tamplate+nginx，Consul是基于GO语言开发的开源工具，主要面向分布式，服务化的系统提供服务注册、服务发现和配置管理的功能。
Consul的核心功能包括：服务注册/发现、健康检查、Key/Value存储、多数据中心和分布式一致性保证等特性。
Consul作为服务注册中心的存在，但是我们服务发现只能拿到IP列表，我们使用RPC调用时还是得做负载均衡算法，于是使用了Consul Tamplate把服务列表同步到nginx的配置，那么RPC框架就无需集成负载均衡算法经过nginx路由

### 服务通信
RPC框架主要三大核心，序列化、通信细节隐藏、代理。协议支持分TCP和HTTP，当然还有两者兼容+集成MQ的。

选型方案一
选择了WebApiClient做客户端，服务端仍是.Net Core WebAPI，主要考虑到WebAPIClient的轻量、易用，而且和Skywalking、Consul集成方便


### 配置中心
配置管理系统：为了解决微服务环境中配置文件繁杂，而且不同环境的不同配置修改相对频繁，每次发布都需要修改对应的配置，因此需要做统一的配置中心，能够做到自动更新配置文件信息。

#### 常用组件

- Apollo
- Zookeeper
- AgileConfig
- Nacos

### 分布式日志
一般我们需要进行日志分析场景：直接在日志文件中就可以获得自己想要的信息。但在规模较大的场景中，此方法效率低下，面临问题包括日志量太大如何归档、文本搜索太慢怎么办、如何多维度查询。需要集中化的日志管理，所有服务器上的日志收集汇总。常见解决思路是建立集中式日志收集系统，将所有节点上的日志统一收集，管理，访问。
一般大型系统是一个分布式部署的架构，不同的服务模块部署在不同的服务器上，问题出现时，大部分情况需要根据问题暴露的关键信息，定位到具体的服务器和服务模块，构建一套集中式日志系统，可以提高定位问题的效率。
一个完整的集中式日志系统，需要包含以下几个主要特点：

- 收集－能够采集多种来源的日志数据
- 传输－能够稳定的把日志数据传输到中央系统
- 存储－如何存储日志数据
- 分析－可以支持 UI 分析
- 警告－能够提供错误报告，监控机制

日志收集的流程

- 日志选择：确定哪些日志类型需要进行收集分析，比如调试，网络等等类型。
- 日志采集：使用哪种日志组件来作为采集，net中常用有nlog和log4net
- 日志缓存：使用kafka或者redios来缓冲日志手机的大量请求
- 日志筛选：筛选(过滤)哪些日志类型将要被存储，提前埋点
- 日志存储：日志的统一存储，例如es(Elasticsearch)
- 日志检索：日志的UI展现，例如ExceptionLess

#### 常用组件
ELK(ElasticSearch, Logstash, Kibana)   [https://blog.csdn.net/e_wsq/article/details/81303713](https://blog.csdn.net/e_wsq/article/details/81303713)
EFK(ElasticSearch, Filebeat, Kibana)  [https://blog.csdn.net/HuaZi_Myth/article/details/102770893](https://blog.csdn.net/HuaZi_Myth/article/details/102770893)
Exceptionless  [https://www.cnblogs.com/Leo_wl/p/11068336.html?utm_medium=referral&utm_source=itdadao](https://www.cnblogs.com/Leo_wl/p/11068336.html?utm_medium=referral&utm_source=itdadao)

### 分布式追踪
基本上都分三大块，UI、收集器、代理（探针），原理大概是把涉及的服务链路的RequestID串起来。

#### 产生场景
一个业务流可能会经过多个微服务的处理和传递，这样子会面临以下问题
1.分散在各个服务器上的日志如何处理
2.业务流出现了错误和异常，如何定位是哪个点出现的问题？
3.如何快速定位问题？
4.如何跟踪业务流的处理顺序和结果？

#### 使用场景

- 分布式跟踪信息传递
- 分布式事务监控
- 服务依赖性分析
- 展示跨进程调用链
- 定位问题
- 性能优化

#### 常用组件

- Skywalking(对于.Net技术栈无侵入)
- Zipkin
- 鹰眼	
- Jaeger
- Datadog

选型方案一
选择了SkyWalking作为了项目的分布式链路跟踪系统，原因很简单：易用，无侵入，集成良好。

### 分布式事务
分为：强一致性和最终一致性

| 分类 | 理论 | 案例 | 中间件 |
| --- | --- | --- | --- |
| 强一致性 | ACID | 二阶段提交 | msdtc |
| 最终一致性 | BASE | 本地消息表 | CAP |

选型方案一
本地消息表是eBay在N年前提出的方案，而CAP以该思想实现的一门框架，原理大概是，本地业务表与消息凭据表作为一个事务持久化，通过各种补偿手段保证MQ消息的可靠性，包括MQ正常发布与消费。


### 系统监控
因为微服务出现问题无法快速定位问题，这个时候就需要监控系统柜。
一般分为以下几个维度的监控：
硬件资源类监控，监控cpu、内存、存储等指标
应用类监控，围绕对应用、服务、容器的健康监控，对接口的调用链、性能进行调控
运营类监控，比如监控每天流水、注册人数等

#### 常用组件

- Prometheus
- HttpReports
- Zabbix

### 文件系统
统一一个服务作为文件存储服务。
常用组件：TFS

### 重试策略
对一个方法或者一个请求进行多次重试
常用组件：Polly

### 认证鉴权
常用组件：ids

### 部署方案
通过容器部署
常用组件：docker、k8s、k3s

## 资料

https://www.cnblogs.com/wyt007/p/10631109.html | 基于.net core微服务（Consul、Ocelot、Docker、App.Metrics+InfluxDB+Grafana、Exceptionless、数据一致性、Jenkins） - 一个大西瓜咚咚咚 - 博客园

https://www.cnblogs.com/lifeng618/p/14120044.html | 2020年总结-用学习过的技术搭建一个简单的微服务框架 + 源码 - 往事随灬锋 - 博客园

## 参考文档

.Net Core with 微服务架构图 [https://mp.weixin.qq.com/s/Mw6_bfzKcLVLtf6CGIvJYg](https://mp.weixin.qq.com/s/Mw6_bfzKcLVLtf6CGIvJYg)
[https://mp.weixin.qq.com/s/oBZy6e4C9xU67Qa38hxOfA](https://mp.weixin.qq.com/s/oBZy6e4C9xU67Qa38hxOfA) | .Net微服务实战之可观测性
技术选型：[https://mp.weixin.qq.com/s/-yQB9ZwewnTbwwVRaOXFVA](https://mp.weixin.qq.com/s/-yQB9ZwewnTbwwVRaOXFVA)



