---
title: 基础操作
lang: zh-CN
date: 2023-05-31
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - operator
---

## 输入控件

### 简单操作

```xml
<Grid
    Margin="5"
    ColumnDefinitions="120,100"
    RowDefinitions="Auto,Auto,Auto"
    ShowGridLines="True">
    <Label
        Grid.Row="0"
        Grid.Column="0"
        Margin="10">
        Celsius
    </Label>
    <TextBox
        Grid.Row="0"
        Grid.Column="1"
        Margin="0,5" />
    <Label
        Grid.Row="1"
        Grid.Column="0"
        Margin="10">
        Fahrenheit
    </Label>
    <TextBox
        Grid.Row="1"
        Grid.Column="1"
        Margin="0,5" />
    <Button
        Grid.Row="2"
        Grid.Column="1"
        Margin="0,5"
        Content="计算" />
</Grid>
```

## 按钮控件

### 非按钮控件绑定点击命令

资料来自：https://www.coderbusy.com/archives/3146.html

在 Avalonia 中鼠标点击元素触发的事件名为：`PointerPressed` 。我们要做的是：在 `PointerPressed` 事件被触发后调用 ViewModel 中的 Command。先在项目中增加对 `Avalonia.Xaml.Behaviors` 的 NuGet 引用，接着在页面上引入名称空间：

```
<UserControl ...
  xmlns:ic="clr-namespace:Avalonia.Xaml.Interactivity;assembly=Avalonia.Xaml.Interactivity"
  xmlns:ia="clr-namespace:Avalonia.Xaml.Interactions.Core;assembly=Avalonia.Xaml.Interactions"
>
...
</UserControl>
```

以下代码假设 ViewModel 中有一个名为 TestCommand 的命令：

:::tip

Border 的 Background 属性必须要有值，即便是设置为透明也是有意义的。否则可能会出现鼠标点击没有效果的情况。

:::

```
<Border Background="Transparent">
    <ic:Interaction.Behaviors>
        <ia:EventTriggerBehavior EventName="PointerPressed">
            <ia:InvokeCommandAction Command="{Binding TestCommand}"></ia:InvokeCommandAction>
        </ia:EventTriggerBehavior>
    </ic:Interaction.Behaviors>
    ...
</Border>
```

## 图片

在资源字典中添加一张位图图片：https://www.coderbusy.com/archives/3266.html

## 布局

### Grid

网格面板布局：[https://www.nequalsonelifestyle.com/2019/06/11/avalonia-grid-panel-layout-part1/](https://www.nequalsonelifestyle.com/2019/06/11/avalonia-grid-panel-layout-part1/)

### StackPanel

```xml
<StackPanel>
    <Border
        Margin="5"
        BorderBrush="LightBlue"
        CornerRadius="10">
        <TextBlock
            Margin="5"
            HorizontalAlignment="Center"
            FontSize="24"
            Text="温度转换器" />
    </Border>
    <StackPanel />
    <Button HorizontalAlignment="Center">计算</Button>
</StackPanel>
```

## 表格

### DataGrid

基本操作：https://www.nequalsonelifestyle.com/2019/06/13/avalonia-datagrid-getting-started/

## 样式

Avalonia与其他XAML框架最明显的不同之一在于其样式系统。在Avalonia中，有两种方法可以为控件设置样式：

- [`Style`](https://docs.avaloniaui.net/zh-Hans/docs/basics/user-interface/styling) 是一种类似CSS的样式。样式不像在WPF中存储在`Resources`集合中，而是存储在一个独立的`Styles`集合中。
- [`ControlTheme`](https://docs.avaloniaui.net/zh-Hans/docs/basics/user-interface/styling/control-themes) 类似于WPF的`Style`，通常用于为无外观的控件创建主题。



Avalonia 中的样式和控件主题：https://mp.weixin.qq.com/s/oY5SDKFG8X92aWmm7yddAQ

样式资源使用：https://habr.com/en/post/471342/

常见样式不生效故障：https://www.coderbusy.com/archives/3236.html

### 示例

以下代码显示了一个`UserControl`，其中定义了自己的CSS样式。

```xml
<UserControl>
    <UserControl.Styles>
        <Style Selector="Label.Class1">
            <Setter Property="FontSize" Value="20"></Setter>
        </Style>
    </UserControl.Styles>

    <Label
        Margin="10"
        Classes="Class1">
        Celsius
    </Label>
</UserControl>
```

## 资源

```shell

看这个：https://avaloniaui.net/docs/styles  以及https://avaloniaui.net/docs/quickstart/assets 注意区分。
Styles节点后面的路径。
avares是引用资源的方法，另外还有resm。 resm需要作为清单嵌入的方式，由编译器完成。

Source="avares://Avalonia.Themes.Default/DefaultTheme.xaml"表明以avares查找程序集Avalonia.Themes.Default.dll中名称为DefaultTheme.xaml的样式集文件。如果程序集中有路径，则可能是这样的：

Source="avares://Avalonia.Themes.Default/Styles/DefaultTheme.xaml",说明放在Styles目录里面。

resm的方式是放在程序集集资源清单中的资源，例如:<Image Source="resm:MyApp.Assets.icon.png"/>
```

## 主题

切换主题颜色：https://www.coderbusy.com/archives/3136.html

## 伪类

[https://docs.avaloniaui.net/docs/reference/styles/pseudo-classes](https://docs.avaloniaui.net/docs/reference/styles/pseudo-classes)

## 窗口

### 无边框拖动

在 Avalnia 中的 Window 对象有一个名为 `ExtendClientAreaChromeHints` 的属性。设置该属性为 `NoChrome` 且 `ExtendClientAreaToDecorationsHint`为 `True` 之后，包含最大化、最小化按钮在内的系统标题栏就消失了。另一个取消掉标题栏的方式是：设置窗体的 `SystemDecorations` 为 `None` 。

因为少了标题栏，所以就需要额外的代码实现拖动功能。

```c#
private void HeaderBorder_OnPointerPressed(object sender, PointerPressedEventArgs e)
{
    if (e.Pointer.Type == PointerType.Mouse) 
    	this.BeginMoveDrag(e);
}
```

只需要将任意元素的 PointerPressed 事件增加以上事件处理器即可在该元素上实现无边框拖动。

### 禁用最大化按钮

在 Avalonia 中禁用窗口的最大化按钮，可以通过设置窗口的 CanResize 属性为 false 来实现。以下是一个示例代码

```csharp
public partial class MainWindow : Window
{
    public MainWindow()
    {
        InitializeComponent();

        // 禁用最大化按钮
        this.CanResize = false;
    }
}
```

## 访问UI线程

资料：[https://docs.avaloniaui.net/zh-Hans/docs/guides/development-guides/accessing-the-ui-thread](https://docs.avaloniaui.net/zh-Hans/docs/guides/development-guides/accessing-the-ui-thread)

如果使用到需要在UI线程上执行操作可以使用下面代码

```csharp
Dispatcher.UIThread.Invoke(() => { xxx });
```
