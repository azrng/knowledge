---
title: NPOI
lang: zh-CN
date: 2023-07-09
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: npoi
slug: pfsx9u
docsId: '77617366'
---

## 概述

NPOI中N指代的是`.Net`，POI是一个完全开源的Java写成的库， 能够在没有安装微软Office或者相应环境的情况下读写Excel、Word等微软OLE2组件文档，几乎支持所有的Office97~Office2007的文件格式。所以NPOI就是POI项目的.Net版本。

## 操作方法

### 创建工作簿

```csharp
var sheet = workbook.CreateSheet("人才培训课程表");
```

### 创建指定行

```csharp
/// <summary>
/// TODO:先创建行，然后在创建对应的列
/// 创建Excel中指定的行
/// </summary>
/// <param name="sheet">Excel工作表对象</param>
/// <param name="rowNum">创建第几行(从0开始)</param>
/// <param name="rowHeight">行高</param>
public HSSFRow CreateRow(ISheet sheet, int rowNum, float rowHeight)
{
    HSSFRow row = (HSSFRow)sheet.CreateRow(rowNum); //创建行
    row.HeightInPoints = rowHeight; //设置列头行高
    return row;
}
```

### 创建行内指定的单元格

```csharp
/// <summary>
/// 创建行内指定的单元格
/// </summary>
/// <param name="row">需要创建单元格的行</param>
/// <param name="cellStyle">单元格样式</param>
/// <param name="cellNum">创建第几个单元格(从0开始)</param>
/// <param name="cellValue">给单元格赋值</param>
/// <returns></returns>
public HSSFCell CreateCells(HSSFRow row, HSSFCellStyle cellStyle, int cellNum, string cellValue)
{
    HSSFCell cell = (HSSFCell)row.CreateCell(cellNum); //创建单元格
    cell.CellStyle = cellStyle; //将样式绑定到单元格
    if (!string.IsNullOrWhiteSpace(cellValue))
    {
        //单元格赋值
        cell.SetCellValue(cellValue);
    }
    return cell;
}
```

### 指定合并的行列

```csharp
//TODO:关于Excel行列单元格合并问题(注意：合并单元格后，只需对第一个位置赋值即可)
/**
  第一个参数：从第几行开始合并
  第二个参数：到第几行结束合并
  第三个参数：从第几列开始合并
  第四个参数：到第几列结束合并
**/

CellRangeAddress region = new CellRangeAddress(0, 0, 0, 5);
sheet.AddMergedRegion(region);

cell.SetCellValue("人才培训课程表");
//TODO:顶部标题
```

### 设置单元格的列宽

```csharp
sheet.SetColumnWidth(单元格索引,1000);
//设置对应列宽（单元格索引从0开始，后面接宽度）
```

### 设置单元格的注解

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
result.Content = excelPackage.GetAsByteArray();
```

## 样式

### CellStyle单元格常用样式

```csharp
HSSFCellStyle cellStyle = (HSSFCellStyle)workbook.CreateCellStyle();
//创建列头单元格实例样式
cellStyle.Alignment = hAlignment;
//水平布局方式（HorizontalAlignment hAlignment）

cellStyle.VerticalAlignment = vAlignment;
//垂直布局方式（VerticalAlignment vAlignment）

cellStyle.WrapText =false;
//是否自动换行

//TODO:十分注意，要设置单元格背景色必须是FillForegroundColor和FillPattern两个属性同时设置，否则是不会显示背景颜色

//如下设置黄色背景色
cellStyle.FillForegroundColor = cellBackgroundColor;
//单元格背景颜色（short cellBackgroundColor = HSSFColor.Yellow.Index）

cellStyle.FillPattern = fillPattern;
//填充图案样式(FineDots 细点，SolidForeground立体前景，isAddFillPattern=true时存在（FillPattern fillPattern = FillPattern.SolidForeground）
//设置单元格边框样式
//常用的边框样式 None(没有),Thin(细边框，瘦的),Medium(中等),Dashed(虚线),Dotted(星罗棋布的),Thick(厚的),Double(双倍),Hair(头发)[上右下左顺序设置]

