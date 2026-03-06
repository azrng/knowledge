---
title: FTP请求
lang: zh-CN
date: 2024-10-19
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - ftp
---

## FluentFTP

仓库地址：[https://github.com/robinrodricks/FluentFTP](https://github.com/robinrodricks/FluentFTP)

FluentFTP是一个完全托管的FTP和FTPS客户端库，适用于.NET和.NET Standard，优化了速度。它提供广泛的 FTP 命令、文件上传/下载、SSL/TLS 连接、自动目录列表解析、文件哈希/校验和、文件权限/CHMOD、FTP 代理、FXP 传输、UTF-8 支持、异步/等待支持、Powershell 支持等。



引用nuget包

```xml
<PackageReference Include="FluentFTP" Version="51.1.0" />
```

### 连接

```csharp
var client = new AsyncFtpClient("192.168.0.5", "admin", "password", 1234, config: new FtpConfig
{
    EncryptionMode = FtpEncryptionMode.Auto,
    DataConnectionType = FtpDataConnectionType.PORT //主动ftp连接方式
});
await client.AutoConnect();

// 进行操作

await client.Disconnect();
```

### 下载文件

```csharp
var client = new AsyncFtpClient("192.168.0.5", "admin", "password", 1234, config: new FtpConfig
{
    EncryptionMode = FtpEncryptionMode.Auto,
    DataConnectionType = FtpDataConnectionType.PORT //主动ftp连接方式
});
await client.AutoConnect();

// 下载文件到指定地址
await client.DownloadFile(@"D:\temp\aa.pdf", "/archive/20180420/xxxx.pdf");

await client.Disconnect();
```



下载获取Bytes

```csharp
var remotePath = "远程路径";
var bytes = await client.DownloadBytes(remotePath, CancellationToken.None);
```



下载为文件流

```csharp
var remotePath = "远程路径";
var ms = new MemoryStream();
var flag = await client.DownloadStream(ms, remotePath);
if (flag)
{
    // 下载失败
    return;
}
```

