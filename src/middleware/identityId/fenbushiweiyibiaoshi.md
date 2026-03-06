---
title: 唯一标识
lang: zh-CN
date: 2023-08-15
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: fenbushiweiyibiaoshi
slug: ophof5
docsId: '65706679'
---

## 需求
这个唯一序号有如下几种特征：

- 全局唯一性：确保生成的序列是全局唯一的，不可重复。
- 有序性：确保生成的ID值对于某个用户或者业务是按一定的数字有序递增的。
- 高可用性：确保生成ID功能的高可用，能够承接较大峰值，能够保证序列生成的有效性（不重复且有序）。
- 带时间标记：ID中有时间片段组成，可是清晰识别出操作的时间。

## 其他组件

四个id生成器的性能比较：https://www.cnblogs.com/fs7744/p/17823881.html 

适用于 .Net 的 Twitter Snowflake-alike ID 生成器：https://github.com/RobThree/IdGen

### Nanoid

开源库 https://github.com/codeyu/nanoid-net

Nano ID 与 UUID v4 (基于随机数) 相当。 它们在 ID 中有相似数量的随机位 (Nano ID 为126，UUID 为122),因此它们的碰撞概率相似：

特点：`比UUID短`  `无序`

### Seata 优化的雪花算法

改良版雪花id java：[https://www.cnblogs.com/thisiswhy/p/17611163.html](https://www.cnblogs.com/thisiswhy/p/17611163.html) 然后博客园老哥搞了c#移植版本

```c#
public class IdGenerator
{
    private readonly long twepoch = 1588435200000L;
    private const int workerIdBits = 10;
    private const int timestampBits = 41;
    private const int sequenceBits = 12;
    private const int maxWorkerId = ~(-1 << workerIdBits);
    private long workerId;
    private long timestampAndSequence;
    private readonly long timestampAndSequenceMask = ~(-1L << (timestampBits + sequenceBits));

    public static readonly IdGenerator Instance = new IdGenerator(GenerateWorkerId());

    public IdGenerator(long workerId)
    {
        InitTimestampAndSequence();
        InitWorkerId(workerId);
    }

    private void InitTimestampAndSequence()
    {
        long timestamp = GetNewestTimestamp();
        long timestampWithSequence = timestamp << sequenceBits;
        this.timestampAndSequence = timestampWithSequence;
    }

    private void InitWorkerId(long workerId)
    {
        if (workerId > maxWorkerId || workerId < 0)
        {
            string message = string.Format("worker Id can't be greater than {0} or less than 0", maxWorkerId);
            throw new ArgumentException(message);
        }
        this.workerId = workerId << (timestampBits + sequenceBits);
    }

    public long NextId()
    {
        WaitIfNecessary();
        long next = Interlocked.Increment(ref timestampAndSequence);
        long timestampWithSequence = next & timestampAndSequenceMask;
        return workerId | timestampWithSequence;
    }

    public static long NewId()
    {
        return Instance.NextId();
    }

    private void WaitIfNecessary()
    {
        long currentWithSequence = timestampAndSequence;
        long current = currentWithSequence >> sequenceBits;
        long newest = GetNewestTimestamp();
        if (current >= newest)
        {
            Thread.Sleep(5);
        }
    }

    private long GetNewestTimestamp()
    {
        return DateTimeOffset.UtcNow.ToUnixTimeMilliseconds() - twepoch;
    }

    public static long GenerateWorkerId()
    {
        try
        {
            return GenerateWorkerIdBaseOnK8S();
        }
        catch (Exception)
        {
            try
            {
                return GenerateWorkerIdBaseOnMac();
            }
            catch (Exception)
            {
                return GenerateRandomWorkerId();
            }
        }
    }

    public static long GenerateWorkerIdBaseOnMac()
    {
        IEnumerable<NetworkInterface> all = NetworkInterface.GetAllNetworkInterfaces();
        foreach (NetworkInterface networkInterface in all)
        {
            bool isLoopback = networkInterface.NetworkInterfaceType == NetworkInterfaceType.Loopback;
            //bool isVirtual = networkInterface.;
            //if (isLoopback || isVirtual)
            if (isLoopback)
            {
                continue;
            }
            byte[] mac = networkInterface.GetPhysicalAddress().GetAddressBytes();
            return ((mac[4] & 0B11) << 8) | (mac[5] & 0xFF);
        }
        throw new Exception("no available mac found");
    }

    public static long GenerateWorkerIdBaseOnK8S()
    {
        return GenerateWorkerIdBaseOnString(Environment.GetEnvironmentVariable("K8S_POD_ID"));
    }

    public static long GenerateWorkerIdBaseOnString(string str)
    {
        ArgumentNullException.ThrowIfNull(str, nameof(str));
        int hashValue = 0;
        int cc = 2 << (workerIdBits - 1);
        foreach (char c in str)
        {
            hashValue = (hashValue * 31 + c) % cc;
        }
        return hashValue + 1;
    }

    public static long GenerateRandomWorkerId()
    {
        return Random.Shared.NextInt64(maxWorkerId + 1);
    }
}
```

> https://www.cnblogs.com/fs7744/p/17823881.html



## 资料

[https://www.cnblogs.com/wzh2010/p/15642421.html](https://www.cnblogs.com/wzh2010/p/15642421.html)：分布式：分布式系统下的唯一序列
[https://tech.meituan.com/2017/04/21/mt-leaf.html](https://tech.meituan.com/2017/04/21/mt-leaf.html)：Leaf——美团点评分布式ID生成系统
分布式唯一id .net版本优化：[https://www.cnblogs.com/sunyuliang/p/12161416.html](https://www.cnblogs.com/sunyuliang/p/12161416.html)
