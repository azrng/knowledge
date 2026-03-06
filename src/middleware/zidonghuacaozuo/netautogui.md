---
title: NetAutoGUI
lang: zh-CN
date: 2023-10-19
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 自动化
filename: netautogui
slug: nuospp
docsId: '92329605'
---

## 概述
一个键盘鼠标自动化的组件

仓库地址：[https://github.com/yangzhongke/NetAutoGUI](https://github.com/yangzhongke/NetAutoGUI)

## 操作
引用nuget包(直接安装最新版本)
```csharp
<PackageReference Include="NetAutoGUI.Windows" Version="1.0.0" />
```
该包目前支持的框架版本为：net6.0-windows7.0
```csharp
<TargetFramework>net6.0-windows7.0</TargetFramework>
```

### 查找窗口

```c#
// 根据进程id查询
var win = GUI.Application.FindWindowById(process.Id);

// 根据标题查询
var win = GUI.Application.WaitForWindowByTitle("拼多多");
```

### 定位区域

根据坐标去定位

```c#
// 移动到指定坐标
var win = GUI.Application.WaitForWindowByTitle("拼多多");
win.MoveMouseTo(200, 760);
```

根据图片去定位

```c#
var auth = win.Locate("images/tongyi.png", 0.6);
if (auth is not null)
{
    win.MoveMouseTo(auth.X + 10, auth.Y);
    win.Click();
}
```

### 键鼠操作

```c#
// 移动到指定坐标并点击
var win = GUI.Application.WaitForWindowByTitle("拼多多");
win.MoveMouseTo(200, 760);
win.Click();
```

## 实践

### 编辑文本文件

```csharp
GUI.Application.LaunchApplication("notepad.exe");
GUI.Application.WaitForWindowByTitle(t => t.Contains("记事本"));
GUI.Application.ActivateWindowByTitle(t => t.Contains("记事本"));
GUI.Keyboard.Write("你好，我是张三");
```
实现效果，打开记事本然后输入你好，我是张三

### 实现Tim登录
```csharp
var path = "D:\\Program Files\\Tencent\\TIM\\Bin\\QQScLauncher.exe";
var processName = "TIM";

var enabled = GUI.Application.IsApplicationRunning(processName);
if (enabled)
{
    Console.WriteLine("已经启动 现在杀死");
    GUI.Application.KillProcesses(processName);
}
GUI.Application.LaunchApplication(path);
var win = GUI.Application.WaitForWindowByTitle("TIM");
Thread.Sleep(2000);
win.MoveMouseTo(480, 247);
win.Click();

GUI.Keyboard.Write("xxxxx");
GUI.Keyboard.HotKey(VirtualKeyCode.TAB);
GUI.Keyboard.Write("xxxxx");
GUI.Keyboard.KeyDown(VirtualKeyCode.RETURN);
```
很赞一个包

