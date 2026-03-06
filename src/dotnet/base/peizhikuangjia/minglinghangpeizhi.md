---
title: 命令行配置
lang: zh-CN
date: 2022-01-20
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: minglinghangpeizhi
slug: hua2a3
docsId: '49729969'
---
> 本文为学习笔记


## 介绍
通过命令行配置应用程序
格式

- 无前缀的key=value模式
- 双横线模式：--key=value 或 --key vlaue 
- 正斜线模式 /key=value  或  /key value
> 注意：等号分隔符和空格分隔符不能混用。

命令替换

- 必须以单划线(-)或者双划线(--)开头
- 映射的字典不能包含重复的key

## 操作

### 简单读取
引用组件
```csharp
<ItemGroup>
  <PackageReference Include="Microsoft.Extensions.Configuration" Version="5.0.0" />
  <PackageReference Include="Microsoft.Extensions.Configuration.Abstractions" Version="5.0.0" />
  <PackageReference Include="Microsoft.Extensions.Configuration.CommandLine" Version="5.0.0" />
</ItemGroup>
```
简单读取控制台launchSettings.json文件的请求配置
```csharp
{
  "profiles": {
    "ConsoleApp3": {
      "commandName": "Project",
      //入参
      "commandLineArgs": "CommandLineKey1=value1 --CommandLineKey2=value2 /CommandLineKey3=value3"
    }
  }
}
```
配置命令代码
```csharp
var builder = new ConfigurationBuilder();
builder.AddCommandLine(args);

var configurationRoot = builder.Build();
Console.WriteLine($"CommandLineKey1:{configurationRoot["CommandLineKey1"] }");
Console.WriteLine($"CommandLineKey2:{configurationRoot["CommandLineKey2"] }");
Console.WriteLine($"CommandLineKey3:{configurationRoot["CommandLineKey3"] }");
```
直接启动程序或者使用命令行启用
```csharp
dotnet run --CommandLineKey1=value1 --CommandLineKey2=value2 --CommandLineKey3=value3
```
输出结果
```csharp
CommandLineKey1:value1
CommandLineKey2:value2
CommandLineKey3:value3
```

### 命令替换
命令替换方式和上面的代码配置，区别在于AddCommandLine方法，一般使用短的命令去替换长命令
```csharp
var builder = new ConfigurationBuilder();
//builder.AddCommandLine(args);

#region 命令替换
var mapper = new Dictionary<string, string> { { "-k1", "CommandLineKey1" } };
builder.AddCommandLine(args, mapper);
#endregion

var configurationRoot = builder.Build();
Console.WriteLine($"CommandLineKey1:{configurationRoot["CommandLineKey1"] }");
Console.WriteLine($"CommandLineKey2:{configurationRoot["CommandLineKey2"] }");
Console.WriteLine($"CommandLineKey3:{configurationRoot["CommandLineKey3"] }");
```
> 这里我们将第一次的AddCommandLine注释了，因为只能添加一次

命令行启动
```csharp
dotnet run -k1=value15555
```
输出结果
```csharp
CommandLineKey1:value15555
CommandLineKey2:
CommandLineKey3:
```

## 参考资料
极客时间教程
