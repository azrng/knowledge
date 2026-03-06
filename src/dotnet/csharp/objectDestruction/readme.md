---
title: 说明
lang: zh-CN
date: 2023-10-22
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 无
filename: readme
slug: zz9c1g
docsId: '62040929'
---
## 概述

资源管理(尤其是内存回收)曾经是程序员的噩梦，不过在`.Net`平台中这个已经好多了，因为CLR在后台为垃圾回收做了很多事情`C#`语言中的每一个类型都代表一种资源，而这些资源又分为两类：托管资源和非托管资源。

### 托管资源

托管资源一般是指被CLR控制的内存资源，这些资源的管理可以由CLR来控制，例如程序中分配的对象，作用域内的变量等，大部分都是托管资源。由CLR管理分配和释放的资源。该类型的资源通过**GC来进行自动回收**。

### 非托管资源

不受CLR管理的对象，需要调用硬件处理的资源，如Windows内核对象，或者文件、数据库连接、套接字、COM对象等。
典型的就是IO操作，比如文件操作是磁盘，网络操作就是网卡，这些需要和独立设备通信。但是这些设备和当前程序本身并无关系，比如网卡和硬盘都是系统级别调度。所以这些资源不是CLR可以管理的，CLR只是负责类似信号传递，比如打开、关闭。所以要通知系统或者外在运行容器进行真正的处理这些通道。(摘抄自某群)，**非托管资源需要自己继承IDisposable来释放资源**

## 非托管资源的释放

### 显式释放资源

如果我们的类型使用到了非托管资源，或者需要显式地释放托管资源，那么就需要让该类型继承接口IDisposable。这相当于告诉调用者：类型对象是需要显式释放资源的，你需要调用类型的Dispose方法(**Dispose方法本身并没有释放托管内存，只有在垃圾回收的时候才会释放托管内存**)。一个标准的继承了IDisposable接口的类型应该像下面这样去实现。这种实现我们称为Dispose模式：

```csharp
public class SampleClass : IDisposable
{
	//演示创建一个非托管资源   
	private IntPtr nativeResource = Marshal.AllocHGlobal(100);

	//演示创建一个托管资源  
	private AnotherResource managedResource = new AnotherResource();
	private bool disposed = false;

	///<summary>   
	///实现IDisposable中的Dispose方法    
	///</summary>    
	public void Dispose()
	{
		//必须为true      
		Dispose(true);
		//通知垃圾回收机制不再调用终结器(析构器)      
		GC.SuppressFinalize(this);
	}

	///<summary>   
	///不是必要的,提供一个Close方法仅仅是为了更符合其他语言(如C++)的规范    
	///</summary>   
	public void Close()
	{
		Dispose();
	}    

    ///<summary>  
    /// 必需的,防止程序员忘记了显式调用Dispose方法    
    ///</summary>    
    ～SampleClass()
	{
		//必须为false       
		Dispose(false);
	}

	///<summary>    
	///非密封类修饰用protected virtual    
	///密封类修饰用private    
	///</summary>   
	///<param name="disposing"></param>  
	protected virtual void Dispose(bool disposing)
	{
		if (disposed)
		{
			return;
		}

		if (disposing)
		{
			//清理托管资源    
			if (managedResource != null)
			{
				managedResource.Dispose();
			}
		}

		//清理非托管资源       
		if (nativeResource != IntPtr.Zero)
		{
			Marshal.FreeHGlobal(nativeResource);
			nativeResource = IntPtr.Zero;
		}
		//让类型知道自己已经被释放    
		disposed = true;
	}

	public void SamplePublicMethod()
	{
		if (disposed)
		{
			throw new ObjectDisposedException("SampleClass", "SampleClass is   disposed");
		}
		//省略 xxx  
	}
}
```

如果使用到该类型，那么就需要手动去释放资源，比如

```c#
var sample = new SampleClass();
sample.SamplePublicMethod();
sample.Dispose();
```

还可以使用using语法糖来更便利释放，比如如果像下面这样使用using，编译器会自动为我们生成调用Dispose方法的IL代码：

```csharp
using (SampleClass c1 = new SampleClass())
{
	//省略
}
```

### 终结器隐式清理

在标准的Dispose模式中，我们注意到一个以`~`开头的方法，这个就是终结器，如下所示：

```csharp
///<summary>
///必须,防止程序员忘记了显式调用Dispose方法
///</summary>

～SampleClass()
{
	//必须为false   
	Dispose(false);
}
```

这个方法叫做类型的终结器。提供终结器的意义在于：我们不能奢望调用者肯定会主动调用Dispose方法，基于终结器会被垃圾回收器调用这个特点，它被用作资源释放的补救措施，避免忘记显示释放。



