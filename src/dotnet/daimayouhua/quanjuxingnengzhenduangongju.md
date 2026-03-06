---
title: 全局性能诊断工具
lang: zh-CN
date: 2023-09-12
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: quanjuxingnengzhenduangongju
slug: vkrbuv
docsId: '64585426'
---
## 前言
现在`.NET Core` 上线后，不可避免的会出现各种问题，如内存泄漏、CPU占用高、接口处理耗时较长等问题。这个时候就需要快速准确的定位问题，并解决。这时候就可以使用`.NET Core `为开发人员提供了一系列功能强大的诊断工具。
接下来就详细了解下：`.NET Core`全局诊断工具

- dotnet-counters
- dotnet-dump
- dotnet-gcdump
- dotnet-trace
- dotnet-symbol
- dotnet-sos

## dotnet-counters
[dotnet-counters](https://docs.microsoft.com/zh-cn/dotnet/core/diagnostics/dotnet-counters) 是一个性能监视工具，用于初级运行状况监视和性能调查。 它通过 [EventCounter](https://docs.microsoft.com/zh-cn/dotnet/api/system.diagnostics.tracing.eventcounter) API 观察已发布的性能计数器值。例如，可以快速监视CUP使用情况或`.NET Core `应用程序中的异常率等指标
**安装：**通过nuget包安装：

```csharp
dotnet tool install --global dotnet-counters
```
主要命令

- dotnet-counters ps
- dotnet-counters list
- dotnet-counters collect
- dotnet-counters monitor



* dotnet-counters 

  ps：显示可监视的 dotnet 进程的列表
  ![image.png](/common/1641827788648-43512e2c-0395-4cff-881f-dff1453502d6.png)

* dotnet-counters list 命令：显示按提供程序分组的计数器名称和说明的列表
  ![image.png](/common/1641827788697-073140c4-6383-48a0-97a5-c392200e5b65.png)
  包括：运行时和Web主机运行信息
*  dotnet-counters collect 命令：定期收集所选计数器的值，并将它们导出为指定的文件格式

```csharp
dotnet-counters collect [-h|--help] [-p|--process-id] [-n|--name] [--diagnostic-port] [--refresh-interval] [--counters <COUNTERS>] [--format] [-o|--output] [-- <command>]
```
参数说明：
![image.png](/common/1641827788667-4207619f-9e29-40c6-82d4-3c220f66efd2.png)
示例：收集dotnet core 服务端所有性能计数器值，间隔时间为3s
![image.png](/common/1641827788687-11d1082b-974c-43bd-a861-b435e3dfb921.png)

* dotnet-counters monitor命令：显示所选计数器的定期刷新值

```csharp
dotnet-counters monitor [-h|--help] [-p|--process-id] [-n|--name] [--diagnostic-port] [--refresh-interval] [--counters] [-- <command>]
```
示例：
```csharp
 dotnet-counters monitor --process-id 18832 --refresh-interval 2
```

![image.png](/common/1641827788638-0f22b3d6-b8bf-4cea-9753-729e83944628.png)

## dotnet-dump 
简介：通过 [dotnet-dump](https://docs.microsoft.com/zh-cn/dotnet/core/diagnostics/dotnet-dump) 工具，可在不使用本机调试器的情况下收集和分析 Windows 和 Linux 核心转储。
```csharp
dotnet tool install --global dotnet-dump
```
命令：

- dotnet-dump collect
- dotnet-dump analyze

```csharp
// dotnet-dump collect：从进程生成dump
dotnet-dump collect [-h|--help] [-p|--process-id] [-n|--name] [--type] [-o|--output] [--diag]
```
参数说明：

| -h&#124;--help | 显示命令行帮助。 |
| --- | --- |
| -p&#124;--process-id `<PID>` | 指定从中收集转储的进程的 ID 号。 |
| -n&#124;--name `<name>` | 指定从中收集转储的进程的名称。 |
| --type <Full&#124;Heap&#124;Mini> | 指定转储类型，它确定从进程收集的信息的类型。 有三种类型：
Full - 最大的转储，包含所有内存（包括模块映像）。
Heap - 大型且相对全面的转储，其中包含模块列表、线程列表、所有堆栈、异常信息、句柄信息和除映射图像以外的所有内存。
Mini - 小型转储，其中包含模块列表、线程列表、异常信息和所有堆栈 |
| `-o或--output <output_dump_path>` | 应在其中写入收集的转储的完整路径和文件名。
如果未指定：
在 Windows 上默认为 .\\dump_YYYYMMDD_HHMMSS.dmp 。
在 Linux 上默认为 ./core_YYYYMMDD_HHMMSS 。
YYYYMMDD 为年/月/日，HHMMSS 为小时/分钟/秒。 |
| --diag | 启用转储收集诊断日志记录。 |

示例：
```csharp
dotnet-dump collect -p 18832
```
![image.png](/common/1641827789390-394da641-fbbf-4a0f-9513-6f9839b0862a.png)  
dotnet-dump analyze：启动交互式 shell 以了解转储
```csharp
dotnet-dump analyze <dump_path> [-h|--help] [-c|--command]
```
示例：**dotnet-dump analyze dump_20210509_193133.dmp ** 进入dmp分析，查看堆栈和未处理异常
![image.png](/common/1641827789673-b8a0f4b2-8925-494b-bdea-94dcf197ef63.png)  

## dotnet-gcdump
[dotnet-gcdump](https://docs.microsoft.com/zh-cn/dotnet/core/diagnostics/dotnet-gcdump) 工具可用于为活动 .NET 进程收集 `GC（垃圾回收器）`转储。dotnet-gcdump 全局工具使用 [EventPipe](https://docs.microsoft.com/zh-cn/dotnet/core/diagnostics/eventpipe) 收集实时 .NET 进程的 `GC（垃圾回收器）`转储。 创建 GC 转储时需要在目标进程中触发 GC、开启特殊事件并从事件流中重新生成对象根图。 此过程允许在进程运行时以最小的开销收集 GC 转储。 这些转储对于以下几种情况非常有用：

- 比较多个时间点堆上的对象数。
- 分析对象的根（回答诸如“还有哪些引用此类型的内容？”等问题）。
- 收集有关堆上的对象计数的常规统计信息。

安装：

```csharp
dotnet tool install --global dotnet-gcdump
```
示例：从当前正在运行的进程中收集 GC 转储

```csharp
dotnet-gcdump collect [-h|--help] [-p|--process-id pid] [-o|--output gcdump-file-path] [-v|--verbose] [-t|--timeout timeout] [-n|--name name]
```
**参数说明：**

| **参数** | **说明：** |
| --- | --- |
| -h&#124;--help | 显示命令行帮助。 |
| -p&#124;--process-id  pid | 可从中收集 GC 转储的进程 ID。 |
| -o&#124;--output gcdump-file-path | 应写入收集 GC 转储的路径。 默认为 .\\YYYYMMDD_HHMMSS_pid.gcdump。 |
| -v&#124;--verbose  | 收集 GC 转储时输出日志。 |
| -t&#124;--timeout  timeout | 如果收集 GC 转储的时间超过了此秒数，则放弃收集。 默认值为 30。 |
| -n&#124;--name name  | 可从中收集 GC 转储的进程的名称。 |

**生成示例：**

```csharp
dotnet-gcdump collect -p 18832
```
![image.png](/common/1641827789681-293c87f2-3174-444a-866e-ac8b182c3003.png)
查看生成文件：使用perfview查看：
![image.png](/common/1641827789909-3af7294c-09c4-4929-aa38-c8b988f1d7b4.png)


## dotnet-trace
简介：分析数据通过 .NET Core 中的 EventPipe 公开。 通过 [dotnet-trace](https://docs.microsoft.com/zh-cn/dotnet/core/diagnostics/dotnet-trace) 工具，可以使用来自应用的有意思的分析数据，这些数据可帮助你分析应用运行缓慢的根本原因。
安装：
```csharp
dotnet tool install --global dotnet-trace
```
命令：
```shell
dotnet-trace [-h, --help] [--version] <command>

# 从正在运行的进程中收集诊断跟踪，或者启动子进程并对其进行跟踪(仅限.NET 5+)若要让工具运行子进程并自其启动时对其进行跟踪，请将 -- 追加到 collect 命令。
dotnet-trace collect

# 将 nettrace 跟踪转换为备用格式，以便用于备用跟踪分析工具。
dotnet-trace convert

# 列出可从中收集跟踪的 dotnet 进程
dotnet-trace ps

# 列出预生成的跟踪配置文件，并描述每个配置文件中包含的提供程序和筛选器
dotnet-trace list-profiles
```

示例：收集进程18832诊断跟踪：

![image.png](/common/1641827790067-b04cf833-315d-475c-bb43-96198f4ec617.png)
使用Vs打开生成的跟踪文件如下：
![image.png](/common/1641827790115-f602fcf5-0d16-40c2-b22c-11e79598586a.png)

## dotnet-symbol
简介：[dotnet-symbol](https://docs.microsoft.com/zh-cn/dotnet/core/diagnostics/dotnet-symbol) 用于下载打开核心转储或小型转储所需的文件（符号、DAC/DBI、主机文件等）。 如果需要使用符号和模块来调试在其他计算机上捕获的转储文件，请使用此工具。
安装：

```csharp
dotnet tool install --global dotnet-symbol
```
命令：
```csharp
dotnet-symbol [-h|--help] [options] FILES
```
options：

| **参数** | **说明** |
| --- | --- |
| --microsoft-symbol-server  | 添加“http://msdl.microsoft.com/download/symbols”符号服务器路径（默认）。 |
| --server-path  symbol server path |  将符号服务器添加到服务器路径。 |
| --recurse-subdirectories  | 处理所有子目录中的输入文件。 |
| --host-only  | 仅下载 lldb 加载核心转储所需的主机程序（即 dotnet）。 |
| --symbols  | 下载符号文件（.pdb、.dbg 和 .dwarf）。 |
| --modules  | 下载模块文件（.dll、.so 和 .dylib）。 |
| --debugging  | 下载特殊的调试模块（DAC、DBI 和 SOS）。 |
| --windows-pdbs  | 当可移植的 PDB 也可用时，会强制下载 Windows PDB。 |
| -o, --output  outputdirectory | 设置输出目录。 否则，请在输入文件旁边写入（默认）。 |
| -d, --diagnostics  | 启用诊断输出。 |
| -h&#124;--help  | 显示命令行帮助。 |


## dotnet-sos
简介：[dotnet-sos](https://docs.microsoft.com/zh-cn/dotnet/core/diagnostics/dotnet-sos) 在 Linux 和 macOS（如果使用的是 [Windbg/cdb](https://docs.microsoft.com/zh-cn/windows-hardware/drivers/debugger/debugger-download-tools)，则在 Windows 上）安装 [SOS调试扩展](https://docs.microsoft.com/zh-cn/dotnet/core/diagnostics/sos-debugging-extension)。
安装：
```csharp
dotnet tool install --global dotnet-sos
```
命令：在本地安装用于调试 .NET Core 进程的 [SOS 扩展](https://docs.microsoft.com/zh-cn/dotnet/core/diagnostics/sos-debugging-extension)
```csharp
dotnet-sos install
```
示例：
![image.png](/common/1641827790242-a3c9f4bd-5240-4d14-8cf5-ce03c61fcb5d.png)

## 总结
微软提供了一套强大的诊断工具，熟练的使用这些工具，可以更快更有效的发现程序的运行问题，解决程序的性能问题。
过程中主要使用：counters、dump、trace 工具用于分析.NET Core性能问题。
最近又了解到微软已对这些基础工具已封装了对应包（Microsoft.Diagnostics.NETCore.Client），可以用来开发出自己的有界面的诊断工具。后续将了解实现一个。
参考文档：
[https://docs.microsoft.com/zh-cn/dotnet/core/diagnostics/dotnet-counters](https://docs.microsoft.com/zh-cn/dotnet/core/diagnostics/dotnet-counters)
[GitHub - dotnet/diagnostics: This repository contains the source code for various .NET Core runtime diagnostic tools and documents.](https://github.com/dotnet/diagnostics)
[https://channel9.msdn.com/Shows/On-NET/Introducing-the-Diagnostics-Client-Library-for-NET-Core](https://channel9.msdn.com/Shows/On-NET/Introducing-the-Diagnostics-Client-Library-for-NET-Core)

## 资料
转自：chaney1992
链接：cnblogs.com/cwsheng/p/14748477.html