---
title: dotNet操作
lang: zh-CN
date: 2023-09-23
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - 无
filename: dotnetcaozuo
slug: gdz8iq
docsId: '31815650'
---
```sql
<add name="DbContext" connectionString="Data Source= (DESCRIPTION =     (ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.110.186)(PORT = 1521))    (CONNECT_DATA =       (SERVER = DEDICATED)       (SERVICE_NAME = ORANEWLE 这个需要改)    )   );User ID=DYZHCSLEAPP这个需要改;Password=NYEKTLEAPP这个需要改;Persist Security Info=True" providerName="Oracle.ManagedDataAccess.Client" />
    <add name="OracleDbContext" providerName="Oracle.ManagedDataAccess.Client" connectionString="User Id=oracle_user;Password=oracle_user_password;Data Source=oracle" />
```

```sql
  <add name="DbContext" connectionString="Data Source= (DESCRIPTION =     (ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.110.186)(PORT = 1521))    (CONNECT_DATA =       (SERVER = DEDICATED)       (SERVICE_NAME = ORANEWLE 这个需要改)    )   );User ID=DYZHCSLEAPP这个需要改;Password=NYEKTLEAPP这个需要改;Persist Security Info=True" providerName="Oracle.ManagedDataAccess.Client" />
    <add name="OracleDbContext" providerName="Oracle.ManagedDataAccess.Client" connectionString="User Id=oracle_user;Password=oracle_user_password;Data Source=oracle" />
```
 
 
注意：
SERVER可以随便写
SERVICE_NAME是数据库名字
 
 
c#中连接Oracle数据库时使用的连接字符串：
var connectionString = "Data Source=(DESCRIPTION=(ADDRESS_LIST=(ADDRESS=(PROTOCOL=TCP)
(HOST=192.168.115.33) (PORT=1521)))(CONNECT_DATA=(SERVICE_NAME= testDemo)));
User Id=oracle_test; Password=oracle";
 
其中Oracle数据库服务器IP：192.168.115.33
ServiceName：testDemo
用户名：oracle_test
密码：oracle

## MVC+EF
先使用Nuget程序包，搜索oracle
安装
![image.png](/common/1614064740988-30d13a3a-f7b9-488e-9127-8bb5e03092d1.png)
+然后需要在webconfig中配置
```sql
 <add name="OracleDbContext" providerName="Oracle.ManagedDataAccess.Client" connectionString="User Id=oracle_user;Password=oracle_user_password;Data Source=oracle"/>
```

##  
 
 
