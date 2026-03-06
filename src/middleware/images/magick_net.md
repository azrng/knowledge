---
title: Magick.NET
lang: zh-CN
date: 2023-10-18
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: magick_net
slug: wpwb1k
docsId: '32427263'
---

## 概述
Magick.NET 是 ImageMagick 的 .NET 库，ImageMagick 是一个强大的创建、编辑、合成和转换位图图像工具。

### 优点

- 作者维护积极，下载量高
- **支持多平台**
- 商用免费

## 操作

### Png转Ico
```csharp
static void Main(string[] args)
{
    using (var image = new MagickImage("test.png"))
    {
        image.Write("test_64px.ico");

        image.Resize(32, 32);
        image.Write("test_32px.ico");
    }

    Console.WriteLine("Conversion has been completed.");
}
```

## 资料

[NET平台下的图片处理库竟能这样处理图片](https://mp.weixin.qq.com/s/KRbWEFdpytH3TcRPkgogSg)
