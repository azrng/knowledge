---
title: 拓展
lang: zh-CN
date: 2023-09-23
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - 无
filename: tazhan
slug: zw1d4c
docsId: '26493354'
---

## 纵向分割与横向分割
**1. 纵向分表**
纵向分表是指将一个有20列的表根据列拆分成两个表一个表10列一个表11列，这样单个表的容量就会减少很多，可以提高查询的性能，并在一定程度上减少锁行，锁表带来的性能损耗。
纵向分表的原则是什么呢，应该怎样拆分呢？答案是根据业务逻辑的需要来拆分，对于一张表如果业务上分两次访问某一张表其中一部分数据，那么就可以根据每次访问列的不同来做拆分; 另外还可以根据列更新的频率来拆分，例如某些列每天要更新3次，有些列从创建开始基本上很少更新。
举例：
假定场景，我有一张用户表，这张表包含列：
ID, UserName, Password, RealName, Gender, Email, IsEmailValid, Birthday, Country, City, Address, Mobile, Phone, ZipCode, Hometown, OfficePhone, Company, Position, Industry, LatestLoginTime, LatestLoginIP, LoginTimes,OnlineMinutes
假定现在我们的登录出现了性能问题，用户登录经常出现数据库超时的现象。我们打算用拆表的方法解决这个问题。先看下涉及到登录的字段有：UserName,Password,LatestLoginTime,LatestLoginIP,LoginTimes；那么我们就可以以此为依据将原表拆分为：UserLogin和UserBase 两个表，后者包含除了登录信息的其他列信息；两张表都要包含主键ID。
**2. 横向分区**
横向分区是将表从行的角度拆分，例如将创建时间在05年之前的数据放在一个分区上，将05年到08年之间的数据放到另一个分区上，以此类推。横向分区所根据的列必须在聚集索引上，通常会根据时间，主键id等进行划分。
横向分区将数据划分为不同的区，在根据分区列条件进行查询时可以缩小查询的范围，从而提高查询的性能；另外如果数据库服务器有多个cpu，则可以通过并行操作获得更好的性能。
到底要根据那个列进行横向的分区和查询有关系，我们在建表的时候需要分析，会根据那个列进行查询。
举例：
1. 订单是一个实效性很强的实体，我们很少查询几年前的订单数据，我们就可以在订单的创建时间列上创建分区函数来做分区。
2. 比如帖子通常情况下只有在首页推荐的最新的帖子被访问次数很多，而几年前的帖子被访问的几率较小，这时候我们可以根据帖子的主键id来做分区，id小于300w的在一个分区上，id在300到600w之间的在一个分区上。

## 同比环比
同比：相邻时间段的某一个相同时间点进行比较。
比如13年3月和14年3月比较
环比：相邻时间段的比较。
比如13年全年和14年全年进行比较


## 内存使用情况
```sql
-- 查询SqlServer总体的内存使用情况
select      type
        , sum(virtual_memory_reserved_kb) VM_Reserved
        , sum(virtual_memory_committed_kb) VM_Commited
        , sum(awe_allocated_kb) AWE_Allocated
        , sum(shared_memory_reserved_kb) Shared_Reserved
        , sum(shared_memory_committed_kb) Shared_Commited
        --, sum(single_pages_kb)    --SQL2005、2008
        --, sum(multi_pages_kb)        --SQL2005、2008
from    sys.dm_os_memory_clerks
group by type
order by type


-- 查询当前数据库缓存的所有数据页面，哪些数据表，缓存的数据页面数量
-- 从这些信息可以看出，系统经常要访问的都是哪些表，有多大？
select p.object_id, object_name=object_name(p.object_id), p.index_id, buffer_pages=count(*) 
from sys.allocation_units a, 
    sys.dm_os_buffer_descriptors b, 
    sys.partitions p 
where a.allocation_unit_id=b.allocation_unit_id 
    and a.container_id=p.hobt_id 
    and b.database_id=db_id()
group by p.object_id,p.index_id 
order by buffer_pages desc 


-- 查询缓存的各类执行计划，及分别占了多少内存
-- 可以对比动态查询与参数化SQL（预定义语句）的缓存量
select    cacheobjtype
        , objtype
        , sum(cast(size_in_bytes as bigint))/1024 as size_in_kb
        , count(bucketid) as cache_count
from    sys.dm_exec_cached_plans
group by cacheobjtype, objtype
order by cacheobjtype, objtype


-- 查询缓存中具体的执行计划，及对应的SQL
-- 将此结果按照数据表或SQL进行统计，可以作为基线，调整索引时考虑
-- 查询结果会很大，注意将结果集输出到表或文件中
SELECT  usecounts ,
        refcounts ,
        size_in_bytes ,
        cacheobjtype ,
        objtype ,
        TEXT
FROM    sys.dm_exec_cached_plans cp
        CROSS APPLY sys.dm_exec_sql_text(plan_handle)
ORDER BY objtype DESC ;
GO

```

## 资料 
 
[https://blog.csdn.net/gslzydwgh/article/details/57405898?utm_source=blogxgwz2](https://blog.csdn.net/gslzydwgh/article/details/57405898?utm_source=blogxgwz2)
