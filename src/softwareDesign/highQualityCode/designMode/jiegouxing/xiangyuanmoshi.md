---
title: 享元模式
lang: zh-CN
date: 2022-12-08
publish: true
author: azrng
isOriginal: true
category:
  - 软件设计
tag:
  - 无
filename: xiangyuanmoshi
slug: pvb04x
docsId: '90152658'
---

## 概述
所谓“享元”，就是被共享的单元，也就是复用对象(一个对象被多处代码引用来节省内存中对象的数量来实现节约内存的目的)，前提是享元对象是不可变对象（之所以要求是不可变对象是因为它会被多处代码共享使用，避免一处代码对享元进行了修改而影响其他使用的地方）。

## 示例

### 棋盘游戏
 开发一个棋牌游戏（比如象棋）。一个游戏厅中有成千上万个“房间”，每个房 间对应一个棋局。棋局要保存每个棋子的数据，比如：棋子类型（将、相、士、炮等）、棋 子颜色（红方、黑方）、棋子在棋局中的位置。利用这些数据，我们就能显示一个完整的棋 盘给玩家。具体的代码如下所示。其中，ChessPiece 类表示棋子，ChessBoard 类表示一 个棋局，里面保存了象棋中 30 个棋子的信息。  
```csharp
/// <summary>
/// 棋子类
/// </summary>
public class ChesePiece1
{
    public ChesePiece1(int id, string name, int color, int positinX, int positinY)
    {
        Id = id;
        Name = name;
        Color = color;
        PositinX = positinX;
        PositinY = positinY;
    }

    /// <summary>
    /// 标识
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// 棋子名
    /// </summary>
    public string Name { get; set; }

    /// <summary>
    /// 颜色 0代表白色 1代表黑色
    /// </summary>
    public int Color { get; set; }

    /// <summary>
    /// x轴坐标
    /// </summary>
    public int PositinX { get; set; }

    /// <summary>
    /// y轴坐标
    /// </summary>
    public int PositinY { get; set; }
}

/// <summary>
/// 棋局
/// </summary>
public class CheseBoard1
{
    private readonly Dictionary<int, ChesePiece1> dict = new Dictionary<int, ChesePiece1>();

    public CheseBoard1()
    {
        Init();
    }

    public void Init()
    {
        dict.Add(1, new ChesePiece1(1, "象", 0, 0, 0)));
        dict.Add(2, new ChesePiece1(1, "士", 0, 0, 1)));
        // 省略其他棋子的写法
    }

    public void Move(int chessPrieceId, int toPositonX, int toPositionY)
    {
        // 移动棋子
    }
}
```
为了记录每个房间的棋局情况，我需要给每个房间都创建一个CheseBoard，如果游戏大厅里面有成千上万个房间或者更多，那么保存这么多棋局对象就会消耗大量的内存，所以我们应该思考其他方法来节约内存。

这个时候就应该使用享元模式了，在上面的例子中，在内存中会有大量相似的对象，这些对象的id、name、color都是相同的，只有位置坐标x和坐标y不同，所以我们可以将相同的属性拆分出来，设计成独立的类，并且可以作为享元让多个棋盘使用，这样子，棋盘就只需要记录每个棋子的位置信息就可以了，修改为下面的代码
```csharp
/// <summary>
/// 享元类(重复的对象拆分)
/// </summary>
public class ChessPieceUnit
{
    public ChessPieceUnit(int id, string name, int color)
    {
        Id = id;
        Name = name;
        Color = color;
    }

    /// <summary>
    /// 标识
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// 棋子名
    /// </summary>
    public string Name { get; set; }

    /// <summary>
    /// 颜色 0代表白色 1代表黑色
    /// </summary>
    public int Color { get; set; }
}

/// <summary>
/// 生产相同棋子属性的工厂
/// </summary>
public static class ChesePieceUnitFactory
{
    private static readonly Dictionary<int, ChessPieceUnit> dict = new Dictionary<int, ChessPieceUnit();

    static ChesePieceUnitFactory()
    {
        dict.Add(1, new ChessPieceUnit(1, "象", 0));
        dict.Add(2, new ChessPieceUnit(2, "士", 0));
    }

    public static ChessPieceUnit Get(int id)
    {
        return dict[id];
    }
}

/// <summary>
/// 棋子类
/// </summary>
public class ChesePiece2
{
    public ChesePiece2(ChessPieceUnit chessPieceUnit, int positinX, int positinY)
    {
        ChessPieceUnit = chessPieceUnit;
        PositinX = positinX;
        PositinY = positinY;
    }

    public ChessPieceUnit ChessPieceUnit { get; set; }

    /// <summary>
    /// x轴坐标
    /// </summary>
    public int PositinX { get; set; }

    /// <summary>
    /// y轴坐标
    /// </summary>
    public int PositinY { get; set; }
}

/// <summary>
/// 棋局
/// </summary>
public class CheseBoard2
{
    private readonly Dictionary<int, ChesePiece2> dict = new Dictionary<int, ChesePiece2>();

    public CheseBoard2()
    {
        Init();
    }

    public void Init()
    {
        dict.Add(1, new ChesePiece2(ChesePieceUnitFactory.Get(1), 0, 0));
        dict.Add(2, new ChesePiece2(ChesePieceUnitFactory.Get(2), 0, 1));
        // 省略其他棋子的写法
    }

    public void Move(int chessPrieceId, int toPositonX, int toPositionY)
    {
        // 移动棋子
    }
}
```
上面我们使用工厂模式来缓存ChessPieceUnit信息(也就是棋子相通的内容id、name、color)，通过工厂类获取到的ChessPieceUnit就是享元，所有的CheseBoard2对象共享这三个个ChessPieceUnit对象(因为象棋包含30个棋子)。

