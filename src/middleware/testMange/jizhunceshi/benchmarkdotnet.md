---
title: BenchmarkDotNet
lang: zh-CN
date: 2023-06-25
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: benchmarkdotnet
slug: oggkof
docsId: '66071100'
---

## 概述
BenchmarkDotNet是一个用于对C#代码进行基准测试的.NET工具包。它可以将你的方法转化为基准，并提供一些测试报告，可以帮助你进行基准、性能测试。
官网：[https://benchmarkdotnet.org/index.html](https://benchmarkdotnet.org/index.html)
文档：[https://benchmarkdotnet.org/articles/overview.html](https://benchmarkdotnet.org/articles/overview.html)

什么是基准测试？
基准测试是对应用程序的一段代码的性能提供一个或者一组度量值，度量代码本质来说就是让你清楚了解你的应用程序的性能到底是咋样的，当你想优化代码的是，手里有可以这些性能度量值是多好。

## 特性

- [SimpleJob(RuntimeMoniker.NetCoreApp30)]
   - 与其它版本的基准进行比较
- RankColumn
   - 输出的性能信息增加一个排名列

## 操作

### 快速上手
新建控制台项目并安装nuget包
```csharp
<ItemGroup>
  <PackageReference Include="BenchmarkDotNet" Version="0.13.2" />
</ItemGroup>
```
比如我们要对比字符串拼接的效率高低，那么我们可以新建一个测试的类叫做StringJoinTest
```csharp
[MemoryDiagnoser]
public class StringJoinTest
{
    [Benchmark]
    public string Join()
    {
        return string.Join("张三", "李四", "王五", "赵六", "田七");
    }

    [Benchmark]
    public string Concat()
    {
        return string.Concat("张三", "李四", "王五", "赵六", "田七");
    }

    [Benchmark]
    public string StringBuilder()
    {
        var sb = new StringBuilder("张三");
        return sb.Append("李四").Append("王五").Append("赵六").Append("田七").ToString();
    }

    [Benchmark]
    public string JiaHao()
    {
        return "张三" + "李四" + "王五" + "赵六" + "田七";
    }
}
```
然后我们想运行就可以在Program的Main方法中编写
```csharp
BenchmarkRunner.Run<StringJoinTest>();
```
然后这个时候修改项目运行模式为Release(Debug模式下会报错，因为程序集是没有优化过的)，或者直接在项目目录下运行命令行
```csharp
dotnet run -c Release
```
生成结果如下
BenchmarkDotNet=v0.13.2, OS=Windows 10 (10.0.19045.2604)
AMD Ryzen 7 4800H with Radeon Graphics, 1 CPU, 16 logical and 8 physical cores
.NET SDK=7.0.200-preview.22628.1
[Host]     : .NET 6.0.14 (6.0.1423.7309), X64 RyuJIT AVX2
DefaultJob : .NET 6.0.14 (6.0.1423.7309), X64 RyuJIT AVX2

| Method | Mean | Error | StdDev | Median | Gen0 | Allocated |
| --- | --- | --- | --- | --- | --- | --- |
| Join | 38.2772 ns | 0.5005 ns | 0.4179 ns | 38.4088 ns | 0.0535 | 112 B |
| Concat | 38.8657 ns | 0.2936 ns | 0.2746 ns | 38.7899 ns | 0.0535 | 112 B |
| StringBuilder | 31.8107 ns | 0.0967 ns | 0.0905 ns | 31.8033 ns | 0.0727 | 152 B |
| JiaHao | 0.0004 ns | 0.0008 ns | 0.0007 ns | 0.0000 ns | - | - |

里面包含BenchmarkDotNet的版本信息、操作系统、计算机硬件、.Net版本、编辑器的一些信息以及一些应用程序相关的性能信息，从这个图中可以看到StringBuilder的性能最好(JiaHao方法应该是做了优化直接当成一个字符串处理了)，但是占用了更多的内存。

图注：
Mean：平均值，表示一组数据的平均数。在基准测试中，通常用于表示每次测试运行的平均时间或性能指标。
Error：误差，表示测量值与真实值之间的偏差。在基准测试中，通常用于表示每次测试的测量误差范围
StdDev：标准差，表示一组数据的离散程度。在基准测试中，通常用于衡量测试结果的稳定性和可靠性。较小的标准差意味着测试结果更加稳定
Median：中位数，表示一组数据按大小排序后的中间值。在基准测试中，中位数通常用于表示数据的集中趋势，比平均值更不受异常值的影响。
Gen0：表示.NET垃圾回收（GC）的代数。GC将内存分为不同的代（Generation），根据对象的存活时间来进行垃圾回收。Gen0代表最新创建的对象，Gen2代表存活时间最长的对象，而Gen1则处于两者之间。在基准测试中，这些指标表示了垃圾回收的次数。
Allocated：表示每次测试执行期间分配的内存数量。在基准测试中，用于测量每次测试运行时对象的分配情况

### 数组拷贝示例
测试几种数组拷贝的方法测试效率
```csharp
using BenchmarkDotNet.Attributes;
using BenchmarkDotNet.Running;
using System;

[MemoryDiagnoser]
public class Program
{
    private static void Main(string[] args)
    {
        BenchmarkRunner.Run<Program>();
    }

    static Program()
    {
        _testData = new int[1000];
        for (int i = 0; i < 1000; i++)
        {
            _testData[i] = i;
        }
    }

    [Benchmark]
    public object CopyByFor()
    {
        var rawPacketData = _testData;
        var length = _testData.Length;

        var data = new int[length];
        for (int localIndex = 0, rawArrayIndex = 0; localIndex < data.Length; localIndex++, rawArrayIndex++)
        {
            data[localIndex] = rawPacketData[rawArrayIndex];
        }
        return data;
    }

    [Benchmark]
    public object CopyByArray()
    {
        var length = _testData.Length;
        var start = 0;

        var rawPacketData = _testData;
        var data = new int[length];
        Array.Copy(rawPacketData, start, data, 0, length);
        return data;
    }

    [Benchmark]
    public object CopyByClone()
    {
        var data = (int[])_testData.Clone();
        return data;
    }

    private static readonly int[] _testData;
}
```
> 以上代码返回 data 作为 object 仅仅只是为了做性能测试，避免被 dotnet 优化掉

我的设备测试结果
BenchmarkDotNet=v0.13.1, OS=Windows 10.0.19044.1503 (21H2)
AMD Ryzen 7 4800H with Radeon Graphics, 1 CPU, 16 logical and 8 physical cores
.NET SDK=6.0.200-preview.22055.15
  [Host]     : .NET 6.0.1 (6.0.121.56705), X64 RyuJIT  [AttachedDebugger]
  DefaultJob : .NET 6.0.1 (6.0.121.56705), X64 RyuJIT

| Method | Mean | Error | StdDev | Gen 0 | Allocated |
| --- | --- | --- | --- | --- | --- |
| CopyByFor | 723.0 ns | 4.58 ns | 4.06 ns | 1.9226 | 4 KB |
| CopyByArray | 186.1 ns | 1.06 ns | 0.94 ns | 1.9228 | 4 KB |
| CopyByClone | 199.8 ns | 2.65 ns | 2.35 ns | 1.9157 | 4 KB |


## 资料
[https://mp.weixin.qq.com/s/Nem3nLZ1vhd9NUTaAhYu1A](https://mp.weixin.qq.com/s/Nem3nLZ1vhd9NUTaAhYu1A) | .NET 6 数组拷贝性能对比
