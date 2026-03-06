---
title: MySQL函数
lang: zh-CN
date: 2023-09-03
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - 无
filename: mysqlhanshu
slug: btkbe2
docsId: '30486298'
---

## 筛选

### Limit
limit  跳过的条数，请求的数量(每页的数量)
```sql
-- MySql查询前10条数据sql语句为
select * from table_name limit 0,10;
-- 通常0是可以省略的，直接写成 limit 10。0代表从第0条记录后面开始，也就是从第一条开始。

-- 只要查询出来数据的第一条记录，那么需要写成
select * FROM SU_supplycontract t   WHERE supplyContractCode="CRM20180813002" limit 1;

-- 使用合理的分页方式来提高分页的效率，比如我们查询id大于xxx的然后取十条
select id,name from user where id> 100000 limit 20
-- 如果上述SQL语句使用(limit 100000, 20)做分页的时候，随着表数据量的增加，直接使用limit语句会越来越慢，此时，可以通过取前一页的最大ID，以此为起点，再进行limit操作，效率提升显著。


1. 查询员工表中工资降序的前5条数据
select*from emp order by sal desc limit 0,5;
2. 查询员工表中工资降序的第3页的4条数据
select*from emp order by sal desc limit 8,4;
3.查询商品表中价格升序的前10条数据
select *from t_item  order by price limit 0,10;
4.查询商品价格低于100元的商品信息第三页的三条数据
select*from t_item where price<100 limit 6,3;
5.查询10号和30号部门的员工工资在前三名的员工信息
select*from  emp where deptno=10 or deptno=30 order by sal desc limit 0,3;
```

### Like
模糊查询，很可能让你的索引失效。

- 首先尽量避免模糊查询，如果必须使用，不采用全模糊查询，也应尽量采用右模糊查询， 即like ‘…%’，是会使用索引的；
- 左模糊like ‘%...’无法直接使用索引，但可以利用reverse + function index的形式，变化成 like ‘…%’；
- 全模糊查询是无法优化的，一定要使用的话建议使用搜索引擎。
```sql
------模糊查询------ like
_(下划线)：代表单个未知字符
%：代表0或多个未知字符
举例：
1. 以a开头的字符串    a%
2. 以m结尾   %m
3. 包含x    %x%   
4. 第二个字符是a    _a%
5. 倒数第三个字母是m  %m_ _
6. 以a开头并且倒数第二个字母是b    a%b_
1. 查询名字中包含a的所有员工姓名和工资
select ename,sal from emp where ename like ‘%a%’;
2. 查询标题中包含记事本的商品标题及商品价格
select title,price from t_item where title like ‘%记事本%’;
 
3. 查询单价低于100的记事本(title包含记事本)
select*from t_item where price<100 title like ‘%记事本%’;
4.查询单价在50到200之间的得力商品(title包含得力)
select*from t_item where price between 50 and 200 and title like ‘%得力%’;
5.查询商品分类为238和917的商品信息
select*from t_item where category_id=238 or category_id=917;
select*from t_item where category_id in(238,917);
6. 查询有赠品的商品信息 （卖点sell_point中包含赠字）
select*from t_item where sell_point like ‘%赠%’;
7.查询有图片image的得力商品信息
select*from t_item where image is not null and  title like ‘%得力%’;
8.查询和得力无关的商品信息(title不包含得力)
select*from t_item where title not like ‘%得力%’;
9. 查询价格在50到100以外的商品信息
select*from t_item where price not between 50 and 100;
```

### Is Null
尽量把所有列定义为NOT NULL
```sql
-- 查询emp表中没有上级领导mgr的员工编号empno，姓名ename，工资sal
select empno,ename,sal from emp where mgr is null;
-- 查询emp表中没有奖金comm的员工姓名，工资，奖金
select ename,sal,comm from emp where comm is null;
-- 查询有奖金的所有员工信息
select*from emp where comm is not null;
```
NOT NULL列更节省空间，NULL列需要一个额外字节作为判断是否为 NULL的标志位。NULL列需要注意空指针问题，NULL列在计算和比较的时候，需要注意空指针问题。

### SUBSTR
查询关键字的前后各几个字
```plsql
SELECT SUBSTR(column_name, INSTR(column_name, 'keyword') - 10, 20) AS context
FROM table_name 
WHERE column_name LIKE '%keyword%'
```

### Find_In_Set
FIND_IN_SET(str,strList)

