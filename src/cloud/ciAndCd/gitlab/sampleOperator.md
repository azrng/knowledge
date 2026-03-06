---
title: 简单操作
lang: zh-CN
date: 2022-11-27
publish: true
author: azrng
isOriginal: true
category:
  - cloud
tag:
  - 无
filename: jianchanbushu
slug: kt0nof
docsId: '52858788'
---

## 目的
我们要实现的目的是我本地不断提交代码(CI),然后服务器不断进行部署(CD)的一个简单流程。

## 环境准备

Ubuntu服务器A：已经安装了docker，并使用docker部署了gitlab

服务器B：已经安装了docker

## Gitlab检查

这里我们来检查一下Gitlab是否运行正常，这里我访问我服务器A地址：http://192.168.137.125:9006

![image-20240421221535572](/dotnet/image-20240421221535572.png)

登录然后创建一个项目，用于我们测试自动部署的流程

### 创建项目

直接开始创建项目 

![image.png](/common/1669531947826-e0a4440d-3a42.png)

拉取项目并填充内容  

![image-20240421223806666](/dotnet/image-20240421223806666.png)   

拷贝一个简单[示例项目](https://gitee.com/AZRNG/my-example/tree/9e720cad80eb1bb46816cdaa7b5f217692bfd256/)提交到gitlab上  

![image.png](/common/1669532487711-64968ba4-12f3.png)

## 服务部署服务器

### 安装gitlab-runner

在要部署服务的服务器上gitlab-runner，本次安装直接安装在服务器中，不使用docker安装gitlab-runner，避免产生Dind(docker in docker)问题。[官网安装资料](https://docs.gitlab.com/runner/install/linux-repository.html)

首先导入repository，这里我部署在Ubuntu，然后直接采用第一个链接即可

```bash
# 对于 Debian/Ubuntu/Mint 
curl -L "https://packages.gitlab.com/install/repositories/runner/gitlab-runner/script.deb.sh" | sudo bash

# 对于 RHEL/CentOS/Fedora
curl -L "https://packages.gitlab.com/install/repositories/runner/gitlab-runner/script.rpm.sh" | sudo bash
```
![image.png](/common/1631024347306-6cb8d6a8-0f4e-4422-9fcf-cefc50c57988.png)
开始安装gitlab-runner

```shell
# 对于 Debian/Ubuntu/Mint
sudo apt-get install gitlab-runner -y
sudo apt-get install gitlab-runner --user=root # 以root用户安装

# 对于 RHEL/CentOS/Fedora
sudo yum install gitlab-runner -y
```
![image.png](/common/1669534749945-a3c326b9-0c5e-476f-a677-d3ffa2822908.png)

### Runner注册到Gitlab

#### 单独仓库设置Runner

在我们要部署的仓库里面找到Runner配置信息(设置=>CI/CD)

![image-20240421225548372](/dotnet/image-20240421225548372.png)

输入命令进行注册

```shell
sudo gitlab-runner register
```

![image-20240421224837038](/cloud/image-20240421224837038.png)

* 输入Gitlab地址
* 输入注册token
* 输入说明
* 输入tags
* 输入注意事项
* 输入执行者，这里我使用shell

> 执行者参考：[https://docs.gitlab.com/runner/executors/index.html](https://docs.gitlab.com/runner/executors/index.html)

然后就可以在仓库的配置下可以看到我们注册的东西

![image-20240421225902231](/dotnet/image-20240421225902231.png)

#### 注册群组Runner

:::tip

如果需要注册群组的可以看这里，不想注册群组的Runner可以跳过

:::

![img](/cloud/1725717770052-da6f0d03-549e-4270-a74b-5eb18dde4140.png)

下面就有文档步骤了，按照文档操作

![img](/cloud/1725713703216-9af83f33-b7d4-4746-9088-626f32e8858f.png)

在之前我们已经安装过Runner，所以这里直接拷贝文档上的命令去安装Runner的服务器上执行即可

![img](/cloud/1725713918373-e0b04224-6584-4ecb-8394-8739f2cb9e8b.png)

### Runner命令

```shell
# 此命令列出了保存在配置文件中的所有运行程序
sudo gitlab-runner list      

# 检查注册的 runner 是否可以连接，但不验证 GitLab 服务是否正在使用 runner。--delete 删除
sudo gitlab-runner verify    

# 该命令使用 GitLab 取消已注册的 runner。
sudo gitlab-runner unregister
# 使用名称注销（同名删除第一个）
sudo gitlab-runner unregister --name test-runner
# 注销所有
sudo gitlab-runner unregister --all-runners

sudo gitlab-runner restart
sudo gitlab-runner stop
sudo gitlab-runner status

sudo cat /etc/gitlab-runner/config.toml 
```

### 配置帐号(可选)
添加gitlab-runner用户
```
sudo adduser gitlab-runner
```
将该用户添加到docker组中
```
sudo gpasswd -a gitlab-runner docker
```
查看docker组是否已经添加用户成功
```
cat /etc/group |grep docker
```
验证是否可以通过gitlab-runner访问docker
```
sudo -u gitlab-runner -H docker info
```
重启docker容器服务
```
sudo systemctl restart docker
```
给docker.sock设置权限
```
sudo chmod a+rw /var/run/docker.sock
```
![image.png](/common/1630853106274-e18c02ab-fb18-485e-8d50-16b05cff1f51.png)

## 配置流水线

### Pipeline核心语法

再pipeline语法中，最主要的有三个部分，分别是stages阶段控制、variables环境变量、Job任务三部分。

#### stages阶段控制

再gitlab中，一共分为三个阶段，分别是开始时阶段、自定义阶段和结束时阶段三个阶段。

- .pre阶段的作业总是再流水线开始时执行；
- .post阶段的作业总是在流水线结束时执行;
- 自定义阶段

### 示例

CI/CD是gitlab提供的一套持续集成、持续交付的解决方案。每个项目中如需接入CI/CD，则需在项目根目录配置名为.gitlab-ci.yml的YML文件。
```yaml
# .gitlab-ci.yml

stages:
  - build
  - deploy
  
# start:
#   stage: .pre
#   script:
#     - echo "开始阶段"
#   tags:
#     - build
  
build:
  stage: build
  script:
    - ls
    - docker-compose up -d --build
  tags:
    - dotnet

# test:
#   stage: test
#   script:
#     - echo "Test阶段"
#   tags:
#     - build

deploy:
  stage: deploy
  script:
    - docker ps -a
  tags:
    - dotnet
    
# end:
#   stage: .post
#   script:
#     - echo "结束阶段"
#   tags:
#     - build
```
提交推送代码，然后在gitlab的CI/CD=>Pipeliners查看 

![image-20240908150552108](/cloud/image-20240908150552108.png)

查看详细信息  

![image.png](/common/1630853156788-69b4bfb8-dec8-436d-a9ff-78be35be0724.png)

部署成功，进入该服务器查看容器信息  

![image.png](/common/1669540260122-0be4c35e-a786-4ad2-aa53-4592b3a8a740.png)

通过外部访问服务：`http://IP:8060/swagger/index.html`  成功显示swagger界面，部署成功。

## 参考文档

[GitLab 自带的 CI/CD 实现 .NET Core 应用程序的部署](https://mp.weixin.qq.com/s/h3W7ltj4xl1tzDEia_xCag)

[gitlab+docker+gitlab-runner自动化部署.net core](https://mp.weixin.qq.com/s/h3W7ltj4xl1tzDEia_xCag)

[Gitlab-runner部署和使用详解 ](https://www.cnblogs.com/kzk520/articles/18377770)

