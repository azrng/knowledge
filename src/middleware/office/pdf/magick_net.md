---
title: Magick.NET
lang: zh-CN
date: 2023-06-24
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: magick_net
slug: kcom76
docsId: '60987072'
---

## 目的
将pdf文件转成其他格式的文件

最近更新：2023.06.5
下载量：12.1M(2023年6月24日)

## 操作

### 准备
需要在电脑安装ghostscript
> 自行百度下载软件

安装nuget包
```csharp
<PackageReference Include="Magick.NET-Q16-AnyCPU" Version="8.4.0" />
```

### PDF转图片
```csharp
MagickReadSettings settings = new MagickReadSettings();
settings.Density = new Density(100, 100); //设置质量
using (MagickImageCollection images = new MagickImageCollection())
{
    await images.ReadAsync(writememoryStream, settings);
    Console.WriteLine("解析图片后" + watch.ElapsedMilliseconds);
    for (int i = 0; i < images.Count; i++)
    {
        MagickImage image = (MagickImage)images[i];
        image.Format = MagickFormat.Jpeg;
        await image.WriteAsync("d://img//" + i + ".jpeg");
    }
}
```

## 资料
官网文档：[https://github.com/dlemstra/Magick.NET/blob/main/docs/Readme.md](https://github.com/dlemstra/Magick.NET/blob/main/docs/Readme.md)
