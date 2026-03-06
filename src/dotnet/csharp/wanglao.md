---
title: 网络
lang: zh-CN
date: 2023-10-27
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 无
filename: wanglao
slug: ndg604
docsId: '64936761'
---
> 本文为读书笔记
> 示例代码环境：vs2022+.Net6


## 概述
.NET Framework在System.Net.*命名空间中包含了支持各种网络标准的类，支持的标准包括HTTP、TCP/IP以及FTP等。
以下列出了其中的主要组件：

- WebClient类：支持通过HTTP或者FTP执行简单的下载/上传操作。
- WebRequest和WebResponse类：可以从底层控制客户端HTTP或FTP操作。· 
- HttpClient类：消费HTTP Web API和RESTful服务。
- HttpListener类：用于编写HTTP服务器。
- SmtpClient类：构造并通过SMTP协议发送邮件。
- Dns类：用于进行域名和地址之间的转换。
- TcpClient、UdpClient、TcpListener和Socket类：用于直接访问传输层和网络层。 

## 网络架构
.Net网络编程类型以及所对应通信层，其中大多数类型位于传输层或者引用层，传输层定义了发送和接受字节的基础协议(TCP和UDP)；而应用层则定义了位了特定应用程序设计的上层协议。例如下载网络页面（HTTP）、传输文件(FTP)、发送邮件(SMTP)以及在域名和IP地址之间进行转换(DNS).
常用网络属于缩写
![image.png](/common/1642175391107-21e8a100-0feb-47bc-adbd-57d9226e32d6.png)

## 地址与端口
计算机或其他设备需要一个地址才能够进行通信。Internet使用了两套地址系统。

- IPV4:它是目前主流的地址系统，有32位宽，用字符串标识可写为用点分割的四个十进制数(例如：100.102.103.104)，地址可以全世界唯一的，也可以再一个子网中是唯一的。
- IPV6：是更新的128位地址系统，用字符串标识为以冒号分隔的十六进制数（例如：[3EA0:FFFF:198A:E4A3:4FF2:54fA:41BC:8D31]）。.NetF中要求在IPV6地址前后加上方括号。

System.Net命名空间的IPAddress类是采用其中任意一种协议的地址。它的构造器可以接受一个字节数组，也可以使用静态Parse方法并传入正确格式化的字符串。
```csharp
IPAddress a1 = new IPAddress(new byte[] { 101, 102, 103, 104 });
IPAddress a2 = IPAddress.Parse("101.102.103.104");
Console.WriteLine(a1.Equals(a2));//True
Console.WriteLine(a1.AddressFamily);//InterNetwork


IPAddress a3 = IPAddress.Parse("[2409:8a1e:8fce:350:99c:ca93:94ab:a7f6]");
Console.WriteLine(a3.AddressFamily);//InterNetworkV6
```
TCP和UDP协议将每一个IP地址划分为65535个端口，从而允许一台计算机在一个地址上运行多个应用程序，每一个应用程序使用一个端口。

IP地址和端口的组合是使用IPEndPoint类来表示的
```csharp
IPAddress a1 = new IPAddress(new byte[] { 101, 102, 103, 104 });
IPEndPoint ep = new IPEndPoint(a1, 222);// port:222
Console.WriteLine(ep.ToString());//101.102.103.104:222
```
> 防火墙可以阻挡端口通信，在许多企业，只有少数端口开放，比如80端口和443端口。


## URI
URI是一个具有特殊格式的字符串，它描述了一个Internet或LAN资源。

- URI可分为三个组成部分：协议（scheme）、权限（authority)及路径（path）
- Uri类适用于验证URI字符串的格式，并将URI划分为相应的组成部分。
- Uri的IsLoopback属性表示Uri是否引用本地主机（IP地址为127.0.0.1）; IsFile属性则表示该Uri是否引用了一个本地或者UNC路径。如果IsFile返回true则LocalPath属性将返回一个符合本地操作系统命名习惯（带有反斜杠）的绝对路径AbsolutePath.
```csharp
var u = new Uri("http://www.baidu.com");
Console.WriteLine("是否引用本地主机:" + u.IsLoopback);//False
Console.WriteLine("是否引用了一个本地或者UNC路径:" + u.IsFile);//False
Console.WriteLine("绝对路径:" + u.LocalPath);//  /
```
Uri还提供了比较或者截取路径的方法：
```csharp
var a = new Uri("https://www.baidu.com");
var u = new Uri("https://www.baidu.com/s?wd=aa&ie=UTF-8");

Console.WriteLine(u.Host);// www.baidu.com
Console.WriteLine(u.Port);// 443
Console.WriteLine(u.IsBaseOf(a));// True

var relative = u.MakeRelativeUri(a);
Console.WriteLine(relative.IsAbsoluteUri);//False
Console.WriteLine(relative.ToString());// ./
```
> URI后的斜杠是非常重要的。服务器会根据它来决定该URI是否包含了路径信息。如果该URI结尾处并没有斜杠的话，则Web服务器则会试图在网站的根目录下寻找名为nutshell（没有扩展名）的文件，而这种行为通常不是我们期望的。如果该文件不存在，则大多数Web服务器会将其认定为用户输入错误，并返回301永久重定向错误，表示客户端应当尝试在结尾加上斜杠。


