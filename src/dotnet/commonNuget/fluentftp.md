---
title: FluentFTP
lang: zh-CN
date: 2023-09-12
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: fluentftp
slug: uocoh8
docsId: '29435934'
---

## 说明
项目中经常涉及到将文件批量上传到其它空间或服务器，这个时候我们有可能需要用到FTP协议进行传输，所以这里我推荐使用FluentFTP，一款很好用的FTP传输框架。
github地址：[https://github.com/robinrodricks/FluentFTP](https://github.com/robinrodricks/FluentFTP)

## 安装
```csharp
<PackageReference Include="FluentFTP" Version="35.2.3" />
```

## 开始
首先第一步，new一个Client：
```csharp
/*
第一个参数是FTP地址，注意要加协议名
第二个参数是端口，默认21
第三个参数是FTP用户名
第四个参数是FTP密码
正常情况下配置三个属性即可，大家按需选择:
EncryptionMode是指定加密方式，这里我选择None不加密，
DataConnectionType是连接方式，一般都是选PASV被动模式或PORT主动模式，根据FTPServer情况修改
Encoding是指定编码
*/
var ftpClient = new FtpClient($"ftp://{host}", port, userName, passWord)
{
    EncryptionMode = FtpEncryptionMode.None,
    DataConnectionType = FtpDataConnectionType.PASV,
    Encoding = Encoding.UTF8
};
```
接下来第二步，登录FTP：
```csharp
//IsConnected是判断client是否与远程服务建立了连接
if (!ftpClient.IsConnected)
{
    //发起连接登录
    await ftpClient.ConnectAsync();
    //启用UTF8传输
    var result = ftpClient.Execute("OPTS UTF8 ON");
    if (!result.Code.Equals("200") && !result.Code.Equals("202"))
        ftpClient.Encoding = Encoding.GetEncoding("ISO-8859-1");
}
```
如果上传的文件名称是中文，上传后文件名会变成乱码，原因是因为有一些FTPServer默认是不开启utf8编码传输的，甚至不支持utf8编码传输，这个时候需要我们手动开启一下
```csharp
ftpClient.Execute("OPTS UTF8 ON");
```
这个时候FTPServer会返回一个状态码，200表示开启成功；202是always enable，表示FTPServer会一直处于开启UTF-8编码的状态，不需要手动开启。
但除此之外，还有刚才提到的，FTPServer本身不支持UTF8编码的传输，这个时候我们需要将之前的Encoding设置为ISO-8859-1即可：
```csharp
ftpClient.Encoding = Encoding.GetEncoding("ISO-8859-1");
```
第三步，上传文件：
```csharp
/// <summary>
/// 上传单个文件
/// </summary>
/// <param name="sourcePath">文件源路径</param>
/// <param name="destPath">上传到指定的ftp文件夹路径</param>
public async void UploadFile(string sourcePath, string destPath)
{
     if (!File.Exists(sourcePath))
         return;
     var fileInfo = new FileInfo(sourcePath);
     await ftpClient.UploadFileAsync(sourcePath, $"{destPath}/{fileInfo.Name}", createRemoteDir: true);
}
```

如果想批量上传文件，则使用ftpClient.UploadDirectoryAsync()，可以直接上传整个文件夹。

这里有个比较坑的地方是，如果FTPServer目录下的文件特别多（注意：不是你上传文件的数量），上传所需的时间会特别长。

在我查看了FTPServer日志后发现，在使用UploadDirectoryAsync()的时候，FluentFTP会先去获取所有文件和文件夹的列表，在获取完所有列表信息后，才开始上传操作，非常浪费时间。在尝试解决无果后，我去github上找了一下，作者的回复是：

Currently we support 2 modes, update and mirror. In any mode, the remote directory is fully listed, then compared, then the actually upload begins. This is done in order to skip files that are already uploaded. We can support a third mode, maybe like BlindTransfer which will not list the remote directory.

google翻译：目前，我们支持2种模式：更新和镜像。在任何模式下，远程目录都会完整列出，然后进行比较，然后开始实际的上载。这样做是为了跳过已经上传的文件。我们可以支持第三种模式，例如BlindTransfer，它不会列出远程目录。

但在目前最新版本33.0.3版本下，仍旧只支持Mirror和Update两种模式。

Issues：[https://github.com/robinrodricks/FluentFTP/issues/616](https://github.com/robinrodricks/FluentFTP/issues/616)

所以，如果需要批量上传，可以在单文件上传的基础上自己再做一层封装，至于其它的下载、删除、查看等功能，暂未发现其它的坑，环境.net core 3.1。

这里举几个常用的方法，其余的不在这里赘述，大家看文档和框架的注释就行：

```csharp
//下载文件
ftpClient.DownloadFileAsync();
//下载文件夹
ftpClient.DownloadDirectoryAsync();
//删除文件
ftpClient.DeleteFileAsync();
//删除文件夹
ftpClient.DeleteDirectoryAsync();
//判断文件是否存在
ftpClient.FileExistsAsync();
//判断文件夹是否存在
ftpClient.DirectoryExistsAsync();
//获取列表的详细信息
ftpClient.GetListingAsync();
```

最后，记住登出、释放资源：

```csharp
if (ftpClient.IsConnected)
{
    //关闭
    await ftpClient.DisconnectAsync();
    ftpClient.Dispose();
}
```

FluentFTP除了上述的坑以外，功能还是非常齐全、强大的，提供了各种各样的方法和配置.

## 资料
[https://mp.weixin.qq.com/s/RcDDPjYiZt6ak5DvVyj0Pg](https://mp.weixin.qq.com/s/RcDDPjYiZt6ak5DvVyj0Pg) | 快速高效的C#FTP文件传输库FluentFTP
