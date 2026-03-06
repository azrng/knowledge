---
title: QrCodeGenerator
lang: zh-CN
date: 2023-09-02
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: qrcodegenerator
slug: qbohg24z5uggdmmk
docsId: '138121173'
---

## 概述
QrCodeGenerator 是开源的 .NET 二维码生成库，它支持从文本字符串和字节数组生成二维码图片。
这个库是基于 .NET Standard 2.0 构建的，所以它可以在大多数现代 .NET 平台（.NET Core、.NET Framework、Mono 等）上运行，包括 .NET 6, .NET 7。

仓库地址：[https://github.com/manuelbl/QrCodeGenerator](https://github.com/manuelbl/QrCodeGenerator)

## 操作
1、通过 Nuget 安装 Net.Codecrete.QrCodeGenerator。
```
Install-Package Net.Codecrete.QrCodeGenerator -Version 2.0.3
```
在程序中添加下面的代码
```
var text = "https://dotnet.microsoft.com"; 
var qr = QrCode.EncodeText(text, QrCode.Ecc.Medium);
string svg = qr.ToSvgString(4);
File.WriteAllText("qrcode.svg", svg, Encoding.UTF8);
```
执行后，程序会生成下面的二维码。

QrCode.Ecc.Medium 用来配置纠错级别。比如设置为 QrCode.Ecc.High 时，代表二维码损坏 30% 以下，还是可以正常识别的。
另外 Medium 是 15%, Low 是 7%。另外还支持设置前景和背景颜色, 下面的就变成绿码了。
```bash
var text = "https://dotnet.microsoft.com";  
var qr = QrCode.EncodeText(text, QrCode.Ecc.High);
string svg = qr.ToSvgString(4,"green","white");
File.WriteAllText("qrcode.svg", svg, Encoding.UTF8);
```
生成 PNG 格式的二维码从 .NET 6 开始，System.Drawing 只在 Windows 操作系统上支持，所以对于 Linux 平台，就要另寻辟径了。
好在作者提供了解决方案，灵活地以扩展方法的形式提供了三个选项。
1、选择下面任一个图像库
2、安装 对应的 Nuget 包
3、把 QrCodeBitmapExtensions.cs 文件复制到您的项目中
![](/common/1693647762970-f0972e02-0fe1-4cf6-be9e-46acc40276ad.png)
使用这些扩展方法，生成 PNG 图像非常简单：
```
var text = "https://dotnet.microsoft.com";  
var qr = QrCode.EncodeText(text, QrCode.Ecc.High);  
qr.SaveAsPng("qrcode.png", 10, 3, 
    foreground:SKColor.Parse("#45aae5"),
    background:SKColor.Parse("#ffffff")
);
```
