---
title: 迭代器模式
lang: zh-CN
date: 2023-03-05
publish: true
author: azrng
isOriginal: true
category:
  - 软件设计
tag:
  - 无
filename: diedaiqimoshi
slug: obrlheeewfxge84n
docsId: '116061518'
---

## 概述
迭代器模式(Iterator Design Pattern)，也叫做游标模式(Cursor Design Pattern)。迭代器模式用来遍历集合对象。
一个完整的迭代器模式一般会涉及容器和容器迭代器两个部分，为了达到基于接口而非实现编程的目的，容器又包含容器接口、容器实现类，迭代器又包含迭代器接口、迭代器实现类。
迭代器中需要定义hasNext、currentItem、next等三个最基本的方法。

## 优势

- 迭代器封装了集合内部复杂的数据结构，开发者不需要了解如何遍历，直接使用容器提供的迭代器就可以了
- 迭代器让集合对象的遍历操作从集合类中拆分出来，放到迭代器类中，让两者的职责更加单一。
- 迭代器模式让添加新的遍历算法更加容器，更符合开闭原则。并且迭代器都实现自相同的接口，在开发中，基于接口而非实现编程，替代迭代器也变得更加容易。

## 操作
 我们定义一个迭代器接口 Iterator，以及针对两种容器的具体 的迭代器实现类 ArrayIterator，Iterator接口的定义如下
```csharp
public interface ITerator<E>
{
    bool HasNext();

    void Next();

    E CurrentItem();
}
```
ArrayIterator代码实现
```csharp
public class ArrayIterator<E> : ITerator<E>
{
    private int cursor;
    private List<E> _list;

    public ArrayIterator(List<E> list)
    {
        this.cursor = 0;
        this._list = list;
    }

    public bool HasNext()
    {
        return cursor >= 0 && cursor < _list.Count;
    }

    public void Next()
    {
        cursor++;
    }

    public E CurrentItem()
    {
        if (cursor >= _list.Count)
            throw new IndexOutOfRangeException("索引超出界限");

        return _list[cursor];
    }
}
```
操作示例
```csharp
var nameList = new List<string>();
nameList.Add("张三");
nameList.Add("李四");
nameList.Add("王五");

ITerator<string> iterator = new ArrayIterator<string>(nameList);
while (iterator.HasNext())
{
    Console.WriteLine(iterator.CurrentItem());
    iterator.Next();
}
```



### 应对遍历时改变集合导致的问题
当你在遍历集合的时候修改了元素(添加/删除),这个时候就可能导致出现问题，比如说查询到重复的元素或者查询到下下个元素等，为了防止出现这样子的问题，我们可以采用下面的方案：

- 遍历的时候不允许增删元素
- 增删元素之后让遍历报错

不允许被修改比较难做到，然后就考虑在增加元素后如果遍历的话就让报错
```csharp
/// <summary>
/// array迭代器  如果遍历的过程中修改了集合，那么就直接让报错处理
/// </summary>
/// <typeparam name="E"></typeparam>
public class ArrayIterator<E> : ITerator<E>
{
    private int _cursor;
    private readonly List<E> _list;
    private readonly int _expectedModCount;

    public ArrayIterator(List<E> list)
    {
        this._cursor = 0;
        this._list = list;
        _expectedModCount = list.Count;
    }

    public bool HasNext()
    {
        CheckForComodification();
        return _cursor >= 0 && _cursor < _list.Count;
    }

    public void Next()
    {
        CheckForComodification();
        _cursor++;
    }

    public E CurrentItem()
    {
        CheckForComodification();
        if (_cursor >= _list.Count)
            throw new IndexOutOfRangeException("索引超出界限");

        return _list[_cursor];
    }

    /// <summary>
    /// 检查集合是否被修改了
    /// </summary>
    /// <exception cref="ArgumentException"></exception>
    private void CheckForComodification()
    {
        if (_list.Count != _expectedModCount)
            throw new ArgumentException("集合已经被修改");
    }
}
```

### 带快照功能的迭代器
创造一个支持快照功能的迭代器模式，创建快照后增删容器的元素，不影响之前快照的元素。

