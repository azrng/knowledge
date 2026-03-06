---
title: 安装问题
lang: zh-CN
date: 2021-05-17
publish: true
author: azrng
isOriginal: true
category:
  - cloud
tag:
  - 无
filename: installIssue
slug: pmaso1
docsId: '30531912'
---

### 权限被拒绝

#### 错误详情
Got permission denied while trying to connect to the Docker daemon socket

#### 错误原因
docker进程使用 Unix Socket 而不是 TCP 端口。而默认情况下，Unix socket 属于 root 用户，因此需要 **root权限** 才能访问，这种情况是当前登录用户不是root的时候需要注意。

#### 解决方法
```bash
sudo groupadd docker          #添加docker用户组
sudo gpasswd -a $XXX docker   #检测当前用户是否已经在docker用户组中，其中XXX为用户名，例如我的，liangll
sudo gpasswd -a $USER docker  #将当前用户添加至docker用户组
newgrp docker                 #更新docker用户组
```

