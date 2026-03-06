---
title: 基础控件
lang: zh-CN
date: 2023-07-13
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - wpf
---

## 基本控件

最基本的控件，用于构建用户界面的基本元素。

### Label
显示文本

### TextBlock
不允许编辑的静态文本

### Button
IsCancel属性设置为true时会绑定键盘ESC，按下ESC键相当于点击该button。
IsDefault获取或设置一个值，该值指示是否 Button 是默认按钮。 用户通过按 ENTER 键时调用的默认按钮。
ToolTip标识提示框的内容，可进行嵌套容器显示图片

### TextBox
输入/编辑的控件

#### 属性

- TextWrapping：文本换行
- AcceptsReturn：接受换行的内容
- MinHeight：设置最小高度

### Border
Border默认只能有一个元素，如果想存在多个，需要在里面放一个panel布局
```csharp
<Border
    Width="100"
    Height="100"
    BorderBrush="Gray"
    BorderThickness="2,4,6,8">
    <StackPanel HorizontalAlignment="Center" VerticalAlignment="Center">
        <TextBlock>我是内容</TextBlock>
        <TextBlock>我是内容2</TextBlock>
    </StackPanel>
</Border>
```
鼠标滑动上去阴影效果
```csharp
<Border
    Margin="10"
    CornerRadius="5">
    <Border.Style>
        <Style TargetType="Border">
            <Style.Triggers>
                <!--  鼠标滑动到任务栏上面的阴影效果  -->
                <Trigger Property="IsMouseOver" Value="True">
                    <Setter Property="Effect">
                        <Setter.Value>
                            <!--  BlurRadius为阴影的模糊程度，ShadowDepth为阴影的深度  -->
                            <DropShadowEffect
                                BlurRadius="10"
                                ShadowDepth="1"
                                Color="#DDDDDD" />
                        </Setter.Value>
                    </Setter>
                </Trigger>
            </Style.Triggers>
        </Style>
    </Border.Style>
</Border>
```

### RadioButton

#### 分组
RadioButton想实现分组的效果，方式1可以使用布局容器嵌套；方式2使用GroupName设置分组
```csharp
<StackPanel>
    <RadioButton
        VerticalContentAlignment="Center"
        Content="语文"
        FontSize="20" />
    <RadioButton
        VerticalContentAlignment="Center"
        Content="数学"
        FontSize="20" />

    <StackPanel Margin="0,20,0,0" Orientation="Horizontal">
        <RadioButton
            VerticalContentAlignment="Center"
            Content="男"
            FontSize="20"
            GroupName="sex" />
        <RadioButton
            Margin="10,0"
            VerticalContentAlignment="Center"
            Content="女"
            FontSize="20"
            GroupName="sex" />
    </StackPanel>
</StackPanel>
```

### Canvas
Canvas是一个类似于坐标系的面板，所有的元素通过设置坐标来决定其在坐标系中的位置（Canvas.Left、Canvas.Top、Canvas.Right、Canvas.Bottom），Canvas中的元素不能自动调整大小。如果窗口大小小于Canvas面板大小，则一部分内容不可见。
```markdown
<Border BorderBrush="Red" BorderThickness="1">
    <Grid Grid.Row="0">
        <Canvas>
            <Button
                Canvas.Left="50"
                Canvas.Top="50"
                Content="Left=50 Top=50" />
            <Button
                Canvas.Left="50"
                Canvas.Bottom="50"
                Content="Left=50 Bottom=50" />
            <Button
                Canvas.Top="50"
                Canvas.Right="50"
                Content="Right=50 Top=50" />
            <Button
                Canvas.Right="50"
                Canvas.Bottom="50"
                Content="Right=50 Bottom=50" />
        </Canvas>
    </Grid>
</Border>
```
注意：
同时设置Canvas.Left=“50” Canvas.Right=“50”，以Canvas.Left="50"为准同时设置Canvas.Top=“50” Canvas.Bottom=“50”，以Canvas.Top="50"为准

### CheckBox

复选框

### ToolTip

### Frame

## 布局控件

用于在界面中组织和布局其他控件，以实现界面的结构和排列。



布局原则

