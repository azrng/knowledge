---
title: 前台创建UI和代码创建UI
lang: zh-CN
date: 2023-03-16
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: qiantaichuangjianuihedaimachuangjianui
slug: xr0pch7gkhfw2dcu
docsId: '118283811'
---

## 概述
关于UI可以通过XAML来创建也可以通过c#代码来创建

## 操作

### 代码创建
在该页面的代码后置文件，比如LoginPage.xaml.cs中编写下面的代码来创建一个登录界面
```csharp
public partial class LoginPage : ContentPage
{
    private readonly Button _loginButton;
    private readonly VerticalStackLayout _layout;

    public LoginPage()
    {
        //InitializeComponent();

        this.BackgroundColor = Color.FromArgb("512bdf");

        _layout = new VerticalStackLayout
        {
            Margin = new Thickness(15, 15, 15, 15),
            Padding = new Thickness(30, 60, 30, 30),
            Children =
            {
                new Label { Text = "请登录", FontSize = 30, TextColor = Color.FromRgb(255, 255, 100) },
                new Label { Text = "用户名", TextColor = Color.FromRgb(255, 255, 255) },
                new Entry (),
                new Label { Text = "密码", TextColor = Color.FromRgb(255, 255, 255) },
                new Entry { IsPassword = true }
            }
        };

        _loginButton = new Button { Text = "登录", BackgroundColor = Color.FromRgb(0, 148, 255) };
        _layout.Children.Add(_loginButton);

        Content = _layout;

        _loginButton.Clicked += (sender, e) =>
        {
            Debug.WriteLine("Clicked !");
        };
    }
}
```

### Xaml创建
```csharp
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             x:Class="MauiApp1.LoginPage"
             Title="LoginPage" BackgroundColor="#512bdf">
    <VerticalStackLayout Margin="15" Padding="30,60,30,30">
        <Label Text="请登录" FontSize="30" TextColor="Blue"></Label>
        <Label Text="用户名" TextColor="Black"></Label>
        <Entry x:Name="txtUserName" Placeholder="请输入用户名"></Entry>

        <Label Text="密码" TextColor="Black"></Label>
        <Entry x:Name="txtPassword" Placeholder="请输入用户名" IsPassword="True"></Entry>
        <Button Text="登录" BackgroundColor="#0094FF"  x:Name="loginBut" Clicked="loginBut_Clicked"></Button>
    </VerticalStackLayout>
</ContentPage>
```
后台触发事件
```csharp
public partial class LoginPage : ContentPage
{
    public LoginPage()
    {
        InitializeComponent();
    }

    private async void loginBut_Clicked(object sender, EventArgs e)
    {
        var userName = txtUserName.Text;
        var password = txtPassword.Text;

        await DisplayAlert("提示", $"用户名是：{userName} ", "确定");
    }
}
```
> 页面构造函数中的方法InitializeComponent读取页面的 XAML 描述，加载该页面上的各种控件，并设置它们的属性。只有在使用 XAML 标记定义页面时才调用此方法。前面显示如何使用 C## 代码创建 UI 的示例不会调用InitializeComponent.

