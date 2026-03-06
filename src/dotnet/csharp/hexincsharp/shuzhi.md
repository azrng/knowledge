---
title: 数值
lang: zh-CN
date: 2023-10-22
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 无
filename: shuzhi
slug: ip7ila
docsId: '30989874'
---

## 可为空数值

为什么数据类型也需要为null，考虑下两个场景：

1、数据库中一个int字段可以被设置为null，在c#中值被取出来之后，为了将它赋值给int类型，不得不受限判断下它是否为null。如果将nll直接赋值给int类型会引发异常。

2、在一个分布式系统中，服务器需要接受并解析来自客户端的数据，一个int类型的数据可能在传输中丢失了或者被篡改了，转型失败后应该保存为null值，而不是提供一个初始值。

类似场景很多，所以从.Net2.0开始提供了一个额外的类型，可为空的类型Nullable&lt;T&gt;。它是一个结构体，因为是结构化所以只有值引用类型才开一作为可为空的类型(引用类型本身就可以为null)，一个可为空的int类型表示为

```csharp
Nullable<int> a = null;
// 或者简化为
int? b = null;
```

## 随机数

```csharp
var randowm = new Random();
var result0 = randowm.Next(0, 10);

var result = new Random(BitConverter.ToInt32(Guid.NewGuid().ToByteArray(), 0)).Next(100);
```

## 格式转换
d = 4.56789 
向上取整
```csharp
string res = Math.Ceiling(Convert.ToDecimal(d)).ToString() 
或
string res = Math.Ceiling(Convert.ToDouble(d)).ToString();
```
向下取整
```csharp
string res = Math.Floor(Convert.ToDecimal(d)).ToString() //res为5 
或
string res = Math.Floor(Convert.ToDouble(d)).ToString(); //res为4
```
四舍五入：round
```csharp
Math.round(12.34);//12
//固定精度：tiFixed
100.456001.toFixed(2);//100.46
100.456001.toFixed(3);//100.456
//固定长度：toPrecision
99.456001.toPrecision(5);//99.456
100.456001.toPrecision(5);//100.46
```
//取整：parseint
//1.将字符串值转化为Number整数，对字符串的每一个字符进行转化，直到遇到不可转化的字符（包括小数点）停止。
2.对浮点类型数值取整，忽略小数部分，不做四舍五入处理

```csharp
Parseint('100');//100
Parseint('100axt');//100
//Number类型
Parseint(100.12)；//100
Parseint(100.78);//100
```

## 浮点型

### 比较大小

[停止使用==和!=来判断浮点数是否相等](https://mp.weixin.qq.com/s/YBQ6BPNXD0HqcicZxTN5dA)

### 浮点型的三个特殊值

```csharp
Double.NEGATIVE_INFINITY 负无穷
Double.POSITIVE_INFINITY 正无穷
Double.NaN 非数
```

## 高精度数值

[https://mp.weixin.qq.com/s/itbwJ3qz5TH9Mu9nqzqvkg](https://mp.weixin.qq.com/s/itbwJ3qz5TH9Mu9nqzqvkg) | 超越.NET极限-我做的高精度数值计算库

