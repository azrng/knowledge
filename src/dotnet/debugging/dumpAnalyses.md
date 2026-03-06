---
title: 内存转储Dump
lang: zh-CN
date: 2023-08-05
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: dumpwenjian
slug: hxbhwsygytzhztvc
docsId: '105906693'
---

## 概述

C#内存转储，或称为`dump`文件，是应用程序在特定时刻状态的快照。可以把程序的执行状态通过调试器保存到dump文件中，它们对于诊断问题（如性能问题、崩溃和内存泄漏）非常有帮助。

## 什么是内存转储

内存转储实质上是一个应用程序在特定点状态的快照。它包含了与应用程序相关的系统内存中的所有内容，包括变量、线程和堆栈跟踪。当进行调试，特别是尝试复制难以重现的错误时，这些数据可能会非常有用。

> 内容来自：https://mp.weixin.qq.com/s/YfkO6cVrwXn0x0PlHmMfrg

## 生成dump文件方式

### 任务管理器(windows)

通过任务管理器=>进程=>右键=>创建转储文件生成

### dotnet-dump(windows、容器)

**dotnet-dump 全局工具**是一种收集和分析.NET 核心应用程序 Dump 的方法。

使用之前需要安装`.NetSdk`或者直接下载，在操作前看下具体是服务中哪些线程引发的异常，然后针对特定线程进行分析

```sh
# windnows
dotnet tool install --global dotnet-dump
# 找到进程id
dotnet-dump ps
# 根据指定进程id创建dump文件
dotnet-dump collect --process-id <ProcessId>


# 进入容器安装htop
apt-get update
# 执行命令htop来查看资源使用情况    
apt-get install htop

# 下载 dotnet-dump
apt-get update&&apt-get install wget
wget https://aka.ms/dotnet-dump/linux-x64 -O /usr/local/bin/dotnet-dump&&chmod +x /usr/local/bin/dotnet-dump
```
执行以下命令即可创建 dump 文件（容器内默认 dotnet 进程对应 pid 均为 1）：
```sh
find /usr/share -name createdump

# 2.2.8
/usr/share/dotnet/shared/Microsoft.NETCore.App/2.2.8/createdump 1
# 6.0.0
/usr/share/dotnet/shared/Microsoft.NETCore.App/6.0.0/createdump 1
```
命令执行完成后，将生成 dump 文件 /tmp/coredump.1，我们需要通过 docker cp 或 kubectl cp 将 coredump.1  文件复制到主机目录下，然后下载到用于 dump 分析的机器上。
注意：在 Docker 部署模式下，createdump 命令执行需要有容器特权，所以在容器启动时需要加 --privileged = true 参数。另外 dump 文件生成需要使用较大内存，需适当调整容器内存限制参数。

### ProcDump(Windows、linux)

`ProcDump`是一个命令行工具，当应用程序假死或进程使用太多的 CPU 时，可以生成一个 Dump 文件。支持在程序运行期间达到指定的条件后自动生成dump文件

https://medium.com/@marioh_78322/investigating-net-out-of-memory-exceptions-using-sysinternals-procdump-for-linux-8a59c8b289 | Investigating .NET Out of Memory Exceptions Using Sysinternals ProcDump for Linux | by Mario Hewardt | Sep, 2023 | Medium --- 使用 Sysinternals ProcDump for Linux 调查 .NET 内存不足异常 |作者：马里奥·赫沃德特 |9月， 2023 |中等

### windows平台代码生成

