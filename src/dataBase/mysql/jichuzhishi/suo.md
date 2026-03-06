---
title: 锁
lang: zh-CN
date: 2022-12-26
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - 无
filename: suo
slug: wx4ov64yletflo5m
docsId: '110231702'
---

## 概述
MySQL数据库的锁，按照作用范围划分为：行级锁、页级锁和表级锁，行级锁是锁定粒度最细的一种锁，能大大减少数据库操作的冲突。

## 行级锁
行级锁又分为共享锁和排他锁两种

### 共享锁
（Share Lock）又称读锁，是读取操作创建的锁。其他用户可以并发读取数据，但任何事务都不能对数据进行修改（获取数据上的排他锁），直到已释放所有共享锁。
如果事务T对数据A加上共享锁后，则其他事务只能对A再加共享锁，不能加排他锁。获准共享锁的事务只能读数据，不能修改数据
用法
SELECT … LOCK IN SHARE MODE;

### 排他锁
（Exclusive Lock）排他锁又称写锁、独占锁，如果事务T对数据A加上排他锁后，则其他事务不能再对A加任何类型的封锁。获准排他锁的事务既能读数据，又能修改数据。
用法
SELECT … FOR UPDATE;
