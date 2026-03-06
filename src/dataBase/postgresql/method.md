---
title: 函数
lang: zh-CN
date: 2023-09-03
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - 无
filename: hanshu
slug: fr843x
docsId: '56801437'
---

## 系统操作

### pg_get_viewdef
```plsql
-- 获取指定视图的DDL语句
SELECT pg_get_viewdef('orders.cr_order_merge_view'::regclass, true);
```
参数说明

- regclass oid：指定要检索其定义的视图的关系 OID（Object IDentifier）。
- pretty_bool boolean DEFAULT true：一个可选参数，用于指定是否对结果进行美化。默认值为 true，即返回美化后的定义。

## 查询

### unnest
列转行
```csharp
select unnest(string_to_array('1,2,3',','));
```

### replace
将某一列的内容进行替换操作
```csharp
update cr.chart_review_config
set content=replace(content, '"Filter"', ' "sort":[
        {
            "Field":"input_time",
            "Asc":"false"
        }
    ],
    "Filter"'),
```

### COALESCE
 参数可以有无限个，总是返回第一个非空参数，如果所有参数都是null，则返回null。
```plsql
SELECT COALESCE(1, 2);        -- return 1
SELECT COALESCE(NULL, 2 , 1); -- return 2
```

### NULLIF
```plsql
NULLIF(argument_1,argument_2);
```
如果两个参数相等返回null，否则返回第一个参数。请看示例：
```plsql
SELECT NULLIF (1, 1);     -- return NULL

SELECT NULLIF (1, 0);     -- return 1

SELECT NULLIF ('A', 'B'); -- return A
```

### SUBSTR
查询指定关键字的前后几个字
```plsql
SELECT SUBSTR(column_name, STRPOS(column_name, 'keyword') - 10, 20) AS context
FROM table_name
WHERE column_name LIKE '%keyword%';
```

### convert_to
将数据库的一个值转为其他编码格式
```csharp
convert_to(masterInfo.account_address_township,'GB18030')
```

### 类型转换
转成文本类型
```csharp
'输血不良反应记录'::text AS recordname
```
| int | ::int |
| --- | --- |
| varchar | ::text |


### 字符串连接
| 函数 | 返回类型 | 描述 | 样例 | 结果 |
| --- | --- | --- | --- | --- |
| string &#124;&#124; string | 字符串 | 字符串连接 | 'Post' &#124;&#124; 'greSQL' | PostgreSQL |
| string &#124;&#124; non-string or non-string &#124;&#124; string | text | 连接空字符串 | 'Value: ' &#124;&#124; 42 | Value: 42 |
| concat(str "any" [, str "any" [, ...] ]) | 字符串 | 连接函数里所有的字符串参数，忽略空字符串 | concat('abcde', 2, NULL, 22) | abcde222 |
| concat_ws(sep text, str "any" [, str "any" [, ...] ]) | 字符串 | 以第一个参数作为分隔符，连接其他的几个参数 | concat_ws(',', 'abcde', 2, NULL, 22) | abcde,2,22 |

```csharp
'透前评估单####' ||	'2021' DisplayName,
```
注意：如果使用||连接的两个字符串输出的类型是字符串类型，如果两个操作数都是varchar类型，那么输出为varchar类型，如果连接的操作数有一个是text类型，那么输出结果是text类型。

### to_char
将时间转换为固定格式
```csharp
to_char(blood_reaction.report_date, 'yyyy-MM-dd'::text) AS recordtime

to_char(diag_time,'yyyy-mm-dd HH24:mi:ss')  2022-07-12 16:29:30

-- 将时间+8小时输出
to_char(now() + interval '8 hours', 'yyyymmddHH24miss')    
```

### Case
```csharp
CASE hd_pat_record.hd_rec_type
    WHEN '1'::text THEN '透前评估单'::text
    ELSE '血透治疗记录'::text
END AS recordname,
```

### With
结构
```plsql
with 
a as (select * from user),
b as (select * from class)
select a.userId,b.clasId from 
a innner join n on a.classId = b.classId
```
> 多个临时表逗号隔开,a和b都是临时表

示例
```csharp
with x as(
			select
			x.patient_name,
			x.age
			from
			visit.visit_record x
			where
			x.is_valid = true 
)
    
select
	x.patient_name,
	x.age
from
	x
inner join patient.patient_master_info p on
	x.patient_id = p.patient_id
	and p.patient_name like '%涛%'
where
	1 = 1
	
order by
	x.visit_time desc
limit 1 offset 9
```

