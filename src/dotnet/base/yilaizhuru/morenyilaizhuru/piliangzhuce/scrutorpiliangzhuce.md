---
title: Scrutor批量注册
lang: zh-CN
date: 2023-06-28
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: scrutorpiliangzhuce
slug: rdtsat
docsId: '81667638'
---

## 介绍
Microsoft.Extensions.DependencyInjection 的程序集扫描和装饰扩展。
仓库地址：[https://github.com/khellang/Scrutor](https://github.com/khellang/Scrutor)

## 操作
引用nuget包
```csharp
<PackageReference Include="Scrutor" Version="4.2.0" />
```
注册示例
```csharp
// Add services to the container.
builder.Services.Scan(selector => selector
//加载指定类对应的程序集
             .FromAssemblyOf<Program>()
             //过滤程序集中需要注册的类，可以添加多个class
             .AddClasses(classes => classes.Where(t => t.Name.EndsWith("Service")))
             //暴露匹配的接口
             .AsMatchingInterface()
             //暴露每一个接口  将实现的继承的所有接口都注入
             //.AsImplementedInterfaces()
             //暴露所有接口
             //.As(t => t.GetInterfaces())
             //暴露自己，因为是单一类型 没有接口,只有实现
             .AsSelf()
             //设置重复注册服务的替换策略
             //.UsingRegistrationStrategy(RegistrationStrategy.Skip)
             //设置生命周期 单例 作用域 瞬时
             .WithScopedLifetime());
```
使用就是正常的构造函数注入方案。

## 资料
你真的需要 Autofac 吗？Scrutor：更轻量的容器伴侣：[https://cat.aiursoft.cn/post/2023/3/12/do-you-really-need-autofac-scrutor-a-lightweight-container-companion](https://cat.aiursoft.cn/post/2023/3/12/do-you-really-need-autofac-scrutor-a-lightweight-container-companion)
