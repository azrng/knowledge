---
title: 说明
lang: zh-CN
date: 2023-04-27
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - log
---

## 概述

log4net是.Net下一个非常优秀的开源日志记录组件。log4net记录日志的功能非常强大。它可以将日志分不同的等级，以不同的格式，输出到不同的媒介。包括到追加文本文件，sqlite数据库，mysql数据库和windows日志中。

## 操作

### 快速上手

新建.Net5的Api服务，引用组件

```csharp
<PackageReference Include="log4net" Version="2.0.12" />
<PackageReference Include="Microsoft.Extensions.Logging.Log4Net.AspNetCore" Version="5.0.1" />
```

老版本(.Net6之前)
引入log4net中间件

```csharp
public static IHostBuilder CreateHostBuilder(string[] args) =>
    Host.CreateDefaultBuilder(args)
    .ConfigureLogging(logging =>
    {
        logging.AddFilter("System", LogLevel.Warning);//忽略掉System开头命名空间下的组件产生的warn级别的日志
        logging.AddFilter("Microsoft", LogLevel.Warning);//忽略掉Microsoft开头命名空间下的组件产生的warn级别的日志
        logging.AddLog4Net();//引用组件
    })
    .ConfigureWebHostDefaults(webBuilder =>
    {
        webBuilder.UseStartup<Startup>();
    });
```

.Net6以及之后，引入log4net中间件

```csharp
//注入Log4Net
builder.Services.AddLogging(cfg =>
{
    //默认的配置文件路径是在根目录，且文件名为log4net.config
    //cfg.AddLog4Net();
    //如果文件路径或名称有变化，需要重新设置其路径或名称
    //比如在项目根目录下创建一个名为config的文件夹，将log4net.config文件移入其中，并改名为log4net.config
    //则需要使用下面的代码来进行配置
    cfg.AddLog4Net(new Log4NetProviderOptions()
    {
        Log4NetConfigFileName = "config/log4net.config",
        Watch = true
    });
});
```

日志级别配置

```csharp
{
  "Logging": {
    "LogLevel": {
      "Default": "Debug",//日志级别配置
      "Microsoft": "Warning",
      "Microsoft.Hosting.Lifetime": "Information"
    }
  }
}

```

使用

```csharp
private readonly ILogger<WeatherForecastController> _logger;

public WeatherForecastController(ILogger<WeatherForecastController> logger)
{
	_logger = logger;
}

[HttpGet]
public string Get()
{
	//默认是输出在控制台上
	_logger.LogTrace("trace");
	_logger.LogDebug("debug");
	_logger.LogInformation("info");
	_logger.LogWarning("warn");
	_logger.LogError("error");
	_logger.LogCritical("critical");
	return "成功";
}
```

输出结果
![image.png](/common/1619104196683-462ed3cf-6d3f-4446-9ae5-501f06a5c5a1.png)

### .Net6+使用

添加引用

```xml
<PackageReference Include="log4net" Version="2.0.14" />
<PackageReference Include="Microsoft.Extensions.Logging.Log4Net.AspNetCore" Version="6.1.0" />
```

新建配置文件 log4net.config；添加service配置

```csharp
//注入Log4Net
builder.Services.AddLogging(cfg =>
{
    //默认的配置文件路径是在根目录，且文件名为log4net.config
    //cfg.AddLog4Net();
    //如果文件路径或名称有变化，需要重新设置其路径或名称
    //比如在项目根目录下创建一个名为config的文件夹，将log4net.config文件移入其中，并改名为log4net.config
    //则需要使用下面的代码来进行配置
    cfg.AddLog4Net(new Log4NetProviderOptions()
    {
        Log4NetConfigFileName = "config/log4net.config",
        Watch = true
    });
});

// 或者

builder.WebHost.ConfigureLogging((context, options) =>
{
    options.AddLog4Net(Path.Combine(AppContext.BaseDirectory, "config/log4net.config"));
});
```

即可在需要的地方定义使用

```csharp
_logger = LogManager.GetLogger(typeof(UserController));
```

### 控制台使用

创建控制台然后右键安装log4net

一、日志输出到控制台

```csharp
using log4net;
using log4net.Config;
using log4net.Repository;
using System;
 
namespace LogTest
{
    class Program
    {
        static void Main(string[] args)
        {
            ILoggerRepository repository = LogManager.CreateRepository("NETCoreRepository");
           BasicConfigurator.Configure(repository);
            ILog log = LogManager.GetLogger(repository.Name, "NETCorelog4net");
 
            log.Info("NETCorelog4net log");
            log.Error("error");
            log.Warn("warn");
            Console.ReadKey();
        }
    }
}
```

二、日志输出到文件

