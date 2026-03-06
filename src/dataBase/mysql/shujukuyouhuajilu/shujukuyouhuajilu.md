---
title: 数据库优化记录
lang: zh-CN
date: 2021-05-14
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - 无
filename: shujukuyouhuajilu
slug: gs38ql
docsId: '31804945'
---

## 修改语句
问题1：修改3万多条数据运行时间1秒多
UPDATE dynews_news a set a.StickState = 2 WHERE a.StickEndTime <= sysdate() and a.IsStick = 1 and a.F_DeleteMark = 0 and a.F_EnabledMark = 1; 
解决方案：对IsStick 、DeleteMark 、EnabledMark 添加普通索引；

## 查询语句
问题1：查询10000行到10010行
完美方案是：
SELECT * FROM table WHERE id BETWEEN 1000000 AND 1000010; 
如果id不是连续的一段，那么就使用下面的的方法：
SELECT * FROM table WHERE id IN(10000, 100000, 1000000...); 
 
 
 
 
 
 
 
 
[https://www.cnblogs.com/itdragon/p/8146439.html](https://www.cnblogs.com/itdragon/p/8146439.html)
 
[https://www.cnblogs.com/youyoui/p/7851007.html](https://www.cnblogs.com/youyoui/p/7851007.html)
 
[https://mp.weixin.qq.com/s/jm4J15_yqosBFNmn5f9R-w](https://mp.weixin.qq.com/s/jm4J15_yqosBFNmn5f9R-w)
