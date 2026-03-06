---
title: 基础操作
lang: zh-CN
date: 2023-09-03
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - base
---
:::tip

遇到数据库关键字需要加```符号`，比如

```sql
select `Index`  from sample.menu
```

:::

## 系统操作
### 修改密码

```bash
mysql> use mysql; 
mysql> update user set password=password(‘123') where user='root' and host='localhost'; 
mysql> flush privileges;



## 首先登录mysql
## 格式：mysql> set password for 用户名@localhost = password(‘新密码');
例子：mysql> set password for root@localhost = password(‘123');
```

### 程序连接

```sh
# .Net连接数据库
Server=192.168.100.104;database=azrngblog;uid=root;pwd=123456;SslMode=None;

# jdbc连接数据库 localhost:3306 表示数据库的地址和端口号，mydatabase 是数据库名称，root 是用户名，123456 是密码
jdbc:mysql://localhost:3306/mydatabase?user=root&password=123456
# 如果需要在连接字符串中指定字符集编码，可以添加 characterEncoding 和 useUnicode 参数
jdbc:mysql://localhost:3306/mydatabase?user=root&password=123456&characterEncoding=UTF-8&useUnicode=true
```

### 磁盘统计

```sql
-- 获取指定数据库下所有表以及表的存储量
select TABLE_NAME TableName, data_length as Size
from information_schema.tables where TABLE_SCHEMA = 'mangesystem';

-- 查看指定数据库的存储量
select sum(DATA_LENGTH) as data from information_schema.tables  where table_schema='mangesystem';

-- 查询指定数据库下所有表的数据量
SELECT table_name tableName,table_rows size FROM information_schema.tables  WHERE TABLE_SCHEMA=@DbName;

-- 查询指定数据库下所有列的大小
select table_schema DbName, table_name TableName, column_name ColumnName, OCTET_LENGTH(column_name) as Size from information_schema.columns where table_schema = 'mangesystem' and TABLE_NAME = 'cupinfo'
```

## 数据库

```bash
## 登录MySQL
mysql -u root -p "密码"
## 连接其他服务器
mysql -u root -p "密码" -h ip
## 重启MySQL服务
systemctl restart mysqld 

## 查询所有数据库
show databases;

## 创建数据库
create database 数据库名称；

## 查看数据库详情
show create database 数据库名称;

## 创建数据库指定字符集
create database 数据库名称 character set gbk/utf8;

## 删除数据库
drop database 数据库名称;

## 使用数据库
use 数据库名称;
```

获取指定数据库下所有表以及表备注
```sql
SELECT
    TABLE_NAME,
    TABLE_COMMENT
FROM
    information_schema.`TABLES`
WHERE
    TABLE_SCHEMA = '数据库名字';
```

获取指定数据库下是否存在某一个表

```sql
SELECT count(1)
FROM
    information_schema.`TABLES`
WHERE
    TABLE_SCHEMA = 'mangesystem'  and TABLE_NAME='actor' ;
-- mangesystem库名  actor表名
```

## 表

### 表结构
```sql
SELECT '表名','字段名称','数据类型','字段长度','主键','备注'
UNION
SELECT
  TABLE_NAME as 表名,
        COLUMN_NAME as 字段名称,
        COLUMN_TYPE as 数据类型,
        CHARACTER_MAXIMUM_LENGTH as 字段长度,
        if(COLUMN_KEY='PRI','Y','N') as 主键,
        COLUMN_COMMENT as 备注
FROM
        INFORMATION_SCHEMA. COLUMNS
WHERE
        table_schema = 'localguoba_mp_microcourse_db'        
ORDER BY 表名        
```

### 创建表
```csharp
1.查询所有表
  show tables;
2.创建表（引擎和字符集）：create table 表名（name varchar(10)，age int）engine=myisam/innodb   charset=gbk/utf8;
3.查看表详情
  show create table 表名;
4.查看表字段：desc 表名；
5.删除表：drop table 表名；
```


