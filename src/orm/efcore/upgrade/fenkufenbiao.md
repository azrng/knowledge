---
title: 分库分表
lang: zh-CN
date: 2023-04-02
publish: true
author: azrng
isOriginal: true
category:
  - orm
tag:
  - 无
filename: fenkufenbiao
slug: nghqe3wpg0c3lhbk
docsId: '116787577'
---


## 操作

### 配置动态Schema
首先在EfCore在指定表名的时候，是可以顺带指定schema的，例如
```csharp
builder.ToTable(genericType.Name.ToLower(), "sample");
```
但是你修改了不起作用，是因为 EF 生成模型并仅运行一次 OnModelCreating，出于性能考虑，缓存了结果。 但是，可以挂接到模型缓存机制，使 EF 知道生成不同模型的属性。
所以就需要重写IModelCacheKeyFactory，并且要将服务替换为正确的实现；
参考资料：[https://www.shuzhiduo.com/A/pRdBaDa25n/](https://www.shuzhiduo.com/A/pRdBaDa25n/)

## ShardingCore

仓库地址：[https://github.com/Coldairarrow/EFCore.Sharding](https://github.com/Coldairarrow/EFCore.Sharding)

https://mp.weixin.qq.com/s/TDW2sZHPKYRDPWlsBA-aQg | ShardingCore 如何呈现“完美”分表
https://mp.weixin.qq.com/s/Eaer-QjHz-uIkR4p5WAeXw | “ShardingCore”是如何针对分表下的分页进行优化的
https://mp.weixin.qq.com/s/wyt0uUk37D3sY6RopdZBFQ | 支持c#的分表分库组件-Ctrip DAL
https://mp.weixin.qq.com/s/7wg583hqVyQNDTo3QzZ2dw | 分库分表下极致的优化
https://mp.weixin.qq.com/s/UBu03KLC3H5_clJ1sirEwA | MariaDB Spider 数据库分库分表实践 分库分表
https://mp.weixin.qq.com/s/QfidtLyBB0EeDKi-57D1fw | 分库分表之历史表如何选择最佳分片路由规则
efcore  分表  https://www.cnblogs.com/xuejiaming/p/15173965.html#!comments
https://www.cnblogs.com/xuejiaming/p/15728340.html
https://mp.weixin.qq.com/s/ZwhLCzVs1foBvzBdeHCwGQ | .NET 分库分表高性能：瀑布流分页

efcore如何优雅的实现按年分库按月分表https://www.cnblogs.com/xuejiaming/p/18198827

## 参考文档

具有相同DbContext的交替模型：[https://learn.microsoft.com/zh-cn/ef/core/modeling/dynamic-model](https://learn.microsoft.com/zh-cn/ef/core/modeling/dynamic-model)
分库分表查询优化：[https://mp.weixin.qq.com/s/S1P_gDHjDPh-Cn-8dw5jHg](https://mp.weixin.qq.com/s/S1P_gDHjDPh-Cn-8dw5jHg)
