---
title: 升级助手
lang: zh-CN
date: 2023-10-18
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: shengjizhushou
slug: dp5ahh
docsId: '73564980'
---

## 说明
.NET 升级助手是一款可以在不同类型的 .NET Framework 应用上运行的命令行工具。 它旨在帮助将 .NET Framework 应用升级到 .NET 6。 在运行此工具后，大多数情况下，应用将需要其他操作才能完成迁移。 此工具会安装可以帮助完成迁移的分析器。
该工具目前支持下列 .NET Framework 应用类型：

- .NET Framework Windows 窗体应用
- .NET Framework WPF 应用
- .NET Framework ASP.NET MVC 应用
- .NET Framework 控制台应用
- .NET Framework 类库

## 安装
.NET 升级助手是一个 .NET 工具，可以使用以下命令进行全局安装：
```yaml
dotnet tool install -g upgrade-assistant
```
同样地，由于 .NET 升级助手是作为 .NET 工具安装的，因此运行以下命令可以轻松地更新它：
```yaml
dotnet tool update -g upgrade-assistant
```

## 操作

### winform

#### 运行升级助手
导航到包含项目或解决方案的目录，并运行以下命令:
```csharp
upgrade-assistant analyze <Path to csproj or sln to upgrade>
```
> 将此页命令上的 `<Path to csproj or sln to upgrade>` 更改为解决方案或项目文件的路径和名称。

然后将生成 SARIF 格式的报告 JSON 格式。
分析项目依赖项后，运行以下命令以开始升级项目
```csharp
upgrade-assistant upgrade <Path to csproj or sln to upgrade>
```

#### 选择入口项目
第一步是选择解决方案中的哪个项目作为入口点项目，选择1
![image.png](/common/1649992687783-91bb6b3e-28ca-4271-8b8a-948c3b25c82e.png)
因为这个项目升级的是开源项目DBCHM(个人基于该项目准备做一些自定义操作)，所以选择入口项目
![image.png](/common/1649992740859-8f7e572c-5b2b-49fd-a53b-e2e80db81c3e.png)
再次输入1然后等待完成。

#### 选择升级项目
根据提示一个一个选择要升级的项目
![image.png](/common/1649993159415-9995847b-0cda-4f2b-8203-ec7255ae18bd.png)
下面的步骤有点乱，得一点一点测试，我这边升级到一半无脑enter了。
可参考：[https://docs.microsoft.com/zh-cn/dotnet/core/porting/upgrade-assistant-winforms-framework](https://docs.microsoft.com/zh-cn/dotnet/core/porting/upgrade-assistant-winforms-framework)

## 错误

### 无法还原工具包
具体错误信息
```csharp
无法还原工具包。
工具“upgrade-assistant”安装失败。此故障可能由以下原因导致:

* 你尝试安装预览版，但未使用 --version 选项来指定该版本。
* 已找到具有此名称的包，但是它不是 .NET 工具。
* 无法访问所需的 NuGet 源，这可能是由于 Internet 连接问题导致。
* 工具名称输入错误。

有关更多原因(包括强制包命名)，请访问 https://aka.ms/failure-installing-tool
Description:
  安装全局或本地工具。本地工具将被添加到清单并还原。
```
解决方案
```csharp
dotnet tool install -g upgrade-assistant --ignore-failed-sources
```
资料：[https://github.com/dotnet/upgrade-assistant/issues/1099](https://github.com/dotnet/upgrade-assistant/issues/1099)

## VS插件
当下(2023年3月)可以通过安装VS插件来实现可视化升级方案。
插件地址：[https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.upgradeassistant](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.upgradeassistant)

## 资料
升级助手概述：[https://docs.microsoft.com/zh-cn/dotnet/core/porting/upgrade-assistant-overview](https://docs.microsoft.com/zh-cn/dotnet/core/porting/upgrade-assistant-overview)
安装资料：[https://dotnet.microsoft.com/zh-cn/platform/upgrade-assistant/tutorial/install-sdk](https://dotnet.microsoft.com/zh-cn/platform/upgrade-assistant/tutorial/install-sdk)
