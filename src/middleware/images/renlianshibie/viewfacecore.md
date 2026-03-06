---
title: ViewFaceCore
lang: zh-CN
date: 2023-09-02
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: viewfacecore
slug: ss2sawmzxybp1zxl
docsId: '138135178'
---

## 概述
- 一个基于 SeetaFace6 的 .NET 人脸识别解决方案
- 本项目受到了 SeetaFaceEngine.Net 的启发
- 开源、免费、跨平台 (win/linux)

仓库地址：[https://github.com/ViewFaceCore/ViewFaceCore](https://github.com/ViewFaceCore/ViewFaceCore)

## 操作

### 获取人脸信息
```csharp
using SkiaSharp;
using System;
using ViewFaceCore.Core;
using ViewFaceCore.Model;

namespace ViewFaceCore.Demo.ConsoleApp
{
    internal class Program
    {
        private readonly static string imagePath = @"images/Jay_3.jpg";

        static void Main(string[] args)
        {
            using var bitmap = SKBitmap.Decode(imagePath);
            using FaceDetector faceDetector = new FaceDetector();
            FaceInfo[] infos = faceDetector.Detect(bitmap);
            Console.WriteLine($"识别到的人脸数量：{infos.Length} 个人脸信息：\n");
            Console.WriteLine($"No.\t人脸置信度\t位置信息");
            for (int i = 0; i < infos.Length; i++)
            {
                Console.WriteLine($"{i}\t{infos[i].Score:f8}\t{infos[i].Location}");
            }
            Console.ReadKey();
        }
    }
}
```

## 资料
[https://mp.weixin.qq.com/s/7qGcgDcIfuUNRFdauFi45Q](https://mp.weixin.qq.com/s/7qGcgDcIfuUNRFdauFi45Q) | C#开源跨平台使用简单的离线人脸识别库
