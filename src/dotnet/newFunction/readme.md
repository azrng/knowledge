---
title: 说明
lang: zh-CN
date: 2023-10-29
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
---

## 概述

.Net/C#年表以及各版本更新的内容：https://lvhang.site/docs/dotnettimeline

.Net中的中断行变更：https://learn.microsoft.com/zh-cn/dotnet/core/compatibility/breaking-changes

.Net库的更改规则：https://learn.microsoft.com/zh-cn/dotnet/core/compatibility/library-change-rules

## 为什么要升级

* 可以获得更快的速度，相同的代码运行的速度更快
* .NetFramework升级到.NetCore可以跨平台，可以使用到更加便宜Linux托管
* 升级到更新的框架，可以更方便的寻找开发人员，因为一般开发人员会学习比较新的框架

## 核心技术用语

> https://mp.weixin.qq.com/s/LBjwVNrZOrCqTJmrCi-uCQ | 介绍下.NET8里面的核心技术术语

### **PGO**

全称:Profile Guided Optimization，在.NET里面它加了动态两个字。也即是动态PGO，它的意思是在.NET函数满足分层编译的条件([**.NET8分层编译参数条件**](http://mp.weixin.qq.com/s?__biz=Mzg5NDYwNjU4MA==&mid=2247485462&idx=1&sn=0c334fb7d2a5e240fc921757eb2cc42d&chksm=c01c458df76bcc9bc563e8e1ab90fe2e132415f83ed995667941579523d8548f9065673389c6&scene=21#wechat_redirect))的时候，会通过动态PGO这种技术收集最先编译的那一层，也就是Tiered0层的IR(中间表象，介于IL和ASM之间)状态，然后分析哪些地方需要优化，把结果的机器码生成最优解。

### **OSR**

全称:On-Stack Replacement, 它的意思是堆栈替换。也就是当某个函数里面的某一段代码运行的次数过多的时候，比如for循环里面的代码，JIT会尝试优化这一段代码，而不是整个函数。意即函数里面的堆或者栈替换成最优解。

### **Non GC heap**

它是.NET8里面新引入的一个堆段，把一些比较简单的，常用的比如常量字符串，类型，空字符串之类的东西放入到Non GC里面，以便加速性能运转。这点之前有文章专门介绍过它用的地方:[**.NET8极致性能优化Non-GC Heap**](http://mp.weixin.qq.com/s?__biz=Mzg5NDYwNjU4MA==&mid=2247485594&idx=1&sn=77ada645af59a4e35e1d46c2694493ac&chksm=c01c4501f76bcc17384320acd082d9951ecf8a6f321ae089aa3c4430d3cdb947795ac34e8727&scene=21#wechat_redirect)

### **Zeroing**

它实际上是优化的JIT编译器，对于JIT的内存空间分配的栈模式进行优化。JIT首先需要置零，Zeroing技术把置零的方式进行了优化，以图达到性能最大化。

### **Tiered**

看它的其字面意思，如其实际意思。也就是分层，分层编译在.NET Core2.0里面引入，在.NET Core3.0开启，到.NET8.0已经完成成熟，引入诸多技术，比如上面的动态PGO，OSR，以及GDV，边界检查，长两折叠，Non GC heap,Zeroing等等技术，依靠这个分层技术，把.NET这种托管代码优化到能与C++分庭抗礼的地步。

## 版本升级介绍文档

### .Net10

EF 10 中的命名查询筛选器（每个实体有多个查询筛选器）：https://www.milanjovanovic.tech/blog/named-query-filters-in-ef-10-multiple-query-filters-per-entity

