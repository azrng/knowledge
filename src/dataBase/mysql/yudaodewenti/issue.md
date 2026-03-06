---
title: Issue
lang: zh-CN
date: 2023-02-27
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - 无
filename: yudaodewenti
slug: fz7mar
docsId: '31805017'
---

## 安装mysql提示已经存在

安装My SQL的时候出现了
“The service already exists
 The current server installed: D:\mysql\mysql-5.7.18-win64\mysql-5.7.18-winx64\bin\mysqld MySQL"
但是并没有找到该文件夹，之前已经被删除了。

![image.png](/common/1614062670615-a4c9014e-992a-4843-b807-1cfbd5094c32.png)

原因：原先安装的mysql没有卸载完，服务没有删除掉。

解决方法：
1、在cmd中输入”sc query mysql”查看名为mysql的服务
![image.png](/common/1614062670622-86c1e0c0-4c7e-4673-bf27-6a60509a89d4.png)

2、如上图，服务确实存在，则进行删除操作“sc delete mysql"
返回"[SC] DeleteService 成功"，则说明删除成功。

![image.png](/common/1614062670628-82196017-3698-4b4e-b1eb-120e68d399c5.png)

## 不允许去连接mysql服务

![image.png](/common/1614062656218-4c1fde48-a1b6-4c78-b605-34450d3e1e7c.png)
在使用Navicat配置远程连接Mysql数据库时候提示这个错误，这是因为mysql配置了不支持远程连接引起的
需要在安装mysql数据库的主机上登录root用户

```
mysql -u root -p
```

![image.png](/common/1614062656238-c08970e5-93d8-4dd1-b317-2ca65d9c1624.png)
依次执行如下命令：

```
use mysql;
select host from user where user='root';
```

可以看到当前主机配置信息为localhost.
![image.png](/common/1614062656232-e2d5cf8a-ccaf-4bd7-b8aa-970a67ce4ece.png)
执行

```
update user set host = '%' where user ='root';
```

将Host设置为通配符%。
Host设置了“%”后便可以允许远程访问。
然后记得重新查询一下是否已经修改成功

```
select host from user where user='root';
```

![image.png](/common/1614062656291-e57db884-e275-4e30-8fc2-2ca4202441dd.png)
Host修改完成后记得执行

```
flush privileges;
```

使配置立即生效。
![image.png](/common/1614062656242-6aca2755-679b-4028-bc7d-a70a7eae4fb2.png)
完成以上操作后，再试尝试远程连接Mysql，报错信息消失。

## 缺少msvcr120.dll

![image.png](/common/1614062884554-811cc420-67c9-4f04-8b86-4682f9c88de1.png)

