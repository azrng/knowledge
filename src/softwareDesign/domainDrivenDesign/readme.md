---
title: 说明
lang: zh-CN
date: 2023-08-18
publish: true
author: azrng
isOriginal: true
category:
  - 软件设计
tag:
  - ddd
---

## 描述

:::tip

DDD无关系统的大小，而是教我们如何做好软件的。

:::

DDD(Domain-Deiven design)是一种设计思想，是一个应用于微服务架构的方法论，倾向于让所有人站到同一个角度看问题。最接地气的说：**DDD应该是面向对象的进阶**

诞生于2004年，兴起于2014年(微服务元年)，自从微服务兴起之后，DDD的概念才越来越多被提起来。不过DDD之于微服务，无外乎“DDD的界限上下文可以用于指导微服务的划分”，使用单体架构也不影响我们划分界限上下文(模块)

从业务角度来处理=>业务需求驱动设计。

学习DDD的正确姿势：从理论到实践，再从实践到理论。


## 优点
接触到需求的第一步就是考虑领域模型，而不是将其切割成数据和行为，然后数据用数据库实现，行为使用服务实现，最后造成需求的分离。

:::tip

当面对一个新的业务需求时候，首先想到如何去设计数据库的表结构这是不对的，应该关心的事如何进行业务建模(编写更符合需求的模型实体，当然也可能因为数据库的支持问题会进行妥协部分内容)，而不是数据库建模，数据库只是一个实现细节，而不是软件建模的主体

:::

DDD解决了客户端复杂性问题：当你的系统需要web 移动端 小程序使用DDD，通过不同的DTO应用层+业务逻辑实现。
DDD核心就是以业务需求作为驱动，通过传统的三层比较，会发现传统的三层，面对客户端需求增多时候，需要不断修改业务逻辑BLL，这样子会造成系统稳定性被破坏，违背系统开发的开闭原则，所以在BLL层之上扩展出来应用层，应对不同的UI客户端，逻辑层并没有发生概念。

## 架构风格

DDD不要求采用特定的架构风格，你可以采用三层架构也可以采用事件驱动架构，在实现领域驱动设计中，作者比较推崇事件驱动和六边形架构。真要说应该采用哪种架构，那么应该是**以领域模型为中心的软件架构**

