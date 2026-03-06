---
title: 命令行
lang: zh-CN
date: 2023-09-25
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: minglinghang
slug: chl770g1ws4l95rd
docsId: '140131729'
---

## CommandLineParser

用于 .NET 的简洁语法 C# 命令行分析器

仓库地址：https://github.com/commandlineparser/commandline

### 示例

安装nuget包

```c#
<ItemGroup>
<PackageReference Include="CommandLineParser" Version="2.9.1" />
</ItemGroup>
```

设置配置文件

```c#
public class Options
{
    /// <summary>
    /// 指令类型
    /// </summary>
    [Option('t', "command", Required = false, HelpText = "运行指令 (add, update 或 delete)", Default = "add")]
    public string Command { get; set; } = "add";

    /// <summary>
    /// 模型文件，默认也存在在bin同级目录下
    /// </summary>
    [Option('m', "modelFile", Required = false, HelpText = "使用的模型的文件名", Default = "ggml-base.bin")]
    public string ModelName { get; set; } = "ggml-base.bin";
}
```

示例代码

```c#
// 运行查看支持的参数：.\CommandLineParserSample.exe --help

Parser.Default.ParseArguments<Options>(args)
    .WithParsed<Options>(o =>
    {
        switch (o.Command)
        {
            case "add":
                Console.WriteLine($"添加!  模型为：{o.ModelName}");
                break;
            case "update":
                Console.WriteLine($"更新!  模型为：{o.ModelName}");
                break;
        }

        Console.WriteLine("over");
        Console.ReadLine();
    });
```

## PowerArgs

### 概述
PowerArgs是一个开源的.NET库，用于将命令行参数转换为.NET对象，方便开发人员在程序中使用。它还额外提供很多功能，如参数校验、自动生成使用帮助和tab补全等，适用于任何使用命令行接口的.NET应用程序。

仓库地址：[https://github.com/adamabdelhamed/PowerArgs](https://github.com/adamabdelhamed/PowerArgs)


### 项目特点
1、将命令行参数转换为.NET对象：可以根据参数定义将命令行参数解析为.NET对象，使得程序可以更方便地使用命令行参数。
2、提供参数校验：可以对参数进行校验，确保参数满足指定的规则，如必填字段、数据类型和范围等。
3、自动生成使用帮助：可以根据参数的定义自动生成使用帮助文档，提供用户输入参数的指导。
4、支持tab补全：提供了命令行参数的tab补全功能，使得用户在输入参数时可以更方便地浏览和选择参数。
5、可扩展性：提供了丰富的扩展点，用户可以根据自己的需求自定义扩展，如自定义校验规则、自定义参数类型等。


### 示例
```csharp
using PowerArgs;
public class MyArgs
{
    //此参数是必需的，如果未指定，用户将提示。
    [ArgRequired(PromptIfMissing = true)]
    public string StringArg { get; set; }
    // 此参数不是必需的，但如果指定，则必须大于等于0且小于等于60
    [ArgRange(0, 60)]
    [ArgRequired(PromptIfMissing = true)]
    public int IntArg { get; set; }
}
class Program
{
    static void Main(string[] args)
    {
        try
        {
            var parsed = Args.Parse<MyArgs>(args);
            Console.WriteLine("输入的字符：'{0}' 、数值 '{1}'", parsed.StringArg, parsed.IntArg);
        }
        catch (ArgException ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ArgUsage.GenerateUsageFromTemplate<MyArgs>());
        }
    }
}
```

## CommandLineTool

### 概述
通过输入的命令和参数，进行业务逻辑处理。

### 操作
安装nuget包
```csharp
<PackageReference Include="CommandLineTool" Version="1.0.0" />
```
新建命令行类TestCLI
```csharp
[App("Demo")] // 控制台描述
public static class TestCLI
{
    /// <summary>
    /// 单个参数
    /// </summary>
    /// <param name="name"></param>
    /// <remarks>示例：simpleinput aa</remarks>
    [Command("simpleinput", "单个参数")]
    public static void SimpleInput([ParamArgument] string name)
    {
        Console.WriteLine(name);// aa
    }

    /// <summary>
    /// 多个参数
    /// </summary>
    /// <param name="names"></param>
    /// <remarks>示例：multiinput aa bb</remarks>
    [Command("multiinput", "多个参数")]
    public static void MultiInput([ParamArgument] List<string> names)
    {
        foreach (var item in names)
        {
            Console.Write(item + ",");// aa,bb,
        }
    }

    /// <summary>
    /// 额外的参数
    /// </summary>
    /// <param name="names"></param>
    /// <param name="op1"></param>
    /// <remarks>示例：withpara aa -a bb</remarks>
    [Command("withpara", "额外参数")]
    public static void WithPara([ParamArgument] string names, [ParamOption("-a")] string op1)
    {
        Console.WriteLine($"names:{names}  opl:{op1}");// names:aa  opl:bb
    }
}
```
配置启动命令
```csharp
static void Main(string[] args)
{
    Cli cli = new(typeof(TestCLI))
    {
        Introduction = "这是一个 Demo 应用", //启动时候输出简介
        PromptText = "Plus", // 类似于 >>>
        Title = "控制台应用程序"
    };

    cli.SetCancellationKeys(new List<string> { "exit" });// 退出命令
    cli.Start();
}
```

### 参考文档
> [https://mp.weixin.qq.com/s/JFfcmIfkbQLSP7nY7N25EQ](https://mp.weixin.qq.com/s/JFfcmIfkbQLSP7nY7N25EQ)

