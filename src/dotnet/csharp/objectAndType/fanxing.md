---
title: 泛型
lang: zh-CN
date: 2023-10-22
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 无
filename: fanxing
slug: qxi76o
docsId: '32171053'
---

## 描述
泛型(geberic)，单词意思是通用的，它可以代表任意的数据类型，使类型参数化，从而达到只实现一个方法就可以操作多种数据类型的目的。

## 操作

### List
线程不安全泛型集合
```csharp
//使用int作为实际参数来初始化泛型类型
List<int> intList = new List<int>();
//往int列表添加元素3
intList.Add(3);

//用string作为实际参数来初始化泛型类型
List<string> stringList = new List<string>();
//从string列表添加元素
stringList.Add("learninghard");
```
> `List<T>`是.Net类库中实现的泛型类型，T是泛型参数。

编写一个比较数据大小的泛型方法
```csharp
public static T CompareGeneric<T>(T t1, T t2) where T : IComparable
{
	return t1.CompareTo(t2) > 0 ? t1 : t2;
}
```
> T是泛型的类型参数，CompareGeneric是实现的泛型方法，代码中的where语句是类型参数的约束，它用来是类型参数可以适用于CompareGeneric方法。


### ConcurrentBag
线程安全的泛型集合，所属命名空间：System.Collections.Concurrent
```csharp
var list = new ConcurrentBag<string>();
list.Add("测试");
```

## 泛型约束

### 值类型约束

资料参考自：https://mp.weixin.qq.com/s/F4HOoBQGi29Eg3dAPEA-BQ

C#泛型在.NET7（C#11）之前是不支持特定的值类型的，只能通过struct来约束广义的值类型。案例如下：

```c#
public class Testfx<T> where T : struct 
{
    public void Fun1(T x)
    {
        Console.WriteLine(x);
    }
}
```

以上的struct是约束值类型，这样T可以是诸如整数、浮点数等基本数据类型，不能约束具体某个类型。

在.NET7（C#11）之后，.NET 7 为基类库引入了新的数学相关泛型接口。提供这些接口意味着可以将泛型类型或方法的类型参数约束为“类似于数字”。只需要约束INumber就可以实现特定的值类型。案例如下：

```c#
public class TestStruct<T> where T : INumber<int>
{
    public void Fun1(T x)
    {
        Console.WriteLine(x);
    }
}
//调用
static void Main(string[] args)
{
    TestStruct<int> testStruct= new TestStruct<int>();
    testStruct.Fun1(666);
}
//输出：666
```

以上案例的泛型约束（where）使用了INumber，这样就对特定的整数（int）值类型实现了约束，当然也可以换成浮点数（float）等其它的类型。
