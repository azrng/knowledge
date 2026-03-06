---
title: 单例模式
lang: zh-CN
date: 2023-08-21
publish: true
author: azrng
isOriginal: true
category:
  - 软件设计
tag:
  - 无
filename: singletonMode
slug: mcgskk
docsId: '29634104'
---

## 概述
从本质上看，单例模式只允许被自身实例化一次，且向外部提供一个访问该实例的访问点，并且客户程序在调用某一个类时，它是不会考虑这个类是否只能有一个实例等问题的，所以，这应该是类设计者的责任，而不是类使用者的责任。

用途：有些数据在系统中只应该保存一份，就比较适合设计为单例类。比如系统中的配置信息类，还可以通过单例解决资源访问冲突问题。

总体分两类：懒汉式和饿汉式两类
三种：双判断加锁、静态字段实现、静态构造函数实现。

## 如何实现

- 构造函数需要是private访问权限，这样子避免通过外部new创建实例
- 考虑对象创建时的线程安全问题
- 考虑是否支持延迟加载
- 考虑GetInstance性能是否高(是否加锁)

## 实现要点

- Singleton模式是限制而不是改进类的创建。
- Singleton类中的实例构造器可以设置为Protected以允许子类派生。
- Singleton模式一般不要支持Icloneable接口，因为这可能导致多个对象实例，与Singleton模式的初衷违背。
- Singleton模式一般不要支持序列化，这也有可能导致多个对象实例，这也与Singleton模式的初衷违背。
- Singleton只考虑了对象创建的管理，没有考虑到销毁的管理，就支持垃圾回收的平台和对象的开销来讲，我们一般没必要对其销毁进行特殊的管理。
- 理解和扩展Singleton模式的核心是“如何控制用户使用new对一个类的构造器的任意调用”。

## 操作

### Lazy懒汉式(荐)

:::tip

因为该方法好记，且好用，所以直接放第一位

:::

Lazy类型会确保实例仅在第一次访问 Instance 属性时创建（即惰性初始化）

```c#
public sealed class Logger7 : ILogger
{
    /// <summary>
    /// Lazy类型会确保 Logger7 的实例仅在第一次访问 Instance 属性时创建（即惰性初始化）。
    /// </summary>
    private static readonly Lazy<Logger7> _lazy = new Lazy<Logger7>(() => new Logger7());

    /// <summary>
    /// 私有构造函数保证外部无法直接实例化
    /// </summary>
    private Logger7() { }

    /// <summary>
    /// 提供一个公共的只读属性用于获取单例实例
    /// </summary>
    /// <returns></returns>
    public static Logger7 GetInstance()
    {
        // lazy.Value 在首次访问时调用指定的委托来创建 SingletonClass 实例，之后每次访问都会返回相同的实例。
        return _lazy.Value;
    }

    private readonly object _writeLock = new object();

    /// <summary>
    /// 添加日志
    /// </summary>
    /// <param name="message"></param>
    public void Log(string message)
    {
        lock (_writeLock)
        {
            var path = AppContext.BaseDirectory + "/log.txt";
            if (!File.Exists(path))
            {
                File.Exists(path);
            }

            File.WriteAllText(path, message);
        }
    }
}
```

### 饿汉式

