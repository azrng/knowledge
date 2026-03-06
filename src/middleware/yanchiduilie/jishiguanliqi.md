---
title: 基于C#的计时管理器
lang: zh-CN
date: 2023-01-08
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: jiyuc#dejishiguanliqi
slug: hlylir
docsId: '69574701'
---

## 需求
我早上10点20分预定了一张火车票，我需要在15分钟内支付完成，否则订单会被取消。同一时间可能会有成百上千的人预定其他火车票，我需要在每个人的15分钟期限达时候执行检查，如果还未支付则自动取消订单。

## 方案
我们搞清楚了要解决的问题以后，我们来思考方案。有经验的程序员会立即思考出下面的方案：

- 使用消息队列的延迟投送功能，每个订单添加成功后发送一个延迟15分钟的延迟消息。订单状态处理器15分钟后收到消息，检查支付状态，如果未支付则取消订单。
- Redis也有类似的功能，原理大致相同。

但我不想使用消息队列的功能，因为延迟消息投送是一种技术实现，我希望用代码反应这种业务实现，所以用纯代码来处理他。

将需要延迟执行的任务放到一个线程安全字典中，然后让一个Timer去每秒获取一下是否有可以执行的任务，如果有，那么就开始执行。

## 算法
我们的需求定时时间都在15分钟以内，假定都没有超过1个小时的或者几天的。（如果超过1个小时的，可以扩展这个设计，这篇暂时不展开讨论）
我们可考虑将一个小时分成3600秒，每秒代表一个位置来存储所有到期的订单，当下单的时候根据当前时间 加上 15分钟时间间隔，我们就可以得到15分钟以后的时间，将这个订单添加到对应的位置上。
数据结构选择：
我们选择C#中提供的最新的并发字典作为基础数据结构，Key值是3600秒中的每一秒的数值，内容是一个队列用于存放该时间点的所有订单。
![image.png](/common/1647352691149-a1d32136-7808-4a13-a26e-254843ba8767.png)
```csharp
public ConcurrentDictionary<int, ConcurrentQueue<IJob>> jobs = new ConcurrentDictionary<int, ConcurrentQueue<IJob>>();
```

## 操作
建立一个定时管理器
```csharp
public class TimerManager
{
    /// <summary>
    /// 并发字典存储需要检查的任务
    /// </summary>
    private ConcurrentDictionary<int, ConcurrentQueue<IJob>> jobs = new();

    private Timer _timer;

    public TimerManager()
    {
        _timer = new Timer(ProcessJobs, null, 0, 1000);
    }
}
```
增加一个任务到字典
```csharp
/// <summary>
/// 增加一个任务到时间字典中
/// </summary>
/// <param name="timeKey">根据延迟时间计算出的key值</param>
/// <param name="duetime">毫秒单位</param>
/// <exception cref="NotImplementedException"></exception>
public void AddJob(IJob job, TimeSpan duetime)
{
    var key = GetKey(duetime);
    var queue = new ConcurrentQueue<IJob>();
    queue.Enqueue(job);
    jobs.AddOrUpdate(key, queue, (key, jobs) =>
    {
        jobs.Enqueue(job);
        return jobs;
    });
}
```
根据时间计算Key的方法
```csharp
/// <summary>
/// 根据延迟时间生成当前键值
/// </summary>
/// <param name="dueTime">到期时间</param>
/// <returns></returns>
private int GetKey(TimeSpan dueTime)
{
    var currentDateTime = DateTime.Now;
       
    //到期时间
    var targetDateTime = currentDateTime.Add(dueTime);

    //不要忘了把分钟换算成秒，然后在和延迟时间相加就得到Key
    var key = targetDateTime.Minute * 60 + targetDateTime.Second;
    return key;
}
```
将任务添加到字典
```csharp
/// <summary>
/// 增加一个任务到时间字典中
/// </summary>
/// <param name="job">需要执行的任务</param>
/// <param name="duetime">多少时间间隔后检查</param>
public void AddJob(IJob job, TimeSpan duetime)
{
    var key = GetKey(duetime);
    var queue = new ConcurrentQueue<IJob>();
    queue.Enqueue(job);
       
    //这是并发字典的方法，这里就是当Key不存在就增加新的值进去，当Key存在就在Key的队列中增加一个新任务
    jobs.AddOrUpdate(key, queue, (key, jobs) =>
    {
        jobs.Enqueue(job);
        return jobs;
    });
}
```
计时器每秒执行时处理任务的方法，循环从队列中取出任务直到所有任务处理完毕
```csharp
/// <summary>
/// 每秒执行处理任务的方法，循环从队列中取出任务直到所有任务处理完毕
/// </summary>
/// <param name="state"></param>
private async void ProcessJobs(object state)
{
    //根据当前时间计算Key值
    var key = DateTime.Now.Minute * 60 + DateTime.Now.Second;
    Console.WriteLine(key);

    //查找Key值对应的任务队列并处理。
    var keyExists = jobs.TryGetValue(key, out var jobQueue);
    if (!keyExists) return;
    while (jobQueue.TryDequeue(out var job))
    {
        await job.Run();
    }
}
```
完整的定时管理器代码如下
```csharp
/// <summary>
/// 定时管理器
/// </summary>
public class TimerManager
{
    /// <summary>
    /// 并发字典存储需要检查的任务
    /// </summary>
    private readonly ConcurrentDictionary<int, ConcurrentQueue<IJob>> _jobs = new();

    private Timer _timer;

    public TimerManager()
    {
        // 设置定义任务,每秒去获取一下是否有任务要执行
        _timer = new Timer(ProcessJobs, null, 0, 1000);
    }


    /// <summary>
    /// 增加一个任务到时间字典中
    /// </summary>
    /// <param name="job">需要执行的任务</param>
    /// <param name="dueTime">多少时间间隔后检查</param>
    public void AddJob(IJob job, TimeSpan dueTime)
    {
        var key = GetKey(dueTime);
        var queue = new ConcurrentQueue<IJob>();
        queue.Enqueue(job);

        //这是并发字典的方法，这里就是当Key不存在就增加新的值进去，当Key存在就在Key的队列中增加一个新任务
        _jobs.AddOrUpdate(key, queue, (key, jobs) =>
        {
            jobs.Enqueue(job);
            return jobs;
        });
    }

    /// <summary>
    /// 根据延迟时间生成当前键值
    /// </summary>
    /// <param name="dueTime">到期时间</param>
    /// <returns></returns>
    private int GetKey(TimeSpan dueTime)
    {
        //到期时间
        var targetDateTime = DateTime.Now.Add(dueTime);

        //不要忘了把分钟换算成秒，然后在和延迟时间相加就得到Key
        var key = targetDateTime.Minute * 60 + targetDateTime.Second;
        return key;
    }

    /// <summary>
    /// 每秒执行处理任务的方法，循环从队列中取出任务直到所有任务处理完毕
    /// </summary>
    /// <param name="state"></param>
    private async void ProcessJobs(object state)
    {
        //根据当前时间计算Key值
        var key = DateTime.Now.Minute * 60 + DateTime.Now.Second;
#if DEBUG
        Console.WriteLine(key);
#endif

        //查找Key值对应的任务队列并处理。
        var keyExists = _jobs.TryGetValue(key, out var jobQueue);
        if (!keyExists) return;
        
        // 循环去执行当前秒的所有任务
        while (jobQueue != null && jobQueue.TryDequeue(out var job))
        {
            await job.Run();
        }
    }
}
```

