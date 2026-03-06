---
title: Apollo
lang: zh-CN
date: 2022-04-24
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: apollo
slug: gnp8vo
docsId: '32033940'
---

## 描述
Apollo是携程框架部门研发的配置管理平台，能够集中化管理应用不同的环境，不同集群的配置，配置修改后能够实时推送到应用端，并且具有规范的权限、流程治理等特性。
 
目前有针对Java和.Net的两个客户端供使用：
Java客户端不依赖任何框架，能够运行于所有Java运行时环境，同时对Spring/Spring Boot环境也有额外支持。
.Net客户端不依赖任何框架，能够运行于所有.Net运行时环境。
 
Apollo有一个核心的概念：Namespace。
Namespace是配置项的集合，类似于一个配置文件的概念。
Namespace类型有三种：私有类型、公共类型、关联类型（继承类型）。
Namespace的获取权限分为两种：private （私有的）、public （公共的）
 
配置文件格式：prperties xml yml yaml json
 
Apollo默认暴露了两个端口：8080(spring eureka服务注册中心)和8070(apollo配置中心管理界面)
 
net使用需要使用组件：Com.Ctrip.Framework.Apollo.Configuration
 
 
 
 
 
 
 

## 资料
参考教程：[https://www.cnblogs.com/edisonchou/p/9419379.html](https://www.cnblogs.com/edisonchou/p/9419379.html)
