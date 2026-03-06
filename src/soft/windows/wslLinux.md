---
title: WSL
lang: zh-CN
date: 2023-08-20
publish: true
author: azrng
isOriginal: false
filename: wslLinux
category:
 - soft
tag:
 - linux
 - wsl
---

## 前言

在windows pc上面部署Linux

* 虚拟机：性能与功能受限
* 双系统：切换麻烦，容易无法引导
* 双机/云主机：贵

## 概述

Windows Subsystem for Linux（简称WSL）是一个在Windows 10\11上能够运行原生Linux二进制可执行文件（ELF格式）的兼容层。它是由微软与Canonical公司合作开发，其目标是使纯正的Ubuntu、Debian等映像能下载和解压到用户的本地计算机，并且映像内的工具和实用工具能在此子系统上原生运行。 内容来自于百度百科。



官网：https://learn.microsoft.com/zh-cn/windows/wsl/

最佳实践：https://learn.microsoft.com/zh-cn/windows/wsl/setup/environment

## 安装

:::tip

注：我记得是家庭版本是不支持的。

环境要求

windows 10版本2004 / windows 11

:::

使用命令安装wsl(如果不想使用命令安装，直接往下看)，点击桌面左下角然后右键使用Windows PowerShell(管理员)运行，输入安装命令

```powershell
wsl --install
```

如果这个时候提示无法解析或者其它错误，还是直接去控制面板进行安装吧



搜索控制面板然后点击程序

![img](/common/blog202212122216903.png)

点击启用或者关闭windows功能

![img](/common/blog202212122216864.png)

在弹框的windows功能中勾选适用于linux的windows子系统和虚拟机平台

![img](/common/blog202212122216686.png)

###  安装Ubuntu系统

然后我们就可以在微软商店里面搜索wsl(Windows Subsystem for Linux)，然后点击安装，这里我直接安装Ubuntu系统

![image-20230820155155550](/common/image-20230820155155550.png)

原因是centos已经不维护了，目前使用Ubuntu的人也不少，那么就趁此机会学习一下Ubuntu吧，下载安装之后在开始菜单就可以看到安装好的Ubuntu系统，单击打开

![image-20230820155001072](/common/image-20230820155001072.png)

需要你设置账号密码，然后就开始设置账号和密码

![image-20230929185758465](/common/image-20230929185758465.png)

