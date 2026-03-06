---
title: 桥接模式
lang: zh-CN
date: 2022-12-25
publish: true
author: azrng
isOriginal: true
category:
  - 软件设计
tag:
  - 无
filename: qiaojiemoshi
slug: wyylfm
docsId: '84022372'
---

## 简述
桥接模式，也叫做桥梁模式，翻译为中文就是将抽象和实现部分，让它们可以独立变化。

这里的抽象，并非指的是抽象类或者接口，而是被抽象出来的一套“类库”
这里说的实现，也并非指的“接口的实现类”，而是跟具体的一套“类库”

## 使用场景
利用面向对象的技术来使得类型能够轻松沿着多个方向进行变化，而又不引入额外的复杂度，这就要使用桥接模式。

## 实现
 我们要开发一个通用的日志记录工具，他支持数据库记录DataBaseLog和文本记录FileLog两种方式，同时既可以运行在.Net平台上，也可以运行在Java平台上。
所以我们就把不同的日志记录方式分别作为单独的对象来对待，并且为日志记录类抽象出一个基类Log类，各种不同的日志记录方式都继承自该基类：
![image.png](/common/1659105919521-ab7fe559-73da-44ac-b90e-7d5fa781e682.png)
```csharp
public abstract class Log
{
    public abstract void Write(string log);
}

public class DatabaseLog : Log
{
    public override void Write(string log)
    {
        Console.WriteLine("写日志到数据库");
    }
}

public class TextFileLog : Log
{
    public override void Write(string log)
    {
        Console.WriteLine("写日志到文件");
    }
}
```
考虑到不同平台的日志系统，对于操作系统、写入文本文件所调用的方式可能是不一样的，为此对不同的日志记录方式，我们需要提供不同平台上的实现，对上面的类做进一步的设计得到下面的结构图：
![image.png](/common/1659105943062-d407db50-d296-437e-bc2f-7b24f3059d70.png)
```csharp
public class NDatabaseLog : DatabaseLog
{
    public override void Write(string log)
    {
        Console.WriteLine(".Net 平台写入日志到数据库");
    }
}

public class JDatabaseLog : DatabaseLog
{
    public override void Write(string log)
    {
        Console.WriteLine("Java 平台写入日志到数据库");
    }
}

public class NTextLog : TextFileLog
{
    public override void Write(string log)
    {
        Console.WriteLine(".Net 平台写入日志到文件");
    }
}

public class JTextLog : TextFileLog
{
    public override void Write(string log)
    {
        Console.WriteLine("Java 平台写入日志到文件");
    }
}
```
当前这种设计方案本身是没有任何错误的，假如我们要引入一种新的xml文件的记录方式，则上面的类结构图就会变成
![image.png](/common/1659106791343-89dd17c2-d3d9-47e5-85fb-01d5ca0be901.png)
如图蓝色所示，我们增加一个继承自Log基类的子类，而没有修改其他的类，所以也符合了开放-封闭原则。如果我们引入一种新的平台，比如我们现在开发的日志记录工具还需要支持Borland平台，此时类结构又变成了
![image.png](/common/1659106811244-db171695-4a4f-4e7a-b9d0-9dd27331df32.png)
同样我们没有修改任何东西，只是增加了两个继承于DatabaseLog和TextFile的子类，也符合开放-封闭原则。
但是它违背了单一职责原则(一个类只有一个引起它变化的原因)，这里引起log变化的原因有两个，日志记录范式的变化或者日志记录平台的变化，还有就是重复代码会很多，不同的日志记录方式在不同的平台上也会有一部分的代码是相同的，再次就是累的结构过于复杂，继承关系太多，难以维护，特别是扩展性差，如果变化沿着日志记录方式和不同的运行平台两个方向变化，我们就会看到这个类的结构会迅速的变庞大。

