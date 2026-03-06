---
title: 访问者模式
lang: zh-CN
date: 2023-03-13
publish: true
author: azrng
isOriginal: true
category:
  - 软件设计
tag:
  - 无
filename: fangwenzhemoshi
slug: ux31aq4fefd1thb5
docsId: '116932005'
---

## 前言
访问者模式难理解、难实现，应用它会导致代码的可读性、可维护性变差，所以，访问者模式在实际的软件开发中很少被用到，在没有特别必要的情况下，建议你不要使用访问者模式。

## 概述
访问者模式(Visitor Design Patter)，翻译到中文就是允许一个或者多个操作应用到一组对象上，解耦操作和对象本身。
访问者模式允许一个或者多个操作应用到一个对象上，设计意图是解耦操作和对象本身，保持类职责单一、满足开闭原则以及应对代码的复杂性。

## 操作

### 文本提取示例
我们获得了多个格式的文件，我们需要将里面的内容提取成文本，所以这个时候我们可以写一个抽象类ResourceFile，该类包含一个抽象函数Extract2txt，然后其他的文件格式去继承该ResourceFile类，并且重写抽象函数，然后我们可以利用多态的特性去决定执行哪个方法
```csharp
public abstract class ResourceFile
{
    private readonly string _filePath;

    public ResourceFile(string filePath)
    {
        _filePath = filePath;
    }

    /// <summary>
    /// 提取文本
    /// </summary>
    public abstract void Extract2Txt();
}

public class PptFile : ResourceFile
{
    public PptFile(string filePath) : base(filePath)
    {
    }

    public override void Extract2Txt()
    {
        // 省略从ppt抽取文件的代码

        Console.WriteLine("extract ppt");
    }
}

public class PdfFile : ResourceFile
{
    public PdfFile(string filePath) : base(filePath)
    {
    }

    public override void Extract2Txt()
    {
        // 省略从pdf抽取文本的代码
        Console.WriteLine("extract pdf");
    }
}

public class WordFile : ResourceFile
{
    public WordFile(string filePath) : base(filePath)
    {
    }

    public override void Extract2Txt()
    {
        // 省略从word抽取文本的代码
        Console.WriteLine("extract word");
    }
}
```
操作示例
```csharp
var resourceFiles = new List<ResourceFile>();
resourceFiles.Add(new PdfFile("a.pdf"));
resourceFiles.Add(new WordFile("b.word"));
resourceFiles.Add(new PptFile("c.ppt"));

foreach (var item in resourceFiles)
{
    item.Extract2Txt();
}
```
到后面工具的功能不停扩展，不仅仅要抽取文本内容，还要支持压缩、提取文件元信息等一系列操作，那么我们继续按照上面的实现思路去操作，就会遇到下面的问题

- 违背开闭原则，添加一个新的功能，所有的类的代码都要修改
- 功能增多，导致每个类的代码不断在增加，可读性和可维护性都变差了
- 将上面的业务逻辑都融合到一个类中，导致这些类的职责不够单一

针对这些问题，我们常用的方案就是拆分解耦，把业务操作和具体的数据结构解耦，设计成单独的类，然后将上面内容进行重构之后如下
```csharp
/// <summary>
/// 资源文件
/// </summary>
public abstract class ResourceFile2
{
    public readonly string _filePath;

    public ResourceFile2(string filePath)
    {
        _filePath = filePath;
    }

    public abstract void Accept(Extractor extractor);
}

public class PptFile2 : ResourceFile2
{
    public PptFile2(string filePath) : base(filePath)
    {
    }

    public override void Accept(Extractor extractor)
    {
        extractor.Extract2txt(this);
    }
}

public class PdfFile2 : ResourceFile2
{
    public PdfFile2(string filePath) : base(filePath)
    {
    }

    public override void Accept(Extractor extractor)
    {
        extractor.Extract2txt(this);
    }
}

public class WordFile2 : ResourceFile2
{
    public WordFile2(string filePath) : base(filePath)
    {
    }

    public override void Accept(Extractor extractor)
    {
        extractor.Extract2txt(this);
    }
}

/// <summary>
/// 执行者
/// </summary>
public class Extractor
{
    public void Extract2txt(PptFile2 pptFile2)
    {
        Console.WriteLine("提取ppt 地址：" + pptFile2._filePath);
    }

    public void Extract2txt(PdfFile2 pdfFile2)
    {
        Console.WriteLine("提取pdf 地址：" + pdfFile2._filePath);
    }

    public void Extract2txt(WordFile2 wordFile2)
    {
        Console.WriteLine("提取word 地址：" + wordFile2._filePath);
    }
}
```
调用示例
```csharp
var extractor = new Extractor();
var resourceFiles2 = new List<ResourceFile2>();
resourceFiles2.Add(new PdfFile2("a.pdf"));
resourceFiles2.Add(new WordFile2("b.word"));
resourceFiles2.Add(new PptFile2("c.ppt"));
foreach (var item in resourceFiles2)
{
    item.Accept(extractor);
}
```
在执行的时候，根据多态的特性，程序会调用实际的accept函数，比如在PdfFile2的accept函数中，此时的this类型就是PdfFile2的，在编译的时候就确定了，所以在调用extractor的Extract2txt方法的时候会直接重载到Extract2txt(PptFile2 pptFile2)方法，这就是理解访问者模式的关键所在，也就是访问者模式不好理解的原因。

