---
title: 为什么要使用ODBC连接SqlServer
lang: zh-CN
date: 2023-07-19
publish: true
author: azrng
isOriginal: true
category:
  - orm
tag:
  - odbc
---

## ODBC是什么？

ODBC是什么？我也不知道，用摘抄一个互联网上的话来解释：ODBC英文全称为：Open Database Connectivity。用于在不同的操作系统和数据库管理系统之间进行数据访问的标准化接口。它提供了一组函数和API，使得应用程序可以通过统一的方式访问不同类型的数据源。 大多数数据源都有适用的 ODBC 驱动程序。



那么ODBC和ADO.NET以及JDBC的关系是什么？让GPT来回答一下吧：

ODBC（Open Database Connectivity）和`ADO.NET`（ActiveX Data Objects .NET）是 Microsoft 开发的数据库访问接口。而 JDBC（Java Database Connectivity）则是由 Sun Microsystems 开发的 Java 数据库访问标准。

ODBC 和 JDBC 都提供了一种通用的方式来访问数据库，允许开发人员使用标准 SQL 语句来操作各种不同类型的数据库。ADO.NET则是微软针对 .NET 平台开发的数据库访问接口，提供了与 ODBC 类似的功能，但更加面向对象，具有更好的性能和可扩展性。

## 为什么要使用ODBC而不使用EFCore？

我也想使用EFCore或者其他的ORM框架，但是走不通！首先场景是这样子的，我们业务中有一个地方需要去连接甲方的数据库，然后查询数据，这个时候我们是使用的System.Data.SqlClient+Dapper来执行SQL查询的，可是一直报错，大概信息就是类似下面这些

```
// 因为修改了好几次，所以信息我已经对不上了，大概出现了下面的这些
Connection Timeout Expired. The timeout period elapsed during the post-login phase. The connection could have timed out while waiting for server to complete the login process and respond; Or it could have timed out while attempting to create multiple active connections. The duration spent while attempting to connect to this server was - [Pre-Login] initialization=3; handshake=10; [Login] initialization=0; authentication=0; [Post-Login] complete=14074;

或者

Microsoft.Data.SqlClient.SqlException (0x80131904): A connection was successfully established with the server, but then an error occurred during the pre-login handshake.
(provider: SSL Provider, error: 31 - Encryption(ssl/tls) handshake failed)
System.IO.EndOfStreamException: End of stream reached

或者

SSL Handshake failed with OpenSSL error - SSL_ERROR_SSL。
```

遇到这个问题，我们首先想在连接字符串上操作去修复解决这个问题，但是最后没有解决，我们想在公司复现，首先直接在我自己电脑本地连接sqlserver2019是没有问题的，然后没办法又在服务器安装了sqlserver2008也没有问题(这里我还傻不拉几想着使用容器部署一个sqlserver2008快，然后信了一个博客老哥的鬼话去拉取他的镜像，结果拉取下来是2019版本的，后来查阅资料才知道sqlserver2008哪里有什么镜像)，然后又模拟正式环境容器化部署，然后终于复现了上面的错误，然后就开始尝试，我们也在网络上查阅了资料，终于在一个文章上看到sqlserver2008不支持TLS1.2，然后按照那个文档的方法去降低容器TSL版本，比如dockerfile增加

```
RUN sed -i 's/MinProtocol = TLSv1.2/MinProtocol = TLSv1/g' /etc/ssl/openssl.cnf
RUN sed -i 's/MinProtocol = TLSv1.2/MinProtocol = TLSv1/g' /usr/lib/ssl/openssl.cnf
```

结果还是不行，错误变了，继续查阅文章，然后终于找到【嘿dotNet】公众号老哥的一个博客，他在2019年遇到了这个问题，我将他总结性的那部分摘抄出来

> .net core 的System.Data.SqlClient支持的最低SqlServer版本是2008 r2 SP3,小于这个版本的就会报这个错。
>
> 来源：https://github.com/dotnet/corefx/issues/9719
>
> 结论：.netcore 连接使用sqlserver遇到以上报错1、报错2的同学,需注意：**.net core 的System.Data.SqlClient支持的最低SqlServer版本是2008 r2 SP3**请先检查数据库版本。
>
> 呼~这个鬼问题浪费了我整整两天+（3个熬夜）
>
> 
>
> 文章地址：https://www.cnblogs.com/xiaxiaolu/p/10309064.html

虽然这个文章的评论中也提到了升级数据库版本可以解决，但是？甲方那边升级数据库肯定不现实的，那只好考虑换个组件什么的？我也尝试了EFCore依赖的包Microsoft.Data.SqlClient也是不行，所以这个时候就咨询其他部门(java)那边连接正常不？他们回复没有问题，然后就产生了要不再搞个java服务去连接的念头？？？这多尴尬，连接微软家的数据库还需要去麻烦其他语言？？？

领导说再找找资料 。。。然后就找到了Microsoft ODBC Driver for SQL Server

## 开始操作