添加配置文件config.xml（右键 - 属性 - 复制到输出目录 - 始终复制），文件的内容如下：

```csharp
<?xml version="1.0" encoding="utf-8" ?>
<configuration>
  <!-- This section contains the log4net configuration settings -->
  <log4net>
    <appender name="ConsoleAppender" type="log4net.Appender.ConsoleAppender">
      <layout type="log4net.Layout.PatternLayout" value="%date [%thread] %-5level %logger - %message%newline" />
    </appender>
 
    <appender name="FileAppender" type="log4net.Appender.FileAppender">
      <file value="log-file.log" />
      <appendToFile value="true" />
      <layout type="log4net.Layout.PatternLayout">
        <conversionPattern value="%date [%thread] %-5level %logger [%property{NDC}] - %message%newline" />
      </layout>
    </appender>
 
    <appender name="RollingLogFileAppender" type="log4net.Appender.RollingFileAppender">
      <file value="logfile/" />
      <appendToFile value="true" />
      <rollingStyle value="Composite" />
      <staticLogFileName value="false" />
      <datePattern value="yyyyMMdd'.log'" />
      <maxSizeRollBackups value="10" />
      <maximumFileSize value="1MB" />
      <layout type="log4net.Layout.PatternLayout">
        <conversionPattern value="%date [%thread] %-5level %logger [%property{NDC}] - %message%newline" />
      </layout>
    </appender>
 
    <!-- Setup the root category, add the appenders and set the default level -->
    <root>
      <level value="ALL" />
      <appender-ref ref="ConsoleAppender" />
      <appender-ref ref="FileAppender" />
      <appender-ref ref="RollingLogFileAppender" />
    </root>
 
  </log4net>
</configuration>
```

 操作

```csharp
using log4net;
using log4net.Config;
using log4net.Repository;
using System;
using System.IO;
 
namespace LogTest
{
    class Program
    {
        static void Main(string[] args)
        {
            ILoggerRepository repository = LogManager.CreateRepository("NETCoreRepository");
           XmlConfigurator.Configure(repository, new FileInfo("config.xml"));
            ILog log = LogManager.GetLogger(repository.Name, "NETCorelog4net");
 
            log.Info("NETCorelog4net log");
            log.Error("error");
            log.Warn("warn");
            Console.ReadKey();
        }
    }
}
```

控制台输出：
![image.png](/common/1609400693625-d54bda23-3370-4a68-a09a-ac50b4189315.png)
  另外，生成一个文件夹logfile和一个以运行时的日期命名的文件20181025.log（配置文件中指定）。

当前我并没有使用该文档推荐的xml文档，使用的是另一种配置

### 多环境配置

```csharp
// ===============多环境log4net配置===============
IWebHostEnvironment environment = builder.Environment;
var configName = "log4net" + (environment.IsProduction() ? string.Empty : "." + environment.EnvironmentName) + ".config";
builder.Logging.AddLog4Net(configName, watch: true);
// ===============多环境log4net配置===============
```

## 配置文件

基础配置log4net.Config文件

```csharp
<?xml version="1.0" encoding="utf-8"?>
<log4net>
  <!-- 错误 Error.log-->
  <appender name="MYLOG" type="log4net.Appender.RollingFileAppender">
    <!--目录路径，可以是相对路径或绝对路径-->
    <param name="File" value="SysLog\\"/>
    <!--文件名，按日期生成文件夹-->
    <param name="DatePattern" value="/yyyy-MM-dd/&quot;Error.log&quot;"/>
    <!--追加到文件-->
    <appendToFile value="true"/>
    <!--创建日志文件的方式，可选值：Date[日期],文件大小[Size],混合[Composite]-->
    <rollingStyle value="Composite"/>
    <!--写到一个文件-->
    <staticLogFileName value="false"/>
    <!--单个文件大小。单位:KB|MB|GB-->
    <maximumFileSize value="200MB"/>
    <!--最多保留的文件数，设为"-1"则不限-->
    <maxSizeRollBackups value="-1"/>
    <!--日志格式-->
    <layout type="log4net.Layout.PatternLayout">
      <!--<conversionPattern value="%message"/>-->
      <param name="ConversionPattern" value="----------------%n%d [%t] %-5p %c [%x] %L %nMSG:%m%n" />
    </layout>
    <!--该配置要输出的日志最低级别和最高级别-->
    <!--<filter type="log4net.Filter.LevelRangeFilter">
      <param name="LevelMin" value="INFO" />
      <param name="LevelMax" value="ERROR" />
    </filter>-->
  </appender>

  <!-- levels: OFF > FATAL > ERROR > WARN > INFO > DEBUG  > ALL -->
  <root>
    <priority value="ALL"/>
    <level value="ALL"/>
    <appender-ref ref="MYLOG" />
  </root>
</log4net>
```

