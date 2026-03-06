---
title: itext7
lang: zh-CN
date: 2022-07-03
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: itext7
slug: tgz8gq
docsId: '82214846'
---

## 操作
安装nuget包
```csharp
<PackageReference Include="itext7" Version="7.2.2" />
```

### 获取pdf文字内容
```csharp
/// <summary>
/// 提取指定地址pdf的文本内容
/// </summary>
/// <param name="filename"></param>
/// <returns></returns>
public static IEnumerable<string> ExtractText(string filename)
{
    using var r = new PdfReader(filename);
    using var doc = new PdfDocument(r);
    for (int i = 1; i < doc.GetNumberOfPages(); i++)
    {
        ITextExtractionStrategy strategy = new LocationTextExtractionStrategy();
        string text = PdfTextExtractor.GetTextFromPage(doc.GetPage(i), strategy);
        yield return text;
    }
}
```
操作示例
```csharp
var lines = PdfHelper.ExtractText("D:\\Downloads\\111.pdf").ToList();
```
