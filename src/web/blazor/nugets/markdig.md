---
title: Markdig
lang: zh-CN
date: 2023-08-05
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: markdig
slug: vzghd3
docsId: '67712590'
---

## 介绍
Markdig 是一个快速、强大、符合CommonMark标准、可扩展的 .NET Markdown 处理器。

## 操作
安装包
```csharp
<PackageReference Include="Markdig" Version="0.27.0" />
```

### 高亮展示Markdown
引入包Prism，是一个JS插件：Prism 是一个轻量级、健壮且优雅的语法高亮库。这是Dabblet的一个衍生项目。
在_Layout.cshtml的head中引入：
```csharp
<head>
....
<!--重置浏览器样式-->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/normalize.css@8.0.1/normalize.css">
<!--代码块主题-->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/prismjs@1.27.0/themes/prism-coy.min.css">
<!--工具栏插件-->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/prismjs@1.27.0/plugins/toolbar/prism-toolbar.min.css">
<!--行号插件-->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/prismjs@1.27.0/plugins/line-numbers/prism-line-numbers.min.css">
...
</head>
<body>
...
<!--prism核心js (用于渲染代码块)-->
<script src="https://cdn.jsdelivr.net/npm/prismjs@1.27.0/prism.min.js"></script>
<!--显示代码块行号-->
<script src="https://cdn.jsdelivr.net/npm/prismjs@1.27.0/plugins/line-numbers/prism-line-numbers.min.js"></script>
<!--工具栏(一些插件的前置依赖)-->
<script src="https://cdn.jsdelivr.net/npm/prismjs@1.27.0/plugins/toolbar/prism-toolbar.min.js"></script>
<!--代码块显示语言名称-->
<script src="https://cdn.jsdelivr.net/npm/prismjs@1.27.0/plugins/show-language/prism-show-language.min.js"></script>
<!--复制代码-->
<script src="https://cdn.jsdelivr.net/npm/prismjs@1.27.0/plugins/copy-to-clipboard/prism-copy-to-clipboard.min.js"></script>
<!--自动去cdn加载对应语言的代码高亮js-->
<script src="https://cdn.jsdelivr.net/npm/prismjs@1.27.0/plugins/autoloader/prism-autoloader.min.js"></script>
</body>
```
将Markdown展示单独提取成了组件MarkdownComponent.razor，将加载的Markdown文件相对路径、需要链接的文章链接和源码链接做成参数，方便后面其他工具复用，下面的代码片段主要在这个文件内。
组件参数定义：
```csharp
@code {
    [Parameter]
    public string LocalPostFilePath { get; set; } = null!;

    [Parameter]
    public string RemotePostUrl { get; set; } = null!;

    [Parameter]
    public string SourceCodeUrl { get; set; } = null!;
}
```
Markdown内容读取，Markdown格式转html在OnInitializedAsync()方法中定义：
```csharp
protected override async Task OnInitializedAsync()
{
    var markdownData = await File.ReadAllTextAsync(LocalPostFilePath);

    // markdown 转为 html
    var htmlData = Markdown.ToHtml(markdownData);

    // 转为 prism 支持的语言标记（不是必须，可以删除）
    htmlData = htmlData.Replace("language-golang", "language-go");

    // TODO: 使用 https://github.com/mganss/HtmlSanitizer 清洗html中的xss
    if (htmlData.Contains("<script") || htmlData.Contains("<link"))
    {
        _hasXss = true;
    }

    // 将 普通文本 转为 可以渲染的html的类型
    _postHtmlContent = (MarkupString) htmlData;
}
```
最后一步，需要在组件完成后，调用Prism插件方法，写在方法OnAfterRenderAsync(bool firstRender)中，这是做代码高亮的关键代码：
```csharp
protected override async Task OnAfterRenderAsync(bool firstRender)
{
    await _jsRuntime.InvokeVoidAsync("Prism.highlightAll");
}
```
渲染相对来说就简单了（只针对我们使用），见下面的代码：
```csharp
<div class="line-numbers">
    @{
        if (_hasXss)
        {
            @_postHtmlContent.ToString()
        }
        else
        {
            @_postHtmlContent
        }
    }
</div>
```
在IcoTool.razor调用该组件：
```csharp
<MarkdownComponent
    LocalPostFilePath="wwwroot/2022/02/2022-02-22_02.md"
    RemotePostUrl="https://dotnet9.com/1715"
    SourceCodeUrl="https://github.com/dotnet9/dotnet9.com/blob/develop/src/Dotnet9.Tools.Web/Pages/Public/ImageTools/IcoTool.razor"/>
```
资料：[https://mp.weixin.qq.com/s/v1cMOniKCxtehbET3-B6OQ](https://mp.weixin.qq.com/s/v1cMOniKCxtehbET3-B6OQ)
