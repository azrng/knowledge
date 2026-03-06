---
title: 限流
lang: zh-CN
date: 2023-07-27
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: xianliu
slug: tucpcv
docsId: '72257752'
---

## 介绍
对外部服务请求的限制，尽早拒绝过载的请求，能够保证尽量处理负载过程中的请求。

与熔断的区别：限流作用是防御上游流量超过处理能力的手段，熔断作用是容错下游的快速失败的手段。

## 操作
主流的底层就是基于令牌桶算法和漏斗算法。

- 计数器算法
- 令牌桶算法
- 漏桶算法
- 滑动窗口算法

### 计数器算法

#### 原理
在一定时间间隔里，记录请求的次数，当请求次数超过该时间限制时候，就把计数器清零。当请求次数超过间隔的内的最大次数时候，拒绝访问。

#### 实现
例如：一个接口每分钟允许请求100次。
1.设置一个计数器count，接收一个请求将计数器加一，同时记录当前时间。
2.判断当前时间和上次统计时间是否为同一分钟
如果是，则判断count是否超过阈值，如果超过阈值，则返回限流拒绝。
如果不是，就把count重置为1，判断是否超过阈值。

示例代码
```csharp
/// <summary>
/// 计数器算法 设置一分钟只能请求100次
/// </summary>
public static class CounterLimit
{
    /// <summary>
    /// 每分钟限制的请求总数
    /// </summary>
    private const int _requestSum = 100;

    /// <summary>
    /// 记录上一次统计时间
    /// </summary>
    private static DateTime? _lastDate;

    /// <summary>
    /// 当前请求间隔的请求数
    /// </summary>
    private static int _counter;

    public static (bool isLimit, int counter) CountLimit()
    {
        _lastDate ??= DateTime.Now;

        //当前时间
        var now = DateTime.Now;

        var interval = now.Subtract(_lastDate.Value).TotalMinutes;
        if (interval >= 1)
        {
            _lastDate = now;
            _counter = 0;
        }

        // 判断计数器是否大于每分钟限定的值
        var limit = _counter >= _requestSum;
        if (limit)
            return (true, _counter);

        ++_counter;
        return (false, _counter);
    }
}
```
测试方法
```csharp
while (true)
{
    // 模拟一秒
    try
    {
        Thread.Sleep(1000);
    }
    catch (ThreadInterruptedException e)
    {
        Console.WriteLine(e.Message);
    }
    var random = new Random();
    int i = random.Next(3);
    // 模拟1秒内请求1次
    if (i == 1)
    {
        (var isLimit, int counter) = CounterLimit.CountLimit();
        if (isLimit)
        {
            Console.WriteLine("限流了" + counter);
        }
        else
        {
            Console.WriteLine("没限流" + counter);
        }
    }
    else if (i == 2)
    {
        // 模拟1秒内请求2次
        for (int j = 0; j < 2; j++)
        {
            (var isLimit, int counter) = CounterLimit.CountLimit();
            if (isLimit)
            {
                Console.WriteLine("限流了" + counter);
            }
            else
            {
                Console.WriteLine("没限流" + counter);
            }
        }
    }
    else
    {
        // 模拟1秒内请求10次
        for (int j = 0; j < 10; j++)
        {
            (var isLimit, int counter) = CounterLimit.CountLimit();
            if (isLimit)
            {
                Console.WriteLine("限流了" + counter);
            }
            else
            {
                Console.WriteLine("没限流" + counter);
            }
        }
    }
}
```

#### 不足
该算法实现简单，但是如果两个时间段间隔的地方有密集请求，比如第一个时间段的在最后五秒(00:55)来了好几十个请求，此时可以正常处理不会限流，然后再下一个时间段(01:05)的时候一下子又来了100个请求，这个时候也能正常处理，不会限流，但是这00:55-01:05一分钟时间间隔一下子接收到了100多个请求，可能造成后端过载导致服务崩溃。

### 滑动窗口算法