在`.Net`中每次使用new操作符创建对象的时候，CLR都会为该对象在堆上分配内存，一旦这些对象不再被引用，就会回收它们的内存。对于没有继承`IDisposable`接口的类型对象，垃圾回收器则会直接释放对象所占用的内存；而对于实现了`Dispose`模式的类型，在每次创建对象的时候，CLR都会将该对象的一个指针放到终结列表中，垃圾回收器在回收该对象的内存前，会首先将终结列表中的指针放到一个freachable队列中。同时，CLR还会分配专门的线程读取freachable队列，并调用对象的终结器，只有到这个时候，对象才会真正被标识为垃圾，并且在下一次进行垃圾回收时释放对象占用的内存。所以实现了Dispose模式的类型对象，起码要经过两次垃圾回收才能真正地被回收掉，因为垃圾回收机制会首先安排CLR调用终结器。基于这个特点，如果我们的类型提供了显式释放的方法来减少一次垃圾回收，同时也可以在终结器中提供隐式清理，以避免调用者忘记调用该方法而带来的资源泄漏。

:::tip

有些文章中，终结器也叫做析构器，这个叫法是`C++`中的称呼，在`C#`中这个名称叫做终结器

:::

还需要注意的是，如果调用者已经调用了`Dispose`方法进行了显示地资源释放，那么隐式释放资源(终结器)就没有必要运行了，所以可以使用`GC`提供的静态方法`SuppressFinalize`来通知垃圾回收器这一点，示例如下

```csharp
public void Dispose()
{   
    Dispose(true); 
    // 通知垃圾回收机制不再调用终结器(析构器)    
    GC.SuppressFinalize(this);
}
```

该代码中第三行进行正常的资源回收，第四行则通知垃圾回收器，不要在调用该类型的终结器了

