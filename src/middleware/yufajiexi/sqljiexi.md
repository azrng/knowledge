---
title: SQL解析
lang: zh-CN
date: 2023-10-19
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - sql
  - 解析
---

## SQL解析组件

### SqlParser.Net

SqlParser.Net是一个免费，功能全面且高性能的sql解析引擎类库，它可以帮助你简单快速高效的解析和处理sql。

仓库地址：https://github.com/TripleView/SqlParser.Net

### antlr4

ANTLR（ANother Language Recognition Tool ）是一个功能强大的解析器生成器，用于读取、处理、执行或翻译结构化文本或二进制文件。

仓库地址：https://github.com/antlr/antlr4

https://mp.weixin.qq.com/s/BcuiM3ifm-PCOBZUja7vJg | Antlr一个领域语言利器——入门篇

https://mp.weixin.qq.com/s/Z6lzJm6Qcty_MSQsFlD9Pg | 基于Antlr4的Sql解析

https://www.makeyourchoice.cn/archives/568/ | 从事SQL血缘解析一年后，谈谈我对它的理解 - 皆非的万事屋

### Microsoft.SqlServer.Management.SqlParser

针对**SqlServer** 的SQL解析工具，微软开发。

sqlserver sql 解析：https://zhuanlan.zhihu.com/p/372622463

https://www.nuget.org/packages/Microsoft.SqlServer.TransactSql.ScriptDom

### tsql-parser

仓库地址：只支持sql server

注意：只支持**sql server**

### SqlParser-cs

仓库地址：https://github.com/TylerBrinks/SqlParser-cs

注意：解析传回来的语法树比较难懂

### SQLParser

仓库地址：https://github.com/JaCraig/SQLParser

文档地址：https://jacraig.github.io/SQLParser/



注意：代码是antlr自动生成的，比较难以进行手动优化

### Apache Calcite

Apache Calcite 是一个开源的 SQL 解析工具，可以将各种 SQL 语句解析成抽象语法树，然后通过操作抽象语法树就可以把 SQL 中所要表达的算法与关系体现在具体代码之中。它支持 Oracle，SqlServer，MySQL，PostgreSQL 等常用数据库，但也不一定能解析所有的 SQL 语法。它的优点是功能强大，缺点是可能比较复杂

资料：https://blog.csdn.net/CodeAsWind/article/details/104799684

### Irony

Irony 是一个用 C# 编写的轻量级的语法分析器，可以用来定义和解析任何文本语言，包括 SQL。它提供了一个用户界面，可以测试定义的语法，并生成抽象语法树。它的优点是简单易用，缺点是可能不支持一些复杂的 SQL 语法

资料：https://www.cnblogs.com/daxnet/p/12941769.html

### JSqlParser

JSqlParser 是一个 SQL 语句解析器，它将 SQL 转换为 Java 类的可遍历层次结构。它支持 Oracle，SqlServer，MySQL，PostgreSQL 等常用数据库，但也可能解析不了一些 SQL 语法。它的优点是易于集成，缺点是可能不够灵活

资料：https://cloud.tencent.com/developer/article/2025970

注意：java组件，还试很强大的

## 动态构建

### sqlkata

sqlkata/querybuilder：用 C# 编写的 SQL 查询构建器可帮助您轻松构建复杂的查询，支持 SqlServer、MySql、PostgreSql、Oracle、Sqlite 和 Firebird

仓库地址：https://github.com/sqlkata/querybuilder

## 资料

c#SQL解析器：[https://www.cnblogs.com/tansar/p/16426224.html](https://www.cnblogs.com/tansar/p/16426224.html)  里面的解析器源码可能有用
