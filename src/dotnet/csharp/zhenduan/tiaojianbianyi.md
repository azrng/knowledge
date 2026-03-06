---
title: 条件编译
lang: zh-CN
date: 2023-10-22
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 无
filename: tiaojianbianyi
slug: hh96e3
docsId: '62439802'
---

## 介绍
使用C#中的预处理指令可以有条件地编译任意一部分代码。预处理指令是一类特殊的编译器指令，它们都以#符号开头（和其他的C#结构不同，它必须出现在一个独立行中）。预处理指令中和条件编译相关的指令有：#if、#else、#endif和#elif。

## 优点
条件编译有一些静态变量所不具备的应用场景，比如

- 有条件地包含某个属性
- 改变变量的声明类型
- 在using指令中切换命名空间或者类型名
