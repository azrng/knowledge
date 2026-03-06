---
title: 文件配置
lang: zh-CN
date: 2022-05-21
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - config
filename: wenjianpeizhi
slug: fcgxml
docsId: '51623873'
---

## 概述
通过文件(json、xml、ini)作为配置提供程序
特性：

- 指定文件是否可选、必选
- 指定是否监视文件变更

## 操作
可能需要安装包
```csharp
Microsoft.Extensions.Configuration
Microsoft.Extensions.Configuration.Json
Microsoft.Extensions.Configuration.Ini
Microsoft.Extensions.Configuration.Xml
```

### 简单读取
添加appsettings的json文件
```csharp
{
  "Setting": {
    "SerivceName": "ceshi",
    "Version": 5
  },
  "name": "zhangsan"
}

```
> 注意：可能需要设置始终复制

添加appsettings的ini文件
```csharp
name="lisi";
```
```csharp
var builder = new ConfigurationBuilder();
//添加ini配置文件 (文件名称，文件是否可选，默认false，文件变更读取新文件)
builder.AddIniFile("appsettings.ini", false, true);
//添加json配置文件 (文件名称，文件是否可选，默认false，文件变更读取新文件)
builder.AddJsonFile("appsettings.json", false, true);


var configurationRoot = builder.Build();
Console.WriteLine($"SerivceName:{configurationRoot["Setting:SerivceName"] }");
Console.WriteLine($"Version:{configurationRoot["Setting:Version"] }");
Console.WriteLine($"name:{configurationRoot["name"] }");
```
后添加的配置会替换之前的配置。如果配置了监视文件的变更，那么配置修改后再次读取会读取到新的配置。

### 文件变化事件
```csharp
var builder = new ConfigurationBuilder();
//添加json配置文件 (文件名称，文件是否可选，默认false，文件变更读取新文件)
builder.AddJsonFile("appsettings.json", false, true);
var configurationRoot = builder.Build();

Console.WriteLine("文件变化前");
Console.WriteLine($"SerivceName:{configurationRoot["Setting:SerivceName"] }");
Console.WriteLine($"Version:{configurationRoot["Setting:Version"] }");
Console.WriteLine($"name:{configurationRoot["name"] }");

var changToken = configurationRoot.GetReloadToken();
changToken.RegisterChangeCallback(state =>
{
    Console.WriteLine("文件变化后");
    Console.WriteLine($"SerivceName:{configurationRoot["Setting:SerivceName"] }");
    Console.WriteLine($"Version:{configurationRoot["Setting:Version"] }");
    Console.WriteLine($"name:{configurationRoot["name"] }");
}, configurationRoot);

Console.ReadLine();
```
我们启动程序然后去修改bin目录下的文件内容，发现输出结果如下
```csharp
文件变化前
SerivceName:ceshi
Version:5
name:zhangsan
文件变化后
SerivceName:ceshi
Version:7
name:zhangsan
```
注：GetReloadToken只生效一次，如果想要一直监听变更,则需要下面的代码
```csharp
ChangeToken.OnChange(() => configurationRoot.GetReloadToken(), () =>
{
    Console.WriteLine("文件变化后");
    Console.WriteLine($"SerivceName:{configurationRoot["Setting:SerivceName"] }");
    Console.WriteLine($"Version:{configurationRoot["Setting:Version"] }");
    Console.WriteLine($"name:{configurationRoot["name"] }");
});
```

### 非API中使用Int配置

举例一个在控制台中使用ini文件做配置文件的示例，并且读取配置的示例。

新建一个.Net控制台(这里使用.Net8)，并引用下面nuget包

```xml
<PackageReference Include="Microsoft.Extensions.Configuration.Ini" Version="8.0.0" />
```

新建一个ini配置文件名为appsettings.ini，并设置该为[较新时复制]，这样子再项目构建的时候，该文件会被复制到输出目录中，该文件添加示例内容

```ini
account = admin
passowrd = 123456
```

读取该文件代码如下

