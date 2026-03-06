---
title: 数据持久化
lang: zh-CN
date: 2023-10-19
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: shujuchijiuhua
slug: tr3g75
docsId: '75757987'
---

## 前言
前面的篇章介绍中，一些基础配置如API资源、客户端资源等数据以及使用过程中发放的令牌等操作数据，我们都是通过将操作数据和配置数据存储在内存中进行实现的，而在实际开发生产中，我们需要考虑如何处理数据持久化呢？
这时「IdentityServer4」具有良好的扩展性，其中一个可扩展点是用于「IdentityServer」所需数据的存储机制，进行持久化操作。
下面将如何配置「IdentityServer」以使用「EntityFramework」（EF）作为此数据的存储机制把这些数据存储到「MySql」数据库， 这样更符合我们实际生产环境的需求。

## 8. 数据持久化
在我们的 「IdentityServer4」中官方定义的两个上下文，是有两种类型的数据需要持久化到数据库中
> 1、「配置数据」（资源、客户端、身份）；//这里是对应配置上下文 「ConfigurationDbContext」
> 2、「IdentityServer」在使用时产生的 「操作数据」（令牌，代码和用户的授权信息consents）；//这里是对应操作上下文 「PersistedGrantDbContext」

「这两个上下文以及对应的数据模型，已经被 IdentityServer4 官方给封装好了」， 我们不需要做额外的操作，直接进行迁移即可使用。

### 8.1 ConfigurationDb
ConfigurationDbContext (IdentityServer configuration data) —— 负责数据库中对客户端、资源和 CORS 设置的配置存储；
如果需要从 EF 支持的数据库加载客户端、标识资源、API 资源或 CORS 数据 (而不是使用内存中配置)， 则可以使用配置存储。此支持提供 IClientStore、IResura Store 和 ICorsPolicyService 扩展性点的实现。这些实现使用名为 ConfigurationDbContext 的 「dbcontext」 派生类对数据库中的表进行建模。

### 8.2 PersistedGrantDb
PersistedGrantDbContext (IdentityServer operational data.) -—— 负责存储同意、授权代码、刷新令牌和引用令牌；
如果需要从 EF 支持的数据库 (而不是默认的内存数据库) 加载授权授予、同意和令牌 (刷新和引用)， 则可以使用操作存储。此支持提供了 IPersistedGrantStore 扩展点的实现。实现使用名为 PersistedGrantDbContext 的 「dbcontext」 派生类对数据库中的表进行建模。

### 8.3 实践

#### 8.3.1 新建站点
建立一个MVC的Asp.Net Core项目 ，使用MVC模板

#### 8.3.2 Nuget包
IdentityServer4.EntityFramework以及EF相关包
```csharp
<PackageReference Include="IdentityServer4" Version="4.1.2" />
<PackageReference Include="IdentityServer4.AspNetIdentity" Version="4.1.2" />
<PackageReference Include="IdentityServer4.EntityFramework" Version="4.1.2" />
```
因为本文中使用的是MySql数据库，所以需要安装对应的EF程序包对数据库的支持。
```csharp
<PackageReference Include="Pomelo.EntityFrameworkCore.MySql" Version="6.0.1" />
```

#### 8.3.3 数据库上下文
appsettings.json
```csharp
"ConnectionStrings": {
  "ConfigurationConnection": "server=localhost;userid=root;pwd=123456;port=5433;database=sso_config;sslmode=none;",
  "PersistedGrantConnection": "server=localhost;userid=root;pwd=123456;port=5433;database=sso_persisted;sslmode=none;"
},
```
配置连接数据库
```csharp
var configurationConnectionString = configuration.GetConnectionString("ConfigurationConnection");
var persistedGrantConnectionString = configuration.GetConnectionString("PersistedGrantConnection");
```
配置数据库服务
```csharp
static void ConfigureServices(IServiceCollection services, IConfiguration configuration)
{
    services.AddControllersWithViews();

    var configurationConnectionString = configuration.GetConnectionString("ConfigurationConnection");
    var persistedGrantConnectionString = configuration.GetConnectionString("PersistedGrantConnection");

    var builder = services.AddIdentityServer(options =>
    {
        options.Events.RaiseErrorEvents = true;
        options.Events.RaiseInformationEvents = true;
        options.Events.RaiseFailureEvents = true;
        options.Events.RaiseSuccessEvents = true;

        //配置认证地址，本地就这么写，生产环境需要改为外网地址或者域名
        //options.IssuerUri = "http://localhost:5014";

        // see https://identityserver4.readthedocs.io/en/latest/topics/resources.html
        options.EmitStaticAudienceClaim = true;
    }).AddConfigurationStore(options =>
        {
            // 配置文件（客户端和资源）负责数据库中对客户端、资源和 CORS 设置的配置存储
            options.ConfigureDbContext = builder => builder.UseMySql(configurationConnectionString, ServerVersion.AutoDetect(configurationConnectionString),
                sql => sql.MigrationsAssembly(typeof(SeedData).Assembly.FullName));
        })
        // 操作记录到数据库 负责存储同意、授权代码、刷新令牌和引用令牌
        .AddOperationalStore(options =>
        {
            options.ConfigureDbContext = builder => builder.UseMySql(persistedGrantConnectionString, ServerVersion.AutoDetect(persistedGrantConnectionString),
                                    sql => sql.MigrationsAssembly(typeof(SeedData).Assembly.FullName));

            // 自动清理token
            options.EnableTokenCleanup = true;
            //自动清理token间隔
            options.TokenCleanupInterval = 30;
        }).AddTestUsers(TestUsers.Users());

    // not recommended for production - you need to store your key material somewhere secure
    builder.AddDeveloperSigningCredential();

    // 配置cookie策略  必须添加
    services.Configure<CookiePolicyOptions>(options => options.MinimumSameSitePolicy = SameSiteMode.Lax);
}
```

