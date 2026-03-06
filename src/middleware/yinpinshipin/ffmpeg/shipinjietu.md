---
title: 视频截图
lang: zh-CN
date: 2023-06-18
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: shipinjietu
slug: zegqvp
docsId: '65279216'
---

## 目的
一般在界面显示的时候，是需要对视频有个预览的效果，就是显示某一帧视频的画面。

## 参数
主要参数
-i——设置输入档名。
-f——设置输出格式。
-y——若输出文件已存在时则覆盖文件。
-fs——超过指定的文件大小时则结束转换。
-t——指定输出文件的持续时间，以秒为单位。
-ss——从指定时间开始转换，以秒为单位。
-t从-ss时间开始转换（如-ss 00:00:01.00 -t 00:00:10.00即从00:00:01.00开始到00:00:11.00）。
-title——设置标题。
-timestamp——设置时间戳。
-vsync——增减Frame使影音同步。
-c——指定输出文件的编码。
-metadata——更改输出文件的元数据。
-help——查看帮助信息。

```csharp
-f gdigrab -framerate 30 -offset_x 0 -offset_y 0 -video_size 1920x1080 -i desktop -c:v libx264 -preset ultrafast -crf 0 " + DateTime.Now.ToString("yyyyMMddHHmmss") + "_DesktopRecord.mp4
```

- -f gdigrab: 设定视频输入来源为 Windows 桌面画面捕获；
- -framerate 30: 设置帧率为 30fps；
- -offset_x 0 -offset_y 0: 设置捕获起始坐标为 (0, 0)；
- -video_size 1920x1080: 设置视频分辨率为 1920x1080；
- -i desktop: 指示从桌面捕获视频流；
- -c:v libx264: 使用 libx264 编码器进行视频压缩；
- -preset ultrafast: 设定视频压缩速度为最快；
- -crf 0: 设置视频压缩质量无限制（CRF 为 0 表示最高质量）；
- _DesktopRecord.mp4": 指定视频输出文件名为 yyyyMMddHHmmss_DesktopRecord.mp4


## 实现
下载 ffmpeg http://ffmpeg.org/ ，解压后在 bin 目录下找到 ffmpeg.exe 
![image.png](/common/1642603564497-0c53cf38-bd89-48b0-ad55-c80201539289.png)
命令方式
```csharp
-i 视频地址 -ss 第几帧 -f image2 图片存放地址
```
用cmd试一下，首先切换到ffmpeg.exe所在目录，输入命令，回车
```csharp
using (System.Diagnostics.Process process = new System.Diagnostics.Process())
{
    process.StartInfo.FileName = @"E:\ffmpeg.exe";
    process.StartInfo.Arguments = @"-i e:\111.mp4 -ss 1000 -f image2 e:\1.jpg";
    process.Start();
}
```

## 资料
[https://mp.weixin.qq.com/s/oILdtCXN-fOkYm7i3vDB0w](https://mp.weixin.qq.com/s/oILdtCXN-fOkYm7i3vDB0w) | 巧用ffmpeg从视频中截图