#### 实现1
滑动窗口算法把间隔时间划分成更小的粒度，当更小独立的时间间隔过去之后，将过去的间隔请求数减掉，再补充一个空的时间间隔。

如下图所示，将1分钟划分成10个更小的时间间隔，每6s为一个时间间隔
![image.png](/common/1667400429830-af304785-f707-4870-b3fb-e379f5eb39f6.png)

1. 一个时间窗口为1分钟，滑动窗口分为10个格子，每个格子6秒。
2. 每过6秒，滑动窗口向右移动一个格子
3. 每个格子都有独立的计数器
4. 如果时间窗口内所有的计数器之和超过了限流阈值，则触发限流操作。

滑动窗口算法比计数器算法控制得更精细
![image.png](/common/1667400612141-575112c5-b411-4ef0-9c3d-99a3d9bb3872.png)
用户在0:59 时刻发送了100个请求，第10个格子的计数器增加100，下一秒的时候时间窗口向右移动1格，这时再来100个请求就超过了阈值，不会处理这100个请求，这样就避免了计数器场景出现的问题。
滑动窗口设置的越精细，限流效果越好，但是滑动窗口的时间间隔(格子)多了，存储空间也会增加。

具体操作
1 设计一个滑动窗口，窗口有10个格子，每个格子6秒，每隔6秒移动一格。
2 装满所有格子的时间为 10 * 6 = 60 秒。也就是说时间窗口是 60 秒。
3 从60秒开始，开始滑动，新请求数开始覆盖老请求数。
```csharp
/// <summary>
/// 滑动窗口算法 一分钟请求600次
/// </summary>
public static class SlideWindowLimit
{
    /// <summary>
    /// 每分钟限制的请求总数
    /// </summary>
    private const int _requestSum = 600;

    /// <summary>
    /// 滑动窗口大小（每个窗口可以请求的次数）
    /// </summary>
    public static int Size => _requestSum / (60 / _interval);

    /// <summary>
    /// 格子时长(秒)  能够被60整除的值
    /// </summary>
    private const int _interval = 1;

    /// <summary>
    /// 滑动窗口数组，每移动一个格子，更新对应数据项的值
    /// </summary>
    private static readonly int[] _window = new int[60 / _interval];

    /// <summary>
    /// 移动窗口中正在计数的格子
    /// </summary>
    private static int _currId;

    /// <summary>
    /// 上次请求时间
    /// </summary>
    private static DateTime? _lastDate;

    /// <summary>
    /// 当前窗口计数总和
    /// </summary>
    private static int _counter;

    public static (bool isLimit, int counter) SliderWindowLimit()
    {
        Console.WriteLine($"当前滚轮滚到  {_currId}");
        _lastDate ??= DateTime.Now;

        //获取当前时间
        var currTime = DateTime.Now;
        var interval = currTime.Subtract(_lastDate.Value).TotalSeconds;
        // 按照新的移动窗口进行计数
        if (interval >= _interval)
        {
            // 当前计数格子的下个格子将被清掉重写
            _currId++;

            // 目的就是让这个_currId一直在0-10之前重复  类似于如果_currId大于等于10,那么他就是_currId
            //_currId %= _window.Length;
            if (_currId == _window.Length) _currId = 0;

            var newCurrId = _currId;

            //下个格子将被清掉，总数据减掉上一轮中该格子的数量
            _counter -= _window[newCurrId];

            // 新格子设置为1
            _window[newCurrId] = 1;
            //记录滑动的时间
            _lastDate = currTime;
        }
        else
        {
            var isLimit = _counter >= _requestSum;
            if (isLimit)
                return (true, _counter);

            //当前计数的格子
            ++_window[_currId];
        }

        ++_counter;
        return (false, _counter);
    }
}
```
测试代码
```csharp
/// <summary>
/// 滑动窗口算法测试  模拟每秒请求多次，测试是否限流
/// </summary>
public class SlideWindowLimitTest : ILimitTest
{
    public void Main()
    {
        while (true)
        {
            // 模拟1秒
            try
            {
                Thread.Sleep(1000);
            }
            catch (ThreadInterruptedException e)
            {
                Console.WriteLine(e.Message);
            }

            var random = new Random();
            var i = random.Next(3);
            // 模拟1秒内请求8次
            if (i == 1)
            {
                for (var q = 0; q < 10; q++)
                {
                    (var isLimit, var counter) = SlideWindowLimit.SliderWindowLimit();
                    if (isLimit)
                    {
                        Console.WriteLine("限流了" + counter);
                    }
                    else
                    {
                        Console.WriteLine("没限流" + counter);
                    }
                }
            }
            else if (i == 2)
            {
                // 模拟1秒内请求9次
                for (var j = 0; j < 10; j++)
                {
                    (var isLimit, var counter) = SlideWindowLimit.SliderWindowLimit();
                    if (isLimit)
                    {
                        Console.WriteLine("限流了" + counter);
                    }
                    else
                    {
                        Console.WriteLine("没限流" + counter);
                    }
                }
            }
            else
            {
                // 模拟1秒内请求11次
                for (var j = 0; j < 11; j++)
                {
                    (var isLimit, var counter) = SlideWindowLimit.SliderWindowLimit();
                    if (isLimit)
                    {
                        Console.WriteLine("限流了" + counter);
                    }
                    else
                    {
                        Console.WriteLine("没限流" + counter);
                    }
                }
            }
        }
    }
}
```
记录滑动窗口中的请求数。滑动窗口中的请求数控制在 600以内。滑动窗口能记录60秒的请求，所以如果每秒请求不超过10，不会限流。测试用例也是这样设计的，每秒模拟发送的请求为8次，9次，10次。从测试结果来看，符合预期。

