---
title: Windows Server安装docker
lang: zh-CN
date: 2023-11-20
publish: true
author: azrng
isOriginal: true
category:
  - cloud
tag:
  - docker
---

## 概述

若要运行 Windows 容器，必须在计算机上具有受支持的容器运行时。 Windows 当前支持的运行时是 [containerd](https://kubernetes.io/docs/setup/production-environment/container-runtimes/#containerd)、[Moby](https://mobyproject.org/) 和 [Mirantis 容器运行时](https://info.mirantis.com/docker-engine-support)。

## 基本要求

（1）必须是64位操作系统，win7或者更高 （推荐Windows 10/server 2016 因为新版集成了很多新组件）
（2）支持“ Hardware Virtualization Technology”，并且，“virtualization ”可用（也就是在BIOS启用VT参数）

##  操作

:::tip

下面的操作在windows server 2016上执行

:::

下面来讲解安装docker CE/Moby容器，，微软为我们提供了一个powershell脚本，然后在服务器上搜索Windows PowrShell，然后启动并执行下面的命令

```shell
Invoke-WebRequest -UseBasicParsing "https://raw.githubusercontent.com/microsoft/Windows-Containers/Main/helpful_tools/Install-DockerCE/install-docker-ce.ps1" -o install-docker-ce.ps1
.\install-docker-ce.ps1
```




:::tip

报错还没搞好，不多步骤差不多就是这些

:::

## 其他操作

### powerShell更新

安装windows更新，打开powerShell，然后运行命令

```powershell
sconfig
```

![image-20231121092413365](/common/image-20231121092413365.png)

然后选择其中的选项6去安装更新，直接选择选项A下载所有更新并安装。

### install-docker-ce.ps1 : 请求被中止: 未能创建 SSL/TLS 安全通道

首先查询单签系统中默认启动的协商协议列表

```powershell
[Net.ServicePointManager]::SecurityProtocol

# 打印出来应该是不包含Tls12的
```

去下载这个软件 打开软件后 TLS 1.0 和 TLS 1.1 全部勾上，或者点击Best Practices ，然后勾选 Reboot ，点击 Apply ，服务器会重启，重启之后就好了.

下载地址：https://www.nartac.com/Products/IISCrypto/Download



如果可以最好，如果不行那么就是用下面的方法。临时方案

```powershell
# fix ssl in tyy win10 server 2016
[System.Net.ServicePointManager]::SecurityProtocol += [System.Net.SecurityProtocolType]::Tls12;
```

https://blog.csdn.net/qq_20679687/article/details/130643546

## 资料

windows server设置环境：https://learn.microsoft.com/zh-cn/virtualization/windowscontainers/quick-start/set-up-environment?tabs=dockerce#windows-server

windows server 安装docker客户端 https://www.cnblogs.com/yangsongyan/p/10882319.html

