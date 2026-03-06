---
title: 说明
lang: zh-CN
date: 2023-06-04
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: readme
slug: ygdq11twkqg16kks
docsId: '123455364'
---

## 概述
Prism是一个用于在 WPF、Xamarin Form、Uno 平台和 WinUI 中构建松散耦合、可维护和可测试的 XAML 应用程序框架。
仓库地址：[https://github.com/PrismLibrary/Prism](https://github.com/PrismLibrary/Prism)
文档：[https://prismlibrary.com/docs/index.html](https://prismlibrary.com/docs/index.html)
包中关于wpf的使用：[https://prismlibrary.com/docs/wpf/introduction.html](https://prismlibrary.com/docs/wpf/introduction.html)

框架中包括 MVVM、依赖注入、Command、Message Event、导航、弹窗等功能。

## 安装

### 手动安装
安装nuget包
```csharp
<ItemGroup>
  <PackageReference Include="Prism.DryIoc" Version="8.1.97" />
</ItemGroup>
```
修改App.xaml.cs文件，继承自PrismApplication
```csharp
public partial class App : PrismApplication
{
    protected override Window CreateShell()
    {
        // 从容器中获取默认呈现的页面
        return Container.Resolve<MainWindow>();
    }

    protected override void RegisterTypes(IContainerRegistry containerRegistry)
    {
    }
}
```
然后在修改App.xaml文件
```csharp
<prism:PrismApplication
    x:Class="WpfApp2.App"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:local="clr-namespace:WpfApp2"
    xmlns:prism="http://prismlibrary.com/">
    <Application.Resources />
</prism:PrismApplication>
```
然后就可以正常启动了。

### 扩展模板安装
通过VS的扩展安装插件：Prism Template Pack 安装扩展成功后，可以新建项目，模板选择为Prism Full App。

## 概念

### Region
Region是应用程序UI的逻辑区域（具体的表现为容器控件），Views在Region中展现，很多种控件可以被用作Region：ContentControl、ItemsControl、ListBox、TabControl。Views能在Regions编程或者自动呈现，Prism也提供了Region导航的支持。这么设计主要为了解耦让内容显示灵活具有多样性。

### RegionManager
RegionManager主要实现维护区域集合、提供对区域的访问、合成视图、区域导航、定义区域。
区域定义方式有两种：
xaml方式实现
```csharp
<ContentControl x:Name=“ContentCtrl” prism:RegionManager.RegionName="ContentRegion" />
```
C#实现
```csharp
RegionManager.SetRegionName(ContentCtrl,”ContentRegion”);

public MainWindowViewModel(IRegionManager regionManager)
{
   _regionManager = regionManager;
   _regionManager.RegisterViewWithRegion("ContentRegion", typeof(MainWindow));
}
```

### RegionAdapter
RegionAdapter（区域适配）主要作用为特定的控件创建相应的Region，并将控件与Region进行绑定，然后为Region添加一些行为。
因为并不是所有的控件都可以作为Region的，需要为需要定义为Region的控件添加RegionAdapter。一个RegionAdapter需要实现IRegionAdapter接口，如果你需要自定义一个RegionAdapter，可以通过继承RegionAdapterBase类来省去一些工作。
Prism为开发者提供了几个默认RegionAdapter：

- ContentControlRegionAdapter：创建一个SingleActiveRegion并将其与ContentControl绑定
- ItemsControlRegionAdapter：创建一个AllActiveRegion并将其与ItemsControl绑定
- SelectorRegionAdapter：创建一个Region并将其与Selector绑定
- TabControlRegionAdapter：创建一个Region并将其与TabControl绑定

## 操作

### 命令
ViewModel可以将命令实现为命令对应(实现接口的对象ICommand)。
```csharp
-- xaml代码中调用
<Button
    Margin="10,0"
    Command="{Binding OpenCommand}"
    CommandParameter="ViewA"
    Content="打开模块A" />


-- viewModel代码    
public DelegateCommand<string> OpenCommand { get; }
public MainViewModel()
{
    OpenCommand = new DelegateCommand<string>(Open);
}

/// <summary>
/// 打开页面方法
/// </summary>
/// <param name="obj"></param>
private void Open(string obj)
{
}
```

#### 变更通知
```csharp
private string _title;

public string Title
{
    get { return _title; }
    set
    {
        SetProperty(ref _title, value);
    }
}
```

### 依赖注入

#### 生命周期
在 WPF 应用程序中，您可以使用 Prism 进行服务注入，并且可以选择以下生命周期：

1. 单例（Singleton）生命周期：这种生命周期适合那些仅需要一个实例的服务，例如配置管理器或日志记录器。您可以通过在 ViewModel 或控制器构造函数中添加 [Singleton] 属性来指定单例生命周期。
2. 每个请求（Transient）生命周期：这种生命周期适合那些需要不同实例的服务，例如数据访问库或业务逻辑层中的服务。您可以通过在 ViewModel 或控制器构造函数中添加 [Transient] 属性来指定每个请求生命周期。
3. 范围（Scoped）生命周期：这种生命周期适用于需要在特定范围内共享状态的服务，例如所有子视图共享的服务。如果您正在使用 INavigationAware 接口，则可以使用 INavigationService 对象作为范围服务。此外，您还可以创建自定义范围服务，例如在 ShellViewModel 中注册并在整个应用程序中使用的服务。

要选择正确的生命周期，请考虑服务的具体需求以及您的应用程序架构和工作流程。在大多数情况下，您应该选择单例生命周期，除非您需要为每个请求创建不同的实例或者需要在特定范围内共享状态。

在 WPF 应用程序中，您的数据库服务通常应该使用单例生命周期进行注入。这是因为在大多数情况下，只需要一个数据库连接实例来处理所有请求，这可以提高性能并减少资源消耗。如果您的应用程序需要同时访问多个数据库，或者需要为每个用户创建一个独立的数据库连接，则可以考虑使用范围生命周期。在此情况下，您可以将数据库服务配置为在每个用户会话期间创建一个新实例，以确保隔离用户数据和操作。

#### 注册瞬时服务
每次创建使用的时候都创建一个新实例的服务。
```csharp
containerRegistry.Register<FooService>();

containerRegistry.Register<IBarService, BarService>();
```

#### 注册单例服务
在整个应用程序中使用一项服务。
```csharp
containerRegistry.RegisterSingleton<FooService>();

containerRegistry.RegisterSingleton<IBarService, BarService>();
```
> 注意：单例服务实际上并没有创建，因此在您的应用程序第一次解析服务之前不会开始使用内存。


#### 注册服务实例
```csharp
containerRegistry.RegisterInstance<IFoo>(new FooImplementation());

// Sample of using James Montemagno's Monkey Cache
Barrel.ApplicationId = "your_unique_name_here";
containerRegistry.RegisterInstance<IBarrel>(Barrel.Current);
```

#### 检查服务是否注册
```csharp
if (containerRegistry.IsRegistered<ISomeService>())
{
    // Do something...
}
```

### 模块
我们可以将某一个模块的逻辑单独去创建一个类库，然后在这个类库中创建一个文件，如ModuleAModule，让该文件继承自IModule，如果需要注册导航，就可以直接在该类中注册，如
```csharp
public class ModuleAModule : IModule
{
    public void OnInitialized(IContainerProvider containerProvider)
    {
    }

    public void RegisterTypes(IContainerRegistry containerRegistry)
    {
        // 手动指定ViewModel
        //containerRegistry.RegisterForNavigation<ViewA,ViewAViewModel>();
    }
}
```
那么如何注册模块那？我们可以这么注册，在主程序的App.xaml.cs类中
```csharp
protected override void ConfigureModuleCatalog(IModuleCatalog moduleCatalog)
{
	// 注入模块方案一：通过引用指定模块的类库进行注入的方式
	moduleCatalog.AddModule<ModuleAModule>();
	moduleCatalog.AddModule<ModuleBModule>();
	base.ConfigureModuleCatalog(moduleCatalog);
}

//protected override IModuleCatalog CreateModuleCatalog()
//{
//    // 注入模块方案二：通过直接去目录下查找的方式去读取模块
//    // 这个方法就需要将模块的内容拷贝到指定目录下进行实现了,这个时候是不需要引用对应模块类库的
//    return new DirectoryModuleCatalog { ModulePath = @".\Modules" };
//}
```
注册模块方案三
```csharp
public partial class App : PrismApplication
{
    protected override Window CreateShell()
    {
        return Container.Resolve<MainWindow>();
    }

    protected override void RegisterTypes(IContainerRegistry containerRegistry)
    {
            
    }

    protected override void ConfigureModuleCatalog(IModuleCatalog moduleCatalog)
    {
        //注入模块方案三
        var moduleAType = typeof(ModuleAModule);
        moduleCatalog.AddModule(new ModuleInfo()
        {
            ModuleName = moduleAType.Name,
            ModuleType = moduleAType.AssemblyQualifiedName,
            InitializationMode = InitializationMode.OnDemand
        });
    }
}
```

### 事件聚合器

#### 发布事件
发布者通过从中检索事件EventAggregator并调用Publish方法来引发事件。您可以通过向类构造IEventAggregator函数添加类型参数来使用依赖注入。
```csharp
public class MainPageViewModel
{
    IEventAggregator _eventAggregator;
    public MainPageViewModel(IEventAggregator ea)
    {
        _eventAggregator = ea;
    }
}
```
发布操作
```csharp
_eventAggregator.GetEvent<TickerSymbolSelectedEvent>().Publish("STOCK0");
```

#### 订阅事件
Subscribe订阅者可以使用类上可用的方法重载之一登记事件PubSubEvent。
```csharp
public class MainPageViewModel
{
    public MainPageViewModel(IEventAggregator ea)
    {
        ea.GetEvent<TickerSymbolSelectedEvent>().Subscribe(ShowNews);
    }

    void ShowNews(string companySymbol)
    {
        //implement logic
    }
}
```
有多种订阅方式PubSubEvents。使用以下标准来帮助确定最适合您需求的选项：

- 如果您需要能够在收到事件时更新 UI 元素，请订阅以在 UI 线程上接收事件。
- 如果您需要过滤事件，请在订阅时提供过滤委托。
- 如果您对事件的性能有顾虑，请考虑在订阅时使用强引用委托，然后手动取消订阅 PubSubEvent。
- 如果以上都不适用，请使用默认订阅。

资料：[https://prismlibrary.com/docs/event-aggregator.html](https://prismlibrary.com/docs/event-aggregator.html)

### 页面定位ViewModel
Prism使用约定来确定视图模型的ViewModel类，用它的依赖项实例化它并将它附加到视图的DataContext。
默认约定是将所有视图放在Views文件夹中，将视图模型放在ViewModels文件夹中。

- WpfApp1.Views.MainWindow=>WpfApp1.ViewModels.MainWindowViewModel
- WpfApp1.Views.OtherView=>WpfApp1.ViewModels.OtherViewModel

注意：在老版本，比如prism7等以下需要在每个XAML页面中进行指定ViewModelLocator.AutoWireViewModel，在当前prism8的版本中默认为true

#### 禁止自动定位
通过在页面ViewA.xaml的内容中输入
```csharp
xmlns:prism="http://prismlibrary.com/"
prism:ViewModelLocator.AutoWireViewModel="false" 
```
来实现该页面不使用默认约定的映射。

#### 手动匹配
如果View和Model的映射关系没有按照上面的约定去处理，那么就需要手动匹配，通过在模块的ModuleAModule注入
```csharp
public class ModuleAModule : IModule
{
    public void OnInitialized(IContainerProvider containerProvider)
    {
    }

    public void RegisterTypes(IContainerRegistry containerRegistry)
    {
        containerRegistry.RegisterForNavigation<ViewA,ViewAViewModel>();
    }
}
```
或者主程序的App.xaml.cs中的RegisterTypes方法注入
```csharp
protected override void RegisterTypes(IContainerRegistry containerRegistry)
{
    containerRegistry.RegisterForNavigation<ViewA,ViewAViewModel>();
    //containerRegistry.RegisterForNavigation<ViewB>();
    //containerRegistry.RegisterForNavigation<ViewC>();
}
```

批量手动定位
```csharp
public partial class App : PrismApplication
{
    protected override Window CreateShell()
    {
        return Container.Resolve<MainWindow>();
    }

    protected override void RegisterTypes(IContainerRegistry containerRegistry)
    {
    }

    protected override void ConfigureViewModelLocator()
    {
        base.ConfigureViewModelLocator();

        ViewModelLocationProvider.SetDefaultViewTypeToViewModelTypeResolver((viewType) =>
        {
            var viewName = viewType.FullName;
            var viewAssemblyName = viewType.GetTypeInfo().Assembly.FullName;
            var viewModelName = $"{viewName}ViewModel, {viewAssemblyName}";
            return Type.GetType(viewModelName);
        });
    }
}
```

其他配置定位的方法
```csharp
public partial class App : PrismApplication
{
    protected override Window CreateShell()
    {
        return Container.Resolve<MainWindow>();
    }

    protected override void RegisterTypes(IContainerRegistry containerRegistry)
    {
    }

    protected override void ConfigureViewModelLocator()
    {
        base.ConfigureViewModelLocator();

        // type / type
        //ViewModelLocationProvider.Register(typeof(MainWindow).ToString(), typeof(CustomViewModel));

        // type / factory
        //ViewModelLocationProvider.Register(typeof(MainWindow).ToString(), () => Container.Resolve<CustomViewModel>());

        // generic factory
        //ViewModelLocationProvider.Register<MainWindow>(() => Container.Resolve<CustomViewModel>());

        // generic type
        ViewModelLocationProvider.Register<MainWindow, CustomViewModel>();
    }
}
```

### 区域导航

#### 基础区域导航

##### 注册/设置默认页面
```csharp
regionManager.RegisterViewWithRegion("ContentRegion", typeof(ViewA));
```

##### 将页面加入区域导航
```csharp
var view = _container.Resolve<ViewA>();
IRegion region = _regionManager.Regions["ContentRegion"];
region.Add(view);
```

##### 将页面注册进区域并设置激活和取消
```csharp
// 注册
var _viewA = _container.Resolve<ViewA>();
var _viewB = _container.Resolve<ViewB>();
var _region = _regionManager.Regions["ContentRegion"];
_region.Add(_viewA);
_region.Add(_viewB);

// 激活
_region.Activate(_viewA);

//失效
_region.Deactivate(_viewA);
```
导航并返回导航的结果
```plsql
private void Naigation()
{
	//NavigationResult类定义提供有关导航操作的信息的属性。
	_regionManager.RequestNavigate(PrismCommonConst.BaseRegionNaviation, "ViewB", (result) =>
	{
		//Result属性指示导航是否成功。如果导航成功，则Result属性将为true。
		//如果导航失败，通常是因为在IConfirmNavigationResult.ConfirmNavigationRequest方法中返回“continuationCallBack(false)”，则Result属性将为false。
		//如果由于异常导致导航失败，则Result属性将为false并且Error属性提供对导航期间抛出的任何异常的引用。
		//Context属性提供对导航 URI 及其包含的任何参数的访问，以及对协调导航操作的导航服务的引用。
		if (result.Result == true)
		{
			//导航成功
		}
	});
}
```

#### 传递参数导航
Prism 提供NavigationParameters类来帮助指定和检索导航参数。NavigationParameters类维护一个名称-值对列表，每个参数对应一个。您可以使用此类将参数作为导航 URI 的一部分或用于传递对象参数。
```plsql
private void Naigation()
{
	var param = new NavigationParameters();
	param.Add("Conent", "我是传递过来的参数值");
	_regionManager.RequestNavigate(PrismCommonConst.BaseRegionNaviation, nameof(ShowNavigationView), (result) =>
	{
		if (result.Result == true)
		{
			//导航成功
		}
	}, param);
}
```
可以从IsNavigationTarget、OnNavigatedFrom和OnNavigatedTo方法中访问NavigationContext，可以使用NavigationContext对象的Parameters属性检索导航参数。此属性返回NavigationParameters类的一个实例，它提供一个索引器属性以允许轻松访问各个参数，而不管它们是通过查询还是通过 RequestNavigate方法传递的。
在导航后的页面OnNavigatedTo方法中取值
```plsql
public void OnNavigatedTo(NavigationContext navigationContext)
{
	//_content = (navigationContext.Parameters["Conent"]?.ToString()) ?? string.Empty;
	_content = navigationContext.Parameters.GetValue<string>("Content");

	Debug.WriteLine("ShowNavigationViewModel 导航后被调用了");
}
```


通过在ViewModel中注入IRegionManager来调用RequestNavigate实现跳转
```csharp
private void Open(string obj)
{
    // 通过IRegionManager接口获取到全局定义的可用区域
    // 然后往这个动态区域设置内容，设置内容的方式是通过依赖注入的方式实现的

    var keys = new NavigationParameters();
    keys.Add("Title", "Hello 我是参数");

    // 导航到指定页面 并传递参数
    //regionManager.Regions["ContentRegin"].RequestNavigate(obj, keys);

    regionManager.Regions["ContentRegin"].RequestNavigate(obj, callBack =>
    {
        // 为true代表导航成功
        if (callBack.Result == true)
        {
            // 回退使用
            _regionNavigationJournal = callBack.Context.NavigationService.Journal;
        }
    }, keys);
}
```
上面的ContentRegin是一个ContentControl
```csharp
<ContentControl prism:RegionManager.RegionName="ContentRegin" />
```
如果想设置默认页面，可以在ViewModel的构造函数中初始化默认页面，如
```csharp
_regionManager.RegisterViewWithRegion(PrismManager.SettingsViewRegionName, typeof(SkinView));
```

#### 导航前确认
在许多应用程序中，用户可能会在输入或编辑数据的过程中尝试导航。在这些情况下，您可能想询问用户是否要在继续离开页面之前保存或放弃已经输入的数据，或者用户是否要完全取消导航操作。Prism 通过IConfirmNavigationRequest接口支持这些场景。
资料：[https://prismlibrary.com/docs/wpf/region-navigation/confirming-navigation.html](https://prismlibrary.com/docs/wpf/region-navigation/confirming-navigation.html)

IConfirmNavigationRequest接口派生自INavigationAware接口并添加了ConfirmNavigationRequest方法。
```csharp
public class ShowNavigationTwoViewModel : BindableBase, IConfirmNavigationRequest
{
	/// <summary>
	/// 是否能够处理导航请求
	/// </summary>
	/// <param name="navigationContext"></param>
	/// <returns></returns>
	/// <remarks>处理导航操作或者导航到已经存在的视图时候用</remarks>
	/// <exception cref="NotImplementedException"></exception>
	public bool IsNavigationTarget(NavigationContext navigationContext)
	{
		// 资料文档：https://prismlibrary.com/docs/wpf/region-navigation/navigation-existing-views.html

		// 获取请求的参数  可以实现对比当前页面id和导航请求ID进行比较，然后判断是否重新使用该页面
		var id = navigationContext.Parameters["Id"];

		return true;
	}

	/// <summary>
	/// 导航前调用
	/// </summary>
	/// <param name="navigationContext"></param>
	/// <exception cref="NotImplementedException"></exception>
	public void OnNavigatedFrom(NavigationContext navigationContext)
	{
		Debug.WriteLine("ShowNavigationTwoViewModel 导航前被调用了");
	}

	/// <summary>
	/// 导航完成后调用
	/// </summary>
	/// <param name="navigationContext"></param>
	/// <exception cref="NotImplementedException"></exception>
	public void OnNavigatedTo(NavigationContext navigationContext)
	{
		//_content = (navigationContext.Parameters["Conent"]?.ToString()) ?? string.Empty;
		_content = navigationContext.Parameters.GetValue<string>("Content");

		Debug.WriteLine("ShowNavigationTwoViewModel 导航后被调用了");
	}

	/// <summary>
	/// 从当前页面导航到其他页面前的一个确定
	/// </summary>
	/// <param name="navigationContext"></param>
	/// <param name="continuationCallback"></param>
	public void ConfirmNavigationRequest(NavigationContext navigationContext, Action<bool> continuationCallback)
	{
		var result = true;

		if (MessageBox.Show("你确认要导航到下个页面吗？", "提示", MessageBoxButton.YesNo) == MessageBoxResult.No)
		{
			result = false;
		}
		continuationCallback?.Invoke(result);
	}
}
```

#### 控制视图生命周期
资料：[https://prismlibrary.com/docs/wpf/region-navigation/controlling-view-lifetime.html](https://prismlibrary.com/docs/wpf/region-navigation/controlling-view-lifetime.html)

#### 导航日志

资料：[https://prismlibrary.com/docs/wpf/region-navigation/navigation-journal.html](https://prismlibrary.com/docs/wpf/region-navigation/navigation-journal.html)

#### 点击触发事件
> 下面的代码是一个耦合性比较高的过渡代码示例

基于上面的Prism的基础上，实现的效果是点击页面的三个按钮，然后来实现切换页面显示效果，新建一个MainView.xaml在Views目录下
```csharp
<Window
    x:Class="WpfApp2.Views.MainView"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:local="clr-namespace:WpfApp2"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    xmlns:prism="http://prismlibrary.com/"
    Title="MainWindow"
    Width="800"
    Height="450"
    prism:ViewModelLocator.AutoWireViewModel="True"
    mc:Ignorable="d">
    <Grid>
        <Grid.RowDefinitions>
            <RowDefinition Height="auto" />
            <RowDefinition />
        </Grid.RowDefinitions>

        <StackPanel Orientation="Horizontal">
            <Button
                Command="{Binding OpenCommand}"
                CommandParameter="ViewA"
                Content="打开模块A" />
            <Button
                Command="{Binding OpenCommand}"
                CommandParameter="ViewB"
                Content="打开模块B" />
            <Button
                Command="{Binding OpenCommand}"
                CommandParameter="ViewC"
                Content="打开模块C" />
        </StackPanel>
        <ContentControl Grid.Row="1" Content="{Binding Body}" />
    </Grid>
</Window>
```
然后在当前目录下新建三个用户控件
```csharp
<UserControl
    x:Class="WpfApp2.Views.ViewA"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:local="clr-namespace:WpfApp2.Views"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    d:DesignHeight="450"
    d:DesignWidth="800"
    mc:Ignorable="d">
    <Grid>
        <TextBlock Background="Green" Text="我是模块A" />
    </Grid>
</UserControl>


<UserControl
    x:Class="WpfApp2.Views.ViewB"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:local="clr-namespace:WpfApp2.Views"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    d:DesignHeight="450"
    d:DesignWidth="800"
    mc:Ignorable="d">
    <Grid>
        <TextBlock Background="Green" Text="我是模块B" />
    </Grid>
</UserControl>


<UserControl
    x:Class="WpfApp2.Views.ViewC"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:local="clr-namespace:WpfApp2.Views"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    d:DesignHeight="450"
    d:DesignWidth="800"
    mc:Ignorable="d">
    <Grid>
        <TextBlock Background="Green" Text="我是模块C" />
    </Grid>
</UserControl>
```
然后在ViewModels目录下新建一个MainViewModel.cs文件
```csharp
public class MainViewModel : BindableBase
{
    public DelegateCommand<string> OpenCommand { get; private set; }

    public MainViewModel()
    {
        OpenCommand = new DelegateCommand<string>(Open);
    }

    private object _body;

    public object Body
    {
        get { return _body; }
        set
        {
            _body = value;
            RaisePropertyChanged();
        }
    }

    private void Open(string obj)
    {
        switch (obj)
        {
            case "ViewA":
                Body = new ViewA();
                break;

            case "ViewB":
                Body = new ViewB();

                break;

            case "ViewC":
                Body = new ViewC();

                break;

            default:
                break;
        }
    }
}
```
最后记得修改App.cs文件下的CreateShell方法
```csharp
protected override Window CreateShell()
{
    // 从容器中获取默认呈现的页面
    return Container.Resolve<MainView>();
}
```
然后启动页面，发现展示了三个按钮，点击按钮分别可以进行切换页面。


现在开始简化上面的操作，实现我们需要先将页面进行注入，在App.xaml.cs文件注入
```csharp
public partial class App : PrismApplication
{
    protected override Window CreateShell()
    {
        // 从容器中获取默认呈现的页面
        return Container.Resolve<MainView>();
    }

    protected override void RegisterTypes(IContainerRegistry containerRegistry)
    {
        containerRegistry.RegisterForNavigation<ViewA>();
        containerRegistry.RegisterForNavigation<ViewB>();
        containerRegistry.RegisterForNavigation<ViewC>();
    }
}
```
然后修改MainViewModel文件打开的方法
```csharp
public class MainViewModel : BindableBase
{
    public readonly IRegionManager regionManager;

    public DelegateCommand<string> OpenCommand { get; private set; }

    public MainViewModel(IRegionManager regionManager)
    {
        OpenCommand = new DelegateCommand<string>(Open);
        this.regionManager = regionManager;
    }

    private object _body;

    public object Body
    {
        get { return _body; }
        set
        {
            _body = value;
            RaisePropertyChanged();
        }
    }

    private void Open(string obj)
    {
        // 通过IRegionManager接口获取到全局定义的可用区域
        // 然后往这个动态区域设置内容，设置内容的方式是通过依赖注入的方式实现的
        regionManager.Regions["ContentRegin"].RequestNavigate(obj);
    }
}
```
最后修改页面的绑定
```csharp
<Window
    x:Class="WpfApp2.Views.MainView"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:local="clr-namespace:WpfApp2"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    xmlns:prism="http://prismlibrary.com/"
    Title="MainWindow"
    Width="800"
    Height="450"
    prism:ViewModelLocator.AutoWireViewModel="True"
    mc:Ignorable="d">
    <Grid>
        <Grid.RowDefinitions>
            <RowDefinition Height="auto" />
            <RowDefinition />
        </Grid.RowDefinitions>

        <StackPanel Orientation="Horizontal">
            <Button
                Command="{Binding OpenCommand}"
                CommandParameter="ViewA"
                Content="打开模块A" />
            <Button
                Command="{Binding OpenCommand}"
                CommandParameter="ViewB"
                Content="打开模块B" />
            <Button
                Command="{Binding OpenCommand}"
                CommandParameter="ViewC"
                Content="打开模块C" />
        </StackPanel>
        <ContentControl Grid.Row="1" prism:RegionManager.RegionName="ContentRegin" />
    </Grid>
</Window>

```
通过简化OpenCommand的代码来实现了点击按钮展示的逻辑。

### RegionManager
RegionManager主要实现维护区域集合、提供对区域的访问、合成视图、区域导航、定义区域。

#### 区域定义
xaml实现
```csharp
<ContentControl prism:RegionManager.RegionName="ContentRegion" />
```
设置区域
```csharp
private readonly IRegionManager _regionManager;

public MainWindowViewModel(IRegionManager regionManager)
{
    _regionManager = regionManager;

    // 在TabRegion中注册视图
    _regionManager.RegisterViewWithRegion("TabRegion", typeof(Temp1View));
    _regionManager.RegisterViewWithRegion("TabRegion", typeof(Temp2View));
}
```

### RegionAdapter
如果在实际开发工作当中遇到了特殊场景需要而Prism并没有设置对应的RegionAdapter。这时候可以通过继承实现RegionAdapterBase内置对象来扩展一个新的RegionAdapter。
（1）实现一个新的RegionAdapter
```csharp
/// <summary>
/// custom region adapter.
/// </summary>
public class StackPanelRegionAdapter : RegionAdapterBase<StackPanel>
{
    public StackPanelRegionAdapter(IRegionBehaviorFactory regionBehaviorFactory) : base(regionBehaviorFactory)
    {
    }

    protected override void Adapt(IRegion region, StackPanel regionTarget)
    {
        //该事件监听往StackPanel添加view时的操作
        region.Views.CollectionChanged += (sender, e) =>
        {
            //监听到增加操作时则往StackPanel添加Children，枚举出来的操作在后面一段代码中体现
            if (e.Action == System.Collections.Specialized.NotifyCollectionChangedAction.Add)
            {
                regionTarget.Children.Clear();
                foreach (var item in e.NewItems)
                {
                    regionTarget.Children.Add(item as UIElement);
                }
            }
        };
    }

    protected override IRegion CreateRegion()
    {
        return new Region();
    }
}

// Summary:
//     Describes the action that caused a System.Collections.Specialized.INotifyCollectionChanged.CollectionChanged
//     event.
public enum NotifyCollectionChangedAction
{
    //
    // Summary:
    //     An item was added to the collection.
    Add,
    //
    // Summary:
    //     An item was removed from the collection.
    Remove,
    //
    // Summary:
    //     An item was replaced in the collection.
    Replace,
    //
    // Summary:
    //     An item was moved within the collection.
    Move,
    //
    // Summary:
    //     The contents of the collection changed dramatically.
    Reset
}
```
（2）在App.cs文件中注册新的RegionAdapter
```csharp
public partial class App
{
    /// <summary>
    /// 应用程序启动时创建Shell
    /// </summary>
    /// <returns></returns>
    protected override Window CreateShell()
    {
        return Container.Resolve<MainWindow>();
    }

    protected override void RegisterTypes(IContainerRegistry containerRegistry)
    {
    }

    /// <summary>
    /// 配置区域适配
    /// </summary>
    /// <param name="regionAdapterMappings"></param>
    protected override void ConfigureRegionAdapterMappings(RegionAdapterMappings regionAdapterMappings)
    {
        base.ConfigureRegionAdapterMappings(regionAdapterMappings);


        //添加自定义区域适配对象,会自动适配标记上prism:RegionManager.RegionName的容器控件为Region
        regionAdapterMappings.RegisterMapping(typeof(StackPanel), Container.Resolve<StackPanelRegionAdapter>());
    }
}
```
（3）在xaml中使用
```csharp
<StackPanel prism:RegionManager.RegionName="StackPanelRegion"></StackPanel>
```

### 命令事件
通过指定一个InvokeCommandAction，然后附加命令到具有所需事件的控件，InvokeCommandAction有下面几个属性

- Command标识调用时要执行的命令。这是必需的。
- AutoEnable确定关联元素是否应根据命令的结果自动启用或禁用CanExecute。这是一个可选字段，默认值为True.
- CommandParameter标识要提供给命令的命令参数。这是个可选的选项。
- TriggerParameterPath标识要解析的事件提供对象中的路径，以标识要用作命令参数的子属性。

示例如下：记得先引用命名空间，
```csharp
<Window
    x:Class="PrismWpfApp.Views.InvokeCommandWindow"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:i="http://schemas.microsoft.com/xaml/behaviors"
    xmlns:local="clr-namespace:PrismWpfApp.Views"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    xmlns:prism="http://prismlibrary.com/"
    xmlns:viewmodels="clr-namespace:PrismWpfApp.ViewModels"
    Title="执行命令"
    Width="800"
    Height="450"
    d:DataContext="{d:DesignInstance Type=viewmodels:InvokeCommandWindowViewModel}"
    mc:Ignorable="d">
    <Grid>
        <Grid.RowDefinitions>
            <RowDefinition Height="auto" />
            <RowDefinition Height="auto" />
        </Grid.RowDefinitions>
        <ListBox
            Grid.Row="0"
            ItemsSource="{Binding Items}"
            SelectionMode="Single">
            <i:Interaction.Triggers>
                <i:EventTrigger EventName="SelectionChanged">
                    <prism:InvokeCommandAction Command="{Binding SelectedCommand}" TriggerParameterPath="AddedItems" />
                </i:EventTrigger>
            </i:Interaction.Triggers>
        </ListBox>
        <StackPanel Grid.Row="1" Orientation="Horizontal">
            <TextBlock Text="当前选中的值为：" />
            <TextBlock Text="{Binding SelectedItemText}" />
        </StackPanel>
    </Grid>
</Window>

```
TriggerParameterPath是对应于EventArgs中的属性路径，比如用于SelectionChanged事件，则对应于SelectionChangedEventArgs的属性的字符串，如果写 TriggerParameterPath="AddedItems"，则指SelectionChangedEventArgs.AddedItems对象。CommandParameter和TriggerParameterPath不同，它就是直接传过去的参数，可以是简单的字符串，也可以是绑定的数据对象。

ViewModel代码
```csharp
public class InvokeCommandWindowViewModel : BindableBase
{
	private string _selectedItemText;

	public string SelectedItemText
	{
		get => _selectedItemText;
		set => SetProperty(ref _selectedItemText, value);
	}

	public ObservableCollection<string> Items { get; }

	public DelegateCommand<object[]> SelectedCommand { get; }

	public InvokeCommandWindowViewModel()
	{
		SelectedCommand = new DelegateCommand<object[]>(OnItemSelected);
		Items = new ObservableCollection<string>();
		Items.Add("张三");
		Items.Add("李四");
	}

	/// <summary>
	/// 选择操作
	/// </summary>
	private void OnItemSelected(object[] selectedItems)
	{
		if (selectedItems?.Length > 0)
		{
			SelectedItemText = selectedItems.FirstOrDefault()?.ToString() ?? string.Empty;
		}
	}
}
```

官网资料：[https://prismlibrary.com/docs/wpf/interactivity/event-to-command.html](https://prismlibrary.com/docs/wpf/interactivity/event-to-command.html)

### 消息弹框
资料：[https://prismlibrary.com/docs/wpf/dialog-service.html](https://prismlibrary.com/docs/wpf/dialog-service.html)
需要创建一个用户控件，如DialogMsgView
```csharp
<UserControl
    x:Class="PrismWpfApp.Views.DialogMsgView"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:local="clr-namespace:PrismWpfApp.Views"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    xmlns:prism="http://prismlibrary.com/"
    xmlns:viewmodels="clr-namespace:PrismWpfApp.ViewModels"
    Width="300"
    Height="150"
    d:DataContext="{d:DesignInstance Type=viewmodels:DialogMsgViewModel}"
    d:DesignHeight="450"
    d:DesignWidth="800"
    mc:Ignorable="d">
    <Grid x:Name="LayoutRoot" Margin="5">
        <Grid.RowDefinitions>
            <RowDefinition />
            <RowDefinition Height="Auto" />
        </Grid.RowDefinitions>

        <!--  设置消息框样式  -->
        <prism:Dialog.WindowStyle>
            <Style TargetType="Window">
                <Setter Property="prism:Dialog.WindowStartupLocation" Value="CenterScreen" />
                <Setter Property="ResizeMode" Value="NoResize" />
                <Setter Property="ShowInTaskbar" Value="False" />
                <Setter Property="SizeToContent" Value="WidthAndHeight" />
            </Style>
        </prism:Dialog.WindowStyle>
        <TextBlock
            Grid.Row="0"
            HorizontalAlignment="Stretch"
            VerticalAlignment="Stretch"
            Text="{Binding Message}"
            TextWrapping="Wrap" />
        <Button
            Grid.Row="1"
            Width="75"
            Height="25"
            Margin="0,10,0,0"
            HorizontalAlignment="Right"
            Command="{Binding CloseDialogCommand}"
            CommandParameter="true"
            Content="OK"
            IsDefault="True" />
    </Grid>
</UserControl>

```
然后创建对饮的ViewModel，并继承自：IDialogAware
```csharp
public class DialogMsgViewModel : BindableBase, IDialogAware
{
    #region 属性
    private string _title;

    public string Title
    {
        get => _title;
        set
        {
            _title = value;
            RaisePropertyChanged();
        }
    }

    private string _message;

    public string Message
    {
        get => _message;
        set
        {
            _message = value; RaisePropertyChanged();
        }
    } 
    #endregion

    public DelegateCommand<string> CloseDialogCommand { get; }

    public DialogMsgViewModel()
    {
        Title = "消息框";
        CloseDialogCommand = new DelegateCommand<string>(CloseDialog);
    }

    private void CloseDialog(string parameter)
    {
        var result = ButtonResult.None;
        if (parameter.Equals("true", StringComparison.CurrentCultureIgnoreCase))
            result = ButtonResult.OK;
        else
            result = ButtonResult.Cancel;

        RaiseRequestClose(new DialogResult(result));
    }

    public virtual void RaiseRequestClose(IDialogResult dialogResult)
    {
        RequestClose?.Invoke(dialogResult);
    }

    public event Action<IDialogResult> RequestClose;

    public bool CanCloseDialog()
    {
        return true;
    }

    public void OnDialogClosed()
    {
    }

    public void OnDialogOpened(IDialogParameters parameters)
    {
        Message = parameters.GetValue<string>("message");
    }
}
```
然后记得注册该弹框，在RegisterTypes方法
```csharp
containerRegistry.RegisterDialog<DialogMsgView, DialogMsgViewModel>();
```
然后就是使用该弹框了，我们需要在对应页面的ViewModel中注入IDialogService，然后调用它的ShowDialog方法
```csharp
var message = "我是弹框的信息";

// 普通的写法
_dialogService.ShowDialog("DialogMsgView", new DialogParameters($"message={message}"), r =>
{
    if (r.Result == ButtonResult.None)
    {
        Debug.WriteLine("返回空结果");
    }
    else if (r.Result == ButtonResult.OK)
    {
        Debug.WriteLine("返回ok");
    }
    else if (r.Result == ButtonResult.Cancel)
    {
        Debug.WriteLine("返回取消");
    }
    else
    {
        Debug.WriteLine("未处理");
    }
});
```
然后当触发弹框事件的时候，就会弹出刚才创建的用户控件弹框。

如果觉得上面弹框的方法每次传递参数多，那么还可以编写扩展方法来简化弹框的操作，编写扩展方法如下
```csharp
public static class DialogServiceExtensions
{
    /// <summary>
    /// 显示弹框
    /// </summary>
    /// <param name="dialogService"></param>
    /// <param name="message"></param>
    /// <param name="callback"></param>
    public static void ShowNotification(this IDialogService dialogService, string message, Action<IDialogResult> callback)
    {
        dialogService.ShowDialog("DialogMsgView", new DialogParameters($"message={message}"), callback);
    }
}
```
然后调起弹框的方法就可以改写为
```csharp
_dialogService.ShowNotification(message, r =>
{
    if (r.Result == ButtonResult.None)
    {
        Debug.WriteLine("返回空结果");
    }
    else if (r.Result == ButtonResult.OK)
    {
        Debug.WriteLine("返回ok");
    }
    else if (r.Result == ButtonResult.Cancel)
    {
        Debug.WriteLine("返回取消");
    }
    else
    {
        Debug.WriteLine("未处理");
    }
});
```

### 发布订阅
实现页面点击发布消息然后另一个地方进行接收
```csharp
<StackPanel Orientation="Horizontal">
    <Label Content="请输入要发布的内容：" />
    <TextBox
        x:Name="sendContent"
        Width="150"
        Margin="10,0" />
    <Button
        Command="{Binding SendMsgCommand}"
        CommandParameter="{Binding Path=Text, ElementName=sendContent}"
        Content="发布订阅" />
</StackPanel>
```
对应ViewModel写法，注入IEventAggregator
```csharp
public class ViewBViewModel : BindableBase, INavigationAware
{
    private readonly IEventAggregator _eventAggregator;

    public ViewBViewModel(IEventAggregator eventAggregator)
    {
        _eventAggregator = eventAggregator;
        SendMsgCommand = new DelegateCommand<string>(SendMsg);
    }

    public DelegateCommand<string> SendMsgCommand { get; set; }

    /// <summary>
    /// 发送消息
    /// </summary>
    /// <param name="msg"></param>
    public void SendMsg(string msg)
    {
        // 向messageEvent发布一个消息
        _eventAggregator.GetEvent<MessageEvent>().Publish(msg);
    }
}
```
MessageEvent内容为
```csharp
/// <summary>
/// 消息发布订阅类
/// </summary>
public class MessageEvent : PubSubEvent<string>
{
}
```
然后就是接收消息的地方
```csharp
public partial class ViewB : UserControl
{
    public ViewB(IEventAggregator eventAggregator)
    {
        InitializeComponent();

        eventAggregator.GetEvent<MessageEvent>().Subscribe((arg) =>
        {
            MessageBox.Show($"接收到消息 {arg}");
        });
        // 取消订阅
        //eventAggregator.GetEvent<MessageEvent>().Unsubscribe((arg) => { });
    }
}
```

## 资料
页面导航：[https://www.cnblogs.com/formula123/p/13912365.html](https://www.cnblogs.com/formula123/p/13912365.html)
示例仓库：[https://github.com/PrismLibrary/Prism-Samples-Wpf](https://github.com/PrismLibrary/Prism-Samples-Wpf) (关于该仓库的一点解释：[https://mp.weixin.qq.com/s/aWcKwiLblqYWWlpbcFWgxA](https://mp.weixin.qq.com/s/aWcKwiLblqYWWlpbcFWgxA))
系列博客文档：[https://www.cnblogs.com/lovexinyi/category/1487153.html](https://www.cnblogs.com/lovexinyi/category/1487153.html)
