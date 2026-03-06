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
  - thread
---

## 什么是线程

线程（Thread）是操作系统能够进行运算调度的最小单位，也是程序中能够并发执行的一段序列。它是进程中的实际运作单位，一个进程中可以包含多个线程，每条线程并行执行不同的任务，这些线程共享进程的资源。严格意义上来说，同一时间可以并行运行的线程数取决于 CPU 的核数。

单线程应用：在进程的独立环境里面只能跑一个新线程，所以该线程拥有独占权。

## 什么是多线程

多线程编程是指使用多个线程同时执行任务。这些线程可能是由操作系统调度的，也可以由开发人员手动创建和管理。在多线程编程中，我们通常需要考虑许多问题，如线程同步、死锁、竞态条件等等

### 为什么需要多线程？

* 批量重复任务希望同时执行，比如对于数组中的每个元素都进行相同且耗时的操作
* 多个不同任务希望同时执行，互不干扰，例如有多个后台线程需要做轮询操作等

### 优点

1.可以提高cpu利用率，因为当一个线程处于等待状态时候，cpu会去执行另外的线程
2.提高cpu利用率，就可以提高程序的整体执行速度

### 缺点

1.线程开的越多，内存占用越大
2.协调和管理代码的难度加大，需要cpu时间跟踪线程
3.线程之间对资源的共享可能会产生不可预知的问题。
线程是寄托在进程上的，如果进程都结束了，线程也不复存在。

## 术语

### 线程被抢占
当线程执行到与另外的线程代码执行交织的那一点，这就是线程被抢占了。

### 线程开销
线程的开销实际上是非常大的，我们从空间开销和时间开销上分别讨论。

> 资料来源：[https://www.cnblogs.com/pandefu/p/17536277.html](https://www.cnblogs.com/pandefu/p/17536277.html)

#### 空间开销

线程的空间开销来自这四个部分：

1. 线程内核对象(Thread Kernel Object)。每个线程都会创建一个这样的对象，它主要包含线程上下文信息，在32位系统中，它所占用的内存在700字节左右。
2. 线程环境块(Thread Environment Block)。TEB包括线程的异常处理链，32位系统中占用4KB内存。
3. 用户模式栈(User Mode Stack),即线程栈。线程栈用于保存方法的参数、局部变量和返回值。每个线程栈占用1024KB的内存。要用完这些内存很简单，写一个不能结束的递归方法，让方法参数和返回值不停地消耗内存，很快就会发生 OutOfMemoryException 。
4. 内核模式栈(Kernel Mode Stack)。当调用操作系统的内核模式函数时，系统会将函数参数从用户模式栈复制到内核模式栈。在32位系统中，内核模式栈会占用12KB内存。

#### 时间开销
线程的时间开销来自这三个过程：

1. 线程创建的时候，系统相继初始化以上这些内存空间。
2. 接着CLR会调用所有加载DLL的DLLMain方法，并传递连接标志（线程终止的时候，也会调用DLL的DLLMain方法，并传递分离标志)。
3. 线程上下文切换。一个系统中会加载很多的进程，而一个进程又包含若干个线程。但是一个CPU内核在任何时候都只能有一个线程在执行。为了让每个线程看上去都在运行，系统会不断地切换“线程上下文”：每个线程及其短暂的执行时间片，然后就会切换到下一个线程了。这个线程上下文切换过程大概又分为以下5个步骤：
   - 步骤1进入内核模式。
   - 步骤2将上下文信息（主要是一些CPU寄存器信息）保存到正在执行的线程内核对象上。
   - 步骤3系统获取一个 Spinlock ，并确定下一个要执行的线程，然后释放 Spinlock 。如果下一个线程不在同一个进程内，则需要进行虚拟地址交换。
   - 步骤4从将被执行的线程内核对象上载入上下文信息。
   - 步骤5离开内核模式。

所以，由于要进行如此多的工作，所以创建和销毁一个线程就意味着代价“昂贵”，即使现在的CPU多核多线程，如无节制的使用线程，依旧会严重影响性能。

## 线程属性

- 线程一旦开始执行，IsAlive就是true，线程结束就变成了false。
- 线程结束的条件就是：线程构造函数传入的委托结束了执行。
- 线程一旦结束，就无法重启。
- 每个线程都有一个Name属性，通常用于调试
   - 线程的Name只能设置一次，以后在修改就会抛出异常。
- 静态的Thread.CurrentThread属性，会返回当前执行的线程。
```shell
//设置当前线程线程名
Thread.CurrentThread.Name = "main thread";

//输出当前线程名字
System.Console.WriteLine(Thread.CurrentThread.Name);
```
| 常用属性 | 说明 |
| --- | --- |
| CurrentThread | 获取当前正在运行的线程 |
| IsAlive | 获取一个值，该值指示当前线程的执行状态 |
| IsBackground | 获取或设置一个值，该值指示某个线程是否为后台线程， 后台线程会随前台线程的关闭而退出 |
| IsThreadPoolThread | 获取一个值，该值指示线程是否属于托管线程池 |
| ManagedThreadId | 获取当前托管线程的唯一标识符 |
| Name | 获取或设置线程的名称 |
| Priority | 获取或设置一个值，该值指示线程的调度优先级 |
| ThreadState | 获取一个值，该值包含当前线程的状态 |

## 注意事项

### Thread限制

