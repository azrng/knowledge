---
title: 资料精选架构篇
lang: zh-CN
date: 2022-01-27
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: ziliaojingshuajiagoupian
slug: mvbfy3
docsId: '65198453'
---

:::tip
来自网络，内容是否过时自行判断
:::

## 深入.NET

#、.NET Core跨平台解读
[.NET Core跨平台的奥秘[上篇]：历史的枷锁](http://www.cnblogs.com/artech/p/how-to-cross-platform-01.html)
[.NET Core跨平台的奥秘[中篇]：复用之殇](http://www.cnblogs.com/artech/p/how-to-cross-platform-02.html)
[.NET Core跨平台的奥秘[下篇]：全新的布局（.NET Standard）](http://www.cnblogs.com/artech/p/how-to-cross-platform-03.html)

#、.NET Standard 与 .NET 5+
[【译】介绍 .NET Standard](https://zhuanlan.zhihu.com/p/24267356)
[.NET Standard Versions（版本对应图）](https://github.com/dotnet/standard/blob/master/docs/versions.md)
[[github]dotnet/standard](https://github.com/dotnet/standard)
[微软停止更新.NET Standard，.NET 5 取而代之](https://www.oschina.net/news/118690/the-future-of-net-standard?from=20200920)
选择建议：
1.   用于在.NET Framework 和所有其他平台之间共享代码，使用netstandard2.0
2.   用于在Mono，Xamarin 和.NET Core 3.x 之间共享代码，使用netstandard2.1
3.   向后共享代码，使用net5.0
[.NET API 一览表](https://docs.microsoft.com/en-us/dotnet/api/?view=netstandard-2.0)

#、运行机制
[.NET 的执行模型（CoreCLR 执行模型和Native AOT执行模型）](https://www.cnblogs.com/willick/p/15117222.html)
[200行代码，7个对象——让你了解ASP.NET Core框架的本质（带源码）](https://www.cnblogs.com/artech/p/inside-asp-net-core-framework.html)
(HttpContext，RequestDelegate，Middleware，ApplicationBuilder，Server，HttpListenerServer，WebHost)
[ASP.NET Core 服务是如何启动、配置并运行的](https://www.cnblogs.com/FlyLolo/p/ASPNETCore2_5.html)（IWebHost、Create­DefaultBuilder）
[深入理解.NET Core的基元: deps.json, runtimeconfig.json, dll文件](https://www.cnblogs.com/lwqlun/p/9704702.html)
补充：在vs中编译core项目时，在bin下面会生成deps.json记录nuget包依赖关系，并不会把依赖的nuget包拷贝到bin文件夹下。但执行dotnet publish命令发布core项目时，会将依赖的nuget包拷贝到发布目录
[.NET Core 运行时配置设置](https://docs.microsoft.com/zh-cn/dotnet/core/run-time-config/)（小节包含几篇文章，配置：依赖的包，加载路径，网络设置、线程设置等）
[使用Directory.Build.props 文件管理多个csproj项目的配置](https://cloud.tencent.com/developer/article/1342410?from=14588)

#、.NET Web 服务器
[ASP.NET Core web服务器实现( kestrel&HTTP.sys )](https://docs.microsoft.com/zh-cn/aspnet/core/fundamentals/servers/?view=aspnetcore-5.0&tabs=windows)
[为什么Linux 上的Asp.NET 5 需要 Kestrel ?](https://mp.weixin.qq.com/s/2MV6-Q5XDkntonjevOtZrg)
[ASP.NET Core 的Kestrel Web 服务器](https://docs.microsoft.com/zh-cn/aspnet/core/fundamentals/servers/kestrel?view=aspnetcore-2.2)
[ASP.NET Core 的HTTP.sys Web 服务器](https://docs.microsoft.com/zh-cn/aspnet/core/fundamentals/servers/httpsys?view=aspnetcore-2.2)

#、性能分析方案
性能分析
[使用MiniProfiler 分析ASP.NET Core 、EF Core 性能](https://mp.weixin.qq.com/s/7M18VhTz5y0W620sCEvXYQ)
[使用 BenchmarkDotnet 测试代码性能](https://www.cnblogs.com/h82258652/p/8748345.html)
分析快照堆栈、线程信息、异常信息、内存信息、GC信息等
[分析.net core在linux下内存占用过高问题](https://www.cnblogs.com/zhenglisai/p/14751677.html)（dotnet-counters，dotnet-dump）
[如何排查.NET 内存泄漏](https://mp.weixin.qq.com/s/-H1PMAQuEy0FGQ1QMwgK-g)（dotnet-counters，dotnet-dump）
[Windbg程序调试系列（内存泄露、线程阻塞、高CPU等）](https://www.cnblogs.com/tianqing/p/11307049.html)
[【一线码农】Windbg分析案例](https://www.cnblogs.com/huangxincheng/category/1967355.html)
[.NET GC 实时监控 dotnet-gcmon](https://www.cnblogs.com/myshowtime/p/15587070.html)


### 架构相关理论
#、设计理论
[一句话总结软件设计七大原则](http://c.biancheng.net/view/8508.html)
[一句话归纳23种设计模式](http://c.biancheng.net/view/8462.html)
[网站系统架构层次](https://www.cnblogs.com/printN/p/6822333.html)
[The Clean Architecture（干净体系架构）](https://docs.microsoft.com/zh-cn/dotnet/architecture/modern-web-apps-azure/common-web-application-architectures#clean-architecture)
[技术架构的战略和战术原则](https://mp.weixin.qq.com/s/ta57G3kLbxpNZ1tZK7XS-w)
[服务端高并发分布式架构15次演进之路](https://segmentfault.com/a/1190000018626163)
API设计
[四连问：API 接口应该如何设计？如何保证安全？如何签名？如何防重？](https://www.cnblogs.com/jurendage/p/12653865.html)
[API接口设计最佳实践](https://blog.csdn.net/justyman/article/details/103221939)
缓存
[一次缓存雪崩的灾难复盘（并讲解：缓存雪崩、缓存穿透、缓存击穿）](https://www.cnblogs.com/wzh2010/p/13874211.html)
[系统架构设计：进程缓存和缓存服务，如何抉择？](https://www.cnblogs.com/wzh2010/p/13874206.html)
[分布式之数据库和缓存双写一致性方案解析](https://www.cnblogs.com/rjzheng/p/9041659.html)
[MySQL数据库之互联网常用架构方案](https://www.cnblogs.com/littlecharacter/p/9084291.html)
[一文搞懂蓝绿发布、灰度发布和滚动发布](https://blog.51cto.com/lizhenliang/2400452)
[秒杀系统怎么设计？](https://mp.weixin.qq.com/s/aWGEOID5vEUoOy4tnLft8w)

#、领域驱动设计（DDD）
领域驱动涉及的主要概念：领域、界限上下文、领域模型、统一建模语言（UML）、模块、实体、值对象、应用服务&领域服务、领域事件、聚合、聚合根、仓储、工作单元（Uow）等等
[一文理解DDD 领域驱动设计！](https://mp.weixin.qq.com/s/NPyMO8ydGR7Eyrx7GK06sA)
[[圣杰]DDD理论学习系列——案例及目录](https://www.jianshu.com/p/6e2917551e63)
[DDD 领域驱动设计：贫血模型、充血模型的深入解读](https://mp.weixin.qq.com/s/S72vrneBBcRQUyge3UNolg)
[《微服务架构设计模式》读书笔记：微服务架构中的业务逻辑设计](https://www.cnblogs.com/dlhjw/p/15211689.html)
DDD中重要且难理解部分的摘抄：
1.   领域：一个领域本质上可以理解为就是一个问题域，只要是同一个领域，那问题域就相同。所以，只要我们确定了系统所属的领域，那这个系统的核心业务，即要解决的关键问题、问题的范围边界就基本确定了。
2.   领域模型：就是将业务中涉及到的概念以面向对象的思想进行抽象，抽象出实体对象，确定实体所对应的方法和属性，以及实体之间的关系。然后将这些实体和实体之间的关系以某种形式（比如UML、图形、代码、文字描述等）展现出来。
3.   模块：
l  模块通过分解领域模型为不同的模块，以降低领域模型的复杂性，提高领域模型的可读性。
l  模块的设计要符合高内聚低耦合的设计思想。
 [![image.png](/common/1642519842434-6a3c7771-9f17-4abc-9242-828cd2a2385b.png)](https://img2020.cnblogs.com/blog/106337/202111/106337-20211109153417874-113303678.jpg)
4.   领域事件= 事件发布+ 事件存储+ 事件分发+ 事件处理
5.   领域服务
l  领域服务是无状态的，它存在的意义就是协调多个领域对象完成某个操作，所有的状态还是都保存在相应的领域对象中。
l  领域服务还有一个很重要的功能就是可以避免领域逻辑泄露到应用层。因为如果没有领域服务，那么应用层会直接调用领域对象完成本该是属于领域服务该做的操作，这样一来，领域层可能会把一部分领域知识泄露到应用层。因为应用层需要了解每个领域对象的业务功能，具有哪些信息，以及它可能会与哪些其他领域对象交互，怎么交互等一系列领域知识。因此，引入领域服务可以有效的防治领域层的逻辑泄露到应用层。
6.   聚合和聚合根
l  聚合的一些特点：
1)   每个聚合有一个根和一个边界，边界定义了一个聚合内部有哪些实体或值对象，根是聚合内的某个实体；
2)   聚合内实现事务一致性，聚合外实现最终一致性（使用领域事件进行事务拆分，实现最终一致性）。在一个事务中，只能创建或更新一个聚合。
3)   聚合内部的对象之间可以相互引用，但是聚合外部如果要访问聚合内部的对象时，必须通过聚合根开始导航，绝对不能绕过聚合根直接访问聚合内的对象，也就是说聚合根是外部访问聚合的网关；
4)   聚合内除根以外的其他实体的唯一标识都是本地标识，也就是只要在聚合内部保持唯一即可，因为它们总是从属于这个聚合的；
5)   基于聚合的以上概念，我们可以推论出从数据库查询时的单元也是以聚合为一个单元，也就是说我们不能直接查询聚合内部的某个非根的对象；
6)   使用小聚合（大聚合会影响性能；大聚合容易导致并发冲突；大聚合扩展性差）
7)   聚合内部的对象可以保持对其他聚合根的引用；
8)   删除一个聚合根时必须同时删除该聚合内的所有相关对象，因为他们都同属于一个聚合，是一个完整的概念；
9)   停下来重构模型。寻找模型中觉得有些疑问或者是蹩脚的地方，比如思考一些对象应该通过关联导航获得到还是应该从仓储获取？聚合设计的是否正确？考虑模型的性能怎样，等等；
l  如何识别聚合：
先从业务的角度深入思考，然后慢慢分析出有哪些对象是：
1)   有独立存在的意义，即它是不依赖于其他对象的存在它才有意义的；
2)   可以被独立访问的，还是必须通过某个其他对象导航得到的；
有分析报告显示，通常在大部分领域模型中，有70%的聚合通常只有一个实体，即聚合根，该实体内部没有包含其他实体，只包含一些值对象；另外30%的聚合中，基本上也只包含两到三个实体。
l  如何识别聚合根：
如果一个聚合只有一个实体，那么这个实体就是聚合根；如果有多个实体，那么我们可以思考聚合内哪个对象有独立存在的意义并且可以和外部直接进行交互。
7.   仓储
l  仓储里面存放的对象一定是聚合，原因是领域模型中是以聚合的概念去划分边界的；聚合是我们更新对象的一个边界，事实上我们把整个聚合看成是一个整体概念，要么一起被取出来，要么一起被删除。我们永远不会单独对某个聚合内的子对象进行单独查询或做更新操作。因此，我们只对聚合设计仓储
l  仓储还有一个重要的特征就是分为仓储定义部分和仓储实现部分，在领域模型中我们定义仓储的接口，而在基础设施层实现具体的仓储。这样做的原因是：由于仓储背后的实现都是在和数据库打交道，但是我们又不希望客户（如应用层）把重点放在如何从数据库获取数据的问题上，因为这样做会导致客户（应用层）代码很混乱，很可能会因此而忽略了领域模型的存在。
l  仓储定义的接口要有具体领域意义，不能是一个模糊的通用的接口。通用接口会导致取数据逻辑泄露到应用层或领域层。

#、微服务
[微服务介绍](http://www.360doc.com/content/18/0408/13/40043863_743769502.shtml)
[微服务及其演进史](https://www.cnblogs.com/wzh2010/p/14940280.html)
[微服务划分的姿势](https://www.cnblogs.com/jackyfei/p/10856427.html)
[分布式系统架构的冰与火](https://www.jianshu.com/p/18284ef827a4?utm_campaign=maleskine&utm_content=note&utm_medium=seo_notes&utm_source=recommendation)
[从亚马逊的实践，谈分布式系统的难点](https://blog.csdn.net/weixin_33705053/article/details/86720945)
[.NET 微服务：适用于容器化.NET 应用程序的体系结构- 电子书](https://docs.microsoft.com/zh-cn/dotnet/architecture/microservices/)

#、中台
[阿里大中台小前台解读](https://blog.csdn.net/weixin_42674359/article/details/85099971)
[企业级中台建设](https://www.cnblogs.com/edisonchou/p/an_introduction_to_middle_end.html)
[头部电商的中台实践血泪总结](https://mp.weixin.qq.com/s/qup2r_jly4lrxVgxW5SsCQ)


### .NET 微服务架构
#、ABP基础开发框架
官网：[https://cn.abp.io/](https://cn.abp.io/)
github：[https://github.com/abpframework/abp](https://github.com/abpframework/abp)
官方教程：[https://docs.abp.io/zh-Hans/abp/latest](https://docs.abp.io/zh-Hans/abp/latest)
商业版demo：[https://commercial.abp.io/demo](https://commercial.abp.io/demo)
使用
get-started：[https://www.abp.io/get-started](https://www.abp.io/get-started)
(使用Volo.Abp.Cli下载项目有时会失败，可以在get-started网站上直接创建项目模板)
[基于abp vnext制作项目脚手架](https://mp.weixin.qq.com/s/bjLISCULMCOV7rKiGhSJXw)
AbpHelper.CLI
[使用ABPHelper自动生成代码 （CRUD演示）](https://github.com/EasyAbp/AbpHelper.CLI)
[CRUD演示](https://github.com/EasyAbp/AbpHelper.CLI/blob/develop/docs/images/crud.gif)
示例
[Abp官方所有示例](https://docs.abp.io/zh-Hans/abp/latest/Samples/Index)
[Abp官方微服务解决方案示例](https://docs.abp.io/zh-Hans/abp/latest/Samples/Microservice-Demo)
最佳实践
[跟着“土牛”学架构知识](https://blog.csdn.net/kaixincheng2009/article/details/104981315)
[[Abp官方]模块开发最佳实践& 约定](https://docs.abp.io/zh-Hans/abp/latest/Best-Practices/Index)
[基于ABP落地领域驱动设计-01.全景图](https://www.cnblogs.com/YGYH/p/14922609.html)
[基于ABP落地领域驱动设计-02.聚合和聚合根的最佳实践和原则](https://www.cnblogs.com/YGYH/p/14927599.html)
[基于ABP落地领域驱动设计-03.仓储和规约最佳实践和原则](https://www.cnblogs.com/YGYH/p/14931390.html)
[基于ABP落地领域驱动设计-04.领域服务和应用服务的最佳实践和原则](https://www.cnblogs.com/YGYH/p/14934791.html)
[基于ABP落地领域驱动设计-05.实体创建和更新最佳实践](https://www.cnblogs.com/YGYH/p/14934804.html)
[基于ABP落地领域驱动设计-06.正确区分领域逻辑和应用逻辑](https://www.cnblogs.com/YGYH/p/14934819.html)
其他：
Abp官方([https://www.abp.io/get-started](https://www.abp.io/get-started))有提供社区版前端客户端：Razor Pages、Blazor、Angular、ReactNative。暂时没有提供Vue前端客户端。这边给出几个vue-admin的社区资源：
[abp+vue-element-admin](https://github.com/colinin/abp-vue-admin-element-typescript)
[abp+vue-vben-admin(vue3+typescript+ant design)](https://github.com/colinin/vue-vben-admin-abp-vnext)
[abp-vnext-pro + vben](https://github.com/WangJunZzz/abp-vnext-pro)

模板项目图：
 [![image.png](/common/1642519842318-61f9a571-d9e2-4680-b75f-c78b37957fac.png)](https://img2020.cnblogs.com/blog/106337/202111/106337-20211109153418895-1141899126.png)
项目依赖图：
 [![image.png](/common/1642519842465-6b402cda-bef4-4830-ab75-648a13212cc6.png)](https://img2020.cnblogs.com/blog/106337/202111/106337-20211109153419779-1572559697.png)
因本人使用过ABP，所以文中以ABP基础开发框架为例
在DotNet Core中还有很多其他的优秀基础开发框架，如： [WTM](https://github.com/dotnetcore/WTM)、[Osharp](https://github.com/dotnetcore/OSharp)、[Blog.Core](https://github.com/anjoy8/Blog.Core)、[Furioin](https://github.com/monksoul/Furion)、[Silky](https://github.com/liuhll/silky) 等等


#、.NET 微服务相关的技术
API网关：Kong、Ocelot、Nginx
服务注册与发现：Consul（Consul Tamplate+nginx）、etcd、ZooKeeper
身份认证中心：IdentityServer4
服务调用：WebAPI、gRPC
消息事件总线：本地消息总线（进程内存缓存）、分布式消息总线（RabbitMQ、Kafka）
瞬态故障处理：Polly
分布式追踪：SkyWalking、Cat、Zipkin、Elastc.APM
分布式系统监控：Prometheus、（App.Metrics+InfluxDB+Grafana）
分布式事务：CAP、MassTransit
分布式日志：ExceptionLess、ELK
分布式缓存：StackExchange.Redis
分布式锁：RedLock.NET
消息队列：RabbitMQ、Kafka
配置中心：Apollo
DevOps：Jenkins、Docker、K8S、GitLab-ci、Azure Pipelines

相关资料推荐
API网关
[高性能微服务网关.NETCore客户端Kong.Net开源发布](https://www.cnblogs.com/viter/p/11142940.html)
[Ocelot简易教程（简介、配置、负载、认证、限流、聚合等）](https://www.cnblogs.com/cxt618/p/14682628.html)
认证授权
[RBAC权限系统分析、设计与实现](https://www.cnblogs.com/haolb123/p/15152124.html)
[[阮一峰]理解OAuth 2.0](http://www.ruanyifeng.com/blog/2014/05/oauth_2_0.html)
[OAuth2.0授权登录四种模式时序图](https://www.cnblogs.com/wwcom123/p/11600463.html)
[IdentityServer4实现了OAuth和OpenId Connect](https://www.jianshu.com/p/78d2bb18439c)
OAuth只负责Authorization（授权）. 那么谁来负责Authentication（认证）呢?那就是OpenId Connect, OpenId Connect是对OAuth的一种补充, 因为它能进行Authentication.
OAuth通常有以下几种endpoint：authorize，token，revocation等
OpenId Connect 通常有以下几种endpoints：userinfo，checksession，endsession，.well-known/openid-configuration，.well-known/jwks等
[[晓晨Master]IdentityServer4 中文文档与实战](https://www.cnblogs.com/stulzq/p/8119928.html)
[Asp.Net Core 中IdentityServer4 授权原理及刷新Token的应用](https://www.cnblogs.com/jlion/p/12501195.html)
[[免费视频]IdentityServer4 教程视频](https://www.bilibili.com/video/av42364337)
分布式事务
[聊聊分布式事务](https://www.cnblogs.com/savorboard/p/distributed-system-transaction-consistency.html)（ACID、CAP、BASE、2PC、TCC、本地消息表（异步确保）、MQ 事务消息）
[Asp.Net Core&CAP实现分布式事务](https://www.cnblogs.com/CKExp/p/14710976.html)
配置中心
Apollo
Apollo github：[https://github.com/ctripcorp/apollo](https://github.com/ctripcorp/apollo)
Apollo官方Demo：[http://106.54.227.205/](http://106.54.227.205/)（账户密码：apollo      admin）
AgileConfig
AgileConfig github：[https://github.com/dotnetcore/AgileConfig](https://github.com/dotnetcore/AgileConfig)
AgileConfig 官方Demo：[http://agileconfig_server.xbaby.xyz/ui](http://agileconfig_server.xbaby.xyz/ui)  （账户密码：admin    123456）
Redis
Redis，全称是Remote Dictionary Service,翻译过来就是，远程字典服务。
Redis属于nosql非关系型数据库。Nosql常见的数据关系，基本上是以key-value键值对形式存在的。
[基于Redis的分布式锁设计（RedLock.net）](https://www.cnblogs.com/xiaoxiaotank/p/14982602.html)
监控
[使用Elastic APM监控你的.NET Core应用](https://www.cnblogs.com/xiandnc/p/11480624.html)
[ASP.NET Core之跨平台的实时性能监控（App.Metrics+InfluxDB+Grafana）](http://www.cnblogs.com/GuZhenYin/p/7170010.html)
其他
[RabbitMQ 七种队列模式应用场景案例分析（通俗易懂）](https://blog.csdn.net/qq_32828253/article/details/110450249)

应用示例：
eShopOnContainers项目
[[github]eShopOnContainers](https://github.com/dotnet-architecture/eShopOnContainers)
[[圣杰]eShopOnContainers 分析文章系列](https://www.cnblogs.com/sheng-jie/p/9789180.html)
[[github]abp-samples/MicroserviceDemo项目](https://github.com/abpframework/abp-samples/tree/master/MicroserviceDemo)


### 云原生
TVP腾讯云最具价值专家张善友，他给到的解释是——“云原生的本质是一系列最佳实践的结合；云原生是云这种环境下的一种开发的理念、一种模式，无服务器、微服务、容器、DevOps都是云原生理念里面的子集。
[什么是云原生](https://mp.weixin.qq.com/s/2qExl8hr5PN_C--jI6hxow)
云是和本地相对的，传统的应用必须跑在本地服务器上，现在流行的应用都跑在云端，云包含了IaaS,、PaaS和SaaS。
原生就是土生土长的意思，我们在开始设计应用的时候就考虑到应用将来是运行云环境里面的，要充分利用云资源的优点，比如️云服务的弹性和分布式优势。
可以简单地把云原生理解为：云原生= 微服务+ DevOps + 容器化+ 持续交付
[云原生全景图谱](https://landscape.cncf.io/?selected=iguazio)
[云原生全景图详解](https://mp.weixin.qq.com/s/cgkkflioTiepIUyEwVbxkg)
[进击的.NET 在云原生时代的蜕变](https://www.cnblogs.com/shanyou/p/11566850.html)
[云原生应用的12要素](https://blog.csdn.net/wufaliang003/article/details/79533345)
给各种云服务一个灵活度排序：IaaS（各种云主机）> CaaS（Docker 等容器服务）> PaaS（BAE、SAE、GAE 等APP Engine）> FaaS > BaaS > SaaS（各种Web APP，如Google Doc）。（[查看更多=>](https://kb.cnblogs.com/page/651941/)）
 [![image.png](/common/1642519842516-0bd5b960-036d-4ff8-8250-795ee6257a7c.png)](https://img2020.cnblogs.com/blog/106337/202111/106337-20211109153420865-1229092781.png)

#、Docker 与Kubernetes（K8S）
[极简Docker和Kubernetes发展史](https://www.cnblogs.com/chenqionghe/p/11454248.html)
[Docker与k8s的恩怨情仇](https://www.cnblogs.com/powertoolsteam/p/14980851.html)
[Docker员工自述：我们为什么“输”给了Kubernetes？](https://mp.weixin.qq.com/s/tCABfqicCYQXVSa5hVMXvA)

Docker
[一文掌握 Docker 常用命令](https://www.cnblogs.com/heyuquan/p/docker-cmd-and-dotnetcore.html)

K8S
[kubernetes中文社区、中文文档](https://www.kubernetes.org.cn/k8s)
[8 分钟了解 Kubernetes](https://www.cnblogs.com/alisystemsoftware/p/11526534.html)
[[Edison Zhou]ASP.NET Core on K8s 入门学习系列文章目录](https://www.cnblogs.com/edisonchou/p/aspnet_core_on_k8s_foundation_artcles_index.html)
[Kubernetes + .NET Core 的落地实践（案例：本来生活网）](https://mp.weixin.qq.com/s/14DLVLzIt7lCoURuXZrpRQ)

实例
[如何使用vs将asp.net core项目添加容器支持并发布docker镜像到私有dockerhub和添加k8s/helm管理](https://www.cnblogs.com/fanshaoO/p/10571503.html)
[从零开始在Windows 上部署.NET Core 到 Kubernetes](https://mp.weixin.qq.com/s/ZBFdIO5scyFRA45yVUcEDA)

#、自动化集成与部署
流程：编码-> 构建-> 集成-> 测试-> 交付-> 部署
[一文看懂持续部署按需发布！DevOps部署和发布方法大全](https://mp.weixin.qq.com/s/kzxKoRawrxY95t-DMQwyhg)
[[CI&CD]jenkins自动化工具使用教程](https://www.cnblogs.com/heyuquan/p/jenkins-use-guide.html)
持续集成（Continuous Integration）简称CI
持续交付（Continuous Delivery）简称CD
GitHub Actions
[GitHub Actions 快速入门](https://docs.github.com/cn/actions/quickstart)
[两种github action 打包.Net Core 项目docker镜像推送到阿里云镜像仓库](https://www.cnblogs.com/pual13/p/15224138.html)
Azure Pipeline
[使用Azure DevOps Pipeline实现.Net Core程序的CI](https://www.cnblogs.com/kklldog/p/azure-devops-pipeline.html)
示例：[WTM-pipelines](https://github.com/dotnetcore/WTM/tree/develop/.azure/pipelines)

### 资料
[https://www.cnblogs.com/heyuquan/p/dotnet-architecture-learning-resource.html](https://www.cnblogs.com/heyuquan/p/dotnet-architecture-learning-resource.html)
