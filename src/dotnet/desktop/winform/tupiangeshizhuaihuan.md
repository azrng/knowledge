---
title: 图片格式转换
lang: zh-CN
date: 2023-04-02
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: tupiangeshizhuaihuan
slug: pb80u8
docsId: '31541352'
---

### bmp压缩成jpg
```csharp
Bitmap source = (Bitmap)Image.FromFile("source.bmp");
source.Save("target.jpg",Imaging.ImageFormat.Jpeg);
```
