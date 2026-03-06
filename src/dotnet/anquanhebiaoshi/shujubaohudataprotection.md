---
title: 数据保护DataProtection
lang: zh-CN
date: 2022-03-05
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: shujubaohudataprotection
slug: zn3o7v
docsId: '30080403'
---
> 本文示例环境：vs2022、.Net6


## 需求
是一个简单、易用的加密API，可以用来保护数据，防止配置数据泄露。

## 设计原则

- 配置应该尽可能简单，默认情况下应该可以零配置，开发人员可以直接运行。
- 提供一个简单的API，容易使用，并且不会轻易用错。
- 开发人员不需要专门学习如何管理这些密钥(公私钥)，系统应该自动选择算法和管理密钥的生命周期。理想情况下开发人员都不应该访问这些密钥的原始文件。
- 密钥应该是受保护的，不能被远程调用到。系统应该有一个自动保护机制并且可以自动应用。

## 操作
ASP.NET Core提供了一套简单易用的API 用来保护数据。根据本地的一个key来生成加密码，然后再用这key来讲解密，如果key不一样，那么就解密失败，默认情况下这key的有效期是90天，下面就开始简单了解下DataProtection(非对称加密)。
默认.Net Core API框架已经引用了下面的包，无需再次安装
```csharp
<PackageReference Include="Microsoft.AspNetCore.DataProtection" Version="6.0.2" />
```

### 基础了解
注入到ServiceCollection 
```csharp
//添加数据保护
builder.Services.AddDataProtection();
```
使用示例
```csharp
[Route("api/[controller]")]
[ApiController]
public class TestController : ControllerBase
{
    private readonly IDataProtector _protector;

    public TestController(IDataProtectionProvider provider)
    {
        _protector = provider.CreateProtector("biaoshi");
    }

    [HttpGet]
    public string GetInfo()
    {
        //加密
        var protectedData = _protector.Protect("Hello World");
        Console.WriteLine(protectedData);
        //解密
        var origin = _protector.Unprotect(protectedData);
        Console.WriteLine(origin);
        return origin;
    }
}
```
输出结果：
```csharp
CfDJ8CXNH28p-ZVLm46ClomPArGgkBb2tjI_5NBWUjKZpEYvJZuGOnCc35DNJuqxzpTXaRA2ooAFw_gMx7uXTqVIUkZpeTWLc2mWJGofAaS2QEXfs-nSQGXU9qDOpJnsul5nMA
Hello World
```
当前电脑加密后的内容，只能在当前电脑使用，因为是通过非对称加密的，私钥是系统内部帮你维护了。
> windows系统下私钥默认存放在 C:\Users\用户名\AppData\Local\ASP.NET\DataProtection-Keys


### 常用配置
指定私钥存储位置
```csharp
builder.Services.AddDataProtection().PersistKeysToFileSystem(new DirectoryInfo(@"\\Temp"));
```
修改默认的保存时间，默认保存时间是90天。
```csharp
builder.Services.AddDataProtection()
    .SetDefaultKeyLifetime(TimeSpan.FromDays(4));
```
默认情况下，即使使用相同的物理密钥库，Data Protection 也会把不同的应用程序隔离开，因为这样可以防止从一个应用程序获取另外一个应用程序的密钥。所以如果是相同的应用程序，可以设置相同的应用程序名称:
```csharp
builder.Services.AddDataProtection()
    .SetApplicationName("app1");
```
有时候需要禁用应用程序生成密钥，或者是说我只有一个程序用来生成或者管理密钥，其他程序只是负责读的话
```csharp
builder.Services.AddDataProtection()
    .DisableAutomaticKeyGeneration();
```
修改加密算法
```csharp
builder.Services.AddDataProtection()
    .UseCryptographicAlgorithms(new  AuthenticatedEncryptorConfiguration()
   {
       EncryptionAlgorithm = EncryptionAlgorithm.AES_256_CBC,
       ValidationAlgorithm = ValidationAlgorithm.HMACSHA256
   });

builder.Services.AddDataProtection()
    .UseCustomCryptographicAlgorithms(new ManagedAuthenticatedEncryptorConfiguration
    {
        EncryptionAlgorithmType = typeof(Aes),
        EncryptionAlgorithmKeySize = 256,
        ValidationAlgorithmType = typeof(HMACSHA256)
    });
```

