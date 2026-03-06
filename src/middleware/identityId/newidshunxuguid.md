---
title: NewId顺序Guid
lang: zh-CN
date: 2023-08-30
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: newidshunxuguid
slug: rg2car
docsId: '66285175'
---

## 介绍
snowflake那种需要包含机器ID无法去中心化，必须有一个全局生成机器ID的机制作为额外协调。所以可以尝试使用NewId。

NewId是一个连续ID生成器，它使用主机MAC地址，结合时间戳和递增的序列号实现ID生成策略。由于MAC地址全局唯一，因此NewId无需机器ID这样的额外设施，即可生成按时间顺序排序的全局唯一标识符。

仓库地址：[https://github.com/phatboyg/NewId](https://github.com/phatboyg/NewId)
文档地址：[https://masstransit.io/documentation/patterns/newid#newid](https://masstransit.io/documentation/patterns/newid#newid)

## 操作
引用组件
```csharp
<PackageReference Include="NewId" Version="3.0.3" />
```
设置生成标识符时包含processId（进程Id），保证运行在同一台机器上的多个进程生成的标识符不会重复：
```csharp
NewId.SetProcessIdProvider(new CurrentProcessIdProvider());
```
生成guid
```csharp
for (int i = 0; i < 10; i++)
{
    var guid = NewId.NextGuid();
    Console.WriteLine(guid);
}
```
结果
```csharp
cc210000-6760-002b-7041-08d9ebd9edc2
cc210000-6760-002b-80a6-08d9ebd9edc3
cc210000-6760-002b-88a5-08d9ebd9edc3
cc210000-6760-002b-8b6a-08d9ebd9edc3
cc210000-6760-002b-8e1e-08d9ebd9edc3
cc210000-6760-002b-90c1-08d9ebd9edc3
cc210000-6760-002b-9377-08d9ebd9edc3
cc210000-6760-002b-9628-08d9ebd9edc3
cc210000-6760-002b-98d5-08d9ebd9edc3
cc210000-6760-002b-9b80-08d9ebd9edc3
```
这样子就生成了顺序的Guid

## Pomelo中顺序UUID

代码参考自：[此处](https://github.com/PomeloFoundation/Pomelo.EntityFrameworkCore.MySql/blob/ebe011a6f1b2a2a9709fe558cfc7ed3215b55c37/src/EFCore.MySql/ValueGeneration/Internal/MySqlSequentialGuidValueGenerator.cs)

代码内容

```c#
/// <summary>
/// 连续 GUID ID 生成器
/// </summary>
/// <remarks>
/// <para>
/// 代码参考自：https://github.com/PomeloFoundation/Pomelo.EntityFrameworkCore.MySql/blob/ebe011a6f1b2a2a9709fe558cfc7ed3215b55c37/src/EFCore.MySql/ValueGeneration/Internal/MySqlSequentialGuidValueGenerator.cs
/// </para>
/// </remarks>
public class SequentiaGuidIdGenerator
{
    /// <summary>
    /// 随机数生成器
    /// </summary>
    private static readonly RandomNumberGenerator _rng = RandomNumberGenerator.Create();

    /// <summary>
    /// 生成逻辑
    /// </summary>
    /// <param name="idGeneratorOptions"></param>
    /// <returns></returns>
    public Guid Create(SequentialGuidSettings idGeneratorOptions = null)
    {
        // According to RFC 4122:
        // dddddddd-dddd-Mddd-Ndrr-rrrrrrrrrrrr
        // - M = RFC version, in this case '4' for random UUID
        // - N = RFC variant (plus other bits), in this case 0b1000 for variant 1
        // - d = nibbles based on UTC date/time in ticks
        // - r = nibbles based on random bytes

        var randomBytes = new byte[7];
        _rng.GetBytes(randomBytes);
        var ticks = (ulong)(idGeneratorOptions?.TimeNow == null ? DateTimeOffset.UtcNow : idGeneratorOptions.TimeNow.Value).Ticks;

        const ushort uuidVersion = 4;
        const ushort uuidVariant = 0b1000;

        var ticksAndVersion = (ushort)((ticks << 48 >> 52) | uuidVersion << 12);
        var ticksAndVariant = (byte)((ticks << 60 >> 60) | uuidVariant << 4);

        if (idGeneratorOptions?.LittleEndianBinary16Format == true)
        {
            var guidBytes = new byte[16];
            var tickBytes = BitConverter.GetBytes(ticks);
            if (BitConverter.IsLittleEndian)
            {
                Array.Reverse(tickBytes);
            }

            Buffer.BlockCopy(tickBytes, 0, guidBytes, 0, 6);
            guidBytes[6] = (byte)(ticksAndVersion << 8 >> 8);
            guidBytes[7] = (byte)(ticksAndVersion >> 8);
            guidBytes[8] = ticksAndVariant;
            Buffer.BlockCopy(randomBytes, 0, guidBytes, 9, 7);

            return new Guid(guidBytes);
        }

        var guid = new Guid((uint)(ticks >> 32), (ushort)(ticks << 32 >> 48), ticksAndVersion,
            ticksAndVariant,
            randomBytes[0],
            randomBytes[1],
            randomBytes[2],
            randomBytes[3],
            randomBytes[4],
            randomBytes[5],
            randomBytes[6]);

        return guid;
    }
}

/// <summary>
/// 顺序guid设置
/// </summary>
public sealed class SequentialGuidSettings
{
    /// <summary>
    /// 当前时间
    /// </summary>
    public DateTimeOffset? TimeNow { get; set; }

    /// <summary>
    /// LittleEndianBinary 16 格式化
    /// </summary>
    public bool LittleEndianBinary16Format { get; set; }
}
```

## 资料

[https://mp.weixin.qq.com/s/0xlu1idYa7cGrYBUZNNG9A](https://mp.weixin.qq.com/s/0xlu1idYa7cGrYBUZNNG9A) | 使用C#快速生成顺序GUID
[https://mp.weixin.qq.com/s/PDoOldEoVBZgEp3vvcK25w](https://mp.weixin.qq.com/s/PDoOldEoVBZgEp3vvcK25w) | ASP.NET Core 产生连续 Guid
