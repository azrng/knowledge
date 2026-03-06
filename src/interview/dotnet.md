---
title: dotNet面试题
date: 2023-03-24
publish: true
author: azrng
isOriginal: false
# 是否属于目录
# index: false
order: 200
category:
 - 面试
tag:
 - 面试题
# 是否显示到列表
article: false
---

https://mp.weixin.qq.com/s/EyzVsV-AgHBOh543r7kttw | 【面试题解析】.NET实战面试题及答案AI补充，大家对比学习

https://mp.weixin.qq.com/s/dBwNXl_c3b0nqynansY_LA | 热心网友收集的.NET实战面试题

## .Net、ASP.Net、C#、VisualStudio之间的关系是什么？

.Net期初指的是.Net Framework 该框架最高版本为4.8，2016年左右出了.NetCore在更新一直到5版本的时候，成为了大统一的.Net，所以在.Net5 .Net6 .Net7 .Net8 等高版本也指.NetCore，该框架提供了基础的.Net类，这些类可以被任何一种.Net编程语言调用，.Net还提供了CLR、JIT、GC等基础功能。

ASP.Net是.Net中用来进行Web开发的一种技术，ASP.Net的页面部分写在aspx 文件中，逻辑代码通常通过Code-behind的方式用C#、VB.Net等支持.Net的语言编写。

C#是使用最广泛的支持.Net的编程语言。除了C#还有VB.Net等。

VisualStudio是微软提供的用来进行.Net开发的集成开发环境（IDE），使用VisualStudio可以简化很多工作，不用程序员直接调用csc.exe等命令行进行程序的编译，而且VisualStudio提供了代码自动完成、代码高亮等功能方便开发，最新版本是VS2022。除了VisualStudio，还有Rider等。

## ASP.NET Framework 和 ASP.NET Core 有什么区别？

ASP.NET Framework：是传统的.NET Web应用程序框架，主要运行在Windows平台上，依赖于IIS，功能丰富但较为笨重，不支持跨平台。

ASP.NET Core：是跨平台的.NET Web应用程序框架，支持Windows、Mac和Linux等平台，可以使用不同的运行时，更轻量且性能更高，适合现代应用开发。

优点：.NET Core具有更小的文件大小、更快的启动时间和更好的性能表现，同时还可以使用新的C#语言功能。

## .NET Core相比.NET Framework 的优点

全家桶还是想自选

Net：默认包含了所有东西，满足所有人使用需求

Netcore：需要啥自己加啥，看个人使用需求。

Asp.NetCore与Asp.Net不一样的地方，前者是根据需求添加对应的中间件，而后者是提前就全部准备好了，不管用不用，反正都要经过，这也是Asp.NetCore性能比较好的原因之一。



ASP.NET Core 具有如下优点：跨平台、自托管、开源、高性能

- 生成 Web UI 和 Web API 的统一场景。
- 集成**新式客户端框架**和开发工作流。
- 基于环境的云就绪**配置系统**。
- 内置**依赖项注入**。
- 轻型的**高性能**模块化 HTTP 请求管道。
- 能够在 **IIS、Nginx、Apache、Docker** 上进行托管或在自己的进程中进行自托管。
- 定目标到 **.NET Core** 时，可以使用并行应用版本控制。
- 简化新式 Web 开发的工具。
- 能够在 Windows、macOS 和 Linux 进行生成和运行。
- 开放源代码和**以社区为中心**。

.net core 完全作为nuget包提供，借助nuget包可以将应用优化减少到只包含到必须的依赖项，提升了安全性，减少了维护和提高性能

跨平台的本质是因为已经内置了主机，只要是程序启动就是启动了主机，就可以监听端口

## ADO.NET中的五个主要对象

Connection：主要是开启程序和数据库之间的连接。没有利用连接对象将数据库打开，是无法从数据库中取得数据的。Close和Dispose的区别，Close以后还可以Open，Dispose以后则不能再用。

Command：主要可以用来对数据库发出一些指令，例如可以对数据库下达查询、新增、修改、删除数据等指令，以及调用存在数据库中的存储过程等。这个对象是架构在Connection 对象上，也就是Command 对象是透过连接到数据源。

DataAdapter：主要是在数据源以及DataSet 之间执行数据传输的工作，它可以透过Command 对象下达命令后，并将取得的数据放入DataSet 对象中。这个对象是架构在Command对象上，并提供了许多配合DataSet 使用的功能。

