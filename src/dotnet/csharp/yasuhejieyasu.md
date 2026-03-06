---
title: 压缩和解压缩
lang: zh-CN
date: 2023-11-09
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 无
filename: yasuhejieyasu
slug: fw2dw4
docsId: '67823322'
---

## 目的
涉及到存入到数据库或者http传输的数据量比较大，这个时候，就需要考虑在存入数据库或者发送传输之前，将数据压缩下，当从数据库中取出时，再解压还原数据。通过GZipStream实现压缩和解压缩字符串。

## 操作
```csharp
public static class GZipStreamHelper
{
    /// <summary>
    /// 压缩字符串，回传 Base64 結果
    /// </summary>
    /// <param name="text"></param>
    /// <returns></returns>
    public static string ZipText(string text)
    {
        byte[] inputBytes = Encoding.UTF8.GetBytes(text);
        return ZipText(inputBytes);
    }

    /// <summary>
    /// 压缩数组
    /// </summary>
    /// <param name="inputBytes"></param>
    /// <returns></returns>
    public static string ZipText(byte[] inputBytes)
    {
        using MemoryStream outputStream = new MemoryStream();
        using (GZipStream gs = new GZipStream(outputStream, CompressionMode.Compress))
        {
            gs.Write(inputBytes, 0, inputBytes.Length);
        }

        byte[] outputBytes = outputStream.ToArray();
        return Convert.ToBase64String(outputBytes);
    }

    /// <summary>
    /// 解压缩字符串
    /// </summary>
    /// <param name="zippedText"></param>
    /// <returns></returns>
    public static string UnzipZippedText(string zippedText)
    {
        if (string.IsNullOrEmpty(zippedText))
            return string.Empty;

        string unzipedText = null;
        try
        {
            byte[] buffer = Convert.FromBase64String(zippedText);
            MemoryStream ms = new MemoryStream(buffer);
            GZipStream zipStream = new GZipStream(ms, CompressionMode.Decompress);

            using (StreamReader streamReader = new StreamReader(zipStream))
            {
                unzipedText = streamReader.ReadToEnd();
            }
        }
        catch (Exception)
        {
            unzipedText = string.Empty;
        }
        return unzipedText;
    }
}
```
运行结果测试，源文件经过压缩大小只有120字节，而解压后，源文件与解压后txt的大小一致。
