---
title: PuppeteerSharp
lang: zh-CN
date: 2023-09-10
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: puppeteersharp
slug: krmbbg040h4o3fdc
docsId: '138940669'
---

## 概述
仓库地址：[https://github.com/hardkoded/puppeteer-sharp](https://github.com/hardkoded/puppeteer-sharp)

## 操作
引用nuget包：PuppeteerSharp

### 将HTML转图片/PDF
```csharp
await new BrowserFetcher().DownloadAsync(BrowserFetcher.DefaultChromiumRevision);
var browser = await Puppeteer.LaunchAsync(new LaunchOptions { Headless = true });
string destFilePath = AppDomain.CurrentDomain.BaseDirectory + "TestImgCreate\\";
if (!Directory.Exists(destFilePath))
{
    Directory.CreateDirectory(destFilePath);
}
var outputFile = destFilePath + DateTime.Now.ToString("yyyyMMddHHmmss") + ".jpg";
using (var page = await browser.NewPageAsync())
{
    await page.SetViewportAsync(
        new ViewPortOptions
        {
            Width = 425, //图片宽度
            Height = 635 //图片高度
        }
    );
    await page.SetContentAsync(
        @"
    <html>
    <body>
    <div class='box'>
        <h1>考场号:&nbsp;&nbsp;&nbsp;01</h1>
        <h1>座位号:&nbsp;&nbsp;&nbsp;01</h1>
        <div class='center-box'>
        <h4>姓&nbsp; &nbsp;&nbsp;名:&nbsp; &nbsp;花卷</h4>
        <h4>身份证号:&nbsp; &nbsp;545645456456465</h4>
        <h4>准考证号:&nbsp; &nbsp;54564545454</h4>
        </div>
        <div class='botom-box'>
        <h2>温馨提示:</h2>
        <h3>请核对信息无误后,张贴在准考证指定位置！</h3>
        </div>
    </div>
    </body>
    </html>
    <style>
    .box{
        box-sizing: border-box;
        padding-top: 10px;  
        text-align: center;
        font-family: fangsong;
    }
    .box>h1 {
        font-size: 46px;
    }
    .center-box {
        text-align: left;
        width:290px;
        margin:60px auto;
    }
    .center-box > h4{
        font-size: 18px;
    }
    .botom-box {
        text-align: center;
        margin-left: 20px;
    }
    </style>"
    );
    ScreenshotOptions screenshotOptions = new ScreenshotOptions();
    screenshotOptions.FullPage = true; //是否截取整个页面
    screenshotOptions.OmitBackground = false; //是否使用透明背景，而不是默认白色背景
    screenshotOptions.Quality = 100; //截图质量 0-100（png不可用）
    screenshotOptions.Type = ScreenshotType.Jpeg; //截图格式
    await page.ScreenshotAsync(outputFile, screenshotOptions);
}

```
如果需要生成PDF，那么就需要做下面修改
```csharp
await page.ScreenshotAsync(outputFile, screenshotOptions);
->
await page.PdfAsync(outputFile);
文件名称修改成PDF后缀
```

资料：[https://mp.weixin.qq.com/s/6PfZUvl4T5B96eS7lDV-FA](https://mp.weixin.qq.com/s/6PfZUvl4T5B96eS7lDV-FA) | .NET 实现Html 生成图片或PDF

## 资料

使用简单的模板创建强大的文档： 使用TPL文件将HTML转换为PDF:https://mp.weixin.qq.com/s/Z4phZtEgm0gl6rHYQ6Xr4g
