---
title: 开源组件
lang: zh-CN
date: 2023-09-24
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: kaiyuanzujian
slug: qgqnfyfwqednlulc
docsId: '125997879'
---

## 模块化框架

1. Prism：Prism 是一个用于构建模块化、可扩展和可测试的WPF应用程序的开源框架。它提供了一组用于实现MVVM（Model-View-ViewModel）模式的工具和模块化开发的支持。你可以在 Prism 的官方网站上找到更多信息和示例。

2. Caliburn.Micro：Caliburn.Micro 是一个轻量级的WPF开源框架，用于实现MVVM模式。它提供了通过约定自动绑定视图和视图模型的功能，并且容易上手和使用。你可以在 Caliburn.Micro 的 GitHub 仓库上找到更多信息和示例。

3. PropertyChanged.Fody：PropertyChanged.Fody 是一个用于自动实现INotifyPropertyChanged接口的开源库。通过简单的配置，它可以自动为你的属性生成属性更改通知代码，减少了样板代码的编写。你可以在 PropertyChanged.Fody 的 GitHub 仓库上找到更多信息和示例。

## UI库

### Layui-WPF

这是一个WPF版的Layui前端UI样式库

### Arthas-WPFUI

仓库地址：https://github.com/oneo-me/Arthas-WPFUI

### HandyControl

### MaterialDesign

MaterialDesignThemes 是一个实现 Material Design 风格的开源库，提供了许多用于创建漂亮和现代化用户界面的控件和样式。它与WPF和其他XAML框架兼容，并且非常易于使用。你可以在 MaterialDesignThemes 的 GitHub 仓库上找到更多信息和示例。

### Rubyer

## 组件库

### 登录

#### ModernLogin
[https://mp.weixin.qq.com/s/-_RhodsHEIVLnl7gSpiHtQ](https://mp.weixin.qq.com/s/-_RhodsHEIVLnl7gSpiHtQ) | WPF|分享一个登录界面设计
ModernLogin: https://github.com/dotnet9/TerminalMACS.ManagerForWPF/tree/master/src/TerminalMACS.TestDemo/Views/ModernLogin

### 主页

#### WalletPayment钱包支付仪表盘

- 油管视频作者：C## WPF UI Academy
- 油管视频：C## WPF UI | How to Design Dark Mode Wallet Payment Dashboard in WPF
- 参考代码：WPF-Dark-Wallet-Payment
- 本文代码：WalletPayment

[https://mp.weixin.qq.com/s/BH9Ba7CgFwVsnfb4C9rdNw](https://mp.weixin.qq.com/s/BH9Ba7CgFwVsnfb4C9rdNw) | WPF|黑暗模式的钱包支付仪表盘界面设计

### 导航

#### DropdownMenu
YouTube  Design com WPF 大神处习得，菜单导航功能实现，常规的管理系统应该常用，左侧显示菜单条目，点击菜单，右侧切换不同的业务用户控件。
常用菜单可以采用TreeView树形控件+特定样式实现 ，本文介绍的是使用Expander+ListView的组合形式实现的导航菜单，两种各有各的好处，本文不做优劣评价。
[https://mp.weixin.qq.com/s/Q9RVNIJzsHVBPNP3YveOJA](https://mp.weixin.qq.com/s/Q9RVNIJzsHVBPNP3YveOJA) | C## WPF侧边栏导航菜单（Dropdown Menu）
参考视频：Design com WPF：https://www.youtube.com/watch?v=-JZJh7D0E5E
源码Github地址：https://github.com/Abel13/DropdownMenu

### 列表

#### gong-wpf-dragdrop
仓库地址：[https://github.com/punker76/gong-wpf-dragdrop](https://github.com/punker76/gong-wpf-dragdrop)
[https://mp.weixin.qq.com/s/u388RR7GFL3d1qtqMUKsoA](https://mp.weixin.qq.com/s/u388RR7GFL3d1qtqMUKsoA) | 一个可拖拉实现列表排序的WPF开源控件

## 思维图

### aistudio.-wpf.-diagram
仓库地址：[https://gitee.com/akwkevin/aistudio.-wpf.-diagram](https://gitee.com/akwkevin/aistudio.-wpf.-diagram)
[https://mp.weixin.qq.com/s/0inVDcEYjy0HDXe7aoXS8Q](https://mp.weixin.qq.com/s/0inVDcEYjy0HDXe7aoXS8Q) | 用WPF做一个思维导图

## WebBrower
将浏览器嵌入 .NET 应用程序中：DotNetBrowser 还是 CefSharp？：[https://mp.weixin.qq.com/s/wpReb7QyInywyUfVMn9TKA](https://mp.weixin.qq.com/s/wpReb7QyInywyUfVMn9TKA)

### CefSharp
CefSharp 实际上是 Chromium Embedded Framework(CEF) 的 .NET 包装器。包装通过 C++/CLI 完成。

### DotNetBrowser
DotNetBrowser 在底层不使用 CEF 或 C++/CLI。相反，它采用了自己的方法直接与 Chromium 集成。它启动一个功能齐全的 Chromium 引擎，并通过进程间通信 (IPC) 与其进行通信。

## 图表

### LiveCharts

LiveCharts 是一个灵活和高性能的图表库，用于在WPF应用程序中创建各种类型的图表，如折线图、柱状图、饼图等。它支持实时数据更新和动画效果，并且提供了丰富的配置选项。你可以在 LiveCharts 的 GitHub 仓库上找到更多信息和示例。

## 模板打印

### FastReport

## 权限管理

### ZTAppFramework
WPF版本的权限管理
[https://www.cnblogs.com/zt199510/p/15151835.html](https://www.cnblogs.com/zt199510/p/15151835.html) | ZTAppFramework框架说明 - 可乐_加冰 - 博客园
仓库地址：[https://github.com/zt199510/ZTAppFramework](https://github.com/zt199510/ZTAppFramework)

## 串口调试

### SerialPort
[https://github.com/239573049/SerialPort](https://github.com/239573049/SerialPort)
[https://gitee.com/hejiale010426/serial-port](https://gitee.com/hejiale010426/serial-port)
串口工具，用于调试串口，支撑自定义串口参数，支撑定时发送。

## 视频

### FFplay
 C## 实现调用FFplay播放视频：[https://mp.weixin.qq.com/s/P42dLcKUZJxfVVsyB0jybQ](https://mp.weixin.qq.com/s/P42dLcKUZJxfVVsyB0jybQ)
