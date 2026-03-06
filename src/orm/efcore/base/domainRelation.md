---
title: 实体间关系
lang: zh-CN
date: 2022-05-29
publish: true
author: azrng
isOriginal: true
category:
  - orm
tag:
  - 无
filename: shitijianguanji
slug: eczgi2
docsId: '78358378'
---

## 介绍
数据库表之间的关系：一对一、一对多、多对多。

## 操作
三部曲：实体类中配置关系属性；FluentAPI关系配置；使用关系操作。
一对一：HasOne(xxx).WithOne(xxx);
一对多：HasOne(xxx).WithMany(xxx);
多对多：HasMany(xxx).WithMany(xxx);

### 基础配置
配置基础类和约定配置
```sql
public class EntityTypeConfiguration<T> : IEntityTypeConfiguration<T> where T : DataEntity
{
    public virtual void Configure(EntityTypeBuilder<T> builder)
    {
        Type genericType = typeof(T);
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).IsRequired().HasMaxLength(36).HasComment("主键");
        builder.ToTable(genericType.Name.ToLower(), "user");

        var convertDateTime = new ValueConverter<DateTime, DateTime>(v => v.ToUniversalTime(), v => v);
        builder.Property(t => t.CreateTime).IsRequired().HasConversion(convertDateTime).HasComment("创建时间");
        builder.Property(t => t.ModifyTime).IsRequired().HasConversion(convertDateTime).HasComment("修改时间");
    }
}

public abstract class DataEntity
{
    public long Id { get; set; } = new Snowflake().NewId();//一个生成雪花id的公共类

    /// <summary>
    /// 创建时间
    /// </summary>
    public DateTime CreateTime { get; set; } = DateTime.Now;

    /// <summary>
    /// 创建时间
    /// </summary>
    public DateTime ModifyTime { get; set; } = DateTime.Now;
}
```
配置上下文
```sql
public class OpenDbContext : DbContext
{
    public DbSet<Group> Groups { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<Score> Scores { get; set; }
    public DbSet<Test> Tests { get; set; }
    public DbSet<Employee> Employees { get; set; }
    public DbSet<Role> Roles { get; set; }
    public DbSet<Address> Addresses { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        const string connection = "Host=localhost;Username=postgres;Password=123456;Database=test";

        optionsBuilder.UseNpgsql(connection);

        optionsBuilder.UseSnakeCaseNamingConvention();//设置蛇形命名
                                                      //显示敏感数据日志
        optionsBuilder.EnableSensitiveDataLogging(true);
        //输出标准日志
        optionsBuilder.UseLoggerFactory(MyLogFactory);

        //输出简单日志  如果不配置日志级别或者日志级别低一点可以看到整个ef执行的日志过程
        //optionsBuilder.LogTo(msg => Console.WriteLine(msg), LogLevel.Information);

        ////简单过滤
        //optionsBuilder.LogTo(msg =>
        //{
        //    if (!msg.Contains("CommandExecuting"))
        //        return;
        //    Console.WriteLine(msg);
        //});

        base.OnConfiguring(optionsBuilder);
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        //会自动读取UserInfoetc
        modelBuilder.ApplyConfigurationsFromAssembly(GetType().Assembly);
    }

    /// <summary>
    /// 输出SQL的日志配置
    /// </summary>
    public static readonly ILoggerFactory MyLogFactory = LoggerFactory.Create(build =>
    {
        //日志过滤
        build.AddFilter((category, level) => category == DbLoggerCategory.Database.Command.Name && level == LogLevel.Information);
        build.AddConsole();  // 用于控制台程序的输出
    });
}
```

### 一对一
就比如说一个员工对应一个地址。员工表和地址表是一对一的关联，地址表里面对应一个员工ID。
> 一般情况下我们不显式创建主外键关系，而是一种逻辑上的主外键关系。

```sql
/// <summary>
/// 员工表
/// </summary>
public class Employee : DataEntity
{
    /// <summary>
    /// 员工姓名
    /// </summary>
    public string Name { get; set; }

    /// <summary>
    /// 角色ID
    /// </summary>
    public long RoleId { get; set; }

    /// <summary>
    /// 地址信息 一个用户对应一个地址  一对一
    /// </summary>
    public Address Address { get; set; }
}
/// <summary>
/// 地址表（与用户表一对多关系，一个用户多应多个地址）
/// </summary>
public class Address : DataEntity
{
    ///<summary>
    ///省份
    /// </summary>
    public string Province { get; set; }

    /// <summary>
    /// 员工ID
    /// </summary>
    public long EmployeeId { get; set; }

    /// <summary>
    /// 导航属性 一个地址对应一个用户  一对一
    /// </summary>
    public Employee Employee { get; set; }
}
```
必须显式在其中一个实体类中声明一个外键属性。

