---
title: 编码实践
lang: zh-CN
date: 2023-11-26
publish: true
author: azrng
isOriginal: true
category:
  - 软件设计
tag:
  - 实践
---

## DDD中的写操作

在写的操作中，我们需要严格地按照应用服务->聚合根->资源库的结构进行编码，写的操作又三种场景

* 通过聚合根完成业务请求，这是DDD完成业务请求的典型方式
* 通过Factory完成聚合跟单创建
* 通过DomainService去完成业务请求，当业务放在聚合根中不合适的时候才考虑放在DomainService中



资料来自：https://www.cnblogs.com/davenkin/p/ddd-coding-practices.html

## DDD中的读操作

介绍三种读操作的方式

* 基于领域模型的读操作：如果涉及到表关联的，需要先查询第一个，在查询第二个，然后在内存中进行处理
* 基于数据模型的读操作：直接另外编写一个新的领域服务，然后通过数据库读取客户端所需要的数据，然后直接返回对应的数据
* CQRS：命令查询职责分离，读和写操作分别使用了不同的数据库，数据从写的模型中同步到的读的模型库中，通过领域事件的形式同步变更信息。

遵循的原则是：领域中的对象不能直接返回给客户端，因为这样子领域模型的内部便暴漏给了外界，这样子如果对领域模型的修改也是直接影响到客户端，所以通常我们会对读操作专门创建用于数据展示的模型。

资料来自：https://www.cnblogs.com/davenkin/p/ddd-coding-practices.html

## 开源项目

### jasontaylordev/CleanArchitecture

jasontaylordev/CleanArchitecture:Jason Taylor的CleanArchitecture项目是一个使用ASP.NET Core的范例应用，以演示Clean Architecture的实际应用为目的。它包含一个简单的任务管理应用程序，展示了如何使用Clean Architecture的思想和ASP.NET Core技术栈构建应用。该项目的代码结构和组织方式符合Clean Architecture的原则，分为实体（Entities）、用例（Use Cases）、接口适配器（Interface Adapters）和框架和驱动（Frameworks and Drivers）等层次。

仓库地址：[https://github.com/jasontaylordev/CleanArchitecture](https://github.com/jasontaylordev/CleanArchitecture)

### ardalis/CleanArchitecture

ardalis/CleanArchitecture:Steve "ardalis" Smith的CleanArchitecture项目也是一个使用ASP.NET Core的Clean Architecture实现，旨在为开发者提供一个可用于实际项目的模板。与Taylor的项目类似，ardalis的项目也包含了一些实用的工具和模板代码，以帮助开发者更轻松地构建符合Clean Architecture的应用。

仓库地址：[https://github.com/ardalis/CleanArchitecture](https://github.com/ardalis/CleanArchitecture)
