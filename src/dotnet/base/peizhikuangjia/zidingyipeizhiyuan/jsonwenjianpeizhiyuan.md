---
title: Json文件配置源
lang: zh-CN
date: 2023-09-25
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: jsonwenjianpeizhiyuan
slug: hi00hf
docsId: '31077359'
---
> 前文获取配置文件的时候，是获取默认的appsettings.json配置文件的配置，下面说明下如何进行自定义获取配置


## Json Provider

### 构建独立的IConfiguration
编写方法
```csharp
public static IConfigurationRoot LoadSettings(this IHostEnvironment env)
{
    return new ConfigurationBuilder()
            .SetBasePath(AppDomain.CurrentDomain.BaseDirectory)
            .AddJsonFile("common.json", optional: true, reloadOnChange: false)
            .AddJsonFile("appsettings.json", optional: true, reloadOnChange: false)
            .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true, reloadOnChange: false)
            .AddEnvironmentVariables()
            .Build();
}
```
在Startup构造函数的时候进行赋值替换IConfiguration
```csharp
private readonly IConfiguration _configuration;
public Startup(IWebHostEnvironment env)
{
    _configuration = env.LoadSettings();
}
```
> 该操作添加的配置项，只在startup范围生效。


### 在Progrom全局自定义配置
```csharp
 public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
            .ConfigureAppConfiguration((hostingContext, config) =>
            {
                //config.Sources.Clear();  // 会清除所有配置提供程序
                var env = hostingContext.HostingEnvironment;
                config.SetBasePath(env.ContentRootPath);
                config.AddJsonFile("devappsettings.json", optional: false, reloadOnChange: true);
            })
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
```
> 注意：添加自定义文件的目录要注意，可能会存在因为目录问题所以找不到配置文件的情况。


## 自定义IConfigurationSource
将一个 JSON 文件作为配置文件，然后添加环境变量作为配置源
```csharp
public class JsonFileConfigurationProvider : ConfigurationProvider
{
    private readonly string filePath;

    public JsonFileConfigurationProvider(string filePath)
    {
        this.filePath = filePath;
    }

    public override void Load()
    {
        Data = JsonConvert.DeserializeObject<Dictionary<string, string>>(
            File.ReadAllText(filePath));
    }
}

```
通过继承自 ConfigurationProvider 并实现 Load() 方法，我们可以轻松地自定义配置系统的行为，并从任意数据源中加载配置信息。在这个示例中，我们使用了 JSON 文件作为数据源，但你也可以使用其他类型的数据源，如数据库、环境变量等。
```csharp
public class MyCustomConfigurationSource : IConfigurationSource
{
    private readonly string _myCustomConfigFilePath;

    public MyCustomConfigurationSource(string myCustomConfigFilePath)
    {
        _myCustomConfigFilePath = myCustomConfigFilePath;
    }

    public IConfigurationProvider Build(IConfigurationBuilder builder)
    {
        return new MyCustomConfigurationProvider(_myCustomConfigFilePath);
    }
}

```
将上面的内容加入配置
```csharp
var builder = WebApplication.CreateBuilder(args);

// Add your custom configuration source to the configuration builder.
builder.Configuration.Add(new MyCustomConfigurationSource("path/to/custom/config/file"));

var app = builder.Build();

```
使用方法
```csharp
var myCustomSettingValue = app.Configuration["MyCustomSettingKey"];
```

## Memory Provider
允许我们将一个应用程序配置直接配置到内存中，而不是像传统方式那样子必须制定一个物理文件。
```json
var builder = new ConfigurationBuilder();
var profileCollection = new Dictionary<string, string>
{
	{"AuthorProfile:FirstName", "Joydip"},
	{"AuthorProfile:LastName", "Kanjilal"},
	{"AuthorProfile:Address", "Hyderabad, India"}
};
builder.AddInMemoryCollection(profileCollection);
Configuration = builder.Build();
```
目前发现的用途
```csharp
public static IHostBuilder CreateHostBuilder(string[] args) =>
    Host.CreateDefaultBuilder(args)
    .ConfigureAppConfiguration((hostingContext, config) =>
    {
        var builder = new ConfigurationBuilder();
        var profileCollection = new Dictionary<string, string>
    {
            {"AuthorProfile:FirstName", "Joydip"},
            {"AuthorProfile:LastName", "Kanjilal"},
            {"AuthorProfile:Address", "Hyderabad, India"}
    };
        builder.AddInMemoryCollection(profileCollection);
        config.AddConfiguration(builder.Build());
    })
    .ConfigureWebHostDefaults(webBuilder =>
    {
        webBuilder.UseStartup<Startup>();
    });
```
然后就可以通过IConfiguration实例去获取了。

## 公共类获取配置文件
引用组件
> Microsoft.Extensions.Configuration.Json

```csharp
 	public class AppSettings
    {
        private static IConfiguration Configuration { get; set; }

        public AppSettings(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        /// <summary>
        /// 封装要操作的字符
        /// </summary>
        /// <param name="sections"></param>
        /// <returns></returns>
        public static string GetValue(params string[] sections)
        {
            try
            {
                if (sections.Any())
                    return Configuration[string.Join(":", sections)];
            }
            catch (Exception)
            { }
            return "";
        }

        /// <summary>
        /// 递归获取配置信息数组
        ///引用 Microsoft.Extensions.Configuration.Binder 包
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="sections"></param>
        /// <returns></returns>
        public static List<T> App<T>(params string[] sections)
        {
            List<T> list = new List<T>();
            Configuration.Bind(string.Join(":", sections), list);
            return list;
        }
    }
```
> 参考自：[https://gitee.com/laozhangIsPhi/Blog.Core](https://gitee.com/laozhangIsPhi/Blog.Core)

ConfigureServices中配置
```csharp
services.AddSingleton(new AppSettings(Configuration));
```
获取指定配置
```csharp
var info = AppSettings.GetValue("Logging", "LogLevel");
```
