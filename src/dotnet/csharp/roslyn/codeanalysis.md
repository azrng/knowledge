---
title: CodeAnalysis
lang: zh-CN
date: 2023-10-22
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 无
filename: codeanalysis
slug: lh3ga1z9srv5122g
docsId: '116220678'
---

## 概述
Microsoft.CodeAnalysis.CSharp is a package that provides support for C## in the .NET Compiler Platform ("Roslyn").

## 安装
```csharp
<PackageReference Include="Microsoft.CodeAnalysis.CSharp" Version="4.5.0" />
```

## 操作

### 快速上手
此代码从包含 C## 代码的字符串创建一个CSharpSyntaxTree，然后CSharpCompilation使用该语法树创建一个对象。编译被命名为“MyAssembly”，并且对mscorlib程序集的引用被添加到它的引用中。语法树也被添加到编译的语法树中。
```csharp
using Microsoft.CodeAnalysis.CSharp;

var syntaxTree = CSharpSyntaxTree.ParseText("class MyClass {}");
var compilation = CSharpCompilation.Create("MyAssembly")
    .AddReferences(MetadataReference.CreateFromFile(typeof(object).Assembly.Location))
    .AddSyntaxTrees(syntaxTree);
```

### 创建方法并执行
```csharp
var syntaxTree = CSharpSyntaxTree.ParseText("class MyClass { public int MyMethod() { return 42; }  static void Main(string[] args){}}");
var compilation = CSharpCompilation.Create("MyAssembly")
    .AddReferences(MetadataReference.CreateFromFile(typeof(object).Assembly.Location))
    .AddSyntaxTrees(syntaxTree);

using var stream = new MemoryStream();
var emitResult = compilation.Emit(stream);

if (!emitResult.Success)
{
    foreach (var diagnostic in emitResult.Diagnostics)
    {
        Console.WriteLine(diagnostic);
    }
}
else
{
    var assembly = Assembly.Load(stream.ToArray());
    var myClassType = assembly.GetType("MyClass");
    var instance = Activator.CreateInstance(myClassType);
    var method = myClassType.GetMethod("MyMethod");
    var result = method.Invoke(instance, null);
    Console.WriteLine(result);
}
```


## 参考资料
Roslyn 入门：使用 Roslyn 静态分析现有项目中的代码：[https://blog.csdn.net/wpwalter/article/details/79616402](https://blog.csdn.net/wpwalter/article/details/79616402)
Roslyn 静态分析：[https://lindexi.gitee.io/lindexi/post/Roslyn-%E9%9D%99%E6%80%81%E5%88%86%E6%9E%90.html](https://lindexi.gitee.io/lindexi/post/Roslyn-%E9%9D%99%E6%80%81%E5%88%86%E6%9E%90.html)
Roslyn 入门：使用 .NET Core 版本的 Roslyn 编译并执行跨平台的静态的源码：[http://blog.walterlv.com/post/compile-and-invoke-code-using-roslyn.html](http://blog.walterlv.com/post/compile-and-invoke-code-using-roslyn.html)
