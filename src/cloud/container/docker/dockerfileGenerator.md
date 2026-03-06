---
title: dockerfile生成镜像
lang: zh-CN
date: 2023-02-16
publish: true
author: azrng
isOriginal: true
category:
  - cloud
tag:
  - dockerfile
---
##  概述

通过实际的情况来描述如何生成镜像

## 生成镜像

### 项目目录格式

A目录  

![image.png](/common/1609562141077-6d3e1de3-a49d-4cc3-bd68-4594e7f93a0c.png)

B目录

![image.png](/common/1609562141087-6181298a-e038-4f2f-8ad2-b22271873ec2.png)

分别为A、B目录

### 第一种(推荐)
把dockerfile文件移到A目录下执行：

```shell
docker build -t  镜像名称  .

docker build -t imagesname .
```

### 第二种
直接在A目录下执行，dockerfile在B目录下
```shell
docker build -f  WebApplication1/Dockerfile -t imagesname .
```

### 第三种
dockerfile在B目录，然后在B目录下执行：
```shell
docker build -f Dockerfile -t imagesname ../
```

## 生成容器
```shell
docker run --name 容器名称 -d -p 8080:80 imagesname

docker run --name dockerName -d -p 8080:80 imagesname
```

