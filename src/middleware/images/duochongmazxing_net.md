---
title: 多种码ZXing.Net
lang: zh-CN
date: 2023-09-02
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: duochongmazxing_net
slug: lfz3no
docsId: '68056728'
---

## 介绍
支持解码和生成图像中的条形码（如 QR 码、PDF 417、EAN、UPC、Aztec、Data Matrix、Codabar）的库。不支持跨平台。

## 操作
> 本文示例环境：vs2022、.Net6

引用组件
```csharp
<PackageReference Include="System.Drawing.Common" Version="6.0.0" />
<PackageReference Include="ZXing.Net" Version="0.16.6" />
```
> 如果依赖System.Drawing.Common，那么就只能在windows系统使用。


### 生成条形码
代码
```csharp
/// <summary>
/// 使用ZXing创建条形码
/// </summary>
/// <param name="barCode">条码</param>
/// <param name="height">高度</param>
/// <param name="width">宽度</param>
/// <returns>Bitmap图片</returns>
public static Bitmap GenerateBarCodeByZXing(string barCode, int height = 310, int width = 120)
{
    var encoding = new EncodingOptions()
    {
        GS1Format = true,
        Height = height,//设置一维码宽高
        Width = width,
        Margin = 0,//图片空白边距
        PureBarcode = false//在条码下显示条码，true则不显示
    };

    //生成条形码的图片
    var wr = new BarcodeWriter<Bitmap>()
    {
        //进行指定规格
        Options = encoding,
        Format = BarcodeFormat.EAN_13,// BarcodeFormat.CODE_128//
        Renderer = new ZXing.Rendering.BitmapRenderer()
    };

    Bitmap img = wr.Write(barCode);//生成一维码图片
    return img;
}
```
示例
```csharp
var aa = Test.GenerateBarCodeByZXing("123456123456");
aa.Save("d://1.png");
```

### 生成二维码
实现
```csharp
/// <summary>
/// 生成二维码
/// </summary>
/// <param name="text">内容</param>
/// <param name="width">宽度</param>
/// <param name="height">高度</param>
/// <returns></returns>
public static Bitmap GenerateQR(string text, int width, int height)
{
    var writer = new BarcodeWriter
    {
        Format = BarcodeFormat.QR_CODE,
        Options = new QrCodeEncodingOptions()
        {
            DisableECI = true,//设置内容编码
            CharacterSet = "UTF-8",  //设置二维码的宽度和高度
            Width = width,
            Height = height,
            Margin = 1//设置二维码的边距,单位不是固定像素
        }
    };
    Bitmap map = writer.Write(text);
    return map;
}
```
示例
```csharp
var aa = Test.GenerateQR("123456123456",300,300);
aa.Save("d://1.png");
```

### 识别二维码
```csharp

public class BitmapLuminanceSource : BaseLuminanceSource
    {
        public BitmapLuminanceSource(Bitmap bitmap) : base(bitmap.Width, bitmap.Height)
        {
            var lockData = bitmap.LockBits(new Rectangle(0, 0, Width, Height), System.Drawing.Imaging.ImageLockMode.ReadOnly, System.Drawing.Imaging.PixelFormat.Format32bppArgb);
            var stride = Math.Abs(lockData.Stride);
            var pixelCount = stride * Height;
            var pixels = new byte[pixelCount];
            System.Runtime.InteropServices.Marshal.Copy(lockData.Scan0, pixels, 0, pixelCount);
            bitmap.UnlockBits(lockData);

            for (int y = 0; y < Height; y++)
            {
                var offset = y * stride;
                for (int x = 0; x < Width; x++)
                {
                    var idx = offset + x * 4;
                    var luminance = (byte)(pixels[idx + 2] * 0.3 + pixels[idx + 1] * 0.59 + pixels[idx] * 0.11);
                    luminances[y * Width + x] = luminance;
                }
            }
        }

        protected override LuminanceSource CreateLuminanceSource(byte[] newLuminances, int width, int height)
        {
            throw new NotImplementedException();
        }
    }
```
再新建一个使用XZING.NET识别二维码的方法做测试：
```csharp

static string DecodeQRCodeByZXing(string imagePath)
        {

            var barcodeReader = new BarcodeReader<Bitmap>(bitmap => new BitmapLuminanceSource(bitmap));
            var result = barcodeReader.Decode(new Bitmap(imagePath));
            if (result != null)
                return result.Text;
            return "没得码.";
        }
```