DataSet：这个对象可以视为一个暂存区（Cache），可以把从数据库中所查询到的数据保留起来，甚至可以将整个数据库显示出来，DataSet是放在内存中的。DataSet 的能力不只是可以储存多个Table 而已，还可以透过DataAdapter对象取得一些例如主键等的数据表结构，并可以记录数据表间的关联。DataSet 对象可以说是ADO.NET 中重量级的对象，这个对象架构在DataAdapter对象上，本身不具备和数据源沟通的能力；也就是说我们是将DataAdapter对象当做DataSet 对象以及数据源间传输数据的桥梁。DataSet包含若干DataTable、DataTableTable包含若干DataRow。

DataReader：当我们只需要循序的读取数据而不需要其它操作时，可以使用DataReader 对象。DataReader对象只是一次一笔向下循序的读取数据源中的数据，这些数据是存在数据库服务器中的，而不是一次性加载到程序的内存中的，只能（通过游标）读取当前行的数据，而且这些数据是只读的，并不允许作其它的操作。因为DataReader 在读取数据的时候限制了每次只读取一笔，而且只能只读，所以使用起来不但节省资源而且效率很好。使用DataReader 对象除了效率较好之外，因为不用把数据全部传回，故可以降低网络的负载。

ADO.NET 使用Connection 对象来连接数据库，使用Command 或DataAdapter对象来执行SQL语句，并将执行的结果返回给DataReader 或 DataAdapter ,然后再使用取得的DataReader 或DataAdapter 对象操作数据结果。

## 列举ASP.NET 页面之间传递值的几种方式。

1.使用QueryString, 如....?id=1; response. Redirect().... 

2.使用Session变量 

3.使用Server.Transfer

4.Cookie传值

## **什么是dotNet core的startup class?**

答：Startup class是dot net core应用的入口。所有的dot net core应用必须有这个class 这个类用来配置应用。

这个类的调用是在program main函数里面进行配置的。类的名字可以自己定义。

## post、get的区别？

get的参数会显示在浏览器地址栏中，而post的参数不会显示在浏览器地址栏中；

使用post提交的页面在点击【刷新】按钮的时候浏览器一般会提示“是否重新提交”，而get则不会；

用get的页面可以被搜索引擎抓取，而用post的则不可以；

用post可以提交的数据量非常大，而用get可以提交的数据量则非常小(2k)，受限于网页地址的长度。

用post可以进行文件的提交，而用get则不可以。

## Application 、Cookie和 Session 两种会话有什么不同？

Application是用来存取整个网站全局的信息，而Session是用来存取与具体某个访问者关联的信息。Cookie是保存在客户端的，机密信息不能保存在Cookie中，只能放小数据；Session是保存在服务器端的，比较安全，可以放大数据。

##  Session有什么重大BUG，微软提出了什么方法加以解决？

IIS中由于有进程回收机制，系统繁忙的话Session会丢失，IIS重启也会造成Session失。这样用户就要重新登录或者重新添加购物车、验证码等放到Session中的信息。可以用State Server或SQL Server数据库的方式存储Session不过这种方式比较慢，而且无法捕获Session的END事件。但是这不是Bug，只能说是In-Proc方式存储Session的缺陷，缺陷是和Bug不一样的，In-Proc方式存储Session会由服务器来决定什么时候释Session，In-Proc方式不满足要求的话完全可以用StateServer和数据库的方式。

 

StateServer还可以解决集群Session共享的问题。

## 介绍几个使用过的开源的项目？

AutoMapper、Dapper、Redis、NPOI、JQuery、Quartz.Net、JqueryUI、Vue、Lucene.net。在GitHub、Gitee网站上有更多的开源项目。

## 谈谈你对MVC和三层架构的理解？

MVC即模型、视图、控制器，模型表示业务数据及业务处理，用来封装数据及行为；视图是用户看到并与之交互的界面；控制器接受用户输入并调用模型和视图去完成用户的请求。使用MVC有利于关注点分离，自动化UI测试成为了可能。

三层架构即表现层(UI)、业务逻辑层(BLL)、数据访问层(DAL)。区分层次的目的即为了“高内聚，低耦合”的思想。表现层通俗讲就是展现给用户的界面，业务逻辑层即针对具体问题的操作，也可以说是对数据层的操作，对数据业务逻辑处理。数据访问层：该层所做事务直接操作数据库，针对数据的增添、删除、修改、更新、查找等。

## **什么是中间件?**

答：中间件在这里是指注入到应用中处理请求和响应的组件。

## **application builder的use和run方法有什么区别?**

答：这两个方法都在start up class的configure方法里面调用。都是用来向应用请求管道里面添加中间件的。Use方法可以调用下一个中间件的添加，而run不会。

## dotNet core 管道里面的map拓展有什么作用?