* 六边形架构也被称为端口和适配器(Ports and Adapters)，在六边形架构中已经不存在分层的概念，所有的组件都是平等的，这得益于软件抽象的好处，各个组件之间交互完全通过接口的方式完成，而不是具体的实现细节。六边形架构的系统中存在着很多的端口和适配器的组合，端口表示的事一个软件系统的输入和输出，而适配器则是对每个端口的访问方式，比如要对数据持久化，此时的数据库系统就可以看做是一个端口，而访问数据库的驱动就是相应于是数据库的适配器。
* 整洁架构
* [尖叫架构](https://blog.cleancoder.com/uncle-bob/2011/09/30/Screaming-Architecture.html)：同一个业务的模块放在一起，然后里面包含了控制器、应用服务、领域服务、领域模型等

共同点：架构中心都有一个核心的存在，这个核心就是领域模型，聚合根就是存在于领域模型中


六边形架构(洋葱架构):https://jeffreypalermo.com/2008/07/the-onion-architecture-part-1/

整洁架构:https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html

## 层次划分

在网络上看到一个优化后的DDD四层架构，可以从这个图中看到，从上到下分别是：用户接口层、应用层、领域层和基础层。

![图片](/common/604c66ba07912945c318c2f2.png)

与传统的三层架构不同，DDD四层架构的重点在于引入 一个领域层([参考图片](https://www.processon.com/view/link/604c66ba07912945c318c2f2))

* Presentation Layer：表现层，展示用户界面，负责显示和接受输入；
* Application Layer(Service)：应用层，不包含任何领域逻辑，主要用来对任务进行协调，是构建表现层和领域层的桥梁。
* Domain Layer(Domain)：领域层，简单地说就是业务所涉及的领域对象（包括实体、值对象）、领域服务等。该层就是所谓的领域模型了，领域驱动设计提倡是富(充血)领域模型，富(充血)领域模型指的是：尽量将业务逻辑放在归属于它的领域对象中，当单个实体不能实现某些功能的时候，领域服务才出马，组合聚合内多个实体来实现复杂的业务逻辑。而之前的三层架构中的领域模型都是贫血领域模型，因为在三层中的领域模型只包含业务属性，而不包含任何业务逻辑。
* Infrastructure Layer：基础层，提供整个应用的基础服务，例如配置文件处理、缓存处理、事务处理等；面向业务（包含仓储的实现)

从[EdisonTalk ]公众号中借鉴一个图来展示传统的三层架构与四层架构的对应关系

![image-20240217202727838](/common/image-20240217202727838.png)

- **用户接口层**：调用应用层完成具体用户请求。包含：controller，远程调用服务等
- **应用层App**：尽量简单，不包含业务规则，而只为了下一层中的领域对象做协调任务，分配工作，重点对领域层做编排完成复杂业务场景。包含：AppService，消息处理等
- **领域层Domain**：负责表达业务概念和业务逻辑，领域层是系统的核心。包含：模型，值对象，域服务，事件
- **基础层**：对所有上层提供技术能力，包括：数据操作，发送消息，消费消息，缓存等
- **调用关系**：用户接口层->应用层->领域层->基础层
- **依赖关系**：用户接口层->应用层->领域层->基础层

### 应用服务Application

需要遵循下面的原则

* 业务方法和业务用例一一对应，即一个业务用例对应ApplicationService上的一个业务方法
* 业务方法与事务一一对应，也就是每个业务方法均构成一个IE独立的事务边界，整个方法处于一个事务中
* 本身不应该包含业务逻辑，业务逻辑应该放在领域模型中实现，更准确的说应该放在聚合根中实现，而ApplicationSevice应该只是用来协调调用领域层模型中的方法，因此该层应该是很薄的一层
* 与UI或者说和通信协议无关，该层的定位不是软件系统门面，而是领域模型的门面，这也就意味着ApplicationService不应该处理如UI交互或者通信协议之类的技术细节。控制器层用来负责和通讯协议以及客户端的直接交互，这样子的处理让ApplicationService具有普遍性。



ApplicationService作为领域模型的调用方，所以领域模型的实现细节对其来说应该是一个黑盒子，因此ApplicationService不应该引用领域模型中的对象，另外ApplicationService接受请求的数据仅仅用于本次业务请求本身，所以在能够满足业务需求的条件下应该尽量的简单。因此ApplicationService层通过处理一下比较原始的数据类型，在需要调用领域模型方法的时候，才封装为领域模型的对象。

![img](/common/c595d31883011e90.png)

> 图片来自：https://www.cnblogs.com/davenkin/p/ddd-coding-practices.html

## 资料
教程：[https://www.cnblogs.com/laozhang-is-phi/p/9806335.html](https://www.cnblogs.com/laozhang-is-phi/p/9806335.html)

DDD领域驱动设计Net：[https://www.cnblogs.com/landeanfen/p/4816706.html](https://www.cnblogs.com/landeanfen/p/4816706.html)
精华文章：
[领域驱动设计，为何又死灰复燃了？ ](https://blog.csdn.net/GitChat/article/details/81091470)
[ABP框架理论研究总结(典藏版)](https://www.cnblogs.com/farb/p/ABPTheory.html)
[浅谈我对DDD领域驱动设计的理解](https://www.cnblogs.com/netfocus/p/5548025.html)
[IDDD 实现领域驱动设计－CQRS（命令查询职责分离）和 EDA（事件驱动架构）](https://www.cnblogs.com/xishuai/p/iddd-cqrs-and-eda.html)
[领域驱动设计的实践 – CQRS & Event Sourcing](https://www.jianshu.com/p/9a3f8d514fcd)
[CQRS Journey](https://docs.microsoft.com/zh-cn/previous-versions/msp-n-p/jj554200(v%3dpandp.10))
[Repository 仓储，你的归宿究竟在哪](https://www.cnblogs.com/xishuai/p/ddd_repository.html)

[https://mp.weixin.qq.com/s/3fZQJwQUAH1gNS-a2iqJxw](https://mp.weixin.qq.com/s/3fZQJwQUAH1gNS-a2iqJxw) | DDD 中限界上下文与通用语言的作用
本地地址：\开发\docs\DDD 中限界上下文与通用语言的作用.png

[https://zq99299.github.io/note-book2/ddd/00/](https://zq99299.github.io/note-book2/ddd/00/) | 开篇 | 学好了 DDD，你能做什么？ | NOTE-BOOK2

https://mp.weixin.qq.com/s/y6H8UG-g829o0V0EBeEwrw | 迄今为止最完整的DDD实践

https://mp.weixin.qq.com/s/TzJy6J51q9C7MX5oie95Bw | 聊聊 ASP.NET 6 整洁架构开发模板

https://mp.weixin.qq.com/s/ublJ-_Hp0tuCPus0dQ_TBA | ASP.NET Core 6.0 的整洁架构



模块化整体式架构中的内部 API 与公共 API：[https://www.milanjovanovic.tech/blog/internal-vs-public-apis-in-modular-monoliths](https://www.milanjovanovic.tech/blog/internal-vs-public-apis-in-modular-monoliths)

### 系列教程

ddd大白话入门：https://www.cnblogs.com/davenkin/p/ddd-introduction.html

https://www.cnblogs.com/davenkin/p/road-to-ddd.html | 领域驱动设计(DDD)实现之路 - 无知者云 - 博客园
