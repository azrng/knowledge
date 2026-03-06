---
title: Aspose.PDF
lang: zh-CN
date: 2022-05-30
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: aspose_pdf
slug: wci9sa
docsId: '60738145'
---

## 操作

### PDF转常见格式
```csharp
var path = "d:\\VS2015常用快捷键总结.pdf";
// load the file to be converted
var pfile = new Aspose.Pdf.Document(path);
// save in different formats
pfile.Save("d:\\output.doc", Aspose.Pdf.SaveFormat.Doc);
pfile.Save("d:\\output.pptx", Aspose.Pdf.SaveFormat.Pptx);
pfile.Save("d:\\output.html", Aspose.Pdf.SaveFormat.Html);
```

### 转jpeg图片
```csharp
var path = "D:\\Work\\xxxxxx.0.20210915.pdf";

//定义Jpeg转换设备
Document document = new Document(path);
var device = new Aspose.Pdf.Devices.JpegDevice(10);//设置图片质量
Console.WriteLine("默认图片张数：" + document.Pages.Count);
//遍历每一页转为jpg
for (var i = 1; i <= document.Pages.Count; i++)
{
    string filePathOutPut = $"d:\\img\\{i}.jpg";
    FileStream fs = new FileStream(filePathOutPut, FileMode.OpenOrCreate);
    try
    {
        device.Process(document.Pages[i], fs);
        fs.Close();
    }
    catch (Exception ex)
    {
        fs.Close();
        File.Delete(filePathOutPut);
    }
}
Console.WriteLine("保存成功");
```

## 资料
```csharp

Net5环境下Aspose.cell与Aspose.pdf最新版21.3全系列 excel转pdf,pdf拼页打印，去水印等
https://blog.csdn.net/mansai/article/details/114954402

组件对比
项目地址：https://github.com/ShiningRush/PdfComponentComparison/blob/master/README.zh-cn.md
https://www.cnblogs.com/RobotZero/p/7742282.html
```