答：可以针对不同的路径添加不同的中间件。

## dotNet core里面的路径是如何处理的?

答：路径处理是用来为进入的请求寻找处理函数的机制。所有的路径在函数运行开始时进行注册。

主要有两种路径处理方式，常规路径处理和属性路径处理。常规路径处理就是用MapRoute的方式设定调用路径，属性路径处理是指在调用函数的上方设定一个路径属性。

## 如何在dotNet core中使用session

答：首先要添加session包. 其次要在config service方法里面添加session。然后又在configure方法里面调用usesession。

## 描述一下依赖注入后的服务生命周期?

答：asp.net core主要提供了三种依赖注入的方式

其中AddTransient与AddSingleton比较好区别

AddTransient瞬时模式：每次都获取一个新的实例

AddSingleton单例模式：每次都获取同一个实例

 

而AddTransient与AddScoped的区别更不容易区别一点

首先这两种方式每次请求得到的都不是同一个对象，从这点看会发现这两个都一样。

但是我们可以继续分细一点，虽然不同的请求得到的结果不同，但是我们可以在同一次请求中去获取多次实例测试。

小总结:

AddTransient瞬时模式：每次请求，都获取一个新的实例。即使同一个请求获取多次也会是不同的实例

AddScoped：每次请求，都获取一个新的实例。同一个请求获取多次会得到相同的实例

AddSingleton单例模式：每次都获取同一个实例。

## **.NET生成 Windows、Mac、Linux 等系统客户端的方式**

事实上.NET本身的桌面客户端支持Windows 。当然一些开源的组件可以支持多平台，比如Avalonia，Electron.NET等等。如果是网站

## Server.Transfer和Response.Redirect的区别是什么？

Server.Transfer仅是服务器中控制权的转向，在客户端浏览器地址栏中不会显示出转向后的地址；Response.Redirect则是完全的跳转，浏览器将会得到跳转的地址，并重新发送请求链接。这样，从浏览器的地址栏中可以看到跳转后的链接地址。

Server.Transfer是服务器请求资源，服务器直接访问目标地址的URL，把那个URL的响应内容读取过来，然后把这些内容再发给浏览器，浏览器根本不知道服务器发送的内容是从哪儿来的，所以它的地址栏中还是原来的地址。 这个过程中浏览器和Web服务器之间经过了一次交互。

Response.Redirect就是服务端根据逻辑,发送一个状态码,告诉浏览器重新去请求那个地址，一般来说浏览器会用刚才请求的所有参数重新请求。这个过程中浏览器和Web服务器之间经过了两次交互。

## 什么是内存映射文件？

答：内存映射文件用于将文件内容映射到应用程序的逻辑地址。它使你能够在同一台计算机上运行多个进程以彼此共享数据。要获得一个内存映射文件对象, 可以使用MemoryMappedFile.CreateFromFiles()方法。它表示磁盘上文件中的持久性内存映射文件。

## .Net中有几种类型的内存？

答：.Net中有两种类型的内存

- 堆栈内存
- 堆内存

## 说说IIS的工作原理？

对比IIS来说，它依赖HTTP.SYS的内置程序来监听外部的HTTP请求，如果请求的是一个可访问的URL，HTTP.SYS会将这个请求交给IIS工作进程，把信息保存到HttpWorkRequest中，在相互隔离的应用程序域AppDomain中加载HttpRuntime，调用HttpRuntime的ProcessRequest方法，之后就是我们的程序操作，最后返回数据流，并重新返回到HTTP.SYS,HTTP.SYS在将数据返回给客户端浏览器。

## **多租户系统的实现方式**

多租户系统通过为不同租户提供隔离的环境来实现。常用的有三种实现方式，如下：

1）独立数据库方案：为每个租户创建独立的数据库，实现数据隔离。

2）共享数据库方案：在同一个数据库中使用租户ID来区分数据。

3）SCHEMA方案：使用数据库中的不同 schema 来区分租户数据。

常见的多租户开源项目有ABP等

## .NET系统如何实现水平扩展、如何解决高并发问题

水平扩展：利用Nginx建立分布式系统，增加服务器，增加CPU

解决高并发问题:增加缓存、禁止用户重复操作、建立请求队列

## 请问如何构架一个高负载的系统？

应用服务和数据服务分离，使用缓存改善网站性能，使用应用服务器集群改善网站的并发处理能力，数据库读写分离，使用反向代理和CDN加速网站响应，使用分布式文件系统和分布式数据库系统，使用NoSQL和搜索引擎，对业务拆分，建立分布式服务。

