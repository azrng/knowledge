---
title: 批量处理集合
lang: zh-CN
date: 2023-10-22
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 无
filename: piliangchulijige
slug: ke90b2
docsId: '91861999'
---

## 目的
当需要批量处理一定数量的队列数据，而不是一个一个处理的时候，就需要来通过自定义来实现批量处理。

## 操作

### 公共类
```csharp
/// <summary>
/// 任务队列接口
/// </summary>
public interface ITaskQueue<T>
{
    /// <summary>
    /// 增加一个对象
    /// </summary>
    /// <param name="t"></param>
    void Add(T t);

    /// <summary>
    /// 获取一个分组队列
    /// </summary>
    /// <returns></returns>
    IList<T> GetQueue();

    /// <summary>
    /// 是否阻塞增加
    /// </summary>
    /// <returns></returns>
    bool IsWaitAdd();

    /// <summary>
    /// 当前队列完成
    /// </summary>
    void Complete();
}

/// <summary>
/// 任务队列
/// </summary>
public class TaskQueue<T> : ITaskQueue<T>, IDisposable
{
    /// <summary>
    /// 内置队列
    /// </summary>
    private ConcurrentDictionary<int, IList<T>> _taskQueues;

    /// <summary>
    /// 分区大小
    /// </summary>
    private readonly int _partitionSize;

    /// <summary>
    /// 默认index为0
    /// </summary>
    private int _index;

    /// <summary>
    /// 默认处理偏移
    /// </summary>
    private int _offSet;

    /// <summary>
    /// 内置锁
    /// </summary>
    private readonly object _lock = new object();

    /// <summary>
    /// <summary>
    /// 构造
    /// </summary>
    /// <param name="PartitionSize">分区大小，默认分区大小为10 </param>
    public TaskQueue(int PartitionSize = 10)
    {
        _taskQueues = new ConcurrentDictionary<int, IList<T>>();
        this._partitionSize = PartitionSize;
        List<T> ts = new List<T>();
        _taskQueues.AddOrUpdate(_index, ts, (k, v) => ts);
    }

    /// <summary>
    /// 增加一个对象
    /// </summary>
    /// <param name="t"></param>
    public void Add(T t)
    {
        lock (_lock)
        {
            if (_taskQueues.TryGetValue(_index, out IList<T> ts))
            {
                if (ts.Count < _partitionSize)
                {
                    ts.Add(t);
                    _taskQueues.AddOrUpdate(_index, ts, (k, v) => ts);
                }
                else //超出区域范围，则新建区
                {
                    _index++;
                    var ts1 = new List<T>
                    {
                        t
                    };
                    _taskQueues.AddOrUpdate(_index, ts1, (k, v) => ts1);
                }
            }
            else
            {
                var ts1 = new List<T>
                {
                    t
                };
                _taskQueues.AddOrUpdate(_index, ts1, (k, v) => ts1);
            }
        }
    }

    /// <summary>
    /// 获取一个分组队列
    /// </summary>
    /// <returns></returns>
    public IList<T> GetQueue()
    {
        lock (_lock)
        {
            if (_taskQueues.TryGetValue(_offSet, out IList<T> ts))
            {
                if (_offSet == _index)//如果直接获取一个能用的，那就新建区为新区
                {
                    _index++;
                }
                return ts;
            }
            return null;
        }
    }

    /// <summary>
    /// 是否阻塞增加
    /// </summary>
    /// <returns></returns>
    public bool IsWaitAdd()
    {
        lock (_lock)
        {
            return _offSet != _index;
        }
    }

    /// <summary>
    /// 当前队列完成
    /// </summary>
    public void Complete()
    {
        lock (_lock)
        {
            _taskQueues.TryRemove(_offSet, out IList<T> ts);
            if (_offSet < _index)
            {
                _offSet++;
            }
        }
    }

    public void Dispose()
    {
        if (_taskQueues != null)
        {
            _taskQueues.Clear();
            _taskQueues = null;
        }
    }
}
```
使用示例
```csharp
var taskQueue = new TaskQueue<string>();

#region 一个一直生产指定大小，另外一个消费  先生产，再消费

//for (int i = 0; i < 1000; i++)
//{
//    taskQueue.Add(i.ToString());
//}
////另外一个按照指定的时间，消费
//while (true)
//{
//    Thread.Sleep(2000);
//    Console.WriteLine("获取-----开始获取到数据!");
//    var list = taskQueue.GetQueue();
//    if (list != null)
//    {
//        Console.WriteLine($"获取-----对象状态：{taskQueue.IsWaitAdd()}已获取的队列列表:{string.Join(",", list)}");
//        Console.WriteLine("获取-----处理1秒后，提交当前!");
//        Thread.Sleep(1000);
//        taskQueue.Complete();
//        Console.WriteLine("获取-----已经提交!");
//    }
//}

#endregion 一个一直生产指定大小，另外一个消费  先生产，再消费

#region 两个任务处理，实现 一个生产，一个消费  批量  生产，并消费

Task.Run(() =>
{
    for (int i = 0; i < 10000000; i++)
    {
        taskQueue.Add(i.ToString());
        Thread.Sleep(100);//一秒插入一条
        Console.WriteLine($"插入-----队列状态：{taskQueue.IsWaitAdd()}");
        while (taskQueue.IsWaitAdd())//有待处理任务
        {
            Console.WriteLine("插入-----任务插入中开始阻塞!");
            SpinWait.SpinUntil(() => !taskQueue.IsWaitAdd());
        }
    }
});

while (true)
{
    Thread.Sleep(2000);
    Console.WriteLine("获取-----开始获取到数据!");
    var list = taskQueue.GetQueue();
    if (list != null)
    {
        Console.WriteLine($"获取-----对象状态：{taskQueue.IsWaitAdd()}已获取的队列列表:{string.Join(",", list)}");
        Console.WriteLine("获取-----处理10秒后，提交当前!");
        Thread.Sleep(1000);
        taskQueue.Complete();
        Console.WriteLine("获取-----已经提交!");
    }
}

#endregion 两个任务处理，实现 一个生产，一个消费  批量  生产，并消费
```

## 资料
[https://mp.weixin.qq.com/s/5OP5FZT2ClCyCk4J8PPKkA](https://mp.weixin.qq.com/s/5OP5FZT2ClCyCk4J8PPKkA) | .NET 开发中个人常用的三个处理类(批量任务队列，List分页处理，配置文件管理)
