---
title: 基础操作
lang: zh-CN
date: 2023-07-12
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: jichucaozuo
slug: qixnvt4uv7tszgtm
docsId: '121601196'
---

## 触发器

当达到触发的条件，就执行预期内的响应，可以的样式、数据变化、动画等。

### Trigger
检测依赖属性的变化，触发器生效

实现效果：鼠标移入移出改变背景颜色
```csharp
<Window
    x:Class="WpfAppSample.MainWindow"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:local="clr-namespace:WpfAppSample"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    Title="MainWindow"
    Width="800"
    Height="450"
    mc:Ignorable="d">
    <Window.Resources>
        <Style x:Key="BorderStyle" TargetType="Border">
            <Setter Property="BorderThickness" Value="5" />
            <Style.Triggers>
                <Trigger Property="IsMouseOver" Value="True">
                    <Setter Property="Background" Value="Blue" />
                    <Setter Property="BorderBrush" Value="Red" />
                </Trigger>
                <Trigger Property="IsMouseOver" Value="False">
                    <Setter Property="Background" Value="Red" />
                    <Setter Property="BorderBrush" Value="Blue" />
                </Trigger>
            </Style.Triggers>
        </Style>
    </Window.Resources>
    <Grid>
        <Border
            Width="100"
            Height="100"
            Style="{StaticResource BorderStyle}" />
    </Grid>
</Window>
```

### MultiTrigger
可以设置当多个条件满足的时候触发

实现效果，当鼠标进入文本框范围，并且光标设置到TextBox上，则把TextBox的背景颜色改为Red
```csharp
<Window.Resources>
    <Style x:Key="TextBoxStyle" TargetType="{x:Type TextBox}">
        <Setter Property="BorderThickness" Value="1" />
        <Style.Triggers>
            <MultiTrigger>
                <MultiTrigger.Conditions>
                    <Condition Property="IsMouseOver" Value="true" />
                    <Condition Property="IsFocused" Value="true" />
                </MultiTrigger.Conditions>
                <MultiTrigger.Setters>
                    <Setter Property="Background" Value="Red" />
                </MultiTrigger.Setters>
            </MultiTrigger>
        </Style.Triggers>
    </Style>
</Window.Resources>
<Grid>
    <StackPanel VerticalAlignment="Center">
        <TextBox
            Width="100"
            Height="30"
            Style="{DynamicResource TextBoxStyle}" />
        <Button
            Height="30"
            Margin="0,10,0,0"
            Content="鼠标滑动到文本框并且光标聚焦的时候修改文本框的背景色" />
    </StackPanel>
</Grid>
```

### EventTrigger
事件触发器，当触发了某类事件，触发器执行响应操作

实现效果：当鼠标移动到按钮范围上，在0.02秒内，把按钮的字体变成18号，当鼠标离开按钮，在0.02秒内，把按钮的字体变成13号
```csharp
<Window.Resources>
    <Style x:Key="ButtonStyle" TargetType="{x:Type Button}">
        <Setter Property="BorderThickness" Value="1" />
        <Style.Triggers>
            <EventTrigger RoutedEvent="MouseMove">
                <EventTrigger.Actions>
                    <BeginStoryboard>
                        <Storyboard>
                            <DoubleAnimation
                                Storyboard.TargetProperty="FontSize"
                                To="18"
                                Duration="0:0:0.02" />
                        </Storyboard>
                    </BeginStoryboard>
                </EventTrigger.Actions>
            </EventTrigger>

            <EventTrigger RoutedEvent="MouseLeave">
                <EventTrigger.Actions>
                    <BeginStoryboard>
                        <Storyboard>
                            <DoubleAnimation
                                Storyboard.TargetProperty="FontSize"
                                To="13"
                                Duration="0:0:0.02" />
                        </Storyboard>
                    </BeginStoryboard>
                </EventTrigger.Actions>
            </EventTrigger>
        </Style.Triggers>
    </Style>
</Window.Resources>
<Grid>
    <StackPanel VerticalAlignment="Center">
        <Button
            Width="100"
            Height="30"
            Content="Hello"
            FontSize="13"
            Style="{DynamicResource ButtonStyle}" />
    </StackPanel>
</Grid>
```

