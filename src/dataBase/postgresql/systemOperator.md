---
title: 系统操作
lang: zh-CN
date: 2023-08-29
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - operator
---
## 系统操作

### 监控程序活动

pg_stat_activity 是 PostgreSQL 内置的一个系统视图， 是 PostgreSQL 实例维护的一个进程相关的视图，是实时变化的。

关于该表的字段说明可以查看：https://www.cnblogs.com/zhuminghui/p/14421501.html



查询慢SQL可以执行下面sql

```sql
select * from pg_stat_activity where state<>'idle' and now()-query_start > interval '5 s' order by query_start; 
```

查询连接字符串中应用名查询该应用活动信息

```sql
select * from pg_stat_activity where application_name like 'fss%'

// 程序连接想统计在内，需要连接字符串中拼接`Application Name=app1`,或者使用下面c#代码拼接
// var conStrBuilder = new NpgsqlConnectionStringBuilder(connectionString);
// conStrBuilder.ApplicationName = appName;
```

监控用户的连接数

```sql
-- 查询指定用户的活跃连接数
SELECT usename                              AS username,
       COUNT(*)                             AS connection_count,
       array_agg(DISTINCT client_addr)      AS client_addresses,
       array_agg(DISTINCT application_name) AS applications
FROM pg_stat_activity
WHERE usename = 'xxx'
GROUP BY usename;

-- 监控所有用户的连接数
SELECT
    usename AS 用户名,
    COUNT(*) AS 总连接数,
    COUNT(*) FILTER (WHERE state = 'active') AS 活跃连接数,
    COUNT(*) FILTER (WHERE state = 'idle') AS 空闲连接数,
    COUNT(*) FILTER (WHERE state = 'idle in transaction') AS 事务中空闲连接数,
    COUNT(*) FILTER (WHERE state = 'idle in transaction (aborted)') AS 已中止事务空闲连接数,
    COUNT(*) FILTER (WHERE state = 'fastpath function call') AS 快速路径函数调用连接数,
    COUNT(*) FILTER (WHERE state = 'disabled') AS 禁用连接数
FROM pg_stat_activity
WHERE usename = 'xxx'
GROUP BY usename
ORDER BY 总连接数 DESC;
```

### 磁盘统计

```sql
-- 计算某一个表某一个列的存储量
SELECT (SUM(pg_column_size("config_code")))  CSIZE FROM meta_data.meta_config;

select table_schema, table_name,  column_name ColName,pg_column_size(table_name||'.'||  column_name)
from information_schema.columns
where table_name = 'department'  -- Your table name here
  and table_schema = 'sample';


-- 查询指定数据库指定schema下所有表的存储量
SELECT table_catalog,table_schema,table_name ,pg_total_relation_size(table_schema || '.' || table_name) as total_size
FROM information_schema.tables where table_catalog='consoletest' and table_schema = 'sample';

SELECT table_catalog,table_schema,table_name ,pg_table_size(table_schema || '.' || table_name) as total_size
FROM information_schema.tables where table_catalog='consoletest' and table_schema = 'sample';

SELECT table_catalog,table_schema,table_name ,pg_total_relation_size(  table_schema || '."' || table_name||'"') as total_size
FROM information_schema.tables where table_catalog='cdr' and table_schema = 'meta_data';


-- 获取指定数据库的大小
SELECT table_catalog,sum(pg_total_relation_size(table_catalog|| '.'|| table_schema || '.' || table_name) ) as total_size
FROM information_schema.tables where table_catalog='consoletest'  and table_name!='__EFMigrationsHistory'
group by table_catalog;

-- 查询数据库的大小
select pg_database_size('consoletest')


-- 求每个表下的记录数
-- 方案一：类似于批量count
select schemaname, tablename, (xpath('/row/cnt/text()', xml_count))[1]::text::int as row_count
from (select schemaname,
             tablename,
             query_to_xml(format('select count(1) as cnt from %I.%I', schemaname, tablename), false, true,
                          '') as xml_count
      from pg_tables
      where schemaname = 'blog') as count;
-- 方案二：不太准
select schemaname, relname tableName, n_live_tup count
from pg_stat_user_tables;
-- 方案三：不太准
select relname as TABLE_NAME, reltuples as rowCounts
from pg_class
where relkind = 'r'
  and relnamespace = (select oid from pg_namespace where nspname = 'blog')
order by rowCounts desc;
```

