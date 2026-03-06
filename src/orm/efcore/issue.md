---
title: 问题
lang: zh-CN
date: 2023-11-23
publish: true
author: azrng
isOriginal: true
category:
  - orm
tag:
  - issue
---

## pgsql默认true问题

场景：将表中一个bool类型的值显式设置该字段默认值为true，然后插入false的值时候，生成sql如下

```
Executed DbCommand (44ms) [Parameters=[@p0='7132734341593665537', @p1='admin11' (Nullable = false), @p2='2023-11-21T06:19:46.8346319Z' (DbType = DateTime), @p3='1', @p4='6934152201521549313', @p5='2023-11-21T06:19:46.83
46326Z' (DbType = DateTime), @p6='张三' (Nullable = false), @p7='654321' (Nullable = false), @p8='1'], CommandType='Text', CommandTimeout='30']
INSERT INTO sample."user" (id, account, create_time, credit, group_id, modify_time, name, pass_word, sex)
VALUES (@p0, @p1, @p2, @p3, @p4, @p5, @p6, @p7, @p8)
RETURNING deleted;
```

最后插入的值一直是true，插入不了false的值。

