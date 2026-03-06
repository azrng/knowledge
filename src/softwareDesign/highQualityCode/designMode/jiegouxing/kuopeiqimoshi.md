---
title: 适配器模式
lang: zh-CN
date: 2022-08-13
publish: true
author: azrng
isOriginal: true
category:
  - 软件设计
tag:
  - 无
filename: kuopeiqimoshi
slug: zemhno
docsId: '89383053'
---

## 概述
顾名思义，这个模式就是用来做适配的，它用来将不兼容的接口转换为可以兼容的接口，让原本由于接口不兼容而不能一起工作的类可以一起工作。

## 使用场景
当“现存的对象”在新的环境中，不满足现有的使用要求，那么就需要使用适配器模式来将“现存的对象”适配新的使用需求。

## 操作
适配器模式有两种实现方式：类适配器和对象适配器。

### 类适配器
类适配器使用继承关系来实现。
示例一：在工作中，我们需要调用其他模块的接口，ITarget表示我们需要的接口格式，Adaptee表示第三方/同事提供的接口格式，而Adaptor将Adaptee转换为符合我们ITarget格式的接口。
```csharp
/// <summary>
/// 我们需要的接口格式
/// </summary>
public interface ITarget
{
    void F1();

    void F2();

    void Fc();
}

/// <summary>
/// 同事/第三方提供的接口
/// </summary>
public class Adaptee
{
    public void Fa()
    {
        Console.WriteLine("fa");
    }

    public void Fb()
    {
        Console.WriteLine("fb");
    }

    public void Fc()
    {
        Console.WriteLine("fc");
    }
}

/// <summary>
/// 适配器
/// </summary>
public class Adaptor : Adaptee, ITarget
{
    public void F1()
    {
        Fa();
    }

    public void F2()
    {
        Fb();
    }

    //这里fc不需要实现，直接继承自Adaptee
}
```

示例二：当前我们使用了一个开源组件来记录日志，该组件支持数据库日志记录DatabaseLog和文本文件记录FileLog两种方式，提供的写日志方法名字叫做Write()
```csharp
/// <summary>
/// 老的记录日志方法
/// </summary>
public interface ILogTargetOld
{
    void Write();
}
```
然后后来组件升级了，写日志的方法名字改为了WriteLog
```csharp
/// <summary>
/// 日志适配器
/// </summary>
public abstract class LogAdapter
{
    public abstract void WriteLog();
}

//新的日志记录方式
public class DatabaseLog : LogAdapter
{
    public override void WriteLog()
    {
        Console.WriteLine("新的数据库日志记录方式");
    }
}

//新的日志记录方式
public class FileLog : LogAdapter
{
    public override void WriteLog()
    {
        Console.WriteLine("新的文本文件日志记录方式");
    }
}
```
这个时候因为我们很多地方已经使用了，在不考虑去修改的情况下，我们就只能去使用适配器模式去兼容新版本组件写入的方法。
```csharp
public class DatabaseLogAdapter : DatabaseLog, ILogTargetOld
{
    public void Write()
    {
        this.WriteLog();
    }
}

public class FileLogAdapter : FileLog, ILogTargetOld
{
    public void Write()
    {
        this.WriteLog();
    }
}
```
客户端调用方式
```csharp
//类对象模式
ILogTargetOld log = new DatabaseLogAdapter();
log.Write();

ILogTargetOld log2 = new FileLogAdapter();
log2.Write();
```

### 对象适配器
对象适配器使用组合关系来实现。

示例一：在工作中，我们需要调用其他模块的接口，ITarget表示我们需要的接口格式，Adaptee表示第三方/同事提供的接口格式，而Adaptor将Adaptee转换为符合我们ITarget格式的接口。
```csharp
/// <summary>
/// 我们需要的接口格式
/// </summary>
public interface ITarget
{
    void F1();

    void F2();

    void Fc();
}

public class Adaptee2
{
    public void Fa()
    {
        Console.WriteLine("fa");
    }

    public void Fb()
    {
        Console.WriteLine("fb");
    }

    public void Fc()
    {
        Console.WriteLine("fc");
    }
}

public class Adaptor2 : ITarget
{
    private readonly Adaptee2 _adaptee2;
    public Adaptor2(Adaptee2 adaptee2)
    {
        _adaptee2=adaptee2;
    }

    public void F1()
    {
        _adaptee2.Fa();
    }

    public void F2()
    {
        _adaptee2.Fb();
    }

    public void Fc()
    {
        _adaptee2.Fc();
    }
}
```
针对这两种实现方式，在工作中使用哪一种，有两个评判规则，一个是接口的个数，另一个是需要的接口和提供方接口的锲合度。
如果接口个数不多，那么两个方法都可以。
如果需要适配的接口多，并且需要的格式和提供的格式大部分都相同，那么推荐使用类适配器，因为适配器可以复用父类的接口。
如果提供的接口很多，并且想要的格式和我们的大部分都不相同，那么推荐使用对象适配器，因为组合结构相比较继承更加灵活。

示例二：下面说一下上面类适配器中示例二的例子对应的对象适配器的写法
```csharp
public class LogAdapter2 : ILogTargetOld
{
    private readonly LogAdapter _adapter;

    public LogAdapter2(LogAdapter adapter)
    {
        _adapter=adapter;
    }

    public void Write()
    {
        _adapter.WriteLog();
    }
}
```
客户端使用
```csharp
//对象适配器
ILogTargetOld log3 = new LogAdapter2(new DatabaseLog());
log3.Write();
```

## 总结
适配器可以看做是一种“补偿模式”，用来补救设计上的缺陷。使用该模式属于无奈之举，如果设计的时候，我们就可以协调规避接口不兼容的问题，那么这种模式都没有应用的机会。
