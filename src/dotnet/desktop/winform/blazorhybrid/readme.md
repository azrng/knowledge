---
title: 说明
lang: zh-CN
date: 2023-04-16
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: readme
slug: au085d
docsId: '98464547'
---

## 概述
在winform中嵌套razor页面进行展示

## 操作
新建.net6的winform项目WindowsForms
安装nuget包
```csharp
<PackageReference Include="Microsoft.AspNetCore.Components.WebView.WindowsForms" Version="6.0.541" />
```
修改项目的sdk为
```csharp
<Project Sdk="Microsoft.NET.Sdk.Razor">
```
新建wwwroot目录，并在里面新建index.html页面
```csharp
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>WindowsForms</title>
    <base href="/" />
    <!-- masa blazor css style -->
    <link href="_content/Masa.Blazor/css/masa-blazor.min.css" rel="stylesheet" />
    <!--icon file,import need to use-->
    <link href="https://cdn.masastack.com/npm/@mdi/font@5.x/css/materialdesignicons.min.css" rel="stylesheet">
    <link href="https://cdn.masastack.com/npm/materialicons/materialicons.css" rel="stylesheet">
    <link href="https://cdn.masastack.com/npm/fontawesome/v5.0.13/css/all.css" rel="stylesheet">
</head>

<body>

    <div id="app">Loading...</div>

    <div id="blazor-error-ui">
        An unhandled error has occurred.
        <a href="" class="reload">Reload</a>
        <a class="dismiss">🗙</a>
    </div>

    <script src="_framework/blazor.webview.js"></script>
    <!--js(should lay the end of file)-->
    <script src="_content/BlazorComponent/js/blazor-component.js"></script>
</body>

</html>
```
> 当前示例使用了Masa的UI组件，所以引用了masa的样式包等

新建_Imports.razor页面，并引用配置
```csharp
@using Microsoft.AspNetCore.Components.Web
```
新建SQLParser.razor来作为内嵌展示的页面。
新建或者打开现有的Form窗体，然后再工具栏中拉入控件
![image.png](/common/1666845577879-88ce22ed-a425-43df-9fbf-ed8623573847.png)
然后设置该控件的Dock属性为Fill，然后编辑该窗体的初始化代码
```csharp
public partial class SQLTraceSourceBlazor : Form
{
    public SQLTraceSourceBlazor()
    {
        InitializeComponent();

        var services = new ServiceCollection();
        services.AddWindowsFormsBlazorWebView();

#if DEBUG
        // 调试使用
        services.AddBlazorWebViewDeveloperTools();
#endif
        services.AddMasaBlazor();

        // blazorWebView1为控件标识
        blazorWebView1.HostPage = "wwwroot\\index.html";
        blazorWebView1.Services = services.BuildServiceProvider();
        blazorWebView1.RootComponents.Add<SQLParser>("#app");
    }
}
```
设置该窗体为启动时候运行，那么启动的时候就可以看到内嵌的页面内容。

## 优化
```csharp
            var blazor = new BlazorWebView()
            {
                Dock = DockStyle.Fill,
                HostPage = "wwwroot\\index.html",
                //Services=Program.se
                AutoScroll = false
            };

            var formType = this.GetType();
            var pageType = Assembly.GetExecutingAssembly().GetTypes().First(t => t.FullName == "WindowsForms");
            blazor.RootComponents.Add(new RootComponent("#app", pageType, null));
            Controls.Add(blazor);
```

## 参考资料
官网：[https://learn.microsoft.com/zh-cn/aspnet/core/blazor/hybrid/tutorials/windows-forms?view=aspnetcore-6.0](https://learn.microsoft.com/zh-cn/aspnet/core/blazor/hybrid/tutorials/windows-forms?view=aspnetcore-6.0)
