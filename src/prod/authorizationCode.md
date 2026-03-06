---
title: 软件授权码
lang: zh-CN
date: 2025-07-29
publish: true
author: azrng
isOriginal: true
category:
  - prod
tag:
  - 授权码
  - 限制
---

## 本地授权



安装nuget包

```xml
<ItemGroup>
  <PackageReference Include="StudyUse" Version="1.1.1" />
</ItemGroup>
```



需要生成一个rsa的公私钥

```csharp
// 设备指纹
var fingerprint = "185226bc7bd2613634e9193d7878e2d7242822bef42a7fc8ba7ffe8cb42f2b43";

// 生成授权码
var licenseKey = RsaHelper.SignData(fingerprint, PrivateKey, HashAlgorithmName.SHA256, outputType: OutType.Hex);
_logger.LogInformation($"授权码：{licenseKey}");

var result = OrderHardwareLicense.Validate(fingerprint, licenseKey, PublicKeyPem,false);
Console.WriteLine(result);
```