- str          要查询的字符串
- strList    字段名，参数以“,”分隔，如(1,2,6,8)
- 查询字段(strList)中包含的结果，返回结果null或记录。

示例
```sql
查询rootpath包含deptId的数据
select * from departmet where find_in_set('" + deptId + "', rootpath)
```
> 参考文档：[https://www.jianshu.com/p/b2c1ba0ba34f](https://www.jianshu.com/p/b2c1ba0ba34f)


### distinct
去重
```sql
-- 查询emp表中出现的所有职位job
select  distinct job from emp;
```

### in
```sql
-- 查询emp表中工资是5000，1500，3000的员工信息
select*from emp where sal=5000 or sal=1500 or sal=3000;
select*from emp where sal in(5000,1500,3000);
```

### between
```sql
-- between  x and  y
-- 查询工资在2000到3000之间的员工姓名和工资        
select ename,sal from emp where  sal>=2000 and sal<=3000;
select ename,sal from emp where  sal between 2000 and 3000;
```

## 时间

### 当前时间
```sql
-- 获取当前时间
SELECT SYSDATE(); // 2021-07-24 03:50:19
SELECT NOW(); // 2021-07-24 03:50:19
```

### 当前日期
```sql
select current_date as Systemtime; // 2021-07-24
SELECT CURDATE(); // 2021-07-24
 
 
------日期相关函数------
1.获取当前的年月日时分秒
select now();
2.获取当前的日期  current
select curdate();
3.获取当前的时间
select curtime();
4.从年月日时分秒中提取年月日
select date(now());
5.从年月日时分秒中提取时分秒
select time(now());
6.从年月日时分秒中提取时间分量 年 月 日 时 分 秒
select extract(year from now());
select extract(month from now());
select extract(day from now());
select extract(hour from now());
select extract(minute from now());
select extract(second from now());
select ename,extract(year from hiredate) from emp;
```

### DATE_FORMAT
```sql
-- 当前时间格式化
update goods_msg SET create_date = DATE_FORMAT(NOW(),'%Y-%m-%d %H:%m:%s') WHERE uid = '6183b000-e7b3-4f38-8943-c9f170bd2d80'

-- 日期转时间
SELECT DATE_FORMAT(CURDATE(),'%Y-%m-%d %H:%i:%s');

-- 时间戳转时间
SELECT DATE_FORMAT(CURDATE(),'%Y-%m-%d %H:%i:%s')

-- 日期格式化   date_format(时间，格式)
%Y:四位年
%y:两位年
%m:两位月
%c:一位月
%d:日
%H:24小时
%h:12小时
%i:分
%s:秒
select date_format(now(),’%Y年%m月%d日%H时%i分%s秒’);
查询商品名称和商品的上传日期(格式：x年x月x日)
select title,date_format(created_time,’%Y年%m月%d日’) from t_item;
把非标准的日期
str_to_date(时间字符串，格式)
08.25.2018 08:08:08
select str_to_date(‘08.25.2018 08:08:08
’,’%m.%d.%Y %H:%i:%s
’);
```

### EXTRACT
处理时间
```sql
-- 查询指定年份
select * from t where extracy(year from t.birthday)=1997;
```

### UNIX_TIMESTAMP
```sql
-- 获取当前时间戳(毫秒/秒)
select  UNIX_TIMESTAMP(date_sub( now(), INTERVAL 1 DAY )) * 1000; // 1627012407000 2021-07-23 11:53:27  
select  UNIX_TIMESTAMP(date_sub( now(), INTERVAL 1 DAY )); // 1627014735 2021-07-23 12:32:15



-- 获取今天、昨天0点时间戳
-- 昨天
UNIX_TIMESTAMP(CAST(SYSDATE()AS DATE) - INTERVAL 1 DAY)
-- 今天
UNIX_TIMESTAMP(CAST(SYSDATE()AS DATE))
```

## 连接

### concat
把concat 内部的参数拼接到一起
```sql
-- 查询员工姓名和工资，要求工资单位是元
select ename,concat(sal,'元') from emp;
```

## 排序

### order
排序： (desc 降序)  默认升序(asc)
```sql
1.查询所有员工的姓名和工资按照工资升序排序
select ename,sal from emp;
2.查询10号部门的所有员工信息，按照工资降序排序
select*from emp where deptno=10 order by sal desc;
3.查询所有带燃字的商品，按照单价升序排序
select*from t_item where  title like ‘%燃%’order by price;
4. 查询所有dell商品按照分类category_id升序排序
select * from t_item where title like '%dell%' order by category_id;
5.查询所有员工按照部门升序排序如果部门一致则按照工资降序排序
select * from emp order by deptno,sal desc;
6.查询所有商品分类和单价按照分类降序排序，如果分类相同则按照单价升序排序
select category_id,price from t_item order by category_id desc,price;
```

## 聚合函数
用于对多条数据进行统计
1.求和sum（字段名）
select sum(sal) from emp where deptno=10;
2.平均值avg(字段名)
select avg(sal) from emp ;
3.最大值max（字段名）
select max(comm) from emp where deptno=30;
4.最小值min（字段名）
select min(price) from t_item;
5.统计数量count（字段名）  一般使用count(*)
统计30号部门
select count(*) from emp where deptno=30;

select count(*) from emp where sal>2500;
select max(comm) from emp where sal>1000 or sal<3000;
select max(comm) 最大奖金,max(sal)最高工资,avg(sal)工资平均值,sum(sal)工资总和 from emp;
select count(*)from t_item where price<100;
select count(*)from emp where ename like ‘%a%’;

## 其他

#### Where
对全局对限制，也就是对最后查询出来的整个结果做限制。
示例
```sql
SELECT
    stu.*
FROM
    student stu
 LEFT JOIN grade gra on stu.id = gra.c_stuId
WHERE gra.c_fs is NOT null
```

#### LPAD/RPAD
```sql
select RPAD(id,8,'0') as pad from tmp; #右补0
select LPAD(id,8,'0') as pad from tmp; #左补0
```
LPAD(str,len,padstr)
用字符串 padstr对 str进行左边填补直至它的长度达到 len个字符长度，然后返回 str。如果 str的长度长于 len'，那么它将被截除到 len个字符，保留从左边开始len个长度。
RPAD(str,len,padstr)
用字符串padstr对 str进行右边填补直至它的长度达到 len个字符长度，然后返回 str。如果 str的长度长于 len'，那么它将被截除到 len个字符。

#### ROW_NUMBER
```sql
set @num=0;
SELECT (@num:=@num+1) as num,bb.id FROM minithirdauthbind bb
```

#### Found_rows/Row_count
MySQL中有两个函数来计算上一条语句影响了多少行，不同于SqlServer/Oracle，不要因为此方面的差异而引起功能问题：
1，判断Select得到的行数用found_rows()函数进行判断。
2，判断Update或Delete影响的行数用row_count()函数进行判断，这里需要注意，如果Update前后的值一样，row_count则为0，而不像SqlServer里的@@rowcount或Oracle里的rowcount，只要update到行，影响的行数就会大于0，而无论update前后字段的值是否发生了变化

FOUND_ROWS() 函数
（1）FOUND_ROWS()函数返回的是上一条 SELECT 语句（或 SHOW语句等）查询结果集的记录数。
注意，是上一条SELECT 语句（即执行该函数前的最近一条SELECT语句），而不是上一条SQL 语句；因为上一条SQL语句不一定是 SELECT 语句。且，像SELECT ROW_COUNT() 这种语句也是 SELECT 语句，它们的结果集也会被FOUND_ROWS() 函数查出来。
（2）如果上一条 SELECT 语句查询结果为空，则返回 0。
（3）SHOW XXX（例如，show tables、show databases、show status）语句也会被FOUND_ROWS() 函数查出来。
 示例
```sql
需要和SQL_CALC_FOUND_ROWS搭配使用

select  a.F_id,a.CityName,b.F_id topicid from  yht_cityinfo as a left join yht_topic as b on a.CityName=b.CityName 
and b.TopicLibaryId ='14564564564545';
select  FOUND_ROWS();
运行该语句：返回7列数据和一个数字7

select  a.F_id,a.CityName,b.F_id topicid from  yht_cityinfo as a left join yht_topic as b on a.CityName=b.CityName 
and b.TopicLibaryId ='14564564564545'  LIMIT 2,3;
select  FOUND_ROWS();
运行该语句：返回3列数据和一个数字5（因为查询的是跳过第二条，往下找，到第五个） 

select SQL_CALC_FOUND_ROWS a.F_id,a.CityName,b.F_id topicid from  yht_cityinfo as a left join yht_topic as b on a.CityName=b.CityName 
and b.TopicLibaryId ='14564564564545'  LIMIT 2,2;
select  FOUND_ROWS() as rowcount;
运行该语句：返回2列数据和一个数字7  因为我们要分页数据，总数，所以选用最后一个
```

ROW_COUNT() 函数
（1）FOUND_ROWS()函数返回的是上一条SQL语句，对表数据进行修改操作后影响的记录数。
如果上一条SQL语句不是修改操作语句（INSERT/UPDATE/DELETE 等），而是查询语句（SELECT/SHOW 等）则返回-1。如果是修改操作语句，则返回修改（增/删/该）影响的记录数。
注意，这里是上一条SQL语句（即执行该函数前的上一条SQL语句），和上面有所区别。
（2）如果上一条SQL语句是UPDATE语句，但是UPDATE后所有数据的值并没有改变，则返回 0。
（3）如果上一条SQL语句是建表语句（创建表或临时表），但创建的是空表，则返回 0。如果是删除表（DROP语句），则返回的还是 0。
（4）如果是创建临时表，但使用的是 AS 关键字直接将查询出来的值赋值给新建的临时表的话（其实就相当于新建了一个空表，紧接着使用了一条INSERT语句而已），则返回插入的记录数。

> 参考资料
> [https://blog.csdn.net/zhou520yue520/article/details/81155248](https://blog.csdn.net/zhou520yue520/article/details/81155248)
> [https://blog.csdn.net/business122/article/details/7548838](https://blog.csdn.net/business122/article/details/7548838)


#### Greatest/Least
获取一行中两列的最大值和最小值
```sql
两列中的最小值
select LastStudyDate,LastDoneExamDate,LEAST(LastStudyDate,LastDoneExamDate) FROM userstudylogsummary
两列中的最大值
select LastStudyDate,LastDoneExamDate,GREATEST(LastStudyDate,LastDoneExamDate) FROM userstudylogsummary
```

#### Order by
排序
查询排序的问题，当你要排序的字段存在值一样的时候，那么会出现你每次查询出来的排序是不同的，如果你想让每次出来的排序值一样，那么你就需要给排序字段设置为唯一的值，比如说加一个排序字段ID

#### Group_Concat
将查询出来的列表中某一个字段拼接成一个字符串
SELECT a.ChannelId from dynews_news_channel a  WHERE NewsId='6a9f7baf-d150-4863-9355-09572872dd11'
![image.png](/common/1614050368625-12c28eff-5ffc-4655-8a39-ce9ed1b031df.png)
拼接成一个字符串
示例：
SELECT GROUP_CONCAT(cast(a.ChannelId as char(10)) SEPARATOR ',') as id from   dynews_news_channel a  WHERE NewsId='6a9f7baf-d150-4863-9355-09572872dd11'
![image.png](/common/1614050368615-24e143a8-8987-484b-9079-dff587fbd264.png)
示例：
SELECT GROUP_CONCAT(a.Content SEPARATOR ',' ) from dynews_reportorder_details a WHERE a.ReportOrder='DFGDGH57454JGYDERFDG'

#### Group by
场景：需要根据多个标签进行匹配相似度，用户传过来多个标签，我需要根据用户传过来的标签然后去数据库中查询标签字段（,号隔开）中有几个和这个匹配
```sql
SELECT  count(b.F_Id) as cs,b.Label from (
select  a.F_Id,CONCAT(',',a.Label,',') as Label from dynews_news a WHERE CONCAT(',',a.Label,',') like '%,zzz,%' 
UNION all 
select a.F_Id,CONCAT(',',a.Label,',') as Label from dynews_news a WHERE CONCAT(',',a.Label,',') like '%,3,%'
UNION all
select a.F_Id,CONCAT(',',a.Label,',') as Label from dynews_news a WHERE CONCAT(',',a.Label,',') like '%,w,%'
UNION all
select a.F_Id,CONCAT(',',a.Label,',') as Label from dynews_news a WHERE CONCAT(',',a.Label,',') like '%,2,%'
) b  GROUP BY b.F_Id,b.Label ORDER BY cs DESC 
```
![image.png](/common/1614050842520-25c22514-6edc-4b08-9e68-f3f1907110a4.png)
修改以下配置后就可以查询groupby后面不包含的列
```yaml
show variables like '%sql_mode%';

STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION

去掉：ONLY_FULL_GROUP_BY  这个是设置查询的列必须在分组后也存在

是分别在[mysqld]和[mysql]下面添加这段 sql_mode=STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION
```

#### IF
示例
```sql
如果满足条件就返回0，不满足条件就返回原值
SELECT if(Sum(Price) is null,0,Price) from yht_betorder where CustomerId='22690be4-c2cc-4b6d-bbcd-eda1cdf57a6c' and PayType=3

select t.name,if(t.weight<80,'正常','肥胖') 体重 from t_customer t
```

#### IFNULL
语句中判断，如果字段值为null，那么就转换为其他值，使用
```sql
Select IFNULL（null,'aa'）=>输出aa

ispublic字段为null就输出空
IFNULL(IsPublic,'')
```

#### Case
类似于if逻辑判断
```sql
数据库存入的是数字，想转为中文
select  CASE Way
	WHEN 1 THEN
		'朋友圈'
		WHEN 2 THEN
		'城市圈'
	ELSE
		'其他'
END as way
 from dynews_user_share WHERE NewsId='53456454545' and UserId='88888888'
```

#### Cast
Cast(字段名 as 转换的类型 )把一个字段转换成另一个字段。
示例
```sql
cast(a as decimal) mysql中进行类型转换
```

#### Concat
mysql CONCAT(str1,str2,…)                        
返回结果为连接参数产生的字符串。如有任何一个参数为NULL ，则返回值为 NULL。或许有一个或多个参数。 如果所有参数均为非二进制字符串，则结果为非二进制字符串。 如果自变量中含有任一二进制字符串，则结果为一个二进制字符串。一个数字参数被转化为与之相等的二进制字符串格式；若要避免这种情况，可使用显式类型 cast, 例如： SELECT CONCAT(CAST(int_col AS CHAR), char_col)
```csharp
mysql> SELECT CONCAT(’My’, ‘S’, ‘QL’);
-> ‘MySQL’
mysql> SELECT CONCAT(’My’, NULL, ‘QL’);
-> NULL
mysql> SELECT CONCAT(14.3);
-> ‘14.3′
```
CONCAT(string1,string2,…)   说明 : string1,string2代表字符串,concat函数在连接字符串的时候，只要其中一个是NULL,那么将返回NULL

#### any_value
any_value()会选择被分到同一组的数据里第一条数据的指定列值作为返回数据
示例
```sql
SELECT 
	province_code,
	any_value(province_name)
FROM t_mip_base_area
GROUP BY province_code
```

#### count
（1）count(*)---包括所有列，返回表中的记录数，相当于统计表的行数，在统计结果的时候，不会忽略列值为NULL的记录。
（2）count(1)---忽略所有列，1表示一个固定值，也可以用count(2)、count(3)代替，在统计结果的时候，不会忽略列值为NULL的记录。
（3）count(列名)---只包括列名指定列，返回指定列的记录数，在统计结果的时候，会忽略列值为NULL的记录（不包括空字符串和0），即列值为NULL的记录不统计在内。
（4）count(distinct 列名)---只包括列名指定列，返回指定列的不同值的记录数，在统计结果的时候，在统计结果的时候，会忽略列值为NULL的记录（不包括空字符串和0），即列值为NULL的记录不统计在内。
带条件的count
```sql
select count(num > 200 ) from a;
## count()函数中使用条件表达式加or null来实现，作用就是当条件不满足时，函数变成了count(null)不会统计数量
select count(num > 200 or null) from a;

## count()函数中使用case when表达式来实现，当条件满足是表达式的结果为非空，条件不满足时无结果默认为NULL;
select count(case when num > 200 then 1 end) from a;
```

#### Exist
示例
```sql
添加数据时候先判断，不满足条件不添加
INSERT INTO `sysrole`(`Id`, `CreateTime`, `Creater`, `LastModifyTime`, `LastModifier`, `Deleted`, `Disabled`, `RoleName`, `RoleKey`, `SortNumber`, `DataScope`) SELECT '3', '2018-03-16 11:33:00.000000', 'admin', '2020-06-16 09:25:24.678544', 'system', 0, 0, '普通角色', 'common', '2', '2' from DUAL
WHERE NOT EXISTS(SELECT Id from sysrole WHERE Id=2)
```

#### Rand
```sql
## 随机取一条数据
SELECT username FROM user ORDER BY RAND() LIMIT 1；
```
让你的数据库的性能呈指数级的下降，MySQL会不得不去执行RAND()函数（很耗CPU时间），而且这是为了每一行记录去记行，然后再对其排序。就算是你用了Limit 1也无济于事（因为要排序） 

#### Instr
instr()返回子字符串在字符串中首次出现的位置；如果没有找到，则返回0
