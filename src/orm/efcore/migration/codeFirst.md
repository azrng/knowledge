---
title: 代码优先
lang: zh-CN
date: 2023-07-16
publish: true
author: azrng
isOriginal: true
category:
  - orm
tag:
  - 迁移
---
## 概述

根据项目里面的对象上下文和对象实体类生成数据库，通过程序包管理控制器操作

## 安装组件

```
Microsoft.EntityFrameworkCore.Tools
```

另外不同的数据库还需要安装不同的组件进行迁移数据库的操作  
MySQL：Pomelo.EntityFrameworkCore.MySql  
Sql Server：Microsoft.EntityFrameworkCore.SqlServer  
sqlite：Microsoft.EntityFrameworkCore.Sqlite  
pgsql：Npgsql.EntityFrameworkCore.PostgreSQL

## 创建迁移
```bash
# 基础的迁移
Add-Migration InitialCreate

# 迁移且显示执行的所有步骤
Add-Migration InitialCreate -verbose

# 指定数据库上下文迁移
Add-Migration InitialCreate -Context FirstDbContext -OutputDir Migrations\FirstDbContextMigrations
Update-Database -Context FirstDbContext
# 简写 add-migration init -c openDbContext -o Migrations\firstDbContext
# -Context参数表示要使用的 DbContext 类
```
![image.png](/common/1611801961116-4908455e-ee6b-4d90-baba-5a673c7ffa7c.png)  

然后会生成Migrations文件，向**Migrations**目录下的项目添加以下三个文件：

- XXXXXXXXXXXXXX_InitialCreate.cs      - 主迁移文件 。 包含应用迁移所需的操作（在 Up() 中）和还原迁移所需的操作（在 Down()中）。
- XXXXXXXXXXXXXX_InitialCreate.Designer.cs      - 迁移元数据文件 。 包含 EF 所用的信息。
- **MyContextModelSnapshot.cs**--当前模型的快照。 用于确定添加下一迁移时的更改内容。

### 迁移指定自定义SQL

有些复杂的情况，当我们无法通过 EF Fluent API 表达某些内容时，自定义 SQL 命令很有帮助，可以用它来实现将数据从一列迁移到另一列或者定义复杂的操作

```csharp
public partial class Update_Products : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.Sql("<YOUR CUSTOM SQL HERE>");
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        // You are also responsible for reverthing any changes.
    }
}
```

## 删除迁移
有时候，你可能在添加迁移后意识到需要在应用迁移前对EFCore模型作出其他更改。要删除上个迁移，请使用如下命令
```csharp
Remove-Migration
```
删除迁移后，可对模型作出其他更改，然后再次添加迁移

## 还原迁移
如果已对数据库应用一个迁移（或者多个迁移），但还需将其复原，则可使用同一个命令来应用过迁移，并指定回退时候的目标迁移名称。
```csharp
Update-Database LastGoodMigration
```

## 更新数据库
每次本地更新类代码文件时候，这个时候需要更新数据，那么就需要先删除原先存在的数据库，然后执行命令
Update-Database  --将迁移文件映射生成对应的数据库
![image.png](/common/1611802002383-03013f37-0582-4615-8231-f5d782515bce.png)
在执行完以上指令后，数据库中添加了新增加的内容
举例：

```csharp
Add-Migration initCreate1  生成迁移文件
Update-Database initCreate1 将迁移文件映射生成对应的数据库
Add-Migration initCreate2  生成迁移文件
Update-Database initCreate2 将迁移文件映射生成对应的数据库
Update-Database initCreate1 数据库会回到initcreate1的迁移，后来增加的东西也会被删除
Update-database -c openDBContext  更新指定的上下文文件
```

## 生成SQL脚本
调试迁移或将其部署到生产数据库是，生成一个SQL脚本很有帮助，这个时候就需要使用代码生成SQL数据库
```csharp
Script-Migration
Script-Migration -Output d:\InitialCreate.sql

//生成从版本d到f的脚本
Script-Migration d f

详细操作

```

## 运行时候实现迁移
```csharp
myDbContext.Database.Migrate();
```
运行的时候会先检查有没有数据库，如果没有则会创建数据库，然后如果没有迁移文件执行该命令会生成
```csharp
CREATE TABLE `__EFMigrationsHistory` (
    `MigrationId` varchar(150) CHARACTER SET utf8mb4 NOT NULL,
    `ProductVersion` varchar(32) CHARACTER SET utf8mb4 NOT NULL,
    CONSTRAINT `PK___EFMigrationsHistory` PRIMARY KEY (`MigrationId`)
) CHARACTER SET utf8mb4;
```
如果存在迁移文件，则会执行迁移文件，并且往迁移记录表添加一条数据。

## 删除数据库
```csharp
dbContext.Database.EnsureDeleted();
```
> [官网文档](https://docs.microsoft.com/zh-cn/dotnet/api/microsoft.entityframeworkcore.infrastructure.databasefacade.ensuredeleted?view=efcore-5.0)


## 创建数据库
```csharp
dbContext.Database.EnsureCreated();
```
如果已经存在数据库，则不执行任何操作。如果数据库不存在(或者该库下没有表)，那么就会创建数据库以及所有架构，并不需要提前生成迁移文件。
如果已经存在数据库，那么会执行下面语句，如果是空库那么就会生成表以及其他结构。

```csharp
 SELECT CASE WHEN COUNT(*) = 0 THEN FALSE ELSE TRUE END
      FROM information_schema.tables
      WHERE table_type = 'BASE TABLE' AND table_schema = '数据库名字'
```
如果在该语句后面放上myDbContext.Database.Migrate();，则会执行
```csharp
CREATE TABLE `__EFMigrationsHistory` (
    `MigrationId` varchar(150) CHARACTER SET utf8mb4 NOT NULL,
    `ProductVersion` varchar(32) CHARACTER SET utf8mb4 NOT NULL,
    CONSTRAINT `PK___EFMigrationsHistory` PRIMARY KEY (`MigrationId`)
) CHARACTER SET utf8mb4;
```
> [官网文档](https://docs.microsoft.com/zh-cn/dotnet/api/microsoft.entityframeworkcore.infrastructure.databasefacade.ensurecreated?view=efcore-5.0)

## 资料

https://learn.microsoft.com/zh-cn/ef/core/managing-schemas/migrations/managing?tabs=vs



使用多个提供程序进行迁移：https://learn.microsoft.com/zh-cn/ef/core/managing-schemas/migrations/providers?tabs=dotnet-core-cli
