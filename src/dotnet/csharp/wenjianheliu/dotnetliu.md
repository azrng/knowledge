---
title: dotNet流
lang: zh-CN
date: 2023-10-22
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 无
filename: dotnetliu
slug: ex7zcm
docsId: '63922433'
---

## 概述
- .Net流的架构主要包含三个概念：后台存储、装饰器以及流适配器。
   - 后台存储流和装饰器流仅支持字节处理，适配器提供了处理更高层次的数据，例如文本或者xml
   - 适配器和装饰器都对流进行了封装，但是装饰器是一个流，而适配器本身不是一个流。
- 流和数组不同，流并不会直接就将数据存储到内存中，流会以每个字节或者每次一块数据的方式按照序列处理数据，所以无论后台存储大小如何，流都只会占用很少的内存。
- 流不是线程安全的，可以使用静态的SyncChronized方法，该方法接受任何类型的流，并返回一个线程安全的包装器，这个包装器会使用排他锁保证每一次读、写或者查找操作只能有一个线程执行。

### 后台存储流

- 与特定的后台存储类型连接的流，例如FileStream或者NetworkStream。
- 要使用后台存储，就必须公开相应的接口
- stream就是.Net中实现该功能的标准类，支持标准的读、写以及定位方法
- 负责处理原始数据

### 装饰器流

- 会使用其他的流，并以某种方式转换数据，例如DeflateStream后者CryptoStream。
- 可以透明地进行二进制数据的转换，例如加密

### 适配器流

- 一般来说，适配器会完全隐藏那些直接处理字节的方法。
- 提供处理更高类型(例如文本和xml)的方法

## 使用流
抽象的Stream是所有流的基类吗，它的方法和属性定义了三种基本的操作：读、写、查找以及一些管理任务，例如关闭、刷新、配置超时时间。
![image.png](/common/1641655715674-80b36d5c-da5e-4fb1-af60-f82438eea758.png)
演示基本流的读写查询操作
```csharp
//创建一个文件在当前目录
using (Stream s = new FileStream("test.txt", FileMode.Create))
{
    //是否可以读取
    Console.WriteLine(s.CanRead);//true
    //是否可以写
    Console.WriteLine(s.CanWrite);//true
    //是否可以查找
    Console.WriteLine(s.CanSeek);//true

    s.WriteByte(101);
    s.WriteByte(102);
    byte[] block = { 1, 2, 3, 4, 5, 6, };
    s.Write(block, 0, block.Length);

    Console.WriteLine(s.Length);// 8
    Console.WriteLine(s.Position);//8
    //设置读取流的位置
    s.Position = 0;

    Console.WriteLine(s.ReadByte());//101
    Console.WriteLine(s.ReadByte());//102


    Console.WriteLine(s.Read(block, 0, block.Length));// 6

    Console.WriteLine(s.Read(block, 0, block.Length));// 0

}
```

### 读取和写入
Read方法可以将流中的一个数据库读取到数组中，并返回接受的字节数，这个字节数小于或者等于count参数，那么表示读取完了。
示例：读取长度为1000字节的流
```csharp
byte[] data = new byte[1000];
int bytesRead = 0;
int chunkSize = 1;
using var s = new FileStream("xxx.text", FileMode.Open);//模拟流
while (bytesRead < data.Length && chunkSize > 0)
{
    bytesRead += chunkSize = s.Read(data, bytesRead, data.Length - bytesRead);
}

//BinaryReader提供了实现相同功能的简单方法
using var s = new FileStream("xxx.text", FileMode.Open);//模拟流
byte[] bytes =new BinaryReader(s).ReadBytes(100);
```
ReadByte方法更简单，每次只读取一个字节，并在流结束的是返回-1;
> 注意：Read和Write方法中的offset参数指的是buffer数组中开始读取的索引位置，而不是流中的位置。


### 查找

- 如果CanSeek返回true，那么就表示当前流是可以查找的。
   - 查找的流可以查找、修改长度、所以设置读写的位置

### 关闭和刷新

- 流在使用结束后必须销毁，释放底层资源，例如文件和套接字句柄。
   - 可以在using语句快中创建流的实例来确保结束后销毁流对象。
      - Dispose和Close方法功能是一样的
      - 重复销毁或者关闭流对象不会产生任何错误
```csharp
s.Flush();
s.Close();
```

### 超时

- 如果流的CanTimeout属性返回true，那么就可以为该流对象设置读写超时时间。
   - 网络流支持超时设置，文件流和内存流不支持

### FileStream

#### 创建FileStream

- 实例化FileStream的最简单的方法就是使用File类型中的静态方法
```csharp
FileStream fs1 = File.OpenRead("11.txt");//只读
FileStream fs2 = File.OpenWrite("22.txt");//只写
FileStream fs3 = File.Create("3.txt");//支持读/写
```
还可以直接实例化一个FileStream
```csharp
var fs = new FileStream("aa.txt", FileMode.Open);
```

- 只读的流：read、append、
- 读写的流：open、openOrCreate

