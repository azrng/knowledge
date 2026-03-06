---
title: 启动exe无界面方案
lang: zh-CN
date: 2023-07-27
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: qidongexemojiemianfangan
slug: dzg50drihoctwiiw
docsId: '133050649'
---

## 前言
彻底解决【从Windows服务启动程序exe，程序无界面】问题

## 实现过程
实现过程即任务计划实现过程，C#有3种方法，其实就是2种，一种是使用API创建任务，这个方法其实，可以通过系统调用现有dll库实现，最后一种是使用开源库。建议用开源库方式。
调用系统的dll，这dll就是C:\Windows\System32\taskschd.dll，在C#里直接引用就行，它实现API的C#封装，很简单。使用TaskSchedulerClass类连接、创建修改任务计划，很简单，我这不是主推方法，不贴代码，但源码地址里有。
使用开源库TaskScheduler，可以实现，命名空间为Microsoft.Win32.TaskScheduler，下载地址为：[https://github.com/dahall/TaskScheduler](https://github.com/dahall/TaskScheduler)。例子为：[https://github.com/dahall/TaskScheduler/wiki/Examples](https://github.com/dahall/TaskScheduler/wiki/Examples)
```csharp
public static void AddOrRunWinTask( string sTaskName, string sExePath, string sArgs = null )
{
    var task = TaskService.Instance.FindTask(sTaskName, true);
 
    if ( task != null )
    {
        task.Definition.Triggers[0].StartBoundary = DateTime.Now.AddSeconds ( 10 );
        task.RegisterChanges ();
    }
    else
    {
        var td = TaskService.Instance.NewTask ();
 
        td.RegistrationInfo.Author = "白羊佐CSDN";
        td.RegistrationInfo.Description = "用于跨域启动特定程序";
 
        td.Settings.ExecutionTimeLimit = TimeSpan.Zero;//
        td.Settings.DisallowStartIfOnBatteries = false;
        td.Settings.RunOnlyIfIdle = false;
        td.Settings.RunOnlyIfNetworkAvailable = false;
        //此处注意，如果你待启动程序需要管理员权限运行，必须使用Highest，否则使用LUA就行
        td.Principal.RunLevel = TaskRunLevel.Highest;
        //获取Administrators的GroupID
        string sGpId = GetGroupID();
        //此处最为关键，如果不指定用户名ID或组名ID，依旧不显示界面，因为创建时的用户为SYSTEM
        td.Principal.GroupId = sGpId;
 
        var trigger = (TimeTrigger)td.Triggers.Add( new TimeTrigger() );
        trigger.StartBoundary = DateTime.Now.AddSeconds ( 10 );
        trigger.ExecutionTimeLimit = TimeSpan.Zero;
        trigger.Enabled = true;
        td.Actions.Add ( new ExecAction ( sExePath, sArgs ) );
 
        task = TaskService.Instance.RootFolder.RegisterTaskDefinition ( sTaskName, td );
    }
 
    //打开表示立即运行（切运行两次，因为上面有个执行延时）
    //var rz = task.Run ();
}
```
注意，注意，再注意：A、此方法是win10的，因为win10默认屏蔽Administrator用户，我用户属于这个组，所以我这个地方使用这种方式没有问题。但是，其他非Administrators组用户登录可能不行了，那也好解决，将下面代码中GroupPrincipal改为UserPrincipal，用它去找登录的用户名，上面代码设userid，logontype就行。或者输入正确的组名都可以；B、此方式程序的启动位置为System32，你程序的目录获取时要注意了。
```csharp
private static string GetGroupID ()
{
    string sGid = null;
     
    System.DirectoryServices.AccountManagement.PrincipalContext pc = new System.DirectoryServices.AccountManagement.PrincipalContext(System.DirectoryServices.AccountManagement.ContextType.Machine);
    var identity = System.DirectoryServices.AccountManagement.GroupPrincipal.FindByIdentity(pc, "Administrators");
     
    if ( identity != null )
    {
        sGid = identity.Sid.Value;
    }
 
    return sGid;
}
```

## 参考资料
[https://www.cnblogs.com/ZoeWong/p/17516579.html](https://www.cnblogs.com/ZoeWong/p/17516579.html)
