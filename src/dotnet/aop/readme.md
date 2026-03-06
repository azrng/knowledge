---
title: 说明
lang: zh-CN
date: 2023-10-15
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: readme
slug: qgzcuc
docsId: '29634950'
---

## 概述
AOP是Aspect Oriented Programing的缩写，中文翻译为面向切面编程，是通过预编译方式和运行期动态代理实现程序功能的统一维护的一种技术，是软件开发中的一个热点，是函数式编程的一种衍生范型。利用AOP可以对业务逻辑的各个部分进行隔离，从面使得业务逻辑各部分之间的耦合度低，提高程序的可重用性，同时提高开发的效率。在运行时、动态地将代码切入到类的指定方法、指定位置上的编程思想就是面向切面的编程。
举例：我们在两个类中，可能需要在每个方法中做日志，按照面向对象的设计方法，我们就必须在两个类的方法中都加入日志的内容。也许他们是完全相同的，但就是因为面向对象的设计让类与类之间无法联系。而不能将这些重复的代码统一起来。而AOP就是为了解决这个问题而生的。 

## 实现AOP的两种方式
静态代理模式：就是在编译的时候，已经存在了代理类，运行时候直接调用的方式，通俗一点就是自己手动编写代理类的方式
[代理模式](https://www.yuque.com/docs/share/da43a930-ceb1-43b7-bd0a-ac4a2eda5220?view=doc_embed)
动态代理，也叫做运行时代理，在程序的运行过程中，调用了生成代理列的代码，将自动生成业务类的代理类，不需要手动编写。

## 资料
动态代理简单讲解：[https://www.cnblogs.com/duanjt/p/9441587.html](https://www.cnblogs.com/duanjt/p/9441587.html)
Asp.Net Core 3.1 使用Autofac Aop   [https://www.cnblogs.com/dazen/p/12273018.html](https://www.cnblogs.com/dazen/p/12273018.html)
c#进阶AOP [https://www.cnblogs.com/landeanfen/p/4782370.html](https://www.cnblogs.com/landeanfen/p/4782370.html)
[AOP系列]Autofac+Castle实现AOP事务 [https://www.cnblogs.com/jianxuanbing/p/7199457.html](https://www.cnblogs.com/jianxuanbing/p/7199457.html)
[https://www.cnblogs.com/7tiny/p/9657451.html](https://www.cnblogs.com/7tiny/p/9657451.html) | AOP从静态代理到动态代理 Emit实现 - 7tiny - 博客园
[https://mp.weixin.qq.com/s/xF1LNon-4P0Xwar-Bd7C4Q](https://mp.weixin.qq.com/s/xF1LNon-4P0Xwar-Bd7C4Q) | .Net IL Emit 实现Aop面向切面之动态代理 案例版
[https://mp.weixin.qq.com/s/qytJcqaemMnfiMDYRAPDTA](https://mp.weixin.qq.com/s/qytJcqaemMnfiMDYRAPDTA) | Castle DynamicProxy 动态代理-异步方法代理
[https://mp.weixin.qq.com/s/oQZ8YzAAWCKnJj4tVkiIZw](https://mp.weixin.qq.com/s/oQZ8YzAAWCKnJj4tVkiIZw) | C#动态方法拦截(AOP）的5种解决方案！
