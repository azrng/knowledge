---
title: 执行计划
lang: zh-CN
date: 2021-10-21
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - 无
filename: zhihangjihua
slug: lihyh3
docsId: '55673759'
---
MongoDB 查询分析可以确保我们所建立的索引是否有效，是查询语句性能分析的重要工具。
MongoDB 查询分析常用函数有：explain() 和 hint()。
explain 操作提供了查询信息，使用索引及查询统计等。有利于我们对索引的优化。
接下来我们在 users 集合中创建 gender 和 user_name 的索引：
```csharp
db.users.ensureIndex({gender:1,user_name:1}) 现在在查询语句中使用 explain ：

db.users.find({gender:"M"},{user_name:1,_id:0}).explain()
```

#### Stage 分类
COLLSCAN：扫描整个集合 IXSCAN：索引扫描 FETCH：根据索引去检索选择document
SHARD_MERGE：将各个分片返回数据进行merge
SORT：表明在内存中进行了排序（与老版本的scanAndOrder:true一致）
LIMIT：使用limit限制返回数
SKIP：使用skip进行跳过 IDHACK：针对_id进行查
SHARDING_FILTER：通过mongos对分片数据进行查询
COUNT：利用db.coll.explain().count()之类进行count
COUNTSCAN：count不使用用Index进行count时的stage返回
COUNT_SCAN：count使用了Index进行count时的stage返回 SUBPLA：未使用到索引的$or查询的stage返回
TEXT：使用全文索引进行查询时候的stage返回 PROJECTION：限定返回字段时候stage的返回

#### 查看执行计划
db.collection_name.find({}).explain(true)
find{} 里面要设置具体的查询条件，才可以查到精确的执行计划
MongoDB 查看执行计划时，最理想状态：--20180604
nReturned=totalDocsExamined=totalKeysExamined

## 资料
公众号后端Q：[https://mp.weixin.qq.com/s/Oz9LmjsudDHJL__Aup5VOw](https://mp.weixin.qq.com/s/Oz9LmjsudDHJL__Aup5VOw)
