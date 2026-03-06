---
title: 数据表
lang: zh-CN
date: 2022-09-30
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - 无
filename: shujubiao
slug: wqzuii
docsId: '60505017'
---

### 创建数据表
通用语法：
CREATE TABLE table_name (column_name column_type);
以下例子中我们将在runoob数据库中创建数据表runoob_tbl：
```sql
CREATE TABLE IF NOT EXISTS `chat.receptionist_buystatus`
(
  `buystatusId` bigint(20) not null COMMENT '置忙状态ID',
  `name` VARCHAR(20) not null COMMENT '置忙名称',
  `create_time` bigint(20) not null COMMENT '添加时间',
   PRIMARY KEY(`BuyStatusId`) using BTREE
)ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '置忙状态表' ROW_FORMAT = Dynamic;
```
实例解析：
• 如果你不想字段为 NULL 可以设置字段的属性为 NOT NULL， 在操作数据库时如果输入该字段的数据为NULL ，就会报错。
• AUTO_INCREMENT定义列为自增的属性，一般用于主键，数值会自动加1。
• PRIMARY KEY关键字用于定义列为主键。 您可以使用多列来定义主键，列间以逗号分隔。
• ENGINE 设置存储引擎，CHARSET 设置编码。
插入数据
INSERT INTO table_name ( field1, field2,...fieldN )
                       VALUES
                       ( value1, value2,...valueN );
insert插入多条数据
INSERT INTO table_name  (field1, field2,...fieldN)  VALUES  (valueA1,valueA2,...valueAN),(valueB1,valueB2,...valueBN),(valueC1,valueC2,...valueCN)......;
更新数据
UPDATE table_name SET field1=new-value1, field2=new-value2
[WHERE Clause]
查询数据
SELECT column_name,column_name
FROM table_name
[WHERE Clause]
[LIMIT N][ OFFSET M]
删除数据表
DROP TABLE table_name ;  删除表内全部数据和表结构，立刻释放资源，不管是 Innodb 和 MyISAM;
Truncatr table  student;        删除表内全部数据，保留表结构，立刻释放磁盘空间，不管是 Innodb 和 MyISAM;
delete from table_nam； 删除表全部数据，表结构不变，对于 MyISAM 会立刻释放磁盘空间，InnoDB 不会释放磁盘空间;
1、当你不再需要该表时， 用 drop;
2、当你仍要保留该表，但要删除所有记录时， 用 truncate;
3、当你要删除部分记录时， 用 delete。
显示指定数据库中的所有表
SHOW TABLES
显示数据表的属性，属性类型，主键信息 ，是否为 NULL，默认值等其他信息
```csharp
SHOW COLUMNS FROM 数据表
```
显示数据表的详细索引信息，包括PRIMARY KEY（主键）
SHOW INDEX FROM 数据表
输出Mysql数据库管理系统的性能及统计信息。
SHOW TABLE STATUS LIKE [FROM db_name] [LIKE 'pattern'] \G:  
删除表内数据用 delete。格式为：
delete from 表名 where 删除条件;
实例：删除学生表内姓名为张三的记录。
delete from  student where  T_name = "张三";


查询数据中的表
```csharp
show tables from 数据库名
```
获取指定数据库下所有的表以及备注
```csharp
SELECT
    TABLE_NAME,
    TABLE_COMMENT
FROM
    information_schema.`TABLES`
WHERE
    TABLE_SCHEMA = 'db_name';

```
获取指定数据库下指定表的详细信息
```csharp
SELECT
    TABLE_SCHEMA AS '库名',
    TABLE_NAME AS '表名',
    COLUMN_NAME AS '列名',
    ORDINAL_POSITION AS '列的排列顺序',
    COLUMN_DEFAULT AS '默认值',
    IS_NULLABLE AS '是否为空',
    DATA_TYPE AS '数据类型',
    CHARACTER_MAXIMUM_LENGTH AS '字符最大长度',
    NUMERIC_PRECISION AS '数值精度(最大位数)',
    NUMERIC_SCALE AS '小数精度',
    COLUMN_TYPE AS '列类型',
    COLUMN_KEY 'KEY',
    EXTRA AS '额外说明',
    COLUMN_COMMENT AS '注释'
FROM
    information_schema.`COLUMNS`
WHERE
    TABLE_SCHEMA = 'test' and TABLE_NAME='user' 
ORDER BY
    ORDINAL_POSITION;
```
