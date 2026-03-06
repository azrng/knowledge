---
title: 建造者模式
lang: zh-CN
date: 2022-07-16
publish: true
author: azrng
isOriginal: true
category:
  - 软件设计
tag:
  - 无
filename: jianzaozhemoshi
slug: pxcbpz
docsId: '83565132'
---

## 简述
创建型设计模式(Builder)模式，也叫做建造者模式或者构建者模式或者生成器模式。

## 为什么需要建造者模式
举例：我们有一个 ResourcePoolConfig  类,里面包含一堆属性，参数赋值我们起初是用过构造函数赋值，并且将不必须的参数传null来处理
```csharp
/// <summary>
/// 资源池配置类
/// </summary>
public class ResourcePoolConfig
{
    public ResourcePoolConfig(string name, int? maxTotal, int? maxIdle, int? minIdle)
    {
        if (name==null)
            throw new ArgumentNullException(nameof(name));

        Name=name;
        if (maxTotal!=null)
        {
            if (maxTotal<=0)
                throw new ArgumentOutOfRangeException(nameof(maxTotal));

            MaxTotal=maxTotal.Value;
        }
        if (maxIdle!=null)
        {
            if (maxIdle<=0)
                throw new ArgumentOutOfRangeException(nameof(maxIdle));
            MaxIdle=maxIdle.Value;
        }
        if (minIdle!=null)
        {
            if (minIdle<=0)
                throw new ArgumentOutOfRangeException(nameof(minIdle));

            MinIdle=minIdle.Value;
        }
    }

    /// <summary>
    /// 资源名
    /// </summary>
    public string Name { get; set; }

    /// <summary>
    /// 最大总资源数
    /// </summary>
    public int MaxTotal { get; set; } = 8;

    /// <summary>
    /// 最大空闲资源数量
    /// </summary>
    public int MaxIdle { get; set; } = 8;

    /// <summary>
    /// 最小空闲资源数量
    /// </summary>
    public int MinIdle { get; set; } = 0;
}
```
实例化对象示例
```csharp
var resourcePoolConfig = new ResourcePoolConfig("db", null, null, null);
```
后来我们发现参数越来越多，构造函数的参数越来越多这样子不太合适，然后我们又将必传项通过构造函数传递，然后将非必传的选项通过Set方法来赋值
```csharp
public void SetMaxTotal(int maxTotal)
{
    MaxTotal=maxTotal;
}

public void SetMaxIdle(int maxIdle)
{
    MaxIdle=maxIdle;
}
```
实例化对象示例
```csharp
var resourcePoolConfig = new ResourcePoolConfig("db");
resourcePoolConfig.SetMaxTotal(5);
resourcePoolConfig.SetMaxIdle(5);
```
但是这个时候如果必选项也很多也就不合适了或者说我们set的非必传项目的参数之间有依赖关系，比如传a的时候，b、c也必传，也就是说属性之间存在依赖关系。

总结来说就是：

- 因为必传项过多导致构造函数的参数很多，可读性降低
- set方法的属性之间存在依赖关系，校验逻辑复杂

建造者模式就是为了解决上述的问题，将上面的类通过建造模式重新修改
```csharp
public class ResourcePoolConfig2
{
    public ResourcePoolConfig2(ResourcePoolConfigBuilder builder)
    {
        Name=builder.Name;
        MaxTotal=builder.MaxTotal;
        MaxIdle=builder.MaxIdle;
        MinIdle=builder.MinIdle;
    }

    /// <summary>
    /// 资源名
    /// </summary>
    public string Name { get; }

    /// <summary>
    /// 最大总资源数
    /// </summary>
    public int MaxTotal { get; } = 8;

    /// <summary>
    /// 最大空闲资源数量
    /// </summary>
    public int MaxIdle { get; } = 8;

    /// <summary>
    /// 最小空闲资源数量
    /// </summary>
    public int MinIdle { get; }

    public class ResourcePoolConfigBuilder
    {
        public ResourcePoolConfigBuilder(string name)
        {
            if (name is null)
                throw new ArgumentNullException(nameof(Name));

            Name=name;
        }

        /// <summary>
        ///名称
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// 最大总资源数
        /// </summary>
        public int MaxTotal { get; set; } = 8;

        /// <summary>
        /// 最大空闲资源数量
        /// </summary>
        public int MaxIdle { get; set; } = 8;

        /// <summary>
        /// 最小空闲资源数量
        /// </summary>
        public int MinIdle { get; set; } = 0;

        /// <summary>
        /// 参数校验+构建对象
        /// </summary>
        /// <returns></returns>
        /// <exception cref="ArgumentNullException"></exception>
        /// <exception cref="ArgumentOutOfRangeException"></exception>
        public ResourcePoolConfig2 Build()
        {
            if (Name==null)
                throw new ArgumentNullException(nameof(Name));

            if (MaxTotal<=0)
                throw new ArgumentOutOfRangeException(nameof(MaxTotal));

            if (MaxIdle<=0)
                throw new ArgumentOutOfRangeException(nameof(MaxIdle));
            if (MinIdle<=0)
                throw new ArgumentOutOfRangeException(nameof(MinIdle));

            if (MaxIdle>MaxTotal)
                throw new ArgumentOutOfRangeException(nameof(MaxIdle));

            return new ResourcePoolConfig2(this);
        }

        public ResourcePoolConfigBuilder SetMaxTotal(int maxTotal)
        {
            if (maxTotal <= 0)
                throw new ArgumentOutOfRangeException(nameof(maxTotal));
            MaxTotal=maxTotal;
            return this;
        }

        public ResourcePoolConfigBuilder SetMaxIdle(int maxIdle)
        {
            if (maxIdle<=0)
                throw new ArgumentOutOfRangeException(nameof(maxIdle));
            MaxIdle=maxIdle;

            return this;
        }

        public ResourcePoolConfigBuilder SetMinIdle(int minIdle)
        {
            if (minIdle<=0)
                throw new ArgumentOutOfRangeException(nameof(minIdle));
            MinIdle=minIdle;
            return this;
        }
    }
}
```
实例化对象的操作
```csharp
// 这段代码会抛出异常
ResourcePoolConfig2 resourcePoolConfig = new ResourcePoolConfigBuilder("postsql")
    .SetMaxTotal(5)
    .SetMaxIdle(6)
    .SetMinIdle(-1)
    .Build();
```
为了避免出现构造函数过多或者说其他依赖参数引起的问题，就可以考虑使用建造者模式，先设置建造者的变量，然后再一次性创建对象。

但是，如果我们并不是很关心对象是否会发生变化，比如该对象只是用来映射数据库读取出来的数据，那么直接给变量赋值也是完全没有问题的，毕竟通过建造者模式来创建对象，代码实际上是有一点重复的，因为ResourcePoolConfig2中类的成员变量，需要在ResourcePoolConfigBuilder类中再定义一遍。

## 对比工厂模式
建造者模式是让建造者类来负责独享的创建工作。
工厂模式用来创建不同但是类型相关的对象(继承同一个父类或者接口的一组子类)，通过给定的参数来决定创建哪种类型的对象，建造者模式是用来创建一种类型的复杂对象，通过设置不同的属性，来创建不同的对象。

## 总结
通过上面例子，我们可以得到建造者模式使用场景是：当一个类包含许多必须属性和可选参数，可选参数之间又存在不同的依赖关系，那么我们就可以使用建造者模式来创建这个“定制化”的对象。

> 大白话：建造者模式就是将在创建对象放在了Builder方法里面，并且在该方法里面统一再进行一次属性校验。

