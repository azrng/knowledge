---
title: Windows发布
lang: zh-CN
date: 2023-02-27
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: windowsfabu
slug: nkrku0
docsId: '97630171'
---

## 概述
将应用打包到MSIX包中(目前仅允许该方式)。

## 创建签名证书
> 用来对MSIX包进行签名

1.导航到项目目录下，然后使用终端执行命令来生成自签名证书
```csharp
New-SelfSignedCertificate -Type Custom ` -Subject "CN=azrng" `  -KeyUsage DigitalSignature `  -FriendlyName "我的临时测试证书" ` -CertStoreLocation "Cert:\CurrentUser\My" ` -TextExtension @("2.5.29.37={text}1.3.6.1.5.5.7.3.3", "2.5.29.19={text}")
```
> 记得在PowerShell输入

应该看到类似的结果
```csharp
PS D:\Gitee\maui-app-hello\MauiAppBlazor\MauiAppBlazor> New-SelfSignedCertificate -Type Custom ` -Subject "CN=azrng" `  -KeyUsage DigitalSignature `  -FriendlyName "我的临时测试证书" ` -CertStoreLocation "Cert:\CurrentUser\My" ` -TextExtension @("2.5.29.37={text}1.3.6.1.5.5.7.3.3", "2.5.29.19={text}")


   PSParentPath:Microsoft.PowerShell.Security\Certificate::CurrentUser\My

Thumbprint                                Subject
----------                                -------
1A415F8B4F4398A933A730648C300F68841B5258  CN=azrng
```
使用下面的PowerShell命令来查询已经创建的证书存储
```csharp
Get-ChildItem "Cert:\CurrentUser\My" | Format-Table Subject, FriendlyName, Thumbprint
```
应该看到类似的结果
```csharp
PS D:\Gitee\maui-app-hello\MauiAppBlazor\MauiAppBlazor> Get-ChildItem "Cert:\CurrentUser\My" | Format-Table Subject, FriendlyName, Thumbprint

Subject                                 FriendlyName                               Thumbprint
-------                                 ------------                               ----------
CN=localhost                            ASP.NET Core HTTPS development certificate FDD2DCF331F5DEF609E39584F185E6DD3...
CN=azrng                                                                           BBF2F303F1B72868CD408B23C978429EB...
CN=2452c715-a387-461a-bbcd-eb311b41c4db Microsoft Your Phone                       7DAFC2703C3CBFE2B62C9BFF7D524704B...
CN=azrng                                我的临时测试证书                            1A415F8B4F4398A933A730648C300F688...
```

## 配置项目的生成设置
在项目的csproj中间中加入下面的配置，该配置设置当目前框架为windows并且为release的时候，才会运行
```csharp
<PropertyGroup Condition="$([MSBuild]::GetTargetPlatformIdentifier('$(TargetFramework)')) == 'windows' and '$(Configuration)' == 'Release'">
  <AppxPackageSigningEnabled>true</AppxPackageSigningEnabled>
  <PackageCertificateThumbprint>1A415F8B4F4398A933A730648C300F68841B5258</PackageCertificateThumbprint>
</PropertyGroup>
<PropertyGroup Condition="$([MSBuild]::GetTargetPlatformIdentifier('$(TargetFramework)')) == 'windows' and '$(RuntimeIdentifierOverride)' != ''">
  <RuntimeIdentifier>$(RuntimeIdentifierOverride)</RuntimeIdentifier>
</PropertyGroup>
```
将PackageCertificateThumbprint属性值替换为之前生成的证书Thumbprint，这里也可以不设置，在命令发布的时候再设置也行。
示例中的第二 `<PropertyGroup>` 个是解决 Windows SDK 中的 bug 所必需的。 有关 bug 的详细信息，请参阅 [WindowsAppSDK 问题 #2940](https://github.com/microsoft/WindowsAppSDK/issues/2940)。

## 发布

### CLI发布
使用终端程序运行下面的命令
```csharp
dotnet publish -f net7.0-windows10.0.19041.0 -c Release /p:RuntimeIdentifierOverride=win10-x64
```
> 注意：尝试发布 .NET MAUI 解决方案将导致 dotnet publish 命令尝试单独发布解决方案中的每个项目，这可能会导致将其他项目类型添加到解决方案时出现问题。 因此，命令 dotnet publish 的范围应限定为 .NET MAUI 应用项目。

参数说明：

| 参数 | Value |
| --- | --- |
| -f net6.0-windows{version} | 目标框架，它是 Windows TFM，例如 net6.0-windows10.0.19041.0。 确保此值与 _.csproj_ 文件中节点的值`<TargetFrameworks>`相同。 |
| -c Release | 设置生成配置，即 Release。 |
| /p:RuntimeIdentifierOverride=win10-x64
- 或 -
/p:RuntimeIdentifierOverride=win10-x86 | 避免 [WindowsAppSDK 问题 #2940](https://github.com/microsoft/WindowsAppSDK/issues/2940)
 中详述的 bug。 -x64根据目标平台选择参数的或-x86版本。 |

发布应用生成和打包，将签名包复制到 `\net7.0-windows10.0.19041.0\win10-x64\AppPackages\<appname>` 文件夹。 `<appname>` 是一个以项目和版本命名的文件夹。 在此文件夹中，有 一个 msix 文件，即应用包。
```csharp
Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
d-----        2022/10/23     14:34                Add-AppDevPackage.resources
d-----        2022/10/23     14:34                Dependencies
-a----          2022/9/9     13:50          37837 Add-AppDevPackage.ps1
-a----          2022/9/9     13:50          13686 Install.ps1
-a----        2022/10/23     14:34            770 MauiAppBlazor_1.0.0.1_x64.cer
-a----        2022/10/23     14:34       77102456 MauiAppBlazor_1.0.0.1_x64.msix
```

## 安装应用
若要安装应用，必须使用已信任的证书进行签名。 如果不是，Windows 不会让你安装应用。 将显示如下所示的对话框，其中禁用了“安装”按钮：
![image.png](/common/1666507188061-96eecd90-5b48-485a-8456-5e69c6f6dce1.png)
如果要信任应用的证书，那么需要右键应用然后属性=>数字签名=>选择证书=>详细信息=>查看证书=>安装证书=>选择本地计算机=>下一步=>在证书导入向导中，选择将所有证书放在一下存储区中=>选择浏览，然后选择受信任的人员存储区，点击确定关闭=>选择下一步，然后选择完成可以看到对话框提示导入成功。
![image.png](/common/1666507991074-985ad832-4074-477d-a5f9-f6e6ce428b49.png)
再次尝试打开包进行安装应用，会看到已经可以正常安装了。

## 参考资料
官网教程：[https://learn.microsoft.com/zh-cn/dotnet/maui/windows/deployment/publish-cli](https://learn.microsoft.com/zh-cn/dotnet/maui/windows/deployment/publish-cli)

