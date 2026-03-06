---
title: 文件
lang: zh-CN
date: 2023-10-05
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: wenjian
slug: pcb54b
docsId: '73701048'
---

## 路径
获取程序运行目录，可以通过引用下面的nuget包
```csharp
<PackageReference Include="Microsoft.DotNet.PlatformAbstractions" Version="3.1.6" />
```
然后获取
```csharp
var basePath = Microsoft.DotNet.PlatformAbstractions.ApplicationEnvironment.ApplicationBasePath;//获取项目路径
```
或者使用
```csharp
var curr = Directory.GetCurrentDirectory();
```

## 文件上传

### uploadstream
一个基于 .NET 平台的开源项目，提供了一个简单易用的 API，可以在 Web 应用程序中快速集成文件上传功能。
优化多部分流式文件上传性能：减少25%的CPU使用量、50%内存。
仓库地址：[https://github.com/ma1f/uploadstream](https://github.com/ma1f/uploadstream)

## 文件下载

### Downloader

直接用了第三方库 Downloader，这个库看起来很猛，功能很多，我就不翻译了，详情见项目主页项目地址: [https://github.com/bezzad/Downloader](https://github.com/bezzad/Downloader)



示例

```c#
public static IDownloadService Downloader { get; }

public static DownloadConfiguration DownloadConf => new DownloadConfiguration {
    BufferBlockSize = 10240, // 通常，主机最大支持8000字节，默认值为8000。
    ChunkCount = 8, // 要下载的文件分片数量，默认值为1
    // MaximumBytesPerSecond = 1024 * 50, // 下载速度限制，默认值为零或无限制
    MaxTryAgainOnFailover = 5, // 失败的最大次数
    ParallelDownload = true, // 下载文件是否为并行的。默认值为false
    Timeout = 1000, // 每个 stream reader  的超时（毫秒），默认值是1000
    RequestConfiguration = {
        Accept = "*/*",
        AutomaticDecompression = DecompressionMethods.GZip | DecompressionMethods.Deflate,
        CookieContainer = new CookieContainer(), // Add your cookies
        Headers = new WebHeaderCollection(), // Add your custom headers
        KeepAlive = true,
        ProtocolVersion = HttpVersion.Version11, // Default value is HTTP 1.1
        UseDefaultCredentials = false,
        UserAgent = UserAgent
    }
};

static HttpHelper() {
    // ...
    Downloader = new DownloadService(DownloadConf);
}
```

使用方法

```
await HttpHelper.Downloader.DownloadFileTaskAsync(url, filepath);
```

还可以监听下载进度

```
HttpHelper.Downloader.DownloadStarted += DownloadStarted;
HttpHelper.Downloader.DownloadFileCompleted += DownloadFileCompleted;
HttpHelper.Downloader.DownloadProgressChanged += DownloadProgressChanged;
HttpHelper.Downloader.ChunkDownloadProgressChanged += ChunkDownloadProgressChanged;
```

这个库提供了四个事件，分别是：

- 下载开始
- 下载完成
- 下载进度变化
- 分块下载进度变化

## 目录

### ZetaLongPaths

### ZetaShortPaths

## Ude.NetStandard
探测文件流的编码组件。
```csharp
using var stream = file.CreateReadStream();
var cdet = new CharsetDetector();
cdet.Feed(stream);
cdet.DataEnd();
var charset = cdet.Charset;//  UTF-8
```

## 压缩与解压缩

### System.IO.Compression
不需要安装第三方的组件包，微软官方的实现，推荐使用
```csharp
//压缩
System.IO.Compression.ZipFile.CreateFromDirectory(@"C:\Users\Pride\Pictures\test\123", @"C:\Users\Pride\Pictures\test\123.zip"); 
//解压
System.IO.Compression.ZipFile.ExtractToDirectory(@"C:\Users\Pride\Pictures\test\123.zip", @"C:\Users\Pride\Pictures\test\1234"); 
```
将指定目录压缩为Zip文件
```csharp
/// <summary>
/// 将指定目录压缩为Zip文件
/// </summary>
/// <param name="folderPath">文件夹地址 D:/1/ </param>
/// <param name="zipPath">zip地址 D:/1.zip </param>
public static void CompressDirectoryZip(string folderPath, string zipPath)
{
    DirectoryInfo directoryInfo = new(zipPath);
 
    if (directoryInfo.Parent != null)
    {
        directoryInfo = directoryInfo.Parent;
    }
 
    if (!directoryInfo.Exists)
    {
        directoryInfo.Create();
    }
 
    ZipFile.CreateFromDirectory(folderPath, zipPath, CompressionLevel.Optimal, false);
}
```
将指定文件压缩为Zip文件
```csharp
/// <summary>
/// 将指定文件压缩为Zip文件
/// </summary>
/// <param name="filePath">文件地址 D:/1.txt </param>
/// <param name="zipPath">zip地址 D:/1.zip </param>
public static void CompressFileZip(string filePath, string zipPath)
{
 
    FileInfo fileInfo = new FileInfo(filePath);
    string dirPath = fileInfo.DirectoryName?.Replace("\\", "/") + "/";
    string tempPath = dirPath + Guid.NewGuid() + "_temp/";
    if (!Directory.Exists(tempPath))
    {
        Directory.CreateDirectory(tempPath);
    }
    fileInfo.CopyTo(tempPath + fileInfo.Name);
    CompressDirectoryZip(tempPath, zipPath);
    DirectoryInfo directory = new(path);
    if (directory.Exists)
    {
        //将文件夹属性设置为普通,如：只读文件夹设置为普通
        directory.Attributes = FileAttributes.Normal;
 
        directory.Delete(true);
    }
}
```
解压Zip文件到指定目录(压缩单个文件的逻辑其实就是先将我们要压缩的文件复制到一个临时目录，然后对临时目录执行了压缩动作，压缩完成之后又删除了临时目录)
```csharp
/// <summary>
/// 解压Zip文件到指定目录
/// </summary>
/// <param name="zipPath">zip地址 D:/1.zip</param>
/// <param name="folderPath">文件夹地址 D:/1/</param>
public static void DecompressZip(string zipPath, string folderPath)
{
    DirectoryInfo directoryInfo = new(folderPath);
 
    if (!directoryInfo.Exists)
    {
        directoryInfo.Create();
    }
 
    ZipFile.ExtractToDirectory(zipPath, folderPath);
}
```

### SharpCompress
纯C#压缩库，用于.NET Standard 2.0、2.1、.NET Core 3.1和.NET 5.0，支持格式有zip/tar/bzip2/gzip/lzip，功能实现有解压缩rar, 解压缩7zip, 解压缩zip, 解压缩tar解压缩bzip2, 解压缩gzip, 解压缩lzip。
仓库地址：[https://github.com/adamhathcock/sharpcompress](https://github.com/adamhathcock/sharpcompress)
缺点：创建压缩文件的时候没法设置密码

> SharpCompress版本不同，设置ArchiveEncoding的方式也不同，默认设置了UTF8防止解压乱码。
通过设置ArchiveType切换生成不同格式压缩文件

```csharp
/// <summary>
/// 压缩文件/文件夹
/// </summary>
/// <param name="filePath">需要压缩的文件/文件夹路径</param>
/// <param name="zipPath">压缩文件路径（zip后缀）</param>
/// <param name="filterExtenList">需要过滤的文件后缀名</param>
public static void CompressionFile(string filePath, string zipPath, List<string> filterExtenList = null)
{
    try
    {
        using (var zip = File.Create(zipPath))
        {
            var option = new WriterOptions(CompressionType.Deflate)
            {
                ArchiveEncoding = new SharpCompress.Common.ArchiveEncoding()
                {
                    Default = Encoding.UTF8
                }
            };
            using (var zipWriter = WriterFactory.Open(zip, ArchiveType.Zip, option))
            {
                if (Directory.Exists(filePath))
                {
                    //添加文件夹
                    zipWriter.WriteAll(filePath, "*",
                        (path) => filterExtenList == null ? true : !filterExtenList.Any(d => Path.GetExtension(path).Contains(d, StringComparison.OrdinalIgnoreCase)), SearchOption.AllDirectories);
                }
                else if (File.Exists(filePath))
                {
                    zipWriter.Write(Path.GetFileName(filePath), filePath);
                }
            }
        }
    }
    catch (Exception ex)
    {
        throw ex;
    }
}

/// <summary>
/// 解压文件
/// </summary>
/// <param name="zipPath">压缩文件路径</param>
/// <param name="dirPath">解压到文件夹路径</param>
/// <param name="password">密码</param>
public static void DeCompressionFile(string zipPath, string dirPath, string password = "")
{
    if (!File.Exists(zipPath))
    {
        throw new ArgumentNullException("zipPath压缩文件不存在");
    }
    Directory.CreateDirectory(dirPath);
    try
    {
        using (Stream stream = File.OpenRead(zipPath))
        {
            var option = new ReaderOptions()
            {
                ArchiveEncoding = new SharpCompress.Common.ArchiveEncoding()
                {
                    Default = Encoding.UTF8
                }
            };
            if (!string.IsNullOrWhiteSpace(password))
            {
                option.Password = password;
            }

            var reader = ReaderFactory.Open(stream, option);
            while (reader.MoveToNextEntry())
            {
                if (reader.Entry.IsDirectory)
                {
                    Directory.CreateDirectory(Path.Combine(dirPath, reader.Entry.Key));
                }
                else
                {
                     //创建父级目录，防止Entry文件,解压时由于目录不存在报异常
                     var file = Path.Combine(dirPath, reader.Entry.Key);
                     Directory.CreateDirectory(Path.GetDirectoryName(file));
                     reader.WriteEntryToFile(file);
                }
            }
        }
    }
    catch (Exception ex)
    {
        throw ex;
    }
}
```
资料：[https://www.cnblogs.com/cplemom/p/13599181.html](https://www.cnblogs.com/cplemom/p/13599181.html)

### SharpZipLib
文档：[http://www.icsharpcode.net/opensource/sharpziplib/](http://www.icsharpcode.net/opensource/sharpziplib/)

### DotNetZip
DotNetZip是一个开源的免费类库，主要提供了快速操作zip文件的工具集，VB、C#任何.Net语言都可以通过它创建、解压缩zip文件。我使用该类库最主要的目的还是因为它可以创建带密码保护的压缩文件。
文档：[http://dotnetzip.codeplex.com/](http://dotnetzip.codeplex.com/)

压缩文件
```csharp
using (ZipFile zip = new ZipFile())
{
  zip.AddFile("c:\\photos\\personal\\7440-N49th.png");
  zip.AddFile("c:\\Desktop\\2005_Annual_Report.pdf");
  zip.AddFile("ReadMe.txt");

  zip.Save("Archive.zip");
}

/// <summary>
/// 压缩文件/文件夹
/// </summary>
/// <param name="filePath">需要压缩的文件/文件夹路径</param>
/// <param name="zipPath">压缩文件路径（zip后缀）</param>
/// <param name="password">密码</param>
/// <param name="filterExtenList">需要过滤的文件后缀名</param>
public static void CompressionFile(string filePath, string zipPath, string password = "", List<string> filterExtenList = null)
{
    try
    {
        using (ZipFile zip = new ZipFile(Encoding.UTF8))
        {
            if (!string.IsNullOrWhiteSpace(password))
            {
                zip.Password = password;
            }
            if (Directory.Exists(filePath))
            {
                if (filterExtenList == null)
                    zip.AddDirectory(filePath);
                else
                    AddDirectory(zip, filePath, filePath, filterExtenList);
            }
            else if (File.Exists(filePath))
            {
                zip.AddFile(filePath,"");
            }
            zip.Save(zipPath);
        }
    }
    catch (Exception ex)
    {
        throw ex;
    }
}

/// <summary>
/// 添加文件夹
/// </summary>
/// <param name="zip">ZipFile对象</param>
/// <param name="dirPath">需要压缩的文件夹路径</param>
/// <param name="rootPath">根目录路径</param>
/// <param name="filterExtenList">需要过滤的文件后缀名</param>
public static void AddDirectory(ZipFile zip, string dirPath, string rootPath, List<string> filterExtenList)
{
    var files = Directory.GetFiles(dirPath);
    for (int i = 0; i < files.Length; i++)
    {
        //如果Contains不支持第二个参数，就用.ToLower()
        if (filterExtenList == null || (filterExtenList != null && !filterExtenList.Any(d => Path.GetExtension(files[i]).Contains(d, StringComparison.OrdinalIgnoreCase))))
        {
            //获取相对路径作为zip文件中目录路径
            zip.AddFile(files[i], Path.GetRelativePath(rootPath, dirPath));
            
	    //如果没有Path.GetRelativePath方法，可以用下面代码替换
            //string relativePath = Path.GetFullPath(dirPath).Replace(Path.GetFullPath(rootPath), "");
            //zip.AddFile(files[i], relativePath);
        }
    }
    var dirs = Directory.GetDirectories(dirPath);
    for (int i = 0; i < dirs.Length; i++)
    {
        AddDirectory(zip, dirs[i], rootPath, filterExtenList);
    }
}

```

更新文件，无需解压
```csharp
using (ZipFile zip = ZipFile.Read("ExistingArchive.zip"))
{
  // 1. remove an entry, given the name
  zip.RemoveEntry("README.txt");

  // 2. Update an existing entry, with content from the filesystem
  zip.UpdateItem("Portfolio.doc");

  // 3. modify the filename of an existing entry
  // (rename it and move it to a sub directory)
  ZipEntry e = zip["Table1.jpg"];
  e.FileName ="images/Figure1.jpg";

  // 4. insert or modify the comment on the zip archive
  zip.Comment ="This zip archive was updated" + System.DateTime.ToString("G");

  // 5. finally, save the modified archive
  zip.Save();
}
```

提取文件
```csharp
using (ZipFile zip = ZipFile.Read("ExistingZipFile.zip"))
{
  foreach (ZipEntry e in zip)
  {
    e.Extract(TargetDirectory, true);  // true => overwrite existing files
  }
}
```

### YUICompressor.NET
使用该库可以方便地压缩CSS、JavaScript和HTML等内容，代码示例如下：
```bash
string filename = AppDomain.CurrentDomain.BaseDirectory + "SliderBar5.0.js";
string content = File.ReadAllText(filename);
//执行js压缩
JavaScriptCompressor jsCom = new JavaScriptCompressor();
content = jsCom.Compress(content);
Console.WriteLine(content);

string filename = AppDomain.CurrentDomain.BaseDirectory + "SliderBar5.0.css";
string content = File.ReadAllText(filename);
//执行css压缩
CssCompressor cssCom = new CssCompressor();
content = cssCom.Compress(content);
Console.WriteLine(content);
```

## Masuit.Tools.Core

### 真实文件类型探测
```csharp
var filePath = "d:\\id_cache.db";
//var detector = new FileInfo(filePath).DetectFiletype();
var detector = File.OpenRead(filePath).DetectFiletype();

Console.WriteLine("Precondition:" + detector.Precondition);//基础文件类型
Console.WriteLine("Extension:" + detector.Extension);//真实扩展名
Console.WriteLine("MimeType:" + detector.MimeType);//mineType
Console.WriteLine("FormatCategories:" + detector.FormatCategories);//格式类别
```

## 进度条

### shellprogressbar

项目地址: [https://github.com/Mpdreamz/shellprogressbar](https://github.com/Mpdreamz/shellprogressbar)

#### Tick模式

这个进度条有两种模式，一种是它自己的 `Tick` 方法，先定义总任务数量，执行一次表示完成一个任务，比如这个：

```csharp
using var bar = new ProgressBar(10, "正在下载所有图片", BarOptions);
```

上面代码定义了10个任务，每执行一次 `bar.Tick()` 就表示完成一次任务，执行10次后就整个完成~

#### `IProgress<T>` 模式

这个  `IProgress<T>` 是C#标准库的类型，用来处理进度条的。

`ProgressBar` 对象可以使用 `AsProgress<T>` 方法转换称 `IProgress<T>` 对象，然后调用 `IProgress<T>` 的 `Report` 方法，报告进度。

这个就很适合下载进度这种非线性的任务，每次更新时，完成的进度都不一样，Downloader的下载进度更新事件，用的是百分比，所以用这个 `IProgress<T>` 模式就很合适。
