---
title: 说明
lang: zh-CN
date: 2023-07-22
author: azrng
order: 005
category:
  - 服务器或证书
tag:
  - 服务器
  - 证书
filename: shuiming
---

## 概述

服务器的一些知识

## 服务器创建虚拟机工具

* multipass：[https://multipass.run/](https://multipass.run/)
* vmware的esxi：[https://www.vmware.com/cn/products/esxi-and-esx.html](https://www.vmware.com/cn/products/esxi-and-esx.html)
* proxmox：[https://www.proxmox.com/en/](https://www.proxmox.com/en/)
* terraform：[https://www.terraform.io/](https://www.terraform.io/)

https://mp.weixin.qq.com/s/VuM3Om3QLPc0MMDgQwiozA | 自动化编排工具Terraform介绍



[为什么不建议个人使用国内服务器搭建网站来赚钱？](https://mp.weixin.qq.com/s/CTmDGZIrzUO1Qw-pCKSM9A)

## Nas

Nas内容摘抄自：https://mp.weixin.qq.com/s/apEMz3xVDC9dYQvP_ZI4Yg



NAS，全名 Network Attached Storage ，直译成中文是网络附加存储。

通俗一点说就是个小服务器，专门放在家里（或办公室）当私有云网盘用，当然现在NAS的性能很强，要当服务器放几个网站上去也没啥问题。

主要功能就是存文件，搭配RAID（大部分是软件RAID）实现冗余存储，能在一定程度上保证数据安全。

通常各个NAS厂商还有定制了一套系统，搭配各种App可以实现文件同步、远程下载、分享等功能。

而且大部分NAS的系统都是基于Linux定制的，还可以支持docker，可以跑很多第三方的服务来扩展功能，因此**理论上**可以当成一台Linux服务器使用。



trueNas  DIY  nas

### 常见牌子

现在比较主流的NAS分为两种，一种是Storage NAS，专注储存型；另一种是Platform NAS，集成平台型，也就是说自带操作系统。

常见的就群辉和威联通，这俩都挺贵的，俗称买系统送硬件，跟苹果一个尿性，但系统还搞得不咋样，这里面群辉好一点，但价格也贵一大截。

实际上NAS的品牌很多，这几年不知道咋的被炒火起来了，很多国产品牌也加入一起卷，不过暂时没有啥特别好的产品出现。

- 华芸（ASUSTOR） - 华硕子公司，软硬件都不错，但性价比据说很低
- 西部数据（Western Digital） - 硬件ARM架构，旧版系统基于Linux魔改，新版系统基于Android魔改，阉割得很厉害，扩展性和可玩性不咋样
- 网件（netgear） - 系统有ESXi认证，好像挺厉害，就是国内没销售
- 巴法络（Buffalo） - 小日子的公司，软件一般
- 铁威马（terra master） - 深圳的，性价比不错，软件一般般
- 桦赋（色卡司Thecus） - 跟威联通、群辉同个地方的公司，据说软件生态也不错，但好像没有在大陆自营
- 奥睿科（Orico） - 也是深圳的，主要卖硬件，机箱好看
- 诠力（ITE2） - 老牌厂家，系统居然是Windows 10 IoT Enterprise，主打服务，性价比很低
- 德宝（drobo） - 美国的，基本是搞企业级的



## NTP服务器

*NTP* 是用于同步网络中计算机时间的协议，全称为网络时间协议（Network Time Protocol）。在我们日常使用的电子设备中，只要能联网的，大都需要连接到 NTP 服务器。这也是为什么你的手机和电脑走时永远精准的原因。



国内地址

```
#阿里
ntp.aliyun.com
ntp1.aliyun.com
ntp2.aliyun.com
ntp3.aliyun.com
ntp4.aliyun.com
ntp5.aliyun.com
ntp6.aliyun.com
ntp7.aliyun.com
 
#腾讯
time1.cloud.tencent.com 
time2.cloud.tencent.com 
time3.cloud.tencent.com
time4.cloud.tencent.com
time5.cloud.tencent.com
 
#清华
ntp.tuna.tsinghua.edu.cn
 
#ntp.org
cn.pool.ntp.org
 
#NTP.ORG.CN
cn.ntp.org.cn
 
#香港天文台
stdtime.gov.hk
time.hko.hk        #ipv6
 
#澳门
time.smg.gov.mo
```



国外地址

```
#微软
time.windows.com
 
#苹果
time.asia.apple.com
##以下服务器国内时有抽风
time1.apple.com   
time2.apple.com
time3.apple.com
time4.apple.com
time5.apple.com
time6.apple.com
time7.apple.com
time.apple.com
time.euro.apple.com
   
 
#Cloudflare
time.cloudflare.com
 
#高通
time.gpsonextra.net
time.izatcloud.net
 
#Google
time.google.com
time1.google.com
time2.google.com
time3.google.com
time4.google.com
```

## 资料
普联路由器虚拟服务器：[https://resource.tp-link.com.cn/pc/docCenter/showDoc?id=1655112481787390](https://resource.tp-link.com.cn/pc/docCenter/showDoc?id=1655112481787390)

如何搭建一个永久运行的个人服务器？：https://mp.weixin.qq.com/s/rqvuo3TdDyxs4mOu60BbBw
