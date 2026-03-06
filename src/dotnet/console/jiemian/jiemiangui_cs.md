---
title: 界面GUI.CS
lang: zh-CN
date: 2023-08-07
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: jiemiangui_cs
slug: uxr35c
docsId: '71201707'
---

## 概述
GUI.CS是一个非常棒的控制台UI工具包。它提供了一个功能完善的工具箱，开发人员可以使用它构建早期控制台常见的一种用户界面。

## 空间
提供了以下控件

- Buttons
- Labels
- Text Entry
- Text View
- User Inputs
- Windows
- Menus
- ScrollBars

## 操作
```csharp
using Terminal.Gui;

class Demo {
    static void Main ()
    {
        Application.Init ();
        var top = Application.Top;

    // 创建顶级窗体
        var win = new Window ("MyApp") {
        X = 0,
        Y = 1, // 预留菜单行

        // 使用Dim.Fill(), 它可以自动调整窗体大小，实现自适应，而无需手动敢于
        Width = Dim.Fill (),
        Height = Dim.Fill ()
    };
        top.Add (win);

    // 创建一个菜单
        var menu = new MenuBar (new MenuBarItem [] {
            new MenuBarItem ("_File", new MenuItem [] {
                new MenuItem ("_New", "Creates new file", NewFile),
                new MenuItem ("_Close", "", () => Close ()),
                new MenuItem ("_Quit", "", () => { if (Quit ()) top.Running = false; })
            }),
            new MenuBarItem ("_Edit", new MenuItem [] {
                new MenuItem ("_Copy", "", null),
                new MenuItem ("C_ut", "", null),
                new MenuItem ("_Paste", "", null)
            })
        });
        top.Add (menu);

    var login = new Label ("Login: ") { X = 3, Y = 2 };
    var password = new Label ("Password: ") {
            X = Pos.Left (login),
        Y = Pos.Top (login) + 1
        };
    var loginText = new TextField ("") {
                X = Pos.Right (password),
                Y = Pos.Top (login),
                Width = 40
        };
        var passText = new TextField ("") {
                Secret = true,
                X = Pos.Left (loginText),
                Y = Pos.Top (password),
                Width = Dim.Width (loginText)
        };
    
    // 添加一些其他控件
    win.Add (
        // 这是我最喜欢的布局
          login, password, loginText, passText,

        // 这里使用了绝对定位
            new CheckBox (3, 6, "Remember me"),
            new RadioGroup (3, 8, new [] { "_Personal", "_Company" }),
            new Button (3, 14, "Ok"),
            new Button (10, 14, "Cancel"),
            new Label (3, 18, "Press F9 or ESC plus 9 to activate the menubar"));

        Application.Run ();
    }
}
```

## 资料
转自：古道轻风
链接：cnblogs.com/88223100/p/upgraded-dotnet-console-experience.html
