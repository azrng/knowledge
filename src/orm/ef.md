---
title: EF
lang: zh-CN
date: 2022-11-20
publish: true
author: azrng
isOriginal: true
category:
  - orm
tag:
  - EF
---
## 概述

Entity Framework是实现orm思想中的一种框架。linq也是，只不过是轻量级的
• ADO.NET EF就是以ADO.NET为基础所发展出来的对象关系。
• 实体框架EF是ADO.NET中一组支持开发面向数据的软件应用程序的技术，是微软的一个ORM框架。底层还是ADO.NET。

## 三种使用方式

1. Db First 数据库优先
2. Model First 模型优先
3. Code First 代码优先

![image.jpeg](/common/1608702450418-2ed00935-f3be-40b3-baac-170c69243b06.jpeg)

上图中，前三种分别是DbFirst、ModelFirst和CodeFirst，而第4种也是CodeFirst。  
Database-First模式明显性能会差点，但是它很适合初学者，或者是比较急的小型项目。还有一点，我们在做项目时可能不容易体会到它的好处，但如果做数据库结构比较成熟稳定的产品时，我们可以很轻松的使用数据库生成实体模型，从而实现快速开发。  
Model-First模式优点是开发人员能够在模型设计（使用vs的EF设计器设计出可视化的实体数据模型以及他们之间的关系）完成后，可以利用VS等工具快速生成数据库脚本。缺点是设计模型时完全了解数据库的结构，在模型中手动添加表关系，并且生成的脚本有点不简洁。
 Code-First模式优点是性能比较好，且代码较少冗余。比较推荐该方案

## 连接不同数据库

### sqlsever

```csharp
sa登录：
metadata=res://_/poco.ceshi3.csdl|res://_/poco.ceshi3.ssdl|res://*/poco.ceshi3.msl;provider=System.Data.SqlClient;provider connection string="data source=.;initial catalog=MPMS;persist security info=True;user id=sa;password=;MultipleActiveResultSets=True;App=EntityFramework"

window登录方式
metadata=res://_/poco.ceshi3.csdl|res://_/poco.ceshi3.ssdl|res://*/poco.ceshi3.msl;provider=System.Data.SqlClient;provider connection string="data source=.;initial catalog=MPMS;integrated security=True;multipleactiveresultsets=True;application name=EntityFramework"
```

### MySQL

#### 连接字符串格式

```
server=localhost;database=moviesystem;uid=root;pwd=;SslMode=None;
```

#### Nuget包

使用Nuget包：MySqlConnector去连接数据库，如果使用老的方式(MySql.Data(6.8.8) MySql.Data.Entity(6.8.8)连接mysql8.x)可能会遇到稀奇古怪的问题。

另一个组合是

```csharp
当前MySQL数据库中，版本使用的是mysql-5.7.26-winx64
然后安装插件（按步骤来）：
1.mysql-for-visualstudio-1.2.8  
2.mysql-connector-net-6.10.7
另一个组合
1.mysql-for-visualstudio-1.2.8  
2.mysql-connector-net-6.10.7

然后需要在nuget上面安装：
EntityFrameWork 6.2.0
mysql.Data   6.8.8  
Mysql.Data.Entity 6.8.8
```

### Oracle

#### 连接字符串

```
DataSource=(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=192.168.110.186)(PORT=1521))(CONNECT_DATA=(SERVER=xxx)(SERVICE_NAME=TEST)));UserID==APP;Password==SB123;PersistSecurityInfo=True;ConnectionLifetime=20;MaxPoolSize=500
```

#### Nuget包

```
<packages>
  <package id="Oracle.ManagedDataAccess" version="19.3.0" targetFramework="net472" />
</packages>
```

## 操作

### 创建上下文对象

```csharp
WordBoradEntities db = new WordBoradEntities();
```

### 登录（相当于查询操作）

```csharp
var userinfo = db.TbUsers.FirstOrDefault(u => u.Email == user.Email && u.Password == user.Password);
if (userinfo != null)
```

