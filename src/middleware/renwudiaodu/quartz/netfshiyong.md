---
title: NetF使用
lang: zh-CN
date: 2022-10-27
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: netfshiyong
slug: mck9pd
docsId: '98845607'
---

## 控制台
安装2.6版本的的quartz 
首先继承自IJob接口
```csharp
public class JobDemo : IJob
{
    /// <summary>
    /// 这里是作业调度每次定时执行方法
    /// </summary>
    /// <param name="context"></param>
    public Task Execute(IJobExecutionContext context)
    {
        Console.WriteLine(DateTime.Now.ToString());

        return Task.CompletedTask;
    }
}
```
需求描述
```csharp
*需求1：实现一个基础的定时程序，每3秒执行一次    
最基础的装的包是2.6的quartz 
*/
// //1.首先创建一个作业调度池
// ISchedulerFactory schedf = new StdSchedulerFactory();
// IScheduler sched = await schedf.GetScheduler();
// //2.创建出来一个具体的作业
// IJobDetail job = JobBuilder.Create<JobDemo>().Build();
// //3.创建并配置一个触发器
// ISimpleTrigger trigger = (ISimpleTrigger)TriggerBuilder.Create().WithSimpleSchedule(x => x.WithIntervalInSeconds(3).WithRepeatCount(int.MaxValue)).Build();
// //4.加入作业调度池中
// await sched.ScheduleJob(job, trigger);
// //5.开始运行
// await sched.Start();


/*
需求2   我们需要让这个定时程序执行100次，开始时间为当前时间，结束时间为当前时间后的个小时，到时候不管执行结束没，都不再执行
*/
//首先创建一个作业调度池
//ISchedulerFactory schedf = new StdSchedulerFactory();
//IScheduler sched = await schedf.GetScheduler();
////创建出来一个具体的作业
//IJobDetail job = JobBuilder.Create<JobDemo>().Build();
////NextGivenSecondDate：如果第一个参数为null则表名当前时间往后推迟2秒的时间点。
//DateTimeOffset startTime = DateBuilder.NextGivenSecondDate(DateTime.Now.AddSeconds(1), 2);
//DateTimeOffset endTime = DateBuilder.NextGivenSecondDate(DateTime.Now.AddHours(2), 3);
////创建并配置一个触发器
//ISimpleTrigger trigger = (ISimpleTrigger)TriggerBuilder.Create().StartAt(startTime).EndAt(endTime)
//                            .WithSimpleSchedule(x => x.WithIntervalInSeconds(3).WithRepeatCount(100))
//                            .Build();
////加入作业调度池中
//await sched.ScheduleJob(job, trigger);
////开始运行
//await sched.Start();
//Console.ReadKey();


/*
需求3：我想在每小时的第10，20，25，26，33，54分钟，每分钟的第1，10，14秒执行一次  这个时候就需要用到corn表达式了
*/
// //首先创建一个作业调度池
// ISchedulerFactory schedf = new StdSchedulerFactory();
// IScheduler sched = await schedf.GetScheduler();
// //创建出来一个具体的作业
// IJobDetail job = JobBuilder.Create<JobDemo>().Build();
// //NextGivenSecondDate：如果第一个参数为null则表名当前时间往后推迟2秒的时间点。
// DateTimeOffset startTime = DateBuilder.NextGivenSecondDate(DateTime.Now.AddSeconds(1), 2);
// DateTimeOffset endTime = DateBuilder.NextGivenSecondDate(DateTime.Now.AddYears(2), 3);
// //创建并配置一个触发器
// ICronTrigger trigger = (ICronTrigger)TriggerBuilder.Create().StartAt(startTime).EndAt(endTime)
//                             .WithCronSchedule("1,10,14 10,20,25,30,33,54 * * * ? ")
//                             .Build();
// //加入作业调度池中
// await sched.ScheduleJob(job, trigger);
// //开始运行
// await sched.Start();
// //挂起2天
// await Task.Delay(TimeSpan.FromDays(2));
// //Thread.Sleep(TimeSpan.FromDays(2));
// //2天后关闭作业调度，将不在执行
// await sched.Shutdown();
```
