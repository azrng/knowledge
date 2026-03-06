---
title: 装饰器模式
lang: zh-CN
date: 2022-12-25
publish: true
author: azrng
isOriginal: true
category:
  - 软件设计
tag:
  - 无
filename: zhuangshiqimoshi
slug: my1v4y
docsId: '89143762'
---

## 概述
装饰器模式主要解决继承关系过于复杂的问题，通过组合来替代继承，他的主要作用是给原始类添加增强功能。还有一个特点是可以对原始类嵌套使用多个装饰器，为了满足这个应用场景，在设计的时候，装饰器类需要跟原始类相同的抽象类或者接口。
> 装饰器的类是对原有功能的增强，代理模式中，代理类附加的功能是和原始类无关的。


## 使用场景

- 需要扩展一个类的功能，或者未一个类增加附加的功能。
- 需要动态地给一个对象增加功能，这些功能可以再动态地撤销。
- 需要增加由一些基本功能组合而产生的非常大量的功能，从而使得不使用继承。

## 操作
还是以记录日志的例子来说明，现在要求我们开发记录日志的组件，除了要支持数据库记录DataBaseLog和文本记录TxtFileLog两种方式歪，我们还需要在不同的应用环境中增加一些额外的功能，比如我们要记录日志信息的错误严重级别、需要记录日志信息的优先级别，还有日志信息的扩展属性等功能。在不考虑设计模式的情况下，解决问题的方案很简单，可以通过继承机制来实现，日志类结构图如下
![image.png](/common/1660142728011-577d6943-afb5-4234-aec9-03e167a2a3f6.png)
实现代码如下
```csharp
/// <summary>
/// 记录日志抽象类
/// </summary>
public abstract class Log
{
    public abstract void Write(string log);
}

public class DataBaseLog : Log
{
    public override void Write(string log)
    {
        Console.WriteLine("记录日志到数据库");
    }
}

public class TextFileLog : Log
{
    public override void Write(string log)
    {
        Console.WriteLine("记录日志到文本文件");
    }
}
```
需要记录日志信息的错误严重级别和记录日志信息的优先级别功能，只需要原来的子类DataBaseLog和TextFileLog的基础上再增加子类即可，同时需要引进两个新的接口IError和IPority，类结构图如下
![61b2baf8292936a51b6250e41b4c2cc6_Decorator_04.jpg](/common/1660143542335-83585aa0-cc53-4321-9cd3-f2a4687074c5.jpeg)
实现代码如下
```csharp
public interface IError
{
    void SetError();
}

public interface IPriority
{
    void SetPriority();
}

public class DBErrorLog : DataBaseLog, IError
{
    public override void Write(string log)
    {
        SetError();
        base.Write(log);
    }

    public void SetError()
    {
        // 记录错误严重级别
    }
}

public class DbPriorityLog : DataBaseLog, IPriority
{
    public override void Write(string log)
    {
        SetPriority();
        base.Write(log);
    }

    public void SetPriority()
    {
        // 记录优先级别
    }
}

public class TextFileErrotLog : TextFileLog, IError
{
    public override void Write(string log)
    {
        SetError();
        base.Write(log);
    }

    public void SetError()
    {
        // 记录错误严重级别
    }
}

public class TextFilePriority : TextFileLog, IPriority
{
    public override void Write(string log)
    {
        SetPriority();
        base.Write(log);
    }

    public void SetPriority()
    {
        // 记录优先级别
    }
}
```
这个时候我们可以看到，需要增加相应的功能，直接使用这些子类就可以了，我们采用类的继承方式来解决了对象功能的扩展问题，这种方式可以达到我们预期的目的，但是也带来了一系列问题，首先我们之前的例子只是一种功能的扩展，如果我们既需要记录错误严重级别，又需要记录优先级，子类就需要进行接口的多重继承，这会违反类的单一职责原则，比如下图中蓝色的区域
![e1093e45b4357d9eb110df5279d17e4e_Decorator_05.jpg](/common/1660144124091-3bfa7059-2bdd-457c-8e24-e406a11c44a9.jpeg)
实现代码
```csharp
//实现接口的多重继承
public class DBEPLog : DataBaseLog, IError, IPriority
{
    public override void Write(string log)
    {
        SetError();
        SetPriority();
        base.Write(log);
    }

    public void SetError()
    {
        throw new NotImplementedException();
    }

    public void SetPriority()
    {
        throw new NotImplementedException();
    }
}

public class EFEPLog : TextFileLog, IError, IPriority
{
    public override void Write(string log)
    {
        SetError();
        SetPriority();
        base.Write(log);
    }

    public void SetError()
    {
        throw new NotImplementedException();
    }

    public void SetPriority()
    {
        throw new NotImplementedException();
    }
}
```
并且随着以后的扩展功能增多，子类会迅速膨胀，子类的出来就是DataBaseLog和TextFileLog两个子类与新接口的一种排列组合关系，所以类结构会变得很复杂并且难以维护，这种方式的扩展是一种静态扩展的方式，并没有能够真正实现扩展功能的动态添加，客户程序不能选择添加扩展功能的方式和时机。

