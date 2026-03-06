---
title: 基础知识
lang: zh-CN
date: 2023-09-01
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - base
---

:::tip

遇到数据库关键字需要加双引号，比如select "model_id" from meta_data.model

:::

## 基本操作

### 程序连接
```shell
# .Net连接数据库
host=localhost;port=5432;database=test;username=postgres;password=123456;Maximum Pool Size=100;

# jdbc连接数据库
jdbc:postgresql://localhost:5432/azrng?user=postgres&password=123456
```

## 数据库等操作

### 表

#### 创建表
创建表并且授予所有者，创建注释
```plsql
-- 如果不存在就创建
create table if not exists search.userinfo
(
	id serial
		constraint userinfo_pk
			primary key, -- 主键自增
	name text default '' not null
);

-- 创建表
create table search.userinfo
(
	id serial
		constraint userinfo_pk
			primary key,
	name text default '' not null
);

-- 添加注释
comment on table search.userinfo is '用户表';
comment on column search.userinfo.id is '主键';
comment on column search.userinfo.name is '姓名';

-- 授权
ALTER TABLE search.userinfo 
  OWNER TO "postgres";

```

#### 添加列
```sql
alter table config."SqlConfig" add "TableName" text; -- 添加列
comment on column config."SqlConfig"."TableName" is '表名'; --设置备注

-- 添加列并且设置默认值
alter table other.blood_transfusion_record add blood_apply_id int not null default 0;

-- 添加列如果列不存在就添加
ALTER TABLE checks.ecg_report  ADD column  IF NOT EXISTS link_show_type int DEFAULT 0 NOT NULL;
```



当一个列之前不是自增，现在修改为自定模式，那么需要创建队列并设置队列的值为当前表最大值，然后将主键设置为自增

```sql
-- 创建序列
CREATE SEQUENCE osp.system_dictionary_id_seq;

-- 重置序列的当前值为表中的最大 id 值
SELECT setval('osp.system_dictionary_id_seq', (SELECT MAX(id) FROM osp.system_dictionary));

-- 将序列与主键列关联
ALTER TABLE osp.system_dictionary ALTER COLUMN id SET DEFAULT nextval('osp.system_dictionary_id_seq');
```

#### 添加数据
```plsql
INSERT INTO "user".userinfo(id, "name", status) VALUES('1', '张三', 1);

-- 批量添加
INSERT into other.blood_apply_test_details(name,blood_apply_id)
SELECT patient_name,blood_apply_id from  other.blood_apply where patient_id=716 and visit_id=100182490

-- 要插入的SQL中code数据不存在就添加，存在就不添加，注意，该code列需要是唯一索引的列
INSERT INTO public.operation_log (id, code, content, create_time, version) VALUES (default, 'version', 'none', now(), '3.10.0')
ON CONFLICT (code) DO NOTHING;

-- 添加的时候如果存在就更新，该code列需要是唯一索引的列
INSERT INTO public.operation_log (id, code, content, create_time, version) VALUES (default, 'version', 'none', now(), '3.10.0')
ON CONFLICT (code) DO update
set content='v3.10.0';

```

#### 批量添加数据

通过pgsql copy的方式批量添加数据

