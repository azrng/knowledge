---
title: 抽象类
lang: zh-CN
date: 2023-10-22
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 无
filename: chouxianglei
slug: lkt8gt
docsId: '47980980'
---

## 介绍
基类一般使用抽象类，目的是不让基类实例对象。
当多个类出现相同的功能，但是功能主题不同，这是可以向上抽取的。

特点

- 不允许被实例化，只能被继承。
- 可以包含属性和方法。方法既可以包含代码的实现，也可以不包含代码的实现，不包含代码实现的叫做抽象方法。
- 子类继承抽象类，必须实现抽象类的所有抽象方法。貌似有点像虚方法一样，子类实现的时候是override。
- 不能使用partial，类和接口可以
```csharp
/// <summary>
/// 抽象动物类
/// </summary>
public abstract class Animal
{
    /// <summary>
    /// 包含实现的方法
    /// </summary>
    public void Set()
    {
        Console.WriteLine("吃东西");
    }

    /// <summary>
    /// 抽象方法，不包含方法实现
    /// </summary>
    public abstract void Sleep();
}

public class Dog : Animal
{
    public override void Sleep()
    {
        throw new NotImplementedException();
    }
}

```

## 意义

- 解决代码复用，防止编写相同的代码
- 无法实现多态属性，比如将基类改为普通类，狗狗类子类还继承自动物类，实例化狗狗类后赋值给基类后，就无法调用Sleep的方法，但是这个时候如果基类是抽象类，那么子类在继承基类的时候，就硬性要求必须实现抽象方法。

## 对比类/抽象类/接口
| 对比项\\类别 | 类 | 抽象类 | 接口 |
| --- | --- | --- | --- |
| 成员 | 方法、属性、索引器、事件、字段 | 方法、属性、索引器、事件、字段 | 方法、属性、索引器、事件 |
| 是否可以使用构造函数 | 可以 | 可以 | 不可以 |
| 是否可以使用partial | 可以 | 不可以 | 可以 |
| 是否可以实例化 | 可以 | 不可以 | 不可以 |
| 继承 | 单继承 | 单继承，继承的类必须重写抽象方法，除非继承类是抽象类，不能被接口继承 | 支持多继承，继承的类必须实现声明的所有方法 |
| 方法实现 | 可以 | 可以只包含声明(抽象方法)，也可以包含 | 可以只定义方法声明，c#8.0后可以包含方法实现，但是继承类无法使用 |
| 含义 | 对对象的抽象 | 对类的抽象 | 对行为的抽象 |

