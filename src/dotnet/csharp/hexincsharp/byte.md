---
title: byte
lang: zh-CN
date: 2023-11-09
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 无
filename: byte
slug: abswzmpf6xq64siq
docsId: '142421054'
---


## 操作

### 二进制转换十六进制
二进制转十六进制，下面的几个方法实现效果是一样的，有些是大小写不同
```csharp
byte[] encrypted = { 0xAB, 0xCD, 0xEF };
// 这里Hex来自于包：BouncyCastle.NetCore
var hexString = Encoding.UTF8.GetString(Hex.Encode(encrypted));
hexString.Dump();

var hexString2 = Hex.ToHexString(encrypted);
hexString2.Dump();

var hexString1 = BitConverter.ToString(encrypted).Replace("-", string.Empty);
hexString1.Dump();

// 还有这个方法也可以
// var stringBuilder = new StringBuilder();
// for (var index = 0; index < bytes.Length; ++index)
//     stringBuilder.Append(bytes[index].ToString("X2"));
// return stringBuilder.ToString();

// 输出效果
//abcdef
//abcdef
//ABCDEF
```

### 十六进制转二进制
```csharp
void Main()
{
	byte[] encrypted = { 0xAB, 0xCD, 0xEF };

	var hexString2 = Hex.ToHexString(encrypted);
	hexString2.Dump();

	var bytes = Hex.Decode(hexString2);
	bytes.Dump();

	var bytes2 = ToBytesFromHex(hexString2);
	bytes2.Dump();
}


/// <summary>
/// 十六进制转二进制
/// </summary>
/// <param name="hex"></param>
/// <returns></returns>
static byte[] ToBytesFromHex(string hex)
{
	if (hex.Length == 0)
		return new byte[1];
	if (hex.Length % 2 == 1)
		hex = "0" + hex;
	var bytes = new byte[hex.Length / 2];
	for (var index = 0; index < hex.Length / 2; ++index)
		bytes[index] = byte.Parse(hex.Substring(2 * index, 2), NumberStyles.AllowHexSpecifier);
	return bytes;
}
```

