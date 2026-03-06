---
title: Windows安装
lang: zh-CN
date: 2021-05-14
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - 无
---

## mysql-5.7.26-winx64 解压版安装

1.先去下载安装包，zip格式 [https://www.mysql.com/downloads/](https://www.mysql.com/downloads/)
2.解压安装包，放在D:\MySql\mysql-5.7.26-winx64路径下
![image.png](/common/1614063538485-6f540338-acf0-40a6-808b-815d827d5fd0.png)
3.把bin目录配置到环境变量path的后面 
新建MYSQL_HOME变量，并配置值为: 
D:\MySql\mysql-5.7.26-winx64
编辑path系统变量，将
%MYSQL_HOME%\bin
添加到path变量后。
配置path环境变量，也可不新建MYSQL_HOME变量，而是直接将MySQL安装目录下的bin配置到path变量下，Path：%MYSQL_HOME%\bin
4.准备好my.ini文件，可以先新建一个my.txt文件，然后通过重命名修改文件后缀为.ini，以前的版本解压后或许会存在my-default.ini文件，但是5.7.23版本没有，因此要自己手动创建该文件, 编辑好my.ini文件之后，将my.ini文件放到
D:\MySql\mysql-5.7.26-winx64
目录下。文件的内容如下：
```
[mysqld]
port = 3306
basedir=D:\MySql\mysql-5.7.26-winx64
datadir=D:\MySql\mysql-5.7.26-winx64\data 
max_connections=200
character-set-server=utf8
default-storage-engine=INNODB
sql_mode=NO_ENGINE_SUBSTITUTION,STRICT_TRANS_TABLES
[mysql]
default-character-set=utf8
#开启mysql大小写敏感配置
lower_case_table_names=0
#作用是跳过登录的验证
#skip-grant-tables
```
 以管理员身份打开cmd命令窗口，将目录切换到MySQL的安装目录的bin目录下: 
cd /d D:\MySql\mysql-5.7.26-winx64\bin 
![image.png](/common/1614063538507-8415dcf9-a2fe-458e-b5a6-118bbcb8bca6.png)
执行以下语句进行MySQL的安装(执行命令后提示：Service successfully installed. 表示安装成功): 
mysqld -install 
或者（mysqld install MySQL –defaults-file=”D:\MySql\mysql-5.7.26-winx64\my.ini” //删除可以用 mysqld remove ）
再上一个目录执行以下语句进行MySQL的初始化（ 执行命令后会在MySQL的安装目录下生成data目录并创建root用户）: 
mysqld --initialize-insecure --user=mysql 
![image.png](/common/1614063538496-1ba321c2-a124-4bce-ba9e-70e4a37c4a89.png)
注意: 不执行此步骤, 启动时会报, MySQL 服务无法启动. 服务没有报告任何错误
执行以下命令以启动mysql服务: 
net start mysql 
启动MySQL之后，root用户的密码为空，设置密码
接着上一个目录输入命令mysqladmin -u root -p password 
然后直接点击enter，再次点击进行设置密码
![image.png](/common/1614063538491-6939771e-d658-4b4b-b59b-004ffbb428c5.png)
 
需要输入旧密码时，由于旧密码为空，所以直接回车即可
mysqladmin -u root -p password 新密码
Enter password: 旧密码
 
 
## mysql-8.0.18-winx64 解压版安装
 
大体上和5.7.26安装步骤一样

my.ini文件
```
[mysql]
## 设置mysql客户端默认字符集
default-character-set=utf8
[mysqld]
## 设置3306端口
port = 3306
## 设置mysql的安装目录
basedir = D:\\Program Files\\mysql\\
## 设置mysql数据库的数据的存放目录
datadir = D:\\Program Files\\mysql\\data
## 允许最大连接数
max_connections=20
## 服务端使用的字符集默认为8比特编码的latin1字符集
character-set-server=utf8
## 创建新表时将使用的默认存储引擎
default-storage-engine=INNODB
## 创建模式
sql_mode = NO_ENGINE_SUBSTITUTION,STRICT_TRANS_TABLES
```

## MySQL5.7完全卸载

本文主要针对MySQL重装出现的各种卸载不干净问题做了详细整理，希望对各位有所帮助，有疑问可以留言交流
主要介绍完全卸载mysql的具体步骤：包括停止服务、卸载相关程序、删除注册表等等
1、停止MySQL服务
2、卸载MySQL相关的程序
 
step1：本次是win10系统环境;左下角点击：开始-->所有应用-->弹出最近所有应用程序，选择MySQL右击点击卸载，这里会跳到控制面板，
 
如step2所示
 
![image.png](/common/1614062687890-325ea6a1-5558-4c16-8622-492f4164f7e2.png)
 
step2：图一跳转 or windows键+R-->Control-->程序和功能；所有MySQL程序点击右键卸载
 
![image.png](/common/1614062687906-5e485117-66ff-4397-a58a-4878ccc908b5.png)
 
step3：本人安装目录在C盘，首先打开C:\Program Files，删除MySQL文件夹
![image.png](/common/1614062687929-a5ca8678-7338-4562-b1b4-4a3404dfed21.png)
 
step4：打开隐藏文件ProgramData文件夹，删除下面的MySQL文件
 
![image.png](/common/1614062687943-3b91070f-62e3-44c2-a605-6b9439ca6dd6.png)
 
3、卸载MySQL相关注册表，这里也是重装不成功的坑
step1：Windows+R-->regedit-->打开注册表
 
![image.png](/common/1614062687934-64d16975-fa54-46e3-88c2-dbd5182c6af9.png)
 
step2：根据路径打开并删除：
 
    HKEY_LOCAL_MACHINE/SYSTEM/ControlSet001/Services/Eventlog/Applications/MySQL 
    HKEY_LOCAL_MACHINE/SYSTEM/ControlSet002/Services/Eventlog/Applications/MySQL 
    HKEY_LOCAL_MACHINE/SYSTEM/CurrentControlSet/Services/Eventlog/Applications/MySQL
    HKEY_LOCAL_MACHINE/SYSTEM/CurrentControlSet/Services一般服务会以相同的名字(名字通常是MySQL)
 
    还有就是F3或Ctrl+F打开查找框，输入MySQL，注意焦点放在计算机上
 
    还有重要的一步删除Connector Net XXX注册表，大家失败的原因好多也是在这个注册表上面
 
![image.png](/common/1614062687921-e8990df5-ff8c-4997-9d83-5e1d7089b46e.png)
 
step3：查出的MySQL注册表直接删掉
![image.png](/common/1614062687984-2bfafe92-46f5-4595-82e3-ceff96ffb858.png)
 
4、完成以上3步就可以重新安装数据库了
