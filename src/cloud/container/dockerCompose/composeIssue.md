---
title: 问题处理
lang: zh-CN
date: 2021-05-17
publish: true
author: azrng
isOriginal: true
category:
  - cloud
tag:
  - 无
filename: composewenti
slug: xm91kv
docsId: '29455030'
---
## Couldn’t connect to Docker daemon at http+docker://localunixsocket - is it running?

解决方案：出现这个问题是因为当前用户权限的问题，只要将当前用户加入docker组就可以了
如果还没有docker group分组就添加一个
命令：sudo groupadd docker
将用户加入该group分组，然后退出并重新登录就生效了
命令：sudo gpasswd -a ${USER} docker
重启docker服务
命令：sudo service docker restart
切换当前会话到新group
命令：newgrp - docker
或者
原因是服务没有启动或者docker-compose版本太老了，或者使用sudo docker-compose up


比较容易弄混的几个地方
1.docker-compose同时存在images和build项，但是服务器当前没有拉取容器,使用docker-compose up，这个时候容器是通过image拉取的镜像启动的还是通过刚构造的镜像启动的
答案：通过刚构造的镜像启动的。
2.docker-compose同时存在images和build项，但是服务器当前已经拉取过容器,使用docker-compose up，这个时候容器是通过image拉取的镜像启动的还是通过刚构造的镜像启动的
答案：没有生成新镜像，直接使用刚才的镜像启动的
3.如果同时存在images和build，但是build地址是错误的，会不会报错
答案：会直接提示找不到dockerfile文件
