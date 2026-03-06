---
title: 操作
lang: zh-CN
date: 2023-09-11
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: caozuo
slug: lf55xk
docsId: '81008522'
---

## 快速上手
创建一个控制台项目，然后安装nuget包
```csharp
<ItemGroup>
  <PackageReference Include="Microsoft.Playwright" Version="1.30.0" />
</ItemGroup>
```
下面就举例一个通过浏览器打开博客园并且获取到48小时阅读排行榜列表吧
```csharp
using var playwright = await Playwright.CreateAsync();
//指定为Chromium浏览器访问
await using var browser = await playwright.Chromium.LaunchAsync(new BrowserTypeLaunchOptions
{
    Headless = false,
    Channel = "msedge"
});

// 打开页面
var page = await browser.NewPageAsync();
await page.GotoAsync("https://www.cnblogs.com/cate/dotnetcore/");

var titleLiList = await page.QuerySelectorAllAsync("//*[@id=\"side_right\"]/div[3]/ul/li");
foreach (var item in titleLiList)
{
    var li = await item.QuerySelectorAsync("a");
    Console.WriteLine(await li.TextContentAsync());
}
```

## 功能

### 安装全局工具
```csharp
dotnet tool install --global Microsoft.Playwright.CLI
```

### 指定浏览器
可以通过Headless来设置是否需要使用浏览器，以及可以通过Channel来设置使用哪种浏览器
```csharp
using var playwright = await Playwright.CreateAsync();
await using var browser = await playwright.Chromium.LaunchAsync(new BrowserTypeLaunchOptions
{
    //Headless:true:没有浏览器ui，运行速度较快常用语自动化运行 false:有浏览器ui，常用于代码调试
    Headless = false,
    // channel 参数指定浏览器分发通道。值可以为“chrome”、“chrome-beta”、“chrome-dev”、“chrome-canary”、“msedge”、“msedge-beta”、“msedge-dev”、“msedge-canary
    Channel = "msedge",
    //来减慢执行速度
    SlowMo=50,
});
```

### 动作
与HTML内容进行交互操作，例如文本输入、复选框、单选按钮、选择选项、鼠标单击、键入字符、键和快捷方式以及上传文件和焦点元素。
文档：[https://playwright.dev/dotnet/docs/input](https://playwright.dev/dotnet/docs/input)

### 高级功能

#### 录制
手动操作浏览器，会录制我们的操作，然后生成脚本。
创建项目
```bash
 --创建控制台(这点需要注意，会直接安装最新版本)
 dotnet new console -n PlaywrightDemo
 -- 进入目录
 cd PlaywrightDemo
 -- 生成项目
 dotnet build

 -- 添加依赖包
 dotnet add package Microsoft.Playwright
```
安装必要的浏览器(这里的netx是你当前项目的版本)
```bash
pwsh bin\Debug\netX\playwright.ps1 install

-- 示例
pwsh bin\Debug\net7.0\playwright.ps1 install
```
> 如果这里执行报错，那么就继续往下看错误解决方案

开始录制
```bash
pwsh bin\Debug\netX\playwright.ps1 codegen

-- 示例
pwsh bin\Debug\net7.0\playwright.ps1 codegen
```
然后会打开一个浏览器以及一个窗口，点击浏览器可以在另外的Playwright Inspector生成代码
![image.png](/common/1655877153753-084599e3-aec7-46c9-946a-13373bf2d1cf.png)
> 注意：生成代码虽然很方便，但是生成的内容需要仔细观察，有些是需要二次改动的。



如果你提示错误【 无法将“pwsh”项识别为 cmdlet、函数、脚本文件或可运行程序的名称】，那么你需要升级PowerShell
```bash
dotnet tool update --global PowerShell
```

### 验证码
OPENCV 方式 ：[https://www.cnblogs.com/carl-/p/15761861.html](https://www.cnblogs.com/carl-/p/15761861.html)

NODEJS 方式 验证码识别：[https://lwebapp.com/zh/post/bypass-captcha](https://lwebapp.com/zh/post/bypass-captcha)

## 操作

### 截图
打开某一个页面然后截图保存
```json
var page = await browser.NewPageAsync();
await page.GotoAsync("https://playwright.dev/dotnet");
var bytes= await page.ScreenshotAsync(new PageScreenshotOptions { Path = "screenshot.png" });
```

### 打开页面输入值
```csharp
var page = await browser.NewPageAsync();
await page.GotoAsync("https://baidu.com");

await page.TypeAsync("#loginid", config.UserName);
await page.TypeAsync("#userpassword", config.Password);

await page.ClickAsync("#submit");
```

### 初始化脚本

```csharp
// 定义一个JavaScript字符串，用于修改navigator对象的webdriver属性，使其返回值始终为false
var js = "Object.defineProperties(navigator, {webdriver:{get:()=>false}});";
// 异步地向页面添加初始化脚本，以修改navigator的webdriver属性，目的是防止自动化操作被检测到
await page.AddInitScriptAsync(js);
```

## 示例

### 打开百度然后搜索

```csharp
//正式执行
using var playwright = await Playwright.CreateAsync();
//指定为Chromium浏览器访问
await using var browser = await playwright.Chromium.LaunchAsync(new BrowserTypeLaunchOptions
{
    //true:没有浏览器ui，运行速度较快常用语自动化运行
    //false:有浏览器ui，常用于代码调试
    Headless = false,
    // channel 参数指定浏览器分发通道。值可以为“chrome”、“chrome-beta”、“chrome-dev”、“chrome-canary”、“msedge”、“msedge-beta”、“msedge-dev”、“msedge-canary
    Channel = "msedge"
});

var page = await browser.NewPageAsync();
await page.GotoAsync("https://www.baidu.com/");

await page.WaitForSelectorAsync("#s-usersetting-top");

// 鼠标悬停在设置按钮，弹出菜单
await page.HoverAsync("#s-usersetting-top");

// 点击高级搜索链接，弹出高级搜索窗口
await page.ClickAsync("a[href='//www.baidu.com/gaoji/advanced.html']");

// 输入搜索关键字
await page.TypeAsync("input[name='q1']", "如何学习c#");

var page1 = await page.RunAndWaitForPopupAsync(async () =>
{
    // 点击搜索
    await page.ClickAsync(".advanced-search-btn");
});

//检查文本框内容
var handle = await page1.WaitForSelectorAsync("#kw");
var text = await handle.GetAttributeAsync("value");

Console.ReadKey();
```

### 打开bing搜索

```csharp
var playwright = await Playwright.CreateAsync();
var browser = await playwright.Chromium.LaunchAsync(new BrowserTypeLaunchOptions { Headless = false, Channel = "msedge" });
var page = await browser.NewPageAsync();

// 设置 User-Agent 和视口大小
// 定义一个JavaScript字符串，用于修改navigator对象的webdriver属性，使其返回值始终为false
var js = "Object.defineProperties(navigator, {webdriver:{get:()=>false}});";
// 异步地向页面添加初始化脚本，以修改navigator的webdriver属性，目的是防止自动化操作被检测到
await page.AddInitScriptAsync(js);

await page.GotoAsync("https://www.bing.com");

var keyword = "c#教程";

// 模拟用户输入搜索关键词
await page.FillAsync("input[name=q]", keyword);
await page.Keyboard.PressAsync("Enter");

Console.WriteLine("结束");
```

