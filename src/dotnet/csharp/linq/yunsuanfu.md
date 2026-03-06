---
title: 运算符
lang: zh-CN
date: 2023-10-22
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 无
filename: yunsuanfu
slug: uzccw2
docsId: '61600337'
---

## 开篇语
本文是对Linq用法的一次复习，里面包含的部分源码涉及删减。
> 本文示例代码环境：VS2022、.Net6、C#10



[一篇文章带你全面解析Linq架构](https://mp.weixin.qq.com/s/fuAtZ7oF24lUiX5YzVwqpA)

## Linq库

[https://github.com/morelinq/MoreLINQ](https://github.com/morelinq/MoreLINQ)
[https://githubub.com/viceroypenguin/SuperLinq](https://githubub.com/viceroypenguin/SuperLinq)

## 1 概述

标准查询运算符分为三类

- 输入是序列，输出是序列（序列对序列）
- 输入是集合，输出是单个元素或者标量值
- 没有输入，输出是序列（生成方法）

## 2. 序列->序列
大多数查询运算符都属于这种，接收一个或者多个输入序列，并且生成单一的输出序列。

### 2.1 筛选运算符
```csharp
IEnumerable<TSource> -> IEnumerable<TSource>
```
此类运算符返回原始序列的一个子集。
> where take takewhile skip skipwhile distinct


#### 2.1.1 Where
返回满足给定条件的元素集合

##### 2.1.1.1 方法1
```csharp
IEnumerable<TSource> Where<TSource>(this IEnumerable<TSource> source, Func<TSource, bool> predicate)
```
示例
查询该集合中元素长度大于2的元素
```csharp
var numList = new List<string>
{
    "one",
    "two",
    "three"
};
var result = numList.Where(t => t.Length > 2);
var result2 = result.ToList();
```
当你只是添加where时候，该语句只是执行扩展方法做下面操作，然后将predicate(有返回值的委托)和集合赋值给构造函数，并没有立即执行(延迟执行)
```csharp
public static IEnumerable<TSource> Where<TSource>(
    this IEnumerable<TSource> source,
    Func<TSource, bool> predicate)
{
    switch (source)
    {
        case Enumerable.Iterator<TSource> iterator:
            return iterator.Where(predicate);
        case TSource[] source1:
            return source1.Length != 0 ? (IEnumerable<TSource>) new Enumerable.WhereArrayIterator<TSource>(source1, predicate) : Enumerable.Empty<TSource>();
        case List<TSource> source2:
            return (IEnumerable<TSource>) new Enumerable.WhereListIterator<TSource>(source2, predicate);
        default:
            return (IEnumerable<TSource>) new Enumerable.WhereEnumerableIterator<TSource>(source, predicate);
    }
}
```
当你进行ToList的时候，会进行类似下面的逻辑
```csharp
public List<TSource> ToList()
{
    List<TSource> list = new List<TSource>();
    for (int index = 0; index < this._source.Count; ++index)
    {
        TSource source = this._source[index];
        if (this._predicate(source))
            list.Add(source);
    }
    return list;
}
```
这个时候才是真正的执行。

##### 2.1.1.2 方法2
```csharp
IEnumerable<TSource> Where<TSource>(this IEnumerable<TSource> source, Func<TSource, int, bool> predicate)
```
示例
查询该集合中元素的值等于numList[i]的元素
```csharp
var numList = new List<string>
{
    "one",
    "two",
    "three"
};
var result3 = numList.Where((t, i) => t == numList[i]).ToList(); // i代表的是当前序列在集合中的索引
var str3 = JsonConvert.SerializeObject(result3);// [\"one\",\"two\",\"three\"]
```
源码如下
```csharp
private static IEnumerable<TSource> WhereIterator<TSource>(
    IEnumerable<TSource> source,
    Func<TSource, int, bool> predicate)
{
    int index = -1;
    foreach (TSource source1 in source)
    {
        checked { ++index; }
        if (predicate(source1, index))
            yield return source1;
    }
}
```

#### 2.1.2 Take
返回前count个元素，丢弃剩余的元素

##### 2.1.2.1 方法1
```csharp
IEnumerable<TSource> Take<TSource>(this IEnumerable<TSource> source, int count)
```
示例
查询该集合的前1个元素
```plsql
var numList = new List<string>
{
    "one",
    "two",
    "three"
};
var result = numList.Take(1).ToList();
var str = JsonConvert.SerializeObject(result);//  "[\"one\"]"
```
上面代码也是延迟执行，当你运行Take的时候也是只将参数给构造函数
```plsql
private static IEnumerable<TSource> TakeIterator<TSource>(
    IEnumerable<TSource> source,
    int count)
{
    switch (source)
    {
        case IPartition<TSource> partition:
            return (IEnumerable<TSource>) partition.Take(count);
        case IList<TSource> source1:
            return (IEnumerable<TSource>) new Enumerable.ListPartition<TSource>(source1, 0, count - 1); // count：1
        default:
            return (IEnumerable<TSource>) new Enumerable.EnumerablePartition<TSource>(source, 0, count - 1);
    }
}
```
当你执行后面的ToList的时候才会真正执行
```plsql
public List<TSource> ToList()
{
    int count = this.Count;//1
    if (count == 0)
        return new List<TSource>();
    List<TSource> list = new List<TSource>(count);
    int num = this._minIndexInclusive + count;// _minIndexInclusive = 0
    for (int minIndexInclusive = this._minIndexInclusive; minIndexInclusive != num; ++minIndexInclusive)
        list.Add(this._source[minIndexInclusive]);
    return list;
}
```
里面做了一个for循环，然后添加到新的List里面，知道minIndexInclusive==num后，不满足条件退出循环。

##### 2.1.2.2 方法2
```csharp
IEnumerable<TSource> Take<TSource>(this IEnumerable<TSource> source, Range range)
```
示例
```plsql
var numList = new List<string>
{
    "one",
    "two",
    "three"
};
var result = numList.Take(new Range(1, 2)).ToList();
var str = JsonConvert.SerializeObject(result);//["two"]
```
查看源码，是取从开始索引1到开始索引2-1的元素
```csharp
public static IEnumerable<TSource> Take<TSource>(
    this IEnumerable<TSource> source,
    System.Range range)
{
    if (source == null)
        ThrowHelper.ThrowArgumentNullException(ExceptionArgument.source);
    Index start = range.Start;
    Index end = range.End;
    bool isFromEnd1 = start.IsFromEnd;
    bool isFromEnd2 = end.IsFromEnd;
    int startIndex = start.Value;
    int endIndex = end.Value;
    if (isFromEnd1)
    {
        if (startIndex == 0 || isFromEnd2 && endIndex >= startIndex)
            return Enumerable.Empty<TSource>();
    }
    else if (!isFromEnd2)
        return startIndex < endIndex ? Enumerable.TakeRangeIterator<TSource>(source, startIndex, endIndex) : Enumerable.Empty<TSource>();
    return Enumerable.TakeRangeFromEndIterator<TSource>(source, isFromEnd1, startIndex, isFromEnd2, endIndex);
}

private static IEnumerable<TSource> TakeRangeIterator<TSource>(
    IEnumerable<TSource> source,
    int startIndex,
    int endIndex)
{
    switch (source)
    {
        case IPartition<TSource> partition:
            return (IEnumerable<TSource>) TakePartitionRange(partition, startIndex, endIndex);
        case IList<TSource> source1:
            return (IEnumerable<TSource>) new Enumerable.ListPartition<TSource>(source1, startIndex, endIndex - 1);
        default:
            return (IEnumerable<TSource>) new Enumerable.EnumerablePartition<TSource>(source, startIndex, endIndex - 1);
    }
}
```

#### 2.1.3 TakeWhile
返回输入序列的元素，直到满足条件为false

##### 2.1.3.1 方法1
```csharp
IEnumerable<TSource> TakeWhile<TSource>(this IEnumerable<TSource> source, Func<TSource, bool> predicate)
```
示例
获取TakeWhile里面lambda表达式返回false之前的所有元素
```csharp
var numList = new List<string>
{
    "one",
    "two",
    "three"
};
var result = numList.TakeWhile(t => t.Length < 4).ToList();
var str = JsonConvert.SerializeObject(result);// ["one","two"]
```
查看源码,当predicate(source1)为false的时候，那么就跳出循环，返回结果。所以如果一直为true，那么就返回所有的元素。
```csharp
private static IEnumerable<TSource> TakeWhileIterator<TSource>(
    IEnumerable<TSource> source,
    Func<TSource, bool> predicate)
{
    foreach (TSource source1 in source)
    {
        if (predicate(source1))
            yield return source1;
        else
            break;
    }
}
```

##### 2.3.3.2 方法2 
```csharp
IEnumerable<TSource> TakeWhile<TSource>(this IEnumerable<TSource> source, Func<TSource, int, bool> predicate)
```
示例
和上面一样如果TakeWhile里面的表达式返回false，那么就返回之前的数据，下面示例中i是循环的索引。
```csharp
var numList = new List<string>
{
    "one",
    "two",
    "123456"
};
var result = numList.TakeWhile((t, i) => t.Length < i + 4).ToList();
var str = JsonConvert.SerializeObject(result);// ["one","two"]
```
查看源码
```csharp
private static IEnumerable<TSource> TakeWhileIterator<TSource>(
    IEnumerable<TSource> source,
    Func<TSource, int, bool> predicate)
{
    int index = -1;
    foreach (TSource source1 in source)
    {
        checked { ++index; }
        if (predicate(source1, index))
            yield return source1;
        else
            break;
    }
}
```

#### 2.1.4 TakeLast
从集合中取出最后count数量的元素返回

##### 2.1.4.1 方法1
```csharp
IEnumerable<TSource> TakeLast<TSource>(this IEnumerable<TSource> source, int count)
```
示例
```csharp
var numList = new List<string>
{
    "one",
    "two",
    "123456"
};
var result = numList.TakeLast(1).ToList();
var str = JsonConvert.SerializeObject(result);// ["123456"]
```
查看源码

#### 2.1.5 Skip
跳过前count个元素，返回剩余的元素

##### 2.1.5.1 方法1
```csharp
IEnumerable<TSource> Skip<TSource>(this IEnumerable<TSource> source, int count)
```

#### 2.1.6 SkipLast

##### 2.1.6.1 方法1
```csharp
IEnumerable<TSource> SkipLast<TSource>(this IEnumerable<TSource> source, int count)
```

#### 2.1.7 SkipWhile
忽略输入序列的元素，直到满足条件为false，然后返回剩余的元素

##### 2.1.7.1 方法1
```csharp
IEnumerable<TSource> SkipWhile<TSource>(this IEnumerable<TSource> source, Func<TSource, bool> predicate)
```

##### 2.1.7.2 方法2
```csharp
IEnumerable<TSource> SkipWhile<TSource>(this IEnumerable<TSource> source, Func<TSource, int, bool> predicate)
```

#### 2.1.8 TakeLast

#### 2.1.9 Distinct

##### 2.1.9.1 方法1
```csharp
IEnumerable<TSource> Distinct<TSource>(this IEnumerable<TSource> source)
```
示例
返回一个没有重复元素的集合
```csharp
int[] array = { 1, 2, 3, 4, 2, 5, 3, 1, 2 };
var distinct = array.Distinct();
// distinct = { 1, 2, 3, 4, 5 }
```

##### 2.1.9.2 方法2
```csharp
IEnumerable<TSource> Distinct<TSource>(this IEnumerable<TSource> source, IEqualityComparer<TSource>? comparer)
```

#### 2.1.10 DistinctBy
根据某一列返回一个没有重复元素的集合

##### 2.1.10.1 方法1
```csharp
IEnumerable<TSource> DistinctBy<TSource, TKey>(this IEnumerable<TSource> source, Func<TSource, TKey> keySelector)
```

##### 2.1.10.2 方法2
```csharp
IEnumerable<TSource> DistinctBy<TSource, TKey>(this IEnumerable<TSource> source, Func<TSource, TKey> keySelector, IEqualityComparer<TKey>? comparer)
```

### 2.2 映射运算符
```csharp
IEnumerable<TSource> -> IEnumerable<TResult>
```
用Lambda函数将每个元素转换为其他形式
> select selectMany


#### 2.2.1 Select

##### 2.2.1.1 方法1
```csharp
IEnumerable<TResult> Select<TSource, TResult>(this IEnumerable<TSource> source, Func<TSource, int, TResult> selector)
```

##### 2.2.1.2 方法2
```csharp
IEnumerable<TResult> Select<TSource, TResult>(this IEnumerable<TSource> source, Func<TSource, TResult> selector)
```

#### 2.2.2 SelectMany

##### 2.2.2.1 方法1
SelectMany 可以把多维集合降维，比如把二维的集合平铺成一个一维的集合。
```csharp
IEnumerable<TResult> SelectMany<TSource, TResult>(this IEnumerable<TSource> source, Func<TSource, IEnumerable<TResult>> selector)
```
举例：
```csharp
var collection = new int[][]
{
    new int[] {1, 2, 3},
    new int[] {4, 5, 6},
};
var result = collection.SelectMany(x => x);
// result = [1, 2, 3, 4, 5, 6]
```

##### 2.2.2.2 方法2
```csharp
IEnumerable<TResult> SelectMany<TSource, TResult>(this IEnumerable<TSource> source, Func<TSource, int, IEnumerable<TResult>> selector)
```

##### 2.2.2.3 方法3
```csharp
IEnumerable<TResult> SelectMany<TSource, TCollection, TResult>(this IEnumerable<TSource> source, Func<TSource, IEnumerable<TCollection>> collectionSelector, Func<TSource, TCollection, TResult> resultSelector)
```

##### 2.2.2.4 方法4
```csharp
IEnumerable<TResult> SelectMany<TSource, TCollection, TResult>(this IEnumerable<TSource> source, Func<TSource, int, IEnumerable<TCollection>> collectionSelector, Func<TSource, TCollection, TResult> resultSelector)
```

### 2.3 连接运算符
```csharp
IEnumerable<TOuter>,IEnumerable<TInner>->IEnumerable<TResult>
```
将两个序列中的元素连接在一起。
> Join GroupJoin Zip


#### 2.3.1 Join
可以高效执行本次查询，支持内连接

##### 2.3.1.1 方法1
```csharp
IEnumerable<TResult> Join<TOuter, TInner, TKey, TResult>(this IEnumerable<TOuter> outer, IEnumerable<TInner> inner, Func<TOuter, TKey> outerKeySelector, Func<TInner, TKey> innerKeySelector, Func<TOuter, TInner, TResult> resultSelector)
```

##### 2.3.1.2 方法2
```csharp
IEnumerable<TResult> Join<TOuter, TInner, TKey, TResult>(this IEnumerable<TOuter> outer, IEnumerable<TInner> inner, Func<TOuter, TKey> outerKeySelector, Func<TInner, TKey> innerKeySelector, Func<TOuter, TInner, TResult> resultSelector, IEqualityComparer<TKey>? comparer)
```

#### 2.3.2 GroupJoin
可以高效执行本地查询，支持左外连接

##### 2.3.2.1 方法1
```csharp
IEnumerable<TResult> GroupJoin<TOuter, TInner, TKey, TResult>(this IEnumerable<TOuter> outer, IEnumerable<TInner> inner, Func<TOuter, TKey> outerKeySelector, Func<TInner, TKey> innerKeySelector, Func<TOuter, IEnumerable<TInner>, TResult> resultSelector)
```

##### 2.3.2.2 方法2
```csharp
IEnumerable<TResult> GroupJoin<TOuter, TInner, TKey, TResult>(this IEnumerable<TOuter> outer, IEnumerable<TInner> inner, Func<TOuter, TKey> outerKeySelector, Func<TInner, TKey> innerKeySelector, Func<TOuter, IEnumerable<TInner>, TResult> resultSelector, IEqualityComparer<TKey>? comparer)
```

#### 2.3.3 Zip
将同时枚举两个序列，并对每一对元素进行操作。

Zip 扩展方法操作的对象是两个集合，它就像拉链一样，根据位置将两个系列中的每个元素依次配对在一起。其接收的参数是一个 Func 实例，该 Func 实例允许我们成对在处理两个集合中的元素。如果两个集合中的元素个数不相等，那么多出来的将会被忽略。

##### 2.3.3.1 方法1
```csharp
IEnumerable<(TFirst First, TSecond Second)> Zip<TFirst, TSecond>(this IEnumerable<TFirst> first, IEnumerable<TSecond> second)
```

##### 2.3.3.2 方法2
```csharp
IEnumerable<(TFirst First, TSecond Second, TThird Third)> Zip<TFirst, TSecond, TThird>(this IEnumerable<TFirst> first, IEnumerable<TSecond> second, IEnumerable<TThird> third)
```

##### 2.3.3.3 方法3
```csharp
IEnumerable<TResult> Zip<TFirst, TSecond, TResult>(this IEnumerable<TFirst> first, IEnumerable<TSecond> second, Func<TFirst, TSecond, TResult> resultSelector)
```
示例
```csharp
int[] numbers = { 3, 5, 7 };
string[] words = { "three", "five", "seven", "ignored" };
IEnumerable<string> zip = numbers.Zip(words, (n, w) => n + "=" + w);

foreach (string s in zip)
{
    Console.WriteLine(s);
}
输出
3=three
5=five
7=seven
```

### 2.4 排序运算符
```csharp
IEnumerable<TSource>	->IOrderedEnumerable<TSource>
```
返回一个排序后的序列
> OrderBy ThenBy Reverse


#### 2.4.1 OrderBy

##### 2.4.1.1 方法1
```csharp
IOrderedEnumerable<TSource> OrderBy<TSource, TKey>(this IEnumerable<TSource> source, Func<TSource, TKey> keySelector)
```
举例如下
```csharp
var useList = UserDto.GetUserDtos();
// 基础的查询，根据集合的某一列进行排序,按照id从小到大排序
IOrderedEnumerable<UserDto> userListOrder = useList.OrderBy(t => t.Id);
foreach (var item in userListOrder)
{
    Console.WriteLine(item.Id);
}
```

##### 2.4.1.2 方法2
```csharp
IOrderedEnumerable<TSource> OrderBy<TSource, TKey>(this IEnumerable<TSource> source, Func<TSource, TKey> keySelector, IComparer<TKey>? comparer)
```
Compare方法的实现必须Int32返回具有以下三个值之一的，如下表所示。

| 值 | 含义 |
| --- | --- |
| 小于零 | 此对象在排序顺序中位于CompareTo方法所指定的对象之前。 |
| 零 | 此当前实例在排序顺序中与CompareTo方法参数指定的对象出现在同一位置。 |
| 大于零 | 此当前实例位于排序顺序中由CompareTo方法自变量指定的对象之后。 |

举例示例一
```csharp
void Main()
{
	// 需求：将userList按照sortList的顺序进行排序
	// 需要排序的内容
	var userList = new List<string> { "diagnose", "order", "lab", "emr" };

	// 根据该顺序进行排序
	var sortList = new List<string> { "emr", "lab", "check", "treat", "diagnose" };

	var userListOrder = userList.OrderBy(t => t, new CustomerSortComparer(sortList));
	foreach (var item in userListOrder)
	{
		Console.WriteLine(item);
	}
}

/// <summary>
/// 自定义排序比较器
/// </summary>
public class CustomerSortComparer : IComparer<string>
{
	private readonly List<string> _moduleCodes;
	public CustomerSortComparer(List<string> moduleCodes)
	{
		_moduleCodes = moduleCodes;
	}
	public int Compare(string x, string y)
	{
		var xIndex = _moduleCodes.IndexOf(x);
		var yIndex = _moduleCodes.IndexOf(y);
		// 如果index大说明排序靠后

		xIndex = xIndex < 0 ? 99 : xIndex;
		yIndex = yIndex < 0 ? 99 : yIndex;
		if (xIndex > yIndex)
		{
			return 1;
		}
		else if (xIndex < yIndex)
		{
			// x应该在y之前
			return -1;
		}
		else
		{
			return 0;
		}
	}
}
```
举例示例二
```csharp
// 自己构造排序比较器

//需求：将userList里面的Name列根据长度进行排序
var userList = UserDto.GetUserDtos();

IOrderedEnumerable<UserDto> userListOrder = userList.OrderBy(t => t.Name, new CustomerLengthComparer());
foreach (var item in userListOrder)
{
    Console.WriteLine(item.Name);
}

// 自定义比较器

/// <summary>
/// 自定义长度排序比较器
/// </summary>
public class CustomerLengthComparer : IComparer<string>
{
    public int Compare(string x, string y)
    {
        if (x.Length > y.Length)
        {
            return 1;
        }
        else if (x.Length < y.Length)
        {
            return -1;
        }
        else
        {
            return 0;
        }
    }
}
```
> 详细文档：[https://www.jb51.net/article/177756.htm](https://www.jb51.net/article/177756.htm)


#### 2.4.2 OrderByDescending
关于倒序的使用方法和上面正序的使用方法类似，就不在叙述了。

##### 2.4.2.1 方法1
```csharp
IOrderedEnumerable<TSource> OrderByDescending<TSource, TKey>(this IEnumerable<TSource> source, Func<TSource, TKey> keySelector)
```

##### 2.4.2.2 方法2
```csharp
IOrderedEnumerable<TSource> OrderByDescending<TSource, TKey>(this IEnumerable<TSource> source, Func<TSource, TKey> keySelector, IComparer<TKey>? comparer)
```

#### 2.4.3 ThenBy

##### 2.4.3.1 方法1
```csharp
IOrderedEnumerable<TSource> ThenBy<TSource, TKey>(this IOrderedEnumerable<TSource> source, Func<TSource, TKey> keySelector)
```

##### 2.4.3.2 方法2
```csharp
IOrderedEnumerable<TSource> ThenBy<TSource, TKey>(this IOrderedEnumerable<TSource> source, Func<TSource, TKey> keySelector, IComparer<TKey>? comparer)
```

#### 2.4.4 ThenByDescending

##### 2.4.4.1 方法1
```csharp
IOrderedEnumerable<TSource> ThenByDescending<TSource, TKey>(this IOrderedEnumerable<TSource> source, Func<TSource, TKey> keySelector)
```

##### 2.4.4.2 方法2
```csharp
IOrderedEnumerable<TSource> ThenByDescending<TSource, TKey>(this IOrderedEnumerable<TSource> source, Func<TSource, TKey> keySelector, IComparer<TKey>? comparer)
```

#### 2.4.5 Reverse
反转序列中元素的顺序。  

##### 2.4.5.1 方法1
```csharp
IEnumerable<TSource> Reverse<TSource>(this IEnumerable<TSource> source)
```

### 2.5 分组运算符

```csharp
IEnumerable<TSource>	->IEnumerable<IGrouping<TKey,TElement>>
```
将一个序列分组为若干子序列
> GroupBy


#### 2.5.1 GroupBy

##### 2.5.1.1 方法1
```csharp
IEnumerable<IGrouping<TKey, TSource>> GroupBy<TSource, TKey>(this IEnumerable<TSource> source, Func<TSource, TKey> keySelector)
```

##### 2.5.1.2 方法2
```csharp
IEnumerable<IGrouping<TKey, TSource>> GroupBy<TSource, TKey>(this IEnumerable<TSource> source, Func<TSource, TKey> keySelector, IEqualityComparer<TKey>? comparer)
```

##### 2.5.1.3 方法3
```csharp
IEnumerable<IGrouping<TKey, TElement>> GroupBy<TSource, TKey, TElement>(this IEnumerable<TSource> source, Func<TSource, TKey> keySelector, Func<TSource, TElement> elementSelector)
```

##### 2.5.1.4 方法4
```csharp
IEnumerable<IGrouping<TKey, TElement>> GroupBy<TSource, TKey, TElement>(this IEnumerable<TSource> source, Func<TSource, TKey> keySelector, Func<TSource, TElement> elementSelector, IEqualityComparer<TKey>? comparer)
```

##### 2.5.1.5 方法5
```csharp
IEnumerable<TResult> GroupBy<TSource, TKey, TResult>(this IEnumerable<TSource> source, Func<TSource, TKey> keySelector, Func<TKey, IEnumerable<TSource>, TResult> resultSelector)
```

##### 2.5.1.6 方法6
```csharp
IEnumerable<TResult> GroupBy<TSource, TKey, TResult>(this IEnumerable<TSource> source, Func<TSource, TKey> keySelector, Func<TKey, IEnumerable<TSource>, TResult> resultSelector, IEqualityComparer<TKey>? comparer)
```

##### 2.5.1.7 方法7
```csharp
IEnumerable<TResult> GroupBy<TSource, TKey, TElement, TResult>(this IEnumerable<TSource> source, Func<TSource, TKey> keySelector, Func<TSource, TElement> elementSelector, Func<TKey, IEnumerable<TElement>, TResult> resultSelector)
```

##### 2.5.1.8 方法8
```csharp
IEnumerable<TResult> GroupBy<TSource, TKey, TElement, TResult>(this IEnumerable<TSource> source, Func<TSource, TKey> keySelector, Func<TSource, TElement> elementSelector, Func<TKey, IEnumerable<TElement>, TResult> resultSelector, IEqualityComparer<TKey>? comparer)
```
验证是否包含重复数据
```csharp
var receptionIdDupli = dto.SkillReceptionistIds.GroupBy(o => o.ReceptionistId).Where(g => g.Count() > 1)
    .Select(g => g.Key).Distinct().ToList();
```
分组取值
根据班级ID进行分组，然后取得每个班级下用户
```csharp
var listUserInfo = new List<UserInfo>
{
    new UserInfo {ClassId = "11", Id = Guid.NewGuid().ToString(), Name = "张三"},
    new UserInfo {ClassId = "11", Id = Guid.NewGuid().ToString(), Name = "李思"},
    new UserInfo {ClassId = "11", Id = Guid.NewGuid().ToString(), Name = "王五"},
    new UserInfo {ClassId = "22", Id = Guid.NewGuid().ToString(), Name = "赵六"}
};

var info = listUserInfo.GroupBy(t => t.ClassId)
    .Select(t => new UserInfoDto
    {
        ClassId = t.Key,
        UserInfo = t.Select(u => new UserInfo
        {
            Id = u.Id,
            Name = u.Name,
        })
    }).ToList();
```

### 2.6 集合运算符
```csharp
IEnumerable<TSource>,IEnumerable<TSource>	->IEnumerable<TSource>
```
接受两个相同类型的序列，并返回其共有的元素序列、合并元素的序列或者不同元素的序列。
> Concat Union Intersect Except


#### 2.6.1 Concat 
Concat 用来拼接两个集合，不会去除重复元素，示例：
```csharp
List<int> foo = newList<int> { 1, 2, 3 };
List<int> bar = newList<int> { 3, 4, 5 };
// 通过 Enumerable 类的静态方法
var result = Enumerable.Concat(foo, bar).ToList(); // 1,2,3,3,4,5
// 通过扩展方法
var result = foo.Concat(bar).ToList(); // 1,2,3,3,4,5
```

##### 2.6.1.1 方法1
```csharp
IEnumerable<TSource> Concat<TSource>(this IEnumerable<TSource> first, IEnumerable<TSource> second)
```

#### 2.6.2 Union
Union 也是用来拼接两个集合，与 Concat 不同的是，它会去除重复项，

#### 2.6.2.1 方法1
```csharp
IEnumerable<TSource> Union<TSource>(this IEnumerable<TSource> first, IEnumerable<TSource> second)
```
示例：
```csharp
var result = foo.Union(bar); // 1,2,3,4,5
```

##### 2.6.2.2 方法2
```csharp
IEnumerable<TSource> Union<TSource>(this IEnumerable<TSource> first, IEnumerable<TSource> second, IEqualityComparer<TSource>? comparer)
```

#### 2.6.3 UnionBy
根据指定的键选择器生成两个序列的并集函数。  

##### 2.6.3.1 方法1
```csharp
IEnumerable<TSource> UnionBy<TSource, TKey>(this IEnumerable<TSource> first, IEnumerable<TSource> second, Func<TSource, TKey> keySelector)
```

##### 2.6.3.2 方法2
```csharp
IEnumerable<TSource> UnionBy<TSource, TKey>(this IEnumerable<TSource> first, IEnumerable<TSource> second, Func<TSource, TKey> keySelector, IEqualityComparer<TKey>? comparer)
```

#### 2.6.4 Intersect

##### 2.6.4.1 方法1
```csharp
IEnumerable<TSource> Intersect<TSource>(this IEnumerable<TSource> first, IEnumerable<TSource> second)
```

##### 2.6.4.2 方法2
```csharp
IEnumerable<TSource> Intersect<TSource>(this IEnumerable<TSource> first, IEnumerable<TSource> second, IEqualityComparer<TSource>? comparer)
```

#### 2.6.5 IntersectBy

##### 2.6.5.1 方法1
```csharp
IEnumerable<TSource> IntersectBy<TSource, TKey>(this IEnumerable<TSource> first, IEnumerable<TKey> second, Func<TSource, TKey> keySelector)
```

##### 2.6.5.2 方法2
```csharp
IEnumerable<TSource> IntersectBy<TSource, TKey>(this IEnumerable<TSource> first, IEnumerable<TKey> second, Func<TSource, TKey> keySelector, IEqualityComparer<TKey>? comparer)
```

#### 2.6.6 Except
用来取差集，即取出集合中与另一个集合所有元素不同的元素。

##### 2.6.6.1 方法1
```csharp
IEnumerable<TSource> Except<TSource>(this IEnumerable<TSource> first, IEnumerable<TSource> second)
```

##### 2.6.6.2 方法2
```csharp
IEnumerable<TSource> Except<TSource>(this IEnumerable<TSource> first, IEnumerable<TSource> second, IEqualityComparer<TSource>? comparer)
```
示例
```csharp
int[] first = { 1, 2, 3, 4 };
int[] second = { 0, 2, 3, 5 };
IEnumerable<int> result = first.Except(second);
// result = { 1, 4 }
```
> 注意 Except 方法会去除重复元素：


#### 2.6.7 ExceptBy

##### 2.6.7.1 方法1
```csharp
IEnumerable<TSource> ExceptBy<TSource, TKey>(this IEnumerable<TSource> first, IEnumerable<TKey> second, Func<TSource, TKey> keySelector)
```

##### 2.6.7.2 方法2
```csharp
IEnumerable<TSource> ExceptBy<TSource, TKey>(this IEnumerable<TSource> first, IEnumerable<TKey> second, Func<TSource, TKey> keySelector, IEqualityComparer<TKey>? comparer)
```

### 2.7 转换方法：导入
```csharp
IEnumerable ->IEnumerable<TResult>
```
> OfType Cast


#### 2.7.1 OfType
OfType操作符与Cast操作符类似，用于将类型为IEnumerable的集合对象转换为`IEnumerable<T>`类型的集合对象。不同的是，Cast操作符会视图将输入序列中的所有元素转换成类型为T的对象，如果有转换失败的元素存在Cast操作符将抛出一个异常；而OfType操作符仅会将能够成功转换的元素进行转换，并将这些结果添加到结果序列中去。与Cast操作符相比，OfType操作符更加安全。

##### 2.7.1.1 方法一
```csharp
IEnumerable<TResult> OfType<TResult>(this IEnumerable source)
```
示例：它是一种类型过滤器，可以筛选出那些可以被转换成 `X` 类型的元素。
```csharp
var al = new ArrayList();
al.Add(1);
al.Add(2);
al.Add("a");


var ieOfType = al.OfType<int>();
foreach (int i in ieOfType)
{
    Console.WriteLine(i); //输出 1 2 其中转换不了的a不转换
}
```
获取集合中指定类型元素
```csharp
 object[] obj = { 1, 23, 4, 5, 555, "aaa", "bbb" };
 int max = obj.OfType<int>().Max();  //结果是555, 获取int类型中的最大值
```

#### 2.7.2 Cast
Cast操作符用于将一个类型为IEnumerable的集合对象转换为`IEnumerable<T>`类型的集合对象。也就是非泛型集合转成泛型集合，因为在Linq to OBJECT中，绝大部分操作符都是针对`IEnumerable<T>`类型进行的扩展方法。因此对非泛型集合并不适用。

##### 2.7.2.1 方法1
```csharp
IEnumerable<TResult> Cast<TResult>(this IEnumerable source)
```
示例
```csharp
// 它会将所有的元素转换成 `X` 类型，只要有一个不能转换则会抛出异常。
var al = new ArrayList();
al.Add(1);
al.Add(2);
al.Add(3);
var ieInt = al.Cast<int>();    //非泛型转泛型
foreach (var i in ieInt)
{
    Console.WriteLine(i);   //输出 1 2 3
}
```

### 2.8 转换方法：导出
```csharp
IEnumerable ->An array,list,dictionary,lookup,or sequence
```
> ToArray ToList ToDictionary ToLookup AsEnumerable AsQueryable


#### 2.8.1 ToArray

##### 2.8.1.1 方法1
```csharp
TSource[] ToArray<TSource>(this IEnumerable<TSource> source)
```

#### 2.8.2 ToDictionary
ToDictionary 扩展方法可以把集合 `IEnumerable<TElement>` 转换为 `Dictionary<TKey, TValue>` 结构的字典，它接收一个 `Func<TSource, TKey>` 参数用来返回每个元素指定的键与值。

##### 2.8.2.1 方法1
```csharp
Dictionary<TKey, TSource> ToDictionary<TSource, TKey>(this IEnumerable<TSource> source, Func<TSource, TKey> keySelector) where TKey : notnull
```
示例：
```csharp
IEnumerable<User> users = GetUsers();
Dictionary<int, User> usersById = users.ToDictionary(x => x.Id);
```

##### 2.8.2.2 方法2
```csharp
Dictionary<TKey, TSource> ToDictionary<TSource, TKey>(this IEnumerable<TSource> source, Func<TSource, TKey> keySelector, IEqualityComparer<TKey>? comparer) where TKey : notnull
```

##### 2.8.2.3 方法3
```csharp
Dictionary<TKey, TElement> ToDictionary<TSource, TKey, TElement>(this IEnumerable<TSource> source, Func<TSource, TKey> keySelector, Func<TSource, TElement> elementSelector) where TKey : notnull
```

##### 2.8.2.4 方法4
```csharp
Dictionary<TKey, TElement> ToDictionary<TSource, TKey, TElement>(this IEnumerable<TSource> source, Func<TSource, TKey> keySelector, Func<TSource, TElement> elementSelector, IEqualityComparer<TKey>? comparer) where TKey : notnull
```

#### 2.8.3 ToHashSet

##### 2.8.3.1 方法1
```csharp
HashSet<TSource> ToHashSet<TSource>(this IEnumerable<TSource> source)
```

##### 2.8.3.2 方法2
```csharp
HashSet<TSource> ToHashSet<TSource>(this IEnumerable<TSource> source, IEqualityComparer<TSource>? comparer)
```

#### 2.8.4 ToList

##### 2.8.4.1 方法1
```csharp
List<TSource> ToList<TSource>(this IEnumerable<TSource> source)
```

#### 2.8.5 ToLookup
ToLookup 扩展方法返回的是可索引查找的数据结构，它是一个 ILookup 实例，所有元素根据指定的键进行分组并可以按键进行索引。这样说有点抽象

##### 2.8.5.1 方法1
```csharp
ILookup<TKey, TSource> ToLookup<TSource, TKey>(this IEnumerable<TSource> source, Func<TSource, TKey> keySelector)
```
来看具体示例：
```csharp
string[] array = { "one", "two", "three" };
// 根据元素字符串长度创建一个查找对象
var lookup = array.ToLookup(item => item.Length);

// 查找字符串长度为 3 的元素
var result = lookup[3];
// result: one,two
```

##### 2.8.5.2 方法2
```csharp
ILookup<TKey, TSource> ToLookup<TSource, TKey>(this IEnumerable<TSource> source, Func<TSource, TKey> keySelector, IEqualityComparer<TKey>? comparer)
```

##### 2.8.5.3 方法3
```csharp
ILookup<TKey, TElement> ToLookup<TSource, TKey, TElement>(this IEnumerable<TSource> source, Func<TSource, TKey> keySelector, Func<TSource, TElement> elementSelector)
```

##### 2.8.5.4 方法4
```csharp
ILookup<TKey, TElement> ToLookup<TSource, TKey, TElement>(this IEnumerable<TSource> source, Func<TSource, TKey> keySelector, Func<TSource, TElement> elementSelector, IEqualityComparer<TKey>? comparer)
```

#### 2.8.6 AsEnumerable
AsEnumerable是最简单的查询运算符，作用是将一个`IQueryable<T>`序列转换为一个`IEnumerable<T>`序列，强制将后续的查询运算符绑定到Enumerable的运算符(而不是Queryable的运算符)上，从而使后续的查询按本地查询处理。
```csharp
public static IEnumerable<TSource> AsEnumerable<TSource>(thisIEnumerable<TSource> source);
```
> AsEnumerable() 和 AsQueryable()如果后面不继续跟过滤条件等，效果是一样的。如果后面加了Where / Select / Take() /Skip 等条件，AsEnumerable()先查数据库再过滤,AsQueryable()将条件生成sql，一起在数据库中过滤。


##### 2.8.6.1 方法1
```csharp
IEnumerable<TSource> AsEnumerable<TSource>(this IEnumerable<TSource> source)
```

### 2.9 添加运算符

#### 2.9.1 Append

##### 2.9.1.1 方法1
```csharp
IEnumerable<TSource> Append<TSource>(this IEnumerable<TSource> source, TSource element)
```

#### 2.9.2 Prepend

##### 2.9.2.1 方法1
向序列的开头添加一个值。  
```csharp
IEnumerable<TSource> Prepend<TSource>(this IEnumerable<TSource> source, TSource element)
```

#### 3.10 分割运算符

#### 3.10.1 Chunk
将序列的元素分割成最多大小的块。  

##### 3.10.1.1 方法一
```csharp
IEnumerable<TSource[]> Chunk<TSource>(this IEnumerable<TSource> source, int size)
```

## 3. 序列->元素或标量值
接受一个输入序列，并返回单个元素或值。

### 3.1 元素运算符
```csharp
IEnumerable<TSource>	->TSource
```
从一个序列中取出一个特定的元素。
> First FirstOrDefault Last LastOrDefault Single SingleOrDeafult ElementAt ElementAtOrDefault DefaultIfEmpty


#### 3.1.1 First
取序列中满足条件的第一个元素，如果没有元素满足条件则抛出异常

##### 3.1.1.1 方法1
```csharp
TSource First<TSource>(this IEnumerable<TSource> source)
```

##### 3.1.1.2 方法2
```csharp
TSource First<TSource>(this IEnumerable<TSource> source, Func<TSource, bool> predicate)
```

#### 3.1.2 FirstOrDefault
取序列中满足条件的第一个元素，如果没有元素满足条件，则返回默认值(对于可以为null的对象，默认值是null，对于默认值不能为null的对象，比如int，默认值为0)；

##### 3.1.2.1 方法1
```csharp
TSource? FirstOrDefault<TSource>(this IEnumerable<TSource> source)
```
示例
查询该集合中第一个元素,如果没有就返回null
```csharp
var numList = new List<string>
{
    "one",
    "two",
    "three"
};
var result = numList.FirstOrDefault();//one

var numList2 = new List<string>
{
};
var result = numList2.FirstOrDefault();//null
```

##### 3.1.2.2 方法2
```csharp
TSource FirstOrDefault<TSource>(this IEnumerable<TSource> source, TSource defaultValue)
```
示例
查询一个集合中的第一个元素，如果没有找到，则返回一个默认值。
```csharp
var numList2 = new List<string>
{
};
var result = numList2.FirstOrDefault("默认值");//"默认值"
```

##### 3.1.2.3 方法3
```csharp
TSource? FirstOrDefault<TSource>(this IEnumerable<TSource> source, Func<TSource, bool> predicate)
```
示例
查询一个集合中满足条件的一个元素，如果没有找到就返回null
```csharp
var numList = new List<string>
{
    "one",
    "two",
    "three"
};
var result = numList.FirstOrDefault(t => t == "four");//null
```

##### 3.1.2.4 方法4
```csharp
TSource FirstOrDefault<TSource>(this IEnumerable<TSource> source, Func<TSource, bool> predicate, TSource defaultValue)
```
示例
查询一个集合中满足条件的一个元素，如果没有找到就返回默认值
```csharp
var numList = new List<string>
{
    "one",
    "two",
    "three"
};
var result = numList.FirstOrDefault(t => t == "four","默认值");//"默认值"
```

##### 速度对比
Find方法只能再`List<T>`上使用，FirstOrDefault可以广泛用在`IEnumerable<T>`上，Find的查询是建立在Array上，而在IEnumerable上的FirstOrDefault是使用foreach查找的，因此Find速度快于FirstOrDefault。

#### 3.1.3 Last

##### 3.1.3.1 方法1
```csharp
TSource Last<TSource>(this IEnumerable<TSource> source)
```

##### 3.1.3.2 方法2
```csharp
TSource Last<TSource>(this IEnumerable<TSource> source, Func<TSource, bool> predicate)
```

#### 3.1.4 LastOrDefault

##### 3.1.4.1 方法1
```csharp
TSource? LastOrDefault<TSource>(this IEnumerable<TSource> source)
```

##### 3.1.4.2 方法2
```csharp
TSource LastOrDefault<TSource>(this IEnumerable<TSource> source, TSource defaultValue)
```

##### 3.1.4.3 方法3
```csharp
TSource? LastOrDefault<TSource>(this IEnumerable<TSource> source, Func<TSource, bool> predicate)
```

##### 3.1.4.4 方法4
```csharp
TSource LastOrDefault<TSource>(this IEnumerable<TSource> source, Func<TSource, bool> predicate, TSource defaultValue)
```

#### 3.1.5 Single

##### 3.1.5.1 方法1
```csharp
TSource Single<TSource>(this IEnumerable<TSource> source)
```

##### 3.1.5.2 方法2
```csharp
TSource Single<TSource>(this IEnumerable<TSource> source, Func<TSource, bool> predicate)
```

#### 3.1.6 SingleOrDefault

##### 3.1.6.1 方法1
```csharp
TSource? SingleOrDefault<TSource>(this IEnumerable<TSource> source)
```

##### 3.1.6.2 方法2
```csharp
TSource SingleOrDefault<TSource>(this IEnumerable<TSource> source, TSource defaultValue)
```

##### 3.1.6.3 方法3
```csharp
TSource? SingleOrDefault<TSource>(this IEnumerable<TSource> source, Func<TSource, bool> predicate)
```

##### 3.1.6.4 方法4
```csharp
TSource SingleOrDefault<TSource>(this IEnumerable<TSource> source, Func<TSource, bool> predicate, TSource defaultValue)
```

#### 3.1.7 ElementAt

##### 3.1.7.1 方法1
```csharp
TSource ElementAt<TSource>(this IEnumerable<TSource> source, Index index)
```

##### 3.17.2 方法2
```csharp
TSource ElementAt<TSource>(this IEnumerable<TSource> source, int index)
```

#### 3.1.8 ElementAtOrDefault

##### 3.1.8.1 方法1
```csharp
TSource? ElementAtOrDefault<TSource>(this IEnumerable<TSource> source, Index index)
```

##### 3.1.8.2 方法2
```csharp
TSource? ElementAtOrDefault<TSource>(this IEnumerable<TSource> source, int index)
```

#### 3.1.9 DefaultIfEmpty

##### 3.1.9.1 方法1
```csharp
IEnumerable<TSource?> DefaultIfEmpty<TSource>(this IEnumerable<TSource> source)
```

##### 3.1.9.1 方法1
```csharp
IEnumerable<TSource> DefaultIfEmpty<TSource>(this IEnumerable<TSource> source, TSource defaultValue)
```

### 3.2 聚合方法
```csharp
IEnumerable<TSource>	->scalar
```
对集合中的元素进行计算，返回返回一个标量值（通常干是数字）。
> Aggregate Average Count LongCount Sum Max Min


#### 3.2.1 Aggregate
```csharp
Dictionary<int, List<Marketing>> dic = new Dictionary<int, List<Marketing>>();
//普通活动
if (!dic.ContainsKey(1))
    dic[1] = new List<Marketing>();
dic[1].Add(new Marketing() { MarketingID = 1, MarketingName = "普通活动1" });
dic[1].Add(new Marketing() { MarketingID = 1, MarketingName = "普通活动2" });

//事件活动
if (!dic.ContainsKey(2))
    dic[2] = new List<Marketing>();
dic[2].Add(new Marketing() { MarketingID = 3, MarketingName = "事件活动1" });
dic[2].Add(new Marketing() { MarketingID = 4, MarketingName = "事件活动2" });

//需求：将字典里面的key合并为一个集合
//foreach写法
var marketingList = new List<Marketing>();
foreach (var item in dic.Keys)
{
    marketingList.AddRange(dic[item]);
}
//Aggregate
var marketingList2 = dic.Keys.Aggregate(Enumerable.Empty<Marketing>(), (total, next) =>
                                        {
                                            return total.Union(dic[next]);
                                        }).ToList();
```

##### 3.2.1.1 方法1
```csharp
TSource Aggregate<TSource>(this IEnumerable<TSource> source, Func<TSource, TSource, TSource> func)
```

##### 3.2.1.2 方法2
```csharp
TAccumulate Aggregate<TSource, TAccumulate>(this IEnumerable<TSource> source, TAccumulate seed, Func<TAccumulate, TSource, TAccumulate> func)
```

##### 3.2.1.3 方法3
```csharp
TResult Aggregate<TSource, TAccumulate, TResult>(this IEnumerable<TSource> source, TAccumulate seed, Func<TAccumulate, TSource, TAccumulate> func, Func<TAccumulate, TResult> resultSelector)
```

#### 3.2.2 Average

##### 3.2.2.1 方法1
```csharp
decimal Average(this IEnumerable<decimal> source)
```

##### 3.2.2.2 方法2
```csharp
double Average(this IEnumerable<double> source)
```

##### 3.2.2.3 方法3
```csharp
double Average(this IEnumerable<int> source)
```

##### 3.2.2.4 方法4
```csharp
double Average(this IEnumerable<long> source)
```

##### 3.2.2.5 方法5
```csharp
decimal? Average(this IEnumerable<decimal?> source)
```

##### 3.2.2.6 方法6
```csharp
double? Average(this IEnumerable<double?> source)
```

##### 3.2.2.7 方法7
```csharp
double? Average(this IEnumerable<int?> source)
```

##### 3.2.2.8 方法8
```csharp
double? Average(this IEnumerable<long?> source)
```

##### 3.2.2.9 方法9
```csharp
float? Average(this IEnumerable<float?> source)
```

##### 3.2.2.10 方法10
```csharp
float Average(this IEnumerable<float> source)
```

##### 3.2.2.11 方法11
```csharp
decimal Average<TSource>(this IEnumerable<TSource> source, Func<TSource, decimal> selector)
```

##### 3.2.2.12 方法12
```csharp
double Average<TSource>(this IEnumerable<TSource> source, Func<TSource, double> selector)
```

##### 3.2.2.13 方法13
```csharp
double Average<TSource>(this IEnumerable<TSource> source, Func<TSource, int> selector)
```

##### 3.2.2.14 方法14
```csharp
double Average<TSource>(this IEnumerable<TSource> source, Func<TSource, long> selector)
```

##### 3.2.2.15 方法15
```csharp
decimal? Average<TSource>(this IEnumerable<TSource> source, Func<TSource, decimal?> selector)
```

##### 3.2.2.16 方法16
```csharp
double? Average<TSource>(this IEnumerable<TSource> source, Func<TSource, double?> selector)
```

##### 3.2.2.17 方法17
```csharp
double? Average<TSource>(this IEnumerable<TSource> source, Func<TSource, int?> selector)
```

##### 3.2.2.18 方法18
```csharp
double? Average<TSource>(this IEnumerable<TSource> source, Func<TSource, long?> selector)
```

##### 3.2.2.19 方法19
```csharp
float? Average<TSource>(this IEnumerable<TSource> source, Func<TSource, float?> selector)
```

##### 3.2.2.20 方法20
```csharp
float Average<TSource>(this IEnumerable<TSource> source, Func<TSource, float> selector)
```

#### 3.2.3 Count

##### 3.2.3.1 方法1
```csharp
int Count<TSource>(this IEnumerable<TSource> source)
```

##### 3.2.3.2 方法2
```csharp
int Count<TSource>(this IEnumerable<TSource> source, Func<TSource, bool> predicate)
```

#### 3.2.4 LongCount

##### 3.2.4.1 方法1
```csharp
long LongCount<TSource>(this IEnumerable<TSource> source)
```

##### 3.2.4.2 方法2
```csharp
long LongCount<TSource>(this IEnumerable<TSource> source, Func<TSource, bool> predicate)
```

#### 3.2.5 Sum

##### 3.2.5.1 方法1
```csharp
decimal Sum(this IEnumerable<decimal> source)
```

##### 3.2.5.2 方法2
```csharp
double Sum(this IEnumerable<double> source)
```

#### 3.2.5.3 方法3
```csharp
int Sum(this IEnumerable<int> source)
```

##### 3.2.5.4 方法4
```csharp
long Sum(this IEnumerable<long> source)
```

##### 3.2.5.5 方法5
```csharp
decimal? Sum(this IEnumerable<decimal?> source)
```

##### 3.2.5.6 方法6
```csharp
double? Sum(this IEnumerable<double?> source)
```

##### 3.2.5.7 方法7
```csharp
int? Sum(this IEnumerable<int?> source)
```

##### 3.2.5.8 方法8
```csharp
long? Sum(this IEnumerable<long?> source)
```

##### 3.2.5.9 方法9
```csharp
float? Sum(this IEnumerable<float?> source)
```

##### 3.2.5.10 方法10
```csharp
float Sum(this IEnumerable<float> source)
```

##### 3.2.5.11 方法11
```csharp
decimal Sum<TSource>(this IEnumerable<TSource> source, Func<TSource, decimal> selector)
```

##### 3.2.5.12 方法12
```csharp
double Sum<TSource>(this IEnumerable<TSource> source, Func<TSource, double> selector)
```

##### 3.2.5.13 方法13
```csharp
int Sum<TSource>(this IEnumerable<TSource> source, Func<TSource, int> selector)
```

##### 3.2.5.14 方法14
```csharp
long Sum<TSource>(this IEnumerable<TSource> source, Func<TSource, long> selector)
```

##### 3.2.5.15 方法15
```csharp
decimal? Sum<TSource>(this IEnumerable<TSource> source, Func<TSource, decimal?> selector)
```

##### 3.2.5.16 方法16
```csharp
double? Sum<TSource>(this IEnumerable<TSource> source, Func<TSource, double?> selector)
```

##### 3.2.5.17 方法17
```csharp
int? Sum<TSource>(this IEnumerable<TSource> source, Func<TSource, int?> selector)
```

##### 3.2.5.18 方法18
```csharp
long? Sum<TSource>(this IEnumerable<TSource> source, Func<TSource, long?> selector)
```

##### 3.2.5.19 方法19
```csharp
float? Sum<TSource>(this IEnumerable<TSource> source, Func<TSource, float?> selector)
```

##### 3.2.5.20 方法20
```csharp
float Sum<TSource>(this IEnumerable<TSource> source, Func<TSource, float> selector)
```

#### 3.2.6 Max

##### 3.2.6.1 方法1
```csharp
decimal Max(this IEnumerable<decimal> source)
```

##### 3.2.6.2 方法2
```csharp
double Max(this IEnumerable<double> source)
```

##### 3.2.6.3 方法3
```csharp
int Max(this IEnumerable<int> source)
```

##### 3.2.6.4 方法4
```csharp
long Max(this IEnumerable<long> source)
```

##### 3.2.6.5 方法5
```csharp
decimal? Max(this IEnumerable<decimal?> source)
```

##### 3.2.6.6 方法6
```csharp
double? Max(this IEnumerable<double?> source)
```

##### 3.2.6.7 方法7
```csharp
int? Max(this IEnumerable<int?> source)
```

##### 3.2.6.8 方法8
```csharp
long? Max(this IEnumerable<long?> source)
```

##### 3.2.6.9 方法9
```csharp
float? Max(this IEnumerable<float?> source)
```

##### 3.2.6.10 方法10
```csharp
float Max(this IEnumerable<float> source)
```

##### 3.2.6.11 方法11
```csharp
TSource? Max<TSource>(this IEnumerable<TSource> source)
```

##### 3.2.6.12 方法12
```csharp
TSource? Max<TSource>(this IEnumerable<TSource> source, IComparer<TSource>? comparer)
```

##### 3.2.6.13 方法13
```csharp
decimal Max<TSource>(this IEnumerable<TSource> source, Func<TSource, decimal> selector)
```

##### 3.2.6.14 方法14
```csharp
double Max<TSource>(this IEnumerable<TSource> source, Func<TSource, double> selector)
```

##### 3.2.6.15 方法15
```csharp
int Max<TSource>(this IEnumerable<TSource> source, Func<TSource, int> selector)
```

##### 3.2.6.16 方法16
```csharp
long Max<TSource>(this IEnumerable<TSource> source, Func<TSource, long> selector)
```

##### 3.2.6.17 方法17
```csharp
decimal? Max<TSource>(this IEnumerable<TSource> source, Func<TSource, decimal?> selector)
```

##### 3.2.6.18 方法18
```csharp
double? Max<TSource>(this IEnumerable<TSource> source, Func<TSource, double?> selector)
```

##### 3.2.6.19 方法19
```csharp
int? Max<TSource>(this IEnumerable<TSource> source, Func<TSource, int?> selector)
```

##### 3.2.6.20 方法20
```csharp
long? Max<TSource>(this IEnumerable<TSource> source, Func<TSource, long?> selector)
```

##### 3.2.6.21 方法21
```csharp
float? Max<TSource>(this IEnumerable<TSource> source, Func<TSource, float?> selector)
```

##### 3.2.6.22 方法22
```csharp
float Max<TSource>(this IEnumerable<TSource> source, Func<TSource, float> selector)
```

##### 3.2.6.23 方法23
```csharp
TResult? Max<TSource, TResult>(this IEnumerable<TSource> source, Func<TSource, TResult> 
```

#### 3.2.7 MaxBy

##### 3.2.7.1 方法1
```csharp
TSource? MaxBy<TSource, TKey>(this IEnumerable<TSource> source, Func<TSource, TKey> keySelector)
```

##### 3.2.7.2 方法2
```csharp
TSource? MaxBy<TSource, TKey>(this IEnumerable<TSource> source, Func<TSource, TKey> keySelector, IComparer<TKey>? comparer)
```

#### 3.2.8 Min

##### 3.2.8.1 方法1
```csharp
decimal Min(this IEnumerable<decimal> source)
```

##### 3.2.8.2 方法2
```csharp
double Min(this IEnumerable<double> source)
```

##### 3.2.8.3 方法3
```csharp
int Min(this IEnumerable<int> source)
```

##### 3.2.8.4 方法4
```csharp
long Min(this IEnumerable<long> source)
```

##### 3.2.8.5 方法5
```csharp
decimal? Min(this IEnumerable<decimal?> source)
```

##### 3.2.8.6 方法6
```csharp
double? Min(this IEnumerable<double?> source)
```

##### 3.2.8.7 方法7
```csharp
int? Min(this IEnumerable<int?> source)
```

##### 3.2.8.8 方法8
```csharp
long? Min(this IEnumerable<long?> source)
```

##### 3.2.8.9 方法9
```csharp
float? Min(this IEnumerable<float?> source)
```

##### 3.2.8.10 方法10
```csharp
float Min(this IEnumerable<float> source)
```

##### 3.2.8.11 方法11
```csharp
TSource? Min<TSource>(this IEnumerable<TSource> source)
```

##### 3.2.8.12 方法12
```csharp
TSource? Min<TSource>(this IEnumerable<TSource> source, IComparer<TSource>? comparer)
```

##### 3.2.8.13 方法13
```csharp
decimal Min<TSource>(this IEnumerable<TSource> source, Func<TSource, decimal> selector)
```

##### 3.2.8.14 方法14
```csharp
double Min<TSource>(this IEnumerable<TSource> source, Func<TSource, double> selector)
```

##### 3.2.8.15 方法15
```csharp
int Min<TSource>(this IEnumerable<TSource> source, Func<TSource, int> selector)
```

##### 3.2.8.16 方法16
```csharp
long Min<TSource>(this IEnumerable<TSource> source, Func<TSource, long> selector)
```

##### 3.2.8.17 方法17
```csharp
decimal? Min<TSource>(this IEnumerable<TSource> source, Func<TSource, decimal?> selector)
```

##### 3.2.8.18 方法18
```csharp
double? Min<TSource>(this IEnumerable<TSource> source, Func<TSource, double?> selector)
```

##### 3.2.8.19 方法19
```csharp
int? Min<TSource>(this IEnumerable<TSource> source, Func<TSource, int?> selector)
```

##### 3.2.8.20 方法20
```csharp
long? Min<TSource>(this IEnumerable<TSource> source, Func<TSource, long?> selector)
```

##### 3.2.8.21 方法21
```csharp
float? Min<TSource>(this IEnumerable<TSource> source, Func<TSource, float?> selector)
```

##### 3.2.8.22 方法22
```csharp
float Min<TSource>(this IEnumerable<TSource> source, Func<TSource, float> selector)
```

##### 3.2.8.23 方法23
```csharp
TResult? Min<TSource, TResult>(this IEnumerable<TSource> source, Func<TSource, TResult> selector)
```

#### 3.2.9 MinBy

##### 3.2.9.1 方法1
```csharp
TSource? MinBy<TSource, TKey>(this IEnumerable<TSource> source, Func<TSource, TKey> keySelector)
```

##### 3.2.9.2 方法2
```csharp
TSource? MinBy<TSource, TKey>(this IEnumerable<TSource> source, Func<TSource, TKey> keySelector, IComparer<TKey>? comparer)
```

### 3.3 量词运算符
```csharp
IEnumerable<TSource>	->bool
```
一种返回true或者false的聚合方法。
> All Any Contains SequenceEqual


#### 3.3.1 Any
Any 用来判断集合中是否存在任一一个元素符合条件。
```csharp
var numbers = new int[] {1, 2, 3, 4, 5 };
bool result = numbers.Any(); // true
bool result = numbers.Any(x => x == 6); // false
bool result = numbers.All(x => x > 0); // true
bool result = numbers.All(x => x > 1); // false
```

##### 3.3.1.1 方法1
```csharp
bool Any<TSource>(this IEnumerable<TSource> source)
```

##### 3.3.1.2 方法2
```csharp
bool Any<TSource>(this IEnumerable<TSource> source, Func<TSource, bool> predicate)
```

#### 3.3.2 ALL
All 用来判断集合中是否所有元素符合条件。
```csharp
var numbers = new int[] {1, 2, 3, 4, 5 };
bool result = numbers.All(x => x > 0); // true
bool result = numbers.All(x => x > 1); // false
```

##### 3.3.2.1 方法1
```csharp
bool All<TSource>(this IEnumerable<TSource> source, Func<TSource, bool> predicate)
```

#### 3.3.3 Contains

##### 3.3.3.1 方法1
```csharp
bool Contains<TSource>(this IEnumerable<TSource> source, TSource value)
```

##### 3.3.3.2 方法2
```csharp
bool Contains<TSource>(this IEnumerable<TSource> source, TSource value, IEqualityComparer<TSource>? comparer)
```

#### 3.3.4 SequenceEqual
SequenceEqual 扩展方法用于比较集合系列各个相同位置的元素是否相等。

##### 3.3.4.1 方法1
```csharp
bool SequenceEqual<TSource>(this IEnumerable<TSource> first, IEnumerable<TSource> second)
```
示例：
```csharp
int[] a = new int[] {1, 2, 3};
int[] b = new int[] {1, 2, 3};
int[] c = new int[] {1, 3, 2};

bool result1 = a.SequenceEqual(b); // true
bool result2 = a.SequenceEqual(c); // false
```

##### 3.3.4.2 方法2
```csharp
bool SequenceEqual<TSource>(this IEnumerable<TSource> first, IEnumerable<TSource> second, IEqualityComparer<TSource>? comparer)
```

#### 3.3.5 TryGetNonEnumeratedCount
尝试在不强制枚举的情况下确定序列中的元素数  

##### 3.3.5.1 方法1
```csharp
bool TryGetNonEnumeratedCount<TSource>(this IEnumerable<TSource> source, out int count)
```

## 4 void->序列
从零开始输出一个序列。
生成集合的方法
```csharp
void	->IEnumerable<TResult>
```
生成一个简单的集合，方法有：
> Empty Range Repeat


### 4.1 Range
用于生成简单的数字系列

#### 4.1.1 方法1
```csharp
IEnumerable<int> Range(int start, int count)
```
示例
从方法原型可以看出，这并不是一个扩展方法，只是一个普通的静态方法，其中第一个参数表示开始的数字，第二个是要生成的数量，返回一个`IEnumerable<ine>`的集合。
```csharp
IEnumerable<int> ints = Enumerable.Range(1, 10);
foreach (int i in ints)
{
    Console.WriteLine(i);   //输出 1 2 3 4 5 6 7 8 9 10
}
```

### 4.2 Repeat
Repeat操作符用于生成一个包含指定数量重复元素的序列

#### 4.2.1 方法1
```csharp
IEnumerable<TResult> Repeat<TResult>(TResult element, int count)
```
示例
这是一个泛型的静态方法，你可以生成任何类型重复的元素，第二个参数代表个数，第一个表示要重复生成的元素。
```csharp
IEnumerable<int> ints = Enumerable.Repeat(1, 10);
foreach (int i in ints)
{
    Console.WriteLine(i);   //输出 1 1 1 1 1 1 1 1 1 1
}
```

### 4.3 Empty
Empty操作符用于生成一个包含指定类型元素的空序列。

#### 4.3.1 方法1
```csharp
IEnumerable<TResult> Empty<TResult>()
```
从方法原型可以看出，这只是一个普通的静态方法，但是挺有用，因为`IEnumerable<T>`是个接口，不能new，但是用这个方法可以生成一个空的`IEnumerable<T>`对象了。
```csharp
IEnumerable<int> ints = Enumerable.Empty<int>();
Console.WriteLine(ints.Count());   //输出0
```

### 4.4 DefaultEmpty
DefaultEmpty操作符可以用来为一个空的输入序列生成一个对应的含有默认元素的新序列。引用类型为null，值类型为相应的默认值。有些标准操作符在一个空的序列上调用时会抛出一个异常，而DefaultEmpty恰恰可以解决这个问题。
```plsql
public staticIEnumerable<TSource> DefaultIfEmpty<TSource>(thisIEnumerable<TSource>source);
public static IEnumerable<TSource> DefaultIfEmpty<TSource>(this IEnumerable<TSource> source, TSource defaultValue);
```
如果我们对一个空集合使用first，那么会抛出异常，但是我们用了DefaultEmpty就可以解决这个问题
```plsql
var numList = new List<string>();
numList.Add("one");
numList.Add("two");
numList.Add("three");
var bb = numList.Where(t => t.StartsWith("a"));
string str = numList.Where(s => s.StartsWith("a")).DefaultIfEmpty().First();//null
//如果去掉DefaultEmpty就会报异常("序列中不包含任何元素")
string str1 = numList.Where(s => s.StartsWith("a")).First();
```

## 5 参考文档
> 官方文档：[https://docs.microsoft.com/zh-cn/dotnet/csharp/programming-guide/concepts/linq/standard-query-operators-overview](https://docs.microsoft.com/zh-cn/dotnet/csharp/programming-guide/concepts/linq/standard-query-operators-overview)
> c#核心技术指南

[https://mp.weixin.qq.com/s/pFnne9Ge8bicwcQ4DzXwZA](https://mp.weixin.qq.com/s/pFnne9Ge8bicwcQ4DzXwZA) | C#规范整理·集合和Linq