资料：[https://mp.weixin.qq.com/s/3G59r0W8x-_rvL8gUdXAGw](https://mp.weixin.qq.com/s/3G59r0W8x-_rvL8gUdXAGw) | C#规范整理·资源管理和序列化

一张图带你了解.NET终结(Finalize)流程：[https://www.cnblogs.com/lmy5215006/p/18456380](https://www.cnblogs.com/lmy5215006/p/18456380)

### Dispose方法多次调用

:::

Dispose 不是用来给你回收内存用的，只是用来释放非托管资源的。在 Dispose 方法里把成员设为 null，并不会导致更快的内存释放。

:::

一个类型中的`Dispose`方法应该被允许多次调用而不会抛出异常，所以需要增加一个私有的布尔类型变量`disposed`，如下所示

```c#
private bool disposed = false;
```

然后在实际清理的地方加入了下面的判断语句

```c#
if (disposed)
{
    return;
}


// 省略清理部分的代码，并且在清理结束的时候设置disposed的值为true

disposed = true; 
```

这意味着如果已经被清理过了，那么就不需要再次进行了，并且如果对象被调用过`Dispose`方法，那么该对象的公开方法应该就不能使用了，所以当被调用的时候应该排除一个对象已经被释放的异常，比如

```c#
public void SamplePublicMethod()
{
    if (disposed)
    {
        throw new ObjectDisposedException("SampleClass", "SampleClass is   disposed");
    }
    
    //省略 xxx
}
```

### Dispose方法应提供一个虚方法

在标准的Dispose中，真正实现`IDisposable`接口的`Dispose`方法并没有做实际的清理工作，其实是调用下面那个带布尔参数且受保护的虚方法

```c#
protected virtual void Dispose(bool disposing)
{
   // 省略
}
```

这个是考虑到这个类型或许会被其他类集成的情况下，如果子类也许会实现自己的`Dispose`模式。受保护的虚方法用来提醒子类：**必须在实现自己清理方法的时候注意到父类的清理工作，也就是说自己的释放方法中需要调用`base.Dispose`方法**，比如下面的示例代码

```c#
public class DerivedSampleClass : SampleClass
{
    // 子类的非托管资源
    private IntPtr derivedNativeResource = Marshal.AllocHGlobal(100);

    // 子类的托管资源
    private AnotherResource derviedMangedResource = new AnotherResource();

    // 定义自己的是否释放的标识变量
    private bool derivedDisposed = false;

    protected virtual void Dispose(bool disposing)
    {
        if (derivedDisposed)
            return;

        if (disposing)
        {
            // 清理托管资源
            if (derviedMangedResource != null)
            {
                derviedMangedResource.Dispose();
            }

            //清理非托管资源       
            if (derivedNativeResource != IntPtr.Zero)
            {
                Marshal.FreeHGlobal(derivedNativeResource);
                derivedNativeResource = IntPtr.Zero;
            }

            // 调用父类的清理代码
            base.Dispose(disposing);

            //让类型知道自己已经被释放    
            derivedDisposed = true;
        }
    }
}
```

如果不提供这个受保护的虚方法，很有可能开发者设计子类的时候忽略掉父类的清理工作

## 终结器

:::tip

终结器的可以用来是避免忘记手动释放非托管资源的一个保险措施

:::

终结器就是在对象被回收之前执行的一段代码，它可以用来释放非托管资源，如文件句柄、数据库连接等。但是，终结器也会延迟对象的回收，增加内存占用和垃圾回收的时间。

如果对象有终结器，那么在对象从内存中释放之前，会执行终结器。在进行垃圾回收的时候，没有终结器的对象会直接被删除，有(挂起或者未执行的)终结器的对象在当时会保持存活，并被放到一个特殊的队列中。终结器甚至可以在对象构造器时候抛出异常时调用，因此需要注意，在编写终结器的时候，对象的字段可能并没有初始化完毕。


### 终结器代价

- 会降低内存分配和回收的速度(`GC`需要对终结器的执行进行追踪)
- 终结器延长了对象和该对象所引用的对象的生命周期，任何带有终结器的类都会被垃圾回收器自动提升到新一代(他们必须等到下一次垃圾回收的时候才会被真正的删除)
- 无法预测多个对象的终结器调用的顺序
- 开发者对于终结器调用的时机只有非常有限的控制能力
- 如果一个终结器的代码阻塞，则其他对象也无法终结
- 如果应用程序没有被完全卸载，则对象的终结器也可能无法得以执行。

### 终结器类

创建一个包含终结器的类

```csharp
public class PersonWithFinalizer
{
    public Guid Id { get; set; }

    public string Name { get; set; } = null!;

    public DateTime BirthDate { get; set; }

    ~PersonWithFinalizer()
    {
        // 终结器执行逻辑
    }
}
```

> 终结器无法声明为public或者static，无法拥有参数，无法调用基类。


### 基准测试

```csharp
/// <summary>
/// 终结器测试
/// </summary>
[GcForce(true)]
[MemoryDiagnoser]
[Orderer(SummaryOrderPolicy.FastestToSlowest)]
public class FinalizersTest
{
    [Params(1_000, 10_000, 100_000)]
    public int _n;

    private static Person _person;
    private static PersonWithFinalizer _personWithFinalizer;
    private static Person2 _person2;

    [Benchmark]
    public void PersonTest()
    {
        for (int i = 0; i < _n; i++)
        {
            _person = new Person();
        }
    }

    [Benchmark]
    public void PersonWithFinalizerTest()
    {
        for (int i = 0; i < _n; i++)
        {
            _personWithFinalizer = new PersonWithFinalizer();
        }
    }

    [Benchmark]
    public void Person2WithIDisposable()
    {
        for (int i = 0; i < _n; i++)
        {
            _person2 = new Person2();
        }
    }
}

public class Person
{
    public Guid Id { get; set; }

    public string Name { get; set; } = null!;

    public DateTime BirthDate { get; set; }
}

public class PersonWithFinalizer
{
    public Guid Id { get; set; }

    public string Name { get; set; } = null!;

    public DateTime BirthDate { get; set; }

    ~PersonWithFinalizer()
    {
        // Do something
    }
}
```

带终结器的类会慢很多，并且涉及到了gc 1代回收。

#### 优化措施

可以让 PersonWithFinalizer 类实现 IDisposable 接口的 Dispose 方法来替代终结器：

```csharp
public class Person : IDisposable
{
    private bool _disposed = false;

    public Guid Id { get; set; }

    public string Name { get; set; } = null!;

    public DateTime BirthDate { get; set; }

    public void Dispose()
    {
        Dispose(true);
        GC.SuppressFinalize(this);
    }

    protected virtual void Dispose(bool disposing)
    {
        if (!_disposed)
        {
            if (disposing)
            {
                // 释放托管资源
            }

            // 释放非托管资源

            _disposed = true;
        }
    }
}
```

### 总结

在使用 .NET 时，应尽量避免使用终结器（Finalizer）的原因有以下几个：

1. 不可控性：终结器的执行时间是不可控的，而且不同的垃圾收集器实现会有不同的终结器执行策略，这可能会导致程序行为不稳定或不可预测。
2. 性能问题：终结器的执行需要垃圾收集器进行两次扫描，一次是标记阶段，一次是清理阶段，这会导致额外的性能开销。而且，如果有多个对象需要被终结，它们的终结器会被串行执行，可能会导致长时间的停顿。
3. 内存泄漏：终结器可能会导致内存泄漏。因为对象的终结器只有在垃圾收集器扫描到对象并判断其不再被引用时才会执行，所以如果对象被引用但没有被垃圾收集器扫描到，它的终结器就不会执行，这可能会导致资源没有正确释放，从而导致内存泄漏。
4. 可替代性：终结器的功能可以使用更可控和更可预测的方式替代。比如使用 IDisposable 接口来释放资源，或者使用最新的异步资源释放 API（IAsyncDisposable）。

因此，为了确保程序的可靠性和性能，建议尽量避免使用终结器，在资源释放方面选择更可控和更可预测的方式。

## 内存泄漏

### 非托管内存泄漏

在c++这种非托管语言中，开发者需要牢记在对象不再使用的时候手动释放内存，否则就会内存泄露。在托管语言中，CLR有自动的垃圾回收系统，这种类型的错误一般不会发生。

### 何时会发生内存泄露？

应用程序在其生命周期内消耗越来越多的内存，直到最终不得不重启。

### 诊断内存泄露

最简单的避免内存泄露的方式是在编写应用程序时候主动监视内存的使用情况。

## 其他操作

### 计算实例占用

在C#中，计算一个对象占用的内存量并不是一个直接的过程，因为.NET运行时环境会为对象分配额外的内存用于管理（例如，对象头信息）。但是，我们可以通过一些方法来近似测量一个对象所占用的内存量。

内容共参考自：[https://mp.weixin.qq.com/s/acg-gQpfbhh4B1-aIYA8KQ](https://mp.weixin.qq.com/s/acg-gQpfbhh4B1-aIYA8KQ)

#### 1、**使用`GC.GetTotalMemory`方法**

`GC.GetTotalMemory`方法可以在垃圾收集前后分别调用，通过比较两者的差值来估计对象占用的内存。但这种方法只能给出一个近似值，因为垃圾收集器可能会在两次调用之间或之后回收其他对象。

```csharp
long startMemory = GC.GetTotalMemory(true);
YourObject obj = new YourObject();
long endMemory = GC.GetTotalMemory(true);
long memoryUsedByObject = endMemory - startMemory;
```

#### 2、使用`System.Runtime.Serialization.Formatters.Binary`序列化

通过序列化对象，可以得到对象的序列化大小，这可以作为一个近似的内存使用量。但请注意，序列化可能会包含一些元数据，因此结果可能不是完全准确的内存占用量。

```csharp
using System.IO;
using System.Runtime.Serialization.Formatters.Binary;

public long GetObjectMemorySize(object obj)
{
if (obj == null)
return 0;

using (MemoryStream stream = new MemoryStream())
    {
        BinaryFormatter formatter = new BinaryFormatter();
        formatter.Serialize(stream, obj);
return stream.Length;
    }
}

// 使用示例
YourObject obj = new YourObject();
long size = GetObjectMemorySize(obj);
```

#### 3、使用第三方库

有些第三方库，如`MemProfiler`或`dotMemory`，可以帮助你分析内存使用情况。这些工具可以提供更详细的内存使用报告，包括对象的内存占用和内存泄漏分析。

**注意事项**

\- 内存测量结果会受到垃圾收集的影响，因此多次运行测试并取平均值可能会得到更准确的结果。
\- 内存占用量可能因JIT编译器优化和平台差异而有所不同。
\- 测量大对象或复杂对象图的内存占用时，需要考虑引用和共享的内存。

**代码示例**

下面是一个简单的C#示例，展示了如何使用`GC.GetTotalMemory`方法来估算一个对象的内存占用量：

```csharp
using System;

public class YourObject
{
	public int[] Numbers = new int[1000]; // 假设对象包含一个较大的数组
}

class Program
{
    static void Main()
    {
            long memoryBefore = GC.GetTotalMemory(true);
                    YourObject yourObject = new YourObject();
            long memoryAfter = GC.GetTotalMemory(true);
            long memoryUsed = memoryAfter - memoryBefore;

            Console.WriteLine($"Estimated memory used by YourObject: {memoryUsed} bytes");
    }
}
```

这个示例创建了一个`YourObject`实例，并使用`GC.GetTotalMemory`方法来估算这个对象占用的内存量。请注意，这个值只是一个估计，实际的内存占用可能会因为多种因素而有所不同。

## 参考资料

.NET 性能技巧：为什么你应该避免使用终结器 Finalizer？：[https://cat.aiursoft.cn/post/2023/3/12/net-performance-tips-why-you-should-avoid-using-finalizers](https://cat.aiursoft.cn/post/2023/3/12/net-performance-tips-why-you-should-avoid-using-finalizers)
[https://mp.weixin.qq.com/s/Pr-mHbNIbNC5KgdMl7dUFw](https://mp.weixin.qq.com/s/Pr-mHbNIbNC5KgdMl7dUFw) | .Net析构函数再论(源码剖析)

