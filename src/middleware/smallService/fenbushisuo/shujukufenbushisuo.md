---
title: 数据库分布式锁
lang: zh-CN
date: 2022-03-25
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: shujukufenbushisuo
slug: iaa24w
docsId: '71014567'
---

## 实现原理

可以借助sql语句中有添加数据，如果数据存在就返回false来判断是否获取到锁
