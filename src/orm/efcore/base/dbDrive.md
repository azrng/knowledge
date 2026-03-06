---
title: 数据库驱动
lang: zh-CN
date: 2022-11-11
publish: true
author: azrng
isOriginal: true
category:
  - orm
tag:
  - 无
filename: shujukuqudong
slug: nexwzo
docsId: '89768178'
---

## 概述

Entity Framework Core 可通过名为数据库提供程序的插件库访问许多不同的数据库。

网址：https://learn.microsoft.com/zh-cn/ef/core/providers/?tabs=dotnet-core-cli

## MySQL

引用组件：Pomelo.EntityFrameworkCore.MySql
使用方法：.UseInMemoryDatabase(databaseName)
连接字符串：Server=192.168.100.104;database=azrngblog;uid=root;pwd=123456;SslMode=None;
       Server=localhost;Database=test;Port=3306;charset=utf8;uid=root;pwd=123456;

## PostgreSQL

### Npgsql

#### 使用方法

引用组件：[Npgsql.EntityFrameworkCore.PostgreSQL](https://www.nuget.org/packages/Npgsql.EntityFrameworkCore.PostgreSQL/)
使用方法：.UseNpgsql(connectionString)
连接字符串：Host=localhost;port=5432;Username=postgres;Password=123456;Database=test

#### 连接字符串
> 资料来源：[https://www.npgsql.org/doc/connection-string-parameters.html](https://www.npgsql.org/doc/connection-string-parameters.html)


连接字符串的形式为keyword1=value;keyword2 =价值;和是不区分大小写的。包含特殊字符(例如分号)的值可以用双引号括起来。

##### 标准
```csharp
Host=localhost;port=5432;Username=postgres;Password=123456;Database=test
```
| 参数 | 说明 | 默认值 |
| --- | --- | --- |
| Host | 指定运行PostgreSQL的主机名(可选端口)。可以指定多个主机， | 必填 |
| Port | PostgreSQL服务器的TCP端口。 | 5432 |
| Database | 要连接的数据库 |  |
| Username | 连接的用户名，如果是IntegratedSecurity则不需要 |  |
| Password | 连接的密码，如果是IntegratedSecurity则不需要 |  |
| Passfile | PostgreSQL密码文件(PGPASSFILE)的路径。 |  |


##### 连接池
| Parameter | Description | Default |
| :-- | --- | --- |
| Pooling | 是否应使用连接池 | true |
| Minimum Pool Size | 最小连接池大小 | 0 |
| Maximum Pool Size | 最大连接池大小 | 自 3.1 以来为 100 个，以前为 20 个 |
| Connection Idle Lifetime(连接空闲生存期) | 如果所有连接计数超过 `Minimum Pool Size` ，则在关闭池中的空闲连接之前等待的时间（以秒为单位）。在 3.1 中引入。 | 300 |
| Connection Pruning Interval(连接修剪间隔) | 池在尝试修剪超出空闲生存期的空闲连接之前等待了多少秒（请参见 `Connection Idle Lifetime` ）。在 3.1 中引入。 | 10 |
| ConnectionLifetime(连接生存期) | 连接的总最大生存期（以秒为单位）。超过此值的连接将被销毁，而不是从池中返回。这在群集配置中非常有用，可以在正在运行的服务器和刚刚联机的服务器之间强制进行负载平衡。 | 0 (disabled) |


##### 超时
| Parameter | Description | Default |
| :-- | --- | --- |
| Timeout(连接超时时间) | 在终止尝试并生成错误之前尝试建立连接时等待的时间（以秒为单位）。 | 15 |
| Command Timeout(命令执行超市时间) | 在尝试执行命令并终止尝试并生成错误之前等待的时间（以秒为单位）。设置为零表示无穷大 | 30 |
| Cancellation Timeout(取消超时) | 在尝试读取超时或已取消查询的取消请求的响应时等待的时间（以毫秒为单位），然后终止尝试并生成错误。-1 跳过等待，0 表示无限等待。在 5.0 中引入。 | 2000 |
| Keepalive | Npgsql 发送 keepalive 查询之前连接处于非活动状态的秒数。 | 0 (disabled) |
| Tcp Keepalive(保持活动状态) | 如果未指定覆盖，是否将 TCP keepalive 与系统默认值一起使用 | false |
| Tcp Keepalive Time(保持活动时间) | 发送 TCP keepalive 查询之前连接处于非活动状态的秒数。不建议使用此选项，如果可能，请改用 KeepAlive。 | 0 (disabled) |
| Tcp Keepalive Interval(Tcp Keepalive 间隔) | 如果未收到确认，则发送连续保持活动数据包之间的间隔（以秒为单位）。 `Tcp KeepAlive Time` 也必须为非零。 | value of Tcp Keepalive Time |

##### 兼容性

| 参数                                      | 说明                                                         | 默认值 |
| :---------------------------------------- | ------------------------------------------------------------ | ------ |
| Server Compatibility Mode(服务器兼容模式) | 特殊pgsql服务器类型的兼容模式，目前支持“Redshift”和“NoTypeLoading”，它将绕过 PostgreSQL 目录表中的正常类型加载机制，并支持基本类型的硬编码列表。 | None   |

当你遇到连接一个数据库，`open`的时候超时，且将`Timeout`时间设置久一点的时候，又可以正常连接，那么这个时候就可以考虑将该配置设置为`Server Compatibility Mode=NoTypeLoading`试试。

#### Open方法

当创建连接的后，然后打开链接的时候会执行下面的SQL

```sql
SQL Load Backend Type：SELECT version();

SELECT ns.nspname, t.oid, t.typname, t.typtype, t.typnotnull, t.elemtypoid
FROM (
    -- Arrays have typtype=b - this subquery identifies them by their typreceive and converts their typtype to a
    -- We first do this for the type (innerest-most subquery), and then for its element type
    -- This also returns the array element, range subtype and domain base type as elemtypoid
    SELECT
        typ.oid, typ.typnamespace, typ.typname, typ.typtype, typ.typrelid, typ.typnotnull, typ.relkind,
        elemtyp.oid AS elemtypoid, elemtyp.typname AS elemtypname, elemcls.relkind AS elemrelkind,
        CASE WHEN elemproc.proname='array_recv' THEN 'a' ELSE elemtyp.typtype END AS elemtyptype
    FROM (
        SELECT typ.oid, typnamespace, typname, typrelid, typnotnull, relkind, typelem AS elemoid,
            CASE WHEN proc.proname='array_recv' THEN 'a' ELSE typ.typtype END AS typtype,
            CASE
                WHEN proc.proname='array_recv' THEN typ.typelem
                WHEN typ.typtype='r' THEN rngsubtype
                WHEN typ.typtype='m' THEN (SELECT rngtypid FROM pg_range WHERE rngmultitypid = typ.oid)
                WHEN typ.typtype='d' THEN typ.typbasetype
            END AS elemtypoid
        FROM pg_type AS typ
        LEFT JOIN pg_class AS cls ON (cls.oid = typ.typrelid)
        LEFT JOIN pg_proc AS proc ON proc.oid = typ.typreceive
        LEFT JOIN pg_range ON (pg_range.rngtypid = typ.oid)
    ) AS typ
    LEFT JOIN pg_type AS elemtyp ON elemtyp.oid = elemtypoid
    LEFT JOIN pg_class AS elemcls ON (elemcls.oid = elemtyp.typrelid)
    LEFT JOIN pg_proc AS elemproc ON elemproc.oid = elemtyp.typreceive
) AS t
JOIN pg_namespace AS ns ON (ns.oid = typnamespace)
WHERE
    typtype IN ('b', 'r', 'm', 'e', 'd') OR -- Base, range, multirange, enum, domain
    (typtype = 'c' AND relkind='c') OR -- User-defined free-standing composites (not table composites) by default
    (typtype = 'p' AND typname IN ('record', 'void', 'unknown')) OR -- Some special supported pseudo-types
    (typtype = 'a' AND (  -- Array of...
        elemtyptype IN ('b', 'r', 'm', 'e', 'd') OR -- Array of base, range, multirange, enum, domain
        (elemtyptype = 'p' AND elemtypname IN ('record', 'void')) OR -- Arrays of special supported pseudo-types
        (elemtyptype = 'c' AND elemrelkind='c') -- Array of user-defined free-standing composites (not table composites) by default
    ))
ORDER BY CASE
       WHEN typtype IN ('b', 'e', 'p') THEN 0           -- First base types, enums, pseudo-types
       WHEN typtype = 'r' THEN 1                        -- Ranges after
       WHEN typtype = 'm' THEN 2                        -- Multiranges after
       WHEN typtype = 'c' THEN 3                        -- Composites after
       WHEN typtype = 'd' AND elemtyptype <> 'a' THEN 4 -- Domains over non-arrays after
       WHEN typtype = 'a' THEN 5                        -- Arrays after
       WHEN typtype = 'd' AND elemtyptype = 'a' THEN 6  -- Domains over arrays last
END;

-- Load field definitions for (free-standing) composite types
SELECT typ.oid, att.attname, att.atttypid
FROM pg_type AS typ
JOIN pg_namespace AS ns ON (ns.oid = typ.typnamespace)
JOIN pg_class AS cls ON (cls.oid = typ.typrelid)
JOIN pg_attribute AS att ON (att.attrelid = typ.typrelid)
WHERE
  (typ.typtype = 'c' AND cls.relkind='c') AND
  attnum > 0 AND     -- Don't load system attributes
  NOT attisdropped
ORDER BY typ.oid, att.attnum;

-- Load enum fields
SELECT pg_type.oid, enumlabel
FROM pg_enum
JOIN pg_type ON pg_type.oid=enumtypid
ORDER BY oid, enumsortorder;
```

## SQL Server

引用组件：[Microsoft.EntityFrameworkCore.SqlServer](https://www.nuget.org/packages/Microsoft.EntityFrameworkCore.SqlServer/)
使用方法：.UseSqlServer(connectionString)


```sh
# 默认
server=localhost;uid=sa;pwd=123;database=Christ

# 指定实例名
Server=ip\instanceName,portNumber;Database=myDataBase;User Id=myUsername;Password=myPassword;

# 自动信任服务证书 否则提示错误：provider: SSL Provider, error: 0 - 证书链是由不受信任的颁发机构颁发的
Server=ip\instanceName,portNumber;Database=myDataBase;User Id=myUsername;Password=myPassword;trustServerCertificate=true;

# windows身份
Server=localhost;Database=EFDB01;Trusted_Connection=True;
# 手动设置连接池的最大(小)数量：Max Pool Size=100;Min Pool Size=5;  
```

常见的连接问题

https://www.cnblogs.com/printertool/p/14084385.html

https://blog.csdn.net/u010476739/article/details/116740485

## Oracle

引用组件：[Npgsql.EntityFrameworkCore.PostgreSQL](https://www.nuget.org/packages/Npgsql.EntityFrameworkCore.PostgreSQL/)
使用方法：.UseOracle(connectionString)

```sql
-- service name
Data Source=(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST={0})(PORT={1}))(CONNECT_DATA=(SERVICE_NAME = dbNameValue )));Persist Security Info=True;User ID={3};Password={4};

-- sid
Data Source=(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST={0})(PORT={1}))(CONNECT_DATA=(SID = sidValue )));Persist Security Info=True;User ID={3};Password={4};
```

## SQLite
引用组件：[Microsoft.EntityFrameworkCore.Sqlite](https://www.nuget.org/packages/Microsoft.EntityFrameworkCore.Sqlite/)
使用方法：.UseInMemoryDatabase(databaseName)
连接字符串：Data Source=Db/Test.db

## InMemory
引用组件：[Microsoft.EntityFrameworkCore.InMemory](https://www.nuget.org/packages/Microsoft.EntityFrameworkCore.InMemory/)
使用方法：.UseInMemoryDatabase(databaseName)
