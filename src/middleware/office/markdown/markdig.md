---
title: Markdig
lang: zh-CN
date: 2023-04-01
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: markdig
slug: uvume8
docsId: '90167322'
---

## 概述
Markdig 是一款快速、功能强大、符合 [CommonMark](http://commonmark.org/) 标准、可扩展的 Markdown 处理器，适用于 .NET。

下载量：10M 最后更新时间：12天前

## 操作
安装nuget包
```csharp
 <PackageReference Include="Markdig" Version="0.30.3" />
```

### 无参数转换为HTML
默认情况下，没有任何选项，Markdig使用的是普通的CommonMark解析器：
```csharp
var result = Markdown.ToHtml("## 张三 \r\n ### 李思");
Console.WriteLine(result); 

-- 输出结果
<h1>张三</h1>
<h2>李思</h2>
```
经过测试，转换后图片、文字都存在，只不过代码块样式没了

转换表格
```csharp
var str=@"| 姓名 | 性别 | 年级 |
| ---- | ---- | ---- |
| 张三 | 男   | 10   |
| 李四 | 女   | 20   |
| 王五 | 男   | 30   |";
var result1 = Markdown.ToHtml(str);
Console.WriteLine(result1);


// 输出结果
<p>| 姓名 | 性别 | 年级 |
| ---- | ---- | ---- |
| 张三 | 男   | 10   |
| 李四 | 女   | 20   |
| 王五 | 男   | 30   |</p>
```
![image.png](/common/1661053412090-bbee335e-1dae-4c96-8c28-f207f7877b88.png)
所以在默认配置的情况下转换表格是存在问题的。

### 高级扩展
使用大多数高级扩展（除了表情符号，SoftLine作为HardLine，Bootstrap，YAML Front Matter，JiraLinks和SmartyPants）
```csharp
var str = @"| 姓名 | 性别 | 年级 |
| ---- | ---- | ---- |
| 张三 | 男   | 10   |
| 李四 | 女   | 20   |
| 王五 | 男   | 30   |";

var pipeline = new MarkdownPipelineBuilder().UseAdvancedExtensions().Build();
var result1 = Markdown.ToHtml(str, pipeline);
Console.WriteLine(result1);

File.WriteAllText("d://aa.html", result1);

-- 输出结果
<table>
<thead>
<tr>
<th>姓名</th>
<th>性别</th>
<th>年级</th>
</tr>
</thead>
<tbody>
<tr>
<td>张三</td>
<td>男</td>
<td>10</td>
</tr>
<tr>
<td>李四</td>
<td>女</td>
<td>20</td>
</tr>
<tr>
<td>王五</td>
<td>男</td>
<td>30</td>
</tr>
</tbody>
</table>
```
![image.png](/common/1661053380079-ef5aa986-042d-4980-ae25-012a6c2135d4.png)

### 单独添加表格扩展
```csharp
var str = @"| 姓名 | 性别 | 年级 |
| ---- | ---- | ---- |
| 张三 | 男   | 10   |
| 李四 | 女   | 20   |
| 王五 | 男   | 30   |";
var builder = (new MarkdownPipelineBuilder());
builder.Extensions.Add(new PipeTableExtension());
var pipeline = builder.Build();
Console.WriteLine(Markdown.ToHtml(str,pipeline));
```

### 解析Markdown

#### 解析表格
从网上摘抄的一个解析表格的示例
```csharp
var builder = (new MarkdownPipelineBuilder());
builder.Extensions.Add(new PipeTableExtension());
var pipeline = builder.Build();

var doc = Markdown.Parse("### 标题2 \r\n \r\n" +
"|表头1|表头2|\r\n" +
"|-----|-----|\r\n" +
"|行1列1|行1列2|\r\n" +
"|行2列1|行2列2|\r\n",
pipeline);
for (int i = 0; i < doc.Count; i++)
{
    var b = doc[i];
    if (b is HeadingBlock)
    {
        var heading = (Markdig.Syntax.HeadingBlock)b;
        Console.WriteLine(heading.Level);
        var containerInline = heading.Inline;
        var literalInline = containerInline.FirstChild as Markdig.Syntax.Inlines.LiteralInline;
        var stringSlice = literalInline.Content;

        Console.WriteLine(stringSlice.Text.Substring(stringSlice.Start, stringSlice.Length));
    }
    else if (b is Table)
    {
        var table = (Table)b;
        for (int j = 0; j < table.Count; j++)
        {
            var row = (TableRow)table[j];
            for (int k = 0; k < row.Count; k++)
            {
                var cell = (TableCell)row[k];
                var containerInline = ((LeafBlock)cell[0]).Inline;
                var literalInline = containerInline.FirstChild as Markdig.Syntax.Inlines.LiteralInline;
                var stringSlice = literalInline.Content;

                Console.WriteLine(stringSlice.Text.Substring(stringSlice.Start, stringSlice.Length));
            }
        }
    }
}
```
