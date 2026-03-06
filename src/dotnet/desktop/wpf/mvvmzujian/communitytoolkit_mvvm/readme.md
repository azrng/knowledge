---
title: 说明
lang: zh-CN
date: 2023-05-18
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: readme
slug: czhf24y29guo9gid
docsId: '123678884'
---

## 概述
CommunityToolkit.Mvvm (又名 MVVM 工具包，以前名为 Microsoft.Toolkit.Mvvm) 是一个现代、快速且模块化的 MVVM 库。
官网文档：[https://learn.microsoft.com/zh-cn/dotnet/communitytoolkit/mvvm/](https://learn.microsoft.com/zh-cn/dotnet/communitytoolkit/mvvm/)
示例项目：[https://github.com/CommunityToolkit/MVVM-Samples](https://github.com/CommunityToolkit/MVVM-Samples)

## 操作
安装nuget包
```csharp
CommunityToolkit.Mvvm
```

### 依赖注入
修改App.xaml.cs文件
```csharp
public partial class App : Application
{
    public App()
    {
        Services = ConfigureServices();

        this.InitializeComponent();
    }

    /// <summary>
    /// Gets the current <see cref="App"/> instance in use
    /// </summary>
    public new static App Current => (App)Application.Current;

    /// <summary>
    /// Gets the <see cref="IServiceProvider"/> instance to resolve application services.
    /// </summary>
    public IServiceProvider Services { get; }

    /// <summary>
    /// Configures the services for the application.
    /// </summary>
    private static IServiceProvider ConfigureServices()
    {
        var services = new ServiceCollection();

        // 注入服务
        //services.AddSingleton<ISettingsService, SettingsService>();
        //services.AddSingleton<IEmailService, EmailService>();

         services.AddTransient<MainWindow>();   
        // 注入ViewModels
        services.AddTransient<MainWindowViewModel>();

        return services.BuildServiceProvider();
    }
    
	private void Application_Startup(object sender, StartupEventArgs e)
    {
        var mainWindows = Services.GetRequiredService<MainWindow>();
        mainWindows.Show();
    }
}
```
然后修改App.xaml文件，去除StartupUri="MainWindow.xaml"，改为Startup="Application_Startup"
```csharp
<Application
    x:Class="AzrngTools.App"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:local="clr-namespace:AzrngTools"
    Startup="Application_Startup">
```
然后编写MainWindow.xaml页面对应的ViewModel
```csharp
public class MainWindowViewModel : ObservableObject
{
    public MainWindowViewModel()
    {
        Content = "测试绑定";
    }
    private string _content;
    /// <summary>
    /// 内容
    /// </summary>
    public string Content
    {
        get => _content;
        set => SetProperty(ref _content, value);
    }
}
```
MainWindowViewModel优化写法，参考：[https://learn.microsoft.com/zh-cn/dotnet/communitytoolkit/mvvm/generators/observableproperty#how-it-works](https://learn.microsoft.com/zh-cn/dotnet/communitytoolkit/mvvm/generators/observableproperty#how-it-works)
```csharp
public partial class MainWindowViewModel : ObservableObject
{
    public MainWindowViewModel()
    {
        Content = "测试绑定";
    }

    [ObservableProperty]
    private string _content;
}
```
记得在页面文件MainWindow.xaml.cs设置数据上下文
```csharp
public partial class MainWindow : Window
{
    public MainWindow()
    {
        InitializeComponent();

        this.DataContext = App.Current.Services.GetRequiredService<MainWindowViewModel>();
    }
}
```
也可以直接在xaml页面增加如下代码
```csharp
xmlns:vm="clr-namespace:AzrngTools.ViewModel"
d:DataContext="{d:DesignInstance Type=vm:SymmetricalEncryViewModel}"
```
然后就可以在页面上显示带提示功能绑定
```csharp
<Grid>
    <TextBlock Text="{Binding Content}" />
</Grid>
```

### 创建命令
想实现一个点击页面按钮，然后修改界面绑定值的效果，首先编写页面
```csharp
<StackPanel>
    <TextBlock Text="{Binding Content}" />
    <Button Command="{Binding UpdateValueCommand}" Content="改变文本框的值"> </Button>
</StackPanel>
```
编写viewmodel代码
```csharp
public partial class MainWindowViewModel : ObservableObject
{
    public MainWindowViewModel()
    {
        Content = "测试绑定";
    }

    /// <summary>
    /// 内容
    /// </summary>
    [ObservableProperty]
    private string _content;

    private ICommand updateValueCommand;

    public ICommand UpdateValueCommand => updateValueCommand ??= new RelayCommand(UpdateValue);

    private void UpdateValue()
    {
        Content = "更新后的值";
    }
}
```
当然还可以简写为
```csharp
public partial class MainWindowViewModel : ObservableObject
{
    public MainWindowViewModel()
    {
        Content = "测试绑定";
    }

    /// <summary>
    /// 内容
    /// </summary>
    [ObservableProperty]
    private string _content;

    [RelayCommand]
    private void UpdateValue()
    {
        Content = "更新后的值";
    }
}
```
需要注意的是，记得给页面指定绑定的上下文，修改MainWindow.xaml.cs文件
```csharp
public partial class MainWindow : Window
{
    public MainWindow()
    {
        InitializeComponent();

        this.DataContext = App.Current.Services.GetRequiredService<MainWindowViewModel>();
    }
}
```
App.Current.Services代码可以查看上面的依赖注入的代码。

### 消息
负责ViewModel和ViewModel、View和ViewModel之间的通信。
接口 IMessenger 是可用于在不同对象之间交换消息的类型协定。
MVVM Toolkit提供现装实现：WeakReferenceMessenger在内部使用弱引用，为收件人提供自动内存管理。StrongReferenceMessenger使用强引用，并且要求开发人员在不再需要接收者时手动取消订阅收件人

消息：[https://www.cnblogs.com/cdaniu/p/16852620.html](https://www.cnblogs.com/cdaniu/p/16852620.html)

注册消息
```csharp
WeakReferenceMessenger.Default.Register<InfoMessage>(this, (r, m) =>
            {
                //do something
                messageService?.ShowMessage(this, $"收到消息：{m.Message} Date:{m.Date}");
            });
```
发送消息
```csharp
WeakReferenceMessenger.Default.Send(new InfoMessage() 
            {
                Date = DateTime.Now,
                Message="AAA"
 
            });
```
取消注册
```csharp
WeakReferenceMessenger.Default.UnregisterAll(this);
```

## 资料
依赖注入：[https://learn.microsoft.com/zh-cn/dotnet/communitytoolkit/mvvm/ioc](https://learn.microsoft.com/zh-cn/dotnet/communitytoolkit/mvvm/ioc)
