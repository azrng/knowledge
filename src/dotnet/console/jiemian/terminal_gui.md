---
title: Terminal.Gui
lang: zh-CN
date: 2023-08-05
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: terminal_gui
slug: mqyu1tvofrkgyphz
docsId: '135412143'
---

## 概述
Terminal.Gui 是一个使用 C## 开发的基于控制台的工具库。这个框架的设计目的是， 在单色终端和支持鼠标的现代彩色终端上， 开发人员也可以非常轻松地进行开发并运行程序。
Terminal.Gui 是跨平台的, 它适用于 Windows、Linux 和 MacOS。

仓库地址：[https://github.com/gui-cs/Terminal.Gui](https://github.com/gui-cs/Terminal.Gui)

## 操作
需要提前安装nuget包：Terminal.Gui

## 基础使用
```csharp
using Terminal.Gui;

class Demo
{
    static int Main()
    {
        Application.Init();

        var n = MessageBox.Query(50, 7,
            "Question", "你喜欢这个控制台应用吗?", "Yes", "No");

        Application.Shutdown();
        return n;
    }
}
```

## 示例

### 登录
使用用户名和密码进行登录的一个示例
```csharp
// A simple Terminal.Gui example in C## - using C## 9.0 Top-level statements

using Terminal.Gui;

Application.Run<ExampleWindow> ();

System.Console.WriteLine ($"Username: {((ExampleWindow)Application.Top).usernameText.Text}");

// Before the application exits, reset Terminal.Gui for clean shutdown
Application.Shutdown ();

// Defines a top-level window with border and title
public class ExampleWindow : Window {
    public TextField usernameText;
    
    public ExampleWindow ()
    {
        Title = "Example App (Ctrl+Q to quit)";

        // Create input components and labels
        var usernameLabel = new Label () { 
            Text = "Username:" 
        };

        usernameText = new TextField ("") {
            // Position text field adjacent to the label
            X = Pos.Right (usernameLabel) + 1,

            // Fill remaining horizontal space
            Width = Dim.Fill (),
        };

        var passwordLabel = new Label () {
            Text = "Password:",
            X = Pos.Left (usernameLabel),
            Y = Pos.Bottom (usernameLabel) + 1
        };

        var passwordText = new TextField ("") {
            Secret = true,
            // align with the text box above
            X = Pos.Left (usernameText),
            Y = Pos.Top (passwordLabel),
            Width = Dim.Fill (),
        };

        // Create login button
        var btnLogin = new Button () {
            Text = "Login",
            Y = Pos.Bottom(passwordLabel) + 1,
            // center the login button horizontally
            X = Pos.Center (),
            IsDefault = true,
        };

        // When login button is clicked display a message popup
        btnLogin.Clicked += () => {
            if (usernameText.Text == "admin" && passwordText.Text == "password") {
                MessageBox.Query ("Logging In", "Login Successful", "Ok");
                Application.RequestStop ();
            } else {
                MessageBox.ErrorQuery ("Logging In", "Incorrect username or password", "Ok");
            }
        };

        // Add the views to the Window
        Add (usernameLabel, usernameText, passwordLabel, passwordText, btnLogin);
    }
}
```

## 扩展

### Terminal Gui Designer
TerminalGuiDesigner 使用 CodeDom 和 Roslyn 构建，可让您通过拖放来创建复杂的视图，就像您熟悉和喜爱的 WinForms 设计器一样。

### Dotnet Dump 分析器
这是一个基于gui.cs 的小型ui，可以和 dotnet dump 一起使用，它能够列出所有受支持的 SOS 命令的输出。

## 参考资料
[https://mp.weixin.qq.com/s/QVQi0yV5Z9gEwLEJ5FQiVw](https://mp.weixin.qq.com/s/QVQi0yV5Z9gEwLEJ5FQiVw) | Terminal.Gui - 适用于 .NET 的跨平台终端 UI 工具包
