---
title: 读写分离
lang: zh-CN
date: 2021-05-14
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - 无
filename: douxiefenli
slug: ldbps5
docsId: '31804964'
---
基本逻辑就是让主数据库处理事务性增删改操作，而从数据库处理select查询操作，数据库复制被用来把事务性操作导致的变更同步到集群中的从数据库。
 
使用原因：因为写比读更加耗时，读写分离解决的是数据库的写入，影响了查询的效率。
 
原理：在主服务器上修改，数据会同步到从服务器，从服务器只能提供读取数据，不能写入，实现备份的同时也实现了数据库性能的优化，以及提升了服务器安全。
