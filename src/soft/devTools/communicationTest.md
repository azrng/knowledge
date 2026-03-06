---
title: 通讯测试相关工具
lang: zh-CN
date: 2024-04-06
publish: true
author: azrng
category:
  - soft
tag:
  - 通讯
  - 测试
---

## 概述

**通讯测试是用于评估网络性能、稳定性和安全性的过程**。它的主要作用包括：

* 连通性测试
* 故障排查
* 安全评估
* 取证（没错就是取证）

## 工具

### ping

- 作为最常用的命令，**用来测量两台设备是否可达和往返时间**（RTT）
- 它使用**ICMP**协议（**OSI模型的第3层**即网络层）
- windows上的`ping`默认通讯4次，你可以在结尾增加`-t`来持续`ping`

使用：`ping baidu.com -t`

### tracert

* 同样使用ICMP协议，它可以用于**跟踪数据包从本地主机到目标主机之间的路由路径**，以及每一跳的延迟
* 你也可以使用 `-d` 参数来禁用域名解析，只显示ip地址

使用：`tracert -d baidu.com`

### telnet

- 用来**检测应用和服务（端口）的可用性**，它是基于TCP/IP协议的应用层协议（OSI模型的第7层）
- 如检测西门子plc s7协议102端口，或者modbus-tcp协议502端口的可用性
- 你可以在windows系统->控制面板->类别->程序->启用或关闭windows功能中，勾选**安装**`telnet客户端`

使用：`telnet 172.20.10.7 502`

### netstat

- **用来显示当前系统的所有网络连接信息**，包括本地地址、外部地址、连接状态、协议、数据包数量等
- 例如：查看某个端口当前有几路连接；端口被哪个进程占用等
- 下面来查询本机502端口的连接情况

使用：`netstat -nao | findstr 502` 

返回：**分别是协议、本机地址、远程地址、状态、进程编号**

### psping

- PsPing 不仅可以测试 ICMP 协议，还可以测试 TCP 和 UDP 端口的连通性和延迟，更**全面地评估网络性能**
- 类似于`ping+telnet`
- **详见**：https://learn.microsoft.com/zh-cn/sysinternals/downloads/psping
- 解压后放在`C:\Windows\System32`下；或者**添加环境变量**

使用：`psping baidu.com:80` 

### arp

- **用来显示与当前计算机有过通讯的设备的IP和MAC**
- 它位于OSI模型的第2层（**数据链路层**）
- 如果你遇到过莫名其妙的通讯问题，有可能是IP冲突了，你可以试一试arp来检查MAC地址是否匹配
- 可以使用`arp -d`来清除arp表，也可以使用`arp -s`手动添加

使用：`arp -a` 

返回：**按照接口显示IP和MAC**

### IPScanner

- 用来**搜索某个网段内的网络设备名、IP和MAC地址**
- 为后续端口扫描做准备

### PortScan

- **用来探索设备暴露的端口**，也可以进行**ping统计和测速**
- 如果你需要采集未知设备的数据，那端口扫描工具是必要的
- **支持批量扫描**多个网络设备的多个端口

### inSSIDer

- **用来查看当前和诊断WiFi的状态**，可以**查看每个SSID的信道、信号强度和模式**
- 如果你的**家庭无线网络或者工厂的AP丢包、延迟**，可以试一试它
- 至少你可以**选择一个不太拥挤的信道**

### WireShark

**万能抓包工具**，没人能离开它，现在开始也不晚

**你可以用来抓包取证、数据包分析等**

建议你**使用过滤器抓包**，否则数据量可能会很大

### Fiddler 4

- **对http协议的交互进行抓包**
- 有了它，你**不再需要打开浏览器的F12**进行调试
- **可以保存**你想要的记录

## 端口扫描

### SharpScan

SharpScan 是一个由 INotGreen 开发的开源项目，旨在进行内网资产收集、主机存活探测、端口扫描、域控定位、文件搜索，以及对多种服务（如 SSH、SMB、MsSQL 等）进行弱口令爆破，并支持 Socks5 代理功能。该工具集成了自动化和无文件落地扫描的特性，方便在内网环境中进行横向移动和信息收集。

项目地址：[https://github.com/INotGreen/SharpScan](https://github.com/INotGreen/SharpScan)

内网信息收集端口扫描工具:https://mp.weixin.qq.com/s/LyIx8WjxDh3WKFFjRSLnYg



## 参考资料

一网打尽：常用通讯测试相关工具的介绍、使用和下载：https://mp.weixin.qq.com/s/jnv22Y_pThLfyYC14Htk3g
