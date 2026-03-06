---
title: RazorLight
lang: zh-CN
date: 2023-07-04
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: razorlight
slug: yiv2lm
docsId: '74438916'
---

## 介绍
在ASP.NET MVC 之外的 .NET Core使用 Razor 从字符串/文件/嵌入式资源构建模板。

包下载量：9,180,730

## 操作
> 本文示例环境：VS2022、.Net6

每个模板都必须有一个templateKey与之关联的，因此您可以在下次渲染相同的模板而无需重新编译。
引用组件
```csharp
<PackageReference Include="RazorLight" Version="2.0.0" />
```

### 字符串创建模板
```csharp
//动态编译razor
var engine = new RazorLightEngineBuilder()
    .UseEmbeddedResourcesProject(typeof(Program))//必须有一个模板的类型
    .SetOperatingAssembly(typeof(Program).Assembly)
    .UseMemoryCachingProvider()
    .DisableEncoding()//禁用编码，否则会把中文字符串编码成Unicode
    .Build();

var template = "你好, @Model.Name. 欢迎使用RazorLight";

//运行
string result = await engine.CompileRenderStringAsync("templateKey", template, new { Name = "张三" });
```
输出结果：你好, 张三. 欢迎使用RazorLight

### 填充内容导出HTML
创建模版
```csharp
<div>
    <table border="1" style="border:1px solid black;text-align:center" cellpadding="1" cellspacing="1">
        <tr>
            <th colspan="2">@Model.UserName</th>
        </tr>
        <tr>
            <td>科目</td>
            <td>成绩</td>
        </tr>
        @foreach (var item in Model.SubjectList)
        {
            <tr>
                <td>@item.SubjectName</td>
                <td>@item.Grade</td>
            </tr>
        }
    </table>
</div>
```
> 需要右键设置始终复制

创建对应的强类型类
```csharp
public class UserGradeDto
{
    public string UserName { get; set; } = null!;

    /// <summary>
    /// 科目成绩集合
    /// </summary>
    public IEnumerable<SubjectGradeDto> SubjectList { get; set; } = null!;

    public static UserGradeDto GetInfo()
    {
        return new UserGradeDto
        {
            UserName = "张三",
            SubjectList = new List<SubjectGradeDto>
                {
                    new SubjectGradeDto
                    {
                        SubjectName = "语文",
                        Grade = 90
                    },
                    new SubjectGradeDto
                    {
                        SubjectName = "数学",
                        Grade = 80
                    },
                    new SubjectGradeDto
                    {
                        SubjectName = "英语",
                        Grade = 70
                    }
                }
        };
    }
}

public class SubjectGradeDto
{
    /// <summary>
    /// 科目名字
    /// </summary>
    public string SubjectName { get; set; } = null!;

    /// <summary>
    /// 成绩
    /// </summary>
    public int Grade { get; set; }
}
```
具体操作
```csharp
public async Task FillTemplateAsync()
{
    //动态编译razor
    var engine = new RazorLightEngineBuilder()
        .UseEmbeddedResourcesProject(typeof(Program))//必须有一个模板的类型
        .SetOperatingAssembly(typeof(Program).Assembly)
        .UseMemoryCachingProvider()
        .DisableEncoding()//禁用编码，否则会把中文字符串编码成Unicode
        .Build();

    var filePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "View", "usergrade1.cshtml");
    if (!File.Exists(filePath))
    {
        Console.WriteLine("模板文件不存在");
        return;
    }
    //打开并且读取模板
    string template = File.ReadAllText(filePath);

    //运行
    string result = await engine.CompileRenderStringAsync("templateKey", template, UserGradeDto.GetInfo());
    Console.WriteLine(result);
}
```
输出结果
```csharp
<div>
    <table border="1" style="border:1px solid black;text-align:center" cellpadding="1" cellspacing="1">
        <tr>
            <th colspan="2">张三</th>
        </tr>
        <tr>
            <td>科目</td>
            <td>成绩</td>
        </tr>
            <tr>
                <td>语文</td>
                <td>90</td>
            </tr>
            <tr>
                <td>数学</td>
                <td>80</td>
            </tr>
            <tr>
                <td>英语</td>
                <td>70</td>
            </tr>
    </table>
</div>
```

### .NetCoreWeb
注入
```csharp
var docRazorEngion = new RazorLightEngineBuilder()
    .UseEmbeddedResourcesProject(typeof(Program))
    .SetOperatingAssembly(typeof(Program).Assembly)
    .UseMemoryCachingProvider()
    .DisableEncoding()  //禁用编码 否则中文字符串会被编码成Unicode
    .Build();
builder.Services.AddSingleton<IDocumentGenerationRazorEngion>(_ => new DocumentGenerationRazorEngion(docRazorEngion));
```
对应的类
```csharp
/// <summary>
/// 文档生成
/// </summary>
public interface IDocumentGenerationRazorEngion
{
    Task<string> CompileRenderStringAsync<TModel>(string key, string template, TModel inputContent);
}

public class DocumentGenerationRazorEngion : IDocumentGenerationRazorEngion
{
    private readonly IRazorLightEngine _razorLightEngine;

    public DocumentGenerationRazorEngion(IRazorLightEngine razorLightEngine)
    {
        _razorLightEngine = razorLightEngine;
    }

    /// <summary>
    /// 将TModel实体内容填充到Razor模板中渲染 输出模板填充内容后的字符串
    /// </summary>
    /// <typeparam name="TModel"></typeparam>
    /// <param name="template">模板</param>
    /// <param name="inputContent"></param>
    /// <returns></returns>
    public async Task<string> CompileRenderStringAsync<TModel>(string key, string template, TModel inputContent)
    {
        return await _razorLightEngine.CompileRenderStringAsync(key, template, inputContent);
    }
}
```

## 问题

### Can't load metadata reference from the entry assembly
Make sure PreserveCompilationContext is set to true in *.csproj file，那么就按照要求修改csproj文件，增加如下配置
```csharp
<PropertyGroup>
  <OutputType>Exe</OutputType>
  <TargetFramework>net6.0</TargetFramework>
  <Nullable>enable</Nullable>
  <!--razor配置-->
  <PreserveCompilationContext>true</PreserveCompilationContext>
</PropertyGroup>
```

## 资料
官网文档：[https://github.com/toddams/RazorLight#quickstart](https://github.com/toddams/RazorLight#quickstart)
