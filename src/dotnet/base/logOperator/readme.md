---
title: 说明
lang: zh-CN
date: 2023-10-18
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: readme
slug: bilfnd
docsId: '29412344'
---

## 概述
通常情况下，日志氛围三种：请求、业务处理、数据库操作
在实际采集日志的时候，关注【特定日志场景】

> 提供给第三方调用的API日志
> 核心流程业务
> 数据库操作日志
> 应用内部发起的HTTP请求日志
> warn、error、fatal级别日志

## 日志框架

- Serilog
- Nlog
- log4net
- 自带的Ilogger
- Loki+grafana

## 日志管理系统

- [Sentry.io](http://sentry.io)
- [Loggly.com](https://loggly.com)
- [Elmah.io](http://elmah.io)

## 记录时机
通常，记录所有可以深入了解您的应用程序和用户行为的内容，例如：

- 代码中的主要分支点
- 遇到错误或意外值时
- 任何 IO 或资源密集型操作
- 重大领域事件
- 请求失败和重试
- 耗时的批处理操作的开始和结束

## 记录内容
标准化日志事件属性使您能够充分利用日志搜索和分析工具。在适用的情况下使用以下属性：

| ApplicationName | 生成日志事件的应用程序的名称 |
| --- | --- |
| ClientIP | 发出请求的客户端的 IP 地址 |
| CorrelationId | 可用于跨多个应用程序边界跟踪请求的 ID |
| Elapsed | 操作完成所用的时间（以毫秒为单位） |
| EventType | 用于确定消息类型的消息模板的哈希值 |
| MachineName | 运行应用程序的机器的名称 |
| Outcome | 手术的结果 |
| RequestMethod | HTTP 请求方法，例如 POST |
| RequestPath | HTTP 请求路径 |
| SourceContext | 日志源自的组件/类的名称 |
| StatusCode | HTTP 响应状态码 |
| UserAgent | HTTP 用户代理 |
| Version | 正在运行的应用程序的版本 |

## 奇淫技巧

### 可读性更佳的日志

这里以Serilog日志组件举例，ILogger、NLog等也有类似的效果。首先需要先安装nuget包

```xml
<ItemGroup>
  <PackageReference Include="Serilog" Version="4.0.1" />
  <PackageReference Include="Serilog.Sinks.Console" Version="6.0.0" />
</ItemGroup>
```

编写测试代码

```csharp
using Serilog;

Log.Logger = new LoggerConfiguration()
             .MinimumLevel.Information()
             .WriteTo.Console()
             .CreateLogger();

var user = new UserInfo("11", "张三");
Log.Information($"{user.Id},{user.Name}"); // 以纯字符串的形式输出
Log.Information("{id},{name}", user.Id, user.Name); // 结构化输出

Log.Information("userInfo:{@user}",user);

class UserInfo
{
    public UserInfo(string id, string name)
    {
        Id = id;
        Name = name;
    }

    public string Id { get; set; }

    public string Name { get; set; }
}
```

![image-20240802230806092](/dotnet/image-20240802230806092.png)

从图中看到第一个日志输出不带颜色，第二个因为是结构化输出带了颜色，第三个可以直接通过这种方式输出一个对象。

### 输出错误日志

这里以Serilog日志组件举例，ILogger、NLog等也有类似的效果。首先需要先安装nuget包

```xml
<ItemGroup>
  <PackageReference Include="Serilog" Version="4.0.1" />
  <PackageReference Include="Serilog.Sinks.Console" Version="6.0.0" />
</ItemGroup>
```

编写测试代码

```csharp
using Serilog;

Log.Logger = new LoggerConfiguration()
             .MinimumLevel.Information()
             .WriteTo.Console()
             .CreateLogger();

{
    // 输出错误日志
    try
    {
        string? obj = null;
        ArgumentNullException.ThrowIfNull(obj, nameof(obj));
    }
    catch (Exception e)
    {
        Log.Error(e.Message);
        Log.Information("------------- 分割 -------------");
        Log.Error(e, e.Message);
    }
}
```

![image-20240802231401912](/dotnet/image-20240802231401912.png)

通过图中可以看到第一种输出日志的方法只是以字符串的形式输出了异常的Message信息，第二种方法不仅输出了错误信息，还输出了异常的堆栈信息。

### 日志输出对比

这里以Serilog日志组件举例，ILogger、NLog等也有类似的效果。首先需要先安装nuget包

```xml
<ItemGroup>
  <PackageReference Include="Serilog" Version="4.0.1" />
  <PackageReference Include="Serilog.Sinks.Console" Version="6.0.0" />
</ItemGroup>
```

编写测试代码对比当我设置日志最低输出级别为Information，但是我输出Debug级别的日志，字符串插值和Format方式输出内存的变化

::: details 对比当输出低于最低日志级别的时候内存占用效果

```
using Serilog;

Log.Logger = new LoggerConfiguration()
             .MinimumLevel.Information()
             .WriteTo.Console()
             .CreateLogger();

{
    // 输出效率对比
    Console.WriteLine("输出1开启字符串插值 否则开启Format");
    var str = Console.ReadLine();
    Console.WriteLine($"您输入的：{str}");
    for (var i = 0; i < 20000; i++)
    {
        if (str == "1")
        {
            // 虽然不输出该级别的日志 但是内存占用还是和输出Information级别的时候一样
            Log.Debug($"""
                       测试输出的内容：{i}测试输出的内容测试输出的内容测试输出的内容测试输出的内容测试输出的内容测试输出的内容测试输出的内容测试输出的内容测试输出的内容测试输出的内容
                       测试输出的内容测试输出的内容测试输出的内容测试输出的内容测试输出的内容测试输出的内容测试输出的内容测试输出的内容测试输出的内容测试输出的内容测试输出的内容测试输出的内容
                       测试输出的内容测试输出的内容测试输出的内容测试输出的内容测试输出的内容测试输出的内容测试输出的内容测试输出的内容测试输出的内容测试输出的内容测试输出的内容测试输出的内容
                       测试输出的内容测试输出的内容测试输出的内容测试输出的内容测试输出的内容测试输出的内容测试输出的内容测试输出的内容测试输出的内容测试输出的内容测试输出的内容测试输出的内容
                       测试输出的内容测试输出的内容测试输出的内容测试输出的内容测试输出的内容测试输出的内容测试输出的内容测试输出的内容测试输出的内容测试输出的内容测试输出的内容测试输出的内容
                       """);
        }
        else
        {
            // 推荐使用该方法
            // 不输出日志，内存占用也没有不像上面一样内存和Information的时候一样，代表他确确实实没有执行
            Log.Debug("""
                      测试输出的内容：{x}测试输出的内容测试输出的内容测试输出的内容测试输出的内容测试输出的内容测试输出的内容测试输出的内容测试输出的内容测试输出的内容测试输出的内容
                      测试输出的内容测试输出的内容测试输出的内容测试输出的内容测试输出的内容测试输出的内容测试输出的内容测试输出的内容测试输出的内容测试输出的内容测试输出的内容测试输出的内容
                      测试输出的内容测试输出的内容测试输出的内容测试输出的内容测试输出的内容测试输出的内容测试输出的内容测试输出的内容测试输出的内容测试输出的内容测试输出的内容测试输出的内容
                      测试输出的内容测试输出的内容测试输出的内容测试输出的内容测试输出的内容测试输出的内容测试输出的内容测试输出的内容测试输出的内容测试输出的内容测试输出的内容测试输出的内容
                      测试输出的内容测试输出的内容测试输出的内容测试输出的内容测试输出的内容测试输出的内容测试输出的内容测试输出的内容测试输出的内容测试输出的内容测试输出的内容测试输出的内容
                      """, i);
        }
    }

    Console.WriteLine("end");
}
Console.ReadLine();
```

:::

## 自定义日志

### 日志存库

创建一个日志表，然后将需要的日志信息都存入数据库然后在后台管理系统显示出来

```
create table Logs--日志表
(
    lid int primary key identity(1,1),
    info varchar(max),
    operator varchar(40),
    ip varchar(40),
    createtime varchar(40)
)
go
```

编写日志记录类

::: details 事件日志记录类



```c#
/// ＜summary＞ 
/// 事件日志记录类，提供事件日志记录支持  
/// ＜remarks＞ 
/// 定义了4个日志记录方法 (error, warning, info, trace)  
/// ＜/remarks＞ 
/// ＜/summary＞ 
public class ApplicationLog
{
	/// ＜summary＞ 
	/// 将错误信息记录到Win2000/NT事件日志中 
	/// ＜param name="message"＞需要记录的文本信息＜/param＞ 
	/// ＜/summary＞ 
	public static void WriteError(String message)
	{
		WriteLog(TraceLevel.Error, message);
	}

	/// ＜summary＞ 
	/// 将警告信息记录到Win2000/NT事件日志中 
	/// ＜param name="message"＞需要记录的文本信息＜/param＞ 
	/// ＜/summary＞ 
	public static void WriteWarning(String message)
	{
		WriteLog(TraceLevel.Warning, message);
	}

	/// ＜summary＞ 
	/// 将提示信息记录到Win2000/NT事件日志中 
	/// ＜param name="message"＞需要记录的文本信息＜/param＞ 
	/// ＜/summary＞ 
	public static void WriteInfo(String message)
	{
		WriteLog(TraceLevel.Info, message);
	}

	/// ＜summary＞ 
	/// 将跟踪信息记录到Win2000/NT事件日志中 
	/// ＜param name="message"＞需要记录的文本信息＜/param＞ 
	/// ＜/summary＞ 
	public static void WriteTrace(String message)
	{
		WriteLog(TraceLevel.Verbose, message);
	}

	/// ＜summary＞ 
	/// 格式化记录到事件日志的文本信息格式 
	/// ＜param name="ex"＞需要格式化的异常对象＜/param＞ 
	/// ＜param name="catchInfo"＞异常信息标题字符串.＜/param＞ 
	/// ＜retvalue＞ 
	/// ＜para＞格式后的异常信息字符串，包括异常内容和跟踪堆栈.＜/para＞ 
	/// ＜/retvalue＞ 
	/// ＜/summary＞ 
	public static String FormatException(Exception ex, String catchInfo)
	{
		StringBuilder strBuilder = new StringBuilder();
		if (catchInfo != String.Empty)
		{
			strBuilder.Append(catchInfo).Append("\r\n");
		}

		strBuilder.Append(ex.Message).Append("\r\n").Append(ex.StackTrace);
		return strBuilder.ToString();
	}

	/// ＜summary＞ 
	/// 实际事件日志写入方法 
	/// ＜param name="level"＞要记录信息的级别（error,warning,info,trace).＜/param＞ 
	/// ＜param name="messageText"＞要记录的文本.＜/param＞ 
	/// ＜/summary＞ 
	private static void WriteLog(TraceLevel level, String messageText)
	{
		try
		{
			EventLogEntryType LogEntryType;
			switch (level)
			{
				case TraceLevel.Error:
					LogEntryType = EventLogEntryType.Error;
					break;
				case TraceLevel.Warning:
					LogEntryType = EventLogEntryType.Warning;
					break;
				case TraceLevel.Info:
					LogEntryType = EventLogEntryType.Information;
					break;
				case TraceLevel.Verbose:
					LogEntryType = EventLogEntryType.SuccessAudit;
					break;
				default:
					LogEntryType = EventLogEntryType.SuccessAudit;
					break;
			}

			EventLog eventLog = new EventLog("Application", ApplicationConfiguration.EventLogMachineName,
				ApplicationConfiguration.EventLogSourceName);
			//写入事件日志 
			eventLog.WriteEntry(messageText, LogEntryType);
		}
		catch
		{
		} //忽略任何异常 
	}
}
```

:::

### 日志文件

一个简单的方案去存储日志到本地文本文件

```c#
public static class LogHelper
{
    private static readonly object lockObj = new object();

    public static async Task WriteLogAsync(string message)
    {
        // 使用异步方式写入日志
        await Task.Run(() =>
        {
            lock (lockObj)
            {
                using var writer = new StreamWriter("log.txt", true);
                writer.WriteLine($"{DateTime.Now} - {message}");
            }
        });
    }
}
```

使用示例

```c#
string message = "Log message";
for (int i = 0; i < 100; i++)
{
    Task.Run(() => LogHelper.WriteLogAsync(message));
}
Console.ReadLine();
```

## 资料

[https://mp.weixin.qq.com/s/Rg_euctSIJFZ9TDI5zEodw](https://mp.weixin.qq.com/s/Rg_euctSIJFZ9TDI5zEodw) | 轻量级日志 Loki 全攻略  
日志库设计：[https://www.cnblogs.com/czzj/p/JGP_MyLog.html](https://www.cnblogs.com/czzj/p/JGP_MyLog.html)

编辑日志中的敏感信息：https://andrewlock.net/redacting-sensitive-data-with-microsoft-extensions-compliance/

