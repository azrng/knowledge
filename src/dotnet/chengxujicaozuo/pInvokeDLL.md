---
title: P/Invoke之C#调用动态链接库DLL
lang: zh-CN
date: 2023-08-12
publish: true
author: baibaomen-org
isOriginal: false
category:
  - dotNet
tag:
  - pInvoke
  - DLL
filename: pInvokeDLL
docsId: '13b2dcb3-ad4e-4e23-9b27-5cb195dd38a9'
---

:::tip

本编所涉及到的工具以及框架：
1、Visual Studio 2022
2、.net 6.0

:::

## P/Invok是什么？

```css
P/Invoke全称为Platform Invoke(平台调用)，其实际上就是一种函数调用机制，通过P/Invoke就可以实现调用非托管Dll中的函数。
```

## 在开始之前，我们首先需要了解C#中有关托管与非托管的区别

```text
托管（Collocation），即在程序运行时会自动释放内存;
非托管，即在程序运行时不会自动释放内存。
```

## 废话不多说，直接实操

### 第一步：

1. 打开VS2022，新建一个C#控制台应用
   ![img](/common/3089082-20230329095716796-1581020064.png)

2. 右击解决方案，添加一个新建项，新建一个"动态链接库（DLL）"，新建完之后需要右击当前项目--> 属性 --> C/C++ --> 预编译头 --> 选择"不使用编译头"

   ![img](/common/3089082-20230329095725016-1392588948.png)

3. 在新建的DLL中我们新建一个头文件，用于编写我们的方法定义，然后再次新建一个C++文件，后缀以.c 结尾

   ![img](/common/3089082-20230329095732290-1263354054.png)

### 第二步：

1. 在我们DLL中的头文件(Native.h)中定义相关的Test方法，具体代码如下：

   ```c
   #pragma once
   
   // 定义一些宏
   #ifdef __cplusplus
   #define EXTERN extern "C"
   #else
   #define EXTERN
   #endif
   
   #define CallingConvention _cdecl
   
   // 判断用户是否有输入，从而定义区分使用dllimport还是dllexport
   #ifdef DLL_IMPORT 
   #define HEAD EXTERN __declspec(dllimport)
   #else
   #define  HEAD EXTERN __declspec(dllexport)
   #endif
   
   HEAD int CallingConvention Sum(int a, int b);
   ```

2. 之后需要去实现头文件中的方法，在Native.c中实现，具体实现如下：

   ```c
   #include "Native.h" // 导入头部文件
   #include "stdio.h"
   
   HEAD int Add(int a, int b)
   {
       return a+b;
   }
   ```

3. 在这些步骤做完后，可以尝试生成解决方案，检查是否报错，没有报错之后，将进入项目文件中，检查是否生成DLL (../x64/Debug)

   ![img](/common/3089082-20230329095744430-1061697530.png)

### 第三步:

1. 在这里之后，就可以在C#中去尝试调用刚刚所声明的方法，以便验证是否调用DLL成功，其具体实现如下：

   ```Csharp
   using System.Runtime.InteropServices;
   
   class Program
   {
       [DllImport(@"C:\My_project\C#_Call_C\CSharp_P_Invoke_Dll\x64\Debug\NativeDll.dll")]
       public static extern int Add(int a, int b);
   
       public static void Main(string[] args)
       {
           int sum = Add(23, 45);
           Console.WriteLine(sum);
           Console.ReadKey();
       }
   }
   ```

   运行结果为：`68`，证明我们成功调用了DLL动态链库

## C#中通过P/Invoke调用DLL动态链库的流程

  通过上述一个简单的例子，我们大致了解到了在C#中通过P/Invoke调用DLL动态链库的流程，接下我们将对C#中的代码块做一些改动，便于维护

1. 在改动中我们将用到`NativeLibrary`类中的一个方法，用于设置回调，解析从程序集进行的本机库导入，并实现通过设置DLL的相对路径进行加载，其方法如下：

   ```Csharp
   public static void SetDllImportResolver (System.Reflection.Assembly assembly, System.Runtime.InteropServices.DllImportResolver resolver);
   ```

2. 在使用这个方法前，先查看一下其参数

   a、assembly: 主要是获取包含当前正在执行的代码的程序集（不过多讲解）

   b、resolber: 此参数是我们要注重实现的，我们可以通过查看他的元代码，发现其实现的是一个委托，因此我们对其进行实现。

   原始方法如下：

   ```csharp
   public delegate IntPtr DllImportResolver(string libraryName, Assembly assembly, DllImportSearchPath? searchPath);
   ```

3. 实现resolver方法：

   ```csharp
   const string NativeLib = "NativeDll.dll";
   static IntPtr DllImportResolver(string libraryName, Assembly assembly, DllImportSearchPath? searchPath)
   {
       string dll = Path.Combine(new DirectoryInfo(Environment.CurrentDirectory).Parent.Parent.Parent.Parent.ToString(), "x64","Release", "NativeDll.dll"); // 此处为Dll的路径
       //Console.WriteLine(dll);
       return libraryName switch
       {
           NativeLib => NativeLibrary.Load(dll, assembly, searchPath),
           _ => IntPtr.Zero
       };
   }
   ```

   该方法主要是用于区分在加载DLL时不一定只能是设置绝对路径，也可以使用相对路径对其加载，本区域代码是通过使用委托去实现加载相对路径对其DLL加载，这样做的好处是，便于以后需要更改DLL的路径时，只需要在这个方法中对其相对路径进行修改即可。

