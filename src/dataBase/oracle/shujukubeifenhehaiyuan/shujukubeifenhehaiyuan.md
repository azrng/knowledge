---
title: 数据库备份和还原
lang: zh-CN
date: 2023-09-23
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - 无
filename: shujukubeifenhehaiyuan
slug: tm2wb3
docsId: '31815651'
---

## 概述
1、一般情况下，数据库备份导出的是一个脚本文件，这个脚本文件里面包含了用户名称以及表空间名称；所以如果备份时候要创建相同的表空间和用户名称。
举例说明，比如使用的客户端是sqldeveloper，那么就是用上面工具里面的导出按钮进行导出成一个脚本文件。
2、需要注意查看原数据库用户名、密码、服务器名称、所属表空间、所属临时表空间
```sql
先查看源数据库是属于哪个表空间等等，然后导出为dmp格式，还原数据库时候需要先创建数据库，创建数据库是使用Database Configuration Assistant工具进行创建数据库，然后使用cmd去连接数据库
sqlplus 全局数据库名/命令  as sysdba
创建表空间：
如果放在一个文件夹中，那么这个文件夹必须提前先创建好
create tablespace 表空间名称 datafile 'F:\HYInstitute\HYINSTITUTE.DBF' size 1000M autoExtend on;
然后创建临时表空间
create temporary tablespace CCEN_TMP  tempfile 'E:\app\Administrator\admin\tablespace_tmp\CCEN_temp.dbf' size  1000M autoExtend on;
创建用户：
CREATE USER 用户名 IDENTIFIED BY 口令 DEFAULT TABLESPACE  表空间名称;
或者
CREATE USER DYZHCSYKT  IDENTIFIED BY DYZHCSYKT DEFAULT tablespace CCEN temporary tablespace CCEN_TMP;  
给用户赋权限：
grant connect, resource,dba to 用户名;
最后打开第三方客户端，然后使用系统用户名称、口令等进行连接，然后运行备份的dmp文件。
打开cmd运行框，运行
imp tianzhi_smart/tianzhi_smart@192.168.10.129:1521/orclfile='E:\tianzhi_smart.dmp' full=y;
```
 
 
常用的数据库复制方法是利用工具实现源数据库到目标数据库，不导出来脚本。
遇到问题：
1.如果a服务器连接了一个内部服务器b，而c想要从b服务器数据库复制数据，但是c连接b时候连接失败不能连接，那么可以用a去连接b，主机ip是b的，然后使用c去连接a，主机ip是a的。但是这种方法显示操作一直出错了，忘了之前是咋操作了
 

