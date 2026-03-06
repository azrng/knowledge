---
title: 说明
lang: zh-CN
date: 2023-09-23
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - 无
filename: jianchanjieshao
slug: pf684o
docsId: '29714838'
---

## 说明
Redis 是一个高性能的key-value内存数据库，全称为远程字典服务（Remote Dictionary  Server）。[NoSQL](https://baike.baidu.com/item/NoSQL/8828247)(NoSQL = Not Only SQL )，意即“不仅仅是[SQL](https://baike.baidu.com/item/SQL)泛指非关系型的数据库。键是区分大小写的。数据是保存在内存中，同时redis可以定时把内存数据同步到磁盘，即可以将数据持久化，并且他比memcached支持更多的数据结构(string,list列表[队列和栈],set[集合],sorted set[有序集合] hash(hash表))

是一个字典结构的存储服务器，一个redis实例提供了多个用来存储数据的字典，客户端可以指定将数据存储在哪个字典中，这与在关系型数据库中可以创建多个数据库类似，每个字典都可以理解成一个独立的数据库，默认是支持16个数据库，可以通过调整配置文件来修改默认值。

redis单线程能够达到 10w/s的qps   IO多路复用
单线程不是指redis服务只有一个线程，而是redis服务器里面执行指令的只有一个
多线程解决的问题都是IO问题，但是redis是操作内存的，
如果所有操作都是CPU密集型的操作，正常情况下，单线程不会有瓶颈问题。

redis官网文档：[http://www.redis.cn/documentation.html](http://www.redis.cn/documentation.html)  
中国官网：[http://www.redis.cn/download.html](http://www.redis.cn/download.html)

### 为什么redis是单线程
因为redis是基于内存的操作，cpu不是redis的瓶颈，瓶颈最有可能的是机器内存的大小或者网络带宽。

### 为何单线程redis这么快？

- 纯内存操作
- 单线程操作，避免了频繁切换上下文
- 采用了非阻塞I/O多路复用机制

### 对于大量请求怎么样处理
redis是一个单线程程序，也就是说同一个适合只能处理一个客户端请求。
redis是通过IO多路复用(select,epoll,kqueue,依据不同的平台，采用不同的实现)来处理多个客户端请求的。

### redis6.0为啥引入多线程
因为redis的瓶颈不在内存，而在网络I/O部分带来的cpu耗时，所以redis6.0的多线程是用来处理网络I/O这部分的，充分利用cpu资源，减少网络i/o阻塞带来的性能损耗。
默认是没有开启多线程的，在conf文件内进行配置，开启多线程后，多线程用来处理网络数据的读写和协议解析，执行命令仍然是单线程执行。

## 使用
推荐使用CSRedis
ServiceStack.Redis 是商业版，免费版有限制；
StackExchange.Redis 是免费版，但是内核在 .NETCore 运行有问题经常 Timeout，暂无法解决；
CSRedis于2016年开始支持.NETCore一直迭代，实现了低门槛、高性能，和分区高级玩法的.NETCore redis-cli SDK；2023年6月27日目前貌似不维护了
FreeRedis：FreeRedis是.NET redis客户端，支持集群，哨兵，主从，管道，事务和连接池。

## 优点

1. 方便扩展
2. 大数据量高性能
3. 数据类型的多样性
4. 分布式存储

## 缺点
redis只能存储key/value类型的值，虽然value的类型可以有多种，但是对于关联性的记录查询，没有关系型数据库方便。

## 对比Memcache
1)、存储方式 Memecache把数据全部存在内存之中，断电后会挂掉，数据不能超过内存大小。Redis有部份存在硬盘上，redis可以持久化其数据
2)、数据支持类型 memcached所有的值均是简单的字符串，redis作为其替代者，支持更为丰富的数据类型 ，提供list，set，zset，hash等数据结构的存储
3)、使用底层模型不同 它们之间底层实现方式 以及与客户端之间通信的应用协议不一样。Redis直接自己构建了VM 机制 ，因为一般的系统调用系统函数的话，会浪费一定的时间去移动和请求。
4). value 值大小不同：Redis 最大可以达到 512M；memcache 只有 1mb。
5）redis的速度比memcached快很多
6）Redis支持数据的备份，即master-slave模式的数据备份。

## 客户端

### Another Redis Desktop Manager

Another Redis Desktop Manager是一款更快、更好、更稳定的Redis桌面(GUI)管理客户端，兼容Windows、Mac、Linux，性能出众，轻松加载海量键值。

支持哨兵, 集群, ssh通道, ssl认证, stream, subscribe订阅, 树状视图, 命令行, 以及暗黑模式; 多种格式化方式, 甚至能够自定义格式化脚本, 满足你的一切需求。

开源地址：[https://gitee.com/qishibo/AnotherRedisDesktopManager](https://gitee.com/qishibo/AnotherRedisDesktopManager)

### Tiny RDM

一个现代化轻量级的、跨平台的Redis桌面客户端，支持Mac、Windows和Linux。极度轻量，基于Webview2，无内嵌浏览器。界面精美易用，提供浅色/深色主题。支持SSH隧道/SSL/哨兵模式/集群模式/HTTP代理/SOCKS5代理。支持命令实时监控、支持导入/导出数据、支持发布订阅、支持导入/导出连接配置等更多实用功能特性。

开源地址：[https://github.com/tiny-craft/tiny-rdm](https://github.com/tiny-craft/tiny-rdm)

官网：[https://redis.tinycraft.cc/zh/](https://redis.tinycraft.cc/zh/)

## 资料

> redis系列教程：[https://www.cnblogs.com/yaopengfei/category/1594192.html](https://www.cnblogs.com/yaopengfei/category/1594192.html)
> 资料汇总专题：[https://www.cnblogs.com/tommyli/p/3200040.html](https://www.cnblogs.com/tommyli/p/3200040.html)

https://mp.weixin.qq.com/s/k074G-MeoFkEpISVEXgcsg | 聊一聊如何离线分析Redis缓存的空闲分布
