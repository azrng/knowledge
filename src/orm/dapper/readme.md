---
title: 说明
lang: zh-CN
date: 2023-07-15
publish: true
author: azrng
isOriginal: true
category:
  - orm
tag:
  - dapper
filename: readme
slug: ecy6a9
docsId: '32068947'
---
## 概述

Dapper是一款轻量级ORM*框架*,为解决网站访问流量极高而产生的性能问题而构造,主要通过执行TSQL表达式而实现数据库的CQRS。 

## 连接字符串

```sh
# MySQL
Server=47.xxxx;database=test;uid=gxg;pwd=123456;charset=utf8;

# SQL server
Data Source=.;Initial Catalog=Test;User ID=sa;Password=123456

# pgsql
Host=localhost;Username=postgres;Password=123456;Database=consoletest
```

## 操作

1.使用nuget下载dapper，这种方法不能调试，但是也可以获取数据
2.直接下载源码，地址：[https://github.com/StackExchange/Dapper](https://github.com/StackExchange/Dapper) 

### 查询

使用dapper可以使用更少的代码，且dapper为我们处理打开连接和关闭连接

```csharp
// 查询映射
var connection = new SqlConnection("Data Source=.;Initial Catalog=Test;User ID=sa;Password=123456");
var sql = "select * from Users where Email=@email";
var info = connection.Query<Users>(sql, new { email = "123456" });

// 执行sql并且使用dynamic来接收
var rowData = await connection.QueryAsync<dynamic>(sql);
var data = rowData.Select(s => new DocumentGeneration { Id = s.id }).ToList();
```

### 执行操作

ADO.NET搭配Dapper操作

:::code-tabs

@tab mysql

```c#
var sql = "select * from user";
var connection = new MySqlConnection(connStr);

if (connection.State != ConnectionState.Open)
    await connection.OpenAsync();

await using var tran = await connection.BeginTransactionAsync(IsolationLevel.Serializable);
try
{
    // 测试结果
    // 1.如果sql中包含创建表等语句，遇到报错的情况，无法回滚创建表的语句以及报错sql之前的插入语句
    // 2.如果sql中没有创建表的语句，遇到报错的情况可以正常回滚(包含已经插入的数据)
    var i = await connection.ExecuteAsync(mysqlSql, transaction: tran);
    await tran.CommitAsync();
    Console.WriteLine(i);
}
catch (Exception)
{
    await tran.RollbackAsync();
}
```

@tab pgsql

```c#
// 包含创建表的sql  以及两个添加sql  一个正确 一个报错的
var mysqlSql =
@"INSERT INTO sample.menus (id, name, create_time, modify_time) VALUES (default, '张飒22222222', '2023-10-08 17:26:45.000000', '2023-10-08 17:26:47.000000');
create table sample.test_tran(id integer);INSERT INTO sample.menus (id, name, create_time, modify_time) VALUES (default, '张飒333333', '2xxxx000', '2023-10-08 17:26:47.000000');";

var connection = new NpgsqlConnection(connStr);

if (connection.State != ConnectionState.Open)
    await connection.OpenAsync();

await using var tran = await connection.BeginTransactionAsync();
try
{
    // 正常操作回滚 没有mysql的那个问题
    var i = await connection.ExecuteAsync(mysqlSql);
    await tran.CommitAsync();
    Console.WriteLine(i);
}
catch (Exception exception)
{
    Console.WriteLine(exception.Message);
    await tran.RollbackAsync();
}
```

:::



EFCore搭配Dapper操作

:::code-tabs

@tab mysql

```c#
var mysqlSql =
    @"INSERT INTO test.menus (id, name, create_time, modify_time) VALUES (default, '张飒22222222', '2023-10-08 17:26:45.000000', '2023-10-08 17:26:47.000000');CREATE TABLE IF NOT EXISTS `a111` (
`MigrationId` varchar(150) CHARACTER SET utf8mb4 NOT NULL,
`ProductVersion` varchar(32) CHARACTER SET utf8mb4 NOT NULL
) CHARACTER SET=utf8mb4;
INSERT INTO test.menus (id, name, create_time, modify_time) VALUES (default, '张飒333333', '2xxxx000', '2023-10-08 17:26:47.000000');";


await using var db = new OpenDbContext();
await using var connection = db.Database.GetDbConnection();
if (connection.State != ConnectionState.Open)
    await connection.OpenAsync();

await using var tran = await db.Database.BeginTransactionAsync();

// 因为脚本问题所以执行不成功 但是因为包含事务，所以也不会出现一条插入到数据库中(这是里面不包含创建表语句的前提下)
// 测试结果  ef中创建表语句不能通过事务回滚，ddl操作不支持事务性
// 1、如果包含创建表的sql且创建表之前的sql没有报错，那么表可以创建成功，并且正常的插入sql也会被执行，一直到遇到错误sql停止
// 2、如果不包含创建表sql，那么sql要成功都成功，否则都失败
var i = await connection.ExecuteAsync(mysqlSql, transaction: tran.GetDbTransaction());
await tran.CommitAsync();
```

@tab pgsql

```c#
var mysqlSql =
@"INSERT INTO sample.menus (id, name, create_time, modify_time) VALUES (default, '张飒22222222', '2023-10-08 17:26:45.000000', '2023-10-08 17:26:47.000000');
create table sample.test_tran(id integer);INSERT INTO sample.menus (id, name, create_time, modify_time) VALUES (default, '张飒333333', '2xxxx000', '2023-10-08 17:26:47.000000');";

await using var db = new OpenDbContext();
await using var connection = db.Database.GetDbConnection();
if (connection.State != ConnectionState.Open)
    await connection.OpenAsync();

await using var tran = await db.Database.BeginTransactionAsync();

// 正常操作 就算脚本中包含ddl语句，也可以回滚
var i = await connection.ExecuteAsync(mysqlSql);
await tran.CommitAsync();
```

:::

### 其他操作

#### 超时自动取消

```csharp
public override async Task TimeoutCancelTask()
{
    try
    {
        using var cancelTokenSource = new CancellationTokenSource();
        cancelTokenSource.CancelAfter(TimeSpan.FromSeconds(40));

        await using var db = new OpenDbContext();
        await using var dbConnection = db.Database.GetDbConnection();

        var sql = "select * from sample.user";

        var result =
            await dbConnection.QueryAsync<User>(new CommandDefinition(sql,
                cancellationToken: cancelTokenSource.Token));
        result.Dump();
    }
    catch (PostgresException ex)
    {
        Console.WriteLine(ex.Message);
        throw;
    }
}
```

### 自定义模型映射

当遇到数据库中表的列和模型中列不一致的情况，导致dapper查询映射失败，所以就需要做一些操作了

#### 方案一

将查询的列做别名转换

```c#
var sql = @"select top 1 person_id PersonId, first_name FirstName, last_name LastName from Person";
using (var conn = ConnectionFactory.GetConnection())
{
    var person = conn.Query<Person>(sql).ToList();
    return person;
}
```

#### 方案二

使用 *ColumnAttribute* 属性

```c#
/// <summary>
/// 用户信息
/// </summary>
public class UserInfo
{
    /// <summary>
    /// ID
    /// </summary>
    public string Id { get; set; }

    /// <summary>
    /// 姓名
    /// </summary>
    [Column("user_name")]
    public string UserName { get; set; }

    /// <summary>
    /// 状态
    /// </summary>
    public int Status { get; set; }

    /// <summary>
    /// 是否禁用
    /// </summary>
   	[Column("is_disabled")]
    public string IsDisabled { get; set; }
}
```

#### 方案三

使用 *CustomPropertyTypeMap* 自定义属性类型映射类，如：

```c#
public static class DapperMapperConfigs
{
    /// <summary>
    /// dapper映射配置
    /// </summary>
    public static void Init()
    {
        var userColMap = new ColumnMap();
        userColMap.Add("pass_word", nameof(UserInfo.PassWord));
        userColMap.Add("create_time", nameof(UserInfo.CreateTime));
        userColMap.Add("credit", nameof(UserInfo.Integral));
        userColMap.Add("id", nameof(UserInfo.Id));
        userColMap.Add("account", nameof(UserInfo.Account));

        SqlMapper.SetTypeMap(typeof(UserInfo), new CustomPropertyTypeMap(typeof(UserInfo), (type, columnName) => type.GetProperty(userColMap[columnName])));
    }
}

/// <summary>
/// 列映射
/// </summary>
public class ColumnMap
{
    /// <summary>
    /// 向前映射
    /// </summary>
    private readonly Dictionary<string, string> forward = new Dictionary<string, string>();

    /// <summary>
    /// 向后映射
    /// </summary>
    private readonly Dictionary<string, string> reverse = new Dictionary<string, string>();

    /// <summary>
    /// 添加映射的值(参数不区分是数据库列和代码列的先后关系)
    /// </summary>
    /// <param name="t1"></param>
    /// <param name="t2"></param>
    public void Add(string t1, string t2)
    {
        forward.Add(t1, t2);
        reverse.Add(t2, t1);
    }

    public string this[string index]
    {
        get
        {
            // Check for a custom column map.
            if (forward.ContainsKey(index))
                return forward[index];
            if (reverse.ContainsKey(index))
                return reverse[index];

            // If no custom mapping exists, return the value passed in.
            return index;
        }
    }
}
```

---

还可以基于该方法扩展一下，比如我们的数据库列是代码中的模型类列的蛇形命名，那么我们可以这么处理

```c#
// 在查询之前自定义映射一下模型类的列和数据库的列
DapperHelper.SnakeCaseTypeMap<UserInfo>();

// 开始执行sql查询数据库
const string str = "select * from user_test.user_info";
var dapper = GetDapperRepository();
var result = await dapper.QueryAsync<UserInfo>(str);
```

这里方法SnakeCaseTypeMap的写法如下，其中大致逻辑就是，将模型类的列转小写存储，然后在数据库的列查询模型属性的时候，将其去除下划线，然后转小写查询

```c#
/// <summary>
/// dapper帮助类
/// </summary>
public static class DapperHelper
{
    /// <summary>
    /// 蛇形命名映射
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public static void SnakeCaseTypeMap<T>()
    {
        var map = new ConcurrentDictionary<string, string>();
        var properties = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);
        foreach (var property in properties)
        {
            var name = property.Name;

            // 将实体类的列转小写后作为key 然后原始列作为value
            map[name.ToLowerInvariant()] = property.Name;
        }

        SqlMapper.SetTypeMap(typeof(T),
            new CustomPropertyTypeMap(typeof(T), (type, dataBaseColumn) =>
            {
                // 根据数据库的列转换为实体类的列
                var name = dataBaseColumn.Replace("_", "");
                return map.TryGetValue(name, out var value)
                    ? type.GetProperty(value)
                    : type.GetProperty(dataBaseColumn);
            }));
    }
}
```

#### 方案四

查询的时候返回dynamic，然后使用linq的select枚举

```c#
var sql = @"select top 1 person_id, first_name, last_name from Person";
using (var conn = ConnectionFactory.GetConnection())
{
    List<Person> person = conn.Query<dynamic>(sql)
                              .Select(item => new Person()
                              {
                                  PersonId = item.person_id,
                                  FirstName = item.first_name,
                                  LastName = item.last_name
                              }
                              .ToList();

    return person;
}
```

### DateOnly 和 TimeOnly 支持

Dapper 不支持 .NET 6.0 中的新 DateOnly 和 TimeOnly 类型。为了解决这个问题，创建了一个自定义类型处理程序。

为了支持 DateOnly 和 TimeOnly，提供了以下 SqlMapper.TypeHandle。

```c#
public class DapperSqlDateOnlyTypeHandler : SqlMapper.TypeHandler<DateOnly>
{
    public override void SetValue(IDbDataParameter parameter, DateOnly date)
        => parameter.Value = date.ToDateTime(new TimeOnly(0, 0));

    public override DateOnly Parse(object value)
        => DateOnly.FromDateTime((DateTime)value);
}
public class SqlTimeOnlyTypeHandler : SqlMapper.TypeHandler<TimeOnly>
{
    public override void SetValue(IDbDataParameter parameter, TimeOnly time)
    {
        parameter.Value = time.ToString();
    }

    public override TimeOnly Parse(object value) => TimeOnly.FromTimeSpan((TimeSpan)value);
}
```