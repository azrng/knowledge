---
title: dotnet生成数据库
lang: zh-CN
date: 2023-09-12
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: dotnetshengchengshujuku
slug: gtfany
docsId: '44959789'
---

## 开篇语
本文主要是回顾下从项目创建到生成数据到数据库(代码优先)的全部过程。采用EFCore作为ORM框架。
> 本次示例环境：vs2019、net5、mysql


## 创建项目
本次事例代码是用过vs2019创建的ASP.NET Core Web API项目
可以通过可视化界面创建或者通过命令行创建
```csharp
dotnet new webapi -o Net5ByDocker
```

## 创建实体类
安装组件
```csharp
<PackageReference Include="Pomelo.EntityFrameworkCore.MySql" Version="5.0.0" />
<PackageReference Include="Pomelo.EntityFrameworkCore.MySql.Json.Newtonsoft" Version="5.0.0" />
```
增加实体类
```csharp
[Table("user")]
public class User
{
    public User()
    {
        Id = Guid.NewGuid().ToString();
    }

    public User(string account, string password, string creater) : this()
    {
        Account = account;
        Password = password;
        Deleted = false;
        SetCreater(creater);
    }

    [Key]
    [Comment("主键")]
    [StringLength(36)]
    [Required]
    public string Id { get; private set; }

    [Comment("帐号")]
    [StringLength(36)]
    [Required]
    public string Account { get; private set; }

    [Comment("密码")]
    [StringLength(36)]
    [Required]
    public string Password { get; private set; }

    [Comment("余额")]
    [Column(TypeName = "decimal(18, 2)")]
    [Required]
    public decimal Money { get; set; }

    [Comment("是否删除")]
    [Column(TypeName = "tinyint(1)")]
    [Required]
    public bool Deleted { get; private set; }

    [Comment("创建人")]
    [StringLength(20)]
    [Required]
    public string Creater { get; private set; }

    [Comment("创建时间")]
    [Required]
    public DateTime CreateTime { get; private set; }

    [Comment("修改人")]
    [StringLength(20)]
    [Required]
    public string Modifyer { get; private set; }

    [Comment("修改时间")]
    [Required]
    public DateTime ModifyTime { get; private set; }

    public void SetCreater(string name)
    {
        Creater = name;
        CreateTime = DateTime.Now;
        SetModifyer(name);
    }

    public void SetModifyer(string name)
    {
        Modifyer = name;
        ModifyTime = DateTime.Now;
    }
}
```
> 这种只是增加实体类类型的一种方式，可能这种看着比较乱，还可以通过OnModelCreating实现，详情看参考文档

增加数据库上下文OpenDbContext
```csharp
public class OpenDbContext : DbContext
{
    public OpenDbContext(DbContextOptions<OpenDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
}
```
Startup注入连接数据库操作
```csharp
var connection = Configuration["DbConfig:Mysql:ConnectionString"];
var migrationsAssembly = IntrospectionExtensions.GetTypeInfo(typeof(Startup)).Assembly.GetName().Name;
services.AddDbContext<OpenDbContext>(option => option.UseMySql(connection, ServerVersion.AutoDetect(connection), x =>
        {
            x.UseNewtonsoftJson();
            x.MigrationsAssembly(migrationsAssembly);
        }));
```

## 生成迁移文件
引用组件
```csharp
<PackageReference Include="Microsoft.EntityFrameworkCore.Design" Version="5.0.5">
<PackageReference Include="Microsoft.EntityFrameworkCore.Tools" Version="5.0.5">
```
迁移命令
```csharp
add-migration Init
```
结果
![image.png](/common/1620543658741-00fd688e-8f23-4709-be13-22766cf2cfe4.png)
> 要看下生成的迁移文件是否是自己预期的那样子，也可以在这一步就生成数据库，命令：Update-Database