## 连接

### 连接数据库

psql命令连接方式

```shell
## 方式一
psql postgres://username:password@host:port/dbname
## username：连接数据的用户名，默认值是postgres
## password：密码，默认值是postgres
## host：主机名，默认值是localhost
## port：端口，默认值是5432
## dbname：要连接的数据库名，默认值是postgres

## 方式二
psql -U username -h hostname -p port -d dbname
## -U username 用户名，默认值postgres
## -h hostname 主机名，默认值localhost
## -p port 端口号，默认值5432
## -d dbname 要连接的数据库名，默认值postgres

# 退出postgres客户端
\q

# 退出docker容器
exit
```

docker连接

```shell
// 进入postgres容器
docker exec -it 容器id bash

psql -h localhost -p 5432 -U postgres -d 数据库名字
```

linux连接

```shell
psql -h localhost -p 5432 -U postgres -d runoobdb
```

windows连接

```shell
-- 方式一，然后按照命令输入口令
.\psql -U postgres -W

--  方式二：直接连接并且选择数据库
.\psql -h localhost -p 5432 -U postgres -d postgres
-- 或者
.\psql postgres://postgres:123456@localhost:5432/postgres
```

### 数据库当前连接

```sql
SELECT pg_stat_get_backend_pid(s.backendid)      AS procpid,
       pg_stat_get_backend_activity(s.backendid) AS current_query
FROM (SELECT pg_stat_get_backend_idset() AS backendid) AS s;
```

## 用户

```shell
# 创建用户
CREATE USER dba WITH PASSWORD '123456';

# 修改用户密码
alter user username with password 'password';

# 更新指定数据库的所有者
ALTER database hdr_01 OWNER TO test;

# 赋予某个表所有权限
GRANT ALL PRIVILEGES on argo_workflows to dba;
```

## 数据库

```bash
# 查询数据库
\l

# 创建数据库
create database hdr_01;

# 创建数据库并指定用户
create database test_db with owner testuser;

#  进入指定的数据库
\c 数据库名字
# 示例：\c hdr

# 执行外部脚本
\i D:/Work/HDR/hdr_v116_202305.sql

# 删除数据库
drop database hdr_01;
```

### 获取表分区

```csharp
select datname from pg_database;
```

### 时区

```csharp
// 显示当前时区
show timezone; --UTC

//显示内置时区
select * from pg_timezone_names;

//设置时区 设置完获取当前时间就是和本机一样了，默认是utc
set time zone 'Asia/Shanghai'; 

//以指定时区展示时间
select now() at time zone 'Asia/Shanghai';
```

### Schema

psql命令

```bash
## 获取数据库下的所有schema
\dn

## 创建schema
create schema schema_01;

## 切换schema
set search_path to schema_01;

## 查询现在所在schema
show search_path;

## 查询当前schema下所有的表
\d

## 查询某一个表的表结构信息
\d 表名
```

```bash
# 创建模式
create schema if not exists sample;

# 删除模式
drop schema meta_data;

# 删除模式并串联删除依赖对象
drop schema meta_data cascade;
```

## 表Table

### 切换表

使用psql命令获取

```
\d 表名
```

### 获取表分区下表

```csharp
SELECT * FROM information_schema.tables where table_catalog='zyp' and table_schema = 'config';
```

### 查询指定表备注

```csharp
select relname as tabname,
cast(obj_description(c.oid,'pg_class') as varchar) as comment from pg_class c 
where  relname ='表名字';
```

