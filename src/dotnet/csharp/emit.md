---
title: Emit
lang: zh-CN
date: 2023-11-09
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 无
filename: emit
slug: lzm5v4
docsId: '83786361'
---

## 简述
Emit则可以在运行时动态生成代码。
一个程序集的层级：方法=>类型=>模块=>程序集

## 操作
> .net fw项目，可以实现程序集的运行和保存，但是.Net Core的就只能运行了


### 动态生成代码输出
通过构建程序集等动态生成一个方法，然后通过反射执行方法然后输出信息
```csharp
//方法=>类型=>模块=>程序集

//定义程序集名称
var _assemblyName = new AssemblyName("DynamicAssemblyDemo");

// 创建一个程序集构建器
// Framework 也可以这样：AppDomain.CurrentDomain.DefineDynamicAssembly
AssemblyBuilder ab = AssemblyBuilder.DefineDynamicAssembly(_assemblyName, AssemblyBuilderAccess.Run);

// 使用程序集构建器创建一个模块构建器
ModuleBuilder mb = ab.DefineDynamicModule(_assemblyName.Name!);

// 使用模块构建器创建一个类型构建器
TypeBuilder tb = mb.DefineType("DynamicConsole");

// 使类型实现IConsole接口
tb.AddInterfaceImplementation(typeof(IConsole));

var attrs = MethodAttributes.Public | MethodAttributes.Virtual | MethodAttributes.NewSlot | MethodAttributes.HideBySig | MethodAttributes.Final;

// 使用类型构建器创建一个方法构建器
MethodBuilder methodBuilder = tb.DefineMethod("Say", attrs, typeof(void), Type.EmptyTypes);

// 通过方法构建器获取一个MSIL生成器
var IL = methodBuilder.GetILGenerator();

// 开始编写方法的执行逻辑

// 将一个字符串压入栈顶
IL.Emit(OpCodes.Ldstr, "I'm here.");

// 调用Console.Writeline函数
IL.Emit(OpCodes.Call, typeof(Console).GetMethod("WriteLine", new[] { typeof(string) }));

// 退出函数
IL.Emit(OpCodes.Ret);

//方法结束

// 从类型构建器中创建出类型
var dynamicType = tb.CreateType();

//ab.Save(aName.Name + ".dll");
// 通过反射创建出动态类型的实例
var console = Activator.CreateInstance(dynamicType) as IConsole;
console.Say();
//ab.Save("DynamicAssemblyExample.dll");

Console.WriteLine("不错，完成了任务!");
Console.ReadLine();

/// <summary>
/// 输出
/// </summary>
public interface IConsole
{
    /// <summary>
    /// 说
    /// </summary>
    void Say();
}
```

## 资料
emit资料：[https://docs.microsoft.com/zh-cn/dotnet/api/system.reflection.emit.ilgenerator.emit?view=net-6.0](https://docs.microsoft.com/zh-cn/dotnet/api/system.reflection.emit.ilgenerator.emit?view=net-6.0)
[https://mp.weixin.qq.com/s/xF1LNon-4P0Xwar-Bd7C4Q](https://mp.weixin.qq.com/s/xF1LNon-4P0Xwar-Bd7C4Q) | .Net IL Emit 实现Aop面向切面之动态代理 案例版
[https://mp.weixin.qq.com/s/V7Zuea53ykJXuVu95u2wgA](https://mp.weixin.qq.com/s/V7Zuea53ykJXuVu95u2wgA) ：动态生成代码
[https://mp.weixin.qq.com/s/doi6fGLcZzUBex7VCxiw7w](https://mp.weixin.qq.com/s/doi6fGLcZzUBex7VCxiw7w) | .NET高级特性-Emit
