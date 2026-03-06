---
title: 异常拦截
lang: zh-CN
date: 2022-05-18
publish: true
author: azrng
isOriginal: true
category:
  - orm
tag:
  - 无
filename: quanjuyichanglanjie
slug: gb3n3t
docsId: '71202734'
---

## 目的
不想将那些数据报错的异常直接返回给前端，但是弄全局异常拦截封装处理的话，错误有不具体，所以？

## 操作

### sqlserver
检查 SQL Server 返回的错误号。
```csharp
catch (DbUpdateException ex)
{
    var sqlException = ex.InnerException as SqlException;

    if (sqlException != null && sqlException.Number == 2627)
    {
        //重复值
    }
}
```

### EntityFramework.Exceptions
安装nuget包
```csharp
EntityFrameworkCore.Exceptions.SqlServer
```
重新编写
```csharp

catch (UniqueConstraintException ex)
{
    //重复值
}
```
我们不再需要处理特定于数据库的异常字符串和错误号，代码更简洁，更易于理解。
此外，EntityFramework.Exceptions 还提供了其他异常，例如CannotInsertNullException、MaxLengthExceededException等。

## 资料
[https://mp.weixin.qq.com/s/FbLDwvZMm7p6Fbz3HvomBA](https://mp.weixin.qq.com/s/FbLDwvZMm7p6Fbz3HvomBA) | 如何优雅地处理 EF Core 异常
