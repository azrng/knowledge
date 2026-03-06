---
title: QuestPDF
lang: zh-CN
date: 2023-06-24
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: questpdf
slug: tukgfx
docsId: '74879308'
---

## 概述
QuestPDF 是一个现代化的开源 .NET 库，用于生成PDF文档。它提供了一套强大的 API，使开发人员能够使用 C#语言来创建、编辑和处理 PDF 文件。QuestPDF 提供了丰富的功能，包括布局引擎、多平台支持、高级语言支持、文本样式控制、图像插入、表格和列表、链接和书签、字体和颜色管理、PDF 文件合并和拆分等。
最近更新：2023.05.03
下载量：1.71M(2023年6月24日)

## 为什么使用

- 强有力的布局引擎：Quest PDF 提供了专为文档生成设计的布局引擎，提供完整的分页支持，内容的高度控制。
- 支持多个平台：Quest PDF 支持多个平台，包括 Windows、Linux、macOS，以及通过 WebAssembly 运行。
- Fluent API：Quest采用了 FluentAPI 代码风格，使代码更简洁易懂。
- 代码复用：在布局过程中可以实现代码复用。
- 维护便利性：使用纯C#代码来实现，而不依赖于二进制格式或复杂 HTML。
- 热加载：无需重新编译代码即可实时预览。
- 高性能：Quest PDF 具有高性能和使用资源比较低特性，每核每分钟生成高达1000个 PDF 文件，整个处理过程是线程安全。

## 操作

引用组件
```csharp
QuestPDF
```

### 简单例子
生成PDF文档一共分为三个部分，页眉（页），内容（内容），页脚（页脚）
```csharp
Document.Create(container =>
{
    container.Page(page =>
    {
        page.Size(PageSizes.A4);
        page.Margin(2, Unit.Centimetre);
        page.Background(Colors.White);
        page.DefaultTextStyle(x => x.FontSize(20));
        
        page.Header()
            .Text("Hello PDF!")
            .SemiBold().FontSize(36).FontColor(Colors.Blue.Medium);
        
        page.Content()
            .PaddingVertical(1, Unit.Centimetre)
            .Column(x =>
            {
                x.Spacing(20);
                
                x.Item().Text(Placeholders.LoremIpsum());
                x.Item().Image(Placeholders.Image(200, 100));
            });
        
        page.Footer()
            .AlignCenter()
            .Text(x =>
            {
                x.Span("Page ");
                x.CurrentPageNumber();
            });
    });
})
.GeneratePdf("hello.pdf");
```

### 模板生成
使用模板生成一共设计三个应用层的工作：

- 文档模型(一组描述PDF内容的类)
- 数据文档源（将域映射到模型的层）
- 模板（描述如何可视化信息）并将其转换为 PDF 文件的表示层

例如要设计一个基本的发票信息，设计一个购物清单，一个卖家我们的地址，以及发票编号等等我们设计这样的3个模型类
```csharp
 public class InvoiceModel
    {
        public int InvoiceNumber { get; set; }
        public DateTime IssueDate { get; set; }
        public DateTime DueDate { get; set; }

        public Address SellerAddress { get; set; }
        public Address CustomerAddress { get; set; }

        public List<OrderItem> Items { get; set; }
        public string Comments { get; set; }
    }

    public class OrderItem
    {
        public string Name { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
    }

    public class Address
    {
        public string CompanyName { get; set; }
        public string Street { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public object Email { get; set; }
        public string Phone { get; set; }
    }
```
模型定义之后我们就定义一些假数据来填充pdf
```csharp
public static class InvoiceDocumentDataSource
    {
        private static Random Random = new Random();

        public static InvoiceModel GetInvoiceDetails()
        {
            var items = Enumerable
                .Range(1, 8)
                .Select(i => GenerateRandomOrderItem())
                .ToList();

            return new InvoiceModel
            {
                InvoiceNumber = Random.Next(1_000, 10_000),
                IssueDate = DateTime.Now,
                DueDate = DateTime.Now + TimeSpan.FromDays(14),

                SellerAddress = GenerateRandomAddress(),
                CustomerAddress = GenerateRandomAddress(),

                Items = items,
                Comments ="测试备注"
            };
        }

        private static OrderItem GenerateRandomOrderItem()
        {
            return new OrderItem
            {
                Name = "商品",
                Price = (decimal)Math.Round(Random.NextDouble() * 100, 2),
                Quantity = Random.Next(1, 10)
            };
        }

        private static Address GenerateRandomAddress()
        {
            return new Address
            {
                CompanyName = "测试商店",
                Street = "测试街道",
                City = "测试城市",
                State = "测试状态",
                Email = "测试邮件",
                Phone = "测试电话"
            };
        }
    }
```

- **文档元数据 GetMetadata();**
- **无效撰写（IDocumentContainer 容器）**

第一个是文档的一些信息第二个是模板的包含基于这些基础模板原则我们设计一个模板层类
```csharp
 public class InvoiceDocument : IDocument
    {
        public InvoiceModel Model { get; }

        public InvoiceDocument(InvoiceModel model)
        {
            Model = model;
        }

        public DocumentMetadata GetMetadata() => DocumentMetadata.Default;

        public void Compose(IDocumentContainer container)
        {
            container
                .Page(page =>
                {
                    page.PageColor(Colors.Red.Lighten1);
                    page.Size(PageSizes.A4);
                    page.Margin(10);//外边距

      
                    page.Header().Height(100).Background(Colors.LightBlue.Lighten1);
                    page.Content().Background(Colors.Grey.Lighten3);
                    page.Footer().Height(50).Background(Colors.Grey.Lighten1);
                });
        }
}
```
pdf的页面页面总是有三个元素：页眉，页脚，内容。查看我们生成的文档,过去，我们已经有不同的颜色了，其中每个人都有简单或大小

