---
title: 问题
lang: zh-CN
date: 2024-03-13
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - avalonia
  - issue
---

## 未使用Fluent主题导致的不能预览

新创建的项目会自动应用一个名为 Fluent 的主题，对应的 Nuget 是：Avalonia.Themes.Fluent 。不过当你不使用这个主题，使用其他主题的时候，会导致无法预览，比如 Visual Studio 错误信息为

```
Unable to resolve type Avalonia.Data.RelativeSource
```

最终的解决方案是恢复对 Fluent 主题的引用，并确保 Application.Styles 节点中有 FluentTheme 标签：

```xaml
<Application.Styles>
  <FluentTheme />
   
   <!--引用其他的主题--> 
  <StyleInclude Source="avares://Semi.Avalonia/Themes/Index.axaml" />
</Application.Styles>
```

## Browser 项目不能展示中文的问题

基于 wasm 的 Browser 项目在启动后所有的中文字符都变成方框，无法正常显示。推测是字体的问题，于是找到了另一个库 Quick-AvaloniaFonts ：https://github.com/Quick-AvaloniaFonts

该库在 Nuget 上有多个包，其中两个是：

1. Quick.AvaloniaFonts.SourceHanSansCN
2. Quick.AvaloniaFonts.SourceHanSansCN.Slim

Source Han Sans （思源黑体），是由 Google 和 Adobe 合作开发的开源字体，使用 Apache 2.0 许可。第一个包内嵌了完整的字体文件，有将近 60 MB。第二个包只含一个 Normal 字体粗细，不到 10MB。

使用方是把 Programe.cs 文件中的 .WithInterFont() 替换为 .WithFont_SourceHanSansCN() 即可。

```c#

using Avalonia;
using System;

namespace TestApp;

class Program
{
    // Initialization code. Don't use any Avalonia, third-party APIs or any
    // SynchronizationContext-reliant code before AppMain is called: things aren't initialized
    // yet and stuff might break.
    [STAThread]
    public static void Main(string[] args) => BuildAvaloniaApp()
        .StartWithClassicDesktopLifetime(args);

    // Avalonia configuration, don't remove; also used by visual designer.
    public static AppBuilder BuildAvaloniaApp()
        => AppBuilder.Configure<App>()
            .UsePlatformDetect()
            //.WithInterFont()()
            .WithFont_SourceHanSansCN()
            .LogToTrace();
}
```

