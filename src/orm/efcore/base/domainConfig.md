---
title: 实体类配置
lang: zh-CN
date: 2023-05-08
publish: true
author: azrng
isOriginal: true
category:
  - orm
tag:
  - 无
filename: shitileipeizhi
slug: lv588q
docsId: '30842890'
---

## 实体类状态
EFCoreState：通过状态跟踪，任何一个增删改查的操作都会记录一个状态在内存中，增删改的状态一旦SaveChanges就根据状态落实到数据库中的。

* Detached(0)：游离状态，与数据库并没有啥关系，上下文(DbContext)未跟踪该实体，比如new一个实体，状态就是Detached。
* Added(4)：已添加，实体正在被上下文(DbContext)跟踪，但是在数据库中尚不存在。
* Unchanged(1)：未改变状态，DbContext正在跟踪此实体，该实体存在于数据库中，属性值和数据库内容相比未发生变化。从数据库刚查询出来的对象就是该状态。
* Modified(3)：已修改状态，实体被上下文跟踪并且存在于数据库中，并且部署属性或者它的所有属性值已经被修改；
* Deleded(2)：实体正在被上下文跟踪，并且存在于数据库中，但是已经被标记为从数据库中删除。

> 注意：如果查询出来的时候设置为AsNoTracking(不追踪,如果只是查询就没必要追踪，如果下面是修改操作，那么就不建议加这个，因为那个情况必须手动去SaveChanges，否则就没有真正的实现修改)，那么就变成了Detached(游离)状态。

示例：
```csharp
var entity = await _dbContext.Set<UserInfoEntity>().FirstOrDefaultAsync();
Console.WriteLine(_dbContext.Entry(entity).State);//输出当前实体状态
```

## 数据类型映射


| c#类型/数据库类型 | SqlServer | MySQL | postgresql | Oracle |
| --- | --- | --- | --- | --- |
| string | varchar/nchar/nvarcahr/text/ntext | longtext/varchar | text/varchar/nvarchar |  |
| char |  | varchar(1) | character(1) |  |
| int | int | int | integer |  |
| uint | int | int unsigned | bigint |  |
| long | bigint | bigint | bigint |  |
| ulong | bitint | bigint unsigned | numeric(20,0) |  |
| byte | tinyint | tinyint unsigned | smallint |  |
| byte[] | binary/images |  |  | |
| bool | bit | tinyint(1) | boolean |  |
| short | smallint |  |  | |
| DateTime | datetime | datetime(6) | timestamp without time zone |  |
| TimeSpan |  | time(6) | interval |  |
| decimal | money | decimal(65,30)/decimal(18, 2) | numeric |  |
| float | real | float | real |  |
| double | float | double | double precision |  |
| guid | uniqueidentifier | char(36) | uuid | raw(16) |

* char：固定长度，存储ANSI字符（中文和符号不兼容），不足的补英文半角空格

* varchar：可变长度，存储ANSI字符（中文和符号不兼容），根据数据长度自动变化

* nchar：固定长度，存储Unicode字符(支持中英文以及符号)，不足的补英文半角空格

* nvcarchar：可变长度，存储Unicode字符(支持中英文以及符号)，根据数据长度自动变化。

### 主键的类型

常见的生成策略：自动增长、Guid、HI/Lo算法、雪花ID

自增主键(int 、long)
优点：简单
缺点：
数据库迁移以及分布式系统中比较麻烦；
并发性差；
默认不能为ID赋值，必须保持默认值为0，否则运行会报错；
当遇到批量插入主表以及详情表的时候，详情表需要关联到主表的ID，那么这个时候只能循环去添加到数据库后才能得到主表的ID(当然也可以通过code等关联)。
ID容易被模拟。

Guid
优点：适合分布式系统，数据库数据合并的时候简单。简单、高并发，全局唯一
缺点：磁盘占用空间大、不连续

