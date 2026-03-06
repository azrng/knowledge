---
title: 静态md文件转换输出
lang: zh-CN
date: 2022-08-21
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: jingtaimdwenjianzhuaihuanshuchu
slug: hmtv9b
docsId: '90170619'
---

## 目的
 如果请求md静态文件那么就将其转html输出。

## 操作
安装nuget包
```csharp
<ItemGroup>
  <PackageReference Include="Markdig" Version="0.30.3" /> <!--md文件转html-->
  <PackageReference Include="Ude.NetStandard" Version="1.2.0" /> <!--文件编码检测-->
</ItemGroup>
```
编写中间件
```csharp
/// <summary>
/// 如果请求md静态文件那么就将其转html输出
/// </summary>
public class StaticFileOutputHtmlMiddleawre
{
    private readonly RequestDelegate _next;
    private readonly IWebHostEnvironment _environment;

    public StaticFileOutputHtmlMiddleawre(RequestDelegate next, IWebHostEnvironment environment)
    {
        _next = next;
        _environment = environment;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var path = context.Request.Path.ToString();

        // 只处理md结尾的文件
        if (!path.EndsWith(".md", true, null))
        {
            await _next(context);
            return;
        }

        // 检查是否存在该文件
        var file = _environment.WebRootFileProvider.GetFileInfo(path);
        if (!file.Exists)
        {
            await _next(context);
            return;
        }

        using var stream = file.CreateReadStream();
        var cdet = new CharsetDetector();
        cdet.Feed(stream);
        cdet.DataEnd();
        var charset = cdet.Charset ?? "UTF-8"; //输出编码

        //将流复原
        stream.Position = 0;

        //读取流
        using var reader = new StreamReader(stream, Encoding.GetEncoding(charset));
        var str = await reader.ReadToEndAsync();

        //转换markdown为html
        var pipeline = new MarkdownPipelineBuilder().UseAdvancedExtensions().Build();
        var content = Markdown.ToHtml(str, pipeline);

        context.Response.ContentType = "text/html;charset=UTF-8";
        await context.Response.WriteAsync(content);
    }
}
```
使用中间件
```csharp
// 使用该中间件必须在UseStaticFiles之前
app.UseMiddleware<StaticFileOutputHtmlMiddleawre>();
app.UseStaticFiles();
```
启动项目当你请求一个比如 http://localhost:5000/test.md的时候会自动将该md文件转换为html进行输出。