#### 实现2
通过将前一个窗口估计的技术加上当前窗口计数来计算总估计数，如果超过计数限制，则请求将被阻止。
具体公式如下：
```csharp
估计数 = 前一窗口计数 * (1 - 当前窗口经过时间 / 单位时间) + 当前窗口计数
```
如果上次请求时间距离现在是大于2倍窗口时间，那么就重置开始时间；
如果上次请求时间距离现在大于一个窗口时间，那么就是当前时间减去上次请求时间，为当前窗口经过的时间

完整代码如下
```csharp
/// <summary>
/// 通过将前一个窗口中的加权计数添加到当前窗口中的计数来计算估计数，如果估计数超过计数限制，则请求将被阻止。
/// </summary>
public class SlideWindowLimitTwo
{
    /// <summary>
    /// 同步锁
    /// </summary>
    private readonly object _syncObject = new();

    /// <summary>
    /// 请求间隔的秒
    /// </summary>
    private readonly int _requestIntervalSeconds;

    /// <summary>
    /// 请求限制数
    /// </summary>
    private readonly int _requestLimit;

    /// <summary>
    /// 开始时间
    /// </summary>
    private DateTime _windowStartTime;

    /// <summary>
    /// 上一个窗口的请求数
    /// </summary>
    private int _prevRequestCount;

    /// <summary>
    /// 当前窗口请求数
    /// </summary>
    private int _requestCount;

    /// <summary>
    /// 构造函数
    /// </summary>
    /// <param name="requestLimit">请求限制数</param>
    /// <param name="requestIntervalSeconds">请求间隔时间(秒)</param>
    public SlideWindowLimitTwo(int requestLimit, int requestIntervalSeconds)
    {
        _windowStartTime = DateTime.Now;
        _requestLimit = requestLimit;
        _requestIntervalSeconds = requestIntervalSeconds;
    }

    /// <summary>
    /// 是否通过请求
    /// </summary>
    /// <returns>true代表没有限流</returns>
    public bool PassRequest()
    {
        lock (_syncObject)
        {
            var currentTime = DateTime.Now;
            // 经过的时间：当前时间-开始时间
            var elapsedSeconds = (currentTime - _windowStartTime).TotalSeconds;

            //当过去的时间 大于等于 窗口时间的2倍时候，重置开始时间
            if (elapsedSeconds >= _requestIntervalSeconds * 2)
            {
                // 进这里说明前面两次的请求间隔已经超过2倍的窗口范围，因为经过时间超过一个窗口的时候会调整开始时间
                _windowStartTime = currentTime;
                _prevRequestCount = 0;
                _requestCount = 0;

                elapsedSeconds = 0;
            } // 经过的时间大于一个窗口时间
            else if (elapsedSeconds >= _requestIntervalSeconds)
            {
                // 开始时间=开始时间+请求时间
                _windowStartTime = _windowStartTime.AddSeconds(_requestIntervalSeconds);
                _prevRequestCount = _requestCount;
                _requestCount = 0;

                //计算当前窗口已经经过的时间
                elapsedSeconds = (currentTime - _windowStartTime).TotalSeconds;
            }

            // 估计数 = 前一窗口计数 * (1 - 当前窗口经过时间 / 单位时间) + 当前窗口计数
            var requestCount = (_prevRequestCount * (1 - (elapsedSeconds / _requestIntervalSeconds))) + _requestCount;
            if (requestCount < _requestLimit)
            {
                _requestCount++;
                return true;
            }
        }

        return false;
    }
}
```
测试方法如下
```csharp
public class SlideWindowLimitTestTwo : ILimitTest
{
    public void Main()
    {
        // 设置10秒只能请求100次
        var windows = new SlideWindowLimitTwo(100, 10);
        while (true)
        {
            // 模拟1秒
            try
            {
                Thread.Sleep(1000);
            }
            catch (ThreadInterruptedException e)
            {
                Console.WriteLine(e.Message);
            }

            var random = new Random();
            var i = random.Next(3);
            // 模拟1秒内请求1次
            if (i == 1)
            {
                for (var q = 0; q < 10; q++)
                {
                    var pass = windows.PassRequest();
                    if (!pass)
                    {
                        Console.WriteLine("限流了" );
                    }
                    else
                    {
                        Console.WriteLine("没限流" );
                    }
                }
            }
            else if (i == 2)
            {
                // 模拟1秒内请求9次
                for (var j = 0; j < 10; j++)
                {
                    var pass = windows.PassRequest();
                    if (!pass)
                    {
                        Console.WriteLine("限流了");
                    }
                    else
                    {
                        Console.WriteLine("没限流");
                    }
                }
            }
            else
            {
                // 模拟1秒内请求11次
                for (var j = 0; j < 11; j++)
                {
                    var pass = windows.PassRequest();
                    if (!pass)
                    {
                        Console.WriteLine("限流了");
                    }
                    else
                    {
                        Console.WriteLine("没限流");
                    }
                }
            }
        }
   
```

