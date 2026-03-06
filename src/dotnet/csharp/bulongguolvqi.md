---
title: 布隆过滤器
lang: zh-CN
date: 2023-10-22
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 无
filename: bulongguolvqi
slug: ryzdfqdobr2wd93d
docsId: '133123002'
---

## 概述
一个非常节省空间的概率数据结构，运行速度快、占用内存小，但是有一定的误判率且无法删除元素。
本质上由一个位数组(每个元素都只占用1bit)和n个哈希函数组成。

## 特性

- 检查一个元素是否在集成中；
- 检查结果分为2种：一定不在集合中、可能在集合中；
- 布隆过滤器支持添加元素、检查元素，但是不支持删除元素；
- 检查结果的“可能在集合中”说明存在一定误判率；
   - 已经添加进入布隆过滤器的元素是不会被误判的，仅未添加过的元素才可能被误判；
- 添加的元素超过预设容量越多，误报的可能性越大。

## 处理场景

- 当请求不存在的值的时候，缓存又不会被命中(缓存穿透)，所以导致大量请求直接到数据库，这个时候在中间加一个布隆过滤器，允许存在(可能存在)的数据去查询数据库，屏蔽不可能存在的查询值。
- 在业务系统中用来判断用户是否阅读过某一些文章或者视频，比如内容推荐，会导致一定的误判，但是不会让用户看到重复的内容
- 黑名单：比如在邮件系统中使用布隆过滤器来设置黑名单，判断邮件地址是否在黑名单中

## 实现过程
实现并不是将具体的数据存储在数组中，而是通过hash函数对要存储的数据进行多次hash运算，并且将hash运算后的结果作为位数组的下标，然后将对应的数组元素修改为1。
![](/common/1689591811182-3e16ee57-5b6f-424e-8ca6-79d91dfc4989.webp)
从上图中可以看到，我们有三个hash函数（h1()、h2()、h3()）和一个位数组，oracle经过三个hash函数，得到第1、4、5位为1，database同理得到2、5、10位1，这样如果我们需要判断oracle是否在此位数组中，则通过hash函数判断位数组的1、4、5位是否均为1，如果均为1，则判断oracle在此位数组中，database同理。这就是布隆过滤器判断元素是否在集合中的原理。

但是如果我们现在要判断"mysql"是否存在，例如它通过三次hash运算得到的值分别是4,5,10。现在即使你的位数中没有存储“mysql”,布隆过滤器也会判断它存在。这是因为"oracle"、"database"、"filter"算出的hash值已经导致上面的三个位置的值被改为了1，这样就会导致误判。但是可以保证的是，如果**布隆过滤器判断一个元素不在一个集合中，那这个元素一定不会再集合中。**

正式使用中就是，将需要判断是否存在的数据库标识列作为上面示例的输入集合，将值经过哈希计算后标注到数组中，然后来了新的值后，就可以通过布隆过滤器来判断该值是否存在，过滤到绝大多数的非法请求。

在缓存之前预热一个布隆过滤器，然后就可以阻止绝大部分非法的查询请求。(查询请求到达的时候先去布隆过滤器中判断值是否存在，如果值存在那么再去缓存中取，取不到再去数据库中查询)
![image.png](/common/1689591110549-1334fa91-0e58-43ba-a462-865609c16316.png)

关于为啥要使用多个哈希函数？经过一次哈希函数落在指定标记点，只能说明该值有可能属于输入的集合(哈希碰撞)，但是经过多个哈希函数，还是落到标记的点，概率叠加，增加了属于输入集合的概率。

## 示例

