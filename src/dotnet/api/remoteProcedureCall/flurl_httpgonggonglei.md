---
title: Flurl.Http公共类
lang: zh-CN
date: 2023-04-20
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: flurl_httpgonggonglei
slug: sy5u8h
docsId: '70049539'
---
需要将下面文档稍作修改
```csharp
/// <summary>
/// 网络请求帮助类
/// </summary>
public static class HttpHelper
{
/// <summary>
/// Get
/// </summary>
/// <typeparam name="T"></typeparam>
/// <param name="url"></param>
/// <param name="headers">请求头</param>
/// <returns></returns>
public static async Task<T> HttpGetAsync<T>(string url, Dictionary<string, string> headers) where T : YuQueResult
{
    var response = await url
        .WithHeaders(headers)
        .GetAsync().ReceiveJson<T>().ConfigureAwait(false);
    if (response.Status == 0)
        response.IsSuccess = true;
    return response;
}

/// <summary>
/// Post
/// </summary>
/// <typeparam name="T"></typeparam>
/// <param name="url"></param>
/// <param name="postData">参数</param>
/// <param name="headers">请求头</param>
/// <returns></returns>
public static async Task<T> HttpPostAsync<T>(string url, object postData, Dictionary<string, string> headers) where T : YuQueResult
{
    if (postData is null)
        throw new ArgumentNullException(nameof(postData));

    var response = await url
        .WithHeaders(headers)
        .PostJsonAsync(postData)
        .ReceiveJson<T>()
        .ConfigureAwait(false);
    if (response.Status == 0)
        response.IsSuccess = true;
    return response;
}

/// <summary>
/// Put
/// </summary>
/// <typeparam name="T"></typeparam>
/// <param name="url"></param>
/// <param name="postData"></param>
/// <param name="headers">请求头</param>
/// <returns></returns>
public static async Task<T> HttpPutAsync<T>(string url, object postData, Dictionary<string, string> headers) where T : YuQueResult
{
    if (postData is null)
        throw new ArgumentNullException(nameof(postData));

    var response = await url
        .WithHeaders(headers)
        .PutJsonAsync(postData)
        .ReceiveJson<T>()
        .ConfigureAwait(false);
    if (response.Status == 0)
        response.IsSuccess = true;
    return response;
}

/// <summary>
/// DeleteA
/// </summary>
/// <typeparam name="T"></typeparam>
/// <param name="url"></param>
/// <param name="headers">请求头</param>
/// <returns></returns>
public static async Task<T> HttpDeleteAsync<T>(string url, Dictionary<string, string> headers) where T : YuQueResult
{
    var response = await url
        .WithHeaders(headers)
        .DeleteAsync()
        .ReceiveJson<T>()
        .ConfigureAwait(false);
    if (response.Status == 0)
        response.IsSuccess = true;
    return response;
}

/// <summary>
/// get请求
/// </summary>
/// <param name="url">请求地址</param>
/// <param name="token">语雀个人设置的token</param>
/// <param name="userAgent">语雀需要收集的用户标识</param>
/// <returns>请求到的数据</returns>
public static string HttpGet(string url, string token, string userAgent = "netCoreSdk")
{
    HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);

    request.Headers.Add("User-Agent", HttpUtility.UrlEncode(userAgent));
    request.Headers.Add("X-Auth-Token", HttpUtility.UrlEncode(token));

    using HttpWebResponse response = (HttpWebResponse)request.GetResponse();
    using StreamReader reader = new StreamReader(response.GetResponseStream(), Encoding.UTF8);

    return reader.ReadToEnd();
}

/// <summary>
/// get请求
/// </summary>
/// <param name="url">请求地址</param>
/// <param name="token">语雀个人设置的token</param>
/// <param name="userAgent">语雀需要收集的用户标识</param>
/// <returns>请求到的数据</returns>
public static async Task<string> HttpGetAsync(string url, string token, string userAgent = "netCoreSdk")
{
    HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);

    request.Headers.Add("User-Agent", HttpUtility.UrlEncode(userAgent));
    request.Headers.Add("X-Auth-Token", HttpUtility.UrlEncode(token));

    using HttpWebResponse response = (HttpWebResponse)request.GetResponse();
    using StreamReader reader = new StreamReader(response.GetResponseStream(), Encoding.UTF8);

    return await reader.ReadToEndAsync();
}
}
```
