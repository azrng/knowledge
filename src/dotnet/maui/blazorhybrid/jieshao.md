---
title: 介绍
lang: zh-CN
date: 2023-02-03
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: jieshao
slug: lru89d
docsId: '97867324'
---

## 概述
Blazor Hybrid 使开发人员能够将桌面和移动本机客户端框架与 .NET 和 Blazor 结合使用。
在 Blazor Hybrid 应用中，Razor 组件在设备上是本机运行的。 这些组件通过本地互操作通道呈现到嵌入式 Web 视图控件。 组件不在浏览器中运行，并且不涉及 WebAssembly。 Razor 组件可快速加载和执行代码，这些组件可通过 .NET 平台完全访问设备的本机功能。

## ![d2ffcb09b4a60cc3f6824d511630fa90_blazor-hybrid.png](/common/1666671450961-93b3e30b-f0eb-47e5-8899-58937f66e76e.png)文件介绍

### Blazor项目文件

- 页面。 此文件夹包含三个 Razor 组件：Counter.razor、FetchData.razor 和 Index.razor，它们定义了构成 Blazor 用户界面的三个页面。
- 共享。 此文件夹包含共享的 Razor 组件，包括应用的主布局和导航菜单。
- wwwroot。 此文件夹包括 Blazor 使用的静态 Web 资产，包括 HTML、CSS、JavaScript 和图像文件。
- Main.razor. 设置 Blazor 路由器以处理 Web 视图中的页面导航的应用的根 Razor 组件。
- _Imports.razor. 此文件定义导入到每个 Razor 组件的命名空间。

### Maui项目文件

- App.xaml。 此文件定义应用将在 XAML 布局中使用的应用程序资源。 默认资源位于 Resources 文件夹中，并为 .NET MAUI 的每个内置控件定义应用范围内的颜色和默认样式。
- App.xaml.cs。 这是 App.xaml 文件的代码隐藏文件。 此文件定义 App 类。 此类表示运行时的应用程序。 此类中的构造函数创建一个初始窗口并将其分配给 MainPage 属性；此属性确定应用程序开始运行时显示哪个页面。 此外，此类使你能够替代常见的平台中性应用程序生命周期事件处理程序。 事件包括 OnStart、OnResume 和 OnSleep。
- MainPage.xaml。 此文件包含用户界面定义。 .NET MAUI Blazor 应用模板生成的示例应用包括 BlazorWebView，用于在 CSS 选择器 (#app) 指定的位置加载指定主机 HTML 页面 (wwwroot/index.html) 中的 Main 组件。
```csharp
<?xml version="1.0" encoding="utf-8" ?>
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
    xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
    xmlns:local="clr-namespace:BlazorHybridApp"
    x:Class="BlazorHybridApp.MainPage"
    BackgroundColor="{DynamicResource PageBackgroundColor}">

    <BlazorWebView HostPage="wwwroot/index.html">
        <BlazorWebView.RootComponents>
            <RootComponent Selector="#app" ComponentType="{x:Type local:Main}" />
        </BlazorWebView.RootComponents>
    </BlazorWebView>

</ContentPage>
```

- MainPage.xaml.cs。 这是页面的代码隐藏文件。 在此文件中，为页面上的 .NET MAUI 控件触发的各种事件处理程序和其他操作定义逻辑。 模板中的示例代码仅具有默认构造函数，因为所有用户界面和事件都位于 Blazor 组件中。
```csharp
namespace BlazorHybridApp;

public partial class MainPage : ContentPage
{
    public MainPage()
    {
        InitializeComponent();
    }
}
```

- MauiProgram.cs。 每个本机平台都有一个不同的起点，用于创建和初始化应用程序。 可以在项目中的 Platforms 文件夹下找到此代码。 此代码特定于平台，但最后调用静态 MauiProgram 类的 CreateMauiApp 方法。 使用 CreateMauiApp 方法通过创建应用生成器对象来配置应用程序。 至少需要指定描述应用程序的类。 使用应用生成器对象的 UseMauiApp 泛型方法执行此操作；类型参数指定应用程序类。 应用生成器还提供用于注册字体、为依赖项注入配置服务、为控件注册自定义处理程序等任务的方法。 以下代码演示了使用应用生成器注册字体、注册天气服务以及通过 AddMauiBlazorWebView 方法添加对 Blazor Hybrid 的支持的示例：
```csharp
using Microsoft.AspNetCore.Components.WebView.Maui;
using BlazorHybridApp.Data;

namespace BlazorHybridApp;

public static class MauiProgram
{
    public static MauiApp CreateMauiApp()
    {
        var builder = MauiApp.CreateBuilder();
        builder
        .UseMauiApp<App>()
        .ConfigureFonts(fonts =>
        {
            fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
        });

        builder.Services.AddMauiBlazorWebView();

        #if DEBUG
        builder.Services.AddBlazorWebViewDeveloperTools();
        #endif

        builder.Services.AddSingleton<WeatherForecastService>();

        return builder.Build();
    }
}
```
