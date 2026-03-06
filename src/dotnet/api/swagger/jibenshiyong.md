---
title: 基本使用
lang: zh-CN
date: 2023-10-13
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: jibenshiyong
slug: ykh24k
docsId: '30112298'
---

## 概述
Swagger 是一个规范和完整的框架，用于生成、描述、调用和可视化 RESTful 风格的 Web 服务。日常可以用于后端开发人员测试接口或者前后端联调使用。从.net5开始，swagger已经集成到vs2019编译器中，可以通过勾对选项“启用OpenAPI支持”显示基本的swagger配置。
> 本文示例环境：vs2019、net5


## 1 基本使用
新建一个netcore api项目，为了测试效果，我多创建几个控制器
![image.png](/common/1620911118372-0d629e1a-bc7a-41ec-9cc2-ea375da45497.png)

### 1.1 安装组件
```csharp
  <ItemGroup>
    <PackageReference Include="Swashbuckle.AspNetCore" Version="5.6.3" />
  </ItemGroup>
```

### 1.2 注册swagger服务
在ConfigureServices中
```csharp
public void ConfigureServices(IServiceCollection services)
{
	services.AddControllers();
	services.AddSwaggerGen(c =>
	{
		c.SwaggerDoc("v1", new OpenApiInfo { Title = "WebApi", Version = "v1" });
	});
}
```
> 注意：
>     //netcore3.0之前版本用法
>    c.SwaggerDoc("v1", new Info { Title = "WebApi", Version = "v1" });


### 1.3 使用Swagger
```csharp
public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
{
	if (env.IsDevelopment())
	{
		app.UseDeveloperExceptionPage();
		//启用中间件以将生成的swagger公开为json终结点
		app.UseSwagger();
		//启用swagger-ui中间件，指定swagger json终结点，以公开交互文档
		app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "WebApi v1"));
	}

	app.UseRouting();
	app.UseAuthorization();
	app.UseEndpoints(endpoints =>
	{
		endpoints.MapControllers();
	});
}
```
> 该示例代码配置的swagger只在Development环境下显示，可以根据实际情况来修改


### 1.4 启动
运行项目，展示下面的效果
![image.png](/common/1620911384343-f5f7d430-9fe1-449c-997a-f5452129351b.png)
如果这是你写的接口，这个时候你的其他同事去看，真的会一脸懵逼，你这写的都是啥玩意，那么我们来给这加上注释吧。
```csharp
/// <summary>
/// 用户控制器
/// </summary>
[Route("api/[controller]")]
[ApiController]
public class UserController : ControllerBase
{
	/// <summary>
	///查询用户列表
	/// </summary>
	/// <returns></returns>
	[HttpGet]
	public IEnumerable<string> Get()
	{
		return new string[] { "value1", "value2" };
	}

	/// <summary>
	/// 查询用户详情
	/// </summary>
	/// <param name="id"></param>
	/// <returns></returns>
	[HttpGet("{id}")]
	public string Get(int id)
	{
		return "value";
	}

	/// <summary>
	/// 删除用户
	/// </summary>
	/// <param name="id"></param>
	[HttpDelete("{id}")]
	public void Delete(int id)
	{
	}
}
```
这样子加了注释还不行，swagger还读取不到我们的注释，我们还需要生成xml文档并且让swagger使用，选中项目右键属性=>生成=>xml文档文件
![image.png](/common/1620911528034-b1bce7f0-904a-4e68-8ecb-0aab22b1a2c0.png)
或者直接双击项目名称，修改配置文件
```plsql

<Project Sdk="Microsoft.NET.Sdk.Web">
  <PropertyGroup>
    <TargetFramework>net5.0</TargetFramework>
    <GenerateDocumentationFile>True</GenerateDocumentationFile>
  </PropertyGroup>
  <ItemGroup>
    <PackageReference Include="Swashbuckle.AspNetCore" Version="6.2.3" />
  </ItemGroup>
</Project>
```
修改注入swagger配置
```csharp
services.AddSwaggerGen(c =>
{
	c.SwaggerDoc("v1", new OpenApiInfo { Title = "WebApi", Version = "v1" });

	// 使用反射获取xml文件。并构造出文件的路径
	var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
	var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
	// 启用xml注释.第二个参数启用控制器的注释，默认为false.
	c.IncludeXmlComments(xmlPath, true);
	
	//或者循环获取xml文件配置
	Directory.GetFiles(AppDomain.CurrentDomain.BaseDirectory, "*.xml").ToList().ForEach(file =>
	{
		c.IncludeXmlComments(file);
	});
});
```
再次启动项目查看界面
![image.png](/common/1620911727783-4928587f-ca55-4c98-a17a-dbabcf8b51e3.png)
至此，基础的配置swagger显示注释已经实现了，那么如何调用我们接口那？
![image.png](/common/1620911856379-67201b81-87b9-4559-a217-2321feb43b3d.png)
通过该界面，我们可以看到请求地址、请求方式、入参类型、输出参数等。
> 注：
> 通过设置取消显示警告：1591 ， 可以去除方法和类上面的xml注释警告
> 如果实体类不在当前程序集下，需要同样方式配置实体类程序集的xml文档到swagger配置


### 1.5 不显示某些接口
通过一些特性，可以标记不显示某一些接口
```csharp
//忽略显示接口
[ApiExplorerSettings(IgnoreApi =true)]
 
//废弃接口
[Obsolete("该接口不再使用")]
```

## 2. swagger传递JWT
> jwt是一个基于json的、用于在网络上声明某种主张的令牌，通常是用三部分组成：**头信息，消息体，签名**。他是一种双方之间传递安全信息的表述性声明规范。可以做权限验证的工具，但是目的不是为了数据加密和保护。虽然看似像是加密的数据，但是它并没有加密，不适合存储机密信息。

