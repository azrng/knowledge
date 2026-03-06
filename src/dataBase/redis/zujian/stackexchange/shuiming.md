---
title: 说明
lang: zh-CN
date: 2023-09-02
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - 无
filename: shuiming
slug: wtfwe4
docsId: '29714473'
---

## 概述
StackExchange.Redis通过使用异步方法和IO多路复用等技术，提高了Redis访问的性能和并发性。它还提供了丰富的功能和选项，如连接池、管道、事务、发布/订阅、Lua脚本等，支持多种序列化和压缩方式，可以轻松地与其他.NET应用程序集成。
StackExchange.Redis还支持Redis Sentinel和Redis Cluster等高可用性和集群方案，使得应用程序可以更容易地管理和扩展Redis实例。因此，它是.NET平台上访问Redis的首选客户端库之一。

## 调优
解决改为异步处理后执行速度有点慢的情况。
StackExchange.Redis 2.0已经从重构了异步队列，使用管道方式解决异步慢的问题。如果发现还有问题，可以试试添加如下代码：    
```csharp
ConnectionMultiplexer.SetFeatureFlag("preventthreadtheft", true);
```

## 错误

### 超时问题
错误信息
```csharp
One or more errors occurred. (Timeout performing GET CR360:crcontentkey:not_valid_visit_record_state_ids (5000ms), inst: 2, qs: 27, in: 914, serverEndpoint: Unspecified/view360-redis:6379, mgr: 10 of 10 available, clientName: view360-be-755f6bc5f6-btp9d, IOCP: (Busy=0,Free=1000,Min=4,Max=1000), WORKER: (Busy=40,Free=32727,Min=4,Max=32767), v: 2.0.519.65453 (Please take a look at this article for some common client-side issues that can cause timeouts: https://stackexchange.github.io/StackExchange.Redis/Timeouts))Timeout performing GET CR360
```
有问题的组件包版本：2.0.519
解决方案：
更新包版本到：2.2.50
出现的原因：工作线程比较多
模拟场景：
```csharp
// ThreadPool.SetMinThreads(200, 200);
 var ts = new List<Task>();
 for (int i = 0; i < 100; i++)
 {
     var a = i;
     var t = new Task(() =>
     {
         var l = this.Context.TryGetLock("123");
         Trace.WriteLine($"{a}:{l!= null}");
         int workerThreads, completionPortThreads;
         ThreadPool.GetAvailableThreads(out workerThreads, out completionPortThreads);
         Trace.WriteLine($"Available: WorkerThreads: {workerThreads}, CompletionPortThreads: {completionPortThreads}");
     });
     t.Start();

     ts.Add(t);
 }

 Task.WaitAll(ts.ToArray());
```
 问题复现了，就是提示类似错误，把注释ThreadPool.SetMinThreads(200, 200);开启，问题消除。
