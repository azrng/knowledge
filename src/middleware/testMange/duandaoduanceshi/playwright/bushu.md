---
title: 部署
lang: zh-CN
date: 2023-03-30
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: bushu
slug: bvq9tf
docsId: '81119951'
---

## 拷贝浏览器
其实 Playwright 默认是到C:\Users\用户名\AppData\Local\ms-playwright文件夹下查找依赖的浏览器，我们只需将本机文件夹复制到部署机器的对应文件夹即可。
但更简便的方式，是将浏览器也放到发布文件夹下一起部署。
操作示例

- 修改代码，设置查询依赖浏览器路径的环境变量
```json
Environment.SetEnvironmentVariable("PLAYWRIGHT_BROWSERS_PATH", Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "ms-playwright"));
//正式执行
using var playwright = await Playwright.CreateAsync();
```

- 修改项目文件，设置发布时候执行Task，复制ms-playwright 文件夹到发布文件夹下
```json
<Target Name="PublishPlaywright" AfterTargets="Publish">
	<ItemGroup>
		<PlaywrightFiles Include="$(LOCALAPPDATA)\ms-playwright\**\*.*" />
	</ItemGroup>
	<Copy SourceFiles="@(PlaywrightFiles)" DestinationFiles="$(PublishDir)\ms-playwright\%(RecursiveDir)%(Filename)%(Extension)" />
</Target>
```

- 按照正常流程发布

将发布后的文件夹复制到另一个机器上，无需安装浏览器，就可以正常运行，因为会读取当前文件夹下的ms-playwright文件夹，获取依赖的浏览器。
![image.png](/common/1655872902959-9e23f82d-c9c9-4764-a040-83c847164e36.png)
> 缺点：开发和部署的计算机操作系统必须一致。


## 自动安装
运行浏览器安装的命令，代码执行安装步骤
```json
Console.WriteLine("Start download chromium");
var exitCode = Microsoft.Playwright.Program.Main(new[] { "install", "chromium" });
if (exitCode != 0)
{
    throw new Exception($"Playwright exited with code {exitCode}");
}
```
然后按照正常流程发布，直接运行控制台程序。

## 部署模式选择
默认情况下，Playwright 仅捆绑 .NET 发布目标运行时的驱动程序。如果您想为其他平台捆绑，您可以通过在项目文件中使用、或all、none来linux覆盖此行为。winosx
```json
<PropertyGroup>
  <PlaywrightPlatform>all</PlaywrightPlatform>
</PropertyGroup>
```
或者
```json
<PropertyGroup>
  <PlaywrightPlatform>osx;linux</PlaywrightPlatform>
</PropertyGroup>
```

## 自动部署

playwright打包部署：https://playwright.dev/dotnet/docs/ci

## 资料

文章来源自：微信公众号【My IO】
