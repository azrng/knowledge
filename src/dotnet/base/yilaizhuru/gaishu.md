---
title: 概述
lang: zh-CN
date: 2022-11-20
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: gaishu
slug: cyrwmb
docsId: '29987940'
---

## 介绍
依赖注入是一种具体的编码技巧(是控制反转思想的一种重要的实现方式)，英文翻译是Dependency Injection，缩写DI。

不要依赖于具体的实现，应该依赖于抽象，高层模块不应该依赖于底层模块，二者应该依赖于抽象。简单的说就是为了更好的解耦。而控制反转(Ioc)就是这样的原则的其中一个**实现思想**, 这个思路的其中一种实现方式就是依赖注入(DI)。只要是用过new实例化的都是存在依赖的。


不用过new()的方式在类的内部创建依赖类对象，而是将依赖的类对象在外部创建好之后，通过构造函数、函数参数等方式传递(或者注入)给类使用。

### 优点
1.传统的程序，每个对象负责管理与自己需要依赖的对象，导致如果需要切换依赖对象的实现类时候，需要改动比较大。
2.依赖注入把对象的创建交给外部去管理，很好的解决了代码耦合的问题，是一种让代码实现松耦合的机制。
3.松耦合使代码更具有灵活性，能更好的应对需求变动，以及方便单元测试。

### 依赖注入VS工厂模式
(1)原始社会里，没有社会分工。须要斧子的人(调用者)仅仅能自己去磨一把斧子(被调用者)。相应的情形为:软件程序里的调用者自己创建被调用者。
(2)进入工业社会，工厂出现。斧子不再由普通人完毕，而在工厂里被生产出来，此时须要斧子的人(调用者)找到工厂，购买斧子，无须关心斧子的制造过程。相应软件程序的简单工厂的设计模式。
(3)进入“按需分配”社会，需要斧子的人不需要找到工厂，坐在家里发出一个简单指令:须要斧子。斧子就自然出如今他面前。比如.NetCore的**依赖注入**。

## 实现原理
实现DI，核心在于注入容器（IContainer），该容器具有下面的以下功能
1.容器保存可用的服务集合
2.提供一种方式将各种部件与他们依赖的服务绑定到一起
3.为应用程序提供一种方式来请求已配置的对象：构造函数注入、属性注入，
运行时，框架会一层层通过反射构造事例，最终得到完整的对象。
**利用反射产生对象是依赖注入的核心过程。**

## 项目中依赖例子
```csharp
public class A : D
{
	public A(B b)
    {
        // do something   
    }
    C c = new C();
}
```
就比如说我们项目中的控制器，只要是通过new实例化的，都是存在依赖的
```csharp
public async Task<List<Advertisement>> Get(int id)
{
    IAdvertisementServices advertisementServices = new AdvertisementServices();
    return await advertisementServices.Query(d => d.Id == id);
}
```
日志记录：有时需要调试分析，需要记录日志信息，这时可以采用输出到控制台、文件、数据库、远程服务器等；假设最初采用输出到控制台，直接在程序中实例化ILogger logger = new ConsoleLogger()，但有时又需要输出到别的文件中，也许关闭日志输出，就需要更改程序，把ConsoleLogger改成FileLogger或者NoLogger， new FileLogger()或者new SqlLogger() ，此时不断的更改代码，就显得不好了，如果采用依赖注入，就显得特别舒畅。

## 依赖注入框架
通过依赖注入框架提供的扩展点，简单配置一下所有需要创建的类对象、类与类之间的依赖关系，就可以实现由框架自动创建对象、管理对象的生命周期、依赖注入等原来需要程序来做的事情。

比如：AutoFac、.NetCore默认IOC

## 注入方式

