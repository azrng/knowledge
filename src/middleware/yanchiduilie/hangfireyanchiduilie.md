---
title: Hangfire延迟队列
lang: zh-CN
date: 2022-07-02
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: hangfireyanchiduilie
slug: tbaoh3
docsId: '69575087'
---

## 操作
```csharp
var jobId = BackgroundJob.Schedule(
  () => Console.WriteLine("Delayed!"),
   TimeSpan.FromDays(7)); //这里改成分钟就好了
```
