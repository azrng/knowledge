---
title: 官方批量注入
lang: zh-CN
date: 2023-04-02
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: guanfangpiliangzhuru
slug: gplzxc
docsId: '29987963'
---

## 简化版本
```csharp
var types = Assembly.GetExecutingAssembly().GetTypes()
	.Where(x => typeof(BaseService).IsAssignableFrom(x) && x.IsClass && !x.IsAbstract);
foreach (var type in types)
{
	var interfaceList = type.GetInterfaces();
	if (interfaceList.Any())
	{
		var inter = interfaceList.First();
		services.AddTransient(inter, type);
	}
}
```
> 该版本只能实现：注入的是必须是继承于BaseService抽象类的，并且只能是当前程序集的，其他方式需要在该基础上进行改造


## 官方方法
```csharp
public static class StartUpExtenions
{
	/// <summary>
	/// 批量注册服务
	/// </summary>
	/// <param name="services">DI服务</param>
	/// <param name="assemblys">需要批量注册的程序集集合</param>
	/// <param name="baseType">基础类/接口</param>
	/// <param name="serviceLifetime">服务生命周期</param>
	/// <returns></returns>
	public static IServiceCollection BatchRegisterService(this IServiceCollection services, Assembly[] assemblys, Type baseType, ServiceLifetime serviceLifetime = ServiceLifetime.Singleton)
	{
		List<Type> typeList = new List<Type>();  //所有符合注册条件的类集合
		foreach (var assembly in assemblys)
		{
			//筛选当前程序集下符合条件的类
			var types = assembly.GetTypes().Where(t => !t.IsInterface && !t.IsSealed && !t.IsAbstract && baseType.IsAssignableFrom(t));
			if (types != null && types.Count() > 0)
				typeList.AddRange(types);
		}
		if (typeList.Count() == 0)
			return services;

		var typeDic = new Dictionary<Type, Type[]>(); //待注册集合
		foreach (var type in typeList)
		{
			var interfaces = type.GetInterfaces();   //获取接口
			typeDic.Add(type, interfaces);
		}
		if (typeDic.Keys.Count() > 0)
		{
			foreach (var instanceType in typeDic.Keys)
			{
				foreach (var interfaceType in typeDic[instanceType])
				{
					//根据指定的生命周期进行注册
					switch (serviceLifetime)
					{
						case ServiceLifetime.Scoped:
							services.AddScoped(interfaceType, instanceType);
							break;
						case ServiceLifetime.Singleton:
							services.AddSingleton(interfaceType, instanceType);
							break;
						case ServiceLifetime.Transient:
							services.AddTransient(interfaceType, instanceType);
							break;
					}
				}
			}
		}
		return services;
	}
}

在configureService方法中调用批量注册
services.BatchRegisterService(new Assembly[] { Assembly.GetExecutingAssembly(), Assembly.Load("Test.DAL") }, typeof(IDependency)); 
```
