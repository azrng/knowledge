---
title: 将DLL内嵌DLL
lang: zh-CN
date: 2023-08-12
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: jiangdllneiqiandll
slug: bzwrlb76r28nsfa1
docsId: '120401898'
---

## 需求
希望能够将第三方DLL构建到我的DLL中，而不是在可能的情况下将它们放在一起

## 解决方案参考
embeddedResourcePrefix是嵌入资源的字符串路径，它通常是程序集的名称，后跟包含资源的任何文件夹结构(例如"MyComapny.MyProduct.MyAssembly.Resources“，如果dll位于项目中一个名为Resources的文件夹中)。它还假设dll具有.dll.resource扩展名。
```csharp
   public static void EnableDynamicLoadingForDlls(Assembly assemblyToLoadFrom, string embeddedResourcePrefix) {
        AppDomain.CurrentDomain.AssemblyResolve += (sender, args) => { // had to add =>
            try {
                string resName = embeddedResourcePrefix + "." + args.Name.Split(',')[0] + ".dll.resource";
                using (Stream input = assemblyToLoadFrom.GetManifestResourceStream(resName)) {
                    return input != null
                         ? Assembly.Load(StreamToBytes(input))
                         : null;
                }
            } catch (Exception ex) {
                _log.Error("Error dynamically loading dll: " + args.Name, ex);
                return null;
            }
        }; // Had to add colon
    }

    private static byte[] StreamToBytes(Stream input) {
        int capacity = input.CanSeek ? (int)input.Length : 0;
        using (MemoryStream output = new MemoryStream(capacity)) {
            int readLength;
            byte[] buffer = new byte[4096];

            do {
                readLength = input.Read(buffer, 0, buffer.Length); // had to change to buffer.Length
                output.Write(buffer, 0, readLength);
            }
            while (readLength != 0);

            return output.ToArray();
        }
    }
```
我已经成功地完成了您所描述的操作，但是因为第三方DLL也是一个.NET程序集，所以我从不将它写到磁盘上，我只是从内存中加载它。
我将嵌入式资源程序集作为一个字节数组，如下所示：
```csharp
        Assembly resAssembly = Assembly.LoadFile(assemblyPathName);

        byte[] assemblyData;
        using (Stream stream = resAssembly.GetManifestResourceStream(resourceName))
        {
            assemblyData = ReadBytesFromStream(stream);
            stream.Close();
        }
```
然后我用Assembly.Load()加载数据。
最后，我向AppDomain.CurrentDomain.AssemblyResolve添加了一个处理程序，以便在类型加载器查看程序集时返回加载的程序集。

## ILRepack

.NET 使用 ILRepack 合并多个程序集（替代 ILMerge）：https://cloud.tencent.com/developer/article/2348871

仓库地址：https://github.com/gluck/il-repack?tab=readme-ov-file

## 参考资料

参考资料：[https://cloud.tencent.com/developer/ask/sof/124155](https://cloud.tencent.com/developer/ask/sof/124155)