#### 优点
弥补了计数器算法的不足。

### 漏桶算法

#### 原理
漏桶算法比较形象，设想有一个桶，桶的底部有一个洞，当装上水之后，睡会一滴一滴从底部漏掉。当装的谁太满的时候，水就会移除，但是底部漏水的速度还是不变的。

- 底部漏水的速度就是系统处理的速度，只会通过一个恒速的方式处理请求(能够应对一定的突发流量，使得系统不会因为突增的压力而导致崩溃)
- 桶内存储的水就是上游过来的请求，当请求太多超过桶的容量，就会被拒绝


> 拓展：各种MQ比如kafka就是典型漏斗算法。broker就是这个固定容量的桶，生产者会不断的将数据写到broker里，消费者是采用的拉取模式，总是以固定的速率来消费。


#### 实现
如下图所示，外部的请求随机过来，把桶填满后，装不进桶的请求就会被丢弃，每秒中从桶中匀速漏出一定量的水，服务进程处理漏出的请求。
![image.png](/common/1668263349791-ded26ea5-5ea8-41e0-a9f5-f97cb2626667.png)
当请求突增的时候，漏桶算法能够保证处理的速度总是恒定的。
系统可以在一些时刻处理突增的请求，只要持续时间不是很长，系统有能力处理即可。
实现代码
```csharp
/// <summary>
/// 漏桶算法 桶容量2000，处理速度是每毫秒一个请求，也就是一秒1000个请求
/// </summary>
public class LeakBucket
{
    /// <summary>
    /// 当前桶中累计的请求数
    /// </summary>
    private static long currNum = 0;

    /// <summary>
    /// 记录上次统计的时间的毫秒
    /// </summary>
    private static long lastTime = DateTimeOffset.Now.ToUnixTimeMilliseconds();

    /// <summary>
    /// 漏桶算法
    /// </summary>
    /// <param name="capcity">桶能承载的最大请求数，超过这个数就开始限流</param>
    /// <param name="rate">漏水的速度，系统每毫秒能处理的请求数</param>
    /// <returns></returns>
    public static (bool isLimie, long currNum) LeakBuck(int capcity, int rate)
    {
        // 当前请求进来的时间
        var millisTime = DateTimeOffset.Now.ToUnixTimeMilliseconds();

        // 距离上一次请求过去的时间，单位是毫秒
        var time = millisTime - lastTime;

        // 当前请求距离上次请求漏走的水量
        var lastLeakNum = time * rate;

        // 现在木桶内剩余的水量为 桶的累积数量-距离上次漏走的水量  因为这里最低为0(桶内水流干)，所以求一下和0相比的最大值
        currNum = Math.Max(0, currNum - lastLeakNum);
        lastTime = millisTime;
        // 加上这次请求的数
        ++currNum;
        // 如果当前桶内累积的请求数大于等于桶的容量，那么就限流
        if (currNum >= capcity)
        {
            currNum = capcity;
            return (true, currNum);
        }
        return (false, currNum);
    }
}
```
测试代码
```csharp
public class LeakBucketTest : ILimitTest
{
    public void Main()
    {
        while (true)
        {
            try
            {
                Thread.Sleep(1000);
            }
            catch (Exception)
            {
            }

            // 桶容量为2000，每毫秒能处理一个请求（每秒请求1000次），每秒能请求1500，测试是否限流

            // 模拟1秒内请求的次数  1500次内
            int randomTime = new Random().Next(1500);
            for (int i = 0; i < randomTime; i++)
            {
                var (isLimit, currNum) = LeakBucket.LeakBuck(2000, 1);
                if (isLimit)
                {
                    Console.WriteLine($"限流了：{currNum}");
                }
                else
                {
                    Console.WriteLine($"没限流了：{currNum}");
                }
            }
        }
    }
}
```
测试后，当外部请求的请求数在1500内随机取值，还是有可能限流。

