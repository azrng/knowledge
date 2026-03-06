---
title: 线程安全与同步机制
lang: zh-CN
date: 2023-10-22
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 无
filename: xianchengtongbu
slug: uv3rw6nu9n6ndr1c
docsId: '140127306'
---

## 线程安全

多个线程访问共享资源的时候，对共享资源的访问会导致数据不一致或者达不到预期的结果。

## 同步机制

* 用于协调和控制多个线程之间执行顺序和互斥访问共享资源
* 确保线程按照特定顺序执行，避免竟态条件和数据不一致的问题
* 解决方案：可以使用锁、信号量去解决

## 原子操作

* 在执行的过程中不会被中断的操作。不可分割，要不完全执行，要不完全不会执行，没有中间状态
* 在多线程的环境下，原子操作能够保证数据的一致性和可靠性，避免出现竟态条件和数据竞争问题

Interlocked 类是借助了 CPU 提供的 锁机制 来解决线程同步的， 很显然这种级别的锁相比其他方式的锁性能伤害最小。 是一个进程锁。

示例：通过执行原子操作使得线程同步

```c#
var total = 10000;
int count = 0;
var thread1 = new Thread(ThreadMethod);
var thread2 = new Thread(ThreadMethod);
thread1.Start();
thread2.Start();

thread1.Join();
thread2.Join();

Console.WriteLine(count.ToString());
Assert.True(count == total * 2);

void ThreadMethod()
{
    for (var i = 0; i < total; i++)
    {
        Interlocked.Increment(ref count);
    }
}
```

## 线程同步

线程同步是确保多个线程按照特定的顺序或方式访问共享资源的过程。当多个线程可能同时访问和修改同一块数据时，如果没有适当的同步机制，可能会导致数据不一致或竞态条件等问题。线程同步通常通过锁、条件变量（wait/notify机制）、信号量或原子变量等机制来实现。其目的是使得在任意时刻，只有一个线程能够对共享资源进行写操作或其他非线程安全的操作，其他线程则需等待，从而维护数据的一致性。

## Monitor

### Lock

**lock**只是一个语法糖，编译器会将其转换为对 **monitor** 的调用。编译器会帮我们构建try块，并在finally块调用Monitor.Exit方法。

lock是常用的同步方式，格式为lock(object a){code b};
lock的实现原理是，如果到锁这点了是0，就代表没有加锁可以访问，然后改为1加锁状态，等执行完接着改为0，释放锁。

```
private object objLock = new object();

lock (olock)
{
   // 业务逻辑必须为同步方法，不能为异步
}
```

> 缺点：适用于单服务，如果在分布式服务中，会出现问题，因为各自服务锁各自的，并没有实现锁。

::: details Join中使用Lock锁来使得线程同步

```c#
var obj = new object();

var total = 10000;
int count = 0;
var thread1 = new Thread(ThreadMethod);
var thread2 = new Thread(ThreadMethod);
thread1.Start();
thread2.Start();

thread1.Join();
thread2.Join();

Console.WriteLine(count.ToString());
Assert.True(count == total * 2);

void ThreadMethod()
{
    for (var i = 0; i < total; i++)
    {
        lock (obj)
        {
            count++;
        }
    }
}
```

:::



::: details Parallel中使用lock锁

```csharp
{
    // 没有加锁，每次执行出来结果不同
    var sum = 0;
    Parallel.For(1, 1001, i => { sum += 1; });
    Console.WriteLine(sum);
}

{
    // 借助lock锁定字符串来操作，每次出来一样
    var sum = 0;
    Parallel.For(1, 1001, i =>
    {
        lock (nameof(Program))
        {
            sum += 1;
        }
    });
    Console.WriteLine(sum);
}

{
    // 借助lock锁定来操作，每次出来一样
    var locker = new Lock();

    var sum = 0;
    Parallel.For(1, 1001, i =>
    {
        lock (locker)
        {
            sum += 1;
        }
    });
    Console.WriteLine(sum);
}

public class Lock
{
}
```

:::

### Monitor

```c#
internal readonly object LockObject = new object();

bool lockTaken = false;
try
{
    Monitor.Enter(LockObject, ref lockTaken);
    // 处理业务逻辑
}
finally
{
    if (lockTaken)
        Monitor.Exit(LockObject);
}
```

## Mutex

:::tip

进程锁

:::

互斥锁

## Semaphore

:::tip

SemaphoreSlim不支持跨进程，Semaphore支持跨进程锁

:::

