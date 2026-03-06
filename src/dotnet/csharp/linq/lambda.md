---
title: Lambda
lang: zh-CN
date: 2023-10-22
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 无
filename: lambda
slug: ndkrkn
docsId: '29635334'
---

## 介绍
所有Lambda表达式都使用Lambda运算符=>，该运算符读作"goes to"。Lambda运算符的左边是输入参数(如果有)，右边是表达式或语句块。Lambda表达式x => x * x读作"x goes to x times x"。Lambda本质就是方法(匿名方法)。
> 注：(左边)输入参数为1个时可以省略小括号，(右边)表达式只有一句时可以省略大括号和return语句


## 场景

- 当函数体比较简单，只有几个语句，不值得去定义一个函数的时候，使用Lambda表达式
- Lambda表达式不用定义函数名，直接可以使用参数列表加函数体。
- 防止函数名对命名空间的污染。

## 示例
从整形数组中取出是奇数的选项

### 命名方法
```csharp
public delegate bool IntFilter(int i);
private static void Main(string[] args)
{
    var nums = Enumerable.Range(1, 10);
    var result = FilterOfInt(nums, IsOdd);
    foreach (var item in result)
    {
        Console.Write(item + ",");// 1,3,5,7,9,
    }
}
public static List<int> FilterOfInt(IEnumerable<int> ints, IntFilter filter)
{
    var lstOddInt = new List<int>();
    foreach (var i in ints)
    {
        if (filter(i))
        {
            lstOddInt.Add(i);
        }
    }
    return lstOddInt;
}

public static bool IsOdd(int i)
{
    return i % 2 != 0;
}
```

### 匿名方法
```csharp
public delegate bool IntFilter(int i);
private static void Main(string[] args)
{
    var nums = Enumerable.Range(1, 10);
    var result = FilterOfInt(nums, delegate (int i) { return i % 2 != 0; });
    foreach (var item in result)
    {
        Console.Write(item + ",");// 1,3,5,7,9,
    }
}
public static List<int> FilterOfInt(IEnumerable<int> ints, IntFilter filter)
{
    var lstOddInt = new List<int>();
    foreach (var i in ints)
    {
        if (filter(i))
        {
            lstOddInt.Add(i);
        }
    }
    return lstOddInt;
}
```

### Lambda表达式
```csharp
public delegate bool IntFilter(int i);
private static void Main(string[] args)
{
    var nums = Enumerable.Range(1, 10);
    var result = FilterOfInt(nums, i => i % 2 != 0);
    foreach (var item in result)
    {
        Console.Write(item + ",");// 1,3,5,7,9,
    }
}
public static List<int> FilterOfInt(IEnumerable<int> ints, IntFilter filter)
{
    var lstOddInt = new List<int>();
    foreach (var i in ints)
    {
        if (filter(i))
        {
            lstOddInt.Add(i);
        }
    }
    return lstOddInt;
}
```
使用lambda使得代码更加简洁

## 参考地址
> [https://mp.weixin.qq.com/s/SdmyCFpons5dlxYWe7O33Q](https://mp.weixin.qq.com/s/SdmyCFpons5dlxYWe7O33Q)
> [https://www.cnblogs.com/wl-blog/p/14451261.html](https://www.cnblogs.com/wl-blog/p/14451261.html)

