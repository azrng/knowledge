---
title: 整洁架构
lang: zh-CN
date: 2023-09-05
publish: true
author: azrng
isOriginal: true
category:
  - 软件设计
tag:
  - 无
filename: zhengjiejiagou
slug: mfsa2m0miq43k3wn
docsId: '137494323'
---

## 概述
整洁架构也叫做洋葱架构

![image.png](/common/1693141717170-c76e1825-6a0b-40ac-bd30-b2641e68b4d3.png)

- 内层的部分比外层的部分更加抽象->内层表达抽象，外层表达实现(内层定义接口，外层定义实现 )
- 外层的代码只能调用内层的代码，内层的代码可以通过依赖注入的形式间接调用外层的代码，举例：读取文件然后发送邮件



从图中可以看出，领域模型位于应用程序的核心部分，外界与领域模型的交互都通过应用层完成，应用层是领域模型的直接客户。然而，应用层中不应该包含有业务逻辑，否则就造成了领域逻辑的泄漏，而应该是很薄的一层，主要起到协调的作用，它所做的只是将业务操作代理给我们的领域模型。同时，如果我们的业务操作有事务需求，那么对于事务的管理应该放在应用层上，因为事务也是以业务用例为单位的。

应用层负责调用领域层的的方法来实现业务，然后领域层处理业务逻辑


## 概念

### 防腐层(Adapter)
防腐层(ACL)：外部服务(短信服务、邮件服务、存储服务)的变化比较频繁。把这些服务定义为接口，在内层代码我们之定义和使用接口，在外层代码中定义接口的实现。体现的仍然是洋葱结构的理念。



## 分层
简单分三层模式
WebApi：控制器、请求和响应类、领域事件处理
Domain：实体类、事件模型、公共方法、防腐层接口、仓储接口、Domain服务
Infrastrcuture：实体类配置、数据库迁移文件、数据库上下文、仓储接口实现

## 示例项目

整洁架构NorthwindTraders(5.7k)：[地址](https://github.com/jasontaylordev/NorthwindTraders)

示例.NET Core REST API CQRS实现与原始SQL和DDD使用清洁架构(2.7k)：[地址](https://github.com/kgrzybek/sample-dotnet-core-cqrs-api)

OnionArch - 采用DDD+CQRS+.Net 7.0实现的洋葱架构：[地址](https://www.cnblogs.com/xiaozhuang/p/16772485.html)

EdisonZhou整洁架构模板：[地址](https://github.com/Coder-EdisonZhou/CleanArchitectureTemplate)

