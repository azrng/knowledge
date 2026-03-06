---
title: 支持AOP
lang: zh-CN
date: 2021-06-19
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: zhichiaop
slug: nu8pi0
docsId: '31436010'
---

## 介绍
在不用修改之前代码的基础上，可以动态在某一动作之前加上一些操作，动态在某一个动作之后做一些操作

- 引用包Autofac.Extras.DynamicProxy
- 在服务上标记[Intercept(typeof(CustomAutofacAop))]
- 注册支持Aop的扩展类
   - containerBuilder.RegisterType(typeof(CustomAutofacAop));

## 通过接口实现Aop

### 创建接口
```csharp
    public interface IUserServiceA
    {
        string GetInfo();
    }
    public class UserServiceA : IUserServiceA
    {
        public string GetInfo()
        {
            return "成功";
        }
    }
```

### Autofac注册
```csharp
public void ConfigureContainer(ContainerBuilder builder)
{
    //AOP
    builder.RegisterType<MyInterceptor>();//注册拦截器
    builder.RegisterType<UserServiceA>().As<IUserServiceA>().PropertiesAutowired()
        .InterceptedBy(typeof(MyInterceptor)).EnableInterfaceInterceptors();//开启拦截器
}
```
编写Aop
```csharp
    public class MyInterceptor : IInterceptor
    {
        public void Intercept(IInvocation invocation)
        {
            Console.WriteLine($"Intercept 开始 {invocation.Method.Name}");
            invocation.Proceed();//执行这句话就是去执行具体的实例的这个方法
            Console.WriteLine($"Intercept 结束 {invocation.Method.Name}");
        }
    }
```
在服务的接口上标记
```csharp
 	[Intercept(typeof(CustomAutofacAop))]
    public interface IUserServiceA
    {
        string GetInfo();
    }
```
> 结果就是通过该接口访问都会走aop类


## 通过类实现AOP

### 创建接口
```csharp
    public interface IUserServiceA
    {
        string GetInfo();
    }
    public class UserServiceA : IUserServiceA
    {
        public string GetInfo()
        {
            return "成功";
        }
    }
```

### Autofac注入
```csharp
public void ConfigureContainer(ContainerBuilder  containerBuilder)
{
    #region 支持AOP
    containerBuilder.RegisterType(typeof(CustomAutofacAop));
    containerBuilder.RegisterType<UserServiceB>().As<IUserServiceB>()
        .EnableClassInterceptors();
    #endregion
}
```
编写Aop
```csharp
 public class CustomAutofacAop : IInterceptor
    {
        public void Intercept(IInvocation invocation)
        {
            Console.WriteLine("方法执行前");

            invocation.Proceed();//执行这句话就是去执行具体的实例的这个方法

            Console.WriteLine("方法执行后");
        }
    }
```
在服务的接口上标记
```csharp
    [Intercept(typeof(CustomAutofacAop))]
    public class UserServiceA : IUserServiceA
    {
        public virtual string GetInfo()
        {
            return "成功";
        }
    }
```
> 注意：类上标记Aop，里面的方法需要定义为虚方法

结果就是通过该接口访问都会走aop类
