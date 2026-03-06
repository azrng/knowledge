---
title: 闭包
lang: zh-CN
date: 2023-11-19
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 闭包
---

## 概述

闭包的概念主要是由直线函数以及函数相关的上下文环境组合而成的实体。通过闭包，函数与其上下文变量之间建立关联关系，然后上下文变量的状态可以在函数的多次调用过程中持久保持。从作用域的角度而言，私有变量的生存期被延长，函数调用所生成的值在下次调用的时候仍被保持。

## 优点和缺点

### 优点

* 代码简化，应用闭包可以实现一定程度的模块化复用，大大简化了代码的执行逻辑
* 数据共享与延迟
* 安全性。闭包的场合，有利于上下文信息的封闭性，实现了一定程序的信息隐蔽。

### 缺点

* 应用闭包，不可避免的会将程序的逻辑变得负责。
* 闭包的延迟特性会带来一定的逻辑问题

## 操作

形成闭包的非必要条件

* 嵌套定义的函数
* 匿名函数
* 将函数作为参数或者返回值

### 委托形成的闭包

```c#
string value = "Hello Closure";
MessageDelegate message = () => { Show(value); };
message();


static void Show(string message)
{
    Console.WriteLine(message);
}

public delegate void MessageDelegate();
```

### 闭包的延迟特性

```c#
var action = new List<Action>();
for (int i = 1; i < 5; i++)
{
    action.Add(() => { Console.WriteLine(i); });
}

action.ForEach(x => x());
```

该示例虽然你期望遍历输出1、2、3、4这样子的值，但是就是因为闭包的数据共享所有产生了问题，通常的解决方案就是在循环中应用中间量

```c#
var action = new List<Action>();
for (int i = 1; i < 5; i++)
{
    var v = i;
    action.Add(() => { Console.WriteLine(v); });
}

action.ForEach(x => x());
```







