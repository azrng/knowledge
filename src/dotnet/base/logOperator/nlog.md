---
title: Nlog
lang: zh-CN
date: 2023-03-08
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: netcoreshiyongnlog
slug: xfutro
docsId: '29412504'
---

## 1. 介绍
NLog是适用于各种.NET平台（包括.NET标准）的灵活，免费的日志记录平台，支持数据库、文件、控制台。

## 2. 输入到文件

### 2.1 引用nuget包
```csharp
    <PackageReference Include="NLog" Version="4.7.6" />
    <PackageReference Include="NLog.Web.AspNetCore" Version="4.9.3" />
```

### 2.2 创建NLog配置文件
在项目目录中新建一个xml文件的nlog.config
```csharp
<?xml version="1.0" encoding="utf-8" ?>
<nlog xmlns="http://www.nlog-project.org/schemas/NLog.xsd"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <targets async="true">
    <target name="file" xsi:type="File"
           layout="${longdate} ${logger} ${message}${exception:format=ToString}"
           fileName="${basedir}/logs/${date:format=yyyy-MM-dd}.txt"
           keepFileOpen="true"
           encoding="utf-8" />
    <target name="console" xsi:type="Console">
      <attribute name="time" layout="${date:format=yyyy-MM-dd HH\:mm\:ss.fff zzz}" />
      <attribute name="category" layout="${logger}" />
      <attribute name="log_level" layout="${level:lowerCase=true}" />
      <attribute name="message" layout="${message}" />
      <attribute name="trace_id" layout="${aspnet-TraceIdentifier:ignoreActivityId=true}" />
      <attribute name="user_id" layout="${aspnet-user-identity}" />
      <!--取得该条日志生产者名字-->
      <attribute name="exception" layout="${exception:format=tostring}" />
    </target>
  </targets>

  <rules>
    <logger name="*" minlevel="Info" writeTo="console"   ruleName="console" />

    <logger name="*" minlevel="Debug" writeTo="file" />
  </rules>
</nlog>
```

### 2.3 Program中修改
```csharp
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using NLog.Web;
using System;

namespace NlogDemo
{
    public static class Program
    {
        public static void Main(string[] args)
        {
            var logger = NLogBuilder.ConfigureNLog("nlog.config").GetCurrentClassLogger();
            try
            {
                logger.Debug("init main");
                CreateHostBuilder(args).Build().Run();
            }
            catch (Exception ex)
            {
                //NLog: catch setup errors
                logger.Error(ex, "Stopped program because of exception");
                throw;
            }
            finally
            {
                NLog.LogManager.Shutdown();
            }
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
             .ConfigureWebHostDefaults(webBuilder =>
             {
                 webBuilder.UseStartup<Startup>();
             })
                .ConfigureLogging((_, loggerBuilder) =>
                {
                    loggerBuilder.ClearProviders();
                    loggerBuilder.SetMinimumLevel(LogLevel.Information);
                })
            .UseNLog();
    }
}
```

### 2.4 配置日志级别
```csharp
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft": "Warning",
      "Microsoft.Hosting.Lifetime": "Information"
    }
  }
}

```

### 2.5 控制器使用
```csharp
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
            _logger.LogDebug(1, "NLog injected into HomeController");
        }

        [HttpGet]
        public string Get()
        {
            _logger.LogTrace("Trace");
            _logger.LogDebug("debug");
            _logger.LogInformation("info");
            _logger.LogWarning("warn");
            _logger.LogError("error");
            _logger.LogCritical("Critical");

            return default;
        }
```
查看日志文件
![image.png](/common/1619886030977-ef9d2c9c-fb94-41d7-a707-33eee277bbd9.png)

## 3. 参考文档
> [https://github.com/NLog/NLog/wiki/Getting-started-with-ASP.NET-Core-5](https://github.com/NLog/NLog/wiki/Getting-started-with-ASP.NET-Core-5)

 

 