在Nuget上搜索odbc，排名第一个的一个包是微软和dotnetframework维护的，最近一次更新在几天前，还是8.0.0版本怪新，那就根据文档去操作吧，这里需要注意的是使用ODBC去操作数据库是需要手动安装驱动的，比如我本地调试需要去[下载](https://learn.microsoft.com/zh-cn/sql/connect/odbc/download-odbc-driver-for-sql-server?view=sql-server-ver16)驱动安装



下面来演示一个连接的小示例，新建一个控制台项目名字叫做MsSqlNetCoreOdbc(这里我直接创建.Net6的控制台项目)，然后安装nuget包

```xml
<ItemGroup>
  <PackageReference Include="System.Data.Odbc" Version="6.0.1" />
</ItemGroup>
```

编写如下代码

```c#
using System.Data.Odbc;

try
{
    var str = "Server=xxxx;Database=dbName;Uid=sa;Pwd=123xxxx;Encrypt=no;driver=ODBC Driver 18 for SQL Server";
    
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

这里光看这个示例的话，和之前使用System.Data.SqlClient的改动确实不大，换了一个包，使用OdbcConnection创建DbConnection（需要注意的是如果你要使用到参数化等就需要注意了，它的参数化不是@key，而是?key?   我😵）

这里在安装好驱动的情况下直接运行代码启动调试，会输出下面的信息

```
Microsoft SQL Server 2008 R2 (RTM) - 10.50.1600.1 (X64)                                
        Apr  2 2010 15:48:46                                                           
        Copyright (c) Microsoft Corporation                                            
        Enterprise Edition (64-bit) on Windows NT 6.2 <X64> (Build 9200: ) (Hypervisor)

conn success
over
```

然后就要容器化部署测试是否可行了，那么按照官网的文章以及互联网上的资料去拼凑尝试给容器安装驱动，官网文章地址：[此处](https://learn.microsoft.com/zh-cn/sql/connect/odbc/linux-mac/installing-the-microsoft-odbc-driver-for-sql-server?view=sql-server-ver16&tabs=alpine18-install%2Calpine17-install%2Cdebian8-install%2Credhat7-13-install%2Crhel7-offline) ，比如看他Ubuntu的示例

```
if ! [[ "18.04 20.04 22.04 23.04" == *"$(lsb_release -rs)"* ]];
then
    echo "Ubuntu $(lsb_release -rs) is not currently supported.";
    exit;
fi

curl https://packages.microsoft.com/keys/microsoft.asc | sudo tee /etc/apt/trusted.gpg.d/microsoft.asc

curl https://packages.microsoft.com/config/ubuntu/$(lsb_release -rs)/prod.list | sudo tee /etc/apt/sources.list.d/mssql-release.list

sudo apt-get update
sudo ACCEPT_EULA=Y apt-get install -y msodbcsql18
# optional: for bcp and sqlcmd
sudo ACCEPT_EULA=Y apt-get install -y mssql-tools18
echo 'export PATH="$PATH:/opt/mssql-tools18/bin"' >> ~/.bashrc
source ~/.bashrc
# optional: for unixODBC development headers
sudo apt-get install -y unixodbc-dev
```

尝试去容器化部署吧，选中控制台项目右键添加dockerfile文件，并且做下面的修改

* 降低容器tls版本
* 安装odbc操作驱动

最后dockerfile需要增加以下内容

```
RUN sed -i 's/deb.debian.org/mirrors.aliyun.com/g' /etc/apt/sources.list && apt-get update  && \
    apt-get install -y unixodbc unixodbc-dev curl
RUN curl https://packages.microsoft.com/keys/microsoft.asc |  tee /etc/apt/trusted.gpg.d/microsoft.asc && curl https://packages.microsoft.com/config/debian/11/prod.list > /etc/apt/sources.list.d/mssql-release.list && \
    apt-get update && \
    ACCEPT_EULA=Y apt-get install -y msodbcsql18 && \
    apt-get clean -y && \
    rm -rf /var/lib/apt/lists/*
COPY ./MSSQL_NetCore_Odbc/odbcinst.ini /etc/odbcinst.ini

RUN sed -i 's/MinProtocol = TLSv1.2/MinProtocol = TLSv1/g' /etc/ssl/openssl.cnf
RUN sed -i 's/MinProtocol = TLSv1.2/MinProtocol = TLSv1/g' /usr/lib/ssl/openssl.cnf
```

其中odbcinst.ini内容为

```
[ODBC Driver 18 for SQL Server]
Description=Microsoft ODBC Driver 18 for SQL Server
Driver=/opt/microsoft/msodbcsql18/lib64/libmsodbcsql-18.3.so.2.1
UsageCount=1
```

然后重新启动生成容器，发现已经连接成功，输出信息如下

![image-20231124182003534](/common/image-20231124182003534.png)

连接成功，结束

## 参考资料

Microsoft ODBC Driver for SQL Server：https://learn.microsoft.com/zh-cn/sql/connect/odbc/microsoft-odbc-driver-for-sql-server?view=sql-server-ver16

SSL Handshake failed with OpenSSL error - SSL_ERROR_SSL：https://www.cnblogs.com/printertool/p/14084385.html

https://www.cnblogs.com/yuanzhongkui/p/4022557.html  连接sqlsever 

[Connection open error . Connection Timeout Expired. The timeout period elapsed during the post-login phase.](https://www.cnblogs.com/xiaxiaolu/p/10309064.html)
