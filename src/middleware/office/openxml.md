---
title: OpenXml
lang: zh-CN
date: 2023-10-18
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: openxml
slug: mt42voud4czs47o7
docsId: '123329078'
---

## 操作
安装nuget包
```csharp
DocumentFormat.OpenXml
```

### 导出PPT文件中图片
```csharp
/// <summary>
/// 导出PPT文件中所有图片
/// </summary>
/// <param name="sourcePath">源文件路径</param>
/// <param name="targetDir">目标文件存放目录</param>
/// <returns></returns>
public static void ExportPPTImages(string sourcePath,string targetDir)
{
    using (PresentationDocument presentationDocument = PresentationDocument.Open(sourcePath, isEditable: false))
    {
        PresentationPart presentationPart = presentationDocument.PresentationPart;
        DocumentFormat.OpenXml.Presentation.Presentation presentation = presentationPart.Presentation;
        List<ImagePart> list = new List<ImagePart>();
        foreach (DocumentFormat.OpenXml.Presentation.SlideId item in presentation.SlideIdList.OfType<DocumentFormat.OpenXml.Presentation.SlideId>())
        {
            SlidePart slidePart = presentationPart.GetPartById(item.RelationshipId) as SlidePart;
            list.AddRange(slidePart.ImageParts);
        }
        List<IGrouping<string, ImagePart>> list2 = list.GroupBy(d => d.Uri.OriginalString).ToList();

        //导出PPT所有的图片
        for (int i = 0; i < list2.Count; i++)
        {
            ImagePart imagePart = list2[i].FirstOrDefault();
            string tempFileName = Path.Combine(targetDir, $"image_{i}.jpg");
            using (Stream stream = imagePart.GetStream(FileMode.Open))
            {
                using (Bitmap bitmap = new Bitmap(stream))
                {
                    bitmap.Save(tempFileName, System.Drawing.Imaging.ImageFormat.Jpeg);
                }
            }
        }
        //presentation.Save();
    }
}
```
资料：[https://www.cnblogs.com/cplemom/p/12198618.html](https://www.cnblogs.com/cplemom/p/12198618.html)

### 导出Word文件中图片
```csharp
/// <summary>
/// 导出Word文件中所有图片
/// </summary>
/// <param name="sourcePath">源文件路径</param>
/// <param name="targetDir">目标文件存放目录</param>
/// <returns></returns>
public static void ExportWordImages(string sourcePath,string targetDir)
{
    using (WordprocessingDocument wordDocument = WordprocessingDocument.Open(sourcePath, isEditable: false))
    {
        var list2 = wordDocument.MainDocumentPart.ImageParts.GroupBy(d => d.Uri.OriginalString).ToList();
        for (int i = 0; i < list2.Count; i++)
        {
            ImagePart imagePart = list2[i].FirstOrDefault();
            string tempFileName = Path.Combine(targetDir, $"image_{i}.jpg");
            using (Stream stream = imagePart.GetStream(FileMode.Open))
            {
                using (Bitmap bitmap = new Bitmap(stream))
                {
                    bitmap.Save(tempFileName, System.Drawing.Imaging.ImageFormat.Jpeg);
                }
            }
        }
    }
}
```
资料：[https://www.cnblogs.com/cplemom/p/12198618.html](https://www.cnblogs.com/cplemom/p/12198618.html)
