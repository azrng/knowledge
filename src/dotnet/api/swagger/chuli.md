---
title: 处理
lang: zh-CN
date: 2023-10-15
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: chuli
slug: nxfzksgy43a5720q
docsId: '142209379'
---

## 显示枚举注释
为了让swagger界面上显示实体类中枚举类型的注释

> 测试环境：net5.0+Swashbuckle.AspNetCore 6.1.4

枚举示例
```csharp
/// <summary>
/// 性别枚举 
/// </summary>
public enum SexEnum
{
    /// <summary>
    /// 未知
    /// </summary>
    [Description("未知")]
    Unknown = 0,

    /// <summary>
    /// 男
    /// </summary>
    [Description("男")]
    Man = 1,

    /// <summary>
    /// 女
    /// </summary>
    [Description("女")]
    Woman = 2
}
```
使用
```csharp
public class AddUserVm
{
    /// <summary>
    /// 性别 使用枚举作为该属性的类型
    /// </summary>
    public SexEnum Sex { get; set; }
}
```
默认显示
![image.png](/common/1624802827319-fbffb9cd-df25-457f-9a68-4772f73aa2a3.png)

### 操作

#### 方案一
在上面我们可以看到swagger显示的属性注释是从枚举上面获取的，所以将枚举上面的注释写详细也可以实现功能
```csharp
    /// <summary>
    /// 性别枚举  0未知  1男  2女  
    /// </summary>
    public enum SexEnum
```
展示效果
![image.png](/common/1624802480692-4622e877-9b63-466e-9587-cef53d14a3d9.png)

#### 方案二
引用组件
```csharp
<PackageReference Include="Newtonsoft.Json" Version="13.0.1" />
<PackageReference Include="Swashbuckle.AspNetCore" Version="6.1.4" />
```
创建swagger过滤器
```csharp
/// <summary>
/// swagger显示枚举处理
/// </summary>
public class SwaggerEnumSchemaFilter : ISchemaFilter
{
    /// <summary>
    /// 实现过滤器方法
    /// </summary>
    /// <param name="model"></param>
    /// <param name="context"></param>
    public void Apply(OpenApiSchema model, SchemaFilterContext context)
    {
        if (!context.Type.IsEnum) return;
        model.Enum.Clear();
        var type = context.Type;

        var str = new StringBuilder($"{model.Description}(");
        foreach (var value in Enum.GetValues(type))
        {
            var fieldInfo = type.GetField(Enum.GetName(type, value));
            var descriptionAttribute = fieldInfo.GetCustomAttribute<DescriptionAttribute>(true);
            model.Enum.Add(OpenApiAnyFactory.CreateFromJson(JsonConvert.SerializeObject(value)));

            str.Append($"{(int)value}:{descriptionAttribute?.Description}；");
        }

        str.Append(')');
        model.Description = str.ToString();
    }
}
```
> 多谢同事的帮助

