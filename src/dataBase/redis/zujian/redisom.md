---
title: RedisOM
lang: zh-CN
date: 2022-03-04
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - 无
filename: redisom
slug: lnrwk3
docsId: '61529328'
---

## 介绍
支持使用 [LINQ](https://www.oschina.net/action/GoToLink?url=https%3A%2F%2Fgithub.com%2Fredis%2Fredis-om-spring) 查询 Redis 域对象

### 安装redis
```csharp
docker run -p 6379:6379 redislabs/redismod:preview
```

## 操作
没有查询到数据
```csharp
var provider = new RedisConnectionProvider("redis://localhost:6379");
           
var connection = provider.Connection;
//只执行一次
// connection.CreateIndex(typeof(Customer));
var customers = provider.RedisCollection<Customer>();
//customers.Insert(new Customer
//{
//    Age = 1,
//    Email = "bbb",
//    FirstName = "aaa",
//    LastName = "bbb"
//});
//customers.Save();


var bb = customers.Where(x => x.LastName == "e").Select(x => x.FirstName);
```

## 参考文档
github：[https://github.com/redis/redis-om-dotnet](https://github.com/redis/redis-om-dotnet)