我们来填充他的页眉，我们把数据源整理好之后，就可以调用元素方法填充
```csharp
 public void Compose(IDocumentContainer container)
        {
            container
                .Page(page =>
                {
                    page.PageColor(Colors.Red.Lighten1);
                    page.Size(PageSizes.A4);
                    page.Margin(10);//外边距

      
                    page.Header().Height(100).Background(Colors.LightBlue.Lighten1).Element(ComposeHeader);
                    page.Content().Background(Colors.Grey.Lighten3);
                    page.Footer().Height(50).Background(Colors.Grey.Lighten1);
                });
        }


        void ComposeHeader(IContainer container)
        {
            var titleStyle = TextStyle.Default.FontSize(20).SemiBold().FontColor(Colors.Blue.Medium);

            container.Row(row =>
            {
                row.RelativeItem().Column(column =>
                {
                    column.Item().Text($"发票 #{Model.InvoiceNumber}").FontFamily("simhei").Style(titleStyle);

                    column.Item().Text(text =>
                    {
                        text.Span("发行日期: ").SemiBold().FontFamily("simhei");
                        text.Span($"{Model.IssueDate:d}").FontFamily("simhei");
                    });

                    column.Item().Text(text =>
                    {
                        text.Span("支付日期: ").FontFamily("simhei").SemiBold();
                        text.Span($"{Model.DueDate:d}").FontFamily("simhei");
                    });

                })
                ;

            });
        }
```
最后我们来实现内容，
```csharp
 public void Compose(IDocumentContainer container)
        {
            container
                .Page(page =>
                {
                    page.PageColor(Colors.Red.Lighten1);
                    page.Size(PageSizes.A4);
                    page.Margin(10);//外边距

      
                    page.Header().Height(100).Background(Colors.LightBlue.Lighten1).Element(ComposeHeader);
                    page.Content().Background(Colors.Grey.Lighten3).Element(ComposeContent);
                    page.Footer().Height(50).Background(Colors.Grey.Lighten1);
                });
        }


        void ComposeHeader(IContainer container)
        {
            var titleStyle = TextStyle.Default.FontSize(20).SemiBold().FontColor(Colors.Blue.Medium);

            container.Row(row =>
            {
                row.RelativeItem().Column(column =>
                {
                    column.Item().Text($"发票 #{Model.InvoiceNumber}").FontFamily("simhei").Style(titleStyle);

                    column.Item().Text(text =>
                    {
                        text.Span("发行日期: ").SemiBold().FontFamily("simhei");
                        text.Span($"{Model.IssueDate:d}").FontFamily("simhei");
                    });

                    column.Item().Text(text =>
                    {
                        text.Span("支付日期: ").FontFamily("simhei").SemiBold();
                        text.Span($"{Model.DueDate:d}").FontFamily("simhei");
                    });

                })
                ;

            });
        }

        void ComposeContent(IContainer container)
        {
            container.Table(table =>
            {
                // step 1
                table.ColumnsDefinition(columns =>
                {
                    columns.ConstantColumn(25);
                    columns.RelativeColumn(3);
                    columns.RelativeColumn();
                    columns.RelativeColumn();
                    columns.RelativeColumn();
                });

                // step 2
                table.Header(header =>
                {
                    header.Cell().Text("#").FontFamily("simhei");
                    header.Cell().Text("商品").FontFamily("simhei");
                    header.Cell().AlignRight().Text("价格").FontFamily("simhei");
                    header.Cell().AlignRight().Text("数量").FontFamily("simhei");
                    header.Cell().AlignRight().Text("总价").FontFamily("simhei");

                    header.Cell().ColumnSpan(5)
                        .PaddingVertical(5).BorderBottom(1).BorderColor(Colors.Black);
                });

                // step 3
                foreach (var item in Model.Items)
                {
                    table.Cell().Element(CellStyle).Text(Model.Items.IndexOf(item) + 1).FontFamily("simhei");
                    table.Cell().Element(CellStyle).Text(item.Name).FontFamily("simhei");
                    table.Cell().Element(CellStyle).AlignRight().Text($"{item.Price}$").FontFamily("simhei");
                    table.Cell().Element(CellStyle).AlignRight().Text(item.Quantity).FontFamily("simhei");
                    table.Cell().Element(CellStyle).AlignRight().Text($"{item.Price * item.Quantity}$").FontFamily("simhei");

                    static IContainer CellStyle(IContainer container)
                    {
                        return container.BorderBottom(1).BorderColor(Colors.Grey.Lighten2).PaddingVertical(5);
                    }
                }
            });

        }
       
```
在准备这些工作做完之后我们就可以生成Pdf文档了
```csharp
var filePath = "invoice.pdf";

var model = InvoiceDocumentDataSource.GetInvoiceDetails();
var document = new InvoiceDocument(model);
document.GeneratePdf(filePath);
```

## 视频教程

[在 .NET 中创建 PDF 的最简单方法](https://www.bilibili.com/video/BV1Qc411d7gN?spm_id_from=333.1245.0.0)

## 资料

[https://mp.weixin.qq.com/s/TZp2PwHd9VRZk6_sdW4cQw](https://mp.weixin.qq.com/s/TZp2PwHd9VRZk6_sdW4cQw) | C#/.Net 不要再使用Aspose和iTextSharp啦！QuestPDF操作生成PDF更快更高效！
[https://mp.weixin.qq.com/s/1ApjlbVqJpJSW_fRO5VWfA](https://mp.weixin.qq.com/s/1ApjlbVqJpJSW_fRO5VWfA) | 用 QuestPDF操作生成PDF更快更高效！
