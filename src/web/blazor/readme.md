---
title: 说明
lang: zh-CN
date: 2023-10-15
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - blazor
filename: readme
slug: ebz0h3
docsId: '67625478'
---

## Blazor是什么？

Blazor 是在.Net和Razor上构建的用户UI框架，用于使用 HTML、CSS 和 C# 构建网页。 可以使用标准 HTML 和 CSS 定义网站的布局和设计。 

### 两个模式

Blazor WebAssembly：部署在用户计算机的浏览器上运行(类似于单页面应用程序)(需要浏览器支持HTML5标准的WebAssembly运行时)(通过 WebAssembly 直接在浏览器中运行的客户端 Web 应用)。
Blazor Server：在服务器上作为Asp.Net应用程序的一部分运行，系统将使用 ASP.NET Core SignalR 和首选 Web 套接字连接来维护双向通信管道(通过 WebSocket 连接处理 UI 交互的服务器端代码)。

官网：[https://learn.microsoft.com/zh-cn/aspnet/core/blazor/?view=aspnetcore-7.0](https://learn.microsoft.com/zh-cn/aspnet/core/blazor/?view=aspnetcore-7.0)
学习教程：[https://learn.microsoft.com/zh-cn/training/browse/?expanded=dotnet&products=blazor](https://learn.microsoft.com/zh-cn/training/browse/?expanded=dotnet&products=blazor)
![image.png](/common/1645843560955-1db6a34e-2b9b-4953-8164-8ec0b955121b.png)
两种模式如何选择

| 条件 | 你可以选择 Blazor Server，因为... | 你可以选择 Blazor WebAssembly，因为... |
| --- | --- | --- |
| 开发人员熟悉 .NET | 构建后的应用程序就像是熟悉的 ASP.NET Core 应用程序一样 | 构建后的应用程序将使用你现有的技能在浏览器中以本机方式运行 |
| 需要与现有 .NET 投资资产集成 | 存在用于与 ASP.NET Core 应用程序集成的现有模型 | 与连接到 Web 服务器相比，允许在浏览器中以本机方式运行这些资源可以提供更好的交互和感知性能 |
| 现有 Web 服务器 | 现有 Web 服务器正在运行 ASP.NET Core | 需要将应用程序部署到任何服务器，而无需服务器端呈现 |
| 应用程序的复杂性 | 应用程序具有大量处理要求，这些要求可从数据中心内运行的分布式应用程序中获益 | 应用程序可以通过在客户端上以本机处理器速度运行而获益 |
| 网络要求 | 应用程序将始终连接到服务器 | 应用程序可以在“偶尔连接”模式下运行，而无需与服务器进行持续交互 |
| 代码安全要求 | 应用程序需要进行验证或要求在特定的地理位置运行，指定位置可以通过服务器来强制执行 | 你的应用程序代码可以在没有此要求的任何设备上的任何位置运行 |

## 什么是 WebAssembly？

WebAssembly 是一项在所有新式浏览器中可用的标准技术，允许代码在浏览器中运行（类似于 JavaScript）。 我们可以使用工具准备 C# 代码，以便在浏览器中用作 Web 程序集应用程序，且这些工具已捆绑到 .NET 命令行应用程序中。

## 开源项目

Awesome Blazor：https://github.com/AdrienTorris/awesome-blazor

## 常用命令
一般可以通过热更新来实现不重启程序实现页面，更新，但是有些操作必须重启，这个时候可以使用，命令行来实现自动重启服务。
```bash
dotnet watch run -y   // -y代表有更新自动重启
```

## 常用操作

- 数据绑定
- 组件
- 依赖注入
```csharp
builder.Services.AddSingleton<PizzaService>();

@inject PizzaService PizzaSvc
```

### 认证授权

Blazor Server 基本身份验证和授权:https://mp.weixin.qq.com/s/8oqcQ8ef4n0jaWm2yHM5Ag

Blazor 一文理清 Blazor Identity 鉴权验证https://www.cnblogs.com/madtom/p/18619853

## 资料

Blazor University中文文档：[https://feiyun0112.github.io/blazor-university.zh-cn/](https://feiyun0112.github.io/blazor-university.zh-cn/)
Blazor Wasm开发谷歌插件：[https://blog.csdn.net/sD7O95O/article/details/121368472](https://blog.csdn.net/sD7O95O/article/details/121368472)
[https://mp.weixin.qq.com/s/yowTbFV35Unbgrdn8UJTPg](https://mp.weixin.qq.com/s/yowTbFV35Unbgrdn8UJTPg) | 全面的ASP.NET Core Blazor简介和快速入门

在 SPA 的 ASP.NET Core 中实现 BFF 模式：https://nestenius.se/net/implementing-bff-pattern-in-asp-net-core-for-spas/
