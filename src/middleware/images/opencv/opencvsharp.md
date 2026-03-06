---
title: OpenCvSharp
lang: zh-CN
date: 2023-08-05
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: opencvsharp
slug: bxrkytafd2y5m6mq
docsId: '135370517'
---

## 概述
OpenCvSharp是一个基于OpenCV（开源计算机视觉库）的C#封装库，提供了丰富的图像处理和计算机视觉功能。它包括图像加载、处理、特征提取、目标检测、图像分割等功能，适用于图像处理、计算机视觉和机器学习等应用领域。

文档：[http://github.com/shimat/opencvsharp](http://github.com/shimat/opencvsharp)
开源，非商业使用免费

## 功能概述
图像加载和保存：读取和保存各种图像格式。
图像处理：包括滤波、边缘检测、色彩转换等图像处理操作。
特征提取：提取图像的特征点、轮廓等。
目标检测：提供多种目标检测算法，如人脸检测、目标跟踪等。
图像分割：实现图像分割和对象提取。
OpenCvSharp是在C#中使用OpenCV功能的强大工具，可以方便地开发图像处理和计算机视觉应用。它提供了易于使用的API和示例代码，使开发者能够快速集成和使用OpenCV的功能。

## 操作

### 直方图算法比较图片相似度

```csharp
/// <summary>
/// 直方图相关性 
/// 结果越接近1 则越相似
/// 图片相似度识别（精度不高，速度较快，可用于以图搜图）
/// </summary>
/// <param name="imgFile1"></param>
/// <param name="imgFile2"></param>
public double Compare_Hist(string imgFile1, string imgFile2)
{
    var matA = Cv2.ImRead(imgFile1);
    var matB = Cv2.ImRead(imgFile2);

    // 拆分通道
    Cv2.Split(matA, out Mat[] matA_S);
    Cv2.Split(matB, out Mat[] matB_S);

    //直方图的像素范围   
    Rangef[] histRange = { new Rangef(0, 256) };

    //直方图数组大小
    int[] histSize = { 256 };

    //直方图输出数组
    Mat hist_A = new Mat();
    Mat hist_B = new Mat();

    bool uniform = true, accumulate = false;
    Cv2.CalcHist(matA_S, new int[] { 0, 1, 2 }, null, hist_A, 1, histSize, histRange, uniform, accumulate);
    Cv2.CalcHist(matB_S, new int[] { 0, 1, 2 }, null, hist_B, 1, histSize, histRange, uniform, accumulate);

    //归一化，排除图像分辨率不一致的影响
    Cv2.Normalize(hist_A, hist_A, 0, 1, NormTypes.MinMax, -1, null);
    Cv2.Normalize(hist_B, hist_B, 0, 1, NormTypes.MinMax, -1, null);

    //相关性比较
    var res = Cv2.CompareHist(hist_A, hist_B, HistCompMethods.Correl);
    return res;
}
```

## 资料

C#结合OpenCVSharp4图片相似度识别
[https://www.cnblogs.com/ycit/p/17688625.html](https://www.cnblogs.com/ycit/p/17688625.html)
需求背景：需要计算两个图片的相似度，然后将相似的图片进行归纳。