如果我们接口是需要传递token才可以访问，那么我们就需要对我们的swagger配置再进行改造
```csharp
services.AddSwaggerGen(c =>
{
	c.SwaggerDoc("v1", new OpenApiInfo {Title = "WebApi", Version = "v1"});

	// 使用反射获取xml文件。并构造出文件的路径
	var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
	var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
	// 启用xml注释.第二个参数启用控制器的注释，默认为false.
	c.IncludeXmlComments(xmlPath, true);

	c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme()
	{
		Description = "JWT授权(数据将在请求头中进行传输) 在下方输入Bearer {token} 即可，注意两者之间有空格",
		Name = "Authorization", //jwt默认的参数名称
		In = ParameterLocation.Header, //jwt默认存放Authorization信息的位置(请求头中)
		Type = SecuritySchemeType.ApiKey,
	});
	c.AddSecurityRequirement(new OpenApiSecurityRequirement
	{
		{
			new OpenApiSecurityScheme
			{
				Reference = new OpenApiReference()
				{
					Id = "Bearer",
					Type = ReferenceType.SecurityScheme
				}
			},
			Array.Empty<string>()
		}
	});
});
```
或者修改上面的配置为
```csharp
builder.Services.AddSwaggerGen(c =>
{
    // 添加文档信息
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "SimpleJWTWeb", Version = "v1" });

    #region 读取xml信息

    // 使用反射获取xml文件。并构造出文件的路径
    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    // 启用xml注释. 该方法第二个参数启用控制器的注释，默认为false.
    c.IncludeXmlComments(xmlPath, true);

    #endregion 读取xml信息

    #region 添加header验证信息

    //另一种写法
    var schema = new OpenApiSecurityScheme()
    {
        Description = "JWT授权(数据将在请求头中进行传输) 在下方输入Bearer {token} 即可，注意两者之间有空格",
        Name = "Authorization", //jwt默认的参数名称
        In = ParameterLocation.Header, //jwt默认存放Authorization信息的位置(请求头中)
        Type = SecuritySchemeType.ApiKey,
        Reference = new OpenApiReference
        {
            Id = "Bearer",
            Type = ReferenceType.SecurityScheme
        }
    };

    c.AddSecurityDefinition("Bearer", schema);

    var requirement = new OpenApiSecurityRequirement
    {
        [schema] = new List<string>()
    };
    c.AddSecurityRequirement(requirement);

    #endregion 添加header验证信息
});
```
运行，查看界面，发现界面有所不同
![image.png](/common/1620913001521-24c778d7-44e6-4160-8dad-9371c1002847.png)
虽然我手上没有token，但是我也没有写校验token的代码，所以我们就暂且看为一个头部传递的工具使用。jwt具体使用后续再讲。

> token传递方式就是在Headers增加  Authorization:Bearer {token}  ，然后需要在程序中配置校验token，当下我们只是模拟swagger在header中传递值。

在输入框输出：  Bearer AABBCC
在Action中获取我们传输的数据
```csharp
var token = HttpContext.Request.Headers["Authorization"];
```
![image.png](/common/1620913403862-f7762ceb-241b-4bb6-846e-a5d213d1ab0f.png)

## 其他配置

### swagger界面设置接口的响应模型

如果你使用的返回值是IActionResult，那么就可以使用ProducesResponseType来显式指定返回模型

```c#
/// <summary>
///查询用户列表
/// </summary>
/// <returns></returns>
[HttpGet]
[ProducesResponseType(typeof(IEnumerable<string>), 200)]
public IActionResult Get()
{
    return Ok(new string[] { "value1", "value2" });
}
```

### 设置永久授权

```c#
app.UseSwaggerUI(c =>
{
    //指定Swagger JSON文件的终结点，用于加载和显示API文档。
    //需要提供JSON文件的URL和一个可识别的名称
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
   
    //启用永久授权
    c.EnablePersistAuthorization(); 
});
```

### 请求时间控制

```c#
app.UseSwaggerUI(c =>
{
    //指定Swagger JSON文件的终结点，用于加载和显示API文档。
    //需要提供JSON文件的URL和一个可识别的名称
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
    
   //控制Try It Out请求的请求持续时间（以毫秒为单位）的显示
    c.DisplayRequestDuration();
});
```

### UI路由

```c#
app.UseSwaggerUI(c =>
{
    //指定Swagger JSON文件的终结点，用于加载和显示API文档。
    //需要提供JSON文件的URL和一个可识别的名称
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
    
   //指定swagger文档的启动目录 。默认为swagger
   //可以通过设置为空字符串来让Swagger UI直接在根路径下进行访问
   //c.RoutePrefix = string.Empty;
});
```

### 文档展开方式

```c#
//设置默认的接口文档展开方式，可选值包括None、List和Full。
//默认值为None，表示不展开接口文档；
//List表示只展开接口列表；
//Full表示展开所有接口详情
c.DocExpansion(DocExpansion.None); // 设置为完整模式 
c.DisplayRequestDuration();
c.EnablePersistAuthorization();
```

## 3 参考文档

[https://docs.microsoft.com/zh-cn/aspnet/core/tutorials/web-api-help-pages-using-swagger?view=aspnetcore-5.0](https://docs.microsoft.com/zh-cn/aspnet/core/tutorials/web-api-help-pages-using-swagger?view=aspnetcore-5.0)
> 关于swagger的使用操作还有很多，上面有些配置也没有详细说到，只说了一些功能性的操作。更详细操作需要自行学习。


## 4 其他文章学习
> [https://www.cnblogs.com/shanfeng1000/p/13476831.html](https://www.cnblogs.com/shanfeng1000/p/13476831.html)

