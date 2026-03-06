---
title: Monitor.TryEnter
lang: zh-CN
date: 2022-02-27
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: monitor_tryenter
slug: ug0xg3
docsId: '67709499'
---

## 目的
防止事件重复触发。

## 介绍
通过 Monitor.TryEnter 我们可以尝试获取指定对象的排他锁：

- 若对象尚未被加锁，Monitor 就成功对该对象进行加锁，并返回 True
- 若对象已被加锁，Monitor 就无法再加锁，返回 False

## 操作
它整体的逻辑很适合来防止事件重复触发，示例代码如下：
```csharp
private readonly object _lock = new object();

private void FormHexagonPosition_KeyDown(object sender, KeyEventArgs e)
{
    try 
    {
        // 如果 _lock 已被加锁就直接返回
        if (!Monitor.TryEnter(_lock)) return;
        
        // 业务逻辑代码
    }
    finally 
    {
        Monitor.Exit(_lock);
    }
}
```