使用
```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.AddControllers();
    services.AddSwaggerGen(c =>
    {
        c.SwaggerDoc("v1", new OpenApiInfo {Title = "MyWebApi", Version = "v1"});

        Directory.GetFiles(AppDomain.CurrentDomain.BaseDirectory, "*.xml").ToList()
            .ForEach(file => c.IncludeXmlComments(file, true));

        c.SchemaFilter<SwaggerEnumSchemaFilter>();//添加过滤器
    });
}
```
显示效果
![image.png](/common/1626363033556-fa6e93bf-2166-4f2c-9f93-073c1bf5f1f3.png)
> 参考文档：[https://stackoverflow.com/questions/36452468/swagger-ui-web-api-documentation-present-enums-as-strings#](https://stackoverflow.com/questions/36452468/swagger-ui-web-api-documentation-present-enums-as-strings#)


## 不显示某些接口
通过下面的过滤器来实现不显示某些接口：SwaggerDisplayFilter
```csharp
builder.Services.AddSwaggerGen(c =>
{
    c.OperationFilter<SwaggerDisplayFilter>();
});
```
详情
```csharp
public class SwaggerDisplayFilter : IDocumentFilter
{
        public void Apply(OpenApiDocument swaggerDoc, DocumentFilterContext context)
        {
            var display = new List<string>();
            //display.Add("order");  //对所有的接口进行增加条件限制只显示我们想要的接口
            if (display.Any())
                swaggerDoc.Paths.RemoveAll(x => !display.Any(p => x.Key.Contains(p, System.StringComparison.OrdinalIgnoreCase)));
                
             //或者  只显示包含conclusions的
              swaggerDoc.Paths.RemoveAll(x => !x.Key.Contains("conclusions", StringComparison.OrdinalIgnoreCase));
        }
}
    public static class CollectionExtensions
    {
        public static IList<T> RemoveAll<T>(this ICollection<T> source, Func<T, bool> predicate)
        {
            var items = source.Where(predicate).ToList();

            foreach (var item in items)
            {
                source.Remove(item);
            }

            return items;
        }
    }
```

## 响应头设置
该过滤器用于在生成的 API 文档中对每个操作（Endpoint）进行定制化处理。AddResponseHeadersFilter 操作过滤器的作用是向每个操作的响应中添加自定义的响应头（Response Headers）。通过这个操作过滤器，可以在生成的 API 文档中指定某些操作的响应头信息

该操作需要引用nuget包
```csharp
<PackageReference Include="Swashbuckle.AspNetCore.Filters" Version="7.0.11" />
```
配置如下
```csharp
builder.Services.AddSwaggerGen(c =>
{
    // 给swagger上添加响应标识说明
    c.OperationFilter<AddResponseHeadersFilter>();
});
```
然后开始使用，例如在需要显示响应头的接口上设置
```csharp
[HttpGet("content")]
[SwaggerResponseHeader(200,"identityId","string","标识id")]
public string GetStr()
{
    return "ok";
}
```
展示效果如下
![image.png](/common/1697166838355-e50270bb-fd9c-4f73-aa26-28c766247d99.png)

## 授权摘要展示
该AppendAuthorizeToSummaryOperationFilter操作过滤器的作用是将 "Authorize"（授权）信息追加到每个操作的摘要（Summary）中。通过这样的操作过滤器，可以在生成的 API 文档中快速查看哪些操作需要进行授权才能访问

该操作需要引用nuget包
```csharp
<PackageReference Include="Swashbuckle.AspNetCore.Filters" Version="7.0.11" />
```
例如在你已经配置jwt认证方案的基础上， 再增加该AppendAuthorizeToSummaryOperationFilter过滤器
```csharp
// 配置认证方式
builder.Services.AddAuthentication(xxx);

// 配置swagger
builder.Services.AddSwaggerGen(c =>
{
    // xxx jwt认证等配置
    
    c.OperationFilter<AppendAuthorizeToSummaryOperationFilter>();
});
```
然后开始使用，例如你已经在需要认证的接口上增加了自定义策略
```csharp
[Authorize(Policy = "customerPolicy")]
[HttpGet("content")]
public string GetStr()
{
    return "ok";
}
```
展示效果如下
![image.png](/common/1697178121041-7a0872c9-afee-4eb0-8d5d-13cdee0129e5.png)

## API增加安全要求
该SecurityRequirementsOperationFilter操作过滤器用于在生成的 API 文档中添加安全要求（Security Requirements），以指定哪些操作需要进行身份验证和授权，通过这个操作过滤器，可以将 "Bearer" 身份验证方案应用于需要授权才能访问的操作，并在生成的 API 文档中明确显示这种安全要求。

该操作需要引用nuget包
```csharp
<PackageReference Include="Swashbuckle.AspNetCore.Filters" Version="7.0.11" />
```
例如在你已经配置jwt认证方案的基础上， 再增加该AppendAuthorizeToSummaryOperationFilter过滤器
```csharp
// 配置认证方式
builder.Services.AddAuthentication(xxx);

// 配置swagger
builder.Services.AddSwaggerGen(c =>
{
    // xxx jwt认证等配置

    // 这个操作过滤器通过两个参数进行初始化：第一个参数为布尔类型，表示是否需要添加安全要求；第二个参数是一个 string 类型，指定要使用的身份验证方案（Scheme），在这里是 "Bearer"。
    c.OperationFilter<SecurityRequirementsOperationFilter>(true, "Bearer");
});
```
然后开始使用，例如你已经在需要认证的接口上增加了自定义策略
```csharp
[Authorize(Policy = "customerPolicy")]
[HttpGet("content")]
public string GetStr()
{
    return "ok";
}
```
展示效果如下
![image.png](/common/1697179547365-d815165a-ff27-4d36-9a61-54c0409d6d97.png)

## Long类型处理

### 目的
最近两天在给朋友讲解如何使用ajax调用接口时候，我发现我用swagger调用接口返回的long类型的数据最后几位都变成了0(例如：6974150586715898000)，本来是以为sqlite数据库不支持long类型导致我存进去的数据出了问题，然后我使用接口测试工具调用后发现数据是正确的。然后想到之前听前端同事说过他们没有long类型他们使用的字符串来处理的我返回的long类型，那么就思考如何去处理swagger这个问题吧。
> 这个这两天才发现，说明我真的好久没有swagger调用接口了，虽然展示了，然后只是展示了。


### 解决方案
既然前端同事是通过字符串来处理的，那么我当然也可以转成字符串之后再返回出去。我是使用的Newtonsoft.Json做解析Json的，所以修改默认的解析

首先我们需要修改Swashbuckle.AspNetCore.Newtonsoft包默认的解析处理DefaultContractResolver，针对long类型做特殊处理
```csharp
public class CustomContractResolver : DefaultContractResolver
{
    /// <summary>
    /// 对长整型做处理
    /// </summary>
    /// <param name="objectType"></param>
    /// <returns></returns>
    protected override JsonConverter ResolveContractConverter(Type objectType)
    {
        if (objectType == typeof(long))
        {
            return new JsonConverterLong();
        }
        return base.ResolveContractConverter(objectType);
    }
}
```
JsonConverterLong内容如下
```csharp
/// <summary>
/// Long类型Json序列化重写
/// 在js中传输会导致精度丢失，故而在序列化时转换成字符类型
/// </summary>
public class JsonConverterLong : JsonConverter
{
    /// <summary>
    /// 是否可以转换
    /// </summary>
    /// <param name="objectType"></param>
    /// <returns></returns>
    public override bool CanConvert(Type objectType)
    {
        return true;
    }

    /// <summary>
    /// 读json
    /// </summary>
    /// <param name="reader"></param>
    /// <param name="objectType"></param>
    /// <param name="existingValue"></param>
    /// <param name="serializer"></param>
    /// <returns></returns>
    public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
    {
        if ((reader.ValueType == null || reader.ValueType == typeof(long?)) && reader.Value == null)
        {
            return null;
        }
        else
        {
            _ = long.TryParse(reader.Value != null ? reader.Value.ToString() : "", out long value);
            return value;
        }
    }

    /// <summary>
    /// 写json
    /// </summary>
    /// <param name="writer"></param>
    /// <param name="value"></param>
    /// <param name="serializer"></param>
    public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
    {
        if (value == null)
            writer.WriteValue(value);
        else
            writer.WriteValue(value.ToString());
    }
}
```
在上面编写结束之后我们还需要进行配置也就是设置SerializerSettings
```csharp
services.AddControllers().AddNewtonsoftJson(options =>
{
    //时间格式化
    options.SerializerSettings.DateFormatString = "yyyy-MM-dd HH:mm:ss";
    
    //swagger显示枚举
    options.SerializerSettings.Converters.Add(new StringEnumConverter());

    // 设置自定义序列化
    options.SerializerSettings.ContractResolver = new CustomContractResolver();
});
```
最后再次使用swagger界面调用返回值已经变成了6974150586715897857，成功解决问题。

### 总结
关于这个精度丢失的问题这次是第二次遇到了，上次是使用Apifox升级之后就出现了这个问题，然后我还去提了bug，结果是因为更新之后出来了一个兼容bigint的开关并且默认是关闭状态。

## 访问包含账号密码
访问swagger的时候需要先输入账号密码

### 操作
```csharp
public class SwaggerBasicAuthMiddleware
{

    private readonly RequestDelegate next;

    public SwaggerBasicAuthMiddleware(RequestDelegate next)
    {
        this.next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        //Make sure we are hitting the swagger path, and not doing it locally as it just gets annoying :-)
        if (context.Request.Path.StartsWithSegments("/swagger") && !this.IsLocalRequest(context))
        {
            string authHeader = context.Request.Headers["Authorization"];
            if (authHeader != null && authHeader.StartsWith("Basic "))
            {
                // Get the encoded username and password
                var encodedUsernamePassword = authHeader.Split(' ', 2, StringSplitOptions.RemoveEmptyEntries)[1]?.Trim();

                // Decode from Base64 to string
                var decodedUsernamePassword = Encoding.UTF8.GetString(Convert.FromBase64String(encodedUsernamePassword));

                // Split username and password
                var username = decodedUsernamePassword.Split(':', 2)[0];
                var password = decodedUsernamePassword.Split(':', 2)[1];

                // Check if login is correct
                if (IsAuthorized(username, password))
                {
                    await next.Invoke(context);
                    return;
                }
            }

            // Return authentication type (causes browser to show login dialog)
            context.Response.Headers["WWW-Authenticate"] = "Basic";

            // Return unauthorized
            context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
        }
        else
        {
            await next.Invoke(context);
        }
    }

    public bool IsAuthorized(string username, string password)
    {
        // Check that username and password are correct
        return username.Equals("SpecialUser", StringComparison.InvariantCultureIgnoreCase)
            && password.Equals("SpecialPassword1");
    }

    public bool IsLocalRequest(HttpContext context)
    {
        //Handle running using the Microsoft.AspNetCore.TestHost and the site being run entirely locally in memory without an actual TCP/IP connection
        if (context.Connection.RemoteIpAddress == null && context.Connection.LocalIpAddress == null)
        {
            return true;
        }
        if (context.Connection.RemoteIpAddress.Equals(context.Connection.LocalIpAddress))
        {
            return true;
        }
        if (IPAddress.IsLoopback(context.Connection.RemoteIpAddress))
        {
            return true;
        }
        return false;
    }
}
public static class SwaggerAuthorizeExtensions
{
    public static IApplicationBuilder UseSwaggerAuthorized(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<SwaggerBasicAuthMiddleware>();
    }
}
```
在startup中
```csharp
app.UseAuthentication(); //Ensure this like is above the swagger stuff

app.UseSwaggerAuthorized();
app.UseSwagger();
app.UseSwaggerUI();
```

参考资料：[https://qa.1r1g.com/sf/ask/3594641291/](https://qa.1r1g.com/sf/ask/3594641291/)
