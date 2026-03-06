---
title: 常用操作
lang: zh-CN
date: 2022-07-24
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
slug: xh13t6
docsId: '84374590'
---

## 需求
对控制台实现以下操作

- 配置的获取
- DI注入

## 实现
创建CreateHostHelper类
```csharp
public static class CreateHostHelper
{
    internal static IHost CreateHostBuilder(string[] args)
    {
        //设置当前环境
        var environmentName = "Development";

        var builder = new ConfigurationBuilder();
        // 定义 Serilog 配置
        Log.Logger = new LoggerConfiguration()  //初始化 Logger 配置
            .ReadFrom.Configuration(builder.Build()) //将 Serilog 连接到我们的配置
            .Enrich.FromLogContext() //从装入的 Serilog 向日志添加更多信息
            .WriteTo.Console() //决定在哪里显示日志
            .CreateLogger(); //初始化 Logger

        Log.Logger.Information("Application Starting");
        return Host.CreateDefaultBuilder(args)
            .ConfigureAppConfiguration((hostingContext, config) =>
            {
                config.SetBasePath(Directory.GetCurrentDirectory());
                config.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);
                config.AddJsonFile("appsettings.{env.EnvironmentName}.json", true, true);
                config.AddEnvironmentVariables();

                if (args!=null)
                {
                    config.AddCommandLine(args);
                }
            })
            .ConfigureServices((hostContext, services) =>
            {
                //添加默认服务
                services.AddLogging(x => x.AddConsole());

                //其他服务
                services.AddScoped<IUserService, UserService>();
                services.AddScoped<ILogService, LogService>();
            })
            .UseEnvironment(environmentName)
            .UseSerilog().Build();//添加serilog
    }
}
```
在program中使用
```csharp
var host = CreateHostHelper.CreateHostBuilder(args);
//方法一
//var dataService = ActivatorUtilities.CreateInstance<UserService>(host.Services);
//var cc = dataService.GetInfo();

//方法二
using (var scope = host.Services.CreateScope())
{
    var userService = scope.ServiceProvider.GetRequiredService<IUserService>();
    var info = userService.GetInfo();
}
```
关于UserService的方法如下
```csharp
public interface IUserService
{
    /// <summary>
    ///获取信息
    /// </summary>
    /// <returns></returns>
    string GetInfo();
}

public class UserService : IUserService
{
    private readonly ILogService _logService;
    private readonly IConfiguration _configuration;

    public UserService(IConfiguration configuration, ILogService logService)
    {
        _configuration = configuration;
        _logService = logService;
    }

    public string GetInfo()
    {
        var aaa = _configuration["ConnectionStrings:DefaultConnection"];
        _logService.Write(aaa);
        return "成功";
    }
}
```
