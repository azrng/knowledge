---
title: 说明
lang: zh-CN
icon: home
date: 2023-10-15
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - .net
filename: readme
slug: mlco3d
docsId: '31459358'
---

## 概述
.NET是一个可用于构建各种应用的跨平台的开源的开发平台。

术语表：[此处](https://docs.microsoft.com/zh-cn/dotnet/standard/glossary)

官网文档：[此处](https://learn.microsoft.com/zh-cn/aspnet/core/getting-started)

[开源生态研究报告](http://www.caict.ac.cn/kxyj/qwfb/bps/202209/P020220916644891972234.pdf)  [在线拼接.NET logo素材](https://mod-dotnet-bot.net/)  [操作系统对.Net的支持](https://newlifex.com/tech/os_net)

## 优点
`ASP.NET Core` 具有如下优点：跨平台、自托管、开源、高性能

- 生成 Web UI 和 Web API 的统一场景。
- 集成**新式客户端框架**和开发工作流。
- 基于环境的云就绪**配置系统**。
- 内置**依赖项注入**。
- 轻型的**高性能**模块化 HTTP 请求管道。
- 能够在**IIS**、**Nginx**、**Apache**、**Docker**上进行托管或在自己的进程中进行自托管。
- 定目标到 `.NET Core`时，可以使用并行应用版本控制。
- 简化新式 Web 开发的工具。
- 能够在 Windows、macOS 和 Linux 进行生成和运行。
- 开放源代码和**以社区为中心**。

 `.NET Core`完全作为nuget包提供，借助nuget包可以将应用优化减少到只包含到必须的依赖项，提升了安全性，减少了维护和提高性能
跨平台的本质是因为已经内置了主机，只要是程序启动就是启动了主机，就可以监听端口

## 规范
[命名准则](https://learn.microsoft.com/zh-cn/dotnet/standard/design-guidelines/naming-guidelines) 
[编码风格](https://github.com/dotnet/runtime/blob/main/docs/coding-guidelines/coding-style.md)
[xml标记说明](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/xmldoc/recommended-tags)
[框架设计准则](https://learn.microsoft.com/zh-cn/dotnet/standard/design-guidelines/)

## 学习路线
.Net基金会项目趋势：[https://dnfprojects.org/](https://dnfprojects.org/)  
ASP.NET开发人员路线图：[此处](https://github.com/MoienTajik/AspNetCore-Developer-Roadmap)  
.Net发布路线图工具介绍：[https://ardalis.com/latest-dotnet-roadmap/](https://ardalis.com/latest-dotnet-roadmap/)  
开发路线指南：[https://www.cnblogs.com/zhao123/p/12073375.html](https://www.cnblogs.com/zhao123/p/12073375.html)  
【荐】汇总学习知识库：[https://github.com/YSGStudyHards/DotNetGuide](https://github.com/YSGStudyHards/DotNetGuide)  
汇总优质开源项目：[https://github.com/dotNetTreasury](https://github.com/dotNetTreasury)  
c#项目趋势榜：[https://github.com/trending/c%23?since=daily](https://github.com/trending/c%23?since=daily)  
.Net库收集网站：[https://github.com/quozd/awesome-dotnet](https://github.com/quozd/awesome-dotnet)  
.NetCore项目汇总：[https://github.com/thangchung/awesome-dotnet-core](https://github.com/thangchung/awesome-dotnet-core)  
Awesome Nuget Packages：[此处](https://github.com/mjebrahimi/Awesome-Nuget-Packages)  
Awesome Microservices .NET：[此处](https://github.com/mjebrahimi/Awesome-Microservices-DotNet)  

## 热点资讯

[Awsone .NET](https://dotnet.libhunt.com/)  [Ketchup](https://dotnetketchup.com/)

.Net中文官方博客：[https://devblogs.microsoft.com/dotnet-ch/](https://devblogs.microsoft.com/dotnet-ch/)

## 认证证书

2023 年 8 月 29 日，微软宣布推出基础 C# 认证项目。该项目由微软和非营利机构 freeCodeCamp 合作推出，学员在 Microsoft Learn 上完成 35 小时的 C# 培训之后，通过考试可以免费获得基础 C# 认证。

学习地址：[此处](https://www.freecodecamp.org/learn/foundational-c-sharp-with-microsoft/#create-and-run-simple-c-sharp-console-applications)

## 对比

### netcore与net的区别

全家桶还是想自选
Net：默认包含了所有东西，满足所有人使用需求
Netcore：需要啥自己加啥，看个人使用需求。
Asp.NetCore与Asp.Net不一样的地方，前者是根据需求添加对应的中间件，而后者是提前就全部准备好了，不管用不用，反正都要经过，这也是Asp.NetCore性能比较好的原因之一。

### SDK和RunTime的区别

1、SDK 是用来开发 NetCore 的，内部捆绑了 Runtime 运行时；
2、但是如何只想运行 NetCore 项目的话，只需要在服务器中安装 Runtime 运行时即可；

微软官网sdk下载地址：https://dotnet.microsoft.com/zh-cn/download/dotnet

龙芯官网sdk下载地址：http://www.loongnix.cn/zh/api/dotnet/

### NetStandard

这只是一个规范，而不是一个框架；netstandard.dll以及同文件夹下的其他DLL(dynamic linked library，动态链接库)文件中的代码都只有类和成员的定义，没有具体的实现，是在代码运行的时候对应不同的实现(.NetFramework、.NetCore)。
关于它的未来：[此处](https://devblogs.microsoft.com/dotnet/the-future-of-net-standard/)

## 开发工具

### 主力工具

[Visual Studio](https://visualstudio.microsoft.com/zh-hans/downloads/)、[Rider](https://www.jetbrains.com/zh-cn/rider/download/#section=windows)

### 临时测试

[Linqpad](https://www.linqpad.net/)(收费)、[RoslynPad](https://roslynpad.net/)(免费)

### 在线工具
[https://try.dot.net/](https://try.dot.net/)  
[https://rextester.com/l/csharp_online_compiler](https://rextester.com/l/csharp_online_compiler)  
[https://dotnetfiddle.net/](https://dotnetfiddle.net/)  
[https://sharplab.io/](https://sharplab.io/)

### 在线API查阅网站

API在线目录查询：[https://apisof.net/](https://apisof.net/)
在线源码查询：[https://source.dot.net/](https://source.dot.net/)


## 资料

.NET技术与企业级信息化解决方案咨询：[https://www.cnblogs.com/SavionZhang/p/14764534.html](https://www.cnblogs.com/SavionZhang/p/14764534.html)
老张的哲学：[https://www.cnblogs.com/laozhang-is-phi/p/9495618.html](https://www.cnblogs.com/laozhang-is-phi/p/9495618.html)