所以这时候就应该使用桥接模式，我们需要解耦这两个方向的变化，把他们之间的强耦合关系改为弱联系。我们把日志记录方式和不同平台上的实现分别当做两个独立的部分来对待，对于日志记录方式，类结构图仍然是：
![image.png](/common/1659107170223-f2fd846a-3fd0-475c-a000-d972262f771b.png)
我们现在引入另外一个抽象类ImpLog，它是日志记录在不同的平台的实现的基类，结构图如下：
![image.png](/common/1659107213865-0f8b4403-40f4-4319-92b2-06afba97d8f3.png)
实现代码如下：
```csharp
/// <summary>
/// 日志记录在不同平台实现的基类
/// </summary>
public abstract class ImpLog
{
    public abstract void Excute(string msg);
}

public class Nlog : ImpLog
{
    public override void Excute(string msg)
    {
        Console.WriteLine("在.Net平台的实现");
    }
}

public class Jlog : ImpLog
{
    public override void Excute(string msg)
    {
        Console.WriteLine("在java平台的实现");
    }
}
```
这个时候日志记录方式和不同的记录平台这两个类都可以独立的变化，我们需要做的工作就是将这两部分连接起来，如何连接就是我们的对象组合的方式，类结构图如下：
![image.png](/common/1659107465021-09a12b98-fc3d-4303-8422-4e2042b9a1e7.png)
实现代码如下：
```csharp
public abstract class Log
{
    protected ImpLog implementor;

    public ImpLog Implementor
    {
        set { implementor = value; }
    }

    public virtual void Write(string log)
    {
        implementor.Equals(log);
    }
}

public class DatabaseLog : Log
{
    public override void Write(string log)
    {
        implementor.Excute(log);
    }
}

public class TextFileLog : Log
{
    public override void Write(string log)
    {
        implementor.Excute(log);
    }
}

/// <summary>
/// 日志记录在不同平台实现的基类
/// </summary>
public abstract class ImpLog
{
    public abstract void Excute(string msg);
}

public class Nlog : ImpLog
{
    public override void Excute(string msg)
    {
        Console.WriteLine("在.Net平台的实现");
    }
}

public class Jlog : ImpLog
{
    public override void Excute(string msg)
    {
        Console.WriteLine("在java平台的实现");
    }
}
```
通过对象组合的方式，桥接模式将两个角色之间的继承关系改为耦合关系，从而是的这两者可以各自独立的变化，这也是桥接模式的本意，再看下客户端如何使用：
```csharp
// .net平台的databaselog 记录
Log dbLog = new DatabaseLog();
dbLog.Implementor=new Nlog();
dbLog.Write("记录日志");

//java平台的文本文件日志记录
Log txtLog = new TextFileLog();
txtLog.Implementor=new Jlog();
txtLog.Write("记录日志");
```
可能有人会担心，这不就又增加了客户端程序和具体日志记录方式之间的耦合性吗，其实这是没有必要的，这种耦合性是由于对象的创建所带来的，完全可以用创建型模式来解决。

另一个问题，为什么桥接模式用对象组合的方式，而不是采用继承的方式，比如log和ImpLog类都为接口，类结构图如下
![image.png](/common/1659108338588-e8e29d8f-8e87-4fa6-98aa-d64c617c2b12.png)
```csharp
public class NDatabaseLog : DatabaseLog, IImpLog
{
    //......
}

public class JDatabaseLog : DatabaseLog, IImpLog
{
    //......
}

public class NTextFileLog : TextFileLog, IImpLog
{
    //......
}

public class JTextFileLog : TextFileLog, IImpLog
{
    //......
}
```
如上面图中蓝色的部分所示，它们既具有日志记录方式的特性，也具有接口IImpLog的特性，已经违背了面向对象设计原则中的单一职责原则。

## 总结
如果在开发中遇到两个方向上纵横交错的变化时候，应该能够想到使用桥接模式，有时候如果虽然有两个方向向上的变化，但是在某一个方向的变化不是很剧烈的时候，并不一定要使用桥接模式。

