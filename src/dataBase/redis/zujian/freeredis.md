---
title: FreeRedis
lang: zh-CN
date: 2023-09-02
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - 无
filename: freeredis
slug: olgl1lngdaz09mci
docsId: '131940369'
---

## 概述
FreeRedis 是基于 .NET 的 Redis 客户端，支持 .NET Core 2.1+、.NET Framework 4.0+ 和 Xamarin。
仓库地址：[https://github.com/2881099/FreeRedis](https://github.com/2881099/FreeRedis)

## 操作

### 基础操作
```csharp
var redisClient = new RedisClient("localhost:6379,password=123,defaultDatabase=1");
await redisClient.SetAsync("jsonFormat", jsonToBase64, 1000);
```
