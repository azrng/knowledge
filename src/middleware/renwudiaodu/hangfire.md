---
title: Hangfire
lang: zh-CN
date: 2023-09-29
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: hangfire
slug: bayp4x
docsId: '63996329'
---

## 概述
轻便，可持久化，还有面板

官网文档：https://www.hangfire.io/overview.html

## 快速上手

新建项目.Net6的WebApi项目，然后安装下面nuget包并使用内存储存

```xml
<Project Sdk="Microsoft.NET.Sdk.Web">

  <PropertyGroup>
    <TargetFramework>net6.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Swashbuckle.AspNetCore" Version="6.5.0" />
    <PackageReference Include="Hangfire.AspNetCore" Version="1.8.6" /> 👈
    <PackageReference Include="Hangfire.InMemory" Version="0.6.0" /> 👈
  </ItemGroup>

</Project>
```

然后再Program中进行注入下面的服务

```c#
using Hangfire;
using Hangfire.InMemory;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddHangfire(config => 👈
{
    config.SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
        .UseSimpleAssemblyNameTypeSerializer()
        .UseRecommendedSerializerSettings()
        .UseStorage(new InMemoryStorage());
});

builder.Services.AddHangfireServer();👈

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//启用Hangfire面板
app.UseHangfireDashboard(); 👈

//开启一个定时任务
RecurringJob.AddOrUpdate("test", () => Console.WriteLine("Recurring!"), Cron.Minutely());

app.UseAuthorization();

app.MapControllers();

app.Run();
```

做这些配置后启动项目，然后等会就可以在输出的控制台中可以看到我们的任务test输出的内容：Recurring



另外还可以访问/hangfire 访问到控制面板界面

## 操作

### HangfireServer配置

```csharp
// Add Hangfire services.
builder.Services.AddHangfire(configuration => configuration
        .SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
        .UseSimpleAssemblyNameTypeSerializer()
        .UseRecommendedSerializerSettings() // 使用推荐的序列化程序，默认是 Json.Net
        .UseInMemoryStorage() // 使用内存数据库，生产环境需要正式的数据库
);

// Add the processing server as IHostedService
builder.Services.AddHangfireServer(options =>
{
    options.ServerTimeout = TimeSpan.FromMinutes(4);
    options.SchedulePollingInterval = TimeSpan.FromSeconds(1); //秒级任务需要配置短点，一般任务可以配置默认时间，默认15秒
    options.ShutdownTimeout = TimeSpan.FromMinutes(30); //超时时间
    options.Queues = new[] { "apis", "jobs", "task", "rjob", "pjob", "rejob", "default" }; //队列
    options.WorkerCount = Math.Max(Environment.ProcessorCount, 20); //工作线程数，当前允许的最大线程，默认20
});
```

### 创建任务

#### 单次执行的任务

```c#
BackgroundJob.Enqueue(() => Console.WriteLine("我只执行一次"));
```

#### 基于队列的任务处理
任务执行不是同步的，而是放到一个持久化队列中，以便马上把请求控制权返回给调用者
```csharp
BackgroundJob.Enqueue(() => Console.WriteLine("Hello, world!"));
```

#### 延迟任务（方法）执行
可以将方法的执行推迟一段指定的时间，而不是立即调用方法：
```csharp
BackgroundJob.Schedule(() => Console.WriteLine("Hello, world!"), TimeSpan.FromMinutes(5));
```

#### 循环执行任务
只需简单的一行代码就可以添加重复执行的任务，其内置了常见的时间循环模式，也可以基于CRON表达式来设定复杂的模式。使用方法：
```csharp
RecurringJob.AddOrUpdate(() => Console.Write("Easy!"), Cron.Daily);

RecurringJob.AddOrUpdate(() => Console.Write("Powerful!"), "0 12 * */2");
```

### 创建更新删除任务

```c#
[ApiController]
[Route("api/[controller]/[action]")]
public class JobManageController : ControllerBase
{
    /// <summary>
    /// 创建任务
    /// </summary>
    /// <returns></returns>
    [HttpGet]
    public bool CreateJob(string key)
    {
        var cron = "0/5 * * * * ?";
        RecurringJob.AddOrUpdate(key, () => JobHandler(key), cron, new RecurringJobOptions
        {
            TimeZone = TimeZoneInfo.Local
        });

        //RecurringJob.AddOrUpdate(key, () => JobHandler(key), cron, TimeZoneInfo.Local);

        return true;
    }

    /// <summary>
    /// 更新任务
    /// </summary>
    /// <param name="key"></param>
    /// <returns></returns>
    [HttpGet]
    public bool UpdateJob(string key)
    {
        var cron = "0/10 * * * * ?";
        RecurringJob.AddOrUpdate(key, () => JobHandler(key), cron, new RecurringJobOptions()
        {
            TimeZone = TimeZoneInfo.Local
        });

        return true;
    }

    /// <summary>
    /// 删除任务
    /// </summary>
    /// <param name="jobKey"></param>
    /// <returns></returns>
    [HttpGet]
    public bool DeleteJob(string jobKey)
    {
        RecurringJob.RemoveIfExists(jobKey);
        return true;
    }

    [NonAction]
    // [AutomaticRetry(Attempts = 2)]
    public void JobHandler(string key)
    {
        Console.WriteLine($"job:{key}执行  当前时间：{DateTime.Now.ToStandardString()}");
    }
}
```

