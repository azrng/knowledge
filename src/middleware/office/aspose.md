---
title: Aspose
lang: zh-CN
date: 2023-10-18
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: aspose
slug: kitbflpzo9yft1ko
docsId: '111173745'
---

## 测试例子
引用包
```
  <ItemGroup>
    <PackageReference Include="Aspose.Cells" Version="21.3.0" />
    <PackageReference Include="Aspose.PDF" Version="21.3.0" />
  </ItemGroup>
```
代码
```
//定义License变量，用于去水印
//如需获取key请加微信:25489181
var byteKey = Convert.FromBase64String("");
if (byteKey.Length==0)
{
    Console.WriteLine("key不能为空，请加微信25489181获取key");
    return;
}
//注册，实现去水印
new Aspose.Cells.License().SetLicense(new MemoryStream(byteKey));
new Aspose.Pdf.License().SetLicense(new MemoryStream(byteKey));
#region excel转pdf
Aspose.Cells.Workbook workbook = new Aspose.Cells.Workbook();
Aspose.Cells.Worksheet sheet = workbook.Worksheets[0];
sheet.Cells[0, 0].Value = "A5竖向";
sheet.PageSetup.PaperSize = PaperSizeType.PaperA5;
MemoryStream vStream= new MemoryStream();
sheet.Workbook.Save(vStream, SaveFormat.Pdf);
sheet.Workbook.Save("A5竖向.pdf", SaveFormat.Pdf);
sheet.Cells[0, 0].Value = "A5横向";
sheet.PageSetup.Orientation = PageOrientationType.Landscape;
MemoryStream hStream = new MemoryStream();
sheet.Workbook.Save(hStream, SaveFormat.Pdf);
sheet.Workbook.Save("A5横向.pdf", SaveFormat.Pdf);
#endregion
#region pdf单页双份
//用于拼页
PdfFileEditor pdfEditor = new PdfFileEditor();
FileStream outputStream = new FileStream("A4竖排.pdf", FileMode.Create);
pdfEditor.MakeNUp(hStream, hStream, outputStream);//2页合并为一页(竖排）
FileStream outputStream2 = new FileStream("A4横排.pdf", FileMode.Create);
pdfEditor.MakeNUp(new MemoryStream []{ vStream, vStream}, outputStream2,true);// sidewise参数为横向//2页合并为一页(横排）
#endregion
#region pdf多页拼页

FileStream outputStream3 = new FileStream("4页.pdf", FileMode.Create);
//4页pdf
pdfEditor.Append(vStream, new MemoryStream[] { vStream, vStream, vStream }, 1, 1, outputStream3);
FileStream outputStream4= new FileStream("4页合并后.pdf", FileMode.Create);
//4张A5合并为一张A3
pdfEditor.MakeNUp(outputStream3, outputStream4, 2, 2, Aspose.Pdf.PageSize.A3);
#endregion
#region pdf页面拆分
FileStream outputStream5 = new FileStream("4页pdf提取第1页.pdf", FileMode.Create);
pdfEditor.Extract(outputStream3, 1, 1, outputStream5);
#endregion
#region 单页拆分为多页
Aspose.Pdf.Document doc = new Aspose.Pdf.Document(outputStream2);
doc.Pages.Add(doc.Pages[1]);
doc.Pages[1].MediaBox = new Aspose.Pdf.Rectangle(0, 0, doc.Pages[1].MediaBox.URX / 2, doc.Pages[1].MediaBox.URY);
doc.Pages[2].MediaBox = new Aspose.Pdf.Rectangle(doc.Pages[2].MediaBox.Width/2, 0, doc.Pages[1].MediaBox.URX, doc.Pages[1].MediaBox.URY);
doc.Save("A4横排再还原为A5大小2页.pdf");
#endregion
```
