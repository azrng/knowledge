---
title: 工厂模式
lang: zh-CN
date: 2023-06-08
publish: true
author: azrng
isOriginal: true
category:
  - 软件设计
tag:
  - 无
filename: factoryMode
slug: rvfa3d
docsId: '83077939'
---

## 介绍
细分可以分为：简单工厂、工厂方法和抽象工厂，在GOF的《设计模式》中简单工厂模式看做是工厂方法模式中的一种特例，所以工厂模式就被分为工厂方法和抽象工厂两类。
在三种细分的工厂模式中：简单工厂和工厂方法原理简单使用广泛，抽象工厂原理稍微复杂，也不常用。

## 优点

## 操作

### 简单工厂模式
使用场景：当每个对象创建逻辑都比较简单的时候，将多个对象的创建逻辑放到一个工厂类中。

举例，比如我需要一个许多读取文件的方法，根据不同的类型去使用不同的读取文件的方法，那么我可以创建一个工厂传入不同的类型来返回我想要的读取文件的方法，操作如下，我创建了一个接口定义读取的行为
```csharp
/// <summary>
/// 读取文件的接口
/// </summary>
public interface IReadFile
{
    /// <summary>
    /// 读取文件
    /// </summary>
    /// <returns></returns>
    string Read();
}
```
然后我继承该接口有三种实现，分别是读取json格式、读取xml格式和读取txt格式。
```csharp
public class ReadJsonFile : IReadFile
{
    public string Read()
    {
        return "读取json格式文件";
    }
}

public class ReadXmlFile : IReadFile
{
    public string Read()
    {
        return "读取xml格式文件";
    }
}

public class ReadTxtFile : IReadFile
{
    public string Read()
    {
        return "读取txt格式文件";
    }
}
```
我需要一个工厂，在我需要xml的时候就返回ReadXmlFile，其他依旧
```csharp
public static class FileReadFactory
{
    public static IReadFile CreateRead(string fileFormat)
    {
        if (fileFormat=="json")
        {
            return new ReadJsonFile();
        }
        else if (fileFormat=="xml")
        {
            return new ReadXmlFile();
        }
        else
        {
            return new ReadTxtFile();
        }
    }
}
```
工厂模式的类一般以Factory结尾，创建对象的方法一般以Create开头，上述就是一个简单工厂。

在上面的实现中，我们每次调用方法就会创建一个新的IReadFile，如果能复用，为了节约内存和对象创建时间，我们可以事先将IReadFile缓存起来，当我们调用CreateRead方法的时候，直接读取使用即可，具体代码如下
```csharp
public static class FileReadFactory2
{
    private static readonly Dictionary<string, IReadFile> _files = new Dictionary<string, IReadFile>();

    static FileReadFactory2()
    {
        _files.Add("json", new ReadJsonFile());
        _files.Add("xml", new ReadXmlFile());
        _files.Add("txt", new ReadTxtFile());
    }

    public static IReadFile CreateRead(string fileFormat)
    {
        return _files[fileFormat];
    }
}
```
虽然在简单工厂的代码实现中，有多处if分支判断，违背开闭原则，但权衡扩展性和可读性，这样子的代码实现在大多数情况下是没有问题的。

### 工厂方法
使用场景：当创建对象的类比较复杂时候(创建过程涉及复杂的if-else分支判断或者需要组装多个其他类对象)，或者需要增加扩展需求(增加对象池、缓存或者其他需求)的时候，可以创建工厂方法。

