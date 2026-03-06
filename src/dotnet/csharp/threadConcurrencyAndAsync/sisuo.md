---
title: 死锁和活锁的发生以及避免
lang: zh-CN
date: 2023-10-22
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 无
filename: sisuo
slug: sc8oas
docsId: '64464924'
---

## 什么是死锁
多线程编程的时候，如果涉及到同时读写共享资源数据，就容易产生因争夺系统资源而产生相互等待的现象。

## 原理
 当一组进程中的每个进程都在等待某个事件发生，而只有这组进程中的其他进程才能触发该事件，这就称这组进程发生了死锁。

## 本质原因

- 系统资源有限
- 进程推进顺序不合理

## 必要条件

- 互斥： 某种资源一次只允许一个进程访问，即该资源一旦分配给某个进程，其他进程就不能再访问，直到该进程访问结束。
- 占有且等待： 一个进程本身占有资源（一种或多种），同时还有资源未得到满足，正在等待其他进程释放该资源。
- 不可抢占： 别人已经占有了某项资源，你不能因为自己也需要该资源，就去把别人的资源抢过来。
- 循环等待： 存在一个进程链，使得每个进程都占有下一个进程所需的至少一种资源。

 当以上四个条件均满足，必然会造成死锁，发生死锁的进程无法进行下去，它们所持有的资源也无法释放。这样会导致CPU的吞吐量下降。所以死锁情况是会浪费系统资源和影响计算机的使用性能的。那么，解决死锁问题就是相当有必要的了。

## 避免方法

### 死锁预防
确保系统永远不会进入死锁状态，产生死锁需要四个条件，那么，只要这四个条件中至少有一个条件得不到满足，就不可能发生死锁了。由于互斥条件是非共享资源所必须的，不仅不能改变，还应加以保证，所以，主要是破坏产生死锁的其他三个条件。

- 破坏“占有且等待”条件
   - 方法1：所有的进程在开始运行之前，必须一次性地申请其在整个运行过程中所需要的全部资源。
      - 优点：简单易实施且安全。
      -  缺点：因为某项资源不满足，进程无法启动，而其他已经满足了的资源也不会得到利用，严重降低了资源的利用率，造成资源浪费。使进程经常发生饥饿现象。
   - 方法2：该方法是对第一种方法的改进，允许进程只获得运行初期需要的资源，便开始运行，在运行过程中逐步释放掉分配到的已经使用完毕的资源，然后再去请求新的资源。这样的话，资源的利用率会得到提高，也会减少进程的饥饿问题。
- 破坏“不可抢占”条件
   - 当一个已经持有了一些资源的进程在提出新的资源请求没有得到满足时，它必须释放已经保持的所有资源，待以后需要使用的时候再重新申请。这就意味着进程已占有的资源会被短暂地释放或者说是被抢占了。该种方法实现起来比较复杂，且代价也比较大。释放已经保持的资源很有可能会导致进程之前的工作实效等，反复的申请和释放资源会导致进程的执行被无限的推迟，这不仅会延长进程的周转周期，还会影响系统的吞吐量。
- 破坏“循环等待”条件
   - 可以通过定义资源类型的线性顺序来预防，可将每个资源编号，当一个进程占有编号为i的资源时，那么它下一次申请资源只能申请编号大于i的资源。如图所示：

![image.png](/common/1641741990477-4581335f-ad6d-4fb2-a2eb-446874eba095.png)
这样虽然避免了循环等待，但是这种方法是比较低效的，资源的执行速度回变慢，并且可能在没有必要的情况下拒绝资源的访问，比如说，进程c想要申请资源1，如果资源1并没有被其他进程占有，此时将它分配个进程c是没有问题的，但是为了避免产生循环等待，该申请会被拒绝，这样就降低了资源的利用率

### 避免死锁

在使用前进行判断，只允许不会产生死锁的进程申请资源
两种避免办法：
    1、如果一个进程的请求会导致死锁，则不启动该进程
    2、如果一个进程的增加资源请求会导致死锁 ，则拒绝该申请。
死锁避免的优点：不需要死锁预防中的抢占和重新运行进程，并且比死锁预防的限制要少。
死锁避免的限制：

*  必须事先声明每个进程请求的最大资源量
*  考虑的进程必须无关的，也就是说，它们执行的顺序必须没有任何同步要求的限制
*  分配的资源数目必须是固定的。
* 在占有资源时，进程不能退出

### 死锁检测与解除
在检测到运行系统进入死锁，进行恢复。如果利用死锁检测算法检测出系统已经出现了死锁 ，那么，此时就需要对系统采取相应的措施。常用的解除死锁的方法：
1、抢占资源：从一个或多个进程中抢占足够数量的资源分配给死锁进程，以解除死锁状态。
2、终止（或撤销)进程：终止或撤销系统中的一个或多个死锁进程，直至打破死锁状态。
    a、终止所有的死锁进程。这种方式简单粗暴，但是代价很大，很有可能会导致一些已经运行了很久的进程前功尽弃。
     b、逐个终止进程，直至死锁状态解除。该方法的代价也很大，因为每终止一个进程就需要使用死锁检测来检测系统当前是否处于死锁状态。另外，每次终止进程的时候终止那个进程呢？每次都应该采用最优策略来选择一个“代价最小”的进程来解除死锁状态。一般根据如下几个方面来决定终止哪个进程：

