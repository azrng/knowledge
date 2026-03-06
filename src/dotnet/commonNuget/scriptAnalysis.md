---
title: 脚本解析器
lang: zh-CN
date: 2023-08-09
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: jiaobenjieshiqi
slug: axq6ik
docsId: '92330326'
---

## 概述

脚本解析器有很多包，诸如Jint、V8.NET等等，下面详细列举了一些

## Microsoft.CodeAnalysis.CSharp.Scripting

可以动态执行c#代码


安装nuget包

```xml
<ItemGroup>
  <PackageReference Include="Microsoft.CodeAnalysis.CSharp.Scripting" Version="4.10.0" />
</ItemGroup>
```

### 动态接口实现

新建一个控制台项目叫做ConsoleApp2，然后编写一个接口IUserService

```csharp
using System;
using System.Threading.Tasks;

namespace ConsoleApp2
{
    public interface IUserService
    {
        Task<string> GetTime(DateTime dateTime);
    }

    public static class Extension
    {
        public static string ToStandardStr(this DateTime dateTime)
        {
            return dateTime.ToString("yyyy-MM-dd HH:mm:ss");
        }
    }
}
```

新建一个类UserService实现该接口(该类用于编写动态代码使用，一会可以删除)

```csharp
using System;
using System.Threading.Tasks;

namespace ConsoleApp2;

public class UserService : IUserService
{
    public async Task<string> GetTime(DateTime dateTime)
    {
        await Task.Delay(100);
        return dateTime.ToStandardStr();
    }
}
```

然后编写动态执行代码(这里的构建结果可以缓存下来，避免每次使用都需要构建)

```csharp
using System;
using System.Linq;
using ConsoleApp2;
using Microsoft.CodeAnalysis.CSharp.Scripting;
using Microsoft.CodeAnalysis.Scripting;

// 这里code不能包含命名空间
var code = @"
using System;
using System.Threading.Tasks;
using ConsoleApp2;

public class UserService : IUserService
{
    public async Task<string> GetTime(DateTime dateTime)
    {
        await Task.Delay(100);
        return dateTime.ToStandardStr();
    }
}
return new UserService();
";

var option = ScriptOptions.Default
    .AddReferences(AppDomain.CurrentDomain.GetAssemblies().Where(c => c.FullName.StartsWith("ConsoleApp2")))
    .AddReferences(Array.Empty<string>());
var script = await CSharpScript.RunAsync(code, option);
var res = script.ReturnValue as IUserService; // 将动态执行的结果转为IUserService类型
var result = await res.GetTime(DateTime.Now);
Console.WriteLine(result);
```

这里动态代码可以使用异步，也可以增加程序集依赖，使用指定程序集的帮助类

## Jint

Jint 是 .NET 的 Javascript 解释器，可以在任何现代 .NET 平台上运行，因为它支持 .NET 标准 2.0 和 .NET 4.6.2 目标（及更高版本）。

下载量：6.06M

### 操作
引用nuget包
```csharp
<PackageReference Include="Jint" Version="2.11.58" />
```

#### 基础运算
```csharp
var engine = new Engine();
Console.WriteLine(engine.Execute("20*20").GetCompletionValue());
```

#### 引用C#函数执行
```csharp
var script = @"function calc(x)
{
    var res = x+1;
    alert('这是JS解释的'+res);
    return res * 1000;
}
";

var JSEngine = new Engine();
JSEngine.SetValue("alert", new Action<string>(Alert));

try
{
    JSEngine.Execute(script);
    var res = JSEngine.Invoke("calc", 9000);
    Console.WriteLine($"calc 的计算结果 {res}");
}
catch (Jint.Runtime.JavaScriptException Ex)
{
    Console.WriteLine(Ex.Message);
}

/// <param name="Message"></param>
void Alert(string Message)
{
    Console.WriteLine(Message);
}
```

#### 调用js函数
```csharp
var engine = new Engine();
var fromValue = engine.Execute("function jsAdd(a, b) { return a + b; }").GetValue("jsAdd");
Console.WriteLine(fromValue.Invoke(5, 5));

Console.WriteLine(engine.Invoke("jsAdd", 3, 3));
```

## JavaScriptEngineSwitcher
JavaScript引擎切换器决定了访问流行JavaScript引擎(ChakraCore, jerp . JavaScript)基本特性的统一接口。NodeJS, Jint，侏罗纪，MSIE JavaScript引擎。net, nl . js, Microsoft ClearScript。V8和VroomJs)。这个库允许您快速轻松地切换到使用另一个JavaScript引擎。

下载量：6.15M

### 操作
引用组件
```csharp
<PackageReference Include="JavaScriptEngineSwitcher.Core" Version="3.19.0" />
```

## CSharpScript
提供一个C#脚本的包；功能是传入一段C#代码，返回代码执行的结果，需要提供return，并且返回值是string类型。

### 操作
引用nuget包
```csharp
<PackageReference Include="CSharpScript" Version="1.0.0" />
```

## Jurassic

Jurassic是一个开源的托管JavaScript执行引擎，使用MS-PL授权协议。它的目标是成为.NET平台上功能最强，最为标准的JavaScript引擎。

https://mp.weixin.qq.com/s/rYbWTTOyzOssKCuIAc0A_Q | .NET 开发的JavaScript执行引擎

## Pidgin

Pidgin是基于C#的开源项目，是一个解析组合器库，提供了一个高级别的声明性工具来构建解析器，使得编写解析器变得简单而直观。

仓库地址：https://github.com/benjamin-hodgson/Pidgin

**1、轻量化与高效**

Pidgin专注于提供轻量级的解决方案，旨在减少内存占用和提高解析速度。通过精心设计的数据结构和算法，Pidgin 能够在不牺牲功能的前提下实现高效的解析。

**2、灵活性**

Pidgin 支持解析各种复杂的数据格式，不仅限于文本数据。由于其能够处理任意类型的输入令牌（tokens），Pidgin 可以用于解析二进制协议、标记化输入等多种场景。

**3、易于使用** 

与正则表达式相比，Pidgin 提供了更强大的解析能力，而与 ANTLR 等解析生成器相比，它又更简单易用。

Pidgin 的 API 设计直观，允许开发者以声明性的方式定义语法规则，而无需编写复杂的代码。



参考地址：[此处](https://mp.weixin.qq.com/s/wb-l4zAP-UfILcIPpsyqig)