cellStyle.BorderBottom = BorderStyle.Thin;
cellStyle.BorderRight = BorderStyle.Thin;
cellStyle.BorderTop = BorderStyle.Thin;
cellStyle.BorderLeft = BorderStyle.Thin;

//设置单元格边框颜色[上右下左顺序设置]
cellStyle.TopBorderColor = HSSFColor.DarkGreen.Index;//DarkGreen(黑绿色)
cellStyle.RightBorderColor = HSSFColor.DarkGreen.Index;
cellStyle.BottomBorderColor = HSSFColor.DarkGreen.Index;
cellStyle.LeftBorderColor = HSSFColor.DarkGreen.Index;
```

### Font字体常用属性

```csharp
var cellStyleFont = (HSSFFont)workbook.CreateFont()
//创建字体对象实例
//假如字体大小只需要是粗体的话直接使用下面该属性即可
cellStyleFont.IsBold = true;

//或者通过下面属性，设置字体weight来设置字体是否加粗
cellStyleFont.Boldweight = boldWeight;
//字体加粗（字体加粗 (None = 0,Normal = 400，Bold = 700）

cellStyleFont.FontHeightInPoints = fontHeightInPoints;
//字体大小（short fontHeightInPoints）

cellStyleFont.FontName = fontName;
//字体（仿宋，楷体，宋体 ）

cellStyleFont.Color = fontColor;
//设置字体颜色（short fontColor = HSSFColor.Black.Index）

cellStyleFont.IsItalic =true;
//是否将文字变为斜体（true是，false否）

cellStyleFont.Underline = underlineStyle;
//字体下划线（下划线样式（无下划线[None],单下划线[Single],双下划线[Double],会计用单下划线[SingleAccounting],会计用双下划线[DoubleAccounting]））

cellStyleFont.TypeOffset = typeOffset;
//字体上标下标（字体上标下标(普通默认值[None],上标[Sub],下标[Super]),即字体在单元格内的上下偏移量）

cellStyleFont.IsStrikeout =true;
//是否显示删除线（true显示，false不显示）
```

## 示例

安装nuget包

```csharp
<PackageReference Include="NPOI" Version="2.5.5" />
```

新建一个控制器ExcelSampleController,在该控制器中实例化公共类

```csharp
private readonly NPOIHelper _nPOIHelper;

