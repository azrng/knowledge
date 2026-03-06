---
title: 数据库连接池
lang: zh-CN
date: 2023-09-23
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - 无
filename: shujukulianjiechi
slug: fcmb37
docsId: '65198746'
---

## 概述

### 1. .NET数据库连接池的背景
数据库连接是一个耗时的行为，大多数应用程序只使用1到几种数据库连接，为了最小化打开连接的成本，ado.net使用了一种称为连接池的优化技术。

### 2. .NET 数据库连接池的表现
数据库连接池减少了必须打开新连接的次数，池程序维护了数据库物理连接。
通过为每个特定的连接配置保持一组活动的连接对象来管理连接。
每当应用程序尝试Open连接，池程序就会在池中找到可用的连接，如果有则返回给调用者；
应用程序Close连接对象时，池程序将连接对象返回到池中(Sleep), 这个连接可以在下一次Open调用中重用。
看黑板，下面是这次的重点：

### 3. .NET是如何形成数据库连接池的?
只有相同的连接配置才能被池化，.NET为不同的配置维护了不同的连接池。
相同的配置限制为：
进程相同、
连接字符串相同、
连接字符串关键key顺序相同。
(连接字符串提供的关键字顺序不同也将被分到不同的池)。
连接池中的可用连接的数量由连接字符串Max Pool Size决定。
在一个应用程序中，有如下代码：
```csharp
using (SqlConnection connection = new SqlConnection(  
  "Integrated Security=SSPI;Initial Catalog=Northwind"))  
    {  
        connection.Open();
        // Pool A is created.  
    }  
  
using (SqlConnection connection = new SqlConnection(  
  "Integrated Security=SSPI;Initial Catalog=pubs"))  
    {  
        connection.Open();
        // Pool B is created because the connection strings differ.  
    }  
  
using (SqlConnection connection = new SqlConnection(  
  "Integrated Security=SSPI;Initial Catalog=Northwind"))  
    {  
        connection.Open();
        // The connection string matches pool A.  
    }  
```
上面创建了三个Connection对象，但是只形成了两个数据库连接池。
还是以上代码，如果有两个相同的应用程序，理论上就形成了四个数据库连接池。

### 4. 连接池中的连接什么时候被移除？
连接池中的连接空闲4-8 分钟，池程序会移除这个连接。
应用程序下线，连接池直接被清空。

## 主动清空连接池
目的：切换数据库连接配置的时候，清空原连接池。
.NET提供了 ClearAllPools、ClearPool静态方法用于清空连接池。
• ClearAllPools：清空与这个DBProvider相关的所有连接池
• ClearPool(DBConnection conn)      清空与这个连接对象相关的连接池
很明显，我们这次要使用ClearPool(DBConnection conn) 方法。

压测/queryapi 产生一个包含大量连接对象的连接池；
适当的时候，调用/clearpoolapi清空连接池。
```csharp
 public class MySqlController : Controller
    {
        // GET: MySql
        [Route("query")]
        public string Index()
        {
            var s = "User ID=teinfra_neo_netreplay;Password=123456;DataBase=teinfra_neo_netreplay;Server=10.100.41.196;Port=3980;Min Pool Size=1;Max Pool Size=28;CharSet=utf8;";
            using (var conn = new MySqlConnection(s))
            {
                var comm = conn.CreateCommand();
                comm.CommandText = "select count(*) from usertest;";
                conn.Open();
                var ret = comm.ExecuteScalar();

                comm.CommandText = "select count(*) from information_schema.PROCESSLIST WHERE HOST like  '10.22.12.245%';";
                var len = comm.ExecuteScalar();
                return $"查询结果:{ret} ,顺便查一下当前连接池的连接对象个数: {len}";
            };
        }

        [Route("clearpool")]
        public string Switch()
        {
            var s = "User ID=teinfra_neo_netreplay;Password=123456;DataBase=teinfra_neo_netreplay;Server=10.100.41.196;Port=3980;Min Pool Size=1;Max Pool Size=28;CharSet=utf8;";
            using (var conn = new MySqlConnection(s))
            {
                conn.Open();
                MySqlConnection.ClearPool(conn);
            };

            using (var conn = new MySqlConnection(s))
            {
                conn.Open();
                var comm = conn.CreateCommand();
                comm.CommandText = "select count(*) from information_schema.PROCESSLIST WHERE HOST like  '10.22.12.245%';";
                var len = comm.ExecuteScalar();
                return $"之前已经清空连接池， 此次查询连接池有 {v1}  个连接对象";
            }

        }
    }
```
mysql的连接数查询命令： (host是web服务器IP)：
```csharp
select * from information_schema.PROCESSLIST WHERE HOST like '10.22.12.245%';
```
 调用/clearpoolapi，清空连接池

## 资料
[https://mp.weixin.qq.com/s/nmbZcBzfxz4haa4aunPPTQ](https://mp.weixin.qq.com/s/nmbZcBzfxz4haa4aunPPTQ) | 如何主动清空.NET数据库连接池？
sql连接池(ado.net): https://docs.microsoft.com/en-us/dotnet/framework/data/adonet/sql-server-connection-pooling

