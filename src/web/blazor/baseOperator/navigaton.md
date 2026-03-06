---
title: 导航
lang: zh-CN
date: 2023-02-02
publish: true
author: azrng
isOriginal: false
category:
  - dotNET
tag:
  - 无
filename: daohang
slug: ubkapln7qyg2lp22
docsId: '113173299'
---

## 说明

文档地址：https://learn.microsoft.com/zh-cn/aspnet/core/blazor/fundamentals/routing?view=aspnetcore-8.0

### 路由模板

Blazor 使用名为 Router 组件的专用组件路由请求。 它在 App.razor 中配置如下：
```csharp
<Router AppAssembly="@typeof(Program).Assembly">
	<Found Context="routeData">
		<RouteView RouteData="@routeData" DefaultLayout="@typeof(MainLayout)" />
	</Found>
	<NotFound>
		<p>Sorry, we haven't found any pizzas here.</p>
	</NotFound>
</Router>
```
应用启动时，Blazor 会检查 AppAssembly 属性，以了解它应扫描哪个程序集。 它会扫描该程序集，以寻找具有 RouteAttribute 的组件。 Blazor 使用这些值编译 RouteData 对象，该对象指定如何将请求路由到组件。 编写应用代码时，可以在每个组件中使用 @page 指令来修复 RouteAttribute。
在以上代码中，`<Found>` 标记指定在运行时处理路由的组件：RouteView 组件。 此组件接收 RouteData 对象以及来自 URI 或查询字符串的任何参数。 然后，它呈现指定的组件及其布局。 可以使用 `<Found>` 标记来指定默认布局，当所选组件未通过 @layout 指令指定布局时，将使用该布局。

在 `<Router>` 组件中，还可使用 `<NotFound>` 标记指定在不存在匹配路由时返回给用户的内容。 上面的示例返回单个 `<p>` 段落，但你可以呈现更复杂的 HTML。

### page路由
在 Blazor 组件中，@page 指令指定该组件应直接处理请求。 可以在 @page 指令中指定 RouteAttribute，方法是以字符串的形式传递它。 例如，使用此属性指定页面处理对 /Pizzas 路由的请求：
```shell
@page "/Pizzas"

## 或者指定多个路由
@page "/Pizzas"
@page "/CustomPizzas" 
    
# 传递参数
@page "/route-parameter-2/{text}"
# 传递可选参数
@page "/route-parameter-2/{text?}"

# 路由约束
@page "/FavoritePizza/{preferredsize:int}"

# 捕捉全部参数 如：favoritepizza/margherita/hawaiian
@page "/FavoritePizza/{*favorites}" # favorites收到是 margherita/hawaiian
```

### 获取uri位置信息
用来接收指定url的页面(/pizzas/margherita?extratopping=pineapple)
```csharp
@page "/pizzas/margherita"
@using Microsoft.Extensions.Primitives
@using Microsoft.AspNetCore.WebUtilities
@inject NavigationManager navManger

// 请求地址 http://localhost:5043/pizzas/margherita?extratopping=pineapple

<h3>Buy a Pizza</h3>

<p>I want to order a: @PizzaName</p>

<p>I want to add this topping: @ToppingName</p>


@code {

    [Parameter]
    public string PizzaName { get; set; }

    private string ToppingName { get; set; }

    protected override void OnInitialized()
    {
        StringValues extraTopping;
        // 获取绝对url
        var uri = navManger.ToAbsoluteUri(navManger.Uri);
        // 获取query并且从中取值
        if (QueryHelpers.ParseQuery(uri.Query).TryGetValue("extratopping", out extraTopping))
        {
            ToppingName = extraTopping.ToString();
        }
    }
}
```

点击按钮跳转到首页
```csharp
@page "/pizzas"
@inject NavigationManager NavManager

<h1>Buy a Pizza</h1>

<p>I want to order a: @PizzaName</p>

<a href=@HomePageURI>Home Page</a>

@code {
	[Parameter]
	public string PizzaName { get; set; }
	
	public string HomePageURI { get; set; }
	
	protected override void OnInitialized()
	{
		HomePageURI = NavManager.BaseUri
	}
}
```
跳转到其他页面
```csharp
@page "/pizzas/{pizzaname}"
@inject NavigationManager NavManager

<h1>Buy a Pizza</h1>

<p>I want to order a: @PizzaName</p>

<button class="btn" @onclick="NavigateToPaymentPage">
	Buy this pizza!
</button>

@code {
	[Parameter]
	public string PizzaName { get; set; }
	
	private void NavigateToPaymentPage()
	{
		NavManager.NavigateTo("buypizza");
	}
}
```

### NavLink
Blazor 中，使用 NavLink 组件来呈现 `<a>` 标记，因为它在链接的 href 属性与当前 URL 匹配时将切换 active CSS 类。 通过设置 active 类的样式，可以让用户清楚地了解当前页面对应哪个导航链接。

NavLink 组件中的 Match 属性用于管理突出显示连接的时间。 有两个选项：

- NavLinkMatch.All：使用此值时，只有在链接的 href 与当前 URL 完全匹配时，该链接才突出显示为活动链接。
- NavLinkMatch.Prefix：使用此值时，当链接的 href 与当前 URL 的第一部分匹配时，该链接就突出显示为活动链接。 例如，假设你拥有链接 `<NavLink href="pizzas" Match="NavLinkMatch.Prefix">`。 当前 URL 为 http://www.contoso.com/pizzas 及该 URL 中的任意位置（例如 http://www.contoso.com/pizzas/formaggio）时，此链接将突出显示为活动链接。 此行为可帮助用户了解自己当前正在查看网站的哪一部分。