### 结构查询

```
-- 查询指定数据库下是否存在某一个schema
SELECT count(1) FROM information_schema.schemata where catalog_name='cdr' and schema_name='meta_data';
```

### 获取表结构信息

根据schema和表名称获取表结构信息

```c#
select distinct *
from (select column_name ColName,
    character_maximum_length Length,
    ordinal_position Sort,
    udt_name SubLength,
    data_type ColType
    from information_schema.columns
    where table_name = 'patient_master_info'  -- Your table name here
    and table_schema = 'patient') col  -- Your schema name here
    inner join (SELECT distinct col_description(a.attrelid, a.attnum) as Comment,
    a.attname as name,
    a.attnotnull as Is_Null,
    (case
    when (select count(*) from pg_constraint where conrelid = a.attrelid and conkey[1]=attnum and contype='p')>0 then a.attname
    else ''
    end) as pkName
    FROM pg_class as c,
    pg_attribute as a
    where c.relname = 'patient_master_info' -- Your table name here
    and c.relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'patient') -- Your schema name here
    and a.attrelid = c.oid
    and a.attnum > 0) colInfo
on colInfo.name = col.ColName
order by Sort;
```

查询数据库指定schema下每个表的数据量

```sql
SELECT  schemaname, relname tableName, n_live_tup size
FROM pg_stat_user_tables where schemaname 'user'
```

## 授权

### 授予库权限

```sql
-- 授予指定用户指定库的权限
grant connect, create, temporary on database "data-plat" to "cdr_app";
```

### 授予schema权限

```sql
-- 授予cdr_app用户Schema所有者权限
-- ALTER Schema cda_temp OWNER TO cdr_app;
SELECT STRING_AGG('ALTER Schema ' || nspname || ' OWNER TO "cdr_app";',E'\n') AS grant_statements
FROM pg_namespace
where nspname not like 'pg%'
  and nspname != 'information_schema';
  
-- 授予cdr_app用户Schema权限
-- grant create, usage on schema cr to "cdr_app";
SELECT STRING_AGG('grant create, usage on schema ' || nspname || ' to "cdr_app";',E'\n') AS grant_statements
FROM pg_namespace
where nspname not like 'pg%'
  and nspname != 'information_schema';
```

### 授予表权限

```sql
-- 给某一个用户授予一个表的所有权
ALTER table dr.drug_info_1 OWNER TO "cdr_app";

-- 更新表的所有者
-- ALTER TABLE other.blood_apply_test_details OWNER TO cdr_app;
select STRING_AGG('ALTER TABLE ' || table_schema || '.' || table_name || ' OWNER TO "cdr_app";', E'\n') as grant_statements
from information_schema.tables
where table_schema in (SELECT nspname
                       FROM pg_namespace
                       where nspname not like 'pg%' and nspname != 'information_schema' and nspname = 'ehrcda');

-- 授予cdr_app用户指定schema下表权限 (nspname: schema名字)
-- GRANT Delete, Insert, References, Select, Trigger, Truncate, Update ON TABLE "mdm"."code_map" TO "cdr_app"
SELECT STRING_AGG(
               'GRANT Delete, Insert, References, Select, Trigger, Truncate, Update ON TABLE ' ||
               table_schema || '."' || table_name || '" TO cdr_app;',
               E'\n'
       ) AS grant_statements
FROM information_schema.tables
WHERE table_schema IN (SELECT nspname
                       FROM pg_namespace
                       WHERE nspname NOT LIKE 'pg%'
                         AND nspname != 'information_schema'
                         AND nspname = 'mdm');
```

### 授予视图权限

```sql
grant delete, insert, references, select, trigger, truncate, update on diag.patient_diagnose_view to "360_app";
```

### 授予序列权限

