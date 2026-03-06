---
title: MemoryPack
lang: zh-CN
date: 2023-09-01
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: memorypack
slug: gesxogr54c2hddi8
docsId: '131919367'
---

## 概述
如果要兼顾序列化后大小和性能的话我们应该要选择MemoryPackBrotli，它序列化以后的结果最小，而且兼顾了性能。
注意：需要.NET7 版本

## 操作
引用nuget包
```powershell
<PackageReference Include="MemoryPack" Version="1.4.4" />
```

### 基础操作
只需要给对应的类加上partial关键字，另外打上MemoryPackable特性即可：
```csharp
[MemoryPackable]
public partial class DemoClass
{
    public int P1 { get; set; }
    public bool P2 { get; set; }
    public string P3 { get; set; } = null!;
    public double P4 { get; set; }
    public long P5 { get; set; }
}
```
序列化和反序列化也是调用静态方法：
```csharp
// Serialize
[MethodImpl(MethodImplOptions.AggressiveInlining)]
public static byte[] MemoryPack<T>(T origin)
{
    return global::MemoryPack.MemoryPackSerializer.Serialize(origin);
}

// Deserialize
public T MemoryPack<T>(byte[] bytes)
{
    return global::MemoryPack.MemoryPackSerializer.Deserialize<T>(bytes)!;
}
```
它原生支持 Brotli 压缩算法，使用如下所示：
```csharp
// Serialize
[MethodImpl(MethodImplOptions.AggressiveInlining)]
public static byte[] MemoryPackBrotli<T>(T origin)
{
    using var compressor = new BrotliCompressor();
    global::MemoryPack.MemoryPackSerializer.Serialize(compressor, origin);
    return compressor.ToArray();
}

// Deserialize
public T MemoryPackBrotli<T>(byte[] bytes)
{
    using var decompressor = new BrotliDecompressor();
    var decompressedBuffer = decompressor.Decompress(bytes);
    return MemoryPackSerializer.Deserialize<T>(decompressedBuffer)!;
}
```

## 资料
[https://mp.weixin.qq.com/s/_J3B1sJrFC8oT4Xx3e3wyQ](https://mp.weixin.qq.com/s/_J3B1sJrFC8oT4Xx3e3wyQ) | .NET性能优化-是时候换个序列化协议了
