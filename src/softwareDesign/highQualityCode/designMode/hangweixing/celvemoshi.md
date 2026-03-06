---
title: 策略模式
lang: zh-CN
date: 2023-02-09
publish: true
author: azrng
isOriginal: true
category:
  - 软件设计
tag:
  - 无
filename: celvemoshi
slug: vzmepgam7z1bg04s
docsId: '111752850'
---

## 概述
策略模式(Strategy Design Pattern)定义一组算法类，将每个算法分别封装起来，让他们可以互相替换。策略模式就是可以使算法的变化独立于使用它们的客户端(这里的客户端指使用算法的代码)。

## 使用场景
利用它来避免很长的if-else或switch分支判断，不过它的作用不止于此，还可以像模板模式那样子，提供框架的扩展点。

## 对比
工厂模式：解耦对象的创建和使用
观察者模式：解耦观察者和被观察者
策略模式：也能解耦，但是它解耦的是策略的定义、创建、使用三部分。

策略模式通常和工厂一起配合使用，策略侧重如何灵活选择替换，工厂侧重如何创建实例。

相同点：在模式结构上，两者很相似
不同点：
用途不同：工厂是创建型模式，作用就是创建对象，策略模式是行为型模式，作用就是让一个对象在许多行为中选择一种行为；
关注点不同：一个关注对象的创建，一个关注行为的封装
解决的问题不同：一个解决资源的统一分发，将对象的创建完全独立出来，让对象的创建和具体的使用客户物管。一个是为了解决策略的切换与扩展。工厂相当于黑盒子，策略相当于白盒子。

## 操作

### 示例1

#### 策略定义
策略的定义就是定义一个策略接口以及一组实现这个接口的策略类，又因为所有的策略类都实现相同的接口，所以客户端代码基于接口而非实现编程，可以灵活地替代不同的策略
```csharp
/// <summary>
/// 策略定义
/// </summary>
public interface IStrategy
{
    void AlgorithmInterface();
}

public class ConcreteStrategyA : IStrategy
{
    public void AlgorithmInterface()
    {
        // 具体算法
        Console.WriteLine("实现A");
    }
}

public class ConcreteStrategyB : IStrategy
{
    public void AlgorithmInterface()
    {
        // 具体算法
        Console.WriteLine("实现B");
    }
}
```

#### 策略创建
策略在使用的时候一般通过类型(type)来判断创建哪个策略来使用，为了封装创建逻辑，我们需要对客户端代码屏蔽创建细节，我们可以把根据type创建策略的逻辑抽离出来，放到工厂类中，如下
```csharp
public class NoStateObjectStrategyFactory
{
    private static readonly Dictionary<string, IStrategy> _strategies = new Dictionary<string, IStrategy>();

    static NoStateObjectStrategyFactory()
    {
        _strategies.Add("A", new ConcreteStrategyA());
        _strategies.Add("B", new ConcreteStrategyB());
    }

    public static IStrategy GetStrategy(string type)
    {
        if (type.IsNullOrWhiteSpace())
            throw new ArgumentException("参数错误");
        return _strategies.GetValueOrDefault(type);
    }
}
```
对于策略类是无状态的，不包含成员变量，只是纯粹的算法实现，那么这样子的策略对象就是可以被共享使用的，不需要每次调用的时候创建新的策略对象，这个使用我们就可以使用工厂类来实现，事先创建好每个策略对象，缓存到工厂类中，用的时候直接返回。

如果策略类是有状态的，根据业务需要，我们希望每次从工厂方法中获取到的策略对象都是新创建的策略对象，而不是缓存好的，所以我们需要这么来获取
```csharp
public class ContainStateObjectStrategyFactory
{
    public static IStrategy GetStrategy(string type)
    {
        if (type.IsNullOrWhiteSpace())
            throw new ArgumentException("参数错误");
        if (type == "A")
        {
            return new ConcreteStrategyA();
        }
        else if (type == "B")
        {
            return new ConcreteStrategyB();
        }

        return default;
    }
}
```

#### 策略使用
客户端使用哪个策略有两个确定方法：编译时静态确定和运行的时候动态确定，一般我们都是用过一些逻辑计算然后得到type，然后拿着type去获取我们的策略
```csharp
// 省略获取类别的代码
IStrategy a = NoStateObjectStrategyFactory.GetStrategy("A");
```
而编译时静态确定实际上退化成了基于接口而非编程原则
```csharp
IStrategy strategy = new ConcreteStrategyA();
strategy.AlgorithmInterface();
```

### 如何移除if-else
无状态策略对象做法：将原来代码中if-else的代码写法转换为使用字典取值的做法
包含状态的策略对象做法：使用反射来创建对象

使用反射来创建
```csharp
public class ReflectStrategyFactory
{
    private static readonly Dictionary<string, Type> _strategies = new Dictionary<string, Type>();

    static ReflectStrategyFactory()
    {
        _strategies.Add("A", typeof(ConcreteStrategyA));
        _strategies.Add("B", typeof(ConcreteStrategyB));
    }

    public static IStrategy GetStrategy(string type)
    {
        if (type.IsNullOrWhiteSpace())
            throw new ArgumentException("参数错误");

        var flag = _strategies.TryGetValue(type, out var strategiesType);
        if (!flag)
            throw new ArgumentException("参数无效");

        return Activator.CreateInstance(strategiesType) as IStrategy;
    }
}
```

## 总结
策略模式不仅仅是避免if-else分支判断逻辑，主要作用是解耦策略定义、创建和使用，控制代码的复杂度，让每个部分都不至于过于复杂、代码量过多。除此之外，对于复杂代码来说，策略模式还能够让其满足开闭原则，添加新策略的时候，最小化、集中化代码改动，减少引入bug的风险。

