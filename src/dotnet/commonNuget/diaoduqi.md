---
title: 调度器
lang: zh-CN
date: 2023-04-24
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: diaoduqi
slug: mngkl98mt5ywdcto
docsId: '111520708'
---

## NCrontab
NCrontab 是 .NET Standard 1.0 支持的所有 .NET 运行时的 crontab。它提供 crontab 表达式的解析和格式化，以及根据以 crontab 格式表示的计划计算时间的出现次数。

```xml
<PackageReference Include="NCrontab" Version="3.4.0" />
```

帮助类
```csharp
public static class CronHelper
{
    /// <summary>
    /// 尝试转换为Cron表达式（不包含秒）
    /// </summary>
    /// <param name="cron"></param>
    /// <returns></returns>
    public static bool TryParse(string cron)
    {
        try
        {
            CrontabSchedule.Parse(cron);
        }
        catch (Exception)
        {
            return false;
        }

        return true;
    }

    /// <summary>
    /// 尝试获取下一个CRON表达式的时间
    /// </summary>
    /// <param name="dateTime"></param>
    /// <param name="cron"></param>
    /// <returns></returns>
    public static DateTime? GetNextTime(DateTime dateTime, string cron)
    {
        try
        {
            var ex = CrontabSchedule.Parse(cron, new CrontabSchedule.ParseOptions { IncludingSeconds = true });
            return ex.GetNextOccurrence(dateTime);
        }
        catch (Exception)
        {
        }

        return null;
    }
}
```
