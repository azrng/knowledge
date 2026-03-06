---
title: 版本控制
lang: zh-CN
date: 2022-10-27
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: banbenkongzhi
slug: mg960f
docsId: '30113114'
---

### 1. 安装组件
```csharp
    <PackageReference Include="Microsoft.AspNetCore.Mvc.Versioning" Version="4.2.0" />
    <PackageReference Include="Microsoft.AspNetCore.Mvc.Versioning.ApiExplorer" Version="4.2.0" />
    <PackageReference Include="Swashbuckle.AspNetCore" Version="5.6.3" />
```

### 2. 设置版本

#### 2.1 控制器设置版本
```csharp
namespace NetCore_SwaggerVersion.Controllers.v1
{
    /// <summary>
    /// 版本1.1
    /// </summary>
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    [ApiVersion("1.0")]
    [ApiVersion("1.1")]//定义控制器提供哪个版本的API
    public class TestController : ControllerBase
 
namespace NetCore_SwaggerVersion.Controllers.v2
{
    /// <summary>
    /// 版本2.0
    /// </summary>
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    [ApiVersion("2.6")]
    public class TestController : ControllerBase
    
namespace NetCore_SwaggerVersion.Controllers
{
    [ApiVersionNeutral]//不受版本控制
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class WeatherForecastController : ControllerBase
```

#### 2.2 特定方法设置版本
```csharp
[MapToApiVersion("1.1")]
[HttpGet]
public IEnumerable<string> Get()
```

#### 2.3 设置不受版本控制
```csharp
    [ApiVersionNeutral]//退出版本控制
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class WeatherForecastController : ControllerBase
```

### 3. 配置Startup类

### 3.1 方案一

#### 3.1.1  添加新成员 
用来获取API版本信息
```csharp
        /// <summary>
        /// Api版本信息
        /// </summary>
        private IApiVersionDescriptionProvider _provider;
```

#### 3.1.2 在 ConfigureServices 中
```csharp
            //Versioning用来实现API的版本控制
            services.AddApiVersioning(options =>
            {
                options.DefaultApiVersion = new ApiVersion(1, 0);//默认版本号 大版本/小版本
                options.AssumeDefaultVersionWhenUnspecified = true;//此选项将用于不提供版本的请求，默认情况下假定API的版本为1.0
                options.ReportApiVersions = true;//当设置为true时候，api将返回响应标头中支持的版本信息
            });
            //Versioning.ApiExplorer用来实现元数据的发现工作
            services.AddVersionedApiExplorer(options =>
            {
                options.GroupNameFormat = "'v'VVV";//定义了版本号的格式化方式
                options.SubstituteApiVersionInUrl = true;
            });
            /*
                AddApiVersioning，主要用来配置向前兼容，定义了如果没有带版本号的访问，会默认访问v1.0的接口。
                AddVersionedApiExplorer用来添加API的版本管理，并定义了版本号的格式化方式，以及兼容终结点上带版本号的方式。
             */

            services.AddControllers();

            _provider = services.BuildServiceProvider().GetRequiredService<IApiVersionDescriptionProvider>();
            services.AddSwaggerGen(c =>
            {
                foreach (var item in _provider.ApiVersionDescriptions)
                {
                    c.SwaggerDoc(item.GroupName, new OpenApiInfo { Title = "Demo", Version = item.ApiVersion.ToString(), Description = "切换版本请点右上角版本切换" });
                }
                var xmlPath = Path.Combine(AppContext.BaseDirectory, $"{AppDomain.CurrentDomain.FriendlyName}.xml");
                c.IncludeXmlComments(xmlPath);
            });
```
> 注意：
>  _`provider = services.BuildServiceProvider().GetRequiredService<IApiVersionDescriptionProvider>();`会提示“ ASP0000 从应用程序代码调用“BuildServiceProvider”会导致创建单一实例服务的其他副本。 考虑依赖项注入服务等替代项作为“Configure”的参数。”


#### 3.1.3 Configure使用服务
```csharp
 public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c =>
                {
                    foreach (var item in _provider.ApiVersionDescriptions)
                    {
                        c.SwaggerEndpoint($"/swagger/{item.GroupName}/swagger.json", "Version：" + item.GroupName.ToUpperInvariant());
                    }
                });
            }

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
```
至此已经完成了版本控制+swagger。