- 一个窗口只能包含一个布局元素，可以使用布局元素嵌套多个元素
- 一应该显式设置元素尺寸
- 不应该使用坐标设置元素的位置
- 可以嵌套布局容器

### Grid

Grid通过自定义行列来进行布局，类似于表格。通过定义Grid的RowDifinitions和ColumnDifinitions来实现对于表格行和列的定义，元素根据附加属性Grid.Row和Grid.Column确定自己的位置。

#### 行列定义

两行两列的布局

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
            Background="Red" />
        <Border
            Grid.Row="0"
            Grid.Column="1"
            Background="Yellow" />
        <Border
            Grid.Row="1"
            Grid.Column="0"
            Background="Blue" />
        <Border
            Grid.Row="1"
            Grid.Column="1"
            Background="Green" />
    </Grid>
</Window>

```

#### 行高和列宽的定义

固定长度：值为一个确定的数字
自动长度：值为Auto，取实际控件所需的最小值
比例长度：表示占用剩余的全部宽度；两行都是，将平分剩余宽度；一个2*，一个*，则前者占剩余全部宽度的2/3，后者占1/3；

```csharp
<Grid>
    <Grid.ColumnDefinitions>
        <ColumnDefinition Width="40"/>
        <ColumnDefinition Width="*"/>
        <ColumnDefinition Width="2*"/>
        <ColumnDefinition Width="Auto"/>
    </Grid.ColumnDefinitions>
    <Button Content="btn" Grid.Column="0"></Button>
    <Button Content="btn" Grid.Column="1"></Button>
    <Button Content="btn" Grid.Column="2"></Button>
    <Button Content="btn" Grid.Column="3"></Button>
</Grid>
```

#### 合并行和列

```csharp
<Grid Grid.Row="0" Grid.Column="1">
    <Grid.ColumnDefinitions>
        <ColumnDefinition Width="40" />
        <ColumnDefinition Width="*" />
        <ColumnDefinition Width="2*" />
        <ColumnDefinition Width="Auto" />
    </Grid.ColumnDefinitions>
    <Grid.RowDefinitions>
        <RowDefinition />
        <RowDefinition />
    </Grid.RowDefinitions>
    <Button
        Grid.RowSpan="2"
        Grid.Column="0"
        Content="btn1" />
    <Button
        Grid.Column="1"
        Grid.ColumnSpan="2"
        Content="btn2" />
    <Button Grid.Column="3" Content="btn3" />
    <Button
        Grid.Row="2"
        Grid.Column="1"
        Grid.ColumnSpan="3"
        Content="btn4" />
</Grid>
```

### UniformGrid

UniformGrid是Grid的简化版，每个单元格的大小相同，不需要定义行列集合。每个单元格始终具有相同的大小，每个单元格只能容纳一个控件。
注意：UniformGrid中没有Row和Column附加属性，也没有空白单元格。

如果没有设置Rows或者Colums，则按照定义在其内部的元素个数，自动创建行列，并通常保持相同的行列数。

```csharp
<UniformGrid Grid.Row="0" Grid.Column="2">
    <Button Content="btn1" />
    <Button Content="btn2" />
    <Button Content="btn3" />
    <Button Content="btn4" />
    <Button Content="btn5" />
    <Button Content="btn6" />
    <Button Content="btn7" />
    <Button Content="btn8" />
    <Button Content="btn9" />
</UniformGrid>
```

在指定行和列的数量，均分有限的容器空间，比如下面的三行三列

```csharp
<UniformGrid Grid.Column="3" Columns="3">
    <Button Content="btn1" />
    <Button Content="btn2" />
    <Button Content="btn3" />
    <Button Content="btn4" />
    <Button Content="btn5" />
    <Button Content="btn6" />
    <Button Content="btn7" />
    <Button Content="btn8" />
    <Button Content="btn9" />
</UniformGrid>
```

### StackPanel

StackPanel将控件按照行或列来顺序排列，但不会换行。通过设置面板的Orientation属性设置了两种排列方式：横排（Horizontal默认的）和竖排（Vertical），默认为竖排（Vertical）。
注意：如果遇到空间不够的情况就显示不全了

竖排

```csharp
<Grid Width="200">
    <StackPanel Orientation="Horizontal">
        <Button Width="100" Height="40" />
        <Button Width="100" Height="40" />
        <Button Width="100" Height="40" />
        <Button Width="100" Height="40" />
        <Button Width="100" Height="40" />
        <Button Width="100" Height="40" />
        <Button Width="100" Height="40" />
    </StackPanel>
