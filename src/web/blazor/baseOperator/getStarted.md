---
title: 快速上手
lang: zh-CN
date: 2023-12-14
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
  - web
tag:
  - blazor
  - started
---

## 注入说明

- `AddRazorPages()`：添加 Razor Pages 支持。Razor Pages 是一种以页面为基础的编程模型，用于创建 Web 应用程序。该方法的调用将向服务集合中添加所需的服务和中间件，以支持 Razor Pages 的使用。
- `AddServerSideBlazor()`：添加 Server-Side Blazor 支持。Blazor 是一种使用 .NET 进行 Web 开发的新型框架，Server-Side Blazor 是 Blazor 的一种部署模式，它将应用程序的代码运行在服务器端，然后通过 SignalR 将 UI 更新推送到客户端。该方法的调用将向服务集合中添加所需的服务和组件，以支持 Server-Side Blazor 的使用。
- `AddRazorComponents()`：添加 Razor Components 支持。Razor Components 是一种用于开发 Web 组件的编程模型，它与 Razor Pages 有许多相似之处。该方法的调用将向服务集合中添加所需的服务和组件，以支持 Razor Components 的使用。
- `AddInteractiveServerComponents()`：添加交互式 Server Components 支持。Server Components 是 Blazor 的一种新型组件，它们是在服务器端运行的 Blazor 组件，可实现更高效的性能和更好的用户体验。该方法的调用将向服务集合中添加所需的服务和组件，以支持交互式 Server Components 的使用。

## 短线重连

如何取消Blazor Server烦人的重新连接：https://www.cnblogs.com/hejiale010426/p/17498629.html

## 身份验证

身份验证：https://learn.microsoft.com/zh-cn/aspnet/core/blazor/security/webassembly/standalone-with-authentication-library?view=aspnetcore-8.0&tabs=visual-studio



Blazor Wasm 身份验证和授权之 OpenID 与 OAuth2：https://www.cnblogs.com/densen2014/p/17959842

## 依赖注入

依赖注入：https://learn.microsoft.com/zh-cn/aspnet/core/blazor/fundamentals/dependency-injection?view=aspnetcore-8.0

## Razor类库

Web 应用程序中的组件使开发人员能够在整个应用程序中重用部分应用程序用户界面。 通过 Razor 类库，开发人员可在多个应用程序之间共享和重用这些组件。



Razor 类库是一种 .NET 项目类型，它包含 Razor 组件、页面、HTML、级联样式表 (CSS) 文件、JavaScript、图像和其他可由 Blazor 应用程序引用的静态 Web 内容。 与其他 .NET 类库项目一样，Razor 类库可以捆绑为 NuGet 包并在 NuGet 包存储库（如 NuGet.org）上共享。