设置好就可以正常使用，使用命令查看发行版本信息，如果需要更新密码需要[点击此处](https://learn.microsoft.com/zh-cn/windows/wsl/setup/environment#set-up-your-linux-username-and-password)

```powershell
lsb_release -a

# 输出结果
No LSB modules are available.
Distributor ID: Ubuntu
Description:    Ubuntu 22.04.2 LTS
Release:        22.04
Codename:       jammy
```

至此安装教程完成，且已经进入系统，请尽情学习吧。

### 服务器安装其他工具

#### docker

在ubuntu22.04中使用阿里云镜像站安装docker：https://beltxman.com/4020.html

##### 更新镜像代理地址

```shell
# 编辑文件
sudo vim /etc/docker/daemon.json

# 填入镜像地址并保存
{
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn"
  ]
}

# 重启docker服务
sudo systemctl daemon-reload
sudo systemctl restart docker

# 验证配置
sudo docker info | grep "https:"
```

## WSL命令

:::tip

以下的命令本人是使用命令行工具Terminal来执行的，读者可自行选择命令行工具

:::

### 更新和升级包

建议使用发行版的首选包管理器定期更新和升级包。 对于 Ubuntu 或 Debian，请使用以下命令：

```powershell
sudo apt update && sudo apt upgrade
```

Windows 不会自动更新或升级 Linux 分发版。

#### 更新镜像源

:::tip

可选操作

:::

因为大部分 linux 发行版的服务器都在国外所以下载速度都会很慢，使用国内的镜像下载速度就快很多，以更换阿里源为例



查看当前的镜像源

```powershell
cat /etc/apt/sources.list
```

将系统源文件复制一份备用

```powershell
sudo cp /etc/apt/sources.list /etc/apt/sources.list.bak
```

使用编辑器去更新源文件(使用宿主机vscode进行编辑)

```powershell
code /etc/apt/sources.list
```

直接将下面阿里云的镜像源复制粘贴到最后一行

```
#  阿里镜像源
deb http://mirrors.aliyun.com/ubuntu/ bionic main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic main restricted universe multiverse

deb http://mirrors.aliyun.com/ubuntu/ bionic-security main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic-security main restricted universe multiverse

deb http://mirrors.aliyun.com/ubuntu/ bionic-updates main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic-updates main restricted universe multiverse

deb http://mirrors.aliyun.com/ubuntu/ bionic-proposed main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic-proposed main restricted universe multiverse

deb http://mirrors.aliyun.com/ubuntu/ bionic-backports main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic-backports main restricted universe multiverse
```

> 这里因为权限不足的问题没有保存成功，后续再找方案

### 查看版本

查看wsl版本

```powershell
wsl --version 

# 输出结果
WSL 版本： 1.2.5.0
内核版本： 5.15.90.1
WSLg 版本： 1.0.51
MSRDC 版本： 1.2.3770
Direct3D 版本： 1.608.2-61064218
DXCore 版本： 10.0.25131.1002-220531-1700.rs-onecore-base2-hyp
Windows 版本： 10.0.19045.3448
```



查看当前机器已经安装了那些linux，或者查看当前linux发行版本为wsl1还是wsl2

```powershell
wsl -l -v
```

![image-20230930111631909](/common/image-20230930111631909.png)

这个图上面显示的是我本地docker带的linux系统，且显示对应的名称、状态以及版本



如果想删除某一个linux系统，那么就可以使用(删除需谨慎)

```powershell
wsl --unregister linuxName
```

#### 设置版本

:::tip

可选操作，有些电脑如果wsl版本是1的话看情况需要设置

:::

设置后续安装的linux发行版本都用默认的WSL2执行

```powershell
wsl --set-default-version 2
```



将当前的linux设置为wsl2运行

```powershell
wsl --set-version 服务器名称 2

# 示例
wsl --set-version Ubuntu 2
```

### 管理服务器

#### 连接服务器

:::tip

在使用命令行工具执行命令进入服务器之前，建议先将当前命令行的执行目录切换为其他盘符(默认是C:\Users\xxx)，省得出现稀奇古怪的问题

:::

通过下面命令进入对应的linux系统，进入之后默认就启动了（退出使用exist）

```powershell
wsl -d 服务器名称 --user 用户名

# 示例
 wsl -d Ununtu --user azrng
```

![image-20230929190156455](/common/image-20230929190156455.png)

如果上面是使用我们自己的账号进入的服务器，而不是root用户，那么在执行命令的就可能遇到下面的权限问题

![image-20230930110641923](/common/image-20230930110641923.png)

那么就可以在原有的命令之前加一个sudo来操作，如

```shell
# 以获取服务器上的容器命令来举例
sudo docker ps
# 然后按照提示输入密码
```

#### 关闭服务器

如果想关掉linux系统，那么就可以使用命令

```powershell
wsl --terminate 服务器名称

# 示例
wsl --terminate Ubuntu-20.04

# 也可以直接使用
wsl --shutdown
```

#### 删除服务器

如果想删除指定的linux系统，可以使用命令

```powershell
wsl --unregister 服务器名称

# 示例
wsl --unregister Ubuntu-20.04
```

#### 编辑文件

可以使用vim或者直接使用宿主机的vscode进行编辑文件，比如

```
# 创建文件，如果提示没有权限可以通过使用sudo -i
touch aa.txt

# 编辑文件
code aa.txt
```

### 备份和还原

备份对应的linux

```shell
wsl --export 服务器名称 备份文件名.tar

# 示例 将名字为Ubuntu-20.04的linux备份为Ubuntu.tar文件
wsl --export Ubuntu-20.04 Ubuntu.tar
```

还原文件

```shell
wsl --import 服务器名称 存放地址 备份文件


# 示例 将备份文件Ubuntu.tar还原为一个名字叫做UbuntuName的linux系统，且文件存放在d:\temp\UbuntuName
wsl --import UbuntuName d:\temp\UbuntuName .\Ubuntu.tar
```

## 跨OS文件操作

官网文档：[https://learn.microsoft.com/zh-cn/windows/wsl/filesystems](https://learn.microsoft.com/zh-cn/windows/wsl/filesystems)

### 从linux访问windows文件

通过导航到`/mnt`，然后导航到你的windows驱动器，然后就可以访问指定文件，从linux中访问示例

```shell
# 切记这里驱动器的要小写
cd /mnt/d/Gitee/avalonia-hello
```

### 从文件资源管理器访问linux文件

通过导航到`\\wsl.localhost\`来查询linux文件，比如我的linux名字叫做`Ubuntu-24.04`

```shell
# 这里好像有权限一说，目前访问的是普通用户就可以访问的目录
cat \\wsl.localhost\Ubuntu-24.04\home\aa.txt
```

## 参考资料

安装wsl：https://learn.microsoft.com/zh-cn/windows/wsl/install#step-5---set-wsl-2-as-your-default-version

## 其他资料

不使用 Docker Desktop 在 WSL2 上运行 Docker：https://beltxman.com/4382.html