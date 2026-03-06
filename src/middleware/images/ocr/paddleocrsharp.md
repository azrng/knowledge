---
title: PaddleOCRSharp
lang: zh-CN
date: 2023-08-11
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: paddleocrsharp
slug: wyi6i1
docsId: '69573763'
---

## 概述
PaddleOCRSharp 是一个基于百度飞桨[PaddleOCR](https://gitee.com/link?target=https%3A%2F%2Fgithub.com%2Fpaddlepaddle%2FPaddleOCR)的.NET版本OCR工具类库。项目核心组件PaddleOCR.dll,由C++编写，根据百度飞桨[PaddleOCR](https://gitee.com/link?target=https%3A%2F%2Fgithub.com%2Fpaddlepaddle%2FPaddleOCR)的C++代码修改并优化而成。目前已经支持C++、.NET、Python、Golang、Rust等开发语言的直接API接口调用。项目包含文本识别、文本检测、表格识别功能。本项目针对小图识别不准的情况下做了优化，比飞桨原代码识别准确率有所提高。包含总模型仅8.6M的超轻量级中文OCR，单模型支持中英文数字组合识别、竖排文本识别、长文本识别。同时支持中英文、纯英文以及多种语言文本检测识别。

仓库地址：[https://gitee.com/raoyutian/paddle-ocrsharp](https://gitee.com/raoyutian/paddle-ocrsharp)

## 操作
引用组件
```csharp
<ItemGroup>
	<PackageReference Include="PaddleOCRSharp" Version="3.1.0" />
</ItemGroup>
```

### 识别图片内容
```csharp
var str = "D:\\temp\\222.png";
var imagebyte = File.ReadAllBytes(str);
Bitmap bitmap = new(new MemoryStream(imagebyte));
using (var engine = new PaddleOCREngine(null, new OCRParameter()))
{
    var ocrResult = engine.DetectText(bitmap);
    if (ocrResult != null)
    {
        Console.WriteLine(ocrResult.Text);
    }
}
```

## 资料
身份证和车牌识别：[https://bbs.huaweicloud.com/blogs/388075](https://bbs.huaweicloud.com/blogs/388075)
