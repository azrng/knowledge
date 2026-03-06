---
title: 生命周期
lang: zh-CN
date: 2022-08-28
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: shengmingzhouji
slug: cc13u2
docsId: '31433171'
---

## 瞬时生命周期
```csharp
//每次获取对象都是一个全新的实例
var containerBuilder = new ContainerBuilder();
containerBuilder.RegisterType<UserServiceA>().As<IUserServiceA>().InstancePerDependency();
var container = containerBuilder.Build();
var serviceA = container.Resolve<IUserServiceA>();//获取服务
var serviceB = container.Resoq
```

## 单例生命周期
```csharp
//整个进程中共用一个实例对象
var containerBuilder = new ContainerBuilder();
containerBuilder.RegisterType<UserServiceA>().As<IUserServiceA>().SingleInstance();
var container = containerBuilder.Build();
var serviceA = container.Resolve<IUserServiceA>();//获取服务
var serviceB = container.Resolve<IUserServiceA>();//获取服务
var flag = object.ReferenceEquals(serviceA, serviceB);//true
```

## 范围生命周期
```csharp
//每个生命周期范围一个实例对象
var containerBuilder = new ContainerBuilder();
containerBuilder.RegisterType<UserServiceA>().As<IUserServiceA>().InstancePerLifetimeScope();
var container = containerBuilder.Build();
IUserServiceA testService1 = null;
IUserServiceA testService2 = null;
using (var scope1=container.BeginLifetimeScope())//生命周期范围
{
    var serviceA = scope1.Resolve<IUserServiceA>();//获取服务
    var serviceB = scope1.Resolve<IUserServiceA>();//获取服务
    var flag = object.ReferenceEquals(serviceA, serviceB);//true
    testService1 = serviceB;
}

using (var scope1 = container.BeginLifetimeScope())//生命周期范围
{
    var serviceA = scope1.Resolve<IUserServiceA>();//获取服务
    var serviceB = scope1.Resolve<IUserServiceA>();//获取服务
    var flag = object.ReferenceEquals(serviceA, serviceB);//true
    testService2 = serviceB;
}
var flag1 = object.ReferenceEquals(testService1, testService2);//false
```

## 每个匹配生命周期一个实例
```csharp
//每个【匹配生命周期范围一个实例】
var containerBuilder = new ContainerBuilder();
containerBuilder.RegisterType<UserServiceA>().As<IUserServiceA>().InstancePerMatchingLifetimeScope("test");
var container = containerBuilder.Build();
IUserServiceA testService1 = null;
IUserServiceA testService2 = null;
using (var scope1 = container.BeginLifetimeScope("test"))//生命周期范围
{
    var serviceA = scope1.Resolve<IUserServiceA>();//获取服务
    using (var scope2=scope1.BeginLifetimeScope())
    {
        var serviceB = scope1.Resolve<IUserServiceA>();//获取服务
        var flag = object.ReferenceEquals(serviceA, serviceB);//true
    }
    testService1 = serviceA;
}

using (var scope1 = container.BeginLifetimeScope("test"))//生命周期范围
{
    var serviceA = scope1.Resolve<IUserServiceA>();//获取服务
    using (var scoper2=scope1.BeginLifetimeScope())
    {
        var serviceB = scope1.Resolve<IUserServiceA>();//获取服务
        var flag = object.ReferenceEquals(serviceA, serviceB);//true
    }
    testService2 = serviceA;
}
var flag1 = object.ReferenceEquals(testService1, testService2);//false
```