## 数据种子
增加OpenDbSend类，添加数据种子
```csharp
public class OpenDbSend
{
    /// <summary>
    /// 生成数据库以及数据种子
    /// </summary>
    /// <param name="dbContext">数据库上下文</param>
    /// <param name="loggerFactory">日志</param>
    /// <param name="retry">重试次数</param>
    /// <returns></returns>
    public static async Task SeedAsync(OpenDbContext dbContext,
        ILoggerFactory loggerFactory,
        int? retry = 0)
    {
        int retryForAvailability = retry.Value;
        try
        {
            dbContext.Database.Migrate();//如果当前数据库不存在按照当前 model 创建，如果存在则将数据库调整到和当前 model 匹配
            await InitializeAsync(dbContext).ConfigureAwait(false);

            //if (dbContext.Database.EnsureCreated())//如果当前数据库不存在按照当前 model创建，如果存在则不管了。
            //  await InitializeAsync(dbContext).ConfigureAwait(false);
        }
        catch (Exception ex)
        {
            if (retryForAvailability < 3)
            {
                retryForAvailability++;
                var log = loggerFactory.CreateLogger<OpenDbSend>();
                log.LogError(ex.Message);
                await SeedAsync(dbContext, loggerFactory, retryForAvailability).ConfigureAwait(false);
            }
        }
    }

    /// <summary>
    /// 初始化数据
    /// </summary>
    /// <param name="context"></param>
    /// <returns></returns>
    public static async Task InitializeAsync(OpenDbContext context)
    {
        if (!context.Set<User>().Any())
        {
            await context.Set<User>().AddAsync(new User("azrng", "123456", "azrng")).ConfigureAwait(false);
            await context.Set<User>().AddAsync(new User("张三", "123456", "azrng")).ConfigureAwait(false);
        }
        await context.SaveChangesAsync().ConfigureAwait(false);
    }
}
```
设置项目启动时候调用
```csharp
public static async Task Main(string[] args)
{
    var host = CreateHostBuilder(args).Build();
    using (var scope = host.Services.CreateScope())
    {
        var services = scope.ServiceProvider;
        var loggerFactory = services.GetRequiredService<ILoggerFactory>();
        var _logger = loggerFactory.CreateLogger<Program>();
        try
        {
            var openContext = services.GetRequiredService<OpenDbContext>();
            await OpenDbSend.SeedAsync(openContext, loggerFactory).ConfigureAwait(false);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"项目启动出错  {ex.Message}");
        }
    }

    await host.RunAsync().ConfigureAwait(false);
}
```

## 生成数据库
启动项目，自动生成数据库
![image.png](/common/1620546536896-91cc7623-b6fa-457c-acec-d465cb06428e.png)
表结构如下
![image.png](/common/1620546396376-896cc74f-197e-465e-811f-168ff86485c4.png)
> 如果后期数据库字段或者结构有变动，可以再次生成迁移文件然后生成数据库


## 查询数据
```csharp
/// <summary>
/// 用户接口
/// </summary>
public interface IUserService
{
    string GetName();

    /// <summary>
    /// 查询用户信息
    /// </summary>
    /// <param name="account"></param>
    /// <returns></returns>
    Task<User> GetDetailsAsync(string account);
}

/// <summary>
/// 用户实现
/// </summary>
public class UserService : IUserService
{
    private readonly OpenDbContext _dbContext;

    public UserService(OpenDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public string GetName()
    {
        return "AZRNG";
    }

    ///<inheritdoc cref="IUserService.GetDetailsAsync(string)"/>
    public async Task<User> GetDetailsAsync(string account)
    {
        return await _dbContext.Set<User>().FirstOrDefaultAsync(t => t.Account == account).ConfigureAwait(false);
    }
}
```
> 一般更推荐建立指定的返回Model类，然后只查询需要的内容，不直接返回实体类

控制器方法
```csharp
/// <summary>
/// 查询用户详情
/// </summary>
/// <param name="account"></param>
/// <returns></returns>
[HttpGet]
public async Task<ActionResult<User>> GetDetailsAsync(string account)
{
    return await _userService.GetDetailsAsync(account).ConfigureAwait(false);
}
```
查询结果
```csharp
{
  "id": "e8976d0a-6ee9-4e2e-b8d8-1fe6e85b727b",
  "account": "azrng",
  "password": "123456",
  "money": 0,
  "deleted": false,
  "creater": "azrng",
  "createTime": "2021-05-09T15:48:45.730302",
  "modifyer": "azrng",
  "modifyTime": "2021-05-09T15:48:45.730425"
}
```

## 参考文档
实体类型：[https://docs.microsoft.com/zh-cn/ef/core/modeling/entity-types?tabs=data-annotations](https://docs.microsoft.com/zh-cn/ef/core/modeling/entity-types?tabs=data-annotations)
实体属性：[https://docs.microsoft.com/zh-cn/ef/core/modeling/entity-properties?tabs=data-annotations%2Cwithout-nrt](https://docs.microsoft.com/zh-cn/ef/core/modeling/entity-properties?tabs=data-annotations%2Cwithout-nrt)