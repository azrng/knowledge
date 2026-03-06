---
title: 常用操作
lang: zh-CN
date: 2023-09-17
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - 无
filename: changyongcaozuo
slug: ixx5mn35npqu92bb
docsId: '140121215'
---

## 系统操作

```sql
-- 查询连接数
SELECT * FROM system.metrics WHERE metric LIKE '%Connection';

-- 当前正在执行的查询
SELECT query_id, user, address, query  FROM system.processes ORDER BY query_id;

-- 存储空间统计
SELECT name,path,formatReadableSize(free_space) AS free,formatReadableSize(total_space) AS total,formatReadableSize(keep_free_space) AS reserved FROM system.disks;

-- 慢查询
SELECT
    user,
    client_hostname AS host,
    client_name AS client,
    formatDateTime(query_start_time, '%T') AS started,
    query_duration_ms / 1000 AS sec,
    round(memory_usage / 1048576) AS MEM_MB,
    result_rows AS RES_CNT,
    result_bytes / 1048576 AS RES_MB,
    read_rows AS R_CNT,
    round(read_bytes / 1048576) AS R_MB,
    written_rows AS W_CNT,
    round(written_bytes / 1048576) AS W_MB,
    query
FROM system.query_log
WHERE type = 2
ORDER BY query_duration_ms DESC
    LIMIT 10;

-- 查看库表资源占用情况
select
    sum(rows) as row,--总行数
    formatReadableSize(sum(data_uncompressed_bytes)) as ysq,--原始大小
    formatReadableSize(sum(data_compressed_bytes)) as ysh,--压缩大小
    round(sum(data_compressed_bytes) / sum(data_uncompressed_bytes) * 100, 0) ys_rate--压缩率
from system.parts
where database='datacenter';

-- 查看库中表行数统计
select database,table,sum(rows) as rows
from system.parts
where database='datacenter'
group by database, table
order by rows desc;


select distinct table from system.parts where database='datacenter';


-- drop  database datacenter;

select * from datacenter.`3cdb162688e14cc6a1bc65befca5347c_YC150`;
```

## 表操作

### 创建表

```sql
create database zyp_test;
create table user
(
    account  text comment '账户',
    password Nullable(text) comment '密码',
    name     text comment '姓名',
    deleted  UInt8 comment '是否删除'
)
engine = Memory;
```

### 更新表数据

```sql
# 根据条件批量更新数据
Alter table default.reg_record update reg_time = now() where  visit_id>300000100
```

## 程序连接

```shell
# jdbc连接数据库 localhost:8123 表示 ClickHouse 数据库的地址和端口号，mydatabase 是数据库名称
jdbc:clickhouse://localhost:8123/mydatabase?user=myusername&password=mypassword
```

## 程序操作

### 引用nuget包

```xml
<PackageReference Include="ClickHouse.Client" Version="6.6.0" />
```

### 连接字符串

```shell
Host=localhost;Port=8123;Database=zyp_test;User=default;Password=123456;Compress=True;CheckCompressedHash=False;Compressor=lz4;
```

### 查询

```csharp
await using var connection = new ClickHouseConnection(_connStr);
var result = (await connection.QueryAsync<User>("select * from user")).ToList();
Console.WriteLine(result.Count);
```

### 添加

```csharp
var sql = "INSERT INTO user (account, password, name, deleted) VALUES (@account, @password, @name, @deleted);";
await using var connection = new ClickHouseConnection(_connStr);
var result = await connection.ExecuteAsync(sql, new
{
    account = "admin",
    password = "123456",
    name = "张三",
    delete = 0
});
```

### 批量插入

```csharp
var cstr = _configuration["ConnectionStrings:DefaultConnection"];
await using var connection = new ClickHouseConnection(cstr);

using var bulkCopy = new ClickHouseBulkCopy(connection)
{
    DestinationTableName = "default.fee_detail",
    ColumnNames = new[]
    {
        "fee_detail_id",
        "org_code",
        "source_app",
        "source_fee_detail_id",
        "source_visit_id",
        "source_patient_id",
        "patient_id",
        "patient_type_id"
    },
    BatchSize = 1000
};
await bulkCopy.InitAsync();

var list = new List<object[]>();
for (var i = 0; i < number; i++)
{
    ++id;
    var random = Random.Shared.Next(1, 500);
    var randomDay = Random.Shared.Next(1, 30);

    var (deptName, userName, userName2) = Helper.GetDeptAndUserName();
    list2.Add(new object[]
    {
        id, "46919134-2", "tj_his3", "79738215", "6687|20170501", "02557206", 716, 4603
    });
}

await bulkCopy.WriteToServerAsync(list);
ConsoleHelper.WriteSuccessLine($"本页面执行成功   执行条数：{bulkCopy.RowsWritten.ToString()}");
```

### 更新

```sql
-- 根据条件更新
ALTER TABLE discharge_record_mid 
UPDATE in_days = floor(randUniform(3, 8)) 
WHERE in_time >= '2025-07-07' AND in_time < '2025-07-08'
AND visit_type = '住院'
```

### 删除

```sql
-- 根据条件删除
ALTER TABLE discharge_record_mid DELETE WHERE in_time >= '2025-07-07' and in_time < '2025-07-08'
and visit_type='住院' and antibac_flag is null
```