代码中设计IJob 和Job的一个实现，为了易于理解，这个job没有做太多事情。如果需要扩展去检查订单，可以在这里记录订单Id，创建任务的时候将订单ID和任务关联，这样定时器处理这个任务的时候能找到对应订单了。
```csharp
public interface IJob
{
    Task Run();
}
   
/// <summary>
/// 一个任务1
/// </summary>
public class Job1 : IJob
{
    private Guid JobId { get; set; }

    public Job1()
    {
        JobId = Guid.NewGuid();
    }

    public async Task Run()
    {
        Console.WriteLine(" Job Id: " + JobId + " is running.");
        await Task.Delay(2000);
        Console.WriteLine(" Job Id:" + JobId + " have completed.");
    }
}
```
主程序Programe中调用定时管理器
```csharp
using TimerTest;

Console.WriteLine("Hello, World!");

TimerManager timerManager = new TimerManager();

Job job1 = new Job();

// 添加一个任务1分钟后执行
timerManager.AddJob( job1, TimeSpan.FromMinutes(1));

// 在添加另一个任务2分钟后执行
Job job2 = new Job();
timerManager.AddJob(job2, TimeSpan.FromMinutes(2));

Console.ReadLine();
```
执行结果，结果中可以看到， 任务1 在1014的键值上被处理，1014的键值对应的时间是 16:54 秒，也就是在我运行这个程序1分钟后。
任务2 在 1074的键值上被处理，1074对应的时间是 17:54 秒 执行。从上表可以看出程序正常运行得出结果。

或者在Web程序中使用该管理器
```csharp
public static class ServiceCollectionExtensions
{
    /// <summary>
    /// 添加延迟任务（通过Timer来实现延迟任务）
    /// </summary>
    /// <param name="service"></param>
    public static void AddDelayTask(this IServiceCollection service)
    {
        service.AddSingleton<TimerManager>();
    }
}
```
添加任务
```csharp
[ApiController]
[Route("[controller]")]
public class HomeController : ControllerBase
{
    private readonly TimerManager _timerManager;

    public HomeController(TimerManager timerManager)
    {
        _timerManager = timerManager;
    }

    [HttpPost("job")]
    public void AddJob()
    {
        _timerManager.AddJob(new Job1(), TimeSpan.FromSeconds(10));
    }
}
```

## 总结
这是一个简单的控制台程序验证了这个定时管理器的实现方法，我们将1个小时分成3600秒，每一秒对应一个Key值，在这个值上我们存储需要被处理的任务。在增加任务时候，我们也用同样的算法确定这个Key值。处理的时候根据当前时间计算除Key值进行处理。
这样的话，在真实场景中，我们有3600个Key值可以存储每一秒钟用户提交的所有订单，时间没走过1秒我就处理对应的任务。

## 优化

- 我们可以扩展Job方法，根据业务逻辑添加更多的信息以便于处理。例如处理订单的ID，或其他什么业务ID。
- 处理任务的方法可以采用多个消费者并发执行，增加处理速度。
- 可以将任务实体存储到数据库，以便于应对突发宕机事故可以快速重建任务。
- 当然我们也可以用Hangfire来轻松实现这个业务。

## 资料
[https://mp.weixin.qq.com/s/Jn1xK6ptHYLROHChmh_pSA](https://mp.weixin.qq.com/s/Jn1xK6ptHYLROHChmh_pSA) | 基于C#的计时管理器
