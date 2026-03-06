---
title: 常用Program配置
lang: zh-CN
date: 2023-10-14
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: changyongprogrampeizhi
slug: gkway8
docsId: '65756629'
---

## 示例一
```csharp
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
ConfigureServices(builder.Services, builder.Configuration);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => { c.SwaggerEndpoint("/swagger/v1/swagger.json", "v1"); });
}

app.UseAuthorization();

app.MapControllers();

app.Run();

static void ConfigureServices(IServiceCollection services, IConfiguration configuration)
{
    services.AddControllers();
    // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
    services.AddEndpointsApiExplorer();
    services.AddSwaggerGen(c =>
    {
        c.SwaggerDoc("v1", new OpenApiInfo
        {
            Version = "v1",
            Title = " 接口文档",
        });
    });

    // 其他自定义的注入
}
```

## 示例二
```csharp
public class Startup
{
    public Startup(IConfiguration configuration)
    {
        Configuration = configuration;
    }

    public IConfiguration Configuration { get; }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddControllers();
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo { Title = "QuartzJobByAttribute", Version = "v1" });
        });

    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(WebApplication app, IWebHostEnvironment env)
    {
        if (env.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "QuartzJobByAttribute v1"));
        }

        app.UseAuthorization();

        app.MapControllers();
    }
}
```
然后program中代码就是这么写了

```c#
var builder = WebApplication.CreateBuilder(args);

var startup = new Startup(builder.Configuration);
startup.ConfigureServices(builder.Services);

var app = builder.Build();
startup.Configure(app, builder.Environment);
app.Run();
```

不喜欢ConfigureService()和Configure()这两个名称，因为它们并没有确切定义它们的用途

```csharp
var builder = WebApplication.CreateBuilder(args);
var startup = new Startup(builder.Configuration);
startup.RegisterServices(builder.Services);

var app = builder.Build();
startup.SetupMiddlewares(app, builder.Environment);
app.Run();
```

## 设置XML文档

生成xml文档以及忽略警告

```csharp
<PropertyGroup>
	<DocumentationFile>NetByDocker.xml</DocumentationFile>
	<NoWarn>1701;1702;1591</NoWarn>
</PropertyGroup>
```
