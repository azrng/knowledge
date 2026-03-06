---
title: 数据库优先
lang: zh-CN
date: 2023-07-03
publish: true
author: azrng
isOriginal: true
category:
  - orm
tag:
  - 无
filename: shujukuyouxian
slug: pioggy
docsId: '30837701'
---

## 基础组件
```csharp
Microsoft.EntityFrameworkCore
Microsoft.EntityFrameworkCore.Design
Microsoft.EntityFrameworkCore.Tools
```

## 数据库

### SQL Server
1.先试用nuget包安装以下包
```csharp
Microsoft.EntityFrameworkCore.SqlServer
Microsoft.EntityFrameworkCore.SqlServer.Design
```
2.在程序包管理控制台将模型生成对应的实体
输入命令：
```csharp
Scaffold-DbContext "server=LENOVO-AZRNG;uid=sa;pwd=123456;database=StudentDB" Microsoft.EntityFrameworkCore.SqlServer -OutputDir Models -Context DataDbContext 
```
![image.png](/common/1611800473583-62eef02f-6bc3-4e7f-a9e1-dd6a5581cd86.png)

然后就可以看到解决方案文件夹下将出现一个models的文件夹，一个数据库上下文对象类以及表对应的实体类。

![image.png](/common/1611800473590-eb369373-5850-4cb1-9e4e-1f28e5bb62c5.png)

然后就可以在startup中注册上下文对象然后去操作数据库使用了

### MySQL
1.首先先安装nuget包
```csharp
Pomelo.EntityFrameworkCore.MySql
```
2.在程序包管理控制台将模型生成对应的实体
输入命令：
```csharp
Scaffold-DbContext "Server=192.168.100.104;database=azrngblog;uid=root;pwd=123456;" Pomelo.EntityFrameworkCore.MySql -OutputDir Models
```
![image.png](/common/1611800486702-1bc081a8-c483-4c78-a22e-2a77dfb9aa88.png)

然后就可以看到解决方案文件夹下将出现一个models的文件夹，一个数据库上下文对象类以及表对应的实体类

![image.png](/common/1611800486688-8397b138-4af1-4ac3-b3e3-873f19a6029d.png)

然后就可以在startup中注册上下文对象然后去操作数据库使用了

## EF Core Sidekick

EF Core Sidekick 是一个 Visual Studio 的扩展插件，可增强 Visual Studio 中自动代码生成的功能。 它提供了一组工具和模板，用于从现有数据库生成 EF Core 实体和 DbContext，然后从实体生成 DTO、服务、以及 REST API。

安装文档：[https://docs.aipuyang.com/efsidekick/#%E5%AE%89%E8%A3%85](https://docs.aipuyang.com/efsidekick/#%E5%AE%89%E8%A3%85)

