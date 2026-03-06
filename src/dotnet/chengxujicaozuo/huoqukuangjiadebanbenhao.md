---
title: 获取框架的版本号
lang: zh-CN
date: 2023-04-02
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: huoqukuangjiadebanbenhao
slug: gach7y
docsId: '88560520'
---

## NerF
```csharp
/// <summary>
/// 获取.NetF版本号
/// </summary>
/// <returns></returns>
private static Version GetFrameworkVersion()
{
    const string registerKey = @"SOFTWARE\Microsoft\NET Framework Setup\NDP\v4\Full\";
    var defaultVersion = new Version(0, 0);
    try
    {
        //Release根据文档描述是版本密钥，应该是类似版本构建号，能够判断是否已安装.NET。
        //Version是.NetFramework的版本
        using var sub = RegistryKey.OpenBaseKey(RegistryHive.LocalMachine, RegistryView.Registry32).OpenSubKey(registerKey);
        if (!(sub?.GetValue("Release") is int key))
            return defaultVersion;

        //判断
        if (key >= 528040)
            return new Version(4, 8);
        if (key >= 461808)
            return new Version(4, 7, 2);
        if (key >= 461308)
            return new Version(4, 7, 1);
        if (key >= 460798)
            return new Version(4, 7);
        if (key >= 394802)
            return new Version(4, 6, 2);
        if (key >= 394254)
            return new Version(4, 6, 1);
        if (key >= 393295)
            return new Version(4, 6);
        if (key >= 379893)
            return new Version(4, 5, 2);
        if (key >= 378675)
            return new Version(4, 5, 1);
        if (key >= 378389)
            return new Version(4, 5);
    }
    catch (Exception)
    {
        // ignored
    }
    //小于4.5，一般不存在这个环境
    return new Version(0, 0);
}
```
