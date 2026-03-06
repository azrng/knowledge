---
title: Ava.SocketTool
lang: zh-CN
date: 2023-11-25
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 项目
---
## 概述

Ava.SocketTool是使用.Net7编写的，并使用Avalonia框架和SuperSocket库的一个模仿 SocketTool软件 的Socket调试工具。

> Avalonia：是一个使用.Net创建跨平台应用程序的框架
>
> 官网地址：https://www.avaloniaui.net/

## 界面预览

拉取项目后启动起来默认界面是这个样子，在头部可以设置编码和调整工具主题颜色

![image-20230730203541260](/common/image-20230730203541260.png)

左侧可以创建对应网络协议的服务端或者客户端，先选中要创建的内容，然后点击创建按钮去创建一个TCP的服务端

![image-20230730204459307](/common/image-20230730204459307.png)

通过点击服务端查看内容

![image-20230730204622422](/common/image-20230730204622422.png)

以同样的方式再去创建一个TCP协议的客户端，并连接服务端

![image-20230730210031422](/common/image-20230730210031422.png)

然后就可以通过客户端的数据发送窗口发送消息

![image-20230730210424123](/common/image-20230730210424123.png)

然后在服务端那边已经显示了客户端的IP以及端口信息，也收到了客户端发送的消息内容

![image-20230730210443911](/common/image-20230730210443911.png)

关于UDP协议的就不测试了，可以自行查看源码体验。

## 仓库地址

如果了解更多内容，可以查阅源码

GitHub：https://github.com/wmchuang/Ava.SocketTool