### 修改表
```sql
--修改表名
rename table 旧表名 to 新表名；

-- 修改表的引擎和字符集：alter table 表名 
engine=myisam/innodb  charset=utf8/gbk;

-- 添加表字段：
-- 最后面
alter table 表名 add 字段名 字段类型；
-- 最前面
alter table 表名 add 字段名 字段类型 first;
-- xx的后面
alter table 表名 add 字段名 字段类型 after xx；4.删除表字段：alter table 表名 drop 字段名;

-- 修改表字段的名字和类型：
alter table 表名 change 原字段名 新字段名 新字段类型；
-- 修改表字段的类型和位置：
alter table 表名 modify 字段名 类型 位置first/(after xx)；
 
```

设置列uuid，添加触发器

![image.png](/common/1614052667071-61ee558e-a821-4b1f-9ac4-5ecc0f5d553b.png)
然后再下面定义地方输入;
```bash
BEGIN
SET new.Id=UUID();
END
```

### 查询

#### 基础查询
```sql
-- 查询全部数据的全部字段信息
select*from emp;
-- 查询所有员工的姓名和年龄
select name，age from emp;
-- 查询年龄在25岁以下的员工信息：
select*from emp where age<25;
-- 查询工资3000块钱的员工姓名，年龄，工资：
select name,age,sal from emp where sal=3000;

-- 别名
-- 将查询到的员工姓名ename改成‘姓名’
select ename from emp;
select ename as ‘姓名’ from emp;
select ename ‘姓名’ from emp;
select ename 姓名,sal 工资 from emp;
```

#### 返回结果组合
如果你写了好几个sql语句，分别各返回一个数，想拼接成一句，那么我们就需要
```sql
SELECT
	( SELECT count(*) FROM yht_betorder WHERE CustomerId = '22690be4-c2cc-4b6d-bbcd-eda1cdf57a6c' ) takeTopicCount,(
	SELECT
		Sum( Price ) 
	FROM
		yht_betorder 
	WHERE
		CustomerId = '22690be4-c2cc-4b6d-bbcd-eda1cdf57a6c' 
	AND ( PayType = 1 OR PayType = 2 )) betOnCount,
	( SELECT IF ( Sum( Price ) IS NULL, 0, Price ) FROM yht_betorder WHERE CustomerId = '22690be4-c2cc-4b6d-bbcd-eda1cdf57a6c' AND PayType = 3 ) peepCount
```

