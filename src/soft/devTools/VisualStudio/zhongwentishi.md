---
title: VisualStudio配置中文提示
lang: zh-CN
date: 2023-07-22
publish: true
author: azrng
order: 003
category:
  - Visual Studio
tag:
  - 无
filename: visualstudiopeizhizhongwendishi
---

## 开篇语
IntelliSense 是一种代码完成辅助工具，可以在不同的集成开发环境 (IDE) 中使用，例如 Visual Studio。 默认情况下，在开发 .NET 项目时，SDK 仅包含英语版本的 IntelliSense 文件。虽然推荐使用英文，可以熟悉和学习英文，不过我还是偷懒改成了提示语为中文，首先看下不设置语言包时候的样子
![image.png](/common/1626705376387-d2a0f950-3c77-4e50-8088-c712c2192602.png)

## 操作

### 下载语言包
下载地址：[https://dotnet.microsoft.com/download/intellisense](https://dotnet.microsoft.com/download/intellisense)
![image.png](/common/1626693600480-7e1e1370-90ef-49a0-b3cb-dc3e4017a098.png)

选择合适版本合适语言(中文简体)的IntelliSense文件，查看下载后的文件并解压

:::tip

没有.Net6以及更高版本的，可以直接使用.Net5的也会带部分的提示

因为官方不再提供本地化包了，详情可查看相关 Issue https://github.com/dotnet/docs/issues/27283

可以使用博客园网友 `@internalnet` 制作的本地化包 https://www.cnblogs.com/internalnet/p/16185298.html

:::

![image.png](/common/1626693696379-f6853c71-aa4b-4347-8d6d-103c1e65b2a5.png)

> Microsoft.NETCore.App.Ref：.NET 5+ 和 .NET Core
> Microsoft.WindowsDesktop.App.Ref：Windows 桌面
> NETStandard.Library.Ref：.NET Standard


### 配置语言文件
打开本地 .NET Intellisense 文件夹，默认路径是在C盘，这里我的地址是在
```
C:\Program Files\dotnet\packs
```
![image.png](/common/1626694008395-b19773c5-6b7c-4471-a7c3-379c703b0f84.png)
比如我们要为Microsoft.NETCore.App配置，那么就复制我们下载的文件内的zh-hans文件夹到指定版本下
```sql
C:\Program Files\dotnet\packs\Microsoft.NETCore.App.Ref\5.0.0\ref\net5.0
```
![image.png](/common/1626706344484-b2571b96-a1a6-460b-80ad-6bca639a5e40.png)
另外两个看需求进行配置，配置完需要重启VS生效，查看结果
![image.png](/common/1626706467145-562c125d-bec0-4375-8cad-ca8db4d86933.png)

## 参考文档
> [https://docs.microsoft.com/zh-cn/dotnet/core/install/localized-intellisense](https://docs.microsoft.com/zh-cn/dotnet/core/install/localized-intellisense)

