---
title: SDK工作负载
lang: zh-CN
date: 2023-05-09
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: sdkgongzuofuzai
slug: ipxgku
docsId: '63013261'
---
> 本文来自微信公众号【My IO】


## 前言
为了应对.NET SDK能够支持的程序集项目（例如iOS、Android、WASM）的不断增长，从.NET 6开始，允许用户仅安装必要的SDK（例如ASP.NET Core），而不是一次性安装“完整版”SDK。
这一切的基础，是新的dotnet CLI命令——workload。

## 操作

### 列表
首先，列出可安装的工作负载：
```csharp
dotnet workload search
```
目前支持的工作负载如下：
```csharp
Workload ID           Description
-------------------------------------------------------------------------------------------
android               .NET SDK Workload for building Android applications.
android-aot           .NET SDK Workload for building Android applications with AOT support.
ios                   .NET SDK Workload for building iOS applications.
maccatalyst           .NET SDK Workload for building macOS applications with MacCatalyst.
macos                 .NET SDK Workload for building macOS applications.
maui                  .NET MAUI SDK for all platforms
maui-android          .NET MAUI SDK for Android
maui-desktop          .NET MAUI SDK for Desktop
maui-ios              .NET MAUI SDK for iOS
maui-maccatalyst      .NET MAUI SDK for Mac Catalyst
maui-mobile           .NET MAUI SDK for Mobile
maui-windows          .NET MAUI SDK for Windows
tvos                  .NET SDK Workload for building tvOS applications.
wasm-tools            .NET WebAssembly build tools
```
列出当前已经安装的负载
```csharp
dotnet workload list
```

### 安装
然后，下列命令安装需要的工作负载：
```csharp
dotnet workload install {Workload_ID}
```
我们安装maui-windows试试：
```csharp
dotnet workload install maui-windows

//输出
Updated advertising manifest microsoft.net.sdk.android.
Updated advertising manifest microsoft.net.sdk.ios.
Updated advertising manifest microsoft.net.sdk.macos.
Updated advertising manifest microsoft.net.workload.emscripten.
Updated advertising manifest microsoft.net.sdk.maccatalyst.
Updated advertising manifest microsoft.net.sdk.tvos.
Updated advertising manifest microsoft.net.workload.mono.toolchain.
Updated advertising manifest microsoft.net.sdk.maui.
Installing Microsoft.Maui.Core.Ref.win.6.0.101.2068-x64.msi ............ Done
Installing Microsoft.Maui.Core.Runtime.win.6.0.101.2068-x64.msi ..... Done
Installing Microsoft.Maui.Controls.Ref.win.6.0.101.2068-x64.msi ..... Done
Installing Microsoft.Maui.Controls.Runtime.win.6.0.101.2068-x64.msi ..... Done
Installing Microsoft.Maui.Essentials.Ref.win.6.0.101.2068-x64.msi ..... Done
Installing Microsoft.Maui.Essentials.Runtime.win.6.0.101.2068-x64.msi ..... Done
Installing Microsoft.AspNetCore.Components.WebView.Maui.6.0.101.2068-x64.msi .... Done
Installing Microsoft.Maui.Dependencies.6.0.101.2068-x64.msi .... Done
Installing Microsoft.Maui.Controls.Build.Tasks.6.0.101.2068-x64.msi ..... Done
Installing Microsoft.Maui.Sdk.6.0.101.2068-x64.msi ..... Done
Installing Microsoft.Maui.Extensions.6.0.101.2068-x64.msi ..... Done
Installing Microsoft.Maui.Resizetizer.Sdk.6.0.101.2068-x64.msi ...... Done
Installing Microsoft.Maui.Templates.6.0.101.2068-x64.msi ..... Done
Installing Microsoft.Maui.Core.Ref.any.6.0.101.2068-x64.msi ..... Done
Installing Microsoft.Maui.Core.Runtime.any.6.0.101.2068-x64.msi ..... Done
Installing Microsoft.Maui.Controls.Ref.any.6.0.101.2068-x64.msi ..... Done
Installing Microsoft.Maui.Controls.Runtime.any.6.0.101.2068-x64.msi ..... Done
Installing Microsoft.Maui.Essentials.Ref.any.6.0.101.2068-x64.msi ..... Done
Installing Microsoft.Maui.Essentials.Runtime.any.6.0.101.2068-x64.msi ..... Done

Successfully installed workload(s) maui-windows.
```
_可以看到，它并没有安装多余的SDK，比如Maui的android版本。_
打开VS 2022，新建项目，已经可以创建MAUI项目了，默认情况下是没有的.

### 更新
另外，你可以使用下列命令，将所有已安装的SDK工作负载更新为最新版本
```csharp
dotnet workload update

//输出
Updated advertising manifest microsoft.net.sdk.ios.
Updated advertising manifest microsoft.net.sdk.android.
Updated advertising manifest microsoft.net.sdk.macos.
Updated advertising manifest microsoft.net.workload.emscripten.
Updated advertising manifest microsoft.net.sdk.tvos.
Updated advertising manifest microsoft.net.sdk.maccatalyst.
Updated advertising manifest microsoft.net.sdk.maui.
Updated advertising manifest microsoft.net.workload.mono.toolchain.

Successfully updated workload(s): maui-windows.
```

### 卸载
当然，你可以将已安装的SDK工作负载卸载：
```csharp
dotnet workload uninstall maui-windows

//输出
Removing workload installation record for maui-windows...
Removing Microsoft.AspNetCore.Components.WebView.Maui.6.0.101.2068-x64.msi ..... Done
Removing Microsoft.Maui.Controls.Build.Tasks.6.0.101.2068-x64.msi .... Done
Removing Microsoft.Maui.Controls.Ref.any.6.0.101.2068-x64.msi ..... Done
Removing Microsoft.Maui.Controls.Ref.win.6.0.101.2068-x64.msi ..... Done
Removing Microsoft.Maui.Controls.Runtime.any.6.0.101.2068-x64.msi ..... Done
Removing Microsoft.Maui.Controls.Runtime.win.6.0.101.2068-x64.msi ..... Done
Removing Microsoft.Maui.Core.Ref.any.6.0.101.2068-x64.msi ..... Done
Removing Microsoft.Maui.Core.Ref.win.6.0.101.2068-x64.msi ..... Done
Removing Microsoft.Maui.Core.Runtime.any.6.0.101.2068-x64.msi ..... Done
Removing Microsoft.Maui.Core.Runtime.win.6.0.101.2068-x64.msi ..... Done
Removing Microsoft.Maui.Dependencies.6.0.101.2068-x64.msi .... Done
Removing Microsoft.Maui.Essentials.Ref.any.6.0.101.2068-x64.msi .... Done
Removing Microsoft.Maui.Essentials.Ref.win.6.0.101.2068-x64.msi ..... Done
Removing Microsoft.Maui.Essentials.Runtime.any.6.0.101.2068-x64.msi ..... Done
Removing Microsoft.Maui.Essentials.Runtime.win.6.0.101.2068-x64.msi ..... Done
Removing Microsoft.Maui.Extensions.6.0.101.2068-x64.msi .... Done
Removing Microsoft.Maui.Resizetizer.Sdk.6.0.101.2068-x64.msi .... Done
Removing Microsoft.Maui.Sdk.6.0.101.2068-x64.msi ..... Done
Removing Microsoft.Maui.Templates.6.0.101.2068-x64.msi .... Done

Successfully uninstalled workload(s): maui-windows
```

## 恢复
```csharp
 dotnet workload restore
```
