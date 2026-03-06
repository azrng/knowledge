---
title: 过滤器实现-自动事务处理
lang: zh-CN
date: 2022-08-14
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: guolvqishixian-zidongshiwuchuli
slug: fl6hp3
docsId: '89466329'
---

## 目的
因为我们操作数据都是要开启事务的，那么我们每次都写有点麻烦，不如直接使用一个Action过滤器来实现AOP自动开启事务。

关于TransactionScope的简单说明：
当一段代码使用EFCore进行数据操作的代码放到TransactionScope声明的范围中的时候，这段代码会自动被标记为“支持事务”。
TransactionScope实现了一个IDisposable接口，如果一个TransactionScope的对象没有调用Complete()就执行了Dispose()方法，则事务会被回滚，否则事务会就被提交。并且TransactionScope还支持嵌套式事务。
> 在. NetCore中的TransactionScope不像.NetFramework一样有MSDTC(只有在windows环境才有这个东西)分布式事务提升的问题，所以需要使用到分布式事务的场景需要自行处理。


## 操作
```csharp
/// <summary>
/// 不启用自动事务的特性
/// </summary>
[AttributeUsage(AttributeTargets.All)]
public class DisabledTranAttribute : Attribute
{
}

/// <summary>
/// 自动事务处理
/// </summary>
public class TranAttributeFilter : IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        if (context.ActionDescriptor is ControllerActionDescriptor desc)
        {
            bool hasDisabledTranAttribute = desc.MethodInfo.IsDefined(typeof(DisabledTranAttribute), false);
            if (hasDisabledTranAttribute)
            {
                await next();
                return;
            }
        }

        using var tran = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled);
        var result = await next();
        if (result.Exception==null)
        {
            tran.Complete();
        }
    }
}
```
当某些接口不需要开启事务，那么就标注特性就好了
```csharp
/// <summary>
/// 患者吃饭请求类
/// </summary>
/// <param name="request"></param>
/// <returns></returns>
[HttpPost]
[DisabledTran]
public string AddPatientEat(AddPatientEatRequest request)
{
    // xxx
}
```

## 总结
利用该过滤器实现自动开启并且处理事务。
