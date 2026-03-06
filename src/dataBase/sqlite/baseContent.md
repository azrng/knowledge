---
title: 基础知识
lang: zh-CN
date: 2022-10-01
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - 无
---

## 数据库

### 所有表

```csharp
select name
from sqlite_master
where type = 'table'
order by name;
```

### 是否存在表

```csharp
select count(1)
from sqlite_master
where type = 'table' and name='{0}';
```

## 表

### 创建表
```
create table DBCHMConfig
(
    Id          integer PRIMARY KEY autoincrement,
    Name        nvarchar(200) unique,
    DBType      varchar(30),
    Server      varchar(100),
    Port        integer,
    DBName      varchar(100),
    Uid         varchar(50),
    Pwd         varchar(100),
    ConnTimeOut integer,
    ConnString  text,
    Modified    text
);
```

### 查询数据
```sql
-- 查询加排序
select * from DBCHMConfig order by Modified desc
```

## 程序操作

### C#连接

安装nuget包，比如安装SQLitePCLRaw.bundle_e_sqlite3。

```c#
var connectStr = "Data Source=:memory:";// 代表在内存中测试，不创建文件
var connect = new SqliteConnection(connectStr);
connect.Open();
```



