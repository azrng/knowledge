---
title: AutoMapperdotNetF
lang: zh-CN
date: 2023-10-18
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - mapper
filename: automapperdotnetf
slug: hmg3uo
docsId: '45650826'
---

## 概述
配置应仅发生一次每个应用程序域。这意味着放置配置代码的最佳位置是在应用程序启动中，例如用于 ASP.NET 应用程序的 Global.asax 文件。通常，配置引导器类位于自己的类中，此引导器类从启动方法中调用。引导器类应构建一个对象来配置类型映射。

## 操作

### Initialize
Initialize方法是Mapper的初始化，里面可以写上CreateMap表达式,具体是谁和谁进行匹配。在之后就可以直接进行一个获取值的过程了，非常的简单。
```csharp
    Mapper.Initialize(x => x.CreateMap<Destination, Source>());//mapper的初始化，里面写上createmap表达式
    Source source = Mapper.Map<Source>(des);
    Console.WriteLine(source.InfoUrl);
```

## 映射前后的操作
偶尔有的时候你可能需要在映射的过程中，你需要执行一些逻辑，这是非常常见的事情，所以AutoMapper给我们提供了BeforeMap和AfterMap两个函数。
```csharp
            Mapper.Initialize(x => x.CreateMap<Destination, Source>().
            BeforeMap((src, dest) => src.InfoUrl = "https://" + src.InfoUrl)
            .BeforeMap((src, dest) => src.name = "你好" + src.name).AfterMap(
                (src, dest) => src.name = "真棒" + src.name));

            //测试BeforeMap和AfterMap的效果
            Mapper.Initialize(x => x.CreateMap<Destination, Source>().
            BeforeMap((src, dest) => src.InfoUrl = "https://" + src.InfoUrl).
            BeforeMap((src, dest) => dest.name = dest.name = "你好" + des.name)
           .AfterMap((a, b) => b.name = "年" + b.name)
            );
```

## 条件映射
在条件映射中，通过ForMember函数，参数是一个委托类型Fun<>,其里面呢也是可以进行嵌套的，但一般来说一个就够用了
```csharp
Mapper.Initialize(x => x.CreateMap<Destination, Source>().ForMember(dest => dest.InfoUrl,opt => opt.Condition(dest => dest.InfoUrl == "www.cnblogs.com/zaranet1")).ForMember(...(.ForMember(...))));
```
```csharp
    Mapper.Initialize(x => x.CreateMap<Destination, Source>()
    .ForMember(dest => dest.InfoUrl, opt => opt.Condition(dest => dest.InfoUrl == "www.cnblogs.com/ZaraNet/p/100003112.html")));
    Source source = Mapper.Map<Source>(des);
    Console.WriteLine(source.InfoUrl);
```

## 公共类
```csharp
        /// <summary>
        ///  类型映射
        /// </summary>
        public static T MapTo<T>(object obj)
        {
            if (obj == null) return default;
            Mapper.Initialize(t => t.CreateMap<object, T>());
            return Mapper.Map<T>(obj);
        }

        public static Source Map(object a)
        {
            Mapper.Initialize(t => t.CreateMap<object, Source>()); ;
            return Mapper.Map<Source>(a);
        }
```

