---
title: linux安装redis
lang: zh-CN
date: 2023-07-24
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - 无
filename: linuxanzhuangredis
slug: hggl5n
docsId: '29714459'
---

## 操作
查询yum源中是是否有redis
命令：yum info redis      
安装redis数据库
命令：yum install redis    
开启redis服务
命令：service redis start  
![image.png](/common/1609927422737-35afc46e-2c2a-492a-8dac-8e7cbbc7fc74.png)
查看redis是否开启
命令：ps -ef | grep redis   
![image.png](/common/1609927422746-59c5710e-35b2-4a88-a0c6-2f99f327ba02.png)
进入redis服务
命令：redis-cli 
在进入服务的状态查看所有配置项
命令：CONFIG GET *
![image.png](/common/1609927422741-a27be344-8f39-4444-99e8-20fdd2ca2e1e.png)
我们需要修改的配置有：
daemonize改为yes；yes代表守护进程，后台运行，否则每次只要回到控制台就会自动关闭、
protected-mode设置为no，保护模式默认是yes，如果想外网访问，那么需要将此属性改为no
bind：绑定主机地址；如果需要远程访问需要将这个属性改为bing *
 
查找redis的安装目录
命令：whereis redis
![image.png](/common/1609927422748-03b7d22a-98d2-4ee4-b047-fe2097e0781f.png)
编辑配置文件
命令：vim /etc/redis.conf
或者直接找到这个文件进行编辑
 
改完以后需要关闭服务然后再开启redis服务：然后本地就可以连接远程redis服务
 
关闭服务
命令：redis-cli  shutdown 
 
 
 
 
开放端口6379、6380的防火墙
/sbin/iptables -I INPUT -p tcp --dport 6379 -j ACCEPT   开启6379
/sbin/iptables -I INPUT -p tcp --dport 6380 -j ACCEPT    开启6380
/etc/rc.d/init.d/iptables save                           保存
 
包安装的方式：
需要去官网下载  [https://redis.io/download](https://redis.io/download)
 

## 参考文档
教程：[https://www.cnblogs.com/hunanzp/p/12304622.html](https://www.cnblogs.com/hunanzp/p/12304622.html)
