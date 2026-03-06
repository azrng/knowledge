---
title: 组件
lang: zh-CN
date: 2023-12-14
publish: true
author: azrng
isOriginal: false
category:
  - dotNET
tag:
  - blazor
  - component
---

## 模板组件

模板组件可跨多个应用重复使用，为 UI 元素自定义提供经过尝试和测试的布局和逻辑的基础。 模板组件定义常见元素并将其应用于所有页面，从而跨 Web 应用应用标准化设计。 模板可以简化更新（例如品牌重塑），因为只需在中心模板位置进行修改。

### RenderFragment 类型

模板组件为一个或多个 HTML 标记片段提供布局和逻辑。 HTML 使用模板组件提供的上下文呈现。 模板组件使用 [RenderFragment](https://learn.microsoft.com/zh-cn/dotnet/api/microsoft.aspnetcore.components.renderfragment) 对象作为占位符，在运行时将标记插入其中。

模板只是一个普通的 Razor 组件。 若要使用模板，使用组件会像引用任何其他组件一样引用模板。 名称 `ChildContent` 是 `RenderFragment` 参数的默认名称。 可以为参数指定不同的名称。

### 泛型 `RenderFragment<T>` 参数

默认情况下，`RenderFragment` 类充当 HTML 标记块的占位符。 但是，你可以使用泛型类型 [RenderFragment](https://learn.microsoft.com/zh-cn/dotnet/api/microsoft.aspnetcore.components.renderfragment-1) 通过类型参数呈现其他类型的内容，并提供逻辑来处理模板组件中的指定类型。

例如，假设你要创建一个模板来显示集合中的项。 可以使用 C# `foreach` 循环来循环访问集合并显示找到的项目。 但是该集合可能包含任何类型的数据，因此需要一种呈现每个项的通用方法。

若要编写泛型类型模板组件，需要在模板组件本身和模板的使用组件中指定类型参数。 以下列表表示泛型类型模板组件的常见特征。

- 模板组件中的类型参数是使用 `@typeparam` 指令引入的。 如有必要，一个模板组件可以有多个类型参数。
- 模板可能会定义一个参数，该参数包含由类型参数所指定类型的可枚举对象集合。
- 模板还根据采用相同类型参数的泛型 `RenderFragment` 类型定义 `ChildContent` 参数。

有关详细信息，请参阅 [ASP.NET Core Blazor 模板化组件](https://learn.microsoft.com/zh-cn/aspnet/core/blazor/components/templated-components)。