* 进程的优先级
*  进程已运行时间以及运行完成还需要的时间
* 进程已占用系统资源
* 进程运行完成还需要的资源
* 终止进程数目
* 进程是交互还是批处理

## 示例

### 避免多线程同时读写共享数据

在实际开发中，难免会遇到多线程读写共享数据的需求。比如在某个业务处理时，先获取共享数据（比如是一个计数），再利用共享数据进行某些计算和业务处理，最后把共享数据修改为一个新的值。由于是多个线程同时操作，某个线程取得共享数据后，紧接着共享数据可能又被其它线程修改了，那么这个线程取得的数据就是错误的旧数据。我们来看一个具体代码示例：

```csharp
static int count { get; set; }

static void Main(string[] args)
{
    for (int i = 1; i <= 2; i++)
    {
        var thread = new Thread(ThreadMethod);
        thread.Start(i);
        Thread.Sleep(500);
    }
}

static void ThreadMethod(object threadNo)
{
    while (true)
    {
        var temp = count;
        Console.WriteLine("线程 " + threadNo + " 读取计数");
        Thread.Sleep(1000); // 模拟耗时工作
        count = temp + 1;
        Console.WriteLine("线程 " + threadNo + " 已将计数增加至: " + count);
        Thread.Sleep(1000);
    }
}
```

示例中开启了两个独立的线程开始工作并计数，假使当 ThreadMethod 被执行第 4 次的时候（即此刻 count 值应为 4），count 值的变化过程应该是：1、2、3、4，而实际运行时计数的的变化却是：1、1、2、2...。也就是说，除了第一次，后面每次，两个线程读取到的计数都是旧的错误数据，这个错误数据我们把它叫作脏数据。
因此，对共享数据进行读写时，应视其为独占资源，进行排它访问，避免同时读写。在一个线程对其进行读写时，其它线程必须等待。避免同时读写共享数据最简单的方法就是加锁。
修改一下示例，对 count 加锁：

```csharp
static int count { get; set; }
static readonly object key = new object();

static void Main(string[] args)
{
    ...
}

static void ThreadMethod(object threadNumber)
{
    while (true)
    {
        lock(key)
        {
            var temp = count;
            ...
             count = temp + 1;
            ...
        }
        Thread.Sleep(1000);
    }
}
```

这样就保证了同时只能有一个线程对共享数据进行读写，避免出现脏数据。

### 死锁的发生

上面为了解决多线程同时读写共享数据问题，引入了锁。但如果同一个线程需要在一个任务内占用多个独占资源，这又会带来新的问题：死锁。简单来说，当线程在请求独占资源得不到满足而等待时，又不释放已占有资源，就会出现死锁。死锁就是多个线程同时彼此循环等待，都等着另一方释放其占有的资源给自己用，你等我，我待你，你我永远都处在彼此等待的状态，陷入僵局。下面用示例演示死锁是如何发生的：

```csharp
class Program
{
    static void Main(string[] args)
    {
        var workers = new Workers();
        workers.StartThreads();
        var output = workers.GetResult();
        Console.WriteLine(output);
    }
}

class Workers
{
    Thread thread1, thread2;

    object resourceA = new object();
    object resourceB = new object();

    string output;

    public void StartThreads()
    {
        thread1 = new Thread(Thread1DoWork);
        thread2 = new Thread(Thread2DoWork);
        thread1.Start();
        thread2.Start();
    }

    public string GetResult()
    {
        thread1.Join();
        thread2.Join();
        return output;
    }

    public void Thread1DoWork()
    {
        lock (resourceA)
        {
            Thread.Sleep(100);
            lock (resourceB)
            {
                output += "T1#";
            }
        }
    }

    public void Thread2DoWork()
    {
        lock (resourceB)
        {
            Thread.Sleep(100);
            lock (resourceA)
            {
                output += "T2#";
            }
        }
    }
}
```

示例运行后永远没有输出结果，发生了死锁。线程 1 工作时锁定了资源 A，期间需要锁定使用资源 B；但此时资源 B 被线程 2 独占，恰巧资线程 2 此时又在待资源 A 被释放；而资源 A 又被线程 1 占用......，如此，双方陷入了永远的循环等待中。

### 死锁的避免

针对以上出现死锁的情况，要避免死锁，可以使用 Monitor.TryEnter(obj, timeout) 方法来检查某个对象是否被占用。这个方法尝试获取指定对象的独占权限，如果 timeout 时间内依然不能获得该对象的访问权，则主动“屈服”，调用 Thread.Yield() 方法把该线程已占用的其它资源交还给 CUP，这样其它等待该资源的线程就可以继续执行了。即，线程在请求独占资源得不到满足时，主动作出让步，避免造成死锁。
把上面示例代码的 Workers 类的 Thread1DoWork 方法使用 Monitor.TryEnter 修改一下：

