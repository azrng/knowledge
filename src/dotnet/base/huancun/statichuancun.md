---
title: Static缓存
lang: zh-CN
date: 2022-04-05
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: statichuancun
slug: fttltg
docsId: '29633961'
---
static变量做一个进程级别缓存，从而提高程序性能，这个也是一个非常好的一级缓存。
 
 
普通的static变量
```
public static Dictionary<int, string> cachedDict = new Dictionary<int, string>();
```
这是一个进程级别缓存，多个线程共享一个数据，所以在多线程的环境下，你需要注意同步的情况，要么使用锁，要么使用 ConcurrentDictionary。
 
线程级别缓存
使用ThreadStstic标记static变量
```
[ThreadStatic]
public static List<string> cachedDict = new List<string>();
```
每个线程之间cacheDict的数据是独立的，同一个线程下共享这一套数据。所以这个是线程级别的缓存。
注意点就是使用的时候需要判断是否为null，示例
```csharp
if (cachedDict == null) cachedDict = new List<string>();
cachedDict.Add(DateTime.Now.ToLongDateString());
```
