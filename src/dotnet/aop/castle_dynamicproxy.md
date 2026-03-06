---
title: Castle.DynamicProxy
lang: zh-CN
date: 2023-10-15
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: castle_dynamicproxy
slug: kbkgxc
docsId: '78969704'
---
> 最后更新时间：2022年5月30日


## 概述
Castle.DynamicProxy可以实现动态代理的功能，这个也是很多框架的基础。也就是说它是众多开源项目向.NET Core兼容的重要基础组件，也就是开发过程中我们不需要处理切面中(日志等)的工作，而是运行时，通过动态代理来完成。

Castle.Core.AsyncInterceptor 是 Castle.DynamicProxy 的扩展库，它简化了异步方法拦截器的开发。

下载量：372M

## 优势
使用 Castle.Core.AsyncInterceptor 的主要优势是能够使用 async/await 模式拦截异步方法。通过提供简单的拦截方法机制，这简化了异步方法拦截器的开发。

## 操作
引用组件
```csharp
<PackageReference Include="Castle.Core.AsyncInterceptor" Version="2.1.0" />
```

### 动态代理
创建业务代码
```csharp
public interface IUserService
{
    int Add(int a, int b);
}

public class UserService : IUserService
{
    //virtual这个算是castle的一个标志，不管是方法或者是属性都要这个
    public virtual int Add(int a, int b)
    {
        Console.WriteLine($"正在执行  add{a},{b}");
        return a+b;
    }
}
```
创建动态代理的拦截器
```csharp
/// <summary>
/// 动态代理拦截器
/// </summary>
public class Interceptor : IInterceptor
{
    public void Intercept(IInvocation invocation)
    {
        Console.WriteLine("Before target call");
        try
        {
            invocation.Proceed();
        }
        catch (Exception)
        {
            Console.WriteLine("Target threw an exception!");
            throw;
        }
        finally
        {
            Console.WriteLine("After target call");
        }
    }
}
```
执行方法
```csharp
var proxyGenerate = new ProxyGenerator();
var interceptor = new Interceptor();

var pg = proxyGenerate.CreateClassProxy<UserService>(interceptor);
var userService = pg.Add(1, 2);
```
执行方法的时候会进入拦截器处理。

## 资料
官网：[http://www.castleproject.org/](http://www.castleproject.org/)

