---
title: 资料精选进阶篇
lang: zh-CN
date: 2022-05-18
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: ziliaojingshuajinjiepian
slug: kaec26
docsId: '65198399'
---
:::tip
来自网络，内容是否过时自行判断
:::
### .NET 工程化
#、StyleCop编码规范
[StyleCop规则汇总](https://www.cnblogs.com/DarkInNight/p/5457875.html)
[在VS2017中使用StyleCop](https://www.jianshu.com/p/dab842095449)
[netcore将StyleCop.Analyzers自定义规则应用到整个解决方案](https://blog.csdn.net/michel4liu/article/details/83388336)

#、Nuget包
[Nuget Cli 命令](https://docs.microsoft.com/zh-cn/nuget/reference/nuget-exe-cli-reference)

[在 Vistual Studio 中管理项目、解决方案的nuget包](https://docs.microsoft.com/zh-cn/nuget/consume-packages/install-use-packages-visual-studio)
创建并发布Nuget包
[使用 Visual Studio 创建和发布 NuGet 包](https://docs.microsoft.com/zh-cn/nuget/quickstart/create-and-publish-a-package-using-visual-studio?tabs=netcore-cli)
[使用 Visual Studio 创建包并通过浏览器上传发布（使用简单）](https://www.cnblogs.com/xiongze520/p/15241207.html)
搭建本地Nuget
[使用NuGet.Server 搭建本地Nuget](https://www.cnblogs.com/hunternet/p/12880210.html)（为什么要规范使用nuget包，如何清除本地包缓存）
[使用BaGet搭建本地Nuget](https://www.cnblogs.com/kklldog/p/15236377.html)
[使用FuGet搭建本地Nuget](https://www.cnblogs.com/savorboard/p/fuget.html)

#、Swagger Api文档
[Swagger 规范 (swagger.json)](https://docs.microsoft.com/zh-cn/aspnet/core/tutorials/web-api-help-pages-using-swagger?view=aspnetcore-2.2)
[Swagger+AutoRest 生成web api客户端(.Net)](https://www.cnblogs.com/beyondbit/p/5957124.html)
Swashbuckle方式
[.NET Core 集成Swagger文档与自定义Swagger UI、API分组](https://www.cnblogs.com/cool-net/p/15655036.html)
[Asp.Net Core 使用Swagger生成API文档并添加文档描述、响应类型描述](https://www.cnblogs.com/yilezhu/p/9241261.html)
[.NET Core swagger扩展配置（请求示例、约束请求/响应媒体类型、指示API的预期输出内容、预期状态码）](https://www.cnblogs.com/JulianHuang/p/14131203.html)
[Asp.Net Core 给API的Model生成说明文档、隐藏某些API](https://mp.weixin.qq.com/s/SHNNQoYF-t8i2j85E1oSYA)
[一个Swagger支持多个api端口的配置（方便测试）](https://www.cnblogs.com/axzxs2001/archive/2018/07/02/9253495.html)
[Swagger UI 将枚举数字显示位字符串](https://www.5axxw.com/questions/content/tv3wgq)（也可扩展为显示枚举的中文描述信息）

[Asp.Net Core Swagger 页面支持文件上传](https://www.cnblogs.com/Erik_Xu/p/8904854.html)
NSwag方式
[Asp.Net Core 使用NSwag生成Swagger Api文档](https://docs.microsoft.com/zh-cn/aspnet/core/tutorials/getting-started-with-nswag?view=aspnetcore-2.2&tabs=visual-studio)
[NSwagStudio for Swagger Api](https://www.cnblogs.com/w2011/p/5979708.html)
借助 NSwagStudio 工具可为包含 Swagger 的第三方 API，生成API客户端代理代码


### AOP面向切面编程
AOP（Aspect-Oriented Programming）是一种将函数的辅助性功能与业务逻辑相分离的编程范式（programming paradigm），其目的是将横切关注点（cross-cutting concerns）分离出来，使得程序具有更高的模块化特性。
AOP体现原则：单一职责原则 和 开放封闭原则
在ASP.NET Core中可使用三种方式实现AOP：中间件Middleware、过滤器Filter、代码织入（静态织入和动态代理）

#、中间件Middleware（管道级）
中间件就是嵌入到应用管道中用于处理请求和响应的一段代码，ASP.NET Core 中使用了大量的中间件。eg：全局异常、路由、响应缓存、响应压缩、身份认证、CORS、日志记录等等

 [ASP.NET Core Middleware 的实现（Conventional Middleware 和IMiddleware）](https://www.cnblogs.com/Cwj-XFH/p/9690728.html)
ASP.NET Core Middleware 的实现（Run，Map，Use，内置中间件）
 [【机翻】](https://docs.microsoft.com/zh-cn/aspnet/core/fundamentals/middleware/?view=aspnetcore-2.1) [【人工翻译】](https://www.cnblogs.com/stulzq/p/7760648.html)

#、过滤器Filter（action级）
 [ASP.NET Core 被低估的过滤器](https://www.cnblogs.com/viter/p/10107886.html)
 [ASP.NET Core MVC Filter的定义、注册和各种Filter执行顺序](https://cloud.tencent.com/developer/article/1399634)

#、代码织入（对象的拦截器）
l  编译时静态织入
框架：[PostSharp](https://www.postsharp.net/)、[Fody](https://github.com/Fody/Fody)
特点：[编译型]性能高，缺点是缺乏灵活性
实现思想：给语言的编译器做扩展，使得在编译程序的时候编译器将相应的“切面”代码织入到业务代码的指定连接点，输出整合的结果。
l  运行时动态织入（动态代理）
框架：[Castle DynamicProxy](https://github.com/castleproject/Core)，
特点：[运行时动态代理]灵活性高，性能相对“静态织入”低
实现方式：将扩展添加到运行虚拟机而不是编译器。切面代码和业务代码分别独立编译，而在运行时由虚拟机在必要时进行织入。

[.Net AOP代码织入介绍](http://www.cnblogs.com/farb/p/AOPIntroduction.html)
[.Net AOP代码织入实现类型及原理（静态、动态、优缺点）](https://www.cnblogs.com/farb/p/AopImplementationTypes.html)
[.Net AOP代码织入之《拦截方法》（包含案例：数据事物、多线程）](https://www.cnblogs.com/farb/p/MethodInterception.html)
[.Net AOP代码织入之《单元测试切面》](https://www.cnblogs.com/farb/p/UnitTestAspects.html)
[.Net AOP代码织入之《案例：构建一个汽车租赁应用》](http://www.cnblogs.com/farb/p/AOPBuildACarRentApp.html)
演示了清晰的业务代码，因为非功能性需求（eg：logging，防御性编程，事务，重试，和异常处理等）导致代码变得冗长、难懂、不易维护。通过使用AOP来让业务代码重新清晰化
[.NET Core 原生DI+AOP实现注解式编程](https://www.cnblogs.com/hezp/p/11346120.html)


### 异常处理
[Restful API 中的错误处理设计](https://www.cnblogs.com/alterem/p/11280504.html)
[ASP.NET Core 应用的错误处理[1]：三种呈现错误页面的方式](https://www.cnblogs.com/artech/p/error-handling-in-asp-net-core-1.html)
[使用UseStatusCodePages 根据Status选择处理方式（跳转页面）](https://www.cnblogs.com/xiyin/p/7507405.html)
[ASP.NET Core 自定义ErrorHandlingMiddleware 全局异常捕获](https://www.cnblogs.com/hulizhong/p/10797636.html)


### 缓存
[.NET Core 缓存使用、配置、依赖策略](https://www.cnblogs.com/viter/p/10146312.html)
[.NET Core MemoryCache 缓存过期策略（绝对、滑动、依赖、过期回调）](https://www.cnblogs.com/ants/p/8482227.html)
[ASP.NET Core 使用分布式缓存（redis、sqlserver）](https://www.cnblogs.com/viter/p/10161581.html)
[ASP.NET Core 使用RedLock.net 实现分布式锁](https://mp.weixin.qq.com/s/gwiCY6qfLtWLDe2AjlbOsw)


### 日志
[.Net Core 自带 Logging 配置文件的使用](https://blog.csdn.net/liuzishang/article/details/99817158)
[玩转ASP.NET Core 中的日志组件](https://www.cnblogs.com/lwqlun/p/9683482.html)
[[github]ASP.NET Core Microsoft.Extensions.Logging 默认log组件](https://github.com/aspnet/Extensions/tree/master/src/Logging)
[ASP.NET Core 中使用Nlog 记录日志](https://www.cnblogs.com/tshaoguo/p/10142786.html)
[ASP.NET Core 中使用Serilog 记录日志](https://www.cnblogs.com/zhangnever/p/12459399.html)   （代码配置、配置文件配置）
[ASP.NET Core 中使用log4net 记录日志](https://www.cnblogs.com/intotf/p/10075592.html)
分布式日志
[.NET Core中使用Exceptionless分布式日志框架](https://www.cnblogs.com/ZaraNet/p/10315313.html)
[Exceptionless 5.0.0 本地Docker快速部署介绍](https://www.cnblogs.com/edisonchou/p/exceptionless_v5_deployment_introduction.html)
[.NET Core 快速搭建Docker-ELK分布式日志中心](https://www.cnblogs.com/ShaoJianan/p/11455250.html)
elasticsearch
 [Asp.Net Core 项目中使用 Serilog 输出日志到 Elasticsearch](https://www.cnblogs.com/fallTakeMan/p/13550713.html)
[ASP.NET Core使用Elasticsearch记录NLog日志](https://www.cnblogs.com/lwc1st/p/10009935.html)
 [Docker安装Elasticsearch-Head插件(可视化查询界面)](https://www.cnblogs.com/wxy0126/p/11381598.html)    [(如何使用)](https://www.shuzhiduo.com/A/6pdDAWnXzw/)
[asp.net core 自定义基于 HttpContext 的 Serilog Enricher](https://www.cnblogs.com/weihanli/p/12105239.html)
日志摄取器
[为什么我们需要Logstash,Fluentd等日志摄取器？](https://blog.csdn.net/qq_30236895/article/details/108191662)
 [ASP.NET Core容器化应用无侵入日志收集方案（nlog+EFK）](https://www.cnblogs.com/JulianHuang/p/14049455.html)


### 响应优化
[在ASP.NET Core 中的响应压缩](https://docs.microsoft.com/zh-cn/aspnet/core/performance/response-compression?view=aspnetcore-2.1)
[ASP.NET Core 中使用ResponseCache 响应缓存](https://blog.csdn.net/mzl87/article/details/88821982)


### 上传下载
[ASP.NET Core 中的文件上传（IFormFile）、流式处理上传大文件](https://docs.microsoft.com/zh-cn/aspnet/core/mvc/models/file-uploads?view=aspnetcore-2.2)
[.NET Core Web API 基于tus协议实现断点续传(上传)](https://www.cnblogs.com/CreateMyself/p/13466457.html)
[ASP.NET Core 下载断点续传](https://www.cnblogs.com/CreateMyself/p/8449414.html)
[.NET Core 多线程下载（Downloader插件）](https://www.cnblogs.com/Soar1991/p/15165595.html)


### 健康检查
[ASP.NET Core 中的运行状况检查（IHealthCheck）](https://docs.microsoft.com/zh-cn/aspnet/core/host-and-deploy/health-checks?view=aspnetcore-5.0)
[.Net Core实现健康检查（UI）](https://www.cnblogs.com/yyfh/p/11787434.html)
[[github]ASP.NET Core HealthChecks（健康检查，异常webhooks通知）](https://github.com/Xabaril/AspNetCore.Diagnostics.HealthChecks)
使用案例：
[使用ASP.NET Core实现Docker的HealthCheck指令](https://www.cnblogs.com/JulianHuang/p/10837804.html)
[Kubernetes liveness and readiness probes using HealthChecks](https://github.com/Xabaril/AspNetCore.Diagnostics.HealthChecks/blob/master/doc/kubernetes-liveness.md)


### 其他特性
#、对象池

[.NET Core 中Object Pool的简单使用](https://www.cnblogs.com/catcher1994/p/9666944.html)
[如何在 C## 中使用 ArrayPool 和 MemoryPool](https://www.cnblogs.com/ireadme/p/14521356.html)

#、WebHooks
[ASP.NET Webhook 概述](https://docs.microsoft.com/zh-cn/aspnet/webhooks/)
[WebHooks with ASP.NET Core – DropBox and GitHub](https://www.talkingdotnet.com/webhooks-with-asp-net-core-dropbox-and-github/)


### 后台任务
基础知识
[服务宿主是IIS，需要注意IIS的回收策略对后台任务的影响](https://q.cnblogs.com/q/87178/)
[Cron表达式](https://www.cnblogs.com/zhangweizhong/p/4889276.html)
[Cron表达式在线生成](https://www.bejson.com/othertools/cron/)
[ASP.NET Core 中使用托管服务实现后台任务（后台任务、作用域任务、队列任务）](https://docs.microsoft.com/zh-cn/aspnet/core/fundamentals/host/hosted-services?view=aspnetcore-3.0&tabs=visual-studio)
[.NET Core 创建跨平台后台服务（windows、linux）](https://www.cnblogs.com/podolski/p/13890572.html)

[.NET Worker Service 如何优雅退出（IHostApplicationLifetime ）](https://www.cnblogs.com/ittranslator/p/worker-service-gracefully-shutdown.html)
[使用Topshelf 创建Windows 服务](https://www.cnblogs.com/abeam/p/8032080.html)
#、[Hangfire（5024 stars）](https://github.com/HangfireIO/Hangfire)
特点：不需要Windows服务或单独的进程
[ASP.NET Core 中使用Hangfire任务管理（含Dashboard）](http://docs.hangfire.io/en/latest/getting-started/aspnet-core-applications.html)
[Hangfire 授权、自定义路由、只读Dashboard、多数据库源、设置主应用](http://docs.hangfire.io/en/latest/configuration/using-dashboard.html)
[Hangfire 队列任务、计划任务、周期性任务](http://docs.hangfire.io/en/latest/background-methods/index.html)
[ASP.NET Core 中使用Hangfire.Redis.StackExchange存储](https://github.com/marcoCasamento/Hangfire.Redis.StackExchange)
[ASP.NET Core 中Hangfire.Cronos 结合BackgroundService 实现任务调度](https://www.cnblogs.com/weihanli/p/implement-job-schedule-via-cron-for-dotnetcore.html)
[使用Hangfire.HttpJob实现调度与业务分离](https://github.com/yuzd/Hangfire.HttpJob/wiki/00.QickStart)
[使用ASP.NET Core和Hangfire实现HTTP异步化方案](https://blog.csdn.net/qinyuanpei/article/details/95936781)
#、[Quartz.NET（3404 stars）](https://github.com/quartznet/quartznet)
[Quartz.Net几种部署模式(IIS、Exe、服务部署【借助TopSelf、服务类】）](https://www.cnblogs.com/yaopengfei/p/8613198.html)
[ASP.NET Core2.2+Quartz.Net 实现web定时任务](https://www.cnblogs.com/JulianHuang/p/10361763.html)
[Quartz.NET 配置文件详解（quartz.config 和quartz_jobs.xml）](https://www.cnblogs.com/abeam/p/8044460.html)
----quartz.config可以合并到App.config和Web.config中
[quartz.net 3.x版本如何通过xml文件进行Job配置](https://blog.csdn.net/starfd/article/details/80016513)
[CrystalQuartz](https://github.com/guryanovev/CrystalQuartz)
[配置Quartz.NET Cluster以及远程管理（CrystalQuartz）](https://www.cnblogs.com/shanyou/archive/2012/12/29/2838721.html)
[Quartz.NET 可视化Job管理（CrystalQuartz）](https://www.cnblogs.com/Wolfmanlq/p/5873235.html)
[CrystalQuartz 在线 Demo](http://guryanovev.github.io/CrystalQuartz/demo/)
#、其他优秀后台任务开源库

[[github] FluentScheduler](https://github.com/fluentscheduler/FluentScheduler)


### 认证和授权
[授权认证登录之 Cookie、Session、Token、JWT 详解](https://blog.csdn.net/huangpb123/article/details/103933400)
[理解ASP.NET Core验证模型(Claim, ClaimsIdentity, ClaimsPrincipal)](https://www.cnblogs.com/dudu/p/6367303.html)
简单说明： Claim就是证件中的信息；ClaimsIdentity就是证件（eg：现实生活中的身份证）；ClaimsPrincipal就是持有证件的人

#、ASP.NET Core Identity身份认证
命名空间：Microsoft.AspNetCore.Identity
[创建完整的ASP.NET Core Identity基架（多图）](https://www.cnblogs.com/MrHSR/archive/2019/03/21/10572462.html)
[ASP.NET Core Identity框架简介](https://docs.microsoft.com/zh-cn/aspnet/core/security/authentication/identity?view=aspnetcore-3.0&tabs=visual-studio)
[ASP.NET Core Identity配置（声明类型、锁定策略、密码策略、登录策略等等）](https://docs.microsoft.com/zh-cn/aspnet/core/security/authentication/identity-configuration?view=aspnetcore-3.0)
[ASP.NET Core 中注册确认电子邮件和重置密码](https://docs.microsoft.com/zh-cn/aspnet/core/security/authentication/accconfirm?view=aspnetcore-3.0&tabs=visual-studio)
双因素认证
[双因素认证（2FA）教程[阮一峰]](http://www.ruanyifeng.com/blog/2017/11/2fa-tutorial.html)
 [在ASP.NET Core 中启用TOTP身份验证APP](https://docs.microsoft.com/zh-cn/aspnet/core/security/authentication/identity-enable-qrcodes?view=aspnetcore-3.0)
[ASP.NET Core Identity身份验证支持OAuth2第三方验证提供程序](https://docs.microsoft.com/zh-cn/aspnet/core/security/authentication/social/?view=aspnetcore-3.0&tabs=visual-studio)
[ASP.NET Core Identity中自定义模型](https://docs.microsoft.com/zh-cn/aspnet/core/security/authentication/customize-identity-model?view=aspnetcore-3.0)
[ASP.NET Core Idendity自定义存储提供程序（Azure表存储、Dapper）](https://docs.microsoft.com/zh-cn/aspnet/core/security/authentication/identity-custom-storage-providers?view=aspnetcore-3.0)
#、基于Cookie的身份认证
命名空间：Microsoft.AspNetCore.Authentication.Cookies
[ASP.NET Core中使用Cookie身份验证](https://docs.microsoft.com/zh-cn/aspnet/core/security/authentication/cookie?view=aspnetcore-3.0)
[ASP.NET Core Cookie身份验证支持OAuth2第三方验证提供程序](https://docs.microsoft.com/zh-cn/aspnet/core/security/authentication/social/social-without-identity?view=aspnetcore-3.0)
#、授权
命名空间：Microsoft.AspNetCore.Authorization
[ASP.NET Core 简单授权](https://docs.microsoft.com/zh-cn/aspnet/core/security/authorization/simple?view=aspnetcore-3.0)
[ASP.NET Core 基于角色的授权](https://docs.microsoft.com/zh-cn/aspnet/core/security/authorization/roles?view=aspnetcore-3.0)
[ASP.NET Core 基于声明的授权](https://docs.microsoft.com/zh-cn/aspnet/core/security/authorization/claims?view=aspnetcore-3.0)
[ASP.NET Core 基于策略的授权](https://docs.microsoft.com/zh-cn/aspnet/core/security/authorization/policies?view=aspnetcore-3.0)
[ASP.NET Core 自定义授权提供程序](https://docs.microsoft.com/zh-cn/aspnet/core/security/authorization/iauthorizationpolicyprovider?view=aspnetcore-3.0)
[ASP.NET Core web api基于JWT自定义策略授权](https://www.cnblogs.com/axzxs2001/p/7530929.html)
[ASP.NET Core Authentication and Authorization](https://www.cnblogs.com/kklldog/p/auth-in-aspnetcore.html)
[ASP.NET Core razor page 授权约定](https://docs.microsoft.com/zh-cn/aspnet/core/security/authorization/razor-pages-authorization?view=aspnetcore-3.1)
.NET Core JWT权限验证   [[博文]](https://mp.weixin.qq.com/s/7135y3MkUlPIp-flfwscig)   [[视频]](https://www.bilibili.com/video/av58096866/?p=4)
[ASP.NET Core JWT认证、更改Token来源、更改Token验证方式](https://www.cnblogs.com/jesse2013/p/integrate-with-lagacy-auth.html)
#、IdentityServer4 认证授权
[[阮一峰]理解OAuth 2.0](http://www.ruanyifeng.com/blog/2014/05/oauth_2_0.html)
[OAuth2.0授权登录四种模式时序图](https://www.cnblogs.com/wwcom123/p/11600463.html)
[[晓晨Master]IdentityServer4 中文文档与实战](https://www.cnblogs.com/stulzq/p/8119928.html)
[[免费视频]IdentityServer4 教程视频](https://www.bilibili.com/video/av42364337)
[[github]IdentityServer4.Admin](https://github.com/skoruba/IdentityServer4.Admin)
.Net Core IdentityServer4：使用.Net Framework客户端对接
（1）[.Net Framework 客户端Owin方式对接ids4](https://www.cnblogs.com/zhenl/p/15654284.html)
（2）[.Net Framework 客户端User和Role的解析](https://www.cnblogs.com/zhenl/p/15660567.html)


### 安全性
[前端业务安全综述](https://www.cnblogs.com/cYang2030/p/14109682.html)
[.NET应用程序安全操作概述](https://mp.weixin.qq.com/s/ocxEvKlobtq0Inq9lfR3jw)
[检查HTTP Header 是否安全](https://securityheaders.com/)
[.NET项目安全设置向导](https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/DotNet_Security_Cheat_Sheet.md)

[在.NET Core中使用 MachineKey (NuGet包：AspNetTicketBridge)](https://www.cnblogs.com/sdflysha/p/20200222-machingkey-in-dotnetcore.html)
[ASP.NET Core 优雅的在开发环境保存机密（User Secrets）--secrets.json](https://www.cnblogs.com/savorboard/p/dotnetcore-user-secrets.html)
#、HTTPS
[在ASP.NET Core 中强制实施 HTTPS](https://docs.microsoft.com/zh-cn/aspnet/core/security/enforcing-ssl?view=aspnetcore-2.2&tabs=visual-studio)
[.NetCore+OpenSSL实现Https](https://www.cnblogs.com/chenxf1117/p/15119692.html)
[.NET Core如何配置TLS Cipher（套件）](https://www.cnblogs.com/CreateMyself/p/15643871.html)
证书
[免费申请HTTPS通配符证书（Let's Encrypt证书）](https://www.cnblogs.com/liuju150/p/FreeHTTPS_SSL_LetsEncrypt20201030.html)----([windows桌面工具>>](https://certifytheweb.com/))

[使用脚本持续自动从Letsencrypt更新CA证书](https://mp.weixin.qq.com/s/jfiQGFoLlwV2LnXTkuZJeQ)---免费的Letsencrypt证书一般有效期为三个月
aspnet core 本地localhost调试证书安装或过期，则执行命令：(cmd执行 certlm.msc 命令，进入证书管理)
dotnet dev-certs https --clean
dotnet dev-certs https --trust
[服务端和客户端证书各种组合下对访问者(浏览器/中间人)的影响](https://mp.weixin.qq.com/s/KGyADz_yo3kAGZssVZC--Q)
[.NET Core 强制使用https，把所有的HTTP请求转换为HTTPS](https://www.jianshu.com/p/f70e8acba934)
HSTS（HTTP严格传输安全）
使用HTTPS重定向仍然存在一下较小的安全风险，因为用户可以在重定向到安全HTTPS连接之前使用HTTP发出初始请求。为了解决这个问题，HTTP严格传输安全性（HSTS）协议在响应中添加了一个标头，指示在向Web端点发送请求时仅应使用HTTPS。一旦接收到HSTS标头，即使用户指定了HTTP URL，支持HSTS协议的客户端也将始终使用HTTPS向应用程序发送请求。
[ASP.NET Core 3.1中HTTPS的配置（环境变量中指定证书）](https://baijiahao.baidu.com/s?id=1671643693192936159&wfr=spider&for=pc)
[HTTP Strict Transport Security (HSTS) in ASP.NET Core](https://www.cnblogs.com/JulianHuang/p/12156997.html)
#、Data Protection 机制 (.NET Core 数据保护)
[ASP.NET Core 数据保护（Data Protection）【上】](https://www.cnblogs.com/savorboard/p/dotnetcore-data-protection.html)
[ASP.NET Core 数据保护（Data Protection）【中】](https://www.cnblogs.com/savorboard/p/dotnet-core-data-protection.html)
[ASP.NET Core 数据保护（Data Protection 集群场景）【下】](https://www.cnblogs.com/savorboard/p/dotnetcore-data-protected-farm.html)
#、CORS
[跨域资源共享CORS 详解](http://www.ruanyifeng.com/blog/2016/04/cors.html)
[ASP.NET Core 中启用跨域请求 (CORS)](https://docs.microsoft.com/zh-cn/aspnet/core/security/cors?view=aspnetcore-2.2)
#、CSRF
[浅谈CSRF攻击方式](https://www.cnblogs.com/hyddd/archive/2009/04/09/1432744.html)
[SameSite Cookie，防止CSRF 攻击](https://www.cnblogs.com/ziyunfei/p/5637945.html)
[ASP.NET Core 防止跨站点请求伪造(XSRF/CSRF) 攻击](https://docs.microsoft.com/zh-cn/aspnet/core/security/anti-request-forgery?view=aspnetcore-2.2)
[ASP.NET Core WebAPI 中防御跨站请求伪造攻击（CSRF）](https://beginor.github.io/2019/05/27/anti-forgery-with-asp-net-core-and-angular.html)
[ASP.NET Core 启用客户端IP 安全列表](https://docs.microsoft.com/zh-cn/aspnet/core/security/ip-safelist?view=aspnetcore-2.2)


### EF Core
[EF Core 微软官网教程（非常全）](https://docs.microsoft.com/zh-cn/ef/core/)
Linq
[Linq入门详解（Linq to Objects）](https://www.cnblogs.com/heyuquan/p/Linq-to-Objects.html)
[如何优化 .NET Core 中的 lambda 查询表达式 ?](https://mp.weixin.qq.com/s/b5j7qIboTNRw1vF_r6N4NA)
[3分钟了解数据库事务(ACID、事务隔离级别)](https://mp.weixin.qq.com/s/u9m-lS9a0kt0UWHIJl61JQ)
SQL执行记录
[将EF Core生成的SQL语句显示在控制台中](https://www.cnblogs.com/lwqlun/p/13551149.html)(10楼评论)
[SQL Server Profiler的简单过滤使用，方便查找和发现SQL执行的效率和语句问题](https://www.cnblogs.com/jijm123/p/10092601.html)
[使用 SQL Server Profiler 查看指定ApplicationName产生的sql语句](https://www.cnblogs.com/NoteBooks/p/4533567.html)
[EF Core 5提供的ToQueryString()查看Linq生成的SQL语句](https://jishuin.proginn.com/p/763bfbd3a601)

[使用DbContextPool提高EfCore查询性能](https://mp.weixin.qq.com/s/-AaHe5RnAWlRlryVdp7MhQ)
[EF Core DbFirst：从数据库生成实体类（反向工程）](https://www.cnblogs.com/yangjinwang/p/9516988.html)
Code First
[EF Core CodeFirst：从实体创建数据库--示例](https://www.cnblogs.com/xx2oo8/p/7660352.html)
[EF Core CodeFirst：从实体创建数据库--命令和语法](https://docs.microsoft.com/zh-cn/ef/core/managing-schemas/migrations/index)
[EFCore数据库迁移命令（使用Script-Migration命令生成迁移sql语句--注意：不含from，含to）](https://blog.csdn.net/banluanhou7090/article/details/101076657)
[EF Core 小技巧：迁移已经应用到数据库，如何进行迁移回退操作？](https://www.cnblogs.com/YGYH/p/15529993.html)
迁移疑问
[EF Core CodeFirst：创建数据库迁移时报：Unable to create an object of type 'ApplicationDbContext' ，解决方案：DesignTimeDbContextFactory](https://blog.csdn.net/qq_36523613/article/details/83063077)
[如何理解 Code-First migration, up/down方法?](https://stackoverflow.com/questions/9769515/c-sharp-code-first-migration-up-down)
全局唯一Id、有序GUID
[如何在高并发分布式系统中生成全局唯一Id](https://www.cnblogs.com/heyuquan/p/global-guid-identity-maxId.html)
[使用有序GUID：提升其在各数据库中作为主键时的性能](https://mp.weixin.qq.com/s/C6xk42s-4SwyszJPTM0G6A)
[如何使用有序GUID提升数据库读写性能](https://mp.weixin.qq.com/s/-eeIXF7NUtkgELrFKbHVtA)
模型配置
[EF Core 自动生成值配置](https://docs.microsoft.com/zh-cn/ef/core/modeling/generated-properties)
[EF Core 创建组合主键（HasKey(c => new { a, b })）](http://m.tnblog.net/13983647446/article/details/5372)
[EF Core 实体间关系](https://docs.microsoft.com/zh-cn/ef/core/modeling/relationships)
[EF Core 中关系模式一对一、一对多、多对多的使用](https://www.cnblogs.com/1175429393wljblog/p/12582707.html)
级联删除
[EF Core 级联删除](https://docs.microsoft.com/zh-cn/ef/core/saving/cascade-delete#delete-orphans-examples)
[SQL SERVER 数据库级联删除](https://www.cnblogs.com/Jackie-sky/p/5543306.html)
需要注意：级联删除是数据库的特性。如使用ABP Vnext中的软删除，那么只是将记录的IsDeleted设置为true，并不是真正的删除记录，所以没有级联删除子表的效果。。。同时，子表的IsDeleted也并没有设置为true，需要代码调用软删除子表（所以这边应该走聚合根的删除，达到整体删除/软删除的目的）。。。（考察版本 ABP Vnext 4.3.0）
关系数据库建模
[关系数据库建模(表映射、列映射、数据类型、索引等等)](https://docs.microsoft.com/zh-cn/ef/core/modeling/relational/)
[EF Core 生成跟踪列（eg：CreatedAt，CreatedBy等列）](https://www.cnblogs.com/tdfblog/p/entity-framework-core-generate-tracking-columns.html)
枚举映射
[在EF core 使用枚举类型](https://blog.csdn.net/waitaction/article/details/88639152)
[EF 枚举类型映射数据库](https://blog.csdn.net/xuefuruanjian/article/details/85236052)
并发
[EF Core 并发检查](https://docs.microsoft.com/zh-cn/ef/core/modeling/concurrency)
[EF Core 并发冲突处理](https://docs.microsoft.com/zh-cn/ef/core/saving/concurrency)
数据查询
[EF 中 IEnumerable，IQueryable ，Include 的用法](https://www.cnblogs.com/woxpp/p/entityframeworkinclude.html)
[EF Core 关联数据加载策略（预先加载、显示加载、延迟加载）](https://docs.microsoft.com/zh-cn/ef/core/querying/related-data) -- 预先加载中关于多级关联的使用ThenInclude。Blog -> Posts -> (Author 和 Tags)案例
[深入了解 EFCore2.1 中加入的延迟加载](https://www.cnblogs.com/CreateMyself/p/9195131.html) （EF 6.x默认启用了延迟加载，EFCore需要引入Proxies包显示启用）
[EF Core 跟踪与非跟踪查询（AsNoTracking）](https://docs.microsoft.com/zh-cn/ef/core/querying/tracking)
[EF Core 全局查询筛选器（软删除、多租户等）](https://docs.microsoft.com/zh-cn/ef/core/querying/filters)
[EF Core 查询标签TagWith (生成查询注释信息)](https://mp.weixin.qq.com/s/TvDCSdhvoUdL2lapGpgJGw)
数据过滤
[EF Core 使用like 函数实现模糊查询](https://www.cnblogs.com/tdfblog/p/entity-framework-core-like-query.html)
[如何在 Entity Framework 中计算时间差 ？（EF.Functions.DateDiffDay）](https://mp.weixin.qq.com/s/aXYd9bqtRQ8_KDinYhXssg)
大数据量相关
批量数据操作
[EF Core 原生支持的批量插入操作（sp_executesql）](https://www.cnblogs.com/JulianHuang/p/11897788.html)
Z.EntityFramework
[[收费]使用Entity Framework Extensions 实现批量增、删、改](https://entityframework-extensions.net/) --  Z.EntityFramework.Extensions.EFCore（截止2021/7/26 下载数：5,556,261）
[[免费]Entity Framework Extensions 提供功能缩减版：EntityFramework-Plus](https://github.com/zzzprojects/EntityFramework-Plus)  -- Z.EntityFramework.Plus.EFCore（截止2021/7/26 下载数：5,842,130）
[[免费]EFCore.BulkExtensions](https://github.com/borisdj/EFCore.BulkExtensions) -- （截止2021/7/26 下载数：5,459,140）
[EntityFramework Core 5.0 VS SQLBulkCopy](https://mp.weixin.qq.com/s/4cKfvL_amtBTnk7zKaeEuA)
分库分表、读写分离
[[github]EFCore.Sharding](https://github.com/Coldairarrow/EFCore.Sharding)
 [[github]sharding-core](https://github.com/xuejmnet/sharding-core)
[记录.NetCore如何使用MyCat](http://www.zyiz.net/tech/detail-123157.html)
 [常见分库分表方案以及国内银行分库分表技术选型](https://mp.weixin.qq.com/s/VqNOpIe2DNYFihaa2Ma_JQ)

[数据量很大，分页查询很慢，有什么优化方案？](https://mp.weixin.qq.com/s/iHbYNM6bCc-96IU23yq4Pg)   
[.Net Core导入千万级数据至Mysql](https://www.cnblogs.com/chingho/p/14789466.html) (MySqlBulkLoader)
[如何一步步让公司的MySQL支撑亿级流量](https://mp.weixin.qq.com/s/avX1ZTND_xpbXcj4WPhlig)（读写分离、主从复制、从库延迟问题、代理中间件）
EfCore 先关其他
[EF Core 3.1 执行sql语句的几种方法](http://outlela.com/Code/88.html)
[EF Core事务提交,分布式事务](https://mp.weixin.qq.com/s/2CvxYfgCysl3VLjXjN1F1Q)（EF Core 2.1之后移除了分布式事务的支持）
[EF Core 二级缓存（EFCore.SecondLevelCacheInterceptor）](https://github.com/VahidN/EFCoreSecondLevelCacheInterceptor)
数据库相关其他
[最好指定列为NOT NULL，除非真的需要存储NULL值](https://mp.weixin.qq.com/s/7OJaw3l0UsNKvpY_heAQ_Q)
[到底该不该使用存储过程](https://mp.weixin.qq.com/s/pWwQm9vaMd0TS5_DtFMzqA)
[线上执行sql，增删改字段操作经验](https://www.cnblogs.com/12lisu/p/14594751.html)
[(Mysql)书写高质量SQL的30条建议](https://www.cnblogs.com/jay-huaxiao/p/12546973.html)
[一份非常完整的MySQL规范](https://mp.weixin.qq.com/s/ruDL-v6s0tLMntVze44AbQ)
[58到家MySQL军规升级版](https://mp.weixin.qq.com/s/YfCORbcCX1hymXBCrZbAZg)
[52条SQL语句性能优化的方式](https://mp.weixin.qq.com/s/ezDranuy7O581y5Pe-Bs-g)
[切换数据库时，如何主动清空.NET数据库连接池？](https://mp.weixin.qq.com/s/c7He_DzZdij-TEA1Jb1d3Q)
[聊聊索引失效的10种场景](https://www.cnblogs.com/12lisu/p/15786013.html)

### 资料
[https://www.cnblogs.com/heyuquan/p/dotnet-advance-learning-resource.html](https://www.cnblogs.com/heyuquan/p/dotnet-advance-learning-resource.html)
