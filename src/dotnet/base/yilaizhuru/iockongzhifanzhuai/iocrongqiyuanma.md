---
title: IOC容器源码
lang: zh-CN
date: 2023-10-17
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: iocrongqiyuanma
slug: zhb000
docsId: '32872614'
---

## 创建IOC工厂
```csharp
/// <summary>
/// 创建一个ioc工厂
/// 1.创建对象
/// 2.存储对象
/// 3.对象属性赋值
/// </summary>
public class DefaultIOCFactory
{
	/// <summary>
	/// ioc容器（存储对象）
	/// </summary>
	private Dictionary<string, object> _iocContainer = new Dictionary<string, object>();//这里不用list的原因是性能不如dictionary

	/// <summary>
	/// ico type容器
	/// </summary>
	private Dictionary<string, Type> _iocTypeContainer = new Dictionary<string, Type>();

	/// <summary>
	/// 创建ioc容器
	/// </summary>
	public DefaultIOCFactory()
	{
		//1.加载项目中的所有类型(反射类型的集合)
		Assembly assembly = Assembly.Load("ConsoleApp4");
		//2.通过反射从程序集获取对象类型
		var types = assembly.GetTypes();

		//存储type
		foreach (var item in types)
		{
			var iocService = item.GetCustomAttribute<IOCService>();
			if (iocService is not null)
			{
				_iocTypeContainer.Add(item.Name, item);
			}
		}

		//3.创建对象  改为需要的时候再创建

		#region 老方法

		//foreach (var type in types)
		//{
		//    object _object = Activator.CreateInstance(type);//创建对象

		//    //3.1 对象属性赋值
		//    var propertyInfos = type.GetProperties();
		//    foreach (var propertyInfo in propertyInfos)
		//    {
		//        foreach (var type1 in types)
		//        {
		//            if (type1.Name.Equals(propertyInfo.Name))
		//            {
		//                object _objectValue = Activator.CreateInstance(type1);
		//                propertyInfo.SetValue(_object, _objectValue);

		//                //到这一步正常的流程已经结束，但是如果属性里面这个类里面还有属性，那么就需要接着查找，所以这个时候应该使用递归方法
		//            }
		//        }
		//    }

		//    //3.2 存储对象
		//    _iocContainer.Add(type.Name, _object);
		//}

		#endregion

		//因为涉及到类里面用到了其他类，其他类又用到了其他类，所以这个时候需要递归去创建
		//foreach (var type in types)
		//{
		//    //递归创建
		//    object _object = CreateObject(type);
		//    //存储对象
		//    _iocContainer.Add(type.Name, _object);
		//}
	}

	/// <summary>
	/// 使用对象的时候创建对象
	/// </summary>
	/// <param name="serviceName"></param>
	/// <returns></returns>
	public object GetObject(string serviceName)
	{
		var type = _iocTypeContainer[serviceName];

		//3.1 递归创建
		object _object = CreateObject(type);

		//3.2 存储对象
		_iocContainer.Add(type.Name, _object);
		return _object;
	}

	#region 私有方法

	/// <summary>
	/// 两个工具
	/// 1.抽取代码里面通用的逻辑
	/// 2.在通用的代码逻辑里面抽取通用的参数
	/// </summary>
	/// <param name="type"></param>
	/// <param name="types"></param>
	/// <returns></returns>
	private object CreateObject(Type type)
	{
		if (_iocContainer.ContainsKey(type.Name))
		{
			return _iocContainer[type.Name];
		}

		//创建对象
		object _object = Activator.CreateInstance(type);//创建对象

		//3.1 对象属性赋值
		var propertyInfos = type.GetProperties();
		foreach (var propertyInfo in propertyInfos)
		{
			//foreach (var type1 in types)
			//{
			//    if (type1.Name.Equals(propertyInfo.Name))
			//    {
			//        var _objectValue = CreateService(type1, types);
			//        propertyInfo.SetValue(_object, _objectValue);
			//    }
			//}

			if (propertyInfo.PropertyType == typeof(string))
				continue;

			var type1 = _iocTypeContainer[propertyInfo.PropertyType.Name];
			var _objectValue = CreateObject(type1);
			propertyInfo.SetValue(_object, _objectValue);
		}
		return _object;
	}

	#endregion
```

## 创建自定义标识
用于标识那些需要存储到ioc容器
```csharp
/// <summary>
/// ioc类型过滤特性
/// </summary>
[AttributeUsage(AttributeTargets.Class)]
public class IOCService : Attribute
{
    public IOCService()
    {
    }
}
```

## 通过简单类示例
```csharp
/// <summary>
/// 老师类
/// </summary>
[IOCService]//标识特性
public class Teacher
{
	public string Id { get; set; }

	public string Name { get; set; }

	public void StartCourse()
	{
		Console.WriteLine("老师开始上课");
	}
}

/// <summary>
/// 学生类
/// </summary>
[IOCService]//标识特性
public class Student
{
	public string Id { get; set; }

	public string Name { get; set; }

	public Teacher Teacher { get; set; }

	public void Study()
	{
		Teacher.StartCourse();
		Console.WriteLine("学生开始学习");
	}
}
```

### 通过IOC容器创建对象调用方法
```csharp
//创建ioc容器
DefaultIOCFactory _iOCFactory = new DefaultIOCFactory();
Student student = (Student)_iOCFactory.GetObject(nameof(Student));
student.Study();
```
输出结果
```csharp
老师开始上课
学生开始学习
```
