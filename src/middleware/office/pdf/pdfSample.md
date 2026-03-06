---
title: PDF示例
lang: zh-CN
date: 2024-04-25
publish: true
author:  azrng
isOriginal: true
category:
  - dotNet
tag:
  - pdf
---

## Microsoft.Office.Interop.Word

引用nuget包，该包依赖本机的office程序

```
<PackageReference Include="Microsoft.Office.Interop.Word" Version="15.0.4797.1004" />
```

此程序集可用于 Microsoft 生成和签名的 Word 2013/2016/2019 COM 互操作。这是完全不受支持的，并且没有许可证，因为它是 Office 程序集的重新打包。

### 操作

需要提前引用offcie.dll

```csharp
public class WordToPdfConverter
{
    public void ConvertWordToPdf(string sourceFilePath, string targetFilePath)
    {
        // 创建Word应用程序对象
        var wordApp = new Application();
        Document wordDoc = null;

        try
        {
            // 设置Word应用程序以隐藏方式运行（可选，避免显示界面）
            wordApp.Visible = false;

            // 打开Word文档
            wordDoc = wordApp.Documents.Open(sourceFilePath,
                ConfirmConversions: false, // 不自动转换文档格式
                ReadOnly: true, // 以只读模式打开，避免修改原文件
                AddToRecentFiles: false); // 不添加到最近使用的文件列表

            // 定义输出PDF的路径和选项
            var optimizeFor = WdExportOptimizeFor.wdExportOptimizeForPrint;
            var range = WdExportRange.wdExportAllDocument;

            // 执行转换并保存为PDF
            wordDoc.ExportAsFixedFormat(targetFilePath, WdExportFormat.wdExportFormatPDF,
                false, optimizeFor, range);

            Console.WriteLine($"Word文档 '{sourceFilePath}' 已成功转换为PDF并保存为 '{targetFilePath}'。");
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"转换过程中发生错误: {ex.Message}");
        }
        finally
        {
            // 清理资源，确保Word应用程序和文档关闭
            if (wordDoc != null)
            {
                wordDoc.Close(false);
            }

            if (wordApp != null)
            {
                wordApp.Quit();
            }
        }
    }
}
```

### Issue

### 找不到office文件

```csharp
System.IO.FileNotFoundException:“Could not load file or assembly ‘office, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c’. 系统找不到指定的文件。”
```

解决方法：找到`C:\Windows\assembly\GAC_MSIL\office\15.0.0.0__71e9bce111e9429c\OFFICE.DLL`添加引用即可

## Razor.Templating.Core

使用Razor模版去生成PDF内容

仓库地址：[https://github.com/soundaranbu/Razor.Templating.Core](https://github.com/soundaranbu/Razor.Templating.Core)



[使用 Razor 视图在 .NET 中灵活的 PDF 报告](https://www.milanjovanovic.tech/blog/flexible-pdf-reporting-in-net-using-razor-views?utm_source=newsletter&utm_medium=email&utm_campaign=tnw96)
