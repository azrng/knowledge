---
title: 时间(历史)表
lang: zh-CN
date: 2023-07-19
publish: true
author: azrng
isOriginal: true
category:
  - orm
tag:
  - 无
---

## 概述
> 该方案仅支持SqlServer

SQL时态表很有用，因为它捕获 SQL 表中所有与数据相关的更改。其工作原理是创建一个新表（默认约定是表名后缀为History），其结构与原始表相同。在新创建的表中还将创建另外两列PeriodStart和PeriodEnd（这些是默认名称）。当原始表中的记录被更新时，旧版本将被插入到历史表中。当删除一条记录时，旧版本也会插入到历史表中。

通过这种方式跟踪更改，您可以捕获特定表的整个历史记录。这对于保留更改的审核日志很有用。

## 操作
要将实体标记为时态表，请IsTemporal在配置模型时使用。当您生成新的数据库模式时，您会注意到历史表包含在新脚本中。
```csharp
internal class CustomerEntityConfiguration : IEntityTypeConfiguration<Customer>
{
    public void Configure(EntityTypeBuilder<Customer> builder)
    {
        builder.ToTable("Customers", o => o.IsTemporal());
    }
}
```
创建表后，您可以使用各种内置方法查询和检索表的历史数据。
```csharp
var customerHistory = await dbContext.Set<Customer>()
    .TemporalAll()
    .ToListAsync();
```
在上面的示例中，检索了所有历史数据，但也可以检索特定时间范围内的历史数据。我发现这对于查询基于年份的数据很有用。
```csharp
var customerHistory = await dbContext.Set<Customer>()
    .TemporalFromTo(startOfYear, endOfYear)
    .ToListAsync();
```
> 请记住，自动包含的所有实体也包含在时间查询中，这通常会引发异常。
> 为了避免这种情况，您可以使用IgnoreAutoIncludes和IgnoreQueryFilters方法来禁用此功能。


## 参考资料
临时表：[https://learn.microsoft.com/zh-cn/sql/relational-databases/tables/temporal-tables?view=sql-server-ver16](https://learn.microsoft.com/zh-cn/sql/relational-databases/tables/temporal-tables?view=sql-server-ver16)
时态历史记录表：[https://timdeschryver.dev/blog/entity-framework-features-i-wish-i-knew-earlier#temporal-history-table](https://timdeschryver.dev/blog/entity-framework-features-i-wish-i-knew-earlier#temporal-history-table)
