---
title: 原型模式
lang: zh-CN
date: 2022-07-17
publish: true
author: azrng
isOriginal: true
category:
  - 软件设计
tag:
  - 无
filename: yuanxingmoshi
slug: db9mob
docsId: '83607252'
---

## 简述
原型模式也属于建造型模式。如果一个对象创建成本比较大，而同一个类的不同对象之间差别不大(大部分字段都相同或者完全相同)，在这种情况下，我们可以利用已有对象(原型)进行复制(或者拷贝)的方式，来创建新对象，以达到节省创建时间的目的，这种基于原型来创建对象的方式就叫做原型设计模式，简称原型模式。

### 什么叫做创建成本大
比如一个对象的创建包含申请内存、给成员复制这一个过程，本身并不会花费太多时间，或者说对大部分业务系统来说影响不大，但是如果一个对象的创建过程包含复杂的计算或者需要从网络、数据库、文件系统等比较耗时的步骤创建的，那么就可以利用原型模式，直接从现有对象拷贝得到，而不是创建新对象。

举例说明：比如我们有一个系统中有一个静态字典集合存储的是某一些关键字搜索的次数，key是关键字，value是搜索次数，每个一段时间获取一下，在项目启动的时候初始化之前的数据，如果在后续想获取的时候，我们再一次从数据库读取计算，那么这个过程就会比较耗时，我们可以在下一次读取的时候，只计算日志表中搜索记录超过上一次更新时间的数据，然后在原有的集合中增加这些新的搜索记录，但是我们有一个特殊需要是要保存上一次的集合内容，所以我们不能直接在上一次集合上进行修改，我们要基于上次的集合拷贝一份数据出来进行修改，这个过程就是原型模式。
```csharp
public class SearchCollectService
{
    private Dictionary<string, SearchCollectDto> currKeywordSearch = new Dictionary<string, SearchCollectDto>();

    private long lastUpdateTime = -1;

    public void Refresh()
    {
        var newKeywordSearch = currKeywordSearch.Clone<Dictionary<string, SearchCollectDto>>();

        //从数据库查询更新的搜索数据  查询大于某一个时间点的数据集合
        List<SearchCollectDto> updateSearchKeyword = new List<SearchCollectDto>();
        long maxNewUpdateTime = lastUpdateTime;
        foreach (var item in updateSearchKeyword)
        {
            if (maxNewUpdateTime<item.LastSearchTime)
            {
                maxNewUpdateTime = item.LastSearchTime;
            }
            if (newKeywordSearch.ContainsKey(item.Keyword))
            {
                newKeywordSearch[item.Keyword]
                    .SetCount(item.Count)
                    .SetLastTime(item.LastSearchTime);
            }
            else
            {
                newKeywordSearch[item.Keyword]=item;
            }
        }

        //从数据库读取所有数据放到
    }
}

/// <summary>
/// 搜索类
/// </summary>
public class SearchCollectDto
{
    /// <summary>
    /// 关键字
    /// </summary>
    public string Keyword { get; set; }

    /// <summary>
    /// 搜索次数
    /// </summary>
    public int Count { get; set; }

    /// <summary>
    /// 最后一次搜索时间
    /// </summary>
    public long LastSearchTime { get; set; }

    public SearchCollectDto SetCount(int count)
    {
        Count+=count;
        return this;
    }

    public SearchCollectDto SetLastTime(long lastTime)
    {
        LastSearchTime=lastTime;
        return this;
    }
}
```

## 实现方式

### 深拷贝
将原有对象的完完全全拷贝一次。方案：序列化和反序列化、递归创建对象赋值
```csharp
public static class ObjectExtensions
{
    public static T Clone<T>(this object ob)
    {
        if (ob is null) return default;

        var jsonStr = JsonConvert.SerializeObject(ob);
        return JsonConvert.DeserializeObject<T>(jsonStr);
    }
}
```

### 浅拷贝
将原有对象的数据引用地址拷贝，共享数据，方案：等号赋值操作

## 总结
当创建一个对象比较复杂的时候，但是需要的新对象的内容和已有对象的内容比较相似时候，可以利用已有对象去拷贝的方式去创建新对象。
