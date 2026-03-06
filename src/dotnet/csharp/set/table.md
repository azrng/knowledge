---
title: 表格操作
lang: zh-CN
date: 2024-12-01
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - table
---

##  概述

在 C# 中，`DataTable` 是处理表格数据的常用类。我们可以使用多种方法查询数据，例如直接调用 `Select` 方法或利用 LINQ（Language Integrated Query）。不同的方法适用于不同场景，本文将详细讲解它们的用法和区别。

## 查询方式

| 查询方式    | 适用场景                     | 优势                         | 劣势                            |
| :---------- | :--------------------------- | :--------------------------- | :------------------------------ |
| Select 方法 | 简单条件查询                 | 性能较高，语法简单           | 可读性较差，灵活性有限          |
| LINQ 查询   | 复杂条件或需要链式操作的查询 | 可读性高，支持强大的表达能力 | 性能略逊于 Select，内存占用略高 |





C# 对 DataTable 进行查询的完整指南：[https://mp.weixin.qq.com/s/uAwmzOG_S4TlfuGHecqn0w](https://mp.weixin.qq.com/s/uAwmzOG_S4TlfuGHecqn0w)