### 构造函数注入
在`LoggerServer`类中，定义一个私有变量`_logger`, 然后通过构造函数的方式传递依赖
```csharp
public class LoggerServer
{
    private ILogger _logger; //1. 定义私有变量
    //2.构造函数
    public LoggerServer(ILogger logger)
    {
        //3.注入 ，传递依赖
     this._logger = logger; 
    }

    public void AddLogger()
    {
      _logger.AddLogger();
    }
}
```
通过控制台程序调用，先在外部创建依赖对象，而后通过构造的方式注入依赖
```csharp
        static void Main(string[] args)
        {
            #region 构造函数注入
            // 注入控制台输出方式
            // 外部创建依赖的对象 -> ConsoleLogger
            ConsoleLogger console = new ConsoleLogger();
            // 通过构造函数注入 -> LoggerServer
            LoggerServer loggerServer1 = new LoggerServer(console);
            loggerServer1.AddLogger();


            // 注入 文件输出方式
            FileLogger file = new FileLogger();
            // 通过构造函数注入 -> LoggerServer
            LoggerServer loggerServer2 = new LoggerServer(file);
            loggerServer2.AddLogger();
            
            #endregion

            Console.Read();
        }
```

### 属性注入
通过定义一个属性来传递依赖
```csharp
/// <summary>
/// 定义一个输出日志的统一类
/// </summary>
public class LoggerServer
{
	//1.定义一个属性，可接收外部赋值依赖
	public ILogger _logger { get; set; }
	public void AddLogger()
	{
		_logger.AddLogger();
	}
}
```
通过控制台，定义不同的方式，通过不同依赖赋值，实现不同的验证结果：
```csharp
static void Main(string[] args)
{
	#region 属性注入
	// 注入 控制台输出方式

	//外部创建依赖的对象 -> ConsoleLogger
	ConsoleLogger console = new ConsoleLogger();
	LoggerServer loggerServer1 = new LoggerServer();
	//给内部的属性赋值
	loggerServer1._logger = console;
	loggerServer1.AddLogger();

	// 注入 文件输出方式

	//外部创建依赖的对象 -> FileLogger
	FileLogger file = new FileLogger();
	LoggerServer loggerServer2 = new LoggerServer();
	//给内部的属性赋值
	loggerServer2._logger = file;
	loggerServer2.AddLogger();

	#endregion

	Console.Read();
}
```

### 接口注入
先定义一个接口，包含一个设置依赖的方法。
```csharp
public interface IDependent
{
	void SetDepend(ILogger logger);//设置依赖项
}	
```
这个与之前的注入方式不一样，而是通过在类中**「继承并实现这个接口」**。
```csharp
public class VerificationServer : IDependent
{
	private ILogger _logger;
	// 继承接口，并实现依赖项方法，注入依赖
	public void SetDepend(ILogger logger)
	{
		_logger = logger;
	}
	public void AddLogger()
	{
		_logger.AddLogger();
	}
}
```
通过调用，直接通过依赖项方法，传递依赖
```csharp
static void Main(string[] args)
{
	#region 接口注入
	// 注入 控制台输出方式
	//外部创建依赖的对象 -> ConsoleLogger
	ConsoleLogger console = new ConsoleLogger();
	LoggerServer loggerServer1 = new LoggerServer();
	//给内部赋值，通过接口的方式传递
	loggerServer1.SetDepend(console);
	loggerServer1.AddLogger();

	//注入  文件输出方式
	//外部创建依赖的对象 -> FileLogger
	FileLogger file = new FileLogger();
	LoggerServer loggerServer2 = new LoggerServer();	
	//给内部赋值，通过接口的方式传递
	loggerServer2.SetDepend(file);
	loggerServer2.AddLogger();

	#endregion

	Console.Read();
}
```

## 资料
[[官方]ASP.NET Core 依赖注入](https://docs.microsoft.com/zh-cn/aspnet/core/fundamentals/dependency-injection?view=aspnetcore-2.2)
[全面理解 ASP.NET Core 依赖注入](https://www.cnblogs.com/jesse2013/p/di-in-aspnetcore.html)
官方推荐通过构造函数，也就是所谓的显示依赖。
[ASP.NET Core 中依赖注入的N种玩法](https://www.cnblogs.com/artech/p/di-asp-net-core-pipeline-2.html)
[ASP.NET Core 自定义特性实现属性注入](https://www.cnblogs.com/viter/p/11085318.html)
[ASP.NET Core 原生DI实现批量注册](http://www.cnblogs.com/ShenNan/p/10256562.html)
 
 
