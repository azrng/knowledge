---
title: 我希望早点知道的实体框架功能
lang: zh-CN
date: 2023-07-25
author: Tim Deschryver
isOriginal: true
category:
  - orm
tag:
  - EFCore
filename: entityFrameworkEarlier
docsId: 'faa43d69-4566-4e13-a043-3b4c5f993d78'
---
## 前言

作为开发者，我们可以让很多代码运行起来。但这是否意味着我们以"正确的方式"来做呢？有时候是正确的，但其他时候可能存在更好的方法。而当有更好的方法时，我们往往并不知道。这其中有很多原因。时间紧迫、心情不好、新功能、复制粘贴解决方案（或如今由AI生成的代码）、缺乏知识以及其他因素，都可能导致非理想的解决方案。

这篇博文是关于我之前不了解Entity Framework提供的所有功能，这是我希望早点知道的。我在阅读别人的文章或演讲时，或者朋友指引我，或者通过阅读文档时偶然发现了这些功能。甚至通过撰写这篇博文，我也发现了一些额外的方法。

我希望这篇博文能帮助你以推荐/官方的方式完成任务，而不是使用那些常常引入一些陷阱的变通方法。

## 内容

### 开始

为了遵循示例，我们需要一个起点来工作。 对于这篇博文，我使用以下简单模型。 我们有一个实体Customer，它有一个实体集合Address。

```c#
public class Customer
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public List<Address> Addresses { get; set; }
}
 
public class Address
{
    public Guid Id { get; set; }
    public string Street { get; set; }
}
```

### 自动包含

您可能已经知道，在检索数据时，可以使用该方法预先加载相关实体。 例如，假设我们有一个客户，我们希望在查询客户时急切加载地址。 若要实现此目的，请使用Include方法包含客户的地址。

```c#
var customersWithAddresses = await dbContext.Customers
    .Include(c => c.Address)
    .ToListAsync();
```

预先加载的好处是，可以最大程度地减少查询所需数据的数据库往返次数。 相反，所有数据都在单个查询中检索（或使用 时检索几个查询）。 在许多情况下，单个查询比多个查询快，并且还减少了数据库服务器上的负载。`AsSplitQuery()`

但是，当您需要在大多数查询中包含相同的实体关系时，这可能会变得重复。 当您忘记包含进一步使用的相关实体时，它还可能导致错误。

AutoInclude是一项简化相关实体的预先加载的功能。 它通过在检索数据时自动包含相关实体来自动执行此过程。 这意味着您不必再在查询中使用该Include方法。

当我知道我总是需要访问相关实体时，我发现这很有用。 这样，我就不必担心实体的状态，无论是否检索到相关实体。

要启用AutoInclude功能，请在配置实体关系时导航到相关实体，并使用EntityTypeBuilder调用AutoInclude方法。示例可以按照以下配置进行重构。

```c#
internal class CustomerEntityConfiguration : IEntityTypeConfiguration<Customer>
{
    public void Configure(EntityTypeBuilder<Customer> builder)
    {
        builder.Navigation(e => e.Addresses)
            .AutoInclude();
    }
}
```

现在，当您检索数据时，将自动包含相关地址。

```c#
var customersWithAddresses = await dbContext.Customers
    .ToListAsync();
```

对于那些只需要查询特定实体的情况，您可以使用IgnoreAutoInclude方法来避免自动包含配置的相关实体。当性能至关重要且您不需要相关联的实体时，这非常有用。

```c#
var customers = await dbContext.Set<Customer>()
    .IgnoreAutoIncludes()
    .ToListAsync();
```

文档：https://learn.microsoft.com/zh-cn/ef/core/querying/related-data/eager#model-configuration-for-auto-including-navigations

### 单个或者拆分查询

Including（或AutoIncluding）相关实体可能导致性能问题，尤其是当相关实体包含大量关联数据时。因为生成的SQL查询包含许多连接操作，这可能导致检索到大量重复数据。这被称为笛卡尔爆炸。

举个例子，假设一个客户有10个地址。当您查询这个客户时，生成的SQL查询将包含一个与地址的连接操作。结果是客户会被检索10次，每个地址检索一次。

解决这个问题的方法是使用AsSplitQuery将查询分成多个查询。这样，客户只会被检索一次，而地址会在单独的查询中检索。

```c#
var customersWithAddresses = await dbContext.Set<Customer>()
    .AsSplitQuery()
    .ToListAsync();
```

Entity Framework还通过在检测到单个查询中加载多个集合时记录警告来帮助你。

