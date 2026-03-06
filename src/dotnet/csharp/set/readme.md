---
title: 说明
lang: zh-CN
date: 2023-10-22
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 集合
filename: readme
slug: zpo0xlaqvbnsknay
docsId: '125995847'
---

## 概述

[一网打尽！C#中最常用的集合类型、本质大盘点](https://mp.weixin.qq.com/s/sv8cF1ygpz-fY1lyzMThkg)

## Dictionary


### 资料
[https://www.cnblogs.com/zhaolaosan/p/16244067.html](https://www.cnblogs.com/zhaolaosan/p/16244067.html) | C# 之Dictionary（字典）底层源码解析 - 赵不灰 - 博客园
C#中 Dictionary<TKey, TValue>的存储结构分析https://www.cnblogs.com/pengze0902/p/17830689.html

字典：https://dev.to/bytehide/hashmap-in-c-detailed-guide-1p9p

## 操作

#### Group by分组

测试数据：

```c
 var studentList = new List<Student>
            {
                new Student {ClassName = "软工一班", StudentName = "康巴一", StuId = 1},
                new Student {ClassName = "软工一班", StudentName = "康巴二", StuId = 2},
                new Student {ClassName = "软工一班", StudentName = "康巴三", StuId = 3},
                new Student {ClassName = "软工二班", StudentName = "康定一", StuId = 4},
                new Student {ClassName = "软工二班", StudentName = "康定二", StuId = 5},
                new Student {ClassName = "软工二班", StudentName = "康定三", StuId = 6},
            };
            var aa = studentList.GroupBy(t => t.ClassName);
            var bb = studentList.GroupBy(t => t.ClassName).FirstOrDefault();
            var cc = studentList.GroupBy(t => t.ClassName).Count();
```

Aa:  
key是软工一班，对应的item下面有三个数组  
Bb:  
key是软工一班，对应的item下面有三个数组  
Cc:  
输出结果2  

- 如果想好分组后取分组后的第一条

```c
var aaa = list.GroupBy(t => t.Id, (key, group) => group.OrderBy(x => x.StartTime).FirstOrDefault()).ToList();
var aaa = list.GroupBy(t => t.Id).Select(t => t.FirstOrDefault()).ToList();
var aaa = list.GroupBy(t => t.Id).Select(t => t.OrderBy(x => x.StartTime).FirstOrDefault()).ToList();
```

- 集合去重

```c
list = list.GroupBy(d => new { d.Age, d.Name })
    .Select(d => d.FirstOrDefault())
    .ToList();
```

或者  
利用hashset对于重复元素会进行过滤筛选达到去重的效果

```c
public static IEnumerable<TSource> Distinct<TSource, TKey>(
        this IEnumerable<TSource> source,
        Func<TSource, TKey> keySelector)
    {
        var hashSet = new HashSet<TKey>();        
        foreach (TSource element in source)
        {
            if (hashSet.Add(keySelector(element)))
            {
                yield return element;
            }
        }
    }
```

---


#### 集合拼接：Concat 和 Union

Concat 用来拼接两个集合，不会去除重复元素，示例：

```c
List<int> foo = newList<int> { 1, 2, 3 };
List<int> bar = newList<int> { 3, 4, 5 };
// 通过 Enumerable 类的静态方法
var result = Enumerable.Concat(foo, bar).ToList(); // 1,2,3,3,4,5
// 通过扩展方法
var result = foo.Concat(bar).ToList(); // 1,2,3,3,4,5
Union 也是用来拼接两个集合，与 Concat 不同的是，它会去除重复项，示例：
var result = foo.Union(bar); // 1,2,3,4,5
```

---

#### ArrayList和list的区别

```
ListA.Distinct().ToList();//去重
ListA.Except(ListB).ToList();//差集
ListA.Union(ListB).ToList();  //并集
ListA.Intersect(ListB).ToList();//交集
```

