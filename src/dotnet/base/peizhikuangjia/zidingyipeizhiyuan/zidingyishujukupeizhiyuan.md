---
title: 自定义数据库配置源
lang: zh-CN
date: 2023-03-18
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: zidingyishujukupeizhiyuan
slug: rngtdq
docsId: '65369120'
---

## 目的
创建一个自定义配置提供程序，从数据库读取我们的配置

## 操作

### 初始化数据库
在我们开始之前，我们需要先安装两个 Nuget 包：
```csharp
Install-Package Microsoft.EntityFrameworkCore.SqlServer -v 3.1.7
```
我们需要这个包，因为我们将使用 SQL Server 实例，并且：
```csharp
Install-Package Microsoft.EntityFrameworkCore.Tools -v 3.1.7
```
因为我们将通过 CLI 执行数据库的初始创建和迁移。
我们需要一个包含键值配置对的类（Models 文件夹）：
```csharp

public class ConfigurationEntity
{
    [Key]
    public string Key { get; set; }
    public string Value { get; set; }
}
```
和一个DbContext类（模型文件夹）：
```csharp
public class ConfigurationDbContext : DbContext
{
    public ConfigurationDbContext(DbContextOptions options)
        : base(options)
    {
    }

    public DbSet<ConfigurationEntity> ConfigurationEntities { get; set; }
}
```
我们只需要一个DbSet的ConfigurationEntity，这将映射到我们的数据库中的表。
现在我们只需要ConfigureServices()在Startup类中的方法中建立到我们的服务器的连接：
```csharp
services.AddDbContext<ConfigurationDbContext>(opts =>
    opts.UseSqlServer(Configuration.GetConnectionString("sqlConnection")));
```
当然，您需要将appsettings.json文件中的连接字符串更改为您的数据库。如果您使用的是 SqlExpress，它很可能如下所示：
```csharp
"ConnectionStrings": {
    "sqlConnection": "server=.\\SQLEXPRESS; database=CodeMazeCommerce; Integrated Security=true"
},
```
就是这样，现在我们可以简单地通过包管理器控制台添加初始迁移： PM> Add-Migration InitialSetup
并将该迁移应用于数据库： Update-Database
现在我们的数据库已创建并准备好用于存储配置数据。

