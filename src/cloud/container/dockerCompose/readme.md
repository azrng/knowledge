---
title: 说明
lang: zh-CN
date: 2023-09-17
publish: true
author: azrng
isOriginal: true
category:
  - cloud
tag:
  - 无
filename: composebianpai
slug: owy3it
docsId: '29455025'
---

## 前言

 Docker可以将应用程序及环境很方便的以容器的形式启动，但当应用程序依赖的服务比较多，或是遇到一个大系统拆分的服务很多时，如果还一个一个的根据镜像启动容器，那就有点累人了，到这有很多小伙伴会说：弄个脚本就搞定啦；要的就是这个思路，Docker提供了一个叫Docker Compose的工具，一键启动相关服务。

举个例：比如开发一个Web项目，需要有数据库、Redis、MongoDB、配置中心等等，如果将其进行容器化，可以有两种选择，第一种就是把所有的服务依赖和应用程序全部构建为一个镜像，然后以一个容器运行，即这个容器里面包含了Web应用程序、数据库、Redis、MongoDB、配置中心等；另一种方式就各自服务单独启动为一个容器服务，比较独立，一般可以一个一个的启动容器，然后通过网络连接起来就行；显然第二种方式是小伙伴们更多的选择，如果能配上一个批量操作那就完美了，而Docker Compose就是来干这个事的。

## 概述

Docker-Compose 是用于**定义和运行多容器 Docker** 应用程序的工具。通过 Compose，您可以使用 YML 文件来配置应用程序需要的所有服务。然后，使用一个命令，就可以从 YML 文件配置中创建并启动所有服务。比如我们发布一个系统可能包含多个服务，服务与服务之间网络需要互通，那此时我们需要一个容器一个容器去启动，如果使用Docker-Compose即可定义一个描述文件docker-compose.yaml完成所有服务的发布， 并且实现容器间互通（单台物理机）。类似于批量命令，通过一组命令可以**批量构建容器，批量启动容器，批量删除**。
> yaml文件以key： value方式在指定配置信息，多个配置信息以换行+缩进的方式来区分


## 常用命令
运行命令教程：[https://docs.docker.com/compose/](https://docs.docker.com/compose/)
```shell
# 生成镜像不启动容器，已经存在镜像就覆盖
docker-compose build

# 如果镜像不存在，构建镜像并启动容器
docker-compose up 
# 如果添加该--build选项，即时不需要时，也会强制构建镜像。
docker-compose up --build
# 跳过镜像构建的过程
docker-compose up --no-build #如果镜像不是预先构建的，就会失败

# 提供一个项目名称，以便对容器进行标识和管理，项目名称必须是唯一的
docker-compose -p defalut up

docker-compose -f docker-compose.yaml  up --build -d 服务名

# 查看由docker-compose管理的容器
docker-compose ps

# 开启|关闭|重启已经存在的由docker-compose维护的容器
docker-compose start|stop|restart

# 关闭并删除容器
docker-compose down

# 查看日志
docker-compose logs -f
```

## 操作

### 快速上手
创建docker-compose.yaml文件，然后添加代码
```csharp
version: '3.4'

services: 

  frontend:
    image: pizzafrontend
    build:
      context: frontend
      dockerfile: Dockerfile
    environment: 
      - backendUrl=http://backend
    ports:
      - "5902:80"
    depends_on: 
      - backend
  backend:
    image: pizzabackend
    build: 
      context: backend
      dockerfile: Dockerfile
    ports: 
      - "5000:80"
```
此代码执行几项操作：

- 首先，它会创建前端网站，将其命名为 pizzafrontend。 该代码指示 Docker 生成该网站，并指向在“前端”文件夹中找到的 Dockerfile。 然后代码会为网站设置环境变量：backendUrl=http://backend。 最后，此代码会打开一个端口，并声明它依赖于后端服务。
- 接下来将创建后端服务。 它被命名为 pizzabackend。 它是通过你在上一个练习中创建的同一 Dockerfile 构建的。 最后一个命令指定要打开的端口。

若要生成容器映像，请打开命令提示符，并导航至 docker-compose.yml 文件所在的目录，然后运行以下命令：
```csharp
docker-compose build
```
接着，若要启动网站和 Web API，请运行以下命令：
```csharp
docker-compose up
```
经过一些输出后，就生成了一个容器。

## 开源项目

### DockerComposeMaker

**DockerComposeMaker (DCM)** 是一款专为家庭服务器环境设计的自托管解决方案，致力于简化和加速容器化应用的部署流程。通过智能化的配置生成引擎，用户能够快速构建符合生产标准的 `docker-compose.yml` 文件。系统集成了丰富的自托管应用预配置模板，有效消除传统部署中冗长的文档查阅和配置调试环节。

在线网址：[https://compose.ajnart.dev/](https://compose.ajnart.dev/)

项目仓库：[https://github.com/ajnart/dcm](https://github.com/ajnart/dcm)

## 资料

配置文件详细解释：
[https://www.cnblogs.com/ray-mmss/p/10868754.html](https://www.cnblogs.com/ray-mmss/p/10868754.html)
[https://www.cnblogs.com/minseo/p/11548177.html](https://www.cnblogs.com/minseo/p/11548177.html)
常用脚本：[https://github.com/dotnet-easy/docker-compose-hub/tree/main/docker-compose](https://github.com/dotnet-easy/docker-compose-hub/tree/main/docker-compose)