```csharp
using Microsoft.Extensions.Configuration;

var configuration = new ConfigurationBuilder()
    .AddIniFile("appsettings.ini", optional: false, reloadOnChange: true)
    .Build();

var account = configuration["account"];
Console.WriteLine(account);

var password = configuration["passowrd"];
Console.WriteLine(password);
```

非API项目读取其他文件代码类似，只不过添加其他Nuget包，并且使用其他**Addxxx**方法。

## Ini操作包

### INIParser

::: tip

上次更新在2022年

:::

安装nuget包

```xml
<PackageReference Include="INIParser" Version="1.0.1" />
```

.NET 6+ INI 解析器，还支持异步文件加载。

```c#
using IniParser;
using IniParser.Model;

// 读取INI文件
public string ReadIniValue(string section, string key, string filePath)
{
    var parser = new FileIniDataParser();
    IniData data = parser.ReadFile(filePath);
    return data[section][key];
}

// 写入INI文件
public void WriteIniValue(string section, string key, string value, string filePath)
{
    var parser = new FileIniDataParser();
    IniData data = parser.ReadFile(filePath);
    data[section][key] = value;
    parser.WriteFile(filePath, data);
}
```

### ini-parser

[ini-parser](https://github.com/rickyah/ini-parser) 是一款非常好用的 INI 文件解析库。它可以一次性将整个 INI 文件解析为一个 `IniData` 对象（可以想象成一个字典），从而方便我们像操作字典那样便捷又高效地进行高频率的读写操作，并在最后统一写回文件。

::: tip

上次更新在2017年，`ini-parser` 和 `ini-parser-netstandard` 这个库。这两个库的功能是一样的，只是前者是 .NET Framework的，而后者则是 .NET Standard 2.0 的，因此可以在 .NET Core、.NET 5+ 及跨平台环境中使用。推荐大家在任何情况下都使用后者。

:::

```csharp
using IniParser;

var parser = new FileIniDataParser();
IniData data = parser.ReadFile("config.ini");

// 读取键值对
string value1 = data["Section1"]["Key1"];
string value2 = data["Section1"]["Key2"];

// 修改键值对
data["Section1"]["Key1"] = "NewValue1";
data["Section1"]["Key2"] = "NewValue2";

// 写回文件
parser.WriteFile("config.ini", data);
```

### IniSharp

::: tip

上次更新在2017年

:::

[IniSharp](https://github.com/kevinlae/IniSharp) 这个库提供了便捷的操作 INI 文件的方法，并且不依赖 Win32 API，因此可以在跨平台环境下使用。

```csharp
using IniSharp;

var ini = new IniFile("config.ini", Encoding.UTF8);

var value1 = ini.GetValue("Section1", "Key1");
var value2 = ini.GetValue("Section1", "Key2", "Default");  // 如果该键不存在，则创建并返回默认值

ini.SetValue("Section1", "Key1", "NewValue1");

ini.DeleteKey("Section1", "Key2");

ini.DeleteSection("Section2");

List<string> sections = ini.GetSections();
List<string> keys = ini.GetKeys("Section1");

```

这个库并不会一次性读取整个 INI 文件，而是在每次操作时进行读取或写入操作，因此不会占用过多的内存。在我们的需求是临时读写某一项配置时显得尤为重要。但是这个库性能并不高，具体[参考](https://blog.coldwind.top/posts/deal-with-ini-file/#%e7%ac%ac%e4%b8%89%e6%96%b9%e5%ba%93inisharp)

### Ini操作帮助类

假设我有下面的ini文件

```csharp
[DataBase]
## 举例配置项
host=100
```

我希望在DataBase的节点下增加一个配置，那么就可以这么处理

```csharp
var iniFileHelper = new IniFileHelper();
iniFileHelper.WriteIniString("DataBase", "conn", "xxx");
```

读取示例如下

```csharp
var sb = new StringBuilder(60);
iniFileHelper.GetIniString("DataBase", "conn", "", sb, sb.Capacity);
string aaa = sb.ToString();
```

涉及到的公共类如下

::: details

```csharp
/// <summary>
/// INI文件操作类
/// </summary>
public class IniFileHelper
{
    /// <summary>
    /// 返回0表示失败，非0为成功
    /// </summary>
    /// <param name="section"></param>
    /// <param name="key"></param>
    /// <param name="val"></param>
    /// <param name="filePath"></param>
    /// <returns></returns>
    [DllImport("kernel32", CharSet = CharSet.Auto)]
    private static extern long WritePrivateProfileString(
        string section,
        string key,
        string val,
        string filePath
    );

    /// <summary>
    /// 返回取得字符串缓冲区的长度
    /// </summary>
    /// <param name="section"></param>
    /// <param name="key"></param>
    /// <param name="strDefault"></param>
    /// <param name="retVal"></param>
    /// <param name="size"></param>
    /// <param name="filePath"></param>
    /// <returns></returns>
    [DllImport("kernel32", CharSet = CharSet.Auto)]
    private static extern long GetPrivateProfileString(
        string section,
        string key,
        string strDefault,
        StringBuilder retVal,
        int size,
        string filePath
    );

    [DllImport("Kernel32.dll", CharSet = CharSet.Auto)]
    public static extern int GetPrivateProfileInt(
        string section,
        string key,
        int nDefault,
        string filePath
    );

    /// <summary>
    /// ini配置文件路径
    /// </summary>
    private readonly string strIniFilePath;

    /// <summary>
    /// 无参构造函数
    /// </summary>
    /// <returns></returns>
    public IniFileHelper()
    {
        this.strIniFilePath = Directory.GetCurrentDirectory() + "\\sysconfig.ini";
    }

    /// <summary>
    /// 有参构造函数
    /// </summary>
    /// <param name="strIniFilePath">ini配置文件路径</param>
    /// <returns></returns>
    public IniFileHelper(string strIniFilePath)
    {
        if (strIniFilePath != null)
        {
            this.strIniFilePath = strIniFilePath;
        }
    }

    /// <summary>
    /// 获取ini配置文件中的字符串
    /// </summary>
    /// <param name="section">节名</param>
    /// <param name="key">键名</param>
    /// <param name="strDefault">默认值</param>
    /// <param name="retVal">结果缓冲区</param>
    /// <param name="size">结果缓冲区大小</param>
    /// <returns>成功true,失败false</returns>
    public bool GetIniString(
        string section,
        string key,
        string strDefault,
        StringBuilder retVal,
        int size
    )
    {
        var liRet = GetPrivateProfileString(section, key, strDefault, retVal, size, strIniFilePath);
        return liRet >= 1;
    }

    /// <summary>
    /// 获取ini配置文件中的整型值
    /// </summary>
    /// <param name="section">节名，相当于分组</param>
    /// <param name="key">键名</param>
    /// <param name="nDefault">默认值</param>
    /// <returns></returns>
    public int GetIniInt(string section, string key, int nDefault)
    {
        return GetPrivateProfileInt(section, key, nDefault, strIniFilePath);
    }

    /// <summary>
    /// 往ini配置文件写入字符串
    /// </summary>
    /// <param name="section">节名，相当于分组</param>
    /// <param name="key">键名</param>
    /// <param name="val">要写入的字符串</param>
    /// <returns>成功true,失败false</returns>
    public bool WriteIniString(string section, string key, string val)
    {
        var liRet = WritePrivateProfileString(section, key, val, strIniFilePath);
        return liRet != 0;
    }

    /// <summary>
    /// 往ini配置文件写入整型数据
    /// </summary>
    /// <param name="section">节名，相当于分组</param>
    /// <param name="key">键名</param>
    /// <param name="val">要写入的数据</param>
    /// <returns>成功true,失败false</returns>
    public bool WriteIniInt(string section, string key, int val)
    {
        return WriteIniString(section, key, val.ToString());
    }
}
```

:::

[https://mp.weixin.qq.com/s/8DmAdCJZPWPz1PFaiy9o8A](https://mp.weixin.qq.com/s/8DmAdCJZPWPz1PFaiy9o8A) | c## winform程序读写ini配置文件

## 参考资料

极客时间教程
