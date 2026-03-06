---
title: 说明
lang: zh-CN
date: 2023-10-17
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: readme
slug: pte11ylgp6brdsao
docsId: '132667194'
---

## 概述
Windows 服务是一种在后台运行的应用程序，它可以在系统启动时自动启动，并且以系统级别权限运行。Windows 服务是基于Windows操作系统的服务控制管理器（Service Control Manager）进行管理的。开发者可以使用编程语言（如C#、C++等）编写Windows服务，然后通过安装到操作系统中来实现长期运行和提供某种功能。

## 操作

### 获取进程对应的服务名
```csharp
await host.StartAsync();

var processId = Process.GetCurrentProcess().Id;
var query = $"SELECT * FROM Win32_Service WHERE ProcessId = {processId}";
var searcher = new ManagementObjectSearcher(query);
var services = searcher.Get();
var serviceName = services.Cast<ManagementObject>().Select(s => s["Name"]).FirstOrDefault();
logger.LogInformation($"The service name is {serviceName}");

await host.WaitForShutdownAsync();
```
注意，必须在调用 host.StartAsync 之后才能获取与当前进程对应的 Windows 服务。
> 参考资料：[https://mp.weixin.qq.com/s/hQJlYZZRTrtaJKSZ5UVS5Q](https://mp.weixin.qq.com/s/hQJlYZZRTrtaJKSZ5UVS5Q)


## 资料
[https://mp.weixin.qq.com/s/ZXKEGNNQ1Z9Vrm6zRBolUg](https://mp.weixin.qq.com/s/ZXKEGNNQ1Z9Vrm6zRBolUg) | .NET 6 中将 ASP.NET Core 注册成 Windows Service
[https://mp.weixin.qq.com/s/C90gf18kxvQ4TeTlcwvbGA](https://mp.weixin.qq.com/s/C90gf18kxvQ4TeTlcwvbGA) | .NET 实现启动时重定向程序运行路径及 Windows 服务运行模式部署
[https://mp.weixin.qq.com/s/upIraVWSu4hgwSuqqLHm0g](https://mp.weixin.qq.com/s/upIraVWSu4hgwSuqqLHm0g) | .NET Worker Service 作为 Windows 服务运行及优雅退出改进

https://mp.weixin.qq.com/s/bH2f6Tjy_MX51flXxKTgFw | 使用.NET Core创建Windows服务

使用 NSSM 将.exe 程序安装成 windows 服务https://www.cnblogs.com/magicMaQaQ/p/18174409
