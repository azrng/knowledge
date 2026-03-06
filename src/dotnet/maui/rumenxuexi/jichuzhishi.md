---
title: 基础知识
lang: zh-CN
date: 2023-03-21
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: jichuzhishi
slug: gaont6
docsId: '97589577'
---

## 概述
官方文档：[https://learn.microsoft.com/zh-cn/dotnet/maui/user-interface/layouts/](https://learn.microsoft.com/zh-cn/dotnet/maui/user-interface/layouts/)

## 基本语法

### 标签(Lable)

- Text：设置文本值
- FontSize：设置字体大小
- VerticalOptions：垂直对其方式
- HorizontalOptions：水平对其方式
- FontAttributes：设置字体属性，如粗体

### 文本框(Entry)

- Name：控件名
- Text：默认显示的值

### 按钮(Button)

- Name：控件名
- Text：显示的名称
- Clicked：点击事件
- IsEnabled：是否启用
- VerticalOptions：水平对其方式
- HorizontalOptions：垂直对其方式
- WidthRequest：指定宽度(double类型)
- HeightRequest：指定高度(double类型)

### 图片(Image)

- Source：图片来源
- HeightRequest：高度
- VerticalOptions：垂直对其方式
- HorizontalOptions：水平对其方式

## 布局
.NET MAUI 提供了一个布局面板来帮助构建一致的用户界面，将视图放在布局面板中，这些面板会自动管理其子视图的大小和位置。这些面板使跨不同设备创建一致的用户界面变得更加容易。

布局面板是一个 .NET MAUI 容器，它包含子视图的集合并确定它们的大小和位置。当应用程序大小发生变化时，布局面板会自动重新计算；例如，当用户旋转设备时。

- StackLayout：将其子视图排列在一行或一列中。除了StackLayout，还有一个新的优化VerticalStackLayout，HorizontalStackLayout当你不需要改变方向时。
- AbsoluteLayout：使用 x 和 y 坐标排列其子视图。
- FlexLayout: 像 a 一样排列它的子视图，StackLayout除了如果它们不适合单个行或列，您可以将它们包装起来。
- Grid：将其子视图排列在由行和列创建的单元格中。

布局资料：[https://learn.microsoft.com/zh-cn/training/modules/customize-xaml-pages-layout/2-specify-size-view](https://learn.microsoft.com/zh-cn/training/modules/customize-xaml-pages-layout/2-specify-size-view)

### 属性

- Padding：填充单位
- Spacing：单位间距

### StackLayout

#### 嵌套布局
```csharp
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             x:Class="MauiSample.LayoutSample2Page"
             Title="计算小费">
    <VerticalStackLayout Padding="40" Spacing="10" >

        <HorizontalStackLayout Spacing="10">
            <Label Text="记账"  WidthRequest="100" VerticalOptions="Center" HorizontalOptions="Center"/>
            <Entry x:Name="billInput" Placeholder="请输入金额" Keyboard="Numeric" />
        </HorizontalStackLayout>

        <HorizontalStackLayout Margin="0,20,0,0" Spacing="10">
            <Label Text="小费" WidthRequest="100"   />
            <Label x:Name="tipOutput" Text="0.00" />
        </HorizontalStackLayout>

        <HorizontalStackLayout Spacing="10">
            <Label Text="总计"  WidthRequest="100"/>
            <Label x:Name="totalOutput" Text="0.00" />
        </HorizontalStackLayout>

        <HorizontalStackLayout VerticalOptions="End" Spacing="10">
            <Label Text="小费比例" WidthRequest="100" />
            <Label x:Name="tipPercent" Text="15%" />
        </HorizontalStackLayout>
        <Slider x:Name="tipPercentSlider" Minimum="0" Maximum="100" Value="15" />

        <HorizontalStackLayout Margin="0,20,0,0" Spacing="10">
            <Button Text="15%" x:Name="NormalTip"  HorizontalOptions="Center"  WidthRequest="150" Clicked="NormalTip_Clicked" />
            <Button Text="20%" x:Name="GenerousTip" HorizontalOptions="Center"  WidthRequest="150" Clicked="GenerousTip_Clicked" />
        </HorizontalStackLayout>

        <HorizontalStackLayout Margin="0,20,0,0" Spacing="10">
            <Button x:Name="roundDown" HorizontalOptions="Center"  WidthRequest="150" Text="向下舍入" />
            <Button x:Name="roundUp" HorizontalOptions="Center"  WidthRequest="150"  Text="向上舍入" />
        </HorizontalStackLayout>
    </VerticalStackLayout>
</ContentPage>
```

### Grid
表格的样式
资料：[https://learn.microsoft.com/zh-cn/training/modules/customize-xaml-pages-layout/6-arrange-views-grid](https://learn.microsoft.com/zh-cn/training/modules/customize-xaml-pages-layout/6-arrange-views-grid)

- RowDefinition：支持设置高度或者Auto(自动调整)
- ColumnDefinition

#### 网格集合
```csharp
<Grid>
    <Grid.RowDefinitions>
        <RowDefinition Height="100" />
        <RowDefinition Height="Auto" />
        <RowDefinition Height="1*" />
        <RowDefinition Height="2*" />
    </Grid.RowDefinitions>
    ...
</Grid>
```
简写
```csharp
<Grid RowDefinitions="100, Auto, 1*, 2*">
    ...
</Grid>
```

#### 三行三列
展示出来一个三行，三列的表格
一个简单的写法是
```
<Grid RowDefinitions="*,Auto" ColumnDefinitions="*,*,*"></Grid>
```
正常的写法如下
```csharp
<Grid>
    <Grid.RowDefinitions>
        <!--height:*(有多少占多少),auto(内容有多少占用多少) -->
        <RowDefinition Height="*" ></RowDefinition>
        <RowDefinition Height="Auto"></RowDefinition>
        <RowDefinition Height="Auto"></RowDefinition>
    </Grid.RowDefinitions>
    <Grid.ColumnDefinitions>
        <ColumnDefinition Width="*"></ColumnDefinition>
        <ColumnDefinition Width="*"></ColumnDefinition>
        <ColumnDefinition Width="*"></ColumnDefinition>
    </Grid.ColumnDefinitions>

    <ListView
        Grid.Row="0"
        Grid.Column="0"
        Grid.ColumnSpan="3"
        ItemsSource="{Binding Pretries}">
        <ListView.ItemTemplate>
            <DataTemplate>
                <ViewCell>
                    <!--垂直布局-->
                    <VerticalStackLayout Padding="8">
                        <Label Text="{Binding Title}" FontSize="22"></Label>
                        <Label Text="{Binding Content}" FontSize="22"></Label>
                    </VerticalStackLayout>
                </ViewCell>
            </DataTemplate>
        </ListView.ItemTemplate>

    </ListView>

    <!--按钮存放到第1行第0列-->
    <Button Grid.Row="1" Grid.Column="0" Text="添加" Command="{Binding AddCommand}"></Button>
    <Button Grid.Row="1" Grid.Column="1" Text="列表" Command="{Binding ListCommand}"></Button>
    <Button Grid.Row="1" Grid.Column="2" Text="清空" Command="{Binding ClearCommand}"></Button>


    <Label Grid.Row="2"
            Grid.Column="0"
            Grid.ColumnSpan="2"
            FontSize="22"
            HorizontalTextAlignment="Center"
            Text="{Binding ShiCiContent}"></Label>
    <Button Grid.Row="2"
            Grid.Column="2" 
            Text="加载诗词" Command="{Binding LoadShiCiCommand}"></Button>
</Grid>
```

## 弹框
带取消按钮的弹框
```csharp
if(await this.DisplayAlert("拨号", "你想去拨打 " + translatedNumber + "吗?", "确定", "取消"))
```
消息提示
```csharp
await DisplayAlert("Alert", "You have been alerted", "OK");
```

## 窗口

### 设置窗口名称
在左上角设置窗口名称，App.xaml文件的查看代码，增加下面的代码
```csharp
protected override Window CreateWindow(IActivationState activationState)
{
    // 重写并设置窗体名
    var windows = base.CreateWindow(activationState);
    if (DeviceInfo.Current.Platform == DevicePlatform.WinUI)
    {
        windows.Title = "Tools";
    }
    return windows;
}
```

### 去掉标题栏
MainPage.xaml的后置代码增加
```csharp
	private void ContentPage_Loaded(object sender, EventArgs e)
	{

#if WINDOWS
		var winuiWindow = Window.Handler?.PlatformView as Microsoft.UI.Xaml.Window;
		MauiWinUIWindow maui = winuiWindow as MauiWinUIWindow;

		winuiWindow.ExtendsContentIntoTitleBar = false;
		if (winuiWindow is null)
			return;

		var wndId = Microsoft.UI.Win32Interop.GetWindowIdFromWindow(maui.WindowHandle);
		Microsoft.UI.Windowing.AppWindow appWindow = Microsoft.UI.Windowing.AppWindow.GetFromWindowId(wndId);
		//var appWindow = maui.GetAppWindow();
		if (appWindow is null)
			return;

		var customOverlappedPresenter = Microsoft.UI.Windowing.OverlappedPresenter.CreateForContextMenu();
		appWindow.SetPresenter(customOverlappedPresenter);
#endif
	}
```
MauiProgram的CreateMauiApp增加
```csharp
builder
    .UseMauiApp<App>()
    .ConfigureFonts(fonts =>
    {
        fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
        fonts.AddFont("OpenSans-Semibold.ttf", "OpenSansSemibold");
    }).ConfigureLifecycleEvents(events =>
    {
#if WINDOWS
        events.AddWindows(windows => windows
        .OnWindowCreated(window =>
                        {
                            //window.SizeChanged += OnSizeChanged;
                            MauiWinUIWindow mauiwin = window as MauiWinUIWindow;
                            if (mauiwin == null) { return; }

                            //关闭扩展内容
                            mauiwin.ExtendsContentIntoTitleBar = false;
                            mauiwin.Title = "Hello Maui";

                            //通过maui窗口句柄获取appwindow-- -
                            ///这里有个操蛋的东西我用最新版新建的工程没法直接getappwindow所以用了文章里的方法
                            var wndId = Microsoft.UI.Win32Interop.GetWindowIdFromWindow(mauiwin.WindowHandle);
                            Microsoft.UI.Windowing.AppWindow appwin = Microsoft.UI.Windowing.AppWindow.GetFromWindowId(wndId);

                            //对于OverlappedPresenter的解释文档在这个网址
                            //https://learn.microsoft.com/zh-tw/windows/windows-app-sdk/api/winrt/microsoft.ui.windowing.overlappedpresenter?view=windows-app-sdk-1.2

                            //大致就是OverlappedPresenter会设置这个窗口，这个窗口可以和其他窗口重叠，并对窗口标题栏 状态栏 工作栏进行设置，以及其他一些调整窗口的操作
                            var customOverlappedPresenter = Microsoft.UI.Windowing.OverlappedPresenter.CreateForContextMenu();
                            appwin.SetPresenter(customOverlappedPresenter);
                        }));
#endif
    });
```

## 导航

- Navigation.PushAsync用于将页面推入导航堆栈中，创建一个新的导航记录并导航到新页面。这是在已有导航堆栈上打开一个新页面的方式。使用此方法时，可以在新页面上看到导航栏和返回按钮，通过返回按钮可以返回到上一个页面。在使用PushAsync方法时，需要确保当前页在NavigationPage中，否则会出现异常。如果当前页不在NavigationPage中，可以将当前页包装在NavigationPage中，然后再使用此方法进行导航。例如：await Navigation.PushAsync(new MyNewPage());
   - 跳转后还存在导航栏
- Navigation.PushModalAsync用于将页面推入模态堆栈中，创建一个新的模态记录并导航到新页面。这是在已有模态堆栈上打开一个新页面的方式。使用此方法时，可以在新页面上看到返回按钮，但是没有导航栏。在使用PushModalAsync方法时，不需要将当前页包装在NavigationPage中，也不需要担心当前页在哪个页面中。当使用PushModalAsync方法时，可以使用返回按钮返回到上一个页面。例如：await Navigation.PushModalAsync(new MyNewModalPage());
   - 没有导航栏

### 浮出控件导航
菜单项窗口从设备屏幕的一侧划出(飞出)。

修改AppShell.xaml文件，然后内容如下，包含三个导航项和一个页脚
```csharp
<?xml version="1.0" encoding="UTF-8" ?>
<Shell
    x:Class="Astronomy.AppShell"
    xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
    xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
    xmlns:local="clr-namespace:Astronomy.Pages"
    FlyoutIcon="moon.png">

    <!--导航页头-->
    <Shell.FlyoutHeader>
        <Grid HeightRequest="100" BackgroundColor="DarkSlateBlue">
            <Image Source="moon.png"></Image>
        </Grid>
    </Shell.FlyoutHeader>

    <FlyoutItem Title="Moon Phase" Icon="moon.png">
        <ShellContent
        ContentTemplate="{DataTemplate local:MoonPhasePage}" />
    </FlyoutItem>

    <FlyoutItem Title="Sunrise" Icon="sun.png">
        <ShellContent
        ContentTemplate="{DataTemplate local:SunrisePage}"/>
    </FlyoutItem>

    <FlyoutItem Title="About" Icon="question.png">
        <ShellContent
        ContentTemplate="{DataTemplate local:AboutPage}"/>
    </FlyoutItem>

    <!--导航页脚-->
    <Shell.FlyoutFooter>
        <Label HorizontalOptions="Center" FontSize="20" Text=".Net Maui"></Label>
    </Shell.FlyoutFooter>
</Shell>

```

### 选项卡导航
选项卡导航是一种模式，选项卡条永久停留在屏幕的顶部或者底部。
资料：[https://learn.microsoft.com/zh-cn/training/modules/create-multi-page-apps/4-implement-tab-navigation](https://learn.microsoft.com/zh-cn/training/modules/create-multi-page-apps/4-implement-tab-navigation)

修改AppShell文件为
```csharp
<Shell xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
       xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
       xmlns:views="clr-namespace:Xaminals.Views"
       x:Class="Xaminals.AppShell">
    <TabBar>
       <Tab Title="Moon Phase"
            Icon="moon.png">
           <ShellContent ContentTemplate="{DataTemplate local:MoonPhasePage}" />
       </Tab>
       <Tab Title="Sunrise"
            Icon="sun.png">
           <ShellContent ContentTemplate="{DataTemplate local:SunrisePage}" />
       </Tab>
    </TabBar>
</Shell>
```
弹出项可以打开带有显示一个或多个选项卡的选项卡栏的页面。
实现这一点相对简单。在为每个要显示的选项卡`<FlyoutItem>`添加多个项目。`<ShellContent>`
在 上设置Title和以控制选项卡的标题和图标。`Icon<ShellContent>`
```csharp
<FlyoutItem Title="Astronomy" Icon="moon.png">
    <ShellContent Title="Moon Phase" Icon="moon.png"
        ContentTemplate="{DataTemplate local:MoonPhasePage}"/>

    <ShellContent Title="Sunrise" Icon="sun.png"
        ContentTemplate="{DataTemplate local:SunrisePage}"/>
</FlyoutItem>

<FlyoutItem Title="About" Icon="question.png">
    <ShellContent
        ContentTemplate="{DataTemplate local:AboutPage}"/>
</FlyoutItem>
```
AppShell最后的样子
```csharp
<?xml version="1.0" encoding="UTF-8" ?>
<Shell
    x:Class="Astronomy.AppShell"
    xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
    xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
    xmlns:local="clr-namespace:Astronomy.Pages"
    FlyoutIcon="moon.png">

    <!-- You can add this back in for the header -->
    <!--<Shell.FlyoutHeader>
        <Grid HeightRequest="100" BackgroundColor="DarkSlateBlue">
            <Image Source="moon.png"/>
        </Grid>
    </Shell.FlyoutHeader>-->


    <FlyoutItem Title="Astronomy" Icon="moon.png">
        <ShellContent Title="Moon Phase" Icon="moon.png"
            ContentTemplate="{DataTemplate local:MoonPhasePage}"/>

        <ShellContent Title="Sunrise" Icon="sun.png"
            ContentTemplate="{DataTemplate local:SunrisePage}"/>
    </FlyoutItem>

    <FlyoutItem Title="About" Icon="question.png">
        <ShellContent
            ContentTemplate="{DataTemplate local:AboutPage}"/>
    </FlyoutItem>

</Shell>
```

### 混合使用
资料：[https://learn.microsoft.com/zh-cn/training/modules/create-multi-page-apps/6-use-tabbed-pages-with-navigation-pages](https://learn.microsoft.com/zh-cn/training/modules/create-multi-page-apps/6-use-tabbed-pages-with-navigation-pages)

### PushAsync
点击按钮后跳转界面
```csharp
<Button Text="跳转到目标页面" Clicked="OnButtonClicked" />
```
触发事件
```csharp
private async void OnButtonClicked(object sender, EventArgs e)
{
    await Navigation.PushAsync(new TargetPage());
}
```

如果要在Shell应用程序中使用按钮进行页面导航，则应将ShellContent的ContentTemplate属性设置为目标页面的DataTemplate标记扩展
```csharp
<ShellContent Title="目标页面" ContentTemplate="{DataTemplate local:TargetPage}" />
```

## 共享资源设计
资源就像编程语言中的符号常量，你可以在一个地方定义它，然后再需要的任何地方引用它。资源可以是跨UI共享的任何对象，常见的示例就是字体、颜色和大小，也可以是Style和OnPlatform实例等复杂对象存储为资源。

创建资源
每个Maui的XAML页面都有一个名为Resource的属性，它用来保存资源对象。
```csharp
<ContentPage.Resources>
    ...
</ContentPage.Resources>

// 在控件中创建资源
<Label Text="Hello, World!"
        ...
        <Label.Resources>
           ...
        </Label.Resources>
</Label>
```
举例
```csharp
<ContentPage.Resources>
    <Color x:Key="PageControlTextColor">Blue</Color>
</ContentPage.Resources>
```
> 创建这个资源密钥(Key)的时候，要选择一个反映资源用途的而非资源价值的名称，比如想设置一个背景色为红色可以设置为BackgroudColor，而不是设置为RedColor

如果要使用上面的资源，可以使用StaticResource标记来查找
```csharp
<Label TextColor="{StaticResource PageControlTextColor}" ... />
```
> 如果StaticResource找不到资源，那么就会抛出异常，并且该值只查询一次，后续变更了收不到


假设您想要在应用程序运行时更改PanelBackgroundColor资源的值。您可以将如下所示的代码添加到页面的代码隐藏文件中，以访问Resources属性。下面的示例将上一个 XAML 示例中的资源值更新为不同的颜色。
```csharp
this.Resources["PanelBackgroundColor"] = Colors.Green;
```
动态资源：[https://learn.microsoft.com/zh-cn/training/modules/use-shared-resources/4-use-and-update-dynamic-resources](https://learn.microsoft.com/zh-cn/training/modules/use-shared-resources/4-use-and-update-dynamic-resources)

### 内部类型
在xaml中定义了一种xaml的内部类型，该类型定义了许多c#简单类型的类型名称，比如
```csharp
<ContentPage.Resources>
    <x:String x:Key="...">Hello</x:String>
    <x:Char x:Key="...">X</x:Char>
    <x:Single x:Key="...">31.4</x:Single>
    <x:Double x:Key="...">27.1</x:Double>
    <x:Byte x:Key="...">8</x:Byte>
    <x:Int16 x:Key="...">16</x:Int16>
    <x:Int32 x:Key="...">32</x:Int32>
    <x:Int64 x:Key="...">64</x:Int64>
    <x:Decimal x:Key="...">12345</x:Decimal>
    <x:TimeSpan x:Key="...">1.23:5959</x:TimeSpan>
    <x:Boolean x:Key="...">True</x:Boolean>
</ContentPage.Resources>
```

### 针对平台设置值
需要在平台之间稍微调整应用程序的 UI 是很常见的。定义平台特定值的标准方法是在定义资源时使用OnPlatform对象。例如，以下代码显示了如何在 iOS、Android、macOS (Mac Catalyst) 和 Windows (WinUI) 上创建引用不同文本颜色的资源。
```csharp
<ContentPage.Resources>
    <OnPlatform x:Key="textColor" x:TypeArguments="Color">
        <On Platform="iOS" Value="Silver" />
        <On Platform="Android" Value="Green" />
        <On Platform="WinUI" Value="Yellow" />
        <On Platform="MacCatalyst" Value="Pink" />
    </OnPlatform> 
</ContentPage.Resources>
...

<Label TextColor="{StaticResource textColor}" ... />
```

### 资源给一组样式
对某一个资源赋值一组样式，定义一组样式
```csharp
<ContentPage.Resources>
    <Style x:Key="BtnStyle" TargetType="Button">
        <Setter Property="BackgroundColor" Value="White"></Setter>
        <Setter Property="TextColor" Value="Black"></Setter>
        <Setter Property="BorderColor" Value="Blue"></Setter>
    </Style>
</ContentPage.Resources>
<VerticalStackLayout>
    <Button Text="测试样式"  Style="{DynamicResource BtnStyle}"  BorderWidth="100" />
</VerticalStackLayout>
```
资料：[https://learn.microsoft.com/zh-cn/training/modules/use-shared-resources/6-create-consistent-ui-by-using-styles](https://learn.microsoft.com/zh-cn/training/modules/use-shared-resources/6-create-consistent-ui-by-using-styles)

### 隐式样式
添加到资源字典而不为其提供x:Key标识符的样式。隐式样式自动应用于指定TargetType对象的所有控件。
```csharp
<ContentPage.Resources>
    <Style TargetType="Button">
        <Setter Property="BackgroundColor" Value="Blue" />
        <Setter Property="BorderColor" Value="Navy" />
        ...
    </Style>
</ContentPage.Resources>
```
但是从目标类型继承的控件不会接收到隐式样式，要想让继承的控件也被改变，那么就需要进行设置ApplyToDerivedTypes为true
```csharp
<ContentPage.Resources>
    <Style TargetType="Button"
           ApplyToDerivedTypes="True">
        <Setter Property="BackgroundColor" Value="Black" />
    </Style>
</ContentPage.Resources>
```

### 覆盖样式
如果继承的隐式样式不满足你的需求或者说其中的部分setter不满足，那么就可以直接设置属性来覆盖原来的值
```csharp
<Button
    Text="Cancel"
    Style="{StaticResource MyButtonStyle}"
    BackgroundColor="Red"
    ... />
```

### 样式继承
我们还可以继承已经设置的样式，然后进行增加我们自定义的样式
```csharp
<Style x:Key="MyVisualElementStyle" TargetType="VisualElement">
    <Setter Property="BackgroundColor" Value="Blue" />
</Style>

<Style x:Key="MyButtonStyle" TargetType="Button" BasedOn="{StaticResource MyVisualElementStyle}">
    <Setter Property="BorderColor" Value="Navy" />
    <Setter Property="BorderWidth" Value="5" />
</Style>

<Style x:Key="MyEntryStyle" TargetType="Entry" BasedOn="{StaticResource MyVisualElementStyle}">
    <Setter Property="TextColor" Value="White" />
</Style>
```
注意：这个写法不支持是使用DynamicResource。

或者直接使用下面的方法让一个属性去使用另一个字典的值
```csharp
<ContentPage.Resources>
    <ResourceDictionary>
        <Style x:Key="baseLabelStyle" TargetType="Label">
            <Setter Property="FontSize" Value="{StaticResource fontSize}" />
        </Style>
    <ResourceDictionary>
</ContentPage.Resources>
```

### 应用程序级别的样式
修改App.xaml中增加样式
```csharp
<?xml version = "1.0" encoding = "UTF-8" ?>
<Application xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:local="clr-namespace:MauiSample"
             x:Class="MauiSample.App">
    <Application.Resources>
        <ResourceDictionary>
            <ResourceDictionary.MergedDictionaries>
                <ResourceDictionary Source="Resources/Styles/Colors.xaml" />
                <ResourceDictionary Source="Resources/Styles/Styles.xaml" />
            </ResourceDictionary.MergedDictionaries>
            
            <!--程序级别样式-->
            <Style x:Key="LabelStyle" TargetType="Label">
                <Setter Property="FontSize" Value="20"></Setter>
                <Setter Property="TextColor" Value="Blue"></Setter>
            </Style>
            
        </ResourceDictionary>
    </Application.Resources>
</Application>

```
然后就可以在其他页面进行访问到
```csharp
<Label x:Name="ShowLab" Text="测试样式" Style="{StaticResource LabelStyle }"></Label>
```
资料：[https://learn.microsoft.com/zh-cn/training/modules/use-shared-resources/8-create-and-use-application-wide-resources](https://learn.microsoft.com/zh-cn/training/modules/use-shared-resources/8-create-and-use-application-wide-resources)

## 服务调用

### 检测网络连接
要检查 .NET MAUI 应用程序中的网络连接，请使用该类Connectivity。此类公开一个名为 的属性NetworkAccess和一个名为 的事件ConnectivityChanged。您可以使用这些成员来检测网络中的变化。
您可以NetworkAccess通过另一个名为 的属性访问该属性Current。Connectivity这是访问平台特定实现的机制。
该NetworkAccess属性从枚举中返回一个值NetworkAccess。枚举有五个值：ConstrainedInternet、Internet、Local、None和Unknown。如果该NetworkAccess属性返回值NetworkAccess.None，那么您就知道您没有连接到 Internet，并且您不应该运行网络代码。该机制可跨平台移植。以下代码显示了一个示例：
```csharp
if (Connectivity.Current.NetworkAccess == NetworkAccess.None)
{
    ...
}
```
该ConnectivityChanged事件还使您能够确定设备是否已连接到 Internet。该ConnectivityChanged事件在网络状态发生变化时自动触发。例如，如果您开始使用活动网络连接并最终失去它，ConnectivityChanged则会引发事件以通知您有关更改。传递给事件处理程序的参数之一ConnectivityChanged是一个ConnectivityChangedEventArgs对象。该对象包含一个名为 的属性IsConnected。您可以使用该IsConnected属性来确定您是否已连接到 Internet。这是一个例子：
```csharp
Connectivity.Current.ConnectivityChanged += Connectivity_ConnectivityChanged;
...
void Connectivity_ConnectivityChanged(object sender, ConnectivityChangedEventArgs  e)
{
    bool stillConnected = e.IsConnected;
}
```
该ConnectivityChanged事件使您能够编写可以检测网络状态变化的应用程序，并根据不同的环境无缝调整可用的功能。

### 检测操作系统
可以根据不同的操作系统选择不同的接口host（DeviceInfo.Platform）
```csharp
public static string BaseAddress = DeviceInfo.Platform == DevicePlatform.Android ? "http://10.0.2.2:5000" : "http://localhost:5000";
public static string TodoItemsUrl = $"{BaseAddress}/api/todoitems/";
```

### 网络调用HttpClient
HttpClient类提供网络连接的抽象。使用此类的应用独立于本机平台网络堆栈。.NET MAUI 模板将HttpClient类映射到利用每个平台的本机网络堆栈的代码。这使应用程序能够利用特定于平台的网络配置和优化功能。

网络安全：[https://learn.microsoft.com/zh-cn/training/modules/consume-rest-services-maui/4-use-platform-specific-features](https://learn.microsoft.com/zh-cn/training/modules/consume-rest-services-maui/4-use-platform-specific-features)

完整的服务调用示例：[https://learn.microsoft.com/zh-cn/training/modules/consume-rest-services-maui/5-exercise-consume-rest-web-service](https://learn.microsoft.com/zh-cn/training/modules/consume-rest-services-maui/5-exercise-consume-rest-web-service)


## 存储
Maui提供了多种存储选项用于在设备上缓存数据，最常用的三个方案是

- 首选：以键值对的形式存储数据
- 文件系统：通过文件系统访问将松散的文件直接存储在设备上
- 数据库：将数据库存储在关系数据库中

资料：[https://learn.microsoft.com/zh-cn/training/modules/store-local-data/2-compare-storage-options](https://learn.microsoft.com/zh-cn/training/modules/store-local-data/2-compare-storage-options)

### 键值对存储
使用Preferences进行内容存储，在 App.xaml.cs 中，在下方添加此行。
```csharp
Preferences.Set("WeatherAppid", "82695943");

// 读取
var appid = Preferences.Get("WeatherAppid", "");
```

### 文件存储
比如XML、二进制或者文本之类的文件，可以使用文件系统进行存储
```csharp
using System.Text.Json;
using System.IO;

// Data to be written to the file system, and read back later
List<Customer> customers = ...;

// Serialize and save
string fileName = ...;
var serializedData = JsonSerializer.Serialize(customers);
File.WriteAllText(fileName, serializedData);
...

// Read and deserialize
var rawData = File.ReadAllText(fileName);
customers = JsonSerializer.Deserialize<List<Customer>>(rawData);
```

### 应用沙盒
对于敏感的数据，你不希望保存到其他应用程序可以轻松访问到的位置，这个时候就用到了应用程序沙盒。这是你应用程序可以使用的私有区域，默认情况下，除操作系统之外，没有其他应用程序可以访问此区域。
```csharp
string path = FileSystem.AppDataDirectory;
```
在此代码中，路径变量包含文件路径，该文件路径指向您可以存储供应用程序使用的文件的位置。您可以使用何时使用文件系统部分中所示的技术读取数据并将数据写入此文件夹中的文件。
> 该FileSystem.AppDataDirectory属性是设备特定路径的抽象；它评估 Android、iOS 和 WinUI3 上的不同文件夹。这种抽象使您能够编写以独立于沙箱运行平台的方式引用沙箱的代码。使用此抽象而不是在代码中显式引用特定于设备的路径。


### 数据库存储
当你需要进行筛选等操作的时候，可以使用数据库，SQLite 数据库是一个文件，您需要将其存储在适当的位置。理想情况下，您应该在沙箱中的文件夹下创建一个文件夹AppDataDirectory，并在该文件夹中创建数据库。

#### 问题

##### 安卓上提示FileNotFoundException
在windows运行正常，在安卓上进行打包的时候提示错误信息：The type initializer for 'SQLite.SQLiteConnection' threw an exception System.IO.FileNotFoundException: Could not load file or assembly 'SQLitePCLRaw.provider.dynamic_cdecl, Version=2.0.4.976, Culture=neutral, PublicKeyToken=b68184102cba0b3b
解决方案：这通常是因为缺少SQLitePCLRaw.provider.dynamic_cdecl.dll 库导致的。在安卓平台上使用 SQLite 数据库时，需要添加该库才能正常工作。可以通过直接在 NuGet 包管理器中搜索 "SQLitePCLRaw.provider.dynamic_cdecl" 并将其添加到您的项目中，如果您已将该库添加到项目中但仍然遇到问题，请确保它包含在您的 Android 项目中的 Assets 文件夹中，并设置 "Build Action" 为 "AndroidAsset"。


