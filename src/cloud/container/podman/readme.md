---
title: 说明
lang: zh-CN
date: 2024-03-23
publish: true
author: azrng
isOriginal: true
category:
  - cloud
tag:
  - podman
---

## 概述

Podman 是一个开源的容器运行时项目，可在大多数 Linux 平台上使用。Podman 提供与 Docker 非常相似的功能。正如前面提到的那样，它不需要在你的系统上运行任何守护进程，并且它也可以在没有 root 权限的情况下运行。

Podman 可以管理和运行任何符合 OCI（Open Container Initiative）规范的容器和容器镜像。Podman 提供了一个与 Docker 兼容的命令行前端来管理 Docker 镜像。

Podman 官网地址：[https://podman.io/](https://link.zhihu.com/?target=https%3A//podman.io/)

## 对比Docker

:::tip

podman的定位也是与docker兼容，因此在使用上面尽量靠近docker。

:::

- dockers在实现CRI的时候，它需要一个守护进程，其次需要以root运行，因此这也带来了安全隐患。
- podman不需要守护程序，也不需要root用户运行，从逻辑架构上，比docker更加合理。
- 在docker的运行体系中，需要多个daemon才能调用到OCI的实现RunC。
- 在容器管理的链路中，Docker Engine的实现就是dockerd
- daemon，它在linux中需要以root运行，dockerd调用containerd，containerd调用containerd-shim，然后才能调用runC。顾名思义shim起的作用也就是“垫片”，避免父进程退出影响容器的运训
- podman直接调用OCI,runtime（runC），通过common作为容器进程的管理工具，但不需要dockerd这种以root身份运行的守护进程。
- 在podman体系中，有个称之为common的守护进程，其运行路径通常是/usr/libexec/podman/conmon，它是各个容器进程的父进程，每个容器各有一个，common的父则通常是1号进程。podman中的common其实相当于docker体系中的containerd-shim。

## 常用命令

容器

```shell
podman run         #创建并启动容器
podman start       #启动容器
podman ps          #查看容器
podman stop        #终止容器
podman restart     #重启容器
podman attach      #进入容器
podman exec        #进入容器
podman export      #导出容器
podman import      #导入容器快照
podman rm          #删除容器
podman logs        #查看日志
```

镜像

```shell
podman search             #检索镜像
docke pull                #获取镜像
podman images             #列出镜像
podman image Is           #列出镜像
podman rmi                #删除镜像
podman image rm           #删除镜像
podman save               #导出镜像
podman load               #导入镜像
podmanfile                #定制镜像（三个）
podman build              #构建镜像
podman run                #运行镜像
```

## 参考资料

Docker 大势已去，Podman 即将崛起！：https://zhuanlan.zhihu.com/p/449364769
