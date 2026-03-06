---
title: 预定义类型
lang: zh-CN
date: 2023-10-22
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 无
filename: yudingyileixing
slug: ixq1r9
docsId: '30760648'
---

## 开篇语
本文是读书笔记

## 值类型
占用空间：byte ：1字节  bool：1  chat：2   short：2   int：4  float：4  double：8  long ：8

### 整型
C#支持8个预定义的整型类型，如下表所示：

| 关键字 | .NET struct | 描述 |
| --- | --- | --- |
| sbyte | System.SByte | 8位有符号整数 |
| short | System.Int16 | 16位有符号整数 |
| int | System.Int32 | 32位有符号整数 |
| long | System.Int64 | 64位有符号整数 |
| byte | System.Byte | 8位无符号整数 |
| ushort | System.Int16 | 16位无符号整数 |
| uint | System.Int32 | 32位无符号整数 |
| ulong | System.Int64 | 64位无符号整数 |


### 实数
| 类型 | .NET struct | 描述 | 小数位 | 示例 |
| --- | --- | --- | --- | --- |
| float | System.Single | 32位，单精度浮点数 | 7 | float f=1.0f; |
| double | System.Double | 64位，双精度浮点数 | 15/16 | double d=1D; |
| decimal | System.Decimal | 128位，高精度浮点数 | 28 | decimal d=1.0M; |

> 由于浮点型类型可以存储高精度的大额数字，因此可以使用“E 表示法”来表示该类型的值，这是一种科学记数法，表示“乘以 10 的 n 次幂”。因此，5E+2 之类的值将是 500 值，因为它相当于 5 * 10^2 或 5 * 10 * 10。


### 逻辑值(bool)
c#里面的bool类型，对应.net类型为struct system.boolean，仅包含两个值：false和true。
对于引用类型，默认情况下相等是基于引用的，而不是底层对象的实际值。但是string是一个例外，它是引用类型，但是她的相等运算法却遵守值类型的语义。

### 字符(char)
为了表示单个字符，c#提供了char类型，对应的是struct system.char,char的赋值通常是用单括号括起来，例如
char c='A';

## 引用类型

### 字符串(string)
c#中字符串类型标识不可变的Unicode字符序列。字符串字面量应位于两个双引号("")之间。
```csharp
string name = "张三";
```
string类型的相等运算法遵守值类型的语义
```csharp
string a = "ceshi";
string b = "ceshi";
Console.WriteLine(a == b); // True
```

### 类
会有其他文章单独说明

### 数组
数组是固定长度的特定类型的变量集合。为了实现高效访问，数组中的元素总是存储在连续的内存块中。
```csharp
int[] a = new int[1000];
Console.WriteLine(a[100]); // 0  默认值初始化  

string[] names1 = new string[] { "张三", "李四" };
string[] names2 = new string[] { "张三", "李四" };
Console.WriteLine(names1 == names2); // False
Console.WriteLine(names1.Equals(names2)); //False
```
数组通过索引从0开始获取数组中的元素
```csharp
string[] names1 = new string[] { "张三", "李四" };
var name = names1[0]; // 张三
```
数组一旦创建完毕，长度将不能更改。如果使用到可变集合需要使用List或者字典。

### 接口
接口和类相似，不过接口只能为成员提供定义而不能提供实现(除了C#8后的默认接口方法)，接口可以多继承而类只能单继承.
```csharp
public interface IUserService 
{
    void Sum(int x,int y);
}
```
继承接口必须实现接口的所有成员。

### 委托
委托是一种知道如何调用方法的对象。
```csharp
    internal class Program
    {
        public delegate string mydelegate();
        private static void Main(string[] args)
        {
            mydelegate de = Test;
            var result = de.Invoke();
            Console.WriteLine(result);
        }
        static string Test()
        {
            return "测试";
        }
    }
```
委托实例字面上就是调用者的代理：调用者调用委托，然后委托调用目标方法，这种间接调用方式可以将调用者和目标方法解耦。
