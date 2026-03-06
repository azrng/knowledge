---
title: Emgu.CV
lang: zh-CN
date: 2023-09-02
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: emgu_cv
slug: gx6sto6mynlxim9k
docsId: '135370550'
---

## 概述
Emgu.CV是一个基于OpenCV（开源计算机视觉库）的.NET封装库，开源使用，提供了丰富的图像处理和计算机视觉功能。
它提供了对OpenCV的高效访问和易于使用的接口，适用于图像处理、计算机视觉和机器学习等应用领域。
文档：[https://emgu.com/wiki/index.php/Main_Page](https://emgu.com/wiki/index.php/Main_Page)

## 功能概述
图像加载和保存：读取和保存各种图像格式。
图像处理：包括滤波、边缘检测、形态学操作等图像处理操作。
特征提取：提取图像的特征点、描述符等。
目标检测：提供多种目标检测算法，如人脸检测、目标跟踪等。
图像分割：实现图像分割和对象提取。

## 操作

### 识别二维码
引入OpenCV的两个包，Emgu.CV 和 Emgu.CV.runtime.windows
```csharp

public static string DecodeQRCodeByOpenCv(string imagePath)
        {
            using (Image<Bgr, byte> img = new Image<Bgr, byte>(imagePath))
            {
                using (QRCodeDetector qrdetector = new QRCodeDetector())
                {
                    string decodedInfo = "";
                    Mat points = new Mat();
                    if (qrdetector.Detect(img, points))
                    {
                        Mat straightQrCode = new Mat();
                        decodedInfo = qrdetector.Decode(img, points, straightQrCode);
                        straightQrCode.Dispose();
                    }
                    points.Dispose();
                    return decodedInfo;
                }
            }
        }
```