DataTrigger/MultiDataTrigger的功能类似，只不过触发条件变成了以数据的方式为条件。

## 绑定

### 元素绑定

#### 单向绑定(OneWay)
当源属性发生变化更新目标属性

让文本框的值跟着随滑块的滑动改变值，只允许滑块去改变文本框的值
```csharp
<StackPanel>
    <Slider
        x:Name="slider"
        Width="200"
        Value="5" />
    <TextBox Text="{Binding ElementName=slider, Path=Value, Mode=OneWay}" />
</StackPanel>
```

#### TwoWay(双向绑定)(默认)
当源属性发生变化更新模板属性，目标属性发生变化也更新源属性
```csharp
<StackPanel>
    <Slider Name="slider" Width="200" />
    <TextBox Text="{Binding Path=Value, ElementName=slider, Mode=TwoWay}" />
</StackPanel>
```
> 效果还没出来


#### OneTime(单次绑定)
根据第一次源属性设置目标属性，在此之后所有改变都无效。
```csharp
<StackPanel>
    <Slider
        x:Name="slider"
        Width="200"
        Value="5" />
    <TextBox Text="{Binding ElementName=slider, Path=Value, Mode=OneTime}" />
</StackPanel>
```

#### OneWayToSource
和OneWay类型相似，只不过整个过程倒置，根据文本框的值去更新滑块
```csharp
<StackPanel>
    <Slider x:Name="slider" Width="200" />
    <TextBox Text="{Binding ElementName=slider, Path=Value, Mode=OneWayToSource}" />
</StackPanel>
```
> 没测试出来效果


### 命令

#### 简单Command命令
实现点击按钮后触发方法，编写MyCommand继承自ICommand
```csharp
public class MyCommand : ICommand
{
    private readonly Action _action;

    public MyCommand(Action action)
    {
        _action = action;
    }

    public event EventHandler? CanExecuteChanged;

    public bool CanExecute(object? parameter)
    {
        return true;
    }

    public void Execute(object? parameter)
    {
        _action();
    }
}
```
编写MainViewModel去编写触发的方法
```csharp
public class MainViewModel
{
    public MainViewModel()
    {
        ShowCommand = new MyCommand(Show);
    }

    public MyCommand ShowCommand { get; set; }

    public void Show()
    {
        MessageBox.Show("点击了按钮");
    }
}
```
然后在页面编写按钮并绑定事件
```csharp
<Grid>
    <Button
        Width="100"
        Height="100"
        Command="{Binding ShowCommand}"
        Content="测试命令" />
</Grid>
```
最后切记需要在页面加载的方法指定上下文
```csharp
public partial class MainWindow : Window
{
    public MainWindow()
    {
        InitializeComponent();

        this.DataContext = new MainViewModel();
    }
}
```
然后启动项目点击按钮弹框提示点击了按钮。

#### INotifyPropertyChanged
为了省略写，封住了一个基类用于变更值通知
```csharp
public class ViewModelBase : INotifyPropertyChanged
{
    public event PropertyChangedEventHandler? PropertyChanged;

    public void OnPropertyChanged([CallerMemberName] string propertyName = "")
    {
        PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
    }
}
```
然后让我们的类继承自这个基类
```csharp
public class MainViewModel : ViewModelBase
{
    public MainViewModel()
    {
        ShowCommand = new MyCommand(Show);
    }

    public MyCommand ShowCommand { get; set; }

    private string _name;

    public string Name
    {
        get { return _name; }
        set
        {
            _name = value;
            OnPropertyChanged();
        }
    }

    public void Show()
    {
        Name = "点击了";
        MessageBox.Show("点击了按钮");
    }
}

public class MyCommand : ICommand
{
    private readonly Action _action;

    public MyCommand(Action action)
    {
        _action = action;
    }

    public event EventHandler? CanExecuteChanged;

    public bool CanExecute(object? parameter)
    {
        return true;
    }

    public void Execute(object? parameter)
    {
        _action();
    }
}
```
然后在页面的时候绑定Name的值
```csharp
<Grid>
    <StackPanel HorizontalAlignment="Left">
        <TextBox
            x:Name="Name"
            Width="100"
            Height="50"
            Text="{Binding Name}" />
        <Button
            Width="100"
            Height="100"
            Command="{Binding ShowCommand}"
            Content="测试命令" />
    </StackPanel>
</Grid>
```
记得在页面的加载方法中设置上下文
```csharp
public partial class MainWindow : Window
{
    public MainWindow()
    {
        InitializeComponent();

        this.DataContext = new MainViewModel();
    }
}
```