SemaphoreSlim是一个轻量级的信号量，用于控制并发访问资源的线程数量，构造函数`SemaphoreSlim(int initialCount, int maxCount)`接受两个参数：initialCount和maxCount。其中，initialCount表示信号量的初始计数器值，即可用的许可证数量。如果初始计数器值为1，意味着初始时只有一个许可证可用。
maxCount表示信号量的最大计数器值，即许可证的最大数量。如果设置最大计数器值也为1，因此信号量最多只能同时提供一个许可证。



SemaphoreSlim不属于传统的锁（如互斥锁、自旋锁），但可以看作是一种同步机制，用于控制并发访问资源的线程数量。它可以用来实现类似于锁的功能，但在实现上有所不同。

传统的锁提供了两种状态：锁定和非锁定。只有一个线程能够获取到锁，并且其他线程需要等待锁的释放。而SemaphoreSlim是基于信号量的机制，它基于计数器的方式来控制并发访问的线程数量。

SemaphoreSlim的计数器代表了可用的许可证数量，每个线程获取一个许可证表示可以进入临界区或访问资源，而计数器减少相应的数量。当计数器归零时，后续线程请求许可证将被阻塞，直到有线程释放许可证使计数器增加。因此，SemaphoreSlim可以用作一种类似锁的机制，限制并发访问资源的线程数量，保护共享资源的安全性。但与传统的锁相比，SemaphoreSlim提供了更大的灵活性，允许指定初始计数器值和最大计数器值，以及更精细的并发控制。

示例代码

```c#
/*
 * initialCount表示信号量的初始计数器值，即可用的许可证数量。在这段代码中，初始计数器值为1，意味着初始时只有一个许可证可用。
 * maxCount表示信号量的最大计数器值，即许可证的最大数量。在这段代码中，最大计数器值也为1，因此信号量最多只能同时提供一个许可证。
 */
var semaphore = new SemaphoreSlim(1, 1);

var count = 0;
var thread1 = new Thread(ThreadMethod);
var thread2 = new Thread(ThreadMethod);
thread1.Start();
thread2.Start();

thread1.Join();
thread2.Join();

Console.WriteLine(count.ToString());

void ThreadMethod()
{
    for (var i = 0; i < 10; i++)
    {
        semaphore.Wait();
        count++;
        semaphore.Release();
    }
}
```

### 对比

SemaphoreSlim 和 Semaphore 都是 .NET 中用于线程同步的类，它们都实现了信号量的概念来控制对共享资源的并发访问数量。尽管它们的基本功能相似，但两者之间存在一些关键差异：

* 跨进程支持：
  Semaphore 类支持跨进程的同步，因为它底层基于操作系统（如Windows上的Win32信号量API）。这意味着不同进程中的线程可以通过同一个命名的Semaphore进行同步。
  SemaphoreSlim 类则是针对单个进程内部的同步设计的，它不支持跨进程通信。
* 性能与开销：
  SemaphoreSlim 是一个轻量级的实现，当只需要在单个进程中进行同步，并且等待时间预期较短时，它的性能更好，开销更小，因为不需要进行内核模式切换。
  Semaphore 在调用 Wait 和 Release 方法时可能会导致上下文切换到内核模式，这相对会带来更高的性能开销。
* 构造器参数：
  两者都接受初始计数和最大计数值作为构造参数，但因为 Semaphore 支持跨进程同步，所以它可以创建具有全局唯一名称的信号量实例。
* 异步支持：
  SemaphoreSlim 提供了异步等待的方法，例如 WaitAsync()，这对于异步编程模型来说非常重要，允许线程在等待信号量释放时不被阻塞，而是可以参与其他工作直到信号量可用。
  Semaphore 原生并不直接支持异步操作，但在 .NET Framework 4.0 及以后版本中引入了 WaitHandle.AsyncWaitHandle 属性，可以间接地用于异步等待，但这通常比直接使用 SemaphoreSlim 更复杂。
* 总结起来，在大多数情况下，如果仅在单个进程中进行线程同步，并且希望利用异步特性，SemaphoreSlim 是更好的选择；而在需要跨进程同步场景下，则应使用 Semaphore。

## WaitHandler

Manual与Auto的区别主要在于：

1. 如果有多个线程都在用WaitOne等待信号量，那么每次Set()，auto只会释放一个WaitOne，而manual会全部释放
2. 调用WaitOne后，auto会自动调用Reset()方法，而manual则会保持开放

### ManualResetEvent