### Limit/Offset
分页查询
```csharp
select * from persons limit  A  offset  B;
```
> A就是你需要多少行；
> B就是查询的起点位置。
> A B是bigint类型的值

示例：
select * from persons limit 5 offset 0 ;
意思是，起点0开始查询，返回5条数据。

### Row_number
生成虚拟的排序列
```sql
select row_number() over () as id,name from user;

# 根据账号列排序然后分页查询前十条
select *
from (select account, pass_word, ROW_NUMBER() over (order by account desc ) ROW_NUMBER
      from (select * from sample."user") u) c
where ROW_NUMBER BETWEEN 0 and 10;
```

### string_to_array
将字符串转数组
```csharp
select string_to_array('1,2,3',',');
```

### any
查询一个值是否在数组中存在的
```plsql
select '1'=any(string_to_array('1,2,3',','));

SELECT 19 = ANY(string_to_array('1,18,19', ',', '')::int4[]);
```

### INTERVAL
```csharp
--查询当前时间+8小时的时间
select now() + interval '8 hours';

-- 查询指定时间-1个月的时间
select now() - interval '1 month';
```

### pg_column_size
查询列的占用大小
```sql
--  查询表中患者名称列的占用
select patient_name,pg_column_size(patient_name) from orders.inpat_undrug_order where order_id=4660956
```

### split_part

1. text 为截取字段
2. text2 为截取标识符：按照什么形式切割(比如逗号’,’)
3. int 为要获取的项的位置：位置从1开始
```csharp
split_part(string text, delimiter text2, field int)
```
示例
```sql
select split_part('a,b,c',',',1); -- 输出a
    
select split_part('12,4',',',1); -- 输出12
```

