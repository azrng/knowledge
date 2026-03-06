---
title: Oracle使用问题
lang: zh-CN
date: 2023-09-23
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - 无
filename: oracleshiyongwenti
slug: zzh84i
docsId: '29712679'
---

## 乱码
打开SQL plus后发现现实文字是乱码，这个时候需要点击右键属性，然后勾选旧版控制台。并重新打开sqlplus,"修改默认代码页"，把“437 OEM 美国”改为“936 ANSI/OEM 简体中文（GBK）”。
创建数据库时候提示Enterprise Manager配置失败的解决办法 无法打开OEM的解决办法  [链接](https://blog.csdn.net/zyf19930610/article/details/51262253)
连接数据库时候一直提示用户名不存在，但是真实存在该用户，并且已经赋予权限，并且可以在本地数据库工具中可以连接上，最后解决办法：不能将用户名和数据库名称设置一致，如果设置一致可能就会出这个错误。

## 连不上远程数据库
同一个网络下，使用内网连接远程数据库，连接错误
可能的问题是对方电脑防火墙开的，需要关掉或者说进入防火墙，高级设置中增加一个入站规则，允许1521端口访问
 
 
如果自己本地都连接不上，那么重启下oracle的几个服务再试一试
 
![image.png](/common/1614064249008-fb42116a-d4a6-4220-89a8-73c068d15a9c.png)

## 不是有效的导出文件，头部验证失败
**不是有效的导出文件**
描述：数据库已经导出为dmp文件，导入时候新创建了数据库，数据库的名字和导出时候的一致，然后新建了用户，和导出的源数据库一致，现在导入的时候提示
![image.jpeg](/common/1614064230547-4db8d010-96f4-452e-a241-4da8eba3464d.jpeg)
然后按照网上说的：[https://blog.csdn.net/hwhua1986/article/details/49336765](https://blog.csdn.net/hwhua1986/article/details/49336765)
使用文本编辑器打开dmp文件
![image.png](/common/1614064230517-b480457d-35e0-4050-b85a-c194b2c028c4.png)
然后运行语句查看数据库软件的版本号
语句：select * from v$version
![image.jpeg](/common/1614064230518-b0d132d8-a48c-4cef-bc34-dc6c373b6151.jpeg)
需要修改dmp文件为这个文件，比如说11.2.0.1.0，需要对应修改为
![image.png](/common/1614064230573-ce3c18f6-b040-411d-9be2-f49a963ddb96.png)
然后再次运行
![image.jpeg](/common/1614064230513-93ce47f6-ab82-4287-9c82-2a8f8ce3bb2c.jpeg)
警告属于另一个问题了，这里不予讨论。
**2. 触发器编译错误**
![image.jpeg](/common/1614064230542-532fdcae-a2c4-4a35-8804-622a77c4fbeb.jpeg)
然后查看语句，显示是：
![image.png](/common/1614064230516-d35dc2b5-9b0f-4d3e-9b05-a319bc3b6f3a.png)
原因是缺少一个SEQ_BUS_CITY序列，那么我们就创建一个
   CREATE SEQUENCE "DYZHCSLEAPP"."SEQ_CITY"  MINVALUE 1 MAXVALUE 9999999999999999999999999999 INCREMENT BY 1 START WITH 26 NOCACHE  NOORDER NOCYCLE ;
然后重新编译触发器，就成功了。

## ORA-06413:连接未打开
出现这个问题一般是因为“括号”的问题，
比如要连接的程序存放在c:/abc(def)/program/目录下，调试运行会出现ORA-06413。
把路径名称中的括号去掉就可以了。

## Enterprise Manager配置失败
![image.png](/common/1614064146772-347bc39f-9a19-4142-bb03-c1cd10cf5916.png)
 
在listener.ora中增加对BlueAeri-PC或ip地址的侦听，具体步骤如下：
1.启动Net Manager，在“监听程序”--Listener下添加一个地址，主机名写计算机名字或者ip，端口号还是1521，然后保存
2.重启监听服务。
![image.png](/common/1614064146674-160774e1-8d69-47a0-a742-89b7c1005dee.png)
3.启动Database configuration Assistant “配置数据库选件”就可以重新配置em了，而不用删除数据库。再次创建数据库时也不会报如上的错误。
![image.png](/common/1614064146700-f15b31bf-ea53-498c-a9e7-bacf57f32fd8.png)

## ORA-28001，口令已经失效
 在登录后台系统时候，系统提示内部服务器错误
![image.png](/common/1614064129058-eb9ea6ff-f978-41d5-8fe6-836d48fa2a6e.png)
查看数据库后发现是数据库口令到期了（一般是180需要修改一次密码，如果不修改就会强制过期）
下面的方法可以修改当前用户的密码是我们连接上数据库，但是那个口令还是不知道是啥
1.在cmd命令窗口中输入：
```sql
sqlplus 用户名/密码@数据库本地服务名 as sysdba;（例如:sqlplus LYKG/Dyzhcs@LYKGTEST as sysdba;）
```
![image.png](/common/1614064129085-d42bd1f7-08f4-431e-b9cd-21e79b88b938.png)
2.查看用户的proifle是哪个，一般是default：
SELECT username,PROFILE FROM dba_users;
![image.png](/common/1614064129053-4130a7a0-28d6-499e-9466-6bd8601d616f.png)
 
![image.png](/common/1614064129051-7a291f2f-68cd-4acc-9867-946b6ecc25ea.png)
3.查看对应概要文件（如default）的密码有效期设置：
SELECT * FROM dba_profiles s WHERE s.profile='DEFAULT' AND resource_name='PASSWORD_LIFE_TIME';
![image.png](/common/1614064129051-01b092ab-4993-444a-b95f-6f5287d673cd.png)
4.将概要文件（如default）的密码有效期由默认的180天修改为“无限制”
```sql
ALTER PROFILE DEFAULT LIMIT PASSWORD_LIFE_TIME UNLIMITED;
```
修改后不用重启数据库，会立即生效。
![image.png](/common/1614064129133-6c939131-8799-46f3-a514-18f4124047fa.png)
5.然后修改用户的密码
```sql
alter user 用户名 identified by<原来的密码> account unlock; ----不用换新密码
例如：alter user DYZHCSLEAPP identified by NYEKTLEAPP account unlock;
```
![image.png](/common/1614064129063-f5c9510e-36c7-4bf0-916b-d4fe6206a834.png)
6.然后去连接数据库，可以正常使用了

## 修改数据库密码
运行cmd命令
**（1）在CMD命令窗口中输入：**
```sql
         sqlplus 用户名/密码@数据库本地服务名 as sysdba;（例如：sqlplus scott/1234@oracle1 as sysdba;）
```
     用自己创建的用户密码登录会提示权限不够，需要使用管理员登录
```sql
      例如：sqlplus system/Dyzhcs2019jsb@orabusonline as sysdba;
```
 
**（2）查询对应的概要文件(如default)的密码有效期设置：**
```sql
sql>SELECT * FROM dba_profiles s WHERE s.profile='DEFAULT' AND resource_name='PASSWORD_LIFE_TIME';
```
**（4）将概要文件(如default)的密码有效期由默认的180天修改成“无限制”：**
```sql
      sql>ALTER PROFILE DEFAULT LIMIT PASSWORD_LIFE_TIME UNLIMITED;
```
备注：修改之后不需要重启动数据库，会立即生效。
 
**（5）将概要文件(如default)的密码有效期由无限制修改成“60天”：**
```sql
      sql>alter profile default limit PASSWORD_LIFE_TIME 60;
```
备注：修改之后不需要重启动数据库，会立即生效。
 
**（6）如果还提示同样的错误，连接不上，那么该账号再改一次密码**
```sql
sql> alter user 用户名 identified  by 原来的密码  account unlock;--不用换密码
```
![image.png](/common/1614064111174-f8e1ea09-57f1-45be-a9f6-673ffde2c4e7.png)
 
备注：修改密码必须用当前数据库进才能有效（sqlplus 用户名/密码@数据库本地服务名 as sysdba;）
 

## 修改Oracle数据库SGA和PGA大小
SGA的大小：一般物理内存20%用作操作系统保留，其他80%用于数据库。
SGA普通数据库可以分配40%-60%之间，PGA可以分配20%-40%之间。
1、以dba身份登录
并查看SGA信息：
```sql
SQL>show parameter sga;
```
![image.png](/common/1614064101275-678f4411-75be-4d94-a8c4-bdcca44c9677.png)
查看PGA信息： 目前的内存
```sql
SQL>show parameter pga；
```
![image.png](/common/1614064101279-7155fdea-15fd-416d-9128-5512cc6cd27f.png)
```sql
2、修改sga_target 
SQL>alter system set sga_target=436M;
3、修改sga_max_size 
SQL> alter system set sga_max_size=436M scope=spfile;
4、重启数据库使其生效：
SQL>shutdown immediate; 
注意，重启前一定先完成上述两部操作，且sga_target不得大于sga_max_size，一般保持两者相等
否则可能导致数据库无法启动。
SQL>startup
5、查看SGA是否生效：
SQL>show parameter sga
NAME                                TYPE        VALUE
------------------------------------ ----------- -----
lock_sga                            boolean    FALSE
pre_page_sga                        boolean    FALSE
sga_max_size                        big integer 436M
sga_target                          big integer 436M
```

## oracle连接提示ORA-12505问题
 首先先检查服务名，结果发现还是连接不了，具体解决办法是打开数据库实例的目录，我本机的是C:\app\Administrator\product\11.2.0\dbhome_1\NETWORK\ADMIN，找到listener.ora文件（listener监听器进程的配置文件），使用文本编辑器打开
内容如下：
![image.png](/common/1614064082772-a85f7f67-3a6d-4bb1-baf4-9eaac6a18b83.png)
修改为
```sql
## listener.ora Network Configuration File: D:\app\Administrator\product\11.2.0\dbhome_1\NETWORK\ADMIN\listener.ora
## Generated by Oracle configuration tools.
 
SID_LIST_LISTENER =
  (SID_LIST =
    (SID_DESC =
      (SID_NAME = CLRExtProc)
      (ORACLE_HOME = D:\app\Administrator\product\11.2.0\dbhome_1)
      (PROGRAM = extproc)
      (ENVS = "EXTPROC_DLLS=ONLY:D:\app\Administrator\product\11.2.0\dbhome_1\bin\oraclr11.dll")
    )
(SID_DESC =
      (GLOBAL_DBNAME = orcl)
      (ORACLE_HOME =  C:\app\Administrator\product\11.2.0\dbhome_1)
      (SID_NAME = orcl)
    )
  )
 
LISTENER =
  (DESCRIPTION_LIST =
    (DESCRIPTION =
      (ADDRESS = (PROTOCOL = IPC)(KEY = EXTPROC1521))
    )
    (DESCRIPTION =
      (ADDRESS = (PROTOCOL = TCP)(HOST = localhost)(PORT = 1521))
    )
    (DESCRIPTION =
      (ADDRESS = (PROTOCOL = TCP)(HOST = WIN-1CL1VVKMV07)(PORT = 1521))
    )
  )
 
ADR_BASE_LISTENER = D:\app\Administrator
```

## oracle数据库导出序列问题
问题描述：
      在用exp/imp导入导出数据库的时候，新的库经常出到序列小于表中最大值的情况。一直都不知道问题出在了什么地方，后来经同事提醒才恍然大悟，在exp的时候，应用程序是没有停止的，也就是说，命令在执行的过程中，先导出了序列，然后再导的表，而表的数据一直在增加，所以出现此情况。
 
解决方法：
      知道问题所在了，那就知道解决方案了。
  1：工具：导出库后，再用PLSQL把序列导出来（命令窗口不行，因为exp不能只导序列），导入库后重建序列。
  2：手工：导出库后，使用SQL生成建序列脚本，导入库后重建序列。
```
SELECT ' create sequence 用户名.' || SEQUENCE_NAME ||   
       ' minvalue ' || MIN_VALUE ||   
       ' maxvalue ' || MAX_VALUE ||   
       ' start with ' || LAST_NUMBER ||   
       ' increment by ' || INCREMENT_BY ||   
       ' cache ' || CACHE_SIZE || ' ;'  
  FROM USER_SEQUENCES;
```

## Oracle11g不能导出空表的解决办法
```sql
ORACLE 11g 用exp命令导出库文件备份时，发现只能导出来一部分表而且不提示错误，之前找不到解决方案只能把没导出来的表重新建建立。后来发现是所有的空表都没有导出来。于是想好好查查,因为在以前的10g版本中没有这样的问题。
查资料发现Oracle 11g中有个新特性：新增了一个参数“deferred_segment_creation”含义是段延迟创建，默认是true。
具体是什么意思呢？
如果这个参数设置为true，你新建了一个表Table1，并且没有向其中插入数据，那么这个表不会立即分配extent，也就是不占数据空间，即表也不分配 segment 以节省空间，所以这些表也没能导出来。在系统表user_tables中也可以看到segment_treated的字段里是“NO”或者“YES”说明了某张表是否分配了segment。说白了是为了可以节省少量的空间。
用下面的SQL语句查询，可以发现没有导出的表其 segment_created 字段值都是 'NO'。
Select segment_created,table_name from user_tables where segment_created = 'NO';
解决方法：
1、最原始最笨的办法(不推荐):insert一行，再rollback或者删除就产生segment了。
该方法是在在空表中插入数据，再删除，则产生segment。导出时则可导出空表。
2、设置deferred_segment_creation参数：
   设置deferred_segment_creation 参数为FALSE来禁用"段推迟创建"(也就是直接创建segment)，无论是空表还是非空表，都分配segment。
   在sqlplus中，执行如下命令：
   SQL>alter system set deferred_segment_creation=false;
   查看：
   SQL>show parameter deferred_segment_creation;
   注意：该值设置后只对后面新增的表产生作用，对之前建立的空表(已经存在的)不起作用，仍不能导出。
   并且要重新启动数据库，让参数生效。
3、使用ALLOCATE EXTENT，可以导出之前已经存在的空表。
   使用ALLOCATE EXTENT可以为数据库对象的每一张表分配Extent(注意针对每一张表，就是说一张表需要一条SQL代码)：
   其语法如下：
   -----------
   ALLOCATE EXTENT { SIZE integer [K | M] | DATAFILE 'filename' | INSTANCE integer }
   -----------
   可以针对数据表、索引、物化视图等手工分配Extent。
   ALLOCATE EXTENT使用样例:
    ALLOCATE EXTENT
    ALLOCATE EXTENT(SIZE integer [K | M])
    ALLOCATE EXTENT(DATAFILE 'filename')
    ALLOCATE EXTENT(INSTANCE integer)  www.2cto.com
    ALLOCATE EXTENT(SIZE integer [K | M]   DATAFILE 'filename')
    ALLOCATE EXTENT(SIZE integer [K | M]   INSTANCE integer)
   针对数据表操作的完整语法如下：
   -----------
   ALTER TABLE [schema.] table_name ALLOCATE EXTENT [({ SIZE integer [K | M] | DATAFILE 'filename' | INSTANCE integer})]
   -----------
   故，需要构建如下样子简单的SQL命令：
   -----------
   alter table TableName allocate extent
   -----------
   但要是每一张表写一条语句的话太过麻烦，为了方便我们使用SQL命令拼写出每一张表的alter语句。
构建对空表分配空间的SQL命令。
   查询当前用户下的所有空表（一个用户最好对应一个默认表空间）。命令如下：
   SQL>select table_name from user_tables where NUM_ROWS=0; 
   根据上述查询，可以构建针对空表分配空间的命令语句，如下：
   SQL>Select 'alter table '||table_name||' allocate extent;' from user_tables where num_rows=0 or num_rows is null（注意：很多教程没有这里，这里是有可能位空的）
   上述代码可产生批量的修改表extent的SQL语句(有多少张空表就产生多少条)，我们只需要将其生成的所有sql代码全部执行，就可以给每一张已经存在的表来分配segment，就OK了。
最后：这时再用exp导出就没有问题了。但是：数据库本身的deferred_segment_creation属性还是TRUE,也是就是说如果再创建新表的话，默认还是不分配segment的。所以还是需要更改deferred_segment_creation的参数，以便以后创建的新表自动分配segment。
总结：
    如果你的数据库还没有创建任何数据表，那么直接修改deferred_segment_creation属性，以后创建的表无论是不是为空都会自动分配segment，就不会出现导不出空表的情况。然而如果你的数据库中已经有很多空表，并且需要导出来，那么光修改deferred_segment_creation属性则没有用的，因为它只对之后创建的表有作用。你需要给已存在的空表分配segment以便可以导出存在的空表，就用到上面讲的allocate extent方法，但此方法只针对已经存在的表的segment属性，所以最好就是：先给已存在的空表分配segment，方便其可以直接导出，然后设定deferred_segment_creation参数以便以后每张表无论是否为空都自动分配segment。
附录：有关第三种方法给已经存在的空表分配segment，下面介绍一种生成脚本来执行sql的方法。
SQL>Select 'alter table '||table_name||' allocate extent;' from user_tables where num_rows=0 or num_rows is null;
批量输出上述生成的SQL语句并写入到一个.sql的脚本文件中。
如： 
1. 创建执行脚本文件：我创建一个E:\sql_script.sql文件。内容如下：
   set heading off;
   set echo off;
   set feedback off;
   set termout on;
   spool E:\sql_allocate.sql;
   Select 'alter table '||table_name||' allocate extent;' from user_tables where num_rows=0 or num_rows is null;
   spool off;
   这个脚本的作用就是创建一个E:\sql_allocate.sql脚本文件，将Select 'alter table '||table_name||' allocate extent;' from user_tables where num_rows=0 or num_rows is null的执行结果（就是给每张表生成segment的SQL代码）批量输出，存储到一个E:\sql_allocate.sql的脚本文件中。
2. 执行E:\sql_script.sql文件来生成“分配表空间的SQL代码”的脚本文件sql_allocate.sql。
   命令如下：
   SQL>@ E:\sql_script.sql;  (也可写一个批处理文件，命令如下：sqlplus 用户名/密码@数据库 @E:\sql_script.sql)
   执行完毕后，得到E:\sql_allocate.sql脚本文件(里面是给所有空表分配segment的SQL代码)。
   打开该文件会看到，已经得到对所有空表分配空间的SQL语句。
3. 执行E:\sql_allocate.sql文件来对表分配空间。
   命令如下：SQL>@ E:\sql_allocate.sql
   执行完毕，表已更改。之前存在的空表已分配segment空间！

大功告成，此时执行exp命令，即可把包括空表在内的所有表，正常导出。
```

## 无法转换为环境字符串句柄
![image.png](/common/1614063769075-8cf4153c-3df4-4eb6-95a0-728bd04e269a.png)

在imp 导入数据库的时候出现问题； 这个问题是 你用 expdp导出的 却用客户端的 imp 导入；换成impdp导入即可
