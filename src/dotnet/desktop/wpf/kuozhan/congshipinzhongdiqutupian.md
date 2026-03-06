---
title: 从视频中提取图片
lang: zh-CN
date: 2023-07-09
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: congshipinzhongdiqutupian
slug: dydnt789ix5qtfdl
docsId: '132676289'
---
c#提供了System.Windows.Media.Imaging命名空间中的类，可以很方便地从视频文件中提取图片，以下是一个示例代码：
```csharp
using System;
using System.Windows;
using System.Windows.Media.Imaging;


namespace ExtractImageFromVideo
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }


        private void btnExtract_Click(object sender, RoutedEventArgs e)
        {
            // 打开视频文件
            Microsoft.Win32.OpenFileDialog dlg = new Microsoft.Win32.OpenFileDialog();
            dlg.DefaultExt = ".mp4";
            dlg.Filter = "视频文件 (*.mp4)|*.mp4|所有文件 (*.*)|*.*";


            Nullable<bool> result = dlg.ShowDialog();


            if (result == true)
            {
                // 打开视频文件并获取第1帧
                string filename = dlg.FileName;
                VideoFrameExtractor extractor = new VideoFrameExtractor(filename);
                BitmapSource frame = extractor.GetFrame(0);


                // 将帧保存为png文件
                PngBitmapEncoder encoder = new PngBitmapEncoder();
                encoder.Frames.Add(BitmapFrame.Create(frame));
                using (System.IO.FileStream fs = new System.IO.FileStream("frame.png", System.IO.FileMode.Create))
                {
                    encoder.Save(fs);
                }


                MessageBox.Show("帧已保存");
            }
        }
    }


    public class VideoFrameExtractor : IDisposable
    {
        private Microsoft.DirectX.AudioVideoPlayback.Video video;
        private Microsoft.DirectX.AudioVideoPlayback.Audio audio;


        public VideoFrameExtractor(string filename)
        {
            // 打开视频文件并获取视频和音频对象
            video = new Microsoft.DirectX.AudioVideoPlayback.Video(filename);
            audio = new Microsoft.DirectX.AudioVideoPlayback.Audio(filename);
        }


        public BitmapSource GetFrame(double seconds)
        {
            // 将视频定位到指定时间
            video.CurrentPosition = seconds;


            // 获取当前帧的图像
            System.Drawing.Bitmap bitmap = video.CurrentFrame.Copy();


            // 将Bitmap对象转换为BitmapSource对象
            BitmapSource source = System.Windows.Interop.Imaging.CreateBitmapSourceFromHBitmap(
                bitmap.GetHbitmap(),
                IntPtr.Zero,
                Int32Rect.Empty,
                BitmapSizeOptions.FromEmptyOptions());


            return source;
        }


        public void Dispose()
        {
            // 释放视频和音频对象
            video.Dispose();
            audio.Dispose();
        }
    }
}
```
在上面的代码中，我们使用Microsoft.DirectX.AudioVideoPlayback命名空间中的Video和Audio类打开视频文件，并在VideoFrameExtractor类中实现了GetFrame方法，用于获取指定时间的视频帧。然后，我们将获取到的Bitmap对象转换为BitmapSource对象，并保存为png文件。

需要注意的是，使用Video和Audio类需要将Microsoft.DirectX.Direct3D.dll、Microsoft.DirectX.Direct3DX.dll和Microsoft.DirectX.dll添加到项目中，并添加对Microsoft.DirectX和Microsoft.DirectX.AudioVideoPlayback命名空间的引用。
此外，Video和Audio类只能播放支持的视频和音频格式，因此如果视频格式不受支持，则需要使用其他的视频提取库。

## 资料
[https://mp.weixin.qq.com/s/wf9sjCp0e9kNrNQ3gfitfQ](https://mp.weixin.qq.com/s/wf9sjCp0e9kNrNQ3gfitfQ)
