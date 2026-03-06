---
title: 交接并集
lang: zh-CN
date: 2023-10-22
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 无
filename: jiaojiebingji
slug: zwfziu
docsId: '30978864'
---
Distinct、Union、Concat、Intersect、Except、Skip、Take、SkipWhile、TakeWhile、Single、SingleOrDefault、Reverse、SelectMany,Aggregate()

Distinct - 过滤集合中的相同项；
```
List<int> list= new List<int>() {1,2,3,4,4,5,6,6 };
var newlist=list.Distinct();
```

得到的结果就是；1,2,3,4,5,6
Union - 连接不同集合，自动过滤相同项

```
List<int> list= new List<int>() {1,2,3,4,4,5,6,6 };
List<int> list1= new List<int>() {5,6,6,7,8,9};
var newlist=list.Union (list1);
```

得到的结果就是；1,2,3,4,5,6,7,8,9
Concat - 连接不同集合，不会自动过滤相同项；
```
 List<int> list= new List<int>() {1,2,3,4,4,5,6,6 };
List<int> list1= new List<int>() {5,6,6,7,8,9};
  var newlist=list.Union (list1);
```

- 1
- 2
- 3

得到的结果就是；1,2,3,4,4,5,6,6,5,6,6,7,8,9
Intersect - 获取不同集合的相同项（交集）；
```
List<int> list= new List<int>() {1,2,3,4,4,5,6,6 };
List<int> list1= new List<int>() {5,6,6,7,8,9};
  var newlist=list.Intersect (list1);
```

- 1
- 2
- 3

得到的结果就是；5,6
Except - 从某集合中删除其与另一个集合中相同的项；其实这个说简单点就是某集合中独有的元素
```
List<int> list= new List<int>() {1,2,3,4,4,5,6,6 };
List<int> list1= new List<int>() {5,6,6,7,8,9};
  var newlist=list.Except (list1);
```

- 1
- 2
- 3

得到的结果就是；1,2,3,4
Skip - 跳过集合的前n个元素；
```
List<int> list= new List<int>() {1,2,3,4,4,5,6,6 };
  var newlist=list.Skip (3);
```

- 1
- 2

得到的结果就是；4,4,5,6,6
Take - 获取集合的前n个元素；延迟
```
List<int> list= new List<int>() {1,2,2,3,4,4,5,6,6 };
  var newlist=list.Take (3);
```

- 1
- 2

得到的结果就是；1,2,2
```
List<string> ListA = new List<string>();
List<string> ListB = new List<string>();
List<string> ListResult = new List<string>();
ListResult = ListA.Distinct().ToList();//去重
ListResult = ListA.Except(ListB).ToList();//差集
ListResult= ListA.Union(ListB).ToList(); //并集
ListResult = ListA.Intersect(ListB).ToList();//交集
```
