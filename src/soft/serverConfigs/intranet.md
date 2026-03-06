---
title: 内网服务
lang: zh-CN
date: 2023-07-22
publish: true
author: azrng
order: 003
category:
  - 服务器或证书
tag:
  - 无
---

## 使用IPV6访问内网数据
监测自己是否存在IPV6环境：[http://test-ipv6.com/](http://test-ipv6.com/) 或者使用 [https://ipw.cn/](https://ipw.cn/) 

> 如果想从外部访问内网的IPV6地址，那么还需要关闭路由器的防火墙。


> 知识点：
> 1.包含端口号的 IPv6 地址 http://[0:0:0:0:0:ffff:4137:270a]:9080/
> 2.IPv6 监听的 :: 和 IPv4 的 0.0.0.0 等效
> 3.IPv6 监听的 ::1 和 IPv4 的 127.0.0.1 等效，都是环回接口


关于IPV6文档资料：[https://ipw.cn/doc/](https://ipw.cn/doc/)

#### 内网之间通过IPV6访问
需要先检测当前网络是否支持IPV6，打开 https://6.ipw.cn/ 新窗口打开，如果能访问成功，那么证明 IPv6 网络开启成功，如果不能访问可以参考下面文章来开启：[https://ipw.cn/doc/ipv6/user/enable_ipv6.html](https://ipw.cn/doc/ipv6/user/enable_ipv6.html)

创建一个Api服务，然后使用命令行进行监听
```csharp
dotnet run --urls "http://*:8080"
```
然后获取自己本机的IPV6地址，可以直接通过访问[https://ipw.cn/ipv6/](https://ipw.cn/ipv6/) 或者使用ipconfig获取

然后就可以通过ipv6地址在内网之间访问了，示例如下
```csharp
http://[2409:8a1e:8fbb:98d0:4994:9715:14c8:74d9]:8080/swagger/index.html
```