```sql
-- 授予指定用户某一个序列的权限
grant select, update, usage on sequence cr.secret_medical_config_id_seq to "360_app";

-- 查询指定schema下的序列授权给指定的用户
select STRING_AGG('grant select, update, usage on sequence ' || sequence_schema || '."' || sequence_name || '" TO "360_app";',E'\n') AS grant_statements
FROM information_schema.sequences
WHERE  sequence_schema='ehrcda';
```

## 导入导出

在pg_dump.exe/psql.exe的目录下执行该SQL

### 导出脚本

执行下面脚本并输入口令操作

```bash
# 仅架构
# pg_dump -h your_host -p your_port -U your_username -d your_database -f dump.sql

# 从本地localhost库中将数据名字为sample数据库表结构导出
.\pg_dump -h localhost -p 5432 -U postgres -d sample -f d:\temp\sample.sql
# 从本地localhost库中将数据名字为sample数据库表结构+表数据导出
.\pg_dump -h localhost -p 5432 -U postgres -d sample -a -f d:\temp\sample2.sql

# 导出特定表的数据
# pg_dump -h your_host -p your_port -U your_username -d your_database -t specific_table -a -f data_dump.sql
.\pg_dump -h localhost -p 5432 -U postgres -d test -t schema_01.users -a -f d:\temp\table_data_dump.sql
```

> -h：ip
> -p：端口号
> -U：使用指定用户名进行数据库备份
>
> -b：在备份文件中包含创建数据库对象（如表、索引等）的 SQL 语句。
>
> -d：数据库名称
>
> -Fp：指定备份文件的格式为plain，即普通文本格式
>
> -F d：目录格式，将每个表的数据存储在单独的文件中
>
> -F c：表示使用自定义格式，这通常是在处理大型数据库时推荐的选项
>
> -f 保存路径
> -a 导出表的数据
> -t：指定要备份的表名，不指定备份整个数据库
>
> -f：指定备份文件的输出路径
>
> -v：启用详细模式，显示有关转储过程的详细信息
>
> -O：排除与所有者相关的命令，如 ALTER OWNER。如果你想将转储恢复到不同的数据库，这很有用
>
> -n：指定要导出的schema
>
> -s：用于导出数据库的结构信息，而不包括数据内容

### 导入脚本

执行下面脚本并输入口令操作

```bash
# 执行sql导入到指定数据库
# pg_dump -h your_host -p your_port -U your_username -d your_database -f dump.sql

# 将上面sample库的内容导入到sample2库中
.\psql -h localhost -p 5432 -U postgres -d test -f d:\temp\table_data_dump.sql
```

> -d 数据库名
> -h ip地址
> -p 端口号
> -U 数据库用户名
> -f sql文件路径

### 汇总

```shell
# 导出整个库(带数据)导入的信息
.\pg_dump -h 172.16.70.54 -p 5432 -U postgres -d cdr_05 -v -O -f d:\temp\cdr.sql
.\psql -h 172.16.70.54 -p 5432 -U postgres -d 0112 -f d:\temp\cdr.sql

# 导出整个库结构并导入
.\pg_dump -h 172.16.70.54 -p 5432 -U postgres -d cdr_05 -s -v -O -f d:\temp\cdr.sql
.\psql -h 172.16.70.54 -p 5432 -U postgres -d 0112 -f d:\temp\cdr.sql

# 导出指定schema 并导入
.\pg_dump -h 172.16.70.54 -p 5432 -U postgres -d cdr_05 -n cr -v -O -f d:\temp\cdr.sql
.\psql -h 172.16.70.54 -p 5432 -U postgres -d 0112 -f d:\temp\cdr.sql

# 导出指定表 并导入
.\pg_dump -h 172.16.70.54 -p 5432 -U postgres -d cdr_05 -t schema_01.users -v -O -f d:\temp\cdr.sql
.\psql -h 172.16.70.54 -p 5432 -U postgres -d 0112 -f d:\temp\cdr.sql
```

