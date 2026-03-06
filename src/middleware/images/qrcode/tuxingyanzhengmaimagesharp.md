---
title: 图形验证码ImageSharp
lang: zh-CN
date: 2022-10-06
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: tuxingyanzhengmaimagesharp
slug: ziyr8w
docsId: '95889878'
---

## 概述
借助跨平台库ImageSharp来实现生成验证码。

## 操作
```csharp
using SixLabors.Fonts;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Drawing.Processing;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace CommonCollect;

public class CaptchaHelper
{
    private const string _letters = "1,2,3,4,5,6,7,8,9,A,B,C,D,E,F,G,H,J,K,L,M,N,P,Q,R,S,T,U,V,W,X,Y,Z";

    /// <summary>
    /// 生成验证码随机值
    /// </summary>
    /// <param name="codeLength"></param>
    /// <returns></returns>
    public Task<string> GenerateRandomCaptchaAsync(int codeLength = 4)
    {
        var array = _letters.Split(new[] { ',' });
        var random = new Random();
        var temp = -1;
        var captcheCode = string.Empty;
        for (int i = 0; i < codeLength; i++)
        {
            if (temp != -1)
                random = new Random(i * temp * unchecked((int)DateTime.Now.Ticks));

            var index = random.Next(array.Length);
            if (temp != -1 && temp == index)
                return GenerateRandomCaptchaAsync(codeLength);

            temp = index;
            captcheCode += array[index];
        }
        return Task.FromResult(captcheCode);
    }

    /// <summary>
    /// 生成验证码及图片
    /// </summary>
    /// <param name="captchaCode"></param>
    /// <param name="width"></param>
    /// <param name="height"></param>
    /// <returns></returns>
    public Task<(string code, MemoryStream ms)> GenerateCaptchaImageAsync(string captchaCode, int width = 0, int height = 30)
    {
        //验证码颜色集合
        Color[] colors = { Color.Black, Color.Red, Color.DarkBlue, Color.Green, Color.Orange, Color.Brown, Color.DarkCyan, Color.Purple };
        //验证码字体集合
        string[] fonts = { "Verdana", "Microsoft Sans Serif", "Comic Sans MS", "Arial" };
        var r = new Random();

        if (width == 0) { width = captchaCode.Length * 25; }
        //定义图像的大小，生成图像的实例
        using var image = new Image<Rgba32>(width, height);

        // 字体
        var font = SystemFonts.CreateFont(SystemFonts.Families.First().Name, 25, FontStyle.Bold);

        image.Mutate(ctx =>
        {
            // 白底背景
            ctx.Fill(Color.White);

            // 画验证码
            for (int i = 0; i < captchaCode.Length; i++)
            {
                ctx.DrawText(captchaCode[i].ToString()
                    , font
                    , colors[r.Next(colors.Length)]
                    , new PointF(20 * i + 10, r.Next(2, 12)));
            }

            // 画干扰线
            for (int i = 0; i < 10; i++)
            {
                var pen = new Pen(colors[r.Next(colors.Length)], 1);
                var p1 = new PointF(r.Next(width), r.Next(height));
                var p2 = new PointF(r.Next(width), r.Next(height));

                ctx.DrawLines(pen, p1, p2);
            }

            // 画噪点
            for (int i = 0; i < 80; i++)
            {
                var pen = new Pen(colors[r.Next(colors.Length)], 1);
                var p1 = new PointF(r.Next(width), r.Next(height));
                var p2 = new PointF(p1.X + 1f, p1.Y + 1f);

                ctx.DrawLines(pen, p1, p2);
            }
        });
        using var ms = new MemoryStream();

        // gif 格式
        image.SaveAsGif(ms);
        return Task.FromResult((captchaCode, ms));
    }
}
```
使用方法
```csharp
/// <summary>
/// 测试验证码
/// </summary>
/// <returns></returns>
[HttpGet("captcha")]
public async Task<IActionResult> GetCaptcha()
{
    var captchaHelper = new CaptchaHelper();
    var captcha = await captchaHelper.GenerateCaptchaImageAsync();
    this.HttpContext.Session.SetString("captcha", captcha.code);
    return File(captcha.ms.ToArray(), "image/gif");
}
```
