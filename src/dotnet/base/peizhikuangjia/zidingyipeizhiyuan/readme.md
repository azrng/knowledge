---
title: 说明
lang: zh-CN
date: 2023-09-25
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - config
filename: readme
slug: cd1hoh
docsId: '78251380'
---

## 开发步骤
1.开发一个直接或者间接实现Configurationprovider接口的类XXXconfigurationProvider，一般继承自ConfigurationProvider。如果是从文件读取，可以继承自FileConfigProvider。重写load方法，把扁平化数据设置到Data属性即可。  
2.再开发给实现了IConfigurationSource接口的类XXXConfigurationSource，如果是文件读取，可以继承自FileConfigurationSource。在Build方法中返回上面的ConfigurationPrvider对象。  
3.然后使用即可，configurationBuild.Add(new ConfigruarionSource())即可。为了简化使用，一般听过一个IConfugrationBuilder的扩展方法。   

整体流程：编写Configurationprovider类实际读取配置；编写ConfigurationSource在Build中返回ConfigurationProvider对象；把ConfigurationSource对象加入IConfiguratioBuilder。

## 扩展

### 值来源判断
判断我读取到的配置是来自配置文件还是来自于环境变量
```csharp
var someConfigValue = configuration["SomeConfigValue"];
if (someConfigValue != null && Environment.GetEnvironmentVariable("SomeConfigValue") != null)
{
    // The value is defined in both the JSON file and environment variable.
    // You should decide which value to use based on your application's logic.
}
else if (someConfigValue != null)
{
    // The value is defined in the JSON file.
}
else
{
    // The value is defined in the environment variable.
}

```
在这个例子中，我们首先通过 configuration["SomeConfigValue"] 获取配置项的值。如果这个值不为空，并且环境变量中也存在同名的值，那么就表示这个值同时来自于环境变量和 JSON 文件。在这种情况下，你需要根据你的应用程序逻辑来决定使用哪个值。如果这个值只在 JSON 文件中被定义，那么它就来自于 JSON 文件。如果这个值只在环境变量中被定义，那么它就来自于环境变量。
