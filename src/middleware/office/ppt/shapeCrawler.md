---
title: ShapeCrawler
lang: zh-CN
date: 2024-03-09
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - ppt
---

## 概述

ShapeCrawler 是一个专为处理 PowerPoint 演示文稿而设计的 .NET 库。这个库为开发者提供了一组简单易用的 API，以便操作 PowerPoint (.pptx) 文件中的各种元素。

ShapeCrawler 库的特点包括：

1、无需安装 Microsoft Office：是一个独立的库，不需要在开发或运行环境中安装 Microsoft Office。

2、基于 Open XML SDK：基于 Open XML SDK 的基础上，封装的提供更高层次的抽象。Open XML SDK 是一个开源库，提供了Office 文件格式（如 .docx、.xlsx、.pptx 等）的底层API操作。

3、简单易用：提供了一个简化的对象模型，使得开发者可以轻松地遍历、查询、修改和创建 PowerPoint 演示文稿中的形状。你可以轻松地获取形状的属性（如位置、大小、填充颜色等），以及修改它们。

4、支持类型多：支持包括文本框、图形、图像、图表等操作。

仓库地址：[https://github.com/ShapeCrawler/ShapeCrawler](https://github.com/ShapeCrawler/ShapeCrawler)

## 操作

**1、简单示例**


```c#
// 打开PPT
var pres = new Presentation("xxx.pptx");
var shapes = pres.Slides[0].Shapes;
// 获取PPT的数量
var shapesCount = shapes.Count;
// 获取文本
var shape = shapes.GetByName("TextBox 1");
var text = shape.TextFrame!.Text
```

**2、设置文本框为自动适应**

```c#
var pres = new Presentation("some.pptx");
var shape = pres.Slides[0].Shapes.GetByName("AutoShape 1");
var textFrame = shape.TextFrame!;

textFrame.AutofitType = AutofitType.Resize;

pres.Save();
```

**3、替换文字**

```c#
var pres = new Presentation("some.pptx");
var textFrames = pres.Slides[0].TextFrames();

foreach (var textFrame in textFrames)
{
    textFrame.Text = "some text";
}

pres.Save();
```

**4、更新图片**

```c#
var pres = new Presentation("picture.pptx");

// 获取图片控件
var picture = pres.Slides[0].Shapes.GetByName<IPicture>("Picture 1");

// 更改图片
picture.Image.Update("new-image.png");

// 获取图片的MIME
var mimeType = picture.Image.MIME;

pres.Save();
```

**5、表格操作**

```c#
var pres = new Presentation("some-pptx");
var shapeCollection = pres.Slides[0].Shapes;

shapeCollection.AddTable(x: 50, y: 100, columnsCount: 3, rowsCount: 2);
var addedTable = (ITable)shapeCollection.Last();
var cell = addedTable[0, 0];
cell.TextFrame.Text = "Hi, Table!";

pres.Save();
```