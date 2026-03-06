---
title: Spire
lang: zh-CN
date: 2023-10-18
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: spire
slug: obggr2
docsId: '70549831'
---

## 概述
免费版本有版权标识信息，至于有没有更多不确定。

## FreeSpire

免费的.NET库，用于操作Office



文档地址：https://www.e-iceblue.com/Introduce/free-doc-component.html

## 和免费版区别

FreeSpire.Doc和Spire.Doc指的是同一个产品系列的不同版本。Spire.Doc是由E-iceblue公司开发的一款用于.NET平台的Word文档处理库，它允许开发者在没有安装Microsoft Office的情况下创建、读取、修改和转换Word文档。Spire.Doc分为两个版本：
1、Spire.Doc (付费版)：

* 完整功能：Spire.Doc付费版提供了完整的Word文档处理功能，包括但不限于高级样式应用、图表编辑、邮件合并、批注、修订跟踪、保护文档、宏支持等。
* 无限制：对于文档大小、段落数量、表格数量、图片数量等没有使用限制，适用于大规模、复杂度高的文档处理任务。
* 技术支持：购买Spire.Doc付费版的用户可以获得官方的技术支持服务，包括优先解答问题、定期更新以及bug修复等。

2、FreeSpire.Doc (免费版)：

* 基本功能：FreeSpire.Doc作为Spire.Doc的免费版本，提供了基础的Word文档处理能力，如创建简单文档、读取和修改文档内容、格式设置、转换文档格式等。
* 有限制：根据您提供的信息，FreeSpire.Doc对处理的文档有特定的限制，如不超过500个段落和25个表格。对于超出限制的文档，可能无法正确加载或处理。
* 无官方技术支持：尽管免费版用户可以访问官方论坛获取社区支持，但通常不享受正式的技术支持服务，如电话支持、优先响应等。

总结起来，FreeSpire.Doc和Spire.Doc的主要区别在于功能范围、使用限制以及技术支持服务：
* 功能差异：付费版Spire.Doc具备更全面、高级的功能集，适合对Word文档处理有复杂需求的项目；而FreeSpire.Doc提供基础功能，适用于简单文档操作和小规模项目。
*  使用限制：FreeSpire.Doc对处理的文档有明确的篇幅限制，不适合处理大型或复杂的Word文档；Spire.Doc付费版则无此类限制。
* 技术支持：购买Spire.Doc付费版的用户可以获得专业、及时的技术支持服务，这对于企业级应用或对稳定性、时效性要求较高的项目尤为重要；使用FreeSpire.Doc的用户则主要依赖社区资源解决遇到的问题。

根据您的项目需求、预算以及对技术支持的需求，可以选择适合的版本。如果只是进行简单的Word到PDF转换，并且文档规模在免费版的限制范围内，FreeSpire.Doc可能是经济实惠的选择。但如果需要处理大型文档、使用高级功能或者期望获得专业技术支持，应考虑使用Spire.Doc付费版。

## 操作

### Html转Excel
引用组件
```csharp
<PackageReference Include="Spire.XLS" Version="12.3.2" />
```
有些东西导出样式就变了，不针对所有的Html
```csharp
Workbook workbook = new Workbook();
workbook.LoadFromHtml(@"E:\Test\ConsoleApp3\ConsoleApp3\aa.html");

//自适应行高
Worksheet sheet = workbook.Worksheets[0];
sheet.AllocatedRange.AutoFitRows();

//保存文档
workbook.SaveToFile("d:\\HtmlToExcel.xlsx", FileFormat.Version2013);
```

### HTML转Word

待完善

### Excel转pdf

逻辑是首先使用Spire.XLS库加载Excel文件，并使用Spire.PDF库创建PDF文档。然后，我们遍历Excel文件的每个工作表，将表格内容逐个绘制到PDF页面上。

安装Spire。注意的是需要安装Spire，不要安装Spire.XLS和Spire.PDF否则会出现不兼容的问题
```csharp
public static void ConvertExcelToPdf(string excelFilePath, string pdfFilePath)
{
    // 加载Excel文件
    Workbook workbook = new Workbook();
    workbook.LoadFromFile(excelFilePath);
    // 创建PDF文档
    PdfDocument pdfDocument = new PdfDocument();
    // 添加Excel表格内容到PDF
    foreach (Worksheet sheet in workbook.Worksheets)
    {
        PdfPageBase pdfPage = pdfDocument.Pages.Add();
        PdfDocument document = new PdfDocument();
        PdfTrueTypeFont fonts = new PdfTrueTypeFont(@"C:\Windows\Fonts\simfang.ttf", 10f);
        // 获取Excel表格的行数和列数
        int rowCount = sheet.LastRow + 1;
        int columnCount = sheet.LastColumn + 1;
        // 将Excel表格内容逐个添加到PDF
        for (int row = 1; row <= rowCount; row++)
        {
            for (int column = 1; column <= columnCount; column++)
            {
                string value = sheet.Range[row, column].Text;
                if (value != null)
                // 绘制单元格内容到PDF页面
                {
                    pdfPage.Canvas.DrawString(value, fonts, PdfBrushes.Black, column * 70, row * 20);
                }
            }
        }
    }
    // 保存PDF文件
    pdfDocument.SaveToFile(pdfFilePath);
    Console.WriteLine("PDF转换完成。");
}
```
