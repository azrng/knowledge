---
title: linux安装Nginx
lang: zh-CN
date: 2022-01-02
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: linuxanzhuangnginx
slug: txv9ic
docsId: '29395250'
---
yum下载nginx
先安装epel
命令：sudo yum -y install epel-release
安装nginx
命令：sudo yum -y install nginx
设置开机自启
命令：sudo systemctl enable nginx
启动服务
命令：sudo systemctl start nginx
禁止开机自启
命令：systemctl disable nginx  
查看运行状态
命令：systemctl status nginx     
重启服务
命令：systemctl restart nginx  
查看nginx进程
命令：ps aux | grep nginx

修改配置文件：/etc/nginx/nginx.conf
 
 
系列教程：[https://www.cnblogs.com/jayjiang/category/1686095.html](https://www.cnblogs.com/jayjiang/category/1686095.html)
[https://www.cnblogs.com/liuxiaoji/p/9907984.html](https://www.cnblogs.com/liuxiaoji/p/9907984.html)
