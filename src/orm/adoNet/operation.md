---
title: 操作
lang: zh-CN
date: 2023-10-09
publish: true
author: azrng
isOriginal: true
category:
  - orm
tag:
  - adonet
filename: operation.md
---

## 前言

可以直接通过ADO.NET来操作数据库，一般为了方便起见，是搭配Dapper等进行操作的

## 查询操作

### ExecuteReader

::: code-tabs

@tab MySQL

```c#
var sql = "select * from user";
var connection = new MySqlConnection("连接字符串");

if (connection.State != ConnectionState.Open)
    await connection.OpenAsync();

using var cmd = connection.CreateCommand();
cmd.CommandText = sql;
using var reader = await cmd.ExecuteReaderAsync();
while (await reader.ReadAsync())
{
    Console.WriteLine($"id:{reader.GetInt64(0)} name:{reader.GetString(1)}");
}
```

@tab Pgsql

```c#
var sql = "select * from user";
var connection = new NpgsqlConnection(connStr);

if (connection.State != ConnectionState.Open)
    await connection.OpenAsync();

using var cmd = connection.CreateCommand();
cmd.CommandText = sql;
using var reader = await cmd.ExecuteReaderAsync();
while (await reader.ReadAsync())
{
    Console.WriteLine($"id:{reader.GetInt64(0)} name:{reader.GetString(1)}");
}
```

@tab sqlserver

```c#
string ConnectionString = "Data Source=DESKTOP-63QE7M1; Database=CustomerDB; User ID=sa; Password=sa123; MultipleActiveResultSets=True";
Type type = typeof(Employee);
var propList = type.GetProperties().Select(p => $"[{p.Name}]");
string props = string.Join(',', propList);
string tableName = type.Name;
string StringSql = $"select {props} from [{tableName}] where id=" + id;
object oInstance = Activator.CreateInstance(type);
using (SqlConnection connection = new SqlConnection(ConnectionString))
{
    connection.Open();
    SqlCommand sqlCommand = new SqlCommand(StringSql, connection);
    SqlDataReader reader = sqlCommand.ExecuteReader();
    reader.Read();
    foreach (var prop in type.GetProperties())
    {
        prop.SetValue(oInstance, reader[prop.Name]);
    }
}
```

:::

### 执行查询返回列表

```c#
var sql = "select * from user";
var connection = new MySqlConnection("连接字符串");
if (connection.State != ConnectionState.Open)
    await connection.OpenAsync();

using var cmd = connection.CreateCommand();
cmd.CommandText = strSql;
using var reader = await cmd.ExecuteReaderAsync();
var list = ReadEntityListByReader<Employee>(reader);

/// <summary>
/// Read entity list by reader
/// </summary>
/// <typeparam name="T">entity</typeparam>
/// <param name="reader">data reader</param>
/// <returns>entity</returns>
private static List<T> ReadEntityListByReader<T>(DbDataReader reader) where T : new()
{
    List<T> listT = new List<T>();
    using (reader)
    {
        while (reader.Read())
        {
            T inst = new T();
            foreach (var pi in typeof(T).GetProperties(BindingFlags.Instance | BindingFlags.Public))
            {
                var obj = new object();
                try
                {
                    obj = reader[pi.Name];
                }
                catch (Exception ex)
                {
                    continue;
                }
                if (obj == DBNull.Value || obj == null)
                    continue;
                var si = pi.GetSetMethod();
                if (si == null)
                    continue;
                pi.SetValue(inst, obj, null);
            }
            listT.Add(inst);
        }
    }
    return listT;
}
```

### 支持返回Header

```c#
public async Task<object[][]> QueryAsync(string sql, string connString, object parameters = null, bool header = true)
{
    var rows = new List<object[]>();

    using var conn = new NpgsqlConnection(connString);

    using var reader = await conn.ExecuteReaderAsync(sql, parameters).ConfigureAwait(false);

    if (header)
    {
        var columns = new List<string>();

        for (var i = 0; i < reader.FieldCount; i++)
        {
            columns.Add(reader.GetName(i));
        }

        rows.Add(columns.ToArray());
    }

    while (await reader.ReadAsync().ConfigureAwait(false))
    {
        var row = new object[reader.FieldCount];

        for (var i = 0; i < reader.FieldCount; i++)
        {
            row[i] = reader[i];
        }

        rows.Add(row);
    }

    return rows.ToArray();
}
```

## 执行操作

:::code-tabs 

@tab MySQL

```c#
// 下面代码虽然加了事务，但是如果脚本里面包含DDL语句，那么事务是回滚不了的，设置其他添加、修改的操作也会导致回滚不了
// 所以业务中如果涉及到创建表且初始化数据的操作，需要分成两个文件添加事务，这样子那个添加修改数据的那个文件如果遇到了报错还可以回滚

var connection = new MySqlConnection("连接字符串");
if (connection.State != ConnectionState.Open)
    await connection.OpenAsync();
await using var tran = await connection.BeginTransactionAsync();
try
{
    var cmd = connection.CreateCommand();
    cmd.CommandText = mysqlSql; // sql字符串 这里还可以进行参数化操作，此处未演示
    cmd.Transaction = tran;
    var i = await cmd.ExecuteNonQueryAsync();
    await tran.CommitAsync();
}
catch (Exception ex)
{
    await Console.Out.WriteLineAsync("出错 回滚");
    await tran.RollbackAsync();
}
```



@tab Pgsql

```c#
// pgsql的事务可以回滚包含DDL语句的内容

var connection = new NpgsqlConnection("连接字符串");
if (connection.State != ConnectionState.Open)
    await connection.OpenAsync();
await using var tran = await connection.BeginTransactionAsync();
try
{
    var cmd = connection.CreateCommand();
    cmd.CommandText = sqlStr; // sql字符串 这里还可以进行参数化操作，此处未演示
    cmd.Transaction = tran;
    var i = await cmd.ExecuteNonQueryAsync();
    await tran.CommitAsync();
}
catch (Exception ex)
{
    await Console.Out.WriteLineAsync("出错 回滚");
    await tran.RollbackAsync();
}
```

:::
