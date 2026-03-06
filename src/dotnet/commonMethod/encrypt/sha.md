---
title: SHA
lang: zh-CN
date: 2022-09-01
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: sha
slug: zs08qp
docsId: '77445413'
---

## 概述

- 散列法提供了一种**单向加密**的方式。
- 适合于在数据库中存储密码，因为我们无需提供解密的信息。

## 常用散列算法

以升序按照安全等级列出常用散列算法

MD5(16)->SHA1(20)->SHA256(32)->SHA384(48)->SHA512(64)



算法长度越短运算的速度越快。

存储密码或者其他高安全等级的敏感数据，请至少使用SHA256。

## 操作汇总

```csharp
/// <summary>
/// SHA哈希
/// </summary>
public static class SHAHelper
{
	/// <summary>
	/// 获取字符串MD5值
	/// </summary>
	/// <param name="str">字符串</param>
	/// <returns></returns>
	public static string GetMd5Hash(this string str)
	{
		if (str == null)
		{
			throw new ArgumentNullException(nameof(str));
		}

		using var md5 = MD5.Create();
		var buffer = Encoding.UTF8.GetBytes(str);
		var hashResult = md5.ComputeHash(buffer);
		return BitConverter.ToString(hashResult).Replace("-", string.Empty);
	}

	/// <summary>
	/// 获取文件mdm值
	/// </summary>
	/// <param name="path"></param>
	/// <returns></returns>
	public static string GetFileMd5Hash(string path)
	{
		if (path == null)
		{
			throw new ArgumentNullException(nameof(path));
		}
		using var md5 = MD5.Create();
		using var stream = File.OpenRead(path);
		var hash = md5.ComputeHash(stream);
		return BitConverter.ToString(hash).Replace("-", "").ToLowerInvariant();
	}


	/// <summary>
	/// 获取字符串sha1值
	/// </summary>
	/// <param name="str"></param>
	/// <returns></returns>
	/// <exception cref="ArgumentNullException"></exception>
	public static string GetSHA1Hash(this string str)
	{
		if (str == null)
		{
			throw new ArgumentNullException(nameof(str));
		}

		using var sha1 = SHA1.Create();
		var buffer = Encoding.UTF8.GetBytes(str);
		var hashResult = sha1.ComputeHash(buffer);
		return BitConverter.ToString(hashResult).Replace("-", string.Empty);
	}

	/// <summary>
	/// 获取字符串sha256值
	/// </summary>
	/// <param name="str"></param>
	/// <returns></returns>
	/// <exception cref="ArgumentNullException"></exception>
	public static string GetSHA256Hash(this string str)
	{
		if (str == null)
		{
			throw new ArgumentNullException(nameof(str));
		}

		using var sha1 = SHA256.Create();
		var buffer = Encoding.UTF8.GetBytes(str);
		var hashResult = sha1.ComputeHash(buffer);
		return BitConverter.ToString(hashResult).Replace("-", string.Empty);
	}

	/// <summary>
	/// 获取字符串sha512值
	/// </summary>
	/// <param name="str"></param>
	/// <returns></returns>
	/// <exception cref="ArgumentNullException"></exception>
	public static string GetSHA512Hash(this string str)
	{
		if (str == null)
		{
			throw new ArgumentNullException(nameof(str));
		}

		using var sha1 = SHA512.Create();
		var buffer = Encoding.UTF8.GetBytes(str);
		var hashResult = sha1.ComputeHash(buffer);
		return BitConverter.ToString(hashResult).Replace("-", string.Empty);
	}
}
```

## 防止攻击

防止字典攻击的技术是在加密过程中引入“盐”，即由随机数生成器生成的一长串字节，并在散列之前将其并入密码中。这样做可以通过两种途径来对抗攻击者：首先，这需要更长的计算时间，其次，攻击者无法访问“盐”字节的值
