---
title: 图形验证码LazyCaptcha
lang: zh-CN
date: 2022-09-29
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: tuxingyanzhengmalazycaptcha
slug: goztl1
docsId: '72276157'
---

## 介绍
LazyCaptcha是仿EasyCaptcha和SimpleCaptcha基于.NET Standard 2.1的图形验证码模块。

### 项目地址
Gitee：https://gitee.com/pojianbing/lazy-captcha
LazyCaptcha：https://gitee.com/pojianbing/lazy-captcha
EasyCaptcha：https://gitee.com/ele-admin/EasyCaptcha
SimpleCaptcha：https://github.com/1992w/SimpleCaptcha

## 操作
引用组件
```csharp
Install-Package Lazy.Captcha.Core
```

### 基础操作
默认配置
```csharp
builder.Services.AddDistributedMemoryCache().AddCaptcha();
```
详细设置
```csharp
builder.Services.AddDistributedMemoryCache().AddCaptcha(option =>
{
    option.CaptchaType = CaptchaType.DEFAULT; // 验证码类型
    option.CodeLength = 4; // 验证码长度, 要放在CaptchaType设置后
    option.ExpiryTime = TimeSpan.FromSeconds(30); // 验证码过期时间
    option.IgnoreCase = true; // 比较时是否忽略大小写
    option.ImageOption.Animation = false; // 是否启用动画
    
    option.ImageOption.Width = 130; // 验证码宽度
    option.ImageOption.Height = 48; // 验证码高度
    option.ImageOption.BackgroundColor = SixLabors.ImageSharp.Color.White; // 验证码背景色
    
    option.ImageOption.BubbleCount = 2; // 气泡数量
    option.ImageOption.BubbleMinRadius = 5; // 气泡最小半径
    option.ImageOption.BubbleMaxRadius = 15; // 气泡最大半径
    option.ImageOption.BubbleThickness = 1; // 气泡边沿厚度

    option.ImageOption.InterferenceLineCount = 2; // 干扰线数量

    option.ImageOption.FontSize = 28; // 字体大小
    option.ImageOption.FontFamily = DefaultFontFamilys.Instance.Actionj; // 字体，中文使用kaiti，其他字符可根据喜好设置（可能部分转字符会出现绘制不出的情况）。
});
```
Controller
```csharp
public class CaptchaController : Controller
{
    private readonly ILogger<CaptchaController> _logger;
    private readonly ICaptcha _captcha;
    
    public CaptchaController(ILogger<CaptchaController> logger, ICaptcha captcha)
    {
        _logger = logger;
        _captcha = captcha;
    }
    
    [HttpGet]
    [Route("/captcha")]
    public IActionResult Captcha(string id)
    {
        var info = _captcha.Generate(id);
        var stream = new MemoryStream(info.Bytes);
        return File(stream, "image/gif");
    }
    
    [HttpGet]
    [Route("/captcha/validate")]
    public bool Validate(string id, string code)
    {
        if (!_captcha.Validate(id, code))
        {
            throw new Exception("无效验证码");
        }
    
        // 具体业务
    
        // 为了演示，这里仅做返回处理
        return true;
    }
}
```

## 资料
[https://www.cnblogs.com/readafterme/p/15890042.html](https://www.cnblogs.com/readafterme/p/15890042.html) | .NET Core 验证码 - LazyCaptcha（开源）
