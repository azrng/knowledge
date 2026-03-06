---
title: 递归优化
lang: zh-CN
date: 2022-02-03
publish: true
author: azrng
isOriginal: true
category:
  - 计算机基础
tag:
  - 无
filename: diguiyouhua
slug: gtu3lt
docsId: '65983160'
---

## 介绍
比如菲波那切数列指的是这样子一个数列：1,1,2,3,5,8,13,21,34...
计算公式是
```csharp
public int Fibo(int n)
{
    double c = Math.Sqrt(5);
    return (int)((Math.Pow((1 + c) / 2, n) - Math.Pow((1 - c) / 2, n)) / c);
}
```

## 操作

### 最常见的递归
第一项和第二项的值均为1，后面每项的值都是前两项值之和，所以我们很多人基本上都会使用递归来实现，常见的算法如下：
```csharp
var sw = new System.Diagnostics.Stopwatch();
sw.Start();
Console.WriteLine(Fibo(42));
sw.Stop();
var s = sw.ElapsedMilliseconds;//毫秒
Console.WriteLine($"当前总花费时间：{s}毫秒");

int Fibo(int n)
{
    if (n == 1 || n == 2)
    {
        return 1;
    }
    return Fibo(n - 2) + Fibo(n - 1);
}
```
> 实际执行中，越往后执行越慢，比如n等于40和n等于42差别就很大，n越大执行效率越低。

但这种做法并不能完全解决问题，因为最大允许的递归深度跟当前线程剩余的栈空间大小有关，事先无法计算。如果实时计算，代码过于复杂，就会影响代码的可读性。所以，如果最大深度比较小，比如 10、50，就可以用这种方法，否则这种方法并不是很实用。
ps：递归代码要警惕重复计算

我们会发现f(n)这个方法被调用了很多次，而且其中重复率非常之高，也就是说被重复计算了很多次，如果n稍微大一点这棵树会非常庞大。这里我们可以看出，每个节点就需要计算一次，总计算的次数就是该二叉树节点的数量，可见其时间复杂度为O(2n)，是指数级的，其空间复杂度也就是该二叉树的高度，为O(n)。这样来看，我们应该就清楚了，为什么这段代码效率如此低下了吧。

### 数组保存法
我们应该避免无数次重复的计算
为了避免无数次重复，可以从n=1开始往上计算，并把每一个计算出来的数据，用一个数组保存，需要最终值时直接从数组中取即可，算法如下：
```csharp
var sw = new System.Diagnostics.Stopwatch();
sw.Start();
Console.WriteLine(Fibo(42));
sw.Stop();
var s = sw.ElapsedMilliseconds;//毫秒
Console.WriteLine($"当前总花费时间：{s}毫秒");

int Fibo(int n)
{
    int[] fib = new int[n];
    fib[0] = 1;
    fib[1] = 1;
    for (int i = 2; i < n; i++)
    {
        fib[i] = fib[i - 2] + fib[i - 1];
    }
    return fib[n - 1];
}
```
毫秒级，几乎忽略不计的。

### 滚动数组法
尽管上述算法已经很高效了，但我们还是会发现一个问题，其实整个数组中，每次计算时都只需要最新的3个值，前面的值计算完后就不再需要了。比如，计算到第10次时，需要的数组空间只有第8和第9两个空间，前面第1到第7个空间其实就不再需要了。所以我们还可以改进，通过3个变量来存储数据，算法如下：
```csharp
var sw = new System.Diagnostics.Stopwatch();
sw.Start();
Console.WriteLine(Fibo(42));
sw.Stop();
var s = sw.ElapsedMilliseconds;//毫秒
Console.WriteLine($"当前总花费时间：{s}毫秒");

int Fibo(int n)
{
    int first = 1;
    int second = 1;
    int third = 2;
    for (int i = 3; i <= n; i++)
    {
        third = first + second;
        first = second;
        second = third;
    }
    return third;
}
```
时间复杂度仍然为O(n)，而空间复杂度为常量级别3，即空间复杂度为0，所以这种方法是非常高效的。

### 尾递归法
首先我们来了解一下什么是尾调用。
> 在计算机科学里，尾调用是指一个函数里的最后一个动作是一个函数调用的情形：即这个调用的返回值直接被当前函数返回的情形。这种情形下该调用位置为尾位置。

```csharp
/// n 第n个数
 /// first 第n个数
 /// second 第n与第n+1个数的和
 /// @return 返回斐波那契数列值
public int Fib5(int n, int first, int second) {
    if (n <= 1) {
        return first;
    } else {
        return fib5(n-1,second,first+second);
    }
}
```
也都是通过两个变量保存计算值，传递给下一次进行计算，递归的过程中也是根据n值变化逐步重复运算，和循环差不多，时间复杂度和空间复杂度也都一样,优雅了很多。
我们知道递归调用是通过栈来实现的，每调用一次函数，系统都将函数当前的变量、返回地址等信息保存为一个栈帧压入到栈中，那么一旦要处理的运算很大或者数据很多，有可能会导致很多函数调用或者很大的栈帧，这样不断的压栈，很容易导致栈的溢出。

## 资料
[https://mp.weixin.qq.com/s/_qD17P6yaiPDndPKLkmcSg](https://mp.weixin.qq.com/s/_qD17P6yaiPDndPKLkmcSg) | 递归优化的这三种方式你知道吗？
