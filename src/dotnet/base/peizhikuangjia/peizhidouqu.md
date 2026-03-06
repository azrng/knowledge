---
title: 配置读取
lang: zh-CN
date: 2023-08-04
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: peizhidouqu
slug: ugqbzr
docsId: '30178387'
---

### 1. 说明
默认情况下读取配置Configuration的默认优先级：ConfigureAppConfiguration(自定义读取)>CommandLine(命令行参数)>Environment(环境变量)>appsetting.json(默认配置文件)>UseSetting的顺序
> 原因：读取配置的顺序是后来者居上模式，后来注册的会优先被读取到，具有覆盖性，可覆盖配置读取器。

默认环境：Development、Production

### 2. 获取配置

### 2.1 获取单个项
测试文件
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft": "Warning",
      "Microsoft.Hosting.Lifetime": "Information"
    }
  },
  "RabbitMQ": {
    "Hosts": [ "**.***.***.**" ],
    "Port": 5672,
    "UserName": "admin",
    "Password": "123456789",
    "VirtualHost": "myQueue"
  },
  "array": {
    "entries": {
      "0": "value00",
      "1": "value10",
      "2": "value20",
      "4": "value40",
      "5": "value50"
    }
  },
  "AllowedHosts": "*"
}

```

#### 2.1.1 GetValue
```csharp
//值是int类型
var a1 = Configuration.GetValue<int>("RabbitMQ:Port");
//值是字符串
var a2 = Configuration.GetValue<string>("RabbitMQ:UserName");

//获取数组第一个
var a0 = Configuration["RabbitMQ:Hosts:0"];

var a3 = Configuration["RabbitMQ:UserName"];
```

#### 2.1.2 GetSection
会返回具有指定子节键的配置子节。
```csharp
//值是数组
var a0 = Configuration.GetSection("RabbitMQ:Hosts").Get<string[]>();

var key1 = Configuration.GetSection("array:entries")["0"];//value00

var key2 = Configuration.GetSection("array:entries").Value;
```
> `GetSection` 永远不会返回 `null`。 如果找不到匹配的节，则返回空 `IConfigurationSection`。


#### 2.1.3 GetChildren 和 Exists
```csharp
var selection = Configuration.GetSection("array:entries");
if (!selection.Exists())
{
    throw new Exception("section2 does not exist.");
}
var children = selection.GetChildren();
var strList = new List<string>();
foreach (var subSection in children)
{
    strList.Add(subSection.Key + ":key");
}
var str = JsonConvert.SerializeObject(strList);//["0:key","1:key","2:key","4:key","5:key"]
```

### 2.2 映射项到强类型对象
模型类
```csharp
public class RabbitMQConfig
{
    public const string RabbitMQ = "RabbitMQ";
    public string[] Hosts { get; set; }

    public int Port { get; set; }

    public string UserName { get; set; }

    public string Password { get; set; }

    public string VirtualHost { get; set; }
}
```
appsettings
```json
  "RabbitMQ": {
    "Hosts": [ "**.***.***.**" ],
    "Port": 5672,
    "UserName": "admin",
    "Password": "123456789",
    "VirtualHost": "myQueue"
  }
```

#### 2.2.1 映射项到模型类
```json
var info = new RabbitMQConfig();
Configuration.Bind(RabbitMQConfig.RabbitMQ, info);
//or
var info2 = new RabbitMQConfig();
//Bind方法的参数可以增加配置绑定到私有类上
Configuration.GetSection(RabbitMQConfig.RabbitMQ).Bind(info2);
//or
var info3 = Configuration.GetSection(RabbitMQConfig.RabbitMQ).Get<RabbitMQConfig>();
```

#### 2.2.2 单例注入
通过获取到绑定的配置信息，然后直接单例注入，并直接通过构造函数注入获取信息
```csharp
var appInfoRecord = new AppInfoRecord(null, null, authorRecord, null);
builder.Configuration.GetSection("AppInfo").Bind(appInfoRecord);
builder.Services.AddSingleton(appInfoRecord);