### 查询

#### 单个表查询

```csharp
List list = db.Users.Where(u => u.uName == "刘德华").ToList();
```

#### 两个表链接查询

```csharp
var list=db.User.Join(db. UsersAddresses,c=>c.Id,g=>g.udid,(c,g)=>new{Name=c.Name,GroupName=g.GroupName});
```

#### 模糊查询

如何需要根据某一个进行模糊查询，那么可以使用Contains("V")来实现，同理，"V%"、"%V"可以分别使用StartsWith()与EndsWith()函数实现。

#### 过滤查询

示例:查询用户姓名中包含有p字母的所有用户信息
推荐写法：使用contains

> var data3 = dbContext.T_UserInfor.Where(u => u.userName.Contains("p")).ToList();

这点和efcore的不一样，efcore生成的是CHARINDEX("p",userName)>0

#### 包含关系

示例：求用户姓名为 "p1,p2,p3,p4,x2,y4"的所有用户信息，已知字符串 string str = "p1,p2,p3,p4,x2,y4";
正确做法：将字符串转成list，然后再使用contains

```csharp
string str = "p1,p2,p3,p4,x2,y4";
var strList = str.Split(',').ToList();
var data5 = dbContext.T_UserInfor.Where(u => strList.Contains(u.userName)).ToList();
```

### 修改

1.官方推荐的修改方式（先查询，再修改）

```csharp
//将Id为2的Users数据查询出来
var user = db.Users.Where(u => u.Id == 2).FirstOrDefault();
//修改UserName的属性
user.UserName = "222222222222222";
//保存修改
db.SaveChanges();
```

### 添加

```csharp
//1.1创建一个实体对象
    User uObj = new User()
    {
                uName = "刘德华",
                uLoginName = "aaa"
    };
//1.2通过EF新增到数据库
//1.2.1将对象加入到数据上下的User集合中
db.Users.Add(uObj);
//1.2.2调用数据上下文的保存方法，将对象保存到数据库
db.SaveChanges();
```

### 删除

注：版本一、二都是根据主键删除，版本三是根据任意条件到数据库查询然后再根据查询的结果进行删除，实际上版本三也是根据查询出来的结果中的主键进行删除。

#### 版本1：根据主键删除

```csharp
//实例化一个Users对象，并制定Id的值
Users user = new Users() { Id = 1 };
//将user附加到一个上下文对象中，并获得EF容器的管理对象
 var entry = db.Entry(user);或者 var entry=db.Entry(user);
//设置该对象的状态为删除
entry.State = EntityState.Deleted;
//保存修改
db.SaveChanges();
```

#### 版本2：根据主键删除

```csharp
//实例化一个Users对象，并指定Id的值
 Users user = new Users() { Id = 1 };
//将user附加到上下文对象中
db.Users.Attach(user);
//删除user对象
Db.Users.Remove(user);
//保存修改
db.SaveChanges();
```

#### 版本三：根据条件先查询出来然后再删除

```csharp
var list= db.Users.Where(u => u.Name ==”张三”)；
if(list!=null&&list.Any())
{
       Foreach(User item in list)
       {
             db.User.Remove(item);
	   }
}
db.SaveChanges();
```

### EF执行sql语句

#### 查询数据

`Db.DataBase.SqlQuery("sql语句");`
例子：

```csharp
DbRawSqlQuery result1 = db.Database.SqlQuery("SELECT * FROM test.student WHERE name = '萝莉'");
DbRawSqlQuery result1 = db.Database.SqlQuery(typeof(student), "SELECT * FROM test.student WHERE name = '萝莉'");
```

#### 实现增删改操作

```csharp
// 同步的方式
Db.DataBase.ExecuteSqlCommand("sql语句")；  只返回受影响行数

// 异步的方式
Db.DataBase.ExecuteSqlCommandAsync("sql语句");
// 首行首列
db.Database.SqlQuery(strSql).ToList()
```

