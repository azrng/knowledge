---
title: 性能和实时性处理
lang: zh-CN
date: 2023-10-22
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 无
filename: xingnengheshishixingchuli
slug: ahi99nqlxkgvxmgq
docsId: '133480147'
---

## 需求
当我们遇到这种数据处理场景：我们需要一个组件实时性收集外部给它的数据，并且将它交给另外一个程序进行处理。考虑到性能，它会将数据存储到本地缓冲区，然后等累积到一定数量的时候最后统一打包发送，并且考虑到实时性，数据不能再缓冲区保存太长的时间，必须设置一个延时时间，一旦超过这个时间，缓冲的数据就必须立即发送出去。

这种还不同于使用MQ、Channel这种用来进行削锋的操作，上面的场景实时性没有那么高，但是又不想数据发送的那么频繁。

要做到上面的哪种需求，如果要综合考虑性能、线程安全、内存分配，要实现起来还真有点麻烦，不过蒋老师的文章已经给出来了实现方案，本文是对老师文章的一种学习汇总。

## 功能
使用一个对象来接受应用分发给它的资源，并且该对象会在适当的时机去处理数据(当保存的数据阈值达到一定数量后就立即处理或者两次处理的间隔超过时间时间就立即处理)。

## 操作




## 参考资料
[https://mp.weixin.qq.com/s/RuINy1PMsx8WBJF1ZMqVQA](https://mp.weixin.qq.com/s/RuINy1PMsx8WBJF1ZMqVQA) | 如何兼顾性能+实时性处理缓冲数据？

