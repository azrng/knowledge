---
title: 数据绑定
lang: zh-CN
date: 2023-03-16
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: shujubangding
slug: azn2ga
docsId: '97595402'
---

## 操作

### 点击按钮绑定数据到文本标签
```csharp
<Label FontSize="22"
    HorizontalTextAlignment="Center"
    Text="{Binding ShiCiContent}"></Label>
<Button Text="加载诗词" Command="{Binding LoadShiCiCommand}"></Button>
```
点击之后触发后台事件
```csharp
public class MainPageViewModel : ObservableObject
{
    private readonly IJinRiShiCiService _jiIJinRiShiCiService;

    public MainPageViewModel(IJinRiShiCiService jiIJinRiShiCiService)
    {
        _jiIJinRiShiCiService = jiIJinRiShiCiService;
    }


    /// <summary>
    /// 诗词内容
    /// </summary>
    private string _shiCiContent;

    public string ShiCiContent
    {
        get => _shiCiContent;
        set => SetProperty(ref _shiCiContent, value);
    }

    private RelayCommand _loadShiCiCommand;

    public RelayCommand LoadShiCiCommand => _loadShiCiCommand ??= new RelayCommand(async () => ShiCiContent = (await _jiIJinRiShiCiService.GetContentAsync()).Item2);
}
```
ObservableObject来源自包CommunityToolkit.Mvvm

### 绑定静态值
创建静态类SharedResources保存公共配置
```csharp
public static class SharedResources
{
    /// <summary>
    /// 字体颜色
    /// </summary>
    public static readonly Color FontColor = Color.FromRgb(0, 0, 0xFF);

    /// <summary>
    /// 背景颜色
    /// </summary>
    public static readonly Color BackgroundColor = Color.FromRgb(0xFF, 0xF0, 0xAD);
}
```
然后再页面中使用
```csharp
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:mauiSample="clr-namespace:MauiSample"  
             x:Class="MauiSample.NotepadPage"
             Title="笔记">
```
需要像上面一样引入：mauiSample
然后使用示例
```csharp
<Label 
    Text="Notes"
    VerticalOptions="Center" 
    TextColor="{x:Static Member=mauiSample:SharedResources.FontColor}"
    HorizontalOptions="Center"
    FontAttributes="Bold"/>
```
