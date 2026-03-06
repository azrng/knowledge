---
title: 说明
lang: zh-CN
date: 2023-11-23
publish: true
author: azrng
isOriginal: true
category:
  - orm
tag:
  - odbc
---

## 概述

ODBC英文全称为：Open Database Connectivity。用于在不同的操作系统和数据库管理系统之间进行数据访问的标准化接口。它提供了一组函数和API，使得应用程序可以通过统一的方式访问不同类型的数据源。 大多数数据源都有适用的 ODBC 驱动程序。



[Microsoft ODBC Driver for SQL Server文档说明](https://learn.microsoft.com/zh-cn/sql/connect/odbc/microsoft-odbc-driver-for-sql-server?view=sql-server-ver16)

## 操作

使用odbc需要安装驱动程序，比如连接sqlserver就需要去这里[下载](https://learn.microsoft.com/zh-cn/sql/connect/odbc/download-odbc-driver-for-sql-server?view=sql-server-ver16)驱动包

### 连接

通过odbc连接sqlserver

```c#
var str="Server=172.16.70.54;Database=cdr;Uid=sa;Pwd=Synyi123;Encrypt=no;driver=ODBC Driver 18 for SQL Server";
await using var connection = new OdbcConnection(str);
connection.Open();
```

### 查询

```c#
await using var connection = new OdbcConnection(str);
connection.Open();

// string sqlQuery = "Select @@version";
// var command = new OdbcCommand(sqlQuery, connection);
// var reader = command.ExecuteScalar();
// Console.WriteLine(reader.ToString());

// // 不使用dapper
// var select1 = "select name from dbo.users where name=?";
// OdbcCommand dbCommand = connection.CreateCommand();
// dbCommand.CommandText = select1;
// dbCommand.Parameters.Add("@name", OdbcType.VarChar).Value = "aa";
// var result1 = dbCommand.ExecuteScalar();
// Console.WriteLine($"result1:{result1}");

// ?key? 是参数化
// var select = "select name from dbo.users where name=?name?";
// var result = await connection.QueryAsync<string>(select, new { name = "aa" });
// Console.WriteLine(result.Count());

var select = "select name from dbo.users";
var result = await connection.QueryAsync<string>(select);
```

### 执行

```c#
await using var connection = new OdbcConnection(str);
connection.Open();
// ?key? 是参数化
var insertSql = "insert into dbo.users(name) values(?name?)";
var insertResult = await connection.ExecuteAsync(insertSql, new { name = Guid.NewGuid().ToString() });
```

## 实践

### 部署连接sqlserver2008的程序

新建一个控制台项目名字叫做MsSqlNetCoreOdbc(这里我直接创建.Net6的控制台项目)，然后安装nuget包

```
<PackageReference Include="System.Data.Odbc" Version="8.0.0" />
```

然后编写下面代码

```c#
using System.Data.Odbc;

try
{
    var str = "Server=192.168.1.2;Database=cdr;Uid=sa;Pwd=123;Encrypt=no;driver=ODBC Driver 18 for SQL Server";

    await using var connection = new OdbcConnection(str);
    connection.Open();

    string sqlQuery = "Select @@version";
    var command = new OdbcCommand(sqlQuery, connection);
    var reader = command.ExecuteScalar();
    Console.WriteLine(reader.ToString());
    
    Console.WriteLine("conn success");

    Console.WriteLine("over");
}
catch (Exception ex)
{
    Console.WriteLine($"message:{ex.Message} stackTrace:{ex.StackTrace}");
}

Console.ReadLine();
```

如果你要本地调试看代码是否有问题，那么还需要安装驱动程序，需要去[此处](https://learn.microsoft.com/zh-cn/sql/connect/odbc/download-odbc-driver-for-sql-server?view=sql-server-ver16)下载安装然后启动调试，比如我运行就会输出版本信息

```
Microsoft SQL Server 2008 R2 (RTM) - 10.50.1600.1 (X64)                                
        Apr  2 2010 15:48:46                                                           
        Copyright (c) Microsoft Corporation                                            
        Enterprise Edition (64-bit) on Windows NT 6.2 <X64> (Build 9200: ) (Hypervisor)

conn success
over
```

如果你需要容器化部署，那么就需要去新建dockerfire文件，另外考虑到连接的是sqlserver2008版本，所以需要

* 降低容器tls版本
* 安装操作驱动

修改dockerfile文件，增加下面的内容

```dockerfile
RUN sed -i 's/deb.debian.org/mirrors.aliyun.com/g' /etc/apt/sources.list && apt-get update  && \
    apt-get install -y unixodbc unixodbc-dev curl
RUN curl https://packages.microsoft.com/keys/microsoft.asc |  tee /etc/apt/trusted.gpg.d/microsoft.asc && curl https://packages.microsoft.com/config/debian/11/prod.list > /etc/apt/sources.list.d/mssql-release.list && \
    apt-get update && \
    ACCEPT_EULA=Y apt-get install -y msodbcsql18 && \
    apt-get clean -y && \
    rm -rf /var/lib/apt/lists/*
COPY ./ConnectTest/odbcinst.ini /etc/odbcinst.ini

RUN sed -i 's/DEFAULT@SECLEVEL=2/DEFAULT@SECLEVEL=1/g' /etc/ssl/openssl.cnf
RUN sed -i 's/MinProtocol = TLSv1.2/MinProtocol = TLSv1/g' /etc/ssl/openssl.cnf
RUN sed -i 's/DEFAULT@SECLEVEL=2/DEFAULT@SECLEVEL=1/g' /usr/lib/ssl/openssl.cnf
RUN sed -i 's/MinProtocol = TLSv1.2/MinProtocol = TLSv1/g' /usr/lib/ssl/openssl.cnf


# odbcinst.ini 文件内容如下

[ODBC Driver 18 for SQL Server]
Description=Microsoft ODBC Driver 18 for SQL Server
Driver=/opt/microsoft/msodbcsql18/lib64/libmsodbcsql-18.3.so.2.1
UsageCount=1
```

dockerfile安装odbc驱动文档：[此处](https://learn.microsoft.com/zh-cn/sql/connect/odbc/linux-mac/installing-the-microsoft-odbc-driver-for-sql-server?view=sql-server-ver16&tabs=ubuntu18-install%2Calpine17-install%2Cdebian8-install%2Credhat7-13-install%2Crhel7-offline#18)

完整dockerfile内容如下

```c#
FROM mcr.microsoft.com/dotnet/runtime:6.0 AS base
WORKDIR /app

ENV DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=false

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build

ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["MsSqlNetCoreOdbc/MsSqlNetCoreOdbc.csproj", "MsSqlNetCoreOdbc/"]
RUN dotnet restore "./MsSqlNetCoreOdbc/./MsSqlNetCoreOdbc.csproj"
COPY . .
WORKDIR "/src/MsSqlNetCoreOdbc"
RUN dotnet build "./MsSqlNetCoreOdbc.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./MsSqlNetCoreOdbc.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final

RUN sed -i 's/deb.debian.org/mirrors.aliyun.com/g' /etc/apt/sources.list && apt-get update  && \
    apt-get install -y unixodbc unixodbc-dev curl
RUN curl https://packages.microsoft.com/keys/microsoft.asc |  tee /etc/apt/trusted.gpg.d/microsoft.asc && \
    curl https://packages.microsoft.com/config/debian/11/prod.list > /etc/apt/sources.list.d/mssql-release.list && \
    apt-get update && \
    ACCEPT_EULA=Y apt-get install -y msodbcsql18 && \
    apt-get clean -y && \
    rm -rf /var/lib/apt/lists/*
COPY ./MsSqlNetCoreOdbc/odbcinst.ini /etc/odbcinst.ini

RUN sed -i 's/DEFAULT@SECLEVEL=2/DEFAULT@SECLEVEL=1/g' /etc/ssl/openssl.cnf
RUN sed -i 's/MinProtocol = TLSv1.2/MinProtocol = TLSv1/g' /etc/ssl/openssl.cnf
RUN sed -i 's/DEFAULT@SECLEVEL=2/DEFAULT@SECLEVEL=1/g' /usr/lib/ssl/openssl.cnf
RUN sed -i 's/MinProtocol = TLSv1.2/MinProtocol = TLSv1/g' /usr/lib/ssl/openssl.cnf

WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "MsSqlNetCoreOdbc.dll"]
```

启动容器后输入如下

![image-20231124182003534](/common/image-20231124182003534.png)

连接成功，结束

### 连接pgsql

首先需要安装odbc for pgsql驱动，[下载地址](https://www.postgresql.org/ftp/odbc/releases/)，然后新建一个控制台项目，然后安装nuget包

```xml
<PackageReference Include="System.Data.Odbc" Version="8.0.0" />
```

然后编写下面代码

```cs
void Main()
{
	// 连接字符串格式：Driver={DriverName};Server=ServerAddress;Database=DatabaseName;Uid=Username;Pwd=Password;
    // {DriverName} 应替换为实际的驱动程序名称，例如 {PostgreSQL ANSI} 等。
    
	string connectionString = "Server=172.16.xxx.xxx;Database=xxx;Username=xxx;Password=xxx;Driver=PostgreSQL ANSI";
	try
	{
		using (OdbcConnection connection = new OdbcConnection(connectionString))
		{
			connection.Open();

			// 执行一个简单的查询
			OdbcCommand command = new OdbcCommand("SELECT 1", connection);
			OdbcDataReader reader = command.ExecuteReader();

			while (reader.Read())
			{
				Console.WriteLine(reader[0]); // 假设第一列有数据
			}

			reader.Close();
		}
	}
	catch (Exception ex)
	{
		Console.WriteLine("Error: " + ex.Message);
	}
}
```

## 资料

版本兼容性：https://learn.microsoft.com/zh-cn/sql/connect/odbc/windows/system-requirements-installation-and-driver-files?view=sql-server-ver16

驱动下载：https://learn.microsoft.com/zh-cn/sql/connect/odbc/download-odbc-driver-for-sql-server?view=sql-server-ver16

https://blog.csdn.net/iteye_9656/article/details/82103968 连接字符串

https://www.cnblogs.com/yuanzhongkui/p/4022557.html  连接sqlsever 

