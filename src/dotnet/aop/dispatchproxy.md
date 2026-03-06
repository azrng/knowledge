---
title: DispatchProxy
lang: zh-CN
date: 2023-03-05
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: dispatchproxy
slug: wssxyv
docsId: '83786092'
---

## 简述
是.Net原生的一种实现动态代理的方案。

## 操作
定义DynamicProxy类来继承自DispatchProxy
```csharp
public class DynamicProxy<T> : DispatchProxy
{
    /// <summary>
    /// 目标类
    /// </summary>
    public T Decorated { get; set; }

    /// <summary>
    /// 动作之后执行
    /// </summary>
    public Action<object[]> AfterAction { get; set; }

    /// <summary>
    /// 动作之前执行
    /// </summary>
    public Action<object[], object> BeforeAction { get; set; }

    protected override object Invoke(MethodInfo targetMethod, object[] args)
    {
        Exception exception = null;
        AfterActionMethod(args);
        object result = null;
        try
        {
            //调用实际目标对象的方法
            result = targetMethod?.Invoke(Decorated, args);
        }
        catch (Exception ex)
        {
            exception = ex;
        }
        BeforeActionMethod(args, result);
        //调用完执行方法后的委托，如果有异常，抛出异常
        if (exception != null)
        {
            throw exception;
        }
        return result;
    }

    /// <summary>
    /// 创建代理实例
    /// </summary>
    /// <param name="decorated">代理的接口类型</param>
    /// <param name="afterAction">方法执行前执行的事件</param>
    /// <param name="beforeAction">方法执行后执行的事件</param>
    /// <returns></returns>
    public T Create(T decorated, Action<object[]> afterAction, Action<object[], object> beforeAction)
    {
        object proxy = Create<T, DynamicProxy<T>>(); // 调用DispatchProxy 的Create创建一个新的T
        DynamicProxy<T> proxyDecorator = (DynamicProxy<T>)proxy;
        proxyDecorator.Decorated = decorated;
        //把自定义的方法委托给代理类
        proxyDecorator.AfterAction = afterAction;
        proxyDecorator.BeforeAction = beforeAction;
        return (T)proxy;
    }

    private void AfterActionMethod(object[] args)
    {
        try
        {
            AfterAction.Invoke(args);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"执行之前异常：{ex.Message}，{ex.StackTrace}");
        }
    }

    private void BeforeActionMethod(object[] args, object result)
    {
        try
        {
            BeforeAction.Invoke(args, result);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"执行之后异常：{ex.Message}，{ex.StackTrace}");
        }
    }
}
```
编写拦截器处理
```csharp
/// <summary>
/// 拦截器
/// </summary>
public interface IInterceptor
{
    /// <summary>
    /// 执行之前
    /// </summary>
    /// <param name="args">参数</param>
    void AfterAction(object[] args);

    /// <summary>
    /// 执行之后
    /// </summary>
    /// <param name="args">参数</param>
    /// <param name="result">结果</param>
    void BeforeAction(object[] args, object result);
}
```
编写自定义特性用来标记使用哪个逻辑处理
```csharp
/// <summary>
/// Aop特性 用户标记类具体使用哪个hander的实现来处理业务
/// </summary>
[AttributeUsage(AttributeTargets.Class)]
public class InterceptAttribut : Attribute
{
    public Type Type { get; set; }

    public InterceptAttribut(Type type)
    {
        Type = type;
    }
}
```
编写一个处理实现AopTest继承自IInterceptor
```csharp
/// <summary>
/// 一个aop示例
/// </summary>
public class AopTest : IInterceptor
{
    public void AfterAction(object[] args)
    {
        Console.WriteLine($"AOP方法执行之前，args：{args}");
        //throw new Exception("异常测试（异常，但依然不能影响程序执行）");
    }

    public void BeforeAction(object[] args, object result)
    {
        Console.WriteLine($"AOP方法执行之后，args：{args}，result：{result}");
    }
}
```
编写创建代理工厂的方法
```csharp
public static class ProxyFactory
{
    /// <summary>
    /// 创建代理实例
    /// </summary>
    /// <returns></returns>
    public static T Create<T>() where T : class
    {
        var decorated = ServiceProviderHelper.GetRequiredService<T>();
        var type = decorated.GetType();
        var interceptAttribut = type.GetCustomAttribute<InterceptAttribut>();
        if (interceptAttribut is null)
            throw new ArgumentNullException("该方法未标注特性");
        var interceptor = ServiceProviderHelper.GetRequiredService<IInterceptor>(interceptAttribut.Type);
        //创建代理类
        var proxy = new DynamicProxy<T>().Create(decorated, interceptor.AfterAction, interceptor.BeforeAction);
        return proxy;
    }
}
```
注册我们的服务
```csharp
builder.Services.AddScoped(typeof(AopTest));
builder.Services.AddScoped<IUserService, UserService>();
```
编写业务类
```csharp
public interface IUserService
{
    int Add(int a, int b);
}

[InterceptAttribut(typeof(AopTest))]
public class UserService : IUserService
{
    public int Add(int a, int b)
    {
        Console.WriteLine($"正在执行  add{a},{b}");
        return a+b;
    }
}
```
调用示例
```csharp
var userService = ProxyFactory.Create<IUserService>();
var sum = userService.Add(1, 2);
```
输出效果
AOP方法执行之前，args：System.Object[]
正在执行  add1,2
AOP方法执行之后，args：System.Object[]，result：3

## 引用
用到了一个公共的类ServiceProviderHelper
```csharp
public static class ServiceProviderHelper
{
    /// <summary>
    /// 全局服务提供者
    /// </summary>
    public static IServiceScope ServiceProvider { get; private set; } = null!;

    /// <summary>
    /// 初始化构建ServiceProvider对象
    /// </summary>
    /// <param name="serviceProvider"></param>
    /// <exception cref="ArgumentNullException"></exception>
    public static void InitServiceProvider(IServiceProvider serviceProvider)
    {
        if (serviceProvider == null)
        {
            throw new ArgumentNullException(nameof(serviceProvider));
        }
        ServiceProvider = serviceProvider.CreateScope();
    }

    /// <summary>
    /// 获取服务
    /// </summary>
    /// <returns></returns>
    /// <exception cref="ArgumentException"></exception>
    public static T GetRequiredService<T>() where T : class
    {
        return ServiceProvider.ServiceProvider.GetRequiredService<T>();
    }

    public static T GetRequiredService<T>(Type serviceType)
    {
        return (T)ServiceProvider.ServiceProvider.GetRequiredService(serviceType);
    }
}
```
注册方案
```csharp
ServiceProviderHelper.InitServiceProvider(app.Services);
```
