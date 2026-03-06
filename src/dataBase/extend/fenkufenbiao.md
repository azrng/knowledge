---
title: 分库分表
lang: zh-CN
date: 2023-07-29
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - 无
filename: fenkufenbiao
slug: gcwq5f
docsId: '29711508'
---

## 前言

分库分表，首先要知道瓶颈在哪里，然后才能合理进行拆开，不可为了分库分表而拆分
只要能满足需求，拆分规则越简单越好。

## 需要分库分表的场景

### IO瓶颈
第一种：磁盘读IO瓶颈，热点数据太多，数据库缓存放不下，每次查询时会产生大量的IO，降低查询速度 -> 分库和垂直分表。
第二种：网络IO瓶颈，请求的数据太多，网络带宽不够 -> 分库。

### CPU瓶颈
第一种：SQL问题，如SQL中包含join，group by，order by，非索引字段条件查询等，增加CPU运算的操作 -> SQL优化，建立合适的索引，在业务Service层进行业务计算。
第二种：单表数据量太大，查询时扫描的行太多，SQL效率低，CPU率先出现瓶颈 -> 水平分表。


## 操作 

### 水平分库
![image.png](/common/1609925669140-4cfa24c6-ff66-488b-9ff1-22d300859a31.png)
**概念**：以字段为依据，按照一定策略（hash、range等)，将一个库中的数据拆分到多个库中。
**结果**：
每个库的结构都一样；
每个库的数据都不一样，没有交集；
所有库的并集是全量数据；
**场景**：系统绝对并发量上来了，分表难以根本上解决问题，并且还没有明显的业务归属来垂直分库。
**分析**：库多了，io和cpu的压力自然可以成倍缓解。

### 水平分表
![image.png](/common/1609925669117-362f079e-f761-44ef-b29a-caadfaa21998.png)
**概念**：以字段为依据，按照一定策略（hash、range等），将一个表中的数据拆分到多个表中。
**结果**：
每个表的结构都一样；
每个表的数据都不一样，没有交集；
所有表的并集是全量数据；
**场景**：系统绝对并发量并没有上来，只是单表的数据量太多，影响了SQL效率，加重了CPU负担，以至于成为瓶颈。推荐：[一次SQL查询优化原理分析](http://mp.weixin.qq.com/s?__biz=MzI4Njc5NjM1NQ==&mid=2247491313&idx=2&sn=01d82309c459c7385a2ccf0018bb0d8a&chksm=ebd621dddca1a8cb16f33497c45aeb44e95ca0d5289afee263e047a868cb67f34ada644418b0&scene=21#wechat_redirect)
**分析**：表的数据量少了，单次SQL执行效率高，自然减轻了CPU的负担。



```csharp
// 示例分表逻辑
//- 按患者ID哈希分表（适合按患者查询为主的场景）
//- 复合分表键（患者ID+其他搜索的场景）
public static string GetTableName(string patientId)
{
    // 方法1：按患者ID哈希分16张表
    int hash = Math.Abs(patientId.GetHashCode()) % 16;
    return $"medical_indicator_{hash}";
}
```

### 垂直分库
![image.png](/common/1609925669141-f8475a1e-15ec-4d0c-9afc-943d7a7becd7.png)
**概念**：以表为依据，按照业务归属不同，将不同的表拆分到不同的库中。
**结果**：
每个库的结构都不一样；
每个库的数据也不一样，没有交集；
所有库的并集是全量数据；
**场景**：系统绝对并发量上来了，并且可以抽象出单独的业务模块。
**分析**：到这一步，基本上就可以服务化了。例如，随着业务的发展一些公用的配置表、字典表等越来越多，这时可以将这些表拆到单独的库中，甚至可以服务化。再有，随着业务的发展孵化出了一套业务模式，这时可以将相关的表拆到单独的库中，甚至可以服务化。

 


### 垂直分表
![image.png](/common/1609925669134-77f1cbdc-eb16-42e9-919a-f789b8ff3d81.png)
**概念**：以字段为依据，按照字段的活跃性，将表中字段拆到不同的表（主表和扩展表）中。
**结果**：
每个表的结构都不一样；
每个表的数据也不一样，一般来说，每个表的字段至少有一列交集，一般是主键，用于关联数据；
所有表的并集是全量数据；
**场景**：系统绝对并发量并没有上来，表的记录并不多，但是字段多，并且热点数据和非热点数据在一起，单行数据所需的存储空间较大。以至于数据库缓存的数据行减少，查询时会去读磁盘数据产生大量的随机读IO，产生IO瓶颈。
**分析**：可以用列表页和详情页来帮助理解。垂直分表的拆分原则是将热点数据（可能会冗余经常一起查询的数据）放在一起作为主表，非热点数据放在一起作为扩展表。这样更多的热点数据就能被缓存下来，进而减少了随机读IO。拆了之后，要想获得全部数据就需要关联两个表来取数据。
但记住，千万别用join，因为join不仅会增加CPU负担并且会讲两个表耦合在一起（必须在一个数据库实例上）。关联数据，应该在业务Service层做文章，分别获取主表和扩展表数据然后用关联字段关联得到全部数据。

## 分库分表工具

shardingCore：https://xuejmnet.github.io/sharding-core-doc/

sharding-sphere：jar，前身是sharding-jdbc；
TDDL：jar，Taobao Distribute Data Layer；
Mycat：中间件。

## 其他资料

示例GitHub地址：[https://github.com/littlecharacter4s/study-sharding](https://github.com/littlecharacter4s/study-sharding)
