---
title: 说明
lang: zh-CN
date: 2023-09-13
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: gaishu
slug: hddpku
docsId: '32029873'
---

## 概述
抓取数据的主要思路就是分析目标网站的页面逻辑，利用xpath、正则表达式等知识去解析网页拿到我们想要的数据，通过引用nuget组件然后实现通过jq获取指定的元素。 

## 组件介绍
HtmlAgilityPack、AngleSharp、PuppeteerSharp，前两个可以处理传统的页面，无法抓取单页应用，如果需要抓取单页应用可以使用PuppeteerSharp。

## 概念

### 分布式爬虫
分布式爬虫通常需要两个端：

- 控制端
- 爬虫端

控制端主要负责控制爬虫运行、监控爬虫状态、配置爬虫抓取方式等。爬虫端主的功能就是抓取数据并将数据提交给数据清洗服务。

爬虫端还需要分出Master爬虫及Worker爬虫，Master爬虫主要利用简单爬虫的运行方式实现高性能的超连接（Links）的抓取。Worker爬虫则利用高级爬虫特性来采集精细化的数据，例如Ajax加载的内容。把最擅长的事情交给最合适的爬虫来做。

Master爬虫只需要将抓取的Links扔进数据抓取队列。Worker爬虫通过定时拉去队列中的Links来实现数据抓取，抓取完成后将数据再提交至数据清洗队列。