Uri类还提供了一些静态的辅助方法，例如EscapeUriString()方法会将ASCII值大于127的所有字符转换为十六进制，从而将一个字符串转换为一个有效的URL。CheckHostName()和CheckSchemeName()方法接受一个字符串并检查它们指定属性的语法是否正确（但它们不会确定主机或URI是否存在）。

## 客户端类型

- WebRequest和WebResponse是管理HTTP和FTP客户端活动，以及“file:”协议的通用基类。它们封装了这些协议共同的“请求/响应”模型：即客户端发起请求，然后等待服务器的响应，只支持流操作。
- WebClient是一个易于使用的门面（facade）类，它负责调用WebRequest和Web-Response的功能，从而节省很多的代码。WebClient支持字符串、字节数组、文件或者流。但是WebClient也不是万能的，因为它也不支持所有的特性（例如cookie）。
- HttpClient是另一个基于WebRequest和WebResponse的类（更准确说是基于Http-WebRequest和HttpWebResponse），它是.NETFramework 4.5新引入的类型。Web-Client主要作为请求/响应类型上的简单一层，而HttpClient则针对基于HTTP的Web API、基于REST的服务以及自定义的认证协议增加了很多功能性支持。
- WebClient和HttpClient都支持简单的上传/下载文件、字符串或字节数组操作，并且它们都支持异步方法。但只有WebClient提供了进度报告功能。

### WebClient
以下列出了WebClient类型的使用步骤：

1. 实例化一个WebClient对象。
2. 设置Proxy属性值。
3. 若需要进行验证，则设置Credentials属性值。
4. 使用相应的URI调用DownloadXXX或者UploadXXX方法。

示例：演示将示例页面下载到当前文件夹中
```csharp
var wc = new WebClient() { Proxy = null };//已过时
wc.DownloadFile("http://www.baidu.com","test.html");
```
示例：下载一个web页面，并进行进度报告，如果下载时间大于5秒，则取消下载任务
```csharp
var wc = new WebClient();//已过时
wc.DownloadProgressChanged += (sender, args) =>
{
    Console.WriteLine(args.ProgressPercentage + "% Complete");
    Task.Delay(5000)
    .ContinueWith(ant => wc.CancelAsync());
};

await wc.DownloadFileTaskAsync("http://www.baidu.com", "web.html");

Console.ReadLine();
```
当请求取消时会抛出一个WebException异常，且其Status属性的值为WebExceptionStatus.RequestCanceled。

### WebRequest和WebResponse
WebRequest和WebResponse比WebClient更复杂，但是也更加灵活。以下是使用它们的基本步骤：

1. 使用一个URI调用WebRequest.Create来实例比一个Web请求对象。
2. 设置Proxy属性。
3. 若需要进行身份验证，则设置Credential属性。如果需要上传数据，则：
4. 调用请求对象的GetRequestStream方法，并向流中写入数据。如果需要处理响应，则请参见第5步。如果需要下载数据，则：
5. 调用请求对象的GetResponse方法，实例化一个Web响应对象。
6. 在Web响应对象上调用GetResponseStream方法，并从流中读取数据（可以利用StreamReader）。

示例：下载示例页面代码
```csharp
var req = WebRequest.Create("http://www.baidu.com");//已过时
req.Proxy = null;
using (WebResponse res = await req.GetResponseAsync())
{
    using Stream rs = res.GetResponseStream();
    using FileStream fs = File.Create("test.html");
    await rs.CopyToAsync(fs);
}
```
Create静态方法会创建一个WebRequest类型子类的实例，例如HttpWebReqeust或者FtpWebRequest。它将根据URI的前缀来选择子类。
WebRequest类提供了Timeout属性（单位为毫秒）。如果发生超时，则抛出Web-Exception，并将其Status属性设置为WebExceptionStatus.Timeout。HTTP协议默认的超时时间为100秒，而FTP协议默认不设置超时时间。
一个WebRequest对象不可用于多个请求，每一个实例仅可用于一个作业。