也可以使用Nuget包实现上面的效果，例如CommunityToolkit.Mvvm

### Binding的路径
默认的绑定
```csharp
<StackPanel >
    <Label Content="输入值"></Label>
    <TextBox x:Name="textBox1"></TextBox>

    <TextBox x:Name="textBox4"></TextBox>

    <Label Content="显示对应的值"></Label>
    <TextBox x:Name="textBox2" Text="{Binding Path=Text,ElementName=textBox1}" BorderBrush="Black"></TextBox>

    <Label Content="显示值长度"></Label>
    <TextBox x:Name="textBox3" Text="{Binding Path=Text.Length,ElementName=textBox1,Mode=OneWay}" BorderBrush="Black"></TextBox>

    <!--<Label Content="显示值的指定索引内容"></Label>-->
    <!--<TextBox x:Name="textBox4" Text="{Binding Path=Text[1],ElementName=textBox1,Mode=OneWay}" BorderBrush="Black"></TextBox>-->
</StackPanel>
```
使用集合作为绑定源
```csharp
public MainWindow()
{
    InitializeComponent();

    var list = new List<string> { "Tim", "Tom", "Blog" };
    // 绑定第一个项
    this.textBox5.SetBinding(TextBox.TextProperty, new Binding("/") { Source = list });
    // 绑定长度
    this.textBox6.SetBinding(TextBox.TextProperty, new Binding("/Length") { Source = list, Mode = BindingMode.OneWay });
    // 绑定第一个项的第二个字母
    this.textBox7.SetBinding(TextBox.TextProperty, new Binding("/[1]") { Source = list, Mode = BindingMode.OneWay });
}
```
如果想把子集集合的元素绑定，那么就使用多级斜线的语法，例如new Binding("/Province/CityList.Name")

### 绑定下拉列表
xaml
```csharp
<StackPanel x:Name="stackPanel" Background="LightBlue" >
    <TextBlock Text="学生ID:" FontWeight="Bold" Margin="5"></TextBlock>
    <TextBox x:Name="textBoxId" Margin="5"></TextBox>
    <TextBlock Text="列表" FontWeight="Bold" Margin="5"></TextBlock>
    <ListBox x:Name="listBoxStuents" Height="110" Margin="5"></ListBox>
</StackPanel>
```
后端代码
```csharp
public partial class MainWindow : Window
{
    public MainWindow()
    {
        InitializeComponent();

        var list = new List<Student>()
        {
            new Student{  Id=1, Name="张三", Age=25},
            new Student{  Id=2, Name="李四", Age=26}
        };

        // 为listBox设置Binding
        this.listBoxStuents.ItemsSource = list;
        this.listBoxStuents.DisplayMemberPath = "Name";

        // 为textBox设置bindind
        var bindind = new Binding("SelectedItem.Id") { Source = this.listBoxStuents };
        this.textBoxId.SetBinding(TextBox.TextProperty, bindind);
    }
}

public class Student
{
    public int Id { get; set; }

    public string Name { get; set; }

    public int Age { get; set; }
}
```

