---
title: 环境准备
lang: zh-CN
date: 2023-05-28
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: huanjingzhunbei
slug: nq23rx
docsId: '97535877'
---

## VS准备
首先确保安装了最新版本的VS，并且安装了Mobile development with .NET工作负载。

## 硬件加速
官网资料：[https://learn.microsoft.com/zh-cn/dotnet/maui/android/emulator/hardware-acceleration](https://learn.microsoft.com/zh-cn/dotnet/maui/android/emulator/hardware-acceleration)
启用硬件加速才能最大化 Android 模拟器性能，我们可以启用Hyper-V，在 Windows 搜索框中输入“Windows 功能”，然后在搜索结果中选择“打开或关闭 Windows 功能” 。在“Windows 功能”对话框中，启用“Hyper-V”和“Windows 虚拟机监控程序平台” ：
![image.png](/common/1666363963944-d33ef048-7fc4-4002-b620-8a4356a74e98.png)
以及
![image.png](/common/1666363980533-9c1a33b8-0571-4236-ba59-2d922f76c5e9.png)
启用之后，重新启动计算机
> 请确保 在 Android Device Manager 中创建 的虚拟设备是 **x86 64** 或基于 **x86**的系统映像。如果使用基于 Arm 的系统映像，则不会加速虚拟设备，并且运行速度会缓慢。启用 Hyper-v 后，可以运行加速 Android 仿真器。HAXM加速和详细设置可参考：如何使用 Android 仿真程序 & 启用硬件加速


## 参考资料
在Maui中使用Masa Blazor：[https://mp.weixin.qq.com/s/NmnHD0fUz8q0R1JJBSQbIg](https://mp.weixin.qq.com/s/NmnHD0fUz8q0R1JJBSQbIg)
