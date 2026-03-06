---
title: 预处理指令
lang: zh-CN
date: 2023-10-25
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 无
filename: yuchulizhiling
slug: xndh325k9g57p5l8
docsId: '144664892'
---

## 概述
C#还有许多名为“预处理器指令”的命令。这些命令从来不会转化为可执行代码中的命令，但会影响编译过程的各个方面。例如，使用预处理器指令可以禁止编译器编译代码的某一部分。如果计划发布两个版本的代码，即基本版本和拥有更多功能的企业版本，就可以使用这些预处理器指令。在编译软件的基本版本时，使用预处理器指令可以禁止编译器编译与附加功能相关的代码。另外，在编写提供调试信息的代码时，也可以使用预处理器指令。

## 操作

### `#define` 和 `#undef`

在C#中，`#define`指令用于定义一个符号（Symbol）。这个符号实际上是一个标识符，它不代表任何具体的值，只是一个占位符，用于条件编译中的判断。当你使用`#define`指令定义了一个符号，编译器会将这个符号视为已经定义，然后你可以在代码中使用条件编译指令来根据是否定义了这个符号来包含或排除某些代码块。例如：

```c#
#define DEBUG
#if DEBUG
    // 调试模式下的代码
#else
    // 发布模式下的代码
#endif
```

### `#if`、`#elif`、`#else`和`#endif`

这组指令使得我们能够根据条件编译不同的代码块，这对于调试bug比较方便。例如：这些指令告诉编译器是否要编译代码块。

```csharp
int DoSomeWork(double x)
{
    #if DEBUG
        WriteLine($"x is {x}");
    #endif
}


#if DEBUG
    // 调试模式下的代码
#elif RELEASE
    // 发布模式下的代码
#else
    // 默认的代码
#endif
```

### `#warning` 和 `#error`

`warning`用于生成编译时警告，而`#error`用于生成编译时错误。这对于确保代码质量和可维护性非常有帮助：

```c#
#warning This code needs review#error This code is not supported
```

### `#region`和 `#endregion`

`#region`用于定义代码折叠区域，使得代码结构更加清晰，这是比较常用的C#预处理指令：

```c#
#region MyRegion    // 你写的一些代码 #endregion
```

### `#pragma`

`#pragma`用于向编译器发送特定的指令，例如禁用或启用特定的警告，这个必须在逻辑代码第一行：

```c#
#pragma warning disable
```

## 资料

c#中的预定义类型：https://mp.weixin.qq.com/s/gEiyDNs9J7tbbLayUXPPWA