```plsql
-- FROM STDIN (FORMAT BINARY): 指定数据来源为标准输入，并且数据格式为二进制。这意味着你需要将二进制数据提供给 COPY 命令


COPY cda.document_generation_log (task_batch_number,document_type,document_serial_number,generation_status,error_message,created_time) FROM STDIN (FORMAT BINARY)
```
资料：[http://postgres.cn/docs/12/sql-copy.html](http://postgres.cn/docs/12/sql-copy.html)

##### 程序copy加数据

```csharp
var stopwatch = Stopwatch.StartNew();
var list = GetUserList(5000);
Console.WriteLine($"构造数据:{list.Count}  结束：{stopwatch.ElapsedMilliseconds}  ");

await using var db = new OpenDbContext();

await using var dbConnect = (NpgsqlConnection)db.Database.GetDbConnection();
if (dbConnect.State == ConnectionState.Closed)
    await dbConnect.OpenAsync();
await using var copyImport = await dbConnect.BeginBinaryImportAsync(
    "COPY sample.\"user\" (id,account, pass_word, name, sex, credit, group_id, deleted, create_time, modify_time) FROM STDIN (FORMAT BINARY)");
foreach (var item in list)
{
    await copyImport.StartRowAsync();
    await copyImport.WriteAsync(item.Id);
    await copyImport.WriteAsync(item.Account);
    await copyImport.WriteAsync(item.PassWord);
    await copyImport.WriteAsync(item.Name);
    await copyImport.WriteAsync((int)item.Sex);
    await copyImport.WriteAsync(item.Credit);
    await copyImport.WriteAsync(item.GroupId);
    await copyImport.WriteAsync(item.Deleted);
    await copyImport.WriteAsync(item.CreateTime, NpgsqlTypes.NpgsqlDbType.Timestamp);
    await copyImport.WriteAsync(item.ModifyTime, NpgsqlTypes.NpgsqlDbType.Timestamp);
}

var num = await copyImport.CompleteAsync();
Console.WriteLine($"插入成功 数据量：{num}");
```

##### do-while批量造数据

```sql

DO $$
    DECLARE
        v_patient_id INT;
        v_visit_id INT;
        v_patient_name VARCHAR(50);
        v_sex_code VARCHAR(1);
        v_sex_name VARCHAR(10);
    BEGIN
        FOR i IN 1..2700000  LOOP
                v_patient_id := 1008447971 + i;
                v_visit_id := 1008447971 + i;
                v_patient_name := chr(19968 + floor(random() * (40869 - 19968 + 1))::int) ||
                          chr(19968 + floor(random() * (40869 - 19968 + 1))::int) ||
                          chr(19968 + floor(random() * (40869 - 19968 + 1))::int);
                v_sex_code := CASE WHEN random() < 0.5 THEN '1' ELSE '2' END;
                v_sex_name := CASE WHEN v_sex_code = '1' THEN '男性' ELSE '女性' END;

                INSERT INTO visit.visit_record (id, patient_id, pat_base_id, org_code, visit_type, visit_id, source_app,
                                                source_visit_id, source_outpat_no, source_inpat_no, patient_name, age, age_unit,
                                                age_day, pay_kind_id, pay_kind_code, pay_kind_name, insurance_kind_id,
                                                insurance_kind_code, insurance_kind_name, dept_id, dept_code, dept_name, doc_id,
                                                doc_code, doc_name, is_emergency, visit_time, out_time, major_diag_id, major_diag_code,
                                                major_diag_name, visit_state_id, visit_state_code, visit_state_name, is_valid, oper_id,
                                                oper_code, oper_name, oper_time, etl_time, extend1, extend2, current_dept_id,
                                                current_dept_code, current_dept_name, extend3, sex_name, sex_code)
                VALUES (v_visit_id, v_patient_id, 4148423, '42507230900', 'I', v_visit_id, 'FG_HIS_4', '228725', null, '228725', v_patient_name, '4',
                        '岁', 1400, 541, '10', '自费病人', null, null, null, 29, null, 'PICU', null, null, null, false,
                        '2017-07-22 13:06:16.000000', '2017-07-25 12:31:26.000000', null, null, '肺炎链球菌感染', 788, null, '出院',
                        true, 1, null, null, '2017-11-11 10:18:11.908000', '2017-11-11 10:18:11.908000', null, null, null, null, null,
                        null, v_sex_name, v_sex_code);

            END LOOP;
    END $$;
```

#### 更新数据

```csharp
-- 查询一个表(closed_loop_relation)的数据去更新另一个表(closed_loop_process_copy1)的数据
update cr.closed_loop_process_copy1 clp
set parent_node_code=clr.main_process_code
from cr.closed_loop_relation clr
where clr.sub_process_code = clp.process_code;

UPDATE table1 t1
SET column1 = t2.columnname1
    column2 = t2.columnname2
 FROM (select columnname1,columnname2 from table2) t2
 WHERE t1.column3 = t2.column3
 AND t1.column = '111';
```

特殊的列
```csharp
-- 更新bytea类型数据
update platform.system_config  set desc_html=E'我是测试数据' where key='traceSource_sql_parser_config'
```

#### 批量更新

* 使用[ON CONFLICT ](https://www.postgresql.org/docs/10/sql-insert.html#SQL-ON-CONFLICT) 进行添加冲突后进行更新
* 使用Values List更新部分列
* 使用临时表去批量更新(创建一个临时表，插入临时表，然后通过表链接去更新，然后删除临时表)

#### 删除数据

```sql
-- DELETE 命令用于逐行删除表中的数据
DELETE FROM table_name;

-- TRUNCATE 命令将删除表中的所有行，并重置自增主键（如果有）。它比 DELETE 命令更快，因为它是通过释放存储空间来实现的，而不是逐行删除
truncate dr.drug_info_1;
```

#### 序列
更新序列的值
```sql
-- 查询序列值(查询的时候会递增)
select nextval('cr.record_folder_info_id_seq')

-- 更新序列的值
alter sequence 队列名 restart with 1058;
-- 示例
alter sequence cr.record_folder_info_id_seq restart with 142;

-- 设置序列为表最大的主键值
SELECT setval('osp.system_dictionary_id_seq', (SELECT MAX(id) FROM osp.system_dictionary));
```

##### 提前获取序列值

```c#
public async Task<Queue<int>> TakeIdsAsync(int size)
{
	var sqls = Enumerable.Range(0, size).Select(x => "select nextval('meta_data.model_struct_id_seq')");
	var sql = string.Join(" union ", sqls);
	var ret = await _dbContext.Database.GetDbConnection().QueryAsync<int>(sql);

	var queue = new Queue<int>();
	foreach (var item in ret.OrderBy(x => x))
	{
		queue.Enqueue(item);
	}

	return queue;
}
```

#### 索引

```sql
-- 创建索引
create index request_log_module_index
on cr.request_log (module);

-- 为json属性增加索引
create index idx_patient_patient_name on patient(( patient_property #>>(array ['patient name'])));
create index patient_index_gin_id_no on public.patient ((patient_property -> 'id_no'::text));                 create index idx_patient_org_code on patient ((patient_property #>> ARRAY ['org_code'::text]));                     

-- 联合索引
create unique index chart_review_config_key_version_number_uindex
on cr.chart_review_config (key asc, version_number desc);

-- 删除索引
drop index cr.chart_review_config_key_uindex;
-- 存在删除，不存在跳过
DROP INDEX IF EXISTS cr.trace_source_target_config_name_uindex;

-- 部分索引
-- https://www.postgresql.org/docs/16/indexes-partial.html
```
模糊查询走索引
```sql
CREATE EXTENSION pg_bigm;
-- 支持  '%张三%'  走索引查询
CREATE INDEX lab_report_report_name_index ON lab_report USING gin (report_name public.gin_bigm_ops);
```
pg_bigm文档：[http://pgbigm.osdn.jp/pg_bigm_en-1-2.html](http://pgbigm.osdn.jp/pg_bigm_en-1-2.html)

##### 索引状态查询

当一个表中存在重复数据，然后你去创建唯一索引的时候，虽然这时候报错了，但是还会发生一个无效的索引被创建了

```sql
SELECT
    n.nspname AS schema_name,
    t.relname AS table_name,
    i.relname AS index_name,
    CASE
        WHEN idx.indisprimary THEN 'PRIMARY KEY'
        WHEN idx.indisunique THEN 'UNIQUE'
        ELSE 'NORMAL'
    END AS index_type,
    pg_get_indexdef(idx.indexrelid) AS index_definition,
    idx.indisvalid AS is_valid,
    CASE
        WHEN idx.indisvalid THEN '✅ 有效'
        WHEN idx.indisready THEN '⚠️ 构建中（未验证）'
        ELSE '❌ 无效（存在重复/构建失败）'
    END AS status,
    pg_size_pretty(pg_relation_size(i.oid)) AS index_size
FROM pg_index idx
JOIN pg_class i ON i.oid = idx.indexrelid
JOIN pg_class t ON t.oid = idx.indrelid
JOIN pg_namespace n ON n.oid = t.relnamespace
WHERE n.nspname = 'chat'
  AND t.relname = 'indicator_data_storage'
ORDER BY idx.indisvalid DESC, i.relname;
```

##### 重建索引

下面解释下说明情况下需要：
1、  当由于软件bug或者硬件原因导致的索引不再可用，索引的数据不再可用；
2、  当索引包含许多空的或者近似于空的页，这个在b-tree索引会发生。Reindex会腾出空间释放哪些无用的页(页就是存放数据的一个单位，类似于block)。
3、  PostgreSql数据库系统修改了存储参数，需要重建不然就会失效(如修改了fillfactor参数)；
4、  创建并发索引时失败，遗留了一个失效的索引。这样的索引不会被使用，但重构后能用。一个索引的重构不能并发的执行。

```plsql
-- REINDEX { INDEX | TABLE | DATABASE | SYSTEM } name [ FORCE ];

-- 重建指定索引
reindex index my_index;

-- 重建指定表的所有索引
REINDEX TABLE my_table;

-- 重建指定数据库的所有索引
REINDEX DATABASE broken_db;

--  SYSTEM 重构这个系统的索引包含当前的数据库。共享系统中的索引页是被包含的，但是用户自己的表是不处理的，同样也不能在一个事务块中执行。
```

- 重建索引不同的级别的重构需要不同的权限，比如table那么就需要有这个表的权限即需要有操作索引的权限，如超级用户postgres拥有这个权限。
- 重构索引的目的是为了当索引的数据不可信时，即对于成本的计算会出现偏差较大，无益于优化器得到最优的执行计划以至于性能优化失败。
- 重构索引类似于先删除所有再创建一个索引，但是索引的条目是重新开始的。重构时当前索引是不能写的，因为此时有排他锁。
- 在8,1版本之前REINDEX DATABASE 只包含系统索引，并不是期望的所有指定数据库的索引。7.4版本之前REINDEX TABLE不会自动执行下级TOAST tables

##### 视图创建索引

PostgreSQL的视图（View）可以像表一样创建索引。当在视图上执行查询时，PostgreSQL会使用该视图的索引来加速查询。但请注意，与表不同，视图本身并不存储数据，因此视图索引仅存储对基础表的引用，并且可能受到基础表中数据更改的影响。
在创建视图时，可以使用CREATE INDEX语句为其添加索引，就像在表上创建索引一样。例如：

```plsql
CREATE VIEW myview AS SELECT * FROM mytable WHERE column = 'value';
CREATE INDEX myview_index ON myview (column1, column2);
```
这将在myview视图上创建名为myview_index的索引，以加速满足WHERE语句中条件的查询。

#### 约束
```sql
-- 创建唯一约束(对key和version_number)
create unique index chart_review_config_key_version_number_uindex
	on cr.chart_review_config (key desc, version_number desc);


-- 删除约束
drop index cr.chart_review_config_key_uindex;
```
> 不能直接更新，如果要修改需要删除之前的然后添加新的约束

## 进阶

### 视图
视图(VIEW)是一个伪表。 它不是物理表，而是作为普通表选择查询。视图也可以表示连接的表。 它可以包含表的所有行或来自一个或多个表的所选行。
**视图便于用户执行以下操作**：

- 它以自然和直观的方式构建数据，并使其易于查找。
- 它限制对数据的访问，使得用户只能看到有限的数据而不是完整的数据。
- 它归总来自各种表中的数据以生成报告。

语法
可以使用CREATE VIEW语句来在PostgreSQL中创建视图。 您可以从单个表，多个表以及另一个视图创建它。
```csharp
CREATE [TEMP | TEMPORARY] VIEW view_name AS  
SELECT column1, column2.....  
FROM table_name  
WHERE [condition];
```
示例
从sqlconfig表创建一个视图(该视图属于config表分区)，此视图将包含querycolumn,sqlcode,tablename,alias这几个列
```csharp
CREATE OR REPLACE VIEW config.sqlconfig_view as
select  querycolumn,sqlcode,tablename,alias from config.sqlconfig config;
```
从视图中检索带条件的数据
```csharp
select * from config.sqlconfig_view where alias='x'
```
删除视图
```csharp
-- 语法
-- DROP VIEW view_name;

drop view config.sqlconfig_view;
```

### 临时表
一、根据原表创建临时表
```csharp
CREATE TEMP TABLE temp_testbulkcopy as (select * from testbulkcopy limit 0);
```
二、本次使用完临时表后自动删除
```csharp
CREATE TEMP TABLE temp_testbulkcopy ON COMMIT DROP as (select * from testbulkcopy limit 0);
```
ON COMMIT DROP  表示本次事务提交后就自动删掉

### 触发器
一般格式
```csharp
create trigger trigger_name [before/after/instead of] [update | insert | delete] on table_name
for each [row | statement]
execute [function | procedure] function_name;
```
举例创建触发器当更新system_config表的value列的时候触发
```csharp
DROP TRIGGER IF EXISTS "trigger_AddSystemConfigFlow" ON sample1.system_config;
DROP FUNCTION IF EXISTS sample1."func_addSystemConfigFlow"();

CREATE OR REPLACE FUNCTION sample1."func_addSystemConfigFlow"() RETURNS trigger AS $BODY$ BEGIN
        INSERT INTO sample1.system_config_history ("key","value",version,update_user_id,update_time)
        VALUES (OLD.key,OLD.value,OLD.version,1,CURRENT_TIMESTAMP);

    RETURN NEW;

END $BODY$ LANGUAGE plpgsql ;

CREATE TRIGGER "trigger_AddSystemConfigFlow" AFTER UPDATE OF "value" ON sample1.system_config FOR EACH ROW
EXECUTE PROCEDURE sample1."func_addSystemConfigFlow"();
```
增加创建更新一个表就让另一个表插入备份数据的触发器脚本
```csharp
--创建备份表（只需更新chart_review_config_bk表名即可）
create table cda.system_dictionary_bk as select * from cda.system_dictionary;

Alter table cda.system_dictionary_bk add column operation text;
Alter table cda.system_dictionary_bk add column operation_time timestamp;
Alter table cda.system_dictionary_bk add column user_name text;
Alter table cda.system_dictionary_bk add column old_content text;

--创建备份trigger （只需更新cda.system_dictionary_bk 表名即可）
CREATE OR REPLACE FUNCTION cda.system_dictionary_log_audit() RETURNS TRIGGER AS $system_dictionary_bk$
    BEGIN
        -- 在 log_audit 中创建日志来记录操作 ，
        -- 使用特殊变量 TG_OP 来得到操作。
        IF (TG_OP = 'DELETE') THEN
            INSERT INTO cda.system_dictionary_bk SELECT  OLD.*,TG_OP, now(), user,'';
            RETURN OLD;
        ELSIF (TG_OP = 'UPDATE') THEN
            INSERT INTO cda.system_dictionary_bk SELECT NEW.*,TG_OP, now(), user,row_to_json(OLD.*);
            RETURN NEW;
        ELSIF (TG_OP = 'INSERT') THEN
            INSERT INTO cda.system_dictionary_bk SELECT NEW.*,TG_OP, now(), user,'';
            RETURN NEW;
        END IF;
        RETURN NULL; -- 因为这是一个 AFTER 触发器，结果被忽略
    END;
$system_dictionary_bk$ LANGUAGE plpgsql;

--表关联触发器（只需更新system_dictionary_bk表名即可）
CREATE TRIGGER system_dictionary_audit
AFTER INSERT OR UPDATE OR DELETE ON cda.system_dictionary
    FOR EACH ROW EXECUTE PROCEDURE cda.system_dictionary_log_audit();
```

#### 查询所有触发器

查询指定库下有那些触发器，并且该触发器属于哪个表

```sql
SELECT event_object_table AS tab_name, trigger_name
FROM information_schema.triggers
GROUP BY tab_name, trigger_name
ORDER BY tab_name, trigger_name;
```

### 函数

创建函数语句

```plsql
CREATE [OR REPLACE] FUNCTION function_name (arguments)   
RETURNS return_datatype AS $variable_name$  
  DECLARE  
    declaration;  
    [...]  
  BEGIN  
    < function_body -- 函数逻辑 >  
    [...]  
    RETURN { variable_name | value }  
  END; 
  LANGUAGE plpgsql;
---------------------------------------------------------
CREATE FUNCTION function_name(p1 type, p2 type)
 RETURNS type AS
BEGIN
 -- 函数逻辑
END;
LANGUAGE language_name;
```
创建简单函数例子
```plsql
CREATE OR REPLACE FUNCTION add(a INTEGER, b NUMERIC)
RETURNS NUMERIC AS $$
	SELECT a+b;
$$
LANGUAGE SQL;

-- 调用方法
select  public.add(1,2);
```

#### 查询指定库下的所有自定义函数

```sql
-- 获取所有函数的名字 所在schema 所有者 以及创建脚本

SELECT
    p.proname AS functionName,
    n.nspname AS schema,
    pg_get_userbyid(p.proowner) AS owner,
    pg_get_functiondef(p.oid) AS createStatement
FROM
    pg_proc p
        JOIN
    pg_namespace n ON n.oid = p.pronamespace
WHERE
    p.prokind = 'f' -- 只选择普通函数
ORDER BY
    n.nspname, p.proname;
```

