---
title: 组合模式
lang: zh-CN
date: 2022-09-07
publish: true
author: azrng
isOriginal: true
category:
  - 软件设计
tag:
  - 无
filename: zugemoshi
slug: elccu0
docsId: '90152651'
---

## 概述
将一组对象(文件和目录)组织成树形结构，来表示一种“部分-整体”的层次结构(目录与子目录的嵌套结构)。组合模式让客户端可以统一单个对象（文件）和组合对象(目录)的处理逻辑(递归遍历)。

此处的“组合模式”不是之前提到的“组合关系(通过组织来组装两个类)”，而是用来处理树形结构数据，这里的数据又可以简单理解为一组对象集合。

## 优缺点
优点

- 组合模式可以让客户端代码可以一致地处理单个对象和组合对象，无需关心自己处理的是单个对象还是组合对象，简化了客户端代码。
- 容易在组合体内加入新的对象，客户端不会因为增加了新的对象而更改源代码，满足“开闭原则”。

缺点

- 在使用组合模式的时候，叶子和树枝的声明都是实现类，而不是接口，违背了依赖倒置原则。

## 生活中的例子
组合模式可以让用户一致地使用单个对象和组合对象。算术表达式是一个组合的例子，算术表达式包括操作数、操作符、和另一个操作数，操作数可以是数字也可以是另外一个表达式。但是他们使用起来都是一样的，都是通过操作符来操作。

## 操作

### 文件目录示例
需求：设计一个类来表达文件系统中的目录，能够方便实现以下功能

- 动态添加、删除某一个目录下的子目录或者文件
- 统计指定目录下的文件个数
- 统计指定目录下的文件总大小

操作示例
```csharp
internal class FileSystemMode
{
    private List<FileSystemMode> SubNodes = new List<FileSystemMode>();

    public FileSystemMode(string path, bool isFile)
    {
        Path = path;
        IsFile = isFile;
    }

    public string Path { get; set; }

    public bool IsFile { get; set; }

    /// <summary>
    /// 获取文件数量
    /// </summary>
    /// <returns></returns>
    public int CountNumOfFiles()
    {
        if (IsFile)
            return 1;

        var numOfFile = 0;
        foreach (var item in SubNodes)
        {
            numOfFile += item.CountNumOfFiles();
        }
        return numOfFile;
    }

    /// <summary>
    /// 获取文件大小
    /// </summary>
    /// <returns></returns>
    public long CountSizeOfFiles()
    {
        if (IsFile)
        {
            var exist = File.Exists(Path);
            if (!exist)
            {
                return 0;
            }
            return File.ReadAllBytes(Path).Length;
        }

        long sizeOfFile = 0;
        foreach (var item in SubNodes)
        {
            sizeOfFile += item.CountSizeOfFiles();
        }
        return sizeOfFile;
    }

    public void AddSubNode(FileSystemMode fileSystem)
    {
        SubNodes.Add(fileSystem);
    }

    public void RemoveSubNode(FileSystemMode fileSystem)
    {
        SubNodes.Remove(fileSystem);
    }
}
```
使用例子
```csharp
var rootSystem = new FileSystemMode("D:\\Downloads", false);

var file1 = new FileSystemMode("D:\\Downloads\\abc.pdf", true);

rootSystem.AddSubNode(file1);

var count = rootSystem.CountNumOfFiles();
var size = rootSystem.CountSizeOfFiles();
```
只看功能的话，上面已经实现了我们想要实现的功能，如果我们开发一个大型系统，从扩展性、业务建模、代码的可读性的角度来说，我们最好对文件和目录进行区分设计，定义为File和Directory两个类，按照这思路将代码进行以下修改
```csharp
/// <summary>
/// 抽离出来文件系统抽象类
/// </summary>
internal abstract class FileSystemModeRefactor
{
    private readonly List<FileSystemMode> _subNodes = new List<FileSystemMode>();

    public FileSystemModeRefactor(string path)
    {
        Path = path;
    }

    public string Path { get; set; }

    public bool IsFile { get; set; }

    public abstract int CountNumOfFiles();

    public abstract long CountSizeOfFile();
}

internal class FileExtension : FileSystemModeRefactor
{
    public FileExtension(string path) : base(path)
    {
    }

    public override int CountNumOfFiles()
    {
        return 1;
    }

    public override long CountSizeOfFile()
    {
        var exist = File.Exists(Path);
        if (!exist)
            return 0;

        return File.ReadAllBytes(Path).Length;
    }
}

internal class DirectoryExtension : FileSystemModeRefactor
{
    private List<FileSystemModeRefactor> SubNodes = new List<FileSystemModeRefactor>();

    public DirectoryExtension(string path) : base(path)
    {
    }

    public override int CountNumOfFiles()
    {
        var numOfFile = 0;
        foreach (var item in SubNodes)
        {
            numOfFile += item.CountNumOfFiles();
        }
        return numOfFile;
    }

    public override long CountSizeOfFile()
    {
        long sizeOfFile = 0;
        foreach (var item in SubNodes)
        {
            sizeOfFile += item.CountSizeOfFile();
        }
        return sizeOfFile;
    }

    public void AddSubNode(FileSystemModeRefactor fileSystem)
    {
        SubNodes.Add(fileSystem);
    }

    public void Remove(FileSystemModeRefactor fileSystem)
    {
        SubNodes.Remove(fileSystem);
    }
}
```
那么我们的使用方案就变成了
```csharp
var rootSystem = new DirectoryExtension("D:\\Downloads");
var file1 = new FileExtension("D:\\Downloads\\abc.pdf");
rootSystem.AddSubNode(file1);

var count = rootSystem.CountNumOfFiles();
var size = rootSystem.CountSizeOfFile();
```
这样子，我们更可以明显的看出来我们操作单个对象(文件)和组合对象(目录)的处理逻辑一样，这就是组合模式。

