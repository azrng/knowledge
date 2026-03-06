---
title: 概述
lang: zh-CN
date: 2023-03-29
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: gaishu
slug: dv5d9ovoiqaoceea
docsId: '111753464'
---

## 平台

龙芯支持：[http://www.loongnix.cn/zh/api/dotnet/](http://www.loongnix.cn/zh/api/dotnet/)

## 部署模式选择

ASP.NetCore目前的部署方式分为三种，独立发布（SCD）、框架依赖（FDD）、依赖框架的可执行文件（FDE）。其中FDD和FDE差别不大，不予讨论 

### 独立部署

不依赖目标系统上存在的共享组件。所有的组件（netcore库和netcore运行时）都包含在应用程序中，并且独立于其他netcore应用程序。

### 框架依赖

依赖目标系统上存在共享系统版本的netcore。

### 选择哪种部署方式

简单的说框架依赖和独立发布的区别就是装不装 .Net core运行时的区别。装上运行时之后，很多`.net core`的库都能共用，否则就需要另外打包进去，所以独立发布的程序体积会比框架依赖大得多。本人以`asp.net core`默认样板应用实测，独立发布的大小约为100M，框架依赖的大小约为5M。
独立发布的话不需要安装`.net core`的运行时，而框架依赖则需要安装`.net core` 运行时或者直接安装SDK。

## 兼容库

### YY-Thunks

 使您的应用程序与旧版本的 Windows 兼容更容易！

仓库地址：[https://github.com/Chuyu-Team/YY-Thunks/](https://github.com/Chuyu-Team/YY-Thunks/)

## 发布操作

### CLI发布

资料：[https://learn.microsoft.com/zh-cn/dotnet/core/deploying/deploy-with-cli](https://learn.microsoft.com/zh-cn/dotnet/core/deploying/deploy-with-cli)

```shell
# 剪裁
dotnet publish -c Release -r win-x64 /p:PublishSingleFile=true /p:PublishTrimmed=true /p:PublishReadyToRun=true /p:PublishReadyToRunShowWarnings=true /p:UseAppHost=true  /p:IncludeNativeLibrariesForSelfExtract=true /p:SelfContained=true --self-contained true

# 禁用剪裁
dotnet publish -c Release -r win-x64  /p:PublishSingleFile=true /p:PublishTrimmed=false /p:PublishReadyToRun=true /p:IncludeNativeLibrariesForSelfExtract=true --self-contained true
```

其中，`-r` 参数表示发布目标平台，`win-x64` 代表 Windows 64 位。你可以根据需要替换为其他平台。
dotnet publish：这是用于执行发布操作的 .NET CLI 命令。

- `dotnet publish`：这是用于执行发布操作的 .NET CLI 命令。
- `-c Release`：指定发布的配置为 Release 模式，这将优化应用程序的性能和大小。
- `-r win-x64`：指定目标运行时为 Windows x64 平台，发布输出将为该平台准备。
- `/p:PublishSingleFile=true`：设置发布输出为单个可执行文件，将应用程序和其依赖项打包为一个文件。
- `/p:PublishTrimmed=true`：启用发布优化，删除未使用的依赖项和代码来减小应用程序的大小。
- `/p:PublishReadyToRun=true`：使用 ReadyToRun 编译器进行发布，可以提高应用程序的启动性能。
- `/p:PublishReadyToRunShowWarnings=true`：在使用 ReadyToRun 编译器进行发布时显示警告信息。
- `/p:IncludeNativeLibrariesForSelfExtract=true`：包含本机库以支持自解压功能，以便在运行时自动提取依赖项。
- `/p:UseAppHost=true`:false为依赖框架部署，详细看[此处](https://learn.microsoft.com/zh-cn/dotnet/core/deploying/deploy-with-cli#framework-dependent-deployment)

#### 裁剪部署

部署说明：[地址](https://learn.microsoft.com/zh-cn/dotnet/core/deploying/trimming/trim-self-contained)

CLI发布命令，以下示例将 Windows 应用发布为经过剪裁的独立应用程序

```csharp
dotnet publish -r win-x64 -c Release

dotnet publish -r win-x64 -c Release -p:PublishTrimmed=true
```

告诉修剪器它需要保留的一些东西：[https://learn.microsoft.com/en-us/dotnet/core/deploying/trimming/incompatibilities](https://learn.microsoft.com/en-us/dotnet/core/deploying/trimming/incompatibilities)

### dotnet-packaging

.NET Core 打包工具，100 % 使用 C# 开发，它包含了  .NET Core CLI 的命令行扩展，所以可以轻松为 .NET Core 应用程序创建部署包，比如 windows msi 文件、 Linux 安装程序 deb、 macOS 安装程序 pkg 等等

[太方便了.NET Core打包工具dotnet-packaging](https://mp.weixin.qq.com/s/dDxchuFnIjtzZ_e168j5ag)

#### 常用命令

```shell
# 创建 macOS 安装程序
dotnet pkg

# 创建 Ubuntu/Debian Linux 安装程序
dotnet deb

# 创建 .zip 文件
dotnet zip

# 创建 Windows Installer (msi) 包
dotnet msi
```

#### 安装

首先，安装全局 .NET 打包工具。如果您只打算使用一个工具，则无需安装所有工具。

```shell
dotnet tool install --global dotnet-zip
dotnet tool install --global dotnet-tarball
dotnet tool install --global dotnet-rpm
dotnet tool install --global dotnet-deb
```

然后，在您的项目目录中，运行命令将该工具添加到您的项目中

```shell
dotnet zip install
dotnet tarball install
dotnet rpm install
dotnet deb install
```

#### 打包Ubuntu包教程

让我们创建一个新的控制台应用程序并将其打包为 .deb 文件，以便我们可以将其安装在 Ubuntu 计算机上：

首先，创建您的控制台应用程序：

```shell
mkdir my-app
cd my-app
dotnet new console
```

然后，安装 dotnet-deb 实用程序：

```shell
dotnet tool install --global dotnet-deb
dotnet deb install
```

可以了，让我们将您的应用程序打包为 deb 包：

```
dotnet deb
```

现在有一个可以安装的 bin\Debug\netcoreapp3.1\my-app.1.0.0.deb 文件：

```shell
apt-get install bin\Debug\netcoreapp3.1\my-app.1.0.0.deb
```

您的应用程序已安装到 /usr/local/share/my-app 中。通过运行 /usr/local/share/my-app/my-app 来调用它：

```shell
/usr/local/share/my-app/my-app
```

如您所见，dotnet-packaging 使用非常简单，您可以使用它轻松的创建各个平台的安装包，只需要一行命令即可。

## 资料

揭秘.NET Core剪裁器背后的技术：[https://mp.weixin.qq.com/s/uZU0vUSmKAplUa23GkOAlQ](https://mp.weixin.qq.com/s/uZU0vUSmKAplUa23GkOAlQ)

## 参考资料

https://mp.weixin.qq.com/s/hFsQJSCIZ-hSWotMSy9zgQ | 太方便了，开源的 .NET Core 打包工具
