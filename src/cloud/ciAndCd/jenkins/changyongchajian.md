---
title: 常用插件
lang: zh-CN
date: 2021-06-26
publish: true
author: azrng
isOriginal: true
category:
  - cloud
tag:
  - 无
filename: changyongchajian
slug: lc7zs4
docsId: '30369096'
---

## 镜像
Role-based Authorization Strategy jenkins是通过插件对用户的权限进行控制的　　

部署插件
Generic WebHook Trigger => 触发WebHook必备
Gogs Plugin => 因为我使用的Git Server是Gogs搭建的
gitlab=》gitlab支持插件
Gitee=》Gitee使用的插件
MSBuild Plugin/MSBuild => 进行sln、csproj项目文件的编译
MSTest & xUnit => 进行基于MSTest或基于xUnit的单元测试
Nuget Plugin => 拉取Nuget包必备
Pipeline => 实现Pipeline任务必备，建议将Pipeline相关插件都安装上
Powershell Plugin => 如果你的CI服务器是基于Windows的，那么安装一下Powershell插件来执行命令吧
WallDisplay => 电视投屏构建任务列表必备
Git Parameter=>参数化分支构建可以选择不同的分支进行自动化部署

### Publish Over SSH
远程发布Release必备
![](/common/1611561458149-4b924283-86c8-423a-ab09-f721a8a61fbf.png)

Passphrase：SSH密码
Path to key：SSH私钥的文件路径
Key：私钥串，如果“Key”和“Path to key”都设置，则“Key”的优先级较高
Disable exec：禁止在目标机上执行命令
SSH Server 配置（指定远程服务器的ip，可以配置多个ssh server ）
Name：SSH节点配置的名称，在Job中使用Publish over SSH插件时，此名称将出现在“SSH Server”中“Name”的下拉列表中，如下图：
Hostname：通过SSH连接到的远程主机名或IP
Username：SSH服务使用的用户名，使用key进行连接时为key指定的用户名

### Docker Compose Build Step Plugin
构建的时候出来docker-compose选项
![image.png](/common/1611537637247-5f5aa764-7b56-4fa6-9377-26938a4c05a8.png)
构建时候生成的命令是：
```csharp
docker-compose -f /var/jenkins_home/workspace/测试/build/docker-compose.yaml up -d
```

Docker build step=>自动化管理docker

部署远程服务
Publish over SSH


## 插件镜像
```csharp
清华软件镜像站
https://mirrors.tuna.tsinghua.edu.cn/jenkins/updates/update-center.json
```
