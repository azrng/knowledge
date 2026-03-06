---
title: cookie
lang: zh-CN
date: 2021-02-17
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: cookie
slug: mpbt47
docsId: '31541513'
---
写入cookie
**HttpCookie cookie=new HttpCookie("MyCook");//初使化并设置Cookie的名称**
**DateTime dt=DateTime.Now;**
**TimeSpan ts = new TimeSpan(0, 0, 1,0,0);//过期时间为1分钟**
**cookie.Expires = dt.Add(ts);//设置过期时间**
**cookie.Values.Add("userid", "userid_value");**
**cookie.Values.Add("userid2","userid2_value2");**
**Response.AppendCookie(cookie); **
**还有一种添加cookie的方法**
   HttpCookie cookie = new HttpCookie("cookieToken", token);
 HttpContext.Current.Response.Cookies.Add(cookie);
  取值：string c = Request.Cookies["cookieToken"].Value.ToString();
 
 
```csharp
//输出该Cookie的所有内容
//Response.Write(cookie.Value);//输出为：userid=userid_value&userid2=userid2_value2 
读取cookie
if (Request.Cookies["MyCook"]!=null)
{
//Response.Write("Cookie中键值为userid的值:" + Request.Cookies["MyCook"]["userid"]);//整行
//Response.Write("Cookie中键值为userid2的值" + Request.Cookies["MyCook"]["userid2"]);
Response.Write(Request.Cookies["MyCook"].Value);//输出全部的值
}
修改cookie
//获取客户端的Cookie对象
HttpCookie cok = Request.Cookies["MyCook"];
        
if (cok != null)
{
//修改Cookie的两种方法
cok.Values["userid"] = "alter-value";
cok.Values.Set("userid", "alter-value");
 
//往Cookie里加入新的内容
cok.Values.Set("newid", "newValue");
Response.AppendCookie(cok);
}      
删除cookie
HttpCookie cok = Request.Cookies["MyCook"];
if (cok != null)
{
if (!CheckBox1.Checked)
{
 cok.Values.Remove("userid");//移除键值为userid的值　　　　　　
}else{　　　　　　　　
TimeSpan ts = new TimeSpan(-1, 0, 0, 0);　　　　　　　　
cok.Expires = DateTime.Now.Add(ts);//删除整个Cookie，只要把过期时间设置为现在　　　　　　
}　　　　　　
Response.AppendCookie(cok);　　　　
}
```
 
 
如果有时候碰到一个cookie咋删都删除不了，可以使用下面这种
foreach (string cookiename in Request.Cookies.AllKeys)
            {
                HttpCookie cookies = Request.Cookies[cookiename];
                if (cookies != null)
                {
                    cookies.Expires = DateTime.Today.AddDays(-1);
                   Response.Cookies.Add(cookies);
                   Request.Cookies.Remove(cookiename);
                }
            }   
 
 
cookie的值为中文时候,取cookie的值会出现乱码
解决办法:存取cookie时候先解码和编码
存cookie,进行编码 :cookie.Value = HttpUtility.UrlEncode("上海");//加密
取cookie时候,进行解码: cookieValue = HttpUtility.UrlDecode(cookie.Value);//解密
 
 
 
js存储cookie 
 
 
 
 
