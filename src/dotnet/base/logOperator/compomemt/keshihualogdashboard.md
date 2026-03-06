---
title: 可视化LogDashboard
lang: zh-CN
date: 2023-10-02
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: keshihualogdashboard
slug: qfogq7
docsId: '43801665'
---

## 介绍
`LogDashboard`是在github上开源的aspnetcore项目, 它旨在帮助开发人员排查项目运行中出现错误时快速查看日志排查问题。
> 官网地址：[https://doc.logdashboard.net/](https://doc.logdashboard.net/)
> GitHub：[https://github.com/realLiangshiwei/LogDashboard](https://github.com/realLiangshiwei/LogDashboard)

支持的日志组件：nlog、log4net、serilog
支持的数据源：txt、数据库

## 简单使用
这里使用serilog做日志组件，数据源使用txt，认证访问使用简单的固定账号密码

### 程序
本次事例使用的是ASP.NET Core Web API程序框架，版本是.net5

### 安装组件
>     <PackageReference Include="LogDashboard" Version="1.4.6" />
>     <PackageReference Include="Serilog.AspNetCore" Version="4.1.0" />


### 配置日志
```csharp
    public static class Program
    {
        public static void Main(string[] args)
        {
            string logOutputTemplate = "{Timestamp:HH:mm:ss.fff zzz} || {Level} || {SourceContext:l} || {Message} || {Exception} ||end {NewLine}";
            Log.Logger = new LoggerConfiguration()
              .MinimumLevel.Debug()
              .MinimumLevel.Override("Default", LogEventLevel.Information)
              .MinimumLevel.Override("Microsoft", LogEventLevel.Error)
              .MinimumLevel.Override("Microsoft.Hosting.Lifetime", LogEventLevel.Information)
              .Enrich.FromLogContext()
              .WriteTo.Console(theme: Serilog.Sinks.SystemConsole.Themes.AnsiConsoleTheme.Code)
              .WriteTo.File($"{AppContext.BaseDirectory}Logs/netcore.log", rollingInterval: RollingInterval.Day, outputTemplate: logOutputTemplate)
              .CreateLogger();
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
            .UseSerilog()
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
```

### 输出日志
```csharp
            Log.Information("ConfigureServices");
            Log.Error("测试Serilog添加异常日志");
            Log.Fatal("测试Serilog添加严重日志");
```

### 配置界面
```csharp
            //在浏览器中导航到 /logdashboard
            services.AddLogDashboard(opt =>
            {
                opt.AddAuthorizationFilter(new LogDashboardBasicAuthFilter("admin", "123456"));//配置默认的
            });


            app.UseLogDashboard();
```
> 授权访问支持：角色过滤器、WWW-authenticate过滤器、自定义过滤器


### 访问
![image.png](/common/1618728496588-3edb734c-2f97-4b1a-a862-debdf836f1b8.png)
输入刚刚配置好的账号密码
![image.png](/common/1618728549145-37e03444-0103-4f04-917a-3d153ae07731.png)
> 这里就是我们的可视化界面

