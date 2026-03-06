---
title: IO模型
lang: zh-CN
date: 2023-10-22
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 无
filename: iomoxing
slug: vct28g
docsId: '29634780'
---
I/O的全称就是input/output
 
阻塞io:应用程序中进行在发起io调用后至内核执行io操作返回结果之前，若系统调用的线程一直处于等待状态，则此次io操作为阻塞io。阻塞io简称bio
 
非阻塞io：用户进程在发起系统调用时指定为非阻塞，内核接收到请求后，就会立即返回，然后用户进程通过轮询的方式来拉取处理结果。则此次io操作为io模型，非阻塞io简称nio。
