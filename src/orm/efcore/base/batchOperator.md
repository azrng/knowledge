---
title: 批量操作
lang: zh-CN
date: 2022-05-22
publish: true
author: azrng
isOriginal: true
category:
  - orm
tag:
  - 无
filename: piliangcaozuo
slug: ufbx5i
docsId: '78196600'
---

## 前言
默认情况下，EFCore中批量添加、更新和删除数据都是先查询实体，然后对数据操作，最后SaveChanges保存到数据库，生成的SQL都是一条一条的SQL执行的。

如果批量操作的数据量比较大，那么会很影响性能的。
> 起初EF Core 的开发团队认为，这样做会导致 EF Core 的对象状态跟踪混乱，但是在.Net7以及之后，已经可以实现批量更新、批量删除等的操作了
>

## 原生的实现

每个关系型数据库的最佳实现利用以下不同的数据库特定实现：

- **PostgreSQL** - 通过 Npgsql 的[二进制复制](https://www.npgsql.org/doc/copy.html)导入使用 PostgreSQL 的 [COPY](https://www.postgresql.org/docs/current/sql-copy.html) 命令，使用[ON CONFLICT](https://www.postgresql.org/docs/10/sql-insert.html#SQL-ON-CONFLICT) 进行更新
- **MySql** - 使用 [MySqlBulkLoader](https://dev.mysql.com/doc/connector-net/en/connector-net-programming-bulk-loader.html) 功能，将数据写入由`MySqlBulkLoader`
- MySqlConnector - 使用 [MySqlConnector 的 MySqlBulkLoader](https://mysqlconnector.net/api/mysqlconnector/mysqlbulkloadertype/) 实现，该实现利用其功能避免写入临时文件`SourceStream`
- SQL Server - 使用 **SQL Server** 的功能，该功能导入写入内存中的数据`SqlBulkCopy `  `DataTable`
- **SQLite - SQLite** 没有特定的导入功能，而是使用[批量多行](https://www.tutorialscampus.com/sql/insert-multiple-rows.htm)插入执行批量插入，以将 I/O 调用减少到可配置的批大小

批量插入实现方案：https://servicestack.net/posts/bulk-insert-performance#bulk-insert-implementations	

### PostgreSql

#### 插入

```c#
await using var dbConnect = (NpgsqlConnection)_dbContext.Database.GetDbConnection();
if (dbConnect.State == ConnectionState.Closed)
    await dbConnect.OpenAsync();
await using var copyImport = await dbConnect.BeginBinaryImportAsync(
    "COPY meta_data.struct_disk_occupancy(struct_id,struct_type,struct_type,disk_occupancy,create_time,update_time,status) FROM STDIN (FORMAT BINARY)");
foreach (var item in structDiskOccupancies)
{
    await copyImport.StartRowAsync();
    await copyImport.WriteAsync(item.StructId);
    await copyImport.WriteAsync(item.StructType);
    await copyImport.WriteAsync(item.DiskOccupancy);
    await copyImport.WriteAsync(item.CreateTime, NpgsqlTypes.NpgsqlDbType.Timestamp);
    if (item.UpdateTime.HasValue)
    {
        await copyImport.WriteAsync(item.UpdateTime, NpgsqlTypes.NpgsqlDbType.Timestamp);
    }
    else
    {
        await copyImport.WriteNullAsync();
    }

    copyImport.WriteAsync(item.Status);
}

var num = await copyImport.CompleteAsync();
```

资料：[https://www.npgsql.org/doc/copy.html](https://www.npgsql.org/doc/copy.html)

#### 插入冲突就更新

`ON CONFLICT`：一次性插入多个数据，并在冲突时进行更新。

示例

```sql
/*
 * 限制：
 * 1、ON CONFLICT的列必须有唯一约束等
 * 2.在一个执行语句中，不能出现ON CONFLICT冲突的列值，否则会提示：确保在具有重复受约束值的同一个命令中不会插入行
 */
INSERT INTO users (id, name)
VALUES 
    (1, 'Alice'),
    (2, 'Bob'),
    (3, 'Charlie')
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name;
```

操作

```c#
var sb = new StringBuilder(
    "INSERT INTO sample.\"user\" (account, pass_word, name, sex, credit, group_id, deleted, create_time, modify_time)");
sb.Append("values");
sb.Append("('admin','123456','cc',1,10,10,false,'2024-03-12','2024-03-12'),");
sb.Append("('admin2','123456','bbbba',1,10,10,false,'2024-03-12','2024-03-12')");
sb.Append("ON CONFLICT (account) DO UPDATE SET name = EXCLUDED.name;");
await using var db = new OpenDbContext();
var result = await db.Database.ExecuteSqlRawAsync(sb.ToString());
```

#### 不查询更新

使用values list实现批量更新

```sql
UPDATE table_name AS t
SET column1 = v.column1,
    column2 = v.column2
FROM (VALUES
          ('value1', 'value2'),
          ('value3', 'value4'),
          ('value5', 'value6')
     ) AS v(column1, column2)
WHERE t.id = v.id;
```

操作

```c#
var sb = new StringBuilder("update sample.\"user\" t set name=v.name from");
sb.Append("(values ");
sb.Append("('admin','aa'),");
sb.Append("('admin2','bb')");
sb.Append(") as v(account,name) where t.account=v.account");
await using var db = new OpenDbContext();
var result = await db.Database.ExecuteSqlRawAsync(sb.ToString());
```


## 其他开源方案

### EFCore.BulkExtensions

支持的数据库：
-**SQLServer**（或 SqlAzure）在后台使用 [SqlBulkCopy](https://msdn.microsoft.com/en-us/library/system.data.sqlclient.sqlbulkcopy.aspx) 进行插入，Update/Delete = BulkInsert + 原始 Sql [MERGE](https://docs.microsoft.com/en-us/sql/t-sql/statements/merge-transact-sql)。
-**PostgreSQL** （9.5+） 使用 [COPY BINARY](https://www.postgresql.org/docs/9.2/sql-copy.html) 和 [ON CONFLICT](https://www.postgresql.org/docs/10/sql-insert.html#SQL-ON-CONFLICT) 进行更新。
-**MySQL** （8+） 使用 [MySqlBulkCopy](https://mysqlconnector.net/api/mysqlconnector/mysqlbulkcopytype/) 与 [ON DUPLICATE](https://dev.mysql.com/doc/refman/8.0/en/insert-on-duplicate.html) 结合使用进行更新。
-**SQLite** 没有复制工具，而是库使用[纯 SQL](https://learn.microsoft.com/en-us/dotnet/standard/data/sqlite/bulk-insert) 和 [UPSERT](https://www.sqlite.org/lang_UPSERT.html) 组合。

仓库地址：https://github.com/borisdj/EFCore.BulkExtensions

Nuget包地址：https://www.nuget.org/packages/EFCore.BulkExtensions

### Entity Framework Plus

功能更加强大，扩展了更多的查询功能，它分为免费版和收费版，基础的批量操作免费版就可以支持，高级批量操作以及 SqlBulkCopy 则只有收费版支持。如果使用的是 MySQL，或者不需要 SqlBulkCopy，那么 「EF Plus 免费版」是首选，因为它支持更多的数据库，扩展了更丰富的查询功能

### Zack.EFCore.Batch

杨老师封装的一个批量操作的包。

nuget地址：https://www.nuget.org/packages/Zack.EFCore.Batch

### ServiceStack.OrmLite

资料：https://servicestack.net/posts/bulk-insert-performance

##  资料

https://mp.weixin.qq.com/s/a6ro5J4gQOK5Sac9MycfVg | .NET 数据库大数据方案（插入、更新、删除、查询 、插入或更新）
