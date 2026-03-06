---
title: docker部署netcore
lang: zh-CN
date: 2023-05-19
publish: true
author: azrng
isOriginal: true
category:
  - cloud
tag:
  - 无
filename: dockerbushunetcore
slug: pg2s18
docsId: '29455009'
---

### 增加dockerfile
将写好的项目增加dockerfile文件，可以通过右键添加docker支持方式增加，然后发布弄到服务器

### 生成自定义镜像
在打包的项目目录下执行
命令：docker build -t 镜像名称:版本 .  后面有一个.标识是当前目录
示例：docker build -t booklibrary:1.0 .（结尾有一个点，代表在当前文件夹中查找dockerfile）
或者：docker build -t booklibrary . 

#### 查看镜像
命令：docker images

#### 删除镜像
命令：docker rmi 镜像id 

#### 生成容器
命令：docker run --name 名称-d-p 
示例：docker run --name booklibrary -d -p 103:8080 booklibrary:1.0
或者：docker run -it -p 103:8080 booklibrary
或者：docker run -p 103:8080 boklibrary
> 端口分别是：宿主机和容器的映射，前一个是在外部访问的端口号，后一个是要映射到docker容器的端口号，切记和我们在Dockerfile中暴露出来的端口号保持一致。


#### 查看当前的容器
命令：docker ps -a
![image.png](/common/1609562125324-5df8df95-5306-45a3-9aff-255f1e492115.png)

启动容器
命令：docker start 容器id/容器名称
停止容器
命令：docker stop 容器id/容器名称
然后查看状态docker ps -a
进入容器
命令：docker exec -it 容器名称 bash

> 如果docker run失败后再次运行会提示名称已经存在，可以使用下面命令来删除容器
> 命令：docker rm -f [dockername]

> 如果想要docker容器在非正常退出后自动重启，需要加上-restart选项

> 命令： docker run --name agentservice -d -p 8810:8810 agentservice-container:1.0 --restart=always



> 参考地址文档地址：[https://www.cnblogs.com/edisonchou/p/aspnetcore_on_docker_foundation.html](https://www.cnblogs.com/edisonchou/p/aspnetcore_on_docker_foundation.html)