### 示例1
操作示例
```csharp
// 设置过滤器的大小和哈希函数个数来控制误判率
var filter = new BloomFilter(100000, 3);
filter.Add("apple");
filter.Add("banana");
Console.WriteLine(filter.Contains("orange")); // 输出：False
```
BloomFilter内容
```csharp
public class BloomFilter
{
    /// <summary>
    /// 过滤的位数组
    /// </summary>
    private readonly BitArray filter;

    private readonly int[] hashSeeds;
    private readonly int size;

    public BloomFilter(int size, int numHashes)
    {
        this.size = size;
        this.filter = new BitArray(size);
        this.hashSeeds = GenerateHashSeeds(numHashes);
    }

    public void Add(string item)
    {
        var hashes = GetHashes(item);
        foreach (var hash in hashes)
        {
            filter[hash] = true;
        }
    }

    public bool Contains(string item)
    {
        var hashes = GetHashes(item);
        foreach (var hash in hashes)
        {
            if (!filter[hash])
            {
                return false;
            }
        }
        return true;
    }

    private int[] GetHashes(string item)
    {
        var hashes = new int[hashSeeds.Length];
        for (var i = 0; i < hashSeeds.Length; i++)
        {
            hashes[i] = GetHash(item, hashSeeds[i]);
        }
        return hashes;
    }

    private int GetHash(string item, int seed)
    {
        var hash = seed;
        foreach (var c in item)
        {
            hash = (hash * 31) + c;
        }
        return Math.Abs(hash % size);
    }

    /// <summary>
    /// 生成哈希函数
    /// </summary>
    /// <param name="numHashes"></param>
    /// <returns></returns>
    private int[] GenerateHashSeeds(int numHashes)
    {
        var seeds = new int[numHashes];
        var random = new Random();
        for (var i = 0; i < numHashes; i++)
        {
            seeds[i] = random.Next();
        }
        return seeds;
    }
}
```

### 示例2(成熟组件)
布隆过滤器的误报率跟哈希碰撞和有几个哈希函数有关，不过成熟的组件都不需要考虑这些，只需要指定哈希结果存储区、容量、误报率。

| 包名 | 介绍 |
| --- | --- |
| BloomFilter.NetCore | 以内存存储哈希结果 |
| BloomFilter.Redis.NetCore | 以redis存储哈希结果 |
| BloomFilter.CSRedis.NetCore | 通过csredis去操作redis存储哈希结果 |
| BloomFilter.EasyCaching.NetCore |  |

以内存中的布隆过滤器为例，安装
```csharp
<PackageReference Include="BloomFilter.NetCore" Version="2.1.1" />
```
编写测试代码
```csharp
/// <summary>
/// 布隆过滤器配置 key：容量、误报率0.01
/// </summary>
private static readonly IBloomFilter bloomFilter = FilterBuilder.Build(10_000_000);

/// <summary>
/// 内存
/// </summary>
public void InMemoryBloomFilter()
{
    // 定义初始集合，填充到布隆过滤器中
    var size = 10_000_000;
    for (var i = 0; i < size; i++)
    {
        bloomFilter.Add(i);
    }

    var list = new List<int>();
    // 故意取100个不在布隆过滤器中的值，看下有多少值误报
    for (var i = size + 1; i < size + 100; i++)
    {
        if (bloomFilter.Contains(i))
        {
            list.Add(i);
        }
    }
    Console.WriteLine($"误报的个数为：{list.Count}");
}
```

## 优缺点
优点

- 所占空间小(并不存储真正的数据)，空间效率高
- 查询时间短

缺点

- 元素添加到数组后，不能被删除
- 有一定的误判率

## 总结
布隆过滤器是哈希函数单向收敛(将输入数据通过哈希函数转换为固定长度的哈希值时，很难逆向推导出原始输入数据)和概率论的完美结合。

但是布隆过滤器对删除不友好，所以当数据库中有大量的键变更的时候，需要重建布隆过滤器或者定时来进行重建操作。

## 参考资料
[https://www.cnblogs.com/JulianHuang/p/14923059.html](https://www.cnblogs.com/JulianHuang/p/14923059.html) | 难缠的布隆过滤器，这次终于通透了 - 博客猿马甲哥 - 博客园
[https://zhuanlan.zhihu.com/p/575025944](https://zhuanlan.zhihu.com/p/575025944) | 防缓存穿透利器-布隆滤器(BloomFilter) - 知乎
