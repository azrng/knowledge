---
title: 职责链模式
lang: zh-CN
date: 2023-02-14
publish: true
author: azrng
isOriginal: true
category:
  - 软件设计
tag:
  - 无
filename: zhizelianmoshi
slug: rexbvi563wt8k8k9
docsId: '111752863'
---

## 概述
职责链模式的因为是Chain Of Responsibility Design Pattern，翻译为中文就是：将请求的发送和接收解耦，让多个接收对象都有机会处理这个请求。将这个请求对象串成一条链，并沿着这条链传递这个氢气，直到链上的某个接收对喜感能够处理它为之。

通俗说就是，多个处理的方法依次处理同一个请求，处理完再传递给下一个，此次类推，形成一个链条，链条上每个处理器各自承担各自的处理职责，所以叫做职责链模式。在实际开发的过程中，也存在对这个模式的变体，那就是请求不会中途终止传递，而是会被所有的处理器都处理一遍。

## 操作
常用的两个实现：使用链表来存储处理器，另一种是使用数组来存储处理器，后面一种实现方式更加简单。

### 可以处理请求就不往下传递

#### 实现方式一
定义所有处理器类的抽象父类
```csharp
public abstract class Handler1
{
    protected Handler1? Successor;

    public void SetSuccessor(Handler1? successor)
    {
        this.Successor = successor;
    }

    public abstract void Handle();
}
```
具体的处理器类继承父类并实现Handle方法
```csharp
public class Handler1A : Handler1
{
    public override void Handle()
    {
        Console.WriteLine("开始处理HandlerA");
        var handled = false;
        // 业务逻辑处理 然后发现当前处理不了该请求，继续往下传递
        if (!handled && Successor is not null)
        {
            Successor.Handle();
        }

        Console.WriteLine("处理结束HandlerA");
    }
}

public class Handler1B : Handler1
{
    public override void Handle()
    {
        Console.WriteLine("开始处理HandlerB");
        var handled = false;
        // 业务逻辑处理，发现不可以处理该请求，所以就继续往下传递 
        if (!handled && Successor is not null)
        {
            Successor.Handle();
        }

        Console.WriteLine("开始处理HandlerB");
    }
}
```
然后闯将处理器链HandlerChain1，从数据结构的角度看，它是一个记录的链头和链尾的一个链表，记录链尾是为了方便添加处理器。
```csharp
public class HandlerChain1
{
    /// <summary>
    /// 处理器链头
    /// </summary>
    private Handler1? head;

    /// <summary>
    /// 处理器链尾
    /// </summary>
    private Handler1? tail;

    public void AddHandler(Handler1? handler)
    {
        // 将这个处理器类的下一个处理设置为null
        handler.SetSuccessor(null);
        if (head is null)
        {
            head = handler;
            tail = handler;
            return;
        }

        tail.SetSuccessor(handler);
        tail = handler;
    }

    public void Handle()
    {
        if (head is not null)
        {
            head.Handle();
        }
    }
}
```
上面处理器类的Handle函数，不仅包含自己的业务逻辑，还包含了下一个处理器的调用，也就是Successor.Handle()，为了防止使用者在编写处理器类的时候忘了调用Successor.Handle()，所以可以使用模板方法将这些逻辑剥离到抽象父类中，也就是下面的方法
```csharp
/// <summary>
/// 所有处理器类的抽象父类  使用模板模式抽离逻辑到抽象父类
/// </summary>
public abstract class Handler1_2
{
    private Handler1_2? _successor;

    public void SetSuccessor(Handler1_2? successor)
    {
        this._successor = successor;
    }

    /// <summary>
    /// 将_successor.Handle的逻辑从具体的处理器类中剥离出来，放到抽象父类中，
    /// 这样子具体的处理器类就只需要实现自己的业务逻辑就可以了
    /// </summary>
    public void Handle()
    {
        var handled = DoHandle();
        if (_successor != null && !handled)
        {
            _successor.Handle();
        }
    }

    protected abstract bool DoHandle();
}
```
那么具体的实现类就可以这么写
```csharp
public class Handler1A1_2 : Handler1_2
{
    protected override bool DoHandle()
    {
        Console.WriteLine("开始处理HandlerA");
        var handled = false;
        // 业务逻辑处理 判断是否可以处理
        return handled;
    }
}

public class Handler1B1_2 : Handler1_2
{
    protected override bool DoHandle()
    {
        Console.WriteLine("开始处理HandlerB");
        var handled = false;
        // 业务逻辑处理 判断是否可以处理
        return handled;
    }
}
```
> 但是缺点就是没法对处理结束的内容在做处理了，直接处理完直接返回了

HandlerChain的方法保持不变
```csharp
public class HandlerChain1_2
{
    private Handler1_2? head;
    private Handler1_2? tail;

    public void AddHandler(Handler1_2? handler)
    {
        handler.SetSuccessor(null);
        if (head is null)
        {
            head = handler;
            tail = handler;
            return;
        }

        tail.SetSuccessor(handler);
        tail = handler;
    }

    public void Handle()
    {
        head?.Handle();
    }
}
```
调用的方法如下
```csharp
var chain = new HandlerChain1_2();
chain.AddHandler(new Handler1A1_2());
chain.AddHandler(new Handler1B1_2());
chain.Handle();
```