4. 更新C#中的代码，其代码如下：

   ```csharp
   using System.Reflection;
   using System.Runtime.InteropServices;
   
   class Program
   {
       const string NativeLib = "NativeDll.dll";
       [DllImport(NativeLib)]
       public static extern int Add(int a, int b);
       static IntPtr DllImportResolver(string libraryName, Assembly assembly, DllImportSearchPath? searchPath)
       {
           string dll = Path.Combine(new DirectoryInfo(Environment.CurrentDirectory).Parent.Parent.Parent.Parent.ToString(), "x64","Release", "NativeDll.dll");
           Console.WriteLine(dll);
           return libraryName switch
           {
               NativeLib => NativeLibrary.Load(dll, assembly, searchPath),
               _ => IntPtr.Zero
           };
       }
       public static void Main(string[] args)
       {
           NativeLibrary.SetDllImportResolver(Assembly.GetExecutingAssembly(), DllImportResolver);
           int sum = Add(23, 45);
           Console.WriteLine(sum);
           Console.ReadKey();
       }
   }
   ```

5. 最后重新编译，检查其是否能顺利编译通过，最终我们的到的结果为：`68`

## 至此，我们就完成了一个简单的C#调用动态链接库的案例

  下面将通过一个具体实例，讲述为什么要这样做？（本实例通过从性能方面进行对比）

1. 在DLL中的头文件中，加入如下代码：

   ```Csharp
   HEAD void CBubbleSort(int* array, int length);
   ```

2. 在.c文件中加入如下代码：

   ```C
   HEAD void CBubbleSort(int* array, int length)
   {
       int temp = 0;
       for (int i = 0; i < length; i++)
       {
           for (int j = i + 1; j < length; j++)
           {
               if (array[i] > array[j])
               {
                   temp = array[i];
                   array[i] = array[j];
                   array[j] = temp;
               }
           }
       }
   }
   ```

3. C#中的代码修改：

   ```csharp
   using System.Diagnostics;
   using System.Reflection;
   using System.Runtime.InteropServices;
   
   class Program
   {
       const string NativeLib = "NativeDll.dll";
   
       [DllImport(NativeLib)]
       public unsafe static extern void CBubbleSort(int* arr, int length);
       static IntPtr DllImportResolver(string libraryName, Assembly assembly, DllImportSearchPath? searchPath)
       {
           string dll = Path.Combine(new DirectoryInfo(Environment.CurrentDirectory).Parent.Parent.Parent.Parent.ToString(), "x64", "Release", "NativeDll.dll");
           //Console.WriteLine(dll);
           return libraryName switch
           {
               NativeLib => NativeLibrary.Load(dll, assembly, searchPath),
               _ => IntPtr.Zero
           };
       }
   
       public unsafe static void Main(string[] args)
       {
           int num = 10000;
           int[] arr = new int[num];
           int[] cSharpResult = new int[num];
   
           //随机生成num数量个（0-10000）的数字
           Random random = new Random();
           for (int i = 0; i < arr.Length; i++)
           {
               arr[i] = random.Next(10000);
           }
   
           //利用冒泡排序对其数组进行排序
           Stopwatch sw = Stopwatch.StartNew();
           Array.Copy(arr, cSharpResult, arr.Length);
           cSharpResult = BubbleSort(cSharpResult);
           Console.WriteLine($"\n C#实现排序所耗时：{sw.ElapsedMilliseconds}ms\n");
   
           // 调用Dll中的冒泡排序算法
           NativeLibrary.SetDllImportResolver(Assembly.GetExecutingAssembly(), DllImportResolver);
           fixed (int* ptr = &arr[0])
           {
               sw.Restart();
               CBubbleSort(ptr, arr.Length);
           }
           Console.WriteLine($"\n C实现排序所耗时：{sw.ElapsedMilliseconds}ms");
           Console.ReadKey();
   
       }
       //冒泡排序算法
       public static int[] BubbleSort(int[] array)
       {
           int temp = 0;
           for (int i = 0; i < array.Length; i++)
           {
               for (int j = i + 1; j < array.Length; j++)
               {
                   if (array[i] > array[j])
                   {
                       temp = array[i];
                       array[i] = array[j];
                       array[j] = temp;
                   }
               }
           }
           return array;
       }
   }
   ```

4. 执行结果:

   ```bash
   C#实现排序所耗时: 130ms
   C实现排序所耗时：3ms
   ```

   在实现本案例中，可能在编译后，大家所看到的结果不是很出乎意料，但这只是一种案例，希望通过此案例的分析，能给大家带来一些意想不到的收获叭。

## 最后

简单做一下总结叭，通过上述所描述的从第一步如何创建一个DLL到如何通过C#去调用的一个简单实例，也应该能给正在查阅相关资料的你有所收获，也希望能给在这方面有所研究的你有一些相关的启发，同时也希望能给目前对这方面毫无了解的你有一个更进一步的学习。

作者：百宝门-刘忠帅

原文地址：https://blog.baibaomen.com/p-invoke之c调用动态链接库dll/