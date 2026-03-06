---
title: 基础布局示例
lang: zh-CN
date: 2023-05-06
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: jichubujushili
slug: sx7gevx2qasffarw
docsId: '123098526'
---

## 示例
![image.png](/common/1682431646958-5fa59a45-3d60-49c7-ab21-76edccb74772.png)
```csharp
<Window
    x:Class="WpfApp1.MainWindow"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:local="clr-namespace:WpfApp1"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    Title="MainWindow"
    Width="800"
    Height="450"
    mc:Ignorable="d">
    <Grid>
        <Grid.RowDefinitions>
            <RowDefinition Height="100" />
            <RowDefinition />
        </Grid.RowDefinitions>
        <Border Background="#7372D6" />
        <Grid Grid.Row="1">
            <Grid.ColumnDefinitions>
                <ColumnDefinition Width="200" />
                <ColumnDefinition />
            </Grid.ColumnDefinitions>
            <Border Grid.Column="0" Background="#0001FC" />
            <Grid Grid.Column="1" Margin="5">
                <Grid.ColumnDefinitions>
                    <ColumnDefinition />
                    <ColumnDefinition />
                    <ColumnDefinition />
                    <ColumnDefinition />
                    <ColumnDefinition />
                </Grid.ColumnDefinitions>
                <Grid.RowDefinitions>
                    <RowDefinition Height="0.8*" />
                    <RowDefinition />
                    <RowDefinition />
                </Grid.RowDefinitions>
                <Border Grid.Column="0" Background="Yellow" />
                <Border Grid.Column="1" Background="#4D9FCA" />
                <Border Grid.Column="2" Background="#D470CF" />
                <Border Grid.Column="3" Background="#5AC2B6" />
                <Border Grid.Column="4" Background="#D5717E" />

                <Border
                    Grid.Row="1"
                    Grid.ColumnSpan="3"
                    Background="#8F3B82" />

                <Border
                    Grid.Row="1"
                    Grid.Column="3"
                    Grid.ColumnSpan="2"
                    Background="#E6E3E6" />

                <Border
                    Grid.Row="2"
                    Grid.ColumnSpan="3"
                    Background="#2D96BE" />

                <Border
                    Grid.Row="2"
                    Grid.Column="3"
                    Grid.ColumnSpan="2"
                    Background="#ADB3E1" />

            </Grid>
        </Grid>
    </Grid>
</Window>
```

## 示例
![image.png](/common/1682434005072-4007531a-4980-4540-8619-ce55369d1ea7.png)
```csharp
<Window
    x:Class="WpfApp1.MainWindow"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:local="clr-namespace:WpfApp1"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    Title="MainWindow"
    Width="800"
    Height="450"
    mc:Ignorable="d">
    <Grid>
        <Grid.RowDefinitions>
            <RowDefinition Height="100" />
            <RowDefinition />
            <RowDefinition />
        </Grid.RowDefinitions>
        <!--  头部工具栏  -->
        <Border Background="#FFDEE8" />
        <!--  中间栏  -->
        <Grid Grid.Row="1" Height="140">
            <Grid.ColumnDefinitions>
                <ColumnDefinition />
                <ColumnDefinition />
                <ColumnDefinition />
                <ColumnDefinition />
                <ColumnDefinition />
            </Grid.ColumnDefinitions>
            <Border
                Grid.Column="0"
                Margin="10,0,10,0"
                Background="#2C9FF8"
                CornerRadius="10" />
            <Border
                Grid.Column="1"
                Margin="10,0,10,0"
                Background="#67CA27"
                CornerRadius="10" />
            <Border
                Grid.Column="2"
                Margin="10,0,10,0"
                Background="#FDA005"
                CornerRadius="10" />
            <Border
                Grid.Column="3"
                Margin="10,0,10,0"
                Background="#3CC5C2"
                CornerRadius="10" />
            <Border
                Grid.Column="4"
                Margin="10,0,10,0"
                Background="#DF6F6E"
                CornerRadius="10" />
        </Grid>


        <Grid Grid.Row="2">
            <Grid.ColumnDefinitions>
                <ColumnDefinition Width="0.4*" />
                <ColumnDefinition />
            </Grid.ColumnDefinitions>
            <!--  下左侧  -->
            <Grid Grid.Column="0">
                <Grid.RowDefinitions>
                    <RowDefinition />
                    <RowDefinition />
                    <RowDefinition />
                </Grid.RowDefinitions>
                <Grid.ColumnDefinitions>
                    <ColumnDefinition />
                    <ColumnDefinition />
                </Grid.ColumnDefinitions>
                <Border
                    Grid.Row="0"
                    Grid.Column="0"
                    Grid.ColumnSpan="2"
                    Background="Black" />
                <Border
                    Grid.Row="1"
                    Grid.Column="0"
                    Background="Red" />
                <Border
                    Grid.Row="1"
                    Grid.Column="1"
                    Background="Yellow" />
                <Border
                    Grid.Row="2"
                    Grid.Column="0"
                    Background="Blue" />
                <Border
                    Grid.Row="2"
                    Grid.Column="1"
                    Background="Green" />
            </Grid>

            <!--  下游侧  -->
            <Grid Grid.Column="1">
                <Grid.RowDefinitions>
                    <RowDefinition />
                    <RowDefinition />
                </Grid.RowDefinitions>
                <Grid.ColumnDefinitions>
                    <ColumnDefinition />
                    <ColumnDefinition />
                </Grid.ColumnDefinitions>
                <Border Grid.Column="0" Background="#BD000E" />
                <Border Grid.Column="1" Background="#2AA1F6" />
                <Border
                    Grid.Row="1"
                    Grid.Column="0"
                    Grid.ColumnSpan="2"
                    Background="Yellow" />
            </Grid>
        </Grid>
    </Grid>
</Window>
```

## 布局仓库示例

### CSharpDesignPro
[https://github.com/CSharpDesignPro/Page-Navigation-using-MVVM](https://github.com/CSharpDesignPro/Page-Navigation-using-MVVM)
[https://github.com/CSharpDesignPro/WPF---Responsive-UI-Design](https://github.com/CSharpDesignPro/WPF---Responsive-UI-Design)
[https://github.com/CSharpDesignPro/Navigation-Drawer-Sidebar-Menu-in-WPF](https://github.com/CSharpDesignPro/Navigation-Drawer-Sidebar-Menu-in-WPF)
