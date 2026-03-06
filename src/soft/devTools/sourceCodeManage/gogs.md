---
title: gogs
lang: zh-CN
date: 2023-07-22
publish: true
author: azrng
order: 004
category:
  - Git
tag:
  - 无
filename: gogs
---

## 介绍
Gogs 是一款极易搭建的自助 Git 服务。 开发目的 Gogs 的目标是打造一个最简单、最快速和最轻松的方式搭建自助 Git 服务。

## 安装方式

### docker方式
docker-compose脚本
``` yaml
version: '3'

services:
  mygogs:
    container_name: mygogs
    image: gogs/gogs:latest
    restart: always
    ports:
      - "10022:22"
      - "10080:3000"
    volumes: 
      - ./data:/data/docker/gogs
```
执行完访问 http://ip:10080  设置数据库和管理员帐号密码
> 参考文档：[https://github.com/gogs/gogs/tree/main/docker](https://github.com/gogs/gogs/tree/main/docker)

