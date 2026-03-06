---
title: 概述
lang: zh-CN
date: 2023-08-29
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - 无
filename: gaishu
slug: nmgu95
docsId: '97310439'
---

## 简介
LiteDB 是一个小型、快速、轻量级的 .NET NoSQL 嵌入式数据库，也就是我们常说的 K/V 数据库，完全用 C## 托管代码开发，并且是免费和开源的。它非常适合在移动应用 （Xamarin iOS/Android）和小型的桌面/Web 应用中使用。

LiteDB 的灵感来自 MongoDB 数据库，所以它的 API 和 MongoDB 的 .NET API 非常相似。

LiteDB是一个轻量级的嵌入式数据库，它是用C#编写的，适用于.NET平台。它的设计目标是提供一个简单易用的数据库解决方案，可以在各种应用程序中使用。
LiteDB使用单个文件作为数据库存储，这个文件可以在磁盘上或内存中。它支持文档存储模型，类似于NoSQL数据库，每个文档都是一个JSON格式的对象。这意味着你可以存储和检索任意类型的数据，而不需要预定义模式。
LiteDB提供了一组简单的API来执行各种数据库操作，包括插入、更新、删除和查询。它还支持事务，可以确保数据的一致性和完整性。
LiteDB还提供了一些高级功能，如索引、全文搜索和文件存储。索引可以加快查询的速度，全文搜索可以在文本数据中进行关键字搜索，文件存储可以将文件直接存储在数据库中。
LiteDB的优点包括易于使用、轻量级、快速和可嵌入性。它的代码库非常小，可以很容易地集成到你的应用程序中。此外，它还具有跨平台的能力，可以在Windows、Linux和Mac等操作系统上运行。
总之，LiteDB是一个简单易用的嵌入式数据库，适用于各种应用程序。它提供了一组简单的API来执行数据库操作，并支持一些高级功能。如果你需要一个轻量级的数据库解决方案，可以考虑使用LiteDB。

## 功能特性
•  无服务器 NoSQL 文档存储
•  类似于 MongoDB 的简洁 API
•  支持 .NET 4.5 / NETStandard 2.0
•  线程安全
•  LINQ 查询的支持
•  具有完整事务支持的 ACID
•  单文件存储，类似于 SQLite
•  存储文件和流数据
•  LiteDB Studio - 数据查询工具
•  开源免费

## 操作
创建实体类
```csharp
public class Customer
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int Age { get; set; }
    public string[] Phones { get; set; }
    public bool IsActive { get; set; }
}
```
创建数据库连接
```csharp
using var db = new LiteDatabase(@"MyData.db");
// 获取 Customers 集合
var col = db.GetCollection<Customer>("customers");
// 在 Name 字段上创建唯一索引
col.EnsureIndex(x => x.Name, true);

// 创建一个对象
var customer = new Customer
{
    Name = "John Doe",
    Phones = new string[] { "8000-0000", "9000-0000" },
    IsActive = true,
    Age = 39,
};

// 数据插入
col.Insert(customer);

// 数据查询
List<Customer> list = col.Find(x => x.Age > 20).ToList();
Customer user = col.FindOne(x => x.Age > 20);

// 数据删除
col.Delete(user.Id);
```

## 资料

谈谈 .NET8 平台中对 LiteDB 的 CRUD 操作：https://mp.weixin.qq.com/s/D7R5H5IVcok2Ax9RDadv_g
