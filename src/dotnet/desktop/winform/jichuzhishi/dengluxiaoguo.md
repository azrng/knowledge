---
title: 登录效果
lang: zh-CN
date: 2023-05-04
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: dengluxiaoguo
slug: qpfchw
docsId: '31541404'
---

## 概述
通过一个登录的模态窗体，阻塞后台操作，登录成功继续运行，失败退出进程。登录成功后要保存登录用户信息。

## 操作
在项目里面新建Common静态类
```csharp
/// <summary>
/// 用户信息类
/// </summary>
internal class User
{
    /// <summary>
    /// 用户Id
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// 用户名
    /// </summary>
    public string? UserName { get; set; }

    /// <summary>
    /// 登录时间
    /// </summary>
    public static DateTime LoginTime { get; set; }
}

/// <summary>
/// 公共配置
/// </summary>
internal class Common
{
    internal static User? CurrentUser { get; set; }
}
```
配置登录模态窗体
```csharp
[STAThread]
private static void Main(string[] args)
{
    ApplicationConfiguration.Initialize();

    var loginForm = new LoginForm();
    if (loginForm.ShowDialog() == DialogResult.OK)
    {
        Application.Run(new Main());
    }
}
```
处理登录的逻辑，登录成功后进行赋值操作
```csharp
private void button1_Click(object sender, EventArgs e)
{
    var flag = true;//登录成功
    if (flag)
    {
        Common.CurrentUser = new User
        {
            Id = 1,
            UserName = "张三",
        };
        this.DialogResult = DialogResult.OK;
    }
}
```
