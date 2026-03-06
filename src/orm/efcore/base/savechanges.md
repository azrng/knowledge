---
title: SaveChanges
lang: zh-CN
date: 2022-03-31
publish: true
author: azrng
isOriginal: false
category:
  - orm
tag:
  - 无
filename: savechangeskuozhan
slug: fpdoto
docsId: '66563893'
---

## 前言

本文来简单了解一下EFCore中的SaveChanges方法。

## 概述

从字面意思看是保存状态，也就是最终将数据保存到数据库的时候，它直接关系到数据持久性和一致性(当存在多个实体的时候会自动开启事务)。官网对其描述为保留数据库的所有更新，并在对象上下文中重置更改跟踪。



SaveChanges有以下关键点

* 数据提交和事务性操作：SaveChanges是将对数据上下文所做的更改保存到数据库的方法。它其实是一个事务性操作，数据要么所有更改都成功提交到数据库，要么它们都会回滚。这样保证了数据的一致性，如果在保存期间发生错误，数据库不会处于部分更改的状态。

* 更改跟踪：在EF中，对实体对象的更改首先保存在内存中的一个缓冲区中，也就是所谓的更改跟踪。当我调用SaveChanges时，EF会检查这个缓冲区，将更改保存到数据库中的相应实体。

* 异常处理：SaveChanges方法可能会引发各种异常，如数据库约束违规、连接问题等。因此，在实际应用中，需要编写相应的异常处理代码，以确保系统能够发现这些潜在问题，并记录错误日志，可以给解决错误提供帮助。

* 性能优化：EF有时会将多个更改批量提交到数据库，以提高性能。不过，根据应用程序的需求，我们可以调整EF的跟踪状态，以满足特定的性能要求。

* 返回值：SaveChanges通常返回一个整数，表示成功保存到数据库的实体数量。这代表数据是否插入成功。

## 执行步骤

![图片](/common/7bbb14d0523a425ca2f3b1aa39380043.png)

1、首先是更改跟踪（Change Tracking） 当你在应用程序中对实体对象进行更改（新增、更新、删除）时，Entity Framework会使用一种称为更改跟踪的机制来跟踪这些更改。每个实体对象都有一个状态，表示它在内存中的状态，例如Added（新增）、Modified（修改）、Deleted（删除）等。

2、构建SQL语句：在调用SaveChanges方法之前，Entity Framework会分析内存中的更改跟踪信息，确定哪些实体需要插入、更新或删除。然后，它会生成相应的SQL语句来执行这些操作。没有问题后这些SQL语句会被发送到数据库以执行。

3、数据库连接和事务：Entity Framework会打开与数据库的连接，并在一个事务中执行生成的SQL语句。这一步非常关键，因为它确保了所有更改要么全部成功保存到数据库，要么全部回滚。如果有任何一个SQL语句失败，事务会回滚，以确保数据的一致性。

4、执行SQL语句：数据库管理系统会执行生成的SQL语句，将更改应用到数据库中的相应表。这包括插入新记录、更新现有记录和删除记录等操作。

5、处理异常：如果在执行SQL语句时发生异常（如唯一性约束冲突、数据完整性违规等），Entity Framework会捕获这些异常并将它们转化为.NET异常。开发人员可以选择在代码中捕获并处理这些异常，以便采取适当的措施，例如回滚事务或记录错误。

6、最后是返回结果：SaveChanges方法通常会返回一个整数，表示成功保存到数据库的实体数量。这个值对于了解操作的成功与否以及影响的行数非常有用。

## 操作

### 全局赋值
因为更新和添加的时候会走Savechanges所以共有的字段，比如说创建人、修改人、创建时间、修改时间这些东西可以在保存的时候统一赋值处理
```csharp
public class OpenDbContextSample : DbContext
{
    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        //全局设置创建时间
        ChangeTracker.Entries().Where(e => e.State == EntityState.Added && (e.Entity is DataEntity)).ToList()
            .ForEach(e =>
            {
                ((DataEntity)e.Entity).CreateTime = System.DateTime.Now;
            });
        //设置更新时间
        ChangeTracker.Entries().Where(e => e.State == EntityState.Modified && (e.Entity is DataEntity)).ToList()
          .ForEach(e =>
          {
              ((DataEntity)e.Entity).UpdateTime = System.DateTime.Now;
          });
        return base.SaveChangesAsync(cancellationToken);
    }
}
```

## 参考资料

https://mp.weixin.qq.com/s/xR2ZMaXlXu7OqB4F_GK6NQ | 面试官：说说对EF中SaveChanges的理解？作者：莫小星
