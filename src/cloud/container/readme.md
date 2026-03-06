---
title: 容器
lang: zh-CN
date: 2021-05-17
publish: true
author: azrng
isOriginal: true
category:
  - cloud
tag:
  - 无
filename: readme
slug: feic6p
docsId: '29454085'
---
## 说明

容器的本质是一个进程，进程与进程之前的相互隔离就造成了容器与容器的相互不影响的特性。将集装箱的思想应用到了软件的打包和部署上，为不同的代码提供了基于容器标准化运输系统。

思想：
集装箱：会将所有需要的内容放到不同的集装箱中，谁需要这些环境就直接拿到
这个集装箱就可以了
标准化：1.运输的标准化2.命令的标准化3.提供的rrest的api
隔离化：docker在运行集装箱内的内容时候，会在linux的内核中，单独的开辟一片

 


比较出名的有： Containerd 和 Podman 和Docker

##  镜像仓库

[https://hub.docker.com](https://hub.docker.com)

代理地址：[https://dockerproxy.com/](https://dockerproxy.com/)

###  私有镜像仓库

* Harbor
  * 安装文档：[https://mp.weixin.qq.com/s/QVsOsG9dewX03QXbj2Ufrw](https://mp.weixin.qq.com/s/QVsOsG9dewX03QXbj2Ufrw)


## 虚拟机对比容器

虚拟机：主要是由硬件虚拟化+内核虚拟化技术来实现，它在宿主机操作系统或硬件层的基础之上引入一层Hypervisor来虚拟出磁盘、CPU等资源，然后在虚拟出来的资源的基础之上运行Guest OS进而实现最终的虚拟机。

容器：直接在宿主机操作系统之上构建一个Docker Engine，共享宿主机操作系统内核，在此基础之上只引入了少量的Guest OS来实现。
对比：
（1）虚拟机的隔离性比容器好，因为虚拟机是一种强隔离机制；
（2）虚拟机比较重量级，启动时速度比较慢，消耗资源也比较多；
（3）容器的隔离性不如虚拟机，它是一种软件隔离机制，但它比较轻量级，引入的东西较少，所以速度快消耗资源少；因此，在同一个物理机上能够启动的容器的数量远远多于虚拟机的数量；

## 镜像和容器

linux的内核相当于地0层，那么docker是运行在内核上面的，位于第1层，一个镜像可以构建与另一个docker镜像上，第一层的镜像我们可以理解为基础镜像，其他层的镜像我们称为父层镜像，这些镜像继承了父层镜像的属性和设置，并在dockerfile里面添加了自己的配置

docker通过镜像id来进行识别，镜像id是一个64位的十六进制的字符串，一般运行镜像，我们是通过镜像名来引用的。

docker容器通过docker镜像来创建

容器与镜像的关系类似于面向对象编程中的对象与类。

## 容器管理工具

### Docker Desktop

### Podman Desktop

###  Container Desktop

地址：https://github.com/iongion/container-desktop

https://mp.weixin.qq.com/s/Q6d_nw2bwqiw7qSxmDDDtg | 一个超级牛皮的容器管理工具Container Desktop

## 资料

官网：[https://docs.docker.com/](https://docs.docker.com/)
从入门到实践：[https://yeasy.gitbook.io/docker_practice/](https://yeasy.gitbook.io/docker_practice/)
docker入门教程： [https://www.cnblogs.com/ityouknow/p/8520296.html](https://www.cnblogs.com/ityouknow/p/8520296.html)
netcore on k8s系列文章  [https://www.cnblogs.com/edisonchou/p/aspnet_core_k8s_artcles_index.html](https://www.cnblogs.com/edisonchou/p/aspnet_core_k8s_artcles_index.html)
docker-compose  [此处](https://mp.weixin.qq.com/s?__biz=MzAwMzM2MjU4MQ==&mid=2247484126&idx=2&sn=c7c16ce36c3da7dad9f65189e0f76801&chksm=9b3d18a4ac4a91b2040b3e61067173799c3a36d54704c565e61ca385a95f6ee442faf5e773b6&mpshare=1&scene=1&srcid=&sharer_sharetime=1588806494793&sharer_shareid=b24b68115bb61d7d2faf0d3d81a3e656&key=6f25b447608369f0781636534f4cc4af9af5db2e7397592b6a1a731c5008a9603ea1d1ddf06f0b623790b74500dd1753a678406542c6786a6c92ac8117b40aec775522ad549035cee8ba38d9c1ad7d73&ascene=1&uin=MzE1MjEyNzg0OQ%3D%3D&devicetype=Windows+10+x64&version=62090072&lang=zh_CN&exportkey=A%2B4BvwC3Pt6bM1NWwGTUUxA%3D&pass_ticket=sP%2FI4qmJbQKHOCWKyFHB1IKSnTPOmcp3L0O%2FsQQak%2FA1EUhuhyEle9zGCjw3wI1e)
docker部署 [https://www.cnblogs.com/savorboard/p/dotnetcore-docker.html](https://www.cnblogs.com/savorboard/p/dotnetcore-docker.html)
Netcore devops [https://www.cnblogs.com/stulzq/p/8629165.html](https://www.cnblogs.com/stulzq/p/8629165.html)

