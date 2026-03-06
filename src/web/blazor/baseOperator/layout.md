---
title: 布局
lang: zh-CN
date: 2023-12-11
publish: true
author: azrng
isOriginal: false
category:
  - dotNET
  - web
tag:
  - blazor
  - layout
---

## 概述

在大多数网站中，UI排列的方式在多个页面共享，这个时候我们需要将相同的代码复制粘贴到所有其他页面中，并且如果后期更改了，还需要所有页面都进行重复的更改，所以这个时候就该使用布局组件来简化和重用通用UI元素。

## Blazor中的布局

布局文件扩展名为`.razor`，文件通常存放在`Shared`文件夹中，但是也可以放在其他使用它的文件可以访问的任何位置。

布局组件有两个要求：

* 必须继承 `LayoutComponentBase` 类。
* 必须在要呈现发起引用的组件内容的位置包含 `@Body` 指令

在Shared下新建`BlazingPizzasMainLayout`布局文件，内容如下

```html
@inherits LayoutComponentBase

<header>
    <h1>披萨网站</h1>
</header>

<nav>
    <a href="Pizzas">Browse Pizzas</a>
    <a href="Toppings">Browse Extra Toppings</a>
    <a href="FavoritePizzas">Tell us your favorite</a>
    <a href="Orders">Track Your Order</a>
</nav>

@Body

<footer>
    @TrademarkMessage
</footer>

@code
{
    public string TrademarkMessage { get; set; } = "All content is &copy; Blazing Pizzas 2021";
}
```

> 布局组件不包括 `@page` 指令，因为它们不直接处理请求，不应为它们创建路由。 引用组件使用 `@page` 指令。



使用布局文件，那么就需要再应用布局文件中使用`@layout`指令。组件的Html将在`@Body`指令的位置呈现

```html
@page "/FavoritePizzas/{favorite}"
@layout BlazingPizzasMainLayout

<h1>选择披萨</h1>

<p>Your favorite pizza is: @Favorite</p>

@code {
	[Parameter]
	public string Favorite { get; set; }
}
```

如果要将模板应用于文件夹中的所有 Blazor 组件，可以使用 _Imports.razor 文件作为快捷方式。 Blazor 编译器找到此文件时，会自动在文件夹中的所有组件中包含其指令。 使用此方法，无需再将 `@layout` 指令添加到每个组件，适用于 _Imports.razor 文件所在文件夹及其所有子文件夹中的组件。

::: warning

请勿向项目的根文件夹中的 _Imports.razor 文件添加 `@layout` 指令，因为这会导致布局的无限循环。

:::

如果要将默认布局应用于 Web 应用的所有文件夹中的所有组件，可以在 App.razor 组件中执行此操作，在该组件中配置 Router 组件。 在 `<RouteView>` 标记中，使用 `DefaultLayout` 属性。

```html
<Router AppAssembly="@typeof(Program).Assembly" PreferExactMatches="@true">
    <Found Context="routeData">
        <RouteView RouteData="@routeData" DefaultLayout="@typeof(BlazingPizzasMainLayout)" />
    </Found>
    <NotFound>
        <LayoutView >
            <p>对不起，页面走丢了</p>
        </LayoutView>
    </NotFound>
</Router>
```

