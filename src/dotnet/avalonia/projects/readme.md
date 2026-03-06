---
title: 开源项目
lang: zh-CN
date: 2023-08-01
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - component
slug: pslfidczzfy1i5ul
docsId: '126007775'
---

## 开源项目

Awesome Avalonia：[https://github.com/AvaloniaCommunity/awesome-avalonia](https://github.com/AvaloniaCommunity/awesome-avalonia  )

官网示例：[https://docs.avaloniaui.net/zh-Hans/docs/tutorials/samples](https://docs.avaloniaui.net/zh-Hans/docs/tutorials/samples)

中科时代开发示例：[https://github.com/Sinsegye-CSharp/AvaloniaSamples](https://github.com/Sinsegye-CSharp/AvaloniaSamples  )

ChatBox：[https://github.com/sealoyal2018/ChatBox](https://github.com/sealoyal2018/ChatBox)

TerraMours.Chat.Ava：基于Avalonia的智能AI会话项目，接入ChatGpt  [地址](https://github.com/raokun/TerraMours.Chat.Ava)



纸牌游戏：[网址](https://solitaire.xaml.live/) [源码地址](https://github.com/AvaloniaUI/Solitaire)

## 练手项目

Avalonia练手项目推荐：Wordle-onia：[https://mp.weixin.qq.com/s/l3XfvLrDA8FP-94FlvyyVg](https://mp.weixin.qq.com/s/l3XfvLrDA8FP-94FlvyyVg)

## 图标库

Fluent Icons：[https://avaloniaui.github.io/icons.html](https://avaloniaui.github.io/icons.html)

## UI组件库

### Semi.Avalonia

文档地址：[https://irihitech.github.io/Semi.Avalonia/](https://irihitech.github.io/Semi.Avalonia/)

仓库地址：[https://github.com/irihitech/Semi.Avalonia](https://github.com/irihitech/Semi.Avalonia)

中文文档：[https://koala.token-ai.cn/irihitech/Semi/controls](https://koala.token-ai.cn/irihitech/Semi/controls)

![image-20240107110944670](/dotnet/image-20240107110944670.png)

![image-20240107112348847](/dotnet/image-20240107112348847.png)

### SukiUI

UI主题, AvaloniaUI的一款桌面端和移动端控件库
仓库地址：[https://github.com/kikipoulet/SukiUI](https://github.com/kikipoulet/SukiUI)
参考资料：[https://mp.weixin.qq.com/s/_vGd7tuE1khM9mFbzWfM6A](https://mp.weixin.qq.com/s/_vGd7tuE1khM9mFbzWfM6A)

![image-20240107110803527](/dotnet/image-20240107110803527.png)

### Material.Avalonia

[AvaloniaUI](http://avaloniaui.net/)框架的可自定义Material Design实现

仓库地址：https://github.com/AvaloniaCommunity/Material.Avalonia

文档地址：https://github.com/AvaloniaCommunity/Material.Avalonia/wiki/Getting-started

![img](/dotnet/4b3fa63f997248a295ad9d96a1e1cfff.png)

![image-20240107112525569](/dotnet/image-20240107112525569.png)

### FluentAvalonia

适用于 Avalonia 应用的现代、流畅设计和受 WinUI 启发的工具包

仓库地址：https://github.com/amwx/FluentAvalonia

### Neumorphism.Avalonia

易于使用和可定制的 [AvaloniaUI](http://avaloniaui.net/) 框架的 Neumorphism Design 实现。

![image-20240107111558224](/dotnet/image-20240107111558224.png)

![image-20240107111637607](/dotnet/image-20240107111637607.png)

### Layui

这是一款Avalonia版本的LayUI风格的前端组件库
仓库地址：[https://github.com/Coolkeke/LayUI-Avalonia](https://github.com/Coolkeke/LayUI-Avalonia)

![image-20240107110714334](/dotnet/image-20240107110714334.png)

## MVVM

### ReactiveUI

ReactiveUI想学吗，可以看看我的开源项目[https://github.com/raokun/TerraMours.Chat.Ava](https://github.com/raokun/TerraMours.Chat.Ava)

### Actipro/Avalonia-Controls

https://github.com/Actipro/Avalonia-Controls | Actipro/Avalonia-Controls：Actipro Avalonia UI 控件示例和文档。 使用 Actipro 的控件和主题在 Avalonia UI 应用程序中构建漂亮的用户界面。

## 小工具组件

### AvaloniaEdit文本编辑器

仓库/文档地址：https://github.com/AvaloniaUI/AvaloniaEdit

MVVM绑定示例：https://github.com/AvaloniaUI/AvaloniaEdit/wiki/MVVM



基础使用示例

```
<avaloniaEdit:TextEditor
    FontFamily="新宋体"
    Grid.Column="0"
    HorizontalScrollBarVisibility="Auto"
    Margin="5,0"
    Name="{Binding Original}"
    Padding="0,5,5,5"
    ShowLineNumbers="True"
    VerticalScrollBarVisibility="Visible"
    WordWrap="True">
    <avaloniaEdit:TextEditor.Options>
        <!--  ShowSpaces="False"：设置编辑器选项，禁用显示空格。  -->
        <avaloniaEdit:TextEditorOptions ShowSpaces="False">
            <avaloniaEdit:TextEditorOptions.ColumnRulerPositions>
                <!--  设置列标尺的位置，这里设置为10  -->
                <system:Int32>10</system:Int32>
            </avaloniaEdit:TextEditorOptions.ColumnRulerPositions>
        </avaloniaEdit:TextEditorOptions>
    </avaloniaEdit:TextEditor.Options>
</avaloniaEdit:TextEditor>
```

* **TextEditorOptions.ShowSpaces**：设置编辑器选项，禁用显示空格
* **TextEditorOptions.ColumnRulerPositions**：设置列标尺的位置
* **FontFamily="新宋体"**：设置文本编辑器中文字的字体族，这里使用的是 "新宋体
* **HorizontalScrollBarVisibility="Auto"**：设置水平滚动条的可见性，这里是自动决定是否显示水平滚动条
* **VerticalScrollBarVisibility="Visible"**：设置垂直滚动条的可见性为可见
* **LineNumbersForeground="Black"**：设置行号的前景颜色为黑色
* **SyntaxHighlighting="JavaScript"**：启用 JavaScript 的语法高亮显示，这使得编辑器能够根据 JavaScript 的语法规则来着色显示文本
* **TextBlock.FontSize**：字体大小
* **ShowLineNumbers="True"**：启用显示行号
* **WordWrap="True"**：启动文本自动换行

### json-formatter

用于格式化 JSON 字符串的跨平台桌面应用程序

仓库地址：https://github.com/davidtimovski/json-formatter

### AsyncImageLoader异步图片

异步图片加载：https://github.com/AvaloniaUtils/AsyncImageLoader.Avalonia

### Markdown.Avalonia

Markdown输入框：https://github.com/whistyun/Markdown.Avalonia

### MediaPlayerUI.NET

视频播放器：https://github.com/mysteryx93/MediaPlayerUI.NET/

### 地图

https://github.com/Mapsui/Mapsui

https://github.com/ahopper/Mapsui/tree/initial-avalonia-port（Avalonia）

### 图形

https://github.com/oxyplot/oxyplot-avalonia

https://github.com/dotnet-ad/Microcharts

### 加载

avalonia加载动画：https://github.com/JamesBaiJun/LoadingAnimation.Avalonia.git

### 浮动窗口

停靠布局Dock：[https://github.com/wieslawsoltes/Dock](https://github.com/wieslawsoltes/Dock)