### HttpClient
HttpClient类是.NET Framework 4.5引入的新类型。它在HttpWebReqeust和Http-WebResponse之上提供了另一层封装。
它在处理比获取网页更复杂的协议场景时比WebClient有更佳的体验。具体来说：

-  一个HttpClient实例就可以支持并发请求。而要使用WebClient处理并发请求的话则需要为每一个并发线程创建一个新的实例。当需要自定义头部信息、cookie信息，以及身份验证信息时会变得更加麻烦。·
- HttpClient支持插件式的自定义消息处理器。这可用于创建单元测试替身，以及创建（日志记录、压缩、加密等）自定义管道。而对于WebClient来说则很难进行单元测试代码的编写。
- HttpClient有丰富且易于扩展的请求头部与内容类型系统。
> HttpClient并不能完全替代WebClient，因为它不支持进度报告。

使用HttpClient的最简单方式是创建一个实例，然后使用一个URI调用其Get*方法：
```csharp
var html = await new HttpClient().GetStringAsync("http://www.baidu.com");
```
（除上述方法外，还有GetByteArrayAsync和GetStreamAsync方法。）HttpClient的所有I/O相关方法都是异步的（且没有同步版本）。
与WebClient不同，若想获得HttpClient的最佳性能，必须重用相同的实例(否则，诸如DNS解析等操作会不必要地重复执行)。HttpClient本身支持并发操作，因此可以像以下代码这样同时下载两个网页：
```csharp
var client = new HttpClient();
var task = client.GetStringAsync("http://www.baidu.com");
var task2 = client.GetStringAsync("http://www.baidu.com");

Console.WriteLine(await task);
Console.WriteLine(await task2);
```
HttpClient包含Timeout属性和BaseAddress属性（它会为每一个请求添加URI前缀）。HttpClient在一定程度上就是一层简单外壳：而大多数属性都定义在HttpClientHandler类中。若要访问该类，可以先创建一个实例，而后将其传递给HttpClient的构造器：
```csharp
var handler = new HttpClientHandler
{
    UseProxy = false // 禁用代理支持
};

var client = new HttpClient(handler);
```
上述示例中的处理器禁用了代理支持。此外，还有专门控制cookie、自动重定向、身份验证等功能的属性。

#### GetAsync方法与响应
GetStringAsync、GetByteArrayAsync和GetStreamAsync方法比通用方法Get-Async的操作更便捷，GetAsync会返回一个响应消息：
```csharp
var client = new HttpClient();
HttpResponseMessage response = await client.GetAsync("http://www.baidu.com");
response.EnsureSuccessStatusCode();//不写的只会返回失败的状态码，而不会抛出异常
var html = await response.Content.ReadAsStringAsync();
```
HttpResponseMessage具有一系列访问头部信息的属性（请参见16.5节）和HTTP StatusCode属性。

HttpContent类的CopyToAsync方法可将内容数据写入到另一个流中。例如，将输出写到一个文件中：
```csharp
var client = new HttpClient();
HttpResponseMessage response = await client.GetAsync("http://www.baidu.com");
response.EnsureSuccessStatusCode();//不写的只会返回失败的状态码，而不会抛出异常
using (var firlStream = File.Create("test.html"))
{
    await response.Content.CopyToAsync(firlStream);
}
```
GetAsync是与四种HTTP动词相关的方法之一（其他的方法为PostAsync、Put-Async、DeleteAsync）

#### SendAsync方法与请求消息
前面的四个方法都是对SendAsync的快捷调用，而SendAsync才是可以满足各种需求的底层方法。要使用该方法首先必须创建HttpRequestMessage对象
```csharp
var client = new HttpClient();
var request = new HttpRequestMessage(HttpMethod.Get, "http://www.baidu.com");
HttpResponseMessage response = await client.SendAsync(request);
response.EnsureSuccessStatusCode();
```
实例化HttpRequestMessage对象时可以自定义请求的属性，例如头部信息和上传数据的内容。

#### 上传数据和HttpContext
在实例化HttpRequestMessage对象后，可以设置其Content属性指定上传的内容。这个属性的类型是抽象类HttpContent。Framework提供了以下几种内容子类（当然我们也可以实现自定义内容类型）：

