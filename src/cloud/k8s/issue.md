---
title: Issue
lang: zh-CN
date: 2024-09-16
publish: true
author: azrng
isOriginal: false
category:
  - cloud
tag:
  - k8s
  - k3s
---

## failed to create shim task: OCI runtime create failed

docker运行正常，但是使用kubectl创建的pod会报错，尝试设置docker执行器试试

```shell
#1.打开文件
vim /etc/systemd/system/multi-user.target.wants/k3s.service

#2.修改ExecStart那几行的值为：
/usr/local/bin/k3s server --docker --no-deploy traefik

#3.重启服务
systemctl daemon-reload
service k3s restart
```

