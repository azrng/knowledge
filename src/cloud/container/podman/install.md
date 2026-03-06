---
title: 安装
lang: zh-CN
date: 2024-03-23
publish: true
author: azrng
isOriginal: true
category:
  - cloud
tag:
  - podman
  - install
---
## Centos安装

```shell
//安装podman
[root@localhost ~]# yum -y install podman

//仓库配置
[root@localhost ~]# vim /etc/containers/registries.conf
[registries.search]
registries = ['registry.access.redhat.com', 'registry.redhat.io', 'docker.io'] //这个是查找，从这三个地方查找，如果只留一个，则只在一个源里查找
unqualified-search-registries = ["registry.fedoraproject.org", "registry.access.redhat.com", "registry.centos.org", "docker.io"] //这里也要改为一个

[registries.insecure]
registries = [10.0.0.1]   //这里写那些http的仓库，比如harbor

//配置加速器
[registries.search]
registries = ['https://l9h8fu9j.mirror.aliyuncs.com','docker.io']
```

## Ubuntu

```shell
# Ubuntu 20.10 and newer
sudo apt-get update
sudo apt-get -y install podman
```

## 资料

更新podman存储位置：https://blog.csdn.net/witton/article/details/128497746
