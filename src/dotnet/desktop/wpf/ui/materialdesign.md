---
title: MaterialDesign
lang: zh-CN
date: 2023-06-09
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: materialdesign
slug: is7oor9gdf91n90b
docsId: '123553714'
---

## 概述
适用于 Windows 桌面的全面且易于使用的 Material Design 主题和控件库。
仓库地址：[https://github.com/MaterialDesignInXAML/MaterialDesignInXamlToolkit](https://github.com/MaterialDesignInXAML/MaterialDesignInXamlToolkit)

## 操作

### 基础配置
安装nuget包
```csharp
<PackageReference Include="MaterialDesignThemes" Version="4.8.0" />
```
修改App.xaml文件编写一下内容
```csharp
<Application . . .
    xmlns:materialDesign="http://materialdesigninxaml.net/winfx/xaml/themes">
    <Application.Resources>
        <ResourceDictionary>
            <ResourceDictionary.MergedDictionaries>
                <materialDesign:BundledTheme BaseTheme="Light" PrimaryColor="DeepPurple" SecondaryColor="Lime" />
                <ResourceDictionary Source="pack://application:,,,/MaterialDesignThemes.Wpf;component/Themes/MaterialDesignTheme.Defaults.xaml" />
            </ResourceDictionary.MergedDictionaries>
        </ResourceDictionary>
    </Application.Resources>
</Application>
```

### 控件

#### TextBox

##### 属性

- md:HintAssist.Hint：设置备注内容
- md:TextFieldAssist.HasClearButton：是否包含清楚按钮

#### PopupBox
弹框
```csharp
<md:PopupBox  Panel.ZIndex="1">
    <Button Content="删除" />
</md:PopupBox>
```

#### Transitioner
一个可以进行显示隐藏的面板
```csharp
<md:Transitioner Grid.Column="1" SelectedIndex="{Binding SelectedIndex}">
    <md:TransitionerSlide>

        <!--  第一个面板  -->
        <DockPanel
            Grid.Column="1"
            Margin="15"
            VerticalAlignment="Center">
            <TextBlock
                Margin="0,10"
                DockPanel.Dock="Top"
                FontSize="22"
                FontWeight="Bold"
                Text="欢迎使用" />
        </DockPanel>

    </md:TransitionerSlide>
</md:Transitioner>
```

#### Snackbar
消息提示窗口
```csharp
<md:Snackbar
    x:Name="LoginSnakeBar"
    Panel.ZIndex="1"
    MessageQueue="{md:MessageQueue}" />
```

### 常用属性
需要先导入命名空间
```csharp
xmlns:md="http://materialdesigninxaml.net/winfx/xaml/themes"
```

- md:HintAssist.Hint：显示文本，对应到html中的placeholder
- md:TextFieldAssist.HasClearButton：是否显示清除按钮

### 自带样式

- MaterialDesignFlatMidBgButton：
- MaterialDesignFloatingActionAccentButton：按钮圆角
