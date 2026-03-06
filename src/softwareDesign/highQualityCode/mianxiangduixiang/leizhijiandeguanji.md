---
title: 类之间的关系
lang: zh-CN
date: 2023-09-05
publish: true
author: azrng
isOriginal: true
category:
  - 软件设计
tag:
  - 无
filename: leizhijiandeguanji
slug: ur1b8m
docsId: '84140484'
---

## 泛化
比如鸟和动物，动物就是鸟的泛化，鸟是动物的特化，也成为鸟继承自动物
```csharp
/// <summary>
/// 动物
/// </summary>
public abstract class Animal
{
    /// <summary>
    /// 生命
    /// </summary>
    public bool Life { get; set; }
}

/// <summary>
/// 鸟
/// </summary>
public class Bird : Animal
{
    /// <summary>
    /// 羽毛
    /// </summary>
    public bool Feather { get; set; }
}
```

## 实现
大雁类和飞的接口之间是实现关系
```csharp
/// <summary>
/// 飞
/// </summary>
public interface IFly
{
    void Flay();
}

/// <summary>
/// 大雁
/// 大雁和非是实现关系
/// </summary>
public class WildGoose : IFly
{
    public void Flay()
    {
        Console.WriteLine("大雁飞");
    }

    public void LayEggs()
    {
        Console.WriteLine("下蛋");
    }
}
```

## 组合
合成/组合是一种强的“拥有”关系，体验了严格的部分和整体的关系，部分和整体的声明周期一样。
这里鸟和其翅膀之间是组合关系，因为他们是部分和整体的关系，并且翅膀和鸟的生命周期是相同的。
```csharp
/// <summary>
/// 鸟
/// </summary>
public class Bird : Animal
{
    public Bird()
    {
        this.Wing=new Wing();
    }

    /// <summary>
    /// 羽毛
    /// </summary>
    public Wing Wing { get; set; }
}

/// <summary>
/// 翅膀
/// </summary>
public class Wing
{
}
```

## 聚合
大雁的类和大雁群的类之间就是聚合关系，聚合是一种弱的拥有关系，提现的是A对象可以包含B对象，但是B对象不是A对象的一部分。
```csharp
/// <summary>
/// 大雁
/// </summary>
public class WildGoose : IFly
{
    public void LayEggs()
    {
        Console.WriteLine("下蛋");
    }
}

/// <summary>
/// 大雁群
/// </summary>
public class WildGooseGroup
{
    public List<WildGoose> WildGeeseList { get; set; }
}
```

## 关联
比如企鹅是一种特别的鸟，它与气候很又打关联，企鹅需要知道气候的变化，需要了解气候归来，当一个类知道另一个类的时候，可以通过关联来表示。
```csharp
/// <summary>
/// 企鹅
/// 企鹅类和气候类属于关联关系
/// </summary>
public class Penguin : Bird
{
    /// <summary>
    /// 气候类
    /// </summary>
    public Climate Climate { get; set; }

    public void LayEggs()
    {
        Console.WriteLine("下蛋");
    }
}

/// <summary>
/// 气候类
/// </summary>
public class Climate
{
}
```

## 依赖
动物和水以及氧气是依赖关系
```csharp
/// <summary>
/// 水
/// </summary>
public class Water
{
}

/// <summary>
/// 氧气
/// </summary>
public class Oxygen
{
}

/// <summary>
/// 动物
/// </summary>
public abstract class Animal
{
    public Animal(Water water, Oxygen oxygen)
    {
    }

    /// <summary>
    /// 生命
    /// </summary>
    public bool Life { get; set; }
}
```
