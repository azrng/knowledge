---
title: 颜色Colorful.Console
lang: zh-CN
date: 2022-07-28
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: yansecolorful_console
slug: ox50ln
docsId: '71200844'
---

## 介绍
Colorful.Console是一个Nuget包，它可以增强我们对控制台输出文字样式的控制。我们可以使用System.Drawing.Color中定义的颜色来定义控制台程序的配色方案。
Colorful.Console: http://colorfulconsole.com/

## 操作
引用nuget包
```csharp
<PackageReference Include="Colorful.Console" Version="1.2.15" />
```

### 基本操作
```csharp
using System.Drawing;
using Console = Colorful.Console;


Console.WriteLine("console in pink", Color.Pink);
Console.WriteLine("console in default");
```

### FIGlet字体输出
```csharp
FIGLet: http://www.figlet.org/
FigletFont font = FigletFont.Load("chunky.flf");
Figlet figlet = new Figlet(font);

Console.WriteLine(figlet.ToAscii("Belvedere"), ColorTranslator.FromHtml("#8AFFEF"));
Console.WriteLine(figlet.ToAscii("ice"), ColorTranslator.FromHtml("#FAD6FF"));
Console.WriteLine(figlet.ToAscii("cream."), ColorTranslator.FromHtml("#B8DBFF"));
```

## 资料
将图片或者视频转换Wie彩色字符图后输出：[https://github.com/Roy0309/Img2ColorfulChars](https://github.com/Roy0309/Img2ColorfulChars)
