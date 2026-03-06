---
title: 雪花ID公共类
lang: zh-CN
date: 2023-08-14
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: xuehuaidgonggonglei
slug: uifd82
docsId: '31944582'
---

## 概述

该文章生成的内容唯一性待确认

使用一个 64 bit 的 long 型的数字作为全局唯一 id。在分布式系统中的应用十分广泛，且ID 引入了时间戳，基本上保持自增。
格式：1bit保留 + 41bit时间戳 + 10bit机器 + 12bit序列号
第一位不使用，主要是为了避免部分场景变成负数；
**41位时间戳**，也就是2的41次方，毫秒为单位，足够保存69年。这里一般存储1970年以来的毫秒数，建议各个系统根据需要自定义这个开始日期；
**10位机器码**，理论上可以表示1024台机器，也可以拆分几位表示机房几位表示机器。这里**默认采用本机IPv4地址最后两段以及进程Id一起作为机器码**，确保机房内部不同机器，以及相同机器上的不同进程，拥有不同的机器码；
**12位序列号**，表示范围0~4095，一直递增，即使毫秒数加一，这里也不会归零，避免被恶意用户轻易猜测得到前后订单号；

### 操作
示例如下：
```json
Snowflake snowflake = new Snowflake();
for (int i = 0; i < 100; i++)
{
    //生成ID
    Console.WriteLine(snowflake.NewId());
}

//时间转为Id
var bbb = snowflake.GetId(DateTime.Now.AddDays(1));
```
用到的类
```json
public class Snowflake
{
    #region 属性

    /// <summary>
    /// 随机数生成
    /// </summary>
    private static readonly RandomNumberGenerator _rnd = new RNGCryptoServiceProvider();

    /// <summary>
    /// 开始时间戳。首次使用前设置，否则无效，默认1970-1-1
    /// </summary>
    private DateTime StartTimestamp { get; } = new DateTime(1970, 1, 1);

    /// <summary>
    /// 机器Id，取10位<
    /// </summary>
    private int WorkerId { get; set; }

    private int _sequence;

    /// <summary>
    /// 序列号，取12位
    /// </summary>
    public int Sequence { get; set; }

    private long _msStart;
    private Stopwatch _watch;
    private long _lastTime;

    #endregion

    #region 核心方法

    private void Init()
    {
        // 初始化WorkerId，取5位实例加上5位进程，确保同一台机器的WorkerId不同
        if (WorkerId <= 0)
        {
            var nodeId = Next(1, 1024); //SysConfig.Current.Instance;
            var pid = Process.GetCurrentProcess().Id;
            var tid = Thread.CurrentThread.ManagedThreadId;
            WorkerId = ((nodeId & 0x1F) << 5) | ((pid ^ tid) & 0x1F);
        }

        // 记录此时距离起点的毫秒数以及开机嘀嗒数
        if (_watch == null)
        {
            _msStart = (long)(DateTime.Now - StartTimestamp).TotalMilliseconds;
            _watch = Stopwatch.StartNew();
        }
    }

    /// <summary>
    /// 获取下一个Id
    /// </summary>
    /// <returns></returns>
    public virtual long NewId()
    {
        Init();

        // 此时嘀嗒数减去起点嘀嗒数，加上七点毫秒数
        //var ms = (Int64)(DateTime.Now - StartTimestamp).TotalMilliseconds;
        var ms = _watch.ElapsedMilliseconds + _msStart;
        var wid = WorkerId & 0x3FF;
        var seq = Interlocked.Increment(ref _sequence) & 0x0FFF;

        //!!! 避免时间倒退
        if (ms < _lastTime) ms = _lastTime;

        // 相同毫秒内，如果序列号用尽，则可能超过4096，导致生成重复Id
        // 睡眠1毫秒，抢占它的位置 @656092719（广西-风吹面）
        if (_lastTime == ms && seq == 0)
        {
            //ms++;
            // spin等1000次耗时141us，10000次耗时397us，100000次耗时3231us。@i9-10900k
            //Thread.SpinWait(1000);
            while (_lastTime == ms) ms = _watch.ElapsedMilliseconds + _msStart;
        }

        _lastTime = ms;

        /*
            * 每个毫秒内_Sequence没有归零，主要是为了安全，避免被人猜测得到前后Id。
            * 而毫秒内的顺序，重要性不大。
            */

        return (ms << (10 + 12)) | (long)(wid << 12) | (long)seq;
    }

    /// <summary>
    /// 获取指定时间的Id，带上节点和序列号。可用于根据业务时间构造插入Id
    /// </summary>
    /// <param name="time">时间</param>
    /// <returns></returns>
    public virtual long NewId(DateTime time)
    {
        Init();

        var ms = (long)(time - StartTimestamp).TotalMilliseconds;
        var wid = WorkerId & 0x3FF;
        var seq = Interlocked.Increment(ref _sequence) & 0x0FFF;

        return (ms << (10 + 12)) | (long)(wid << 12) | (long)seq;
    }

    /// <summary>
    /// 时间转为Id，不带节点和序列号。可用于构建时间片段查询
    /// </summary>
    /// <param name="time">时间</param>
    /// <returns></returns>
    public virtual long GetId(DateTime time)
    {
        var t = (long)(time - StartTimestamp).TotalMilliseconds;
        return t << (10 + 12);
    }

    /// <summary>尝试分析</summary>
    /// <param name="id"></param>
    /// <param name="time">时间</param>
    /// <param name="workerId">节点</param>
    /// <param name="sequence">序列号</param>
    /// <returns></returns>
    public virtual bool TryParse(long id, out DateTime time, out int workerId, out int sequence)
    {
        time = StartTimestamp.AddMilliseconds(id >> (10 + 12));
        workerId = (int)((id >> 12) & 0x3FF);
        sequence = (int)(id & 0x0FFF);

        return true;
    }

    /// <summary>返回一个指定范围内的随机数</summary>
    /// <remarks>调用平均耗时37.76ns，其中GC耗时77.56%</remarks>
    /// <param name="min">返回的随机数的下界（随机数可取该下界值）</param>
    /// <param name="max">返回的随机数的上界（随机数不能取该上界值）</param>
    /// <returns></returns>
    private static int Next(int min, int max)
    {
        if (max <= min)
            throw new ArgumentOutOfRangeException(nameof(max));
        var _buf = new byte[4];
        _rnd.GetBytes(_buf);
        int int32 = BitConverter.ToInt32(_buf, 0);
        if (min == int.MinValue && max == int.MaxValue)
            return int32;
        if (min == 0 && max == int.MaxValue)
            return Math.Abs(int32);
        return min == int.MinValue && max == 0 ? -Math.Abs(int32) : (int)(((long)(max - min) * (long)(uint)int32 >> 32) + (long)min);
    }

    #endregion
}
```

## 难点

### 时钟倒拨问题
Snowflake根据SmartOS操作系统调度算法，初始化时锁定基准时间，并记录处理器时钟嘀嗒数。在需要生成雪花Id时，取基准时间与当时处理器时钟嘀嗒数，计算得到时间戳。也就是说，在初始化之后，Snowflake根本不会读取系统时间，即使时间倒拨，也不影响雪花Id的生成！
