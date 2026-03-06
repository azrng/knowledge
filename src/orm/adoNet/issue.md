---
title: 问题
lang: zh-CN
date: 2023-11-23
publish: true
author: azrng
isOriginal: true
category:
  - orm
tag:
  - issue
---

## 连接sqlserver2008问题

### 场景

在使用System.Data.SqlClient(Microsoft.Data.SqlClient只是测试了一次发现也连接不了)连接sqlserver2008的时候在容器部署的情况下报错，因为连接的是甲方的数据库，数据库版本等不能升级或者打补丁

### 错误信息

```
Connection Timeout Expired. The timeout period elapsed during the post-login phase. The connection could have timed out while waiting for server to complete the login process and respond; Or it could have timed out while attempting to create multiple active connections. The duration spent while attempting to connect to this server was - [Pre-Login] initialization=3; handshake=10; [Login] initialization=0; authentication=0; [Post-Login] complete=14074;
```

错误信息大致就是这个，配置不同错误信息也不太相同，比如有的错误码31有的35等

### 原因

sqlserver2008版本太老，只支持TLSv1协议，不支持TSLV2协议，所以在容器部署的时候一直报错，所以需要降低容器的协议版本

### 解决方案

先修改dockerfile文件，降低容器内tls版本

```dockerfile
# 如果不支持 tls 1.2，需要修改最低版本。

RUN sed -i 's/MinProtocol = TLSv1.2/MinProtocol = TLSv1/g' /etc/ssl/openssl.cnf
RUN sed -i 's/MinProtocol = TLSv1.2/MinProtocol = TLSv1/g' /usr/lib/ssl/openssl.cnf
```

本来以为到这里就可以了，发现还是报错，最后发现.NetCore 的System.Data.SqlClient支持的最低SqlServer版本是2008 r2 SP3,小于这个版本的就会报这个错。来源：https://github.com/dotnet/corefx/issues/9719 到达这里，那么就只好换驱动包了，最后使用了驱动包System.Data.Odbc来操作，示例代码如下

```
var str = "Server=192.168.70.54;Database=cdr;Uid=sa;Pwd=admin123;Encrypt=no;driver=ODBC Driver 18 for SQL Server";
await using var connection = new OdbcConnection(str);
connection.Open();

// string sqlQuery = "Select @@version";
// var command = new OdbcCommand(sqlQuery, connection);
// var reader = command.ExecuteScalar();
// Console.WriteLine(reader.ToString());
```

并且dockerfile还得增加东西，需要官网操作去操作即可，linux安装驱动：[此处](https://learn.microsoft.com/zh-cn/sql/connect/odbc/linux-mac/installing-the-microsoft-odbc-driver-for-sql-server?view=sql-server-ver16&tabs=alpine18-install%2Calpine17-install%2Cdebian8-install%2Credhat7-13-install%2Crhel7-offline)   参考示例

dockerfile增加下面内容

```dockerfile
RUN sed -i 's/deb.debian.org/mirrors.aliyun.com/g' /etc/apt/sources.list && apt-get update  && \
    apt-get install -y unixodbc unixodbc-dev curl
RUN curl https://packages.microsoft.com/keys/microsoft.asc |  tee /etc/apt/trusted.gpg.d/microsoft.asc && curl https://packages.microsoft.com/config/debian/11/prod.list > /etc/apt/sources.list.d/mssql-release.list && \
    apt-get update && \
    ACCEPT_EULA=Y apt-get install -y msodbcsql18 && \
    apt-get clean -y && \
    rm -rf /var/lib/apt/lists/*
COPY ./ConnectTest/odbcinst.ini /etc/odbcinst.ini

RUN sed -i 's/MinProtocol = TLSv1.2/MinProtocol = TLSv1/g' /etc/ssl/openssl.cnf
RUN sed -i 's/MinProtocol = TLSv1.2/MinProtocol = TLSv1/g' /usr/lib/ssl/openssl.cnf
```

其中odbcinst.ini内容为

```ini
[ODBC Driver 18 for SQL Server]
Description=Microsoft ODBC Driver 18 for SQL Server
Driver=/opt/microsoft/msodbcsql18/lib64/libmsodbcsql-18.3.so.2.1
UsageCount=1
```

然后就可以容器部署服务去连接sqlserver2008了

### 参考资料

https://learn.microsoft.com/zh-CN/sql/connect/ado-net/sqlclient-troubleshooting-guide?view=sql-server-linux-ver15#login-phase-errors

连接问题：https://www.cnblogs.com/xiaxiaolu/p/10309064.html