配置模型约定
```sql
public class EmployeeEtc : EntityTypeConfiguration<Employee>
{
    public override void Configure(EntityTypeBuilder<Employee> builder)
    {
        base.Configure(builder);

        builder.Property(t => t.Name).IsRequired().IsUnicode().HasMaxLength(50).HasDefaultValue(string.Empty).HasComment("员工名称");
        builder.Property(t => t.RoleId).IsRequired().HasComment("角色ID");
    }
}
public class AddressEtc : EntityTypeConfiguration<Address>
{
    public override void Configure(EntityTypeBuilder<Address> builder)
    {
        base.Configure(builder);

        //builder.ToTable("group", "user");
        builder.Property(t => t.Province).IsRequired().IsUnicode().HasMaxLength(50).HasDefaultValue(string.Empty).HasComment("省份");
        builder.Property(t => t.EmployeeId).IsRequired().HasComment("员工ID");

        //一对一  一个用户对应一个地址信息
        builder.HasOne<Employee>(t => t.Employee).WithOne(t => t.Address).IsRequired();
    }
}
```
添加和查询操作
```sql
var employee = new Employee
{
    RoleId = 1,
    Name = "王五",
};

var address = new Address
{
    Province = "河南省",
    Employee = employee,
};
await db.Addresses.AddAsync(address);
await db.SaveChangesAsync();

var address = await db.Addresses.Include(t => t.Employee).FirstOrDefaultAsync();
Console.WriteLine($"员工信息 {address.Employee?.Name} 地址：{address.Province}");
```

### 一对多
一个角色对应多个员工，员工表和角色表是一对多的关系。
```sql
/// <summary>
/// 角色表
/// </summary>
public class Role : DataEntity
{
    /// <summary>
    /// 角色名称
    /// </summary>
    public string Name { get; set; }

    /// <summary>
    /// 导航属性 一个角色对应多个用户
    /// </summary>
    public ICollection<Employee> Employees { get; set; } = new List<Employee>();
}

/// <summary>
/// 员工表
/// </summary>
public class Employee : DataEntity
{
    /// <summary>
    /// 员工姓名
    /// </summary>
    public string Name { get; set; }

    /// <summary>
    /// 角色ID
    /// </summary>
    public long RoleId { get; set; }

    /// <summary>
    /// 角色  一个用户对应一个角色
    /// </summary>
    public Role Role { get; set; }
}
```
设置两个表的约定
```sql
public class RoleEtc : EntityTypeConfiguration<Role>
{
    public override void Configure(EntityTypeBuilder<Role> builder)
    {
        base.Configure(builder);

        builder.Property(t => t.Name).IsRequired().IsUnicode().HasMaxLength(50).HasDefaultValue(string.Empty).HasComment("员工名称");
    }
}
public class EmployeeEtc : EntityTypeConfiguration<Employee>
{
    public override void Configure(EntityTypeBuilder<Employee> builder)
    {
        base.Configure(builder);

        builder.Property(t => t.Name).IsRequired().IsUnicode().HasMaxLength(50).HasDefaultValue(string.Empty).HasComment("员工名称");
        builder.Property(t => t.RoleId).IsRequired().HasComment("角色ID");

        //双向导航属性：一个角色对用多个用户 一对多  指定外键列：.HasForeignKey(t=>t.RoleId) 
        builder.HasOne<Role>(t => t.Role).WithMany(t => t.Employees).IsRequired();

        //单向导航属性
        //builder.HasOne<Role>(t => t.Role).WithMany().IsRequired();
    }
}
```
> 双向导航属性：上面的列子就是双向导航属性，在两个类中都配置导航属性，对于主从结构的“一对多关系，一般是声明双向导航属性”
> 单向导航属性：只在多的端配置导航属性，使用场景：当一个表属于被很多表引用的场景，则用单向导航属性，否则可以自由考虑

