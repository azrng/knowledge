---
title: HierarchyId
lang: zh-CN
date: 2023-09-23
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - 无
filename: hierarchyid
slug: xl3p5a
docsId: '66865487'
---

## 概述
HierarchyId是一种长度可变的Sql Server数据类型，它能存储带有层次结构的数据。
HierarchyId数据类型的值可以直接表示树层次结构中的位置，例如：

| Id | Name |
| --- | --- |
| / | 总公司 |
| /1/ | 分公司1 |
| /2/ | 分公司2 |
| /1/1/ | 部门A |
| /1/1/1/ | 小组X |
| /1/1/2/ | 小组Y |

HierarchyId可以使用下列函数:

- **GetAncestor **：取得第n个祖先
- **GetDescendant** ：取得第n个子节点
- **GetLevel **：取得级别
- **GetRoot** ：取得根
- **Parse** ：将字符串转换为HierarchyId
- **ToString** ：将HierarchyId转换为字符串，与parse正好相反

## 操作
执行下列Sql，在数据库中建表：
```csharp
create table Organizations(
 Id hierarchyid primary key,
 Name nvarchar(50)
); 
```
创建控制台应用程序，然后引用nuget包EntityFrameworkCore.SqlServer.HierarchyId。

新建Organization.cs，代码如下：
```csharp
public class Organization
{
    public HierarchyId Id  { get; set; }
    public string Name { get; set; }
}
```
新建DemoContext.cs，代码如下：
```csharp
public class DemoContext : DbContext
{
    public DbSet<Organization> Organizations { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        string connectionString = "...";
        optionsBuilder.UseSqlServer(connectionString, config => config.UseHierarchyId());
    }
}
```
使用config.UseHierarchyId()开启HierarchyId映射。现在，我们可以对HierarchyId数据类型进行操作了。
代码如下：
```csharp
//增
using (var db = new DemoContext())
{
    db.Organizations.AddRange(
            new Organization { Id= HierarchyId.Parse("/"), Name= "总公司" }
            ,new Organization { Id = HierarchyId.Parse("/1/"), Name = "分公司1" }
            ,new Organization { Id = HierarchyId.Parse("/2/"), Name = "分公司2" }
            , new Organization { Id = HierarchyId.Parse("/1/1/"), Name = "部门A" }
            , new Organization { Id = HierarchyId.Parse("/1/1/1/"), Name = "小组X" }
            , new Organization { Id = HierarchyId.Parse("/1/1/2/"), Name = "小组Y" }
        );

    db.SaveChanges();
}

//删除分公司2
using (var db = new DemoContext())
{
    db.Organizations.Remove(db.Organizations.Where(p => p.Id == HierarchyId.Parse("/2/")).First());
    db.SaveChanges();
}

//修改小组名称
using (var db = new DemoContext())
{
    var team = db.Organizations.Where(p => p.Id == HierarchyId.Parse("/1/1/1/")).First();
    team.Name = "Team1";

    team = db.Organizations.Where(p => p.Id == HierarchyId.Parse("/1/1/2/")).First();
    team.Name = "Team2";

    db.SaveChanges();
}

//查询分公司1下的所有小组
using (var db = new DemoContext())
{
    var organizations=  db.Organizations.Where(p => p.Id.GetLevel()==3 
        && p.Id.GetAncestor(2)== HierarchyId.Parse("/1/"))
        .OrderBy(p=>p.Id).ToList();
    
    foreach (var organization in organizations)
    {
        Console.WriteLine(@$"{organization.Id} {organization.Name}");
    }
}
```

## 资料
HierarchyId数据类型详情请参看官方文档：https://docs.microsoft.com/zh-cn/sql/relational-databases/hierarchical-data-sql-server?view=sql-server-ver15
[https://mp.weixin.qq.com/s/72Vmgr95s4olzgRpVxw-KA](https://mp.weixin.qq.com/s/72Vmgr95s4olzgRpVxw-KA) | 使用EF Core操作层次结构数据