## 聊聊.NET的管道和.NET Core的中间件

.NET的管道：在管道模型运行开始前，首先HTTP的请求被被传递到HttpRuntime类的一个实例中，然后这个实例对象检测请求并找到被接受的那个应用程序，接下来管道模型就使用HttpApplicationFactory对象来创建一个HttpApplication对象来处理这个请求（在此同时也将创建HttpContext，HttpRequest和HttpResponse），一个HttpApplication可以包含一系列HttpModule对象。

## .NET Core的中间件

中间件是一种装配到应用管道中以处理请求和响应的程序，使用Run、Map和Use扩展方法来配置请求委托。请求委托用于构建请求管道，处理每个HTTP请求。

每个委托可以在下一个委托之前和之后执行操作。委托还可以决定不将请求传递给下一个委托，这称为请求管道的短路。短路通常是可取的，因为它避免了不必要的工作。

```
public class Startup
{
    //此处省略部分代码，创建一个新的Core web项目，可以自行查看
    public void Configure(IApplicationBuilder app, IHostingEnvironment env)
    {
        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }
        else
        {
            app.UseExceptionHandler("/Home/Error");
            app.UseHsts();
        }
        app.UseHttpsRedirection();
        app.UseStaticFiles();
        app.UseCookiePolicy();
        app.UseMvc(routes =>
        {
            routes.MapRoute(
                name: "default",
                template: "{controller=Home}/{action=Index}/{id?}");
        });
    }
}
```



Configure方法中的就是中间件，中间件组件的顺序定义了在请求上调用它们的顺序，以及响应的相反顺序，此排序对于安全性，性能和功能至关重要。

常用的中间件顺序

1. 异常/错误处理

2. HTTP 严格传输安全协议，HTTP协议介绍

3. HTTPS 重定向

4. 静态文件服务器

5. Cookie 策略实施

6. 身份验证

7. 会话
8. MVC

中间件例子：

```c#
public class LogMiddleware
{
    private readonly RequestDelegate _next;
    public LogMiddleware(RequestDelegate next)
    {
        _next = next;
    }
    public async Task Invoke(HttpContext context)
    {
        Debug.WriteLine("程序运行 开始。");
        await _next(context);
        Debug.WriteLine("程序运行 结束。");
    }
}

public static class LogMiddlewareExtensions {
    public static IApplicationBuilder UseLog(this IApplicationBuilder app) {
        return app.UseMiddleware<LogMiddleware>();
    }
}
```

在Configure中 app.UseLog();就可，程序运行，会在VS调试输出的地方显示

程序运行 开始。

xxx

程序运行 结束。

## **微服务的缺点**

微服务架构的缺点包括增加了分布式系统的复杂性，导致服务间通信开销增加，部署和维护困难度提升，一致性问题和事务管理挑战加大，测试变得更加复杂，安全性难题增多，运维负担增加，学习曲线陡峭，如果网站太小不建议采用，一般适用于业务种类较多的大项目。

## **领域驱动设计（DDD）以及原则和实现**

DDD不过是一种软件设计思想和方法而已。它主要关注于将业务逻辑和领域模型融入设计过程。实现有多种方式。

## 把一个对象赋值为null会被GC回收吗

示例代码如下

```c#
internal class Program
{
	static void Main(string[] args)
	{
		Program pm = new Program();
		Console.WriteLine("Hello World");
		GC.SuppressFinalize(pm);//这句是废话
		pm = null;
		GC.Collect(0);//默认的GC垃圾回收器
		Console.ReadLine();
	}
	~Program()
	{
		Console.WriteLine("调用了析构函数");
	}
}
```

被GC回收的条件是这个对象不再存活(也就是没有被标记为1),但是pm对象是根(局部引用对象)，所以它是存活的(标记为1)。是不会被垃圾回收的。

但是如果把pm=null呢？同样的它也不会被GC回收，为什么呢？

首先看下这段代码，GC.SuppressFinalize不运行pm对象的析构函数，因为这段程序本身就不执行，所以这句代码可有可无。这句代码的后面是pm=null，以及垃圾回收。

正确的回答是:面试官你好，我认为不能被回收的。原因在于，pm对象是根对象，它本身是不能够被GC回收的。如果把pm赋值为null，也不能被回收。原因在于pm的null被赋值给了.Ctor默认构造函数的指针。而不是pm实例指针。即使单独赋值给了pm实例指针也是不行的，需要.Ctor和pm实例指针同时为null才可以被GC回收。所以个人认为它不会被GC回收。

资料来自：https://mp.weixin.qq.com/s/QhaBqFkluG2WQX_iwVG12A
