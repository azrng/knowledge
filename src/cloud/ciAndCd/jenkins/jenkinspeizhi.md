---
title: Jenkins配置
lang: zh-CN
date: 2023-09-24
publish: true
author: azrng
isOriginal: true
category:
  - cloud
tag:
  - 无
filename: jenkinspeizhi
slug: rukx8t
docsId: '30650408'
---

### 构建触发器

#### 轮询SCM
轮询远程仓库有代码变更就进行构建
```csharp
H/2 * * * *  
```
> 两分钟执行部署一次(只有在有提交的情况下才能执行)


### 构建环境

- Delete workspace before build starts：构建前删除工作空间
- Abort the build if it's stuck：设定构建的超时时间，如果构建使用的时候超过设定的时间，那么就认为构建失败。

### 构建

#### 执行shell
```csharp
docker-compose -f build/docker-compose.yaml up --build -d
```

#### Docker Compose Build Step
![image.png](/common/1611537637247-5f5aa764-7b56-4fa6-9377-26938a4c05a8.png)
构建时候生成的命令是：
```csharp
docker-compose -f /var/jenkins_home/workspace/测试/build/docker-compose.yaml up -d
```
> 注意：这种方式不会重新发布项目，只是up文件，适用于修改docker-compose配置文件时候使用。


### Windows PowerShell
```csharp
#定义变量
$IMAGE_VERSION='latest'
$REGISTRY_USER='镜像仓库账号'
$REGISTRY_PWD='镜像仓库密码'
$REGISTRY_HOST='ccr.ccs.tencentyun.com'
$REGISTRY_NAMESPACE='镜像仓库namespace'
$SERVICE_HELLOWORLD='helloworld'
$SERVICE_MYNGINX='mynginx'
#jenkins拉取的项目默认路径 “安装路径根目录/workspace/jenkins里面建的项目名”
$COMPOSE_PATH='D:\Program Files (x86)\Jenkins\workspace\helloworld\docker-compose.yml'

echo "------------------------------ 构建镜像 ------------------------------"
docker-compose -f "${COMPOSE_PATH}" build

echo "------------------------------ 登录远程仓库 ------------------------------"
docker login --username=${REGISTRY_USER} --password=${REGISTRY_PWD} ${REGISTRY_HOST}

echo "------------------------------ 标记镜像 ------------------------------"
docker tag ${SERVICE_HELLOWORLD}:${IMAGE_VERSION} ${REGISTRY_HOST}/${REGISTRY_NAMESPACE}/${SERVICE_HELLOWORLD}:${IMAGE_VERSION}
docker tag ${SERVICE_MYNGINX}:${IMAGE_VERSION} ${REGISTRY_HOST}/${REGISTRY_NAMESPACE}/${SERVICE_MYNGINX}:${IMAGE_VERSION}

echo "------------------------------ 推送到远程仓库 ------------------------------"
docker push ${REGISTRY_HOST}/${REGISTRY_NAMESPACE}/${SERVICE_HELLOWORLD}:${IMAGE_VERSION}
docker push ${REGISTRY_HOST}/${REGISTRY_NAMESPACE}/${SERVICE_MYNGINX}:${IMAGE_VERSION}

echo "------------------------------ 清理None ------------------------------"
docker rmi $(docker images -f "dangling=true" -q)
```
