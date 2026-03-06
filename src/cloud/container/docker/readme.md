---
title: 说明
lang: zh-CN
date: 2023-09-24
publish: true
author: azrng
isOriginal: true
category:
  - cloud
tag:
  - 无
filename: docker
slug: iq7ndi
docsId: '29454276'
---

## 概述
**Docker 是一个开源的应用容器引擎，是用Go语言开发的**。用于开发、交付和运行应用程序的开放平台，能够将应用程序与基础设施分开，从而可以快速交付软件。

看看Docker 的Logo图

![image-20230924163836131](/common/image-20230924163836131.png)

Docker就好比是下面的小鲸鱼，上面装满的每个集装箱(方块)可以理解为容器，不管集装箱里面装的什么，统一按集装箱的形式打包存放、运输即可，集装箱之间互不影响；即Docker不在乎容器里的内容是什么，**统一基于容器这种形式进行标准化管理，容器之间相互隔离**，所以Docker上运行的多个容器是相互不影响的。

Docker 从 17.03 版本之后分为 CE（Community Edition: 社区版） 和 EE（Enterprise Edition: 企业版），通常社区版足够用了，功能强大，还免费。

> Docker在线学习版：[https://labs.play-with-docker.com/](https://labs.play-with-docker.com/)
> 书籍推荐：[https://www.cnblogs.com/Can-daydayup/p/15585714.html](https://www.cnblogs.com/Can-daydayup/p/15585714.html)


## 为什么使用
可以将项目定制为镜像，实现一个一个镜像多服务器进行部署，并且保证服务部署环境一致。
docker相比传统的虚拟化技术来说不需要完整的操作系统，可以理解为进程级别的，在同等的情况下可以对系统资源更好的利用。
docker使用非常简单，可以通过一个命令就可以运行起来服务，使得这项技术更加流行。

## Docker架构

![图片](/common/202212111144122.webp)Docker Architecture Diagram

**Docker是客户端/服务器模式架构(C/S)，Client(客户端)和Docker daemon(守护进程)通信， 后者接收到客户端指令并执行**。简述上图的三个流程：

- **客户端(Client)** 发送**docker build**指令， **服务端(Docker daemon)** 收到指令之后就执行，将对应文件打包生成为**镜像(Images)** ；
- **客户端(Client)** 发送**docker pull**指令，**服务端(Docker daemon)** 收到指令之后就执行，从**远程仓储中(Registry)** 寻找**镜像(Images)** ，并**下载到Docker主机上(DOCKER_HOST)** ，如果找不到就报错；
- **客户端(Client)** 发送**docker run**指令，**服务端(Docker daemon)** 收到指令之后就执行，先从本地查找**镜像(Images)** ，如果本地存在，直接通过镜像启动**容器(Containers)** 实例；如果本地没有镜像(Images)，就会从远程仓储中(Registry)下载，然后再根据镜像启动**容器(Containers)** 实例，如果都没找到，那就报错。

上面只是用三关键指令大概描述了从客户端到服务端的执行流程，其实还有很多指令，后续会专门整理文章分享。

上图术语解释及作用：

- **Docker daemon(守护进程)** ：负责监听客户端发过来的指令请求，并管理Docker的各种对象，如镜像(Images)、容器(Containers)、网络等。
- **Client(客户端)** ：用户和Docker主机交互的主要方式，就是用来发指令请求的。
- **远程仓储(Registry)** ：用于各种镜像的存储，**Docker Hub是最大的镜像存储库**，基本上平时能用到的镜像都可以找到；为了提升拉取速度，可以指定国内的一些仓储。
- **镜像(Images)** ：是一个启动**容器(Containers)** 的只读模板；比较容易理解的比喻：镜像就是编程语言中的类(Class)，容器就是通过类(Class) new出来的实例。
- **容器(Containers)** ：就是**镜像(Images)** 可运行的实例。

## Docker带来的好处

- **开发更加敏捷：** 让开发人员可以自由定义环境，创建和部署的应用程序更快、更容易，运维人员快速应对变化也更加灵活性。
- **高可移植性和扩展性：** Docker容器可以运行在各种设备环境中，如开发电脑、虚拟机、服务器上等；根据业务需求，可实时扩展或拆除应用程序及相关服务；
- **充分利用硬件资源**：Docker轻量级、启动快，能共用公共服务，不像传统的虚拟机那样，需要单独虚拟出整个系统，占用资源多，速度还不够快。Docker容器之间相互隔离，互不冲突，所以同时可运行很多个容器，充分利用资源。

理论先说那么多，主要是实操应用，用明白了，理论自然就清晰了。

## 使用场景

- 应用的自动化打包和发布
- 自动化测试和持续集成、发布
- 在服务型环境中部署和调整数据库或其他应用

## Docker如何工作
Docker是一个Client-Server结构，Docker守护进程运行在主机上，客户端与Dcoker通过Socket访问，守护进程接收客户端的命令并且管理运行主机的容器，容器是一个运行环境，就是我们的集装箱；
![](/common/1625063803946-e1d4a28e-75d1-414b-8573-fc675196e9e7.png)

## DockerUI

DockerUI是一个易于使用且轻量级的Docker管理工具。通过Web界面的操作，可以更方便地让不熟悉Docker指令的用户更快地进入Docker世界。DockerUI覆盖了Docker CLI命令行的95％以上的命令功能。通过DockerUI界面提供的可视化操作功能，可以轻松执行Docker环境和Docker Swarm群集环境的管理和维护功能。

下载地址：https://github.com/gohutool/docker.ui

## 参考文档

官网：[https://docs.docker.com/](https://docs.docker.com/)
docker入门到实践：[https://yeasy.gitbook.io/docker_practice/](https://yeasy.gitbook.io/docker_practice/)
阮一峰教程：[http://www.ruanyifeng.com/blog/2018/02/docker-tutorial.html](http://www.ruanyifeng.com/blog/2018/02/docker-tutorial.html)
雪雁docker详细教程：[https://www.cnblogs.com/codelove/tag/Docker/default.html](https://www.cnblogs.com/codelove/tag/Docker/default.html)
既然遇见不如同行：[https://mp.weixin.qq.com/s/h_AhphgyxWZ8RiE67LpIWw](https://mp.weixin.qq.com/s/h_AhphgyxWZ8RiE67LpIWw)

## 扩展
> [https://mp.weixin.qq.com/s/b7eA_54PWrYB2CukVuDVkg](https://mp.weixin.qq.com/s/b7eA_54PWrYB2CukVuDVkg) | 项目小结：使用Docker迁移服务到离线服务器

