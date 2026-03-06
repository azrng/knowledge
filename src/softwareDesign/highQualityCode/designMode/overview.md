---
title: 设计模式
lang: zh-CN
date: 2023-02-09
publish: true
author: azrng
isOriginal: true
category:
  - 软件设计
tag:
  - 无
filename: overview
slug: plr3gr
docsId: '29634085'
---

## 概述
设计模式是针对软件开发中经常遇到的一些设计问题，总结出来的一套解决方案或者设计思路。大部分设计模式要解决的都是代码的可扩展性问题。

- 相对设计原则来讲，没有那么抽象，大部分不难理解。
- 难点是了解他们能解决哪些问题，掌握典型的应用场景，并且懂得不过度应用。

可以从更好层次考虑问题：可读性、可维护性、可扩展性、模块化、组件化，避免烂代码。

设计模式要干的事情就是解耦。
创建型是将创建和使用代码解耦，结构型是将不同的功能代码解耦，行为型模式是将不同的行为代码解耦。

设计原则和思想比设计模式更加朴实和重要。

## 分类
经典的设计模式有23种，其中随着时间推进，有些设计模式过时了，甚至成为反模式，一些被内置在编程语言中，还有一些新的模式诞生。

- 创建型(解决对象的创建问题，封装复杂的创建过程，解耦对象的创建代码和使用代码)
   - 单例模式(常)
   - 工厂模式(工厂方法和抽象工厂)(常)
   - 建造者模式(常)
   - 原型模式
- 结构型(解决一些类或者对象组合在一起的经典结构)
   - 代理模式(常)
   - 桥接模式(常)
   - 装饰者模式(常)
   - 适配器模式(常)
   - 门面模式
   - 组合模式
   - 享元模式
- 行为型(将不同的行为代码解耦)
   - 观察者模式(常)
   - 模版模式(常)
   - 策略模式(常)
   - 职责链模式(常)
   - 迭代器模式(常)
   - 状态模式(常)
   - 访问者模式
   - 备忘录模式
   - 命令模式
   - 解释器模式
   - 中介模式

## 资料
爱迪生周：[设计模式的学习征途系列](https://www.cnblogs.com/edisonchou/p/7512912.html)
23种设计模式相关的资料：[https://github.com/anjoy8/DesignPattern](https://github.com/anjoy8/DesignPattern)
设计模式github文章：[https://github.com/sheng-jie/Design-Pattern](https://github.com/sheng-jie/Design-Pattern)
免费在线学习代码重构和设计模式：[https://refactoringguru.cn/design-patterns](https://refactoringguru.cn/design-patterns)
[https://docs.microsoft.com/zh-cn/azure/architecture/patterns/](https://docs.microsoft.com/zh-cn/azure/architecture/patterns/) | 云设计模式

https://mp.weixin.qq.com/s/8WKjgVsOKyXGN4jvKJyp_Q | 重温设计模式 --- 中介者模式

