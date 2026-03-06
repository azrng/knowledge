---
title: URL
lang: zh-CN
date: 2023-08-19
publish: true
author: azrng
isOriginal: true
category:
  - web
tag:
  - 无
filename: url
slug: cznxoo
docsId: '29633835'
---

## 属性介绍
假设当前页完整地址是：[http://www.test.com/aaa/bbb.aspx?id=5&name=kelli](http://www.test.com/aaa/bbb.aspx?id=5&name=kelli)
"http://"是协议名
"[www.test.com](http://www.test.com)"是域名
"aaa"是站点名
"bbb.aspx"是页面名（文件名）
"id=5&name=kelli"是参数
【1】获取 完整url （协议名+域名+站点名+文件名+参数）
string url=Request.Url.ToString();
url= [http://www.test.com/aaa/bbb.aspx?id=5&name=kelli](http://www.test.com/aaa/bbb.aspx?id=5&name=kelli)
【2】获取 站点名+页面名+参数：
string url=Request.RawUrl;
(或 string url=Request.Url.PathAndQuery;)
url= /aaa/bbb.aspx?id=5&name=kelli
【3】获取 站点名+页面名：
string url=HttpContext.Current.Request.Url.AbsolutePath;
(或 string url= HttpContext.Current.Request.Path;)
url= aaa/bbb.aspx
【4】获取 域名：
string url=HttpContext.Current.Request.Url.Host;
url= [www.test.com](http://www.test.com)
【5】获取 参数：
string url= HttpContext.Current.Request.Url.Query;
url= ?id=5&name=kelli


## 编码与解码
```
编码：HttpUtility.UrlEncode
解码：HttpUtility.UrlDecode
```

自动解码：
```
public static string MyUrlDeCode(string str, Encoding encoding)
{
    if (encoding == null)
    {
        Encoding utf8 = Encoding.UTF8;
        //首先用utf-8进行解码                   
        string code = HttpUtility.UrlDecode(str.ToUpper(), utf8);
        //将已经解码的字符再次进行编码.
        string encode = HttpUtility.UrlEncode(code, utf8).ToUpper();
        if (str == encode)
            encoding = Encoding.UTF8;
        else
            encoding = Encoding.GetEncoding("gb2312");
    }
    return HttpUtility.UrlDecode(str, encoding);
}
```
 
[https://blog.csdn.net/zhongzhengfeng/article/details/3236551](https://blog.csdn.net/zhongzhengfeng/article/details/3236551)
 
编码解码在线工具
[http://www.mxcz.net/tools/Url.aspx](http://www.mxcz.net/tools/Url.aspx)
