---
title: dotFramework使用Log4net
lang: zh-CN
date: 2023-04-27
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: netshiyonglog4net
slug: imk1mp
docsId: '29412879'
---

## 概述
log4net是.Net下一个非常优秀的开源日志记录组件。log4net记录日志的功能非常强大。它可以将日志分不同的等级，以不同的格式，输出到不同的媒介。

## 使用

### 方案一

第一步：使用Nuget安装log4net.dll的引用
第二步：在Global.asax.cs中的Application_Start方法中添加：
log4net.Config.XmlConfigurator.Configure();
第三步：修改配置文件
```csharp
<configSections>
    <!--log4net日志使用-->
    <section name="log4net" type="log4net.Config.Log4NetConfigurationSectionHandler, log4net"/>
  </configSections>
  <!--log4net开始-->
  <log4net>
    <root>
      <level value="WARN" />
      <appender-ref ref="LogFileAppender" />
      <appender-ref ref="ConsoleAppender" />
    </root>
    <logger name="testLogging">
      <level value="DEBUG"/>
    </logger>
 
    <appender name="LogFileAppender" type="log4net.Appender.FileAppender" >
      <!--日志写入的目录-->
      <param name="File" value="log-file.txt" />
      <param name="AppendToFile" value="true" />
 
      <layout type="log4net.Layout.PatternLayout">
        <param name="Header" value="[Header] "/>
        <param name="Footer" value="[Footer] "/>
        <param name="ConversionPattern" value="%d [%t] %-5p %c [%x]  - %m%n" />
      </layout>
 
      <filter type="log4net.Filter.LevelRangeFilter">
        <param name="LevelMin" value="DEBUG" />
        <param name="LevelMax" value="WARN" />
      </filter>
    </appender>
 
    <appender name="ConsoleAppender" type="log4net.Appender.ConsoleAppender" >
      <layout type="log4net.Layout.PatternLayout">
        <param name="ConversionPattern" value="%d [%t] %-5p %c [%x] - %m%n" />
      </layout>
    </appender>
  </log4net>
  <!--log4net结束-->
</configuration>
```
第四步：在程序中使用
```csharp
log4net.ILog log = log4net.LogManager.GetLogger("testLogging");//获取一个日志记录器
log.Info(DateTime.Now.ToString() + ":日志内容");//写入一条新log
```

### 方案二

引用log4net.dll文件，然后新建Log类

```c#
public class Log
{
    private readonly ILog _logger;

    public Log(ILog log)
    {
        _logger = log;
    }

    public void Debug(object message)
    {
        _logger.Debug(message);
    }

    public void Error(object message)
    {
        _logger.Error(message);
    }

    public void Info(object message)
    {
        _logger.Info(message);
    }

    public void Warn(object message)
    {
        _logger.Warn(message);
    }
}
```

新建LogFactory工厂

```c#
public class LogFactory
{
    static LogFactory()
    {
        // 指定配置文件地址 
        FileInfo configFile = new FileInfo(HttpContext.Current.Server.MapPath("/Configs/log4net.config"));
        log4net.Config.XmlConfigurator.Configure(configFile);
    }

    public static Log GetLogger(Type type)
    {
        return new Log(LogManager.GetLogger(type));
    }

    public static Log GetLogger(string str)
    {
        return new Log(LogManager.GetLogger(str));
    }

    #region 插入错误信息

    /// <summary>
    /// 插入错误信息
    /// </summary>
    /// <param name="msg"></param>
    public static void WriteErrorLog(object msg)
    {
        new Log(LogManager.GetLogger("error")).Error(msg);
    }

    /// <summary>
    /// 插入错误信息
    /// </summary>
    /// <param name="t"></param>
    /// <param name="msg"></param>
    public static void WriteErrorLog(Type t, object msg)
    {
        new Log(LogManager.GetLogger(t)).Error(msg);
    }

    #endregion

    #region 插入调试信息

    /// <summary>
    /// 插入调试信息
    /// </summary>
    /// <param name="msg"></param>
    public static void WriteDebugLog(object msg)
    {
        new Log(LogManager.GetLogger("Debug")).Debug(msg);
    }

    /// <summary>
    /// 插入调试信息
    /// </summary>
    /// <param name="t"></param>
    /// <param name="msg"></param>
    public static void WriteDebugLog(Type t, object msg)
    {
        new Log(LogManager.GetLogger(t)).Debug(msg);
    }

    #endregion

    #region 插入信息

    /// <summary>
    /// 插入信息
    /// </summary>
    /// <param name="msg"></param>
    public static void WriteInfoLog(object msg)
    {
        new Log(LogManager.GetLogger("Info")).Info(msg);
    }

    /// <summary>
    /// 插入信息
    /// </summary>
    /// <param name="t"></param>
    /// <param name="msg"></param>
    public static void WriteInfoLog(Type t, object msg)
    {
        new Log(LogManager.GetLogger(t)).Info(msg);
    }

    #endregion

    #region 插入警告信息

    /// <summary>
    /// 插入错误信息
    /// </summary>
    /// <param name="msg"></param>
    public static void WriteWarnLog(object msg)
    {
        new Log(LogManager.GetLogger("Warn")).Warn(msg);
    }

    /// <summary>
    /// 插入警告信息
    /// </summary>
    /// <param name="t"></param>
    /// <param name="msg"></param>
    public static void WriteWarnLog(Type t, object msg)
    {
        new Log(LogManager.GetLogger(t)).Warn(msg);
    }

    #endregion
}
```

配置文件内容如下

```xml
<?xml version="1.0" encoding="utf-8" ?>
<configuration>
  <configSections>
    <section name="log4net" type="log4net.Config.Log4NetConfigurationSectionHandler, log4net"/>
  </configSections>

  <log4net>
    <!--根配置-->
    <root>
      <!--日志级别:可选值: ERROR > WARN > INFO > DEBUG -->
      <level value="ERROR"/>
      <level value="WARN"/>
      <level value="INFO"/>
      <level value="DEBUG"/>
      <appender-ref ref="ErrorLog" />
      <appender-ref ref="WarnLog" />
      <appender-ref ref="InfoLog" />
      <appender-ref ref="DebugLog" />
    </root>
    <!-- 错误 Error.log-->
    <appender name="ErrorLog" type="log4net.Appender.RollingFileAppender">
      <!--目录路径，可以是相对路径或绝对路径-->
      <param name="File" value="SysErrLog\\"/>
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
      <param name="File" value="SysErrLog\\"/>
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
      <param name="File" value="SysErrLog\\"/>
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
      <param name="File" value="SysErrLog\\"/>
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


  </log4net>
  <startup>
    <supportedRuntime version="v4.0" sku=".NETFramework,Version=v4.5" />
  </startup>
</configuration>
```

然后在需要使用日志的地方直接使用

```c#
LogFactory.WriteDebugLog("我是一个日志文件");
```

## 资料

> 详细解析：[https://blog.csdn.net/binnygoal/article/details/79557746](https://blog.csdn.net/binnygoal/article/details/79557746)

