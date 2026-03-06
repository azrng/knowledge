---
title: Oracle Install Client12.2安装教程
lang: zh-CN
date: 2023-09-23
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - 无
filename: oracleinstallclient12_2anzhuangjiaocheng
slug: htuysp
docsId: '31815693'
---
一、Oracle Install Client12.2下载地址：
[http://www.oracle.com/technetwork/cn/database/features/instant-client/index-097480.html](http://www.oracle.com/technetwork/cn/database/features/instant-client/index-097480.html)
里面有很多版本可供下载，但是要注意，客户端是多少位的下载多少位，不要因为系统是64位的就下载64位的。
二、配置
把下载的instantclient-basic-windows.x64-12.2.0.1.0.zip压缩包解压，放到D:\Oracle \instantclient_12_2 目录下。
在“环境变量”的“系统变量”中增加：
```sql
ORACLE_HOME = D:\Oracle\instantclient_12_2
TNS_ADMIN = D:\Oracle\instantclient_12_2
NLS_LANG = SIMPLIFIED CHINESE_CHINA.ZHS16GBK
```

修改Path变量，在后面添加 D:\Oracle\instantclient_12_2
 
注意：想要打开环境变量，需要在命令提示符下输入sysdm.cpl，进入系统属性对话框，点击高级选项卡，再点击环境变量按钮设置环境变量。
 
三、修改tnsnames.ora文件
在D:\Oracle\instantclient_12_2 新建一个tnsnames.ora文件，增加自己的数据库别名配置。
示例如下：
```sql
TEST =
  (DESCRIPTION =
    (ADDRESS_LIST =
      (ADDRESS = (PROTOCOL = TCP)(HOST = 127.0.0.1['需要连接的IP地址'])(PORT = 1521['端口号默认为1521']))
    )
    (CONNECT_DATA =
      (SERVICE_NAME = ORCL['需要连接的数据库的网络服务名,默认为ORCL'])
    )
  )
```
 
注意格式要排列好
主要修改 签名的别名，Host为Ip地址， SERVICE_NAME为数据库服务器的实例名。
四、卸载方法
“环境变量”中的“系统变量”中：
删除 ORACLE_HOME,TNS_ADMIN, NLS_LANG 三个变量,修改path变量，去掉D:\Oracle\instantclient_12_2目录
删除D:\Oracle\instantclient_12_2目录
五、第三方工具使用
上面任何一种客户端配置好后，都可以使用第三方工具，不需要再额外进行任何配置，即可使用。
 
 
