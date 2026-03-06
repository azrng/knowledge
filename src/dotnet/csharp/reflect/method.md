---
title: 方法
lang: zh-CN
date: 2023-10-22
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 无
filename: fangfa
slug: eorcq0
docsId: '44171493'
---

## IsAssignableFrom
```csharp
bool res = {TypeA}.IsAssignableFrom({TypeB}) ;
如果TypeA和TypeB类型一样则返回true；
如果TypeA是TypeB的父类则返回true;
如果TypeB实现了接口TypeA则返回true;

A.isAssignableFrom(B)
确定一个类(B)是不是继承来自于另一个父类(A)
一个接口(A)是不是实现了另外一个接口(B)或两个类相同
```
通过反射将DataTable转List
```csharp
/// <summary>
/// 反射将datatable转换为List对象
/// </summary>
/// <typeparam name="T">实体类型</typeparam>
/// <param name="this">datatable数据</param>
/// <returns>List对象</returns>
public static List<T> ConvertToListObject<T>(this DataTable @this)
{
	if (@this == null || @this.Rows.Count <= 0)
	{
		return new List<T>();
	}
	List<T> objs = new List<T>();
	for (int i = 0; i < @this.Rows.Count; i++)
	{
		T obj = (T)Activator.CreateInstance(typeof(T));
		obj = ConvertToObjectFromDR(@this.Rows[i], obj);
		objs.Add(obj);
	}
	return objs;
}
```

## 一个类继承另一个类的扩展
```csharp
/// <summary>
/// 一个类是否继承自另外一个类型
/// </summary>
/// <param name="givenType"></param>
/// <param name="genericType"></param>
/// <returns></returns>
public static bool IsAssignableToOpenGenericType(this Type givenType, Type genericType)
{
    foreach (var it in givenType.GetInterfaces())
    {
        if (it.IsGenericType && it.GetGenericTypeDefinition() == genericType)
            return true;
    }
    if (givenType.IsGenericType && givenType.GetGenericTypeDefinition() == genericType)
        return true;
    var baseType = givenType.BaseType;
    return baseType != null && IsAssignableToOpenGenericType(baseType, genericType);
}
```

## 获取程序集中继承某一个泛型
获取继承某一个泛型，且泛型对象是某一个类型
```csharp
var handlerType = typeof(IIntegrationEventHandler<>);
var type = typeof(IntegrationEvent);

assembly.GetTypes().Where(t =>t.IsClass && !t.IsAbstract && t.GetInterfaces()
                          .Any(t => t.IsGenericType && t.GetGenericTypeDefinition() == handlerType && t.GenericTypeArguments[0] == type);
```
