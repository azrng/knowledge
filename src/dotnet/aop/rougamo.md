---
title: Rougamo
lang: zh-CN
date: 2023-10-14
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: rougamo
slug: smwgnuoz97vzasew
docsId: '135422344'
---

## 概述
静态代码织入AOP，.NET最常用的AOP应该是Castle DynamicProxy，rougamo的功能与其类似，但是实现却截然不同， DynamicProxy是运行时生成一个代理类，通过方法重写的方式执行织入代码，rougamo则是代码编译时直接修改IL代码。

仓库地址：[https://github.com/inversionhourglass/Rougamo](https://github.com/inversionhourglass/Rougamo)

## 操作

### 快速开始(MoAttribute)
```csharp
// 1.NuGet引用Rougamo.Fody
// 2.定义类继承MoAttribute，同时定义需要织入的代码
public class LoggingAttribute : MoAttribute
{
    public override void OnEntry(MethodContext context)
    {
        // 从context对象中能取到包括入参、类实例、方法描述等信息
        Log.Info("方法执行前");
    }

    public override void OnException(MethodContext context)
    {
        Log.Error("方法执行异常", context.Exception);
    }

    public override void OnSuccess(MethodContext context)
    {
        Log.Info("方法执行成功后");
    }

    public override void OnExit(MethodContext context)
    {
        Log.Info("方法退出时，不论方法执行成功还是异常，都会执行");
    }
}

// 3.应用Attribute
public class Service
{
    [Logging]
    public static int Sync(Model model)
    {
        // ...
    }

    [Logging]
    public async Task<Data> Async(int id)
    {
        // ...
    }
}
```

### 根据方法可访问性批量应用
在上面介绍了如何将代码织入到指定方法上，但实际使用时，一个庞大的项目如果每个方法或很多方法都去加上这个Attribute 可能会很繁琐切侵入性较大。
所以MoAttribute设计为可以应用于方法(method)、类(class)、程序集(assembly)和模块(module)， 同时设置了可访问性属性，增加灵活性。
```csharp
// 1.在继承MoAttribute的同时，重写Flags属性，未重写时默认InstancePublic(public实例方法)
public class LoggingAttribute : MoAttribute
{
    // 改为所有public方法有效，不论是实例方法还是静态方法
    public override AccessFlags Flags => AccessFlags.Public;

    // 方法重写省略
}

// 2.应用
// 2.1.应用于类上
[Logging]
public class Service
{
    // Logging织入将被应用
    public static void M1() { }

    // Logging织入将被应用
    public void M2() { }

    // protected访问级别不会应用Logging的代码织入
    protected void M3() { }
}
// 2.2.应用于程序集上，该程序集所有public方法都将应用静态织入
[assembly: Logging]
```

### 重试功能
从1.4.0版本开始，可以在遇到指定异常或者返回值非预期值的情况下重新执行当前方法，实现方式是在OnException和OnSuccess中设置MethodContext.RetryCount值，在OnException和OnSuccess执行完毕后如果MethodContext.RetryCount值大于0那么就会重新执行当前方法。
这个功能有时候真是太方便了.
```csharp
internal class RetryAttribute : MoAttribute
{
    public override void OnEntry(MethodContext context)
    {
        context.RetryCount = 3;
    }

    public override void OnException(MethodContext context)
    {
        context.RetryCount--;
    }

    public override void OnSuccess(MethodContext context)
    {
        context.RetryCount--;
    }
}

// 应用RetryAttribute后，Test方法将会重试3次
[Retry]
public void Test()
{
    throw new Exception();
}
```

## 参考资料
[https://mp.weixin.qq.com/s/XTxEkIw1o6N-cSEJeVzZdQ](https://mp.weixin.qq.com/s/XTxEkIw1o6N-cSEJeVzZdQ) | .NET 静态代码织入 - 轻松实现 AOP
[https://www.cnblogs.com/nigture/p/17753498.html](https://www.cnblogs.com/nigture/p/17753498.html) | .NET静态代码织入——肉夹馍（Rougamo）发布2.0 - nigture - 博客园
