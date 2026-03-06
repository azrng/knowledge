---
title: 存储过程
lang: zh-CN
date: 2023-08-02
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - 无
filename: cunchuguocheng
slug: gmwn3w
docsId: '26499294'
---

## 定义
把复杂的操作，封装一个过程。类似于函数。

### 优点
1、复杂操作，调用简单。
2、速度快。

### 缺点：
1、封装复杂。
2、没有灵活性。
 

### 查看所有存储过程命令
1 show procedure status;
查看存储过程或函数的创建代码：
1 show create procedure proc_name;
2 show create function func_name;
调用存储命令：
1 call 名称;
删除存储过程命令：
1 DROP {PROCEDURE | FUNCTION} [IF EXISTS] 名称；
创建存储过程：
1 create procedure 名称(参数,.....)
2             begin
3                 过程体;
4                 过程体;
5             end//
参数：
1 in|out|inout 参数名称 类型(长度)
在sql语句中给变量赋值：
1 into
在过程体外声明变量：
1 @变量名
重新制定sql语句的结束符：
1 delimiter //
例子：获取5条文章记录
1 create procedure getNews()
2     begin
3         select * from news limit 5;
4     end//
例子：获取n条文章记录
1 create procedure getNewsN(in n int(5))
2     begin
3         select * from news limit n;
4     end//
例子：获取某栏目下文章的条数。
1 create procedure getNewsByType(in fid int,out num int)
2     begin
3         select count(*) into num from news where fcid=fid;
4     end//
声明变量：
1 declare 变量名 类型(长度) default 默认值;
给变量赋值：
1 set 变量名=值;
说明：
强类型。
例子：
```
1 create procedure test()
2     begin
3         declare a int default 5;
4         declare b int default 6;
5         declare c int default 0;
6         set c=a+b;
7         select c as num;
8     end//
```
1.3 条件语句
 
```
 1 if 条件 then
 2   语句;
 3 else
 4   语句;
 5 end if;
 6 
 7 if 条件then
 8   语句;
 9 elseif 条件then
10    语句;
11 .....
12 else
13 
14 end if;
15 
16 循环语句17 while 循环条件 do
18    循环体;
19    变换步长;
20 end while;
例子：输出1到10之间偶数
 1 create procedure oshu()
 2    begin
 3        declare i int default 1;
 4        while i<11 do
 5             if i%2 = 0  then
 6                 select i;
 7             end if;
 8             set i=i+1;
 9        end while;
10     end//
```
例子：使用存储过程实现 购物
```
 1 create procedure buy1(in pidn int,in uidn int,in numn int)
 2 begin
 3   declare jiage float(7,2) default 0.00;
 4   declare zongjia float(9,2) default 0.00;
 5   declare e tinyint(1) default 0;
 6   declare continue handler for SQLEXCEPTION set e=1;
 7   -- 获取价格 8   select price into jiage from productn where pid=pidn;
 9   -- 算出总价10    set zongjia=jiage*numn;
11    -- 开启事务12    start transaction;
13    -- 扣款14    update usern set money=money-zongjia where uid=uidn;
15    -- 出库16    update productn set num=num-numn where pid=pidn;
17    -- 判断是否有异常18    if e=1 then
19       rollback;
20       select 0 as re;
21    else
22       commit;
23       select 1 as re;
24    end if;
25 end//
```
获取异常：
1 declare continue handler for SQLEXCEPTION set e=1;
 
 
参考资料：[https://www.cnblogs.com/yuanwanli/p/9022617.html](https://www.cnblogs.com/yuanwanli/p/9022617.html)
