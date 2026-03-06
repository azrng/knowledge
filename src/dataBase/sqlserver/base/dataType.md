---
title: 数据类型
lang: zh-CN
date: 2021-05-14
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - dataType
---

## 数据类型介绍

| **SQL Server数据类型** | **占用字节数** | **表示范围** | **对应的CLR类型** | **对应数据库类型选择** | **适用场景** |
| --- | --- | --- | --- | --- | --- |
| char | char(n) |   | [System.String](http://msdn.microsoft.com/en-us/library/system.string.aspx) | char(2) | 使用char(2)来表示类型或状态(建议用tinyint代替) |
| varchar | varchar(n) | 1~8000 | [System.String](http://msdn.microsoft.com/en-us/library/system.string.aspx) | varchar(20) | 只包含英文字符的字符串 |
| nvarchar | nvarchar(n) | 1~4000 | [System.String](http://msdn.microsoft.com/en-us/library/system.string.aspx) | nvarchar(20) | 包含中文字符的字符串 |
| int | 4个字节 | -2,147,483,648 到 2,147,483,647 | [System.Int32](http://msdn.microsoft.com/en-us/library/system.int32.aspx) | int | 表示整型，比如自增ID和表示數量 |
| bigint | 8个字节 | -9,223,372,036,854,775,808 到 9,223,372,036,854,775,807 | [System.Int64](http://msdn.microsoft.com/en-us/library/system.int64.aspx)(Long) | bigint | 表示长整型，比如自增ID(数量比较大的情况下) |
| decimal | 5~17字节 |   | [System.Decimal](http://msdn.microsoft.com/en-us/library/system.decimal.aspx) | decimal(18,2) | 金额和價格(和錢相關的) |
| tinyint | 1字节 | 0~255 | [System.Byte](http://msdn.microsoft.com/en-us/library/system.byte.aspx) | tinyint | 类型和状态，比char(2)扩展性好 |
| bit |   | 0，1或NULL | [System.Boolean](http://msdn.microsoft.com/en-us/library/system.boolean.aspx) | bit | 一般用来表示是和否两种情形，比如IsStop |
| datetime | 8字节 | 1753 年 1 月 1 日到 9999 年 12 月 31 日 | [System.DateTime](http://msdn.microsoft.com/en-us/library/system.datetime.aspx) | datetime | 表示日期和时间 |
| time |   |   | [System.TimeSpan](http://msdn.microsoft.com/en-us/library/system.timespan.aspx) | time(7) | 表示时间间隔，比如计时和耗時 |
| varbinary |   |   | [System.Byte](http://msdn.microsoft.com/en-us/library/system.byte.aspx) | varbinary(max) | 表示二进制数据 |

## 对比

### Varchar和nvarchar的区别

varchar(n)：长度为 n 个字节的可变长度且非 Unicode 的字符数据。n 必须是一个介于 1 和 8,000 之间的数值。存储大小为输入数据的字节的实际长度，而不是 n 个字节。
nvarchar(n)：包含 n 个字符的可变长度 Unicode 字符数据。n 的值必须介于 1 与 4,000 之间。字节的存储大小是所输入字符个数的两倍。
两字段分别有字段值：我和coffee，那么varchar字段占2×2+6=10个字节的存储空间，而nvarchar字段占8×2=16个字节的存储空间。如字段值只是英文可选择varchar，而字段值存在较多的双字节（中文、韩文等）字符时用nvarchar
总结：varchar(4) 可以输入4个字线，也可以输入两个汉字；nvarchar(4) 可以输四个汉字，也可以输4个字母，但最多四个