熟悉 Windows 平台的朋友都知道，在 Win32 API 中有一个 MiniDumpWriteDump 的方法声明，方法实现是在 dbghelp.dll中，而且 dbghelp 是操作系统自带的，有了这些知识，我们可以将 dbghelp.lib 静态链接过来生成dump，参考代码如下：
```csharp
#include <iostream>
#include <Windows.h>
#include <minidumpapiset.h>
#include "Dbghelp.h"
#pragma comment(lib, "dbghelp.lib")

int main()
{
 //1. 创建文件
 HANDLE hFile = CreateFile(L"D:\\testdump\\MiniDump.dmp", GENERIC_READ | GENERIC_WRITE, 0, NULL,
  CREATE_ALWAYS, FILE_ATTRIBUTE_NORMAL, NULL);

 MiniDumpWriteDump(GetCurrentProcess(), GetCurrentProcessId(), hFile, MiniDumpWithFullMemory, NULL,
  NULL, NULL);

 CloseHandle(hFile);
}
```
默认用的 dbghelp.dll 是 Windows 系统目录下的，版本比较老，新功能可能不支持，如果我想用新版本的 dbghelp.dll 去哪里找呢？
其实有一个快捷途径，就是windbg 的安装目录下都会有最新的 dbghelp.dll，可以用 .chain 去寻找。
```csharp
0:000> .chain
Extension DLL chain:
    dbghelp: image 10.0.25877.1004, API 10.0.6, 
        [path: C:\Program Files\WindowsApps\Microsoft.WinDbg_1.2306.14001.0_x64__8wekyb3d8bbwe\amd64\dbghelp.dll]
    exts: image 10.0.25877.1004, API 1.0.0, 
        [path: C:\Program Files\WindowsApps\Microsoft.WinDbg_1.2306.14001.0_x64__8wekyb3d8bbwe\amd64\WINXP\exts.dll]
    ...
```
上面的 dbghelp 就是，接下来用 LoadLibrary 加载进来即可，失败逻辑就不写了哈，参考代码如下：
```csharp
#include <iostream>
#include <windows.h>
#include <dbghelp.h>

typedef BOOL(WINAPI* MiniDumpWriteDumpT)(
 HANDLE,
 DWORD,
 HANDLE,
 MINIDUMP_TYPE,
 PMINIDUMP_EXCEPTION_INFORMATION,
 PMINIDUMP_USER_STREAM_INFORMATION,
 PMINIDUMP_CALLBACK_INFORMATION);

int main()
{
 //1. 创建文件
 HANDLE hFile = CreateFile(L"D:\\testdump\\MiniDump2.dmp", GENERIC_READ | GENERIC_WRITE, 0, NULL,
  CREATE_ALWAYS, FILE_ATTRIBUTE_NORMAL, NULL);

 HMODULE hDbgHelp = LoadLibrary(L"dbghelp.dll");

 MiniDumpWriteDumpT pfnMinidumpWriteDump = (MiniDumpWriteDumpT)GetProcAddress(hDbgHelp, "MiniDumpWriteDump");

 pfnMinidumpWriteDump(GetCurrentProcess(), GetCurrentProcessId(), hFile, MiniDumpWithFullMemory, NULL,
  NULL, NULL);

 CloseHandle(hFile);
}
```

### Microsoft.Diagnostics.NETCore.Client
从 nuget 安装 Microsoft.Diagnostics.NETCore.Client 包
> 它是微软提供的 EventPipe 收集机制，可以收集 .NET 的 ETW 和 EventSource 发生的事件，更多详情可以查阅微软的官方文档。
> - https://learn.microsoft.com/zh-cn/dotnet/core/diagnostics/diagnostics-client-library?source=recommendations
> - https://learn.microsoft.com/zh-cn/dotnet/core/diagnostics/eventpipe
> - https://learn.microsoft.com/en-us/dotnet/core/diagnostics/microsoft-diagnostics-netcore-client

```csharp
internal class Program
{
	static void Main(string[] args)
	{
		Task.Run(() =>
		{
			Console.WriteLine("指标异常，要抓 dump 啦！");
			Dumper.TriggerCoreDump(Environment.ProcessId);
		});

		Console.ReadLine();
	}

	public class Dumper
	{
		public static void TriggerCoreDump(int processId)
		{
			var client = new DiagnosticsClient(processId);
			client.WriteDump(DumpType.Full, "/data/minidump.dmp");
		}
	}
}
```
上传到 Linux ，执行 dotnet Example_5_1_7.dll 后，minidump.dmp 就出来了。



DumpType枚举值：

```c#
public enum DumpType
{
    Normal = 1,
    WithHeap = 2,
    Triage = 3,
    Full = 4
}
```

各个枚举值的含义如下：

- **Normal**：主要包含线程和某些系统信息，但不包括堆信息。此类型的 dump 文件较小，适用于在处理能力有限的环境中快速捕获应用程序的状态。
- **WithHeap**：包含 Normal 类型的所有信息，还额外包含所有托管堆内存的信息。此类型的 dump 文件可以用于进行更详细的分析，例如内存泄漏分析。
- **Triage**：包含一些关键线程和模块数据，以及与异常相关的对象。此类型的 dump 文件主要用于快速诊断常见问题。
- **Full**：包含进程的所有内存，包括所有线程、堆和非堆内存。此类型的 dump 文件最大，可以用于进行全面的分析。



