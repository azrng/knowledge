---
title: 内存优化
lang: zh-CN
date: 2021-05-14
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - 无
filename: neicunyouhua
slug: gzac7g
docsId: '32429683'
---

#### 控制key的长度
过长的key名称也会占用过多的内存空间，所以在保证key简单清晰的前提下，尽可能把key定义的短一些。

#### 避免存储bigkey
避免存储过大的值，建议

- string：大小控制在10kb以下
- list/hash/set/zset：元素数量控制在1万以下

#### 选择合适的数据类型
字符串和数值存储为string类型
hasg、zset存储的元素数量控制在转换阈值以下，以压缩列表存储

#### 把redis当作缓存使用
因为存储在内存中，这就意味着资源也是有限的，你在使用的时候要记住把他当作缓存来使用，而不是把他当作一个数据库来使用，写入到缓存中的数据，应该尽可能的都设置过期时间。

#### 
