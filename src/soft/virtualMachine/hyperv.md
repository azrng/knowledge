---
title: Hyper-V
lang: zh-CN
date: 2023-07-22
publish: true
author: azrng
order: 001
category:
  - Hyper-v
tag:
  - 无
filename: jieshao
---
## 概述

Hyper-V是微软的一款虚拟化产品，是微软第一个采用类似Vmware ESXi和Citrix Xen的基于hypervisor的技术。



官网文档：[https://learn.microsoft.com/zh-cn/windows-server/virtualization/hyper-v/hyper-v-on-windows-server](https://learn.microsoft.com/zh-cn/windows-server/virtualization/hyper-v/hyper-v-on-windows-server)

## 配置网络交换机

提前创建交换机是 因为到会的安装过程中会有一步选择交换机，这里提前创建好，到会安装时直接选择，在安装完成后虚拟机直接就可以连接网络。  
![image.png](/common/1637650216953-ea7f0e51-9adf-420c-b464-d7607d0bfd94.png)
点击：新建网络交换机=>外部网络=>创建虚拟交换机
![image.png](/common/1637650318128-e8b445ad-3b14-4252-b365-5a2c04819526.png)
创建对应的网卡，点击确定完成创建交换机
![image.png](/common/1637650583189-eee81bac-64a2-47e7-9a7f-ee9156280361.png)
具体如何选择合适的网卡：
Realtek PCIe GBE Family Controller：有线网卡驱动
Qualcomm Atheros QCA61：无线网卡驱动
通过自己本机的网络连接地方选择可以正常上网的网卡。

### 配置固定IP文档

Hyper-v虚拟机设置固定ip：[https://blog.csdn.net/weixin_68243791/article/details/126968051](https://blog.csdn.net/weixin_68243791/article/details/126968051)  

Win10 Hyper-V 固定虚拟机IP地址的方法：[https://blog.csdn.net/boliang319/article/details/128732929](https://blog.csdn.net/boliang319/article/details/128732929)

## 导出导入虚拟机

教程地址：[https://blog.csdn.net/qq_43530416/article/details/107734967](https://blog.csdn.net/qq_43530416/article/details/107734967)



### 导入虚拟机后不显示Ip无法联网

可以按照上面的教程去处理。



但是发现一个比较秀的操作，当你点击了这个按钮后，他会进行一系列操作，然后就。。。就可以联网了

![94cd2452c1bb4b6b3ef729df5b58f2d](/soft/94cd2452c1bb4b6b3ef729df5b58f2d.png)



