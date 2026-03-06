---
title: Hyper-v安装ubuntu-20.04.6
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

## 前言

关于Hyper-V的配置等操作就不提及了，可以看之前的文档或者百度。

## 下载镜像

清华源下载地址：[清华大学开源软件镜像站 | Tsinghua Open Source Mirror](https://mirrors.tuna.tsinghua.edu.cn/#)

![image-20240228222754079](/soft/image-20240228222754079.png)

![image-20240228223044592](/soft/image-20240228223044592.png)

## Hyper-V操作

打开Hyper-V管理器

![image-20240229213422436](/soft/image-20240229213422436.png)

下一步

![image-20240229213556620](/soft/image-20240229213556620.png)

设置名称和位置

![image-20240229213659029](/soft/image-20240229213659029.png)

指定代数，下一步

![image-20240229213726997](/soft/image-20240229213726997.png)



设置内存大小

![image-20240229213755783](/soft/image-20240229213755783.png)

设置网络适配器

![image-20240229213810214](/soft/image-20240229213810214.png)

设置虚拟硬盘位置

![image-20240229214046971](/soft/image-20240229214046971.png)

选择系统文件

![image-20240229214142690](/soft/image-20240229214142690.png)

最后的摘要信息，点击完成就创建好了

![image-20240229214233576](/soft/image-20240229214233576.png)

## Ubuntu配置

![image-20240229214322666](/soft/image-20240229214322666.png)

启动并连接虚拟机，并在该界面直接回车安装

![image-20240229214421086](/soft/image-20240229214421086.png)

等待，然后选择语言(上下键切换)，然后回车

![image-20240229214554003](/soft/image-20240229214554003.png)

选择继续而不更新，然后回车

![image-20240229214649815](/soft/image-20240229214649815.png)

默认然后回车

![image-20240229214758080](/soft/image-20240229214758080.png)

默认自动获取IP地址

![image-20240229214905228](/soft/image-20240229214905228.png)

需要手动固定可以根据需求设置

![image-20240229215041484](/soft/image-20240229215041484.png)

![image-20240229215116758](/soft/image-20240229215116758.png)

配置代理地址，默认即可

![image-20240229215207532](/soft/image-20240229215207532.png)

源地址根据情况更换，这里我修改为阿里云镜像源：http://mirrors.aliyun.com/ubuntu/  (不能粘贴还得手输)

![image-20240229215459798](/soft/image-20240229215459798.png)

分区默认即可

![image-20240229215559339](/soft/image-20240229215559339.png)

![image-20240229215711484](/soft/image-20240229215711484.png)

设置服务器用户密码

![image-20240229215824837](/soft/image-20240229215824837.png)

![image-20240229215952486](/soft/image-20240229215952486.png)

直接下一步，有需要再安装

![image-20240229220038119](/soft/image-20240229220038119.png)

等待安装。。。。。。

![image-20240229220058337](/soft/image-20240229220058337.png)

等待出现Reboot Now，然后重启

![image-20240229221411288](/soft/image-20240229221411288.png)

![image-20240229221624614](/soft/image-20240229221624614.png)

更新系统

```sh
sudo apt update
sudo apt upgrade -y
```

![image-20240229221724166](/soft/image-20240229221724166.png)

然后就可以畅玩了，如果觉得自带的这个界面操作不得劲，可以拿到虚拟机ip

```
ip a
```

![image-20240229222139023](/soft/image-20240229222139023.png)

然后使用其他客户端连接，比如使用MobaXterm工具

![image-20240229222030298](/soft/image-20240229222030298.png)

## 参考资料

Vmware安装Ubuntu20.04(无界面)：[https://blog.csdn.net/qq_41004932/article/details/124955610](https://blog.csdn.net/qq_41004932/article/details/124955610)

手把手教会安装ubuntu虚拟机：https://blog.csdn.net/pjlpjlpjl/article/details/131746515