#### 8.3.4 迁移数据
关于如何生成迁移文件
```csharp
add-migration InitialIdentityServerConfigurationDbMigration -c ConfigurationDbContext -o Data/Migrations/IdentityServer/ConfigurationDb

add-migration InitialIdentityServerPersistedGrantDbMigration -c PersistedGrantDbContext -o Data/Migrations/IdentityServer/PersistedGrantDb

-- 如果要立即生成数据库
update-database -c PersistedGrantDbContext
update-database -c ConfigurationDbContext
```
配置项目启动的时候初始化数据
```csharp
/// <summary>
/// 初始化数据
/// </summary>
public static class SeedData
{
    /// <summary>
    /// 确定初始化数据
    /// </summary>
    /// <param name="serviceProvider"></param>
    public static void EnsureSeedData(IServiceProvider serviceProvider)
    {
        Console.WriteLine("Seeding database...");

        using var scope = serviceProvider.GetRequiredService<IServiceScopeFactory>().CreateScope();
        scope.ServiceProvider.GetService<PersistedGrantDbContext>()?.Database.Migrate();

        var context = scope.ServiceProvider.GetRequiredService<ConfigurationDbContext>();
        context.Database.Migrate();
        EnsureSeedData(context);

        Console.WriteLine("Done seeding database.");
    }

    private static void EnsureSeedData(ConfigurationDbContext context)
    {
        if (!context.Clients.Any())
        {
            Log.Debug("Clients being populated");
            foreach (var client in IdentityConfig.GetClients())
            {
                context.Clients.Add(client.ToEntity());
            }
            context.SaveChanges();
        }
        else
        {
            Log.Debug("Clients already populated");
        }

        if (!context.IdentityResources.Any())
        {
            Log.Debug("IdentityResources being populated");
            foreach (var resource in IdentityConfig.IdentityResources.ToList())
            {
                context.IdentityResources.Add(resource.ToEntity());
            }
            context.SaveChanges();
        }
        else
        {
            Log.Debug("IdentityResources already populated");
        }

        if (!context.ApiScopes.Any())
        {
            Log.Debug("ApiScopes being populated");
            foreach (var resource in IdentityConfig.GetApiScopes().ToList())
            {
                context.ApiScopes.Add(resource.ToEntity());
            }
            context.SaveChanges();
        }
        else
        {
            Log.Debug("ApiScopes already populated");
        }

        if (!context.ApiResources.Any())
        {
            Log.Debug("ApiResources being populated");
            foreach (var resource in IdentityConfig.ApiResources.ToList())
            {
                context.ApiResources.Add(resource.ToEntity());
            }
            context.SaveChanges();
        }
        else
        {
            Log.Debug("ApiResources already populated");
        }
    }
}
```
执行时机
```csharp
var app = builder.Build();
SeedData.EnsureSeedData(app.Services);
```

#### 8.3.5 显示数据库
项目启动会自动生成数据库并将之前内存配置的东西初始化到数据库中。
![image.png](/common/1651493417656-6035a112-e28b-4145-92a3-d0093917480f.png)
使用之前的客户端程序调用项目正常。

## 总结

1. 简单介绍了「IdentityServer4」持久化存储机制相关配置和操作数据，实现了数据迁移,及应用程序的实践。
2. 本篇未对用户进行持久化操作存储说明，因为「IdentityServer4」本就支持了接入其他认证方式，所以自己根据需要进行合理「扩展」的，比如我们可以使用 「Asp.Net Core 自带的 Identity」 身份认证机制来「实现扩展」

## 资料
[https://mp.weixin.qq.com/s/eyzYr11wHwLdmz0xt8lY2Q](https://mp.weixin.qq.com/s/eyzYr11wHwLdmz0xt8lY2Q) | IdentityServer4系列 | 支持数据持久化
