---
title: 概述
lang: zh-CN
date: 2023-10-19
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: gaishu
slug: dou56w
docsId: '72942708'
---

## 常见打印需求
1. 使用默认打印机打印PDF文档
2. 使用虚拟打印机（Microsoft XPS Document Writer）打印PDF文档
3. 指定打印机及PDF文档打印页码范围
4. 静默打印PDF文档
5. 双面打印PDF文档
6. 黑白打印PDF文档
7. 打印PDF文档时选择不同的出纸盒
8. 将PDF文档打印多份
9. 打印PDF一页为多页、打印多页为一页
10. 自定义纸张大小打印PDF

## 组件

打印机操作代码示例

https://www.whuanle.cn/archives/21032  

https://www.whuanle.cn/archives/21367

### Spire.PDF for .NET

官网地址：[https://www.e-iceblue.com/Download/download-pdf-for-net-now.html](https://www.e-iceblue.com/Download/download-pdf-for-net-now.html)

## 操作

### 获取打印机队列数
需要先引用程序集
```csharp
using System.Printing;
using System.Runtime.InteropServices;
```
定义
```csharp
[DllImport("winspool.drv", CharSet = CharSet.Auto)]
public static extern bool OpenPrinter(string pPrinterName, out IntPtr phPrinter, IntPtr pDefault);

[DllImport("winspool.drv", CharSet = CharSet.Auto)]
public static extern bool ClosePrinter(IntPtr hPrinter);

[DllImport("winspool.drv", CharSet = CharSet.Auto)]
public static extern int EnumJobs(IntPtr hPrinter, int FirstJob, int NoJobs, int Level, IntPtr pInfo, int cdBuf, out int pcbNeeded, out int pcReturned);

[DllImport("winspool.drv", CharSet = CharSet.Auto)]
public static extern long GetJob(long hPrinter, long JobId, long Level, long buffer, long pbSize, long pbSizeNeeded);
```
获取打印机中队列的数据
```csharp
/// <summary>
/// 得到具体打印机作业数
/// </summary>
/// <param name="printerToPeek">打印机名称</param>
/// <returns></returns>
public static int peekPrinterJobs(string printerToPeek)
{
    IntPtr handle;
    int FirstJob = 0;
    int NumJobs = 127;
    int pcbNeeded;
    int pcReturned;

    //打开打印机
    OpenPrinter(printerToPeek, out handle, IntPtr.Zero);

    // get num bytes required, here we assume the maxt job for the printer quest is 128 (0..127) 
    EnumJobs(handle, FirstJob, NumJobs, 1, IntPtr.Zero, 0, out pcbNeeded, out pcReturned);


    // allocate unmanaged memory 分配非托管内存
    IntPtr pData = Marshal.AllocHGlobal(pcbNeeded);

    // get structs  获取结构
    EnumJobs(handle, FirstJob, NumJobs, 1, pData, pcbNeeded, out pcbNeeded, out pcReturned);

    //关闭打印机
    ClosePrinter(handle);

    return pcReturned;
}
```

 
