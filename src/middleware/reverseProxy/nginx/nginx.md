---
title: 说明
lang: zh-CN
date: 2023-10-01
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: nginx
slug: xtgr8w
docsId: '26511800'
---

## 描述
nginx是一个轻量级高性能的Web服务器软件。这是一个比 Apache HTTP Server 更加灵活和轻量级的程序。 


### 优点
并发能力强、内存消耗少、配置简单、成本低

## 在线测试地址

https://nginx-playground.wizardzines.com/

## 功能

### 正向代理和反向代理
![image.png](/common/1609075441479-59bbdd19-50d9-4207-807a-02acad3cc249.png)
![](/common/1615520085892-816a08cb-645f-422a-a4f2-4fa6ff71c4ad.webp)


#### 正向代理(代理客户端)
正向代理（forward）意思是一个位于客户端和原始服务器 (origin server) 之间的服务器，为了从原始服务器取得内容，客户端向代理发送一个请求并指定目标 (原始服务器)，然后代理向原始服务器转交请求并将获得的内容返回给客户端。
正向代理是为我们服务的，即为客户端服务的，客户端可以根据正向代理访问到它本身无法访问到的服务器资源。
正向代理对我们是透明的，对服务端是非透明的，即服务端并不知道自己收到的是来自代理的访问还是来自真实客户端的访问。

> 用户通过客户端去访问某一个网站然后将生成的响应返回给客户端叫做正向代理。


#### 反向代理(代理服务器)
反向代理（Reverse Proxy）方式是指以代理服务器来接受 internet 上的连接请求，然后将请求转发给内部网络上的服务器，并将从服务器上得到的结果返回给 internet 上请求连接的客户端，此时代理服务器对外就表现为一个反向代理服务器。

反向代理是为服务端服务的，反向代理可以帮助服务器接收来自客户端的请求，帮助服务器做请求转发，负载均衡等。
反向代理对服务端是透明的，对我们是非透明的，即我们并不知道自己访问的是代理服务器，而服务器知道反向代理在为他服务。

> 代理服务器接收到请求后转发给内部网络服务器并返回结果叫做反向代理。


### 负载均衡
默认提供三种方式负载均衡
```python
location ~ /blog/{
    rewrite ^/blog/(.*)$ /$1 break; 
    proxy_pass http://myblogapi;
}
```

#### 轮询（默认）
没一个请求按照时间顺序逐一分配到不同的后端服务器，如果后端服务器down掉，能自动剔除。
```python
upstream myblogapi {#名词不能有下划线
    server 47.104.255.61:8000;#只写到端口部分就行了
    server 47.104.255.61:8004;
}
```

#### 权重
会将客户端的请求，根据服务器权重的不同，分配不同的数量
weight代表权重，默认为1，权重越高被分配的客户端越多。 
```python
    upstream myblogapi{
        server 47.104.255.61:8006 weight=5;
        server 47.104.255.61:8016 weight=1;
    }
```

#### ip_hash
每个请求按照访问ip的hash结果分配，这样每个访客固定访问一个后端服务器，可以解决session的问题。
```python
    upstream myblogapi{
        ip_hash
        server 47.104.255.61:8006;
        server 47.104.255.61:8016;
    }
```

#### fair
按照后端服务器的响应时间来分配请求，响应时间短的优先分配
```python
    upstream myblogapi{
        server 47.104.255.61:8006;
        server 47.104.255.61:8016;
        fair;
    }
```

## 配置
Logs nginx日志
conf.d nginx配置，代理、转发、负载、集群
Conf  nginx配置，一般配置缓存、限流在这个里面

## 命令
```nginx
nginx -s stop 快速关闭Nginx，可能不保存相关信息，并迅速终止web服务。
nginx -s quit 平稳关闭Nginx，保存相关信息，有安排的结束web服务。
nginx -s reload 因改变了Nginx相关配置，需要重新加载配置而重载。
nginx -s reopen 重新打开日志文件。
nginx -c filename 为 Nginx 指定一个配置文件，来代替缺省的。
nginx -t 不运行，仅仅测试配置文件。nginx 将检查配置文件的语法的正确性，并尝试打开配置文件中所引用到的文件。
nginx -v 显示 nginx 的版本。
nginx -V 显示 nginx 的版本，编译器版本和配置参数。
```

## 可视化界面
nginx-proxy-manage

## 资料 
学习笔记：[https://blog.csdn.net/m0_49558851/article/details/107786372](https://blog.csdn.net/m0_49558851/article/details/107786372)
简明文档：[https://www.bookstack.cn/read/dunwu-nginx-tutorial/docs-nginx-introduction.md](https://www.bookstack.cn/read/dunwu-nginx-tutorial/docs-nginx-introduction.md)
学习手册：[https://mp.weixin.qq.com/s/tqTzTeI_QFoufGtXeHDutg](https://mp.weixin.qq.com/s/tqTzTeI_QFoufGtXeHDutg)
[https://mp.weixin.qq.com/s/gITjhkeKVyxzVJ9wHXU7bA](https://mp.weixin.qq.com/s/gITjhkeKVyxzVJ9wHXU7bA) | 高可用：Nginx 配合 keepalived