### 实现自定义EFCore提供程序
首先，让我们在 Models 文件夹中创建一个文件夹 ConfigurationProviders，以便正确地对我们的类进行分组。
之后，我们需要通过继承ConfigurationProvider类来实际创建一个配置提供者。我们将在ConfigurationProviders文件夹中创建我们自己的提供程序类并将其命名为EFConfigurationProvider：
```csharp
public class EFConfigurationProvider : ConfigurationProvider
{
    public EFConfigurationProvider(Action<DbContextOptionsBuilder> optionsAction)
    {
        OptionsAction = optionsAction;
    }

    Action<DbContextOptionsBuilder> OptionsAction { get; }

    public override void Load()
    {
        var builder = new DbContextOptionsBuilder<ConfigurationDbContext>();

        OptionsAction(builder);

        using (var dbContext = new ConfigurationDbContext(builder.Options))
        {
            dbContext.Database.EnsureCreated();

            Data = !dbContext.ConfigurationEntities.Any()
                ? CreateAndSaveDefaultValues(dbContext)
                : dbContext.ConfigurationEntities.ToDictionary(c => c.Key, c => c.Value);
        }
    }

    private static IDictionary<string, string> CreateAndSaveDefaultValues(ConfigurationDbContext dbContext)
    {
        var configValues =
            new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
            {
                { "Pages:HomePage:WelcomeMessage", "Welcome to the ProjectConfigurationDemo Home Page" },
                { "Pages:HomePage:ShowWelcomeMessage", "true" },
                { "Pages:HomePage:Color", "black" },
                { "Pages:HomePage:UseRandomTitleColor", "true" }
            };

        dbContext.ConfigurationEntities.AddRange(configValues
            .Select(kvp => new ConfigurationEntity
            {
                Key = kvp.Key,
                Value = kvp.Value
            })
            .ToArray());

        dbContext.SaveChanges();

        return configValues;
    }
}
```
这门课乍一看可能有点吓人，但其实没那么吓人。
构造函数有一个参数，即委托`Action<DbContextOptionsBuilder>` optionsAction。稍后我们将使用DbContextOptionsBuilder该类为我们的数据库定义上下文。我们之前定义连接字符串时已经完成了。我们公开了上下文选项构建器，以便向我们的自定义提供程序提供该选项。
我们正在重写该Load()方法，以便ConfigurationEntity使用数据库中的数据填充我们的方法，或者如果数据库表为空，则创建一些默认的方法。这里的所有都是它的。
接下来，我们要将我们的配置提供程序注册为源。为了做到这一点，我们需要实现IConfigurationSource接口。所以让我们EFConfigurationSource在ConfigurationProviders文件夹中创建类：
```csharp

public class EFConfigurationSource : IConfigurationSource
{
    private readonly Action<DbContextOptionsBuilder> _optionsAction;

    public EFConfigurationSource(Action<DbContextOptionsBuilder> optionsAction)
    {
        _optionsAction = optionsAction;
    }

    public IConfigurationProvider Build(IConfigurationBuilder builder)
    {
        return new EFConfigurationProvider(_optionsAction);
    }
}
```
我们只需要实现该Build()方法，在我们的例子中，它会初始化配置，其中包含我们通过配置源构造函数发送的选项。
这看起来真的很令人困惑，所以让我们看看如何将我们的数据库配置提供程序添加到配置源列表中。我们将以与以前类似的方式进行：
```csharp
public static IHostBuilder CreateHostBuilder(string[] args) =>
    Host.CreateDefaultBuilder(args)
        .ConfigureWebHostDefaults(webBuilder =>
        {
            webBuilder.UseStartup<Startup>();
        })
        .ConfigureAppConfiguration((hostingContext, configBuilder) =>
        {
            var config = configBuilder.Build();
            var configSource = new EFConfigurationSource(opts =>
                opts.UseSqlServer(config.GetConnectionString("sqlConnection")));
            configBuilder.Add(configSource);
        });
```
如您所见，我们正在构建配置构建器以获取IConfiguration. 我们需要它，因为我们的连接字符串存储在appsettings.json文件中。现在我们可以使用该连接字符串创建一个配置源，并使用该configBuilder.Add()方法将其添加到现有配置源中。
现在我们要稍微清除一下 appsettings.json 文件：
```csharp
{
    "Logging": {
        "LogLevel": {
            "Default": "Information",
            "Microsoft": "Warning",
            "Microsoft.Hosting.Lifetime": "Information"
        }
    },
    "ConnectionStrings": {
        "sqlConnection": "server=.\\SQLEXPRESS; database=CodeMazeCommerce; Integrated Security=true"
    },
    "AllowedHosts": "*"
}
```
我们删除了“页面”部分以确保它是从数据库中读取的。
我们需要删除AddDbContext()我们之前在 Startup 类中使用的方法，因为它不再需要了。
```csharp
public void ConfigureServices(IServiceCollection services)
{
    //remove!!!
    services.AddDbContext<ConfigurationDbContext>(opts =>
            opts.UseSqlServer(Configuration.GetConnectionString("sqlConnection")));
    ...
}
```
由于本示例不需要任何迁移，因此请通过 SQL Management Studio 或通过 SQL Server 对象资源管理器手动创建一个名为“CodeMazeCommerce”的数据库。
就是这样，让我们运行应用程序。

## 资料
[https://mp.weixin.qq.com/s/LmZeBUxgcPi2QBKtx9bnJg](https://mp.weixin.qq.com/s/LmZeBUxgcPi2QBKtx9bnJg) | ASP.NET Core 配置 - 创建自定义配置提供程序