> 使用guid作为主键的时候，不能将主键设置为聚集索引，因为聚集索引按照顺序保存主键的，因此使用guid作为主键性能差。
> 比如MySQL的InnoDb引擎中主键强制使用聚集索引的。有的数据库支持部分的连续guid，比如SQL server中的NewSequentialId(),但是也不能解决问题。
> 在SqlServer中，不要将guid主键设置为聚集索引。
> 在MySQL中，插入频繁的表不要用guid作为主键。

[MySQL顺序GUID](https://github.com/dotnet/efcore/blob/release/8.0/src/EFCore/ValueGeneration/SequentialGuidValueGenerator.cs)

## 实体类映射配置

:::tip

下面创建的实体类对应的属性，仅为演示使用，没有实际

:::

Fluent API的优先级高于Data Annotation的优先级。


### 实体类注解(Data Annotation)

这种方法只需要在实体类上面添加注解来映射数据库配置。
```csharp
[Table("userinfo")]//设置表名称
public class UserInfo
{
    [Key]//标识主键
    public string Id { get; set; }

    /// <summary>
    /// 字符长度限制
    /// </summary>
    [Required]//必填
    [StringLength(60, MinimumLength = 3)]//长度限制
    public string Name { get; set; }

    [RegularExpression(@"/^1[3,4,5,7,8,9]\d{9}$/")]//正则限制
    [StringLength(11)]
    public string Phone { get; set; }

    [Range(1, 100)]//范围限制
    [DataType(DataType.Currency)]
    public decimal Price { get; set; }

    [Display(Name = "CreateTime")]
    [DataType(DataType.Date)]//格式限制
    public DateTime CreateTime { get; set; }

    [DataType(DataType.EmailAddress)]
    [EmailAddress]
    public string Email { get; set; }
    
    [Comment("设置")]
    [Column("settings", TypeName = "json")]//映射到MySQL：json
    [Required]
    public string Settings { get; set; }
}
```
:::tip

注意：
1.如果是SqlServer并且主键是int类型，默认情况下迁移数据库是自增： Id = table.Column&lt;int&gt;(nullable: false, comment: "主键").Annotation("SqlServer:Identity", "1, 1")
2.如果是MySQL实现自增需要将类型改为int类型，并且在etc里面为主键增加标识ValueGeneratedOnAdd();

:::

### Fluent API

![1eb6abde6f95a512d9275d1287731a5](/dotnet/1eb6abde6f95a512d9275d1287731a5.jpg)

#### ETC形式-推荐

 实体类和上面一样不配置注解
```csharp
public class Test
{
    /// <summary>
    /// 自增
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// 账号
    /// </summary>
    public string Account { get; set; }

    /// <summary>
    /// 内容
    /// </summary>
    public string Content { get; set; }

    /// <summary>
    /// 余额
    /// </summary>
    public int Money { get; set; }

    /// <summary>
    /// 是否有效
    /// </summary>
    public bool IsValid { get; set; }

    /// <summary>
    /// 创建时间
    /// </summary>
    public DateTime CreateTime { get; set; }

    /// <summary>
    /// 时间2
    /// </summary>
    public TimeSpan CreateTime2 { get; set; }

    /// <summary>
    /// 时间3
    /// </summary>
    public TimeSpan CreateTime3 { get; private set; }

    /// <summary>
    /// 设置
    /// </summary>
    public string Settings { get; set; }
}
```
新建文件TestEtc继承自：IEntityTypeConfiguration&lt;T&gt;
```csharp
public class TestEtc : IEntityTypeConfiguration<Test>
{
    public void Configure(EntityTypeBuilder<Test> builder)
    {
        builder.Property(t => t.Id).IsRequired().ValueGeneratedOnAdd().HasComment("主键自增");
        builder.Property(x => x.Account).IsRequired().HasMaxLength(20).HasDefaultValue(string.Empty).HasComment("账号标识");
        builder.Property(x => x.Content).IsRequired().HasMaxLength(2000).HasDefaultValue(string.Empty).HasComment("内容");
        builder.Property(x => x.Money).IsRequired().HasDefaultValue(0).HasColumnType("decimal(18, 2)").HasComment("余额");
        builder.Property(x => x.IsValid).IsRequired().HasComment("是否有效");

        builder.Property(x => x.CreateTime).IsRequired().HasComment("时间1");
        builder.Property(x => x.CreateTime2).IsRequired().HasColumnType("bigint(20)").HasComment("时间2");
        builder.Property(x => x.CreateTime3).IsRequired().HasComment("时间3");

        builder.Property(x => x.Settings).IsRequired().HasColumnType("json").HasComment("设置");
        
        //查询过滤  如果在查询的时候想忽略使用：db.Users.IgnoreQueryFilters().ToList();
        builder.HasQueryFilter(t => !t.Deleted);
        
        builder.HasIndex(x => x.Id);//设置索引
    }
}
```

#### OnModelCreating配置

在实体类中不设置设置注解，例如
```csharp
public class UserInfo
{
    public string Name { get; set; }
}
```
通过在上下文类的OnModelCreating方法中进行配置（只是演示各种写法）
```csharp
public class OpenDbContextSample : DbContext
{
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        //设置表名称
        modelBuilder.Entity<UserInfo>().ToTable("user_info");
        //定义全局数据表架构
        modelBuilder.HasDefaultSchema("user");

        //联合主键 不建议使用联合主键
        modelBuilder.Entity<UserInfo>().HasKey(c => new { c.Id, c.Account });

        //查询过滤器
        modelBuilder.Entity<Person>().HasQueryFilter(p => !p.IsDeleted);

        //排除属性映射
        modelBuilder.Entity<User>().Ignore(x => x.Credit);

        //种子数据
        modelBuilder.Entity<UserInfo>().HasData(new UserInfo { Id = "111", Account = "azrng" });

        //配置数据类型
        modelBuilder.Entity<User>().Property(x => x.Credit).HasColumnType("decimal(18,2)");

        //计算列
        modelBuilder.Entity<UserInfo>().Property(p => p.Name).HasComputedColumnSql("[LastName] + ', ' + [FirstName]");

        //一对一主
        modelBuilder.Entity<SysUserInfo>().HasOne(u => u.SysUserInfoDetail).WithOne().HasForeignKey<SysUserInfoDetail>(a => a.SysUserInfoDetailId);
        //一对多
        modelBuilder.Entity<SysUserInfo>().HasOne(u => u.Company).WithMany(u => u.SysUsers).HasForeignKey(a => a.CompanyId);

        #region 多对多的关系

        modelBuilder.Entity<SysUserRoleMapping>().HasOne(p => p.SysUserInfo)
            .WithMany(u => u.SysUserRoleMapping).HasForeignKey(u => u.SysUserId);

        modelBuilder.Entity<SysUserRoleMapping>().HasOne(p => p.SysRole)
            .WithMany(r => r.SysUserRoleMapping).HasForeignKey(s => s.SysRoleId);

        modelBuilder.Entity<SysUserRoleMapping>().HasKey(p => new { p.SysUserId, p.SysRoleId }); //设置联合主键

        #endregion

        //设置整个表配置
        modelBuilder.Entity<UserInfo>(b =>
        {
            b.ToTable("AppUsers");
            b.HasKey(t => t.Id);//设置主键
            b.Property(t => t.Id).HasComment("用户ID");
            b.Property(t => t.Account).HasMaxLength(20).IsRequired().HasDefaultValue(string.Empty).HasComment("账号");
        });

        modelBuilder.Entity<Test>(t =>
        {
            t.Property(t => t.Id).IsRequired().ValueGeneratedOnAdd().HasComment("主键自增");
            t.Property(x => x.Account).IsRequired().HasMaxLength(20).HasDefaultValue(string.Empty).HasComment("账号标识");
            t.Property(x => x.Content).IsRequired().HasMaxLength(2000).HasDefaultValue(string.Empty).HasComment("内容");
            t.Property(x => x.CreateTime).IsRequired().HasComment("时间");
            t.Property(x => x.CreateTime2).IsRequired().HasComment("时间2");
            t.Property(x => x.IsValid).IsRequired().HasComment("是否有效");
            t.Property(x => x.Settings).IsRequired().HasColumnType("json").HasComment("设置");
            //设置索引
            t.HasIndex(x => x.Id);
            //默认值
            t.Property(b => b.CreateTime).HasDefaultValueSql("getdate()");
            
            // 将数据库的一个数组 json字符串转为实体类中的IEnumerable<string>  ToJson是序列化扩展方法，ToObject是反序列化扩展方法
            t.Property(e => e.ModuleCodeCollect).HasColumnName("module_code_collect").HasColumnType("jsonb")
                    .HasConversion(v => v.ToJson(), v => v.ToObject<IEnumerable<string>>())
                	.HasDefaultValueSql("'[]'")
                	.IsRequired()
                    .ForNpgsqlHasComment("模块编码集合");
        });

        //索引
        modelBuilder.Entity<UserInfo>(o =>
        {
            //非聚集索引
            o.HasIndex(t => new { t.Account, t.Name });

            //账号唯一索引  
            o.HasIndex(t => t.Account).IsUnique().HasDatabaseName("user_account_index_isunique");
        });

        //初始化数据
        modelBuilder.Entity<SysLog>().HasData(new List<SysLog>() { });
    }
}
```

## 实体类配置细节说明

### IsUnicode

是否是Unicode编码，默认是true，除了可以存储英文等，还可以存储中文、符号等内容



使用 MariaDB/MySQL数据库，或者使用 Pomelo.EntityFrameworkCore.MySql 这个包时该方法用不用都无所谓了，默认的对 string 的配置就是 IsUnicode(true)。

使用 MSSQL Server 时，我认为，当我们确定一个 string 类型的属性是 **ASCII 安全（ASCII SAFE）**的时候，即这个属性的值只会包含数字、英文字母和英文符号时，可以为它配置 IsUnicode(false)，这样它在数据库中就是 varchar 类型。但如果你不确定，最好还是保持默认。如果你不放心，或者想让团队的其他开发成员能够明明白白的知道每个 string 类型的属性到底是 varchar 还是 nvarchar，可以全部都显式配置。

总结：
对于 ASCII 安全的字符串来说，nvarchar 要比 varchar 多占 1 倍的存储空间，而且还要考虑性能的影响，假设你确实有一张表要存上千万甚至上亿数据，把 ASCII 安全的列设置 IsUnicode(false) 是有必要的，但是如果你不确定你的字符串是 ASCII 安全的，最好使用默认的配置，或者显式配置 IsUnicode() 或 IsUnicode(true)

文档：https://blog.kitlau.dev/posts/when-and-why-to-use-isunicode-in-ef-core/

## 实体类转换器

实体类类型和数据库类型不一致的情况，如何做实体类型转换

### AutoMapper

暂无内容


### 内置转换器
网址：[https://docs.microsoft.com/zh-cn/ef/core/modeling/value-conversions?tabs=data-annotations](https://docs.microsoft.com/zh-cn/ef/core/modeling/value-conversions?tabs=data-annotations)

比如实体类中配置的是枚举，数据库配置的是枚举的名称(例如：Man)，那么就需要内置转换器
```csharp
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    modelBuilder
        .Entity<Rider>()
        .Property(e => e.Mount)
        .HasConversion(
            v => v.ToString(),
            v => (EquineBeast)Enum.Parse(typeof(EquineBeast), v));
}
```

时间转换
```csharp
public class EntityTypeConfiguration<T> : IEntityTypeConfiguration<T> where T : DataEntity
{
    public virtual void Configure(EntityTypeBuilder<T> builder)
    {
        Type genericType = typeof(T);

        var convertDateTime = new ValueConverter<DateTime, DateTime>(v => v.ToUniversalTime(), v => v);
        builder.Property(t => t.CreateTime).IsRequired().HasConversion(convertDateTime).HasComment("创建时间");
    }
}
```


## 实操

### OwnsOne(从属实体类型)

配置一个关系，其中目标实体是当前实体的一部分



使用场景：值对象依附于实体对象存在，所以可以使用该方法来表达值对象的效果



具体操作如下，创建实体

```c#
/// <summary>
/// 包含值对象的用户表
/// </summary>
public class ContainsValueObjectUser : DataEntity
{
    private ContainsValueObjectUser()
    {
    }

    public ContainsValueObjectUser(string userName, ValueObjectArea area)
    {
        UserName = userName;
        Area = area;
    }

    /// <summary>
    /// 用户名
    /// </summary>
    public string UserName { get; init; }

    /// <summary>
    /// 用户地址
    /// </summary>
    public ValueObjectArea Area { get; set; }
}

/// <summary>
/// 地区值对象
/// </summary>
public class ValueObjectArea
{
    private ValueObjectArea()
    {
    }

    public ValueObjectArea(string province, string city)
    {
        Province = province;
        City = city;
    }

    /// <summary>
    /// 省份
    /// </summary>
    public string Province { get; init; }

    /// <summary>
    /// 市
    /// </summary>
    public string City { get; init; }
}
```

其中实体ContainsValueObjectUser里面包含了一个值对象Area，然后我们设置模型配置

```c#
public class ContainsValueObjectUserEtc : EntityTypeConfiguration<ContainsValueObjectUser>
{
    public override void Configure(EntityTypeBuilder<ContainsValueObjectUser> builder)
    {
        builder.Property(x => x.UserName).IsRequired().HasMaxLength(50).HasComment("姓名");

        builder.OwnsOne(x => x.Area, ar =>
        {
            ar.Property(e => e.Province).HasMaxLength(50).HasConversion<string>().HasComment("省");
            ar.Property(e => e.City).HasMaxLength(50).HasConversion<string>().HasComment("市");
        });

        base.Configure(builder);
    }
}
```

这个时候我们通过迁移的方式去生成数据库，如下图

![image-20230819181757549](/common/image-20230819181757549.png)

我们可以看到containsvalueobjectuser表自动将值对象的内容生成了列，并且以实体内的area开头，下面我们开始操作该实体



添加数据

```c#
var valueObject = new ValueObjectArea("河南", "焦作");
var user = new ContainsValueObjectUser("测试用户", valueObject);
await _openDbContext.AddAsync(user);
await _openDbContext.SaveChangesAsync();
```



查询数据

```c#
// 查询数据  该方案行不通
//var user = await _openDbContext.Set<ContainsValueObjectUser>()
//    .Where(t => t.Area == new ValueObjectArea("河南", "焦作"))
//    .FirstOrDefaultAsync();

// 需要这么进行查询 值对象的属性比较多的时候就比较麻烦了
var user = await _openDbContext.Set<ContainsValueObjectUser>()
    .Where(t => t.Area.Province == "河南" && t.Area.City == "焦作")
    .FirstOrDefaultAsync();
/*
    生成SQL
SELECT c.id, c.create_time, c.modify_time, c.user_name, c.area_city, c.area_province
FROM sample.containsvalueobjectuser AS c
WHERE (c.area_province = '河南') AND (c.area_city = '焦作')
LIMIT 1
    */

// 或者可以通过自己编写表达式树来进行值对象的比较，结果生成的sql和上面一致
var user1 = await _openDbContext.Set<ContainsValueObjectUser>()
    .Where(ExpressionHelper.MarkEqual((ContainsValueObjectUser area) => area.Area, new ValueObjectArea("河南", "焦作")))
    .FirstOrDefaultAsync();
```



然后展示一下表达式树的写法(该表达式树写法来自杨中科老师书籍)

```c#
/// <summary>
/// 表达式树帮助类
/// </summary>
public class ExpressionHelper
{
    /// <summary>
    /// 值对象比较
    /// </summary>
    /// <typeparam name="TItem"></typeparam>
    /// <typeparam name="TProp"></typeparam>
    /// <param name="propAccessor">待比较的表达式</param>
    /// <param name="other">待比较的值对象</param>
    /// <returns></returns>
    public static Expression<Func<TItem, bool>> MarkEqual<TItem, TProp>(Expression<Func<TItem, TProp>> propAccessor, TProp? other)
        where TItem : class
        where TProp : class
    {
        var e1 = propAccessor.Parameters.Single();
        BinaryExpression? conditionalExpr = null;
        foreach (var prop in typeof(TProp).GetProperties())
        {
            BinaryExpression equalExpr;
            object? otherValue = null;
            if (other != null)
                otherValue = prop.GetValue(other);

            var propType = prop.PropertyType;
            var leftExpr = Expression.MakeMemberAccess(propAccessor.Body, prop);
            Expression rightExpr = Expression.Constant(otherValue, propType);
            if (propType.IsPrimitive)
            {
                equalExpr = Expression.Equal(leftExpr, rightExpr);
            }
            else
            {
                equalExpr = Expression.MakeBinary(ExpressionType.Equal, leftExpr, rightExpr, false, prop.PropertyType.GetMethod("op_Equality"));
            }

            if (conditionalExpr is null)
                conditionalExpr = equalExpr;
            else
                conditionalExpr = Expression.AndAlso(conditionalExpr, equalExpr);
        }
        return Expression.Lambda<Func<TItem, bool>>(conditionalExpr, e1);
    }
}
```

### QueryFilter

在上面的示例中，我们可以通过HasQueryFilter方法来实现对一个表添加查询过滤条件，通过该配置可以实现，项目中其他查询该表的地方自动实现查询过滤的效果

```c#
//查询过滤  如果在查询的时候想忽略使用：db.Users.IgnoreQueryFilters().ToList();
builder.HasQueryFilter(t => !t.Deleted);
```



我们还可以通过下面方法来配置整个项目数据库表的通用查询过滤效果，比如全部表过滤掉已删除的，首先我们需要创建一个接口(这只是其中一个实现方案)

```c#
public interface ISoftDelete
{
    bool IsDeleted { get; }
    void SoftDelete();
}
```

然后就可以让我们的实现类提成该接口并实现该接口的方法，比如

```c#
public class User : ISoftDelete
{
	public Guid Id{ get; init; }
	
	public Int UserName{ get; init; }
	 
    public DateTime CreationTime { get; init; }

    public DateTime? DeletionTime { get; private set; }

    public bool IsDeleted { get; private set; }

    public User(string userName)
    {
        Id = Guid.NewGuid();
        UserName = userName;
        CreationTime = DateTime.Now;
    }

    public void SoftDelete()
    {
        this.IsDeleted = true;
        this.DeletionTime = DateTime.Now;
    }
}

```

然后就可以编写数据库上下文中OnModelCreating方法参数ModelBuilder的扩展方法

```c#
/// <summary>
/// set global 'IsDeleted=false' queryfilter for every entity
/// </summary>
/// <param name="modelBuilder"></param>
public static void EnableSoftDeletionGlobalFilter(this ModelBuilder modelBuilder)
{
    var entityTypesHasSoftDeletion = modelBuilder.Model.GetEntityTypes()
        .Where(e => e.ClrType.IsAssignableTo(typeof(ISoftDelete)));

    foreach (var entityType in entityTypesHasSoftDeletion)
    {
        var isDeletedProperty = entityType.FindProperty(nameof(ISoftDelete.IsDeleted));
        var parameter = Expression.Parameter(entityType.ClrType, "p");
        var filter = Expression.Lambda(Expression.Not(Expression.Property(parameter, isDeletedProperty.PropertyInfo)), parameter);
        entityType.SetQueryFilter(filter);
    }
}
```

使用示例如下

```c#
public class IdDbContext : DbContext
{
    public IdDbContext(DbContextOptions<IdDbContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        // 使用扩展方法
        modelBuilder.EnableSoftDeletionGlobalFilter();
    }
}
```




## 资料
模型：[https://docs.microsoft.com/zh-cn/ef/core/modeling/](https://docs.microsoft.com/zh-cn/ef/core/modeling/)

 

