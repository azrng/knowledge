---
title: Startup
lang: zh-CN
date: 2022-07-24
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: startup
slug: cqpfao
docsId: '29807945'
---

## Startup程序启动
- 第一步：执行services.AddControllers() 将Controller的核心服务注册到容器中去
- 第二步：执行app.UseRouting() 将EndpointRoutingMiddleware中间件注册到http管道中
- 第三步：执行app.UseAuthorization() 将AuthorizationMiddleware中间件注册到http管道中
- 第四步：执行app.UseEndpoints(encpoints=>endpoints.MapControllers())有两个主要的作用：调用endpoints.MapControllers()将本程序集定义的所有Controller和Action转

为一个个的EndPoint放到路由中间件的配置对象RouteOptions中 将EndpointMiddleware中间件注册到http管道中

## 方法用处
configservice方法的作用
注册服务到依赖注入容器。
configure方法的作用
用来配置请求管道的，通过这里会注册一些中间件，**IApplicationBuilder** 是用来构建请求管道的。