### Json
资料：[http://postgres.cn/docs/12/functions-json.html](http://postgres.cn/docs/12/functions-json.html)
> json和jsonb从用户操作角度来说是没有区别的，区别主要是存储和读取的系统处理和耗时方面有区别。json写入，读取慢，jsonb写入慢，读取快


#### 操作符

##### #>
获取在指定路径的json对象
示例
```csharp
select '{"a": {"b":{"c": "foo"}}}'::json#>'{a,b}';
-- {"c": "foo"}

select '{"a": {"b":{"c": "foo"}}}'::json#>'{a}';
-- {"b":{"c": "foo"}}
```

##### #>>
以text形式获取指定路径上的json对象
示例
```csharp
select '{"a":[1,2,3],"b":[4,5,6]}'::json#>'{a,2}';
-- 3
```
返回text形式和上面的区别就是，#>有时候返回json对象是包含双引号的。

##### @>
判断一个值是否在 JSON 字段中

如果是判断json中某一个键名key是否中是否包含某一个值
```plsql
SELECT EXISTS (
  SELECT 1 
  FROM your_table 
  WHERE data -> 'key' @> '[10, 20, 30]'::jsonb
);
```

判断某一个json值是否存在某一个数组值
```plsql
select '[1,8,19]'::jsonb @> '[8]'
```

#### Json处理

##### jsonb_path_query
> jsonb_path_query(target jsonb, path jsonpath [, vars jsonb [, silent bool]])

获取指定的json值的json路径返回的所有json项
```sql
select * from jsonb_path_query('{"a":[1,2,3,4,5]}', '$.a[*] ? (@ >= $min && @ <= $max)', '{"min":2,"max":4}');
-- 2
-- 3
-- 4

select * from jsonb_path_query('{"a":{"type": 5,"name": "zhangsan"}}', '$.a[*] ? (@.type==5 ).name');
-- "zhangsan"

select  jsonb_path_query('{"a":{"type": 5,"name": "zhangsan"}}', '$.a[*] ? (@.type==5 )') #>>'{name}'
-- zhangsan
```

##### jsonb_path_query_array
> jsonb_path_query_array(target jsonb, path jsonpath [, vars jsonb [, silent bool]])

获取指定json路径返回的所有json项，并将结果封装为数组
```sql
select jsonb_path_query_array('{"a":[1,2,3,4,5]}', '$.a[*] ? (@ >= $min && @ <= $max)', '{"min":2,"max":4}')
-- [2, 3, 4]
```

##### jsonb_array_elements_text 
jsonb_array_elements_text 函数将 JSON 数组展开为一系列文本元素
```plsql
SELECT *
FROM jsonb_array_elements_text('[1,18,19]');
```

### recursive

可以实现在数据库递归的效果

```sql
-- 根据id将其所有子集都查询出来
with recursive p as
                   (select 1::integer recursion_level, t1.id, t1.struct_name, t1.struct_type,t1.parent_struct_id
                    from meta_data.model_struct t1
                    WHERE id = 11687 and t1.status != 1
                    union all
                    select p.recursion_level + 1, t2.id, t2.struct_name, t2.struct_type,t2.parent_struct_id
                    from meta_data.model_struct t2  inner join p   on t2.parent_struct_id = p.id
                    where t2.status != 1)
select id,
       recursion_level,
       struct_name,
       struct_type,
       parent_struct_id
from p

-- 如果你希望在每一行上显示包含所有上级名称组合的列表，而不仅仅是最终路径，可以稍微修改上述查询。以下是一个更新后的示例查询
WITH RECURSIVE recursive_query AS (
    SELECT id, name, manager_id, ARRAY[name] AS path
    FROM employees
    WHERE id = <employee_id> -- 填入要查询的员工ID

    UNION ALL

    SELECT e.id, e.name, e.manager_id, rq.path || e.name
    FROM employees e
    JOIN recursive_query rq ON e.id = rq.manager_id
)
SELECT unnest(path) AS all_names
FROM recursive_query;
```

参考资料：https://zhuanlan.zhihu.com/p/159555056

### 格式转换

#### query_to_xml

执行动态的查询sql并且将值转为xml格式

```sql
-- 批量动态执行sql 并且使用xpath解析执行的结果
select schemaname, tablename, (xpath('/row/cnt/text()', xml_count))[1]::text::int as row_count
from (select schemaname,
             tablename,
             query_to_xml(format('select count(1) as cnt from %I.%I', schemaname, tablename), false, true,
                          '') as xml_count
      from pg_tables
      where schemaname = 'blog') as count;
```

### 全文搜索

#### tsvector

pgsql全文搜索：https://www.codenong.com/cs106302184/

## 筛选

### Like

```sql
-- 忽略大小写查询
-- var existingEntity = await _unitOfWork.Banks.FirstOrDefautAsync(x => (EF.Functions.ILike(x.Code, bank.Code));
select * from sample.user where name ilike 'zhangsan';    
```

### ~

正则匹配

```csharp
-- 查询长度小于10的
select * from cr.chart_review_config where key ~ '^[a-z]{0,10}$';

-- 查询key里面包含这些字符的值
select key from cr.chart_review_config where key ~ 'cda|lab|check';
```

## 时间

### date_trunc

时间格式转换

```sql
-- 将当前时间转换为日期
SELECT date_trunc('month', now());
```

### interval

是一个数据类型，用于表示时间间隔。非常适用于需要表示和处理日期和时间差值的场景

```sql
-- 获取上个月1号(包含了utc时间转本地时间+8小时)
SELECT date_trunc('month', now() + interval '8 hours' - interval '1 month');

-- 获取这个月0点前1秒(包含了utc时间转本地时间+8小时)
SELECT date_trunc('month', now() + interval '8 hours' ) - interval '1 second';
```

## 随机数

### random

#### 基础用法
函数可以用于生成一个大于等于 0 小于 1 的随机数字
```sql
-- 返回的数据类型为 double precision，每次调用都会返回不同的结果
SELECT random();
```


#### 设置随机种子
如果我们想要重现某个结果，需要生成相同的随机数；这种情况下可以使用SETSEED(d)
函数设置一个随机数种子，d 的类型为 double precision，取值范围从 -1.0 到 1.0。例如：
```sql
SELECT setseed(0);

SELECT random();
random            |
------------------|
0.0000000000000391|

random            |
------------------|
0.0009853946746503|
...

SELECT setseed(0);

SELECT random();
random            |
------------------|
0.0000000000000391|

random            |
------------------|
0.0009853946746503|
```
设置相同的种子之后，随后的函数调用返回了一系列相同的随机数。



#### 生成指定范围的随机数
```sql
-- 返回任意两个数字之间的随机数
-- low + RANDOM() * (high - low)
-- 示例
SELECT 10 + random() * 10 AS rd; -- 12.428546754341241

-- 生成某个范围内的随机整数，可以加上 FLOOR 函数。例如
SELECT floor(10 + random() * 10); -- 14

```

#### 生成验证码
```sql
-- 生成6位数据手机验证码
SELECT to_char(random() * 1000000, '099999') AS captcha;
```

#### 生成遵循正态分布随机数
PostgreSQL 提供了一个扩展模块 tablefunc，可以用于生成遵循正态分布（normal distribution）的随机数。首先，输入以下命令启用该模块：
```sql
CREATE EXTENSION tablefunc;
```
然后使用该模块中的NORMAL_RAND(n,mean, stddev)
函数返回 n 个均值为 mean，标准差为 stddev 的随机数。例如：
```sql
SELECT *
FROM normal_rand(10, 0, 1);
```

#### 生成随机字符串

##### 生成固定长度随机字符串
除了随机数字之外，有时候我们也需要生成一些随机的字符串。PostgreSQL 没有提供专门生成随机字符串的函数，但是可以通过其他函数进行模拟。例如：
```sql
SELECT chr(floor(random() * 26)::integer + 65);
chr|
---|
V  |
```
以上查询返回了一个随机的大写字母，chr 函数用于将 ASCII 码转换为对应的字符。我们可以基于该查询进一步创建一个存储函数：
```sql
CREATE OR REPLACE FUNCTION random_string(
  num INTEGER,
  chars TEXT default '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
) RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  res_str TEXT := '';
BEGIN
  IF num < 1 THEN
      RAISE EXCEPTION 'Invalid length';
  END IF;
  FOR __ IN 1..num LOOP
    res_str := res_str || substr(chars, floor(random() * length(chars))::int + 1, 1);
  END LOOP;
  RETURN res_str;
END $$;
```
random_string 函数可以返回由指定字符（默认为所有数字、大小写字母）组成的随机字符串。例如：
```sql
SELECT random_string(10);
random_string|
-------------|
etP3odkRgA   |
```
以上示例返回了一个由字母和数字组成、长度为 10 的随机字符串。以下语句也可以用于返回一个 6 位随机数字组成的手机验证码：
```sql
SELECT random_string(6, '0123456789');
random_string|
-------------|
082661       |
```

##### 生成可变长度的随机字符串
那么，怎么返回一个长度可变的随机字符串呢？很简单，为 random_string 函数指定一个随机的长度参数即可。例如：
```sql
SELECT random_string(floor(10 + random() * 11)::int);
random_string   |
----------------|
8tz5zHcbKVKoVg4S|
```
以上示例返回了一个长度大于等于 10 且小于等于 20 的随机字符串

#### 生成随机日期和时间
将指定日期增加一个随机的数字，就可以得到随机的日期。例如：
```sql
SELECT current_date + floor((random() * 15))::int rand_date;
rand_date |
----------|
2020-11-04|
```
以上示例返回了当前日期 14 天之内的某个随机日期。以下语句则返回了一天中的某个随机时间：
```sql
SELECT make_time(floor((random() * 12))::int, floor((random() * 60))::int, floor((random() * 60))::int) AS rand_time;
rand_time|
---------|
 10:04:52|
```
其中，make_time 函数用于将代表时、分、秒的整数转换为时间。

#### 获取表中的随机记录
对于返回多行数据的查询语句，RANDOM 函数每次都会返回不同的随机值。例如：
```sql
SELECT random() FROM employee;
random             |
-------------------|
0.10449782906204419|
 0.3345344734009643|
 0.7295074473683592|
...
```
利用这个特性，我们可以从表中返回随机的数据行。例如：
```sql
SELECT emp_id, emp_name
FROM employee
ORDER BY random()
LIMIT 5;
emp_id|emp_name |
------|---------|
     2|关羽      |
     9|赵云      |
    13|关兴      |
    25|孙乾      |
    17|马岱      |
```
以上示例从 employee 表中返回了 5 行随机记录。该方法需要为表中的每行数据都生成一个随机数，然后进行排序；所以会随着表中的数据量增加而逐渐变慢。
如果表中存在自增主键，也可以基于主键生成一个随机数据。例如：
```sql
SELECT round(rand() * (SELECT max(emp_id) FROM employee)) AS id;
id  |
----|
10.0|
```
然后基于这个随机数返回一条随机的记录：
```sql
SELECT e.emp_id, e.emp_name
FROM employee e
INNER JOIN (SELECT round(random() * (SELECT max(emp_id) FROM employee)) AS id
           ) AS t
ON e.emp_id >= t.id
LIMIT 1;
emp_id|emp_name|
------|--------|
    10|廖化     |
```
这种方法一次只能返回一条随机记录，而且只有当自增字段的值没有间隙时才会返回均匀分布的随机记录。
另外，PostgreSQL 中的查询语句支持 TABLESAMPLE 子句，可以实现数据的抽样。例如：
```sql
SELECT emp_id, emp_name
FROM employee 
TABLESAMPLE BERNOULLI (10);
emp_id|emp_name|
------|--------|
     4|诸葛亮   |
    13|关兴     |
```
除了 BERNOULLI 之外，也可以指定 SYSTEM 抽样方法，参数代表了抽样近似百分比。

### 生成 UUID
UUID（Universal Unique Identifier）或者 GUID（Globally Unique Identifier）是一个 128 比特的数字，可以用于唯一标识每个网络对象或资源。由于它的生成机制，一个 UUID 可以保证几乎不会与其他 UUID 重复，因此常常用于生成数据库中的主键值。
PostgreSQL 提供了一个用于加/解密的扩展模块 pgcrypto，其中的 gen_random_uuid() 函数可以用于返回一个 version 4 的随机 UUID。首先，输入以下命令启用该模块（gen_random_uuid() 从 PostgreSQL 13 开始成为了一个内置函数）：
```sql
CREATE EXTENSION pgcrypto;
```
然后，通过该函数返回一个 UUID：
```sql
SELECT gen_random_uuid();
gen_random_uuid                     |
------------------------------------|
2d757cf5-c18c-469c-8b5e-eed914eacc93|
```
该函数返回的数据类型为 uuid。如果想要生成没有中划线（-）的 UUID 字符串，可以使用 REPLACE 函数：
```sql
SELECT replace(gen_random_uuid()::text,'-','');
replace                         |
--------------------------------|
cabbfcdc62c54e2889bdd2b7095f1270|
```

#### uuid_generate_v4

借助扩展实现

```shell
create extension if not exists "uuid-ossp";

-- uuid-ossp
select uuid_generate_v4();
```

## 操作

### RETURNING
在INSERT INTO或者UPDATE的时候在最后面加上RETURNING colname，PostgreSQL会在插入或者更新数据之后会返回你指定的字段。

示例
```sql
insert into dr.drug_info_1("drug_code")
values ('11111')
RETURNING *
```

### ON CONFLICT
> 注意，ON CONFLICT 只在 PostgreSQL 9.5 以上可用。

翻译为当执行一个操作冲突/矛盾的时候做什么？比如
```csharp
INSERT INTO table_name(column_list) VALUES(value_list)
ON CONFLICT target action;

-- 示例
insert into azrng.user(key,value,expire_time) values ('{lockKey}','{lockValue}','{SystemDateTime.Now().Add(expireTime):yyyy-MM-dd HH:mm:ss}') ON CONFLICT (key) DO NOTHING;
-- 如果没有插入成功返回0
```
如果插入的数据重复，那么做什么操作？
target 可以是：

- (column_name)：一个字段名
- ON CONSTRAINT constraint_name：其中的 constraint_name 可以是一个唯一约束的名字
- WHERE predicate：带谓语的 WHERE 子句

action 可以是：

- DO NOTHING：当记录存在时，什么都不做
- DO UPDATE SET column_1 = value_1, … WHERE condition：当记录存在时，更新表中的一些字段

## 自定义函数

### 获取指定表的建表脚本

创建一个自定义函数来获取指定表的建表脚本。以下是一个示例函数，它将返回一个包含建表语句的文本：

```sql
CREATE OR REPLACE FUNCTION get_table_ddl(table_name text)
    RETURNS text AS $$
DECLARE
    ddl text;
BEGIN
    SELECT 'CREATE TABLE ' || table_name || ' (' || string_agg(column_def, ', ') || ');'
    INTO ddl
    FROM (
             SELECT column_name || ' ' || data_type ||
                    CASE WHEN is_nullable = 'NO' THEN ' NOT NULL' ELSE '' END as column_def
             FROM (
                      SELECT a.attname as column_name,
                             t.typname as data_type,
                             a.attnotnull as is_nullable
                      FROM pg_catalog.pg_attribute a
                               JOIN pg_catalog.pg_class c ON a.attrelid = c.oid
                               JOIN pg_catalog.pg_type t ON a.atttypid = t.oid
                      WHERE c.relname = table_name AND a.attnum > 0
                  ) as columns
         ) as column_defs;
    RETURN ddl;
END;
$$ LANGUAGE plpgsql;

-- 调用示例
SELECT get_table_ddl('department');
```

