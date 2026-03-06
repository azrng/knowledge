---
title: Butterfly
lang: zh-CN
date: 2022-04-24
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: butterfly
slug: ey7qqq
docsId: '32034064'
---
Butterfly是一个使用Open Tracing规范来设计追踪数据的开源追踪组件，作者是Lemon，我们只需要做很少的配置即可对经过网关的所有API服务进行追踪，现在作者已经不维护Butterfly而是推荐使用skywalking来做生产环境的分布式追踪。
安装
下载最新的release：目前最新是0.0.8 [https://github.com/liuhaoyang/butterfly/releases/tag/preview-0.0.8](https://github.com/liuhaoyang/butterfly/releases/tag/preview-0.0.8)
解压通过命令启动：**dotnet Butterfly.Web.dll --EnableHttpCollector=true**
 
 
使用教程：[https://www.cnblogs.com/edisonchou/p/ocelot_and_butterfly_tracing_foundation.html](https://www.cnblogs.com/edisonchou/p/ocelot_and_butterfly_tracing_foundation.html)
