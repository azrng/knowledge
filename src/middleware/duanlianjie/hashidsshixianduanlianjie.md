---
title: Hashids实现短连接
lang: zh-CN
date: 2022-03-18
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: hashidsshixianduanlianjie
slug: vtf24n
docsId: '64717726'
---

## 原理
短链接，顾名思义就是在形式上比较短的链接网址。借助短链接，可以用简短的网址替代原来冗长的网址
整个短链接服务的实现原理如下：

1. 用户访问短链接，请求到达服务器;
2. 服务器将短链接转换成为长链接，然后给浏览器返回重定向的状态码302;
3. 浏览器拿到重定向的状态码，以及真正需要访问的地址，重定向到真正的长链接上。

## 实现
创建一个Web API项目，用于实现短链接服务。
首先，实现生成短链接接口：
```csharp
[HttpPost("shorten")]
public string ShortenUrl([FromBody]string url)
{
    var id = db.Insert(url);
    var hashids = new Hashids("公众号My IO", minHashLength: 6);
    return hashids.Encode(id);
}
```
将长链接保存到数据库，然后将数据Id加密成字符串返回。然后，实现短链接跳转接口：
```csharp
[HttpGet("{shortUrl}")]
public IActionResult GetUrl(string shortUrl)
{
    var hashids = new Hashids("公众号My IO", minHashLength: 6);
    var id = hashids.Decode(shortUrl)[0];
        
    var urlData = db.Get(id);

    return Redirect(urlData.Url);
}
```
将短链接解码成数据Id，然后到数据库查到对应长链接。最后返回跳转状态码。

## 总结
通过hashids.net，我们使用ASP.NET Core Web API实现了短链接服务。
