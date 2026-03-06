---
title: 主从复制
lang: zh-CN
date: 2023-09-03
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - 无
filename: zhucongfuzhi
slug: yzxd47
docsId: '31804880'
---
## 概述

![image.jpeg](/common/1614056262236-4899a721-3403-46ad-9e2e-eadb3ccac404.jpeg)
（1）Master将改变记录到二进制日志(binary log)中（这些记录叫做二进制日志事件，binary log events）；
（2）Slave将Master的二进制日志事件(binary log events)拷贝到它的中继日志(relay log)；
注：Slave服务器中有一个I/O线程(I/O Thread)在不停地监听Master的二进制日志(Binary Log)是否有更新：如果没有它会睡眠等待Master产生新的日志事件；如果有新的日志事件(Log Events)，则会将其拷贝至Slave服务器中的中继日志(Relay Log)。
（3）Slave重做中继日志(Relay Log)中的事件，将Master上的改变反映到它自己的数据库中。
注：Slave服务器中有一个SQL线程(SQL Thread)从中继日志读取事件，并重做其中的事件从而更新Slave的数据，使其与Master中的数据一致。只要该线程与I/O线程保持一致，中继日志通常会位于OS的缓存中，所以中继日志的开销很小。

## 主从数据库不一致

先上Master库：
```
mysql>show processlist;
```

查看下进程是否Sleep太多。发现很正常。

```
show master status;
```

也正常。

```
mysql> show master status;
```

| File              | Position | Binlog_Do_DB | Binlog_Ignore_DB                                             |
| ----------------- | -------- | ------------ | ------------------------------------------------------------ |
| mysqld-bin.000001 | 3260     |              | mysql,test,information_schema
1 row in set (0.00 sec)
再到Slave上查看 |
```                                
mysql> show slave status\G 
```

Slave_IO_Running: Yes
Slave_SQL_Running: No
可见是Slave不同步

### 解决方案：忽略错误后，继续同步

该方法适用于主从库数据相差不大，或者要求数据可以不完全统一的情况，数据要求不严格的情况
解决：

```
stop slave;

#表示跳过一步错误，后面的数字可变
set global sql_slave_skip_counter =1;
start slave;
```

之后再用mysql> show slave status\G  查看

```
mysql> show slave status\G
```

Slave_IO_Running: Yes
Slave_SQL_Running: Yes
ok，现在主从同步状态正常了。。。

### 解决方案：重新做主从，完全同步

该方法适用于主从库数据相差较大，或者要求数据完全统一的情况
解决步骤如下：
1.先进入主库，进行锁表，防止数据写入
使用命令：

```
mysql> flush tables with read lock;
```

注意：该处是锁定为只读状态，语句不区分大小写
2.进行数据备份
#把数据备份到mysql.bak.sql文件

```
mysqldump -uroot -p -hlocalhost > mysql.bak.sql
```

这里注意一点：数据库备份一定要定期进行，可以用shell脚本或者python脚本，都比较方便，确保数据万无一失。
3.查看master 状态

```
mysql> show master status;
```

| File              | Position | Binlog_Do_DB | Binlog_Ignore_DB              |
| ----------------- | -------- | ------------ | ----------------------------- |
| mysqld-bin.000001 | 3260     |              | mysql,test,information_schema |

1 row in set (0.00 sec)
4.把mysql备份文件传到从库机器，进行数据恢复

```
scp mysql.bak.sql root@192.168.128.101:/tmp/
```

5.停止从库的状态

```
mysql> stop slave;
```

6.然后到从库执行mysql命令，导入数据备份

```
mysql> source /tmp/mysql.bak.sql
```

7.设置从库同步，注意该处的同步点，就是主库show master status信息里的| File| Position两项

```
change master to master_host = '192.168.128.100', master_user = 'rsync',  master_port=3306, master_password='', master_log_file =  'mysqld-bin.000001', master_log_pos=3260;
```

8.重新开启从同步

```
mysql> start slave;
```

9.查看同步状态

``` 
mysql> show slave status\G 
```

Slave_IO_Running: Yes
Slave_SQL_Running: Yes
10.回到主库并执行如下命令解除表锁定。

```
UNLOCK TABLES;
```