在使用享元之前，当记录1w个棋局，我们需要创建30w个棋子的ChessPieceUnit对象，利用享元模式，我们只需要创建30个享元对象来供所有棋局共享使用。

享元模式的代码结构，就是通过工厂模式，在工厂类中，通过一个字段来缓存已经创建过的享元对象，来达到复用的效果。

### 文本编辑器的应用
这里的文本编辑器设定只实现文字编辑功能，不包含图片、表格等复杂的编辑功能，我们只是在内存中表示一个文本文件，只需要记录文字和格式两个部分的信息，格式又包含文字的字体、大小、颜色等信息。

尽管在实际编写文档中，我们是根据文本类型(标题、正文....)等格式来设置文本演示，标题和正文都各自是一种格式，但是从理论上，我们可以给每个文字都设置不同的格式，为了实现该配置，我们可以将每个文字都当成一个独立的对象来看待，并且在其中包含它的格式信息。
```csharp
/// <summary>
/// 创建用来保存每个文字具体信息的类
/// </summary>
public class Character1
{
    public Character1(char c, string font, int size, int colorRgb)
    {
        C = c;
        Font = font;
        Size = size;
        ColorRgb = colorRgb;
    }

    public char C { get; set; }

    public string Font { get; set; }

    public int Size { get; set; }

    public int ColorRgb { get; set; }
}

/// <summary>
/// 创建文本编辑器  里面保存了大量的Character1对象
/// </summary>
public class Editor1
{
    private readonly List<Character1> list = new List<Character1>();

    public void AddCharacter(char c, string font, int size, int colorRgb)
    {
        Character1 character = new Character1(c, font, size, colorRgb);
        list.Add(character);
    }
}
```
在文本编辑器中每增加一个文字，都会调用AddCharacter方法，创建一个Character1对象，如果一个文本文件中大量的文字，那么我们就需要在内存中保存大量的Character1对象，那么如何节省一点内存那？

在文本文件中，用到的字体格式不会太多，不会真的有人会把每个文字设置成不同的格式，所以对于字体格式，我们可以将它设计为享元，让不同的文字共享使用格式，所以可以重构出来下面的代码
```csharp
public class CharacterStype
{
    public CharacterStype(string font, int size, int colorRgb)
    {
        Font = font;
        Size = size;
        ColorRgb = colorRgb;
    }

    public string Font { get; set; }

    public int Size { get; set; }

    public int ColorRgb { get; set; }

    public override bool Equals(object obj)
    {
        var style = (CharacterStype)obj;
        return Font == style.Font && Size == style.Size && ColorRgb == style.ColorRgb;
    }
}

/// <summary>
/// 字体样式工厂
/// </summary>
public class CharacterStypeFactory
{
    private static readonly List<CharacterStype> list = new List<CharacterStype>();

    public static CharacterStype GetStyle(string font, int size, int colorRgb)
    {
        var newStyle = new CharacterStype(font, size, colorRgb);
        var style = list.FirstOrDefault(t => t.Equals(newStyle));
        if (style != null)
        {
            return style;
        }

        list.Add(newStyle);
        return newStyle;
    }
}

/// <summary>
/// 文字 包含文字样式(样式共享)
/// </summary>
public class Character2
{
    public Character2(char c, CharacterStype stype)
    {
        C = c;
        Stype = stype;
    }

    public char C { get; set; }
    public CharacterStype Stype { get; set; }
}

/// <summary>
/// 编辑器 获取样式是根据字体大小等工厂获取
/// </summary>
public class Editor2
{
    private List<Character2> chars = new List<Character2>();

    public void AddCharacter(char c, string font, int size, int colorRgb)
    {
        var style = CharacterStypeFactory.GetStyle(font, size, colorRgb);
        chars.Add(new Character2(c, style));
    }
}
```

### String类
string类也使用了享元模式，在第一次被用到的时候，存储到常量池中，当之后再次用到的时候，就直接引用常量池中已经存在的即可，就不需要再次重新创建了。

## 总结
享元模式中的“享元”指被共享的单元，享元模式通过复用对象，以达到节省内存的目的。但是享元模式对垃圾回收不友好，因为享元工厂一直保存了对享元对象的引用，这就导致享元对象在没有代码使用的情况下，也并不会被垃圾回收机制自动回收掉，因此，如果对象的生命周期很短，也不会被密集使用，利用享元模式反倒会浪费更多的内存。所以除非经过测试，利用享元模式真的可以大大节省内存，否则就不要过度使用这个模式了，为了一点点内存的节省而引入一个复杂的设计模式，得不偿失。

