---
title: Ava.MqttTool
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

Ava.MqttTool是使用.Net7编写的，并使用Avalonia框架和MQTTnet库的一个简单的mqtt服务端和客户端通信的客户端程序。

> Avalonia：是一个使用.Net创建跨平台应用程序的框架
>
> 官网地址：https://www.avaloniaui.net/

## 界面预览

拉取后默认启动起来的窗口是服务端

![image-20230730201426376](/common/image-20230730201426376.png)

在左侧列表中我们可以设置端口、用户名、密码等信息，然后点击启动安装启动服务

![image-20230730201534689](/common/image-20230730201534689.png)

这个时候服务端已经启动成功，点击打开客户端

![image-20230730201634513](/common/image-20230730201634513.png)

这个时候，我们可以输入服务端的主机地址、端口、用户名、密码等信息，并且设置当前客户端的clientid，然后点击连接

![image-20230730201746481](/common/image-20230730201746481.png)

连接成功后我们可以给某一主题发布内容消息到服务端

![image-20230730202001813](/common/image-20230730202001813.png)

也可以再打开一个客户端，同样的方式去连接到服务端，然后设置订阅某一个主题，然后就可以收到该主题的消息，那么我们使用客户端client1发送消息进行测试

![image-20230730202231432](/common/image-20230730202231432.png)

这个时候订阅该主题的客户端已经收到了该主题内的消息。

## 仓库地址

如果了解更多内容，可以查阅源码

GitHub：https://github.com/wmchuang/Ava.MqttTool