```csharp
// ...（省略相同代码）
public void Thread1DoWork()
{
    bool mustDoWork = true;
    while (mustDoWork)
    {
        lock (resourceA)
        {
            Thread.Sleep(100);
            if (Monitor.TryEnter(resourceB, 0))
            {
                output += "T1#";
                mustDoWork = false;
                Monitor.Exit(resourceB);
            }
        }
        if (mustDoWork) Thread.Yield();
    }
}

public void Thread2DoWork()
{
    lock (resourceB)
    {
        Thread.Sleep(100);
        lock (resourceA)
        {
            output += "T2#";
        }
    }
}
```

再次运行示例，程序正常输出 T2#T1## 并正常结束，解决了死锁问题。
注意，这个解决方法依赖于线程 2 对其所需的独占资源的固执占有和线程 1 愿意“屈服”作出让步，让线程 2 总是优先执行。同时注意，线程 1 在锁定 resourceA 后，由于争夺不到 resourceB，作出了让步，把已占有的 resourceA 释放掉后，就必须等线程 2 使用完 resourceA 重新锁定 resourceA 再重做工作。
正因为线程 2 总是优先，所以，如果线程 2 占用 resourceA 或 resourceB 的频率非常高（比如外面再嵌套一个类似 while(true) 的循环 ），那么就可能导致线程 1 一直无法获得所需要的资源，这种现象叫线程饥饿，是由高优先级线程吞噬低优先级线程 CPU 执行时间的原因造成的。线程饥饿除了这种的原因，还有可能是线程在等待一个本身也处于永久等待完成的任务。
我们可以继续开个脑洞，上面示例中，如果线程 2 也愿意让步，会出现什么情况呢？

### 活锁的发生和避免

我们把上面示例改造一下，使线程 2 也愿意让步：

```csharp
public void Thread1DoWork()
{
    bool mustDoWork = true;
    Thread.Sleep(100);
    while (mustDoWork)
    {
        lock (resourceA)
        {
            Console.WriteLine("T1 重做");
            Thread.Sleep(1000);
            if (Monitor.TryEnter(resourceB, 0))
            {
                output += "T1#";
                mustDoWork = false;
                Monitor.Exit(resourceB);
            }
        }
        if (mustDoWork) Thread.Yield();
    }
}

public void Thread2DoWork()
{
    bool mustDoWork = true;
    Thread.Sleep(100);
    while (mustDoWork)
    {
        lock (resourceB)
        {
            Console.WriteLine("T2 重做");
            Thread.Sleep(1100);
            if (Monitor.TryEnter(resourceA, 0))
            {
                output += "T2#";
                mustDoWork = false;
                Monitor.Exit(resourceB);
            }
        }
        if (mustDoWork) Thread.Yield();
    }
}
```

注意，为了使我要演示的效果更明显，我把两个线程的 Thread.Sleep 时间拉开了一点点。运行后的效果如下：
![](/common/1644585637407-d3786b48-9411-4e83-9e2c-98c436dbac2b.webp)
通过观察运行效果，我们发现线程 1 和线程 2 一直在相互让步，然后不断重新开始。两个线程都无法进入 Monitor.TryEnter 代码块，虽然都在运行，但却没有真正地干活。
我们把这种线程一直处于运行状态但其任务却一直无法进展的现象称为活锁。活锁和死锁的区别在于，处于活锁的线程是运行状态，而处于死锁的线程表现为等待；活锁有可能自行解开，死锁则不能。
要避免活锁，就要合理预估各线程对独占资源的占用时间，并合理安排任务调用时间间隔，要格外小心。现实中，这种业务场景很少见。示例中这种复杂的资源占用逻辑，很容易把人搞蒙，而且极不容易维护。推荐的做法是使用信号量机制代替锁。

## 总结

我们应该避免多线程同时读写共享数据，避免的方式，最简单的就是加锁，把共享数据作为独占资源来进行排它使用。
多个线程在一次任务中需要对多个独占资源加锁时，就可能因相互循环等待而出现死锁。要避免死锁，就至少得有一个线程作出让步。即，在发现自己需要的资源得不到满足时，就要主动释放已占有的资源，以让别的线程可以顺利执行完成。
大部分情况安排一个线程让步便可避免死锁，但在复杂业务中可能会有多个线程互相让步的情况造成活锁。为了避免活锁，需要合理安排线程任务调用的时间间隔，而这会使得业务代码变得非常复杂。更好的做法是放弃使用锁，而换成使用信号量机制来实现对资源的独占访问。

## 参考资料

[死锁的四个必要条件和解决办法](https://blog.csdn.net/guaiguaihenguai/article/details/80303835)

[https://mp.weixin.qq.com/s/_LvMR5bGaaNNMRlhL52d0A](https://mp.weixin.qq.com/s/_LvMR5bGaaNNMRlhL52d0A) | C#.NET 死锁和活锁的发生及避免
