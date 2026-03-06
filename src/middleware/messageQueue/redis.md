---
title: 消息队列redis
lang: zh-CN
date: 2021-05-14
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: xiaoxiduilieredis
slug: amsm7e
docsId: '29412115'
---

## 介绍
通过redis实现轻量级订阅方法

> 参考文档：[https://www.cnblogs.com/kellynic/p/9952386.html](https://www.cnblogs.com/kellynic/p/9952386.html)


## 操作
本文使用组件：CSRedisCore

### 简单操作
```csharp
                Console.WriteLine("发布订阅");
                RedisHelper.Initialization(new CSRedis.CSRedisClient("192.168.7.253:6379,password=guoba@2000,defaultDatabase=13,prefix=my_"));

                //程序1：使用代码实现订阅端
                var sub = RedisHelper.Subscribe(("chan1", msg => Console.WriteLine(msg.Body)));
                //sub.Disponse(); //停止订阅

                //程序2：使用代码实现发布端
                RedisHelper.Publish("chan1", "111");
```

### 






