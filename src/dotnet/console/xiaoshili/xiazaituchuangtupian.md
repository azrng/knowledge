---
title: 下载图床图片
lang: zh-CN
date: 2023-09-14
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: xiazaituchuangtupian
slug: tpzf586nynlxgoo0
docsId: '135584495'
---

## 概述
针对网络上的那些访问一个URL然后就可以随机访问一个图片的链接，批量下载图片内容

## 操作
新建控制台项目，然后项目文件如下
```bash
<Project Sdk="Microsoft.NET.Sdk">
	<PropertyGroup>
		<OutputType>Exe</OutputType>
		<TargetFramework>net8.0</TargetFramework>
		<ImplicitUsings>enable</ImplicitUsings>
		<Nullable>enable</Nullable>
	</PropertyGroup>
</Project>
```
引用nuget包
```csharp
<ItemGroup>
  <PackageReference Include="AzrngCommon.Core" Version="1.0.3" />
  <PackageReference Include="Sharprompt" Version="3.0.0-preview2" />
  <PackageReference Include="ShellProgressBar" Version="5.2.0" />
</ItemGroup>
```
代码操作
```csharp
using Common.Extension;
using Sharprompt;
using ShellProgressBar;
using System.Text;

Console.OutputEncoding = Encoding.UTF8;

Prompt.ColorSchema.Select = ConsoleColor.DarkCyan;
//https://api.yimian.xyz/img?type=moe&size=1920x1080
var server = Prompt.Input<string>("请输入要下载的图片url", defaultValue: "http://api.yimian.xyz/img?type＝wallpaper");

Prompt.ColorSchema.Answer = ConsoleColor.DarkRed;

if (!server.StartsWith("http://") && !server.StartsWith("https://"))
{
    Console.WriteLine("你输入的url格式不对!");
    Console.ReadLine();
    return;
}

var number = Prompt.Input<long>("请输入原始要下载的数量");
if (number > int.MaxValue)
{
    Console.WriteLine("数量超出限制");
    Console.ReadLine();
    return;
}

var confirm = Prompt.Confirm("开始下载吗？");
if (!confirm)
{
    Console.WriteLine("退出");
    Console.ReadLine();
}

// 进度条
var options = new ProgressBarOptions
{
    ProgressCharacter = '─',
    ProgressBarOnBottom = true,
    ForegroundColor = ConsoleColor.Yellow,
    ForegroundColorDone = ConsoleColor.DarkGreen,
    BackgroundColor = ConsoleColor.DarkGray,
    BackgroundCharacter = '\u2593'
};

if (!Directory.Exists("images"))
{
    Directory.CreateDirectory("images");
}

var client = new HttpClient();
// 设置请求头
client.DefaultRequestHeaders.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36");
client.DefaultRequestHeaders.Add("Accept", "*/*");
client.DefaultRequestHeaders.Add("Accept-Language", "zh-CN,zh;q=0.9");
client.DefaultRequestHeaders.Add("Connection", "keep-alive");

var intNum = number.ToString().ToInt();
using (var pbar = new ProgressBar(intNum, "下载中，请等待", options))
{
    var list = Enumerable.Range(0, intNum);

    await Parallel.ForEachAsync(list, async (m, _) =>
     {
         try
         {
             var bytes = await client.GetByteArrayAsync(server);
             await File.WriteAllBytesAsync($"images/{Guid.NewGuid()}.png", bytes);
             pbar.Tick();
         }
         catch (Exception ex)
         {
             Console.WriteLine($"下载失败 {ex.Message}");
         }
     });
}

Console.WriteLine("下载结束！");
Console.ReadLine();
```