### 令牌桶算法

#### 原理
有一个固定容量为X的桶，每个Y单位会将Z个令牌放入该桶，如果桶内令牌超过X，令牌就溢出了，多出来的令牌就不要了。请求来了会去取令牌，如果请求太快，令牌生产速度跟不上消费速率，如果没有获取到令牌，这时候就会直接返回错误而不继续处理。
![image.png](/common/1666018592914-97c91443-85ff-4173-b362-441b953edef8.png)
所以上面配置中Z应该比每个单位时间内请求的数稍大，系统将长时间处于该状态，X可以是允许系统瞬时最大请求数，并且不能长时间处于这个状态
> 可以处理瞬时突发流量


#### 实现
编写令牌桶限流算法
```csharp
/// <summary>
/// 令牌桶限流算法
/// </summary>
public class TokenBucket
{
    /// <summary>
    /// 当前桶中累积的请求数
    /// </summary>
    private static long currNum = 0;

    /// <summary>
    /// 记录上次请求的时间毫秒数
    /// </summary>
    private static long lastTime = DateTimeOffset.Now.ToUnixTimeMilliseconds();

    /// <summary>
    /// 令牌桶
    /// </summary>
    /// <param name="capcity">桶能承受的最大容量</param>
    /// <param name="rate">生成token的速度</param>
    /// <returns></returns>
    public static (bool isLimit, long currNum) TokenBuck(int capcity, int rate)
    {
        // 当前请求进来的时间
        var currMillisTime = DateTimeOffset.Now.ToUnixTimeMilliseconds();

        // 距离上一次请求过去的时间 单位是秒
        var time = currMillisTime - lastTime;

        // 距离上一次请求的这段时间又新生成的token数目
        var lastTokenNum = time * rate;

        // 现在木桶内剩余的token数量 桶内累积的数量-距离上次时间间隔又新生成的token数量  因为这里桶的最大容量有限制，所以求两个的最小值
        currNum = Math.Min(capcity, currNum + lastTokenNum);

        lastTime = currMillisTime;

        // 当前桶内的请求数-1
        --currNum;

        // 如果当前桶内累积的token数小于等于0，那么就限流
        if (currNum <= 0)
        {
            currNum = 0;
            return (true, currNum);
        }
        return (false, currNum);
    }
}
```
测试方法
```csharp
public class TokenBucketTest : ILimitTest
{
    public void Main()
    {
        while (true)
        {
            try
            {
                Thread.Sleep(1000);
            }
            catch
            {
            }

            // 桶最大容量为2000 每毫秒生成一个token(1秒生成1000个)，每秒请求1500次，测试是否会限流

            // 模拟1s内请求数 1500次以内
            var randomNum = new Random().Next(900, 1500);
            for (var i = 0; i < randomNum; i++)
            {
                var (isLimit, currNum) = TokenBucket.TokenBuck(2000, 1);
                if (isLimit)
                {
                    Console.WriteLine($"限流了：{currNum}");
                }
                else
                {
                    Console.WriteLine($"没有限流：{currNum}");
                }
            }
        }
    }
}
```
每秒请求900-1500次的情况下，有可能会导致限流