下面就是装饰器模式出场的时候了，解决方案就是把log对象嵌入另一个对象中，由这个对象来扩展功能。首先我们要定义一个抽象的包装类LogWrapper，让他继承于Log类，结构图如下：
![0658c951722f0dafc405b45b2e786b5e_Decorator_061.jpg](/common/1660144556982-094e5cdb-6b12-4e76-9196-b2d1b83128cd.jpeg)
实现代码如下：
```csharp
public class LogWrapper : Log
{
    private readonly Log _log;
    public LogWrapper(Log log)
    {
        _log=log;
    }

    public override void Write(string log)
    {
        _log.Write(log);
    }
}
```
现在对于每个扩展的功能，都增加一个包装类的子类，让他们来实现具体的扩展功能，如图中绿色的区域
![938ec96b20cb93ab24b728855e5b11ec_Decorator_071.jpg](/common/1660144938803-6922236d-5524-43ad-b022-8e3a8789bb48.jpeg)
实现代码如下
```csharp
public class LogErrorWrapper : LogWrapper
{
    public LogErrorWrapper(Log log) : base(log)
    {
    }

    public override void Write(string log)
    {
        SetError();

        base.Write(log);
    }

    public void SetError()
    {
        Console.WriteLine("记录错误严重级别");
    }
}

public class LogPriorityWrapper : LogWrapper
{
    public LogPriorityWrapper(Log log) : base(log)
    {
    }

    public override void Write(string log)
    {
        SetPriority();

        base.Write(log);
    }

    public void SetPriority()
    {
        Console.WriteLine("记录优先级别");
    }
}
```
这里LogErrorWrapper和LogPriorityWrapper类真正实现了对错误严重界别和优先级别的功能扩展，我们先看一下客户端如何调用它。
```csharp
public void Main()
{
    //日志记录的示例
    Log log = new DataBaseLog();

    LogWrapper lew1 = new LogErrorWrapper(log);
    //扩展记录错误严重类别
    lew1.Write("log message");

    Console.WriteLine("-----");

    LogWrapper lpw1 = new LogPriorityWrapper(log);
    //扩展记录优先级别
    lpw1.Write("log message");

    Console.WriteLine("----");

    LogWrapper lew2 = new LogErrorWrapper(log);
    LogWrapper logPriority = new LogPriorityWrapper(lew2);
    //同时扩展了错误严重级别和优先级别
    logPriority.Write("log message");
}

-- 输出结果
记录错误严重级别
记录日志到数据库
-----
记录优先级别
记录日志到数据库
----
记录优先级别
记录错误严重级别
记录日志到数据库
```
注意在上面程序中的第三段装饰才真正体现出了Decorator模式的精妙所在，这里总共包装了两次：第一次对log对象进行错误严重级别的装饰，变成了lew2对象，第二次再对lew2对象进行装饰，于是变成了lpw2对象，此时的lpw2对象同时扩展了错误严重级别和优先级别的功能。也就是说我们需要哪些功能，就可以这样继续包装下去。到这里也许有人会说LogPriorityWrapper类的构造函数接收的是一个Log对象，为什么这里可以传入LogErrorWrapper对象呢？通过类结构图就能发现，LogErrorWrapper类其实也是Log类的一个子类。

我们分析一下这样会带来什么好处？首先对于扩展功能已经实现了真正的动态增加，只在需要某种功能的时候才进行包装；其次，如果再出现一种新的扩展功能，只需要增加一个对应的包装子类（注意：这一点任何时候都是避免不了的），而无需再进行很多子类的继承，不会出现子类的膨胀，同时Decorator模式也很好的符合了面向对象设计原则中的“优先使用对象组合而非继承”和“开放-封闭”原则。

## 总结
装饰器模式采用对象组合而非继承的手法，实现了在运行时动态扩展对象的功能，而且根据需要扩展多个功能，避免了单独使用继承而带来的”灵活性差“和”多子类衍生问题“。

在装饰模式中装饰的顺序很重要，比如加密数据或过滤词汇都可以是数据持久化前的装饰功能，但是如果先加密了数据在进行数据过滤就会有问题，最理想的情况就是保证装饰类之间彼此独立，这样子就可以任意的顺序进行组装了。

## 资料
装饰器模式：[https://www.cnblogs.com/Terrylee/archive/2006/03/01/340592.html](https://www.cnblogs.com/Terrylee/archive/2006/03/01/340592.html)
