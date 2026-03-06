---
title: 说明
lang: zh-CN
date: 2023-04-02
publish: true
author: azrng
isOriginal: true
category:
  - orm
tag:
  - efcore
---

## 概述
EFCore可以用作对象关系映射程序(ORM),轻量级，以便于.Net开发人员能否使用.Net对象来处理数据库(可以不用关心sql)。
使用EFCore+Linq进行数据库查询更加方便。
官方文档：[https://learn.microsoft.com/zh-cn/ef/core/](https://learn.microsoft.com/zh-cn/ef/core/)

## 原理
底层还是基于`ADO.Net+SQL`语句实现的。
应用程序生成c#代码=>EFCore生成SQL=>`ADO.NET`=>执行数据库。

### 不同数据库的不同

- EFCore核心将c#代码翻译为AST语法树
   - SqlServer EFCore Provider(将语法树翻译为SQL语句)
      - `SqlServer ADO.NET Provider`执行SQL
   - MySQL EFCore Provider(将语法树翻译为SQL语句) 
      - `MySQL ADO.NET Provider`执行SQL

## 版本更新

https://mp.weixin.qq.com/s/69sCaR5d5LCdq1EOe9MPRw | EF Core 6 新功能汇总（一）
https://mp.weixin.qq.com/s/IJd0pwvQhCIohGR0dfekew | EF Core 6 新功能汇总（二）
https://mp.weixin.qq.com/s/7hGNjWDwpD7lQp5xr-vfMw | EF Core 6 新功能汇总（三）

## 国产数据库支持

EF Core助力信创国产数据库：https://mp.weixin.qq.com/s/0o0FAH0-mw67BzFm7MFJfA

https://github.com/dotnetcore/EntityFrameworkCore.KingbaseES

https://github.com/dotnetcore/EntityFrameworkCore.GaussDB

## 资料

[EF Core 1.0 和 SQLServer 2008 分页的问题](https://www.cnblogs.com/tianma3798/p/6963801.html)
EFcore系列教程：[https://www.cnblogs.com/yaopengfei/p/10666076.html](https://www.cnblogs.com/yaopengfei/p/10666076.html)

https://mp.weixin.qq.com/s/TGmqLgVOVnTa72uuMohzBA | 深入理解 EF Core：EF Core 读取数据时发生了什么？

https://mp.weixin.qq.com/s/EqD15qRI8Xt6hi8RSZafzg | EF Core 数据过滤

https://mp.weixin.qq.com/s/o_8_1qr7AjuKQ0i2PPvHeg | EntityFramework实现多数据源动态切换

https://mp.weixin.qq.com/s/j-sVQNAhwYU0Dd4YICGc4A | EF 基于 Interceptor 实现软删除

https://mp.weixin.qq.com/s/KgpeqIqpSZcPRhB6IZwvvA | 话说C#程序员人手一个ORM
https://mp.weixin.qq.com/s/PFqpTlvQ2yJJJWXy0vk29A | MySQL 查询避坑指南
https://mp.weixin.qq.com/s/9QDg0Yk3noE31eN-st302w | 查缺补漏系统学习 EF Core 6 - 数据查询
https://mp.weixin.qq.com/s/dfJPMOLjPyscjcvcjqtcGg | 查缺补漏系统学习 EF Core 6 - 软删除与编译查询

efcore连接excel：https://www.bricelam.net/2024/03/12/ef-xlsx.html

Entity Framework Core in Action：https://www.manning.com/books/entity-framework-core-in-action

