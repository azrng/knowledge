---
title: 弃元
lang: zh-CN
date: 2023-11-09
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 无
filename: qiyuan
slug: vgkrbsrn501izhxo
docsId: '146446337'
---

#### 介绍
在 C## 7.0 中，弃元的使用场景主要有下面四种：
元组和对象的解构
使用 is 和 switch 的模式匹配
对具有 out 参数的方法的调用
作用域内独立使用场景

#### 场景一：元组/对象的解构
```csharp
var tuple = (1, 2, 3, 4, 5);
(_, _, _, _, var fifth) = tuple;
```

#### 场景二：使用 is/switch 的模式匹配
```csharp
var obj = CultureInfo.CurrentCulture.DateTimeFormat;

switch (obj)
{
    case IFormatProvider fmt:
        Console.WriteLine($"{fmt} object");
        break;
    case null:
        Console.Write("A null object reference");
        break;
    case object _:
        Console.WriteLine("Some object type without format information");
        break;
}

if (obj is object _)
{
    ...
}
```

#### 场景三：对具有 out 参数的方法的调用
```csharp
var point = new Point(10, 10);
// 只要 x, 不关心 y
point.GetCoordinates(out int x, out _);
```

#### 场景四：作用域内独立使用场景
```csharp
void Test(Dto dto)
{
    _ = dto ?? throw new ArgumentNullException(nameof(dto));
}
```

#### 增加的场景
C## 9.0 对弃元增加了一种场景支持：Lambda参数，也包括匿名方法参数。示例：
```csharp
// C## 9 之前
Func<int, int, int> zero = (a, b) => 0;
Func<int, int, int> func = delegate (int a, int b) { return 0; };
 
// C## 9
Func<int, int, int> zero = (_, _) => 0;
Func<int, int, int> func = delegate (int _, int _) { return 0; };
```
在 C## 9 之前，即便不使用的Lambda 参数也需要给它命名。C## 9 支持弃元参数一方面简化了命名，另一方面也节省了内存分配。更重要的是它使得编程的意图更明确，让人一看就知道这个参数是不用的，增强了代码的可读性和可维护性。
