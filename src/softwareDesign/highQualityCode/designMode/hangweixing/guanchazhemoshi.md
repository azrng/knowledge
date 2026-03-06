---
title: 观察者模式
lang: zh-CN
date: 2023-01-26
publish: true
author: azrng
isOriginal: true
category:
  - 软件设计
tag:
  - 无
filename: guanchazhemoshi
slug: tihid7d1et5v5vcu
docsId: '111752610'
---

## 概述
观察者模式是一个比较抽象的模式，根据场景的不同，观察者模式会对应不同的代码实现方式：同步阻塞的实现方式、异步非阻塞的实现方式、进程内的实现方式、跨进程的实现方式。

同步阻塞是最经典的实现方式，主要的为了代码解耦；异步非阻塞除了能实现代码解耦之外还能够提高代码的执行效率；进程间的观察者模式解耦更加彻底，一般是基于消息队列来实现，用来实现不同进程间的观察者和被观察者之间的交互。

观察者模式也叫做发布订阅模式：在对象之间定义一个一对多的依赖，当一个状态改变的时候，所有依赖的对象都会自动收到通知。
被观察者：被依赖的对象
观察者：依赖的对象

## 使用场景
应用非常广泛，小到代码层次的解耦，大到架构层面的系统解耦，再或者一些产品的设计思路，都有这种模式的影子，比如邮件订阅、Rss Feeds，本质上都是观察者模式。

比如用户订单支付成功后需要发短信通知以及需要修改订单状态，如果直接在支付成功里面写多件事情，那么就违反单一职责原则，但是如果这里后续需求会频繁变动比如增加一个通知类型等，这个时候频繁修改就违背开闭原则，并且后续要执行的操作越来越多，那么这个方法的逻辑就越来越复杂，会影响更大哦代码的可读性和可维护性，这个时候观察者模式就能派上用场了。

## 示例

### 模板代码方法
```csharp
public interface Subject
{
    /// <summary>
    /// 注册观察者
    /// </summary>
    /// <param name="observer"></param>
    void RegisterObserver(Observer observer);

    /// <summary>
    /// 移除观察者
    /// </summary>
    /// <param name="observer"></param>
    void RemoveObserver(Observer observer);

    /// <summary>
    /// 通知观察者
    /// </summary>
    /// <param name="message"></param>
    void NotifyObservers(Message message);
}

/// <summary>
/// 观察者模式实现
/// </summary>
public class ConcreteSubject : Subject
{
    private List<Observer> Observers { get; set; } = new List<Observer>();

    public void RegisterObserver(Observer observer)
    {
        Observers.Add(observer);
    }

    public void RemoveObserver(Observer observer)
    {
        Observers.Remove(observer);
    }

    public void NotifyObservers(Message message)
    {
        foreach (var observer in Observers)
        {
            observer.Update(message);
        }
    }
}

/// <summary>
/// 第一个观察者
/// </summary>
public class ConcreteObserverOne : Observer
{
    public void Update(Message message)
    {
        Console.WriteLine("ConcreteObserverOne 被通知");
    }
}

/// <summary>
/// 第二个观察者
/// </summary>
public class ConcreteObserverTwo : Observer
{
    public void Update(Message message)
    {
        Console.WriteLine("ConcreteObserverTwo 被通知");
    }
}

/// <summary>
/// 观察者接口
/// </summary>
public interface Observer
{
    void Update(Message message);
}

public class Message
{
    public string Content { get; set; }
}
```
使用方法
```csharp
public void Main()
{
    // 常见的观察者模式实现方式(观察者中的“模板代码”)
    var subject = new ConcreteSubject();
    subject.RegisterObserver(new ConcreteObserverOne());
    subject.RegisterObserver(new ConcreteObserverTwo());
    subject.NotifyObservers(new Message());
}
```

