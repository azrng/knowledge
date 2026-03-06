---
title: Stream扩展类
lang: zh-CN
date: 2023-10-22
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 无
filename: streamkuozhanlei
slug: ynzo45
docsId: '72175008'
---
```csharp
/// <summary>
/// 文件流扩展
/// </summary>
public static class StreamExtension
{
    /// <summary>
    /// 文件格式
    /// </summary>
    private static readonly IDictionary<string, string> _fileFormats =
        new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
        {
            {
                ".gif",
                "7173"
            },
            {
                ".jpg",
                "255216"
            },
            {
                ".jpeg",
                "255216"
            },
            {
                ".png",
                "13780"
            },
            {
                ".bmp",
                "6677"
            },
            {
                ".swf",
                "6787"
            },
            {
                ".flv",
                "7076"
            },
            {
                ".wma",
                "4838"
            },
            {
                ".wav",
                "8273"
            },
            {
                ".amr",
                "3533"
            },
            {
                ".mp4",
                "00"
            },
            {
                ".mp3",
                "255251"
            },
            {
                ".pdf",
                "3780"
            },
            {
                ".txt",
                "12334"
            },
            {
                ".zip",
                "8297"
            }
        };

    /// <summary>
    /// 内容后缀名
    /// </summary>
    private static readonly IDictionary<string, string> _contentTypeExtensionsMapping =
        new Dictionary<string, string>
        {
            {
                ".gif",
                "image/gif"
            },
            {
                ".jpg",
                "image/jpg"
            },
            {
                ".jpeg",
                "image/jpeg"
            },
            {
                ".png",
                "image/png"
            },
            {
                ".bmp",
                "application/x-bmp"
            },
            {
                ".mp3",
                "audio/mp3"
            },
            {
                ".wma",
                "audio/x-ms-wma"
            },
            {
                ".wav",
                "audio/wav"
            },
            {
                ".amr",
                "audio/amr"
            },
            {
                ".mp4",
                "video/mpeg4"
            },
            {
                ".xlsx",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            },
            {
                ".pdf",
                "application/pdf"
            },
            {
                ".txt",
                "text/plain"
            },
            {
                ".doc",
                "application/msword"
            },
            {
                ".xls",
                "application/vnd.ms-excel"
            },
            {
                ".zip",
                "aplication/zip"
            },
            {
                ".csv",
                "text/csv"
            },
            {
                ".ppt",
                "application/vnd.ms-powerpoint"
            },
            {
                ".pptx",
                "application/vnd.openxmlformats-officedocument.presentationml.presentation"
            },
            {
                ".docx",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            }
        };

    /// <summary>
    /// 获取字节数组文件后缀
    /// </summary>
    /// <param name="bytes">字节数组</param>
    /// <returns></returns>
    public static string GetFileSuffix(this byte[] bytes)
    {
        var fileCode = GetFileCode(bytes);
        var key = _fileFormats.First((i) => i.Value.Equals(fileCode)).Key;
        return !_contentTypeExtensionsMapping.ContainsKey(key) ? null : key;
    }

    /// <summary>
    /// 获取字节数组内容类型
    /// </summary>
    /// <param name="bytes">字节数组</param>
    /// <returns></returns>
    public static string GetContentType(this byte[] bytes)
    {
        var fileCode = GetFileCode(bytes);
        var extensions = _fileFormats.First((i) => i.Value.Equals(fileCode)).Key;
        return !_contentTypeExtensionsMapping.ContainsKey(extensions)
            ? null
            : _contentTypeExtensionsMapping.Where(x => x.Key == extensions).Select(x => x.Value).FirstOrDefault();
    }

    /// <summary>
    /// 获取随机文件名
    /// </summary>
    /// <param name="data">字节数组</param>
    /// <returns></returns>
    public static string GetRandomFileName(this byte[] data)
    {
        var fileCode = GetFileCode(data);
        return string.Concat(str0: Guid.NewGuid().ToString("n"),
            str1: _fileFormats.First((i) => i.Value.Equals(fileCode)).Key);
    }

    /// <summary>
    /// 获取文件编码
    /// </summary>
    /// <param name="bytes">字节数组</param>
    /// <returns></returns>
    private static string GetFileCode(byte[] bytes)
    {
        return bytes[0].ToString(CultureInfo.InvariantCulture) + bytes[1];
    }

    /// <summary>
    /// 将字节数组转为流
    /// </summary>
    /// <param name="bytes">字节数组</param>
    /// <returns></returns>
    public static Stream BytesToStream(this byte[] bytes)
    {
        return new MemoryStream(bytes);
    }

    /// <summary>
    /// 将流转字节数组
    /// </summary>
    /// <param name="stream"></param>
    /// <returns></returns>
    public static byte[] StreamToBytes(this Stream stream)
    {
        if (stream is null)
            return Array.Empty<byte>();
        var array = new byte[stream.Length];
        stream.Read(array, 0, array.Length);
        stream.Seek(0L, SeekOrigin.Begin);

        return array;
    }

    /// <summary>
    /// 将流转字节数组
    /// </summary>
    /// <param name="stream"></param>
    /// <returns></returns>
    public static async Task<byte[]> StreamToBytesAsync(this Stream stream)
    {
        if (stream is null)
            return Array.Empty<byte>();
        var array = new byte[stream.Length];
        await stream.ReadAsync(array);
        stream.Seek(0L, SeekOrigin.Begin);
        return array;
    }

    /// <summary>
    /// 将指定文件转流
    /// </summary>
    /// <param name="fileName">文件地址</param>
    /// <returns></returns>
    public static Stream FileToStream(this string fileName)
    {
        using var fileStream = new FileStream(fileName, FileMode.Open, FileAccess.Read, FileShare.Read);
        var array = new byte[fileStream.Length];
        fileStream.Read(array, 0, array.Length);
        return new MemoryStream(array);
    }

    /// <summary>
    /// 将指定文件转流
    /// </summary>
    /// <param name="fileName">文件地址</param>
    /// <returns></returns>
    public static async Task<Stream> FileToStreamAsync(this string fileName)
    {
        await using var fileStream = new FileStream(fileName, FileMode.Open, FileAccess.Read, FileShare.Read);
        var array = new byte[fileStream.Length];
        await fileStream.ReadAsync(array);
        return new MemoryStream(array);
    }

    /// <summary>
    /// 将指定文件转字节数组
    /// </summary>
    /// <param name="fileName"></param>
    /// <returns></returns>
    public static byte[] FileToByte(this string fileName)
    {
        using var fileStream = new FileStream(fileName, FileMode.Open, FileAccess.Read, FileShare.Read);
        var array = new byte[fileStream.Length];
        fileStream.Read(array, 0, array.Length);
        return array;
    }

    /// <summary>
    /// 将指定文件转字节数组
    /// </summary>
    /// <param name="fileName"></param>
    /// <returns></returns>
    public static async Task<byte[]> FileToByteAsync(this string fileName)
    {
        await using var fileStream = new FileStream(fileName, FileMode.Open, FileAccess.Read, FileShare.Read);
        var array = new byte[fileStream.Length];
        await fileStream.ReadAsync(array);
        return array;
    }

    /// <summary>
    /// 将指定流保存为文件
    /// </summary>
    /// <param name="stream"></param>
    /// <param name="fileName"></param>
    public static void StreamToFile(this Stream stream, string fileName)
    {
        var array = new byte[stream.Length];
        stream.Read(array, 0, array.Length);
        stream.Seek(0L, SeekOrigin.Begin);
        using var fileStream = new FileStream(fileName, FileMode.OpenOrCreate);
        using var binaryWriter = new BinaryWriter(fileStream);
        binaryWriter.Write(array);
    }

    /// <summary>
    /// 将指定流保存为文件
    /// </summary>
    /// <param name="stream"></param>
    /// <param name="fileName"></param>
    public static async Task StreamToFileAsync(this Stream stream, string fileName)
    {
        var array = new byte[stream.Length];
        await stream.ReadAsync(array);
        stream.Seek(0L, SeekOrigin.Begin);
        await using var fileStream = new FileStream(fileName, FileMode.OpenOrCreate);
        await using var binaryWriter = new BinaryWriter(fileStream);
        binaryWriter.Write(array);
    }

    /// <summary>
    /// 将字节数据保存为文件
    /// </summary>
    /// <param name="bytes"></param>
    /// <param name="fileName"></param>
    public static void ByteToFile(this byte[] bytes, string fileName)
    {
        using var fileStream = new FileStream(fileName, FileMode.OpenOrCreate);
        using var binaryWriter = new BinaryWriter(fileStream);
        binaryWriter.Write(bytes);
    }
}
```
