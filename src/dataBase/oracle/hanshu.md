---
title: 函数
lang: zh-CN
date: 2023-09-23
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - 无
filename: hanshu
slug: ll4k58
docsId: '31816827'
---

## 查询

### ROWNUM
查询前多少条
```sql
select * from t where rownum<=3;

-- 查询前十条的语句：
select * from table_name where rownum<X  

-- 分页
sql语句进行分页
select * from (select c.*,rownum r from (" + strSql + ") c where rownum<=" + (pageSize * pageIndex) + ") t where r>" + (pageIndex - 1) * pageSize;
```

### NVL

NVL(Expr1,Expr2)如果Expr1为NULL，返回Expr2的值，否则返回Expr1的值

```sql
select NVL(t.money,0)  from Money t
```

## 筛选


## 转换

### to_date
```sql
buytime<to_date('2018-01-01 00:00:00','yyyy-MM-dd hh24:mi:ss') 

to_date('2019/5/20 0:00:00','yyyy/mm/dd hh24:mi:ss')
```

## 其他
```sql

● CONCAT() >> 字符串的拼接
select "CONCAT"('hello' , NULL) a from dual
● INITCAP() >> 字符串大小写的转换
select "INITCAP"('hello.world') b from dual;
● REPLACE() >> 字符串的替换
select "REPLACE"('helloworld', 'lo', 'ol') d from dual;
● TRIM() >> 字符串消除空格
select "TRIM"('hello  world') e from dual;
● UPPER() >> 字符串转化为大写
select "UPPER"('helloworld') ffromdual;
● CEIL() >> 字符串向上取整
select "CEIL"(3.4) g from dual;
● FLOOR() >> 字符串向下取整
select "FLOOR"(3.7) h from dual;
● MOD() >> 数字取余数
select "MOD"(5, 2) i from dual;
● ROUND() >>      数值的四舍五入(2代表保留两位小数)
select "ROUND"(3.1415, 2) j from dual;
● TRUNC() >> 数值的截取
select "TRUNC"(3.1415, 3) k from dual;
● SYSDATE >> 返回当前系统日期时间
select SYSDATE l from dual;
● USER >> 返回当前用户
select USER m from dual
● LOWER() >> 字符串转换为小写
select "LOWER"('HELLworLD') n from dual
● 字符串首字母小写其余大写（demo）
select "LOWER"('h') || "UPPER"('elloworld') o from dual;
```



 

> 持续更新地址：[https://blog.csdn.net/qq_42129399/article/details/88925215](https://blog.csdn.net/qq_42129399/article/details/88925215)

