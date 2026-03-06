---
title: 说明
lang: zh-CN
date: 2023-09-05
publish: true
author: azrng
isOriginal: true
category:
  - 软件设计
tag:
  - 无
filename: shuiming
slug: rbuyck
docsId: '63827810'
---

## 概述
是一个用最佳实践和流程技术开发的现代Web应用程序的新起点，专注于基于Asp.Net Core的Web应用程序开发，但是也支持开发其他类型的应用程序。
ABP(ASP.NET Boilerplate Project)ASP.NET模板项目
ABP.Vnext=netcore+DDD+第三方技术

官网：[https://docs.abp.io/zh-Hans/abp/latest/](https://docs.abp.io/zh-Hans/abp/latest/)

## 特性

- 多语言/本地化支持
- 多租户支持（每个租户的数据自动隔离，业务模块开发者不需要在保存和查询时写相应代码）
- 软删除支持（继承相应的基类或实现相应接口，会自动实现软删除）
- 统一的异常处理（应用层几乎不需要处理自己写异常处理代码）
- 数据有效性验证（[ASP.NET](http://asp.net/) MVC 只能做到Action方法的参数验证，ABP实现了Application层方法的参数有效性验证）
- 日志记录（自动记录程序异常）
- 模块化开发（每个模块有独立的EF DbContext，可单独指定数据库）
- Repository仓储模式（已实现了Entity Framewok、NHibernate、MangoDB、内存数据库）
- Unit Of Work 工作单元模式（为应用层和仓储层的方法自动实现数据库事务）
- EventBus 实现领域事件（Domain Events）
- DLL嵌入资源管理
- 通过Application Services 自动创建Web Api 层（不需要写ApiController层）
- 自动创建javascript的代理层来更方便使用Web Api
- 封装一些javascript函数，更方便的使用ajax、消息框、通知组件、忙状态的遮罩层
“Zero”的模块，实现了以下功能：
- 身份验证与授权管理（[通过ASP.NET](http://xn--asp-503jln.net/) Identity实现）
- 用户&角色管理
- 系统设置存取管理（系统级、租户级、用户级、作用范围自动管理）
- 审计日志（自动记录每一次接口的调用者和参数）

## 开源项目

https://github.com/WilliamXu96/ABP-MicroService  abp微服务

要学习, 得去看abp zero的代码, 那是土牛的杰作

## 资料

实战系列文章 [地址](https://mp.weixin.qq.com/mp/appmsgalbum?__biz=MzUzNzk0MDQ5MA==&action=getalbum&album_id=1345555337696477185&scene=173&from_msgid=2247484026&from_itemidx=2&count=3&nolastread=1#wechat_redirect)
[https://mp.weixin.qq.com/s/gb7ZZQJP71CqjV-footcuQ](https://mp.weixin.qq.com/s/gb7ZZQJP71CqjV-footcuQ) | ABP vNext 缓存使用