</Grid>
```

横排(从左向右，从右向左)

```csharp
<!--  横排，从左到右  -->
<StackPanel
    Grid.Row="2"
    Grid.Column="2"
    Orientation="Horizontal">
    <Button Content="btn1" />
    <Button Content="btn2" />
    <Button Content="btn3" />
    <Button Content="btn4" />
    <Button Content="btn5" />
    <Button Content="btn6" />
    <Button Content="btn7" />
    <Button Content="btn8" />
    <Button Content="btn9" />
</StackPanel>


<!--  横排，从右到左  -->
<StackPanel
    Grid.Row="2"
    Grid.Column="3"
    FlowDirection="RightToLeft"
    Orientation="Horizontal">
    <Button Content="btn1" />
    <Button Content="btn2" />
    <Button Content="btn3" />
    <Button Content="btn4" />
    <Button Content="btn5" />
    <Button Content="btn6" />
    <Button Content="btn7" />
    <Button Content="btn8" />
    <Button Content="btn9" />
</StackPanel>
```

### WrapPanel

WrapPanel布局面板将各个控件按照一定方向罗列，当长度或高度不够时自动调整进行换行换列。

注意WrapPanel的两个属性：
ItemHeight——所有子元素都一致的高度，任何比ItemHeight高的元素都将被截断。ItemWidth——所有子元素都一致的宽度，任何比ItemWidth高的元素都将被截断。

Orientation="Horizontal"时各控件从左至右罗列，当面板长度不够时，子控件就会自动换行，继续按照从左至右的顺序排列。

```csharp
<WrapPanel
    Grid.Row="4"
    Grid.Column="1"
    Orientation="Horizontal">
    <Button Width="100" Content="btn1" />
    <Button Width="100" Content="btn2" />
    <Button Width="100" Content="btn3" />
    <Button Width="100" Content="btn4" />
    <Button Width="100" Content="btn5" />
    <Button Width="100" Content="btn6" />
    <Button Width="100" Content="btn7" />
    <Button Width="100" Content="btn8" />
    <Button Width="100" Content="btn9" />
</WrapPanel>
```

Orientation=" Vertical"时各控件从上至下罗列，当面板高度不够时，子控件就会自动换列，继续按照从上至下的顺序排列。

```csharp
<WrapPanel
    Grid.Row="4"
    Grid.Column="2"
    Orientation="Vertical">
    <Button Width="100" Content="btn1" />
    <Button Width="100" Content="btn2" />
    <Button Width="100" Content="btn3" />
    <Button Width="100" Content="btn4" />
    <Button Width="100" Content="btn5" />
    <Button Width="100" Content="btn6" />
    <Button Width="100" Content="btn7" />
    <Button Width="100" Content="btn8" />
    <Button Width="100" Content="btn9" />
</WrapPanel>
```


### DockPanel

DockPanel支持让元素简单地停靠在整个面板的某一条边上，然后拉伸元素以填满全部宽度或高度。它也支持让一个元素填充其他已停靠元素没有占用的剩余空间（设置LastChildFill后就不用填充）。DockPanel有一个Dock附加属性，因此子元素用4个值来控制它们的停靠：Left、Top、Right、Bottom.

场景：左上右下，占完整个内容

```csharp
<!--  左上右下，占完整个内容  -->
<DockPanel Grid.Row="3" Grid.Column="1">
    <Button Content="btn1" DockPanel.Dock="Left" />
    <Button Content="btn2" DockPanel.Dock="Top" />
    <Button Content="btn3" DockPanel.Dock="Right" />
    <Button Content="btn4" DockPanel.Dock="Bottom" />