添加和查询操作
```sql
//添加一对多
var role = new Role
{
    Name = "超级管理员"
};

var employee1 = new Employee();
employee1.Name = "张三";
role.Employees.Add(employee1);

var employee2 = new Employee();
employee2.Name = "李思";
role.Employees.Add(employee2);

db.Roles.Add(role);
await db.SaveChangesAsync();

//查询
//查询一对多:查询角色信息以及角色对应的员工信息  两个表left join
var role = await db.Roles
    .Include(t => t.Employees)//把关联的对象也查询出来
    .FirstOrDefaultAsync(x => x.Name == "超级管理员");

//查询员工对应的角色信息  两个表inner join
var employee = await db.Employees.Include(t => t.Role).FirstOrDefaultAsync();
```

关于配置一对多的问题，在多的一段配置页可以，在单的一端也可以配置，但是考虑到有单向导航属性的可能，我们一般用HasOne().WithMany()。
```sql
//反着配置：多个用户对应一个角色
builder.HasMany<Employee>(t => t.Employees).WithOne(t => t.Role).IsRequired();

//正着配置：一个角色对应多个员工
builder.HasOne<Role>(t => t.Role).WithMany(t => t.Employees).IsRequired();
```

### 多对多
> EFCore5.0开始，才正式支持多对多，多对多是需要中间表的。

角色和菜单是多对多关系，一个角色可以设置访问多个菜单，一个菜单可以设置被多个角色访问。
```sql
/// <summary>
/// 角色表
/// </summary>
public class Role : DataEntity
{
    /// <summary>
    /// 角色名称
    /// </summary>
    public string Name { get; set; }

    /// <summary>
    /// 菜单集合  多对多
    /// </summary>
    public List<Menu> Menus { get; set; } = new List<Menu>();
}
/// <summary>
/// 菜单表
/// </summary>
public class Menu : DataEntity
{
    /// <summary>
    /// 菜单名称
    /// </summary>
    public string Name { get; set; }

    public List<Role> Roles { get; set; }=new List<Role>();
}
```
实体约定
```sql
public class RoleEtc : EntityTypeConfiguration<Role>
{
    public override void Configure(EntityTypeBuilder<Role> builder)
    {
        base.Configure(builder);

        builder.Property(t => t.Name).IsRequired().IsUnicode().HasMaxLength(50).HasDefaultValue(string.Empty).HasComment("角色名称");
    }
}

public class MenuEtc : EntityTypeConfiguration<Menu>
{
    public override void Configure(EntityTypeBuilder<Menu> builder)
    {
        base.Configure(builder);

        builder.Property(t => t.Name).IsRequired().IsUnicode().HasMaxLength(50).HasDefaultValue(string.Empty).HasComment("菜单名称");

        //多对多 多个角色对应多个菜单  并且设置中间表
        builder.HasMany<Role>(t => t.Roles).WithMany(t => t.Menus).UsingEntity(o => o.ToTable("role_menu"));
    }
}
```
上面的配置会为我们生成一个中间表role_menu。用来关联role和menu的多对多关系。

添加操作
```sql
var role1 = new Role
{
    Name = "管理员1"
};
var role2 = new Role
{
    Name = "管理员2"
};
var role3 = new Role
{
    Name = "管理员3"
};

var menu1 = new Menu
{
    Name = "菜单1"
};
var menu2 = new Menu
{
    Name = "菜单2"
};
var menu3 = new Menu
{
    Name = "菜单3"
};

menu1.Roles.Add(role1);
menu1.Roles.Add(role2);

menu2.Roles.Add(role2);
menu2.Roles.Add(role3);

menu3.Roles.Add(role1);
menu3.Roles.Add(role2);

await db.Menus.AddAsync(menu1);
await db.Menus.AddAsync(menu2);
await db.Menus.AddAsync(menu3);
await db.SaveChangesAsync();
```
查询操作
```sql
var menuList = db.Menus.Include(t => t.Roles);
foreach (var item in menuList)
{
    Console.WriteLine($"菜单名称：{item.Name} 角色名称:{string.Join(",", item.Roles.Select(t => t.Name))}");
}
```

## 总结
不过日常中我不喜欢使用导航属性，也不去配置这些实体关系配置，也不去显式创建主外键操作，直接在需要关联的表增加对应表的主键，然后使用逻辑主键正常处理。