#### 递归查询
资料： [同事问我MySQL怎么递归查询，我懵逼了...](https://mp.weixin.qq.com/s?__biz=MjM5MzI5Mzg1OA==&mid=2247485532&idx=1&sn=bca54f59a998cc822516b21de37122b2&chksm=a6987b1191eff20788008bd120cfb138f473cfaefa626ba5c173217c7efb78ecc262400918f5&mpshare=1&scene=1&srcid=0828fMl6DYz4knL5DsIotBPR&sharer_sharetime=1598590937627&sharer_shareid=b24b68115bb61d7d2faf0d3d81a3e656&key=126745e5a1fffccfa5ecea775bc3d34fffb8e7b7f33d78e89f0604a441e69f9f25250637e5007ef55a45fd1bbe291e41ece286bb64a02f1c4c6ab8aee2616b7b2170438d1cb13d55469355a2c94cc3372fa19083612001c6a72de5137a0da16004ce21a410137602620ae46138f42223e60a668ea53bdc3363dee4f721de080d&ascene=1&uin=MzE1MjEyNzg0OQ%3D%3D&devicetype=Windows+10+x64&version=62090529&lang=zh_CN&exportkey=A15GGCEJre%2BlyyiHGwypJ%2Bs%3D&pass_ticket=8OaLU9sjFuslrHs5iOA5bz833kVuEa16xp3EQftZjvy%2Fs3fETwhFzKTAWoyvM%2FS0&wx_header=0)


造测试数据
```sql
DROP TABLE IF EXISTS `dept`;
CREATE TABLE `dept`  (
  `id` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `pid` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

INSERT INTO `dept`(`id`, `name`, `pid`) VALUES ('1000', '总公司', NULL);
INSERT INTO `dept`(`id`, `name`, `pid`) VALUES ('1001', '北京分公司', '1000');
INSERT INTO `dept`(`id`, `name`, `pid`) VALUES ('1002', '上海分公司', '1000');
INSERT INTO `dept`(`id`, `name`, `pid`) VALUES ('1003', '北京研发部', '1001');
INSERT INTO `dept`(`id`, `name`, `pid`) VALUES ('1004', '北京财务部', '1001');
INSERT INTO `dept`(`id`, `name`, `pid`) VALUES ('1005', '北京市场部', '1001');
INSERT INTO `dept`(`id`, `name`, `pid`) VALUES ('1006', '北京研发一部', '1003');
INSERT INTO `dept`(`id`, `name`, `pid`) VALUES ('1007', '北京研发二部', '1003');
INSERT INTO `dept`(`id`, `name`, `pid`) VALUES ('1008', '北京研发一部一小组', '1006');
INSERT INTO `dept`(`id`, `name`, `pid`) VALUES ('1009', '北京研发一部二小组', '1006');
INSERT INTO `dept`(`id`, `name`, `pid`) VALUES ('1010', '北京研发二部一小组', '1007');
INSERT INTO `dept`(`id`, `name`, `pid`) VALUES ('1011', '北京研发二部二小组', '1007');
INSERT INTO `dept`(`id`, `name`, `pid`) VALUES ('1012', '北京市场一部', '1005');
INSERT INTO `dept`(`id`, `name`, `pid`) VALUES ('1013', '上海研发部', '1002');
INSERT INTO `dept`(`id`, `name`, `pid`) VALUES ('1014', '上海研发一部', '1013');
INSERT INTO `dept`(`id`, `name`, `pid`) VALUES ('1015', '上海研发二部', '1013');
```

##### 向下递归 
编写自定义函数，根据根节点id找到所有的子节点(向下递归)
```sql
delimiter $$ 
drop function if exists get_child_list$$ 
create function get_child_list(in_id varchar(10)) returns varchar(1000) 
begin 
 declare ids varchar(1000) default ''; 
 declare tempids varchar(1000); 
 
 set tempids = in_id; 
 while tempids is not null do 
  set ids = CONCAT_WS(',',ids,tempids); 
  select GROUP_CONCAT(id) into tempids from dept where FIND_IN_SET(pid,tempids)>0;  
 end while; 
 return ids; 
end  
$$ 
delimiter ; 
```
解析
（1） delimiter $$ ，用于定义结束符。我们知道 MySQL 默认的结束符为分号，表明指令结束并执行。但是在函数体中，有时我们希望遇到分号不结束，因此需要暂时把结束符改为一个随意的其他值。我这里设置为 $$，意思是遇到 $$ 才结束，并执行当前语句。
（2）drop function if exists get_child_list$$ 。若函数 get_child_list 已经存在了，则先删除它。注意这里需要用 当前自定义的结束符 $$ 来结束并执行语句。因为，这里需要数和下边的函体单独区分开来执行。
（3）create function get_child_list 创建函数。并且参数传入一个根节点的子节点id，需要注意一定要注明参数的类型和长度，如这里是 varchar(10)。returns varchar(1000) 用来定义返回值参数类型。
（4）begin 和 end 中间包围的就是函数体。用来写具体的逻辑。
（5）declare 用来声明变量，并且可以用 default 设置默认值。
这里定义的 ids 即作为整个函数的返回值，是用来拼接成最终我们需要的以逗号分隔的递归串的。
而 tempids 是为了记录下边 while 循环中临时生成的所有子节点以逗号拼接成的字符串。
（6） set 用来给变量赋值。此处把传进来的根节点赋值给 tempids 。
（7） while do ... end while;  循环语句，循环逻辑包含在内。注意，end while 末尾需要加上分号。
循环体内，先用 CONCAT_WS 函数把最终结果 ids 和 临时生成的 tempids 用逗号拼接起来。
然后以 FIND_IN_SET(pid,tempids)>0 为条件，遍历在 tempids 中的所有 pid ，寻找以此为父节点的所有子节点 id ，并且通过 GROUP_CONCAT(id) into tempids 把这些子节点 id 都用逗号拼接起来，并覆盖更新 tempids 。
等下次循环进来时，就会再次拼接 ids ，并再次查找所有子节点的所有子节点。循环往复，一层一层的向下递归遍历子节点。直到判断 tempids 为空，说明所有子节点都已经遍历完了，就结束整个循环。
（8）return ids; 用于把 ids 作为函数返回值返回。
（9）函数体结束以后，记得用结束符 $$ 来结束整个逻辑，并执行。
（10）最后别忘了，把结束符重新设置为默认的结束符分号 。



##### 向上递归
因为向下递归时，每一层递归一个父节点都对应多个子节点。
而向上递归时，每一层递归一个子节点只对应一个父节点，关系比较单一。
同样的，我们可以定义一个函数 get_parent_list 来获取根节点的所有父节点。
```sql
delimiter $$ 
drop function if exists get_parent_list$$ 
create function get_parent_list(in_id varchar(10)) returns varchar(1000) 
begin 
 declare ids varchar(1000); 
 declare tempid varchar(10); 
  
 set tempid = in_id; 
 while tempid is not null do 
  set ids = CONCAT_WS(',',ids,tempid); 
  select pid into tempid from dept where id=tempid; 
 end while; 
 return ids; 
end 
$$ 
delimiter ; 
 
```




### 插入数据
#### 基础添加

```sql
-- 全表插入数据
insert into 表名values(创建表顺序一一对应)；
-- 指定字段插入数据：
insert into emp (name，age) values(‘Jerry’,19);
-- 全表批量插入数据：
insert into emp values(3,'刘备',28,6000),(4,'张飞',20,5000),(5,'关羽',25,9000);
-- 指定字段批量插入数据：
insert into emp (name,age) values('悟空',500),('八戒',400),('沙僧',200);

-- 添加多条
INSERT INTO Authors VALUES (1006, 'H', 'S.', 'T'),
       (1007, 'J', 'C', 'O'),
       (1008, 'B', NULL, 'E'),
       (1009, 'R', 'M', 'R'),
       (1010, 'J', 'K', 'T'),
       (1011, 'J', 'G.', 'N'),
       (1012, 'A', NULL, 'P'),
       (1013, 'A', NULL, 'W'),
       (1014, 'N', NULL, 'A');
```

#### 查询并插入

查询一个表的数据插入到另一个表中

```sql
--  Insert和select混合使用，可以使用mysql的selcet语句返回的列和值来填充insert语句的值
Insert into table1
Select c1,c2 from table2
-- 在默认的事务隔离级别下，加锁规则是table1表锁，table2逐步锁(扫描一个锁一个)
-- 解决方案：确保table2后面的where、order或者其他条件，都需要有对应的索引，来避免出现table2全部记录被锁定的情况。

-- 示例
INSERT into syspost(PostCode,PostName,SortNumber,Disabled, Creater,CreateTime,LastModifier,LastModifyTime,Remark)
SELECT post_code,post_name,post_sort,status,create_by,create_time,update_by,update_time,remark from ryauth.sys_post
 
 
-- 如果2张表的字段一致，并且希望插入全部数据，可以用这种方法：
INSERT INTO 目标表 SELECT * FROM 来源表;
-- 例如：insert into insertTest1 select * from insertTest2;
 
-- 如果只希望导入指定字段，可以用这种方法：
INSERT  INTO 目标表 (字段1, 字段2, ...) SELECT 字段1, 字段2,... FROM 来源表;(字段必须保持一致)
-- 例如：insert into insertTest2(id，name) select id,name from insertTest1;
 
-- 注意：如果目标表与来源表主键值相同则会出现添加错误，主键值不同才能插入


-- 如果您需要只导入目标表中不存在的记录，可以使用这种方法：
INSERT INTO 目标表 (字段1, 字段2, ...) SELECT 字段1, 字段2, ... FROM来源表 
    WHERE not exists (select * from 目标表 where 目标表.比较字段 = 来源表.比较字段); 
 
-- 导数据锁表的情况
insert into order_record select * from order_today where
 pay_success_time < '2020-03-08 00:00:00';
-- 加锁规则是：order_record表锁，order_today逐步锁（扫描一个锁一个）。
--解决方案：
--需要避免全表扫描，给 pay_success_time字段添加一个idx_pay_suc_time索引，由于走索引查询，就不会出现扫描全表的情况而锁表了，只会锁定符合条件的记录
```

#### INSERT IGNORE

如果向表中添加一些行数据并且在处理期间发生错误时，insert语句将被终止，并且返回错误消息，但是使用这个语句后，则会忽略错误的行，并将其余行插入表中

```sql
INSERT IGNORE INTO table(column_list)
VALUES( value_list),
      ( value_list),
      ...
```

#### 批量插入

借助MySqlBulkLoader类实现批量插入

> 1、连接字符串修改 https://mysqlconnector.net/troubleshooting/load-data-local-infile/
>
> 2、配置修改 https://www.cnblogs.com/hankai-chen/p/13229488.html
>
> 3、连接远程mysql https://dev.mysql.com/downloads/file/?id=529563

```csharp
await using var dbConnect = (MySqlConnection)db.Database.GetDbConnection();
    if (dbConnect.State == ConnectionState.Closed)
        await dbConnect.OpenAsync();

    var bulkLoader = new MySqlBulkLoader(dbConnect)
    {
        TableName = "users",
        FieldTerminator = ",",
        LineTerminator = "\n",
        NumberOfLinesToSkip = 0,
        Local = true,
    };
    var dataTable = new DataTable();
    // var properties = typeof(User).GetProperties();
    // // 遍历每个属性并将其添加到 DataTable 中
    // foreach (var property in properties)
    // {
    //     // 获取属性的名称和类型
    //     var propertyType = Nullable.GetUnderlyingType(property.PropertyType) ?? property.PropertyType;
    //
    //     if (property.Name == "Id")
    //         continue;
    //
    //     // 添加列到 DataTable，使用属性名和属性类型
    //     dataTable.Columns.Add(property.Name, propertyType);
    // }

    dataTable.Columns.Add(nameof(User.Id), typeof(long));
    dataTable.Columns.Add(nameof(User.Account), typeof(string));
    dataTable.Columns.Add(nameof(User.PassWord), typeof(string));
    dataTable.Columns.Add(nameof(User.Name), typeof(string));
    dataTable.Columns.Add(nameof(User.Sex), typeof(int));
    dataTable.Columns.Add(nameof(User.Credit), typeof(double));
    dataTable.Columns.Add(nameof(User.GroupId), typeof(long));
    dataTable.Columns.Add(nameof(User.Deleted), typeof(bool));
    dataTable.Columns.Add(nameof(User.CreateTime), typeof(DateTime));
    dataTable.Columns.Add(nameof(User.ModifyTime), typeof(DateTime));


    foreach (var dataObject in list)
    {
        dataTable.Rows.Add(dataObject.Id, dataObject.Account, dataObject.PassWord, dataObject.Name, dataObject.Sex,
            dataObject.Credit, dataObject.GroupId, dataObject.Deleted, dataObject.CreateTime,
            dataObject.ModifyTime);
    }
bulkLoader.SourceStream = await ConvertDataTableToStream(dataTable);
var count = await bulkLoader.LoadAsync();
Console.WriteLine($"插入成功 数据量：{count} 耗时：{stopwatch.ElapsedMilliseconds}");

/// <summary>
/// 将dataTable转为stream
/// </summary>
/// <param name="dataTable"></param>
/// <returns></returns>
private static async Task<Stream> ConvertDataTableToStream(DataTable dataTable)
{
    var stream = new MemoryStream();
    var writer = new StreamWriter(stream);

    // 写入数据行
    foreach (DataRow row in dataTable.Rows)
    {
        for (var i = 0; i < dataTable.Columns.Count; i++)
        {
            if (!Convert.IsDBNull(row[i]))
            {
                await writer.WriteAsync(row[i].ToString());
            }

            if (i < dataTable.Columns.Count - 1)
            {
                await writer.WriteAsync(",");
            }
        }

        await writer.WriteLineAsync();
    }

    await writer.FlushAsync();
    stream.Position = 0;

    return stream;
}
```

### 更新

```sql
-- 修改Tom的工资为3333
update emp set sal=3333 where name=’Tom’;
-- 修改20岁以下的工资为666
update emp set sal=666 where age<20;
-- 修改id等于3的名字为吕布 年龄为55 工资为20000
update emp set name=’吕布’，age=55,sal=20000 where id=3;
-- 修改工资为null的工资为800
update emp set sal=800 where sal is null;(新前旧后)he

-- 更新多条数据
UPDATE <table_name> <alias>
SET (<column_name>,<column_name> ) = (
SELECT (<column_name>, <column_name>)
FROM <table_name>
WHERE <alias.column_name> = <alias.column_name>)
WHERE <column_name> <condition> <value>;
```

#### 使用JOIN批量更新

如果需要根据另一个表的数据来更新当前表，可以使用`JOIN`。

```sql
UPDATE your_table
JOIN another_table ON your_table.id = another_table.your_table_id
SET your_table.column_name = another_table.new_value
WHERE some_condition;
```

#### 使用临时表批量更新

对于复杂的更新操作，可以先将需要更新的数据插入到一个临时表中，然后使用临时表来更新原表。

```sql
-- 创建临时表并插入数据
CREATE TEMPORARY TABLE temp_table AS
SELECT your_table.id, new_value
FROM your_table
JOIN another_table ON your_table.id = another_table.your_table_id;

-- 更新原表
UPDATE your_table
JOIN temp_table ON your_table.id = temp_table.id
SET your_table.column_name = temp_table.new_value;

-- 删除临时表
DROP TEMPORARY TABLE temp_table;
```

### 删除

删除表并且创建一个新表：truncate table 表名; 
truncate、drop和delete的区别：
delete用于删除数据，使用delete清空表时自增数值不清  零执行效率最低。
drop 用于删除表 执行效率最高。
truncate 用于删除表并创建新的空表，执行效率比delete 要高，而且自增数值会清零。
```sql
-- 删除id=1的员工：
delete from emp where id=1;
-- 删除年龄在25岁以下的员工：
detele from emp where age<25;
-- 删除全部数据
delete from emp;
```

#### 清空表优先使用truncate
truncate table在功能上与不带 where子句的 delete语句相同：二者均删除表中的全部行。但 truncate table比 delete速度快，且使用的系统和事务日志资源少。
delete语句每次删除一行，并在事务日志中为所删除的每行记录一项。truncate table通过释放存储表数据所用的数据页来删除数据，并且只在事务日志中记录页的释放。
truncate table删除表中的所有行，但表结构及其列、约束、索引等保持不变。新行标识所用的计数值重置为该列的种子。如果想保留标识计数值，请改用 DELETE。如果要删除表定义及其数据，请使用 drop table语句。

对于由 foreign key约束引用的表，不能使用 truncate table，而应使用不带  where子句的 DELETE 语句。由于 truncate table不记录在日志中，所以它不能激活触发器。
truncate table不能用于参与了索引视图的表。

## 事务

:::tip

MySQL中的DDL语句(create、alter、drop)不支持回滚，因为DDL语句直接修改数据库的结构，只有DML语句(插入、更新、删除)支持事务，可以被回滚

:::

事务是数据库执行SQL的最小的工作单元，可以保证事务的内的多条SQL语句要么全部成功，要么全部失败。
```sql
-- 查看数据库自动提交的状态
show variables like '%autocommit%';
-- 关闭自动提交：0 关闭 1开启
Set autocommit=0
commit；提交（一次性提交）
```

回滚
1.将内存中的修改回滚到上次提交(commit)的点。
  rollback; 回滚
2.保存回滚点：savepoint 标识（s1);
   回滚到某个点：rollback to 标识（s1);{由后往前滚}


## 约束

### 主键约束
```sql
-- 唯一且非空：关键词组--->(primary key)
create table t1(id int primary key, name varchar(10));              
-- 自增：关键词组--->（auto_increment）
create table t2(id int primary key  auto_increment,name varchar(10));      
-- 字段值为null时值会自己增长;
-- 字段值可以手动赋值;
-- 增长规则：从曾经出现的最大值基础上+1;
-- 只增不减（delete清空表自增数值不清零）。
 
```

## 参考文档

MySQL基础知识:[https://www.cnblogs.com/loser1949/category/1137810.html](https://www.cnblogs.com/loser1949/category/1137810.html) 