### InputBindings
绑定鼠标左击事件
```csharp
<Border Height="50" Background="Gray" Margin="2 2 2 0">
       <Border.InputBindings>
             <MouseBinding MouseAction="LeftClick" Command="{Binding TestCommand}">
             </MouseBinding>
       </Border.InputBindings>
</Border>
```
绑定按键输入事件
```csharp
<Window.InputBindings>
        <KeyBinding Command="{Binding OpenRecorder}" CommandParameter="{Binding Path=., ElementName=StartupWindow}" Modifiers="Control" Key="N"/>
        <KeyBinding Command="{Binding OpenWebcamRecorder}" CommandParameter="{Binding ElementName=StartupWindow}" Modifiers="Control" Key="W"/>
        <KeyBinding Command="{Binding OpenBoardRecorder}" CommandParameter="{Binding ElementName=StartupWindow}" Modifiers="Control" Key="B"/>
        <KeyBinding Command="{Binding OpenEditor}" CommandParameter="{Binding ElementName=StartupWindow}" Modifiers="Control" Key="E"/>
        <KeyBinding Command="{Binding OpenOptions}" Modifiers="Control+Alt" Key="O"/>
        <MouseBinding Gesture="LeftDoubleClick" Command="{Binding DataContext.UpdateCommand, RelativeSource={RelativeSource Mode=FindAncestor,AncestorType=DataGrid}}" CommandParameter="{Binding SelectedItem.ID, ElementName=AlarmData}" />
</Window.InputBindings>
```
使用键盘和鼠标的绑定
```csharp
<TextBox x:Name="SearchBox" Text="{Binding SearchText}" Width="246" Height="24" HorizontalAlignment="Right" PreviewKeyDown="SearchBox_OnKeyDown">
    <TextBox.InputBindings>
          <KeyBinding Command="{Binding KeyEventCommand}" Key="Enter"/>//绑定键盘输入事件
            <dxg:GridControl.InputBindings>
                <MouseBinding Command="{Binding ProductDoubleClickCommand}" CommandParameter="{Binding ElementName=ProductCtrl,Path=CurrentItem}"                                                                   MouseAction="LeftDoubleClick"/>//绑定鼠标事件
           </dxg:GridControl.InputBindings>
    </TextBox.InputBindings>
 </TextBox>
```
上面需要注意的是：搜索文本框的输入文本在按Enter后虽然会触发事件，但是获取不到搜索文本框的输入文本值，因此需要是搜索文本框的输入文本在按Enter后失去焦点，以添加PreviewKeyDown="SearchBox_OnKeyDown。
```csharp
private void SearchBox_OnKeyDown(object sender, KeyEventArgs e)
{
     if (e.Key == Key.Enter)
     {
         SearchBox.MoveFocus(new TraversalRequest(FocusNavigationDirection.Next));
     }
}
```

### RelativeSource FindAncestor
```csharp
<RadioButton  Style="{DynamicResource RadioButtonStyle}" >
    <StackPanel Orientation="Horizontal">
        <TextBlock Text="&#xe61e;" FontFamily="./Fonts/#iconfont" FontSize="22" Margin="10 0 0 0" Foreground="#6074C2" />
        <TextBlock  Margin="10 0 0 0" Text="待办事项"  FontSize="14" VerticalAlignment="Center"
                                Foreground="{Binding Foreground, RelativeSource={RelativeSource FindAncestor, AncestorLevel=1, AncestorType={x:Type RadioButton}}}" />
    </StackPanel>
</RadioButton>
```
RelativeSource FindAncestor：寻找TextBlock这个元素的祖宗元素，
AncestorLevel=1：向外层找1层，在上面的代码就是RadioButton 
AncestorType={x:Type RadioButton}：寻找的类型为RadioButton类型
Foreground="{Binding Foreground,：   当前元素TextBlock绑定目标元素的Foreground属性

## 资源

### 静态和动态资源
StaticResource：静态资源，设置后不会在发生变化
DynamicResource：动态资源，设置后跟随者发生变化

通过点击一个按钮，触发去更新资源来测试动态资源和静态资源
```csharp
<Window.Resources>
    <SolidColorBrush x:Key="SolidColor" Color="Red" />
</Window.Resources>
<Grid>
    <StackPanel>
        <Button
            Margin="10"
            Click="Button_Click"
            Content="Update" />
        <Button
            Height="40"
            Margin="10"
            BorderBrush="{StaticResource SolidColor}"
            BorderThickness="5"
            Content="Button1" />
        <Button
            Height="40"
            Margin="10"
            BorderBrush="{DynamicResource SolidColor}"
            BorderThickness="5"
            Content="Button2" />
    </StackPanel>
</Grid>
```
当点击更新按钮的时候，去触发Button_Click事件
```csharp
this.Resources["SolidColor"] = new SolidColorBrush(Colors.Black);
```

