---
title: 说明
lang: zh-CN
date: 2023-10-15
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - common
---
## 概述

[https://mp.weixin.qq.com/s/HbxqxLo8Z5hXkhjUqQS3bA](https://mp.weixin.qq.com/s/HbxqxLo8Z5hXkhjUqQS3bA) | DotNetCommon-搜集.neter开发常用的功能

## 集合分页查询

::: details

```csharp
/// <summary>
/// 将数据分页执行
/// </summary>
/// <param name="data">数据集</param>
/// <param name="dataFunc">每页要执行的操作 param1：当页数据 param2：页码</param>
/// <param name="pageSize"></param>
/// <typeparam name="T"></typeparam>
public static async Task<int> PageExecuteAsync<T>(ICollection<T> data,
    Func<ICollection<T>, int, Task<int>> dataFunc,
    int pageSize = 5000)
{
    if (data.Count == 0)
    {
        return default;
    }

    if (pageSize <= 0)
    {
        await dataFunc(data, 1);
        return default;
    }

    var size = data.Count;

    var total = 0;

    // 求总页数
    var pageCount = (size + (pageSize - 1)) / pageSize;
    ConsoleHelper.WriteInfoLine($"当前数据 每页：{pageSize}条  共：{pageCount}页");

    for (var i = 1; i <= pageCount; i++)
    {
        var currSize = data.Skip(pageSize * (i - 1)).Take(pageSize).ToList();
        ConsoleHelper.WriteInfoLine($"当前是第{i}页 本页面数据条数：{currSize.Count}");
        total += await dataFunc(currSize, i);
    }

    return total;
}
```

:::

## 对象转QeryString

::: details

```csharp
/// <summary>
/// 参数拼接Url
/// </summary>
/// <param name="source">要拼接的实体</param>
/// <param name="IsStrUpper">是否开启转小写</param>
/// <returns>Url,</returns>
public static string ToPaeameter(this object source, bool IsStrUpper = false)
{
	var buff = new StringBuilder(string.Empty);
	if (source == null)
		throw new ArgumentNullException("source", "Unable to convert object to a dictionary. The source object is null.");
	foreach (PropertyDescriptor property in TypeDescriptor.GetProperties(source))
	{
		object value = property.GetValue(source);
		if (value != null)
		{
			if (IsStrUpper)
			{
				buff.Append(WebUtility.UrlEncode(property.Name) + "=" + WebUtility.UrlEncode(value + "") + "&");
			}
			else
			{
				buff.Append(WebUtility.UrlEncode(property.Name.ToLower()) + "=" + WebUtility.UrlEncode(value + "") + "&");
			}
		}
	}
	return buff.ToString().Trim('&');
}
```

:::
