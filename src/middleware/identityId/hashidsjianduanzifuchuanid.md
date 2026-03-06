---
title: Hashids简短字符串ID
lang: zh-CN
date: 2022-07-04
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: hashidsjianduanzifuchuanid
slug: tvw897
docsId: '47399632'
---

## 介绍
Hashids是一个小型的开源库，它从数字生成简短的、唯一的、非顺序的id。它将像347这样的数字转换成像“yr8”这样的字符串，或者像[27,986]这样的数字数组转换成“3kTMd”。您还可以解码这些id。这对于将多个参数绑定到一个或简单地将它们用作简短的uid非常有用。
> 官网：[https://hashids.org/objective-c/](https://hashids.org/objective-c/)


## 使用场景
比如对Id加密生成无意义的字符串，后端还可以进行解密回来。防止信息被获取。

## 简单操作
引用组件
```csharp
<PackageReference Include="Hashids.net" Version="1.4.0" />
```
初始化
```csharp
var hashIds = new Hashids();
//初始化并创建私钥
//var hashIds = new Hashids("salt");
```
加解密int类型
```csharp
//加密
var encrypt = hashIds.Encode(123456);// 7E1dX
//解密
var decrypt = hashIds.Decode(encrypt)[0];// 123456
```
限制最小长度
```csharp
var hashids = new Hashids("ceshichangdu",minHashLength:8);
var str = hashids.Encode(12345);
var num = hashids.Decode(str)[0];
var success = (hashids.Decode("WwYQ").Any());
```
自定义哈希字母表
默认加密字符串只包含大小写字母和数字，我们可以使用其他unicode作为哈希字母表，增大破解难度。
```csharp
var hashids = new Hashids("ceshizhong", alphabet: @"あいうえおかきくけこさしすせそたちつてと");
var str = hashids.Encode(12345);
```

## 参考资料
> [https://mp.weixin.qq.com/s/1S0Gv5M6EmLTREDW02vwBg](https://mp.weixin.qq.com/s/1S0Gv5M6EmLTREDW02vwBg)

