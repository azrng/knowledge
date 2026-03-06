---
title: 调用者信息
lang: zh-CN
date: 2023-03-02
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: diaoyongzhexinxi
slug: ghuvkgnt6tehlvlm
docsId: '116506204'
---

## 概述
为了方便我们获取调用方的方法名等信息，而不再传播nameof来获取，所以找到了下面的方法。

## 操作

### 获取调用者行号
通过CallerLineNumber来获取调用者的行号[文档地址](https://learn.microsoft.com/zh-cn/dotnet/api/system.runtime.compilerservices.callerlinenumberattribute?view=net-7.0)
```csharp
void Main()
{
	TraceMessage("Something happened.");
}

public static void TraceMessage(string message,
					   [CallerLineNumber] int sourceLineNumber = 0)
{
	Console.WriteLine("行: {0} - {1}", sourceLineNumber, message);
}

// 输出结果
行: 3 - Something happened.
```

### 获取调用者文件路径
获取调用方的源文件的完整路径，这是编译时的文件路径[文档地址](https://learn.microsoft.com/zh-cn/dotnet/api/system.runtime.compilerservices.callerfilepathattribute?view=net-7.0)
```csharp
void Main()
{
	TraceMessage("Something happened.");
}

public static void TraceMessage(string message,
						[CallerFilePath] string sourceFilePath = "")
{
	Console.WriteLine("File: {0} - {1}", Path.GetFileName(sourceFilePath), message);
}

// 输出结果
File: LINQPadQuery - Something happened.
```

### 获取调用者方法名
获取方法调用方或者属性名称 [文档地址](https://learn.microsoft.com/zh-cn/dotnet/api/system.runtime.compilerservices.callermembernameattribute?view=net-7.0)
```csharp
void Main()
{
	DoProcessing();
}

public static void DoProcessing()
{
	TraceMessage("Something happened.");
}

public static void TraceMessage(string message,
					 [CallerMemberName] string memberName = "")
{
	Console.WriteLine("Member: {0} - {1}", memberName, message);
}

// 输出结果
Member: DoProcessing - Something happened.
```

### 获取调用者的参数表达式
参数将为另一个参数传递的表达式捕捉为字符串 [文档地址](https://learn.microsoft.com/zh-cn/dotnet/api/system.runtime.compilerservices.callerargumentexpressionattribute?view=net-7.0)
```csharp
void Main()
{
	int x = 10;
	int y = 20;
	Assert(x > y, "x > y");
}


public static void Assert(bool condition, [CallerArgumentExpression("condition")] string message = null)
{
	Console.WriteLine("Condition: {0} - {1}", condition, message);
}

// 输出结果
Condition: True - x > y
```

## 参考文档
我不想再传递nameof了：[https://mp.weixin.qq.com/s/iDq51PY78vZJEItJL-0TWQ](https://mp.weixin.qq.com/s/iDq51PY78vZJEItJL-0TWQ)