### 树木例子
声明一个Compoent作为抽象类
```csharp
internal abstract class Compoent
{
    protected string Name;

    public Compoent(string name)
    {
        Name = name;
    }

    /// <summary>
    /// 添加树叶 树枝
    /// </summary>
    /// <param name="compose"></param>
    public abstract void Add(Compoent compose);

    /// <summary>
    /// 移除树叶 树枝
    /// </summary>
    /// <param name="compose"></param>
    public abstract void Remove(Compoent compose);

    /// <summary>
    /// 显示层级
    /// </summary>
    /// <param name="depth"></param>
    public abstract void Display(int depth);
}
```
Leaf(叶子)在组合中表示叶节点对象，叶节点没有子节点
```csharp
internal class Leaf : Compoent
{
    public Leaf(string name) : base(name)
    {
    }

    public override void Add(Compoent compose)
    {
        Console.WriteLine("不能添加叶子节点");
    }

    public override void Display(int depth)
    {
        Console.WriteLine(new string('-', depth) + Name);
    }

    public override void Remove(Compoent compose)
    {
        Console.WriteLine("不能够移除叶子节点");
    }
}
```
由于叶子节点没有增加分枝和树叶，所以add和remove方法没有实现它的意义，但是这样子做可以消除叶节点和枝节点在抽象层次的区别，让他们具有完全一致的用法。

Composite定义在枝节点行为，用来存储子部件，在Component接口中实现与子部件有关的操作，比如增加Add和删除Remove
```csharp
/// <summary>
/// Composite定义树枝的行为，用来存储子部件
/// </summary>
internal class Composite : Compoent
{
    private List<Compoent> Children = new List<Compoent>();

    public Composite(string name) : base(name)
    {
    }

    public override void Add(Compoent compose)
    {
        Children.Add(compose);
    }

    public override void Display(int depth)
    {
        Console.WriteLine(new string('-', depth) + Name);
        foreach (var item in Children)
        {
            item.Display(depth + 2);
        }
    }

    public override void Remove(Compoent compose)
    {
        Children.Remove(compose);
    }
}
```
客户端代码，能够通过Compoent接口操作组合部件的对象
```csharp
var root = new Composite("root");
root.Add(new Leaf("leaf A"));
root.Add(new Leaf("leaf B"));

var comp = new Composite("composite x");
comp.Add(new Leaf("leaf xa"));
comp.Add(new Leaf("leaf xb"));
root.Add(comp);

var comp2 = new Composite("composite x");
comp2.Add(new Leaf("leaf xa"));
comp2.Add(new Leaf("leaf xb"));
root.Add(comp2);

root.Add(new Leaf("leaf c"));

var leaf = new Leaf("leaf d");
root.Add(leaf);

root.Remove(leaf);

root.Display(2);
```

#### 透明方式与安全方式
为啥上面的leaf类中也有add和remove那？树叶不是不可以再长分枝吗？这种方式叫做透明方式，也就是component中声明素有用来管理子对象的方法，其中包括add和remove等，这样子实现的component接口的所有子类都具备add和remove，这样子做的就是叶节点和枝节点对于外界没有区别，他们具有一致的行文接口。但是问题还很明显，因为leaf类本身不具备add和remove方法的功能，所以实现它是没有意义的。

我们也可以让leaf不去添加add和remove方法，这样子就是安全方式，实现方案就是在component在接口中不去声明Add和Remove方法，那么子类的leaf也不需要去实现它，而是在composite声明所有用来管理子类对象的方法，这样子就导致不够透明，所以树叶和树枝类不具有相同的方法，客户端的调用就需要做相应的判断，也带来了不方便。

## 什么时候需要使用组合模式
让你发现需求中是体现部分与整体层次的结构时候，以及你希望用户可以忽略组合与单个对象的不同的时候，统一使用组合结构中所有对象时候，就应该考虑使用组合模式了。
