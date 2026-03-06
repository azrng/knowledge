---
title: 内网穿透
lang: zh-CN
date: 2023-07-22
publish: true
author: azrng
order: 003
category:
  - soft
tag:
  - 无
filename: neiwangchuantou
---

## 概述

别人可以通过域名访问到你本机的服务。

知乎推荐：[https://zhuanlan.zhihu.com/p/404714235](https://zhuanlan.zhihu.com/p/404714235)

## 服务

### cpolar

官网：[https://www.cpolar.com/](https://www.cpolar.com/)

### natfrp

免费版本：隧道2个、每月流量5g

[https://www.natfrp.com](https://www.natfrp.com/#index)

### **Pandafrp**

[https://www.tryzth.com/](https://www.tryzth.com/)

### **Natapp**
免费不限制流量，但是端口会不定时更新。
[https://natapp.cn/](https://natapp.cn/)

### Cloudfare

内网穿透可以用 Cloudfare 的 Tunnel 服务，免费的，只要有个域名就行，不需要公网IP，Cloudfare 还免费提供了 ssl

网址：https://one.dash.cloudflare.com/

### Ngrok
文档：[https://ngrok.com/](https://ngrok.com/)

### Frp
如果你有公网服务器，可以使用类似于 FRP 这样的内网穿透工具，借助公网服务器暴露局域网服务。
仓库地址：[https://github.com/fatedier/frp](https://github.com/fatedier/frp)
文档地址：[https://gofrp.org/docs/examples/vhost-http/](https://gofrp.org/docs/examples/vhost-http/)

### cpolar
免费版本二级域名，支持http/https/tcp协议
官网：[https://www.cpolar.com/](https://www.cpolar.com/)

### 路由侠
免费版本2个端口，最大带宽1M，月流量1G
官网：[http://www.luyouxia.com/](http://www.luyouxia.com/)

## 工具

### p2p-tunnel

仓库地址：[https://github.com/snltty/p2p-tunnel](https://github.com/snltty/p2p-tunnel)

### NSmartProxy

NSmartProxy 是一款强大开源的内网穿透工具，采用.NET CORE的全异步模式打造。

仓库地址：[https://github.com/tmoonlight/NSmartProxy](https://github.com/tmoonlight/NSmartProxy)

推荐一个使用 C# 开发的开源内网穿透工具:[https://mp.weixin.qq.com/s/t2PDTT8sGqjtg4eTMq3KIA](https://mp.weixin.qq.com/s/t2PDTT8sGqjtg4eTMq3KIA)

### FastTunnel

FastTunnel是用.net core开发的一款跨平台内网穿透工具，它可以实现将内网服务暴露到公网供自己或任何人访问。

> **github**: [https://github.com/SpringHgui/FastTunnel](https://github.com/SpringHgui/FastTunnel)
> **gitee**: [https://gitee.com/Hgui/FastTunnel](https://gitee.com/Hgui/FastTunnel) 
> **官网**：[https://suidao.io](https://suidao.io)


#### 使用场景

- 家中建站
- 微信开发
- 远程桌面
- erp互通
- svn代码仓库
- 端口转发
- iot物联网
- 等等场景，不局限以上

VisualStudio 使用 FastTunnel 辅助搭建远程调试环境：[https://mp.weixin.qq.com/s/_bkkf87GGidOWIHzDoyA4g](https://mp.weixin.qq.com/s/_bkkf87GGidOWIHzDoyA4g)



> [https://mp.weixin.qq.com/s/XotcyJ3Shs13ju9nKlxaVg](https://mp.weixin.qq.com/s/XotcyJ3Shs13ju9nKlxaVg)

### **P2PSocket**

https://mp.weixin.qq.com/s/Gg66-PAti2YJfzWGhCpqrA | .NET Standard实现不同内网端口的互通（类似花生壳）

仓库地址：https://github.com/bobowire/Wireboy.Socket.P2PSocket
