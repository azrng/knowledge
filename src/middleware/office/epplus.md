---
title: EPPlus
lang: zh-CN
date: 2023-06-24
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: epplus
slug: gt5eax
docsId: '47029870'
---

## 概述
EPPlus是一个使用Open Office XML(xlsx)文件格式，能读写Excel 2007/2010 文件的开源组件，在导出Excel的时候不需要电脑上安装office，它的一个缺点就是不支持导出2003版的Excel(xls)。

## 示例
安装nuget包
```csharp
<PackageReference Include="EPPlus" Version="5.8.3" />
```

### 导出excel
获取数据并调用ExcelHelper公共类的方法执行导出xlsx文件
```csharp
[HttpGet]
public async Task<ActionResult> ExeclExportAsync()
{
    var list = await _context.Users.ToListAsync().ConfigureAwait(false);//改成你自己的获取数据方法
    var columns = new Dictionary<string, string>()
        {
            {"Id", "ID"},
            {"Account", "帐号"},
            {"PassWord", "密码"},
            {"CreateTime", "创建时间"},
            {"IsValid", "是否有效"},
        };
    var bytes = ExcelHelper.GetByteToExportExcel(list, columns);
    return File(bytes, "application/ms-excel", "ceshi" + ".xlsx");//此处ceshi为文件的名字，看情况自定义
}


//返回base64码示例
var columns = new Dictionary<string, string>()
{
    {"UserId", "用户Id"},
    {"Avatar", "微信头像"},
    {"NickName", "微信昵称"},
    {"CreateTime", "热议时间"}
};
var bytes = ExcelHelper.GetByteToExportExcel(result.Data, columns);
var time = DateTime.Now.ToTimestamp();
var fileName = $"{time}.xlsx";
var fileResult = new
{
    FileName = fileName,
    Base64Str = Convert.ToBase64String(bytes)
};
return Success(fileResult);
```
添加以下公共类到项目中
```csharp
/// <summary>
/// excel导出扩展
/// </summary>
public static class ExcelHelper
{
    /// <summary>
    /// 获取Excel文件流
    /// </summary>
    /// <param name="datas">数据</param>
    /// <param name="columnNames">列名称</param>
    /// <param name="sheetName">工作表名称</param>
    /// <param name="title">标题</param>
    /// <param name="isProtected">是否加密</param>
    /// <typeparam name="T"></typeparam>
    /// <returns></returns>
    public static byte[] GetByteToExportExcel<T>(IEnumerable<T> datas, Dictionary<string, string> columnNames,
        string sheetName = "Sheet1", string title = "", int isProtected = 0)
    {
        using var fs = new MemoryStream();
        using var package = CreateExcelPackage(datas, columnNames, sheetName, title, isProtected);
        package.SaveAs(fs);
        return fs.ToArray();
    }

    /// <summary>
    /// 创建ExcelPackage
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <param name="datas">数据实体</param>
    /// <param name="columnNames">列名</param>
    /// <param name="sheetName">sheet名称</param>
    /// <param name="title">标题</param>
    /// <param name="isProtected">是否加密</param>
    /// <returns></returns>
    private static ExcelPackage CreateExcelPackage<T>(IEnumerable<T> datas, Dictionary<string, string> columnNames,
        string sheetName = "Sheet1", string title = "", int isProtected = 0)
    {
        ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
        var package = new ExcelPackage();
        var worksheet = package.Workbook.Worksheets.Add(sheetName);
        if (isProtected == 1)
        {
            worksheet.Protection.IsProtected = false; //设置是否进行锁定
            worksheet.Protection.SetPassword("123456"); //设置密码
            worksheet.Protection.AllowAutoFilter = false; //下面是一些锁定时权限的设置
            worksheet.Protection.AllowDeleteColumns = false;
            worksheet.Protection.AllowDeleteRows = false;
            worksheet.Protection.AllowEditScenarios = false;
            worksheet.Protection.AllowEditObject = false;
            worksheet.Protection.AllowFormatCells = false;
            worksheet.Protection.AllowFormatColumns = false;
            worksheet.Protection.AllowFormatRows = false;
            worksheet.Protection.AllowInsertColumns = false;
            worksheet.Protection.AllowInsertHyperlinks = false;
            worksheet.Protection.AllowInsertRows = false;
            worksheet.Protection.AllowPivotTables = false;
            worksheet.Protection.AllowSelectLockedCells = false;
            worksheet.Protection.AllowSelectUnlockedCells = false;
            worksheet.Protection.AllowSort = false;
        }

        var titleRow = 0;
        if (!string.IsNullOrWhiteSpace(title))
        {
            titleRow = 1;
            worksheet.Cells[1, 1, 1, columnNames.Count].Merge = true; //合并单元格
            worksheet.Cells[1, 1].Value = title;
            worksheet.Cells.Style.WrapText = true;
            worksheet.Cells[1, 1].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center; //水平居中
            worksheet.Cells[1, 1].Style.VerticalAlignment = ExcelVerticalAlignment.Center; //垂直居中
            worksheet.Row(1).Height = 30; //设置行高
            worksheet.Cells.Style.ShrinkToFit = true; //单元格自动适应大小
        }

        //获取要反射的属性,加载首行
        Type myType = typeof(T);
        var myPro = new List<PropertyInfo>();
        int i = 1;
        foreach (string key in columnNames.Keys)
        {
            PropertyInfo p = myType.GetProperty(key);
            myPro.Add(p);
            worksheet.Cells[1 + titleRow, i].Value = columnNames[key];
            i++;
        }

        int row = 2 + titleRow;
        foreach (T data in datas)
        {
            int column = 1;
            foreach (PropertyInfo p in myPro)
            {
                worksheet.Cells[row, column].Value = Convert.ToString(p.GetValue(data, null));
                column++;
            }

            row++;
        }

        return package;
    }
}
```