public ExcelSampleController()
{
    _nPOIHelper = new NPOIHelper();
}
```

在该控制器里面新建两个action

### 导出Excel

```sql
[HttpGet]
public ActionResult ExportUser()
{
    var dic = new Dictionary<string, string>
    {
        {"Id", "Id"},
        {"Account", "帐号"},
        {"PassWord", "密码"},
        {"Name", "姓名"},
        {"Sex", "性别"},
        {"Credit", "积分"}
    };

    var userList = UserService.GetUserList();
    var bytes = _nPOIHelper.ExportExcel<User>(userList, dic, "测试");
    return File(bytes, "application/ms-excel", $"{DateTime.Now:yyyyMMddHHmmss}.xlsx");
}
```

### 导入Excel

```csharp
[HttpPost]
public ActionResult<bool> ImportUser(IFormFile file)
{
    var dic = new Dictionary<string, string>
    {
        {"Id", "Id"},
        {"Account", "帐号"},
        {"PassWord", "密码"},
        {"Name", "姓名"},
        {"Sex", "性别"},
        {"Credit", "积分"}
    };

    var list = _nPOIHelper.ImportExcel<User>(file.OpenReadStream(), dic, 0);
    return list.Count > 0;
}
```

### Excel导出PDF

```csharp
public static void ConvertExcelToPdf2(string excelFilePath, string pdfFilePath)
{
    Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);
    // 加载Excel文件
    using (FileStream fileStream = new FileStream(excelFilePath, FileMode.Open, FileAccess.Read))
    {
        IWorkbook workbook = new XSSFWorkbook(fileStream);
        ISheet sheet = workbook.GetSheetAt(0);
        // 创建PDF文档
        Document document = new Document();
        // 创建PDF写入器
        PdfWriter writer = PdfWriter.GetInstance(document, new FileStream(pdfFilePath, FileMode.Create));
        // 打开PDF文档
        document.Open();
        // 添加Excel表格内容到PDF
        PdfPTable table = new PdfPTable(sheet.GetRow(0).LastCellNum);
        table.WidthPercentage = 100;

        foreach (IRow row in sheet)
        {
            foreach (ICell cell in row)
            {
                string value = cell.ToString();
                PdfPCell pdfCell = new PdfPCell(new Phrase(value, GetChineseFont()));
                table.AddCell(pdfCell);
            }
        }
        document.Add(table);
        // 关闭PDF文档
        document.Close();
    }
    Console.WriteLine("PDF转换完成。");
}
static Font GetChineseFont()
{
    var baseFont = BaseFont.CreateFont(@"C:\Windows\Fonts\simfang.ttf", BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
    return new Font(baseFont, 12);
}
```

默认不支持中文，需要我们单独引用中文字库，方法GetChineseFont就是处理引用中文字库。另外需要需要在 NuGet 里添加 System.Text.Encoding.CodePages并注册，否则会报错，注册如下

```csharp
Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);
```

### 转HTML
资料：[https://www.cnblogs.com/liwenyan/p/11768230.html](https://www.cnblogs.com/liwenyan/p/11768230.html)
github：[https://github.com/ToolsByXLG/NPOI.Word2Html](https://github.com/ToolsByXLG/NPOI.Word2Html)

## 部署

### Linux

需要安装libgdiplus，否则提示错误信息

```csharp
System.TypeInitializationException: The type initializer for 'Gdip' threw an exception.
---> System.DllNotFoundException: Unable to load shared library 'libgdiplus' or one of its dependencies. In order to help diagnose loading problems, consider setting the LD_DEBUG environment variable: liblibgdiplus: cannot open shared object file: No such file or directory
at System.Drawing.SafeNativeMethods.Gdip.GdiplusStartup(IntPtr& token, StartupInput& input, StartupOutput& output)
at System.Drawing.SafeNativeMethods.Gdip..cctor()
```

如果是docker部署，那么需要在dockerfile里面增加配置

```csharp
FROM docker.sh.synyi.com/dotnet/core/aspnet:3.1 AS base

RUN sed -i -e "s@http://[^/]* @http://mirror.sy/debian-security @" -e "s@http://[^/]*/@http://mirror.sy/@" /etc/apt/sources.list && apt update && apt install -y nodejs 

RUN apt update && apt-get install libgdiplus -y && ln -s /usr/lib/libgdiplus.so /usr/lib/gdiplus.dll
```

## 公共类

```csharp
/// <summary>
///  Excel操作类
/// </summary>
public class NPOIHelper
{
    /// <summary>
    /// 导出Excel
    /// </summary>
    /// <param name="data"></param>
    /// <param name="columns">Excel和T属性映射关系{propName,columnName}</param>
    /// <param name="sheetName"></param>
    /// <returns></returns>
    public byte[] ExportExcel<T>(List<T> data, Dictionary<string, string> columns, string sheetName = null)
    {
        columns ??= new Dictionary<string, string>();
        if (data != null && columns.Count > 0)
        {
            IWorkbook workbook = new XSSFWorkbook();
            ISheet sheet = workbook.CreateSheet(sheetName ?? "Sheet1");
            ExportToSheet(sheet, data, columns);
            var ms = new MemoryStream();
            workbook.Write(ms);
            return ms.ToArray();
        }

        return null;
    }

    /// <summary>
    /// 从Excel解析数据
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <param name="excelStream"></param>
    /// <param name="columns">Excel和T属性映射关系{propName,columnName}</param>
    /// <param name="headerIndex"></param>
    /// <returns></returns>F
    public List<T> ImportExcel<T>(Stream excelStream, Dictionary<string, string> columns, int headerIndex = 0)
        where T : new()
    {
        columns ??= new Dictionary<string, string>();
        if (excelStream == null || columns.Count == 0)
        {
            return new List<T>();
        }

        var list = new List<T>();

        var workBook = CreateWorkbook(excelStream);
        ISheet sheet = workBook.GetSheetAt(0);

        var dicIndexer = GetPropertyInfoInderxer<T>(sheet.GetRow(headerIndex), columns);

        int lastRowNum = sheet.LastRowNum;

        for (int i = headerIndex + 1; i <= lastRowNum; i++)
        {
            var row = sheet.GetRow(i);
            if (row == null)
                continue;

            T obj = new();
            foreach (var item in dicIndexer)
            {
                try
                {
                    object val = GetCellValue(row.GetCell(item.Key), item.Value.PropertyType);
                    if (val != null)
                    {
                        item.Value.SetValue(obj, val, null);//属性赋值
                    }
                }
                catch
                {
                }
            }
            list.Add(obj);
        }

        return list;
    }

