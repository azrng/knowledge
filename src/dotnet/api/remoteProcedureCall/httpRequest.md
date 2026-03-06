---
title: .Net内置HTTP请求库
lang: zh-CN
date: 2023-10-27
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - http
---

## 前言

.Net调用RestAPI时候通常有三种选择，分别为：`WebClient, HttpWebRequest，HttpClient`

- `HttpWebRequest` 是一种相对底层的处理 Http request/response 的方式。
- `WebClient` 提供了对 HttpWebRequest 的高层封装，来简化使用者的调用。
- `HttpClient` 是一种新的处理 Http request/response 工具包，具有更高的性能。

## 表单提交

表单有 x-www-form-urlencoded、form-data 两种请求类型。`form-data` 兼容 `x-www-form-urlencoded`，并且可以用于上传文件，而 `x-www-form-urlencoded` 只能传递字符串键值对。由于 `x-www-form-urlencoded` 性能比 `form-data` 高一些，所以不需要上传文件时，使用 `x-www-form-urlencoded` 比较好。

原生

## HttpWebRequest(不推荐)

:::tip

.NetCore中不使用该方法

:::

WebRequest 是一种基于特定的 http 实现, 它是一个抽象类, 所以在处理 Reqeust 请求时底层会根据传进来的 url 生成相应的子类，如：HttpWebRequest 或 FileWebRequest ，下面的代码展示了如何使用 WebRequest。

```csharp
WebRequest webRequest = WebRequest.Create(uri);
webRequest.Credentials = CredentialCache.DefaultCredentials;
webRequest.Method ="GET";
HttpWebResponse webResponse = (HttpWebResponse)webRequest.GetResponse();
```

WebRequest 是 .NET Framework 中第一个用来处理 Http 请求的类，在处理 `Http请求和响应` 方面给调用者提供了诸多的灵活性，你还可以使用这个类来存取 headers, cookies, protocols 和 timeouts 等等，下面的代码展示了其实现子类 HttpWebRequest 是如何使用的。

```csharp
HttpWebRequest http = HttpWebRequest)WebRequest.Create(“http://localhost:8900/api/default”);
WebResponse response = http.GetResponse();
MemoryStream memoryStream = response.GetResponseStream();
StreamReader streamReader = new StreamReader(memoryStream);
string data = streamReader.ReadToEnd();
```

## WebClient(不推荐)

:::tip

.NetCore中不使用该方法

:::

老版本的 .NET 由于没有方便的 HttpClient 存在，所以只能使用 WebClient 或借助第三方包进行 Web API 的调用。WebClient 是 HttpWebRequest 的高层封装，它给调用者提供了更便捷的使用方式，理所当然做出的牺牲就是 WebClient 的性能略逊于 HttpWebRequest，如果你的业务场景只是简单访问第三方的 Http Service，那么我建议你使用 WebClient ，同理如果你有更多的精细化配置则使用 HttpWebRequest

```csharp
string data = null;

using (var webClient = new WebClient())
{
    data = webClient.DownloadString(url);
}
```

### Get

```c#
using (var client = new WebClient())
{
    client.Headers[HttpRequestHeaders.Accept] = "application/json";
    string result = client.DownloadString("http://example.com/values");
    // now use a JSON parser to parse the resulting string back to some CLR object
    var todo = JsonConvert.DeserializeObject<Todo>(result);
}
```

### Put

```c#
string data = JsonConvert.SerializeObject(record);
try
{
    // 好像是因为官方 Headers 设置存在问题，所以没法把 Content-Type 和 Accept 放在一起初始化
    client.Headers["Content-Type"] = "application/json";
    client.UploadString("http://example.com/values", WebRequestMethods.Http.Put, data);
}
catch (WebException ex)
{
    Logger.Error(ex, $"PUT failed data: {data}");
    throw;
}
```

### Post

```c#
using (var client = new WebClient())
{
    client.Headers[HttpRequestHeader.ContentType] = "application/json";
    client.Headers[HttpRequestHeader.Accept] = "application/json";
    var data = Encoding.UTF8.GetBytes("{\"foo\":\"bar\"}");
    byte[] result = client.UploadData("http://example.com/values", "POST", data);
    string resultContent = Encoding.UTF8.GetString(result, 0, result.Length);        
    // now use a JSON parser to parse the resulting string back to some CLR object 
    var content = JsonConvert.DeserializeObject<Content>(resultContent);
}
```

### 下载内容

方式一

```c#
WebRequest wreq = WebRequest.Create("http://files.jb51.net/file_images/article/201205/logo.gif");
HttpWebResponse wresp = (HttpWebResponse)wreq.GetResponse();
Stream s = wresp.GetResponseStream();
System.Drawing.Image img;
img = System.Drawing.Image.FromStream(s);
//保存文件
img.Save("D:\\aa.gif", ImageFormat.Gif);
// 输出文件
MemoryStream ms = new MemoryStream();
img.Save(ms, ImageFormat.Gif);
img.Dispose();
Response.ClearContent();
Response.ContentType = "image/gif";
Response.BinaryWrite(ms.ToArray());
```

方式二

```c#
WebClient my = new WebClient();
byte[] mybyte;
mybyte = my.DownloadData("http://files.jb51.net/file_images/article/201205/logo.gif");
MemoryStream ms = new MemoryStream(mybyte);
System.Drawing.Image img;
img = System.Drawing.Image.FromStream(ms);
//保存
img.Save("D:\\a.gif", ImageFormat.Gif);
//下面直接输出
Response.ClearContent();
Response.ContentType = "image/gif";
Response.BinaryWrite(mybyte);
如果是真实的图片地址直接该方法进行保存
my.DownloadFile("http://files.jb51.net/file_images/article/201205/logo.gif", "D:\\a.gif");
```

## HttpClient

HttpClient 是在 .NET Framework 4.5 中被引入的，如果你的项目是基于 .NET 4.5 以上版本，除一些特定的原因之外，建议你优先使用 HttpClient，本质上来说，HttpClient 作为后来之物，它吸取了 HttpWebRequest 的灵活性及 WebClient 的便捷性。

HttpWebRequest 在 `request/response` 对象上提供了非常精细化的配置，同时你也要注意 HttpClient 的出现并不是为了取代 WebClient，言外之意就是 HttpClient 也有缺点，比如说：不能提供 `进度处理` 和 `URI 定制`，不支持 FTP 等等，HttpClient 的优点也有很多，它所有关于 IO 操作的方法都是异步的，当然有特殊原因的话也可以使用同步方式

```csharp
private readonly HttpClient _client;

public WeatherForecastController(IHttpClientFactory httpClientFactory)
{
    _client = httpClientFactory.CreateClient();
}

[HttpGet]
public async Task<string> GetAuthorsAsync()
{
    HttpResponseMessage response = await _client.GetAsync("https://www.baidu.com/");
    response.EnsureSuccessStatusCode();//response异常时候默认情况下不会抛出异常，通过改变该配置就可以
    if (response.IsSuccessStatusCode)
    {
        return await response.Content.ReadAsStringAsync();
    }
    return default;
}
```

推荐的做法是保持 HttpClient 的单例化，如果不这么做的话，每次 Request 请求实例化一次 HttpClient ，那么大量的请求必将你的 socket 耗尽并抛出 `SocketException` 异常。NetCore中通过注入HttpClientFactory来创建HttpClient