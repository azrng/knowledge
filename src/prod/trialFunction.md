---
title: 试用功能
lang: zh-CN
date: 2023-08-17
publish: true
author: azrng
isOriginal: true
category:
  - prod
tag:
  - 试用
---

## 固定时间限制
通过在程序中内置一个结束时间，然后每次登录等将获取获取的时间和这个时间进行对比检测，如果超过那么就禁止使用
```csharp
[ApiController]
[Route("[controller]")]
public class TestController : ControllerBase
{
    [HttpGet]
    public async Task<string> VerifyTime()
    {
        var serviceUrl = "http://api.m.taobao.com/rest/api3.do?api=mtop.common.getTimestamp";
        var client = new HttpClientHelper();
        var result = await client.GetAsync<GetTimeResult>(serviceUrl);
        var convertTimestamp = long.TryParse(result.data.T, out var timeStamp);
        if (!convertTimestamp)
        {
            // 时间转换失败  当网络异常处理
            return "当前时间转换失败";
        }
        var currTime = timeStamp.ToDateTime();
        var endTimeStr = "202304210947";// 试用的结束时间
        var flag = DateTime.TryParseExact(endTimeStr, "yyyyMMddHHmm", CultureInfo.InvariantCulture, DateTimeStyles.AdjustToUniversal, out var endTime);
        if (!flag)
        {
            // 获取结束时间失败，被人修改
            return "获取结束时间失败";
        }
        if (currTime > endTime)
        {
            return "超过试用期";
        }

        return "success";
    }
}

/// <summary>
/// 获取时间戳时间返回类
/// </summary>
public class GetTimeResult
{
    /// <summary>
    /// api名称
    /// </summary>
    public string api { get; set; }

    /// <summary>
    /// 版本
    /// </summary>
    public string v { get; set; }

    //响应是否成功
    //public string[] ret { get; set; }

    /// <summary>
    /// 返回的时间
    /// </summary>
    public TimestampInfo data { get; set; }
}

public class TimestampInfo
{
    /// <summary>
    /// 毫秒时间戳
    /// </summary>
    public string T { get; set; }
}
```
