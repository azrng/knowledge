---
title: PuppeteerSharp
lang: zh-CN
date: 2023-09-11
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 爬虫
---

## 概述
PuppeteerSharp是基于Puppeteer的，Puppeteer 是一个Google 开源的NodeJS 库，它提供了一个高级API 来通过DevTools协议控制Chromium 浏览器。Puppeteer 默认以无头(Headless) 模式运行，但是可以通过修改配置运行“有头”模式。
PuppeteerSharp可以干很多事情，不光可以用来抓取单页应用，还可以用来生成页面PDF或者图片，可以做自动化测试等。

官网：[https://www.puppeteersharp.com/](https://www.puppeteersharp.com/)
GitHub仓库地址：[https://github.com/hardkoded/puppeteer-sharp](https://github.com/hardkoded/puppeteer-sharp)

## 特点

Puppeteer 的主要特点包括：

1. **无头浏览器**：默认情况下，Puppeteer 在无头模式下运行，这意味着它不会显示用户界面，可以在后台执行任务，适合自动化和服务器环境。
2. **网页抓取**：Puppeteer 可以轻松地抓取网页数据，解析内容，提取信息。
3. **自动化测试**：可以用来编写和执行端到端（E2E）测试，模拟用户操作，如点击链接、填写表单等。
4. **生成报告**：可以通过 Puppeteer 生成网页的 PDF 报告或截图，方便分享和存档。
5. **支持现代网页特性**：Puppeteer 支持最新的 Web API 和特性，如 Service Workers、WebSockets 等。
6. **可扩展性**：开发者可以根据需要自定义 Puppeteer 的行为，添加中间件、插件等。

## 对比Playwright
PuppeteerSharp主要支持Chrome浏览器，而Playwright支持多种浏览器，包括Chrome、Firefox和WebKit（Safari）。

## 操作
> 注意：里面遇到了一些错误，解决方案在底部。

安装组件
```csharp
<PackageReference Include="PuppeteerSharp" Version="6.2.0" />
```

### 基本操作

#### 将网页截图保存
```csharp
using var browserFetcher = new BrowserFetcher();
// 下载浏览器执行程序
await browserFetcher.DownloadAsync();
// 创建一个浏览器执行实例
await using var browser = await Puppeteer.LaunchAsync(new LaunchOptions
{
    Headless = true,
});

// 打开一个页面
await using var page = await browser.NewPageAsync();
// 设置页面大小
await page.SetViewportAsync(new ViewPortOptions
{
    Width = 1920,
    Height = 1080
});
await page.GoToAsync("https://azrng.gitee.io/kbms");
var path = "d:\\2.png";
await page.ScreenshotAsync(path);
```

#### 获取单页应用HTML
```csharp
using var browserFetcher = new BrowserFetcher();
// 下载浏览器执行程序
await browserFetcher.DownloadAsync();
// 创建一个浏览器执行实例
await using var browser = await Puppeteer.LaunchAsync(new LaunchOptions
{
    Headless = true,
});

// 打开一个页面
await using var page = await browser.NewPageAsync();
// 设置页面大小
await page.SetViewportAsync(new ViewPortOptions
{
    Width = 1920,
    Height = 1080
});

var url = "https://azrng.gitee.io/kbms";
await page.GoToAsync(url, WaitUntilNavigation.Networkidle0);
var content = await page.GetContentAsync();
Console.WriteLine(content);
```
然后就可以通过解析html，得到我们想要的数据 

#### 保存为PDF
```csharp
using var browserFetcher = new BrowserFetcher();
// 下载浏览器执行程序
await browserFetcher.DownloadAsync();
// 创建一个浏览器执行实例
await using var browser = await Puppeteer.LaunchAsync(new LaunchOptions
{
    Headless = true,
});

// 打开一个页面
await using var page = await browser.NewPageAsync();
// 设置页面大小
await page.SetViewportAsync(new ViewPortOptions
{
    Width = 1920,
    Height = 1080
});

var url = "https://azrng.gitee.io/kbms";
await page.GoToAsync(url, WaitUntilNavigation.Networkidle0);
await page.PdfAsync("zhishiku.pdf");
```

### 模拟用户登录
模拟输入用户名和密码
```csharp
await page.goto('https://github.com/login');
await page.click('#login_field');
await page.type('username');

await page.click('#password');
await page.type('password');

await page.click('#login > form > div.auth-form-body.mt-3 > input.btn.btn-primary.btn-block');

await page.waitForNavigation();
```
puppetter提供了page.focus,page.click,page.type,page.$eval(获取dom属性)等等api，鼠标位置，按键按下，tap，页面跳转众多用户可操作的api，都可以通过程序来模拟。

### 执行js脚本

下面示例实现的效果就是传入md文档然后调用执行网站的js方法去处理逻辑

```csharp
private static readonly AsyncLock BrowserLock = new();
private static IBrowser? _browser;

private static async Task<string> RenderMarkdown(string markdown)
{
    if (_browser is null)
    {
        using (await BrowserLock.LockAsync())
        {
            if (_browser is null)
            {
                // 首先通过 BrowserFetcher 下载浏览器
                // https://github.com/hardkoded/puppeteer-sharp
                var browserFetcher = new BrowserFetcher();
                await browserFetcher.DownloadAsync();
                // 启动浏览器
                _browser = await Puppeteer.LaunchAsync();
            }
        }
    }
    // 创建一个 page
    await using var page = await _browser.NewPageAsync();
    // 打开某个网页，并等待网络请求加载结束
    await page.GoToAsync("https://mdnice.weihanli.xyz", WaitUntilNavigation.Networkidle0);
    // 调用 `parseMdToHtml` 方法并传入 markdown 内容作为参数，并获取返回的 html
    var html = await page.EvaluateFunctionAsync<string>("parseMdToHtml", markdown);
    // close 当前 page
    await page.CloseAsync();

    return html;
}
```

使用 PuppeteerSharp 基于 headless browser 执行 js 脚本：[https://mp.weixin.qq.com/s/nPAMFpMlNexzAegwREoHEA](https://mp.weixin.qq.com/s/nPAMFpMlNexzAegwREoHEA)

### 爬取网页内容

爬取执行网络内容测试

```csharp
using var browserFetcher = new BrowserFetcher();
// 下载浏览器执行程序
await browserFetcher.DownloadAsync();
// 创建一个浏览器执行实例
await using var browser = await Puppeteer.LaunchAsync(new LaunchOptions
{
    Headless = true,
    Args = new string[] { "--no-sandbox" }
});

// 打开一个页面
await using var page = await browser.NewPageAsync();
// 设置页面大小
await page.SetViewportAsync(new ViewPortOptions
{
    Width = 1920,
    Height = 1080
});

var url = "https://azrng.gitee.io/kbms";
page.DefaultNavigationTimeout = 0;
await page.SetUserAgentAsync("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36");
await page.GoToAsync(url, 0);

var str = await page.GetContentAsync();
```

## 错误处理

### Failed to launch browser! path to executable does not exist
错误信息：Failed to launch browser! path to executable does not exist
解决方案：
在程序目录下(Debug)发现一个文件夹.local-chromium，里面包含两个文件(Win64-901912、chrome-win.zip)，现在将压缩包的内容解压，然后将解压后的内容里面的文件夹chrome-win放到Win64-901912中，该文件内原来的内容可以删除或者直接替换，操作后成功无错误。
如果没有那个压缩包，可以去这里下载：[https://mirrors.huaweicloud.com/chromium-browser-snapshots/](https://mirrors.huaweicloud.com/chromium-browser-snapshots/)
参考资料：[https://www.cnblogs.com/cdyy/p/PuppeteerSharp.html](https://www.cnblogs.com/cdyy/p/PuppeteerSharp.html)

## 资料
[https://www.cnblogs.com/shanyou/archive/2019/03/09/10500049.html](https://www.cnblogs.com/shanyou/archive/2019/03/09/10500049.html) | PuppeteerSharp: 更友好的 Headless Chrome C## API 
