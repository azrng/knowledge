---
title: Coravel
lang: zh-CN
date: 2022-02-25
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: coravel
slug: vf8khm
docsId: '64679546'
---

## 介绍
框架轻，使用简单，支持秒级定时任务。Coravel Pro可以连接数据库进行任务调度，Coravel Pro可以支持web可视化，将任务执行情况通过web显示出来。
> GitHub：[https://github.com/jamesmh/coravel](https://github.com/jamesmh/coravel)


## 操作

### Nuget安装
在调用类库层安装Coravel。
![](/common/1641912866485-44edfc95-de73-4d44-82f3-d99fabdc9e2f.jpeg)

### 依赖注入
在startup.cs中的ConfigureServices方法中进行依赖注入
```csharp
services.AddScheduler();
```

### 配置调度器
在startup.cs中的Configure方法中配置链两个定时任务
```csharp
var provider = app.ApplicationServices;
provider.UseScheduler(scheduler =>
       {
           scheduler.Schedule(() => Console.WriteLine("Every second during the week."))
           
           .EverySecond()
           .Weekday();
       });
  provider.UseScheduler(scheduler =>
  {
      scheduler.Schedule(() => Console.WriteLine("Every 5 second during the week."))
      
      .EverySeconds(5)
      .Weekday();
  });
```
任务1每隔1秒打印输出；任务2每隔5秒打印输出，正确。

### Cron 表达式
Coravel 支持Cron Expressions，有需要的可以根据应用场景设置Cron表达式

- * * * * * run every minute
- 00 13 * * * run at 1:00 pm daily
- 00 1,2,3 * * * run at 1:00 pm, 2:00 pm and 3:00 pm daily
- 00 1-3 * * * same as above
- 00 _/2 _* * run every two hours on the hour

### 3.7其他功能支持
此外，Coravel还支持任务队列，缓存，事件组播，邮件等。任务队列可依据读者使用情况，视情况另起一篇，缓存不建议用此组件，可用Easycache。事件组播亦不建议用此库，可参考 https://www.cnblogs.com/JerryMouseLi/p/11012839.html。邮件亦不建议用此组件。

### 3.8 Coravel Pro
Coravel Pro可以连接数据库进行任务调度，Coravel Pro可以支持web可视化，将任务执行情况通过web显示出来。在这里不做详细介绍，有需要的读者可自行研究。

### 4.1 依赖注入自定义类
ConfigureServices中对松耦合的类Statistic进行依赖注入
```csharp
 services.AddTransient<Statistic>();
```

### 4.2配置调度器
在startup.cs中的Configure方法中配置自定义松耦合任务
```csharp
    var provider = app.ApplicationServices;
    provider.UseScheduler(scheduler =>
         {
             scheduler.Schedule<Statistic>()
             .EverySecond()
             .Weekday();
         });
```

### 4.3 编写松耦合任务的代码
详细说明，见代码注释。
```csharp
using Coravel.Invocable;
using IBMS.Infrastruct.UoW;
using System;
using System.Threading.Tasks;

namespace IBMS.WEBAPI.Extension
{
    public class Statistic: IInvocable
    {
        
        UnitOfWork _unitOfWork;
        public Statistic(UnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public  async Task Invoke()
        {
           
            var IPBoxCount = _unitOfWork.IPBoxRepository.Count()/10+1;
            Console.WriteLine("Every second during the week.");
            Console.WriteLine("Count:{0}", IPBoxCount);
        }
    }
}
```
**注意：1.编写的任务一定要在 Invoke中，这属于固定格式；public async Task Invoke() {}；2. 需要引入以下库:using Coravel.Invocable;**

## 资料
**原文链接：**https://www.cnblogs.com/JerryMouseLi/p/11012839.htm

