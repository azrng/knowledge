---
title: EFCore之命令行工具
lang: zh-CN
date: 2023-07-03
publish: true
author: azrng
isOriginal: true
category:
  - orm
tag:
  - 无
filename: efcorezhiminglinghanggongju
slug: nlzu47
docsId: '45771699'
---

## 介绍
EFCore工具可帮助完成设计数据库时候的开发任务，主要用于通过对数据库架构进行反向工程来管理迁移和搭建DbContext和实体类型。EFCore .NET命令行工具是对跨平台.NET Core CLI工具的扩展，该工具执行需要具有.NET Core SDK(具有 Sdk="Microsoft.NET.Sdk" 的项目或项目文件中的相似项目)的项目，优点是适用于所有平台。

## 安装工具
使用终端工具执行在任意目录执行下面命令，可以尝试下[Terminal](https://docs.microsoft.com/zh-cn/windows/terminal/)终端工具。
```csharp
## 安装为全局工具
dotnet tool install --global dotnet-ef

## 更新工具
dotnet tool update --global dotnet-ef
```
![image.png](/common/1621691682147-40e2c2d3-c8a8-4539-ae1a-119050ddd46c.png)
验证安装
```csharp
dotnet ef
```
![image.png](/common/1621691745639-9f4882dc-2b14-4f6f-86f8-b367bda17085.png)
参考地址：[https://docs.microsoft.com/zh-cn/ef/core/cli/dotnet](https://docs.microsoft.com/zh-cn/ef/core/cli/dotnet)

## 创建项目
本次使用的项目为.NetCore WebAPI项目，代码结构如下
![image.png](/common/1621692104322-fcea5b1e-6627-4be8-8454-f9e8d98cf162.png)
> 源代码地址：[https://gitee.com/AZRNG/my-example](https://gitee.com/AZRNG/my-example)


## 迁移代码优先

- -o 是指定迁移文件的输出目录。
- -c 是指定要用于迁移的 DbContext 类型
- -s 是指定项目的启动项（startup project）的路径
- -v 是用于显示详细的命令执行信息，包括生成的 SQL 语句和执行过程等。

### 简单迁移
使用迁移还需要另外安装Nuget包，该包包含 EF Core 用于创建数据库的所有设计逻辑。
```csharp
<PackageReference Include="Microsoft.EntityFrameworkCore.Design" Version="5.0.6" />
```
在项目文件夹目录下操作终端工具
```csharp
dotnet ef migrations add Init

//  指定Migrations目录
dotnet ef migrations add Init --output-dir MyMigration

// 指定迁移上下文
dotnet ef migrations add Init --context BlogContext
```
> 在 EF Core 5.0及以上 中，才可以使用更改独立于目录的命名空间 --namespace 。

此处Init为迁移名称，该名称要可以表示出当前迁移的内容信息。
![image.png](/common/1621693379678-d416ee07-bbc4-482c-bc64-fe5e57f349b4.png)
生成成功，查看项目内的变化，增加了一个文件夹Migrations
![image.png](/common/1621693420142-8822ffa1-04d8-417c-b845-06f6147096ad.png)
xxxxxx_Init -主迁移文件。包含应用迁移的操作(在up中)和还原迁移所需的操作(在down中)
OpenDbContextModelSnapshot -当前模型的快照。用于确定添加下一迁移时的更改内容。  
> 最好检查下生成的内容是不是我们期望的那样子，有些情况下是需要进行修改的。

如果这个时候，我们又修改了实体类，那么还可以运行命令再次迁移(迁移名称不能相同)

### 更多迁移参数
```csharp
dotnet ef migrations add "1.2.0" -o "../Admin.Api.EntityframeworkCore/Migrations" -c  Admin.Api.EntityframeworkCore.MetaDataDbContext -s "../Admin.Api.Service" -v
```

- "1.2.0" 是指定迁移的名称，这里是 "1.2.0"。
- -o "../Admin.Api.EntityframeworkCore/Migrations" 是指定迁移文件的输出目录，这里是 "../Admin.Api.EntityframeworkCore/Migrations"。
- -c Admin.Api.EntityframeworkCore.MetaDataDbContext 是指定要用于迁移的 DbContext 类型，这里是 "Admin.Api.EntityframeworkCore.MetaDataDbContext"。
- -s "../Admin.Api.Service" 是指定项目的启动项（startup project）的路径，这里是 "../Admin.Api.Service"。
- -v 是用于显示详细的命令执行信息，包括生成的 SQL 语句和执行过程等。


### 特殊情况
有些特殊情况下生成的迁移文件不是我们预期的那样子，这个时候需要手动修改。

#### 列名重命名
如果实体类中的列明重复了，我们重新迁移，查看生成的文件，比如我将用户表Account修改为UserName，按照官网的说法会生成一下迁移
```csharp
migrationBuilder.DropColumn(
    name: "Account",
    table: "User");

migrationBuilder.AddColumn<string>(
    name: "UserName",
    table: "User",
    nullable: true);
```
实际生成结果为
```csharp
    migrationBuilder.RenameColumn(
        name: "Account",
        table: "user",
        newName: "UserName");
```
如果生成了先Drop再Add那种进行应用数据库，则用户的帐号都会丢失，所以需要修改我下面这种。(当前现在生成的就是我们想要样子，不过我们还需要谨慎)

还有其他的情况需要注意，可以参考[官网](https://docs.microsoft.com/zh-cn/ef/core/managing-schemas/migrations/managing?tabs=dotnet-core-cli)

### 删除迁移
有时候我们在添加迁移后，马上有实体进行改动，这个时候我们并不像再次生成迁移，那么就可以考虑删除上个迁移。
```csharp
dotnet ef migrations remove

dotnet ef migrations remove  -c  OspDbContext -s "../Admin.Api.Service"    
```
删除迁移后，对实体进行更改，然后再次添加迁移。特殊情况下我们想删除所有的迁移，可以通过删除迁移文件夹并删除数据库来完成。
场景：我们已经生成了许多迁移文件，比较繁琐，我们想将这些迁移文件合并，那么就可以删除迁移文件夹，然后删除数据库的迁移历史表数据，再次生成迁移，根据生成的迁移名称，对迁移历史记录表增加一条对应的数据。

### 列出迁移
通过下面命令可以查询到我们所有的迁移
```csharp
dotnet ef migrations list
```
![image.png](/common/1621695517264-5809009b-0db9-4f65-8888-78152060689c.png)

### 生成SQL脚本

#### 生成从0到最新迁移的SQL脚本
```csharp
dotnet ef migrations script
```
![image.png](/common/1621696179270-cf4c9c05-59be-4a83-9103-95a21aa63e7e.png)
更多参数
```csharp
dotnet ef migrations script -c  OspDbContext -s "../Admin.Api.Service"
```
在上下文所在程序集下执行

#### From
生成从给定迁移到最新迁移的SQL脚本（包含最新迁移）
```csharp
dotnet ef migrations script AddNewTables
```

#### From和To
可以从指定的From迁移到指定迁移To的SQL脚本
```csharp
dotnet ef migrations script AddNewTables AddAuditTable
```
脚本生成接受以下两个参数，以指示应生成的迁移范围：

- from 迁移应是运行该脚本前应用到数据库的最后一个迁移。 如果未应用任何迁移，请指定 `0`（默认值）。
- to 迁移是运行该脚本后应用到数据库的最后一个迁移。 它默认为项目中的最后一个迁移。

## 创建数据库和表

### 手动执行
让EFCore创建数据库并从迁移中创建表结构，运行命令
```csharp
dotnet ef database update
```
![image.png](/common/1621693765298-d5a13bd3-2b42-49ba-867e-8f5474433585.png)
如果后续我们实体类结构再有修改，那么还可以先创建迁移文件，然后再生成到数据库。(因为EF已经检测到数据库已存在，会通过对比特殊迁移历史记录表，然后只应用那些新的迁移)。

### 更多参数
```csharp
dotnet ef database update -c MetaDataDbContext -s "../xxx.Service"
```
在上下文所在程序集下执行

### 运行时候执行
```csharp
//如果当前数据库不存在按照当前 model 创建，如果存在则将数据库调整到和当前 model 匹配
dbContext.Database.Migrate(); // 生产环境使用考虑好数据问题
```
> 请勿在 Migrate() 前调用 EnsureCreated()。 EnsureCreated() 会绕过迁移创建架构，这会导致 Migrate() 失败


## 创建和删除API

### EnsureDeleted
EnsureDeleted 方法会删除数据库（如果存在）。 如果你没有相应的权限，则会引发异常。
```csharp
// Drop the database if it exists
dbContext.Database.EnsureDeleted();
```

### EnsureCreated
如果数据库不存在，EnsureCreated 将创建数据库并初始化数据库架构。 如果存在任何表 (包括其他 DbContext 类) 的表，则不会初始化该架构。
```csharp
// Create the database if it doesn't exist
dbContext.Database.EnsureCreated();
```

### SQL 脚本
若要获取 EnsureCreated 使用的 SQL，可以使用 GenerateCreateScript 方法。
```csharp
var sql = dbContext.Database.GenerateCreateScript();
```

### 多个 DbContext 类
EnsureCreated 仅在数据库中不存在任何表时有效。 如果需要，您可以编写自己的检查来查看是否需要初始化架构，并使用基础 IRelationalDatabaseCreator 服务来初始化架构。
```csharp
// TODO: Check whether the schema needs to be initialized

// Initialize the schema for this DbContext
var databaseCreator = dbContext.GetService<IRelationalDatabaseCreator>();
databaseCreator.CreateTables();
```
> 参考地址：[https://docs.microsoft.com/zh-cn/ef/core/managing-schemas/ensure-created](https://docs.microsoft.com/zh-cn/ef/core/managing-schemas/ensure-created)


## 反向工程数据库优先
```csharp
dotnet ef dbcontext scaffold "Data Source=(localdb)\MSSQLLocalDB;Initial Catalog=Chinook" Microsoft.EntityFrameworkCore.SqlServer
```
配置数据库连接字符串、数据库提供程序
> 常用配置
> --table  指定表反向工程，多个表加多个--table
> --context  指定上下文
> -context-dir 指定上下文目录
> --output-dir Models   指定上下文目录

示例：当前我们有一个数据库文件，需要通过反向工程生成实体类，表结构如下
user
![image.png](/common/1621697557205-ffa777d4-8429-4ca7-9573-a4cb3e68438e.png)
score
![image.png](/common/1621697542283-e77da708-4def-4fee-be11-496a3cdc26a8.png)
项目结构如下
![image.png](/common/1621697623587-c3232f61-36a4-452e-84e3-7789a9a50caa.png)
项目目录使用终端执行命令
```csharp
dotnet ef dbcontext scaffold "Server=localhost;Database=test;Port=3306;charset=utf8;uid=root;pwd=123456;" Pomelo.EntityFrameworkCore.MySql --output-dir Entity  --context OpenDbContext
```
![image.png](/common/1621698024441-3e8887bb-a239-433a-9b75-231528fca8e0.png)
项目结构如下
![image.png](/common/1621698058297-5a7e56b2-5a58-4bff-90cb-b7e8f1daedc0.png)
> 不过反向工程这种并不会将数据库表注释带到代码中，并且每次执行时候会删除原来的表结构。


## 参考文档
> 开始迁移：[https://docs.microsoft.com/zh-cn/ef/core/managing-schemas/migrations/managing?tabs=dotnet-core-cli](https://docs.microsoft.com/zh-cn/ef/core/managing-schemas/migrations/managing?tabs=dotnet-core-cli)
> 自定义历史记录表：[https://docs.microsoft.com/zh-cn/ef/core/managing-schemas/migrations/history-table](https://docs.microsoft.com/zh-cn/ef/core/managing-schemas/migrations/history-table)

