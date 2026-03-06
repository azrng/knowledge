---
title: 循环依赖
lang: zh-CN
date: 2022-10-25
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: xunhuanyilai
slug: bhfsno
docsId: '29988632'
---
在构建应用程序时候，良好的设计应该避免服务之间的循环依赖，循环依赖之某些组件直接或者间接的相互依赖，例如下图
![image.png](/common/1610415080566-ae69a588-027c-4bbe-a9db-02d9784ee7f7.png)
比如A服务依赖B，B服务依赖C服务，C服务依赖A服务，这样子就造成了循环依赖的场景。

这个时候更推荐的方法当然是重构项目，来解决循环依赖的问题，当然我们这里先采用其他办法解决这个问题。

### 方法一
通过IServiceProvider 去获取某一个服务
```csharp
class C : IC
{
    private readonly IServiceProvider _services;

    public C(IServiceProvider services)
    {
        _services = services;
    }

    public void Bar()
    {
        ...
        var a = _services.GetRequiredService<IA>();
        a.Foo();
        ...
    }
}
```

### 方法二
借助`Lazy<T>`，添加一个IServiceCollection拓展
```csharp
    public static class LazyExtession
    {
        public static IServiceCollection AddLazyResolution(this IServiceCollection services)
        {
            return services.AddTransient(
                typeof(Lazy<>),
                typeof(LazilyResolved<>));
        }

        private class LazilyResolved<T> : Lazy<T>
        {
            public LazilyResolved(IServiceProvider serviceProvider)
                : base(serviceProvider.GetRequiredService<T>)
            {
            }
        }
    }
```
然后在ConfigureServices里面注入
> services.AddLazyResolution();

然后在依赖的类中想使用某一个类，就可以注入Lazy，然后访问lazy的值Value
```csharp

class C : IC
{
    private readonly Lazy<IA> _a;

    public C(Lazy<IA> a)
    {
        _a = a;
    }

    public void Bar()
    {
        ...
        _a.Value.Foo();
        ...
    }
}
```
注意：不要访问构造函数中的值，保存Lazy即可 ，在构造函数中访问该值，这将导致我们试图解决的相同问题。

### 方法三
通过借助消息队列的方式实现解耦
