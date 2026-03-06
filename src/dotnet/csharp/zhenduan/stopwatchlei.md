---
title: Stopwatch类
lang: zh-CN
date: 2023-10-22
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 无
filename: stopwatchlei
slug: rfm7cy
docsId: '62476885'
---

## 介绍
提供了一种方便的机制来测量运行时间，使用了操作系统和硬件提供的最高分辨率机制，通常少于1毫秒。

## 操作
```csharp
var stopwatch = new Stopwatch();
stopwatch.Start();  // 开始监视代码运行时间
//开始计时
Thread.Sleep(3000);
stopwatch.Stop();//终止计时
Console.WriteLine(stopwatch.Elapsed);//返回消耗的时间间隔
Console.WriteLine("总毫秒数" + stopwatch.ElapsedMilliseconds);//返回总毫秒数

var elapsed = stopwatch.Elapsed;//获取当前实例测量得出的总运行时间。
var seconds = elapsed.TotalSeconds;  //  总秒数
var milliseconds = elapsed.TotalMilliseconds;  //  总毫秒数
```
