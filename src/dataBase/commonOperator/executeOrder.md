---
title: 执行顺序
lang: zh-CN
date: 2024-02-25
publish: true
author: 小松聊PHP进阶
isOriginal: false
category:
  - dataBase
tag:
  - 执行
---

::: tip

注意本文是SQL执行顺序，不是MySQL内部执行流程。
MySQL并非像PostgreSQL（被认为是最接近 SQL 标准的数据库之一）一样严格按照SQL标准，MySQL执行引擎会根据查询的具体情况和优化策略来决定具体的执行顺序，所以SQL执行顺序是理论顺序。

:::

## 书写顺序

```sql
select...from...join...on...where...group by...having...order by...limit...
```

## 执行顺序

```sql
from->join->on->where->group by->having->select->order by->limit
```

## SQL书写顺序与执行顺序不一致的原因？

SQL语言设计受到了数学中的关系代数和元组演算的影响。这些数学理论中并没有考虑操作顺序，历史原因造成SQL书写上的差异。
中国的语法是姓在前名在后，英文的反过来。国内是年月日，英文是月日年，文化上的差异，也是造成SQL顺序别扭的原因之一。

## SQL执行顺序的逻辑是什么？

1. from用于确定操作对象，放第一位毋庸置疑。
2. join和on用于关联，后面的各种处理逻辑依附于关联后内部创建的临时表，先生成数据集，才能为后续处理做基础。
3. where用于筛选，可以减少后续操作的数据量，提高查询性能。
4. group by用于对数据进行分类汇总，不放where前面，是为了避免分组后的数据被where过滤掉（分组分了个寂寞），造成算力浪费和内存资源（数据量大还是很消耗算力和内存的）的问题。
5. having用于对分组结果进行过滤，所以要在group by之后。
6. select用于决定迭代显示那些列，而不是限制只有这些列才可以参与处理，上游的各种操作（如复杂的where条件）不能受select字段的影响，这也是where后面跟的字段，不必在select出现的原因。select的本意是处理数据后仅仅返回这些字段，而不是决定只有这些字段进行数据处理，所以必定要放偏后的位置。
7. order by用于结果进行排序，肯定是结果处理后才排序的，理由和group by相似。
8. limit用于限制返回结果的行数和偏移量，必须是等筛选完分组完拍完序之后再限制，否则可能导致结果有误。

## 为什么SQL执行不是先group by再where？

先分组再筛选，逻辑上说的过去，相当于整理好数据再筛选，类似于创建索引和使用索引的过程，这也是问题的由来。
如果group by放在where之前执行，则需要对大量数据进行分组，分组后还要对每个组进行筛选，事先分组好的部分数据又被过滤掉了，造成算力和内存浪费，可能导致内存不足或者性能问题，这不是一个优秀的选择，倒不如先筛选过滤大量数据，然后对少量数据分组。

## 为什么SQL执行要先select再order by？

尝试select field2 from table order by field1，select后面没跟order by后面的field1也不报错。
根据结果反推：select影响不到order by，所以先order by在select也说的过去。
但是：select字段的别名可以在order by中使用，如果反过来就达不到这样的效果了。

## 为什么MySQL的where比having效率更高？

mysql执行时，先执行from用于定位操作对象，然后就是where，可能百万条的数据经过where之后只剩下几十条，然后在进行之后的操作。而group by比where多了一个环节。

## 聚合函数参与筛选条件，为什么只能用having？

```
//报错，Invalid use of group function
select field from table where avg(field) > 2
//需要修改为
select field from table group by field having avg(field) > 2
```

聚合函数（常见的avg、sum、count、min、max）需要在分组之后才能计算，执行到where时还没有分组，此时对分组进行数据处理，所以报错。相当于要喝一口还没生产的可乐，不符合事物的发展规律。

## 为什么使用聚合函数有分组的前提？

所谓聚合函数，就是对一组数据进行汇总计算，所以有分组的前提。即便没有使用group by显式声明，SQL也会对上游过来的数据集进行默认分组（隐式分组）。

## 为什么字段别名不能在where中使用？

where执行在select之前，此时别名未生效。

## 为什么group by和having执行顺序优先于select，却可以使用字段别名？

可以肯定进行了预加载，不然一定找不到别名，会报错的。
参考官网：https://dev.mysql.com/doc/refman/8.0/en/group-by-handling.html
文章说：标准 SQL 也不允许在子句中使用别名，MySQL扩展了标准SQL以允许别名。标准 SQL 不允许在子句中使用别名，MySQL扩展了标准SQL，详细的底层原理，文档并未说明。

## 来源

转自：小松聊PHP进阶

链接：https://www.cnblogs.com/phpphp/p/18013733

