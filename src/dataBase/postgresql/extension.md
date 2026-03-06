---
title: 扩展
lang: zh-CN
date: 2024-07-17
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - pgsql
---

## 概述

扩展插件说明：[https://pigsty.cc/zh/docs/pgsql/extension/](https://pigsty.cc/zh/docs/pgsql/extension/)

## pg_bigm

需要提前安装数据库扩展[pg_bigm文档](http://pgbigm.osdn.jp/pg_bigm_en-1-2.html),可以实现的效果如名字搜索使用like可以走索引查询

```sql
CREATE EXTENSION pg_bigm;
-- 支持  '%张三%'  走索引查询
CREATE INDEX lab_report_report_name_index ON lab_report USING gin (report_name public.gin_bigm_ops);
```



docker中安装扩展

```shell
// 进入容器
docker exec -it 97d24546afca bash

// 升级apt-get
apt-get update

// 安装指定的扩展，比如pg_bigm
apt-get install pg_bigm
```

## postgres_fdw

DBLINK vs Postgres_FDW:[postgresql_dblink_vs_postgres_fdw](https://deepinout.com/postgresql/postgresql-questions/223_postgresql_dblink_vs_postgres_fdw_which_one_may_provide_better_performance.html)

介绍文档：[https://mp.weixin.qq.com/s/R_DaTXWE0qNp6r3treABvg](https://mp.weixin.qq.com/s/R_DaTXWE0qNp6r3treABvg)

PostgreSQL 提供了 `postgres_fdw` 外部数据包装器（Foreign Data Wrapper），允许你在一个数据库中查询另一个数据库中的表。以下是设置步骤：

1. **安装 `postgres_fdw` 扩展**： 在你要执行查询的数据库中，你需要创建 `postgres_fdw` 扩展。

   ```sql
   -- 首先创建拓展
   create extension IF NOT EXISTS postgres_fdw;
   
   -- 检查扩展
   select * from pg_available_extensions where name='postgres_fdw';
   ```

2. **创建服务器**： 使用 `CREATE SERVER` 命令创建一个指向另一个数据库的外部服务器。

   ```sql
   -- 说明
   CREATE SERVER foreign_db
   FOREIGN DATA WRAPPER postgres_fdw
   OPTIONS (host 'hostname', dbname 'remote_db', port '5432');
   
   -- 验证服务
   select * from pg_foreign_server;
   
   -- 创建用户映射到当前数据库的postgres用户上
   CREATE USER MAPPING FOR postgres
       SERVER foreign_db
       OPTIONS (user 'postgres', password '123456');
       
   -- 删除外部服务
   drop server 自定义的服务名;
   ```

3. **创建用户映射**： 创建一个用户映射，使本地用户能够访问远程服务器。

   ```sql
   -- 说明
   CREATE USER MAPPING FOR local_user
   SERVER foreign_db
   OPTIONS (user 'remote_user', password 'password');
   
   create user mapping for 指定的用户名 server 自定义的服务名 options(user '远端服务器的用户名', password '用户的密码');
   
   -- 示例
   create user mapping for postgres server foreign_db options(user 'postgres', password '123456');
       
   -- 删除用户映射
   drop user mapping for 指定的用户名 server 自定义的服务名;
   ```

4. **导入外部表**： 你可以选择导入表的结构和数据，或仅导入表的结构。

   ```sql
   -- 说明
   IMPORT FOREIGN SCHEMA 远端数据库的模式名
   FROM SERVER 自定义服务名
   INTO 模式名;
   
   -- 示例
   create schema local_example;
   IMPORT FOREIGN SCHEMA public
       FROM SERVER foreign_db
       INTO local_example;
   ```

   或者，手动创建外部表。

   ```sql
   -- 说明
   CREATE FOREIGN TABLE local_schema.remote_table (
     id integer,
     name text
   )
   SERVER foreign_db
   OPTIONS (schema_name 'public', table_name 'remote_table');
   
   -- 示例
   create foreign table local_example.foreign_score
   (
       id          bigint  not null,
       course_name varchar(20) default ''::character varying not null,
       grade       integer     default 0                     not null,
       user_id     bigint                                    not null,
       create_time timestamp                                 not null
   )
       SERVER foreign_db
       OPTIONS (schema_name  'example', table_name  'score');
       
   -- 删除外部表
   drop foreign table 外部表名
   ```

5. **查询外部表**： 一旦设置好了，你可以像查询本地表一样查询外部表。

   ```sql
   -- 说明
   SELECT * FROM local_schema.remote_table;  
   
   -- 示例
   SELECT * FROM local_example.foreign_score;
   
   -- 和当前数据库的表关联查询
   select u.id, u.name, s.course_name, s.grade
   from example.user u
   inner join local_example.score s on u.id = s.user_id
   ```

## dblink 扩展

`dblink` 扩展，它允许你通过建立一个连接来查询另一个数据库的表。以下是设置步骤：

1. **安装 `dblink` 扩展**：

   ```sql
   CREATE EXTENSION dblink;
   ```

2. **使用 `dblink` 执行查询**： 使用 `dblink` 函数连接到远程数据库并执行查询。你需要提供远程数据库的连接字符串。

   ```
   SELECT * FROM dblink('host=hostname dbname=remote_db user=remote_user password=password',
                        'SELECT id, name FROM remote_table')
   AS remote_data (id integer, name text);
   ```

3. 使用 `pg_partman` 和其他工具

对于更复杂的用例或者大规模数据同步的需求，可以考虑使用 `pg_partman` 或其他数据同步工具来管理和同步不同数据库之间的数据。



pgsql使用dblink库：[https://www.cnblogs.com/CDLinXi/p/10510769.html](https://www.cnblogs.com/CDLinXi/p/10510769.html)

## parquet_s3_fdw

实现效果是讲patquet从s3同步到pgsql并实现查询。

parquet_s3_fdw仓库地址：[https://github.com/pgspider/parquet_s3_fdw](https://github.com/pgspider/parquet_s3_fdw)

中文说明：https://hub.docker.com/layers/dgraur/postgres_parquet/13/images/sha256-f5c8bd81f2d32701b4a2a86c24517f627505779f294f90abdad9229084fc991f?context=explore

已经封装好的镜像：https://hub.docker.com/layers/dgraur/postgres_parquet/13/images/sha256-f5c8bd81f2d32701b4a2a86c24517f627505779f294f90abdad9229084fc991f?context=explore



ChoETL.Parquet包 可以将csv转parquet格式

```csharp
string csv = @"report_id,pat_base_id,patient_id,patient_name,sex_code,sex_name
24257778,3403184,2934726,袁 * 琪,1,女性
45187999,3959747,331688,毛 * 玉,2,女性";

//using (var r = ChoCSVReader.LoadText(csv)
//	.WithFirstLineHeader()
//	.WithMaxScanRows(2)
//	.QuoteAllFields()
//	)
//{
//	using (var w = new ChoParquetWriter(@"E:\temp\aa.parquet"))
//	{
//		w.Write(r);
//	}
//}

var aa= ChoParquetReader.Deserialize(@"E:\temp\aa.parquet",null);
aa.Dump();
```

## postgis

Postgresql(带postgis扩展插件) 在Docker下的部署：[https://blog.csdn.net/weixin_45263494/article/details/122264023](https://blog.csdn.net/weixin_45263494/article/details/122264023)

## pgvector

文档地址：[https://pgxn.org/dist/vector/](https://pgxn.org/dist/vector/)

仓库地址：[https://github.com/pgvector/pgvector](https://github.com/pgvector/pgvector)



自带向量扩展的数据库部署

```shell
# 基于pgvector/pgvector:0.8.0-pg17
docker run --name postgresql \
    -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password \
    -p 5432:5432 \
    -d registry.cn-hangzhou.aliyuncs.com/zrng/pgvector:0.8.0-pg17

# podman
podman run --name postgresql  -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=123456  -p 5433:5432  -d registry.cn-hangzhou.aliyuncs.com/zrng/pgvector:0.8.0-pg17    
```



数据库操作

```shell
-- 创建demo数据库
create database demo;

# 切换到demo数据库
\c demo

# 安装vector扩展
CREATE EXTENSION vector;

# 创建测试表
CREATE TABLE test (id bigserial PRIMARY KEY, embedding vector(3));

# 插入测试数据
INSERT INTO test (embedding) VALUES ('[1,2,3]'), ('[4,5,6]');

# 按与给定向量相似度(L2 distance)排序，显示前5条
SELECT * FROM test ORDER BY embedding <-> '[3,1,2]' LIMIT 5;
```

