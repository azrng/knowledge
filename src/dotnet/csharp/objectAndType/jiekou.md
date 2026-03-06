---
title: 接口
lang: zh-CN
date: 2023-10-22
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 无
filename: jiekou
slug: tvgpfv
docsId: '49182049'
---

## 介绍
接口和类相似，都可以从多个接口继承，继承接口的类都必须实现接口的所有成员。不同点如下

- 接口成员都是隐式抽象的，相反，类可以包含抽象成员也和有具体实现的成员。(接口在c#8后也可以包含实现，但是不能被继承类使用。)
- 一个类可以实现多个接口，而一个类只能继承一个类
- 接口只能包含方法、属性、索引器、事件。而这些正是类中可以定义为抽象的成员类型。
- 接口也可以在不同的源文件之间进行拆分，叫做部分接口。

接口定义的是房子的框架，里面的东西都需要继承的类来实现，也就是我只给你写标题，内容你自己填充。

基于接口而非实现编程，可以将接口和实现分离，封装不稳定的实现，暴露稳定的接口。

### 默认接口方法
在c#8.0里面，接口允许添加默认的接口方法，该方法包含实现逻辑
```csharp
public interface ILogger
{
	public void Log(string message);

	public void Log(string message, LogLevel logLevel)
	{
		Console.WriteLine("Log method of ILogger called.");
		Console.WriteLine("Log Level: "+ logLevel.ToString());
		Console.WriteLine(message);
	}
}
```
这个默认的方法不需要子类去实现，并且子类也不能调用该方法。

## 意义

- 侧重于解耦，接口是对行为的一种抽象，相当于一组协议或者契约，调用者只需要关注抽象的接口，不需要连接具体实现。

## 使用场景
类是对对象的抽象，抽象类是对类的抽象，接口是对行为的抽象。
接口对类的局部(行为)进行的抽象，而抽象类是对类的整体(字段、属性、方法)的抽象 。如果只关注行为抽象，那么就可以认为接口就是抽象类。

什么时候应该用抽象类或者用接口？
如果两个东西，他们之间有很多相似的东西，比如猫和狗，这个时候发现子类中存在公共的东西，这时候需要泛化出父类，然后子类继承父类，而接口是根本不知道子类的存在，方法如何实现还不确定，比如说我们要实现一个飞的方法，这个飞的方法可能有麻雀这个类去继承这个接口实现，也可以通过超人这个类去继承实现，他们的相同点就是可以实现飞这个行为。
因此：如果行为跨越不同类的对象，可使用接口；对于一些相似的类对象，用继承抽象类。
抽象类是先有A类，然后又有B类，这时候发现A和B类有类似的地方，于是泛化出来C类，这个时候c类就是抽象类。
接口的话是先有接口，然后我们需要通过其他方法去实现这个接口的功能。

所以我们要表示一种is-a的关系，并且是为了代码复用，那么就用抽象类。
如果要表示一种has-a的关系，并且是为了解决抽象而非代码复用问题，那么就可以使用接口。

## 操作
特点

- 接口不能包含字段，可以包含属性。
- 接口只能声明方法，方法不能包含代码的实现。
- 类在实现接口的时候，必须实现接口中声明的所有方法。
```csharp
/// <summary>
/// 定义接口
/// </summary>
public interface IUserService
{
    public string Name { get; set; }

    //接口不可包含实例字段
    //public string Password;

    int Jia(int a, int b);

    string Splice(string a, string b);
}

public class UserService : IUserService
{
    public string Name
    {
        get => throw new NotImplementedException();
        set => throw new NotImplementedException();
    }

    public int Jia(int a, int b)
    {
        throw new NotImplementedException();
    }

    public string Splice(string a, string b)
    {
        throw new NotImplementedException();
    }
}
```
继承接口就必须实现接口所有成员。

### 虚方法实现接口成员
为了重写，必须在基类中将其标识我virtual或者abstract。
```csharp
public interface IUserService
{
    int Jia(int a, int b);
}
public class UserService : IUserService
{
    public virtual int Jia(int a, int b)
    {
        return a + b;
    }
}
public class APPUserSerive : UserService
{
    public override int Jia(int a, int b)
    {
        return a + b + 1;
    }
}
```
不管从基类还是接口中调用接口成员，调用的都是子类的实现
```csharp
var appUser = new APPUserSerive();
var i = appUser.Jia(1, 2);// 4
var i2 = ((IUserService)appUser).Jia(1, 2);// 4
var i3 = ((UserService)appUser).Jia(1, 2);// 4
```
显式实现的接口成员不能标识为virtual，也不能实现通常意义的重写，但是它可以被重新实现（reimplemented）。


### 动态生成接口

可以借助组件来实现动态生成接口
[https://github.com/daver32/InterfaceGenerator](https://github.com/daver32/InterfaceGenerator)
