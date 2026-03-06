---
title: 中介者模式
lang: zh-CN
date: 2023-08-12
publish: true
author: azrng
isOriginal: true
category:
  - 软件设计
tag:
  - 无
filename: zhongjiezhemoshi
slug: izwvwm0dbexv8giq
docsId: '116931966'
---

## 概述
中介者模式定义了一个单独的(中介)对象，来封装一组对象之间的交互。将这组对象之间的交互委派给中介对象交互，来避免对象之间的直接交互。

实现目的：为了解耦对象之间的交互，所有的参与者都只和中介进行交互。

中介者模式中有下面几个主要的角色：

- 抽象中介者(Mediator)：定义了同事对象之间交互的接口，它通常是一个接口或者抽象类，其中声明了同事对象之间交互所需要的方法。抽象中介者可以用来集中处理同事对象之间的通信，降低系统的耦合度。
- 具体中介者(ConcreteMediator)：实现抽象中介者接口，通常包含了一个集合用来存储同事对象，实现同事对象之间的协作。具体中介者需要所有具体的同事类，并从具体同事对象接收消息，向其他具体同事发送命令。
- 抽象同事类(Colleague)：定义了同事对象的接口，可以是一个抽象类或者接口，其中定义了一些公共的方法和属性。抽象同事类通常持有一个抽象中介者的引用，以便能够将自己的状态变化通知中介者，同时也可以接收中介者发送的消息。
- 具体同事类(ConcreteColleague)：实现抽象同事类的接口，是实际的参与者，每个具体同事类都需要知道它的中介者对象，并与其进行交互。具体同事类之间的通信都是通过具体中介者来实现的，它们之间不直接交互。

## 中介者对比观察者模式
相同点：
都是为了实现模块的解耦
观察者模式中的观察者和被观察者就有点类似中介模式中的“参与者”。

区别：
在观察者模式中，大多数情况一个参与者要不是观察者要不是被观察者，不会兼具多种身份，也就是说，在观察者模式的应用场景中，参与者之间的交互关系比较有条理。
而在中介者模式中，只有当参与者之间的交互关系错综复杂，维护成本很高的时候，才考虑使用中介者模式，因为中介者模式会带来一定的副作用，它有可能会产生大而复杂的上帝类。并且如果一个参与者的状态发现改变，其他参与者执行的操作有一定的先后关系，这个时候中介者模式就可以利用中介类，通过先后调用不同的参与者的方法，来实现顺序的控制，而观察者模式是无法实现这样的顺序要求的。

EventBus我们理解为是观察者模式实现的框架，它是不包含具体业务的，而且bus不会随着业务的复杂而改变，所以属于观察者。单纯的消息通知。
中介者需要处理具体的业务逻辑。

## 操作

### 简单操作
创建抽象中介者接口Mediator1，该接口声明了一个方法Send用于发送消息
```csharp
/// <summary>
/// 抽象中介者
/// </summary>
public interface Mediator1
{
    /// <summary>
    /// 发送消息给具体参与者
    /// </summary>
    /// <param name="message">消息内容</param>
    /// <param name="colleague">参与者</param>
    void Send(string message, Colleague colleague);
}
```

创建抽象同事类Colleague类，该类声明了一个中介者对象，用于和其他同事类进行交互
```csharp
/// <summary>
/// 抽象同事角色
/// </summary>
public abstract class Colleague
{
    /// <summary>
    /// 声明中介者对象，用于与其他同事类交互
    /// </summary>
    protected Mediator1 _mediator1;

    public Colleague(Mediator1 mediator1)
    {
        _mediator1 = mediator1;
    }

    /// <summary>
    /// 发送消息
    /// </summary>
    /// <param name="message"></param>
    public abstract void Publish(string message);

    /// <summary>
    /// 接收消息
    /// </summary>
    /// <param name="message"></param>
    public abstract void ReceiveMessage(string message);
}
```

创建具体的同事类ColleagueA和ColleagueB，它们实现了抽象同事类Colleague，并实现了发送消息和接收消息的方法
```csharp
/// <summary>
/// 具体的同事类a
/// </summary>
public class ColleagueA : Colleague
{
    public ColleagueA(Mediator1 mediator) : base(mediator)
    {
    }

    public override void Publish(string message)
    {
        Console.WriteLine($"A发送消息{message}");
        _mediator1.Send(message, this);
    }

    public override void ReceiveMessage(string message)
    {
        Console.WriteLine($"A接收到消息{message}");
    }
}

/// <summary>
/// 具体同事类b
/// </summary>
public class ColleagueB : Colleague
{
    public ColleagueB(Mediator1 mediator) : base(mediator)
    {
    }

    public override void Publish(string message)
    {
        Console.WriteLine($"B发送消息{message}");
        _mediator1.Send(message, this);
    }

    public override void ReceiveMessage(string message)
    {
        Console.WriteLine($"B接收到消息{message}");
    }
}
```

具体中介者类ConcreteMediator，该类实现了抽象中介者类Mediator1，并维护了一组同事类对象
```csharp
public class ConcreteMediator : Mediator1
{
    private Colleague A { get; set; }
    private Colleague B { get; set; }

    public void Send(string message, Colleague colleague)
    {
        if (colleague.GetType() == typeof(ColleagueA))
        {
            B.ReceiveMessage(message);
        }
        else
        {
            A.ReceiveMessage(message);
        }
    }

    /// <summary>
    /// 设置同事类
    /// </summary>
    /// <param name="colleague"></param>
    /// <param name="colleague1"></param>
    public void SetColleague(Colleague colleague, Colleague colleague1)
    {
        A = colleague;
        B = colleague1;
    }
}
```

最后调用的示例是这样子的
```csharp
// 创建一个中介者对象
var mediator = new ConcreteMediator();

// 创建两个同事类 并且将他们分别分配中介者对象
var a = new ColleagueA(mediator);
var b = new ColleagueB(mediator);

// 将需要通过中介者交互的类放入中介者
mediator.SetColleague(a, b);

// 对象的同事类去发送消息
a.Publish("你好");
b.Publish("我很好，谢谢");

// 输出结果如下
//A发送消息你好
//B接收到消息你好
//B发送消息我很好，谢谢
//A接收到消息我很好，谢谢
```
这这个例子中ConcreteMediator充当中介者角色，ColleagueA和ColleagueB充当同事类的角色，当ColleagueA发送消息的时候，ConcreteMediator将消息转发给ColleagueB，ColleagueB将接收到消息并将消息打印在控制台上，当ColleagueB发送消息的时候，同理，最后ColleagueA将接收到消息并打印在控制台上，这样子ColleagueA和ColleagueB就不需要直接进行交互，而是通过ConcreteMediator中介者类来协调他们之间的通信。


## 总结
轻易不使用，除非两个类之间的交互关系错综复杂，维护成本高时候才使用，通过引入中介的这个中间层，实现将一组对象之间的交互关系从多对多转换为一对多。原来一个对象要跟n个对象交互，现在只需要和一个中介对象进行交互，从而最小化对象之间的交互关系，降低代码复杂度，提高代码的可读性和可维护性。