</DockPanel>
```

设置LastChildFill属性为false，最后一个元素不填充

```csharp
<!--  左上右下，最后一个元素不填充  -->
<DockPanel
    Grid.Row="3"
    Grid.Column="2"
    LastChildFill="False">
    <Button Content="btn1" DockPanel.Dock="Left" />
    <Button Content="btn2" DockPanel.Dock="Top" />
    <Button Content="btn3" DockPanel.Dock="Right" />
    <Button Content="btn4" DockPanel.Dock="Bottom" />
</DockPanel>
```

### Separator

分隔符/分割线，用于分隔项控件中各个项的控件。

## 容器控件

用于容纳其他控件，并提供额外的功能和样式。

### GroupBox

分组框

### TabControl

选项卡控件

### ItemControl

ItemsControl 是一种数据展示控件，大致分为三个部分组成：Template, ItemTemplate,  ItemsPanel.

### Expander

可展开控件

### ScrollViewer

滚动视图控件，ScrollViewer是带有滚动条的面板。在ScrollViewer中只能有一个子控件，若要显示多个子控件，需要将一个附加的 Panel控件放置在父 ScrollViewer中，然后可以将子控件放置在该panel控件中。
HorizontalScrollBarVisibility水平滚动条是否显示（默认：Hidden）
VerticalScrollBarVisibility垂直滚动条是否显示（默认：Visible）

```csharp
<ScrollViewer
    Grid.Row="5"
    Grid.Column="1"
    HorizontalScrollBarVisibility="Auto"
    VerticalScrollBarVisibility="Visible">
    <Button
        Width="1000"
        Height="460"
        Content="btn1" />
</ScrollViewer>
```

通常设置HorizontalScrollBarVisibility="Auto"和VerticalScrollBarVisibility=“Auto”(当内容超出可视范围时，才显示横向/纵向滚动条)

## 数据控件

用于显示和操作数据，通常和数据绑定一起使用。

### ListBox

列表框

#### 属性

- ScrollViewer.VerticalScrollBarVisibility：隐藏滚动条
- HorizontalContentAlignment：内容排列方式，Stretch：拉长

### ListView

列表视图控件

### DataGrip

数据表格控件

### ComboxBox

下拉框

### TreeView

树形列表

写法一

```csharp
<TreeView
            Grid.Row="0"
            MinWidth="220"
            ItemsSource="{Binding MovieCategories}">
            <!--  添加点击的行为触发  -->
            <i:Interaction.Triggers>
                <!--  选择项改变的时候触发事件  -->
                <i:EventTrigger EventName="SelectionChanged">
                    <!--  导航到指定的命令，然后传递参数为当前menuBar的选中项  -->
                    <i:InvokeCommandAction Command="{Binding NavigateCommand}" CommandParameter="{Binding SelectedItem, RelativeSource={RelativeSource Mode=FindAncestor, AncestorType=TreeView}}" />
                </i:EventTrigger>
            </i:Interaction.Triggers>
            <TreeView.Resources>
                <Style BasedOn="{StaticResource MaterialDesignTreeViewItem}" TargetType="TreeViewItem">
                    <Setter Property="md:TreeViewAssist.ExpanderSize" Value="32" />
                    <Setter Property="md:TreeViewAssist.ShowSelection" Value="False" />
                </Style>
                <HierarchicalDataTemplate DataType="{x:Type vm:MovieCategory}" ItemsSource="{Binding Movies, Mode=OneTime}">
                    <TextBlock Margin="3,2" Text="{Binding Name, Mode=OneTime}" />
                </HierarchicalDataTemplate>
                <DataTemplate DataType="{x:Type vm:Movie}">
                    <TextBlock
                        Margin="3,2"
                        Text="{Binding Name, Mode=OneTime}"
                        ToolTip="{Binding Director, Mode=OneTime}" />
                </DataTemplate>
            </TreeView.Resources>
        </TreeView>
```

## 图形控件

用于绘制和显示图形、图像和形状。

### Image

图像控件

### Canvas

画布控件

### Rectangle

矩形控件

### Ellipse

椭圆控件

## 导航控件

用于实现应用程序的导航和页面切换。

### Frame

框架控件

### Page

页面控件

### NavigationWindow

导航窗口控件

## 模板控件

用于自定义和重写控件的外观和行为。

### ControlTemplate

控件模板

### DataTemplate

DataTemplate的应用

```csharp
<Grid>
    <ListBox x:Name="list">
        <ListBox.ItemTemplate>
            <DataTemplate>
                <StackPanel>
                    <Border
                        Width="10"
                        Height="10"
                        Background="{Binding Code}" />
                    <TextBlock Margin="10,0" Text="{Binding Name}" />
                </StackPanel>
            </DataTemplate>
        </ListBox.ItemTemplate>
    </ListBox>
