---
title: 反射
lang: zh-CN
date: 2023-10-22
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 无
filename: fanshe
slug: ohfft3
docsId: '31014038'
---

## 描述
反射是一项很基础的技术，它将编译期间的静态绑定转换为延迟到运行期间的动态绑定。程序集包含模块，而模块又包括类型，类型下有成员，反射就是管理程序集、模块、类型的对象，它能够动态的创建类型的实例，设置现有对象的类型或者获取现有对象的类型，能调用类型的方法和访问类型的字段属性。它是在运行时创建和使用类型实例。

## 概念

### 元数据

C# 编写的程序编译成一个程序集，程序集会包含元数据、编译代码和资源。 元数据包含内容：

- 程序或类库中每一个类型的描述；
- 清单信息，包括与程序本身有关的数据，以及它依赖的库；
- 在代码中嵌入的自定义特性，提供与特性所修饰的构造有关的额外信息。

## 反射分类

### type comparison

类型判断，主要包括 is 和 typeof 两个操作符及对象实例上的 GetType 调用。这是最轻型的消耗，可以无需考虑优化问题。注意 typeof 运算符比对象实例上的 GetType 方法要快，只要可能则优先使用 typeof 运算符。

### member enumeration

成员枚举，用于访问反射相关的元数据信息，例如Assembly.GetModule、Module.GetType、Type对象上的 IsInterface、IsPublic、GetMethod、GetMethods、GetProperty、GetProperties、 GetConstructor调用等。尽管元数据都会被CLR缓存，但部分方法的调用消耗仍非常大，不过这类方法调用频度不会很高，所以总体看性能损失程 度中等。

### member invocation

成员调用，包括动态创建对象及动态调用对象方法，主要有Activator.CreateInstance、Type.InvokeMember等。

## 动态创建对象

C#主要支持 5 种动态创建对象的方式：

1. Type.InvokeMember

2. ContructorInfo.Invoke

3. Activator.CreateInstance(Type)

4. Activator.CreateInstance(assemblyName, typeName)

5. Assembly.CreateInstance(typeName)

最快的是方式 3 ，与 Direct Create 的差异在一个数量级之内，约慢 7 倍的水平。其他方式，至少在 40 倍以上，最慢的是方式 4 ，要慢三个数量级。

## 推荐的使用原则

模式

1． 如果可能，则避免使用反射和动态绑定

2． 使用接口调用方式将动态绑定改造为早期绑定

3． 使用Activator.CreateInstance(Type)方式动态创建对象

4． 使用typeof操作符代替GetType调用

反模式

1． 在已获得Type的情况下，却使用Assembly.CreateInstance(type.FullName)

## 常用类库

```csharp
NuGet\Install-Package FastMember -Version 1.5.0
NuGet\Install-Package FastReflection -Version 1.0.0.20
```

## 操作

### 获取指定程序集
```csharp
var assembly = Assembly.GetAssembly(typeof(Program)).FullName;//获取指定的程序集名称
var assembly1 = Assembly.GetExecutingAssembly().FullName;//获取当前运行的程序集名称

var inter2 = Assembly.Load(assembly).GetTypes();//获取当前程序集里面包含的所有类型
```

### 获取类型的成员
```csharp
var members = typeof(object).GetMembers(BindingFlags.Public |
	BindingFlags.Static | BindingFlags.Instance);
foreach (var member in members)
{
	Console.WriteLine($"{member.Name} is a {member.MemberType}");
}
```

### 获取并调用对象的方法
示例：调用service下的jiafa方法
```csharp
 var bbb = service.GetType().GetMethod("jiafa", new[] { typeof(int), typeof(int) });
 var result = bbb.Invoke(service, new object[] { 0, 4 });//4
```

### 给指定类属性赋值
通过反射获取到类对象然后获取到属性进行赋值    
```csharp
var entity = new user();
var createname = entity.GetType().GetProperty("Name");
createname.SetValue(entity,"ceshi");
Console.WriteLine(entity.Name);

//循环拼接字段名赋值
var type = typeof(ChatSatisfactionTemplateOption);
var pro = type.GetProperty("Value" + i);
pro.SetValue(this, values[i]);
```

### 反射执行泛型方法
```csharp
void Main()
{
	Type type = typeof(Program);
	MethodInfo method = type.GetMethod("TestMethod");
	MethodInfo genericMethod = method.MakeGenericMethod(typeof(string));
	genericMethod.Invoke(null, null);
	Console.ReadKey();
}
public static void TestMethod<T>()
{
	Console.WriteLine(typeof(T).FullName);
}
```

## 参考文章
[.Net中的反射(动态创建类型实例) - Part.4](http://www.cnblogs.com/JimmyZhang/archive/2008/03/18/1110711.html)
 [反射生成SQL语句入门](http://www.cnblogs.com/g1mist/p/3227290.html)
C## 反射与特性系列教程：[https://reflect.whuanle.cn](https://reflect.whuanle.cn)
[https://mp.weixin.qq.com/s/8V1u996ZDPhsBs3YXgb6FQ](https://mp.weixin.qq.com/s/8V1u996ZDPhsBs3YXgb6FQ) | C#反射机制