//使用
private readonly AppInfoRecord  _rabbitMQConfig;
public WeatherForecastController(AppInfoRecord  options)
{
    _rabbitMQConfig = options;
}
```

#### 绑定校验
配置内容
```csharp
  "RabbitMQ": {
    "Hosts": "195.168.1.10",
    "Port": 5672,
    "UserName": "admin",
    "Password": "123456789",
    "VirtualHost": "myQueue"
  }
```
模型类
```csharp
public class RabbitMQConfig
{
    public const string RabbitMQ = "RabbitMQ";
    public string Hosts { get; set; }

    public int Port { get; set; }

    public string UserName { get; set; }

    public string Password { get; set; }

    public string VirtualHost { get; set; }
}
```

##### 基础校验
当一些明显的错误，比如将汉字等映射到int类型这种问题，可以通过简单的修改注入配置的方法就可以实现在项目启动的时候就抛出异常
```
builder.Services.AddOptions<RabbitMQConfig>()
    .Bind(builder.Configuration.GetSection(RabbitMQConfig.RabbitMQ))
    .ValidateOnStart();
```
当你启动项目的时候，程序会直接抛出上面的异常来阻止项目启动。当然也可以进行以下自定义的校验规则，例如可以这么编写校验规则
```
builder.Services.AddOptions<RabbitMQConfig>()
    .Bind(builder.Configuration.GetSection(RabbitMQConfig.RabbitMQ))
    .Validate(t =>
    {
        // host 用户名等校验
        if (t.Port <= 0 || t.Port > 65535)
        {
            return false;
        }

        return true;
    })
    .ValidateOnStart();
```
当我们将port端口设置为负数，那么在项目启动的时候会提示：Microsoft.Extensions.Options.OptionsValidationException:“A validation error has occurred.”

##### 通过特性校验
在模型绑定和校验中我们使用类的特性来进行入参的校验以及错误信息的输出，这里我们可以同样使用特性来进行配置的校验，例如
```
public class RabbitMQConfig
{
    public const string RabbitMQ = "RabbitMQ";

    [Required]
    public string Hosts { get; set; }

    public int Port { get; set; }

    [Required]
    public string UserName { get; set; }

    [Required]
    [MinLength(6, ErrorMessage = "密码长度不能小于6位")]
    public string Password { get; set; }

    [Required]
    public string VirtualHost { get; set; }
}
```
当然我们绑定的配置也要做一些修改操作
```
builder.Services.AddOptions<RabbitMQConfig>()
    .Bind(builder.Configuration.GetSection(RabbitMQConfig.RabbitMQ))
    .ValidateDataAnnotations()
    .ValidateOnStart();
```
当我们将密码设置长度小于6位的时候，那么在项目启动的时候提示错误信息：DataAnnotation validation failed for 'RabbitMQConfig' members: 'Password' with the error: '密码长度不能小于6位'.”

##### FluentValidation
如果在你的项目中使用的是FluentValidation，那么还可以使用它来进行校验，首先我们需要先引入nuget包
```csharp
<PackageReference Include="FluentValidation.DependencyInjectionExtensions" Version="11.5.1" />
```
然后再注入服务
```csharp
builder.Services.AddValidatorsFromAssemblyContaining<Program>(ServiceLifetime.Singleton);
```
关于如何编写可以参考ValidateDataAnnotations的写法，里面大概这个样子
```
public static OptionsBuilder<TOptions> ValidateDataAnnotations<TOptions>(
  this OptionsBuilder<TOptions> optionsBuilder)
  where TOptions : class
{
  optionsBuilder.Services.AddSingleton<IValidateOptions<TOptions>>((IValidateOptions<TOptions>) new DataAnnotationValidateOptions<TOptions>(optionsBuilder.Name));
  return optionsBuilder;
}

public class DataAnnotationValidateOptions<TOptions> : IValidateOptions<TOptions> where TOptions : class
{
  /// <summary>Constructor.</summary>
  /// <param name="name">The name of the option.</param>
  public DataAnnotationValidateOptions(string name) => this.Name = name;

  /// <summary>The options name.</summary>
  public string Name { get; }