    /// <summary>
    /// 导出Excel(mutiple sheets）
    /// </summary>
    /// <param name="dtList"></param>
    /// <param name="sheetColumns"></param>
    /// <returns></returns>
    public byte[] ExportMutiple(List<DataTable> dtList, Dictionary<string, Dictionary<string, string>> sheetColumns)
    {
        IWorkbook workbook = new XSSFWorkbook();
        sheetColumns ??= new Dictionary<string, Dictionary<string, string>>();
        if (dtList != null && sheetColumns.Count > 0)
        {
            if (sheetColumns.Count > 0)
            {
                int i = 0;
                foreach (var name in sheetColumns)
                {
                    ISheet sheet = workbook.CreateSheet(name.Key ?? "Sheet1");
                    ExportToMultipleSheet(sheet, dtList[i], name.Value);
                    i++;
                }
            }

            var ms = new MemoryStream();
            workbook.Write(ms);
            return ms.ToArray();
        }
        else
        {
            if (sheetColumns.Count > 0)
            {
                int i = 0;
                foreach (var name in sheetColumns)
                {
                    ISheet sheet = workbook.CreateSheet(name.Key ?? "Sheet1");
                    ExportToEmptySheet(sheet, name.Value);
                    i++;
                }
            }
            var ms = new MemoryStream();
            workbook.Write(ms);
            return ms.ToArray();
        }
    }

    /// <summary>
    /// 列表转为DataTable
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <param name="data"></param>
    /// <returns></returns>
    public DataTable ToDataTable<T>(List<T> data)
    {
        DataTable table = new();
        if (data?.Count > 0)
        {
            var props = TypeDescriptor.GetProperties(typeof(T));
            for (int i = 0; i < props.Count; i++)
            {
                PropertyDescriptor prop = props[i];
                table.Columns.Add(prop.Name, prop.PropertyType);
            }
            object[] values = new object[props.Count];
            foreach (T item in data)
            {
                for (int i = 0; i < values.Length; i++)
                {
                    values[i] = props[i].GetValue(item);
                }
                table.Rows.Add(values);
            }
        }
        return table;
    }

