---
title: 函数
lang: zh-CN
date: 2023-12-14
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - 函数
---

## cast

转换数据类型

```sql
-- 将其他类型转换bigint类型
select cast(number as bigint) number FROM dbo.shop
```

## CONVERT

CONVERT 函数，它的语法稍显复杂，因为它支持更多的选项（如格式样式），但在这种简单转换场景中，其用法与CAST函数类似。

```
SELECT CONVERT(bigint, int_column) FROM your_table;
```

