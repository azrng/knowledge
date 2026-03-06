---
title: FastDFS
lang: zh-CN
date: 2022-04-24
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: fastdfs
slug: nedl9t
docsId: '66484325'
---

## 介绍
FastDFS是一个开源的轻量级[分布式文件系统](https://baike.baidu.com/item/%E5%88%86%E5%B8%83%E5%BC%8F%E6%96%87%E4%BB%B6%E7%B3%BB%E7%BB%9F/1250388)，它对文件进行管理，功能包括：文件存储、文件同步、文件访问（文件上传、文件下载）等，解决了大容量存储和[负载均衡](https://baike.baidu.com/item/%E8%B4%9F%E8%BD%BD%E5%9D%87%E8%A1%A1/932451)的问题。特别适合以文件为载体的在线服务，如相册网站、视频网站等等。

## 操作
配置项
```csharp
  "FastDFS": {
    "fastdfs_trackers": "192.168.130.71",
    "fastdfs_storages": "192.168.130.72",
    "fastdfs_port": "8080",
    "fastdfs_groupname": "group1",
    "fastdfs_maxsize": "10000000",
    "fastdfs_type": "gif,jpg,jpeg,png,bmp,zip,rar,layout",
    "fastdfs_type_file": "txt,xlsx,zip,rar"
  }
```
调用公共类
```csharp
FastDFSHelper fastDFSHelper = new FastDFSHelper();
for (int i = 0; i < files.Count; i++)
{
    var httpPostedFile = files[i];
    byte[] bytes = new byte[httpPostedFile.Length];
    using (BinaryReader reader = new BinaryReader(httpPostedFile.OpenReadStream(), Encoding.UTF8))
    {
        bytes = reader.ReadBytes(Convert.ToInt32(httpPostedFile.Length));
    }

    list.Add(await fastDFSHelper.UploadFile(bytes));
}
```
