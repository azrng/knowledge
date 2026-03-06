---
title: 端点路由
lang: zh-CN
date: 2023-02-05
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: duandianluyou
slug: wie36d
docsId: '65366896'
---

## MapControllerRoute

##### 约定路由(conventional routing), 通常用在MVC项目中；
需要传参name  pattern defaults  constraints dataTokens；
你可以在项目中这样写：
```csharp
endpoints.MapControllerRoute(
  name:"default",
  pattern:"{controller=Home}/{action=index}/{id?}"
);
```
如果请求url满足 {host}{controller_name}{action_name}{option_id} ， 将命中Controller=controller_name Action=action_name的方法体；如果url不提供controller、action名称，默认命中home/index 方法体。
> 是MVC web项目的早期写法，让用户请求的url去匹配开发者的Controller-Action名称。如今约定路由并不是主流，因为所谓的约定路由对于用户浏览并不友好，而且暴露了后端开发者定义的琐碎的Controller、Action名称。

实际上，不应该让用户的url去匹配开发者定义的Controller-Action名称（太丑陋的行为），而应该让开发者去匹配用户想要使用的url， 这样特性路由出现了。

## MapDefaultControllerRoute
endpoints.MapDefaultControllerRoute(); 正是上面约定路由的默认样例.

## MapControllers
不对约定路由做任何假设，也就是不使用约定路由，依赖用户的特性路由， 一般用在WebAPI项目中。

## 资料
[https://mp.weixin.qq.com/s/rolFlSE6K3n5iMn_peD1uQ](https://mp.weixin.qq.com/s/rolFlSE6K3n5iMn_peD1uQ) | ASP.NET Core端点路由中三种让人困惑的路由函数
