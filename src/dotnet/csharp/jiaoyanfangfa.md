---
title: 校验方法
lang: zh-CN
date: 2023-11-09
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - verify
---
## 邮箱验证

```csharp
public static bool IsValidEmail(string value)
{
	if (value == null)
	{
		return false;
	}
	if (!(value is string valueAsString))
	{
		return false;
	}

	// only return true if there is only 1 '@' character
	// and it is neither the first nor the last character
	int index = valueAsString.IndexOf('@');

	return index > 0 &&
		index != valueAsString.Length - 1 &&
		index == valueAsString.LastIndexOf('@');
}
```