首先我们先创建读取文件的类，和上面一样
```csharp
/// <summary>
/// 读取文件的接口
/// </summary>
public interface IReadFile
{
    /// <summary>
    /// 读取文件
    /// </summary>
    /// <returns></returns>
    string Read();
}

public class ReadJsonFile : IReadFile
{
    public string Read()
    {
        return "读取json格式文件";
    }
}

public class ReadXmlFile : IReadFile
{
    public string Read()
    {
        return "读取xml格式文件";
    }
}

public class ReadTxtFile : IReadFile
{
    public string Read()
    {
        return "读取txt格式文件";
    }
}
```
然后当我们创建读取文件对象比较复杂，那么就再抽离一个创建读取文件的工厂
```csharp
/// <summary>
/// 当创建IReadFile的方法比较复杂，或许需要包含其他扩展，那么就更推荐使用工厂方法
/// </summary>
public interface IReadFileParserFactory
{
    IReadFile CreateParser();
}

public class ReadJsonFileParserFactory : IReadFileParserFactory
{
    public IReadFile CreateParser()
    {
        return new ReadJsonFile();
    }
}

public class ReadXmlFileParserFactory : IReadFileParserFactory
{
    public IReadFile CreateParser()
    {
        return new ReadXmlFile();
    }
}

public class ReadTxtFileParserFactory : IReadFileParserFactory
{
    public IReadFile CreateParser()
    {
        return new ReadTxtFile();
    }
}
```
最后考虑到复用的情况，将创建读取文件的工厂存放到了字典中
```csharp
public static class ReadFileParserFactoryMap
{
    private static readonly ConcurrentDictionary<string, IReadFileParserFactory> _files = new ConcurrentDictionary<string, IReadFileParserFactory>();

    static ReadFileParserFactoryMap()
    {
        _files.TryAdd("json", new ReadJsonFileParserFactory());
        _files.TryAdd("xml", new ReadXmlFileParserFactory());
        _files.TryAdd("txt", new ReadTxtFileParserFactory());
    }

    public static IReadFileParserFactory? GetParserFactory(string fileFormat)
    {
        _files.TryGetValue(fileFormat, out var result);
        return result;
    }
}
```
最后编写通过工厂方法读取文件的方法
```csharp
var parser = ReadFileParserFactoryMap.GetParserFactory("json");
if (parser==null)
    throw new ArgumentException("无效的读取规则");

//读取文件的类
var readFile = parser.CreateParser();
Console.WriteLine(readFile.Read());
```
当前举例并没有发挥出工厂模式的优点，更适合使用简单工厂模式来处理。

### 抽象工厂
抽象工厂模式应用场景比较少，简单了解即可。

在上面的简单工厂和工厂方法中，读取文件只会根据文件格式这一个分类进行读取，那么如果有两个分类那？或者说我们也区分不同的系统读取方式，那么按照上面的例子就对应着6个读取方式(3种读取方式 * 2个系统分类)，并且如果后期再增加一个系统，那么就又得增加3中文件读取，所以这个时候应该用抽象工厂，让一个工厂负责创建多个不同类型的对象，而不是只创建一种。

创建读取文件方法
```csharp
/// <summary>
/// 读取文件的接口
/// </summary>
public interface IReadFile
{
    /// <summary>
    /// 读取文件
    /// </summary>
    /// <returns></returns>
    string Read();
}

public class ReadJsonSystemOneFile : IReadFile
{
    public string Read()
    {
        return "读取json格式文件";
    }
}

public class ReadJsonSystemTwoFile : IReadFile
{
    public string Read()
    {
        return "读取json格式文件";
    }
}
```
创建工厂
```csharp
/// <summary>
/// 当创建IReadFile的方法比较复杂，或许需要包含其他扩展，那么就更推荐使用工厂方法
/// </summary>
public interface IReadFileParserFactory
{
    IReadFile CreateSystemOneParser();

    IReadFile CreateSystemTwoParser();
}

public class ReadJsonFileParserFactory : IReadFileParserFactory
{
    public IReadFile CreateSystemOneParser()
    {
        return new ReadJsonSystemOneFile();
    }

    public IReadFile CreateSystemTwoParser()
    {
        return new ReadJsonSystemTwoFile();
    }
}
```

## 对比DI容器
DI容器，也叫做依赖注入容器。

### 工厂模式和DI容器区别
DI容器底层最基本的设计思路就是基于工厂模式，DI容器就相当于一个大的工厂类，复杂在程序启动的时候，根据配置事先创建好对象，当应用程序需要使用到某一个类对象的时候，直接从容器中获取即可，就是因为它持有一堆对象，所以这个框架才被称为“容器”。
DI容器处理的是更大对象的创建操作，在工厂模式中，一个工厂类只负责某一个类对象或者一组相关类对象(继承自同一个抽象类或者接口的子类)的创建，而DI容器负责的是整个应用中所有类对象的创建。

### DI容器应该有哪些核心功能
一般有三个：配置解析、对象创建、对象生命周期管理。

配置解析是从配置中获取创建的类对象和创建类对象的必要信息(使用哪个构造函数或者说构造函数参数是什么)，放到配置文件中，容器读取配置文件，然后根据配置文件提供的信息来创建对象。
> 在现在的.NetCore中是不需要配置文件的方式来提供这些信息，直接通过AddScope方法来注册


对象的创建：通过反射来创建对象

对象声明周期的管理：可以设置每次返回一个创建的对象或者说每次返回一个事先创建好的对象，也就是所谓的单例对象。

## 总结
工厂模式就是通过给定的参数来决定创建哪种类型的对象，而这些对象都是相同类型的对象(继承自同一个父类或者接口的一组子类)。
