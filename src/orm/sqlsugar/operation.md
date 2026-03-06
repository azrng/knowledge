---
title: 操作
lang: zh-CN
date: 2023-03-23
publish: true
author: azrng
isOriginal: true
category:
  - orm
tag:
  - 无
filename: caozuo
slug: mk10p2
docsId: '32068351'
---

## 连接数据库

```
oracle连接数据库方式
Data Source=192.168.1.102/ORANEWLE;User ID=DYZHCSLEAPP;Password=NYEKTLEAPP;

mysql连接数据库方式
server=192.168.120.59;Port=3306; Database=yisheng;Uid=read_user;Pwd=12341234;SslMode=None;

SQL Server连接数据库方式
server=192.168.1.101;uid=sa;pwd=123456; database =TicketPlatform
```

## 1. 查询

### 1.1 分页查询

#### 1.1.1 没有条件
```csharp
Db.Queryable<sugModel.table1>().Where(it => it.id == 2) .OrderBy(it => it.id, OrderByType.Desc).ToPageList(pageIndex, pageSize, ref totalCount)
```

#### 1.1.2 动态表达式
```csharp
  			var p = new PageModel() { PageIndex = pageIndex,PageSize = pageSize  };
            var exp = Expressionable.Create<table1>()
                       .AndIF(model.id!=0 && model.id.ToString()!="",it=>it.id==model.id)
                       .AndIF(!string.IsNullOrWhiteSpace(model.name),it=>it.name.Contains(model.name))
                       .AndIF(model.age!=0 && model.age.ToString()!="",it=>it.age==model.age)
                       .ToExpression();//拼接表达式
            List<table1> table1s = table1Db.GetPageList(exp, p, it => it.id, OrderByType.Desc);
            totalCount = p.PageCount;
```

### 1.2 联合查询
SQL语句
```csharp
select * from CustomerTravelCard a left join TravelCardType b on  a.Code=b.Code and   a.Status=206 and a.EndTime>getdate() WHERE  b.CardType=100
```
使用sqlsugar
```csharp
var list = dbnkfw.Db.Queryable<CustomerTravelCard, TravelCardType>((a, b) => new object[] {
			 JoinType.Left,a.Code==b.Code
			}).Where((a, b) => b.CardType == 100 && a.Status == 206 && a.EndTime > DateTime.Now).
Select((a, b) => new { a.CustomerName, a.PhoneNumber });
```

### 聚合查询

#### 分组查询

根据用户名称分组，然后找出来重复的用户名

```c#
var sheetList = await _db.Queryable<sheet>().Where(t => t.State == 0).GroupBy(t => t.Name).Select(t => new
{
	t.Name,
	count = SqlFunc.AggregateCount(t)
}).MergeTable().Having(t => t.count >= 2).Select(t => new
{
	t.Name,
	t.count
}).ToListAsync();
```



## 2. 增加

```csharp
try
{
	_db.Ado.BeginTran();
	//d.新集合中剩下的授权信息新增到数据库。
	listNewPerIds.ForEach((perId) =>
	{
		_db.Insertable(new SysRoleMenuMapping()
		{
			RoleId = roleId,
			MenuId = perId,
			Id = Guid.NewGuid().ToString().Replace("-", ""),
		}).ExecuteCommand();
	});

	//e.旧集合中剩下的授权信息从数据库中删除。
	listOldPers.ForEach((perObj) =>
	{
		_db.Deleteable<SysRoleMenuMapping>(perObj).ExecuteCommand();
	});
	_db.Ado.CommitTran();
}
catch (Exception)
{
	_db.Ado.RollbackTran();
}
```

## 3. 修改
```csharp
//根据实体更新
var t1 = db.Updateable(updateObj).ExecuteCommand(); //这种方式会以主键为条件
//根据指定列去更新
var t1 = db.Updateable(updateObj).WhereColumns(it=>new{it.XId}).ExecuteCommand();//单列可以用 it=>it.XId
//只更新指定列
var t3 = db.Updateable(updateObj).UpdateColumns(it => new { it.Name }).ExecuteCommand();
//更新指定列以外的列
var t4 = db.Updateable(updateObj).IgnoreColumns(it => new { it.Name, it.TestId }).ExecuteCommand();
//批量更新，主键是更新条件
List<Students> list=GetList();
var t7 = db.Updateable(list).ExecuteCommand();
// 根据字段类型去更新
var dt = new Dictionary<string,object>();
dt.Add("id", 1);
dt.Add("name", "1");
var t66 = db.Updateable(dt).AS("student").WhereColumns("id").With(SqlWith.UpdLock).ExecuteCommand()
```

### 选择项修改

如果根据实体修改，实体中没有给值的字段会被直接清空，如果修改实体中有值的那些，如果int类型没有赋值，会自动默认给0覆盖原来的数据库数据

 

![](/common/1610521152548-ddfda290-bdb6-4804-bb65-dc95af1029c8.png)

动态表达式

```c#
var exp = Expressionable.Create<Student>()
                          .OrIF(1 == 1, it => it.Id == 11)
                          .And(it => it.Id == 1)
                          .AndIF(2 == 2, it => it.Id == 1)
                          .Or(it => it.Name == "a1").ToExpression();//拼接表达式
 var data311 = StudentDb.GetList(exp);  // 动态表达式查询     <==用处
```

## 4. 删除
