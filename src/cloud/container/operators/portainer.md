---
title: 可视化界面
lang: zh-CN
date: 2023-06-04
publish: true
author: azrng
isOriginal: true
category:
  - cloud
tag:
  - 无
filename: keshihuajiemianportainer
slug: rw7ezw
docsId: '43621236'
---

## Portainer

轻量级图形页面管理之Portainer

> 官网：[http://www.portainer.io](http://www.portainer.io)
> 演示地址：[http://demo.portainer.io](http://demo.portainer.io) 用户名：admin 密码：tryportainer

### 操作

1.查看portainer镜像

```
## docker search portainer
```

![](/common/1618409439522-02daddd1-93a7-46e0-aba9-df334ef5d62d.png)
2.选择喜欢的portainer风格镜像，下载

```
docker pull portainer/portainer
```
3.启动dockerui容器
```
## linux部署方案
docker volume create portainer_data
docker run -d -p 9000:9000 --name portainer --restart always -v /var/run/docker.sock:/var/run/docker.sock -v portainer_data:/data portainer/portainer

## windows部署方案
docker run -d -p 9000:9000  --name portainer --restart always  -v /var/run/docker.sock:/var/run/docker.sock --name prtainer portainer/portainer
```
参数说明：
-v /var/run/docker.sock:/var/run/docker.sock ：把宿主机的Docker守护进程(Docker daemon)默认监听的Unix域套接字挂载到容器中；
-v portainer_data:/data ：把宿主机portainer_data数据卷挂载到容器/data目录；
四、web管理
1、登陆 [http://x.x.x.x:9000](http://x.x.x.x:9000)，设置管理员账号和密码。
2、单机版在新页面选择 Local 即可完成安装，集群选择Remote然后输入SWARM的IP地址，点击Connect完成安装。
4.浏览器访问 [http://192.168.2.119:9000](http://192.168.2.119:9000) , 设置一个密码即可，点击创建用户
![](/common/1618409439676-1830e040-a25d-4573-9b33-77c84f7a373c.png)
我们搭建的是单机版，直接选择Local ，点击连接
![](/common/1618409439756-9f844646-ceee-48ca-8697-68af4673c9dd.png)
现在就可以使用了，点击Local进入仪表盘主页面。
![](/common/1618409439802-fbc7ba96-d35d-4d9f-b021-4d1be9ea202e.png)
容器页面
![](/common/1618409439585-4668da5d-aa4c-4e77-aeae-5edab9227df3.png)

### 参考文档

Docker 图形化工具Portainer :[https://mp.weixin.qq.com/s/dSESgScxR8EYlONVxPjbzw](https://mp.weixin.qq.com/s/dSESgScxR8EYlONVxPjbzw)

## dpanel

轻量级的 Docker 可视化管理面板。这是一款专为国内用户设计的 Docker 可视化管理面板，采用全中文界面。它安装简单且资源占用低，运行在容器内部对宿主机无侵入，支持容器管理、镜像管理、文件管理以及 Compose 管理等功能。

仓库地址：[https://github.com/donknap/dpanel](https://github.com/donknap/dpanel)