##  冷备份与冷恢复
```sql
1. 复制旧的数据库文件
(1) 用SQLPlus连接数据库:
sqlplus 用户名/密码 as sysdba
(2) 关闭DB ：
shutdown immediate；
(3) 复制文件到其他地方存储实现备份
1）复制三个文件夹
admin；
oradata(datafile， controlfile，redo【注：数据文件， 控制文件，redo】)；
flash_recovery_area三个文件夹。
2）dbhome_1下的内容
database(PWDfile、pfile)；
dbs(spfile)；
NETWORK/ADMIN(listener.ora、tnsnames.ora)。
 
2. Oracle重新建库恢复
（1）创建一个和原来一样的数据库。(安装路径和数据库名必须和原来一致)
（2）停止数据库shutdown immediate；
（3）复制安装目录下的admin、oradata、flash_recovery_area覆盖，复制database(PWDfile、pfile) 覆盖
（4）启动数据库 startup;
 
备注：
无归档模式：将备份文件拷贝回原来的目录即可，然后启动数据库。
归档模式：
①将数据文件、控制文件拷贝回原来目录
②SQL>startup mount;
SQL>recover database using backup controlfile;
③将相应的归档日志和联机日志拖到CMD命令窗口进行跑日志。
④SQL>alter database open resetlogs;
 
3. 软件重装恢复
此时，操作系统重装，如果做冷备恢复，要保证相同操作系统，相同的数据库版本。形势如同异机恢复。
A、不创建实例：（源机上的数据库名字为orcl）
(1) 恢复oradata/orcl目录
在目标机上的oradata目录下建立orcl文件夹，然后进行数据覆盖。
包括数据文件、参数文件、控制文件、日志文件、pwd文件，放在与原系统相同的目录。如果目录有所改变，则需要另外建立控制文件，修改pfile。
 
(2) 恢复admin/orcl目录
在目标机上的admin目录下建立orcl文件夹，然后在orcl里面再建立adump、bdump、cdump、udump、dpdump、pfile六个文件夹
(3) 建立服务
把源机的密码文件拷贝到目标机的database目录下。
使用oradim命令在cmd下oradim -new -sid orcl 表示建立一个服务，sid为orcl（最好名字和源机备份的数据库名字一致，就不需要重建密码文件）。如果是在linux下，不需要此步。
 
(4) 重建创建参数文件、控制文件
拷贝源机的pfile到目标机的一个目录下，修改pfile里面相关文件的路径。
然后通过SQL>create spfile from pfile=‘文件路径'来创建参数文件。
重建控制文件命令：SQL>alter database backup controlfile to trace;
 
然后会在udump文件夹下产生一个追踪文件，打开文件找到如下一段，复制到文本中，修改相应路径然后保存为:createctl.sql文件（sql脚本文件），复制到目标机上。
注意：SQL>alter database backup controlfile to trace as 'F:/DB_RECOVERY/CONTROL_FILE_TRACE.TXT';
复制的原始导出txt中的，相应代码片段如下:

 

STARTUP NOMOUNT
CREATE CONTROLFILE REUSE DATABASE "ORCL" NORESETLOGS  ARCHIVELOG
    MAXLOGFILES 16
    MAXLOGMEMBERS 3
    MAXDATAFILES 100
    MAXINSTANCES 8
    MAXLOGHISTORY 292
LOGFILE
  GROUP 1 'E:\APP\ADMINISTRATOR\ORADATA\ORCL\REDO01.LOG' SIZE 50M BLOCKSIZE 512,
  GROUP 2 'E:\APP\ADMINISTRATOR\ORADATA\ORCL\REDO02.LOG' SIZE 50M BLOCKSIZE 512,
  GROUP 3 'E:\APP\ADMINISTRATOR\ORADATA\ORCL\REDO03.LOG' SIZE 50M BLOCKSIZE 512
-- STANDBY LOGFILE
DATAFILE
 'E:\APP\ADMINISTRATOR\ORADATA\ORCL\SYSTEM01.DBF',
 'E:\APP\ADMINISTRATOR\ORADATA\ORCL\SYSAUX01.DBF',
  'E:\APP\ADMINISTRATOR\ORADATA\ORCL\UNDOTBS01.DBF',
 'E:\APP\ADMINISTRATOR\ORADATA\ORCL\USERS01.DBF',
 'E:\APP\ADMINISTRATOR\ORADATA\ORCL\EXAMPLE01.DBF',
 'E:\APP\ADMINISTRATOR\ORADATA\ORCL\YTQ.DBF',
 'E:\APP\ADMINISTRATOR\ORADATA\ORCL\ZJHH',
  'E:\APP\ADMINISTRATOR\PRODUCT\11.2.0\DBHOME_1\DATABASE\SDE_TBS',
 'I:\ZJECMS\DB\DB_BK_DATA\RMAN_LOCAL_1805\RMAN_BKUP_1805.DBF'
CHARACTER SET ZHS16GBK
;

 
(5)  数据库设置SID和启动服务
c:\>set ORACLE_SID=orcl
c:\>sqlplus "/as   sysdba"
 
SQL>create spfile from pfile='c:\pfile.txt';
SQL>@c:\createctl.sql;
SQL>shutdown   immediate;
SQL>startup;
SQL>alter database open resetlogs;
 
备注：
如果（4）、（5）不好用，可以用下面的方法修改这些路径不一致的问题（反正笔者电脑上冷备份恢复时，上面的两个步骤就不好用）：
1）SQL>下执行如下语句，恢复控制文件
STARTUP NOMOUNT
CREATE CONTROLFILE REUSE DATABASE "ORCL" NORESETLOGS  ARCHIVELOG
    MAXLOGFILES 16
    MAXLOGMEMBERS 3
    MAXDATAFILES 100
    MAXINSTANCES 8
    MAXLOGHISTORY 292
2）修改日志、DBF的路径

 

  alter database rename file 'E:\APP\ADMINISTRATOR\ORADATA\ORCL\REDO01.LOG' to 'E:\IDEPROS\oracle_home\oradata\orcl\REDO01.LOG';
  alter database rename file 'E:\APP\ADMINISTRATOR\ORADATA\ORCL\REDO02.LOG' to 'E:\IDEPROS\oracle_home\oradata\orcl\REDO02.LOG';
  alter database rename file 'E:\APP\ADMINISTRATOR\ORADATA\ORCL\REDO03.LOG' to 'E:\IDEPROS\oracle_home\oradata\orcl\REDO03.LOG';
alter database rename file 'E:\APP\ADMINISTRATOR\ORADATA\ORCL\SYSTEM01.DBF' to 'E:\IDEPROS\oracle_home\oradata\orcl\SYSTEM01.DBF';
 alter database rename file 'E:\APP\ADMINISTRATOR\ORADATA\ORCL\SYSAUX01.DBF' to 'E:\IDEPROS\oracle_home\oradata\orcl\SYSAUX01.DBF';
 alter database rename file 'E:\APP\ADMINISTRATOR\ORADATA\ORCL\UNDOTBS01.DBF' to 'E:\IDEPROS\oracle_home\oradata\orcl\UNDOTBS01.DBF';
 alter database rename file 'E:\APP\ADMINISTRATOR\ORADATA\ORCL\USERS01.DBF' to  'E:\IDEPROS\oracle_home\oradata\orcl\USERS01.DBF';
 alter database rename file 'E:\APP\ADMINISTRATOR\ORADATA\ORCL\EXAMPLE01.DBF' to  'E:\IDEPROS\oracle_home\oradata\orcl\EXAMPLE01.DBF';
 alter database rename file 'E:\APP\ADMINISTRATOR\ORADATA\ORCL\YTQ.DBF' to 'E:\IDEPROS\oracle_home\oradata\orcl\YTQ.DBF';
 alter database rename file 'E:\APP\ADMINISTRATOR\ORADATA\ORCL\ZJHH' to 'E:\IDEPROS\oracle_home\oradata\orcl\ZJHH';
 alter database rename file 'E:\APP\ADMINISTRATOR\PRODUCT\11.2.0\DBHOME_1\DATABASE\SDE_TBS' to 'E:\IDEPROS\oracle_home\oradata\orcl\SDE_TBS';
 alter database rename file 'I:\ZJECMS\DB\DB_BK_DATA\RMAN_LOCAL_1805\RMAN_BKUP_1805.DBF' to 'E:\IDEPROS\oracle_home\oradata\orcl\RMAN_BKUP_1805.DBF';
 

 
(6) TNSNAMES设置
在network\admin下的tnsnames.ora中添加如下片段
ORCL =
(DESCRIPTION   =
(ADDRESS_LIST   =
(ADDRESS   = (PROTOCOL = TCP)(HOST = 127.0.0.1)(PORT = 1521))
)
(CONNECT_DATA   =
(SERVICE_NAME   = orcl)
)
)
 
(7) 建立监听
用net configuration为orcl实例新建监听
 
至此，冷备份恢复成功。即使你现在用oem打开数据库时发现提示找不到sid ，但实际上你已经成功了，此时只需要重启一下的你的服务器就可以。
 
 
B、创建实例方式（实例SID与源机数据库SID一致）
(1) 替换和覆盖oradata\orcl目录
删除目标机的oradata\orcl底下的所有文件，把源机的所有data文件、redo文件拷贝到此目录下
(2) 密码文件覆盖
删除目标机的密码文件，拷贝源机密码文件到目标机下。
(3) 控制文件恢复
在源机上重建目标机的控制文件：SQL>alter database backup controlfile to trace;然后会在udump文件夹下产生一个追踪文件，打开文件找到上面那段，复制到文本中，修改相应路径然后保存为:createctl.sql文件（sql脚本文件），复制到目标机上。
复制代码代码如下:
c:\>sqlplus "/as   sysdba"
SQL>@c:\createctl.sql;
SQL>shutdown   immediate;
SQL>startup;
SQL>alter database open resetlogs;
 
(4)  在network\admin下的tnsnames.ora中添加如下片段
复制代码代码如下:
ORCL =
(DESCRIPTION   =
(ADDRESS_LIST   =
(ADDRESS   = (PROTOCOL = TCP)(HOST = 127.0.0.1)(PORT = 1521))
)
(CONNECT_DATA   =
(SERVICE_NAME   = orcl)
)
)
 
(5) 用net configuration为orcl实例新建监听
 
```

