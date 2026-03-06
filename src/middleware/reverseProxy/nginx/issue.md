---
title: Issue
lang: zh-CN
date: 2023-10-01
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: 502badgateway
slug: wu0827
docsId: '29395150'
---
## 502Bad Gateway

![image.png](/common/1609382953604-5371870e-2405-4eed-90aa-d1c137af069f.png)
原因是由于SELinux保护机制所导致，我们需要将nginx添加至SELinux的白名单。接下来我们通过一些命令解决这个问题。
运行下面的命令
yum install policycoreutils-python

sudo cat /var/log/audit/audit.log | grep nginx | grep denied | audit2allow -M mynginx

sudo semodule -i mynginx.pp

成功解决

## 开启nginx进程失败

错误示例图：
![image.png](/common/1609382927348-90ed680b-8f5c-428c-bac6-9cdc74301fab.png)

我们查看进程：
命令：ps  -ef | grep nginx
![image.png](/common/1609382927352-c50f6ce1-ba5d-46a1-9d45-15f7d3bd4277.png)
现在停止nginx服务
命令：nginx -s stop
![image.png](/common/1609382927355-27180f4e-5aba-4eeb-93ef-2b658cccb386.png)
然后我们再次启用nginx进程：
命令：nginx -s reload
提示错误
![image.png](/common/1609382927383-b6205298-020f-4b94-bb79-189a38e0f3c0.png)
原因是：
没有nginx.pid 这个文件，每次当我们停止nginx时(nginx -s stop) ,nginx 会把 /usr/local/var/run/ 路径下名为nginx.pid 的文件删掉
解决方案：
方案一：可以直接启动nginx，重新生成nginx.pid就可以了：
命令:nginx
方案二：如果直接启动还是不可行，执行nginx -t查看nginx配置文件路径：
命令：nginx -t

```
nginx: the configuration file /usr/local/etc/nginx/nginx.conf syntax I s ok
nginx: configuration file /usr/local/etc/nginx/nginx.conf test is successful
```

指定一下conf文件

```
nginx -c /usr/local/etc/nginx/nginx.conf
```

再次重启nginx -s reload，就不会报错了。

资料：[https://blog.csdn.net/quanqxj/article/details/89375436](https://blog.csdn.net/quanqxj/article/details/89375436)
[https://www.cnblogs.com/waynechou/p/7760251.html](https://www.cnblogs.com/waynechou/p/7760251.html)
