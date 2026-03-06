---
title: 配置简单加密
lang: zh-CN
date: 2022-02-10
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: peizhijianchanjiami
slug: eiovkc
docsId: '65938630'
---

## 需求
现在我们应该都是将配置写入到appsettings中，那么我想写入密文来保护隐私，那么我如何实现对appsettings的内容进行自动化解密？

## 操作
> 示例代码环境：vs2022、.Net6


### 其他操作
继承并实现 ConfigurationProvider, IConfigurationSource

### 本文操作
重写 JsonConfigurationProvider 方法
```csharp
public class JsonConfigurationProvider2 : JsonConfigurationProvider
{
    public JsonConfigurationProvider2(JsonConfigurationSource2 source) : base(source)
    {
    }

    public override void Load(Stream stream)
    {
        // Let the base class do the heavy lifting.
        base.Load(stream);

        //自动解密信息，以Password为例
        Data["Password"] = DESDEncrypt.DesDecrypt(Data["Password"]);

        // But you have to make your own MyEncryptionLibrary, not included here
    }
}

public class JsonConfigurationSource2 : JsonConfigurationSource
{
    public override IConfigurationProvider Build(IConfigurationBuilder builder)
    {
        EnsureDefaults(builder);
        return new JsonConfigurationProvider2(this);
    }
}

public static class JsonConfigurationExtensions2
{
    public static IConfigurationBuilder AddJsonFile2(this IConfigurationBuilder builder, string path, bool optional,
        bool reloadOnChange)
    {
        if (builder == null)
        {
            throw new ArgumentNullException(nameof(builder));
        }
        if (string.IsNullOrEmpty(path))
        {
            throw new ArgumentException("File path must be a non-empty string.");
        }

        var source = new JsonConfigurationSource2
        {
            FileProvider = null,
            Path = path,
            Optional = optional,
            ReloadOnChange = reloadOnChange
        };

        source.ResolveFileProvider();
        builder.Add(source);
        return builder;
    }
}
```
配置服务
```csharp
builder.Host.ConfigureAppConfiguration(config =>
{
    config.AddJsonFile2("appsettings.json", true, true);
});
```
然后读取配置就可以得到解密后的数据。

## 总结
该方法防君子不防止小人，虽然说没法一下子从配置中得到明文密码，但是还是可以通过其他调试工具得到明文密码。

## 资料
[https://mp.weixin.qq.com/s/FMzjYS2jhC7VqL-BCQaHKg](https://mp.weixin.qq.com/s/FMzjYS2jhC7VqL-BCQaHKg) | ASP.NET Core 中如何加密 Configuration 
