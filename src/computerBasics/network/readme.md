---
title: 说明
lang: zh-CN
date: 2024-03-23
publish: true
author: azrng
isOriginal: true
category:
  - 计算机基础
tag:
  - network
---

## 网络七层模型

网络七层模型，即OSI（Open System Interconnection）参考模型，是国际标准化组织（ISO）制定的一个概念性的框架，用于理解、设计和描述计算机网络通信的全过程。每一层都承担着特定的功能，并与相邻层通过接口进行交互。以下是按照从底层到高层排列的七层模型详细说明：

* 数据链路层 (Data Link Layer)
    * 功能：提供节点间数据帧的传输服务，负责错误检测和纠正，如使用校验码确保数据正确性；还定义了如何在物理线路上标识网络地址，实现介质访问控制（MAC）。
    * 子层包括逻辑链路控制（LLC）和媒体访问控制（MAC）。
* 网络层 (Network Layer)
    * 功能：负责将数据包从源主机路由至目标主机，主要任务是IP寻址和路径选择。
    * 在Internet中，TCP/IP协议族中的IP协议对应这一层。
* 传输层 (Transport Layer)
    * 功能：提供端到端的数据传输服务，保证数据的可靠性和顺序性，例如TCP协议提供面向连接、可靠的服务，UDP协议则提供无连接、不可靠的服务。
    * 主要协议：TCP (Transmission Control Protocol) 和 UDP (User Datagram Protocol)。
* 会话层 (Session Layer)
    * 功能：建立、管理及终止不同应用间的会话连接，比如同步两个系统间的对话，以及恢复中断的通信等。
    * 在实际的TCP/IP模型中，这部分功能通常由上层的应用程序直接处理。
* 表示层 (Presentation Layer)
    * 功能：处理数据格式、加密解密、压缩解压等与数据表示有关的问题，确保信息在不同系统之间的语义透明性。
    * 示例：ASCII、JPEG、MPEG等编码标准在此层得到处理。
* 应用层 (Application Layer)
    * 功能：为应用程序提供接口以接入网络服务，支持各种网络应用，如电子邮件、文件传输、Web浏览等。
    * 主要协议：HTTP、FTP、SMTP、DNS等。