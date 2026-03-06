---
title: 查询SQL
lang: zh-CN
date: 2021-05-14
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - 无
filename: chaxunsql
slug: mbn2db
docsId: '31804971'
---
可通过开启慢查询日志找出较慢的SQL
sql语句尽可能简单：一个sql只能在一个cpu运算；大语句拆小语句，减少锁时间；一条大SQL可以堵死整个库
or改写成in：or的效率是n级别，in的效率是log（n）级别，in的个数建议控制在200以内
不用函数和触发器，在应用程序实现
避免%xx式查询
少用join
使用同类型进行比较，比如‘123’和‘123’比，123和123比
尽量避免在where子句中使用！=或<>操作符，否则将引擎放弃使用索引而进行全表扫描
对于连续数值，使用between不用in：select id from t where num between 1 and 5
列表数据不要拿全表，要使用limit来分页，每页数量也不要太大
