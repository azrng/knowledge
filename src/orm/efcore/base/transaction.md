---
title: 事务操作
lang: zh-CN
date: 2022-05-22
publish: true
author: azrng
isOriginal: true
category:
  - orm
tag:
  - 无
filename: shiwu
slug: du65o9
docsId: '30842458'
---

## SaveChanges事务
```csharp
//默认事务是SaveChanges，它可以确保要么成功保存，要么在发生错误不对数据库做任何操作。
using (EFDB01Context db = new EFDB01Context())
{
    db.T_RoleInfor.Add(new T_RoleInfor() { roleName = "管理员1", addTime = DateTime.Now });
    db.T_RoleInfor.Add(new T_RoleInfor() { roleName = "管理员2", addTime = DateTime.Now });
    db.SaveChanges();
}

//关闭默认事务：context.Database.AutoTransactionsEnabled = false;
```

## DbContextTransaction事务
BeginTransaction开启事务、Commit提交事务、Rollback回滚事务、Dispose销毁，如果用Using包裹的话，不再需要手动Rollback，走完Using会自动回滚。如果不用Using包裹事务，就需要在Catch中手动RollBack回滚，并且最好最后手动的Dispose一下
使用场景：同一个上下文多个savechanges的方法、savachanges和EF调用sql语句混用的场景
using包裹事务

```csharp
using (EFDB01Context db = new EFDB01Context())
{
    using (var transaction = db.Database.BeginTransaction())
    {
        try
        {
            db.T_RoleInfor.Add(new T_RoleInfor() { roleName = "管理员1", addTime = DateTime.Now });
            db.SaveChanges();

            db.T_RoleInfor.Add(new T_RoleInfor() { id = 111, roleName = "管理员2", addTime = DateTime.Now });  //报错
            db.SaveChanges();

            string sql1 = @"insert into T_RoleInfor (roleName,roleDescription,addTime) values (@roleName,@roleDescription,@addTime)";
            SqlParameter[] pars1 = {
                            new SqlParameter("@roleName","管理员3"),
                            new SqlParameter("@roleDescription","txt11"),
                            new SqlParameter("@addTime",DateTime.Now)
                         };
            db.Database.ExecuteSqlCommand(sql1, pars1);
            transaction.Commit();

            Console.WriteLine("成功了");
        }
        catch (Exception)
        {
            transaction.Rollback();
            Console.WriteLine("失败了");
        }
    }
}
```



Try…catch使用事务的方案

```csharp
using (EFDB01Context db = new EFDB01Context())
{
    var transaction = db.Database.BeginTransaction();
    try
    {
        var d1 = new T_RoleInfor() { roleName = "管理员1", addTime = DateTime.Now };
        db.T_RoleInfor.Add(d1);
        db.SaveChanges();

        db.T_RoleInfor.Add(new T_RoleInfor() { roleName = "管理员2" + d1.id, addTime = DateTime.Now });
        db.SaveChanges();

        string sql1 = @"insert into T_RoleInfor (roleName,roleDescription,addTime) values (@roleName,@roleDescription,@addTime)";
        SqlParameter[] pars1 ={
                                                new SqlParameter("@roleName","管理员3"),
                                                new SqlParameter("@roleDescription","txt11"),
                                                new SqlParameter("@addTime",DateTime.Now)
                                            };
        db.Database.ExecuteSqlCommand(sql1, pars1);
        transaction.Commit();
        Console.WriteLine("成功了");
    }
    catch (Exception)
    {
        transaction.Rollback();
        Console.WriteLine("失败了");
    }
    finally
    {
        transaction.Dispose();
    }
}
```

## TransactionScope
环境事务
```csharp
using (EFDB01Context1 db = new EFDB01Context1())
{
    using (var scope = new TransactionScope(/*TransactionScopeOption.Required, new TransactionOptions { IsolationLevel = IsolationLevel.ReadCommitted }*/))
    {
        try
        {
            var data1 = new T_RoleInfor() { roleName = "管理员1", addTime = DateTime.Now };
            db.T_RoleInfor.Add(data1);
            db.SaveChanges();

            db.T_RoleInfor.Add(new T_RoleInfor() { roleName = "管理员2" + data1.id, addTime = DateTime.Now });  //报错
            db.SaveChanges();

            string sql1 = @"insert into T_RoleInfor (roleName,roleDescription,addTime) values (@roleName,@roleDescription,@addTime)";
            SqlParameter[] pars1 ={
                                                new SqlParameter("@roleName","管理员3"),
                                                new SqlParameter("@roleDescription","txt11"),
                                                new SqlParameter("@addTime",DateTime.Now)
                                            };
            db.Database.ExecuteSqlCommand(sql1, pars1);
            scope.Complete();


            Console.WriteLine("成功了");
        }
        catch (Exception)
        {
            Console.WriteLine("失败了");
        }
    }
}
```
如果TransactionScope里面使用了异步方法跨线程处理，那么需要使用
```csharp
//指定是否启用跨线程延续的事务流  
using var score = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled);
{
    // xxxx
    
    // 提交事务
    score.Complete();
}
```

## 资料
参考文档：[https://www.cnblogs.com/yaopengfei/p/11387935.html](https://www.cnblogs.com/yaopengfei/p/11387935.html)

