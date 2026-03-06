---
title: 内存数据源配置
lang: zh-CN
date: 2023-09-25
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: neicunshujuyuanpeizhi
slug: lfnenh
docsId: '51585041'
---
> 本文为学习笔记


## 介绍

- 以kevy-value字符串键值对的方式存储配置
- 支持从各种不同的数据源读取配置信息

四个核心接口：IConfiguration、IConfigurationRoot、IConfigurationSection、IConfigurationBuilder
扩展点(注入我们自己的配置源):IConfigurationSource、IConfigurationPrivider

## 操作

### 配置创建和读取
新建一个控制台来构建配置源并读取配置
```csharp
IConfigurationBuilder builder = new ConfigurationBuilder();
builder.AddInMemoryCollection(new Dictionary<string, string>
{
    { "key1","value1"},
    { "key2","value2"},
    { "section1:key4","value4"}
});
IConfigurationRoot configurationRoot = builder.Build();
System.Console.WriteLine(configurationRoot["key1"]);
System.Console.WriteLine(configurationRoot["key2"]);

IConfiguration configuration = configurationRoot;
System.Console.WriteLine(configuration["key1"]);
System.Console.WriteLine(configuration["key2"]);

// 获取嵌套方式，通过Section分组 
var section = configuration.GetSection("section1");
System.Console.WriteLine(section["key4"]);
```
输出参数
```csharp
value1
value2
value1
value2
value4
```

### 通过源码看配置读取
```csharp
IConfigurationBuilder builder = new ConfigurationBuilder();
builder.AddInMemoryCollection(new Dictionary<string, string>
{
    { "key1","value1"},
    { "key2","value2"},
    { "section1:key4","value4"}
});
IConfigurationRoot configurationRoot = builder.Build();
System.Console.WriteLine(configurationRoot["key1"]);
System.Console.WriteLine(configurationRoot["key2"]);
```
通过该写法我们发现值是从configurationRoot索引器中读取的，我们查看该ConfigurationRoot源码
```csharp
private readonly IList<IConfigurationProvider> _providers;

public string this[string key]
{
  get => ConfigurationRoot.GetConfiguration(this._providers, key);
  set => ConfigurationRoot.SetConfiguration(this._providers, key, value);
}

internal static string GetConfiguration(IList<IConfigurationProvider> providers, string key)
{
  for (int index = providers.Count - 1; index >= 0; --index)
  {
	string configuration;
	if (providers[index].TryGet(key, out configuration))
	  return configuration;
  }
  return (string) null;
}
```
从这里我们可以看出这个值是从_providers属性里面获取的，通过循环该值，然后依次通过TryGet去获取值，然后我们看下这个ConfigurationProvider的TryGet方法
```csharp
protected IDictionary<string, string> Data { get; set; }

public virtual bool TryGet(string key, out string value) => this.Data.TryGetValue(key, out value);
```
所以上面获取值的方法在一个IConfigurationProvider配置提供者的情况下可以写成
```csharp
configurationRoot.Providers.First().TryGet("key1", out string key1);
```
如果我们引入 "Microsoft.Extensions.Configuration.Binder" nuget包 ，读取配置操作时会发现一些新的方法。
比如配置和强模型绑定,并结合泛型使用 ，如:
```csharp
public static T Get<T>(this IConfiguration configuration)

public static T GetValue<T>(this IConfiguration configuration, string key, T defaultValue)
```

### 通过源码看配置写入
现在我们需要找Provider中的Data 属性是怎么写入的 ，还从开头的控制台程序入手 ，上面代码中我们讲配置的值给了AddInMemoryCollection，查看ConfigurationBuilder源码
```csharp
public static IConfigurationBuilder AddInMemoryCollection(
  this IConfigurationBuilder configurationBuilder,
  IEnumerable<KeyValuePair<string, string>> initialData)
{
  if (configurationBuilder == null)
	throw new ArgumentNullException(nameof (configurationBuilder));
  configurationBuilder.Add((IConfigurationSource) new MemoryConfigurationSource()
  {
	InitialData = initialData
  });
  return configurationBuilder;
}
```
这里调用了IConfigurationBuilder的Add方法
```csharp
public IList<IConfigurationSource> Sources { get; } = (IList<IConfigurationSource>) new List<IConfigurationSource>();
public IConfigurationBuilder Add(IConfigurationSource source)
{
  if (source == null)
	throw new ArgumentNullException(nameof (source));
  this.Sources.Add(source);
  return (IConfigurationBuilder) this;
}
```
这里我们看到这个IConfigurationSource又给了Sources，那么我们看下最后ConfigurationBuilder调用Build方法返回ConfigurationRoot的地方
```csharp
public IConfigurationRoot Build()
{
  List<IConfigurationProvider> providers = new List<IConfigurationProvider>();
  foreach (IConfigurationSource source in (IEnumerable<IConfigurationSource>) this.Sources)
  {
	IConfigurationProvider configurationProvider = source.Build((IConfigurationBuilder) this);
	providers.Add(configurationProvider);
  }
  return (IConfigurationRoot) new ConfigurationRoot((IList<IConfigurationProvider>) providers);
}
```
这里我们看到又将上面Add时候的Sources值给了providers存储起来，这样子就和我们上面读取的时候接上了。

## 参考资料
极客时间教程
[https://www.cnblogs.com/francisXu/p/15563861.html](https://www.cnblogs.com/francisXu/p/15563861.html) | .Net Core 配置源码学习 （一） - francisXu - 博客园