    /// <summary>
    /// 将excel导入到datatable
    /// </summary>
    /// <param name="filePath">excel路径</param>
    /// <param name="dataRowIndex">数据起始行下标</param>
    /// <param name="titleRowIndex">标题起始行下标</param>
    /// <returns>返回datatable</returns>
    public DataTable ExcelToDataTable(string filePath, int dataRowIndex = 1, int titleRowIndex = 0)
    {
        DataTable ExcelTable = null;
        FileStream fs = null;
        IWorkbook workbook = null;
        ISheet sheet = null;
        try
        {
            using (fs = new FileStream(filePath, FileMode.Open, FileAccess.Read))
            {
                // 解决版本兼容
                workbook = CreateWorkbook(fs);
                if (workbook == null)
                    return new DataTable();

                sheet = workbook.GetSheetAt(0);//读取第一个sheet
                ExcelTable = new DataTable();
                if (sheet == null)
                    return new DataTable();

                int rowCount = sheet.LastRowNum;//总行数
                if (rowCount == 0)
                    return new DataTable();

                IRow firstRow = sheet.GetRow(titleRowIndex);//第一行
                int cellCount = firstRow.LastCellNum;//列数

                //创建datatable的列
                for (int i = firstRow.FirstCellNum; i < cellCount; ++i)
                {
                    ICell cell = firstRow.GetCell(i);
                    if (cell?.StringCellValue != null)
                    {
                        var column = new DataColumn(cell.StringCellValue);
                        ExcelTable.Columns.Add(column);
                    }
                }

                //填充datatable行
                for (int i = dataRowIndex; i <= rowCount; ++i)
                {
                    IRow row = sheet.GetRow(i);
                    if (row == null) continue;

                    DataRow dataRow = ExcelTable.NewRow();
                    for (int j = row.FirstCellNum; j < cellCount; ++j)
                    {
                        ICell cell = row.GetCell(j);
                        if (cell == null)
                        {
                            dataRow[j] = "";
                        }
                        else
                        {
                            switch (cell.CellType)
                            {
                                case CellType.Blank:
                                    dataRow[j] = "";
                                    break;

                                case CellType.Numeric:
                                    short format = cell.CellStyle.DataFormat;
                                    //对时间格式的处理
                                    if (format == 14 || format == 31 || format == 57 || format == 58)
                                        dataRow[j] = cell.DateCellValue;
                                    else if (format == 20)
                                        dataRow[j] = cell.DateCellValue.TimeOfDay;
                                    else
                                        dataRow[j] = cell.NumericCellValue;
                                    break;

                                case CellType.String:
                                    dataRow[j] = cell.StringCellValue;
                                    break;
                            }
                        }
                    }

                    ExcelTable.Rows.Add(dataRow);
                }
            }
            //由于excel表在删除一张表的时候回再次读取回出现空行的原因
            //所以需要一个删除空行的方法⇣⇣⇣⇣
            List<DataRow> removelist = new();
            for (int i = 0; i < ExcelTable.Rows.Count; i++)
            {
                bool IsNull = true;
                for (int j = 0; j < ExcelTable.Columns.Count; j++)
                {
                    if (!string.IsNullOrEmpty(ExcelTable.Rows[i][j].ToString().Trim()))
                    {
                        IsNull = false;
                    }
                }
                if (IsNull)
                {
                    removelist.Add(ExcelTable.Rows[i]);
                }
            }
            for (int i = 0; i < removelist.Count; i++)
            {
                ExcelTable.Rows.Remove(removelist[i]);
            }
            removelist.Clear();

            return ExcelTable;
        }
        catch (Exception)
        {
            fs?.Close();
            return null;
        }
    }

    #region 私有方法

    /// <summary>
    ///创建Workbook
    /// </summary>
    /// <param name="stream"></param>
    /// <returns></returns>
    private IWorkbook CreateWorkbook(Stream stream)
    {
        try
        {
            return new XSSFWorkbook(stream); //07
        }
        catch
        {
            return new HSSFWorkbook(stream); //03
        }
    }

    /// <summary>
    /// 获取单元格的值
    /// </summary>
    /// <param name="cell"></param>
    /// <param name="valueType"></param>
    /// <returns></returns>
    private object GetCellValue(ICell cell, Type valueType)
    {
        if (cell == null) return null;
        string value = cell.ToString();//cell.ToString()即可获取string Value
        if (cell.CellType == CellType.Numeric && valueType.AssemblyQualifiedName.Contains("System.DateTime"))
        {
            if (cell.DateCellValue.CompareTo(new DateTime(1900, 1, 1)) == 0) return null;
            return cell.DateCellValue;
        }
        if (!string.IsNullOrEmpty(value))
        {
            return Convert.ChangeType(value, valueType);
        }

        return value;
    }

    /// <summary>
    /// 属性和Excel Column索引关系
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <param name="row"></param>
    /// <param name="columns"></param>
    /// <returns></returns>
    private Dictionary<int, PropertyInfo> GetPropertyInfoInderxer<T>(IRow row,
        Dictionary<string, string> columns)
    {
        var dicIndexer = new Dictionary<int, PropertyInfo>();

        if (row == null)
        {
            throw new Exception("header row is null");
        }

        var props = typeof(T).GetProperties();
        for (int i = 0; i < row.LastCellNum; i++)
        {
            var cellValue = row.Cells[i].StringCellValue;
            if (cellValue != null)
            {
                foreach (var item in columns)
                {
                    if (string.Equals(item.Value, cellValue, StringComparison.CurrentCultureIgnoreCase))
                    {
                        //匹配属性
                        var prop = Array.Find(props, p => string.Equals(p.Name, item.Key, StringComparison.CurrentCultureIgnoreCase));
                        if (prop != null)
                        {
                            dicIndexer.Add(i, prop);
                        }
                        break;
                    }
                }
            }
        }

        return dicIndexer;
    }

