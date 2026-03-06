---
title: docker部署包含net环境jenkins
lang: zh-CN
date: 2022-08-17
publish: true
author: azrng
isOriginal: true
category:
  - cloud
tag:
  - 无
filename: dockerInstallContainsDotNet
slug: ri6zt6
docsId: '30400490'
---
> 该方法部署的jenkins包含netcore环境，并且包含如何部署netcore


### 1. 更新系统
> yum update


### 2. 安装docker
这里就不安装了

### 3. 安装jenkins

#### 3.1 检索jenkins镜像
> docker search jenkins


#### 3.2制作包含dotnet环境的jenkins的docker的容器
创建dockerfile
```dockerfile
FROM jenkins/jenkins

## Switch to root to install .NET Core SDK
USER root

## Show distro information!
RUN uname -a && cat /etc/*release

## Based on instructiions at https://www.microsoft.com/net/download/linux-package-manager/debian9/sdk-current
## Install dependency for .NET Core 3
RUN apt-get update
RUN apt-get install -y curl libunwind8 gettext apt-transport-https

## Based on instructions at https://www.microsoft.com/net/download/linux-package-manager/debian9/sdk-current
## Install microsoft.qpg
RUN curl https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > microsoft.gpg
RUN mv microsoft.gpg /etc/apt/trusted.gpg.d/microsoft.gpg
RUN sh -c 'echo "deb [arch=amd64] https://packages.microsoft.com/repos/microsoft-debian-stretch-prod stretch main" > /etc/apt/sources.list.d/dotnetdev.list'

## Install the .NET Core framework
RUN apt-get update
RUN apt-get install -y dotnet-sdk-3.1

## Switch back to the jenkins user.
USER jenkins
```
根据这个Dockerfile来构建一个新的镜像
> docker build -t my-docker-jenk .


#### 3.3 生成容器示例

##### 3.3.1 创建jenkins的工作目录
```csharp
//创建工作目录 
mkdir /home/jenkins_home

//赋予权限 
chown -R 1000 /home/jenkins_home
```

##### 3.3.2 生成容器
> docker run -d --name jenkins_01 -p 80:8080 -v /home/jenkins_01:/home/jenkins_01 my-docker-jenk

Jenkins默认的开放容器端口是8080和50000，但是你可以自定义宿主机的监听端口，比如我 这里就直接80端口了。

### 4. 访问jenkins网站
![image.png](/common/1611106025062-d5831aff-0228-44e2-9aed-c3b235645694.png)

#### 4.1 寻找超级管理员密码
进入容器，然后去容器的执行目录下查找管理员的密码
```csharp
// 进入容器 
docker exec -it 容器ID bash 
// 查看密码 
cat /var/jenkins_home/secrets/initialAdminPassword
```
输入找到的管理员密码然后进入系统

#### 4.2 进入jenkins
新手入门，选择安装插件的方式，这里我们直接选择安装推荐的插件然后进入系统
注意：安装插件报错的话继续在执行一遍。

#### 4.3 设置管理员用户密码
创建管理员用户密码

#### 4.4 系统界面
如果系统管理里面有错误，那么我们可以手动安装和修改。

### 5. 部署net程序

#### 5.1 创建任务

##### 5.1.1 选择自由风格的软件项目
![image.png](/common/1611106307255-ac3999ac-60b4-4f11-b263-93a4c52d6c37.png)

##### 5.1.2 添加源代码管理
在源码管理里面勾兑Git，然后输入仓库地址，添加你仓库对应的用户名和密码并且执行分支

##### 5.1.3 构建命令
选择执行shell脚本
```bash
dotnet restore
dotnet build
dotnet publish
```
保存，选择立即构建。
构建历史的构建状态变为蓝色，则代表构建成功；红色代表构建失败。

### 6. 错误
如果出现错误，那么就需要去查看控制台输出，根据错误找原因。





