实现简单，在类加载的时候，instance静态实例就已经创建并初始化好了，所以instance实例的创建过程是线程安全的。
缺点：不支持延迟加载，如果实例占用资源多或者初始化耗时长，提前初始化实例是一种浪费资源的行为，最好应该在用到的时候才去初始化。(个人感觉这种初始化慢的才更应该提前初始化，不要等到用的时候才去初始化，这会影响系统的性能)
```csharp
public class Logger2 : ILogger
{
    private static readonly Logger2 instance = new Logger2();
    private object _lock = new object();

    private Logger2()
    { }

    public static Logger2 GetInstance()
    {
        return instance;
    }

    /// <summary>
    /// 添加日志
    /// </summary>
    /// <param name="message"></param>
    public void Log(string message)
    {
        lock (_lock)
        {
            var path = AppContext.BaseDirectory + "/log.txt";
            if (!File.Exists(path))
            {
                File.Exists(path);
            }
            File.WriteAllText(path, message);
        }
    }
}
```
该解法是在 .NET 中实现 Singleton 的首选方法，但是，由于在C#中调用静态构造函数的时机不是由程序员掌控的，而是当.NET运行时发现第一次使用该类型的时候自动调用该类型的静态构造函数（也就是说在用到的时候就会被创建，而不是用到Instance时），这样会过早地创建实例，从而降低内存的使用效率。此外，静态构造函数由 .NET Framework 负责执行初始化，我们对实例化机制的控制权也相对较少。

### 懒汉式
优点：支持延迟加载
缺点：在GetInstance方法加了一把锁，导致该函数并发度很低(每次使用都会加锁、释放锁，如果该类调用的比较频繁，那么会导致性能瓶颈，就不可取了)。不支持高并发。
```csharp
public class Logger3 : ILogger
{
    private static Logger3 _instance;
    private static object _obj = new object();

    private object _writelock = new object();

    private Logger3()
    { }

    public static Logger3 GetInstance()
    {
        lock (_obj)
        {
            if (_instance == null)
                _instance = new Logger3();

            return _instance;
        }
    }

    /// <summary>
    /// 添加日志
    /// </summary>
    /// <param name="message"></param>
    public void Log(string message)
    {
        lock (_writelock)
        {
            var path = AppContext.BaseDirectory + "/log.txt";
            if (!File.Exists(path))
            {
                File.Exists(path);
            }
            File.WriteAllText(path, message);
        }
    }
}
```

### 双重判断
优点：支持延迟加载也支持高并发。

在Instance被创建之后，即时在调用getInstance函数也不会进入到加锁的逻辑中，所以解决了懒汉式并发度低的问题。
```csharp
public class Logger4 : ILogger
{
    private static Logger4 _instance;
    private static object _obj = new object();

    private object _writelock = new object();

    private Logger4()
    { }

    public static Logger4 GetInstance()
    {
        if (_instance == null)
        {
            lock (_obj)
            {
                if (_instance == null)
                    _instance = new Logger4();
            }
        }

        return _instance;
    }

    /// <summary>
    /// 添加日志
    /// </summary>
    /// <param name="message"></param>
    public void Log(string message)
    {
        lock (_writelock)
        {
            var path = AppContext.BaseDirectory + "/log.txt";
            if (!File.Exists(path))
            {
                File.Exists(path);
            }
            File.WriteAllText(path, message);
        }
    }
}
```
该版本避免每次访问都进行加锁操作并实现线程安全。

### 静态内部类：完全懒汉式
优点：支持线程安全，有可以做到延迟加载，并且还没有加锁。
```csharp
public sealed class Logger5 : ILogger
{
    private Logger5()
    { }

    public static Logger5 GetInstance()
    {
        return Nested._instance;
    }

    /// <summary>
    /// 使用内部类+静态构造函数实现延迟初始化
    /// </summary>
    private class Nested
    {
        static Nested()
        {
        }

        internal static readonly Logger5 _instance = new Logger5();
    }

    private object _writelock = new object();

    /// <summary>
    /// 添加日志
    /// </summary>
    /// <param name="message"></param>
    public void Log(string message)
    {
        lock (_writelock)
        {
            var path = AppContext.BaseDirectory + "/log.txt";
            if (!File.Exists(path))
            {
                File.Exists(path);
            }
            File.WriteAllText(path, message);
        }
    }
}
```
该解法在内部定义了一个私有类型Nested。当第一次用到这个嵌套类型的时候，会调用静态构造函数创建的实例instance。如果我们不调用属性Instance，那么就不会触发.NET运行时（CLR）调用Nested，也就不会创建实例，因此也就保证了按需创建实例（或延迟初始化）。

