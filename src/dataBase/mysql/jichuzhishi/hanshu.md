---
title: 函数
lang: zh-CN
date: 2023-08-01
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - 无
filename: hanshu
slug: fkon8v
docsId: '26499862'
---
创建一个简单的函数
```sql
DELIMITER $$
DROP FUNCTION IF EXISTS genPerson$$
CREATE FUNCTION genPerson(name varchar(20)) RETURNS varchar(50)
BEGIN
  DECLARE str VARCHAR(50) DEFAULT '';
  SET @tableName=name;
  SET str=CONCAT('create table ', @tableName,'(id int, name varchar(20));');
  return str;
END $$
DELIMITER ;
```
调用函数
```csharp
public void FunctionNoParams()
        {
            AdoHelper ado = AdoHelper.CreateHelper(DbProvideType.MySql);

            ado.ExecuteNonQuery(conn, CommandType.Text, "CREATE FUNCTION fnTest() RETURNS CHAR(50)" +
          " LANGUAGE SQL DETERMINISTIC BEGIN  RETURN \"Test\"; END");

            object obj = ado.ExecuteScalar(conn, CommandType.Text, "SELECT fnTest()");
            Console.ReadLine();
        }



public void CallingStoredFunctionasProcedure()
        {
            AdoHelper ado = AdoHelper.CreateHelper(DbProvideType.MySql);

            ado.ExecuteNonQuery(conn, CommandType.Text, "CREATE FUNCTION fnTest1(valin int) RETURNS INT " +
          " LANGUAGE SQL DETERMINISTIC BEGIN return valin * 2; END");

            IDataParameter[] param1 = new IDataParameter[]{
                ado.GetParameter("?rt", DbType.Int32, ParameterDirection.ReturnValue),
                ado.GetParameter("valin", DbType.Int32, 16),
            };
            //Return 函数必须加？符号
            object obj = ado.ExecuteScalar(conn, CommandType.StoredProcedure, "fnTest1", param1);
            Console.ReadLine();
        }
```

