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
filename: jenkins
slug: fca8wd
docsId: '30338401'
---

## 概述
Jenkins 是一款流行的开源持续集成（CI）与持续部署（CD）工具，用于自动化各种任务，包括构建、测试和部署软件。

## 构建任务

#### 流水线Pipeline
 一套运行于Jenkins上的工作流框架，将原本独立运行于单个或者多个节点的任务连接起来，实现单个任务难以完成的**复杂流程编排与可视化**。

- _**Stage**_: 阶段，一个Pipeline可以划分为若干个Stage，每个Stage代表一组操作。注意，Stage是一个逻辑分组的概念，可以跨多个Node。如上图所示，Build，Test和Deploy就是Stage，代表了三个不同的阶段：编译、测试和部署。
- _**Node**_: 节点，一个Node就是一个Jenkins节点，或者是Master，或者是Slave，是执行Step的具体运行期环境。
- _**Step**_: 步骤，Step是最基本的操作单元，小到创建一个目录，大到构建一个Docker镜像，由各类Jenkins Plugin提供。

## 部署服务
在Linux下，SSH服务默认会安装，而在Windows Server下，需要单独安装，可以借助FreeSSHD这个免费工具来实现。由于我的物理机都是Windows Server，物理机上的VM是Linux（Docker运行环境），所以需要给物理机配置FreeSSHD，用来实现从CI服务器发布Release到物理服务器中的VM。

### 变量的使用方法
下面的环境变量可以在配置Jenkins Job的时候用得到，可以用在Execute shell、Execute Windows batch command、文本框 上加上编辑好的的shell脚本
```
Windows：%BUILD_NUMBER%        %变量名%
Linux：${BUILD_NUMBER} ，也可以直接使用$BUILD_NUMBER
```
倘若是自己定义的参数化（Parameter）在调用时可以直接 用 $参数名，比如调用这个时直接 $endPoint

### 参考文档
使用教程：[https://www.cnblogs.com/edisonchou/p/edc_aspnetcore_jenkins_pipeline_introduction.html](https://www.cnblogs.com/edisonchou/p/edc_aspnetcore_jenkins_pipeline_introduction.html)
k8s+Jenkins+GitLab-自动化部署项目：[https://www.cnblogs.com/shawhe/p/11313633.html](https://www.cnblogs.com/shawhe/p/11313633.html)

