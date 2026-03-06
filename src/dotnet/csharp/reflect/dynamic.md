---
title: dynamic
lang: zh-CN
date: 2023-10-22
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 无
filename: dynamic
slug: yq8g45
docsId: '65938395'
---

## 概述
动态类型语言是指在运行时执行类型检查的语言。如果您不知道您将获得或需要分配的值的类型，则在此情况下，类型是在运行时定义的。

## 操作

### 扩充对象
```csharp
//实例化对象
var stu = new DynamicTestUserInfo {Id = "aa", Name = "bb"};
//将对象转动态类型
dynamic cc = stu.ToExpandoObject();
//给对象赋值 扩充对象
cc.cehi = "dd";

Console.WriteLine(cc.cehi);
```

### ExpandoObject扩展类
```csharp
/// <summary>
/// ExpandoObject扩展
/// </summary>
public static class ExpandoObjectExtensions
{
    /// <summary>
    /// 将对象转为dynamic
    /// </summary>
    /// <param name="obj"></param>
    /// <returns></returns>
    public static dynamic ToExpandoObject<T>(this T obj) where T : class
    {
        var dictionary = new ExpandoObject();
        foreach (var property in obj.GetType().GetProperties())
            dictionary.TryAdd(property.Name, property.GetValue(obj));

        return dictionary;
    }
}
```

## 资料
[https://www.cnblogs.com/simadi/p/6709481.html](https://www.cnblogs.com/simadi/p/6709481.html)
[https://mp.weixin.qq.com/s/XQyBqvtRGBA537NEKpeEYQ](https://mp.weixin.qq.com/s/XQyBqvtRGBA537NEKpeEYQ) | 探究 C## dynamic动态类型本质