可以去官网下载：
[https://www.microsoft.com/zh-cn/download/confirmation.aspx?id=40784](https://www.microsoft.com/zh-cn/download/confirmation.aspx?id=40784)
下载安装即可

## Too many connections

1、查看最大连接数

```
mysql> show variables like “%max_connections%”;
```

±----------------±------+
| Variable_name | Value |
±----------------±------+
| max_connections | 5000 |
±----------------±------+
1 row in set (0.00 sec)

2、修改最大连接数

MySQL 最大连接数的默认值是100，这个数值对于并发连接很多的数据库应用是远不够用的。当连接请求大于默认连接数后，就会出现无法连接数据库的错误，因此我们需要把它适当调大一些。在使用 MySQL 数据库的时候，经常会遇到一个问题，就是"Can not connect to MySQL server. Too many connections" -mysql 1040 错误，这是因为访问MySQL且还未释放的连接数已经达到 MySQL 的上限。通常，MySQL 的最大连接数默认是100,，最大可以达到16384。

常用的修改最大连接数的两种方式如下:
第一种：命令行修改最大连接数(max_connections)，设置最大连接数为1000。

```
mysql> set global max_connections = 1000;
```

这种方式有个问题，就是设置的最大连接数只在 MySQL 当前服务进程有效，一旦MySQL重启，又会恢复到初始状态。因为MySQL启动后的初始化工作是从其配置文件中读取数据的，而这种方式没有对其配置文件做更改。

第二种：通过修改配置文件来修改MySQL最大连接数(max_connections)。
进入MySQL安装目录，打开MySQL配置文件 my.ini 或 my.cnf查找 max_connections=100，修改为max_connections=1000，重启MySQL服务即可。

## 忘记密码

需要先查看下服务是否启动。
命令：ps -ef | grep -i mysql
然后关闭mysql服务：
命令：systemctl stop mysqld
修改mysql配置文件my.cnf
命令：vim /etc/my.cnf
再配置文件中增加两行代码：
[mysqld] 
skip-grant-tables
![image.png](/common/1609827476578-f8030894-738d-4032-a148-5ccb7776e89c.png)
然后保存启动mysql服务
命令：systemctl start mysqld
然后服务没有启动
查询当前启动的端口：
命令：netstat -anput
启动登录上mysql
命令：mysql -u root
然后开始修改密码的操作
在登录后输入以下命令:
use  mysql
然后
update mysql.user set authentication_string=password('zyp1234567') where user='root';
然后
flush privileges;
然后退出
命令：exit

重启mysql服务
先将之前在配置文件里面加入的2句代码注释或者删除掉，然后重启mysql服务，就可以使用刚才的密码登录了
重启mysql服务：systemctl restart mysqld
然后登录：mysql -u root -p

## 设置不区分大小写

linux下默认数据库是大小写敏感的

可以在客户端执行命令查看：
SHOW VARIABLES LIKE '%case%'
可以看到 lower_case_table_names 的值是 0, 我们要做的就是把它设置成 1. 具体步骤如下:
*、使用 vi /etc/mysql/my.cnf, 打开mysql 的配置文件, 在 mysqld 这个节点下, 加入:
lower_case_table_names=1
注意: 一定要放在 mysqld 节点下 , 放在其他节点下, 会不生效 !!!!

设置完后保存，然后重启mysql服务，这个时候就可以看到变成1了

重启命令：
service mysqld restart 

如果提示错误：
Failed to restart mysqld.service: Unit not found.
执行 chkconfig --list, 找到mysql 服务的具体名称, 比如是 mysqldddd
然后执行
service mysqldddd restart 
会看到
Shutting down MySQL....[ OK ]    
Starting MySQL.[ OK linux ]下默认数据库是大小写敏感的

可以在客户端执行命令查看：
SHOW VARIABLES LIKE '%case%'
可以看到 lower_case_table_names 的值是 0, 我们要做的就是把它设置成 1. 具体步骤如下:
*、使用 vi /etc/mysql/my.cnf, 打开mysql 的配置文件, 在 mysqld 这个节点下, 加入:
lower_case_table_names=1
注意: 一定要放在 mysqld 节点下 , 放在其他节点下, 会不生效 !!!!

设置完后保存，然后重启mysql服务，这个时候就可以看到变成1了

重启命令：
service mysqld restart 

如果提示错误：
Failed to restart mysqld.service: Unit not found.
执行 chkconfig --list, 找到mysql 服务的具体名称, 比如是 mysqldddd
然后执行
service mysqldddd restart 
会看到
Shutting down MySQL....[ OK ]    
Starting MySQL. OK 

## Docker设置不区分大小写

连接MySQL：
查看当前mysql的大小写敏感配置
```
show  variables like '%lower_case%';
```
+------------------------+-------+
| Variable_name          | Value |
+------------------------+-------+
| lower_case_file_system | ON    |
| lower_case_table_names | 0     |
+------------------------+-------+
> lower_case_file_system
> 表示当前系统文件是否大小写敏感，只读参数，无法修改。
> ON  大小写不敏感 
> OFF 大小写敏感 
进入docker的MySQL容器，编辑/etc/mysql/mysql.conf.d/mysqld.cnf文件，在[mysqld]下添加如下：
```
[mysqld] 
lower_case_table_names=1
```
保存，退出容器；
执行sudo docker restart MySQL ，重启MySQL即可查看：
```
show global variables like '%lower_case%';
```
+------------------------+-------+
| Variable_name          | Value |
+------------------------+-------+
| lower_case_file_system | OFF   |
| lower_case_table_names | 1     |
+------------------------+-------+
2 rows in set (0.00 sec)

## 中文乱码

Linux下安装的mysql数据库插入中文乱码或sql查询语句条件中有中文查不到数据
可能的问题就是数据库默认的字符集不是我们想要的字符集

那么我们连接我们的linux系统，然后登录mysql，当前mysql版本是5.7.26  
命令：mysql -u root  -p
然后输入密码登录 

![image.png](/common/1614062630522-f1744685-acd6-4e7c-96d3-afb34911f30c.png)

然后查询当前编码
命令：show variables like '%char%'

![image.png](/common/1614062630592-8d978c6f-e8bf-4834-b38e-9ca8757f5d07.png)

发现有的是utf8，有的不是，server和database都不是utf8，而是latin1
我们需要把这个server和database修改为utf8
编辑my.cnf
命令：vi /etc/my.cnf

![image.png](/common/1614062630531-d7d3dcc0-2ea1-40e4-9d48-27647b910321.png)

在里面加入

```sql
[client]
default-character-set=utf8
[mysql]
default-character-set=utf8
[mysqld]
character-set-server=utf8
```
![image.png](/common/1614062630548-265b9822-06ad-4127-8aa5-fa3674a34a53.png)

增加过以后记得去重启下MySQL服务

命令：systemctl restart mysqld

![image.png](/common/1614062630536-d25eb37b-9165-44c3-8123-be805fc72b25.png)

然后接着在登录mysql的状态下查询字符集

![image.png](/common/1614062630546-b757dfa1-09dc-438a-a4dc-caed996f82aa.png)

已经修改成功，再次去代码中实验，发现可以使用了。

## ERROR 1046 (3D000): No database selected

描述：在登录上mysql后，本机连接不了，想看下是不是设置了不允许远程连接，然后运行

```
select Host,User from user;
```

![img](/common/1614062615192-35ae8fa1-1174-4c73-9c8c-f4b33bb66dc5.png)

这个时候需要先

```
use mysql
```

然后再运行上面的命令查看，结果是：

![img](/common/1614062615197-a3301973-e07c-4be5-be24-eb1bc099173b.png)

还是不能访问，那么就清空下防火墙规则

```
iptables -F;
```

完美解决

## Fatal error encountered during data read.

因为你的sql语句里边带了自定义参数了，如@rownum这种参数。
Allow User Variables=True允许用户自定义参数。 

## Loading local data is disable

该错误是在执行文本文件插入的时候遇到的，原因就是本地文件无法导入，必须要"同时获得客户端和服务器端的许可"。

解决方案

在MySQL的命令行输入

```shell
SHOW GLOBAL VARIABLES LIKE 'local_infile';

SET GLOBAL local_infile = 'ON';
```

然后找到MySQL的配置文件‘my.ini’，打开在 [client] 和 [mysql] 下面，都添加上：`local_infile=ON`