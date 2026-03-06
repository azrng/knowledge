---
title: Queue
lang: zh-CN
date: 2023-10-22
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 无
filename: queue
slug: esgiwf
docsId: '77867668'
---

## 概述
对象的先进先出集合。

### 存值取值
简单的存值取值
```csharp
public void BasicOperation()
{
    var queue = new Queue<int>();
    //new Queue<int>(10);//设置初始容量大小

    //设置队列最小容量 如果超出直接2倍扩容
    var capacity = queue.EnsureCapacity(5);
    Console.WriteLine($"capacity:{capacity}");

    for (int i = 0; i < 5; i++)
    {
        //在尾部添加元素
        queue.Enqueue(i);
    }
    //获取队列元素个数
    var count = queue.Count;
    Console.WriteLine($"count:{count}");

    //看一下第一个元素，不移除  如果队列为空会抛出异常
    var lookItem = queue.Peek();

    //移除并返回第一位元素
    var item = queue.Dequeue();

    //是否包含这个元素
    var exist = queue.Contains(4);
}
```

## ConcurrentQueue
表示线程安全的先进先出 (FIFO) 集合。



通过一个示例来描述一下，一个生产者两个消费者来依次消费的情况

```c#
var queue = new ConcurrentQueue<int>();

var producer = new Thread(AddNumbers);
var consumers1 = new Thread(ReadNumbers);
var consumers2 = new Thread(ReadNumbers);

producer.Start();
consumers1.Start();
consumers2.Start();

producer.Join();

consumers1.Interrupt();
consumers2.Interrupt();

consumers1.Join();
consumers2.Join();

Console.WriteLine("Done");


void AddNumbers()
{
    for (var i = 0; i < 20; i++)
    {
        Thread.Sleep(20);
        queue.Enqueue(i);
    }
}

void ReadNumbers()
{
    try
    {
        while (true)
        {
            if (queue.TryDequeue(out var item))
            {
                Console.WriteLine(item);
            }

            Thread.Sleep(1);
        }
    }
    catch (ThreadInterruptedException e)
    {
        Console.WriteLine("线程终止");
    }
}
```

## 资料
API：[https://docs.microsoft.com/zh-cn/dotnet/api/system.collections.generic.queue-1?view=net-6.0](https://docs.microsoft.com/zh-cn/dotnet/api/system.collections.generic.queue-1?view=net-6.0)
