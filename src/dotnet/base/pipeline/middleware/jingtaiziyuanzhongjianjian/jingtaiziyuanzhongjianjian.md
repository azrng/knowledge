---
title: 静态资源中间件
lang: zh-CN
date: 2023-06-27
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: jingtaiziyuanzhongjianjian
slug: qfh3d1
docsId: '30977155'
---

## 介绍
静态文件都存储在Core Web根目录中。默认目录是<content_root>/wwwroot，但可通过 UseWebRoot方法更改访问目录。而content_root是指web项目的所有文件夹，包括bin和wwwroot文件夹。

## 目的

- 支持指定相对路径
- 支持目录浏览
- 支持设置默认文档
- 支持多目录映射

## 资源操作

### 简单配置
在Configure方法中设置
```csharp
app.UseStaticFiles();//默认静态文件目录是wwwroot

//特殊配置
app.UseStaticFiles(new StaticFileOptions()
{
    ServeUnknownFileTypes = true //是否可以访问不知道的文件类型
});
```

### 修改静态文件目录
在Configure方法中设置
```csharp
StaticFiles(app, env); // 私有方法
```
StaticFiles方法
```csharp
/// <summary>
/// 设置静态文件目录
/// </summary>
/// <param name="app"></param>
/// <param name="env"></param>
/// <returns></returns>
private void StaticFiles(IApplicationBuilder app, IWebHostEnvironment env)
{
    app.UseStaticFiles();//会先去该目录查找文件，找不到了会查找下面的配置

    //静态文件重载
    app.UseStaticFiles(new StaticFileOptions
    {
        FileProvider = new PhysicalFileProvider(Path.Combine(env.ContentRootPath, "Upload")), //将目录切换到静态文件所在目录
        RequestPath = new PathString("/fileupload"), //虚拟路径用来访问静态文件（真正的访问目录）
        OnPrepareResponse = ctx =>
        {
            const int cacheControl = 60;//设置缓存静态文件的时间
            var headers = ctx.Context.Response.GetTypedHeaders();
            headers.CacheControl = new CacheControlHeaderValue
            {
                MaxAge = TimeSpan.FromSeconds(cacheControl)
            };
        }
    });
}
```
我们在项目目录下的Upload文件夹下新建一个1.txt文件，这个时候我们启动项目，就可以通过地址：http://localhost:8001/fileupload/1.txt 获取文件的内容。

### 启动访问目录
ConfigureServices中注册服务
```csharp
services.AddDirectoryBrowser();
```
Configure中启动目录浏览中间件
```csharp
app.UseDirectoryBrowser();
```
浏览展示效果
![image.png](/common/1633250518150-ceff440d-6252-4b12-84f3-6fbba6e9db85.png)

### 设置请求路径重写
如果请求的地址不是api开头，那么就重写路径转到一个默认的html界面
```csharp
app.MapWhen(context => !context.Request.Path.Value.StartsWith("/api"), appBuilder =>
{
    var option = new RewriteOptions();
    option.AddRewrite(".*", "/index.html", true);

    appBuilder.UseRewriter(option);
    appBuilder.UseStaticFiles();
});
```
如果访问的是包含api的，那么就不能访问到静态文件。

## 文件提供程序核心

### PhysicalFileProvider
物理文件提供程序
```csharp
IFileProvider provider1 = new PhysicalFileProvider(AppDomain.CurrentDomain.BaseDirectory);
var contents = provider1.GetDirectoryContents("/");
foreach (var item in contents)
{
    Console.WriteLine($"我的文件名是：{item.Name},我是否是目录{item.IsDirectory},最后修改时间{item.LastModified}");
}
```

### EmbeddedFileProvider
通过嵌入式读取来获取编译时候构建到我们程序集里面的资源
添加一个html文件，并且右键属性设置生成操作为嵌入式资源
```csharp
<ItemGroup>
  <EmbeddedResource Include="index.html" />
</ItemGroup>
```
安装组件包
```csharp
<PackageReference Include="Microsoft.Extensions.FileProviders.Embedded" Version="5.0.10" />
```
代码
```csharp
IFileProvider provider = new EmbeddedFileProvider(typeof(Program).Assembly);
var html = provider.GetFileInfo("index.html");
if (html.Exists)
{
    Console.WriteLine($"当前嵌入的文件名是：{html.Name}");
}
```

### CompositeFileProvider
组合文件提供程序，就是将各种文件提供程序组合成一个目录来访问
在上面的基础上安装组件
```csharp
 <PackageReference Include="Microsoft.Extensions.FileProviders.Composite" Version="5.0.0" />
```
展示代码
```csharp
IFileProvider provider1 = new PhysicalFileProvider(AppDomain.CurrentDomain.BaseDirectory);
var contents = provider1.GetDirectoryContents("/");
foreach (var item in contents)
{
    Console.WriteLine($"我的文件名是：{item.Name},我是否是目录{item.IsDirectory},最后修改时间{item.LastModified}");
}

IFileProvider provider2 = new EmbeddedFileProvider(typeof(Program).Assembly);
var html = provider2.GetFileInfo("" +
    "index.html");
if (html.Exists)
{
    Console.WriteLine($"当前嵌入的文件名是：{html.Name}");
}


IFileProvider provider3 = new CompositeFileProvider(provider1, provider2);
var contents3 = provider3.GetDirectoryContents("/");
foreach (var item in contents3)
{
    Console.WriteLine($"我的文件名是：{item.Name},我是否是目录{item.IsDirectory},最后修改时间{item.LastModified}");
}
```
> 提高：可以通过配置远程oss文件给CompositeFileProvider来实现就仿佛调用本地方法一样的效果。


## 资料
极客时间教程
