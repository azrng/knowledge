---
title: ULID
lang: zh-CN
date: 2023-09-29
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: ulid
slug: sz2ktb131uqq5g5x
docsId: '135411826'
---

## 概述
ULID 解决了 UUID 的一些性能和排序限制。它们将时间戳与随机数据相结合，以创建可按字典排序的 128 位标识符。

## 结构

1、时间戳：前 10 个字符以毫秒为单位对 Unix 时间戳进行编码。

2、随机性：其余字符随机生成，确保唯一性。

### UUID结构

版本：UUID 中的第 13 个字符表示其版本（例如，版本 1 是基于时间的，版本 4 是随机的）。

变体：第 17 个字符表示变体，定义 UUID 布局和含义。

## 对比UUId

### 1.1 可排序性
ULID 能够根据生成时的时间戳进行排序，使得生成的标识能够按照时间顺序排列，并且支持范围查询和快速索引。

### 1.2 长度更短
ULID 使用 26 个字符的 Base32 编码表示，相比标准的 UUID 使用的 36 个字符长度更短，减少网络传输和存储的开销。

### 1.3 高性能
由于 ULID 可以根据时间戳排序，它非常适合在分布式系统中使用，尤其是在高并发环境下，可以有效减少冲突和竞争。
尽管 ULID 的冲突概率很低，但并不能保证完全唯一。因此，在高度依赖唯一性的场景中，仍建议使用更长的 UUID。

## 操作

安装nuget包

```
<PackageReference Include="Ulid" Version="1.3.3" />
```

### 基础使用
生成ULID
```csharp
Ulid newUlid = Ulid.NewUlid();  
Console.WriteLine(newUlid.ToString()); 
```

## 用例和性能优化

### 数据库索引

在数据库中使用 ULID 可以大大提高索引效率。由于 ULID 可按其时间戳组件进行排序，因此它们可以保持插入顺序，从而减少碎片并提高读写性能。

示例：实体框架集成若要在 Entity Framework 中利用 ULID，可以将模型配置为使用 ULID 作为主键：

```csharp
public class Order  
{  
    [Key]  
    public Ulid OrderId { get; set; }  
      
    public DateTime OrderDate { get; set; }  
  
    // Other properties  
}  
  
protected override void OnModelCreating(ModelBuilder modelBuilder)  
{  
    modelBuilder.Entity<Order>()  
        .Property(o => o.OrderId)  
        .HasConversion(  
            v => v.ToString(),  
            v => Ulid.Parse(v));  
}
```

## **分布式系统**

在分布式系统中，ULID 的独特性和可排序性使其成为时间顺序很重要的场景（例如日志记录和事件溯源）的理想选择。

示例：在分布式环境中实施 ULID

```csharp
public class DistributedEvent  
{  
    public Ulid EventId { get; set; }  
  
    public string EventData { get; set; }  
  
    public DateTimeOffset Timestamp { get; set; }  
}  
  
public class EventService  
{  
    public void LogEvent(string eventData)  
    {  
        var distributedEvent = new DistributedEvent  
        {  
            EventId = Ulid.NewUlid(),  
            EventData = eventData,  
            Timestamp = DateTimeOffset.UtcNow  
        };  
  
        // Save to database or send to event queue  
    }  
}
```

虽然 UUID 是生成唯一标识符的可靠解决方案，但它们在随机性和索引效率低下的局限性在高性能应用程序中可能非常严重。

ULID 提供了一种引人注目的替代方案，提供相同级别的唯一性，并具有词典分类和改进的可读性等额外优势。

可以增强应用程序的性能、可伸缩性和可维护性。

## 资料

[https://mp.weixin.qq.com/s/_o6BoxH3PWX7_2Qjhg3lzA](https://mp.weixin.qq.com/s/_o6BoxH3PWX7_2Qjhg3lzA) | ULID : 一种可排序的随机标识生成方式以及在 .NET 中的使用

.NET 唯一标识符的效率 UUID VS ULID:[https://mp.weixin.qq.com/s/lM7b44dbfSRgShF8VKCeEA](https://mp.weixin.qq.com/s/lM7b44dbfSRgShF8VKCeEA)
