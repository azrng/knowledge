---
title: 线程调试
lang: zh-CN
date: 2023-07-01
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: xianchengdiaoshi
slug: ewlz1fs3o5hvidrs
docsId: '131941449'
---

## 概述
通过利用Vs的线程窗口来查看目前所有活动线程的运行情况以及线程目前在代码何处运行。

## 操作

### 死锁测试
实现一个简单的死锁程序：声明两个对象，让两个线程各自占用一个锁，然后再取拿另外一个锁，从而形成死锁
```csharp
internal class Program
{
    private static object _lock_1 = new object();
    private static object _lock = new object();

    private static void Main(string[] args)
    {
        var task1 = Task.Run(DeadLock);
        var task2 = Task.Run(DeadLock_1);

        Task.WaitAll(task1, task2);
        Console.WriteLine("Hello, World!");
    }

    private static void DeadLock()
    {
        lock (_lock)
        {
            Thread.Sleep(200);
            lock (_lock_1)
            {
                Console.WriteLine("DeadLock");
            }
        }
    }

    private static void DeadLock_1()
    {
        lock (_lock_1)
        {
            Thread.Sleep(200);
            lock (_lock)
            {
                Console.WriteLine("DeadLock_1");
            }
        }
    }
}
```
运行程序后，将程序中断
![image.png](/common/1688220107993-d8427d3e-17db-4693-acff-b485442ec90a.png)
然后点击调试=>窗口=>线程，可以看到工作线程
![image.png](/common/1688220491360-6ec9bb8c-b218-47d7-8170-7c58f60567a4.png)
双击后可以查看到线程中断所处的位置，然后分析线程是否阻塞到这里
![image.png](/common/1688220510717-908abf84-57eb-412d-991d-4ab306f0d3f9.png)

还可以点击调试=>窗口=>任务来查看任务列表
![image.png](/common/1688220586332-9b8b949a-0e83-4bf9-a56d-c18a9a1070b1.png)
这里就可以看到任务的状态，还可以看到当前死锁的原因
![image.png](/common/1688220690348-8c20f32a-3cc1-4980-91d4-50621f0cc194.png)

## 资料
[https://mp.weixin.qq.com/s/eN2_6clqnhrZq1DY3Wpz6w](https://mp.weixin.qq.com/s/eN2_6clqnhrZq1DY3Wpz6w) | VS 2022调试技巧：远程调试、线程检查、性能检查
