---
title: Issue
lang: zh-CN
date: 2023-09-24
publish: true
author: azrng
isOriginal: true
category:
  - cloud
tag:
  - 无
filename: wentichuli
slug: vgs8a6
docsId: '29454282'
---

## 版本问题
Error parsing reference: "mcr.microsoft.com/dotnet/core/aspnet:3.1-buster-slim AS base" is not a valid repository/tag: invalid reference format

### 原因 
这个问题一般是由docker的版本错误导致的
FROM microsoft/dotnet:2.2-aspnetcore-runtime AS base，使用docker的新特性multi-stage build，该特性要求docker 17.05或更高版本。
我使用的服务器版本是centos 7.5 ,默认安装docker安装的docker 1.13.1版本

### 解决方案
```sql
将docker更新到最新版本
删除已安装的docker版本 ~~~~
yum -y remove docker* （不删除 /var/lib/docker 目录 就不会删除已安装的镜像及容器）
安装国内阿里云镜像
yum install -y yum-utils device-mapper-persistent-data lvm2 sudo 
yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
安装最新版本的docker
yum install docker-ce
重启容器时发生错误
Unknown runtime specified docker-runc
运行如下指令解决
grep -rl 'docker-runc' /var/lib/docker/containers/ | xargs sed -i 's/docker-runc/runc/g'
systemctl restart docker
```

## 域名解析问题
如果在容器外可以通过curl访问外网但是容器内curl ip是正常的，但是curl域名无法访问

### 解决方案
在docker-compose中配置dns然后再次发布项目生成容器
```yaml
     dns:
       - 8.8.8.8
       - 114.114.114.114
```


##  
