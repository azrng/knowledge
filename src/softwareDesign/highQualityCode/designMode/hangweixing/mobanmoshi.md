---
title: 模板模式
lang: zh-CN
date: 2023-02-01
publish: true
author: azrng
isOriginal: true
category:
  - 软件设计
tag:
  - 无
filename: mobanmoshi
slug: uwp3lz5c0up5hhd4
docsId: '111752832'
---

## 概述
模板模式，全称叫做模板方法设计模式，中文意思就是模板方法模式在一个方法中定义一个算法骨架(广义上的“业务逻辑”)，并将某些步骤推迟到子类中实现。模板方法模式可以让子类在不改变算法整体结构的情况下，重新定义算法中某些步骤。

模板方法建议将算法分解为一系列的步骤，然后将这些步骤改写为方法，最后在“模板方法”中依次调用这些方法，步骤可能是抽象的也可能有一些默认的实现，共有的逻辑编写为默认的实现，将不同的逻辑写为抽象，让子类来实现。

## 使用场景

- 当你希望扩展某一个特定业务逻辑步骤的时候，而不是整个逻辑的时候，可使用模板方法模式
   - 将整个逻辑转换为一系列独立的步骤，以便于子类能够对其进行扩展，同时还让基类中所定义的结构保持一致。
- 当多个类的逻辑除一些细微不同之外几乎完全一样的时候，可以使用模板方法模式，但是缺点是如果这个逻辑发生变化的时候，就有可能需要修改所有的类。
   - 将逻辑转换为模板方法的时候，可以将相似的代码提取到基类中来去除重复的代码，子类中保存着各个类不同的代码。

当你有一个方法支持处理a文档类型，后来又支持了b文档类型，然后又支持了c文档类型，代码中包含许多条件语句，根据不同的类型选择合适的处理过程，这个时候你就应该将相同的代码抽离出来。
将方法中相同的代码抽离到父类中，而在子类重写父类中的抽象方法(不同的代码)。

## 作用

### 复用
一个类继承父类，然后通用的方法保持不变给子类，将可变的部分留给子类来实现。

比如下面的抽象类，将可变的交给子类来实现，所有子类还可以复用父类中模板方法定义的流程代码
```csharp
/// <summary>
/// 将公有代码抽取到基类中
/// </summary>
public abstract class AbstractClass
{
    /// <summary>
    /// 模板方法，不要把模版方法定义为Virtual或abstract方法，避免被子类重写，防止更改流程的执行顺序
    /// </summary>
    public void Run()
    {
        Method0();
        Method1();
        Method2();
    }

    private void Method0()
    {
        // 避免子类重写它
        Console.WriteLine("进行一些公共的逻辑处理代码");
    }

    // 定义抽象方法是为了强迫子类去实现
    protected abstract void Method1();
    protected abstract void Method2();
}

/// <summary>
/// 子类实现
/// </summary>
public class ConcreteClass1 : AbstractClass
{
    protected override void Method1()
    {
        // 实现父类Method1方法
        Console.WriteLine("处理i等于1的时候逻辑 Method1");
    }

    // 实现父类Method2方法
    protected override void Method2()
    {
        Console.WriteLine("处理i等于1的时候逻辑 Method2");
    }
}
```

### 扩展
扩展指的不是代码的扩展性，而是指框架的扩展性。框架通过模板模式提供的功能扩展点，让框架用户可以在不修改框架源代码的情况下，基于扩展点定制化框架的功能。

## 对比回调
回调也能起到和模板模式相同的作用。
回调是什么？是一种双向调用的关系，A类注册到一个函数F到B类中，A类在调用B类P函数的时候，B类反过来调用A类注册给他的F函数，这里的F函数就是回调函数，A调用B，B反过来调用A，这种调用机制就叫做回调。
```csharp
public class AClass
{
    public void Main()
    {
        var bClass = new BClass();
        bClass.Process((str) =>
        {
            Console.WriteLine($"我是AClass中的Main  入参为：{str}");
        });
        Console.WriteLine("回调执行结束");
    }
}

public class BClass
{
    public void Process(Action<string> action)
    {
        Console.WriteLine("我是BClass");
        action.Invoke("BClass");
        Console.WriteLine("我是BClass");
    }
}
```
和模板方式模式一样都可以实现替换某一部分代码的效果。

从应用场景上看，同步回调和模板模式几乎一样，都是在一个算法骨架中，自由替换其中某个步骤，起到代码复用和扩展的目的。异步回调和模板模式有较大差别，更像是观察者模式。
从代码实现上看，回调和模板模式完全不同。回调基于组合关系来实现，把一个对象传递给另一个对象，是一种对象之间的关系，而模板模式基于继承关系来实现，子类重写父类的抽象方法，是一种类之间的关系。回调相当于模板模式会更加灵活。

## 总结
模板方法模式是一个很常用的设计模式，简单实用，继承等结构都是应用。
