---
title: Haukcode.WkHtmlToPdfDotNet
lang: zh-CN
date: 2022-06-02
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: haukcode_wkhtmltopdfdotnet
slug: dzp8xx
docsId: '79336666'
---

## 概述


## 准备
安装组件包
```csharp
<PackageReference Include="Haukcode.WkHtmlToPdfDotNet" Version="1.5.68" />
```

## pdf接口
```csharp
public interface IPDFService
{
    /// <summary>
    /// 创建PDF
    /// </summary>
    /// <param name="htmlContent">传入html字符串</param>
    /// <returns></returns>
    byte[] CreatePDF(string htmlContent);
}
```
实现类
```csharp
public class PDFService : IPDFService
{
    private IConverter _converter;

    public PDFService(IConverter converter)
    {
        _converter = converter;
    }

    /// <summary>
    /// 创建PDF
    /// </summary>
    /// <param name="htmlContent">传入html字符串</param>
    /// <returns></returns>
    public byte[] CreatePDF(string htmlContent)
    {
        var globalSettings = new GlobalSettings
        {
            ColorMode = ColorMode.Color,
            Orientation = Orientation.Portrait,
            PaperSize = PaperKind.A4,
            //Margins = new MarginSettings
            //{
            //    Top = 10,
            //    Left = 0,
            //    Right = 0,
            //},
            DocumentTitle = "PDF Report",
        };

        var objectSettings = new ObjectSettings
        {
            PagesCount = true,
            HtmlContent = htmlContent,
            // Page = "www.baidu.com", //USE THIS PROPERTY TO GENERATE PDF CONTENT FROM AN HTML PAGE  这里是用现有的网页生成PDF
            //WebSettings = { DefaultEncoding = "utf-8", UserStyleSheet = Path.Combine(Directory.GetCurrentDirectory(), "assets", "styles.css") },
            WebSettings = { DefaultEncoding = "utf-8" },
            //HeaderSettings = { FontName = "Arial", FontSize = 9, Right = "Page [page] of [toPage]", Line = true },
            //FooterSettings = { FontName = "Arial", FontSize = 9, Line = true, Center = "Report Footer" }
        };

        var pdf = new HtmlToPdfDocument()
        {
            GlobalSettings = globalSettings,
            Objects = { objectSettings }
        };

        var file = _converter.Convert(pdf);

        //return File(file, "application/pdf");
        return file;
    }
}
```
注入服务
```csharp
//DinkToPdf注入
builder.Services.AddSingleton(typeof(IConverter), new SynchronizedConverter(new PdfTools()));
builder.Services.AddTransient<IPDFService, PDFService>();
```
生成pdf示例
```csharp
[HttpGet]
public ActionResult ConverterPDF()
{
    //html内容
    var sb = new StringBuilder();
    sb.Append(@"
<html>
<head>
<meta http-equiv='Content-Type' content='text/html; charset=utf-8' />
<style>

</style>
</head>

<body>
<div>
    这是一个网页！
</div>
</body>
</html>
        ");
    //生成PDF
    var pdfBytes = _pDFService.CreatePDF(sb.ToString());
    var fileName = $"{DateTime.Now:yyyyMMddHHmmss}.pdf";
    return File(pdfBytes, "application/octet-stream",fileName);
}
```