### 同步阻塞示例
观察者和被观察的代码在同一个线程内执行，被观察者一直阻塞，直到所有的观察者代码都执行完成之后，才执行后续的代码，这就是同步阻塞示例，比如下面的例子当注册成功后循环调用RegObservers的HandleRegSuccess方法，等到执行完成后才返回给客户端结果
```csharp
/// <summary>
/// 用户控制器
/// </summary>
public class UserController
{
    private List<RegObserver> RegObservers = new List<RegObserver>();

    public void SetRegObservers(List<RegObserver> observers)
    {
        RegObservers.AddRange(observers);
    }

    /// <summary>
    /// 注册接口（注册成功后发送邮件和短信通知）
    /// </summary>
    /// <param name="userName"></param>
    /// <returns></returns>
    public long Register(string userName)
    {
        // 校验以及注册用户
        var userId = 123456l;

        // 注册成功后发送邮件和短信
        foreach (var observer in RegObservers)
        {
            observer.HandleRegSuccess(userId);
        }

        return userId;
    }
}

public interface RegObserver
{
    /// <summary>
    /// 注册成功
    /// </summary>
    /// <param name="userId"></param>
    void HandleRegSuccess(long userId);
}

public class SendEmailObserver : RegObserver
{
    public void HandleRegSuccess(long userId)
    {
        Console.WriteLine($"发送邮件给用户：{userId}");
    }
}

public class SendSmsObserver : RegObserver
{
    public void HandleRegSuccess(long userId)
    {
        Console.WriteLine($"发送短信给用户：{userId}");
    }
}
```
如果这个接口是一个调用比较频繁的接口，对性能比较敏感，希望接口的响应时间尽可能短，那我们可以将同步阻塞的方式改为异步非阻塞的实现方案，来减少响应的时间，也就是说我们最后启用一个新的线程来执行观察者函数。

### 异步非阻塞
简单一点就是在每个HandleRegSuccess函数中创建一个新的线程执行代码，优雅一点的方案就是去使用EventBus方案来处理。

在同步阻塞的方案基础上使用线程池来开启线程处理
```csharp
/// <summary>
/// 用户控制器
/// </summary>
public class UserController2
{
    private List<RegObserver> RegObservers = new List<RegObserver>();

    public void SetRegObservers(List<RegObserver> observers)
    {
        RegObservers.AddRange(observers);
    }

    /// <summary>
    /// 注册接口（注册成功后发送邮件和短信通知）
    /// </summary>
    /// <param name="userName"></param>
    /// <returns></returns>
    public long Register(string userName)
    {
        // 校验以及注册用户
        var userId = 123456l;

        // 注册成功后发送邮件和短信
        foreach (var observer in RegObservers)
        {
            Task.Run(() =>
            {
                observer.HandleRegSuccess(userId);
            });
        }

        Console.WriteLine("注册完成");

        return userId;
    }
}
```

### 跨进程实现方案
上面的例子不论是同步阻塞还是异步非阻塞方案都是在进程内执行的，在不是一个进程内处理的话就需要使用API接口、RPC接口或者消息队列来实现了。

但是缺点就是需要引入一个新的系统(消息队列)，增加了维护成本，不过好处也明显，原来的方案中，观察者需要注册到观察者中，被观察者需要依次遍历观察者来发送消息，基于消息队列的实现方案将被观察者和观察者解耦更加彻底，被观察者完全不感知观察者。被观察者只管发送消息到消息队列中，观察者只管从消息队列中读取消息来执行对应的逻辑。

通过时间总线(EventBus)的框架可以非常容易在自己的业务场景中实现观察者模式，不需要从零开始开发，不仅仅支持异步非阻塞发模式也支持同步阻塞模式。

## 对比发布订阅和生产者消费者
发布订阅是一对多关系，订阅者之间没有竞争关系，
生产消费是多对多的关系，消费者之间存在竞争关系

## 总结
观察者模式就是将观察者和被观察者代码解耦。