### 导入excel
示例
```csharp
using (ExcelPackage package = new ExcelPackage(existingFile))
{
    ExcelWorksheet worksheet = package.Workbook.Worksheets[0];
    
    //获取表格的列数和行数
    int rowCount = worksheet.Dimension.Rows;
    int colCount = worksheet.Dimension.Columns;
    for (int row = 1; row <= rowCount; row++)
    {
        // 具体的获取数据
        // worksheet.Cells[row, 1].Value.ToString();
    }
}

```

### 导出pdf
逻辑：先将excel导入然后解析生成html，再通过IronPdf组件将html转pdf导出
```csharp
/// <summary>
/// 将excel导出为pdf
/// </summary>
/// <param name="file"></param>
/// <returns></returns>
[HttpPost("exportpdf")]
public string ExportPdf(IFormFile file)
{
    // 读取Excel文件
    using var package = new ExcelPackage(file.OpenReadStream());
    ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
    ExcelWorksheet worksheet = package.Workbook.Worksheets[0]; // 假设要转换的工作表是第一个工作表

    // 创建一个HTML字符串，将Excel内容转换为HTML
    string htmlContent = ExcelToHtml(worksheet);

    // 使用IronPDF将HTML字符串转换为PDF
    var renderer = new HtmlToPdf();
    renderer.PrintOptions.MarginTop = 0;
    renderer.PrintOptions.MarginBottom = 0;
    renderer.PrintOptions.MarginLeft = 0;
    renderer.PrintOptions.MarginRight = 0;
    var pdf = renderer.RenderHtmlAsPdf(htmlContent);

    // 保存PDF文件
    pdf.SaveAs("d://temp//11.pdf");
    return "success";
}

/// <summary>
/// 将excel转html
/// </summary>
/// <param name="worksheet"></param>
/// <returns></returns>
private static string ExcelToHtml(ExcelWorksheet worksheet)
{
    var sb = new StringBuilder();
    sb.AppendLine("<table>");
    var startRow = worksheet.Dimension.Start.Row;
    var endRow = worksheet.Dimension.End.Row;
    var startColumn = worksheet.Dimension.Start.Column;
    var endColumn = worksheet.Dimension.End.Column;

    for (var row = startRow; row <= endRow; row++)
    {
        sb.AppendLine("<tr>");

        for (int col = startColumn; col <= endColumn; col++)
        {
            var cellValue = worksheet.Cells[row, col].Value;
            sb.AppendLine("<td>" + (cellValue != null ? cellValue.ToString() : "") + "</td>");
        }

        sb.AppendLine("</tr>");
    }
    sb.AppendLine("</table>");
    return sb.ToString();
}
```

## 操作

### 设置单元格注解

```csharp
var worksheet = excelPackage.Workbook.Worksheets[0];

foreach (var item in result.RowErrors)
    foreach (var cell in item.CellErrors)
    {
        var setCell = worksheet.Cells[item.RowIndex, cell.ColumnIndex];
        setCell.Style.Font.Color.SetColor(Color.Red);
        setCell.Style.Font.Bold = true;
        setCell.Style.Fill.PatternType = ExcelFillStyle.Solid;
        setCell.Style.Fill.BackgroundColor.SetColor(Color.Beige);
        setCell.AddComment(string.Join(",", cell.Error), "whx");
    }
result.Content = excelPackage.GetAsByteArray(); // 导出excel
```

## 资料

[https://mp.weixin.qq.com/s/tRVzBBv6Q6jdhcap6Jmq_g](https://mp.weixin.qq.com/s/tRVzBBv6Q6jdhcap6Jmq_g) | EPPlus导出Excel感觉很不错
