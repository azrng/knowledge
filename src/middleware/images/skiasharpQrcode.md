---
title: 多种码SkiaSharp.QrCode
lang: zh-CN
date: 2022-05-08
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: duochongmaskiasharp_qrcode
slug: xwf9hk
docsId: '63736682'
---

## 介绍
二维码（QR Code），与传统的一维码，比如条形码，二维码具有存储的数据量更大；可以包含数字、字符，及中文文本等混合内容；有一定的容错性（在部分损坏以后还可以正常读取）；空间利用率高等优点。

## 优点
虽然已经有很多生成二维码的解决方案，但是它们大多依赖System.Drawing，而在Linux下需要考虑System.Drawing的GDI+兼容性问题（需要安装libgdiplus），但是该组件完全不依赖GDI和System.Drawing。



Linux平台生成二维码无依赖性包  SkiaSharp.NativeAssets.Linux.NoDependencies

## 操作
安装组件
```csharp
<PackageReference Include="SkiaSharp.QrCode" Version="0.4.1" />
```
### 生成二维码

```csharp
// 二维码内容 如果这里存放的是url，那么微信、支付宝等在扫描后是可以直接跳转打开的
var content = "张三";

//创建生成器
using var generator = new QRCodeGenerator();
// 设置错误校正能力（ECC）级别
var qr = generator.CreateQrCode(content, ECCLevel.H);

// 创建一个Canvas
var info = new SKImageInfo(512, 512);
using var surface = SKSurface.Create(info);
var canvas = surface.Canvas;

// 渲染二维码到Canvas
canvas.Render(qr, info.Width, info.Height);

// 输出到文件
using var image = surface.Snapshot();
using var data = image.Encode(SKEncodedImageFormat.Png, 100);
using var stream = File.OpenWrite("QRCode.png");
data.SaveTo(stream);
```
生成二维码最关键的是ECC级别设置，具体取决于最终图像计划使用的场合，是否容易被污损或遮挡：

- L:最大纠错率7%
- M:最大纠错率15%
- Q:最大纠错率25%
- H:最大纠错率30%

## 参考资料
微信公众号【My IO】：[https://mp.weixin.qq.com/s/RJoG46hVEANPvdGKF-PDkw](https://mp.weixin.qq.com/s/RJoG46hVEANPvdGKF-PDkw)