    /// <summary>
    /// 导出到单元簿
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <param name="sheet"></param>
    /// <param name="data"></param>
    /// <param name="columns"></param>
    private void ExportToSheet<T>(ISheet sheet, List<T> data, Dictionary<string, string> columns)
    {
        IRow headerRow = sheet.CreateRow(0);

        var dicIndexer = new Dictionary<int, PropertyInfo>();
        var props = typeof(T).GetProperties();
        //设置标题行
        int i = 0;
        foreach (var item in columns)
        {
            headerRow.CreateCell(i).SetCellValue(item.Value);

            //匹配属性
            var prop = Array.Find(props, p => string.Equals(p.Name, item.Key, StringComparison.CurrentCultureIgnoreCase));
            if (prop != null)
            {
                dicIndexer.Add(i, prop);
                i++;
            }
        }

        //填充数据
        for (i = 0; i < data.Count; i++)
        {
            var row = sheet.CreateRow(i + 1);
            foreach (var item in dicIndexer)
            {
                var value = item.Value.GetValue(data[i]);
                if (value != null)
                    row.CreateCell(item.Key).SetCellValue(value.ToString());
            }
        }
    }

    /// <summary>
    /// 导出空的单元簿
    /// </summary>
    /// <param name="sheet"></param>
    /// <param name="columns"></param>
    private void ExportToEmptySheet(ISheet sheet, Dictionary<string, string> columns)
    {
        IRow headerRow = sheet.CreateRow(0);
        //设置标题行
        int i = 0;
        foreach (var item in columns)
        {
            headerRow.CreateCell(i).SetCellValue(item.Value);
            i++;
        }
    }

    /// <summary>
    /// 导出多个单元薄
    /// </summary>
    /// <param name="sheet"></param>
    /// <param name="data"></param>
    /// <param name="columns"></param>
    private void ExportToMultipleSheet(ISheet sheet, DataTable data, Dictionary<string, string> columns)
    {
        //设置标题行
        var i = 0;
        IRow headerRow = sheet.CreateRow(0);
        foreach (var item in columns)
        {
            headerRow.CreateCell(i).SetCellValue(item.Value);
            i++;
        }
        int count = 1;

        //填充数据
        for (i = 0; i < data.Rows.Count; i++)
        {
            var row = sheet.CreateRow(0);
            int j;
            for (j = 0; j < data.Columns.Count; ++j)
            {
                row.CreateCell(j).SetCellValue(data.Rows[i][j].ToString());
            }
            ++count;
        }
    }

    #endregion
}
```



NPOI之Excel数据导出帮助类（创建Excel表格行列，设置行高，设置字体样式，单元格边框样式，单元格背景颜色和样式，单元格内容对齐方式等常用属性和样式封装）

```csharp
using NPOI.HSSF.UserModel;
using NPOI.SS.UserModel;
using NPOI.HSSF.Util;

namespace YY_Utility
{
    public class NpoiExcelExportHelper
    {
        private static NpoiExcelExportHelper _exportHelper;
        public static NpoiExcelExportHelper _
        {
            get => _exportHelper ?? (_exportHelper = new NpoiExcelExportHelper());
            set => _exportHelper = value;
        }
        /// <summary>
        /// TODO:先创建行，然后在创建对应的列
        /// 创建Excel中指定的行
        /// </summary>
        /// <param name="sheet">Excel工作表对象</param>
        /// <param name="rowNum">创建第几行(从0开始)</param>
        /// <param name="rowHeight">行高</param>
        public HSSFRow CreateRow(ISheet sheet, int rowNum, float rowHeight)
        {
            HSSFRow row = (HSSFRow)sheet.CreateRow(rowNum); //创建行
            row.HeightInPoints = rowHeight; //设置列头行高
            return row;
        }

