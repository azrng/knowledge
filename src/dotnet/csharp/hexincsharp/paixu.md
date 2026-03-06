---
title: 排序
lang: zh-CN
date: 2023-10-22
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 无
filename: paixu
slug: qgd0x8
docsId: '53520095'
---

## 概述
学习C#中排序的简单用法

## 操作

### 英文排序
按照ASCII排序
```csharp
Console.WriteLine("没有排序");
var chars = new[] {'a', 'A', '[', ']' };
foreach (var c in chars)
{
    Console.Write($"{c}：{(int)c} => "); // a：97 => A：65 => [：91 => ]：93 =>
}
Console.WriteLine();

Console.WriteLine("默认排序后  是按照ASCII排序");
chars = chars.OrderBy(t => t).ToArray();
foreach (var c in chars)
{
    Console.Write($"{c}：{(int)c} => "); // A：65 => [：91 => ]：93 => a：97 =>
}
Console.WriteLine();
```

### 汉字排序
汉字可以有两种排序方案。发音排序(默认)和笔画数排序。

当使用区域名称("zh-CN")创建CultureInfo的时候，使用的是默认排序，也可以来指定特殊的排序顺序，详细步骤如下
```csharp
var strArr = new string[] { "鄭", "我", "吧", "啊", "饿", "一" };

// 输出当前区域以及排序规则
Console.WriteLine(CultureInfo.CurrentCulture.NativeName); // 中文（中国）

//设置区域zh-cn （拼音：简中）
//Thread.CurrentThread.CurrentCulture = new CultureInfo("zh-cn");

// 使用默认的排序：发音排序
Array.Sort(strArr);
foreach (var item in strArr)
{
    Console.Write(item); // 啊吧饿我一鄭
}
Console.WriteLine();

// 设置笔画数排序 LCID：0x00020804
Thread.CurrentThread.CurrentCulture = new CultureInfo(133124);

// 输出当前区域以及排序
Console.WriteLine(CultureInfo.CurrentCulture.NativeName); // 中文（中国，排序=笔画排序）

Array.Sort(strArr);
foreach (var item in strArr)
{
    Console.Write(item); // 一吧我饿啊鄭
}
Console.WriteLine();

// 设置发音排序 LCID：0x00000804
Thread.CurrentThread.CurrentCulture = new CultureInfo(2052);
Array.Sort(strArr);
foreach (var item in strArr)
{
    Console.Write(item); //啊吧饿我一鄭
}
```

### 自定义排序
Compare方法的实现必须Int32返回具有以下三个值之一的，如下表所示。

| 值 | 含义 |
| --- | --- |
| 小于零 | 此对象在排序顺序中位于CompareTo方法所指定的对象之前。 |
| 零 | 此当前实例在排序顺序中与CompareTo方法参数指定的对象出现在同一位置。 |
| 大于零 | 此当前实例位于排序顺序中由CompareTo方法自变量指定的对象之后。 |


当使用SortedList的时候，结果发现输出的排序结果不是我们想要的样子
```csharp
Console.WriteLine("使用SortList:没有按照ASCII排序");
var list = new SortedList<string, int>
{
    { "a", 97 },
    { "A", 65 },
    { "[", 91 },
    { "]", 93 },
    { "长", 100 }
};

foreach (var item in list)
{
    Console.Write($"{item.Key}:{item.Value} => "); // [：91 => ]：93 => 长：100 => a：97 => A：65 =>
}
```
这个时候我们可以编写自定义排序规则来实现
```csharp
// 编写自定义比较器实现： 根据ASCII先数字、字母、特殊字符、汉字的排序方案

var list2 = new SortedList<string, int>(new CustomerComparer())
{
    { "a", 97 },
    { "A", 65 },
    { "[", 91 },
    { "长", 100 },
    { "]", 93 },
    { "8", 56 },
    { "啊", 100 },
    { "3", 51 },
};

foreach (var item in list2)
{
    Console.Write($"{item.Key}:{item.Value} => ");
}


/// <summary>
/// 自定义长度排序比较器
/// </summary>
public class CustomerComparer : IComparer<string>
{
    /// <summary>
    /// 比较
    /// </summary>
    /// <param name="x"></param>
    /// <param name="y"></param>
    /// <returns>小于零，往前排，0同一个位置，大于零：往后排</returns>
    public int Compare(string? x, string? y)
    {
        if (x == null || y == null)
        {
            throw new Exception("比较的值不能为null");
        }

        //长度不等
        if (x.Length != y.Length)
        {
            for (var i = 0; i < Math.Min(x.Length, y.Length); i++)
            {
                if (x[i] > y[i])
                {
                    return 1;
                }

                if (x[i] < y[i])
                {
                    return -1;
                }
            }

            return x.Length < y.Length ? -1 : 1;
        }

        // 长度相等
        for (var i = 0; i < x.Length; i++)
        {
            if (x[i] > y[i])
            {
                return 1;
            }

            if (x[i] < y[i])
            {
                return -1;
            }
        }

        return 0;
    }
}
```
这样子就可以实现ASCII排序排序了

## 部署
将上面的例子中一个代码写到控制台中发布成镜像运行(镜像用的vs默认的,其它镜像可能会缺少库)
```csharp
var strArr = new string[] { "鄭", "我", "吧", "啊", "饿", "一" };

// 输出当前区域以及排序规则
Console.WriteLine(CultureInfo.CurrentCulture.NativeName);

// 使用默认的排序：发音排序
Array.Sort(strArr);
foreach (var item in strArr)
{
    Console.Write(item); // 本地输出结果：啊吧饿我一鄭
}
Console.WriteLine();
```
容器输出结果为：
Invariant Language (Invariant Country)
一吧啊我鄭饿

这不是我们想要的结果，所以就去修改dockerfile文件，尝试设置时区为上海，结果不行，经过查询资料(**公众号【不才老黄】**)，发现在运行镜像的时候加上以下命令就可以了
```csharp
docker run -e LC_ALL=zh_CN --rm sorttest
## 或者
docker run -e LANG=zh_CN --rm sorttest
```
或者如果你使用的是docker-compose，那么可以这么设置
```yaml
version: "3"
services:
  consoleapp:
    container_name: consoleapp1
    build:
      context: .
      dockerfile: Dockerfile
    environment: 
      LC_ALL: zh_CN
```

## 参考资料
公众号【不才老黄】：[https://mp.weixin.qq.com/s/dObFMxr4VHJzog8VDUFUjw](https://mp.weixin.qq.com/s/dObFMxr4VHJzog8VDUFUjw)
[https://learn.microsoft.com/zh-cn/previous-versions/bb688122(v=msdn.10)?redirectedfrom=MSDN](https://learn.microsoft.com/zh-cn/previous-versions/bb688122(v=msdn.10)?redirectedfrom=MSDN)
