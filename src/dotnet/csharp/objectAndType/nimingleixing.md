---
title: 匿名类型
lang: zh-CN
date: 2023-10-22
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 无
filename: nimingleixing
slug: opt98a
docsId: '63395217'
---

### 修改匿名类型值
```csharp
public void UpdateAnonymousValue()
{
    var myAnonInstance = new { Name = "Anonymous", Age = 18 };
    Console.WriteLine(myAnonInstance);
    myAnonInstance.Set(x => x.Name, "Anonymous 测试")
        .Set(x => x.Age, 42);
    Console.WriteLine(myAnonInstance);
}
```
结果
```csharp
{ Name = Anonymous, Age = 18 }
{ Name = Anonymous 测试, Age = 42 }
```

### 匿名扩展类
```csharp
/// <summary>
/// 匿名类扩展
/// </summary>
public static class AnoymousExtensions
{
    private const BindingFlags _fieldFlags = BindingFlags.NonPublic | BindingFlags.Instance;
    private static readonly string[] _backingFieldFormats = { "<{0}>i__Field", "<{0}>" };

    /// <summary>
    /// 设置匿名类型的值
    /// </summary>
    /// <param name="instance"></param>
    /// <param name="propExpression"></param>
    /// <param name="newValue"></param>
    /// <typeparam name="T"></typeparam>
    /// <typeparam name="TProperty"></typeparam>
    /// <returns></returns>
    /// <exception cref="ArgumentNullException"></exception>
    /// <exception cref="NotSupportedException"></exception>
    public static T Set<T, TProperty>(this T instance, Expression<Func<T, TProperty>> propExpression, TProperty newValue) where T : class
    {
        if (propExpression?.Body is null)
            throw new ArgumentNullException(nameof(propExpression));

        var pi = (propExpression.Body as MemberExpression)?.Member;
        if (pi is null)
            throw new ArgumentNullException(nameof(propExpression));

        var backingFieldNames = _backingFieldFormats.Select(x => string.Format(x, pi.Name)).ToList();
        var fi = typeof(T).GetFields(_fieldFlags).FirstOrDefault(f => backingFieldNames.Contains(f.Name));
        if (fi == null)
            throw new NotSupportedException($"Cannot find backing field for {pi.Name}");

        fi.SetValue(instance, newValue);
        return instance;
    }
}
```
