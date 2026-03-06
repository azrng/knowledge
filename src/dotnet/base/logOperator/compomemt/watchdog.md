---
title: WatchDog
lang: zh-CN
date: 2022-10-30
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: watchdog
slug: dfkgws
docsId: '100364112'
---

## 概述
WatchDog 是一个使用 C## 开发的开源的轻量监控工具，它可以记录和查看 ASP.Net Core Web 和 WebApi 的实时消息、事件、异常、 Http 请求响应等。
它使用了 SignalR 技术进行实时监控，在开发环境中，使用了 LiteDb 单文件数据库进行存储。当然，根据您的需要，也可以选择外部的 MSSQL、MySQL 或 Postgres 数据库。
仓库地址：https://github.com/IzyPro/WatchDog

## 功能特性
• 实时 HTTP 请求和响应记录
• 实时异常记录
• 代码内消息和事件记录
• 用户友好的查询页面
• 身份验证
• 数据定期清除

## 操作
安装nuget包
```csharp
Install-Package WatchDog.NET --version 1.3.2
```

### 基础操作
添加服务
```csharp
using WatchDog;

services.AddWatchDogServices();
```
默认使用本地文件数据库，当然也可以选择外部的 MSSQL, MySQL & PostgreSQL 数据库。
```csharp
services.AddWatchDogServices(opt => 
{ 
   opt.SetExternalDbConnString = "DbConnString"; 
   opt.SqlDriverOption = WatchDogSqlDriverEnum.PostgreSql; 
});
```
配置中间件服务
```csharp
app.UseWatchDog(opt => 
{ 
   opt.WatchPageUsername = "admin"; 
   opt.WatchPagePassword = "Qwerty@123"; 
 });
```
运行 .NET 程序，然后访问 /watchdog 路径就可以看到页面。

记录日志方法为
```csharp
WatchLogger.Log("...TestGet Started...");
```
