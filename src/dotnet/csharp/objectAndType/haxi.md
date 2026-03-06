---
title: 哈希
lang: zh-CN
date: 2023-11-09
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 无
filename: haxi
slug: gl7lz3695c9v0he7
docsId: '146446384'
---

## HashSet
* 如果想判断某一个元素是否在HastSet内，建议使用Contains进行判断。
* 如果箱HashSet中插入重复的元素，它的内部会忽视这次操作而不会抛出异常。
* 移除元素：从HastSet中删除某一个元素可以调用Remove方法。
* set集合方法  
> IsProperSubsetOf 用于判断 HashSet 是否为某一个集合的完全子集  

```csharp
HashSet<string> setA = new HashSet<string>() { "A", "B", "C", "D" };
HashSet<string> setB = new HashSet<string>() { "A", "B", "C", "X" };
HashSet<string> setC = new HashSet<string>() { "A", "B", "C", "D", "E" };
if (setA.IsProperSubsetOf(setC))
   Console.WriteLine("setC contains all elements of setA.");
if (!setA.IsProperSubsetOf(setB))
   Console.WriteLine("setB does not contains all elements of setA.");
//输出结果：
//setC contains all elements of setA
//setB does not contains all elements of setA
```
> UnionWith方法常用于集合的合并=》合并后也不会包含重复的代码  

```csharp
HashSet<string> setA = new HashSet<string>() { "A", "B", "C", "D", "E" };
HashSet<string> setB = new HashSet<string>() { "A", "B", "C", "X", "Y" };
setA.UnionWith(setB);
foreach(string str in setA)
{
   Console.WriteLine(str);
}
/输出结果：当你执行完上面的代码，SetB 集合会被 SetA 集合吞掉，最后 SetA 集合将会是包括："A", "B", "C", "D", "E", "X", and "Y" 。
```
> IntersectWith 方法常用于表示两个 HashSet 的交集  

```csharp
HashSet<string> setA = new HashSet<string>() { "A", "B", "C", "D", "E" };
HashSet<string> setB = new HashSet<string>() { "A", "X", "C", "Y"};
setA.IntersectWith(setB);
foreach (string str in setA)
{
    Console.WriteLine(str);
}
//输出结果：只有两个 HashSet 中都存在的元素才会输出到控制台中 A C
```
>ExceptWith 方法表示数学上的减法操作
```csharp
setA.ExceptWith(setB);
//它返回的元素为：setA中有，setB中没有 的最终结果
```
> SymmetricExceptWith 方法常用于修改一个 HashSet 来存放两个 HashSet 都是唯一的元素，换句话说，我要的就是两个集合都不全有的元素

```csharp
HashSet<string> setA = new HashSet<string>() { "A", "B", "C", "D", "E" };
HashSet<string> setB = new HashSet<string>() { "A", "X", "C", "Y" };
setA.SymmetricExceptWith(setB);
foreach (string str in setA)
{
  Console.WriteLine(str);
}
//当你执行完上面的代码，你会发现，setA中有而setB中没有 和 setB中有而setA中没有的元素将会输出到控制台中。
//输出结果： XBYDE
```

## 哈希表
```csharp
Hashtable ht = new Hashtable();
ht.Add(1, "张三");//键值对格式   都是object格式   键必须是唯一的  
ht[1] = "李四";//修改数据
bool a1 = ht.ContainsKey(1);//键值对中是否包含某个键
//ht.Clear();//移除所有元素
ht.ContainsValue("张三");//是否包含特定的值
```
