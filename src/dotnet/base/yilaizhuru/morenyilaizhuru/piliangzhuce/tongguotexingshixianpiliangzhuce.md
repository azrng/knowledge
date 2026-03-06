---
title: 通过特性实现批量注册
lang: zh-CN
date: 2023-04-02
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: tongguotexingshixianpiliangzhuce
slug: pp43vh
docsId: '51504899'
---

## 创建特性
```csharp
/// <summary>
/// 瞬时注入(使用该特性的服务系统会自动注入)
/// </summary>
[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method | AttributeTargets.Property)]
public class TransientAttribute : Attribute
{
    /// <summary>
    /// 是否使用自身的类型进行注入
    /// </summary>
    public bool Itself { get; set; }

    /// <summary>
    /// 瞬时注入
    /// </summary>
    public TransientAttribute()
    {
    }

    /// <summary>
    /// 是否使用自身的类型进行注入
    /// </summary>
    /// <param name="itself"></param>
    public TransientAttribute(bool itself = false)
    {
        Itself = itself;
    }
}
/// <summary>
/// 范围注入(使用该特性的服务系统会自动注入)
/// </summary>
[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method | AttributeTargets.Property)]
public class ScopedAttribute : Attribute
{
    /// <summary>
    /// 是否使用自身的类型进行注入
    /// </summary>
    public bool Itself { get; set; }

    /// <summary>
    /// 范围注入
    /// </summary>
    public ScopedAttribute()
    {
    }

    /// <summary>
    /// 是否使用自身的类型进行注入
    /// </summary>
    /// <param name="itself"></param>
    public ScopedAttribute(bool itself = false)
    {
        Itself = itself;
    }
}
/// <summary>
/// 单例注入(使用该特性的服务系统会自动注入)
/// </summary>
[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method | AttributeTargets.Property)]
public class SingletonAttribute : Attribute
{
    /// <summary>
    /// 是否使用自身的类型进行注入
    /// </summary>
    public bool Itself { get; set; }

    /// <summary>
    /// 单例注入
    /// </summary>
    public SingletonAttribute()
    {
        Itself = false;
    }

    /// <summary>
    /// 是否使用自身的类型进行注入
    /// </summary>
    /// <param name="itself"></param>
    public SingletonAttribute(bool itself)
    {
        Itself = itself;
    }
}
```

## 注册公共方法
```csharp
/// <summary>
/// 从指定程序集中注入服务
/// </summary>
/// <param name="services"></param>
/// <param name="assembly"></param>
/// <returns></returns>
public static IServiceCollection AddServicesFromAssembly(this IServiceCollection services, Assembly assembly)
{
    foreach (var type in assembly.GetTypes().Where(x => x.IsClass && !x.IsAbstract).ToArray())
    {
        #region ==单例注入==

        var singletonAttr = (SingletonAttribute)Attribute.GetCustomAttribute(type, typeof(SingletonAttribute));
        if (singletonAttr != null)
        {
            //注入自身类型
            if (singletonAttr.Itself)
            {
                services.AddSingleton(type);
                continue;
            }

            var interfaces = type.GetInterfaces().Where(m => m != typeof(IDisposable)).ToList();
            if (interfaces.Count > 0)
            {
                foreach (var i in interfaces)
                {
                    services.AddSingleton(i, type);
                }
            }
            else
            {
                services.AddSingleton(type);
            }

            continue;
        }

        #endregion

        #region ==瞬时注入==

        var transientAttr = (TransientAttribute)Attribute.GetCustomAttribute(type, typeof(TransientAttribute));
        if (transientAttr != null)
        {
            //注入自身类型
            if (transientAttr.Itself)
            {
                services.AddSingleton(type);
                continue;
            }

            var interfaces = type.GetInterfaces().Where(m => m != typeof(IDisposable)).ToList();
            if (interfaces.Count > 0)
            {
                foreach (var i in interfaces)
                {
                    services.AddTransient(i, type);
                }
            }
            else
            {
                services.AddTransient(type);
            }

            continue;
        }

        #endregion

        #region ==Scoped注入==

        var scopedAttr = (ScopedAttribute)Attribute.GetCustomAttribute(type, typeof(ScopedAttribute));
        if (scopedAttr == null)
            continue;
        {
            //注入自身类型
            if (scopedAttr.Itself)
            {
                services.AddSingleton(type);
                continue;
            }

            var interfaces = type.GetInterfaces().Where(m => m != typeof(IDisposable)).ToList();
            if (interfaces.Count > 0)
            {
                foreach (var i in interfaces)
                {
                    services.AddScoped(i, type);
                }
            }
            else
            {
                services.AddScoped(type);
            }
        }

        #endregion
    }

    return services;
}
```

## 具体操作
ConfigureServices配置
```csharp
services.AddServicesFromAssembly(Assembly.GetExecutingAssembly());
```
在需要注入的实现类上面标注特性
```csharp
[Transient]
public class UserService : IUserService
```
