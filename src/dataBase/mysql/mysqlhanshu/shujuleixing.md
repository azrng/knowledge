---
title: 数据类型
lang: zh-CN
date: 2023-09-03
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - 无
filename: shujuleixing
slug: hx4n14
docsId: '26499034'
---


 
 
 
------字符串相关函数------
1.获取字符串的长度   char_length(str);
获取所有员工的姓名和姓名的字符长度：
select ename,char_length(ename) from emp;
2.获取字符串      instr(str,substr);
select instr(‘abcdefgh’,’d’);
3.插入字符串 insert(str,start,length,newstr);
select insert (‘abcdefg’,3,2,’m’);
4.转大写  转小写
select upper(‘abc’),lower(‘NBA’);
5.左边截取和右边截取
select left(‘abcdefg’,2),right(‘abcdefg’,2);
6.去两端空白
select trim(‘ a b ’);
7.截取字符串
select substring (‘abcdefg’,3,2);
8.重复  repeat(str,count);
select repeat(‘ab’,2);
9.替换   replace(str,old new);
select replace(‘This is my sql’,’my’,’your’);
10.反转   reverse (str);
select reverse(‘abc’);
 
 
------数学相关函数------
1.向下取整floor(num)
select floor(3.84);
2.四舍五入round(num)
select round(3.84);
round(num,m); m代表小数位数
select round(3.123456,3);//3.123
3.非四舍五入 truncate(num,m)
select truncate(3.84567,3);//3.845
4.随机数rand()
select floor(rand()*6)+5;//  5-10随机数
select floor(rand()*6)+3; //3-8 随机数
 
 
------分组查询------ group by 分组关键词
分组函数与聚合函数结合使用，以组为单位统计。
           题目中每个xxx 就在group by后面写xxx
1.查询每个部门的最高工资
select deptno,max(sal) from emp group by deptno;
2.查询每个部门的平均工资
select deptno, avg(sal) from emp group by deptno;
3.查询每个分类下商品的最低价格
select category_id,min(price) from t_item group by category_id;
4.查询每个部门中工资大于1500的人数
select deptno,count(*) from emp where sal>1500 group by deptno;
5.查询每个领导的手下人数
select mgr,count(*) from emp where mgr is not null group by mgr;
6.查询每个商品分类的库存总量
select category_id,sum(num) from t_item group by category_id;
 
 
------多字段分组查询------
1.查询每个部门下每个领导的手下人数
select deptno,mgr,count(*) from emp where mgr is not null group by deptno,mgr;
 
------having------
a.where后面只能写普通字段的条件，不能再写聚合函数
b.having后面可以写普通字段条件也可以写聚合函数，但是推荐在having后面只写聚合函数
c.having写在group by 后面。
格式： select * from 表名 where ..... group by xxx  having .... order by ..... limit ...;
2. 查询每个部门的平均工资，要求平均工资大于2000
select  deptno,avg(sal) from emp group by deptno having avg(sal)>2000;
3. 查询每个分类的平均单价，过滤掉平均单价低于100的。
select  category_id,avg(price) from  t_item group by category_id having  avg(price)>=100;
 
