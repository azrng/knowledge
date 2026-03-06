---
title: 事件总线内存模式
lang: zh-CN
date: 2023-08-27
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: shijianzongxianneicunmoshi
slug: qs9ge4070l62mcfa
docsId: '112443397'
---

## 概述
时间总线，提供了实现观察者模式的骨架代码。
事件是由一个Publisher跟一个或多个的Subsriber组成，但是在实际的使用过程中，我们会发现，Subsriber必须知道Publisher是谁才可以注册事件，进而达到目的，那这其实就是一种耦合，为了解决这个问题，就出现了事件总线的模式，事件总线允许不同的模块之间进行彼此通信而又不需要相互依赖。

## 做什么
1、EventBus实现了对于事件的注册以及取消注册的管理
2、EventBus内部维护了一份事件源与事件处理程序的对应关系，并且通过这个对应关系在事件发布的时候可以找到对应的处理程序去执行
3、EventBus应该要支持默认就注册事件源与处理程序的关系，而不需要开发人员手动去注册（这里可以让开发人员去控制自动还是手动）

## 示例
事件总线方法参数约束
```csharp
public interface IEventData
{
    /// <summary>
    /// 事件ID
    /// </summary>
    string Id { get; set; }

    /// <summary>
    /// 执行时间
    /// </summary>
    DateTime EventTime { get; set; }
}
```
事件总线接口约束
```csharp
public interface IEventBus
{
    #region 接口注册

    /// <summary>
    /// 注册
    /// </summary>
    /// <param name="handlerType">处理程序</param>
    /// <typeparam name="TEventData">参数类型</typeparam>
    void Register<TEventData>(Type handlerType) where TEventData : IEventData;

    /// <summary>
    /// 注册
    /// </summary>
    /// <param name="eventType">参数类型</param>
    /// <param name="handlerType">处理程序</param>
    void Register(Type eventType, Type handlerType);

    /// <summary>
    /// 注册
    /// </summary>
    /// <param name="eventType">时间参数类型名</param>
    /// <param name="handlerType">执行程序类型</param>
    void Register(string eventType, Type handlerType);

    #endregion

    #region 接口取消注册

    /// <summary>
    /// 取消注册
    /// </summary>
    /// <param name="handlerType">处理程序</param>
    /// <typeparam name="TEventData">参数类型</typeparam>
    void Unregister<TEventData>(Type handler) where TEventData : IEventData;

    /// <summary>
    /// 取消注册
    /// </summary>
    /// <param name="eventType">参数类型</param>
    /// <param name="handlerType">处理程序</param>
    void Unregister(Type eventType, Type handlerType);

    /// <summary>
    /// 取消注册
    /// </summary>
    /// <param name="eventType">时间参数类型名</param>
    /// <param name="handlerType">执行程序类型</param>
    void Unregister(string eventType, Type handlerType);

    #endregion

    /// <summary>
    /// 执行
    /// </summary>
    /// <param name="pubKey">参数类型Name</param>
    /// <param name="eventData">参数数据</param>
    void Trigger(string pubKey, IEventData eventData);

    /// <summary>
    /// 异步执行
    /// </summary>
    /// <param name="pubKey">参数类型Name</param>
    /// <param name="eventData">参数数据</param>
    Task TriggerAsync(string pubKey, IEventData eventData);

    /// <summary>
    /// 异步执行
    /// </summary>
    /// <param name="eventData">事件参数</param>
    /// <typeparam name="TEventData">事件参数类型</typeparam>
    /// <returns></returns>
    Task TriggerAsync<TEventData>(TEventData eventData) where TEventData : IEventData;

    /// <summary>
    /// 执行
    /// </summary>
    /// <param name="eventData">事件参数</param>
    /// <typeparam name="TEventData">事件参数类型</typeparam>
    void Trigger<TEventData>(TEventData eventData) where TEventData : IEventData;
}
```
接口约束的内存实现方案
```csharp
public class EventBus : IEventBus
{
    /// <summary>
    /// 存储字典  key：数据类型FullName  value：处理程序类型
    /// </summary>
    private static readonly ConcurrentDictionary<string, List<Type>> _dicEvent = new();

    /// <summary>
    /// 注册以及取消注册的时候需要加锁处理
    /// </summary>
    private static readonly object _obj = new object();

    public EventBus()
    {
        InitRegister();
    }

    /// <summary>
    /// 初始化注册
    /// </summary>
    private void InitRegister()
    {
        lock (_obj)
        {
            if (!_dicEvent.IsEmpty)
            {
                return;
            }
        }

        //自动扫描文件夹下的程序集中指定的类型并且注册
        var baseType = typeof(IEventHandler<>);
        var ignoreNameSpaces = new string[] { "Microsoft.", "System." };
        foreach (var file in Directory.GetFiles(AppDomain.CurrentDomain.BaseDirectory, "*.dll"))
        {
            var ass = Assembly.LoadFrom(file);
            // 查询到实现接口IEventHandler<>的方法 排除系统默认的ignoreNameSpaces开头的程序集
            foreach (var item in ass.GetTypes()
                         .Where(p => !ignoreNameSpaces.Any(t =>
                                         p.FullName.StartsWith(t)) && IsAssignableToOpenGenericType(p, baseType) &&
                                     !p.IsAbstract &&
                                     p.IsClass))
            {
                foreach (var item1 in item.GetInterfaces())
                {
                    foreach (var item2 in item1.GetGenericArguments())
                    {
                        if (item2.GetInterfaces().Contains(typeof(IEventData)))
                        {
                            Register(item2, item);
                        }
                    }
                }
            }
        }
    }


    #region 注册事件

    public void Register<TEventData>(Type handlerType) where TEventData : IEventData
    {
        //将数据存储到mapDic
        var dataType = typeof(TEventData).FullName;
        Register(dataType, handlerType);
    }

    public void Register(Type eventType, Type handlerType)
    {
        var dataType = eventType.FullName;
        Register(dataType, handlerType);
    }

    public void Register(string pubKey, Type handlerType)
    {
        lock (_obj)
        {
            //将数据存储到dicEvent
            if (_dicEvent.ContainsKey(pubKey) == false)
            {
                _dicEvent[pubKey] = new List<Type>();
            }

            if (_dicEvent[pubKey].Exists(p => p.GetType() == handlerType) == false)
            {
                _dicEvent[pubKey].Add(handlerType);
            }
        }
    }

    #endregion

    #region 取消事件注册

    public void Unregister<TEventData>(Type handler) where TEventData : IEventData
    {
        var dataType = typeof(TEventData);
        Unregister(dataType, handler);
    }

    public void Unregister(Type eventType, Type handlerType)
    {
        var key = eventType.FullName;
        Unregister(key, handlerType);
    }

    public void Unregister(string eventType, Type handlerType)
    {
        lock (_obj)
        {
            if (!_dicEvent.ContainsKey(eventType))
            {
                return;
            }

            if (_dicEvent[eventType].Exists(p => p.GetType() == handlerType))
            {
                _dicEvent[eventType].Remove(_dicEvent[eventType].Find(p => p.GetType() == handlerType));
            }
        }
    }

    #endregion

    #region Trigger触发

    public void Trigger<TEventData>(TEventData eventData) where TEventData : IEventData
    {
        var dataType = eventData.GetType().FullName;
        //获取当前的EventData绑定的所有Handler
        Notify(dataType, eventData);
    }

    public void Trigger(string pubKey, IEventData eventData)
    {
        //获取当前的EventData绑定的所有Handler
        Notify(pubKey, eventData);
    }

    public async Task TriggerAsync<TEventData>(TEventData eventData) where TEventData : IEventData
    {
        await Task.Factory.StartNew(() =>
        {
            var dataType = eventData.GetType().FullName;
            Notify(dataType, eventData);
        });
    }

    public async Task TriggerAsync(string pubKey, IEventData eventData)
    {
        await Task.Factory.StartNew(() =>
        {
            Notify(pubKey, eventData);
        });
    }

    //通知每成功执行一个就需要记录到数据库
    private void Notify<TEventData>(string eventType, TEventData eventData) where TEventData : IEventData
    {
        //获取当前的EventData绑定的所有Handler
        var handlerTypes = _dicEvent[eventType];
        foreach (var handlerType in handlerTypes)
        {
            var handler = Activator.CreateInstance(handlerType) as IEventHandler<TEventData>;
            handler.Handle(eventData);
        }
    }

    #endregion

    /// <summary> 
    /// 一个类是否继承自另外一个类型
    /// </summary>
    /// <param name="givenType"></param>
    /// <param name="genericType"></param>
    /// <returns></returns>
    private bool IsAssignableToOpenGenericType(Type givenType, Type genericType)
    {
        if (givenType.GetInterfaces().Any(it => it.IsGenericType && it.GetGenericTypeDefinition() == genericType))
        {
            return true;
        }

        if (givenType.IsGenericType && givenType.GetGenericTypeDefinition() == genericType)
            return true;
        var baseType = givenType.BaseType;
        return baseType != null && IsAssignableToOpenGenericType(baseType, genericType);
    }
}
```
创建事件处理程序接口
```csharp
public interface IEventHandler<IEventData>
{
    void Handle(IEventData eventData);
}
```
一个使用示例，创建一个事件的处理类以及处理程序
```csharp
public class TestHandler2 : IEventHandler<TestEventData>
{
    public void Handle(TestEventData eventData)
    {
        Console.WriteLine($"执行 testhandler  参数为{eventData.ToJson()}");
    }
}

public class TestEventData : IEventData
{
    public string Id { get; set; }
    public DateTime EventTime { get; set; }
    public string EventSource { get; set; }
}
```
使用方案
```csharp
// 大致逻辑：在项目启动的时候将注册的参数类型以及对应的处理程序进行注册，然后执行的时候根据参数类型名去获取处理程序然后反射生成处理程序然后执行
var eventBus = new EventBus();
eventBus.Trigger<TestEventData>(new TestEventData()
{
    Id = Guid.NewGuid().ToString(), EventTime = DateTime.Now, EventSource = "张三"
});
```
这就是一个简单的事件总线的处理方案。

## 总结
使用事件总线可以解耦业务和非业务代码。

## 参考资料
[https://www.shuzhiduo.com/A/QW5Y3eW9zm/](https://www.shuzhiduo.com/A/QW5Y3eW9zm/)