### 持久化支持

SQL Server 与 Redis 持久化支持。Hangfire使用持久性存储来存储作业、队列和统计信息，并让它们在应用程序重启后继续存在。存储子系统的抽象程度足以支持经典的SQL Server和快速的Redis。

- SQLServer提供了简化的安装和常规的维护计划
- Redis提供了惊人的速度，尤其是与sqlserver相比。安装nuget包：Hangfire.Redis.StackExchange
- Pgsql：安装nuget包：Hangfire.PostgreSql

```c#
builder.Services.AddHangfire(configuration => configuration
        .SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
        .UseSimpleAssemblyNameTypeSerializer()
        .UseRecommendedSerializerSettings()
        .UseInMemoryStorage() // 使用内存数据库
    // .UseRedisStorage("172.16.127.100:25089,defaultDatabase=0")); // 使用redis

// 定时任务mysql存储配置
// .UseStorage(new MySqlStorage(builder.Configuration["ConnectionStrings:HangfireConnection"],
//     new MySqlStorageOptions
//     {
//         TransactionIsolationLevel = IsolationLevel.ReadCommitted, //事务隔离级别，默认为读取已提交
//         QueuePollInterval = TimeSpan.FromSeconds(15), //队列检测频率，秒级任务需要配置短点，一般任务可以配置默认时间
//         JobExpirationCheckInterval = TimeSpan.FromHours(1),//作业到期检查间隔（管理过期记录）。默认值为1小时
//         CountersAggregateInterval = TimeSpan.FromMinutes(5),//聚合计数器的间隔。默认为5分钟
//         PrepareSchemaIfNecessary = true,//设置true，则会自动创建表
//         DashboardJobListLimit = 50000,//仪表盘作业列表展示条数限制
//         TransactionTimeout = TimeSpan.FromMinutes(1),//事务超时时间，默认一分钟
//         TablesPrefix = "Hangfire" // 表前缀
//     };

    // 定时任务postgres存储配置
    // .UsePostgreSqlStorage(
    //     "host=localhost;port=5432;database=test;username=postgres;password=123456;",
    //     new PostgreSqlStorageOptions { SchemaName = "hangfire" })
);
```

### 认证

安装nuget包

```xml
<PackageReference Include="Hangfire.Dashboard.BasicAuthorization" Version="1.0.2" />
```

然后配置认证内容

```c#
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();

// 仪表盘配置  不需要认证即可访问
app.UseHangfireDashboard();

//面板  需要认证才可访问
app.UseHangfireDashboard("/job", new DashboardOptions
{
    AppPath = "http://localhost:7000/test", //返回时跳转的地址
    DisplayStorageConnectionString = false, //是否显示数据库连接信息
    IsReadOnlyFunc = _ => false,
    Authorization = new[]
    {
        new BasicAuthAuthorizationFilter(new BasicAuthAuthorizationFilterOptions
        {
            RequireSsl = false, //是否启用ssl验证，即https
            SslRedirect = false,
            LoginCaseSensitive = true,
            Users = new[]
            {
                new BasicAuthAuthorizationUser
                {
                    Login = "admin", //登录账号
                    PasswordClear = "123456" //登录密码,
                }
            }
        })
    }
});

//只读面板，只能读取不能操作
app.UseHangfireDashboard("/job-read", new DashboardOptions
{
    IgnoreAntiforgeryToken = true,
    AppPath = "http://localhost:7000/job-read", //返回时跳转的地址
    DisplayStorageConnectionString = false, //是否显示数据库连接信息
    IsReadOnlyFunc = _ => true,
    Authorization = new[]
    {
        new BasicAuthAuthorizationFilter(new BasicAuthAuthorizationFilterOptions
        {
            RequireSsl = false, //是否启用ssl验证，即https
            SslRedirect = false,
            LoginCaseSensitive = true,
            Users = new[]
            {
                new BasicAuthAuthorizationUser
                {
                    Login = "read",
                    PasswordClear = "only"
                },
                new BasicAuthAuthorizationUser
                {
                    Login = "guest",
                    PasswordClear = "123@123"
                }
            }
        })
    }
});
```



## 资料

[https://mp.weixin.qq.com/s/18eYC6QR7VFANE7mIKqqhA](https://mp.weixin.qq.com/s/18eYC6QR7VFANE7mIKqqhA) | .NET Core/.NET5/.NET6 开源项目任务调度组件汇总
后台任务和计划作业：[https://dev.to/bytehide/background-tasks-and-scheduled-jobs-in-net-meet-hangfire-30pd](https://dev.to/bytehide/background-tasks-and-scheduled-jobs-in-net-meet-hangfire-30pd)
