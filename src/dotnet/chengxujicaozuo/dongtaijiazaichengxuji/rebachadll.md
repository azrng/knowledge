---
title: 热拔插DLL
lang: zh-CN
date: 2023-07-09
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: rebachadll
slug: ahbk7p
docsId: '82214411'
---

## 场景
主要运用到宿主与插件这个场景或者动态任务的场景上（假设你现在业务服务已经运行，但是，需要新增加新的业务功能，就可以用这种方式）。

## 思路
主要是根据 AssemblyLoadContext 这个系统提供的API来实现的，已经实现了对DLL程序集的加载和卸载。
之前AppDomain是通过程序域（隔离的环境）的概念进行隔离的，而 AssemblyLoadContext 的话，提供了程序集加载隔离，它允许在单个进程中加载同一程序集的多个版本。
它替换.NET Framework中多个AppDomain实例提供的隔离机制，其中AssemblyLoadContext.Default 表示运行时的默认上下文，该上下文用于应用程序主程序集及其静态依赖项，那么，其他的上下文，就是插件DLL的上下文了。
从概念上讲，加载上下文会创建一个用于加载、解析和可能卸载一组程序集的范围。
这里就根据 AssemblyLoadContext 加载，卸载，来实现热插播逻辑的实现.

## 实现

### 编写DLL加载逻辑
编写公共任务接口
```csharp
/// <summary>
/// 任务接口
/// </summary>
public interface ITask
{
    /// <summary>
    /// 任务的运行方法
    /// </summary>
    /// <returns></returns>
    void Run();
}
```
DLL文件加载
```csharp
/// <summary>
/// dll文件的加载
/// </summary>
public class LoadDll
{
    /// <summary>
    /// 任务实体
    /// </summary>
    public ITask _task;

    public Thread _thread;

    /// <summary>
    /// 核心程序集加载
    /// </summary>
    public AssemblyLoadContext _AssemblyLoadContext { get; set; }

    /// <summary>
    /// 获取程序集
    /// </summary>
    public Assembly _Assembly { get; set; }

    /// <summary>
    /// 文件地址
    /// </summary>
    public string filepath = string.Empty;

    /// <summary>
    /// 指定位置的插件库集合
    /// </summary>
    private AssemblyDependencyResolver Resolver { get; set; }

    public bool LoadFile(string filepath)
    {
        this.filepath = filepath;
        try
        {
            Resolver = new AssemblyDependencyResolver(filepath);
            _AssemblyLoadContext = new AssemblyLoadContext(Guid.NewGuid().ToString("N"), true);
            _AssemblyLoadContext.Resolving += _AssemblyLoadContext_Resolving;

            using var fs = new FileStream(filepath, FileMode.Open, FileAccess.Read);
            var _Assembly = _AssemblyLoadContext.LoadFromStream(fs);
            foreach (var item in _Assembly.GetTypes())
            {
                if (item.GetInterface("ITask") != null)
                {
                    _task = (ITask)Activator.CreateInstance(item);
                    break;
                }
            }
            return true;
        }
        catch (Exception ex) { Console.WriteLine($"LoadFile:{ex.Message}"); };
        return false;
    }

    private Assembly _AssemblyLoadContext_Resolving(AssemblyLoadContext arg1, AssemblyName arg2)
    {
        Console.WriteLine($"加载{arg2.Name}");
        var path = Resolver.ResolveAssemblyToPath(arg2);
        if (!string.IsNullOrEmpty(path))
        {
            using var fs = new FileStream(path, FileMode.Open, FileAccess.Read);
            return _AssemblyLoadContext.LoadFromStream(fs);
        }
        return null;
    }

    /// <summary>
    /// 开始任务
    /// </summary>
    /// <returns></returns>
    public bool StartTask()
    {
        bool runState = false;
        try
        {
            if (_task != null)
            {
                _thread = new Thread(new ThreadStart(Run))
                {
                    IsBackground = true
                };
                _thread.Start();
                runState = true;
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"StartTask:{ex.Message}");
        };
        return runState;
    }

    /// <summary>
    /// 停止执行
    /// </summary>
    /// <returns></returns>
    public bool UnLoad()
    {
        try
        {
            _thread?.Interrupt();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"UnLoad:{ex.Message}");
        }
        finally
        {
            _thread = null;
        }

        _task = null;

        try
        {
            _AssemblyLoadContext?.Unload();
        }
        catch (Exception)
        { }
        finally
        {
            _AssemblyLoadContext = null;
            GC.Collect();
            GC.WaitForPendingFinalizers();
        }
        return true;
    }

    /// <summary>
    /// 运行任务
    /// </summary>
    private void Run()
    {
        try
        {
            _task.Run();
        }
        catch (Exception ex) { Console.WriteLine($"_Run 任务中断执行:{ex.Message}"); };
    }
}
```

### 编写插件
PrintDateLib
```csharp
public class PrintDate : ITask
{
    public void Run()
    {
        while (true)
        {
            Console.WriteLine($"PrintDate:{DateTime.Now}");
            Thread.Sleep(1 * 1000);
        }
    }
}
```
PrintStrLib
```csharp
public class PrintStr : ITask
{
    public void Run()
    {
        int a = 0;
        while (true)
        {
            Console.WriteLine("printStr:" + a);
            a++;
            Thread.Sleep(1000);
        }
    }
}
```

### 加载逻辑
```csharp
Console.WriteLine("热拔插");
var list = new List<LoadDll>();
list.Add(Load(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "DLL", "PrintDateLib.dll")));
list.Add(Load(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "DLL", "PrintStrLib.dll")));

foreach (var dll in list)
{
    dll.StartTask();
}

Console.WriteLine("开启 了任务");
SpinWait.SpinUntil(() => false, 5 * 1000);
foreach (var dll in list)
{
    var s = dll.UnLoad();
    SpinWait.SpinUntil(() => false, 2 * 1000);
    Console.WriteLine("任务卸载：" + s);
}

Console.WriteLine("测试完成");

Console.WriteLine("Hello, World!");

static LoadDll Load(string path)
{
    var load = new LoadDll();
    load.LoadFile(path);
    return load;
}
```

## 资料
热拔插逻辑实现：[https://mp.weixin.qq.com/s/dc1rT6_tyGrqqJU3p8efeg](https://mp.weixin.qq.com/s/dc1rT6_tyGrqqJU3p8efeg)