#### 实现方式二
这种方法采用数组而非链表俩保存所有的处理器，并且需要在HandlerChain2的Handle中依次调用每个处理器的handle函数
```csharp
public interface IHandler2
{
    bool Handler();
}

public class Handler2A : IHandler2
{
    public bool Handler()
    {
        var handled = false;
        // 业务逻辑计算
        Console.WriteLine("我是Handler2A");
        return handled;
    }
}

public class Handler2B : IHandler2
{
    public bool Handler()
    {
        var handled = false;
        // 业务逻辑计算
        Console.WriteLine("我是Handler2B");
        return handled;
    }
}

public class HandlerChain2
{
    private readonly List<IHandler2> _handler2S = new List<IHandler2>();

    public void AddHandler(IHandler2 handler2)
    {
        _handler2S.Add(handler2);
    }

    public void Handle()
    {
        foreach (var handler in _handler2S)
        {
            var handled = handler.Handler();
            if (handled)
                break;
        }
    }
}
```
调用方法如下
```csharp
var chain2 = new HandlerChain2();
chain2.AddHandler(new Handler2A());
chain2.AddHandler(new Handler2B());
chain2.Handle();
```

### 每个请求都被处理
职责链的另一个情况就是，请求会被所有的处理器都处理一遍，不存在中途终止的情况，这种方式也有两个方案，链表的方式处理和数据存储的方式处理。

#### 实现方案一
```csharp
/// <summary>
/// 处理后继续往下执行
/// </summary>
public abstract class Handler3
{
    private Handler3 Successor;

    public void SetSuccessor(Handler3 successor)
    {
        Successor = successor;
    }

    public void Handle()
    {
        DoHandle();
        if (Successor is not null)
        {
            Successor.Handle();
        }
    }

    protected abstract void DoHandle();
}

public class HandlerA3 : Handler3
{
    protected override void DoHandle()
    {
        // 业务逻辑处理
        Console.WriteLine("handlerA3 业务逻辑处理");
    }
}

public class HandlerB3 : Handler3
{
    protected override void DoHandle()
    {
        // 业务逻辑处理
        Console.WriteLine("handlerB3 业务逻辑处理");
    }
}

public class HandlerChain3
{
    /// <summary>
    /// 链表头
    /// </summary>
    private Handler3 head;

    /// <summary>
    /// 链表尾
    /// </summary>
    private Handler3 tail;

    public void AddHandler(Handler3 handler3)
    {
        handler3.SetSuccessor(null);
        if (head is null)
        {
            head = handler3;
            tail = handler3;
        }

        // 将当前处理器类给链表尾的下一个处理
        tail.SetSuccessor(handler3);
        // 将当前处理器类赋值给链表尾
        tail = handler3;
    }

    public void Handle()
    {
        if (head != null)
        {
            head.Handle();
        }
    }
}
```
调用方法
```csharp
var chain3 = new HandlerChain3();
chain3.AddHandler(new HandlerA3());
chain3.AddHandler(new HandlerB3());
chain3.Handle();
```

#### 实现方案二
数组的形式去处理
```csharp
/// <summary>
/// 数组的形式
/// </summary>
public interface IHandler4
{
    bool Handler();
}

public class Handler4A : IHandler4
{
    public bool Handler()
    {
        var handled = false;
        // 业务逻辑计算
        Console.WriteLine("我是Handler4A");
        return handled;
    }
}

public class Handler4B : IHandler4
{
    public bool Handler()
    {
        var handled = false;
        // 业务逻辑计算
        Console.WriteLine("我是Handler4B");
        return handled;
    }
}

public class HandlerChain4
{
    private readonly List<IHandler4> _handler4 = new List<IHandler4>();

    public void AddHandler(IHandler4 handler)
    {
        _handler4.Add(handler);
    }

    public void Handle()
    {
        foreach (var handler in _handler4)
        {
            handler.Handler();
        }
    }
}
```
调用方法
```csharp
var chain4 = new HandlerChain4();
chain4.AddHandler(new Handler4A());
chain4.AddHandler(new Handler4B());
chain4.Handle();
```

## 使用场景
利用职责链模式来进行敏感词过滤。

将大块代码逻辑拆分成函数，将大类拆分成小类，是应对代码复杂性常用的方法。应用职责链模式，将各个敏感词过滤函数继续拆分出来，设计成独立的类，进一步简化让每个类中的代码不会过多。

常用在框架开发中，用来实现框架的过滤器、拦截器功能，让框架的使用者在不需要修改框架源码的情况下，添加新的过滤拦截功能，也体现了之前讲到的对扩展开发、对修改关闭的设计原则。
比如.Net中的过滤器、中间件的方案都属于职责链模式。
