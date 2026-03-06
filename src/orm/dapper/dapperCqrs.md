---
title: Dapper读写分离
lang: zh-CN
date: 2022-12-10
publish: true
author: azrng
isOriginal: true
category:
  - orm
tag:
  - 无
filename: dapperdouxiefenli
slug: fi4pnu
docsId: '67032665'
---

## 介绍
一个主库+一个从库或者多个从库的结构，从库的数据来自主库的同步。

## 操作
> 下面只是关于dapper操作数据库读写分离的构思。

新建一个存储连接字符串的类
```csharp
public class ConnectionStringConsts
{
    /// <summary>
    /// 主库连接字符串
    /// </summary>
    public static readonly string MasterConnectionString = "server=db.master.com;Database=crm_db;UID=root;PWD=1";

    /// <summary>
    /// 从库连接字符串
    /// </summary>
    public static readonly string SlaveConnectionString = "server=db.slave.com;Database=crm_db;UID=root;PWD=1";
}
```
然后新建存储数据库连接字符串主从映射关旭的映射类，这个类是通过连接字符串建立主库和从库的关系，并且根据映射规则返回实际要操作的字符串。
```csharp
public static class ConnectionStringMapper
{
    //存放字符串主从关系
    private static readonly IDictionary<string, string[]> _mapper = new Dictionary<string, string[]>();
    private static readonly Random _random = new Random();

    static ConnectionStringMapper()
    {
        //添加数关系映射
        _mapper.Add(ConnectionStringConsts.MasterConnectionString, new[] { ConnectionStringConsts.SlaveConnectionString });
    }

    /// <summary>
    /// 获取连接字符串
    /// </summary>
    /// <param name="masterConnectionStr">主库连接字符串</param>
    /// <param name="useMaster">是否选择读主库</param>
    /// <returns></returns>
    public static string GetConnectionString(string masterConnectionStr,bool useMaster)
    {
        //是否走主库
        if (useMaster)
        {
            return masterConnectionStr;
        }

        if (!_mapper.Keys.Contains(masterConnectionStr))
        {
            throw new KeyNotFoundException("不存在的连接字符串");
        }

        //根据主库获取从库连接字符串
        string[] slaveStrs = _mapper[masterConnectionStr];
        if (slaveStrs.Length == 1)
        {
            return slaveStrs[0];
        }
        return slaveStrs[_random.Next(0, slaveStrs.Length - 1)];
    }
}
```
我们将封装一个DapperHelper的操作，虽然Dapper用起来比较简单方便，但是依然强烈建议！！！封装一个Dapper操作类，这样的话可以统一处理数据库相关的操作，对于以后的维护修改都非常方便，扩展性的时候也会相对容易一些
```csharp
public static class DapperHelper
{
    public static IDbConnection GetConnection(string connectionStr)
    {
        return new MySqlConnection(connectionStr);
    }

    /// <summary>
    /// 执行查询相关操作
    /// </summary>
    /// <param name="sql">sql语句</param>
    /// <param name="param">参数</param>
    /// <param name="useMaster">是否去读主库</param>
    /// <returns></returns>
    public static IEnumerable<T> Query<T>(string sql, object param = null, bool useMaster=false)
    {
        //根据实际情况选择需要读取数据库的字符串
        string connectionStr = ConnectionStringMapper.GetConnectionString(ConnectionStringConsts.MasterConnectionString, useMaster);
        using (var connection = GetConnection(connectionStr))
        {
            return connection.Query<T>(sql, param);
        }
    }

    /// <summary>
    /// 执行查询相关操作
    /// </summary>
    /// <param name="connectionStr">连接字符串</param>
    /// <param name="sql">sql语句</param>
    /// <param name="param">参数</param>
    /// <param name="useMaster">是否去读主库</param>
    /// <returns></returns>
    public static IEnumerable<T> Query<T>(string connectionStr, string sql, object param = null, bool useMaster = false)
    {
        //根据实际情况选择需要读取数据库的字符串
        connectionStr = ConnectionStringMapper.GetConnectionString(connectionStr, useMaster);
        using (var connection = GetConnection(connectionStr))
        {
            return connection.Query<T>(sql, param);
        }
    }

    /// <summary>
    /// 执行事务相关操作
    /// </summary>
    /// <param name="sql">sql语句</param>
    /// <param name="param">参数</param>
    /// <returns></returns>
    public static int Execute(string sql, object param = null)
    {
        return Execute(ConnectionStringConsts.MasterConnectionString, sql, param);
    }

    /// <summary>
    /// 执行事务相关操作
    /// </summary>
    /// <param name="connectionStr">连接字符串</param>
    /// <param name="sql">sql语句</param>
    /// <param name="param">参数</param>
    /// <returns></returns>
    public static int Execute(string connectionStr,string sql,object param=null)
    {
        using (var connection = GetConnection(connectionStr))
        {
            return connection.Execute(sql,param);
        }
    }

    /// <summary>
    /// 事务封装
    /// </summary>
    /// <param name="func">操作</param>
    /// <returns></returns>
    public static bool ExecuteTransaction(Func<IDbConnection, IDbTransaction, int> func)
    {
        return ExecuteTransaction(ConnectionStringConsts.MasterConnectionString, func);
    }

    /// <summary>
    /// 事务封装
    /// </summary>
    /// <param name="connectionStr">连接字符串</param>
    /// <param name="func">操作</param>
    /// <returns></returns>
    public static bool ExecuteTransaction(string connectionStr, Func<IDbConnection, IDbTransaction, int> func)
    {
        using (var conn = GetConnection(connectionStr))
        {
            IDbTransaction trans = conn.BeginTransaction();
            return func(conn, trans)>0;
        }
    }
}

```
使用示例
```csharp
string queryPersonSql = "select id,name from Person where id=@id";
var person = DapperHelper.Query<Person>(queryPersonSql, new { id = 1 }).FirstOrDefault();
```

## 资料
[https://www.cnblogs.com/wucy/p/13485508.html](https://www.cnblogs.com/wucy/p/13485508.html) | 关于Dapper实现读写分离的个人思考 - yi念之间 - 博客园