####练习####
1.查询每个分类商品的库存总量，要求总量高于19999
select category_id, sum(num) from t_item  group by  category_id having sum(num)>19999;
2.查询分类id为238,917的两个分类的平均单价各是多少
select  category_id,avg(price) from t_item where category_id =238 or category_id=917 group by category_id;
3.查询emp表中每个部门的平均工资高于2000的部门编号，部门人数，平均工资 最后根据平均工资降序排序
select deptno,count(*),avg(sal) from emp group by deptno having avg(sal)>2000 order by avg(sal) desc;
4.查询emp表中工资在1000-3000之间的员工，每个部门的编号，工资总和，平均工资，要求过滤掉平均工资低于2000的部门，按照工资总和降序排序
select deptno,sum(sal),avg(sal) from emp where sal between 1000 and 3000 group by deptno  having avg(sal) >2000 order by sum(sal) desc;
5. 查询emp表中不是以s开头每个职位的名字，人数，工资总和，最高工资，过滤掉平均工资是3000的职位，根据人数升序排序，如果一致根据工资总和降序排序
select job,count(*),sum(sal),max(sal) from emp where job not like ‘s%’group by job having avg(sal)!=3000 order by count(*),sum(sal) desc;
6.查询emp表每年入职的人数
select extract(year from hiredate) y,count(*) from emp group by y;
 
 
------子查询------
1. 查询emp表工资最高的员工信息
select max(sal) from emp;
//select*from emp where sal =5000;
select*from emp where sal = (select max(sal) from emp;
);
2. 查询emp表中工资高于平均工资的员工信息
select*from emp where sal>(select avg(sal) from emp);
3.查询和Jones相同工作的员工信息
select*from emp where job =(select job  from emp where ename = ‘Jones’) and ename!=’jones’;
4.查询工资最低的员工的所在部门同事信息
a.select min(sal) from emp;
b.select deptno from emp where sal=(select min(sal) from emp);
c.select*from emp where deptno =(select deptno from emp where sal=(select min(sal) from emp)) and sal!= (select min(sal) from emp);
5. 查询最后入职的员工信息
select max(hiredate) from emp;
select*from emp  where hiredate=(select max(hiredate) from emp); 
6.查询king的部门编号和部门名称 
-得到部门编号
select deptno from emp where ename=’king’;
-通过编号得到部门名称
select deptno,dname from dept where deptno =(select deptno from emp where ename=’king’);
7.    查询有员工的部门信息（需要两张表）
-得到员工表出现的部门编号
select deptno from emp group by deptno;
(select distinct deptno from emp;)
-通过部门编号得到部门信息
select *from dept where deptno in(select deptno from emp group by deptno);
8. 查询平均工资最高的部门信息（史诗级难度！！）
-得到每个部门的平均工资
a.select deptno,avg(sal) from emp group by deptno;
-得到最高的平均工资
b.select avg(sal) from emp group by deptno order by avg(sal) desc limit 0,1;
-通过最高的平均工资得到对应的部门编号
c.select deptno from emp group by deptno having avg(sal)=(select avg(sal) a from emp group by deptno order by a desc limit 0,1);
-通过部门编号得到部门信息
d.select * from dept where deptno in(select deptno from emp group by deptno having avg(sal)=(select avg(sal) a from emp group by deptno order by a desc limit 0,1));
####子查询可写的位置
a.写在where或having后面，当做查询条件的值
b.写在创建表的时候，把查询结果保存成一张新的表
create table emp_20 as (select*from emp where deptno=20);
c.写在from后面，当成一个虚拟表  **必须有别名**
 
------关联查询------
1.查询每一个员工的姓名和对应的部门名称
select e.ename,d.dname
from emp e,dept d
where e.deptno=d.deptno;
2.查询在new york工作的员工信息
select *
from emp e, dept d
where e.deptno=d.deptno and d.loc=’new york’;
3. 查询商品标题和所对应的分类名称
select a.title,b.name
from t_item a, t_item_category b
where a.category_id = b.id;
 
 
------等值连接和内连接------
等值连接：select * from A,B where A.x=B.x and ......;
内连接：select * from A join B on A.x=B.x where (条件);
 1.查询每一个员工的姓名和对应的部门名称
select e.ename,d.dname
from emp e join dept d
on e.deptno=d.deptno;
 
左/右外连接：select * from A left/right join B on A.x=B.x where (条件);
select e.ename,d.dname
from emp e left join dept d
on e.deptno=d.deptno;
 
 
------表设计之关联关系------
1.一对一
select a.username,b.nickname
from user a join userinfo b
on a.id=b.userid ;
 
Select a.username
From user a join userinfo b
On a.id=b.userid where b.nickname = ‘超人’;
 
Select a.username,a.password
From user a join userinfo b
On a.id = b.userid where b.gender=’男’;
 
Select count(*) from user where username=’wukong’ and password=’abc’;
 
 
2.一对多
select e.name,d.name
From emp e join dept d
On e.deptid=d.id;
 
