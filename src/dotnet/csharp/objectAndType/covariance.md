---
title: 逆变协变
lang: zh-CN
date: 2023-10-22
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 无
filename: nibianxiebian
slug: tyiw0wqi8dg84b01
docsId: '133834502'
---

## 概述
逆变和协变的表现形式
逆变(in): I<子类> = I<父类>
协变(out): I<父类> = I<子类>

## 操作

### 协变
不能使用的示例
```csharp
IFace<object> item = new Face<string>();

public interface IFace<T>
{
    string Print(T input);
}

public class Face<T> : IFace<T>
{
    public string Print(T input)
    {
        return input.ToString();
    }
}
```
因为 `Face<string>` 实现的是 `IFace<string>`, 而 `IFace<string>` 并不是 `IFace<object>` 的子类，那么下面的代码为啥可以正常
```csharp
IEnumerable<object> objects = new List<string>();
```
查看IEnumerable的代码
```csharp
public interface IEnumerable<out T> : IEnumerable
{
    IEnumerator<T> GetEnumerator();
}
```
泛型 T 之前加了**协变**的关键词 out, 代表支持协变。

### 逆变
```csharp
public interface IFace2<in T>
{
    string Print(T input);
}

public class Face2<T> : IFace2<T>
{
    public string Print(T input)
    {
        return input.ToString();
    }
}

IFace2<string> item = new Face2<object>();
```
需要在泛型 T 之前加上关键词 in对比上方的协变, 逆变看起来就像是将基类赋值给子类, 但这其实符合里氏代换的
当我们调用 item.Print 时, 看起来允许传入的参数为 string 类型, 而实际上最终调用的 `Face<object>.Print` 是支持 object 的, 传入 string 类型的参数没有任何问题

## 限制
那我什么时候可以用逆变, 什么时候可以用协变, 这两个东西用起来有什么限制?
A: 简单来说, 有关泛型输入的用逆变, 关键词是in, 有关泛型输出的用协变, 关键词是out, 如果接口中既有输入又有输出, 就不能用逆变协变
Q: 为什么这两个不能同时存在?
A:  协变的表现形式为将子类赋值给基类, 当进行输出相关操作时, 输出的对象类型为基类, 是将子类转为基类, 你可以说子类是基类;
逆变的表现形式为将基类赋值给子类, 当进行输入相关操作时, 输入的对象为子类, 是将子类转为基类, 这个时候你也可以说基类是子类;
如果同时支持逆变协变, 若先进行子类赋值给基类的操作, 此时输出的是基类, 子类转为基类并不会有什么问题, 但进行输入操作时就是在将基类转为子类, 此时是无法保证类型安全的;
Q: 听不懂, 能不能举个例子给我?
A: 假设 IEnumerable<> 同时支持逆变协变, `IEnumerable<object> list = new List<string>();`进行赋值后, list中实际保存的类型是string, item.First()的输出类型为object, 实际类型是string, 此时说string是object没有任何问题, 协变可以正常发挥作用;
但是如果支持了逆变, 假设我们进行输入类型的操作, item.Add() 允许的参数类型为 object, 可以是任意类型, 但是实际上支持string类型, 此时的object绝无可能是string
Q: 好像听懂了一点了, 我以后慢慢琢磨吧

简单总结就是
输入的用逆变
输出的用协变

## 参考资料
[https://www.cnblogs.com/babyb/p/17286595.html](https://www.cnblogs.com/babyb/p/17286595.html) | C#泛型的逆变协变之个人理解