### 私钥存储
上面代码只是实现了单机部署，如果集群部署，比如k8s中的不同pod，生成的key分别保存在自己的pod里，那么外部访问又是随机分配的，这时就会频繁出现解密失败的情况，这就要集中管理key了，用redis或数据库都可以。

#### Redis方案
安装包
```csharp
<PackageReference Include="Microsoft.AspNetCore.DataProtection.StackExchangeRedis" Version="6.0.2" />
```
配置
```csharp
builder.Services.AddDataProtection()
    .PersistKeysToStackExchangeRedis(xxx);
```

#### SqlServer
需要先创建表
```plsql

CREATE TABLE [dbo].[DataProtectionKeys1](
  [ID] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY ,
  [FriendlyName] [varchar](64) NULL,
  [Xml] [text] NULL
 )
```
需要引用EFCore相关的包
```plsql
Microsoft.AspNetCore.DataProtection 
Microsoft.AspNetCore.DataProtection.EntityFrameworkCore 
Microsoft.EntityFrameworkCore 
Microsoft.EntityFrameworkCore.SqlServer
```
代码要换成EF方式持久化key，要注入EF的Context，然后注入数据保护对象时指明持久化的方式
```plsql

using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.DataProtection.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<DataProtContext>(options =>
      options.UseSqlServer(builder.Configuration.GetConnectionString("DataProtDB")));
builder.Services.AddDataProtection().PersistKeysToDbContext<DataProtContext>();
var app = builder.Build();

app.MapGet("/encrypt/{str}", (IDataProtectionProvider provider, ILogger<Program> logger, string str) =>
{
    var protector = provider.CreateProtector("a.b.c");
    var sec = protector.Protect(str);
    logger.LogInformation(sec);
    return "加密：" + sec;
});
app.MapGet("/decrypt/{sec}", (IDataProtectionProvider provider, ILogger<Program> logger, string sec) =>
{
    var protector = provider.CreateProtector("a.b.c");
    var str = protector.Unprotect(sec);
    logger.LogInformation(str);
    return "解密：" + str;
});

app.Run();

class DataProtContext : DbContext, IDataProtectionKeyContext
{
    public DbSet<DataProtectionKey> DataProtectionKeys { get; set; }

    public DataProtContext(DbContextOptions<DataProtContext> options)
          : base(options)
    {}
}
```
如果生成的加密串需要时效性，需要把生成的Protector转成TimeLimitedDataProtector来加解密，如下：
```plsql
app.MapGet("/encrypt/{str}", (IDataProtectionProvider provider, ILogger<Program> logger, string str) =>
{
    var protector = provider.CreateProtector("a.b.c");
    var sec = protector.ToTimeLimitedDataProtector().Protect(str, TimeSpan.FromSeconds(30));
    logger.LogInformation(sec);
    return "加密：" + sec;
});
app.MapGet("/decrypt/{sec}", (IDataProtectionProvider provider, ILogger<Program> logger, string sec) =>
{
    var protector = provider.CreateProtector("a.b.c");
    var str = protector.ToTimeLimitedDataProtector().Unprotect(sec);
    logger.LogInformation(str);
    return "解密：" + str;
});
```
如果加密串过期提交，会直接报错。
> 示例来自：[https://mp.weixin.qq.com/s/A7uL_fhqXVzJeU-oRxuaGA](https://mp.weixin.qq.com/s/A7uL_fhqXVzJeU-oRxuaGA)


## 资料
[https://mp.weixin.qq.com/s/DMWgv3pk7PQVUpAxUSMwyg](https://mp.weixin.qq.com/s/DMWgv3pk7PQVUpAxUSMwyg) | 在Asp.NET Core中如何优雅的管理用户机密数据
ASP.NET Core 数据保护（Data Protection 集群场景）【上】: https://www.cnblogs.com/savorboard/p/dotnetcore-data-protection.html
ASP.NET Core 数据保护（Data Protection 集群场景）【中】: https://www.cnblogs.com/savorboard/p/dotnet-core-data-protection.html
ASP.NET Core 数据保护（Data Protection 集群场景）【下】: https://www.cnblogs.com/savorboard/p/dotnetcore-data-protected-farm.html
