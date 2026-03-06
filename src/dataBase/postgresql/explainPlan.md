---
title: 执行计划
lang: zh-CN
date: 2023-08-09
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - 无
filename: zhihangjihua
slug: gpdl3d
docsId: '66575148'
---

## 概述
每个sql语句都有自己的执行计划，通过explain指令获取执行计划。

analyse 对比 analyze：只是英式英语与美式英语的区别，功能上没有区别，资料：[https://stackoverflow.com/questions/40943835/postgresql-analyse-vs-analyze](https://stackoverflow.com/questions/40943835/postgresql-analyse-vs-analyze)

## 使用
语法如下
```csharp
nsc=## \h explain;
Command:     EXPLAIN
Description: show the execution plan of a statement
Syntax:
EXPLAIN [ ( option [, ...] ) ] statement
EXPLAIN [ ANALYZE ] [ VERBOSE ] statement
 
where option can be one of:
 
    ANALYZE [ boolean ]  -- 是否真正执行，默认false
    VERBOSE [ boolean ]  -- 是否显示详细信息，默认false
    COSTS [ boolean ]    -- 是否显示代价信息，默认true
    BUFFERS [ boolean ]  -- 是否显示缓存信息，默认false，前置事件是analyze
    TIMING [ boolean ]   -- 是否显示时间信息
    FORMAT { TEXT | XML | JSON | YAML }  -- 输格式，默认为text
```
在explain后添加analyze关键字来通过执行这个SQL获得真实的执行计划和执行时间

## 结果介绍
执行
```csharp
explain select  * from "user".user_info where integral>500;
```
Index Scan using user_info_integral_index on user_info  (cost=0.29..8.31 rows=1 width=165)
解析：cost=0.29..8.31，前一部分表示启动时间是0.29ms，执行到返回第一行需要的cost值，后面代表总时间是8.31ms。rows表示预测的行数(与实际的记录数可能有出入)。width表示查询结果的所有字段总宽度为165字节。

actual time中的第一个数字表示返回第一行需要的时间，第二个数字表示执行整个sql花费的时间。loops为该节点循环次数，当loops大于1时，总成本为：actual time * loops
```csharp
explain analyze select  * from "user".user_info where integral>200;
```
结果
```csharp
Seq Scan on user_info  (cost=0.00..5311.07 rows=84760 width=165) (actual time=0.010..23.808 rows=84600 loops=1)
  Filter: (integral > 200)
  Rows Removed by Filter: 56686
Planning Time: 0.062 ms
Execution Time: 27.366 ms
```

## 关键字注释

### 表访问方式
Seq Scan：全表扫描
Index Scan：索引扫描
Bitmap Index Scan 位图索引
Index Only Scan：要查询的字段都有索引

### 表连接方式
Nested Loop 嵌套循环，适合被连接的数据子集较小的查询
Hash join  适用于数据量大的连接方式
Merge join 归并连接，执行性能差于哈希连接

## 运算类型(explain)
[https://blog.csdn.net/JAVA528416037/article/details/91998019](https://blog.csdn.net/JAVA528416037/article/details/91998019)

## 更新统计信息
在数据库中，统计信息是规划器生成计划的源数据。没有收集统计信息或者统计信息陈旧往往会造成执行计划严重劣化，从而导致性能问题

更新统计信息：analyze
ANALYZE语句可收集与数据库中表内容相关的统计信息，统计结果存储在系统表PG_STATISTIC中。
查询优化器会使用这些统计数据，以生成最有效的执行计划。

```sql
-- 更新单个表的统计信息
analyze 表名;

-- 更新全库的统计信息
analyze ; 
```

## ExplainFull

DiffStats 和ExplainFull 可以生成详细的报告，这些报告对于解决SQL 语句的性能问题非常有用

仓库地址：[https://github.com/ardentperf/dsef/](https://github.com/ardentperf/dsef/)

介绍资料：https://mp.weixin.qq.com/s/HlIsF3GudwYjfi9bS-arig

## Pev工具

对于冗长的 SQL，执行计划可能满满一屏幕都看不完，人肉分析费时费力，因此我们需要借助一些工具将执行计划可视化一下，这就是 PEV，一目了然，可以迅速发现高消耗节点，着重优化这些高消耗节点，四款 PEV 工具助力你成为 SQL 优化高手。

1.https://explain.depesz.com/

2.https://explain.tensor.ru/

3.https://explain.dalibo.com/plan

4.https://tatiyants.com/pev/#/plans/new

### tensor

https://explain.tensor.ru/plan    除了常规的可视化，还可以生成ER 图、索引推荐等等。

介绍：https://mp.weixin.qq.com/s/_kzXB52EeyK7FrXGWO-FsQ

## 资料

各种数据库SQL执行计划：[https://zhuanlan.zhihu.com/p/99331255](https://zhuanlan.zhihu.com/p/99331255)
[https://mp.weixin.qq.com/s/6EPKkRMgVsOcy0-RGRDmUQ](https://mp.weixin.qq.com/s/6EPKkRMgVsOcy0-RGRDmUQ) | 【干货分享】PostgreSQL-查询执行计划浅析













