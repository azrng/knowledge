---
title: 常用命令
lang: zh-CN
date: 2023-09-05
publish: true
author: azrng
isOriginal: true
category:
  - 软件设计
tag:
  - 无
filename: changyongmingling
slug: df2gl7
docsId: '31521113'
---

## 安装
```csharp
安装abp cli
dotnet tool install -g Volo.Abp.Cli

更新最新版本
dotnet tool update -g Volo.Abp.Cli
```
查看帮助文档
```csharp
-- 查询abp的帮助
abp

-- 查看创建项目的帮助
abp new
```
![image.png](/common/1664680440034-83f9d76a-3c3c-491e-a262-739867fefc4a.png)

## 创建解决方案
```csharp
abp new 解决方案名称 -t app //-t是指定模板，默认是app，还有console
abp new Acme.BookStore -u angular //-u是指定ui框架  有mvc和angular两种
abp new Acme.IssueManagement -t module --no-ui //指定不包含ui层
    
abp new Acme.BookStore -d mongodb //-d是指定数据库提供程序   默认是ef(EFCore),还有mongodb、mysql
abp new sample1 -dbms mysql

abp new Acme.BookStore -m react-native //-m是指定移动应用程序框架 支Rreact Native
```
生成的项目src目录下是实际应用程序，基于DDD原则进行分层

示例
```csharp
abp new BlogSample
```
上面创建完后，整个项目结构是这样子的
```csharp
BlogSample
 ├── NuGet.Config
 ├── .prettierrc
 ├── common.props
 ├── BlogSample.sln
 ├── BlogSample.sln.DotSettings
 ├── src
 │   ├── BlogSample.Application
 │   ├── BlogSample.Application.Contracts
 │   ├── BlogSample.DbMigrator
 │   ├── BlogSample.Domain
 │   ├── BlogSample.Domain.Shared
 │   ├── BlogSample.EntityFrameworkCore
 │   ├── BlogSample.HttpApi
 │   ├── BlogSample.HttpApi.Client
 │   └── BlogSample.Web
 └── test
     ├── BlogSample.Application.Tests
     ├── BlogSample.Domain.Tests
     ├── BlogSample.EntityFrameworkCore.Tests
     ├── BlogSample.HttpApi.Client.ConsoleTestApp
     ├── BlogSample.TestBase
     └── BlogSample.Web.Tests
```


创建一个名为"HelloAbp"的解决方案，使用app作为模板，不需要UI，并且将Identity Server应用程序与API host应用程序分开，使用Entity Framework Core作为数据库提供程序，并指定连接字符串。创建完成后会得到一个aspnet-core文件夹。
```csharp
abp new "HelloAbp" -t app -u none --separate-identity-server -m none -d ef -cs "Server=localhost;User Id=sa;Password=Password@2020;Database=HelloAbp;MultipleActiveResultSets=true"
```
