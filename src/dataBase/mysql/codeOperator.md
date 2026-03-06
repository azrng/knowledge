---
title: 操作说明
lang: zh-CN
date: 2021-05-14
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - 无
filename: fanhuierjinzhi
slug: rsv1ii
docsId: '31802960'
---

## 连接数据库

### .Net连接

```
server=xxx;port=3306;userid=myuserid;password=pwd123;database=db125;charset=utf8;
Server=192.168.100.104;database=azrngblog;uid=root;pwd=123456;SslMode=None;
Server=localhost;Database=test;Port=3306;charset=utf8;uid=root;pwd=123456;sslmode=none;TreatTinyAsBoolean=true
```

默认情况下是启用连接池的，等用于下面

```
server=xxx;port=3306;userid=myuserid;password=pwd123;database=db125;charset=utf8;Pooling=true;
```

大多数情况下使用连接池是更好的，但是有些情况下如果一个实例上点数据库就有好几百个，超过连接数的限制，那么这种情况下应该不启用连接池。设置Pooling=false。

### JDBC连接

```
jdbc:mysql://localhost:3306
jdbc:mysql://localhost:3306?user=root
dbc:mysql://localhost:3306?user=root&password=123456
```

## 查询

### 分页返回记录条数

```c#
public PagingModel<List<AuthorManageResponse>> GetAuthorList(int PageNumber, int PageSize, string Value)
{
	PagingModel<List<AuthorManageResponse>> pagingModel = new PagingModel<List<AuthorManageResponse>>();
	using (var db = new RepositoryBase().BeginTrans())
	{
		string strSql = @"SELECT SQL_CALC_FOUND_ROWS * FROM dynews_channel a WHERE a.`Name` like @keyword and a.F_DeleteMark==0 and a.F_EnabledMark=1 ORDER BY a.F_CreatorTime desc LIMIT @PageIndex,@PageCount;
SELECT found_rows() AS rowcountt; ";
		MySqlParameter[] mySqlParameters = {
				 new MySqlParameter(){ ParameterName="@keyword ",Value="%"+Value+"%"},
				 new MySqlParameter(){ ParameterName="@PageIndex",Value=(PageNumber-1)*PageSize},
				 new MySqlParameter(){ ParameterName="@PageCount",Value=PageSize}
				};
		DataSet ds = DbHelper.Query(strSql, mySqlParameters);//这个是一个简单的根据sql语句查询方法
		DataTable dt1 = ds.Tables[0];
		DataTable dt2 = ds.Tables[1];

		var channelList = Json.ToObject<List<AuthorManageResponse>>(dt1.ToJson());
		for (int i = 0; i < channelList.Count; i++)
		{
			channelList[i].No = ((PageNumber - 1) * PageSize) + i + 1;

		}
		long total = dt2.Rows[0][0].ToInt();
		pagingModel.PageData = channelList;
		pagingModel.Total = dt2.Rows[0][0].ToInt();
		pagingModel.Pages = total.ToInt() / PageSize;
		return pagingModel;
	}
}

```

### 返回二进制

```c#
public void BinaryAndVarBinaryParameters()
        {
            AdoHelper ado = AdoHelper.CreateHelper(DbProvideType.MySql);

            ado.ExecuteNonQuery(conn, CommandType.Text, "CREATE PROCEDURE spTest3(OUT out1 BINARY(20), OUT out2 VARBINARY(20)) " +
          "BEGIN SET out1 = 'out1'; SET out2='out2'; END");


            IDataParameter[] param1 = new IDataParameter[]{
                ado.GetParameter("out1", DbType.Object, ParameterDirection.Output),
                ado.GetParameter("out2", DbType.Object, ParameterDirection.Output)
            };
            
            ado.ExecuteNonQuery(conn, CommandType.StoredProcedure, "spTest3", param1);
            Console.ReadLine();
        }

```

## 调用存储过程

```c#
public void InputOutputParameters()
{
    AdoHelper ado = AdoHelper.CreateHelper(DbProvideType.MySql);

    ado.ExecuteNonQuery(conn, CommandType.Text, "CREATE PROCEDURE spTest1( INOUT strVal VARCHAR(50), INOUT numVal INT, OUT outVal INT UNSIGNED ) " +
    "BEGIN  SET strVal = CONCAT(strVal,'ending'); SET numVal=numVal * 2;  SET outVal=99; END");

    IDataParameter[] param1 = new IDataParameter[]{
        ado.GetParameter("numVal", DbType.Int32, ParameterDirection.InputOutput),
        ado.GetParameter("strVal", DbType.String, ParameterDirection.InputOutput),
        ado.GetParameter("outVal", DbType.UInt64, ParameterDirection.Output)
    };
    //存储过程参数按照名称对应
    param1[1].Value = "beginning";
    param1[0].Value = 32;
    ado.ExecuteNonQuery(conn, CommandType.StoredProcedure, "spTest1", param1);
    Console.ReadLine();
}
```

