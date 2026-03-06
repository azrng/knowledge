---
title: FluentFTP
lang: zh-CN
date: 2023-10-15
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: fluentftp
slug: bqklao10x8wfv7u9
docsId: '135413119'
---

## 概述
FluentFTP 是一个适用于 .NET 和 .NET Standard 的 FTP 和 FTPS 客户端。
并且针对速度进行了优化，没有外部依赖， 完全用 C## 编写。

仓库地址：[https://github.com/robinrodricks/FluentFTP](https://github.com/robinrodricks/FluentFTP)

## 操作

### 基础操作
```csharp
// 通过用户名密码创建连接
var client = new AsyncFtpClient("123.123.123.123", "david", "pass123");

// 连接到服务器，并设置自动重连
await client.AutoConnect();

// 列出所有的文件
foreach (FtpListItem item in await client.GetListing("/htdocs")) {

    // 如果是文件类型
    if (item.Type == FtpObjectType.File) {

        // 获取文件大小
        long size = await client.GetFileSize(item.FullName);

        // 计算文件 hash
        FtpHash hash = await client.GetChecksum(item.FullName);
    }

    // 获取文件或文件夹的修改时间
    DateTime time = await client.GetModifiedTime(item.FullName);
}

// 上传一个文件
await client.UploadFile(@"C:\MyVideo.mp4", "/htdocs/MyVideo.mp4");

// 移动文件
await client.MoveFile("/htdocs/MyVideo.mp4", "/htdocs/MyVideo_2.mp4");

// 下载文件
await client.DownloadFile(@"C:\MyVideo_2.mp4", "/htdocs/MyVideo_2.mp4");
 
// 删除文件
await client.DeleteFile("/htdocs/MyVideo_2.mp4"); 

// 关闭连接，结束
await client.Disconnect();
```

## 资料
[https://mp.weixin.qq.com/s/ZwV-hgGlgFlkGY-Yy8oCLA](https://mp.weixin.qq.com/s/ZwV-hgGlgFlkGY-Yy8oCLA) | .NET 最好用的开源 FTP 客户端库
[https://mp.weixin.qq.com/s/mWc-uWktwXxuZ0COuJGxyg](https://mp.weixin.qq.com/s/mWc-uWktwXxuZ0COuJGxyg) | 基于C#的FTP开源库，让你快速完成FTP文件传输功能，提升开发效率！
