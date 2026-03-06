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
filename: shuiming
slug: hbmibu
docsId: '92728987'
---

## 概述
功能强大的动态 SQL 查询生成器，支持 Sql Server、MySql、PostgreSql、Oracle 和Firebird。SqlKata 有一个富有表现力的 API。它遵循干净的命名约定，这与SQL语法非常相似。通过对受支持的数据库引擎提供抽象级别，允许您使用具有相同统一 API 的多个数据库。

SqlKata 支持复杂的查询，例如嵌套条件、从子查询中进行选择、筛选子查询、条件语句等。目前，它具有用于Sql服务器，MySql，后greSql和火鸟的内置编译器。SqlKata.执行包提供了使用 [Dapper](https://github.com/StackExchange/Dapper) 将查询提交到数据库的功能。

仓库地址：[https://github.com/sqlkata/querybuilder](https://github.com/sqlkata/querybuilder) 下载量：6.67M(2023年6月11日21:53:17)
官网：[https://sqlkata.com/](https://sqlkata.com/)

通过编写包含扩展方法的查询语法，然后生成SQL执行。

## 安装
```csharp
$ dotnet add package SqlKata
$ dotnet add package SqlKata.Execution ## (optional) If you want the execution support
```

## 操作
```
// 连接
var connection = new SqlConnection("...");
var compiler = new SqlCompiler();
var db = new QueryFactory(connection, compiler);


// 检索所有数据
var books = db.Query("Books").Get(); // 返回数据类型为dynamic

// 检索一本书
var introToSql = db.Query("Books").Where("Id", 145).Where("Lang", "en").First();

// 插入
int affected = db.Query("Users").Insert(new {
    Name = "Jane",
    CountryId = 1
});

// 更新
int affected = db.Query("Users").Where("Id", 1).Update(new {
    Name = "Jane",
    CountryId = 1
});

// 删除
int affected = db.Query("Users").Where("Id", 1).Delete();
```

## 总结
有点像是dapper的稍微增强版本。
