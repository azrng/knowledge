---
title: IQueryable
lang: zh-CN
date: 2022-05-29
publish: true
author: azrng
isOriginal: true
category:
  - orm
tag:
  - 无
filename: iqueryable
slug: gqeutn
docsId: '78925016'
---

## 概述

IQueryable代表一个“可以放到数据库服务器去执行的查询”，它没有立即执行，只是可以被执行。
对IQueryable接扣调用非终结方法的时候不会执行查询，而是在调用终结方法(遍历、ToArray、ToList、Min、Max、Count等)的时候才能立即执行查询。
非终结方法：GroupBy、OrderBy、InClude、Skip、Take等。
IEnumerable是用来操作内存，在客户端执行

> 如果想使用筛选或者使用聚合函数，应该使用IEnumerable，节约数据库计算的压力。


## 查询数据库方式
在ADO.NET中查询数据一般返回DataReader或者DataTable。

默认IQueryable内部在调用DataReader来读取数据。
优点：节约客户端内存。
缺点：如果处理的慢，会长时间占用连接。

如何一下子加载数据到内存？
调用IQueryable的终结方法，例如ToList那些，这样子会一下子读取数据到内存中。

何时需要一下子加载数据？
1、当遍历IQueryable并且遍历里面进行的数据处理过程很耗时。
2、如果需要返回查询结果，并且在方法里销毁DbContext的话，是不能返回IQueryable的。必须一下子加载返回。
3、多个IQueryable遍历嵌套。很多数据库的ASP.NETCore Provider是不支持多个DataReader同时执行的。

## 资料
学习自杨老师教程