## 规范代码格式
定义三个事件
```csharp
/// <summary>
/// 爬虫启动事件
/// </summary>
public class OnStartEventArgs
{
    /// <summary>
    /// 爬虫URL地址
    /// </summary>
    public Uri Uri { get; }

    public OnStartEventArgs(Uri uri)
    {
        this.Uri = uri;
    }
}

/// <summary>
/// 爬虫完成事件
/// </summary>
public class OnCompletedEventArgs
{
    /// <summary>
    /// 爬虫URL地址
    /// </summary>
    public Uri Uri { get; }

    /// <summary>
    /// 任务线程ID
    /// </summary>
    public int ThreadId { get; }

    /// <summary>
    /// 页面源代码
    /// </summary>
    public string PageSource { get; }

    /// <summary>
    ///  爬虫请求执行事件
    /// </summary>
    public long Milliseconds { get; }

    public OnCompletedEventArgs(Uri uri, int threadId, long milliseconds, string pageSource)
    {
        Uri = uri;
        ThreadId = threadId;
        Milliseconds = milliseconds;
        PageSource = pageSource;
    }
}

/// <summary>
/// 爬虫出错事件
/// </summary>
public class OnErrorEventArgs
{
    public Uri Uri { get; }

    public Exception Exception { get; }

    public OnErrorEventArgs(Uri uri, Exception exception)
    {
        this.Uri = uri;
        this.Exception = exception;
    }
}
```
定义爬虫接口
```csharp
public interface ICrawler
{
    /// <summary>
    /// 爬虫启动事件
    /// </summary>
    event EventHandler<OnStartEventArgs> OnStart;

    /// <summary>
    /// 爬虫完成事件
    /// </summary>
    event EventHandler<OnCompletedEventArgs> OnCompleted;

    /// <summary>
    /// 爬虫出错事件
    /// </summary>
    event EventHandler<OnErrorEventArgs> OnError;

    /// <summary>
    /// 异步爬虫
    /// </summary>
    /// <param name="uri"></param>
    /// <param name="proxy"></param>
    /// <returns></returns>
    Task<string> Start(Uri uri, string proxy);
}
```
用StrongCrawler类继承接口并实现接口
```csharp
public class SimpleCrawler : ICrawler
{
    public event EventHandler<OnStartEventArgs> OnStart;//爬虫启动事件

    public event EventHandler<OnCompletedEventArgs> OnCompleted;//爬虫完成事件

    public event EventHandler<OnErrorEventArgs> OnError;//爬虫出错事件

    public CookieContainer CookiesContainer { get; set; }//定义Cookie容器

    /// <summary>
    /// 异步创建爬虫
    /// </summary>
    /// <param name="uri">爬虫URL地址</param>
    /// <param name="proxy">代理服务器</param>
    /// <returns>网页源代码</returns>
    public async Task<string> Start(Uri uri, string proxy = null)
    {
        return await Task.Run(() =>
        {
            var pageSource = string.Empty;
            try
            {
                OnStart?.Invoke(this, new OnStartEventArgs(uri));

                //xxx

                OnCompleted?.Invoke(this, new OnCompletedEventArgs(uri, threadId: 1, milliseconds: 10, pageSource));
            }
            catch (Exception ex)
            {
                OnError?.Invoke(this, new OnErrorEventArgs(uri, ex));
            }
            return pageSource;
        });
    }
}
```
执行爬虫示例
```csharp
var cityUrl = "http://hotels.ctrip.com/citylist";//定义爬虫入口URL
var cityList = new List<City>();//定义泛型列表存放城市名称及对应的酒店URL
var cityCrawler = new SimpleCrawler();//调用刚才写的爬虫程序
cityCrawler.OnStart += (s, e) =>
{
    Console.WriteLine("爬虫开始抓取地址：" + e.Uri.ToString());
};
cityCrawler.OnError += (s, e) =>
{
    Console.WriteLine("爬虫抓取出现错误：" + e.Uri.ToString() + "，异常消息：" + e.Exception.Message);
};
cityCrawler.OnCompleted += (s, e) =>
{
    //使用正则表达式清洗网页源代码中的数据
    var links = Regex.Matches(e.PageSource, @"<a[^>]+href=""*(?<href>/hotel/[^>\s]+)""\s*[^>]*>(?<text>(?!.*img).*?)</a>", RegexOptions.IgnoreCase);
    foreach (Match match in links)
    {
        var city = new City
        {
            CityName = match.Groups["text"].Value,
            Uri = new Uri("http://hotels.ctrip.com" + match.Groups["href"].Value
        )
        };
        if (!cityList.Contains(city)) cityList.Add(city);//将数据加入到泛型列表
        Console.WriteLine(city.CityName + "|" + city.Uri);//将城市名称及URL显示到控制台
    }
    Console.WriteLine("===============================================");
    Console.WriteLine("爬虫抓取任务完成！合计 " + links.Count + " 个城市。");
    Console.WriteLine("耗时：" + e.Milliseconds + "毫秒");
    Console.WriteLine("线程：" + e.ThreadId);
    Console.WriteLine("地址：" + e.Uri.ToString());
};
cityCrawler.Start(new Uri(cityUrl)).Wait();//没被封锁就别使用代理：60.221.50.118:8090
```

## 资料
[https://mp.weixin.qq.com/s/Wv6tXDzSfhJ1KVxxepbFuQ](https://mp.weixin.qq.com/s/Wv6tXDzSfhJ1KVxxepbFuQ) | 基于C#.NET的高端智能化网络爬虫
[https://github.com/microfisher/Simple-Web-Crawler](https://github.com/microfisher/Simple-Web-Crawler) | 基于C#.NET的简单网页爬虫，支持异步并发、设置代理、操作Cookie、Gzip页面加速。
[https://mp.weixin.qq.com/s/ZSxlojsMOoXQ7ZtMktEs8A](https://mp.weixin.qq.com/s/ZSxlojsMOoXQ7ZtMktEs8A) | 用C#+Selenium+ChromeDriver 爬取网页，完美模拟真实的用户浏览行为
[https://mp.weixin.qq.com/s/nyhIMInHZa1yOrwJu1lImg](https://mp.weixin.qq.com/s/nyhIMInHZa1yOrwJu1lImg) | C#爬虫-Selenium ChromeDriver 设置代理
爬虫 ：[https://github.com/bouxinLou/company-crawler](https://github.com/bouxinLou/company-crawler)
代理池 [https://github.com/jhao104/proxy_pool](https://github.com/jhao104/proxy_pool)