        /// <summary>
        /// 创建行内指定的单元格
        /// </summary>
        /// <param name="row">需要创建单元格的行</param>
        /// <param name="cellStyle">单元格样式</param>
        /// <param name="cellNum">创建第几个单元格(从0开始)</param>
        /// <param name="cellValue">给单元格赋值</param>
        /// <returns></returns>
        public HSSFCell CreateCells(HSSFRow row, HSSFCellStyle cellStyle, int cellNum, string cellValue)
        {
            HSSFCell cell = (HSSFCell)row.CreateCell(cellNum); //创建单元格
            cell.CellStyle = cellStyle; //将样式绑定到单元格
            if (!string.IsNullOrWhiteSpace(cellValue))
            {
                //单元格赋值
                cell.SetCellValue(cellValue);
            }
            return cell;
        }

        /// <summary>
        /// 行内单元格常用样式设置
        /// </summary>
        /// <param name="workbook">Excel文件对象</param>
        /// <param name="hAlignment">水平布局方式</param>
        /// <param name="vAlignment">垂直布局方式</param>
        /// <param name="fontHeightInPoints">字体大小</param>
        /// <param name="isAddBorder">是否需要边框</param>
        /// <param name="boldWeight">字体加粗 (None = 0,Normal = 400，Bold = 700</param>
        /// <param name="fontName">字体（仿宋，楷体，宋体，微软雅黑...与Excel主题字体相对应）</param>
        /// <param name="isAddBorderColor">是否增加边框颜色</param>
        /// <param name="isItalic">是否将文字变为斜体</param>
        /// <param name="isLineFeed">是否自动换行</param>
        /// <param name="isAddCellBackground">是否增加单元格背景颜色</param>
        /// <param name="fillPattern">填充图案样式(FineDots 细点，SolidForeground立体前景，isAddFillPattern=true时存在)</param>
        /// <param name="cellBackgroundColor">单元格背景颜色（当isAddCellBackground=true时存在）</param>
        /// <param name="fontColor">字体颜色</param>
        /// <param name="underlineStyle">下划线样式（无下划线[None],单下划线[Single],双下划线[Double],会计用单下划线[SingleAccounting],会计用双下划线[DoubleAccounting]）</param>
        /// <param name="typeOffset">字体上标下标(普通默认值[None],上标[Sub],下标[Super]),即字体在单元格内的上下偏移量</param>
        /// <param name="isStrikeout">是否显示删除线</param>
        /// <returns></returns>
        public HSSFCellStyle CreateStyle(HSSFWorkbook workbook, HorizontalAlignment hAlignment, VerticalAlignment vAlignment, short fontHeightInPoints, bool isAddBorder, short boldWeight, string fontName = "宋体", bool isAddBorderColor = true, bool isItalic = false, bool isLineFeed = false, bool isAddCellBackground = false, FillPattern fillPattern = FillPattern.NoFill, short cellBackgroundColor = HSSFColor.Yellow.Index, short fontColor = HSSFColor.Black.Index, FontUnderlineType underlineStyle =
            FontUnderlineType.None, FontSuperScript typeOffset = FontSuperScript.None, bool isStrikeout = false)
        {
            HSSFCellStyle cellStyle = (HSSFCellStyle)workbook.CreateCellStyle(); //创建列头单元格实例样式
            cellStyle.Alignment = hAlignment; //水平居中
            cellStyle.VerticalAlignment = vAlignment; //垂直居中
            cellStyle.WrapText = isLineFeed;//自动换行
            //背景颜色，边框颜色，字体颜色都是使用 HSSFColor属性中的对应调色板索引，关于 HSSFColor 颜色索引对照表，详情参考：https://www.cnblogs.com/Brainpan/p/5804167.html
           //TODO：引用了NPOI后可通过ICellStyle 接口的 FillForegroundColor 属性实现 Excel 单元格的背景色设置，FillPattern 为单元格背景色的填充样式
            //TODO:十分注意，要设置单元格背景色必须是FillForegroundColor和FillPattern两个属性同时设置，否则是不会显示背景颜色
            if (isAddCellBackground)
            {
                cellStyle.FillForegroundColor = cellBackgroundColor;//单元格背景颜色
                cellStyle.FillPattern = fillPattern;//填充图案样式(FineDots 细点，SolidForeground立体前景)
            }
            //是否增加边框
            if (isAddBorder)
            {
                //常用的边框样式 None(没有),Thin(细边框，瘦的),Medium(中等),Dashed(虚线),Dotted(星罗棋布的),Thick(厚的),Double(双倍),Hair(头发)[上右下左顺序设置]
                cellStyle.BorderBottom = BorderStyle.Thin;
                cellStyle.BorderRight = BorderStyle.Thin;
                cellStyle.BorderTop = BorderStyle.Thin;
                cellStyle.BorderLeft = BorderStyle.Thin;
            }
            //是否设置边框颜色
            if (isAddBorderColor)
            {
                //边框颜色[上右下左顺序设置]
                cellStyle.TopBorderColor = HSSFColor.DarkGreen.Index;//DarkGreen(黑绿色)
                cellStyle.RightBorderColor = HSSFColor.DarkGreen.Index;
                cellStyle.BottomBorderColor = HSSFColor.DarkGreen.Index;
                cellStyle.LeftBorderColor = HSSFColor.DarkGreen.Index;
            }
            /**
             * 设置相关字体样式
             */
            var cellStyleFont = (HSSFFont)workbook.CreateFont(); //创建字体

            //假如字体大小只需要是粗体的话直接使用下面该属性即可
            //cellStyleFont.IsBold = true;

            cellStyleFont.Boldweight = boldWeight; //字体加粗
            cellStyleFont.FontHeightInPoints = fontHeightInPoints; //字体大小
            cellStyleFont.FontName = fontName;//字体（仿宋，楷体，宋体 ）
            cellStyleFont.Color = fontColor;//设置字体颜色
            cellStyleFont.IsItalic = isItalic;//是否将文字变为斜体
            cellStyleFont.Underline = underlineStyle;//字体下划线
            cellStyleFont.TypeOffset = typeOffset;//字体上标下标
            cellStyleFont.IsStrikeout = isStrikeout;//是否有删除线
            cellStyle.SetFont(cellStyleFont); //将字体绑定到样式
            return cellStyle;
        }
    }
}
```

## Issue

```csharp
var workBook = new XSSFWorkbook();

