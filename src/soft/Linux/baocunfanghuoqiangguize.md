---
title: 保存防火墙规则
lang: zh-CN
date: 2023-07-22
publish: true
author: azrng
order: 003
category:
  - Linux
tag:
  - 无
filename: baocunfanghuoqiangguize
---
对防火墙规则进行保存时候提示错误
保存命令：service iptables save
报错：The service command supports only basic LSB actions (start, stop, restart, try-restart, reload, force-reload, status). For other actions, please try to use systemctl.
**解决方法：**
systemctl stop firewalld 关闭防火墙
yum install iptables-services 安装或更新服务
再使用systemctl enable iptables 启动iptables
最后 systemctl start iptables 打开iptables
再执行service iptables save
3.重启iptables服务：
service iptables restart
执行完毕之后/etc/syscofig/iptables文件就有了
 

关闭防火墙
查看防火墙状态
firewall-cmd _--state_
停止firewall
systemctl stop firewalld.service
禁止firewall开机启动
systemctl disable firewalld.service

常用命令
```shell
移除指定端口：
firewall-cmd --permanent --remove-port=5000/tcp

-- 开启端口
firewall-cmd  --permanent  --zone=public --add-port=5000/tcp

-- 重启防火墙服务使配置生效
firewall-cmd --reload

-- 查看当前开启的端口号
firewall-cmd --list-port

-- 停止防火墙
systemctl stop firewalld

-- 查看防火墙状态
systemctl status firewalld

-- 启动防火墙
systemctl start firewalld
```