那么如果要添加新的功能，比如说压缩，那么就需要修改ResourceFile2类增加下面的方法
```csharp
public abstract void Accept(CompressorService compressor);
```
CompressorService类如下
```csharp
public class CompressorService
{
    public void Compressor(PptFile2 pptFile2)
    {
        Console.WriteLine("压缩 地址：" + pptFile2._filePath);
    }

    public void Compressor(PdfFile2 pdfFile2)
    {
        Console.WriteLine("压缩 地址：" + pdfFile2._filePath);
    }

    public void Compressor(WordFile2 wordFile2)
    {
        Console.WriteLine("压缩 地址：" + wordFile2._filePath);
    }
}
```
然后PptFile2类等去实现方法，如下
```csharp
public class PptFile2 : ResourceFile2
{
    public PptFile2(string filePath) : base(filePath)
    {
    }

    public override void Accept(Extractor extractor)
    {
        extractor.Extract2txt(this);
    }

    public override void Accept(CompressorService compressor)
    {
        compressor.Compressor(this);
    }
}

public class PdfFile2 : ResourceFile2
{
    public PdfFile2(string filePath) : base(filePath)
    {
    }

    public override void Accept(Extractor extractor)
    {
        extractor.Extract2txt(this);
    }

    public override void Accept(CompressorService compressor)
    {
        compressor.Compressor(this);
    }
}

public class WordFile2 : ResourceFile2
{
    public WordFile2(string filePath) : base(filePath)
    {
    }

    public override void Accept(Extractor extractor)
    {
        extractor.Extract2txt(this);
    }

    public override void Accept(CompressorService compressor)
    {
        compressor.Compressor(this);
    }
}
```
使用方法如下
```csharp
var extractor = new Extractor();
var compress = new CompressorService();
var resourceFiles2 = new List<ResourceFile2>();
resourceFiles2.Add(new PdfFile2("a.pdf"));
resourceFiles2.Add(new WordFile2("b.word"));
resourceFiles2.Add(new PptFile2("c.ppt"));
foreach (var item in resourceFiles2)
{
    // 提取文本
    item.Accept(extractor);
    // 压缩
    item.Accept(compress);
}
```
上面增加一个压缩功能的情况下我们家刘需要修改每个资源文件类，这样子违反了开闭原则，为了处理这个问题，我们抽象出来一个Visitor接口，包含的是三个命名非常通用的Visit重载方法分别处理三种不同类型的资源文件，具体做什么业务，由实现这个Visitor接口的具体实现类在决定，代码如下
```csharp
/// <summary>
/// 资源文件  增加功能后，资源文件类不需要修改
/// </summary>
public abstract class ResourceFile3
{
    public readonly string _filePath;

    public ResourceFile3(string filePath)
    {
        _filePath = filePath;
    }

    public abstract void Accept(Visitor extractor);
}

public class PptFile3 : ResourceFile3
{
    public PptFile3(string filePath) : base(filePath)
    {
    }

    public override void Accept(Visitor extractor)
    {
        extractor.Visit(this);
    }
}

public class PdfFile3 : ResourceFile3
{
    public PdfFile3(string filePath) : base(filePath)
    {
    }

    public override void Accept(Visitor extractor)
    {
        extractor.Visit(this);
    }
}

public class WordFile3 : ResourceFile3
{
    public WordFile3(string filePath) : base(filePath)
    {
    }

    public override void Accept(Visitor extractor)
    {
        extractor.Visit(this);
    }
}

/// <summary>
/// 提取方法
/// </summary>
public class Extractor2 : Visitor
{
    public void Visit(PptFile3 pptFile3)
    {
        Console.WriteLine("提取ppt 地址：" + pptFile3._filePath);
    }

    public void Visit(PdfFile3 pdfFile3)
    {
        Console.WriteLine("提取pdf 地址：" + pdfFile3._filePath);
    }

    public void Visit(WordFile3 wordFile3)
    {
        Console.WriteLine("提取ppt 地址：" + wordFile3._filePath);
    }
}

/// <summary>
/// 压缩服务
/// </summary>
public class CompressorService2 : Visitor
{
    public void Visit(PptFile3 pptFile3)
    {
        Console.WriteLine("压缩ppt 地址：" + pptFile3._filePath);
    }

    public void Visit(PdfFile3 pdfFile3)
    {
        Console.WriteLine("压缩pdf 地址：" + pdfFile3._filePath);
    }

    public void Visit(WordFile3 wordFile3)
    {
        Console.WriteLine("压缩word 地址：" + wordFile3._filePath);
    }
}

public interface Visitor
{
    void Visit(PptFile3 pptFile3);

    void Visit(PdfFile3 pdfFile3);

    void Visit(WordFile3 wordFile3);
}
```
使用方法
```csharp
var extractor2 = new Extractor2();
var compress2 = new CompressorService2();
var resourceFiles3 = new List<ResourceFile3>();
resourceFiles3.Add(new PdfFile3("a.pdf"));
resourceFiles3.Add(new WordFile3("b.word"));
resourceFiles3.Add(new PptFile3("c.ppt"));
foreach (var item in resourceFiles3)
{
    // 提取文本
    item.Accept(extractor2);
    // 压缩
    item.Accept(compress2);
}
```
访问者模式是针对一组类型不同的对象(PdfFile3、WordFile3、PptFile3)。虽然这组对象类型是不同的，但是他们继承相同的父类或者实现相同的接口。在不同的应用场景下，我们需要对这组对象进行一系列不相关的业务处理(提取文本、压缩等)，但是为了避免因为不断添加功能类导致类(PdfFile3、WordFile3、PptFile3)不断膨胀，职责越来越不单一，以及避免频繁添加功能导致频繁代码的修改，我们使用访问者模式，将对象与操作解耦，将这些业务操作抽离出来，定义在独立的细分的访问者类(Extractor2、CompressorService2)中。

## 总结
学习的难点在代码的时候，代码实现比较复杂的主要原因就是函数重载在大部分面向对象编程语言中是静态绑定的。也就是说，调用类的哪个重载函数，是在编译期间，又参数的声明类型决定的，而非运行时候根据参数的实际类型决定的。
