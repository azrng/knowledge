---
title: Hyper-v安装centos7
lang: zh-CN
date: 2023-07-22
publish: true
author: azrng
order: 002
category:
  - Linux
tag:
  - install
---

## 说明
可以让你在你的电脑上以虚拟机的形式运行多个操作系统(至于为什么选择这个，主要是系统已经自带了，所以能不装其他我就先不装其他试试)
Hyper-V 可用于 64 位 Windows 10 专业版、企业版和教育版。 它无法用于家庭版。

## 准备

### 下载系统镜像
去阿里云下载系统：[http://mirrors.aliyun.com/centos/7/isos/x86_64/](http://mirrors.aliyun.com/centos/7/isos/x86_64/)
![image.png](/common/1688296642451-be196d43-9060-42db-bfc0-629af2d8ed34.png)
建议下载这个版本，900M最小安装。DVD版本较大，但是里面会有很多东西。

### 启用Hyper-v
在电脑左下角搜索控制面板
![image.png](/common/1688296642890-66680ce6-942e-414e-b4e2-325b84252241.png)
选择程序，然后点击启用或者关闭Windows功能
![image.png](/common/1688296642929-3eb0ff91-0875-41ee-b17c-90e9cd5859f2.png)
![image.png](/common/1688296643067-ba1dc295-62a2-4682-b2ac-3d05f7ee83cb.png)
勾选应用后等待结束后重启系统
![image.png](/common/1688296643101-b487e2af-105a-443c-b426-43a592789e8f.png)
在重启结束后可以在电脑上搜索到Hyper-v管理器
![image.png](/common/1688296643555-00465d32-0d0c-4ddf-adfe-a6cee743d284.png)
下面的步骤就是使用该工具来完成的。

## 新建虚拟网络交换机
打开Hyper-v管理器
![image.png](/common/1688296643707-b1c08aac-3340-4d0f-804c-0e3ab05aea58.png)
![image.png](/common/1688296643997-093bb977-ee51-4aa7-916b-453619f8a5c5.png)
然后在这个界面名称具体规定，外部网络选择参考网络连接里面
![image.png](/common/1688296644004-c32680e2-89ac-43e9-81de-54f1a679f554.png)
![image.png](/common/1688296644088-c8184522-1570-4f72-8819-5afd70f8efcb.png)

## 新建虚拟机
右键新建虚拟机
![image.png](/common/1688296644498-3388667a-a0b6-4545-b3cc-033e4df1c637.png)
![image.png](/common/1688296644752-504cebb4-7150-414c-a4ce-0d8a976ef8b4.png)
修改一个有意义的名称和设置虚拟机的存储位置(保证有一定的空间)
![image.png](/common/1688296644870-f36446dc-2ad7-42a6-9d78-e71a0d1a4b55.png)
选择虚拟机的代数，直接下一步
![image.png](/common/1688296645005-133e07d9-d865-41a6-9f01-b0f191716abe.png)
分配内存大小()
![image.png](/common/1688296645082-698ff888-2061-4a60-bb33-f5df65bafc6c.png)
根据个人情况进行设置，如果你虚拟机里面要跑的东西比较大，那么就需要配置大一点
配置网络,下拉列表选择我们配置好的，然后下一步
![image.png](/common/1688296645341-b7d71a30-65e1-459c-ba49-f4b491f2be6a.png)
连接虚拟硬盘
![image.png](/common/1688296645941-3a3aedc6-e34c-4e28-bf46-d1ace16335cb.png)
安装选项选择镜像的位置
![image.png](/common/1688296646023-2122993a-5754-490f-87a1-e2947b9607e2.png)
再次确认我们的安装信息，然后点击完成
![image.png](/common/1688296646056-f396383d-3c35-4983-94f3-b04cdfea14c7.png)
查看已经创建的虚拟机
![image.png](/common/1688296646061-eafb6325-d9e3-4764-80e5-af8bb194c81c.png)
选中点击右侧的启动，然后启动开后点击连接
![image.png](/common/1688296646811-5497731c-f101-49da-ba90-39b637f1f077.png)

## 安装系统
启动虚拟机，然后连接后，操作键盘选择Install CentOS7，然后输入enter
![image.png](/common/1688296646950-6037d3b2-17e7-4afd-b5d7-6b16070ea0ce.png)
进入安装界面，选择安装语言
![image.png](/common/1688296646980-2cc9f6b6-533a-478c-be91-9980b035f5d3.png)
配置安装位置和网络
![image.png](/common/1688296647140-8f185740-180f-4a49-aac2-3295d44379c2.png)
点击安装位置
![image.png](/common/1688296647242-4750b472-e724-4cff-b749-24345e1a377d.png)
配置网络和主机名
![image.png](/common/1688296647726-ad07c6e9-5ae5-4a32-a1ca-5d3e354f3d86.png)
![image.png](/common/1688296648025-54ad59e5-01ed-4437-b6bc-e34eaf8151d3.png)
然后点击安装
![image.png](/common/1688296648188-b04c3eba-cb35-406f-8f3d-7acdf6bdf091.png)
设置root密码，这里根据个人情况设置简单或者复杂的密码
![image.png](/common/1688296669990-4022349e-5490-4e40-a63d-dd2c2ac62504.png)
这里就不另外创建用户，直接使用root
![image.png](/common/1688296636937-3dc15fd2-b186-40da-aec4-8e84e007228b.png)
安装成功后重启
![image.png](/common/1688296637407-db67c998-46dd-43c7-8edb-84d02319ba98.png)
点击enter进入系统，输入用户名root，密码就是我们刚才设置的密码
![image.png](/common/1688296637472-3a1b4f3f-381a-43e1-a6a8-fdd847b0da4b.png)
输入ls命令查看
![image.png](/common/1688296637786-0740c3ba-c15f-4ff7-b527-c997152de537.png)
尝试ping下百度看是否可以访问外网
ping baidu.com
![image.png](/common/1688296637849-5153f28b-653d-4faf-ad20-19b87a38876a.png)

## 操作

### 查看网络配置信息
ip addr
这个时候的ip是动态分配的ip地址
![image.png](/common/1688296638325-66dea725-fe6f-4c55-ab54-092317bcdeb6.png)
如果使用默认的界面不习惯，可以使用第三方终端工具(MovaXterm、shell)进行连接。

### MovaXterm基本使用
推荐使用MovaXterm，下载地址**：**[https://mobaxterm.mobatek.net/](https://mobaxterm.mobatek.net/) ，如果有需要可以去网上找汉化版。
下面简单描述下如何使用，打开MovaXterm工具，新建会话
![image.png](/common/1688296638554-2c2df91c-a703-48a7-9da2-d77f2787979a.png)
选择会话类型(支持多种)，这里我们选择SSH
![image.png](/common/1688296639395-c1501524-5394-41aa-ba3e-2713d96bb8c6.png)
![image.png](/common/1688296639542-028c154d-1188-4c47-a7c9-b501b8cb1f4a.png)
点击好的，然后输入密码进行连接。
![image.png](/common/1688296639895-2f0230e5-fe50-4a8b-9a9d-b6c4f72e44ba.png)
上面演示的软件是我学习使用的

### 设置静态IP
进入指定目录修改配置,这个里面放的是网络配置
```
cd /etc/sysconfig/network-scripts
ls
```
![image.png](/common/1688296639882-17808f76-704b-42e9-89ff-f8015e4f1d8e.png)
使用vm编辑ifcfg-eth0文件
vi ifcfg-eth0
![image.png](/common/1688296640542-83edcb4f-403a-4e4d-a280-63ea98e70efd.png)
编辑该文件增加或者修改以下配置
vi基本用法：按i进入编辑模式，保存退出先按esc，然后输入:wq
```
BOOTPROTO="static"  #设置静态ip
ONBOOT="yes"        #设置开机自启
IPADDR=192.168.1.8 #分配IP，前三个段要和本机保持一致，后一个段要不一样
NETMASK=255.255.255.0 #和本机保持一致
GATEWAY=192.168.1.1   #和本机保持一致
DNS1=192.168.1.1      #和网关保持一致，不添加无法上外网
```
通过cmd查询本机电脑的ip以及子网掩码等
ipconfig
![image.png](/common/1688296640559-a8401d1b-575d-45aa-967b-215e8866f5db.png)
修改后如图所示
![image.png](/common/1688296641062-171a65c7-e2fc-4c59-bf26-d1a11675620a.png)
重启网络服务 使以上配置生效
这点我是使用hyper-v自带界面运行的。
service network restart
![image.png](/common/1688296641540-cf389b33-ecd1-4749-be8f-cd375b4bf50a.png)
重新查询ip
![image.png](/common/1688296641756-68b4ebe0-3a4c-40f5-9a12-8b9ffdd528f5.png)
将我们的MovaXterm连接配置修改为我们修改后的ip地址重新连接，并且测试是否可以访问外网
![image.png](/common/1688296641910-de35792d-95aa-4096-9d3b-3d496c68643d.png)
然后通过本机去ping下我们的服务器，可以正常访问。
![image.png](/common/1688296641919-3f84aa80-bafc-48b1-afa3-b8965d6424e7.png)
到此，静态ip设置结束。

### 防火墙设置
本文示例目前没有用到以下配置
```
-- 开启防火墙
systemctl start firewalld

-- 查看防火墙状态
systemctl status firewalld

-- 开启端口
firewall-cmd   --permanent  --zone=public --add-port=80/tcp

firewall-cmd   --permanent  --zone=public --add-port=22/tcp

firewall-cmd   --permanent  --zone=public --add-port=21/tcp

-- 重启防火墙服务使配置生效
firewall-cmd --reload

-- 查看当前开启的端口号
firewall-cmd --list-port
```

## 参考文档
Hyper-v：[https://docs.microsoft.com/zh-cn/virtualization/hyper-v-on-windows/about/](https://docs.microsoft.com/zh-cn/virtualization/hyper-v-on-windows/about/)
