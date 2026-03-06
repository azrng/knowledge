---
title: EasyQuartz
lang: zh-CN
date: 2023-10-18
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: easyquartz
slug: nsvdf1g3qt6x2ip2
docsId: '116202995'
---

## 前言
平常项目中你会选择哪个任务调度组件那？是Quartz还是Hangfire，又或者是Coravel、ScheduleMaster、FluentScheduler那？
对于Quartz和Hangfire我都使用过，我知道他们都可以实现秒级别精度的调度并且都支持Cron，看板的话Hangfire自带有，Quartz的话第三方工具自带有，比如本文要介绍的东西：EasyQuartz
该组件是朋友最新编写的一个组件，框架版本为长期支持版本.Net6.0，支持面板以及MySQL存储(其他存储方案留有扩展口)，项目源码地址为：[https://gitee.com/CRole/EasyQuartz](https://gitee.com/CRole/EasyQuartz)

## 界面
想了解一个的东西，首先要看外表，找东西是这样子，找组件也是这样子
可以看执行的记录
对待执行的任务也可以立即执行

## 对接步骤

### 安装nuget包
dotnet add package EasyQuartz

### 注入服务
```
using EasyQuartz;
 public void ConfigureServices(IServiceCollection services)
 {
        //Add Service
        services.AddEasyQuartz();
 }
```

### 创建Job

###### 第一种方式，通过特性指定Cron
```
[TriggerCron("0/1 * * * * ? *")]
public class Test1Job : IJob
{
    public Task Execute(IJobExecutionContext context)
    {
        Console.WriteLine($"{DateTime.Now}我是  Test1Job");
        return Task.CompletedTask;
    }
}
```

###### 第二种方式，通过继承EasyQuartzJob 来指定Cron
```
public class Test2Job : EasyQuartzJob, IJob
{
    private readonly IConfiguration _configuration;

    public Test2Job(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public override string Cron => _configuration["Test2JobCron"];

    public Task Execute(IJobExecutionContext context)
    {
        Console.WriteLine($"{DateTime.Now}我是  Test2Job");
        return Task.CompletedTask;
    }
}
```

### 数据持久化和控制面板

###### 需要引入包 EasyQuartzStorage.MySql 和 EasyQuartz.Dashboard
```
using EasyQuartz;
 builder.Services.AddEasyQuartz(e =>
 {
  e.UseMySql(m => { m.ConnectionString = "server=XXX;user=root;database='XXX';port=3306;password=XXX;SslMode=None"; });
  e.UseDashboard();
 });
```

###### 默认通过 [http://ip](http://ip/):端口号/easyjob 访问
