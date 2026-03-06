---
title: 拷贝方法
lang: zh-CN
date: 2023-10-25
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 无
filename: kaobeifangfa
slug: bi5se5
docsId: '49682948'
---

## 概述
clone是深拷贝，copy是浅拷贝，如果是值类型的话是没什么区别的，如果是引用类型的话深拷贝拷贝的事整个对象的数据，而浅拷贝仅仅拷贝对象的引用。因为类的实例是引用类型，要想用原有的类中的实例的数据的话，既要想创建原对象的一个副本的话,只能用clone方法。Clone方法分为深clone和浅clone 。

## 深拷贝

### 手动克隆
一个能够保证对象完全按照你所想的那样进行克隆的方式是手工克隆对象的每一个域（field）。这种方式的缺点是麻烦而且容易出错：如果你在类中增加了一个域，你很可能会忘记更新Clone方法。还要在克隆引用对象指向原始对象的时候，注意避免无限循环引用。

### 使用反射进行克隆
用反射进行克隆是使用Activator.CreateInstance方法来创建一个相同类型的新对象，然后用反射对所有域进行浅拷贝。这种方法的优点是它是全自动的，不需要在对象中添加或删除成员的时候修改克隆方法。另外它也能被写成提供深拷贝的方法。缺点是使用了反射，因此会比较慢，而且在部分受信任的环境中是不可用的。

### 使用序列化进行克隆
克隆一个对象的最简单的方法是将它序列化并立刻反序列化为一个新对象。和反射方法一样，序列化方法是自动的，无需在对对象成员进行增删的时候做出修改。缺点是序列化比其他方法慢，甚至比用反射还慢，所有引用的对象都必须是可序列化的（Serializable）。另外，取决于你所使用的序列化的类型（XML，SOAP，二进制）的不同，私有成员可能不能像期望的那样被克隆。
```csharp
/// <summary>
/// 对象深度拷贝，复制出一个数据一样，但地址不一样的新版本
/// </summary>
public static T DeepClone<T>(this T obj) where T : class
{
    if (obj == null)
    {
        return default(T);
    }
    if (typeof(T).HasAttribute<SerializableAttribute>())
    {
        throw new NotSupportedException($"当前对象未标记特性“{typeof(SerializableAttribute)}”，无法进行DeepClone操作");
    }
    var json = JsonConvert.SerializeObject(obj);
    return JsonConvert.DeserializeObject<T>(json);
}
```

### BinaryFormatter
使用BinaryFormatter进行操作，该方法已经被微软标识已经弃用，推荐的替代方案是使用system.text.json进行序列化。
```csharp
public static T DeepClone<T>(this T obj) where T : class
{
    if (obj == null)
        return default;

    if (typeof(T).GetCustomAttributes(typeof(SerializableAttribute), false).Length == 0)
    {
        throw new NotSupportedException($"当前对象未标记特性“{typeof(SerializableAttribute)}”,无法进行DeepClose操作");
    }

    var formatter = new BinaryFormatter();
    using var ms = new MemoryStream();
    formatter.Serialize(ms, obj);
    ms.Seek(0, SeekOrigin.Begin);
    return (T)formatter.Deserialize(ms);
}
```
> 说明地址：[https://docs.microsoft.com/zh-cn/dotnet/standard/serialization/binaryformatter-security-guide](https://docs.microsoft.com/zh-cn/dotnet/standard/serialization/binaryformatter-security-guide)

### 其他组件

#### ObjectClonerObjectCloner

https://github.com/marcelltoth/ObjectClonerObjectCloner 是一个高性能的 .NET 对象克隆开源库，内部使用了表达式树和 Reflection.Emit 。您可以从 NuGet 安装它，然后使用DeepClone方法。

#### 对象映射工具拷贝

比如Mapster、AutoMapper等工具

## 浅拷贝

手动赋值。
```csharp
 var newtreePath = treePath.AsEnumerable().ToList(); // 将一个集合进行浅拷贝
```

## 资料
[https://mp.weixin.qq.com/s/2C2arsJCzHGhexaOqN3pAQ](https://mp.weixin.qq.com/s/2C2arsJCzHGhexaOqN3pAQ) | c# Clone方法
