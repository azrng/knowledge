---
title: 参数化查询
lang: zh-CN
date: 2023-06-13
publish: true
author: azrng
isOriginal: true
category:
  - orm
tag:
  - param
---

## 公共
```csharp
var parameters = new DynamicParameters(); 
parameters.Add("@stime", input.StartTime.To24HString(), DbType.DateTime);
```

::: tip

大多数情况下这个DbType是可以直接不写，忽略的，但是有时候这个类型还是很重要的，会导致和数据库类型不一致的情况，然后导致查询变慢，比如[一次不规范的参数化导致的超时问题](https://mp.weixin.qq.com/s/CGswG-wWIf7capeAYe_Stg)

:::

## =

```csharp
SqlCommand comm = new SqlCommand(@"
   SELECT * 
   FROM   Products 
   WHERE  Category_ID = @categoryid", 
   conn);
comm.Parameters.Add("@categoryid", SqlDbType.Int);
comm.Parameters["@categoryid"].Value = CategoryID;
```

### MySql
```csharp
public List<TopicCitys> GetCustomerHistorBestList(string TopicLibaryId)
{
    using (var db = new RepositoryBase().BeginTrans())
    {
        string strSql = string.Format(@"select a.*,b.F_id topicid from  yht_cityinfo as a left join yht_topic as b on a.CityName=b.CityName 
and b.TopicLibaryId =@TopicLibaryId", TopicLibaryId);
        DbParameter[] parameters = {
            new MySqlParameter("@TopicLibaryId",TopicLibaryId),
        };
   或者
      SqlParameter[] parameters = {
            new MySqlParameter("@TopicLibaryId",TopicLibaryId),
        };

        return db.FindList<TopicCitys>(strSql,parameters).ToList();
    }
}
```

### Oracle

::: tip

注意：这里oracle的参数前面不是@而是:

:::

```sql
var conn = new ClickHouseConnection(connectionString);

var selectSql = "select count(1) from USER where ID =:id";
var parameter = new DynamicParameters();
parameter.Add("@id", 1);
var num = await conn.QueryFirstOrDefaultAsync<int>(selectSql, parameter);
Console.WriteLine(num);
```

### clickhourse

```c#
var connectionString = "Host=localhost;Port=8123;Database=sample;User=default;Password=Clickhouse123$;Compress=True;CheckCompressedHash=False;Compressor=lz4;";
var conn = new ClickHouseConnection(connectionString);

var selectSql = "select count(1) from user where id =@id";
var parameter = new DynamicParameters();
parameter.Add("@id", 1);
var num = await conn.QueryFirstOrDefaultAsync<int>(selectSql, parameter);
Console.WriteLine(num);
```

## Like

模糊查询

:::code-tabs 

@tab MySql

```csharp
public List<CustomerInfoResponse> GetCustomerDeployList(string value)
{
    using (var db = new RepositoryBase().BeginTrans())
    {
        var sb = "SELECT * from el_cardrecord c WHERE c.a.RealName like @RealName";
        MySqlParameter[] parameters = {
           new MySqlParameter("@F_Id",value),
           new MySqlParameter("@RealName","%"+value+"%"),
           new MySqlParameter("@CellPhoneNumber","%"+value+"%"),
           new MySqlParameter("@IdCardNumber","%"+value+"%")
        };

        return db.FindList<CustomerInfoResponse>(sb, parameters);
    }
} 
```

@tab Pgsql

```csharp
// 在 Postgres 中，ILIKE 运算符支持大小写不敏感的模糊匹配，将运算符从 LIKE 更改为 ILIKE。查询结果将是大小写不敏感的模糊匹配。
var sql = "SELECT * FROM my_table WHERE name LIKE @Search";
var result = await connection.QueryAsync(sql, new { Search = "%"+value+"%" });

var sql = "SELECT * FROM my_table WHERE name ILIKE @Search";
var result = await connection.QueryAsync(sql, new { Search = "%"+value+"%" });
```
:::

## In/Not in

:::code-tabs

@tab sqlserver

```c#
var parameters = new DynamicParameters();

// in参数化
var selectSql = "select count(1) from Users where account IN @account";
selectSql = "select count(1) from Users where account IN (@account)";
parameters.Add("@account", new List<string> { "admin11" });
var count = await connection.QueryFirstOrDefaultAsync<int>(selectSql, parameters);
count.Dump();


// not in 参数化
selectSql = "select count(1) from Users where account NOT IN(@account2)";
selectSql = "select count(1) from Users where account NOT IN @account2";
parameters.Add("@account2", new List<string> { "admin" });
count = await connection.QueryFirstOrDefaultAsync<int>(selectSql, parameters);
```

@tab mysql

```csharp
var ids = new List<int>() { 1, 2, 3 };

// in
var sql = "SELECT * FROM my_table WHERE id IN @Ids";
var result = await connection.QueryAsync(sql, new { Ids = ids });

// not in
var sql = "SELECT * FROM my_table WHERE id NOT IN @Ids";
var result = await connection.QueryAsync(sql, new { Ids = ids });
```

@tab pgsql

```c#
// in示例
var ids = new List<int>() { 1, 2, 3 };

var sql = "SELECT * FROM my_table v WHERE  v.visit_state_id =ANY(@notValidVisitCodes)";
var dapperParam = new DynamicParameters();
dapperParam.Add("@notValidVisitCodes", ids);// 这里ids使用list或者array都可以

// not in示例
List<int> ids = new List<int>() { 1, 2, 3 };

// 查询visit_state_id不包含某一个值的参数化查询方法
var sql = "SELECT * FROM my_table v WHERE  NOT (v.visit_state_id =ANY(@notValidVisitCodes))";
var dapperParam = new DynamicParameters();
dapperParam.Add("@notValidVisitCodes", ids);// 这里使用list或者array都可以

// 查询不在这个集合的账号
var sql = "select count(1) from  sample.\"user\" where account !=ANY(@Ids)";
var result = await connection.QueryAsync(sql, new { Ids = ids.ToArray() });
```

@tab oracle

```c#
var conn = new OracleConnection(connectionString);

// in 参数化
var selectSql = "select count(1) from SYS_CODE_DICT where ID in :id";
var parameter = new DynamicParameters();
parameter.Add("@id", new List<int> { 1, 2 });
var num = await conn.QueryFirstOrDefaultAsync<int>(selectSql, parameter);
Console.WriteLine(num);

// not in 参数化
selectSql = "select count(1) from SYS_CODE_DICT where ID not in :id2";
parameter.Add("@id2", new List<int> { 1, 2 });
var num2 = await conn.QueryFirstOrDefaultAsync<int>(selectSql, parameter);
Console.WriteLine(num2);
```

@tab clickhourse

```c#
var connectionString = "Host=localhost;Port=8123;Database=sample;User=default;Password=Clickhouse123$;Compress=True;CheckCompressedHash=False;Compressor=lz4;";
var conn = new ClickHouseConnection(connectionString);

// in+dapper参数化没有测试成功
// var selectSql = "select count(1) from user where id in @id";
// var parameter = new DynamicParameters();
// parameter.Add("@id", new List<int> { 1, 2 }, DbType.Object);
// var num = await conn.QueryFirstOrDefaultAsync<int>(selectSql, parameter);
// Console.WriteLine(num);

// 原生的in参数化
// var com = conn.CreateCommand();
// com.CommandText = selectSql;
// var p = new ClickHouseParameter
// {
//     DbType = DbType.Object,
//     ParameterName = "id",
//     Value = new List<int> { 1, 2 }
// };
// com.Parameters.Add(p);
//  conn.Open();
// var num =  com.ExecuteScalar();
// Console.WriteLine(num);
```

:::

## InterpolatedSql.Dapper

使用下面的nuget包可以实现内插值方式的参数化操作，文档地址：[InterpolatedSql.Dapper](https://www.nuget.org/packages/InterpolatedSql.Dapper)

```xml
<PackageReference Include="InterpolatedSql.Dapper" Version="2.3.0" />
```

简单操作示例

```c#
public override async Task InterpolatedSql_ParamQueryAsync()
{
    const string value = "' or '1'='1";
    await using var db = new OpenDbContext();
    await using var dbConnection = db.Database.GetDbConnection();

    // 直接拼接sql模式 无参数化
    var result1 =
        await dbConnection.QueryAsync<string>($"select account from \"sample\".user where account='{value}'");
    Console.WriteLine(result1.Count()); // 查询出来所有的数据

    // 参数化
    var sqlBuilder = dbConnection.SqlBuilder($"select account from \"sample\".user where account='{value}'");
    var result2 = await sqlBuilder.QueryAsync<string>(); // 查询出来指定条件的数据
    Console.WriteLine(result2.Count());
}
```