## EXPDP和IMPDP
注意：
EXP和IMP是客户段工具程序，它们既可以在客户端使用，也可以在服务器段使用。
EXPDP和IMPDP是服务端的工具程序，他们只能在ORACLE服务端使用，不能在客户端使用
IMP只适用于EXP导出文件，不适用于EXPDP导出文件;IMPDP只适用于EXPDP导出文件，而不适用于EXP导出文件。
 
expdp会把空表也导出，虽然还没有分配segment
exp是找不到没有分配segment的表
 
 
在之前Oracle进行数据库迁移时候是使用的imp、exp进行导入导出的，但是后来推出了expdp
两个的差别是expdp会把空表也导出，虽然还没有分配segment，exp是找不到没有分配segment的表，所以在导出有些数据库的情况下，该数据库导出的dmp文件中不包含空的数据库表，所以需要使用expdp的方式进行导出，
首先在cmd运行下面的导出命令，然后等待结束后会发现在下图中多了一些文件
导出的语句中不需要指定导出目录
![image.png](/common/1614064979468-5132c0c8-13c7-4670-ac35-dcea2cf8839d.png)
然后拷贝整个文件夹到需要还原的服务器放入指定的文件夹中（两个服务器需要安装相同版本的软件，创建相同的数据库名称、表名称、用户名称等），然后运行下面的语句进行导入数据库，导入成功即可。
 
 
 
操作示例：DYZHCSYKT是用户名也是该用户的密码，ORABUSONLINE 是数据库名称，schemas=(DYZHCSYKT)是需要导出的用户
导入：
```sql
impdp DYZHCSYKT/DYZHCSYKT@ORABUSONLINE dumpfile=EXP_%date:~0,4%%date:~5,2%%date:~8,2%.DMP LOGFILE=EXP_%date:~0,4%%date:~5,2%%date:~8,2%.log schemas=(DYZHCSYKT)
导出：
expdp DYZHCSYKT/DYZHCSYKT@ORABUSONLINE dumpfile=EXP_%date:~0,4%%date:~5,2%%date:~8,2%.DMP LOGFILE=EXP_%date:~0,4%%date:~5,2%%date:~8,2%.log schemas=(DYZHCSYKT)
```

 
其他参与资料：[https://www.cnblogs.com/whsa/p/3975817.html](https://www.cnblogs.com/whsa/p/3975817.html)