- 线程(Thread)是用来创建并发的一种低代码工具，它有一些限制，比如：
  - 虽然开始线程的时候可以方便传入数据，但是当Join的时候，很难从线程获取返回值。
    - 可能需要设置一些共享字段
    - 如果抛出异常，捕获和传播该异常都很麻烦
  - 无法告诉线程在结束的时候开始做另外的工作，你必须进行Join操作(在进程中阻塞该线程)
- 很难使用较小的并发来组建大型的并发。
- 导致对手动同步的更大依赖。

### 异常处理

- 在创建线程时在作用域的范围内try/catch/finally块，在线程开始执行后就与线程无关了。(意思就是开始线程后，里面出现异常了，线程外的try不能捕获到这个异常)

```shell
internal class ThreadTest
{
    private static void Main()
    {
        try
        {
            new Thread(() =>
            {
                Console.WriteLine("aaa");
                throw new AggregateException("异常");
            }).Start();
        }
        catch (Exception ex)
        {
            Console.WriteLine("错误" + ex.Message);
        }
        /*
         * 输出结果：
         aaa
         Unhandled exception. System.AggregateException: 异常
             at ThreadTest.<>c.<Main>b__0_0() in E:\Test\ConsoleApp3\ConsoleApp3\Program.cs:line 27
             at System.Threading.Thread.StartCallback()
        
        解决方案：将try加入到线程方法里面
         */

    }
}
```

## 进程操作

进程：每个线程都在操作系统的进程内执行，而操作系统进程提供了程序运行的独立环境。

### 获取进程

`Process.GetProcessesXXX`方法通过名称或者进程ID来检查执行的进程或者检索本机或者指定名称的计算机中所有的进程(包含托管和非托管进程)。
获取当前计算机上所有执行中的进程：

```csharp
foreach (var item in Process.GetProcesses())
{
    Console.WriteLine(item.ProcessName);
    Console.WriteLine($"    PID {item.Id}");
    Console.WriteLine($"    Memory {item.WorkingSet64}");
    Console.WriteLine($"    Threads {item.Threads.Count}");
}
//返回当前的进程
var currProcessName = Process.GetCurrentProcess().ProcessName;
Console.WriteLine(currProcessName);
//终结进程
var process = Process.GetProcessById(13976);
process.Kill();
```

### 开启一个进程

通过Process类来开启进程

```csharp
var p = Process.Start("D:\\Soft\\cat\\RunCat.exe");

//延迟3s
Thread.Sleep(4000);

//杀掉进程
p.Kill();
```

