---
title: 基础操作
lang: zh-CN
date: 2023-04-13
publish: true
author: azrng
isOriginal: true
category:
  - orm
tag:
  - efcore
filename: jichucaozuo
slug: bsd4yg
docsId: '30843076'
---
## 说明

:::tip

本文示例环境：vs2022、.Net6及以上、MySQL、pgsql

本文适合有一点EFCore基础的人阅读，如果你没有基础，那么请转到[此处](https://learn.microsoft.com/zh-cn/ef/core/get-started/overview/first-app)

:::


## 准备

### 配置组件包

基础包

```csharp
// 基础库
Microsoft.EntityFrameworkCore

//数据库迁移使用
Microsoft.EntityFrameworkCore.Tools
```

### 数据库提供程序
每个 DbContext 实例都必须配置一个数据库提供程序。 （DbContext 子类型的不同实例可用于不同的数据库提供程序，但单个实例只能使用一个。）使用特定的 Use*调用配置数据库提供程序。 例如，若要使用 SQL Server 数据库提供程序
```csharp
// 配置方案一
public class ApplicationDbContext : DbContext
{
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlServer(@"Server=(localdb)\mssqllocaldb;Database=Test");
    }
}

// 配置方案二 ApplicationDbContext中不重写OnConfiguring在Startup中配置
services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer("连接字符串"));
```
这些 `Use*`方法是由数据库提供程序实现的扩展方法。 这意味着必须先安装数据库提供程序 NuGet 包，然后才能使用扩展方法。
> 数据库提供程序：[https://docs.microsoft.com/zh-cn/ef/core/providers/?tabs=dotnet-core-cli](https://docs.microsoft.com/zh-cn/ef/core/providers/?tabs=dotnet-core-cli)


## 1. 连接数据库
> 本文使用MySQL数据库，需要提前准备好MySQL数据库。

通过依赖注入配置应用程序，通过startup类的ConfigureService方法中的AddDbContext将EFCore添加到依赖注入容器
```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.AddControllers();
     
    // 需要提前引入nuget包：Pomelo.EntityFrameworkCore.MySql
    
    // 老版本驱动包对应的写法
    services.AddDbContext<OpenDbContext>(
        options => options.UseMySql(Configuration["DbConfig:Mysql:ConnectionString"]);
        
    // 新版本驱动包的写法(connection为连接字符串)
    services.AddDbContext<OpenDbContext>(option =>
    {
        option.UseMySql(connection, ServerVersion.AutoDetect(connection));
    });    
}
```
将名为 OpenDbContext的 DbContext 子类注册到依赖注入容器的Scope生命周期。数据库是MySQL，并从配置中读取数据库连接字符串。

OpenDbContext类必须公开具有 DbContextOptions&lt;OpenDbContext&gt; 参数的公共构造函数。 这是将 AddDbContext 的上下文配置传递到 DbContext 的方式。
```csharp
public class OpenDbContext : DbContext
{
    public OpenDbContext(DbContextOptions options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Score> Scores { get; set; }
    public DbSet<Group> Grades { get; set; }
    
    /// <summary>
    /// 配置信息连接数据库
    /// </summary>
    /// <param name="optionsBuilder"></param>
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        //另一种配置连接数据库的方式
        //optionsBuilder.UseMySql("连接数据库", ServerVersion.AutoDetect("连接数据库字符串"));

        //显示敏感数据日志(设置输出执行的SQL文件时候显示参数使用)
        optionsBuilder.EnableSensitiveDataLogging(true);
    }

    /// <summary>
    /// 配置数据库结构关系映射
    /// </summary>
    /// <param name="modelBuilder"></param>
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        //属性配置
        //modelBuilder.Entity<User>().Property(t => t.Account).IsRequired().HasMaxLength(20).HasComment("帐号");
        //种子数据设置
        //modelBuilder.Entity<User>().HasData(new User { Account="种子"});

        // 添加etc
        //modelBuilder.ApplyConfiguration(new UserInfoETC());

        //使用下面的方法进行替换处理上面批量增加etc的操作
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

        base.OnModelCreating(modelBuilder);
    }
}
```
然后将OpenDbContext通过构造函数注入的方式注入到应用程序的控制器或者其他服务中使用。
> 关于连接数据库可以参考另一个文章： [.Net之生成数据库全流程](https://mp.weixin.qq.com/s/_jfMwvewRNkAVwL4pfvLCA)

## 2. 操作迁移数据库

:::tip

根据代码生成数据库或者操作数据库使用

:::

```csharp
context.Database.EnsureDeleted();//删除数据库，如果存在，如果没有权限，则引发异常
context.Database.EnsureCreated();//如果数据库不存在，创建数据库并初始化数据库架构，如果存在任何表，则不会初始化架构
context.Database.Migrate();//根据迁移文件，迁移数据库


// 项目配置
context.Database.EnsureCreated();
context.Database.Migrate();
```

## 3. 查询操作

### 3.1 基础查询

> 此处的_context为数据库上下文，也就是上面的OpenDbContext实例

```csharp
// 查询集合 写法一
_context.Set<UserInfo>().ToList();
// 查询集合 写法二
_context.UserInfos.ToList();

//查询单个
_context.Movie.FirstOrDefaultAsync(m => m.ID == id); 
_context.Movie.FindAsync(id); 

//查询指定列  如果不存在数据返回空对象，而不是null
_context.Set<User>().AsNoTracking().Where(t=>t.Id=="11").Select(t => new { t.Account, t.PassWord }).FirstOrDefaultAsync();

//查询指定列 如果不存在数据返回空字符串，而不是null
 var session = await _context.Set<User>().Where(t=>t.Id =="11").Select(t => t.Name).FirstOrDefaultAsync().ConfigureAwait(false);

_context.Users.OrderBy(ty => ty.IsValid).Where(t => t.Id == "1407875772521123840").FirstOrDefaultAsync();
// 在EFCore中不论是先where还是先order，生成的SQL脚本都是先where再order的

// 预先加载查询
var blogs = context.Blogs.Include(blog => blog.Posts).ToList();
// 包含多个层级的查询
var blogs = context.Blogs.Include(blog => blog.Posts).ThenInclude(post => post.Author).ToList();

//忽略查询过滤
var info = db.Users.IgnoreQueryFilters().ToList();
```
| 操作符 | 序列是空的 | 序列只包含一个元素 | 序列包含多个元素 |
| --- | --- | --- | --- |
| first | 异常 | 返回该元素 | 返回第一个元素 |
| firstOfDefault | 返回default（TSourse） | 返回该元素 | 返回第一个元素 |
| last | 异常 | 返回该元素 | 返回最后一个元素 |
| lastOfDefault    | 返回default（TSourse） | 返回该元素 | 返回最后一个元素 |
| Single | 异常 | 返回该元素 | 异常 |
| SingleOrDefault | 返回default（TSourse） | 返回该元素 | 异常 |

FindAsync
在大部分基架代码中，FindAsync 可用于替代 FirstOrDefaultAsync ，查找具有主键 (PK) 的实体。 如果具有 PK 的实体正在由上下文跟踪，会返回该实体且不向 DB 发出请求。

```csharp
测试结果
var entity = _context.Users.Where(t => t.Id == "55555").Select(t => new { t.Account }).FirstOrDefault();//null
var entity2 = _context.Users.Where(t => t.Id == "55555").Select(t => t.Account).FirstOrDefault();//null
var enetit3 = _context.Users.Where(t => t.Id == "55555").Select(t => new user { Name = t.Account }).FirstOrDefault();//null
var entity4 = _context.Users.FirstOrDefault(t => t.Id == "55555");//null
var entity5 = _context.Users.Select(t => new user { Name = t.Account }).FirstOrDefault(t => t.Name == "444");//null
```

### 3.2 跟踪和非跟踪查询
跟踪行为决定了EFCore是否将有些实体的信息保存在其更改更跟踪器中。如果已跟踪某个实体，则该实体中检测到的任何更改都会在SaveChanges()时候保存到数据库，当你一个查询只是查询后续不会对他进行修改等操作，那么推荐使用不追踪的查询，性能更好
> 不跟踪没有主键的实体类型。

```csharp
// 跟踪查询
_context.Set<User>().ToListAsync();

// 不跟踪查询
_context.Set<User>().AsNoTracking().ToListAsync();
```
> 默认是跟踪查询


### 3.3 条件查询
通过表达式树或者Lambda
```csharp
// 方案一
Expression<Func<User, bool>> express = x => true;
if (!string.IsNullOrWhiteSpace(dto.Data))
{
	express = x => x.Mobile == dto.Data;
}
var list = await _dbContext.Set<User>().Where(express).ToListAsync();

// 方案二
var query = db.Users.Where(t => !t.Deleted);

var account = "";
// 如果满足一些条件就继续拼接筛选
if (!string.IsNullOrWhiteSpace(account))
{
    query = query.Where(t => t.Account == account);
}
var list = await query.ToListAsync();
```

### 3.4 原生SQL查询
可使用 FromSqlRaw 扩展方法基于原始 SQL 查询开始 LINQ 查询。 [FromSqlRaw](https://learn.microsoft.com/zh-cn/ef/core/querying/sql-queries#passing-parameters)(现在已经不推荐使用了) 只能在直接位于 DbSet<> 上的查询实体上使用。

查询非实体类型SQL(.net7引入)：[此处](https://learn.microsoft.com/zh-cn/ef/core/querying/sql-queries#querying-scalar-non-entity-types)

#### 3.4.1 基本原生SQL查询
```csharp
var blogs = context.Blogs
    .FromSqlRaw("select * from user")
    .ToList();

// 执行存储过程
var blogs = context.Blogs
    .FromSqlRaw("EXECUTE dbo.GetMostPopularBlogs")
    .ToList();
```
> 2.x里面使用FromSql，在3.x里面	使用FromSqlRow方法


#### 3.4.2 参数化查询

##### 3.4.2.1 SQL注入示例
首先我们编写一个简单的SQL注入示例，比如就注入我们根据ID查询的语句，输入ID为：ididid' or '1'='1
```csharp
var strSql = string.Format("select * from user where Id='{0}'", "ididid' or '1'='1");
var query = await _context.Set<User>().FromSqlRaw(strSql).ToListAsync();
Console.WriteLine(JsonConvert.SerializeObject(query));
```
生成语句
```csharp
select * from user where Id='ididid' or '1'='1'
[{"Account":"张三","PassWord":"123456","CreateTime":"2021-05-20T22:53:44.778101","IsValid":false,"Id":"1395392302788120576"},{"Account":"李四","PassWord":"123456","CreateTime":"2021-05-20T22:53:44.849376","IsValid":false,"Id":"1395392303090110464"},{"Account":"王五","PassWord":"123456","CreateTime":"2021-05-20T22:53:44.849425","IsValid":false,"Id":"1395392303090110467"}]
```

结果显示虽然我们本意想查询id等于ididid的值，但是通过SQL注入的原因，将所有内容查询出来了，所以在开发中如果遇到类似拼接SQL的场景，要注意SQL注入的问题

##### 3.4.2.2 FromSqlRaw参数化

通过参数化查询，防止SQL注入问题
```csharp
//sql语句参数化查询，防止SQL注入	
var strSql = "select * from user where Id=@id";
var parameter = new MySqlParameter[] {
    new MySqlParameter("@id","1395392302788120576"),
};
var query = await _context.Set<User>().FromSqlRaw(strSql, parameter).ToListAsync();
```
或者
```csharp
var strSql = "select * from user where Id={0}";
var query = await _context.Set<User>().FromSqlRaw(strSql, "1395392302788120576").ToListAsync();
Console.WriteLine(JsonConvert.SerializeObject(query));

// 生成SQL
select * from user where Id=@p0
    [{"Account":"张三","PassWord":"123456","CreateTime":"2021-05-20T22:53:44.778101","IsValid":false,"Id":"1395392302788120576"}]
```
> 通过占位符形式提供额外的参数，看上去类似于String.Format语法，但是提供的值包装在DbParameter中。可以防止SQL注入

限制：

- 结果中的列名，必须与属性被映射到的列名相匹配
- 查询必须为实体或查询类型的所有属性返回数据
- SQL 查询不能包含导航关系，但我们总是可以把 FromSqlRaw 和 Include 方法结合起来。
```csharp
var account = 
  _context.Accounts
    .FromSqlRaw("SELECT * FROM Account WHERE Name = {0}", "Zilor")
    .Include(e => e.AccountSubjects)
    .FirstOrDefault();
```

##### 3.4.2.3 FromSqlInterpolated参数化※
FromSqlInterpolated 类似于 FromSqlRaw，但你可以借助它使用字符串内插语法(参数化的)。与 FromSqlRaw 一样，FromSqlInterpolated 只能在查询根上使用，并且都可以防止SQL注入。
```csharp
var query = await _context.Set<User>().FromSqlInterpolated($"select * from user where Id={"1395392302788120576"}").ToListAsync();
Console.WriteLine(JsonConvert.SerializeObject(query));
```
> 经过在MySQL和pgsql测试，这里的内插值和参数化一样，比如根据name查询不应该加引号，加了反而查询不出来

生成SQL
```csharp
select * from user where Id=@p0
[{"Account":"张三","PassWord":"123456","CreateTime":"2021-05-20T22:53:44.778101","IsValid":false,"Id":"1395392302788120576"}]
```
因为FromSqlInterpolated方法返回的结果是IQueryable类型的，因此我们还可以在在做一些后续的操作。

#### 3.4.3 限制

- SQL查询必须返回实体类型的所有属性的数据。
- 结果集中的列明必须与属性映射到的列名称匹配。
- 只能单表查询，不能不能包含关联数据， 但是，在许多情况下你可以在查询后面紧跟着使用 `Include` 方法以返回关联数据（请参阅[包含关联数据](https://docs.microsoft.com/zh-cn/ef/core/querying/raw-sql#including-related-data)）。



参考文档：[https://docs.microsoft.com/zh-cn/ef/core/querying/raw-sql](https://docs.microsoft.com/zh-cn/ef/core/querying/raw-sql)

#### 3.4.4 SqlQuery

查询非实体类型SQL(.net7引入)：[此处](https://learn.microsoft.com/zh-cn/ef/core/querying/sql-queries#querying-scalar-non-entity-types)



pgsql查询提示报错：Npgsql.PostgresException (0x80004005): 42703: column t.Value does not exist，那么就需要让查询的列中包含Value(大写的)。

```csharp
var result = await _hdrDbContext.Database.SqlQuery<DateTime?>($"select max(visit_time) \"Value\" from visit.visit_record").FirstOrDefaultAsync();
```


### 3.5 复杂查询
数据如下：用户表(user)

![image.png](/common/1621562425951-13836b1a-66db-46a9-9f39-7fb3278d879c.png)

用户成绩表(score)

![image.png](/common/1621562455217-109ca102-03dc-41b3-9cc2-7c3e0a12856f.png)

描述：包含三个用户，其中两个用户在成绩表都有语文和数学的数据。

#### 3.5.1 内连接
内连接：分为隐式内连接和显式内连接(写法不同，结果相同)

##### 3.5.1.1 Linq查询表达式

###### 显式内连接：join-in-on拼接
```csharp
var list = (from u in _context.Users
            join sc in _context.Scores on u.Id equals sc.UserId
            where sc.CourseName == "语文"
            select new
            {
                u.Account,
                u.PassWord,
                sc.CourseName,
                sc.Grade
            }).ToList();
Console.WriteLine(JsonConvert.SerializeObject(list));
```
> 记得引用：System.Linq  否则提示：未找到源类型“DbSet&lt;User&gt;”的查询模式的实现，未找到join

生成SQL
```csharp
SELECT `u`.`Account`, `u`.`PassWord`, `s`.`CourseName`, `s`.`Grade`
    FROM `user` AS `u`
    INNER JOIN `score` AS `s` ON `u`.`Id` = `s`.`UserId`
    WHERE `s`.`CourseName` = '语文'
```
结果
![image.png](/common/1621562254206-ca4cde94-2b2d-4e81-94fd-aabf09bc198d.png)
三表联合查询

```csharp
var templateFieldList = await (from template in _conclusionTemplateReq.EntitiesAsNoTracking.Where(t =>
        t.Isdefault && t.TenantId == CurrentUser.TenantId)
    join templateField in _templateFieldMappingRep.EntitiesAsNoTracking on template.CluTemplateId equals
        templateField.CluTemplateId
    join field in _conclusionTemplateFieldRep.EntitiesAsNoTracking.Where(t => t.Isdefault) on templateField
        .CluFieldId equals field.CluFieldId
    select new ChatConclusionTemplateFieldMapping(newTemplateId, templateField.CluFieldId,
        templateField.Sort)).ToArrayAsync().ConfigureAwait(false);
```

###### 隐式内连接：多个from并联拼接
```csharp
var list = (from u in _context.Users
            from sc in _context.Scores
            where u.Id == sc.UserId && sc.CourseName == "语文"
            select new
            {
                u.Account,
                u.PassWord,
                sc.CourseName,
                sc.Grade
            }).ToList();
Console.WriteLine(JsonConvert.SerializeObject(list));
```
生成SQL
```csharp
SELECT `u`.`Account`, `u`.`PassWord`, `s`.`CourseName`, `s`.`Grade`
    FROM `user` AS `u`
    CROSS JOIN `score` AS `s`
    WHERE (`u`.`Id` = `s`.`UserId`) AND (`s`.`CourseName` = '语文')
```
结果
![image.png](/common/1621562264762-9127dd6f-a5bc-473f-bbc1-6547657eb5b5.png)

##### 3.5.1.2 Linq标准查询运算符(推荐)
```csharp
var list = _context.Users.Where(t => t.Account != null)
    .Join(_context.Scores.Where(sc => sc.CourseName == "语文"), u => u.Id, sc => sc.UserId, (u, sc) => new
          {
              u.Account,
              u.PassWord,
              sc.CourseName,
              sc.Grade
          }).ToList();
Console.WriteLine(JsonConvert.SerializeObject(list));
```
生成SQL
```sql
      ## 不加查询课程
	    SELECT `u`.`Account`, `u`.`PassWord`, `s`.`CourseName`, `s`.`Grade`
      FROM `user` AS `u`
      INNER JOIN `score` AS `s` ON `u`.`Id` = `s`.`UserId`

      ## 查询课程
      SELECT `u`.`Account`, `u`.`PassWord`, `t`.`CourseName`, `t`.`Grade`
      FROM `user` AS `u`
      INNER JOIN (
          SELECT `s`.`CourseName`, `s`.`Grade`, `s`.`UserId`
          FROM `score` AS `s`
          WHERE `s`.`CourseName` = '语文'
      ) AS `t` ON `u`.`Id` = `t`.`UserId`
```
结果
![image.png](/common/1621564709433-98fbb56e-66e0-4505-b414-b12e9fa5d53b.png)

多表查询示例
```csharp
var list = db.Schedule.Join(db.RoomInfo.Where(t => !t.Deleted), s => s.RoomId, r => r.Id, (s, r) => new
{
    s.Id,
    s.BeginTime,
    r.RoomName,
    s.MovieId
}).Join(db.MovieInfo.Where(t => !t.Deleted), s => s.MovieId, m => m.Id, (s, m) => new
{
    s.Id,
    s.RoomName,
    m.Name,
    s.BeginTime
}).ToList();
```

#### 3.5.2 外连接
外连接join后必须有into，然后可以加上XX.DefaultIfEmpty()，表示对于引用类型将返回null,而对于值类型则返回0。对于结构体类型，则会根据其成员类型将它们相应地初始化为null(引用类型)或0(值类型)，
> 如果仅需要统计右表的个数或者其它属性，可以省略XX.DefaultIfEmpty, 但如果需要点出来右表的字段，则不能省。


##### 3.5.2.1 Linq查询表达式
查询所有用户对应的班级,因为用户和成绩一对多，所以会出现多条数据
```csharp
var list = (from u in _context.Users
            join sc in _context.Scores on u.Id equals sc.UserId
            into ulist
            from sco in ulist.DefaultIfEmpty()
            where u.Account != null //这个条件只是展示如何添加条件
            select new
            {
                UserId = u.Id,
                Account = u.Account,
                sco.CourseName
            }).ToList();
Console.WriteLine(JsonConvert.SerializeObject(list));

var list = (from g in _groupdefRep.EntitiesAsNoTracking
            join cl in _clouduserRep.EntitiesAsNoTracking on g.CloudId equals cl.Id
            into glist
            from c in glist.DefaultIfEmpty()
            where g.Enabled.Value == 1 && (cloudId == 0 || g.CloudId == cloudId)
            orderby c.Id, g.GroupName
            select new
            {
                Gid = g.Id,
                Name = c == null ? g.GroupName : c.CloudName
            }).ToList();
```
> 可以使用：string.IsNullOrEmpty  不能使用：string.IsNullOrWhiteSpace

生成SQL
```csharp
      SELECT `u`.`Id` AS `UserId`, `u`.`Account`, `s`.`CourseName`
      FROM `user` AS `u`
      LEFT JOIN `score` AS `s` ON `u`.`Id` = `s`.`UserId`
```
结果
![image.png](/common/1621563339181-f19d1904-de1f-4897-a64c-d14e45f17071.png)
如果要查询成绩，应该这么写，上面那个写法会直接报错， Nullable object must have a value
![image.png](/common/1621563656968-030835ff-2188-43c9-99e6-b2c475e02f3e.png)

##### 3.5.2.2 Linq标准查询运算符(推荐)
示例内容凑合看，我限定的是一个用户对应一个成绩，然后有些用户没有成绩，然后以用户表为主，成绩表为子表进行左连接查询。
```csharp
var leftJoinList = await _context.Set<User>().GroupJoin(_context.Set<Score>(), u => u.Id, s => s.UserId,
    (u, s) => new
    {
        User = u,
        Scores = s
    }).SelectMany(x => x.Scores.DefaultIfEmpty(), (u, s) => new
    {
        u.User.Id,
        u.User.Account,
        Grade = s == null ? 0 : s.Grade,
        CourseName = s == null ? "" : s.CourseName,
    }).ToListAsync();
```
生成sql
```csharp
SELECT `u`.`Id`, 
	   `u`.`Account`, 
	   CASE WHEN `s`.`Id` IS NULL THEN 0 ELSE `s`.`Grade` END AS `Grade`, 
	   CASE WHEN `s`.`Id` IS NULL THEN '' ELSE `s`.`CourseName` END AS `CourseName`
       FROM `user` AS `u`
       LEFT JOIN `score` AS `s` ON `u`.`Id` = `s`.`UserId`
```

#### 3.5.3 GroupJoin
GroupJoin操作符常应用于返回“主键对象-外键对象集合”形式的查询，例如“用户信息-此用户下所有科目成绩”
```csharp
    var list = _context.Users.Where(t => t.Account != null)
        .GroupJoin(_context.Scores, u => u.Id, sc => sc.UserId, (u, sc) => new
        {
            u.Account,
            u.PassWord,
            Scores = sc
        }).ToList();
    Console.WriteLine(JsonConvert.SerializeObject(list));
```
该代码会提示错误，原因如：[https://docs.microsoft.com/zh-cn/ef/core/querying/client-eval](https://docs.microsoft.com/zh-cn/ef/core/querying/client-eval)

#### 3.5.4 GrouBy
分组操作 根据用户分组，求科目数
```csharp
    var list = (from sc in _context.Scores
                group sc by sc.UserId
                into g
                select new
                {
                    g.Key,
                    Count = g.Count()
                }).ToList();
    Console.WriteLine(JsonConvert.SerializeObject(list));

    var list2 = _context.Scores.GroupBy(sc => sc.UserId).Select(t => new
    {
        t.Key,
        Count = t.Count()
    }).ToList();
    Console.WriteLine(JsonConvert.SerializeObject(list2));
```
生成SQL
```csharp
info: Microsoft.EntityFrameworkCore.Database.Command[20101]
      Executed DbCommand (1ms) [Parameters=[], CommandType='Text', CommandTimeout='30']
      SELECT `s`.`UserId` AS `Key`, COUNT(*) AS `Count`
      FROM `score` AS `s`
      GROUP BY `s`.`UserId`
[{"Key":"1395392302788120576","Count":2},{"Key":"1395392303090110464","Count":2}]
info: Microsoft.EntityFrameworkCore.Database.Command[20101]
      Executed DbCommand (0ms) [Parameters=[], CommandType='Text', CommandTimeout='30']
      SELECT `s`.`UserId` AS `Key`, COUNT(*) AS `Count`
      FROM `score` AS `s`
      GROUP BY `s`.`UserId`
[{"Key":"1395392302788120576","Count":2},{"Key":"1395392303090110464","Count":2}]
```
表内连接然后在分组查询
```csharp
var recordFolderMap = await (from folder in recordFolderInfoQuery
                                join relation in recordFolderReationQuery
                                    on folder.Id equals relation.RecordFolderInfoId
                                group relation by relation.VisitId
                                into g
                                select new
                                {
                                    VisitId = g.Key,
                                    FolderCount = g.Count()
                                }).ToDictionaryAsync(x => x.VisitId, x => x.FolderCount);

var result = await recordFolderInfoQuery.Join(recordFolderReationQuery, folderInfo => folderInfo.Id, folderRelation => folderRelation.RecordFolderInfoId,
    (_, folderRelation) => new
    {
        Visitid = folderRelation.VisitId,
    }).GroupBy(x => x.Visitid).Select(g => new
    {
        VisitId = g.Key,
        FolderCount = g.Count()
    }).ToDictionaryAsync(x => x.VisitId, x => x.FolderCount);
```

### 3.6 查询是否存在
简单查询是否存在
```csharp
var exist = await _templateFieldMappingRep.EntitiesAsNoTracking.AnyAsync(t => t.CluFieldId == 111);
```
联表查询是否存在
```csharp
var existTitle =
    await (from templatefield in _templateFieldMappingRep.EntitiesAsNoTracking.Where(t =>
            t.CluTemplateId == dto.CluTemplateId)
            from field in _conclusionTemplateFieldRep.EntitiesAsNoTracking.Where(t =>
                t.FieldName == dto.FieldName)
            where templatefield.CluFieldId == field.CluFieldId
            select new { field.CluFieldId }).AnyAsync().ConfigureAwait(false);
```

### 3.7 聚合函数查询

#### 3.7.1查询最大值或者最小值

```c#
// 如果数据库中一条数据都没有，直接使用Max或者Min方法会报错，所以可以使用下面的方式来操作
int? maxSeq = await dbCtx.Query<Album>().MaxAsync(c => (int?)c.SequenceNumber);
```

### 3.8 匹配查询

:::tip

因为使用or的查询方案性能低，所以当只有当我们要查询的内容在表内不是唯一的，必须通过匹配查询的时候才要去考虑这个方案

:::

当我们用户表中查询一批数据，他们的账号姓名以及姓名都需要匹配的时候，我们可以这么操作
```csharp
var userList = new List<GetUserInfoResponse>
{
    new GetUserInfoResponse{  Account="admin1", Name="张三",Sex=SexEnum.Man},
    new GetUserInfoResponse{  Account="admin3", Name="王五",Sex=SexEnum.Man},
    new GetUserInfoResponse{  Account="admin2", Name="李四",Sex=SexEnum.Man}
};

var p = Expression.Parameter(typeof(User), "t");

var parts = new List<Expression>();
foreach (var item in userList)
{
    var accountProperty = Expression.Property(p, nameof(User.Account));
    var accountValue = Expression.Constant(item.Account);
    var accountExpression = Expression.Equal(accountProperty, accountValue);

    var nameProperty = Expression.Property(p, nameof(User.Name));
    var nameValue = Expression.Constant(item.Name);
    var nameExpression = Expression.Equal(nameProperty, nameValue);

    var sexProperty = Expression.Property(p, nameof(User.Sex));
    var sexValue = Expression.Constant(item.Sex);
    var sexExpression = Expression.Equal(sexProperty, sexValue);

    var part = Expression.AndAlso(accountExpression, nameExpression);
    var express = Expression.AndAlso(part, sexExpression);

    parts.Add(Expression.AndAlso(part, sexExpression));
}
var body = parts.Aggregate(Expression.OrElse);
var filter = Expression.Lambda<Func<User, bool>>(body, p);

var queryString = _dbContext.Users.Where(filter).ToQueryString();
```
生成SQL如下
```sql
SELECT u.id,
       u.account,
       u.create_time,
       u.credit,
       u.deleted,
       u.group_id,
       u.modify_time,
       u.name,
       u.pass_word,
       u.sex
FROM sample."user" AS u
WHERE NOT (u.deleted)
  AND (((((u.account = 'admin1') AND (u.name = '张三')) AND (u.sex = 1)) OR
        (((u.account = 'admin3') AND (u.name = '王五')) AND (u.sex = 1))) OR
       (((u.account = 'admin2') AND (u.name = '李四')) AND (u.sex = 1)))
```

其他情况考虑去根据指定唯一列单表查询或者说通过表关联的方案进行查询，例如

```c#
var list = await (from md in _dbContext.Set<主表>()
                 join sn in _dbContext.Set<子表>()
                     on new { DataSetId = md.Id, md.VersionId } equals new { sn.DataSetId, sn.VersionId }
                 where md.LatestVersionId > 0
                 select new MetaDataElement
                        {
                            Id = sn.ElementId,
                            Name = md.Name,
                            DataSetId = md.Id,
                            CreateTime = md.CreateTime,
                            CreateUser = md.CreateUser,
                            CreateUserId = md.CreateUserId
                        }).ToListAsync();
```

生成查询sql

```sql
SELECT m0.element_id              AS "Id",
       m.name                     AS "Name",
       m.id                       AS "DataSetId",
       m.create_time              AS "CreateTime",
       m.create_user              AS "CreateUser",
       m.create_user_id           AS "CreateUserId"
FROM meta_data.主表 AS m
         INNER JOIN meta_data.子表 AS m0
                    ON m.id = m0.data_set_id AND m.version_id = m0.version_id
WHERE NOT (m.is_deleted)
```

### 3.9分页查询

分页：https://docs.microsoft.com/zh-cn/ef/core/querying/pagination

偏移分页、键集分页

## 4. 添加操作

### 4.1 基础添加
```csharp
_context.Movie.Add(movie);
// or
await _context.Movie.AddRangeAsync(movies)
await _context.SaveChangesAsync();
```

### 4.2 已经设置自增键的插入
先关闭自增然后插入数据后再开启自增
```csharp
db.Database.OpenConnection();
db.Database.ExecuteSqlCommand("SET IDENTITY_INSERT [T_RoleInfor] ON");
var r2 = new T_RoleInfor()
{
    id = 123,
    roleName = "管理员",
    roleDescription = "我是管理员"
};
db.Add(r2);
int count2 = db.SaveChanges();
db.Database.ExecuteSqlCommand("SET ID	ENTITY_INSERT [T_RoleInfor] OFF");
```

### 4.3 通过SQL添加

:::tip

如果使用下面的方法去执行多个sql脚本，那么就需要手动处理事务

:::

#### 4.3.1 ExecuteSqlRaw
支持直接传入一个原始SQL字符串作为参数来执行原始SQL， 不建议在 EF Core 原始 SQL 查询方法之外使用字符串插值组装 SQL 语句。因为，这样会失去 SQL 参数注入攻击的检测。
```csharp
var strSql2 = "INSERT INTO `userinfo`(`Id`, `Account`, `PassWord`) VALUES (@id, @account, @password);";
var parameter2 = new MySqlParameter[] {
	new MySqlParameter("@id","22"),
	new MySqlParameter("@account","2222"),
	new MySqlParameter("@password","22222")
	};
var flg = db.Database.ExecuteSqlRaw(strSql2, parameter2);

// 调用存储过程
int n = db.Database.ExecuteSqlCommand("DoSome @id", para);//参数化操作
```
> 2.x使用ExecuteSqlCommand，3.x使用ExecuteSqlRaw方法

执行sql并且包含事务

```c#
var mysqlSql =
    @"INSERT INTO test.menus (id, name, create_time, modify_time) VALUES (default, '张飒22222222', '2023-10-08 17:26:45.000000', '2023-10-08 17:26:47.000000');
INSERT INTO test.menus (id, name, create_time, modify_time) VALUES (default, '张飒333333', '2xxxx000', '2023-10-08 17:26:47.000000');";

await using var db = new OpenDbContext();

await using var tran = await db.Database.BeginTransactionAsync();
try
{
    // 奇怪，这里执行失败  但是事务没有生效，导致一条执行到库中一条没有
    // 测试结果  ef中创建表语句不能通过事务回滚，ddl操作不支持事务性
    // 1、如果包含创建表的sql且创建表之前的sql没有报错，那么表可以创建成功，并且正常的插入sql也会被执行，一直到遇到错误sql停止
    // 2、如果不包含创建表sql，那么sql要成功都成功，否则都失败
    var i = await db.Database.ExecuteSqlRawAsync(mysqlSql);
    await db.SaveChangesAsync();
    await tran.CommitAsync();
    i.Dump();
}
catch (Exception ex)
{
    $"异常  {ex.Message}".Dump();
    await tran.RollbackAsync();
    "回滚事务".Dump();
}
```

[EFCore执行自定义SQL时格式化错误：Input string was not in a correct format.](https://www.cnblogs.com/shanfeng1000/p/18328616)

#### 4.3.2 ExecuteSqlInterpolated

和ExecuteSqlRaw类似，不过它支持内插值方式参数化操作，使得代码更易读和可维护
```csharp
//支持内插值的参数化 这里插入值的时候也不能带引号
var currTime = DateTime.Now.ToUniversalTime();
var flag = await db.Database.ExecuteSqlInterpolatedAsync(
        $"INSERT INTO \"user\".role (id, name, create_time, modify_time) VALUES ({11102}, {"管理员张三"}, {currTime}, {currTime});");
```

#### 4.3.3 ExecuteSql

:::tip

这里只是把它放到添加的分类中了，官网描述是用来执行不返回任何数据的 SQL

:::

官方文档：https://learn.microsoft.com/zh-cn/ef/core/querying/sql-queries#executing-non-querying-sql

##### 方式一

```c#
using var db = new OpenDbContext();

// FormattableString是抽象类，在使用 FormattableString 时，可以通过使用 $ 符号前缀来创建一个可格式化字符串，例如：
// FormattableString message = $"Hello, {name}. The current time is {DateTime.Now}.";
FormattableString mysqlSql =
    $"INSERT INTO test1008.menus (id, name, create_time, modify_time) VALUES (default, '张飒1', '2023-10-08 17:26:45.000000', '2023-10-08 17:26:47.000000');";

// 考虑到这里可能包含多个sql，所以需要添加事务
using var tran = db.Database.BeginTransaction();
// 这里参数接收FormattableString类型是用来防止SQL注入的
var result = await db.Database.ExecuteSqlAsync(mysqlSql);
tran.Commit();
```

##### 方式二

```c#
using var db = new OpenDbContext();
var name = "李四";
// 这里参数接收FormattableString类型是用来防止SQL注入的
var add = await db.Database.ExecuteSqlAsync($"INSERT INTO test1008.menus (id, name, create_time, modify_time) VALUES (default, '{name}', '2023-10-08 17:26:33.000000', '2023-10-08 17:26:36.000000');");
```

## 5. 修改操作

### 5.1 查询后修改
```csharp
var  movie = await _context.Movie.FirstOrDefaultAsync(m => m.ID == id);
movie.Name="李思";
await _context.SaveChangesAsync();  
```
当我们已经查询加载一个实体，然后我们使用**ExecuteSqlRaw**方法对数据库的实体做了一些修改操作，那么已经加载的实体就是过时的数据。我们可以通过Reload方法重新加载实体
```csharp
_context.Entry(accountForUpdate).Reload();
```

### 5.2 不查询修改
该方案可以不用提前查询就可以修改，但是不推荐使用。
```csharp
//不需要提前查询就可以更新账号
var userInfo = new User
{
    Id = 12345,
    Account = "更新后的值"
};
var entry = db.Entry(userInfo);
entry.Property("account").IsModified = true;
await db.SaveChangesAsync();
```

在EFCore7时候，支持批量修改数据的操作，具体可以查阅[官网文档](https://learn.microsoft.com/zh-cn/ef/core/what-is-new/ef-core-7.0/whatsnew*#executeupdate-and-executedelete-bulk-updates*)，操作示例，下面则是一个封装的DbContext的方法

```c#
public async Task<int> UpdateAsync(Expression<Func<T, bool>> predict,
    Expression<Func<SetPropertyCalls<T>, SetPropertyCalls<T>>> setPropertyCalls)
{
    var result = await _dbContext.Set<T>().Where(predict).ExecuteUpdateAsync(setPropertyCalls).ConfigureAwait(false);
    return result;
}
```

使用方法如下

```c#
await _recordFolderRelationRepository
        .UpdateAsync(x => request.RecordfolderIds.Contains(x.RecordFolderInfoId) && !x.IsDeleted,
            t => t.SetProperty(o => o.IsDeleted, true)
                .SetProperty(o => o.DeleteUserId, userId)
                .SetProperty(o => o.DeleteTime, now)).ConfigureAwait(false);
```

## 6. 删除操作

### 6.1 查询后删除
```csharp
var movie = await _context.Movie.FirstOrDefaultAsync(m => m.ID == id);
_context.Movie.Remove(movie);
await _context.SaveChangesAsync();
```

### 6.2 不查询后删除
不需要查询直接执行删除操作，但是不推荐使用
```csharp
//不查询删除
var userInfo2 = new User { Id = 124545 };
db.Entry(userInfo2).State = EntityState.Deleted;
await db.SaveChangesAsync();
```

在EFCore7时候，支持删除数据的操作，具体可以查阅官网文档

## 7. ADO.NET

FromSqlInterpolated只能单表查询，但是在实际查询中，有很多操作的SQL语句是很复杂的，因此需要一种执行任意SQL查询一句的机制。
> 虽然可以通过写存储过程然后映射实体来实现，但是不推荐写存储过程，项目复杂的时候会导致视图太多，非实体的DbSet太多导致乱七八糟。

### 7.1查询

通过的DbConnection以及DbDataReader去操作
```csharp
var strSql = "select * from \"user\".employee ";

using var db = new OpenDbContext();
using var connection = db.Database.GetDbConnection();
if (connection.State != System.Data.ConnectionState.Open)
    await connection.OpenAsync();

using var cmd = connection.CreateCommand();
cmd.CommandText = strSql;
using var reader = await cmd.ExecuteReaderAsync();
while (await reader.ReadAsync())
{
    Console.WriteLine($"id:{reader.GetInt64(0)} name:{reader.GetString(1)}");
}
```

### 7.2执行SQL

通过ADO.NET去执行SQL并使用事务

```c#
// 举例MySQL操作，其他类似

var mysqlSql =
    @"INSERT INTO test1008.menus (id, name, create_time, modify_time) VALUES (default, '张飒', '2023-10-08 17:26:45.000000', '2023-10-08 17:26:47.000000');
INSERT INTO test1008.menus (id, name, create_time, modify_time) VALUES (default, '张飒1', '2023-10-08 17:26:45.000000', '2023-10-08 17:26:47.000000');";

using var db = new OpenDbContext();
using var connection = db.Database.GetDbConnection();
using var tran = db.Database.BeginTransaction();
try
{
    var cmd = connection.CreateCommand();
    cmd.CommandText = mysqlSql;
    // 不加会报错：https://mysqlconnector.net/troubleshooting/transaction-usage
    cmd.Transaction = tran.GetDbTransaction();
    var i = await cmd.ExecuteNonQueryAsync();
    await tran.CommitAsync();
}
catch (Exception ex)
{
    await Console.Out.WriteLineAsync("出错 回滚");
    await tran.RollbackAsync();
}
```

## 8.配合Dapper操作

通过借助dapper去操作，需要安装nuget包：Dapper

### 8.1查询

```csharp
var strSql = "select * from \"user\".employee ";

using var db = new OpenDbContext();
using var connection = db.Database.GetDbConnection();
var list = await connection.QueryAsync<Employee>(strSql);
foreach (var item in list)
{
    Console.WriteLine($"id:{item.Id} name:{item.Name}");
}
```

### 8.2执行SQL

使用EFCore搭配dapper执行mysql的脚本

```c#
// 注意该文档：https://mysqlconnector.net/troubleshooting/transaction-usage/
var mysqlSql1 =
    "INSERT INTO test.menus (id, name, create_time, modify_time) VALUES (default, '张飒1', '2023-10-08 17:26:45.000000', '2023-10-08 17:26:47.000000');";
var mysqlSql =
    @"INSERT INTO test.menus (id, name, create_time, modify_time) VALUES (default, '张飒2', '2023-10-08 17:26:45.000000', '2023-10-08 17:26:47.000000');
INSERT INTO test.menus (id, name, create_time, modify_time) VALUES (default, '张飒3', '2xxxx000', '2023-10-08 17:26:47.000000');";

await using var db = new OpenDbContext();
await using var connection = db.Database.GetDbConnection();
if (connection.State != ConnectionState.Open)
    await connection.OpenAsync();
// 执行可以成功
var result = await connection.ExecuteAsync(mysqlSql1);
result.Dump();

await using var tran = await db.Database.BeginTransactionAsync();

// 因为脚本问题所以执行不成功 但是因为包含事务，所以也不会出现一条插入到数据库中
var i = await connection.ExecuteAsync(mysqlSql, transaction: tran.GetDbTransaction());

await tran.CommitAsync();
i.Dump();
```

## 9. 参考文档

> 官方例子：[https://docs.microsoft.com/zh-cn/ef/core/dbcontext-configuration/](https://docs.microsoft.com/zh-cn/ef/core/dbcontext-configuration/)

 
