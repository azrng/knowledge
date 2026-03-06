---
title: PDFsharp
lang: zh-CN
date: 2023-06-24
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - pdf
filename: pdfsharp
slug: gumb5l
docsId: '70252229'
---

## 概述
PDFsharp是个.net类库，用于在C#、VB.NET等.net编程语言中以编程方式操作Adobe PDF文档。PDFsharp为PDF文档中的每种对象都创建了类，因此在程序中不需要直接操作对象ID或者引用。
最近更新：2019年
下载量：27.7M(2024年10月17日20:02:47)

## 功能

- 使用任意.net 编程语言实时创建pdf文档；
- 可以从不同数据源中导入数据，例如XML文件或其它数据接口（任意可在.net中使用的数据源）；
- 在pdf页面中使用的绘图代码同样适用于窗口或打印机；
- 能够编辑、合并、拆分现有pdf文档；
- 具有透明度的图像(彩色掩模、单色掩模、α掩模)；
- 使用C#语言重写PDFsharp代码；
- PDFsharp中的图形类与.net很匹配。

## 操作

安装nuget包

```
<PackageReference Include="PDFsharp" Version="6.1.1" />
```

### 解密PDF

```c#
var pdfDocument = PdfReader.Open("E:\\temp\\LIS.PDF", "admin");
pdfDocument.SecurityHandler.SetEncryption(PdfDefaultEncryption.None);
pdfDocument.Save("E:\\temp\\Decrypted.pdf");
```

