---
title: 传参
lang: zh-CN
date: 2022-05-15
publish: true
author: azrng
isOriginal: false
category:
  - dotNET
tag:
  - 无
filename: chuancan
slug: ems54h
docsId: '67628978'
---

## 特性传参
需要在A页面传值给B页，可以在B页面创建属性
```csharp
[Parameter]//设置参数特性,不设置无法传参
public int IncrementAmount { get; set; } = 3;//设置默认值
```
然后再A页面进行传参
```csharp
<Counter IncrementAmount="10"></Counter>
```

### 级联参数共享信息
Blazor 包含了级联参数。 在组件中设置级联参数的值时，其值将自动提供给所有子组件。
在父组件中，使用 `<CascadingValue>` 标记指定将级联到所有子组件的信息。 此标记作为内置的 Blazor 组件实现。 在该标记内呈现的任何组件都将能够访问该值。
```csharp
@page "/specialoffers"

<h1>Special Offers</h1>

<CascadingValue Name="DealName" Value="Throwback Thursday">
    <!-- Any descendant component rendered here will be able to access the cascading value. -->
</CascadingValue>
```
在子组件中，可以通过使用组件成员并使用 [CascadingParameter] 特性对其进行修饰来访问级联值。
```csharp
<h2>Deal: @DealName</h2>

@code {
    [CascadingParameter(Name="DealName")]
    private string DealName { get; set; }
}
```

### 使用AppState共享信息
创建一个定义要存储的属性的类，并将其注册为作用域服务。 在要设置或使用 AppState 值的任何组件中，注入该服务，然后可以访问其属性。 不同于组件参数和级联参数，AppState 中的值可用于应用程序中的所有组件，即使这些组件不是存储该值的组件的子组件也是如此。
比如创建一个存储销售值的类：
```csharp
public class PizzaSalesState
{
    public int PizzasSoldToday { get; set; }
}
```
现在，将该类作为作用域服务添加到 Program.cs 文件中：
```csharp
...
// Add services to the container
builder.Services.AddRazorPages();
builder.Services.AddServerSideBlazor();

// Add the AppState class
builder.Services.AddScoped<PizzaSalesState>();
...
```
现在，在要设置或检索 AppState 值的任何组件中，注入该类，然后访问属性：
```csharp
@page "/"
@inject PizzaSalesState SalesState

<h1>Welcome to Blazing Pizzas</h1>

<p>Today, we've sold this many pizzas: @SalesState.PizzasSoldToday</p>

<button @onclick="IncrementSales">Buy a Pizza</button>

@code {
    private void IncrementSales()
    {
        SalesState.PizzasSoldToday++;
    }
}
```
