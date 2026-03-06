---
title: 迭代器
lang: zh-CN
date: 2023-10-22
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 无
filename: diedaiqi
slug: dl5z69
docsId: '57052189'
---

## 介绍
迭代器就是可以返回相同类型的值的有序序列的一段代码，可以做维护方法、运算符或者get访问器的代码体、迭代器代码使用yield return依次返回每个元素，yield break语句将终止迭代。

## 操作
在 C## 代码中，尤其是基础库的 API 中，我们经常可以看到很多方法返回的是 `IEnumerable<T>` 类型，为什么要返回 `IEnumerable<T>` 而不是 `IList<T>`、`ICollection<T>` 等类型呢？从字面上理解，`IEnumerable<T>` 表示该集合中的元素可以被遍历。要完全理解 `IEnumerable<T>` 类型对象如何被遍历，就要先理解 yield 关键字。
在 C## 中，大多数方法都是通过 return 语句把计算得到的结果返回给调用者，同时把控制权交回给调用者。比如下面这样一个获取斐波那契数列的方法：
```csharp
IEnumerable<int> nums = Fibonacci(10);
foreach (var n in nums)
{
    Console.Write("{0} ", n);
}

List<int> Fibonacci(int count)
{
  int prev = 1;
  int curr = 1;
  List<int> result = new();
  for (int i = 0; i < count; i++)
  {
    result.Add(prev);
    int temp = prev + curr;
    prev = curr;
    curr = temp;
  }
  return result;
}
```
输出：
```csharp
1 1 2 3 5 8 13 21 34 55
```
在 Console.Write() 打印结果之前，变量 nums 已经装载了完整的数据，所以运行后在打印结果的时候可以瞬间把结果全部输出，这看起来没有什么问题。
现在换个场景，假设 Fibonacci() 方法内部每次计算得到下一个数都需要耗费较长的时间。我们用 Thread.Sleep() 模拟一下所需的耗时，如下：
```csharp
...
  for (int i = 0; i < count; i++)
  {
    result.Add(prev);
    Thread.Sleep(1000);
    int temp = prev + curr;
    prev = curr;
    curr = temp;
  }
  return result;
}
```
再次运行，你会发现，大概等待 10 秒后所有数字被瞬间打印出来。而在等待的这段时间，你无法了解程序运算的进展，期间是没有反馈的。
可以通过 yield 关键字很好地解决这个问题。yield 可以把每一步计算推迟到它程序实际需要的时候再执行，也就是说，你不必等所有结果都计算完才执行下文代码。
下面使用 yield 关键字改造一下 Fibonacci() 方法：
```csharp
IEnumerable<int> Fibonacci(int count)
{
    int prev = 1;
    int curr = 1;
    for (int i = 0; i < count; i++)
    {
        yield return prev;
        Thread.Sleep(1000);
        int temp = prev + curr;
        prev = curr;
        curr = temp;
    }
}
```
再次运行后，你会看到，每隔 1 秒会输出一个数字，直到所有数字全部输出。虽然总的等待时间是一样的，但对于图形用户界面来说，这种即时响应的用户体验明细要好于之前的“漫长”等待。
yield 关键字的用途是把指令推迟到程序实际需要的时候再执行，这个特性允许我们更细致地控制集合每个元素产生的时机。它的好处之一是，可以像上面演示的那样尽可能即时地给用户响应。还有一个好处是，可以提高内存使用效率。当我们有一个方法要返回一个集合时，而作为方法的实现者我们并不清楚方法调用者具体在什么时候要使用该集合数据。如果我们不使用 yield 关键字，则意味着需要把集合数据装载到内存中等待被使用，这可能导致数据在内存中占用较长的时间。
通过 yield 返回的 `IEnumerable<T>` 类型，表示这是一个可以被遍历的数据集合。它之所以可以被遍历，是因为它实现了一个标准的 IEnumerable 接口。一般，我们把像上面这种包含 yield 语句并返回 `IEnumerable<T>` 类型的方法称为迭代器（Iterator）。
注意：包含 yield 语句的方法的返回类型也可以是 `IEnumerator<T>`，它比迭代器更低一个层级，迭代器是列举器的一种实现。
迭代器方法和普通的方法相比，普通方法是通过 return 语句立即把程序的控制权交回给调用者，同时也会把方法内的本地（局部）资源释放掉。迭代器方法则是在依次返回多个值给调用者的期间保留本地资源，等所有值都返回结束时再释放掉本地资源，这些返回的值将形成一组序列被调用者使用。
在 C## 中，迭代器可以用于方法、属性或索引器中。迭代器中的 yield 语句分为两种：

- yeild return，把程序控制权交回调用者并保留本地状态，调用者拿到返回的值继续往后执行。
- yeild break，用于告诉程序当前序列已经结束，相当于正常代码块的 return 语句（迭代器中直接使用 return 是非法的）。

实际场景中，我们一般很少直接写迭代器，因为大部分需要迭代的场景都是数组、集合和列表等，而这些类型内部已经封装好了所需的迭代器。
