---
title: 说明
lang: zh-CN
date: 2023-09-27
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: readme
slug: hxxmrn
docsId: '72940842'
---

## 概述
应用的各种Metrics是保证应用健康稳定运行的基础。

## 其它组件

### Opserver

Opserver 是由大名鼎鼎的 Stack Exchange 团队开发的监控系统，它可以独立监控多个系统， 支持提取有关 CPU、内存、网络和硬件的统计数据。

Opserver 支持跨平台部署，包括 Windows，macOS，Linux。

- 多个监控模块支持，包括 SQLServer、Redis、ElasticSearch、HAProxy 等模块的监控。
- 多服务器监控，支持通过 Dashboard 仪表盘来查看多个服务器的信息。
- 支持告警通知，支持通过邮件、Slack、自定义等方式进行警报通知。
- 支持用户灵活自定义，可以根据自己的需求方便地创建新的监控模块。

仓库地址：[https://github.com/Opserver/Opserver](https://github.com/Opserver/Opserver)

### Uptime Kuma

轻量级服务健康检查监控程序， 主要用来监控 Web 和网络。

GitHub：https://github.com/louislam/uptime-kuma

![img](/middleware/NO3vX4ayQQnuWY8hib1O3CAM9ibjwe.png)

![image-20240101134431059](/middleware/image-20240101134431059.png)

* 可监控 HTTP(s) / TCP / Ping / DNS 等网络
* 支持 Webhook,邮件多种通知方式
* 多语言支持
* 轻量, 基于 Node.js 和 Vue 3 开发
* 响应式的 Dashboard
* 开源免费, 支持 Docker 部署

docker部署方式

```shell
docker run -d --restart=always -p 3001:3001 -v uptime-kuma:/app/data --name uptime-kuma louislam/uptime-kuma:1
```
