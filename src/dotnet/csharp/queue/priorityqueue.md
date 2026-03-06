---
title: PriorityQueue
lang: zh-CN
date: 2023-10-22
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 无
filename: priorityqueue
slug: ews0xr
docsId: '77867851'
---

## 介绍
支持设置权重的队列

## 操作
```csharp
public void Basic()
{
    var queue = new PriorityQueue<int, int>();

    //入队 添加元素
    queue.EnqueueDequeue(10, 1);

    //返回第一个元素，如果不存在报错
    var lookIeam = queue.Peek();

    // 出队 获取最小的元素
    var bb = queue.Dequeue();

    //出队  尝试获取最小的元素，如果不存在返回null
    //queue.TryDequeue(out var cc, out var dd);

    //设置队列最小容量 如果超出直接2倍扩容
    var aa = queue.EnsureCapacity(10);
}
```

## 资料
API：[https://docs.microsoft.com/zh-cn/dotnet/api/system.collections.generic.priorityqueue-2?view=net-6.0](https://docs.microsoft.com/zh-cn/dotnet/api/system.collections.generic.priorityqueue-2?view=net-6.0)