- 有时候你需要让某一个线程一直处于等待状态，直到接收到其他线程发来的通知，这个就叫做signaliing(发送信号)。
- 最简单的信号结构就是ManualResetEvent，也可以使用它的轻量级版本**ManualResetEventSlim**
  - 调用它上面的WaitOne方法会阻塞当前线程，直到另一个线程通过Set方法来开启信号。

![img](/common/1619275385393-17e60c0f-efa3-4346-8b98-d653d84e4b3c.webp)

多个线程可以通过调用ManualResetEvent对象的WaitOne方法进入等待或阻塞状态。当控制线程调用Set()方法，所有等待线程将恢复并继续执行。



那么它是如何工作的？在内存中保持着一个bool值，如果bool值为False，则使所有线程阻塞，反之，如果bool值为True,则使所有线程退出阻塞。当我们创建ManualResetEvent对象的实例时，我们在函数构造中传递默认的bool值，以下是实例化ManualResetEvent的例子。

```csharp
ManualResetEvent manualResetEvent = new ManualResetEvent(false);
```
在上面代码中，我们初始化了一个值为False的ManualResetEvent对象，这意味着所有调用WaitOne放的线程将被阻塞，直到有线程调用了 Set() 方法。而如果我们用值True来对ManualResetEvent对象进行初始化，所有调用WaitOne方法的线程并不会被阻塞，可以进行后续的执行。

#### WaitOne方法
   该方法阻塞当前线程并等待其他线程发送信号。如果收到信号，它将返回True，反之返回False。以下演示了如何调用该方法。
```csharp
manualResetEvent.WaitOne();
```
在WaitOne方法的第二个重载版本中，我们可以指定当前线程等待信号的时间间隔。如果在时间间隔内，没有收到信号，方法将返回False并继续执行。以下代码演示了带时间间隔参数的WaitOne调用。
```csharp
bool isSignalled = manualResetEvent.WaitOne(TimeSpan.FromSeconds(5));
```
我们指定了5秒作为WaitOne方法的参数，如果manualResetEvent对象在5秒内收到信号，它将isSignalled赋值为False。

```c#
var signal = new ManualResetEvent(false);
new Thread(() =>
{
    Console.WriteLine("watiing for signal ...");
    signal.WaitOne(); 
    signal.Dispose();
    Console.WriteLine("go signal");
}).Start();

Thread.Sleep(3000);
//等待三秒后，打开信号
signal.Set();
```

调用完Set之后，信号会变成打开状态，可以通过调用Reset方式将其再次关闭。

#### Set方法

   该方法用于给所有等待线程发送信号。Set() 方法的调用使得ManualResetEvent对象的bool变量值为True，所有线程被释放并继续执行。下面是调用的例子：
```csharp
manualResetEvent.Set();
```

#### Reset方法
   一旦我们调用了ManualResetEvent对象的Set()方法，它的bool值就变为true,我们可以调用Reset()方法来重置该值，Reset()方法重置该值为False。以下是调用Reset方法的例子：
```csharp
manualResetEvent.Reset();
```
如果我们想多次发送信号，那么我们必须在调用Set()方法后立即调用Reset()方法。

#### 示例
下面的例子展示了如何使用ManualResetEvent来释放多个线程。我们用false值实例化了ManualResetEvent对象，它将阻塞所有调用WaitOne方法的线程。我们创建了两个线程，它们调用方法GetDataFromServer，并以server数量作为参数。

在调用WaitOne方法获取第一批数量后，两个线程均等待来自调用WaitOne线程的信号。当控制线程调用manualrestEvent对象的Set方法，两个线程均被释放并继续运行。在调用Set方法后，我们立即调用了Reset方法，这将改变manualrestEvent对象的bool值为false。所以，如果线程再次调用WaitOne方法，他们仍然会被阻塞。

在从服务器获取第二批数据后，两个线程均调用了WaitOne方法。在2秒后，控制线程再次调用Set方法释放两个线程。

```csharp

class Program
{
  static ManualResetEvent manualResetEvent = new ManualResetEvent(false);
 
  static void Main(string[] args)
  {
    Task task = Task.Factory.StartNew(() =>
    {
      GetDataFromServer(1);
    });
 
    Task.Factory.StartNew(() =>
    {
      GetDataFromServer(2);
    });
 
 
    //Send first signal to get first set of data from server 1 and server 2
    manualResetEvent.Set();
    manualResetEvent.Reset();
 
    Thread.Sleep(TimeSpan.FromSeconds(2));
    //Send second signal to get second set of data from server 1 and server 2
    manualResetEvent.Set();
 
    Console.ReadLine();
 
    /* Result
      * I get first data from server1
      * I get first data from server2
      * I get second data from server1
      * I get second data from server2
      * All the data collected from server2
      * All the data collected from server1
      */
  }
 
  static void GetDataFromServer(int serverNumber)
  {
    //Calling any webservice to get data
    Console.WriteLine("I get first data from server" + serverNumber);
    manualResetEvent.WaitOne();
 
    Thread.Sleep(TimeSpan.FromSeconds(2));
    Console.WriteLine("I get second data from server" + serverNumber);
    manualResetEvent.WaitOne();
    Console.WriteLine("All the data collected from server" + serverNumber);
  }
}
```

