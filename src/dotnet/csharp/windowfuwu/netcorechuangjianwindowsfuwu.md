---
title: netcore创建windows服务
lang: zh-CN
date: 2023-10-22
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 无
filename: netcorechuangjianwindowsfuwu
slug: kwsz8q
docsId: '29635041'
---
使用.NET Core创建Windows服务
使用微软推荐方式
使用Topshelf方式
 
 
**安装步骤**
这里首先你要确保你已经安装了.NET Core 3.0或以上版本。在我编写这篇文章的时候， .NET Core 3.1刚刚发布，Visual Studio应该会提示你升级到最新版本。但是如果你想要在.NET Core 2.x项目中使用这个方式，应该是行不通的。
如果你喜欢使用命令行创建项目，你就需要使用工作器(worker)类型创建项目：
dotnet new worker
如果你是一个和我一样喜欢使用Visual Studio的开发人员，那么你可以在Visual Studio中使用项目模板完成相同的功能。
![image.png](/common/1609838929172-9922ab7a-6416-4f10-8a28-f704b4f495f4.png)
这样做将创建出一个包含两个文件的项目。其中Program.cs文件是应用的启动“引导程序”。另外一个文件是worker.cs文件，在这个文件中，你可以编写你的服务逻辑。
这看起来应该是相当的容易，但是为这个程序添加额外的并行后台服务，你还需要添加一个类，并让它继承BackgroundService类:
```csharp
public class MyNewBackgroundWorker : BackgroundService
{
protected override Task ExecuteAsync(CancellationToken stoppingToken)   
{
//Do something.
}
}
```
然后在Program.cs中，我们要做的只是把当前的Worker注册到服务集合(Service Collection)中即可。
```
.ConfigureServices((hostContext, services) =>
{
services.AddHostedService<Worker>();
services.AddHostedService<MyNewBackgroundWorker>();
});
```
实际上作为“后台服务”任务的运行程序，AddHostedService方法已经在框架中存在了很长时间了。在之前我们已经完成的一篇关于ASP.NET Core托管服务的文章， 但是在当时场景中，我们托管是是整个应用，而非一个在你应用程序幕后运行的东西。
**运行/调试我们的应用**
在默认的工作器(worker)模板中，已经包含了一个后台服务，这个服务可以将当前时间输出到控制台窗口。下面让我们点击F5来运行程序，看看我们能得到什么。
info: CoreWorkerService.Worker[0]
Worker running at: 12/07/2019 08:20:30+13:00
info: Microsoft.Hosting.Lifetime[0]
Application started. Press Ctrl+C to shut down.
在我们启动程序之后，程序立刻就运行了！我们可以保持控制台的打开状态来调试应用，或者直接关闭窗口退出。相较于使用"Microsoft"方式来调试一个Windows服务，这简直就是天堂。
这里我们需要注意的另外一件事情是编写控制台程序的平台。在最后，我们不仅在控制台窗口输出了时间，还通过依赖注入创建了一个托管worker. 我们也可以使用依赖注入容器来注入仓储，配置环境变量，获取配置等。
**但这里我们还没有做的事情是，将这个应用转换为Windows服务**。。
**将我们的应用转换成Window服务**
为了将应用转换成Windows服务，我们需要使用如下命令引入一个包。
```
Install-Package Microsoft.Extensions.Hosting.WindowsServices
```
下一步，我们需要修改Program.cs文件，添加UseWindowsService()方法的调用。
```
public static IHostBuilder CreateHostBuilder(string[] args) =>
Host.CreateDefaultBuilder(args)
.ConfigureServices((hostContext, services) =>
{
services.AddHostedService<Worker>();
})
.UseWindowsService();
```
以上就是所有需要变更的代码。
运行我们的程序，你会发现和之前的效果完全样。但是这里最大的区别是，我们可以将当前应用以Windows服务的形式安装了。
为了实现这一目的，我们需要发布当前项目。在当前项目目录中，我们可以运行以下命令：
dotnet publish -r win-x64 -c Release
然后我们就可以借助标准的Windows服务安装器来安装当前服务了。
sc create TestService BinPath=C:\full\path\to\publish\dir\WindowsServiceExample.exe
当前，你也可以使用Windows服务安装器的其他命令。
sc start TestServicesc stop TestServicesc delete TestService
最后检查一下我们的服务面板。
服务已经正常工作了。
**在Linux中运行服务**
老实说，我没有太多的Linux经验，但是终归是需要了解一下...
在Linux系统中, 如果你希望我们编写的“Windows”服务在Linux系统中作为服务运行，你需要做以下2步：
使用Microsoft.Extensions.Hosting.Systemd替换之前的Microsoft.Extensions.Hosting.WindowsServices。
使用UseSystemd()替换UseWindowsService()。
**Microsoft vs Topshelf vs .NET Core Workers**
到现在为止，我们已经介绍了借助3种不同的方式来创建Windows服务。
**你可能会问“好吧，那我到底应该选择哪一种？”**
这里呢，我们可以首先把"Microsoft"这种老派学院式的方式抛弃。因为它的调试实在是太麻烦了，而且没有什么实际的用处。
然后剩下的就是Topshelf和.NET Core工作器两种方式了。在我看来，.NET Core工作器，已经很好的融入.NET Core生态系统，如果你正在开发ASP.NET Core应用，那么使用.NET Core工作器就很有意义。最重要的是，当你创建一个后台服务的时候，你可以让它在一个ASP.NET Core网站中的任意位置运行，这非常的方便。但是缺点是安装。你必须使用SC命令来安装服务。这一部分Topshelf可能更胜一筹。
Topshelf总体上将非常的友好，并且具有最好的安装方式，但是使用额外的库，也增加了学习的成本。
所以Topshelf和.NET Core工作器，大家可以自行选择，都是不错的方案。
 
