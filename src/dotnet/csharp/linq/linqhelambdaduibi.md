---
title: Linq和Lambda对比
lang: zh-CN
date: 2023-10-22
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 无
filename: linqhelambdaduibi
slug: afnhqc
docsId: '47638545'
---

## 开篇语
本文内容大多转载自博客园的作者：农码一生 ，文章已授权。

## 介绍
LINQ(语言集成查询)是一系列直接将查询功能集成到c#语言的技术统称。
Lambda表达式是一个匿名函数，c#中的表达式都使用lambda运算法=>,用在基于方法的linq查询中，作为类似where和where等标准查询运算符方法的参数。

![](/common/1624418893458-a4e8fab5-f0bb-4fbb-8d5d-461e1f7345e5.png)
由此可见Linq表达式和Lambda表达式并没有什么可比性。
那与Lambda表达式相关的整条语句称作什么呢？在微软并没有给出官方的命名，在《深入理解C#》中称为点标记。
![](/common/1624418907711-415efac6-f678-453e-98a7-806a68ab9d74.png)

## 查询表达式和点标记
```csharp
 //查询表达式
 var students1 = from t in db.Students
                where t.Name == "张三"
                select new { t.Id, t.Name, t.Age };
 //点标记
 var students2 = db.Students
                 .Where(t => t.Name == "张三")
                 .Select(t => new { t.Id, t.Name, t.Age });
```

## 点标记

##### 1、所有的查询表达式都可以转成对应的点标记。反之，不是所有的点标记都可以转成查询表达式。
为什么？因为查询表达式在编译后就直接变成了点标记：（以下是上面两个语句对应的编译后的反编译C#代码）
![](/common/1626361260794-c0bdc2b5-29b0-4e64-aece-4e141a736115.png)
生成了一模一样的代码。（由于是编译后的，好多乱七八糟的代码。我们只看Where和Select关键字就知道，使用的都是点标记。）

##### 2、点标记比查询表达式更加优雅
示例一：
```csharp
//查询表达式
 var students1 = from t in db.Students
                 where t.Name == "张三"
                 select t;
 //点标记
 var students2 = db.Students
                 .Where(t => t.Name == "张三");
```
我为什么一定要 select t 啊，不能省吗？省了就报错：
![](/common/1626361407501-4360e155-c4ef-4937-89a2-3fb016a6043f.png)
示例二：
必须需要括号包裹起来才能取结果集
```csharp
//查询表达式
var students1 = (from t in db.Students
                 where t.Name == "张三"
                 select t).ToList();
//点标记
var students2 = db.Students
                .Where(t => t.Name == "张三")
                .ToList();
```
示例三：
（为什么说："不是所有的点标记都可以转成查询表达式"【此例只适用于IEnumerator】）
此条点标记你能转成查询表达式吗？
```csharp
var list = new List<string>() { "张三", "张三", "张三", "张三", "李四", "张三", "李四", "张三", "李四" };

var students2 = list
                .Where((item, index) => item == "张三" && index % 2 == 0)
                .Select((item, index) => new { item, index })
                .ToList();
```
查询表达式你能Reverse吗？
```csharp
var list = new List<string>() { "张三1", "张三2", "张三3", "张三0", "李四9", "张三3", "李四", "张三2", "李四" };
var students2 = list
             .Where((item, index) => item.Contains("张三"))
             .Select((item, index) => new { item, index })
             .Reverse()//反序
             .ToList();
```
```csharp
ListA.Distinct().ToList();//去重
ListA.Except(ListB).ToList();//差集
ListA.Union(ListB).ToList();  //并集
ListA.Intersect(ListB).ToList();//交集
```

## 查询表达式
比如下面几种情况我们就可以选择使用查询表达式：
示例一：（本例适用于Linq to Object 和 没有建主外键的EF查询）
点标记中的Join需要传四个参数表达式，是不是有点晕了。。。
```csharp
var list1 = new Dictionary<string, string> { { "1", "张三" }, { "2", "李四" }, { "3", "张三" }, { "4", "张三" } };
var list2 = new Dictionary<string, string> { { "1", "张三" }, { "2", "李四" }, { "3", "李四" }, { "4", "张三" } };

//查询表达式
var obj1 = from l1 in list1
           join l2 in list2
           on l1.Key equals l2.Key
           select new { l1, l2 };
//点标记
var obj = list1.Join(list2, l1 => l1.Key, l2 => l2.Key, (l1, l2) => new { l1, l2 });
```
示例二：
点标记需要区分OrderBy、ThenBy有没有觉得麻烦
```csharp
//查询表达式
var obj1 = from l1 in list1
           join l2 in list2
           on l1.Key equals l2.Key
           orderby l1.Key, l2.Key descending
           select new { l1, l2 };
//点标记
var obj = list1.Join(list2, l1 => l1.Key, l2 => l2.Key, (l1, l2) => new { l1, l2 })
    .OrderBy(li => li.l1.Key)
    .ThenByDescending(li => li.l2.Key)
    .Select(t => new { t.l1, t.l2 });
```

## 联接查询
关于联接查询使用查询表达式会更合适一些这个上面已经说了。
接下来我们写内联、左联、交叉联的查询表达式和对应的点标记代码。
**内联**：
![](/common/1626361717877-a4833c49-ba52-4250-8139-2e26c6c23980.png)
**左联：**
![](/common/1626361717336-2575d3e2-c402-421e-a595-b9c0a3915672.png)
**交叉联：**
![](/common/1626361717314-cfc0f4af-9e5a-48a6-beec-bd84ec317cb5.png)
**其实关于联接查询，如果EF建好了主外键我还是觉得点标记用起来更爽爽的。**

## 总结
> 1.所有的查询表达式都可以转成对应的点标记。
> 2.点标记比查询表达式更加简洁。


## 参考文档
> 摘抄地址：[https://www.cnblogs.com/zhaopei/p/5746414.html](https://www.cnblogs.com/zhaopei/p/5746414.html)

