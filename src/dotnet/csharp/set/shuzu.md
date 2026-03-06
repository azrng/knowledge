---
title: 数组
lang: zh-CN
date: 2023-10-22
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 无
filename: shuzu
slug: apznnk
docsId: '47648050'
---

## 概述

## 常见操作

### 基本操作
```csharp
// 创建数组
string[] pallets = { "B14", "A11", "B12", "A13" };

// 数组排序
Array.Sort(pallets);

//数组反转
Array.Reverse(pallets);

//清理数组的项(从索引0开始清理1个元素)
Array.Clear(pallets, 0, 1);
//清理全部 
//Array.Clear(pallets);

//调整数组大小来赋值更多元素  也可以用来删除元素
Array.Resize(ref pallets, 6);
pallets[5] = "测试";
Console.WriteLine(pallets[5]);// 测试

//反向编码字符串
var value = "abc123";
char[] valueArray = value.ToCharArray();

//join 将数组连接成字符串
var result = string.Join(" ", valueArray);
Console.WriteLine(result); //a b c 1 2 3

// split 将字符串拆分为字符串数据
var arrStr = result.Split(" ");
 string[] str = english.Split(separator, StringSplitOptions.RemoveEmptyEntries);//去掉空字符串
```

### 合并数组
```csharp
var num1 = new int[] { 1, 2 };
var num2 = new int[] { 3, 4 };

//更改其中一个数组长度
var num1OriginalLength = num1.Length;
Array.Resize(ref num1, num1.Length + num2.Length);
Array.Copy(num2, 0, num1, num1OriginalLength, num2.Length);//num1 1,2,3,4


//创建新数组
var newNum = new int[num1.Length + num2.Length];
Array.Copy(num1, newNum, num1.Length);
Array.Copy(num2, 0, newNum, num1.Length, num2.Length);// newNum 1,2,3,4

//concat合并数组
var num4 = num1.Concat(num2);// 1,2,3,4

//union连接数组
var num5 = num1.Union(num2);// 1,2,3,4
```

## 数组拷贝
性能从低到高
for循环拷贝
```csharp
public object CopyByFor(int start, int length)
{
	var rawPacketData = TestData;

	var data = new int[length];
	for (int localIndex = 0, rawArrayIndex = start; localIndex < data.Length; localIndex++, rawArrayIndex++)
	{
		data[localIndex] = rawPacketData[rawArrayIndex];
	}
	return data;
}
```
Array.Copy
```csharp
public object CopyByArray(int start, int length)
{
	var rawPacketData = TestData;
	var data = new int[length];
	Array.Copy(rawPacketData,start,data,0, length);
	return data;
}
```
Span 进行拷贝
```csharp
public object CopyBySpan(int start, int length)
{
	var rawPacketData = TestData;
	var rawArrayStartIndex = start;
	var data = rawPacketData.AsSpan(rawArrayStartIndex, length).ToArray();
	return data;
}
```
