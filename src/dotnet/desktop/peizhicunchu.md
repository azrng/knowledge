---
title: 配置存储
lang: zh-CN
date: 2023-06-04
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: peizhicunchu
slug: ykxtbdkemd7mdski
docsId: '122032799'
---

## 存储位置
在WinForms中，可以使用以下方式来保存数据库连接字符串等敏感信息：

1. 在应用程序的配置文件（app.config或web.config）中保存连接字符串。配置文件具有加密选项，可以将连接字符串进行加密以保护敏感信息。
2. 使用Windows凭据管理器（Credential Manager）API来存储和检索敏感信息。通过这种方式，您可以将用户名和密码等敏感信息保存在操作系统级别的凭据存储区域中，并且只有授权的用户才能访问这些信息。
3. 将连接字符串等敏感信息保存在加密文本文件或二进制文件中。在读取连接字符串时，需要使用加密算法对文件进行解密。

无论您选择哪种方法，都要确保在保存敏感信息时采取适当的安全措施，例如加密、哈希处理、防范SQL注入攻击等。

## 基础操作
配置值
```csharp
<?xml version="1.0" encoding="utf-8" ?>
<configuration>
  <appSettings>
    <add key="aa" value="bb"></add>
  </appSettings>
  <connectionStrings>
    <add name="conn" connectionString=""></add>
  </connectionStrings>
</configuration>
```
读取值
```csharp
var value = ConfigurationManager.AppSettings.Get("aa");
```
公共类配置
```csharp
/// <summary>
/// app.config帮助类
/// </summary>
public static class AppConfigHelper
{
    /// <summary>
    /// 获取所有appSettings配置节配置
    /// </summary>
    /// <returns></returns>
    public static IEnumerable<string> GetAppSettings()
    {
        return ConfigurationManager.AppSettings.Cast<string>();
    }

    /// <summary>
    /// 在appSettings配置节根据key查询value
    /// </summary>
    /// <param name="key"></param>
    /// <returns></returns>
    public static string GetAppSetting(string key)
    {
        return ConfigurationManager.AppSettings.Get(key);
    }

    ///<summary>
    ///在appSettings配置节增加一对键、值对
    ///</summary>
    ///<param name="newKey"></param>
    ///<param name="newValue"></param>
    public static void UpdateAppSetting(string newKey, string newValue)
    {
        var isModified = false;
        foreach (string key in ConfigurationManager.AppSettings)
        {
            if (key == newKey)
            {
                isModified = true;
            }
        }

        // 打开可执行文件的App.Config
        var config = ConfigurationManager.OpenExeConfiguration(ConfigurationUserLevel.None);
        //您需要移除旧的设置对象，然后才能替换它
        if (isModified)
        {
            config.AppSettings.Settings.Remove(newKey);
        }

        // 添加配置
        config.AppSettings.Settings.Add(newKey, newValue);
        // 保存更改到文件
        config.Save(ConfigurationSaveMode.Modified);
        // 强制重新加载已更改的部分。
        ConfigurationManager.RefreshSection("appSettings");
    }

    /// <summary>
    /// 在connectionStrings配置节查询所有key
    /// </summary>
    /// <returns></returns>
    public static IEnumerable<string> GetConnectionStrings()
    {
        return ConfigurationManager.ConnectionStrings.Cast<string>();
    }

    /// <summary>
    /// 在connectionStrings配置节根据key查询value
    /// </summary>
    /// <param name="key"></param>
    /// <returns></returns>
    public static string GetConnectionString(string key)
    {
        return ConfigurationManager.ConnectionStrings[key]?.ToString();
    }

    ///<summary>
    ///更新连接字符串
    ///</summary>
    ///<param name="newName">连接字符串名称</param>
    ///<param name="newConString">连接字符串内容</param>
    ///<param name="newProviderName">数据提供程序名称</param>
    public static void UpdateConnectionString(string newName, string newConString, string newProviderName)
    {
        //记录该连接串是否已经存在
        var isModified = ConfigurationManager.ConnectionStrings[newName] != null;
        //如果要更改的连接串已经存在
        //新建一个连接字符串实例
        var mySettings = new ConnectionStringSettings(newName, newConString, newProviderName);
        // 打开可执行的配置文件*.exe.config
        var config = ConfigurationManager.OpenExeConfiguration(ConfigurationUserLevel.None);
        // 如果连接串已存在，首先删除它
        if (isModified)
            config.ConnectionStrings.ConnectionStrings.Remove(newName);
        // 将新的连接串添加到配置文件中.
        config.ConnectionStrings.ConnectionStrings.Add(mySettings);
        // 保存对配置文件所作的更改
        config.Save(ConfigurationSaveMode.Modified);
        // 强制重新载入配置文件的ConnectionStrings配置节
        ConfigurationManager.RefreshSection("ConnectionStrings");
    }
}
```

## 加密解密
参考文档：[https://www.shuzhiduo.com/A/xl56BXr05r/](https://www.shuzhiduo.com/A/xl56BXr05r/)
```bash
## 加密 aspnet_regiis -pef "配置节" "目录"
C:\Windows\Microsoft.NET\Framework\v4.0.30319\\aspnet_regiis -pef "Secret" "web.config"

## 解密 aspnet_regiis -pef "connectionStrings" "目录"
C:\Windows\Microsoft.NET\Framework\v4.0.30319\\aspnet_regiis -pdf  "Secret" "web.config"
```