### 对比
|  | 相同点 | 不同点 | 应用场景 |
| --- | --- | --- | --- |
| 令牌桶算法 | 都可以实现限流，都有固定的最大容量(桶容量)，超过最大容量的请求被丢弃 | 消费速率不固定 | 可应对突发流量 |
| 漏斗算法 |  | 消费速率固定，强行限制诗句传输速率 | 流量削锋，处理请求更均匀 |


## 文章推荐
[请求限制窗口算法](https://www.yuque.com/docs/share/a83b1251-0013-491b-a268-0c4b345ea7ca?view=doc_embed)

## 参考资料
[https://blog.csdn.net/chengqiuming/article/details/122385943](https://blog.csdn.net/chengqiuming/article/details/122385943)：计数器算法
[https://www.cnblogs.com/xiexj/p/13021294.html](https://www.cnblogs.com/xiexj/p/13021294.html) | 稳定性五件套-限流的原理和实现 - 编程一生 - 博客园
令牌桶限流算法：[https://mp.weixin.qq.com/s?__biz=MzA5ODg3Mzk5NQ==&mid=2453343666&idx=1&sn=5d66d5bec8cf5af0983f46bbdff93df5&chksm=87454a56b032c340f4902bd3193b37ecb9d07e52513093df69e9fbfefdc6a7e35bd30ada8eeb&scene=21#wechat_redirect](https://mp.weixin.qq.com/s?__biz=MzA5ODg3Mzk5NQ==&mid=2453343666&idx=1&sn=5d66d5bec8cf5af0983f46bbdff93df5&chksm=87454a56b032c340f4902bd3193b37ecb9d07e52513093df69e9fbfefdc6a7e35bd30ada8eeb&scene=21#wechat_redirect)
漏斗桶算法：[https://mp.weixin.qq.com/s/yxs7nk5tzxwmSbK_b06Hwg](https://mp.weixin.qq.com/s/yxs7nk5tzxwmSbK_b06Hwg)
