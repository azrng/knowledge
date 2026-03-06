---
title: 递归出不来上级
lang: zh-CN
date: 2023-09-03
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - 无
filename: diguichubulaishangji
slug: rg9mbv
docsId: '31805030'
---
场景描述：现在是做一个左边的树形菜单，根据用户角色找出来可以访问的模块页面，但是因为最外层那个地方添加角色授权的不能勾选，导致查询的时候出不来。
初识的查询思路是：首先根据用户找出来他的角色ID，然后根据授权表和模块表去查询用户可以访问的页面，然后根据查出来的东西进行递归成一个树形菜单。
```sql
SELECT a.F_Id,a.F_ParentId,a.PltSystemId,a.F_EnCode,a.F_SortCode,a.F_FullName,a.F_Icon,a.F_UrlAddress,a.F_Target,a.F_IsMenu,F_AllowEdit,a.F_AllowDelete,a.F_EnabledMark,a.F_Description,c.F_ObjectId  
from plt_roleauthorize c LEFT 
JOIN sys_module a on c.F_ItemId=a.F_Id 
WHERE a.F_DeleteMark=0 and a.F_EnabledMark=1 and c.F_ObjectId='{roleid}'
```
问题就是那个查询可以访问的页面这点，因为用户都没有这个授权，所以想查询用户可以访问的页面中肯定没有上次的菜单项，下面就肯定出不来了。但是正常的逻辑是有下层，那么肯定得让出来上层，所以现在的解决办法是在模块表中加入了一个新的字段F_RootPath
![image.png](/common/1614056556772-22cdd083-5810-4c43-b754-ea0487203a18.png)
这个字段存储的是这一个数据的id和他所有上级的id，通过，号隔开
我们可以通过下面的语句去修改
```sql
//修改最外层的
UPDATE sys_module set F_RootPath=F_Id where F_ParentId='0';
//修改其他层的，需要多运行几次，直到没有行改变为止
UPDATE sys_module a
JOIN sys_module b
ON a.F_ParentId=b.F_Id and  a.F_RootPath is null  and b.F_RootPath is not null 
SET a.F_RootPath=concat( b.F_RootPath, ',' , a.F_Id);
查询语句也修改为：
SELECT a.F_Id,a.F_ParentId,a.PltSystemId,a.F_EnCode,a.F_SortCode,a.F_FullName,a.F_Icon,a.F_UrlAddress,a.F_Target,a.F_IsMenu,a.F_AllowEdit,a.F_AllowDelete,a.F_EnabledMark,a.F_Description,'2c7a384b-5c5c-4e37-bf7b-275c9204d475' F_ObjectId  
FROM sys_module a
where EXISTS
(
SELECT ia.F_RootPath
from sys_roleauthorize c
INNER JOIN sys_module ia on c.F_ItemId=ia.F_Id    
WHERE  ia.F_DeleteMark=0 and ia.F_EnabledMark=1 and c.F_ObjectId='2c7a384b-5c5c-4e37-bf7b-275c9204d475'
and FIND_IN_SET(a.F_Id,ia.F_RootPath)
) order by F_SortCode asc;
```
 
