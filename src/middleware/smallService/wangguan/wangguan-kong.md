---
title: 网关-kong
lang: zh-CN
date: 2022-04-24
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: wangguan-kong
slug: hxlsx3
docsId: '32704714'
---

## 描述
kong是一个clould-native、快速的、可扩展的、分布式的微服务抽象层（也称为API网关、API中间件或在某些情况下称为服务网格）框架。更确切地说，Kong是一个在Nginx中运行的Lua应用程序，并且可以通过[lua-nginx模块实现](https://github.com/openresty/lua-nginx-module)。Kong不是用这个模块编译Nginx，而是与[OpenResty](https://openresty.org/)一起发布，[OpenResty](https://openresty.org/)已经包含了lua-nginx-module。OpenResty 不是 Nginx的分支，而是一组扩展其功能的模块。
> 官方Github地址:https://github.com/Kong/kong

> 官方网站地址:https://konghq.com/

> 开源版官方文档地址:https://docs.konghq.com/gateway-oss/



## 组成

- 首先是Kong服务，一套可以正常工作的Kong会包含两个对外提供服务的端口，一个是网关常规使用的端口，即对外提供访问的入口。另一个则是管理Kong的Admin端口，比如对Kong管理服务的增删改查以及Kong常用的Plugin管理以及一些常规的配置等，Kong的插件非常的丰富，基本上可以到达常规的一些操作比如限流、认证授权、链路跟踪、监控等都有而且形式非常的丰富。

- 其次是Kong存储服务,因为在Kong上配置的转发服务、插件、环境变量、认证等相关的信息都是需要存储的，但是外部存储不是必须的，Kong可以将这些信息存储到进程内的缓存中，但是重启Kong之后这些配置将会丢失，因此在正常的使用过程中我们总会给他提供一个外部数据库来存储这些信息。可供Kong使用的存储数据库也有好几个选择分别是Mysql、MongoDB、Postgresql等。本次演示我们使用的是Postgresql，也是官方推荐的方式。

- 最后是Kong的可视化UI，当然这个不是必须的。Kong提供了Admin管理接口的形式对服务和Plugin查看、新增、修改、删除等操作，但是有一个可视化的管理界面，无疑让有些操作变得更加简单清晰，而且这些可视化系统正式基于Kong的Admin接口开发的。可供选择的可视化UI也比较多，比较出名的有Konga、kong-ui、kong-admin-ui。本次演示我们选择的是Konga，也是推荐使用的最多的一个。

## 参考文档
> 整合一套高性能网关Kong：[https://www.cnblogs.com/wucy/p/14630008.html](https://www.cnblogs.com/wucy/p/14630008.html)