单个查询是默认行为，但您也可以使用 UseQuerySplittingBehavior方法在DbContextOptionsBuilder上全局启用此行为。

```c#
optionsBuilder.UseSqlServer(connectionString, o => o.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery));
```

启用拆分查询后，可以使用AsSingleQuery强制单个查询。

```c#
var customersWithAddresses = await dbContext.Set<Customer>()
    .AsSingleQuery()
    .ToListAsync();
```

文档：https://learn.microsoft.com/en-us/ef/core/querying/single-split-queries

### 查询过滤器

这个提示与AutoInclude类似，因为HasQueryFilter也允许您在一个集中的位置配置实体。顾名思义，HasQueryFilter用于在检索数据时过滤实体。

HasQueryFilter定义了一个适用于该实体所有查询的全局过滤器。我发现这在以下情况下非常有用：过滤已被软删除的实体，或者过滤您不感兴趣但不能删除的实体。而不是将以下逻辑复制到所有查询中以删除已删除的客户。

```c#
var customers = await dbContext.Set<Customer>()
    .Where(q => q.DeletedOn == null)
    .ToListAsync();
```

您可以通过使用HasQueryFilter进行重构来实现这一目的。

```c#
internal class CustomerEntityConfiguration : IEntityTypeConfiguration<Customer>
{
    public void Configure(EntityTypeBuilder<Customer> builder)
    {
        builder.HasQueryFilter(q => q.DeletedOn == null);
    }
}
```

当存在全局过滤器时，您还可以使用IgnoreQueryFilters在那些临时查询中禁用它。

```c#
var customers = await dbContext.Set<Customer>()
    .IgnoreQueryFilters()
    .ToListAsync();
```

文档：https://learn.microsoft.com/zh-cn/ef/core/querying/filters

### 时态(历史)表

SQL的时间表是有用的，因为它可以捕获SQL表中与数据相关的所有更改。其原理是创建一个新表（默认约定是在表名后加上"History"后缀），该表与原始表具有相同的结构。还会在新创建的表中添加两列"PeriodStart"和"PeriodEnd"（这些是默认名称）。当原始表中的记录被更新时，旧版本将被插入到历史表中。当记录被删除时，旧版本也会被插入到历史表中。

通过这种方式跟踪变更可以捕获特定表的完整历史记录。这对于保留变更的审计日志非常有用。

当然，如果无法查询这些数据，则几乎没有价值。这就是时间表的作用，它允许您查询历史表以获取完整的（或更全面的）画面。

要将实体标记为时间表，在配置模型时使用IsTemporal。在生成新数据库架构时，您会注意到历史表已包含在新的脚本中。

```c#
internal class CustomerEntityConfiguration : IEntityTypeConfiguration<Customer>
{
    public void Configure(EntityTypeBuilder<Customer> builder)
    {
        builder.ToTable("Customers", o => o.IsTemporal());
    }
}
```

创建表后，可以使用各种内置方法查询和检索表的历史数据。

```c#
var customerHistory = await dbContext.Set<Customer>()
    .TemporalAll()
    .ToListAsync();
```

在上面的示例中，检索了所有历史数据，但也有可能检索特定时间范围内的历史数据。 我发现这对于查询基于年份的数据很有用。

```c#
var customerHistory = await dbContext.Set<Customer>()
    .TemporalFromTo(startOfYear, endOfYear)
    .ToListAsync();
```

>  请记住，所有自动包含的实体也包含在时态查询中，这通常会引发异常。
>
> 全局查询筛选器的计数相同。
>
> 若要避免这种情况，可以使用IgnoreAutoIncludes 和IgnoreQueryFilters方法来禁用此功能。

文档：https://learn.microsoft.com/zh-cn/ef/core/providers/sql-server/temporal-tables#querying-historical-data

### 阴影属性

我见过许多模型，它们臃肿，具有不应该包含的属性。 但是，我们可以使用阴影属性来保持模型干净，并且只包含与域相关的属性。

影子属性的一个用例是审计列，例如CreatedOn、CreatedBy、... 或者，历史记录表中的期间列。 这些列可用于跟踪记录的创建者或更新者，但它们不会向域添加任何价值。

另一个用例是保存对外键的引用的属性，同时还包含导航属性。 我觉得这很令人困惑，因为不清楚要使用哪个属性。 例如：

```c#
class Customer
{
    // foreign key
    public Guid AddressId { get; set; }
 
    // navigation property
    public Address Address { get; set; }
}
```