[https://mp.weixin.qq.com/s/vJ7T-GgThzUEBAnIDesCfQ](https://mp.weixin.qq.com/s/vJ7T-GgThzUEBAnIDesCfQ) | 【.NET】几行代码识别.NET程序进程(包括`.NET FX`和`.NET Core+`)

## 线程操作

### 获取线程
```csharp
//获取某一个进程里面的所有线程
var process = Process.GetProcessById(13976);
if (!process.HasExited)
    return;
foreach (ProcessThread item in process.Threads)
{
    Console.WriteLine(item.Id);
    Console.WriteLine($"    state:{item.ThreadState}");
    Console.WriteLine($"    priority:{item.PriorityLevel}");
    Console.WriteLine($"    started:{item.StartTime}");
    Console.WriteLine($"    cpu time:{item.TotalProcessorTime}");
}
```
Thread.CurrentThread 是一个 静态的 Thread 类，Thread 的CurrentThread 属性，可以获取到当前运行线程的一些信息
```csharp
var currentThread = Thread.CurrentThread;
Console.WriteLine("线程标识：" + currentThread.Name);
Console.WriteLine("当前地域：" + currentThread.CurrentCulture.Name);
Console.WriteLine("线程执行状态：" + currentThread.IsAlive);
Console.WriteLine("是否为后台线程：" + currentThread.IsBackground);
Console.WriteLine("是否为线程池线程" + currentThread.IsThreadPoolThread);
```

### 创建新线程
#### Thread

- Start
   - 不带参数：new Thread(()=>{ xxxxx }).Start();
   - 带参数：new Thread((obj)=>{ xxxx }).Start();
- Join
   - 类似于Task.Wait()方法的作用
   - 不带超时参数：thread.Join()
   - 带超时参数：thread.Join(1000*5)
- Sleep
   - 冻结当前线程指定的删减：`Thread.Sleep(1000*5)`
- IsBackground属性
   - 指明当前线程为后台线程，默认是前台线程
   - 如果主线程退出，后台线程自动退出
   - 只有所有的前台线程都退出 ，主线程才能退出
```csharp
// 创建两个新的 Thread
var thread1 = new Thread(() => PerformAction("Thread", 1));
var thread2 = new Thread(() => PerformAction("Thread", 2));

// 开始执行线程任务
thread1.Start();
thread2.Start();

// 等待两个线程执行完成
thread1.Join();
thread2.Join();

Console.WriteLine("done!");

void PerformAction(string str, int num)
{
    Console.WriteLine($"num:{num}  内容：{str}");
}
```
实际使用中，关于thread的使用不多，因为它较为底层

- 线程太多，造成上下文奇切换频繁(CPU爆高)
   - 比如创建了5000个thread，假设都在执行耗时任务，而运行的服务器只有6核12线程，必然会造成频繁的上下文切换
- GC负担过大，徒增GC负担
   - 比如创建了5000个thread跑了任务之后，虽然没有引用根了，但是GC还没有及时回收，这个时候他们就是dead thread，它们都在托管堆上
- 一些方案
   - ThreadPool：线程池
   - Task：基于ThreadPool的上层封装

#### Timer
后台线程
```csharp
Console.WriteLine("当前线程ID：" + Environment.CurrentManagedThreadId);
//Timer：后台线程
var timer = new Timer(delegate
{
    //阻塞3秒
    Thread.Sleep(3000);
    Console.WriteLine($"Timer Thread ID: {Thread.CurrentThread.ManagedThreadId}");
    Console.WriteLine($"{DateTime.Now.Second} Timer tick");
}, null, 0, 3000);

Console.ReadLine();
/*
输出结果：
当前线程ID：1
Timer Thread ID: 6
19 Timer tick
Timer Thread ID: 9
22 Timer tick
Timer Thread ID: 6
25 Timer tick
Timer Thread ID: 4
28 Timer tick
*/
```

#### PeriodicTimer
.Net6新增加的东西。

- 异步执行
- 前台线程
```csharp
//间隔时间1秒
Console.WriteLine($"主线程ID：{Environment.CurrentManagedThreadId}");
using (var timer = new PeriodicTimer(TimeSpan.FromSeconds(1)))
{
    //在到达指定周期后执行方法
    while (await timer.WaitForNextTickAsync())
    {
        await Task.Delay(3000);

        Console.WriteLine($"Timer Thread: {Thread.CurrentThread.ManagedThreadId}");
        Console.WriteLine($"{DateTime.Now.Second} PeriodicTimer tick");
    }
}
//输出结果
主线程ID：1
Timer Thread: 8
25 PeriodicTimer tick
Timer Thread: 8
28 PeriodicTimer tick
Timer Thread: 4
31 PeriodicTimer tick
Timer Thread: 4
34 PeriodicTimer tick
Timer Thread: 4
37 PeriodicTimer tick
```
停止定时器
```csharp
//创建CancellationTokenSource，指定在3秒后将被取消
var cts = new CancellationTokenSource(TimeSpan.FromSeconds(3));

using (var timer = new PeriodicTimer(TimeSpan.FromSeconds(1)))
{
    while (await timer.WaitForNextTickAsync(cts.Token))
    {
        Console.WriteLine($"{DateTime.Now.Second} PeriodicTimer tick");
    }
}
```
会引发OperationCancelled异常，你需要捕获该异常，然后根据需要进行处理。
也可以通过主动取消CancellationTokenSource，来停止PeriodicTimer计时，换成了TaskCancelled异常。示例代码如下：
```csharp
var cts = new CancellationTokenSource();

using (var timer = new PeriodicTimer(TimeSpan.FromSeconds(1)))
{
    int count = 0;
    while (await timer.WaitForNextTickAsync(cts.Token))
    {
        if (++count == 3)
        {
            //执行3次后取消
            cts.Cancel();
        }
        Console.WriteLine($"{DateTime.Now.Second} PeriodicTimer tick");
    }
}
```
如果，你不想抛出异常，则可以用PeriodicTimer.Dispose方法来停止计时，示例代码如下：
```csharp
using (var timer = new PeriodicTimer(TimeSpan.FromSeconds(1)))
{
    int count = 0;
    while (await timer.WaitForNextTickAsync())
    {
        if (++count == 3)
        {
            //执行3次后取消
            timer.Dispose();
        }
        Console.WriteLine($"{DateTime.Now.Second} PeriodicTimer tick");
    }
}
```

### 线程的状态
ThreadState是一个flags枚举，标识了线程的执行状态，，里面包含多种状态。

- 大多数枚举值不常用，常用的有四个：Unstarted、Running、WaitSleepJoin和Stopped。
> 注意：ThreadState属性可用于诊断的目录，但是不适用于同步，因为线程的状态可能会在测试ThreadState和对该信息进行操作之间发生变化。

```csharp
[Flags]
public enum ThreadState
{
	Running = 0x0,
	StopRequested = 0x1,
	SuspendRequested = 0x2,
	Background = 0x4,
	Unstarted = 0x8,
	Stopped = 0x10,
	WaitSleepJoin = 0x20,
	Suspended = 0x40,
	AbortRequested = 0x80,
	Aborted = 0x100
}
```
| **枚举** | **枚举** | **说明** |
| --- | --- | --- |
| Aborted | 256 | 该线程现在已死，但其状态尚未更改为 Stopped |
| AbortRequested | 128 | 已对线程调用了 Abort(Object) 方法，但线程尚未收到试图终止它的挂起的 ThreadAbortException |
| Background | 4 | 线程正作为后台线程执行 |
| Running | 0 | 线程已启动且尚未停止 |
| Stopped | 16 | 线程已停止 |
| StopRequested | 1 | 正在请求线程停止 |
| Suspended | 64 | 线程已挂起 |
| SuspendRequested | 2 | 正在请求线程挂起 |
| Unstarted | 8 | 尚未对线程调用 Start() 方法 |
| WaitSleepJoin | 32 | 线程阻塞中 |

![image.png](/common/1639900402748-a0260873-3100-4c5e-977a-a343ffaa4665.png)
刚刚创建的线程处于已经准备好运行，但是还没有运行的状态，称为Ready(准备)状态。在操作系统的调度之下，这个线程可以进入(Runing)运行状态。运行状态的线程可能因为时间片用完的缘故被操作系统切换出CPU，称为Suspended(暂停运行)状态，也可能在时间片还没有用完的情况下，因为等待其他优先级更高的任务，而转换到Blocked(阻塞)状态。在阻塞状态下的线程，随时可以因为再次调度而重新进入运行状态。线程还可能通过Sleep方法进入Sleep(睡眠)状态，当睡眠时间到期之后，可以再次被调度运行。处于运行状态的线程还可能被主动终止执行，直接结束；也可能因为任务已经完成，被操作系统正常结束。
```csharp
static void Main()
{
    var currentThread = Thread.CurrentThread;
    Console.WriteLine(currentThread.ThreadState);
}
```
> 注意：线程的 ThreadState 属性，并不能表面线程实时状态。因为线程执行时，可能会被 CPU 夺取时间片


### 控制线程数量
当线程数量达到一定数量，就意味着计算机管理不过来了，并且开线程也需要内存支持，防着内存被耗尽。
新开的线程可能需要等待相当长时间才会开始执行，因为这个是通过计算机调度决定的。比如你使用for循环开启一堆线程，然后再去开启新线程看下多久可以执行。线程切换也会造成性能损耗。

不要滥用线程，也不要滥用过多的线程，当工作需要去新开线程的时候，要仔细考虑该工作是否真正需要开启线程去解决，即时需要使用线程，也推荐使用线程池解决。



::: details 通过信号量去限制创建线程的数量

```csharp
// 通过信号量去控制可以进入多少个线程
var semaphore = new SemaphoreSlim(5);

var list = Enumerable.Range(0, 50);

var hash = new HashSet<int>();
foreach (var item in list)
{
    await semaphore.WaitAsync();
    _ = Task.Run(() =>
    {
        try
        {
            // 处理
            Handler();
        }
        catch (Exception ex)
        {
            // 异常处理
            Console.WriteLine(ex.Message);
        }
        finally
        {
            // 归还线程
            semaphore.Release();
        }
    });
}

Console.ReadLine();
Console.WriteLine(hash.Count);

string Handler()
{
    Thread.Sleep(1000);
    Console.WriteLine(Environment.CurrentManagedThreadId + "   " + DateTime.Now.ToLongTimeString());
    hash.Add(Environment.CurrentManagedThreadId);
    return "success";
}
```

:::

### I/O密集和计算密集
I/O密集：一个操作的绝大部分时间都在等待事件的发生。比如读取或者写入文件。  
计算密集：操作的大部分时间都用来执行大量的CPU操作。

### 上下文切换

- windows系统大概30ms进行一次上下文切换，如果上下文切换非常频繁，会造成CPU爆高
- 在上下文切换的时候涉及CPU和与Thread的交互
   - 时间片到了，线程暂停，涉及到的数据保存(将高速缓存的数据存到线程的本地存储中)
   - 时间片分配，thread恢复，涉及到数据恢复(从线程的环境块中将当时的数据重新提取出来)

### 阻塞线程

- 如果线程的执行由于某种原因导致暂停，那么就认为该线程被阻塞了。
   - 例如通过Sleep或者通过Join等待其他线程的结束。
- 被阻塞的线程会立即将其处理的时间片还给其他线程，从此不再消耗处理器时间，直到满足阻塞条件(阻塞时间结束)为止。
- 可以通过ThreadState这个属性来判断线程是否处于被阻塞状态。
```shell
bool isBlocked = (t.ThreadState & ThreadState.WaitSleepJoin) != 0;
```
> 注意：当线程被阻塞或者解除阻塞时候，操作系统会进行一次上下文切换，这会导致细小的开销，一般在1到2毫秒左右。


#### Sleep
Thread.Sleep() 、Thread.Yield() 方法可以将当前线程挂起一段时间。
> 注意：Thread.Sleep() 将会导致线程立即放弃自己的时间片，将 CPU 交于其他的线程，而 Thread.Yield() 虽然交出时间片，但是**它只会将资源交给同一个处理器上运行的线程**。另一方面，及时没有其它线程要运行了，Thread.Sleep(xxx) 也会保证当前的线程继续休眠一段时间，而 Thread.Yield() 则会让不出来（没有其它线程可以要用 CPU），而且 Thread.Yield() 只是把 CPU 让一下，很快又会被分配时间片的。当然，如果是使用 Thread.Sleep(0) ，也会达到相同效果。


资料：[https://threads.whuanle.cn/1.thread_basic/1.thread](https://threads.whuanle.cn/1.thread_basic/1.thread)

#### Join
调用Thread的Join方法可以等待线程结束。
Thread.Join() 方法可以阻塞当前线程一直等待另一个线程运行至结束，需要两个线程配合。
示例： A 线程等待 B 线程执行完成，A 线程才能继续执行。
```csharp
static void Main()
{
	var thread = new Thread(Print);
	Console.WriteLine("开始执行线程 B");
	thread.Start();

	// 开始等待另一个完成完成
	thread.Join();
	Console.WriteLine("线程 B 已经完成");
}

public static void Print()
{
	for (int i = 0; i < 10; i++)
	{
		Console.WriteLine(i);
		Thread.Sleep(1000);
	}
}
```

##### 添加超时

- 调用Join的时候，可以设置一个超时时间，用毫秒或者TimeSpan都可以。
   - 如果返回true，那么就是线程结束了，如果超时了，那么就返回false。
- Thread.Sleep()方法会暂停当前的线程，并等一段时间。
> Thread.Sleep(0)将会导致线程立即放弃自己的时间片，自觉地将CPU交于其他的线程。Thread.Yield()执行相同的操作，但是它仅仅会将资源交给同一个处理器上运行的线程。**在等待线程Sleep或者Join的过程中，线程是阻塞(blocked)的.**

```shell
//开启一个新的线程
Thread t = new Thread(WriteY);
t.Name = "y thread";
//设置线程的优先级(只是提议)
t.Priority = ThreadPriority.Highest; //0-31
t.Start();

//t.Join(2000);
//或者
//t.Join(TimeSpan.FromSeconds(2));

if (t.Join(2000))
    Console.WriteLine("线程结束");
else
    Console.WriteLine("超时了");


static void WriteY()
{
    System.Console.WriteLine(Thread.CurrentThread.Name);
    for (int i = 0; i < 1000; i++)
        System.Console.Write("y");

    Thread.Sleep(5000);
}
```
结果输出超时了。

#### Wait方法
调用Task的Wait方法可以阻塞当前方法，直到任务结束。

#### 解除阻塞
当遇到下面四种情况的时候，就会接触阻塞

- 阻塞条件被满足
- 操作超时(前提是设置了超时)
- 通过Thread.Interrupt()进行打断
- 通过Theead.Abort()进行中止

### 阻塞与自旋
阻塞：设置线程来阻塞线程。
同步等待：在当前线程上同步的等待，比如Console.ReadLine()、Thread.Sleep()、Thread.Join()
```csharp
while(DataTime.Now < nextStartTime)
    Thread.Sleep(100);
```
异步的操作，在稍后操作完成时候出发一个回调操作。
```shell
var writeTask = WriteY().GetAwaiter();
writeTask.OnCompleted(() =>
{
    writeTask.GetResult();
    global::System.Console.WriteLine("执行结束");
});

Console.ReadLine();

static async Task WriteY()
{
    await Task.Delay(2000);

    Console.WriteLine(Thread.CurrentThread.Name);
    for (int i = 0; i < 1000; i++)
        Console.Write("y");
}
```
自旋：使得程序一直在当前代码循环。
```csharp
while(DataTime.Now < nextStartTime);

// 在.net中提供了特殊的方法来提供帮助SpinLock SpinWait
```
如果只是短暂的自旋是非常搞笑的，因为避免了上下文切换带来的延迟和开销。阻塞也并非是零开销，因为每个线程在存活的时候会占用1MB的内存，并对CLR和操作系统带来持续性的管理开销。

### 线程等待
线程等待有内核模式(Kernel Mode)和用户模式(User Model)。
因为只有操作系统才能控制线程的生命周期，因此使用 Thread.Sleep() 等方式阻塞线程，发生上下文切换，此种等待称为内核模式。
用户模式使线程等待，并不需要线程切换上下文，而是让线程通过执行一些无意义的运算，实现等待。也称为自旋。

Thread.Sleep(); 会阻塞线程，使得线程交出时间片，然后处于休眠状态，直至被重新唤醒；适合用于长时间的等待，过段的线程等待，这种切换代价比较昂贵；
Thread.SpinWait(); 使用了自旋等待，等待过程中会进行一些的运算，线程不会休眠，用于微小的时间等待；长时间等待会影响性能；
SpinWait.SpinUntil()；是Thread.SpinWait新的实现。
Task.Delay(); 用于异步中的等待

### 终止线程
Abort() 方法不能在 .NET Core 上使用，不然会出现` System.PlatformNotSupportedException:“Thread abort is not supported on this platform.”` 。

| 方法 | 说明 |
| --- | --- |
| Abort() | 在调用此方法的线程上引发 ThreadAbortException，以开始终止此线程的过程。 调用此方法通常会终止线程。 |
| Abort(Object) | 引发在其上调用的线程中的 ThreadAbortException以开始处理终止线程，同时提供有关线程终止的异常信息。 调用此方法通常会终止线程。 |

Abort() 方法给线程注入 ThreadAbortException 异常，导致线程被终止。
虽然 Abort() 不能用，但是还有 Thread.Interrupt() 可以用，它可以**中断处于 WaitSleepJoin 线程状态的线程**。当对另一个线程调用 Interrupt 时，会弹出 System.Threading.ThreadInterruptedException 异常，导致线程中止。在调试环境下，可能会导致 Vistual Studio 弹出异常，直接启动编译后的程序或者不使用调试模式运行，则不会弹出异常。

> 注意：如果线程不会处于 WaitSleepJoin 状态，而是一直运行，则 Interrupt() 函数对线程无效

```csharp
long value = 0;

var thread = new Thread((obj) =>
{
    try
    {
        for (long i = 0; i < 100; i++)
        {
            value++;
            Thread.Sleep(1000);
        }
    }
    catch (ThreadInterruptedException e)
    {
        Console.WriteLine("线程被终止");
    }
});
Console.WriteLine("开始执行线程 B");

thread.Start();

Console.WriteLine("等待终止线程");

// 等待2秒
Thread.Sleep(2000);
thread.Interrupt();
Console.WriteLine($"value:{value}");
```

如何模拟出来一直运行的效果取消不了的情况，那就是while(true)，且里面不包含等待的方法

```c#
long value = 0;

var thread = new Thread((obj) =>
{
    try
    {
        while (true)
        {
            // 如果里面没有任何要阻塞的操作，那么就会一直执行，取消不了
            // 如果真遇到这个情况，那么就需要做一个等待的代码
            // 为什么要写0那，因为我们的目的是让存在等待的代码，以允许我们执行线程取消，为什么不写1的，因为如果写1，实际也不会等待1毫秒
            Thread.Sleep(0);
        }
    }
    catch (ThreadInterruptedException e)
    {
        Console.WriteLine("线程被终止");
    }
});
Console.WriteLine("开始执行线程 B");

thread.Start();

Console.WriteLine("等待终止线程");

// 等待2秒
Thread.Sleep(2000);
thread.Interrupt();
Console.WriteLine($"value:{value}");
```

所以要求while(true)中必须要包含等待的方法，比如IO操作、Thread.Sleep等

### 线程不确定性

线程的不确定性是指几个并发运行的线程，不确定下一次 CPU 时间片会分配给谁(当然，分配有优先级)。
多线程是并发运行的，但一般 CPU 没有那么多核，不可能在同一时刻执行所有的线程。CPU 会决定某个时刻将时间片分配给多个线程中的一个线程，这就出现了 CPU 的时间片分配调度。

### 跨线程数据共享

#### 跨线程使用
不建议跨线程使用数据
```csharp
for (int i = 0; i < 10; i++)
{
    new Thread(() =>
    {
        Console.WriteLine(i);
    }).Start();
}

//输出结果
2
3
2
4
5
6
7
8
8
10
```
这是因为一个cpu核心修改了变量的值但是还没有写到内存的时候，另一个cpu读取到了旧的值，便会出现脏读。可以修改为
```csharp
for (int i = 0; i < 10; i++)
{
    new Thread(() =>
    {
        var value = i;
        Console.WriteLine(value);
    }).Start();
}

//输出结果
1
2
3
4
5
6
7
8
9
10
```
每个线程单独存储一个变量，读写时不会相互干扰

#### 线程共享

##### Local本地独立
CLR为每个线程分配自己的内存栈，以便使得本地变量保持独立。

##### Shared共享

- 如果多个线程都引用到同一个对象的实例，那么他们就共享了数据。
```csharp
class ThreadTest
{
    bool _done;

    private static void Main()
    {
        //由于是在同一个示例上调用的go(),所以他们共享_done
        ThreadTest tt = new ThreadTest();
        new Thread(tt.Go).Start();
        tt.Go();//结果就是只打印一次done！
    }

    private void Go()
    {
        if (!_done)
        {
            _done = true;
            Console.WriteLine("done!");
        }
    }
}
```

- 被Lambda表达式或者匿名委托捕捉的本地变量，会被编译器转换成字段(field),所以也会被共享。
```csharp
internal class ThreadTest
{
    private static void Main()
    {
        bool _done = false;
        ThreadStart action = () =>
        {
            if (!_done)
            {
                _done = true;
                Console.WriteLine("done!");
            }
        };

        new Thread(action).Start();
        action();
        //当_done被lambda捕捉到之后，就转换为ThreadTest类的一个字段，然后输出一次done！
    }
}
```

- 静态字段(field)也会在线程间共享数据。
```csharp
internal class ThreadTest
{
    //静态字段在同一个应用域下的所有线程中被共享
    static bool _done;

    private static void Main()
    {
        new Thread(Go).Start();
        Go();//结果就是只打印一次done！
    }

    static void Go()
    {
        if (!_done)
        {
            _done = true;
            Console.WriteLine("done!");
        }
    }
}
```
上面三个示例的输出实际上是无法确定的，有可能会被打印两次。

#### 安全(锁)
尽可能避免使用共享状态。

- 在读取和写入共享数据的时候，通过使用一个互斥锁，就可以解决前面的例子。
- c#使用lock锁或者Monitor，前者是后者的语法糖。
   - 锁对象应该是在多个线程中可见的同一对象
   - 在非静态方法中，静态变量不应该作为锁对象
   - 值类型不能作为锁对象
   - 避免将字符串作为锁对象
   - 降低锁对象的可见性
- 当两个线程同时竞争一个锁的时候，一个线程会等待或者阻塞，直到锁变为可用状态。

- 在多线程上下文中，通过上面的lock来避免不确定的代码就叫做**线程安全。**
- lock也会引起一些问题，比如死锁。

##### 往线程传递数据

- 如果想往线程的启动方法里传递参数，最简单的方法就是使用lambda表达式，在里面使用参数调用方法。
```shell
internal class ThreadTest
{
    private static void Main()
    {
        new Thread(() => Go("hello")).Start();
    }

    static void Go(string message)
    {
        Console.WriteLine(message);
    }
}
```

- 甚至可以将整个逻辑写入到线程lamdba中。
- 在c#3.0之前，没有lambda表达式，可以通过使用Thread的Start方法来传递参数。
- 使用lambda表达式传递参数，但是当线程开始后，可能会不小心修改捕获的变量。

```shell
internal class ThreadTest
{
    private static void Main()
    {
        for (int i = 0; i < 10; i++)
        {
            var temp = i;
            new Thread(() =>
            {
                Console.Write(temp);
            }).Start();
        }
        /*
         i在循环的整个生命周期内指向的是同一个内存地址
        每个线程对Console.WriteLine的调用都会在他运行的时候对它进行修改
        解决方案是每次循环的时候定义一个单独的变量来接收。
         */
    }
}
```

### 后台线程
根据线程运行模式，可以把线程分为前台线程、后台线程和守护（Daemon）线程：
1.前台线程：主程序必须等待线程执行完毕后才可退出程序。C## 中的 Thread 默认为前台线程，也可以设置为后台线程。
2.后台线程：主程序执行完毕立即跟随退出，不管后台线程是否执行完毕，都会被终止。C## 的 ThreadPool 管理的线程默认为后台线程。
3.守护线程：守护线程拥有自动结束自己生命周期的特点，它通常被用来执行一些后台任务。

> 注意：线程的前台、后台状态与它的优先级无关(所分配的执行时间)

```csharp
internal class ThreadTest
{
    private static void Main()
    {
        //当num大于0时候，被设置为后台线程，直接结束，当是前台线程的时候，会一直在等待输入
        var num = -1;
        var thread = new Thread(() =>
        {
            Thread.Sleep(3000);
            for (int i = 0; i < 10; i++)
            {
                Console.Write(i);
            }
        });
        if (num > 0)
        {
            thread.IsBackground = true;
        }
        thread.Start();
        Console.WriteLine("主线程执行完毕");
        //num=-1；先输出主线程执行完毕，在输出0123456789
        //num=1；直接输出主线程执行完毕，程序退出，因为前台线程都已经执行结束
    }
}
```
如果设置为后台线程，那么执行完发现没有前台线程就直接退出了。这种终止的方法，后台线程执行栈中的finally块就不会被执行了，如果想让执行，可以在退出程序的时候使用join来等待线程(前提条件是该线程是自己创建的)。

- 应用程序无法退出的一个常见原因是因为还有活跃的前台线程。

### 线程优先级
线程的Priority属性可以决定相对于其他活跃的线程当前线程在操作系统中执行时间的长短。
优先级分为：enum ThreadPrioity{ Lowest, BelowNormal , Normal, AboveNormal , Highest}
线程的优先级从高到低：Highest>Normal>Lowest
```csharp
var thread1 = new Thread(() =>
{
    Console.WriteLine("thread1");
});
thread1.Name = "thread1";
thread1.Priority = ThreadPriority.Highest; //设置优先级，只是建议0-31

thread1.Start();
```

#### 提升线程优先级

- 提供线程优先级需要注意，因为可能会“饿死”其他线程。
- 如果想让某线程的优先级比其他进程中线程高，那么就必须提升进程的优先级。
   - 使用System.Diagnostics下的Process类。
- 适合于一些工作量少，但是要求较低延迟的非UI进程中。
- 对于需要大量计算的应用程序(尤其是有UI的应用程序)，提高进程优先级可能使得其他进程饿死，从而降低整个计算机的速度。

### 线程的死锁
死锁：当两个线程同时需要对方手中的锁时候，各自都在等对方放弃手中的锁，而使得程序无限期的等待下去，称为死锁。
```c#
public static async Task<JObject> GetJsonAsync(Uri uri)
{
  using (var client = new HttpClient())
  {
    var jsonString = await client.GetStringAsync(uri);
    return JObject.Parse(jsonString);
  }
}
// 上层调用方法
public class MyController : ApiController
{
  public string Get()
  {
    var jsonTask = GetJsonAsync(...);
    return jsonTask.Result.ToString();
  }
}
```
> 控制权返回到上层调用函数时，执行流使用Result/(Wait方法)等待任务结果，Result/Wait()会导致调用线程同步阻塞(等待任务完成)， 而异步任务执行完成后，会尝试利用捕获的同步上下文执行后继代码，这样形成死锁。

解决以上死锁有两种写法：

- 不在混用异步、同步写法，始终使用async/await语法糖编写异步代码
- 在等待的异步任务时候应该使用VonfigureAwait(false)方法

## 实操

### 线程超时取消

实现一个方法执行指定时间如果还没完成就直接取消，异步任务如何取消需要看异步任务的文章

#### ThreadJoin

借助Join方法来进行等待指定时间然后终止线程

```csharp
var thread = new Thread(Foo);
thread.Start();
if (!thread.Join(TimeSpan.FromSeconds(2)))
{
    // 终止线程
    thread.Interrupt();
}

Console.WriteLine("Done");

void Foo()
{
    try
    {
        Console.WriteLine("Foo start ...");
        Thread.Sleep(5000);
        Console.WriteLine("Foo end");
    }
    catch (ThreadInterruptedException ex)
    {
        Console.WriteLine($"Foo interrupted  message:{ex.Message}");
    }
}
```

### 使用Double Check来创建对象

```c#
internal IDictionary KeyTable
{
    get
    {
        if (this._keyTable == null)
        {
            lock (base._lock)
            {
                if (this._keyTable == null)
                {
                    this._keyTable = new Hashtable();
                }
            }
        }
        return this._keyTable;
    }
}
```

创建单例对象是很常见的一种编程情况。一般在 lock 语句后就会直接创建对象了，但这不够安全。因为在 lock 锁定对象之前，可能已经有多个线程进入到了第一个 if 语句中。如果不加第二个 if 语句，则单例对象会被重复创建，新的实例替代掉旧的实例。如果单例对象中已有数据不允许被破坏或者别的什么原因，则应考虑使用 Double Check 技术。

### 多线程消费队列数据

```c#
using System.Collections.Concurrent;
using ConsoleApp2;

SubDeTransaction();

void SubDeTransaction()
{
    var list = new List<AssetRepayment>();
    for (int i = 0; i < 1000; i++)
    {
        list.Add(new AssetRepayment() { Title = i + "---" + Guid.NewGuid() });
    }

    if (!list.Any())
    {
        Console.WriteLine("没有可执行的数据");
        return;
    }

    ConcurrentQueue<AssetRepayment> queues = new ConcurrentQueue<AssetRepayment>();

    Console.WriteLine("可执行的数据:" + list.Count + "条");
    foreach (var item in list)
    {
        queues.Enqueue(item);
    }

    var tasks = new List<Task>();
    // 定义线程数
    for (int i = 0; i < 4; i++)
    {
        var task = Task.Run(() => { Process(queues); });
        tasks.Add(task);
    }

    var taskList = Task.Factory.ContinueWhenAll(tasks.ToArray(), (ts) => { });
    taskList.Wait();
}

// 处理
void Process(ConcurrentQueue<AssetRepayment> queues)
{
    while (true)
    {
        var isExit = queues.TryDequeue(out var repayId);
        if (!isExit)
        {
            break;
        }

        try
        {
            Console.WriteLine(repayId.Title);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
        }
    }
}
```

## 对比

### Thread、ThreadPool 和 Task
* Thread

实际的操作系统级别的线程(os线程),有自己的栈和内核资源，Thread允许最高程度的控制，你可以abort、suspend或resume一个线程，你还可以监听它的状态，设置他的堆栈大小和culture等属性。Thread的开销成本很高，你的每一个线程都会为它的堆栈消耗相对较多的内存，并且在线程之间的处理器上下切换时会在增加额外的cpu开销。

* ThreadPool

ThreadPool(线程池)是一堆线程的包装器，由CLR维护。你对线程池的线程没有任何的控制权，你甚至都不知道线程池什么时候开始执行你提交的任务，你只能控制线程池的大小。简单来说线程池调用线程的机制是，它首先调用已经创建的空闲线程来执行你的任务，如果当前没有空闲的线程，可能会创建新的线程，也可能会进行等待。
使用ThreadPool可以避免创建创建太多线程的开销。但是如果你向ThreadPool提交了太多长时间运行的任务，它可能会被填满，这个时候你提交的后面的任务可能最终会等待前面的长时间运行的任务执行完成。线程池没有提供任何方法来检测一个工作任务何时完成，也没有方法来获取结果。因此，ThreadPool最好用于调度者不需要结果的短时操作。

* Task

Task和ThreadPool一样，Task并不会创建自己的OS线程。相反，Task是由TaskScheduler调度器执行的，默认的调度器只是在ThreadPool上运行。与ThreadPool不同的是，Task还允许你知道他完成的时间，并获取返回一个结果，你可以在现有的Task上调用ContinueWith(),使他在任务完成后运行更多的代码(如果它已经完成，就会立即运行回调)，你也可以通过调用 Wait() 来同步等待一个任务的完成（或者，通过获取它的 Result 属性）。与 Thread.Join() 一样，这将阻塞调用线程，直到任务完成。通常不建议同步等待任务执行完成，它使调用线程无法进行任何其他工作。如果当前线程要等待其它线程任务执行完成，建议使用 async/await 异步等待，这样当前线程可以空闲出来去处理其它任务，比如在 await Task.Delay() 时，并不占用线程资源。由于任务仍然在 ThreadPool 上运行，因此不应该将其用于长时任务的执行，因为它们会填满线程池并阻塞新的工作任务。相反，Task 提供了一个 LongRunning 选项，它将告诉 TaskScheduler 启用一个新的线程，而不是在 ThreadPool 上运行(Task.Factory.StartNew(要执行的方法名称, 方法参数, TaskCreationOptions.LongRunning))。
Task.Factory.StartNew
可以使用比Task更多的参数，可以认为Task.Run是简化了Task.Factory.StartNew 的使用，除了需要指定一个线程是长时间占用的(线程池就不会鞥带这个线程的回收)，否则就使用 Task.Run

* 总结

**大多数情况我们应该使用 Task，而不要直接使用 Thread，除非你明确知道你需要一个独立的线程来执行一个长耗时的任务。**
**关于Thread和Task的区别：Thread更底层，Task更抽象。**
看后感：
**Thread创建的线程是前台线程，线程池中的是后台线程。**

## 资料
线程池相关信息： [https://www.cnblogs.com/edisonchou/p/4848131.html](https://www.cnblogs.com/edisonchou/p/4848131.html)
多线程文档：[https://www.cnblogs.com/kissdodog/category/464176.html](https://www.cnblogs.com/kissdodog/category/464176.html)
多线程、锁、同步异步、线程池、任务、async/await、并行、并发等知识点：[https://threads.whuanle.cn/](https://threads.whuanle.cn/)

多线程文章：[https://www.cnblogs.com/kissdodog/category/464176.html](https://www.cnblogs.com/kissdodog/category/464176.html)
c#中的多线程：[https://blog.gkarch.com/topic/threading.html](https://blog.gkarch.com/topic/threading.html)
[https://mp.weixin.qq.com/s/f7tVZi7QTBd5fmLsWVuj_g](https://mp.weixin.qq.com/s/f7tVZi7QTBd5fmLsWVuj_g) | C#中10种多进程之间的通讯方式
C## 多线程入门：[https://threads.whuanle.cn](https://threads.whuanle.cn)
[https://www.cnblogs.com/baibaomen-org/p/17695662.html](https://www.cnblogs.com/baibaomen-org/p/17695662.html) | .NET中测量多线程基准性能 - 百宝门园地 - 博客园

https://www.cnblogs.com/wyt007/p/9486752.html | c#多线程总结（纯干货） - 一个大西瓜咚咚咚 - 博客园