var sheet = workBook.CreateSheet();
sheet.DefaultRowHeight = 20 * 40;//设置默认行高 40

for (int i = 0; i < 6; i++)
{
    var row = sheet.CreateRow(i);
    row.CreateCell(0).SetCellValue($"测试 {i}");

    if (i == 0)
    {
        row.Height = 30 * 20;
    }
}

for (int i = 0; i < 6; i++)
{
    var row = sheet.GetRow(i);
    Console.WriteLine(row.Height); // 600 800 800 ..  但是当我导出的时候行高不是这样子的
}


using var outStream = new FileStream($"d:\\docs\\{DateTime.Now:ddHHmmss}.xlsx", FileMode.OpenOrCreate, FileAccess.Write);
workBook.Write(outStream);
workBook.Close();

//如果在循环的时候给其中一行设置行高，那么原始的默认行高度就不再生效了
//示例：上面我给设置默认行高是40，然后我在循环的时候给第一行设置为30，那么出来的excel第一行是30，其他行都是14+
//如果我将第一行高度设置为30的代码注释，那么导出的excel每行都是40
```

## 资料

.NET Core使用NPOI导出复杂Word详解：[https://mp.weixin.qq.com/s/NV298K8MGFWvXnsIk-WPgQ](https://mp.weixin.qq.com/s/NV298K8MGFWvXnsIk-WPgQ)

[https://mp.weixin.qq.com/s/z06J4bzaahZWfJSdr-1RZA](https://mp.weixin.qq.com/s/z06J4bzaahZWfJSdr-1RZA) | .NET Core使用NPOI导出复杂，美观的Excel详解

.NET Core使用NPOI导出复杂，美观的Excel详解：[https://www.cnblogs.com/Can-daydayup/p/12501400.html](https://www.cnblogs.com/Can-daydayup/p/12501400.html)
