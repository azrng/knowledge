---
title: 条形码BarcodeLib
lang: zh-CN
date: 2022-05-08
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: tiaoxingmabarcodelib
slug: mkucfo
docsId: '68056806'
---

## 概述
该库旨在为开发人员提供一个简单的类，以便在需要从数据字符串生成条形码图像时使用。
Github：[https://github.com/barnhill/barcodelib](https://github.com/barnhill/barcodelib)
缺点：依赖System.Drawing.Common，不支持跨平台

## 操作
引用组件
```csharp
<PackageReference Include="BarcodeLib" Version="2.4.0" />
```

### 条形码
```csharp
/// <summary>
/// 使用BarcodeLib生成条形码
/// </summary>
/// <param name="barCode">内容</param>
/// <returns></returns>
public static Image GenerateBarCodeByBarcodeLib(string barCode)
{
    Barcode barcode = new Barcode()
    {
        IncludeLabel = true,//是否包含图片下面的文字信息
        Alignment = AlignmentPositions.CENTER,//一维码在图片居中
        Width = 250,
        Height = 100,
        RotateFlipType = RotateFlipType.RotateNoneFlipNone,//图像反转
        BackColor = Color.White,//背景色
        ForeColor = Color.Black,//前景色
    };

    return barcode.Encode(TYPE.EAN13, barCode);
}
```
