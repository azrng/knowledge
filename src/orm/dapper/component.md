---
title: 组件
lang: zh-CN
date: 2024-03-09
publish: true
author: azrng
isOriginal: true
category:
  - orm
tag:
  - compoent
---

## Dapper.AOT

将Dapper进行AOT的组件

## DapperQueryBuilder

DapperQueryBuilder是扩展库，它增强了Dapper的功能，特别是关于动态SQL查询和命令的构建。它提供了字符串插值和Fluent API的操作方式，让我们构建复杂的动态查询变得更加直观和简单，并且没有SQL注入的风险。

仓库地址：https://github.com/Drizin/DapperQueryBuilder



示例

```c#
//Dapper代码量：需要定义SQL语句、参数列表对象
var dynamicParams = new DynamicParameters();
string sql = "SELECT * FROM Product WHERE 1=1";
sql += " AND Name LIKE @productName"; 
dynamicParams.Add("productName", productName);
sql += " AND ProductSubcategoryID = @subCategoryId"; 
dynamicParams.Add("subCategoryId", subCategoryId);
var products = cn.Query<Product>(sql, dynamicParams);


//DapperQueryBuilder：字符串插值的方式，更加直观而且代码量更少
var query = cn.QueryBuilder($"SELECT * FROM Product WHERE 1=1");
query += $"AND Name LIKE {productName}"; 
query += $"AND ProductSubcategoryID = {subCategoryId}"; 
var products = query.Query<Product>();
```

示例资料：https://mp.weixin.qq.com/s/m0NsFAJORqHipWk7mo0fRA