定义迭代器接口
```csharp
public interface ITerator3<E>
{
    /// <summary>
    /// 是否存在下一个元素
    /// </summary>
    /// <returns></returns>
    bool HasNext();

    /// <summary>
    /// 迭代器索引往下移动一位
    /// </summary>
    E Next();
}
```
定义集合接口
```csharp
public interface IList3<E>
{
    ITerator3<E> Iterator();

    void Add(E item);

    void Remove(E item);
}
```
定义集合的实现，在容器中为每个元素保存两个时间戳，一个是添加的时间戳一个是删除的时间戳，当元素被加入到集合中的时候，我们将添加时间戳设置为当前时间，将删除时间戳设置为long的最大值。当元素被删除的时候，我们将删除时间戳更新为当前时间，表示已经被删除(逻辑删除)
```csharp
public class ArrayList3<E> : IList3<E>
{
    /// <summary>
    /// 默认容量
    /// </summary>
    private const int _default_capacity = 10;

    /// <summary>
    /// 不包含标记删除的元素
    /// </summary>
    public int _actualSize;

    /// <summary>
    /// 包含标记删除元素
    /// </summary>
    public int _totalSize;

    /// <summary>
    /// 元素的值
    /// </summary>
    private readonly E[] _elements;

    /// <summary>
    /// 每个值添加时候的时间戳
    /// </summary>
    private readonly long[] _addTimestamps;

    /// <summary>
    /// 移除时候的时间戳  默认的时候为最大的long，然后再删除的时候将它更新为当前时间标识已经删除
    /// </summary>
    private readonly long[] _removeTimestamps;

    public ArrayList3()
    {
        _elements = new E[_default_capacity];
        _addTimestamps = new long[_default_capacity];
        _removeTimestamps = new long[_default_capacity];
        _totalSize = 0;
        _actualSize = 0;
    }

    public void Add(E item)
    {
        _elements[_totalSize] = item;
        _addTimestamps[_totalSize] = DateTime.Now.GetTimestamp();
        _removeTimestamps[_totalSize] = long.MaxValue;
        _totalSize++;
        _actualSize++;
    }

    /// <summary>
    /// 获取快照的值
    /// </summary>
    /// <returns></returns>
    public ITerator3<E> Iterator()
    {
        return new SnapshotArrayIterator3<E>(this);
    }

    /// <summary>
    /// 移除元素 将指定元素的内容标记为已删除状态
    /// </summary>
    /// <param name="item"></param>
    public void Remove(E item)
    {
        for (var i = 0; i < _totalSize; i++)
        {
            if (_elements[i].Equals(item))
            {
                _removeTimestamps[i] = DateTime.Now.GetTimestamp();
                _actualSize--;
                break;
            }
        }
    }

    /// <summary>
    /// 获取元素
    /// </summary>
    /// <param name="i"></param>
    /// <returns></returns>
    /// <exception cref="IndexOutOfRangeException"></exception>
    public E Get(int i)
    {
        if (i >= _totalSize)
            throw new IndexOutOfRangeException("索引超出界限");

        return _elements[i];
    }

    /// <summary>
    /// 获取删除的时间戳
    /// </summary>
    /// <param name="i"></param>
    /// <returns></returns>
    /// <exception cref="IndexOutOfRangeException"></exception>
    public long GetDelTimestamp(int i)
    {
        if (i >= _totalSize)
            throw new IndexOutOfRangeException("索引超出界限");

        return _removeTimestamps[i];
    }

    public long GetAddTimestamp(int i)
    {
        if (i >= _totalSize)
            throw new IndexOutOfRangeException("索引超出界限");

        return _addTimestamps[i];
    }
}
```
定义快照操作，在遍历元素的时候，找元素的添加时间戳小于快照时间戳并且快照时间戳小于删除时间戳的元素，这才是我们这个快照的元素。
```csharp
public class SnapshotArrayIterator3<E> : ITerator3<E>
{
    /// <summary>
    /// 快照的时间戳
    /// </summary>
    private readonly long _snapshotTimestamp;

    /// <summary>
    /// 在整个容器的下标 非快照的下标
    /// </summary>
    private int _cursorInAll;

    /// <summary>
    /// 快照中还有几个元素未被遍历
    /// </summary>
    private int _leftCount;

    /// <summary>
    /// 当前索引是否跳过
    /// </summary>
    private bool currentSkip;

    /// <summary>
    /// 元素的值
    /// </summary>
    private readonly ArrayList3<E> _elements;

    public SnapshotArrayIterator3(ArrayList3<E> arrayList)
    {
        _snapshotTimestamp = DateTime.Now.GetTimestamp();
        _cursorInAll = 0;
        _leftCount = arrayList._actualSize;
        _elements = arrayList;
        currentSkip = true;

        // 先跳到这个迭代器快照的第一个(未删除的)元素
        JustNext();
    }

    public bool HasNext()
    {
        if (_cursorInAll >= _elements._totalSize)
            return false;
        return _leftCount >= 0;
    }

    public E Next()
    {
        var currentItem = _elements.Get(_cursorInAll);
        if (currentSkip)
            _cursorInAll++;

        JustNext();
        return currentItem;
    }

    private void JustNext()
    {
        currentSkip = false;
        while (_cursorInAll < _elements._totalSize)
        {
            var addTimestamp = _elements.GetAddTimestamp(_cursorInAll);
            var delTimestamp = _elements.GetDelTimestamp(_cursorInAll);

            // 如果元素的添加时间大于快照时间，那么就说明该元素就是后面添加的，所以不属于该迭代的快照
            // 如果快照时间大于添加时间 以及快照时间小于结束时间(未删除状态的话是long最大值)，那么就遍历
            if (_snapshotTimestamp >= addTimestamp && _snapshotTimestamp < delTimestamp)
            {
                _leftCount--;
                currentSkip = true;
                break;
            }
            _cursorInAll++;
        }
    }
}
```
使用方法
```csharp
IList3<string> list = new ArrayList3<string>();
list.Add("3");
list.Add("8");
list.Add("2");
var iter1 = list.Iterator();// 快照 3 8 2
list.Remove("2");
var iter2 = list.Iterator();// 快照 3 8
list.Remove("3");
var iter3 = list.Iterator();// 快照 3

// 输出结果
Console.WriteLine("iter1输出结果");
while (iter1.HasNext())
{
    var item = iter1.Next();
    Console.WriteLine(item);
}

Console.WriteLine("iter2输出结果");
while (iter2.HasNext())
{
    var item = iter2.Next();
    Console.WriteLine(item);
}

Console.WriteLine("iter3输出结果");
while (iter3.HasNext())
{
    var item = iter3.Next();
    Console.WriteLine(item);
}
```
> 注意：上面的示例内容并未考虑扩容的问题。