## 优点

- 单例模式在内存中只有一个实例，因此减少了内存的开支，特别是当一个对象需要频繁地创建、销毁而且创建或销毁时性能又无法优化时单例模式的优势就很明显了。
- 由于单例模式值生成一个实例，所以系统的性能开销被大大的降低，当一个对象的产生需要比较多的资源时，例如读取配置、产生其他依赖对象时，在可以通过在应用启动时直接产生一个单例对象，然后用永久驻留内存的方式来解决。
- 单例模式可以避免对资源的多重占用，例如在写一个文件时由于内存中只有一个实例存在，因此对这一个资源文件加锁后可以避免对同一个资源文件的同时写操作。
- 单例模式可以在系统设置全局访问点，优化和共享资源访问，例如可以设计一个单例类来负责所有数据表的映射处理。

## 缺点

- 单例对OOP特性的支持不友好
   - 违背了基于接口而非实现的设计原则，修改的话改动就会比较大。
- 会隐藏类之间的依赖关系
   - 如果是通过构造函数、参数传递等方式声明的类之间的依赖关系，我们通过查看函数的定义，就能很容易识别出来这个来依赖了哪些外部类，但是单例类不需要显示创建、不需要依赖参数传递，在函数中直接调用就可以。
- 对代码扩展性不友好
   - 单例类是只能有一个对象示例，但是如果后期代码想创建两个或者多个实例，会对代码有比较大的改动。
- 可测试性不友好
   - 不方便单元测试
- 不支持有参数的构造函数
- 单例不支持有参数的构造函数，比如我们创建一个连接池的单例对象，我们没法通过参数来指定连接池的大小。

## 使用场景
通常在一个系统中，要求某些类有且仅有一个对象。如果出现多个对象就会出现一些不必要的问题时可以采用单例模式

- 要求生成唯一序列号的环境
- 在整个项目中需要一个共享访问点或共享数据，例如一个前端页面上的计数器，不需要把每一次刷新都记录到数据库中，使用单例模式保持计数器的值，还可以确保线程是安全的。
- 创建一个对象需要消耗的资源过多，例如要访问IO和数据库等资源时可以使用单例模式
- 需要定义大量的静态常量以及静态方法的环境，例如需要定义大量工具类的环境也可以采用单例模式

## 单一实例的范围
单例模式默认是进程内唯一。

### 实现线程唯一实例
借助一个线程安全的静态集合来实现一个线程对应一个对象
```csharp
/// <summary>
/// 线程内唯一实例
/// </summary>
public sealed class Logger6 : ILogger
{
    private Logger6()
    { }

    //借助一个字典来存储对象，其中key是线程ID value是对象
    //这样子就可以做到不同的线程对应不同的对象，同一个线程对应一个对象
    private static readonly ConcurrentDictionary<int, Logger6> _instances = new ConcurrentDictionary<int, Logger6>();

    public static Logger6 GetInstance()
    {
        var currentThreadId = Thread.CurrentThread.ManagedThreadId;
        _instances.TryAdd(currentThreadId, new Logger6());
        return _instances[currentThreadId];
    }

    private object _writelock = new object();

    /// <summary>
    /// 添加日志
    /// </summary>
    /// <param name="message"></param>
    public void Log(string message)
    {
        lock (_writelock)
        {
            var path = AppContext.BaseDirectory + "/log.txt";
            if (!File.Exists(path))
            {
                File.Exists(path);
            }
            File.WriteAllText(path, message);
        }
    }
}
```

### 集群单例
实现进程间单例(并不是严格的按照不同的进程间共享一个对象来实现)，需要一个进程获取到对象的之后，需要对对象加锁，避免其他进程将其获取，在进程使用完这个对象之后，还需要显式将对象从内存中删除，并且释放对象的加锁。

思路：可以借助分布式锁来实现。