### 3.2 方案二

#### 3.2.1 添加扩展类
```csharp
    /// <summary>
    /// swagger扩展
    /// </summary>
    internal class ConfigureSwaggerOptions : IConfigureOptions<SwaggerGenOptions>
    {
        private readonly IApiVersionDescriptionProvider _provider;
        public ConfigureSwaggerOptions(IApiVersionDescriptionProvider provider) => _provider = provider;

        public void Configure(SwaggerGenOptions options)
        {
            foreach (var description in _provider.ApiVersionDescriptions)
            {
                options.SwaggerDoc(description.GroupName, CreateInfoForApiVersion(description));
            }
        }

        private OpenApiInfo CreateInfoForApiVersion(ApiVersionDescription description)
        {
            var info = new OpenApiInfo()
            {
                Title = "Demo",
                Version = description.ApiVersion.ToString(),
                Description = "API 文档"
            };

            if (description.IsDeprecated)
            {
                info.Description += " 方法被弃用.";
            }
            return info;
        }
    }
    
 internal class SwaggerDefaultValues : IOperationFilter
    {
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            var apiDescription = context.ApiDescription;
            operation.Deprecated |= apiDescription.IsDeprecated();

            if (operation.Parameters == null)
                return;

            foreach (var parameter in operation.Parameters)
            {
                var description = apiDescription.ParameterDescriptions.First(p => p.Name == parameter.Name);
                if (parameter.Description == null)
                {
                    parameter.Description = description.ModelMetadata?.Description;
                }

                if (parameter.Schema.Default == null && description.DefaultValue != null)
                {
                    parameter.Schema.Default = new OpenApiString(description.DefaultValue.ToString());
                }

                parameter.Required |= description.IsRequired;
            }
        }
    }
```

#### 3.2.2 在 ConfigureServices 中
```csharp
            //Versioning用来实现API的版本控制
            services.AddApiVersioning(options =>
            {
                options.DefaultApiVersion = new ApiVersion(1, 0);//默认版本号 大版本/小版本
                options.AssumeDefaultVersionWhenUnspecified = true;//此选项将用于不提供版本的请求，默认情况下假定API的版本为1.0
                options.ReportApiVersions = true;//当设置为true时候，api将返回响应标头中支持的版本信息
            });
            //Versioning.ApiExplorer用来实现元数据的发现工作
            services.AddVersionedApiExplorer(options =>
            {
                options.GroupNameFormat = "'v'VVV";//定义了版本号的格式化方式
                options.SubstituteApiVersionInUrl = true;
            });
            /*
                AddApiVersioning，主要用来配置向前兼容，定义了如果没有带版本号的访问，会默认访问v1.0的接口。
                AddVersionedApiExplorer用来添加API的版本管理，并定义了版本号的格式化方式，以及兼容终结点上带版本号的方式。
             */

            services.AddControllers();

            services.AddTransient<IConfigureOptions<SwaggerGenOptions>, ConfigureSwaggerOptions>();
            services.AddSwaggerGen(options => options.OperationFilter<SwaggerDefaultValues>());
```

#### 3.2.3 Configure使用服务
```csharp
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, IApiVersionDescriptionProvider provider)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c =>
                {
                    foreach (var item in provider.ApiVersionDescriptions)
                    {
                        c.SwaggerEndpoint($"/swagger/{item.GroupName}/swagger.json", "Version：" + item.GroupName.ToUpperInvariant());
                    }
                });
            }

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
```
> 注意:传入IApiVersionDescriptionProvider provider

至此已经完成了版本控制+swagger。

### 4 访问接口
接口地址
```csharp
http://localhost:5000/api/v1.0/Test
http://localhost:5000/api/v1.1/Test
http://localhost:5000/api/v2.6/Test
http://localhost:5000/api/WeatherForecast/Get 不受版本控制
```
> 必须写版本号，如果不写也没有设置不受版本控制，那么就会提示404


### 5 参考文档
> 借鉴于：[https://www.cnblogs.com/tiger-wang/p/14167625.html](https://www.cnblogs.com/tiger-wang/p/14167625.html)


