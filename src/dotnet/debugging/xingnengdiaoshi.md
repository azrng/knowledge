---
title: 性能调试
lang: zh-CN
date: 2023-07-01
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: xingnengdiaoshi
slug: uzp6a2yrle66emyd
docsId: '131941473'
---

## 概述
VS自带的性能监控工具提供了一些数据的监控和分析，比较常用的就是CPU使用和内存IO的监控。它支持本地启动项目的监控以及进程和可执行程序的附加。

## 操作

### CPU密集代码
实现一个cpu密集的代码
```csharp
static async Task Main(string[] args)
{
    await MultiRunning();
    SomeThing();
    Console.WriteLine("Hello, World!");
}

//启动20个线程
static async Task MultiRunning()
{
    Thread[] tasks = new Thread[20];
    foreach (var index in Enumerable.Range(0, tasks.Length))
    {
        tasks[index] = new Thread(() =>
        {
            while (true)
            {
                int a = 1;
                Thread.Sleep(200);
            }
        });
    }

    int i = 0;
    await Parallel.ForEachAsync(tasks, (task, source) =>
    {
        i++;
        task.Start();
        return ValueTask.CompletedTask;
    });

    Console.WriteLine("执行了" + i);
}

static void SomeThing()
{
    while (true)
    {
        Console.WriteLine("I AM Alive");
        Thread.Sleep(200);
    }
}
```
点击调试=>性能探测器，然后勾选CPU使用率，然后点击开始来进行搜集，然后vs会给我们生成一些分析数据。

## 资料
[https://mp.weixin.qq.com/s/eN2_6clqnhrZq1DY3Wpz6w](https://mp.weixin.qq.com/s/eN2_6clqnhrZq1DY3Wpz6w) | VS 2022调试技巧：远程调试、线程检查、性能检查
