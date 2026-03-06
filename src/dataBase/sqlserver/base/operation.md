---
title: 基础操作
lang: zh-CN
date: 2023-09-23
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - 无
filename: jichucaozuo
slug: eiw29x
docsId: '78355755'
---

## 系统操作

### 数据库版本

```sql
-- 查看数据库版本
select @@version
```

### 检索执行SQL时间

```sql
declare @begin_date datetime 
declare @end_date datetime 
select @begin_date = getdate() 
-----------需要执行的sql语句
select AC_ID from [dbo].[ys_tb_Collection51] where AC_ID=4273  or AC_ID=4274
----------
select @end_date = getdate() 
select datediff(ms,@begin_date,@end_date) as '用时/毫秒'

-- sqlserver查询慢sql  
SELECT t.text,
       (qs.total_elapsed_time / 1000) / qs.execution_count                                                          AS avg_elapsed_time,
       (qs.total_worker_time / 1000) / qs.execution_count                                                           AS avg_cpu_time,
       ((qs.total_elapsed_time / 1000) / qs.execution_count) -
       ((qs.total_worker_time / 1000) / qs.execution_count)                                                         AS avg_wait_time,
       qs.total_logical_reads / qs.execution_count                                                                  AS avg_logical_reads,
       qs.total_logical_writes / qs.execution_count                                                                 AS avg_writes,
       (qs.total_elapsed_time / 1000)                                                                               AS cumulative_elapsed_time_all_executions
FROM sys.dm_exec_query_stats qs
         CROSS apply sys.Dm_exec_sql_text (sql_handle) t
WHERE t.text like '%具体的表名%'
  and qs.creation_time
    > '2023-12-05 16:00:00'
ORDER BY (qs.total_elapsed_time / qs.execution_count) DESC
```
> 参考资料 [https://www.cnblogs.com/wangguowen27/p/SqlServer_Select_wgw.html](https://www.cnblogs.com/wangguowen27/p/SqlServer_Select_wgw.html)

### 连接数

```sql
-- 查询数据库连接数语句：
SELECT * FROM SYSPROCESSES WHERE DBID = DB_ID('数据库名')
--手动设置连接池的最大(小)数量： "Server=localhost;Database=Test;Trusted_Connection=True;Max Pool Size=100;Min Pool Size=5"
```

### 表结构

```
-- 查询表备注
 use zyp; 
SELECT DISTINCT
    d.name,
    f.value 
FROM
    syscolumns a
    LEFT JOIN systypes b ON a.xusertype= b.xusertype
    INNER JOIN sysobjects d ON a.id= d.id 
    AND d.xtype= 'U' 
    AND d.name<> 'dtproperties'
    LEFT JOIN syscomments e ON a.cdefault= e.id
    LEFT JOIN sys.extended_properties g ON a.id= G.major_id 
    AND a.colid= g.minor_id
    LEFT JOIN sys.extended_properties f ON d.id= f.major_id 
    AND f.minor_id= 0
WHERE d.name='user_info'

-- 查询一个表详细结构信息
SELECT  obj.name AS 表名,
        col.colorder AS 序号 ,
        col.name AS 列名 ,
        ISNULL(ep.[value], '') AS 列说明 ,
        t.name AS 数据类型 ,
        col.length AS 长度 ,
        ISNULL(COLUMNPROPERTY(col.id, col.name, 'Scale'), 0) AS 小数位数 ,
        CASE WHEN COLUMNPROPERTY(col.id, col.name, 'IsIdentity') = 1 THEN '√'
             ELSE ''
        END AS 标识 ,
        CASE WHEN EXISTS ( SELECT   1
                           FROM     dbo.sysindexes si
                                    INNER JOIN dbo.sysindexkeys sik ON si.id = sik.id
                                                              AND si.indid = sik.indid
                                    INNER JOIN dbo.syscolumns sc ON sc.id = sik.id
                                                              AND sc.colid = sik.colid
                                    INNER JOIN dbo.sysobjects so ON so.name = si.name
                                                              AND so.xtype = 'PK'
                           WHERE    sc.id = col.id
                                    AND sc.colid = col.colid ) THEN '√'
             ELSE ''
        END AS 主键 ,
        CASE WHEN col.isnullable = 1 THEN '√'
             ELSE ''
        END AS 允许空 ,
        ISNULL(comm.text, '') AS 默认值
FROM    dbo.syscolumns col
        LEFT  JOIN dbo.systypes t ON col.xtype = t.xusertype
        inner JOIN dbo.sysobjects obj ON col.id = obj.id
                                         AND obj.xtype = 'U'
                                         AND obj.status >= 0
        LEFT  JOIN dbo.syscomments comm ON col.cdefault = comm.id
        LEFT  JOIN sys.extended_properties ep ON col.id = ep.major_id
                                                      AND col.colid = ep.minor_id
                                                      AND ep.name = 'MS_Description'
        LEFT  JOIN sys.extended_properties epTwo ON obj.id = epTwo.major_id
                                                         AND epTwo.minor_id = 0
                                                         AND epTwo.name = 'MS_Description'
WHERE   obj.name = 'user_info'--表名
ORDER BY obj.name,col.colorder ;
```

### 磁盘统计

```sql
-- 查询所有表大小、占用空间
SELECT 　db_name() as DbName,
    t.NAME AS TableName,
    s.Name AS SchemaName,
    p.rows AS RowCounts,
    SUM(a.total_pages) * 8 AS TotalSpaceKB, 
    CAST(ROUND(((SUM(a.total_pages) * 8) / 1024.00), 2) AS NUMERIC(36, 2)) AS 总共占用空间MB,
    SUM(a.used_pages) * 8 AS UsedSpaceKB, 
    CAST(ROUND(((SUM(a.used_pages) * 8) / 1024.00), 2) AS NUMERIC(36, 2)) AS UsedSpaceMB, 
    (SUM(a.total_pages) - SUM(a.used_pages)) * 8 AS UnusedSpaceKB,
    CAST(ROUND(((SUM(a.total_pages) - SUM(a.used_pages)) * 8) / 1024.00, 2) AS NUMERIC(36, 2)) AS UnusedSpaceMB
FROM 
    sys.tables t
INNER JOIN      
    sys.indexes i ON t.OBJECT_ID = i.object_id
INNER JOIN 
    sys.partitions p ON i.object_id = p.OBJECT_ID AND i.index_id = p.index_id
INNER JOIN 
    sys.allocation_units a ON p.partition_id = a.container_id
LEFT OUTER JOIN 
    sys.schemas s ON t.schema_id = s.schema_id
WHERE 
    t.NAME NOT LIKE 'dt%' 
    AND t.is_ms_shipped = 0
    AND i.OBJECT_ID > 0
GROUP BY 
    t.Name, s.Name, p.Rows
ORDER BY 
    总共占用空间MB desc
    
    
-- 查询存在表的schema
SELECT distinct b.name as Schema_name
from sys.tables a
         inner join sys.schemas b on a.schema_id=b.schema_id;

-- 查询指定schema下所有的表
SELECT a.name as TableName,
       id,
       (select top 1 value from sys.extended_properties where id = major_id) as TableComment
from sys.sysobjects a
         inner join sys.tables b on a.id = b.object_id
         inner join sys.schemas c on b.schema_id = c.schema_id
where a.xtype = 'U'
  and c.name = 'dbo'
  
  
-- 查询每个表的记录行数
SELECT db_name() as DbName, t.NAME AS TableName, s.Name AS SchemaName, p.rows AS RowCounts
FROM sys.tables t
         INNER JOIN sys.indexes i ON t.OBJECT_ID = i.object_id
         INNER JOIN sys.partitions p ON i.object_id = p.OBJECT_ID AND i.index_id = p.index_id
         LEFT OUTER JOIN sys.schemas s ON t.schema_id = s.schema_id
WHERE t.NAME NOT LIKE 'dt%'
  AND t.is_ms_shipped = 0
  AND i.OBJECT_ID > 0;
  
 -- 查询指定数据库下指定的表详细信息(列名、类型、备注等)
 SELECT [Is_IDENTITY] = case
                           when COLUMNPROPERTY([Columns].object_id, [Columns].name, 'IsIdentity') = 1 then 1
                           else 0 end,
       [ColName]     = [Columns].name,
       [ColType]     = [Types].name,
       [Length]      = [Columns].max_length,
       [Is_Null]     = [Columns].is_nullable,
       [ColComment]  = [Properties].value,
                       [INFORMATION].COLUMN_DEFAULT as ColDefault
FROM sys.tables AS [Tables]
         INNER JOIN sys.columns AS [Columns] ON [Tables].object_id = [Columns].object_id
         INNER JOIN sys.types AS [Types]
                    ON [Columns].system_type_id = [Types].system_type_id AND is_user_defined = 0 AND
                       [Types].name <> 'sysname'
         inner join INFORMATION_SCHEMA.COLUMNS [INFORMATION]
                    on [INFORMATION].TABLE_NAME = [Tables].name and [INFORMATION].COLUMN_NAME = [Columns].name
         LEFT OUTER JOIN sys.extended_properties AS [Properties] ON [Properties].major_id = [Tables].object_id AND
                                                                    [Properties].minor_id = [Columns].column_id AND
                                                                    [Properties].name = 'MS_Description'
WHERE [INFORMATION].TABLE_SCHEMA = 'dbo'
  and [Tables].name = 'user'
ORDER BY [Columns].column_id

-- 查询数据库文件大小
SELECT name                                                AS 文件名,
       size * 8 / 1024                                     AS 文件大小_MB,
       FILEPROPERTY(name, 'SpaceUsed') * 8 / 1024          AS 使用空间_MB,
       (size - FILEPROPERTY(name, 'SpaceUsed')) * 8 / 1024 AS 剩余空间_MB
FROM sys.database_files;

--  查询指定库下所有表的字段占用
SELECT TABLE_SCHEMA                   schemaName,
       TABLE_NAME                     TableName,
       COLUMN_NAME                    ColumnName,
       (SUM(DATALENGTH(COLUMN_NAME))) diskSize
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_CATALOG = 'sample'
group by TABLE_SCHEMA, TABLE_NAME, COLUMN_NAME;

-- 查询指定数据库下的所有schema
select count(1) from information_schema.schemata where CATALOG_NAME='meta_test' and SCHEMA_NAME='aa'
```

资料：https://www.cnblogs.com/gered/p/9009513.html

## 程序连接

```sh
# jdbc连接 localhost:1433 表示数据库的地址和端口号，mydatabase是数据库名称，sa是用户名，123456是密码
jdbc:sqlserver://localhost:1433;databaseName=mydatabase;user=sa;password=123456
# sqlserver Windows 身份验证模式登录
jdbc:sqlserver://localhost:1433;databaseName=mydatabase;integratedSecurity=true;
```

### .Net连接

```shell
# .Net连接
Data Source=localhost;Initial Catalog=test;uid=sa;pwd=Sql987654;Persist Security Info=True;
Server=localhost;Database=dbname;User=sa;Password=000000;MultipleActiveResultSets=True;

# 指定实例名和端口
Server=myServerName\instanceName,portNumber;Database=myDataBase;User Id=myUsername;Password=myPassword;
```

使用Nuget包`Microsoft.Data.SqlClient`连接Microsoft SQL Server 2008 R2 (RTM)，示例如下(连接其他高版本一样的操作只不过2008在Linux容器中连接需要搞ODBC的方案 才可以)

```csharp
using Microsoft.Data.SqlClient;

var conn = "Server=172.16.70.53\\MSSQLSERVER,1433;Database=cdr;User Id=sa;Password=Synyi123;trustServerCertificate=true;";
var connection = new SqlConnection(conn);
connection.Open();

string sqlQuery = "Select @@version";
var command = new SqlCommand(sqlQuery, connection);
var reader = command.ExecuteScalar();
Console.WriteLine(reader.ToString());

// outputs
安全警告:协商的 TLS 1.0 是非安全协议，只有在为了实现向后兼容性才受支持。建议的协议版本为 TLS 1.2 及更高版本。
Microsoft SQL Server 2008 R2 (RTM) - 10.50.1600.1 (X64)                                
        Apr  2 2010 15:48:46                                                           
        Copyright (c) Microsoft Corporation                                            
        Enterprise Edition (64-bit) on Windows NT 6.2 <X64> (Build 9200: ) (Hypervisor)
```

## 数据库

 查询数据库大小
```sql
SELECT ISNULL(DB_NAME(database_id), ' ') AS DatabaseName,
CAST(COUNT(row_count)*8.0/1024.0 AS DECIMAL(28,2)) AS [Size(MB)]
FROM sys.dm_os_buffer_descriptors
GROUP BY database_id
ORDER BY [Size(MB)] DESC
```
创建数据库
```csharp
-- 创建数据库并使用中文编码
CREATE DATABASE 数据库名 COLLATE Chinese_PRC_CI_AS
```


## 表

### 操作表
```sql
--新建表
create table 仓库  
(  
  仓库编号 int ,   
  仓库号 varchar(50) ,   
  城市 varchar(50) ,   
  面积 int  
) 

-- 重命名表
sp_rename '表名', '新表名', 'OBJECT'

-- 新增字段
ALTER TABLE [表名] ADD [字段名] NVARCHAR (50) NULL
--添加多个字段
ALTER TABLE [表名] ADD [字段名] NVARCHAR (50) NULL，[字段名] NVARCHAR (50) NULL
-- 新建默认值
ALTER TABLE [表名] ADD CONSTRAINT 默认值名 DEFAULT 'ABC' FOR [字段名]
-- 删除默认值
ALTER TABLE [表名] DROP CONSTRAINT 默认值名


-- 修改字段
ALTER TABLE [表名] ALTER COLUMN [字段名] NVARCHAR (50) NULL


--删除字段
ALTER TABLE [表名] DROP COLUMN [字段名]

修改字段
alter table Grade alter column [Name] nvarchar(100) not null
添加字段
alter table Grade add [Year] char(8) not null
删除字段
alter table Grade drop column [Year]

```

### 查询

#### 联合查询
```sql
联合查询
SELECT * from  (select   *  from b_sys_user where create_user='11111') as a 
INNER JOIN  
SELECT * from (SELECT  * from  t_sys_circle_user   where  user_id='111')as b  
on a.user_id=b.user_id
这样 直接两个表把自己所需要的参数全部带进去后再关联 速度很快  


```

#### 分页

#### SQL结构
```csharp
select * from (select row_number() over(order by Id) as num,* from dbo.TBLogins) as temp where num>2 and num<=4
```

#### 存储过程
```sql
set ANSI_NULLS ON
set QUOTED_IDENTIFIER ON
go



CREATE PROC [dbo].[PROC_GetPageData]
    @pageIndex INT ,--当前的页码值
    @pageSize INT ,--每页显示的记录数.(每页显示几行数据)
    @rowCount INT OUTPUT ,--表示总的记录数
    @pageCount INT OUTPUT ,--表示总页数
    @tableName VARCHAR(50) ,--表名
    @idName VARCHAR(20) ,--排序字段
    @whereStr VARCHAR(512) ,--where条件
    @isDesc BIT--是否降序
AS 
    BEGIN
        DECLARE @sql NVARCHAR(512)
        DECLARE @where NVARCHAR(512)
        DECLARE @orderBy NVARCHAR(50)
        SET @where=''
        IF @whereStr <> '' AND @whereStr IS NOT NULL
            BEGIN
                SET @where = @whereStr
            END
        IF @isDesc <> 0 
            BEGIN
                SET @orderBy = ' desc'
            END
        ELSE 
            BEGIN
                SET @orderBy = ' asc'
            END
        SET @sql = 'select @totalRowCount=count(*) from ' + @tableName + @where

        EXEC sp_executesql @sql, N'@totalRowCount int output', @rowCount OUTPUT
        SET @sql = 'select @totalPageCount=' + CONVERT(NVARCHAR, CEILING(@rowCount / CONVERT(FLOAT, @pageSize)))
        EXEC sp_executesql @sql, N'@totalPageCount int output', @pageCount OUTPUT

        IF @pageIndex <= 1 
            BEGIN

                SET @pageIndex = 1
            END
        IF @pageIndex >= @pageCount 
            BEGIN

                SET @pageIndex = @pageCount
            END
        SET @sql = 'select * from (select row_number() over(order by '
            + @idName + @orderBy + ' ) as num,* from ' + @tableName + @where
            + ') as temp where num>' + CONVERT(NVARCHAR, ( @pageIndex - 1 )
            * @pageSize) + ' and num<=' + CONVERT(NVARCHAR, @pageIndex
            * @pageSize) 

    END
    EXEC sp_executesql @sql


调用dbhelper中方法   包含有输出参数
 public List<BusinessTypeInfo> pageBusinessTypeShow(PageModel info, out int rowcount)
        {
            SqlParameter[] parm ={
                                new SqlParameter("@PageSize",info.PageSize),
                                new SqlParameter("@PageIndex",info.PageIndex),
                                new SqlParameter("@tableName",info.tableName),
                                new SqlParameter("@rowCount",DbType.Int32),
                                new SqlParameter("@pageCount",DbType.Int32),
                                 new SqlParameter("@idName",info.idName),
                                new SqlParameter("@whereStr",info.whereStr),
                                new SqlParameter("@isDesc",info.isDesc),
                                };
            parm[3].Direction = ParameterDirection.Output;
            // parm[4].Direction = ParameterDirection.Output;
            List<BusinessTypeInfo> Binfo = new List<BusinessTypeInfo>();
            using (SqlDataReader dr = DBHelper.DataReaderByProc("PROC_GetPageData", parm))
            {
                if (dr.HasRows)
                {
                    while (dr.Read())
                    {
                        Binfo.Add(new BusinessTypeInfo()
                        {
                            Bid = Convert.ToInt32(dr["Bid"]),
                            Bname = dr["Bname"].ToString()
                        });
                    }
                }
                else
                {
                    rowcount = 0;
                    Binfo = null;
                }
            }
            rowcount = Convert.ToInt32(parm[3].Value);
            return Binfo;
        }

前台传值界面
          BLLpage bllpage = new BLLpage();
            int rowcount;//分页总条数
            AspNetPager1.PageSize = pagesize;
            PageModel page = new PageModel();
            page.isDesc = false;
            page.idName = "uid";
            page.tableName = "users";
            page.whereStr = "";
            if (!string.IsNullOrEmpty(uname))
            {
                //page.whereStr = string.Format(" where uname='{0}'",txtUname.Text.Trim());
                page.whereStr = string.Format(" where  uname like '%{0}%'", uname);
            }
            page.PageIndex = AspNetPager1.CurrentPageIndex;
            page.PageSize = AspNetPager1.PageSize;
            rptShow.DataSource = bllpage.pageUserShow(page, out rowcount);
            AspNetPager1.RecordCount = rowcount;
            rptShow.DataBind();





dbhelp方法
 /// <summary>
        /// 执行存储过程
        /// </summary>
        /// <param name="procname"></param>
        /// <param name="parm"></param>
        /// <returns></returns>
        public static SqlDataReader DataReaderByProc(string procname, params SqlParameter[] parm)
        {
            SqlConnection con = new SqlConnection(conn);
            using (SqlCommand cmd = new SqlCommand(procname, con))
            {
                if (con.State == ConnectionState.Closed)
                {
                    con.Open();
                }
                if (parm != null)
                {
                    cmd.Parameters.AddRange(parm);
                }
                cmd.CommandType = CommandType.StoredProcedure;
                return cmd.ExecuteReader(CommandBehavior.CloseConnection);
            }
        }
```

### 添加数据

#### 基础添加

1.如果表有自动增长列，那么需要先打开自动增长的写入，然后插入数据结束以后在关闭
```sql
SET IDENTITY_INSERT [ys_tb_Role] ON
INSERT [ys_tb_Role] ([r_id],[r_rolename],[r_powers]) VALUES ( 1,N'总经理',N',1,2,3,4,5,6,7,8,')
SET IDENTITY_INSERT [ys_tb_Role] OFF
```
2.插入多条数据
```sql
Insert into 表名字(id,name,sale,salesdate)
Select  1,'营销一部'，300,'2007-1-1'
Union all select 2,'营销二部',500,'2006-1-1'
Union all select 3,'营销三部',500,'2011-1-1'
```
3.插入一条数据
```sql
INSERT INTO [dbo].[user_info]([id], [user_name], [status]) VALUES ('11', '111', '0');
```

数据插入到另一个表
```sql
一：如果要插入目标表不存在：
select * into 目标表 from 表 where ...
二：如果要插入目标表已经存在：
insert into 目的表 select * from 表 where 条件
三：如果是跨数据库操作的话： 怎么把A数据库的atable表所查询的东西，全部插入到B 数据库的btable表中
select * into B.btable from A.atable where ...
 
```

#### 批量添加

```csharp
var stopwatch = Stopwatch.StartNew();
var list = GetUserList(5000);
Console.WriteLine($"构造数据:{list.Count}  结束：{stopwatch.ElapsedMilliseconds}  ");

var dt = new DataTable();
dt.Columns.Add(nameof(User.Id), typeof(long));
dt.Columns.Add(nameof(User.Account), typeof(string));
dt.Columns.Add(nameof(User.PassWord), typeof(string));
dt.Columns.Add(nameof(User.Name), typeof(string));
dt.Columns.Add(nameof(User.Sex), typeof(int));
dt.Columns.Add(nameof(User.Credit), typeof(double));
dt.Columns.Add(nameof(User.GroupId), typeof(long));
dt.Columns.Add(nameof(User.Deleted), typeof(bool));
dt.Columns.Add(nameof(User.CreateTime), typeof(DateTime));
dt.Columns.Add(nameof(User.ModifyTime), typeof(DateTime));

foreach (var user in list)
{
    dt.Rows.Add(user.Id, user.Account, user.PassWord, user.Name, user.Sex, user.Credit, user.GroupId,
        user.Deleted, user.CreateTime, user.ModifyTime);
}

await using var dbContext = new OpenDbContext();
using var bulk = new SqlBulkCopy(dbContext.Database.GetConnectionString());
bulk.DestinationTableName = "dbo.Users";

bulk.ColumnMappings.Add(nameof(User.Id), "Id");
bulk.ColumnMappings.Add(nameof(User.Account), "Account");
bulk.ColumnMappings.Add(nameof(User.PassWord), "PassWord");
bulk.ColumnMappings.Add(nameof(User.Name), "Name");
bulk.ColumnMappings.Add(nameof(User.Sex), "Sex");
bulk.ColumnMappings.Add(nameof(User.Credit), "Credit");
bulk.ColumnMappings.Add(nameof(User.GroupId), "GroupId");
bulk.ColumnMappings.Add(nameof(User.Deleted), "Deleted");
bulk.ColumnMappings.Add(nameof(User.CreateTime), "CreateTime");
bulk.ColumnMappings.Add(nameof(User.ModifyTime), "ModifyTime");

await bulk.WriteToServerAsync(dt);
```

### 更新数据

```plsql
-- 更新查询出来的数据
Update t1 
　　　　set t1.c2 = t2.c2
fro m t1 inner join t2 
　　　　on t1.c1 = t2.c1
```

#### 使用`JOIN`批量更新

如果需要根据另一个表的数据来更新当前表，可以使用`JOIN`。

```sql
UPDATE your_table
SET your_table.column_name = another_table.new_value
FROM your_table
INNER JOIN another_table ON your_table.id = another_table.your_table_id
WHERE some_condition;
```

#### 使用`MERGE`语句批量更新

`MERGE`语句可以用来根据另一个表的数据来更新或插入当前表的数据。

```sql
MERGE your_table AS target
USING (SELECT id, new_value FROM another_table) AS source
ON (target.id = source.id)
WHEN MATCHED THEN
    UPDATE SET target.column_name = source.new_value
WHEN NOT MATCHED BY TARGET THEN
    INSERT (id, column_name)
    VALUES (source.id, source.new_value);
```

### 删除数据

```sql
-- 删除后再添加id从1开始
truncate table [tablename] 即可
-- 删除后再添加，从之前的最大id后面加1
Drop table 表名
```

### 约束
```sql
-- 新建约束
ALTER TABLE [表名] ADD CONSTRAINT 约束名 CHECK ([约束字段] <= '2010-12-1')

--删除约束
ALTER TABLE [表名] DROP CONSTRAINT 约束名

IF  EXISTS (SELECT * FROM dbo.sysobjects WHERE id = OBJECT_ID(N'[dbo].[FK_BuiAddProType_BuildFunction]') AND type = 'F')
ALTER TABLE [dbo].[BuiAddProType] DROP CONSTRAINT [FK_BuiAddProType_BuildFunction]


外键约束
alter table dbo.ys_tb_Admin 
Add constraint FK_ys_tb_Admin_ys_tb_Role foreign key (a_rid) references dbo.ys_tb_Role(r_id)
主键约束
alter table Grade Add constraint [PK_Grade] primary key (Id)
唯一约束
alter table Grade add constraint [IX_Grade_Name] unique (Id asc)
check约束
alter table Student add constraint CK_Student_Gender CHECK (([Gender]=N'男' OR [Gender]=N'女'))
删除约束
alter table Student drop constraint IX_Student_Name


```

## 游标
对处理结果集(查询之后返回的所有行数据的集合)的一种机制，可以定位到结果集找那个的某一行，然后操作数据。
静态游标的完整结果集将打开游标时建立的结果集存储在临时表中，（静态游标始终是只读的）。

静态游标具有以下特点：总是按照打开游标时的原样显示结果集；不反映数据库中作的任何修改，也不反映对结果集行的列值所作的更改；不显示打开游标后在数据库中新插入的行；组成结果集的行被其他用户更新，新的数据值不会显示在静态游标中；但是静态游标会显示打开游标以后从数据库中删除的行。

**动态游标**与静态游标相反，当滚动游标时动态游标反映结果集中的所有更改。结果集中的行数据值、顺序和成员每次提取时都会改变。
**只进游标**不支持滚动，它只支持游标从头到尾顺序提取数据行。注意：只进游标也反映对结果集所做的所有更改。
**键集驱动游标**同时具有静态游标和动态游标的特点。当打开游标时，该游标中的成员以及行的顺序是固定的，键集在游标打开时也会存储到临时工作表中，对非键集列的数据值的更改在用户游标滚动的时候可以看见，在游标打开以后对数据库中插入的行是不可见的，除非关闭重新打开游标。

动态游标：将一个表的数据查询出来插入另一个表
```sql
---1.声明游标
declare orderNum_03_cursor cursor scroll
for select [AdPageId], [AdPageName] from AdPage_copy1
--2.打开游标
open orderNum_03_cursor
--3.声明游标提取数据所要存放的变量
declare @AdPageId int,@AdPageName varchar(50)
--4.定位游标到哪一行
fetch First from orderNum_03_cursor into @AdPageId,@AdPageName  --into的变量数量必须与游标查询结果集的列数相同
while @@fetch_status=0  --提取成功，进行下一条数据的提取操作 
 begin
   if @AdPageName LIKE '%资讯%'
     begin
		 
		 INSERT INTO [dbo].[AdPage_copy1_copy1]( [AdPageName]) VALUES ( @AdPageName)   

     end
   fetch next from orderNum_03_cursor into @AdPageId,@AdPageName  --移动游标
 end
--游标结束 
 
 

 --删除游标
deallocate orderNum_03_cursor

```

## 函数

### 标量函数
```sql
Create function 函数名（参数）
Returns 返回值数据类型
[with {Encryption | Schemabinding }]
[as]
begin
SQL语句(必须有return 变量或值)
 End
```
 Schemabinding :将函数绑定到它引用的对象上（注：函数一旦绑定，则不能删除、修改，除非删除绑定）

### 表格值函数

#### 内联表格值函数
格式：
```sql
create function 函数名（参数）
returns table
[with {Encryption | Schemabinding }]
as
return(一条SQL语句)

create function tabcmess(@code varchar(10))
returns table
as
return(select ccode,scode from cmessage where ccode like @ccode)
```

#### 多句表格值函数
```sql
   create function 函数名（参数）
   returns 表格变量名table (表格变量定义)
   [with {Encryption | Schemabinding }]
as
   begin
    SQL语句
   end
```

简单例子
```sql
 create function jiafa(
 @a int,
 @b int
 )
 returns int
 as
 begin
 declare @d int
 set @d=@a+@b;
 return @b;
 end;
```
是一个加法的函数

## 视图
视图是存储在数据库中的查询的SQL 语句，它主要出于两种原因：安全原因， 视图可以隐藏一些数据，如：[社会保险基金](https://www.baidu.com/s?wd=%E7%A4%BE%E4%BC%9A%E4%BF%9D%E9%99%A9%E5%9F%BA%E9%87%91&tn=44039180_cpr&fenlei=mv6quAkxTZn0IZRqIHckPjm4nH00T1dWuAm3mW7WPvfsPAfvuhN-0ZwV5Hcvrjm3rH6sPfKWUMw85HfYnjn4nH6sgvPsT6KdThsqpZwYTjCEQLGCpyw9Uz4Bmy-bIi4WUvYETgN-TLwGUv3EPH6dPW6LPHm)表，可以用视图只显示姓名，地址，而不显示社会保险号和工资数等，另一原因是可使复杂的查询易于理解和使用。
```sql
if exists(select * from sys.objects where name='stuinfo')
drop table stuinfo
if exists(select * from sys.objects where name='exam')
drop table exam
create table stuinfo(stuid int primary key,stuName varchar(50),stusex varchar(2),classid int)
create table exam(examno int primary key,stuid int,subject varchar(30),score int)

insert into stuinfo values(1,'张三','男',1)
insert into stuinfo values(2,'李四','女',1)
insert into stuinfo values(3,'王五','男',2)
insert into stuinfo values(4,'赵六','女',1)
insert into stuinfo values(5,'田七','男',2)

insert into exam values(1,1,'HTML',85)
insert into exam values(2,1,'JAVA',80)
insert into exam values(3,1,'SQL',82)
insert into exam values(4,2,'HTML',70)
insert into exam values(5,2,'JAVA',80)
insert into exam values(6,2,'SQL',60)
insert into exam values(7,3,'HTML',70)
insert into exam values(8,3,'JAVA',90)
insert into exam values(9,3,'SQL',85)
insert into exam values(10,4,'HTML',61)
insert into exam values(11,4,'JAVA',68)
insert into exam values(12,4,'SQL',90)
insert into exam values(13,5,'HTML',81)
insert into exam values(14,5,'JAVA',65)
insert into exam values(15,5,'SQL',75)

select * from stuinfo
select * from exam

--创建视图
            --如果存在该视图就删除
if exists(select * from sys.objects where name='vive_stuinfo_exam')
drop view vive_stuinfo_exam   --删除视图的语句
go

create view vive_stuinfo_exam --创建名字是vive_stuinfo_exam的视图
--对视图进行加密with encryption
as
  select stuname,stuinfo.stuid,score from stuinfo left join exam on stuinfo.stuid=exam.stuid
go
  --查看视图
select * from vive_stuinfo_exam

```

## 事务
**悲观锁:**悲观锁悲观的认为每一次操作都会造成更新丢失问题,在每次查询时就加上排他锁。
**乐观锁:**乐观锁会乐观的认为每次查询都不会造成更新丢失.利用一个版本字段进行控制。
查询非常多,修改非常少,使用乐观锁。修改非常多,查询非常少,使用悲观锁。

```sql
--张三转账1000给李四
 
--开始一个事务
begin  tran tran_bank
--定义一个错误变量
declare @tranerr int
--赋初始值
set @tranerr=0
--执行转账操作
update bank set customaccount=customaccount-1000 where customName='张三'
--使用全局错误变量得到上一条sql语句是否出现错误
set @tranerr=@tranerr+@@error
update bank set customaccount=customaccount+1000 where customName='李四'
--使用全局错误变量得到上一条sql语句是否出现错误
set @tranerr=@tranerr+@@error
if @tranerr<>0
   begin
     rollback tran   
     print '转账失败，交易已取消'
   end
else
  begin
   commit tran
   print '转账成功，请注意查收'
  end
 
 
 
存储过程中使用事务：
if (exists(select * from  sys.objects where name='JayJayToTest'))
    drop proc JayJayToTest
go 
create proc JayJayToTest
    @GiveMoney int,
    @UserName nvarchar(20)
as 
beginset nocount on;
    begin tran;
    begin try
        update BankTest set Money = Money-@GiveMoney where Name=@UserName;
        update BankTest set Money = Money+@GiveMoney where Name='test';
        commit;
    end try   
    begin catch        
        rollback tran;
        print ('发生异常，事务进行回滚');
    end catch   
end
go
exec JayJayToTest 10,'jayjay'
```

## 存储过程
```sql
创建存储过程的基本语法：
if (exists (select * from sys.objects where name = 'USP_GetAllUser'))
    drop proc USP_GetAllUser
go
create proc USP_GetAllUser
@UserId int =1
as 
set nocount on;
begin
    select * from UserInfo where Id=@UserId
end

调用存储过程：
exec dbo.USP_GetAllUser 2;

修改存储过程
alter proc proc_name
as
sql语句

存储过程中输出参数的使用
if (exists(select * from  sys.objects where name='GetUser'))
    drop proc GetUser
go 
create proc GetUser
    @id int output,
    @name varchar(20) out
as 
begin 
    select @id=Id,@name=Name from UserInfo where Id=@id
end

go 
declare 
@name varchar(20),
@id int;
set @id=3;
exec dbo.GetUser @id,@name out;
select @id,@name;
print Cast(@id as varchar(10))+'-'+@name;


存储过程中事务的创建
if (exists(select * from  sys.objects where name='JayJayToTest'))
    drop proc JayJayToTest
go 
create proc JayJayToTest
    @GiveMoney int,
    @UserName nvarchar(20)
as 
beginset nocount on;
    begin tran;
    begin try
        update BankTest set Money = Money-@GiveMoney where Name=@UserName;
        update BankTest set Money = Money+@GiveMoney where Name='test';
        commit;
    end try    
    begin catch        
        rollback tran;
        print ('发生异常，事务进行回滚');
    end catch    
end
go
exec JayJayToTest 10,'jayjay'

存储过程详细解释：https://www.cnblogs.com/sunniest/p/4386296.html

```

## 触发器
触发器是与表事件相关的特殊的[存储过程](https://baike.baidu.com/item/%E5%AD%98%E5%82%A8%E8%BF%87%E7%A8%8B)，它的执行不是由程序调用，也不是手工启动，而是由事件来触发
```sql
if  exists(select * from sys.databases where name='shopinfo')
drop database shopinfo
go

create  database shopinfo
go
use shopinfo
go
create table orderinfo
(
  goodsid int not null,
  goodsname varchar(50) not null,
  salesamount int not null,
  orderdate datetime 
)

create table stock
(
  goodsid int not null,
  stockamount int not null
)

insert into stock values(1,50)

---添加新增创建触发器-----
if exists(select * from sysobjects where name='trigger_insert')
drop trigger trigger_insert
go
create trigger  trigger_insert
on  orderinfo
for insert
as
declare @goodsid int
declare @ordercount int
select @goodsid=goodsid,@ordercount=salesamount from inserted 
update stock set stockamount=stockamount-@ordercount where goodsid=@goodsid
go
set nocount on--不返回受影响行数

insert into orderinfo values(1,'mp3',4,getdate())
select* from orderinfo
select * from stock

-------创建一个删除的触发器---------------------
if exists(select * from sysobjects where name='trigger_delete')
drop trigger trigger_delete
go
create  trigger trigger_delete
on orderinfo
for delete
as
print '备份中.......'
if exists(select * from sysobjects where name='banckinfo')
begin
insert into banckinfo select * from deleted
end
else
begin
select * into banckinfo from deleted
end

go
set nocount on

delete from orderinfo

select * from orderinfo

select * from banckinfo

-----update触发器------
if exists(select * from sysobjects where name='trigger_update')
drop trigger trigger_update
go
create trigger trigger_update
on stock
for update
as
----定义变量分别代表交易之前的量和交易之后的量
declare @salecount int-------交易之前的量
declare @stockcount int -----交易之后的量

select @salecount=stockamount   from  deleted-----从删除临时表中得到交易之前的库存量

select @stockcount=stockamount from inserted ------从新增临时表中得到交易之后的库存量

if @stockcount<0
 begin 
  raiserror('库存不足',16,1)
  rollback transaction 
 end
go

set nocount on

update stock set stockamount=stockamount-50 where goodsid=1


select * from stock



--------inseted of 触发器-----

if exists(select * from sysobjects where name='trigger_insetedof')
drop trigger trigger_insetedof
go
create trigger trigger_insetedof
on stuinfo
instead of delete
as
declare @stuid int 

select  @stuid=stuid  from  deleted

delete from exam where stuid=@stuid

delete from stuinfo where stuid=@stuid

go

set nocount on



----

delete from stuinfo where stuid=1



select * from stuinfo

select * from exam 

```
![image.png](/common/1609039130466-8deaa803-2249-40ac-972f-9bc44f6ef339.png)

## 资料
[https://blog.csdn.net/qq_42756590/article/details/119904117](https://blog.csdn.net/qq_42756590/article/details/119904117) 修改表结构，增加注释等等
四大事务隔离级别原理：[https://mp.weixin.qq.com/s/Qh4ZsPrWi8JeEOeCQGygHg](https://mp.weixin.qq.com/s/Qh4ZsPrWi8JeEOeCQGygHg)
