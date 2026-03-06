---
title: 递归
lang: zh-CN
date: 2023-11-09
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 无
filename: digui
slug: pfd5go
docsId: '30986609'
---

## 概述
递归确实是一个奇妙的思维方式。对一些简单的递归问题，我们总是惊叹于递归描述问题的能力和编写代码的简洁，但要想真正领悟递归的精髓、灵活地运用递归思想来解决问题却并不是一件容易的事情。
递归：你打开面前这扇门，看到屋里面还有一扇门。你走过去，发现手中的钥匙还可以打开它，你推开门，发现里面还有一扇门，你继续打开它。若干次之后，你打开面前的门后，发现只有一间屋子，没有门了。然后，你开始原路返回，每走回一间屋子，你数一次，走到入口的时候，你可以回答出你到底用这你把钥匙打开了几扇门。
循环：你打开面前这扇门，看到屋里面还有一扇门。你走过去，发现手中的钥匙还可以打开它，你推开门，发现里面还有一扇门（若前面两扇门都一样，那么这扇门和前两扇门也一样；如果第二扇门比第一扇门小，那么这扇门也比第二扇门小，你继续打开这扇门，一直这样继续下去直到打开所有的门。但是，入口处的人始终等不到你回去告诉他答案。

## 操作

### 示例一

现在有一个表，这个表中包含上下级关系，比如说菜单，系统菜单下面有日志列表、用户管理等，他们之间的关系是日志列表和用户管理的父ID是系统菜单的ID；
所以我们要以json格式显示出来该分层关系，我们需要先建议一个model类，这个类里面有一个属性是他自己，用户存储下级关系，写好这点以后我们开始写我们的递归代码
注意：设计递归的东西千万不要递归数据库，要从数据库中全部查询出来，哪怕是多表联合查询，拿到数据以后我们再去递归这个数据集。
这个方法还可以优化 比如这个方法传递时候不传parment，传对象，然后返回void

```csharp
public List<SystemMenuModelResponse>    recursionModuleList(List<SystemMenuModelResponse> lists, string F_ParentId)
{
    List<SystemMenuModelResponse> systemMenuModelResponses = new List<SystemMenuModelResponse>();
    var modules = lists.FindAll(t => t.F_ParentId == F_ParentId);
    if (modules.Count > 0)
    {
        foreach (var item in modules)
        {
            var info = recursionModuleList(lists, item.F_Id);
            item.systemMenuModels = info;
            systemMenuModelResponses.Add(item);
        }
    }
    return systemMenuModelResponses;
}
```
查询出来的数据示例：  
![image.png](/common/1612073149629-ec6fcdba-a654-4447-a7d0-b2e560e2f06a.png)

### 示例二
```csharp
private List<TreeSelectResult> HandleRoleMenuTreeChildren(List<TreeSelectResult> menus, string parentId)
{
    var returnList = new List<TreeSelectResult>();
    var list = menus.Where(x => x.ParentId == parentId).OrderBy(x => x.SortNumber).ToList();
    if (list.Any())
    {
        foreach (var item in list)
        {
            item.Children = HandleRoleMenuTreeChildren(menus, item.Id);
            returnList.Add(item);
        }
    }
    return returnList;
}
//model类
    /// <summary>
    /// 树列表
    /// </summary>
    public class TreeSelectResult
    {
        /// <summary>
        /// id
        /// </summary>
        public string Id { get; set; } = string.Empty;
        /// <summary>
        /// 菜单名称
        /// </summary>
        public string Label { get; set; } = string.Empty;
        /// <summary>
        /// 父类id
        /// </summary>
        [JsonIgnore]
        public string ParentId { get; set; } = string.Empty;
        /// <summary>
        /// 排序码
        /// </summary>
        [JsonIgnore]
        public int SortNumber { get; set; }
        /// <summary>
        /// 子项
        /// </summary>
        public List<TreeSelectResult> Children { get; set; } = new List<TreeSelectResult>(0);
    }
```

