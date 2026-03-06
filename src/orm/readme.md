---
title: 说明
lang: zh-CN
date: 2023-06-11
publish: true
author: azrng
isOriginal: true
category:
  - orm
tag:
  - 无
filename: readme
---

## 说明

ORM(对象关系映射)：就是一种为了解决面向对象与关系数据库互不匹配现象的技术。通过描述对象和数据库之间映射的元数据，将程序中的对象自动持久化到关系数据库中。思想就是**表实体和数据库表之间的相互转换**。



- Orm的思想就是把表实体和数据库表直接相互转换。
- O代表的就是实体  m就是映射关系 r代表的是关系

adonet ef是以adonet为基础所发展出来的对象关系 

实体框架ef是ado.net中的一组支持开发面向数据的软件应用程序的技术，是微软的一个orm框架。

ef只是实现orm框架中的一种，还有linq 等



只要是操作数据库，底层还是adonet

## 优缺点

优点

- 提高了开发效率，通过ORM可以自动对试题对象与数据库中的Table进行字段与属性的映射。
- Orm提供了对数据库的映射，不用sql直接编码，可以像操作对象一样从数据库获取数据。

缺点

- 会牺牲程序的执行效率。

## 对比

https://mp.weixin.qq.com/s/L_-9TXQiPOxlJy72UkPCtA | SqlSugar、Freesql、Dos.ORM、EF、四种ORM框架的对比