### AutoResetEvent

## ReaderWriterLock

ReaderWriterLock 和 ReaderWriterLockSlim 都是用于多线程环境下的读写锁。它们的作用是在读操作和写操作之间提供并发性，以实现高效的线程同步。
主要区别如下：

1. 性能：ReaderWriterLockSlim 是 .NET Framework 3.5 引入的一个轻量级的读写锁实现，相对于老版本的 ReaderWriterLock，它具有更好的性能和可伸缩性。ReaderWriterLockSlim 使用了更精简的内部设计，避免了一些性能问题，尤其在高并发场景下更加高效。
2. 锁升级：ReaderWriterLockSlim 不支持锁升级（从读锁升级到写锁），而 ReaderWriterLock 支持锁升级。锁升级是指当持有读锁的线程需要获取写锁时，可以直接将读锁升级为写锁，而不需要先释放读锁再获取写锁。锁升级能够提高性能，但也带来了一些复杂性和潜在的死锁风险。
3. 资源消耗：ReaderWriterLockSlim 消耗的内存和资源更少。ReaderWriterLock 在每个线程上都会创建一个辅助的 ReaderWriterLock 对象，而 ReaderWriterLockSlim 则只需要一个实例。

综上所述，如果使用的是 .NET Framework 3.5+ 版本，并且不需要锁升级的功能，推荐使用更轻量级、性能更好的 ReaderWriterLockSlim。如果需要支持锁升级或使用较早版本的 .NET Framework，可以考虑使用 ReaderWriterLock。

## 不要造轮子

* 线程安全的单例：Lazy
* 线程安全的集合：ConcurrentBag、ConcurrentStack、ConcurrentQuene、ConcurrentDictionary
* 阻塞集合：BlockingCollection
* 通道：Channel
* 周期任务：PeriodicTimer

## 资料

轻松理解AutoResetEvent 和 ManualResetEvent：[https://blog.csdn.net/songhuangong123/article/details/131591253](https://blog.csdn.net/songhuangong123/article/details/131591253)  
[https://mp.weixin.qq.com/s/qlQGO48oiKzL2mXjet1Gdw](https://mp.weixin.qq.com/s/qlQGO48oiKzL2mXjet1Gdw) | C# AutoResetEvent线程信号  
[https://www.cnblogs.com/baibaomen-org/p/17679008.html](https://www.cnblogs.com/baibaomen-org/p/17679008.html) | C#中的ConcurrentExclusiveSchedulerPair类 - 百宝门园地 - 博客园

[https://mp.weixin.qq.com/s/5lh-fhimV0HQv8SX3tInAA](https://mp.weixin.qq.com/s/5lh-fhimV0HQv8SX3tInAA) | 自旋锁

[https://mp.weixin.qq.com/s/HOmeIHALXtCH5K-qqwsftg](https://mp.weixin.qq.com/s/HOmeIHALXtCH5K-qqwsftg) | C#中的悲观锁和乐观锁

C# 多线程并发下各种锁的性能：[https://mp.weixin.qq.com/s/88VSb3WxiN7hO859DblHMg](https://mp.weixin.qq.com/s/88VSb3WxiN7hO859DblHMg)

C#lock：给线程加锁，保证线程同步：[http://c.biancheng.net/view/2999.html](http://c.biancheng.net/view/2999.html)
[https://blog.csdn.net/czjnoe/article/details/122541287](https://blog.csdn.net/czjnoe/article/details/122541287)
锁定资源：[http://c.biancheng.net/view/3000.html](http://c.biancheng.net/view/3000.html)
c#对象锁-Monitor：[https://www.cnblogs.com/tzyy/p/4746023.html](https://www.cnblogs.com/tzyy/p/4746023.html)
[https://mp.weixin.qq.com/s/PaqlYpSnqMkVkBjXLlkktQ](https://mp.weixin.qq.com/s/PaqlYpSnqMkVkBjXLlkktQ) | C# Monitor

## 参考资料

B站：十月的寒流
