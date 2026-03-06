---
title: 第一次执行慢性能分析
lang: zh-CN
date: 2023-09-20
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: diyicizhihangmanxingnengfenxi
slug: oztygk
docsId: '66024743'
---

## 前言
新建一个ASP.NET Core Web API项目，使用命令行方式启动，连续发送多次请求。
第一次执行（116ms）比后面的（2ms）慢了很多。

## 示例代码
为了更好定位Web API执行情况，示例Controller代码如下：
```csharp
[HttpGet]
public string Get()
{
    Thread.Sleep(10);

    var now = DateTime.Now;
    while ((DateTime.Now - now).TotalMilliseconds < 10)
    {
        
    }

    var result = HttpContext.TraceIdentifier;

    Thread.Sleep(10);

    return result;
}
```

- Thread.Sleep用于将框架代码和业务执行代码执行时间分开
- while循环用于延长业务执行时间，方便找到业务代码

## PerfView
PerfView是一款免费的性能分析工具，可帮助排查CPU和内存相关的性能问题。
从https://github.com/Microsoft/perfview/releases下载最新版本PerfView并启动。

### 配置
点击主界面上的“Collect data machine wide”链接，打开收集数据窗口：
![](/common/1644063003069-a7a550c1-c987-45ad-bed2-74aa7cd9b6fd.webp)为了记录所有操作，需要设置“CPU Sample Interval”为较小值（0.125）。

### 收集

- 使用命令行方式启动Web API
- 点击收集数据窗口的“Start Collection”按钮
- 执行Web API请求
- 再点击“Stop Collection”按钮。

收集完成后，会生成.etl.zip文件：
![](/common/1644063061682-66c65d9f-c361-4326-a444-e87d1ec2b7e1.webp)
双击“CPU Stacks”，会打开“Select Process Window”（选择进程窗口），因为PerfView实际收集了所有进程的性能数据。
选择Web API对应的进程，点击“OK”按钮。

### 火焰图
在打开的窗口中选择“Flame Graph”(火焰图)选项卡,上方的“GroupPats”选择“[group class entries] {%!}.%(=>class $1;{%!}::=>class $1”，可以看到如下效果：
![](/common/1644063096645-6b0f1af1-c541-42a9-885b-3fbafd112378.webp)
火焰图是用来展示CPU的调用栈的图形：

- y轴表示调用栈，每一层都是一个函数。调用栈越深，火焰就越高，顶部就是正在执行的函数，下方都是它的父函数。
- x轴表示每个函数相对执行的时间长短。

### SpeedScore
由于调用的函数较多，火焰图并不能很清晰地反映。
这时，我们可以使用speedscope，一个交互式火焰图可视化工具，帮助我们分析。
选择菜单"File"->"Save View As"，文件类型选择“speed scope”。
打开网站https://www.speedscope.app/，将刚才保存的文件导入，效果如下图：
![](/common/1644063137407-a192a536-8b58-4c91-a8e9-8358f056e677.webp)
顶部是线程列表，下面是所选线程对应的火焰图，可以看到它的堆栈顺序与PerfView相反，是从上到下的。
很容易定位到Web API执行的线程，因为可以看到Thread.Sleep留出的2段空白。

### 分析
图中相同的颜色块表示同一函数，我们只需要找到和业务代码同一行颜色不同的位置，就表示处于不同方法调用中。
先看业务代码执行前，从上往下看，很快就定位到一个运行时间较长的位置。
执行的是Http1Connection.TryParseRequest方法，耗时11.85ms，**可见重用连接是非常有必要的**。
下面是找到的部分耗时比较大的方法：

- 执行前
   - Microsoft.AspNetCore.Routing.Matching.DfaMatcherFactory.CreateMatcher - 22.73ms
   - Microsoft.AspNetCore.Mvc.Infrastructure.ActionInvokerFactory.CreateInvoker - 30.15ms
- 执行后
   - Microsoft.AspNetCore.Mvc.Formatters.TextOutputFormatter.WriteAsync - 5.79ms

### 结论
后面请求快的原因也可以解释了，**比如重用Http连接，方法内部缓存了结果（DfaMatcherFactory调用了DataSourceDependentCache）**，这也为提高我们自己程序的性能指明了思路。

## 资料
[https://mp.weixin.qq.com/s/lgE4aueTwnHX7lEarDb4kQ](https://mp.weixin.qq.com/s/lgE4aueTwnHX7lEarDb4kQ) | 差距50倍！为什么Web API第一次执行这么慢？
