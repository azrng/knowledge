---
title: Js互操作
lang: zh-CN
date: 2023-12-13
publish: true
author: azrng
isOriginal: false
category:
  - dotNET
  - web
tag:
  - blazor
  - js
---

## 概述

Blazor 使用 C# 组件而不是 JavaScript 来创建包含动态内容的网页或 HTML 内容。 但是，可以使用 Blazor JavaScript 互操作性（JS 互操作）调用 Blazor 应用中的 JavaScript 库，并从 实现.NET C# 代码调用 JavaScript 函数。

## 加载Js代码

将 JavaScript 添加到 Blazor 应用的方式与添加到标准 HTML Web 应用的方式相同，方法是使用 HTML `<script>` 元素。 可以在 Pages/_Host.cshtml 文件或 wwwroot/index.html 文件中的现有 `<script src="_framework/blazor.*.js"></script>` 标记后添加 `<script>` 标记，具体使用哪种取决于 Blazor 托管模型。请参阅 [ASP.NET Core Blazor 托管模型](https://learn.microsoft.com/zh-cn/aspnet/core/blazor/hosting-models)。

最好不要将脚本放在页面的 `<head>` 元素中。 Blazor 仅控制 HTML 页面的 `<body>` 元素中的内容，因此如果脚本依赖于 Blazor，则 JS 互操作可能会失败。 此外，页面显示可能更慢，因为分析 JavaScript 代码所花的时间。

`<script>` 标记的运行方式与在 HTML Web 应用中的运行方式相同。 可以直接在标记正文中编写代码，也可以引用现有的 JavaScript 文件。请参阅 [ASP.NET Core Blazor JavaScript 互操作性（JS 互操作）：JavaScript 的位置](https://learn.microsoft.com/zh-cn/aspnet/core/blazor/javascript-interoperability#location-of-javascript)。

::: info

将 JavaScript 文件放置在 Blazor 项目的 wwwroot 文件夹下。

:::

另一种选择是将引用 JavaScript 文件的 `<script>` 元素动态注入 Pages/_Host.cshtml 页面。 如果需要根据只能在运行时确定的条件加载不同的脚本，则此方法很有用。 如果使用呈现页面后激发的事件触发逻辑，此方法还可以加快应用的初始加载。 有关详细信息，请参阅 [ASP.NET Core Blazor 启动](https://learn.microsoft.com/zh-cn/aspnet/core/blazor/fundamentals/startup)。

## 调用JS

使用 [IJSRuntime](https://learn.microsoft.com/zh-cn/dotnet/api/microsoft.jsinterop.ijsruntime) 从 .NET 代码调用 JavaScript 函数。 若要使 JS 互操作运行时可用，请将 `IJSRuntime` 抽象实例注入 Blazor 页面，在文件开始附近的 `@page` 指令之后。

`IJSRuntime` 接口公开用于调用 JavaScript 代码的 [InvokeAsync](https://learn.microsoft.com/zh-cn/dotnet/api/microsoft.jsinterop.ijsruntime.invokeasync) 和 [InvokeVoidAsync](https://learn.microsoft.com/zh-cn/dotnet/api/microsoft.jsinterop.jsruntimeextensions.invokevoidasync) 方法。 使用 `InvokeAsync<TValue>` 调用返回值的 JavaScript 函数。 否则，调用 `InvokeVoidAsync`。 顾名思义，这两种方法都是异步的，因此需要使用 C# `await` 运算符来捕获结果。

`InvokeAsync` 或 `InvokeVoidAsync` 方法的参数是要调用的 JavaScript 函数的名称，后跟函数所需的任何参数。 JavaScript 函数必须属于 `window` 作用域或 `window` 子作用域。 参数必须可序列化为 JSON。



## 更新DOM

Blazor 将文档对象模型 (DOM) 表示形式维护为虚拟呈现树。 当页面结构发生更改时，Blazor 将生成一个包含差异的新呈现树。 更改完成后，Blazor 会循环访问差异，以更新用户界面的浏览器显示和 JavaScript 使用的 DOM 的浏览器版本。

许多第三方 JavaScript 库可用于在页面上呈现元素，这些库可以更新 DOM。 如果 JavaScript 代码修改了 DOM 的元素，则 DOM 的 Blazor 副本可能不再匹配当前状态。 此情况可能导致意外的行为，并可能会带来安全风险。 请勿作出可能导致 DOM 的 Blazor 视图损坏的更改。

处理这种情况的最简单方法是在 Blazor 组件中创建一个占位符元素，通常是空的 `<div @ref="placeHolder"></div>` 元素。 Blazor 代码会将此代码解释为空白，而 Blazor 呈现树不会尝试跟踪其内容。 可以随意向此 `<div>` 添加 JavaScript 代码元素，Blazor 不会尝试更改它。

Blazor 应用代码定义 [ElementReference](https://learn.microsoft.com/zh-cn/dotnet/api/microsoft.aspnetcore.components.elementreference) 类型的字段，用于保存对 `<div>` 元素的引用。 `<div>` 元素上的 `@ref` 属性设置字段的值。 然后，`ElementReference` 对象将传递到 JavaScript 函数，该函数可以使用引用将内容添加到 `<div>` 元素。

## JS调用.Net代码

JavaScript 代码可以使用 `DotNet` 实用工具类（JS 互操作库的一部分）运行 Blazor 代码定义的 .NET 方法。 `DotNet` 类公开了 `invokeMethod` 和 `invokeMethodAsync` 帮助程序函数。 使用 `invokeMethod` 运行方法并等待结果，或使用 `invokeMethodAsync` 异步调用方法。 `invokeMethodAsync` 方法返回 JavaScript `Promise`。

必须使用 [JSInvokableAttribute](https://learn.microsoft.com/zh-cn/dotnet/api/microsoft.jsinterop.jsinvokableattribute) 标记要调用的 .NET 方法。 该方法必须是 `public`，并且任何参数都必须可序列化为 JSON。 此外，对于异步方法，返回类型必须是 `void`、`Task` 或泛型 `Task<T>` 对象，其中 `T` 是 JSON 可序列化类型。

若要调用 `static` 方法，请提供包含该类的 .NET 程序集的名称、该方法的标识符以及该方法接受作为 `invokeMethod` 或 `invokeMethodAsync` 函数的参数的任何参数。 默认情况下，方法标识符与方法名称相同，但可以使用 `JSInvokable` 属性指定不同的值。
