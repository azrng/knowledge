---
title: IP处理
lang: zh-CN
date: 2022-04-05
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: ipchuli
slug: iz0uxd
docsId: '60842410'
---

## IPAddressRange
通过引用nuget包IPAddressRange来处理判断一个ip是否在一个ip区域内
```csharp
// rangeA.Begin is "192.168.0.0", and rangeA.End is "192.168.0.255".
var rangeA = IPAddressRange.Parse("192.168.0.0/255.255.255.0");
rangeA.Contains(IPAddress.Parse("192.168.0.34")); // is True.
rangeA.Contains(IPAddress.Parse("192.168.10.1")); // is False.
rangeA.ToCidrString(); // is 192.168.0.0/24

// rangeB.Begin is "192.168.0.10", and rangeB.End is "192.168.10.20".
var rangeB1 = IPAddressRange.Parse("192.168.0.10 - 192.168.10.20");
rangeB1.Contains(IPAddress.Parse("192.168.3.45")); // is True.
rangeB1.Contains(IPAddress.Parse("192.168.0.9")); // is False.

// 支持快捷范围描述。
// ("192.168.10.10-20" means range of begin:192.168.10.10 to end:192.168.10.20.)
var rangeB2 = IPAddressRange.Parse("192.168.10.10-20");

// 支持CIDR表达式和IPv6。
var rangeC = IPAddressRange.Parse("fe80::/10");
rangeC.Contains(IPAddress.Parse("fe80::d503:4ee:3882:c586%3")); // is True.
rangeC.Contains(IPAddress.Parse("::1")); // is False.
```

## Ip转Long
公共扩展类
```csharp
/// <summary>
/// ip地址扩展类
/// </summary>
public static class IpAddressExtensions
{
    /// <summary>
    /// ip地址转整型数据
    /// </summary>
    /// <param name="ip">ip地址</param>
    /// <returns></returns>
    public static long IpConvertLong(this string ip)
    {
        string[] items = ip.Split('.');
        return long.Parse(items[0]) << 24
        | long.Parse(items[1]) << 16
        | long.Parse(items[2]) << 8
        | long.Parse(items[3]);
    }

    /// <summary>
    /// 整型数据转ip地址
    /// </summary>
    /// <param name="ipLong">ip整形</param>
    /// <returns></returns>
    public static string LongConvertIp(this long ipLong)
    {
        StringBuilder sb = new();
        sb.Append((ipLong >> 24) & 0xFF).Append('.');
        sb.Append((ipLong >> 16) & 0xFF).Append('.');
        sb.Append((ipLong >> 8) & 0xFF).Append('.');
        sb.Append(ipLong & 0xFF);
        return sb.ToString();
    }
}
```
使用
```csharp
var longIp = "192.168.1.70".IpConvertLong();
var originIp = longIp.LongConvertIp();
```
使用场景：可以ip段查询使用，比如我们有一个用户表保存有登录的ip，我们需要查询在某一个ip段内的数据，那么我们在存储用户ip的时候，我们可以将用户ip转long后的数据也存储起来，然后我们将用户输入的ip段进行转long，然后直接进行long大小值比较。

### IP网段校验
校验IP前三位必须一样并且起始IP要小于结束IP
```csharp
var startIp = "192.168.1.70";
var endIp = "192.168.1.60";
var startIpPosition = startIp.LastIndexOf(".", StringComparison.Ordinal);
var endIpPosition = endIp.LastIndexOf(".", StringComparison.Ordinal);
//验证前三段一致
if (startIp[..startIpPosition] != endIp[..endIpPosition])
    throw new Exception("不在同一个网段中");
var statrIpLastNum =
    Convert.ToInt32(startIp.Substring(startIpPosition + 1, startIp.Length - 1 - startIpPosition));
var endIpLastNum =
    Convert.ToInt32(endIp.Substring(endIpPosition + 1, endIp.Length - 1 - endIpPosition));
var verifyRange = statrIpLastNum is > 0 and <= 255 && endIpLastNum is > 0 and <= 255 && statrIpLastNum <= endIpLastNum;
if (!verifyRange)
    throw new Exception("起始IP必须小于结束IP");
```
