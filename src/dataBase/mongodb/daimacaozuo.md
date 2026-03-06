---
title: 代码操作
lang: zh-CN
date: 2023-08-05
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - 无
filename: daimacaozuo
slug: rer69m34t3x586xg
docsId: '133150591'
---

## 连接
连接数据库并查询
```csharp
var client = new MongoClient("mongodb://localhost:27017");
var database = client.GetDatabase("mydatabase");
var collection = database.GetCollection<MyEntity>("mycollection");

// 使用 Builders<T>.Filter.Eq 进行查询
var filter = Builders<MyEntity>.Filter.Eq(x => x.Id, "62a39d27025ca1ba8f1f1c1e");
var result = collection.Find(filter).FirstOrDefault();
```

## 查询
查询时间类型
```csharp
using MongoDB.Bson;
using System;

// 构建查询条件
var filter = Builders<BsonDocument>.Filter.Eq("DateTime", new BsonDocument("$date", new BsonDocument("$numberLong", "1654027230566")));

// 执行查询
var result = collection.Find(filter).FirstOrDefault();

// 获取 DateTime 值
if (result != null)
{
    BsonDateTime bsonDateTime = result["DateTime"].AsBsonDateTime;
    DateTime dateTime = bsonDateTime.ToUniversalTime();
    // 使用获取到的 DateTime 值进行后续操作
}
```

## 资料
[https://mp.weixin.qq.com/s/QDvE7fgQ_xU9CILXxtAEmA](https://mp.weixin.qq.com/s/QDvE7fgQ_xU9CILXxtAEmA) | MongoDB 索引以及在.NET7 中如何创建索引
[https://mp.weixin.qq.com/s/Pj1vc5F0FP8Y0HJxxURNDA](https://mp.weixin.qq.com/s/Pj1vc5F0FP8Y0HJxxURNDA) | MongoDB入门与实战：学习总结目录
[https://mp.weixin.qq.com/s/L89x_MBfo9FVNsxXZonYKA](https://mp.weixin.qq.com/s/L89x_MBfo9FVNsxXZonYKA) | MongoDB读写分离设置
