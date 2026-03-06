---
title: 混淆器
lang: zh-CN
date: 2023-07-13
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: hunxiaoqi
slug: thel1k
docsId: '64460775'
---

## 概述
将编程后的程序混淆，使得编译后代码不容易被别人看懂。

## 工具

- ConfuserEx
   - 文档：[https://blog.csdn.net/qq_40594137/article/details/102058180](https://blog.csdn.net/qq_40594137/article/details/102058180)
- Eziriz .Net Reactor
   - 文档：[https://masuit.org/34?t=v62hl5juu22o](https://masuit.org/34?t=v62hl5juu22o)
   - 资料：[https://blog.csdn.net/sinat_40003796/article/details/124865720](https://blog.csdn.net/sinat_40003796/article/details/124865720)
- JIEJIE.NET
   - 文档：[https://www.cnblogs.com/dotnet-box/p/17360983.html](https://www.cnblogs.com/dotnet-box/p/17360983.html)
   - 项目地址：[https://github.com/dcsoft-yyf/JIEJIE.NET](https://github.com/dcsoft-yyf/JIEJIE.NET)

目前市面上流行的.Net加壳软件大致有如下：
Dotfuscator:Visual Stuido自带的，你可以自己去安装使用。安全性低级。
dotNET Reactor:官方宣传:无与伦比的.NET代码保护系统，可完全阻止任何人反编译您的代码。个人认为的安全性中下。
ILProtector:可保护您的 .NET 代码免受逆向工程、反编译和修改。安全性中级。
Axprotect:老外的商用产品，可以保护托管和非托管。安全中级。
EXECryptor:高强度加壳的软件，安全性中上级。
Xenocode Fox:反编译工具，混淆工具，安全性低级。
Vmproject:能够混淆和加密JIT,CLR等内存级的工具，而且它混淆之后的代码执行在非标准体系结构的虚拟机上，非常牛掰。安全性高级。