  /// <summary>
  /// Validates a specific named options instance (or all when <paramref name="name" /> is null).
  /// </summary>
  /// <param name="name">The name of the options instance being validated.</param>
  /// <param name="options">The options instance.</param>
  /// <returns>The <see cref="T:Microsoft.Extensions.Options.ValidateOptionsResult" /> result.</returns>
  public ValidateOptionsResult Validate(string name, TOptions options)
  {
    if (this.Name != null && !(name == this.Name))
      return ValidateOptionsResult.Skip;
    List<ValidationResult> validationResultList = new List<ValidationResult>();
    if (Validator.TryValidateObject((object) options, new ValidationContext((object) options, (IServiceProvider) null, (IDictionary<object, object>) null), (ICollection<ValidationResult>) validationResultList, true))
      return ValidateOptionsResult.Success;
    List<string> failures = new List<string>();
    foreach (ValidationResult validationResult in validationResultList)
      failures.Add("DataAnnotation validation failed for members: '" + string.Join(",", validationResult.MemberNames) + "' with the error: '" + validationResult.ErrorMessage + "'.");
    return ValidateOptionsResult.Fail((IEnumerable<string>) failures);
  }
}
```
所以我们可以模仿着添加OptionsBuilderDataAnnotationsExtensions文件，并编写下面的代码
```
public static class OptionsBuilderDataAnnotationsExtensions
{
    public static OptionsBuilder<TOptions> ValidtaeFluently<TOptions>(this OptionsBuilder<TOptions> optionsBuilder) where TOptions : class
    {
        optionsBuilder.Services.AddSingleton<IValidateOptions<TOptions>>(t => new FluentValidationOptions<TOptions>(optionsBuilder.Name, t.GetRequiredService<IValidator<TOptions>>()));
        return optionsBuilder;
    }
}

public class FluentValidationOptions<TOptions> : IValidateOptions<TOptions> where TOptions : class
{
    private readonly IValidator<TOptions> _validator;
    public string? Name { get; }

    public FluentValidationOptions(string? name, IValidator<TOptions> validator)
    {
        Name = name;
        _validator = validator;
    }

    public ValidateOptionsResult Validate(string name, TOptions options)
    {
        if (Name != null && Name != name)
        {
            return ValidateOptionsResult.Skip;
        }

        ArgumentNullException.ThrowIfNull(options);

        var validtaionResult = _validator.Validate(options);
        if (validtaionResult.IsValid)
        {
            return ValidateOptionsResult.Success;
        }

        var error = validtaionResult.Errors.Select(t => $"属性{t.PropertyName}验证失败，错误信息:{t.ErrorMessage};");
        return ValidateOptionsResult.Fail(error);
    }
}
```
最后我们修改关于配置绑定的地方
```
builder.Services.AddOptions<RabbitMQConfig>()
    .Bind(builder.Configuration.GetSection(RabbitMQConfig.RabbitMQ))
    .ValidtaeFluently()
    .ValidateOnStart();
```
上面一个通用的使用FluentValidation校验配置的方案已经写好了，那么我们编写这次关于rabbtimq的配置校验
```
public class RabbitMQConfig
{
    public const string RabbitMQ = "RabbitMQ";

    public string Hosts { get; set; }

    public int Port { get; set; }

    public string UserName { get; set; }

    public string Password { get; set; }

    public string VirtualHost { get; set; }
}

public class RabbitMQConfigValidator : AbstractValidator<RabbitMQConfig>
{
    public RabbitMQConfigValidator()
    {
        RuleFor(x => x.Password)
            .MinimumLength(6)
            .WithMessage("密码长度不能小于6位");
    }
}
```
上面的校验只是举例了密码长度的限制，当部署的时候，如果我们设置的密码长度小于6位，那么就会抛出异常信息：属性Password验证失败，错误信息:密码长度不能小于6位;”

### 2.3 其他类中读取
在其他类中注入IConfiguration
```csharp
private readonly IConfiguration _configuration;
public WeatherForecastController(IConfiguration configuration)
{
    _configuration = configuration;
}
```
获取配置
```csharp
Console.WriteLine($"lastTime:{_configuration["lastTime"] }");
Console.WriteLine($"Name:{_configuration["name"] }");
```