### 资源字典
如果一个样式经常使用，那么就可以将他放到资源字典中，新建资源字典ButtonStyle.xaml
```csharp
<ResourceDictionary xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation" xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml">
    <Style x:Key="ButtonStyle" TargetType="Button">
        <Setter Property="FontSize" Value="15" />
        <Setter Property="Background" Value="Green" />
        <Setter Property="BorderThickness" Value="5" />
    </Style>
</ResourceDictionary>
```
然后在App.xaml中导入字典
```csharp
<Application
    x:Class="WpfApp1.App"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:local="clr-namespace:WpfApp1"
    StartupUri="MainWindow.xaml">
    <Application.Resources>

        <!--  导入字典  -->
        <ResourceDictionary>
            <ResourceDictionary.MergedDictionaries>
                <ResourceDictionary Source="ButtonStyle.xaml" />
            </ResourceDictionary.MergedDictionaries>
        </ResourceDictionary>

    </Application.Resources>
</Application>
```
然后就可以在页面正常使用了
```csharp
<Button
    Height="40"
    Margin="10"
    Content="Button1"
    Style="{StaticResource ButtonStyle}" />
```
我们也可以在后台代码中进行更新、查询资源
```csharp
this.Resources["SolidColor"] = new SolidColorBrush(Colors.Black);

// 查找资源
var solidColor = App.Current.FindResource("ButtonStyle");
```
常用资源字典加上动态资源来实现程序换肤等效果

## 动画

### 基础操作
实现点击一个按钮的时候，实现按钮的宽度先缩小后恢复原样
```csharp
// 创建一个双精度动画
var animation = new DoubleAnimation();
animation.From = btn.Width;// 设置动画初始值
animation.To = btn.Width - 30;// 设置动画结束值
animation.Duration = TimeSpan.FromSeconds(2); // 设置动画的持续时间
//animation.Completed += Animation_Completed; //完成事件

// 是否往返执行
animation.AutoReverse = true;
// 设置执行的周期
animation.RepeatBehavior = new RepeatBehavior(2);//RepeatBehavior.Forever;

// 在当前按钮上执行动画
btn.BeginAnimation(Button.WidthProperty, animation);
```

## 全局异常拦截
修改App.xaml.cs文件，增加如下代码
```csharp
public partial class App : Application
{
    protected override void OnStartup(StartupEventArgs e)
    {
        base.OnStartup(e);

        //Task线程内未捕获异常处理事件
        TaskScheduler.UnobservedTaskException += TaskScheduler_UnobservedTaskException;
        //UI线程未捕获异常处理事件（UI主线程）
        DispatcherUnhandledException += App_DispatcherUnhandledException;
        //非UI线程未捕获异常处理事件(例如自己创建的一个子线程)
        AppDomain.CurrentDomain.UnhandledException += CurrentDomain_UnhandledException;
    }

    /// <summary>
    /// Task线程内未捕获异常处理事件
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    private void TaskScheduler_UnobservedTaskException(object? sender, UnobservedTaskExceptionEventArgs e)
    {
        try
        {
            if (e.Exception is Exception exception)
            {
                LocalLogHelper.WriteMyLogs("异常", exception.Message);

                MessageBox.Show("系统异常");
            }
        }
        catch (Exception ex)
        {
            LocalLogHelper.WriteMyLogs("异常", ex.Message);
        }
        finally
        {
            e.SetObserved();
        }
    }

    /// <summary>
    /// 非UI线程未捕获异常处理事件(例如自己创建的一个子线程)
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    private void CurrentDomain_UnhandledException(object sender, UnhandledExceptionEventArgs e)
    {
        try
        {
            if (e.ExceptionObject is Exception exception)
            {
                LocalLogHelper.WriteMyLogs("异常", exception.Message);
                MessageBox.Show("系统异常");
            }
        }
        catch (Exception ex)
        {
            LocalLogHelper.WriteMyLogs("异常", ex.Message);
        }
        finally
        {
            //ignore
        }
    }

    /// <summary>
    /// UI线程未捕获异常处理事件（UI主线程）
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    private void App_DispatcherUnhandledException(object sender, DispatcherUnhandledExceptionEventArgs e)
    {
        try
        {
            LocalLogHelper.WriteMyLogs("异常", e.Exception.Message);
            MessageBox.Show("系统异常");
        }
        catch (Exception ex)
        {
            LocalLogHelper.WriteMyLogs("异常", ex.Message);
        }
        finally
        {
            e.Handled = true;
        }
    }
}
```