还可以编写一个生成dump小工具，比如

```csharp
static async Task Main()
{
    var processes = DiagnosticsClient.GetPublishedProcesses()
    .Select(Process.GetProcessById)
    .Where(process => process != null);
    Console.WriteLine("请输入进程 id");
    foreach (var item in processes)
    {
        Console.WriteLine($"{item.Id} ------ {item.ProcessName}");
    }

    var read = Console.ReadLine();
    ArgumentNullException.ThrowIfNullOrEmpty(read);
    var pid = int.Parse(read);

    var client = new DiagnosticsClient(pid);
    await client.WriteDumpAsync(
        dumpType: DumpType.Full,
        dumpPath: $"D:/{pid}_{DateTime.Now.Ticks}.dmp",
        logDumpGeneration: true,
        token: CancellationToken.None
    );
}
```

## 分析转储文件

###  Visual Studio

1. 打开 Visual Studio。

2. 转到 **文件 > 打开 > 项目/解决方案**。

3. 导航到你的 `.dmp` 文件并打开它。

4. Visual Studio 将自动分析崩溃转储并突出显示重要信息。

### WinDbg

WinDbg 是一个更高级的工具，但它允许对内存转储进行深度分析：

1. 下载并安装包含 WinDbg 的 Windows 调试工具。
2. 打开 WinDbg，并加载你的转储文件（`文件 > 打开崩溃转储`）。
3. 加载调试 .NET 应用程序所需的扩展，如 SOS (`!loadby sos clr`)。
4. 使用各种命令来分析转储（例如，使用 `!clrstack` 来查看管理堆栈）。

### dotnet-dump
在.NetCore3之前，可以通过网上的镜像，然后进行lldb分析，如6opuc/lldb-netcore，该镜像默认是基于2.2.8构建的，可以通过执行命令进入lldb
```csharp
docker run --rm -it -v /root/coredump.1:/tmp/coredump 6opuc/lldb-netcore
```
在.NetCore3以及之后，官网提供了dotnet-dump工具进行dump分析，下面进行安装
```sh
-- 安装
dotnet tool install --global dotnet-dump
    
-- 分析
dotnet-dump analyze /root/coredump.1
```

#### 常用命令
```powershell
# 查看正在运行的托管线程
clrthreads

# 指定当前需要分析的线程
setthread 7

# 查看当前线程在托管代码中的堆栈信息
clrstack

# 查看gc2
dg gen2

# 查看某一个类型信息
dumpheap -mt  ***

# 查看某个具体对象
do **

# 查看这个具体对象的gc 根
gcroot -all ***
```
官网文档：[https://learn.microsoft.com/zh-cn/dotnet/core/diagnostics/dotnet-dump#analyze-sos-commands](https://learn.microsoft.com/zh-cn/dotnet/core/diagnostics/dotnet-dump#analyze-sos-commands)

### 分析文档

https://medium.com/@marioh_78322/investigating-net-out-of-memory-exceptions-using-sysinternals-procdump-for-linux-8a59c8b289 | Investigating .NET Out of Memory Exceptions Using Sysinternals ProcDump for Linux | by Mario Hewardt | Sep, 2023 | Medium --- 使用 Sysinternals ProcDump for Linux 调查 .NET 内存不足异常 |作者：马里奥·赫沃德特 |9月， 2023 |中等

.netcore dump分析：[https://blog.csdn.net/sD7O95O/article/details/114650326open in new window](https://blog.csdn.net/sD7O95O/article/details/114650326)
使用dotnet-dump查询cpu占用高的问题：https://www.cnblogs.com/fanfan-90/p/14508282.html

## 参考文档
创建.Net程序Dump的几种姿势：[https://mp.weixin.qq.com/s/LY4hLa6rGRK6U14efAa3Gw](https://mp.weixin.qq.com/s/LY4hLa6rGRK6U14efAa3Gw)
linux上.Net如何自主生成Dump：[https://mp.weixin.qq.com/s/nB1RrHAJcpdnZcVsqDtRXg](https://mp.weixin.qq.com/s/nB1RrHAJcpdnZcVsqDtRXg)

内存分析工具dot-Memory：https://www.cnblogs.com/qinhuan/p/13913460.html
