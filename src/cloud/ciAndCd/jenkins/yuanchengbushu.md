---
title: 远程部署
lang: zh-CN
date: 2021-05-17
publish: true
author: azrng
isOriginal: true
category:
  - cloud
tag:
  - 无
filename: yuanchengbushu
slug: yi665u
docsId: '30630349'
---

### 配置远程服务器
进入到”Manage Jenkins“ - "Configure System"中配置远程服务器
![](/common/1611562321669-ab5bec14-7a76-436b-9ddd-c1a932e7a1e7.png)
Passphrase：SSH密码
Path to key：SSH私钥的文件路径
Key：私钥串，如果“Key”和“Path to key”都设置，则“Key”的优先级较高
Disable exec：禁止在目标机上执行命令
SSH Server 配置（指定远程服务器的ip，可以配置多个ssh server ）
Name：SSH节点配置的名称，在Job中使用Publish over SSH插件时，此名称将出现在“SSH Server”中“Name”的下拉列表中，如下图：
Hostname：通过SSH连接到的远程主机名或IP
Username：SSH服务使用的用户名，使用key进行连接时为key指定的用户名
> 没有找到的话安装插件：Publish Over SSH


### 构建
执行命令
```csharp
#!/bin/bash

#定义变量
IMAGE_VERSION='1.0.0'
REGISTRY_USER='itzhangyunpeng'
REGISTRY_PWD='zypnlzq123'
REGISTRY_HOST='registry.cn-hangzhou.aliyuncs.com'
REGISTRY_NAMESPACE='zrng'
SERVICE_HELLOWORLD='mytest'
#jenkins拉取的项目默认路径 
COMPOSE_PATH='build/docker-compose.yaml'

echo "------------------------------ 构建镜像 ------------------------------"
docker-compose -f "${COMPOSE_PATH}" build

echo "------------------------------ 登录远程仓库 ------------------------------"
docker login --username=${REGISTRY_USER} --password=${REGISTRY_PWD} ${REGISTRY_HOST}

echo "------------------------------ 标记镜像 ------------------------------"
docker ${REGISTRY_HOST}/${REGISTRY_NAMESPACE}/${SERVICE_HELLOWORLD}:latest ${REGISTRY_HOST}/${REGISTRY_NAMESPACE}/${SERVICE_HELLOWORLD}:latest
docker ${REGISTRY_HOST}/${REGISTRY_NAMESPACE}/${SERVICE_HELLOWORLD}:${IMAGE_VERSION} ${REGISTRY_HOST}/${REGISTRY_NAMESPACE}/${SERVICE_HELLOWORLD}:${IMAGE_VERSION}

echo "------------------------------ 推送到远程仓库 ------------------------------"
docker push ${REGISTRY_HOST}/${REGISTRY_NAMESPACE}/${SERVICE_HELLOWORLD}:latest
docker push ${REGISTRY_HOST}/${REGISTRY_NAMESPACE}/${SERVICE_HELLOWORLD}:${IMAGE_VERSION}

echo "------------------------------ 清理None ------------------------------"
docker rmi $(docker images -f "dangling=true" -q)
```

### 增加构建步骤
选择“Send files or execute commands over SSH”
![](/common/1611562405578-9f181a27-d9d7-401b-9513-78226caca71d.png)
Name：选择刚刚配置的远程服务器”Staging_Server“
Source files：要上传的文件的相对路径，多个文件以逗号分隔。相对workspace的路径(其实是相对workspace下项目的路径)，也支持表达式，如上图中的“**/*.war”。
 如：我的项目通过jenkins git插件拉取下来，所在的目录是D:\Program Files (x86)\Jenkins\workspace\helloworld，docker-compose.staging.yml刚好在hellworld目录下，所以此处直接填文件名
        如果yml文件在hellowrold/mycompose/目录下，则需要填写mycompose/docker-compose.staging.yml
Remove prefix：文件复制时要过滤的文件夹。
Remote directory：远程服务器上的文件夹，此文件夹路径是相对于“SSH Server”中的“Remote directory”。如果该文件夹不存在将会自动创建。
        由于配置Staging_Server时Remote directory没有设置，并且时直接使用root账户登录Staging_Server的，所以Remote directory路径默认为root/
        此处填/mydokcercompose，则文件会被复制到服务器的/root/mydokcercompose/docker-compose.staging.yml
Exec command：shell命令
```csharp
#!/bin/bash

#定义变量
REGISTRY_USER='itzhangyunpeng'
REGISTRY_PWD='zyp4574q123'
REGISTRY_HOST='registry.cn-hangzhou.aliyuncs.com'
COMPOSE_PATH='mytest/docker-compose.yaml'

echo ------------------------------ 登录远程仓库 ------------------------------
docker login --username=$REGISTRY_USER --password=$REGISTRY_PWD $REGISTRY_HOST

echo ------------------------------ 卸载服务 ------------------------------
docker-compose -f $COMPOSE_PATH down

echo ------------------------------ 拉取镜像 ------------------------------
docker-compose -f $COMPOSE_PATH pull

echo ------------------------------ 启动服务 ------------------------------
docker-compose -f  mytest/docker-compose.yaml up --build -d

echo ------------------------------ 清除None ------------------------------
docker rmi $(docker images -f "dangling=true" -q)
    
或者直接使用docker run
docker run --name mytest -d -p 8011:80 registry.cn-hangzhou.aliyuncs.com/zrng/mytest:1.0.0

docker-compose那个方法没试验成功，直接使用docker成功了
```
然后在另一个机器上可以看到生成的容器

> 参考文档：[https://www.cnblogs.com/yanglang/articles/11088490.html](https://www.cnblogs.com/yanglang/articles/11088490.html)