![image.png](/common/1641655765221-ea8ec00b-743d-412d-a5b1-e5134422bcba.png)
File类的快速方法
```csharp
File.ReadAllText("1.txt");//返回字符串
File.ReadAllLines("2.txt");//返回一个字符串数组
File.ReadAllBytes("3.txt");///返回一个字节数组
File.AppendAllText("4.txt","5555");//向日志文件追加内容
```

#### 指定文件名
文件名可以是绝对路径也可以是相对路径。
> AppDomain.CurrentDomain.BaseDirectory属性会返回应用程序的基础目录，正常情况下他就是可执行文件的所在文件夹。


### MemoryStream

- 使用数组作为后台存储，必须一次性读取后留在内存中
- 使用场景
   - 随机访问一个不可查找的流(如果原始流的大小可以承受)
```csharp
var sourceStream = new FileStream("111.txt", FileMode.Open);
var ms = new MemoryStream();
sourceStream.CopyTo(ms);
```

## 流适配器

- Stream只支持字节处理，但是读取一些更高级类型，就需要适配器支持。
   - 文本适配器：StreamReader、StreamWriter、TestReader、TextWriter、StringReader、StringWriter
```csharp
// StreamReader
StreamReader streamReader = new StreamReader(formFile.OpenReadStream());
string content = streamReader.ReadToEnd();

//StringWriter
var text = new StringWriter();
document.ToHtml(text);
Console.WriteLine(text.ToString());
```

   - 二进制适配器：BinaryReader、BinaryWriter
   - XML适配器：XmlReader、XmlWriter

## 压缩流

- 两个通用压缩流：DeflateStream和GZipStream，这两个类都是用了与ZIP格式类似的常见的压缩算法。
   - GZipStream会在开头和结尾处写入额外的协议信息，其中包括检测错误的CRC。
- 都支持读写，压缩时候总是在写入流，解压缩时候总是在读取流。

示例：是用FileStream作为后台存储，压缩字节序列，并对其解压
```csharp
using (Stream s = File.Create("11.txt"))
{
    using Stream ds = new DeflateStream(s, CompressionMode.Compress);
    for (byte i = 0; i < 100; i++)
    {
        ds.WriteByte(i);
    }
}

using (Stream s2 = File.OpenRead("11.txt"))
{
    using Stream ds2 = new DeflateStream(s2, CompressionMode.Decompress);
    for (byte i = 0; i < 100; i++)
    {
        Console.WriteLine(ds2.ReadByte());// 0 - 99
    }
}
```

## 操作ZIP文件
System.IO.Compression命名空间中的ZipArchive和ZipFile操作常用的Zip压缩格式的文件

- 与DeflateStream和GZipStream相比，这种格式的优点是可以处理多个文件，并且可以兼容windows资源管理器以及其他压缩工具创建的zip文件。
- ZipArchive可以操作流，而ZipFile则执行更加常见的文件操作。（ZipFile是ZipArchive的静态辅助类。）
- ZipFile中的CreateFromDirectory方法可以将指定目录的所有文件添加到一个ZIP文件中
```csharp
ZipFile.CreateFromDirectory("E:\\Download\\临时", "e:\\aa.zip");
ZipFile.CreateFromDirectory("E:\\Download\\临时", "aa2.zip", CompressionLevel.SmallestSize,true);
/*
CompressionLevel:压缩等级
includeBaseDirectory:压缩的时候是否包含源目录名称
*/
```

- ExtractToDirectory可以将一个zip文件解压缩到一个目录
```csharp
ZipFile.ExtractToDirectory("e:\\aa.zip", "e:\\bb");
```

- ZipFile的open方法可用于读/写各个文件项目,并且可以指定操作方式，read、create、update、delete
```csharp
using (ZipArchive zip = ZipFile.Open("aa.zip", ZipArchiveMode.Read))
{
    foreach (var item in zip.Entries)
    {
        //输出压缩包里面的文件名称以及大小
        Console.WriteLine(item.FullName + "  " + item.Length);
    }
}
```

- ZipArchive类的CreateEntry方法（或者CreateEntryFromFile扩展方法）就可以创建新的项目。
```csharp
//创建一个压缩文件bb，里面包含test.txt
var data = File.ReadAllBytes("test.txt");
using (ZipArchive zip = ZipFile.Open("bb.zip", ZipArchiveMode.Update))
{
    zip.CreateEntry("test.txt").Open().Write(data, 0, data.Length);
}
```

- ZipArchive的构造函数也可以压缩文件,并且以流的形式保存到文件
   - 将test.txt压缩到output.zip中
```csharp
//保存的文件地址
using (var fs = new FileStream(@"e:\\output.zip", FileMode.Create))
//压缩文件保存到fs文件流中
using (var arch = new ZipArchive(fs, ZipArchiveMode.Create))
{
    //要保存到压缩文件的内容：第一个参数：源文件，第二个参数：压缩后文件名
    arch.CreateEntryFromFile(@"E:\aa\test.txt", "data.txt");
}
```

- 在 .NET 中有很多种途径可以解决这种问题，你可以借助一些第三方类,比如：SharpZipLib ，sevenzipsharp， DotNetZip。
