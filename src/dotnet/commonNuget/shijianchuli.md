---
title: 时间处理
lang: zh-CN
date: 2023-09-24
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: shijianchuli
slug: vidu33
docsId: '78944849'
---

## 引言
Linux和Windows两者所采用的时区不同，两者的时区分别为：Linux：IANA，Windows:Windows time zone IDs。为了让两者采用同一个时区，最终统一采用IANA。

## NodaTime
Noda Time 是一个日期和时间 API，可替代 .NET 中内置的 DateTime/DateTimeOffset 等类型。

使用场景：比如你部署到linux上的时候，发现DateTime.New获取到的时间和windows时间不一致，获取到的时间比系统时间早了8个小时，原因就是linux和windows两者采用的时区不同，两者的时区分别为：Linux：IANA，Windows:Windows time zone IDs，这个时候就需要使用该软件来实现采用同一个时区

### 操作
引用组件
```sql
<PackageReference Include="NodaTime" Version="3.1.0" />
```
获取时间
```csharp
public static class DataTimeExtensions
{
    /// <summary>
    /// 转上海所在时区时间
    /// </summary>
    /// <param name="datetime"></param>
    /// <returns></returns>
    public static DateTime ToCstDateTime(this DateTime datetime)
    {
        var now = SystemClock.Instance.GetCurrentInstant();
        var shanghaiZone = DateTimeZoneProviders.Tzdb["Asia/Shanghai"];
        return now.InZone(shanghaiZone).ToDateTimeUnspecified();
    }
}
```

## TimeZoneConverter

:::tip

.NET 6 以跨平台方式内置了对 IANA 和 Windows 时区的支持，这在一定程度上减少了对此库的需求

:::

TimeZoneConverter 是一个轻量级库，可在 IANA、Windows 和 Rails 时区名称之间快速转换。

地址：https://github.com/mattjohnsonpint/TimeZoneConverter

## Lunar

Lunar 是一个支持阳历、阴历、佛历以及道历的日历工具库，开源且免费, 有多种开发语言的版本，并且不依赖第三方，支持了阳历、阴历、佛历、道历、儒略日的相互转换。
另外还支持星座、干支、生肖、节气、节日、彭祖百忌、吉神宜趋、凶煞宜忌、冲煞、纳音、星宿、八字、五行、十神、建除十二值星、青龙名堂等十二神、黄道日及吉凶等。

```csharp
// https://www.nuget.org/packages/lunar-csharp

using Lunar;
using Lunar.Util;

Console.WriteLine(Lunar.Lunar.FromDate(DateTime.Now).FullString);
Console.WriteLine(Solar.FromYmd(2016, 1, 1).FullString);
Console.WriteLine(HolidayUtil.GetHoliday(2020, 5, 2));
```

## Humanizer

https://mp.weixin.qq.com/s/VKsFgfU3u0ewjPdyBE1G6A | Humanizer：简化DotNet日期、时间和数字的本地化表达
