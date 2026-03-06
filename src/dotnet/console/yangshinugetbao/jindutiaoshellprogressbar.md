---
title: 进度条ShellProgressBar
lang: zh-CN
date: 2023-08-07
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: jindutiaoshellprogressbar
slug: qyl216
docsId: '71201546'
---

## 介绍
和需要其他应用程序一样，控制台程序也可以执行长时任务。ShellProgressBar是一个非常棒的库，使用它，你可以在控制台输出一些非常惊艳的进度条。而且，ShellProgressBar是可以实现进度条的嵌套使用。
仓库地址：[https://github.com/Mpdreamz/shellprogressbar](https://github.com/Mpdreamz/shellprogressbar)

## 操作
```csharp
const int totalTicks = 10;
var options = new ProgressBarOptions
{
    ProgressCharacter = '─',
    ProgressBarOnBottom = true
};
using (var pbar = new ProgressBar(totalTicks, "Initial message", options))
{
    pbar.Tick(); //will advance pbar to 1 out of 10.
    //we can also advance and update the progressbar text
    pbar.Tick("Step 2 of 10"); 
}
```