- ByteArrayContent
- StringContent
- FormUrlEncodedContent
- StreamContent
```csharp
var client = new HttpClient(new HttpClientHandler { UseProxy = false });
var request = new HttpRequestMessage(HttpMethod.Post, "www.baidu.com");
request.Content = new StringContent("test");
HttpResponseMessage response = await client.SendAsync(request);
response.EnsureSuccessStatusCode();
Console.WriteLine(await response.Content.ReadAsStringAsync());
```

#### HttpMessageHandler类
大多数自定义的请求属性都是在HttpClientHandler中，而不是在HttpClient中定义的。而HttpClientHandler实际上是抽象类HttpMessage-Handler的子类。HttpMessageHandler的定义如下：
```csharp
public abstract class HttpMessageHandler : IDisposable
{

	protected HttpMessageHandler()
	{
	}

	public void Dispose()
	{
	}
	
	protected virtual void Dispose(bool disposing)
	{
	}

	protected internal virtual HttpResponseMessage Send(HttpRequestMessage request, CancellationToken cancellationToken)
	{
		throw null;
	}

	protected internal abstract Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken);
}
```
其中HttpClient的SendAsync方法会调用HttpMessageHandler的SendAsync方法。
使用场景：通过创建HttpMessageHandler子类这种方法扩展HttpClient的功能。

### 代理
代理服务器是一个负责转发HTTP和FTP请求的中间服务器。有时，一些组织会搭建一个代理服务器来作为员工访问Internet的唯一方式（主要是为了简化安全性）。

我们可以使用WebProxy对象，令WebClient或者WebRequest对象通过代理服务器转发请求：
```csharp
WebProxy p = new WebProxy("192.178.10.49", 808);
p.Credentials = new NetworkCredential("username", "pwssword");
WebClient WebClient = new WebClient();
WebClient.Proxy = p;
```
如果需要使用HttpClient访问代理，那么首先需要创建一个HttpClientHandler，设置其Proxy属性，然后将它传递给HttpClient的构造器：
```csharp
WebProxy p = new WebProxy("192.178.10.49", 808);
p.Credentials = new NetworkCredential("username", "pwssword");

var handler = new HttpClientHandler { Proxy = p };
var client = new HttpClient(handler);

```
> 注意：如果不使用代理，则务必将WebClient和WebRequest的**Proxy**属性设置为null。否则，Framework可能会尝试自动检查代理设置，而这可能会令请求额外增加多达30秒钟的延迟。

将HttpClientHandler的UserProxy属性设置为false就可以清空Proxy属性，即禁止自动检查代理设置。

### 身份验证
若HTTP或FTP站点需要用户名和密码，则可以创建一个NetworkCredential对象，并将其赋给WebClient或者WebRequest的Credentials属性，HttpClient也通过HttpClientHandler提供了Credentials属性：
```csharp
var handler = new HttpClientHandler {
    Credentials = new NetworkCredential("username", "pwsswork");
};
var client = new HttpClient(handler);
```
这种方法适用于基于对话框的身份验证协议，如Basic和Digest
> 使用表单进行身份验证时无须设置Credentials属性


#### 使用HttpClient进行头部信息身份验证
如果使用HttpClient，则可以直接设置验证头信息来实现身份验证：
```csharp
var client = new HttpClient();
client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic",
    Convert.ToBase64String(Encoding.UTF8.GetBytes("username:pwssawor")));
```
这个方法同样适用于自定义身份验证系统，如OAuth.

### 异常处理
WebRequest、WebResponse、WebClient及它们包装的流都会在发生网络或协议错误时抛出WebException。HttpClient也会抛出异常，但是它会将WebException包装为HttpRequestException。我们可以从WebException的Status属性中确定具体的错误类型。

在HttpClient中，只有在响应对象上调用EnsureSuccessStatusCode时才会抛出异常。在执行该操作之前查询StatusCode属性，就可以获得特定的状态代码。
> 若希望获得三个数字表示的状态码，如401或者404，则可以直接将Http-StatusCode或FtpStatusCode枚举值转换为整数。

默认情况下，WebClient和WebRequest会自动产生重定向响应，因此响应中是不会出现重定向错误的。若将AllowAutoRedirect设置为false，就可以在WebRequest对象中关闭这个行为。

## 使用HTTP
[https://weread.qq.com/web/reader/710327c0718f6368710b285k82a32a302a282aa4b0af8ce](https://weread.qq.com/web/reader/710327c0718f6368710b285k82a32a302a282aa4b0af8ce)