相反，我更喜欢以下模型。Entity Framework将自动创建所需的影子属性并添加所需的关系约束。在这个例子中，影子属性将是AddressId。

```c#
class Customer
{
    public Address Address { get; set; }
}
```

当我们查看数据库架构时，我们会看到创建了列AddressId，并且它被配置为Addresses表的外键。

如果我们看原始的例子，其中一个客户拥有多个地址（而不是单个地址），我们会发现在Addresses表中创建了CustomerId列，因为这是一对多的关系。

影子属性也可以用于查询数据，例如查询先前创建的历史表。要访问影子属性，请使用EF.Property方法。

```c#
var customers = await dbContext.Set<Customer>()
    .TemporalAll()
    .Where(c => EF.Property<DateTime>(c, "PeriodStart") >= DateTime.Today)
    .OrderBy(e => EF.Property<DateTime>(e, "PeriodEnd"))
    .ToListAsync();
```

有了这个知识，我们可以使用DeletedOn属性重构先前的代码片段，将其作为全局过滤器中的影子属性使用。

```c#
internal class CustomerEntityConfiguration : IEntityTypeConfiguration<Customer>
{
    public void Configure(EntityTypeBuilder<Customer> builder)
    {
        // builder.HasQueryFilter(q => q.DeletedOn == null);
 
        // This is needed to create the column in the database
        builder.Property<DateTime?>("DeletedOn");
        builder.HasQueryFilter(e => EF.Property<bool>(e, "DeletedOn") == null);
    }
}
```

若要设置和更新影子属性的值，请获取EntityEntry实体并使用该Property方法。

```c#
dbContext.Entry(customer).Property("DeletedOn").CurrentValue = DateTime.UtcNow;
dbContext.SaveChanges();
```

当你不需要考虑这些属性，而是希望它们自动设置时非常方便。可以通过重写DbContext的SaveChanges方法来实现这一点。

```c#
public class EfDemoDbContext : DbContext
{
    public override int SaveChanges()
    {
        ChangeTracker.DetectChanges();
        foreach (var entry in ChangeTracker.Entries())
        {
            if (entry.State == EntityState.Added)
            {
                entry.Property("CreatedOn").CurrentValue = DateTime.UtcNow;
            }
            if (entry.State == EntityState.Modified)
            {
                entry.Property("UpdatedOn").CurrentValue = DateTime.UtcNow;
            }
        }
        return base.SaveChanges();
    }
}
```

文档：https://learn.microsoft.com/zh-cn/ef/core/modeling/shadow-properties

### 数据库函数

在先前的博客文章《使用Entity Framework使用SQL函数》中，我解释了如何使用Entity Framework消费SQL函数。简而言之，您可以使用DbFunction属性将一个C#方法映射到一个SQL函数。

在下面的示例中，我们将SoundEx SQL函数映射到一个C#方法。

```c#
public class EfDemoDbContext : DbContext
{
    public EfDemoDbContext(DbContextOptions<MyDbContext> options)
        : base(options)
    {
    }
 
    [DbFunction(Name = "SoundEx", IsBuiltIn = true, IsNullable = false)]
    public static string SoundEx(string input)
    {
        throw new NotImplementedException();
    }
}
```

现在可以在查询中使用SoundEx方法。

```c#
var customersViaSoundEx = await dbContext.Set<Customer>()
    .Where(c => EfDemoDbContext.SoundEx(c.Name) == EfDemoDbContext.SoundEx("Jhon Do"))
    .ToListAsync();
```

### SqlQuery转未映射类型

[您现在可以使用 Entity Framework 8 从](https://timdeschryver.dev/blog/you-can-now-return-unmapped-types-from-raw-sql-select-statements-with-entity-framework-8)原始 SQL select 语句返回未映射的类型，我们已经看到可以从原始 SQL select 语句返回未映射的类型。这对于使用优化的查询或返回数据的子集或聚合非常有用。

文档：https://learn.microsoft.com/zh-cn/ef/core/what-is-new/ef-core-8.0/whatsnew#raw-sql-queries-for-unmapped-types

## 结论

总结一下这篇文章，我只能说要充分利用Entity Framework提供的功能。

本文中的示例表明，Entity Framework内置了强大的功能，可以增强应用程序的性能和可维护性。关键是要知道它们的存在。



作者：Tim Deschryver

原文地址：https://timdeschryver.dev/blog/entity-framework-features-i-wish-i-knew-earlier

## 文章授权

申请等了好几天，终于等来了大佬的授权，嘿嘿，截图如下

![image-20230725101349387](/common/image-20230725101349387.png)
