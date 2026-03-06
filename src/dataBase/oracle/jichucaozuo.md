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
slug: rnlfn5
docsId: '29712737'
---
## 连接

-  数据库安装完成后，后台管理网址：[https://localhost:1158/em](https://localhost:1158/em)使用用户名sys，口令是自己设置的（123456），连接身份选择sysdba，然后可以进入。服务器安装后，默认有两个用户：sys权限最高的用户，相当于超级用户；system系统管理员，相当于高级用户；
-  可以在上面给予的那个网站上面新建表空间。新建表空间，实际就是新建个存储文件，这里写的是文件的名称。
-  新开一个项目，需要使用oracle去创建一个数据库，然后创建好的这个数据库是一个系统数据库，包含了许多系统的表，我们需要在这个系统数据库中创建用户，然后使用这个用户去连接，然后创建用户表

## 系统操作
```sql
## oracle使用命令（cmd）
##使用orabusonline用户进行登录 （LEAPPTEST是服务器名称，rhtjsb是口令）
sqlplus  LEAPPTEST/rhtjsb as sysdba
##删除用户（该用户包含数据的情况下的删除语句）
drop user DYZHCSYKT cascade（需要把当前用户连接断开）
##切换用户登录
conn orabusonline/Dyzhcs2019jsb as sysdba;
##创建表空间 （一个表空间只能属于一个数据库，一个数据文件只能属于一个表空间。）
create tablespace CCEN datafile 'E:\app\Administrator\admin\tablespace\CCEN.DBF' size  1000M autoExtend on;
##创建临时表空间
create temporary tablespace CCEN_TMP  tempfile 'E:\app\Administrator\admin\tablespace_tmp\CCEN_temp.dbf' size  1000M autoExtend on;
##创建用户
CREATE USER DYZHCSYKT  IDENTIFIED BY DYZHCSYKT DEFAULT tablespace CCEN temporary tablespace CCEN_TMP;  
##给用户赋予权限
grant connect, resource,dba to DYZHCSYKT;
#查询当前数据库中的表空间
SELECT t.tablespace_name,round(SUM(bytes / (1024 * 1024)), 0) ts_size FROM dba_tablespaces t, dba_data_files d 
WHERE t.tablespace_name = d.tablespace_name GROUP BY t.tablespace_name;
#查询数据库的临时表空间
select tablespace_name,file_name,bytes/1024/1024 file_size,autoextensible from dba_temp_files;
#查询数据库软件的信息
select * from v$version
#查询当前登录用户所属的默认表空间和临时表空间
 select username,default_tablespace,temporary_tablespace from dba_users where username='ORACLEICBC'
#查询逻辑目录
select * from dba_directories

-- 查询字符集
select * from V$NLS_PARAMETERS
```

### 程序连接

```shell
# jdbc 连接数据库 localhost:1521 表示数据库的地址和端口号，mydatabase 是数据库的服务名或 SID
jdbc:oracle:thin:@localhost:1521:mydatabase?user=myusername&password=mypassword
```

### 用户

```sql
WIN+R打开运行窗口，输入cmd进入命令行: 输入sqlplus ,输入用户名,输入口令(如果是超级管理员SYS的话需在口令之后加上as sysdba)进入sql命令行；
输入“select username from dba_users”查看用户列表。
创建用户
create user 用户名 identity by 口令[即密码]；
或者
create user lihua
identified by lihua
default tablespace schooltbs
temporary tablespace temp;
修改用户
alter user 用户名 identified by  口令[改变的口令]；
或者
alter user lihua
identified by 123
default tablespace users;
删除用户
Drop user 用户名；
若用户拥有对象，则不能直接删除，否则将返回一个错误值。指定关键字casade，可删除用户的所有对象，然后再删除用户。
语法：drop user 用户名 cascade；
给用户赋予权限
grant 权限 to 用户; 
grant connect,resource to zhou; 
connect,resource 是角色，角色有多个权限 
切换登录的用户：
connect user/passwrod； 
锁定用户
alter user lihua account lock|unlock;
查询当前登录用户所属的默认表空间和临时表空间
 select username,default_tablespace,temporary_tablespace from dba_users where username='ORACLEICBC'
创建表语句：
--在测试用户jingyu下创建测试表book2 drop table book2 purge;create table book2( bookId number(10) primary key, namevarchar2(20) ); --创建序列drop sequence book2_seq; create sequence book2_seq start with 1 increment by 1; --创建触发器create or replace triggerbook2_trigger before insert on book2 for each row begin select book2_seq.nextval into :new.bookId fromdual; end ; 
 
 
 
 
oracle为兼容以前版本，提供三种标准角色（role）:connect/resource和dba.
●  connect role(连接角色)
–临时用户，特指不需要建表的用户，通常只赋予他们connect role.
–connect是使用oracle简单权限，这种权限只对其他用户的表有访问权限，包括select/insert/update和delete等。
–拥有connect role 的用户还能够创建表、视图、序列（sequence）、簇（cluster）、同义词(synonym)、回话（session）和其他 数据的链（link）
●  resource role(资源角色)
–更可靠和正式的数据库用户可以授予resource role。
–resource提供给用户另外的权限以创建他们自己的表、序列、过程(procedure)、触发器(trigger)、索引(index)和簇(cluster)。
●  dba role(数据库管理员角色)
–dba role拥有所有的系统权限
–包括无限制的空间限额和给其他用户授予各种权限的能力。system由dba用户拥有
  (1)创建角色
Create role 角色名；
（2）授权命令
Grant connect, resource to 用户名;
授予所有权限：
Grant dba to zyp；
（3）撤销权限
Revoke connect, resource from 用户名; 
 
```

### 磁盘统计

```sql
-- 查询数据库磁盘占用
select sum(bytes)/1024/1024/1024 as "size(G)" from dba_data_files；

-- 查询指定数据库下表的磁盘大小
select owner SchemaName,table_name tableName,(blocks*8) as diskSize from dba_tables where  OWNER = 'EMRMIX';

-- 查询指定数据库下的表的数据量
select owner SchemaName,table_name tableName,NVL(num_rows,0)  RecordNumber from dba_tables where  OWNER = 'EMRMIX';

-- 查询指定数据库下指定表的列信息
select a.COLUMN_NAME                                AS ColName,
       a.DATA_TYPE                                  AS ColType,
       a.CHAR_COL_DECL_LENGTH                       AS ColLength,
       a.DATA_DEFAULT                               AS ColDefault,
       b.COMMENTS                                   as ColComment,
       1                                            as IsIdentity,
       (case a.NULLABLE when 'Y' then 0 else 1 end) AS Is_Null
from all_tab_columns a
         INNER JOIN all_col_comments b on a.table_name = b.table_name and a.column_name = b.column_name
where A.owner = 'EMRMIX' AND A.table_name='CP_BRANCH_PATH'；

-- 查询指定数据库下指定表的磁盘占用大小
select a.owner                     schemaName,
       a.table_name                tableName,
       a.COLUMN_NAME AS            columnName,
       SUM(LENGTHB(a.COLUMN_NAME)) diskSize
from all_tab_columns a
         INNER JOIN all_col_comments b on a.table_name = b.table_name and a.column_name = b.column_name
where a.owner = 'EMRMIX'
  AND a.table_name = 'CP_BRANCH_PATH'
group by a.owner, a.table_name, a.COLUMN_NAME

```

## 数据库

### 基础操作
```sql
1、创建数据库
     create database databasename
2、删除数据库
     drop database dbname
DROP TABLESPACE monitor INCLUDING CONTENTS AND DATAFILES;
```

## 表

### 表空间
```sql
-- 创建表空间 （一个表空间只能属于一个数据库，一个数据文件只能属于一个表空间。）
create tablespace CCEN datafile 'E:\app\Administrator\admin\tablespace\CCEN.DBF' size  1000M autoExtend on;
-- 创建临时表空间
create temporary tablespace CCEN_TMP  tempfile 'E:\app\Administrator\admin\tablespace_tmp\CCEN_temp.dbf' size  1000M autoExtend on;
 
-- 删除表空间
drop tablespace schooltbs --只是把表空间给删除了
drop tablespace a including contents and datafiles;--(包括文件)
-- 查询表空间的基本信息
select *||tablespace_name from DBA_TABLESPACES;
修改表空间-改变数据文件大小
alter database datafile ‘e:\a.dbf’ resize(调整大小) 100m; 
修改表空间-添加数据文件（往表空间a中添加）
alter tablespace a
    2 add datafile ‘e:\b.dbf’
    3 size 20m;
 
允许文件自动扩展
alter tablespace
    2 datafile ‘e:\b.dbf’
    3 autoextend on next 10m maxsize 20m;
```

### 表操作
```sql
查询数据库中所有用户
Select * from all_users;
创建表
     create table tabname(col1 type1 [not null] [primary key],col2 type2 [not null],..)
     根据已有的表创建新表：
     A：select * into table_new from table_old (使用旧表创建新表)
     B：create table tab_new as select col1,col2… from tab_old definition only<仅适用于Oracle>
2、删除表
     drop table tabname
3、重命名表
     说明：alter table 表名 rename to 新表名
        eg：alter table tablename rename to newtablename
4、增加字段
     说明：alter table 表名 add (字段名 字段类型 默认值 是否为空);
        例：alter table tablename add (ID int);
       eg：alter table tablename add (ID varchar2(30) default '空' not null);
5、修改字段
     说明：alter table 表名 modify (字段名 字段类型 默认值 是否为空);
        eg：alter table tablename modify (ID number(4));
6、重名字段
     说明：alter table 表名 rename column 列名 to 新列名 （其中：column是关键字）
        eg：alter table tablename rename column ID to newID;
7、删除字段
     说明：alter table 表名 drop column 字段名;
        eg：alter table tablename drop column ID;
8、添加主键
     alter table tabname add primary key(col)
9、删除主键
     alter table tabname drop primary key(col)
10、创建索引
     create [unique] index idxname on tabname(col….)
11、删除索引
     drop index idxname
     注：索引是不可更改的，想更改必须删除重新建。
12、创建视图
     create view viewname as select statement
13、删除视图
     drop view viewname
 
 
 
查询一个数据库用户下有多少张表
select count(*) from user_tables ;
查询一个数据库用户下的空表
select table_name from user_tables where NUM_ROWS=0;
 
 
 
```

### DUAL
该表是一个伪表
```sql
-- 比如要生成一个订单号：
SELECT seq_rec_tradeno_id.nextval  FROM DUAL
```

### ID自增
ORACLE实现id自增长，需要三个步骤。 
（1）创建序列。即，定义一个增长逻辑。
（2）创建触发器。即，将增长逻辑与列绑定，并说明何时触发增长逻辑。
（3）启动触发器。即，让绑定生效。

创建序列
（1）新建->数据库对象->序列
![image.png](/common/1609926463639-1df92a87-d620-41bf-a041-9b218f3700ff.png)

 

（2）选择用户，填写序列名称，增长的初始值，最大值，递增值，递增方式等。
![image.png](/common/1609926463623-9b4e676f-d191-46b2-802a-0b65d1b871cb.png)

创建触发器
（1）选择表，右键->触发器->创建（序列中的主键）

![image.png](/common/1609926463655-05b929cf-34fb-41b4-add9-ea6103212aa0.png)

（2）为触发器命名，并选择之前创建的序列，之后，选择需要绑定的列。
![image.png](/common/1609926463614-68158a09-1fac-4e33-904c-c17e82e450e3.png)

启动触发器
选择表，右键->触发器->全部启动。

至此，ID自增长设置完成。

### 操作数据
```plsql
-- 更新查询出来的数据
UPDATE info1 t1 JOIN info2 t2 
ON t1.name = t2.name
SET t1.age = t2.age, t1.class = t2.class

-- 递归查询
-- 向下递归第一种：
start with 子节点id = ' 查询节点 ' connect by prior 子节点id = 父节点id
--示例：
select * from dept start with id='1001' connet by prior id=pid;
-- 向下递归第二种：
start with 父节点id= ' 查询节点 '  connect by prior 子节点id = 父节点 id
--示例：
select * from dept start with pid='1001' connect by prior id=pid;
 
 
-- 向上递归第三种：
start with 子节点id= ' 查询节点 ' connect by prior 父节点id = 子节点id
-- 示例：
select * from dept start with id='1001' connect by prior pid=id;
-- 向上递归第四种
start with 父节点id= ' 查询节点 ' connect by prior 父节点id = 子节点id
-- 示例：
select * from dept start with pid='1001' connect by prior pid=id;
```

## 序列

### 创建序列
```sql
CREATE SEQUENCE "DYZHCSLEAPP"."SEQ_CITY"  MINVALUE 1 MAXVALUE 9999999999999999999999999999 INCREMENT BY 1 START WITH 26 NOCACHE  NOORDER NOCYCLE ;
 
minvalue 1        --最小值
nomaxvalue        --不设置最大值
start with 1      --从1开始计数
increment by 1    --每次加1个
nocycle           --一直累加，不循环
nocache;          --不建缓冲区
 
 
 
测试序列：
 CREATE SEQUENCE "DYZHCSLEAPP"."SEQUENCE1"  MINVALUE 1 MAXVALUE 4 INCREMENT BY 2 START WITH 1 CACHE 2 ORDER  NOCYCLE ;
```

### 修改序列值
很多时候，我们都会用到oracle序列，那么我们怎么修改序列的当前值呢？
首先我们可以查看当前序列值是多少，如下：
select 序列名.nextval from dual;
比方说我现在查出来值是10，那么我要把当前值改成8，那么可以这么改：
alter sequence 序列名 increment by -2;
如果我需要把当前值改成15，那么可以这么改：
alter sequence 序列名 increment by 5;

上述是通过修改当前序列增量长度间隔值，用于修改当前序列值，增加1或-1或n或-n，当修改好当前值之后，记得一定要把序列增量改回来，改为1：

```sql
alter sequence 序列名 increment by 1;
```

## 导入导出

```
导出数据库
exptianzhi_smart/tianzhi_smart@192.168.56.60:1521/orclfile='E:\tianzhi_smart.dmp';
导入数据库
imp tianzhi_smart/tianzhi_smart@192.168.10.129:1521/orclfile='E:\tianzhi_smart.dmp' full=y;

● 完全备份
     exp system/111111@ORACLE file=d:\daochu.dmp full=y
     exp demo/demo@orcl buffer=1024 file=d：\back.dmp full=y
     demo：用户名、密码
     buffer: 缓存大小
     file: 具体的备份文件地址
     full: 是否导出全部文件
     ignore: 忽略错误，如果表已经存在，则也是覆盖
● 将数据库中system用户与sys用户的表导出
     exp demo/demo@orcl file=d:\backup\1.dmp owner=(system,sys)
● 导出指定的表
     exp demo/demo@orcl file=d:\backup2.dmp tables=(teachers,students)
● 按过滤条件，导出
     exp demo/demo@orcl file=d：\back.dmp tables=（table1） query=\" where filed1 like 'fg%'\"
     导出时可以进行压缩；命令后面 加上 compress=y ；如果需要日志，后面： log=d:\log.txt
● 备份远程服务器的数据库
     exp 用户名/密码@远程的IP:端口/实例 file=存放的位置:\文件名称.dmp full=y
4、数据库还原
     打开cmd直接执行如下命令，不用再登陆sqlplus。
● 完整还原
● 如果是本机那么使用
● imp test/t123456 file="F:\databaseBeiFen\daochu.DMP"  full=y;
     imp demo/demo@orcl file=d:\back.dmp full=y ignore=y log=D:\implog.txt
     指定log很重要，便于分析错误进行补救。
● 导入指定表
     imp demo/demo@orcl file=d:\backup2.dmp tables=(teachers,students)
● 还原到远程服务器
 
     imp 用户名/密码@远程的IP:端口/实例 file=存放的位置:\文件名称.dmp full=y
```



