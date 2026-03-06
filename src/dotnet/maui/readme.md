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
  - 无
filename: readme
slug: gkci06
docsId: '44168271'
---

## 概述
MAUI 是 Xamarin.Forms 的进化（Xamarin.Forms 已经有6年历史了）。支持Model-View-ViewModel（MVVM）和Model-View-Update (MVU)等模式编写。NET MAUI 的目的是简化多平台应用程序开发。使用 .NET MAUI，您可以使用单个项目创建多平台应用程序，但您可以根据需要添加特定于平台的源代码和资源。.NET MAUI 的主要目标是使您能够在单个代码库中实现尽可能多的应用程序逻辑和 UI 布局。

官网：[https://learn.microsoft.com/zh-cn/dotnet/maui/ ](https://learn.microsoft.com/zh-cn/dotnet/maui/) 
[Learn练习教程](https://learn.microsoft.com/zh-cn/training/browse/?expanded=dotnet&products=dotnet-maui)

## 开源项目
Awesome .NET MAUI：https://github.com/jsuarezruiz/awesome-dotnet-maui

## 技术栈
.NET 提供了一系列用于创建应用程序的特定于平台的框架：.NET for Android、.NET for iOS（和 iPadOS）、.NET for Mac 和 WinUI 3（利用 Windows App SDK）。这些框架都可以访问相同的 .NET 6 基类库 (BCL)。这个库提供了创建和管理资源的功能，以及从代码中抽象出底层设备细节的功能。BCL 依赖于 .NET 运行时来为您的代码提供执行环境。对于 Android、iOS（和 iPadOS）和 macOS，环境由 Mono 实现，Mono 是 .NET 运行时的开源实现。在 Windows 上，Win32 执行相同的角色，只是它针对 Windows 平台进行了优化。

虽然 BCL 允许在不同类型的设备上运行的应用程序共享通用的业务逻辑，但各种平台有不同的方式来定义应用程序的用户界面。这些平台提供了不同的模型来指定用户界面元素如何通信和互操作。您可以使用适当的平台特定框架（Android 的 .NET、iOS 的 .NET、Mac 的 .NET 或 WinUI 3）分别为每个平台制作 UI，但是这种方法需要您维护一个代码库每个单独的设备系列。.NET MAUI 提供单一框架来构建移动和桌面应用程序的 UI。您使用此框架创建 UI（如下图中的箭头 1 所示），.NET MAUI 负责将其转换为适当的平台。

## 如何工作
.NET MAUI 始终为目标设备生成本机代码，因此您可以获得最佳性能。.NET MAUI 使用特定于每个平台和 UI 元素的“处理程序”来执行操作。例如，如果您的应用程序以 iOS 为目标，.NET MAUI 处理程序会将此代码映射到 iOS UIButton。如果您在 Android 上运行，您将获得一个 Android AppCompatButton。

## 对比Avalonia

- Maui是微软的一个跨平台框架，旨在为.NET开发人员提供一种简单的方法，以在多个操作系统和设备上构建本机应用程序。Maui使用Xamarin.Forms代码库作为基础，同时添加了一些新的API和特性。Maui的设计理念是使用原生控件，以获得更好的性能和更好的用户体验。Maui支持多种设备类型，包括移动设备、平板电脑、台式机和Web浏览器。
- Avalonia UI是一个跨平台的GUI框架，旨在为开发人员提供一种构建本机应用程序的方法，而无需在不同的操作系统上使用不同的工具和技术。Avalonia UI的设计理念是使用XAML语言描述UI，同时使用Skia图形库绘制控件。Avalonia UI的控件库与WPF非常相似，但是可以在多个平台上运行，包括Windows、Linux和macOS。
- 在绑定控件方面，Avalonia UI使用XAML语言提供的语法，而Maui使用C#代码实现。Avalonia UI的绑定语法与WPF类似，可以绑定到命名控件或祖先控件。Maui的绑定语法类似于Xamarin.Forms，可以使用绑定器或属性来绑定控件。

如果需要在多个平台上运行本机应用程序，并且希望使用XAML语言来描述UI，可以选择Avalonia UI。如果需要在多个设备类型上构建本机应用程序，并且希望使用原生控件来获得更好的性能和用户体验，可以选择Maui。

## UI框架

使用 .NET MAUI 为 iOS、Android、macOS 和 Windows 构建应用程序的动手实验手册：[https://github.com/kinfey/dotnet-maui-workshop](https://github.com/kinfey/dotnet-maui-workshop)

1. Telerik UI for Maui：Telerik UI是一个流行的UI库，提供了丰富的控件和功能，可用于创建具有复杂布局和动画效果的现代化应用程序。收费
2. Syncfusion Essential UI Kit for Maui：Syncfusion Essential UI Kit是一个全面的UI库，包含许多高质量的控件和主题，可用于创建现代化的Maui应用程序。
3. Material Design for MaUI：Material Design是Google的设计语言，该UI库为Maui应用程序提供了现代化的外观和感觉，并包含许多常用的控件和布局。
4. DevExpress UI for Maui：DevExpress UI是一个全面的UI库，提供了丰富的控件和特性，可用于创建高度定制化的Maui应用程序。

### Syncfusion

商业控件

官网：[https://www.syncfusion.com/maui-controls](https://www.syncfusion.com/maui-controls)

### UraniumUI

Uranium 是 .NET MAUI 的免费开源 UI 工具包。它提供了一组控件和实用工具来构建新式应用程序。它基于 .NET MAUI 基础结构构建，并提供一组用于生成新式 UI 的控件和布局。它还提供用于在其上生成自定义控件和主题的基础结构。

仓库地址：[https://github.com/enisn/UraniumUI](https://github.com/enisn/UraniumUI)

文档地址：[https://enisn-projects.io/docs/en/uranium/latest](https://enisn-projects.io/docs/en/uranium/latest)

### MDC-MAUI

:::tip

该仓库已经不维护了

:::

文档地址：[https://mdc-maui.github.io/](https://mdc-maui.github.io/)

仓库地址：[https://github.com/mdc-maui/mdc-maui](https://github.com/mdc-maui/mdc-maui)

## 示例
demo：[https://github.com/MauiDeveloperOrg/MauiDemo](https://github.com/MauiDeveloperOrg/MauiDemo)
官方示例：[https://github.com/dotnet/maui-samples](https://github.com/dotnet/maui-samples)

## 视频教程

[在 .NET MAUI 中使用 MediaElement 进行全屏视频播放！](https://www.bilibili.com/video/BV1r1421D71c?spm_id_from=333.1245.0.0)

系列教程：https://space.bilibili.com/226440/channel/collectiondetail?sid=448819

Maui多媒体流播放  https://www.bilibili.com/video/BV1Pz421Q7uU

## 资料
dotnet界面大白博客园：[https://www.cnblogs.com/jasondun/](https://www.cnblogs.com/jasondun/)
绑定相关的文章：[https://www.cnblogs.com/jasondun/p/9215572.html](https://www.cnblogs.com/jasondun/p/9215572.html)