</Grid>
```

后台逻辑

```csharp
public partial class MainWindow : Window
{
    public MainWindow()
    {
        InitializeComponent();

        var testList = new List<Color>()
        {
            new  Color("浅粉色","#FFB6C1"),
            new  Color("粉红","#FFC0CB"),
            new  Color("猩红","#DC143C")
        };
        list.ItemsSource = testList;
    }
}

public class Color
{
    public Color(string name, string code)
    {
        Name = name;
        Code = code;
    }

    public string Name { get; set; }

    public string Code { get; set; }
}
```

### Style

- 字体：FontFamily
- 字体大小：FontSize
- 背景颜色：Backgroud
- 字体颜色：Foregound
- 边距：Margin

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
    <Window.Resources>
        <Style x:Key="BaseButtonStyle" TargetType="Button">
            <Setter Property="FontSize" Value="18" />
            <Setter Property="Foreground" Value="White" />
            <Setter Property="Background" Value="Red" />
        </Style>
        <Style
            x:Key="ButtonStyle"
            BasedOn="{StaticResource BaseButtonStyle}"
            TargetType="Button">
            <Setter Property="Content" Value="按钮xxx" />
            <Setter Property="Background" Value="Green" />
        </Style>
    </Window.Resources>
    <Grid>
        <StackPanel>
            <Button Content="你好1" Style="{StaticResource ButtonStyle}" />
            <Button Content="傻子1" Style="{StaticResource ButtonStyle}" />
            <Button Content="小伙子1" Style="{StaticResource ButtonStyle}" />
            <Button Content="垃圾1" Style="{StaticResource ButtonStyle}" />
        </StackPanel>

    </Grid>
</Window>
```

## Window

### 属性
WindowStartupLocation：启动的位置，CenterScreen(屏幕中间)
WindowStyle：窗口样式，None(无边框)

## 时间

### Calendar
[https://www.cnblogs.com/gnielee/archive/2010/04/11/wpf4-calendar-control.html](https://www.cnblogs.com/gnielee/archive/2010/04/11/wpf4-calendar-control.html)

### DatePicker
[https://www.pianshen.com/article/4144363045/](https://www.pianshen.com/article/4144363045/)


## 控件常用属性

- CornerRadius：边框圆角
- WindowStyle：窗口样式，None为隐藏窗口
- WindowStartupLocation：启动位置，CenterOwner居中
- AllowsTransparency：隐藏窗口头部的白边，设置为true
- Opacity：设置透明度
- UserControl：用户控件
   - d:DesignHeight：设计高度，实际显示貌似跟随者主窗口大小
   - d:DesignWidth：设计宽度，实际显示貌似跟随者主窗口大小
- BorderThickness：边框厚度

## 封装
[https://mp.weixin.qq.com/s/fs4TcsjxA_JLrJ7_TWuzpg](https://mp.weixin.qq.com/s/fs4TcsjxA_JLrJ7_TWuzpg) | WPF 实现面包屑控件
托盘：[https://mp.weixin.qq.com/mp/appmsgalbum?action=getalbum&__biz=MzAwMzI4Nzc5Mg==&scene=1&album_id=2622452814275084289&count=3#wechat_redirect](https://mp.weixin.qq.com/mp/appmsgalbum?action=getalbum&__biz=MzAwMzI4Nzc5Mg==&scene=1&album_id=2622452814275084289&count=3#wechat_redirect)
文件拖拽上传：[https://mp.weixin.qq.com/s/tD464eYMuY3P6oUthPGfwQ](https://mp.weixin.qq.com/s/tD464eYMuY3P6oUthPGfwQ)
treeview：[https://mp.weixin.qq.com/s/wQM_S0GO13cbEomRori2bQ](https://mp.weixin.qq.com/s/wQM_S0GO13cbEomRori2bQ)