```csharp
<?xml version="1.0" encoding="utf-8"?>
<log4net>
  <!-- 错误 Error.log-->
  <appender name="ErrorLog" type="log4net.Appender.RollingFileAppender">
    <!--目录路径，可以是相对路径或绝对路径-->
    <param name="File" value="SysLog\\"/>
    <!--文件名，按日期生成文件夹-->
    <param name="DatePattern" value="/yyyy-MM-dd/&quot;Error.log&quot;"/>
    <!--追加到文件-->
    <appendToFile value="true"/>
    <!--创建日志文件的方式，可选值：Date[日期],文件大小[Size],混合[Composite]-->
    <rollingStyle value="Composite"/>
    <!--写到一个文件-->
    <staticLogFileName value="false"/>
    <!--单个文件大小。单位:KB|MB|GB-->
    <maximumFileSize value="200MB"/>
    <!--最多保留的文件数，设为"-1"则不限-->
    <maxSizeRollBackups value="-1"/>
    <!--日志格式-->
    <layout type="log4net.Layout.PatternLayout">
      <!--<conversionPattern value="%message"/>-->
      <param name="ConversionPattern" value="----------------%n%d [%t] %-5p %c [%x] %L %nMSG:%m%n" />
    </layout>
    <filter type="log4net.Filter.LevelRangeFilter">
      <param name="LevelMin" value="ERROR" />
      <param name="LevelMax" value="ERROR" />
    </filter>
  </appender>

  <!-- 警告 Warn.log-->
  <appender name="WarnLog" type="log4net.Appender.RollingFileAppender">
    <!--目录路径，可以是相对路径或绝对路径-->
    <param name="File" value="SysLog\\"/>
    <!--文件名，按日期生成文件夹-->
    <param name="DatePattern" value="/yyyy-MM-dd/&quot;Warn.log&quot;"/>
    <!--追加到文件-->
    <appendToFile value="true"/>
    <!--创建日志文件的方式，可选值：Date[日期],文件大小[Size],混合[Composite]-->
    <rollingStyle value="Composite"/>
    <!--写到一个文件-->
    <staticLogFileName value="false"/>
    <!--单个文件大小。单位:KB|MB|GB-->
    <maximumFileSize value="200MB"/>
    <!--最多保留的文件数，设为"-1"则不限-->
    <maxSizeRollBackups value="-1"/>
    <!--日志格式-->
    <layout type="log4net.Layout.PatternLayout">
      <!--<conversionPattern value="%message"/>-->
      <param name="ConversionPattern" value="----------------%n%d [%t] %-5p %c [%x] %L %nMSG:%m%n" />
    </layout>
    <filter type="log4net.Filter.LevelRangeFilter">
      <param name="LevelMin" value="WARN" />
      <param name="LevelMax" value="WARN" />
    </filter>
  </appender>
  <!-- 信息 Info.log-->
  <appender name="InfoLog" type="log4net.Appender.RollingFileAppender">
    <!--目录路径，可以是相对路径或绝对路径-->
    <param name="File" value="SysLog\\"/>
    <!--文件名，按日期生成文件夹-->
    <param name="DatePattern" value="/yyyy-MM-dd/&quot;Info.log&quot;"/>
    <!--追加到文件-->
    <appendToFile value="true"/>
    <!--创建日志文件的方式，可选值：Date[日期],文件大小[Size],混合[Composite]-->
    <rollingStyle value="Composite"/>
    <!--写到一个文件-->
    <staticLogFileName value="false"/>
    <!--单个文件大小。单位:KB|MB|GB-->
    <maximumFileSize value="200MB"/>
    <!--最多保留的文件数，设为"-1"则不限-->
    <maxSizeRollBackups value="-1"/>
    <!--日志格式-->
    <layout type="log4net.Layout.PatternLayout">
      <!--<conversionPattern value="%message"/>-->
      <param name="ConversionPattern" value="----------------%n%d [%t] %-5p %c [%x] %L %nMSG:%m%n" />
    </layout>
    <filter type="log4net.Filter.LevelRangeFilter">
      <param name="LevelMin" value="INFO" />
      <param name="LevelMax" value="INFO" />
    </filter>
  </appender>
  <!-- 调试 Debug.log-->
  <appender name="DebugLog" type="log4net.Appender.RollingFileAppender">
    <!--目录路径，可以是相对路径或绝对路径-->
    <param name="File" value="SysLog\\"/>
    <!--文件名，按日期生成文件夹-->
    <param name="DatePattern" value="/yyyy-MM-dd/&quot;Debug.log&quot;"/>
    <!--追加到文件-->
    <appendToFile value="true"/>
    <!--创建日志文件的方式，可选值：Date[日期],文件大小[Size],混合[Composite]-->
    <rollingStyle value="Composite"/>
    <!--写到一个文件-->
    <staticLogFileName value="false"/>
    <!--单个文件大小。单位:KB|MB|GB-->
    <maximumFileSize value="200MB"/>
    <!--最多保留的文件数，设为"-1"则不限-->
    <maxSizeRollBackups value="-1"/>
    <!--日志格式-->
    <layout type="log4net.Layout.PatternLayout">
      <!--<conversionPattern value="%message"/>-->
      <param name="ConversionPattern" value="----------------%n%d [%t] %-5p %c [%x] %L %nMSG:%m%n" />
    </layout>
    <filter type="log4net.Filter.LevelRangeFilter">
      <param name="LevelMin" value="DEBUG" />
      <param name="LevelMax" value="DEBUG" />
    </filter>
  </appender>
  <!-- levels: OFF > FATAL > ERROR > WARN > INFO > DEBUG  > ALL -->
  <root>
    <priority value="ALL"/>
    <level value="ALL"/>
    <appender-ref ref="ErrorLog" />
    <appender-ref ref="WarnLog" />
    <appender-ref ref="InfoLog" />
    <appender-ref ref="DebugLog" />
  </root>
</log4net>
```
例如我们这里生产环境的配置文件多增加一个KafkaAppender使日志发送至kafka消息丢列中，然后kafka的消费者将日志消费至ES集群,而本地开发的日志则没必要进行上传ES
```csharp
<!--log4net.config-->
<?xml version="1.0" encoding="utf-8" ?>
<log4net>
  <!-- If you are looking here and want more output, first thing to do is change root/priority/@value to "INFO" or "ALL". -->
  <root>
    Value of priority may be ALL, DEBUG, INFO, WARN, ERROR, FATAL, OFF.
    <priority value="ALL" />
    <appender-ref ref="error-file" />
    <appender-ref ref="debug-file" />
    <appender-ref ref="KafkaAppender" />
  </root>

  <!-- Example of turning on the output from a component or namespace. -->
  <logger name="Common">
    <appender-ref ref="debugger"/>
    <priority value="DEBUG" />
  </logger>
  
  <appender name="KafkaAppender" type="log4net.Kafka.Appender.KafkaAppender, log4net.Kafka.Appender">
    <KafkaSettings>
      <brokers>
        <add value="127.0.0.1:9092" />
      </brokers>
      <topic type="log4net.Layout.PatternLayout">
        <conversionPattern value="kafka.logstash" />
      </topic>
    </KafkaSettings>
    <layout type="log4net.Layout.PatternLayout">
      <conversionPattern value="%date %level% [%t] %logger - %message" />
    </layout>
  </appender>
  
  <appender name="debugger" type="log4net.Appender.DebugAppender">
    <!-- Sends log messages to Visual Studio if attached. -->
    <immediateFlush value="true" />
    <layout type="log4net.Layout.SimpleLayout" />
  </appender>

  <appender name="debug-file" type="log4net.Appender.RollingFileAppender">
    <param name="Encoding" value="utf-8" />
    <file value="Logs/debug" />
    <appendToFile value="true" />
    <!-- Immediate flush on error log, to avoid data loss with sudden termination. -->
    <immediateFlush value="true" />
    <staticLogFileName value="false" />
    <rollingStyle value="Date" />
    <datepattern value="-yyyy.MM.dd'.log'" />
    <!-- Prevents Orchard.exe from displaying locking debug messages. -->
    <lockingModel type="log4net.Appender.FileAppender+MinimalLock" />
    <layout type="log4net.Layout.PatternLayout">
      <conversionPattern value="%date %level% [%property{trace}] %logger - %message%newline" />
    </layout>
  </appender>

  <appender name="error-file" type="log4net.Appender.RollingFileAppender">
    <param name="Encoding" value="utf-8" />
    <file value="Logs/error" />
    <appendToFile value="true" />
    <!-- Immediate flush on error log, to avoid data loss with sudden termination. -->
    <immediateFlush value="true" />
    <staticLogFileName value="false" />
    <rollingStyle value="Date" />
    <datepattern value="-yyyy.MM.dd'.log'" />
    <!-- Prevents Orchard.exe from displaying locking debug messages. -->
    <lockingModel type="log4net.Appender.FileAppender+MinimalLock" />
    <filter type="log4net.Filter.LevelRangeFilter">
      <!-- Only ERROR and FATAL log messages end up in this target, even if child loggers accept lower priority. -->
      <levelMin value="ERROR" />
    </filter>
    <layout type="log4net.Layout.PatternLayout">
      <conversionPattern value="%date [%t] %logger - %message [%P{Url}]%newline" />
    </layout>
  </appender>

</log4net>
```