Select e.name
From emp e join dept d
On e.deptid=d.id where d.name=’妖怪’;
 
 
3.多对多
Select s.name,t.name
From teacher t join t_s a
On t.id=a.tid
Join student s
On s.id=a.sid;
 
 
Select  t.name,s.name
From teacher t join t_s a
On t.id=a.tid
Join student s
On s.id=a.sid where t.name=’苍老师’;
 
Select  t.name,s.name
From teacher t join t_s a
On t.id=a.tid
Join student s
On s.id=a.sid where s.name=’小丽’;
 
 
------自关联------
Select p.name,n.name
From person p left join person n
On p.mgr=n.id;
 
 
------表设计案例：权限管理------
 
 
Select u.name,m.name
From user u join u_r ur
On u.id=ur.uid
Join r_m rm
On rm.rid=ur.rid
Join module m
On m.id = rm.mid;
 
Select u.name,m.name
From user u join u_r ur
On u.id=ur.uid
Join r_m rm
On rm.rid=ur.rid
Join module m
On m.id = rm.mid where u.name=’凤姐’;
 
------视图------
视图格式：create view 视图名 as（子查询代码）;
1.创建一个没有工资的视图
create view v_view_nosal as (select empno,ename,job,mgr,hiredate,comm,deptno from emp);
2.创建视图，视图中显示每个部门的工资总和，平均工资，最高工资，最低工资
create view v_emp_info as(select deptno,sum(sal),avg(sal),max(sal),min(sal) from emp group by deptno);
 
------视图分类------
1.简单视图：创建视图的时候不包含：去重、分组、函数、关联查询的视图称为简单视图，可以对视图中的数据进行增删改查
2.复杂视图：和简单视图相反，只能进行查询操作
------约束------
    非空约束 not null
create table t1(id int,age int not null);
insert into t1 values(1,18);
insert into t1 values(2,null);  //失败
    唯一约束 unique
create table t2(id int,age int unique);
insert into t2 values(1,20);
insert into t2 values(2,20);  //失败
主键约束
    创建表时添加：
创建表后添加：
  create table t3(id int,name varchar(10));
 alter table t3 add primary key(id);
删除主键约束：
alter table t3 drop primary key;
默认约束  default
  create table t4 (id int,age int default 10);
  insert into t4 values(1,20);
  insert into t4 values(2,null);
  insert into t4 (id) values(3);  //默认值生效
检查约束  check 
    语法支持没有效果。
外键约束
create table emp(id int primary key auto_increment,name varchar(10),deptid int,constraint fk_dept foreign key(deptid) references dept(id));
constraint   约束名称
foreign key   外键字段名
references  表名（字段名）
 
 
 
------索引------0.87
  创建索引
    create index 索引名 on 表名 （字段名[（字符长度）]）;
    e.g: create index i_item_title on item2(title);
查看索引：
show index from 表名;
show index from item2;
删除索引：
drop index 索引名 on 表名;
drop index  i_item_title on item2;
复合索引：
create index 索引名 on 表名 (字段1，字段2);
总结：
1. 索引是用于提高查询效率的技术，类似目录
2. 索引会占用磁盘空间不是越多越好
3. 如果数据量小的话 添加索引会降低查询效率
4. 尽量不要在频繁改动的表上添加索引
  ####group_concat( )   分组连接函数
1.查询员工表中 每个部门的所有员工工资 要求所有工资显示到一条数据中
select deptno, group_concat(sal) from emp group by deptno;
2.查询员工表中每个部门 的员工姓名和对应的工资 要求显示到一条数据中
select deptno, group_concat(ename,':',sal) from emp group by deptno; 
 
 
select  name,avg(score) from student group by name order by avg(score) desc;
 
 Select name,group_concat(subject,':',score) from student group by name;  
Select name,max(score) 最高分,min(score) 最低分 from student group by name;
 
 Select name,group_concat(subject,':',score ),count(*)from student where score<60 group by name;
 
 
