---
title: EF连接MySQL
lang: zh-CN
date: 2023-09-03
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - 无
filename: ef+mysql
slug: fh1on4
docsId: '26500019'
---
## MySql.Data

当前MySQL数据库中，版本使用的是mysql-5.7.26-winx64
首先需要安装插件：
![image.png](/common/1609051365516-2a2c78b3-811d-42cb-aa75-345dfc0e28ad.png)
或者使用了另一个组合
mysql-for-visualstudio-1.2.8 搭配mysql-connector-net-6.10.7
安装也需要注意先后步骤，不然有一部分安装不上。先安装MySql Server，再安装MySql for VS，再安装Connector/ODBC，重点来了，一定要最后安装Connector/NET，然后创建MVC项目，然后再nuget中安装

```
EntityFrameWork 6.2.0
mysql.Data   6.8.8  
Mysql.Data.Entity 6.8.8
```

然后就可以正常使用了
连接数据库语句是：

```xml
<connectionStrings>    
    <add name="MyContext" connectionString="Data Source=localhost;port=3306;Initial Catalog=myshop;user id=sa;password=sa;charset=utf8" providerName="MySql.Data.MySqlClient"/>  
</connectionStrings>
```

另一种方式
安装MySQL-Connector-net-6.9.12
安装MySQL for Visual Studio 2.0.5
然后用Nuget方式安装MySql.Data.Entity-6.9.12，MySql.Data-6.9.12

## MySqlConnector

现在连接mysql使用nuget包MySqlConnector，详情查看：https://www.nuget.org/packages/MySqlConnector

## 参考地址

[https://www.cnblogs.com/DNLi/p/DNLi.html](https://www.cnblogs.com/DNLi/p/DNLi.html)

[https://blog.csdn.net/a_asdfgh/article/details/81667912](https://blog.csdn.net/a_asdfgh/article/details/81667912)
