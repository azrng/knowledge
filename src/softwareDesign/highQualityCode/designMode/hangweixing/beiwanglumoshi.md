---
title: 备忘录模式
lang: zh-CN
date: 2023-03-30
publish: true
author: azrng
isOriginal: true
category:
  - 软件设计
tag:
  - 无
filename: beiwanglumoshi
slug: spg979a2g1fv5253
docsId: '116931982'
---

## 概述
备忘录模式(Memento Design Pattern)也叫做快照模式，中文的意思就是：在不违背封装原则的前提下，捕获一个对象的内部状态，并在该对象之外保存这个状态，以便之后恢复对象为先前的状态。
表达了两部分内容：存储副本以便后期恢复使用、要在不违背封装原则的前提下，进行对象的备份和恢复

该模式涉及三个角色：原发器(Originator)、备忘录(Memento)、管理者(Caretaker)。
原发器是一个包含状态的对象，可以创建备忘录并将自己的状态存储在备忘录中。备忘录是一个不可变的对象，它可以存储原发器的状态。管理者是一个对象，它可以存储备忘录并在需要时将其还原到原发器中。
实现步骤如下：

- 创建原发器类，并在其中添加保存状态和恢复状态的方法。
- 创建备忘录类，并将原发器的状态作为备忘录的属性
- 创建管理者类，并在其中添加一个列表来存储备忘录
- 在原发器中添加创建备忘录和从备忘录恢复状态的方法
- 在客户端中使用原发器和管理者来保存和恢复对象的状态

## 操作

### 备忘录记事本
做一个简单的程序，支持添加值以及查询值和撤销上次添加的值等操作，实现这个需求，我们先来添加一个快照持有者，用来保存每次的快照信息
```csharp
/// <summary>
/// 快照持有者
/// </summary>
public class SnapshotHolder
{
    /// <summary>
    /// 记录每次的变更的快照信息
    /// </summary>
    private readonly Stack<InputText> _snapsShots = new Stack<InputText>();

    public InputText PopSnapshot()
    {
        return _snapsShots.Pop();
    }

    /// <summary>
    /// 存储上一次输入的值
    /// </summary>
    /// <param name="inputText"></param>
    public void PushSnapshot(InputText inputText)
    {
        var deepClonedInputText = new InputText();
        deepClonedInputText.SetText(inputText.GetText());
        _snapsShots.Push(deepClonedInputText);
    }
}
```
然后添加一个输入文本的类操作
```csharp
public class InputText
{
    private readonly StringBuilder _text = new StringBuilder();

    /// <summary>
    /// 获取文本的值
    /// </summary>
    /// <returns></returns>
    public string GetText()
    {
        return _text.ToString();
    }

    /// <summary>
    /// 追加内容
    /// </summary>
    /// <param name="input"></param>
    public void Append(string input)
    {
        _text.Append(input);
    }

    /// <summary>
    /// 设置内容
    /// </summary>
    /// <param name="text"></param>
    public void SetText(string text)
    {
        this._text.Clear();
        this._text.Append(text);
    }
}
```
最后我们编写代码来实现通过命令行输入不同的命令来执行不同的操作的写法
```csharp
public void Main()
{
    var inputText = new InputText();
    var snapshotsHolder = new SnapshotHolder();
    // 根据输入值的不同 判断当前是要查询列表还是要还原上一层还是要追加内容
    while (true)
    {
        var scanner = Console.ReadLine();
        if (scanner.IsNullOrWhiteSpace())
            break;

        switch (scanner)
        {
            case ":list": // 查询列表
                Console.WriteLine(inputText.GetText());
                break;

            case ":undo": // 撤回上次的修改
                {
                    var snapshot = snapshotsHolder.PopSnapshot();
                    inputText.SetText(snapshot.GetText());
                    break;
                }
            default: // 添加内容
                snapshotsHolder.PushSnapshot(inputText);
                inputText.Append(scanner);
                break;
        }
    }
}
```
因为上面的方法比如说InputText暴露了SetText方法，并且快照中使用了该方法，所以因为暴露了不该暴露的函数违背了封装原则，另外因为快照本身是不可变的，不应该包含set等修改内部状态的函数，所以我们创建了新类SnapshotDto来保存快照的信息
```csharp
public class SnapshotDto
{
    public SnapshotDto(string text)
    {
        Text = text;
    }

    public string Text { get; private set; }
}
```
然后快照持有者类就变成了
```csharp
/// <summary>
/// 快照持有者
/// </summary>
public class RestoreSnapshotHolder
{
    /// <summary>
    /// 记录每次的变更的快照信息
    /// </summary>
    private readonly Stack<SnapshotDto> _snapsShots = new Stack<SnapshotDto>();

    public SnapshotDto PopSnapshot()
    {
        return _snapsShots.Pop();
    }

    /// <summary>
    /// 存储上一次输入的值
    /// </summary>
    /// <param name="inputText"></param>
    public void PushSnapshot(SnapshotDto inputText)
    {
        var deepClonedInputText = new SnapshotDto(inputText.Text);
        _snapsShots.Push(deepClonedInputText);
    }
}
```
然后输入的类就变成了
```csharp
public class RestoreInputText
{
    private readonly StringBuilder _text = new StringBuilder();

    /// <summary>
    /// 获取文本的值
    /// </summary>
    /// <returns></returns>
    public string GetText()
    {
        return _text.ToString();
    }

    /// <summary>
    /// 追加内容
    /// </summary>
    /// <param name="input"></param>
    public void Append(string input)
    {
        _text.Append(input);
    }

    public SnapshotDto CreateSnapshot()
    {
        return new SnapshotDto(_text.ToString());
    }

    /// <summary>
    /// 恢复对象
    /// </summary>
    /// <param name="text"></param>
    public void RestoreText(string text)
    {
        this._text.Clear();
        this._text.Append(text);
    }
}
```
并且将该类中的SetText方法改为RestoreText方法，用意也更明确了，最后操作的方法变成了
```csharp
public void Main()
{
    var inputText = new RestoreInputText();
    var snapshotsHolder = new RestoreSnapshotHolder();
    // 根据输入值的不同 判断当前是要查询列表还是要还原上一层还是要追加内容
    while (true)
    {
        var scanner = Console.ReadLine();
        if (scanner.IsNullOrWhiteSpace())
            break;

        switch (scanner)
        {
            case ":list": // 查询列表
                Console.WriteLine(inputText.GetText());
                break;

            case ":undo": // 撤回上次的修改
                {
                    var snapshot = snapshotsHolder.PopSnapshot();
                    inputText.RestoreText(snapshot.Text);
                    break;
                }
            default: // 添加内容
                snapshotsHolder.PushSnapshot(inputText.CreateSnapshot());
                inputText.Append(scanner);
                break;
        }
    }
}
```
备忘录模式更侧重于代码的设计和实现。

## 优化内存和时间消耗
对于备份的数据很大，然后可以采用低频率全量备份和高频率增量备份相结合的方法。


## 总结
优化就是将对象状态的实现细节与客户端代码分离，从而提高代码的可维护性和可扩展性。缺点是如果原发器的状态非常大或者非常复杂，备忘录的存储和恢复操作可能会非常耗时。

