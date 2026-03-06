---
title: Autofac
lang: zh-CN
date: 2022-10-06
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: autofac
slug: ez795d
docsId: '29988191'
---

## 介绍
Autofac是一个第三方的IOC容器，管理类之间的依赖关系，使得应用程序随着大小和复杂性的增长而保持易于更改的状态。

## 基础配置

### 老版本(.net6前)
引用组件
```csharp
<PackageReference Include="Autofac" Version="6.2.0" />
<PackageReference Include="Autofac.Extensions.DependencyInjection" Version="7.1.0" />
```
在Program中设置替换原有的依赖注入
```csharp
public static IHostBuilder CreateHostBuilder(string[] args) =>
    Host.CreateDefaultBuilder(args)
    .UseServiceProviderFactory(new AutofacServiceProviderFactory())
        .ConfigureWebHostDefaults(webBuilder =>
        {
            webBuilder.UseStartup<Startup>();
        });
```
注册需要的服务
```csharp
public void ConfigureContainer(ContainerBuilder builder)
{
    builder.RegisterType<UserService>().As<IUserService>();
}
```

### 新版本
添加 Nuget 引用
```csharp
Autofac.Extensions.DependencyInjection
```
program.cs文件添加autofac的使用和注入配置
```csharp
builder.Host.UseServiceProviderFactory(new AutofacServiceProviderFactory());
builder.Host.ConfigureContainer<ContainerBuilder>(builder =>
 {
     Assembly assembly = Assembly.Load("Service.dll");
     builder.RegisterAssemblyTypes(assembly)
            //.AsImplementedInterfaces()// 无接口的注入方式
            .InstancePerDependency();
 });
```

## 生命周期
```csharp
public void ConfigureContainer(ContainerBuilder builder)
{
    // 单例模式
    builder.RegisterType<UserService>().As<IUserService>().SingleInstance();
}
```

### 瞬时模式

## 服务注册

### 反射注册

#### 按照类型注册
```csharp
builder.RegisterType<UserService>().As<IUserService>();
//builder.RegisterType(typeof(UserService)).As(typeof(IUserService));

// 注册两个实现，选择
builder.RegisterType<ConsoleLogger>().As<ILogger>();
builder.RegisterType<FileLogger>().As<ILogger>().PreserveExistingDefaults();
```

- ContainerBuilder 提供了 `Register` 方法注册组件。
- ContainerBuilder 提供了 `As`方法暴露服务。
- ContainerBuilder 提供了 `Resolve`方法解析服务。

#### 指定构造函数
如果要注入的类中包含多个构造函数，那么可以使用UsingContructor来指定构造函数
```csharp
builder.RegisterType<MyComponent>()
       .UsingConstructor(typeof(ILogger), typeof(IConfigReader));
```
必要的依赖还得自己注册

### 实例注册
特殊情况下需要预先声成对象实例并将其添加到容器中以供注册组件使用。
```csharp
builder.RegisterInstance(new UserService()).As<IUserService>();
```
控制器中使用
```csharp
public IUserService _userService { get; set; }

/// <summary>
/// 查询用户列表
/// </summary>
/// <returns></returns>
[HttpGet]
public async Task<ActionResult<List<User>>> GetListAsync()
{
      var result = await _userService.GetListAsync();
      return Ok(result);
}
```

### Lambda表达式组件
当组件创建逻辑超出简单的构造函数是，更推荐接受委托或者lambda表达式以用作组件创建者。
```csharp
builder.Register(c => new A(c.Resolve<B>()));
```
> 不明白：[https://autofac.readthedocs.io/en/latest/register/registration.html#lambda-expression-components](https://autofac.readthedocs.io/en/latest/register/registration.html#lambda-expression-components)


### 属性注册
修改ConfigureServices配置
```csharp
public void ConfigureServices(IServiceCollection services)
{
    //替换控制器的所有者
    services.Replace(ServiceDescriptor.Transient<IControllerActivator, ServiceBasedControllerActivator>());
    services.AddControllers();
}
```
如果不替换注入的服务会是null，因为控制器本身的实例是由框架创建的，不是由容器所有。
> 参考文档：[https://mp.weixin.qq.com/s/qcBci3iXaPBtsJsPyZnd8w](https://mp.weixin.qq.com/s/qcBci3iXaPBtsJsPyZnd8w)

注入
```csharp
public void ConfigureContainer(ContainerBuilder builder)
{
    //找到所有的controller进行注册，并使用属性注入功能
    var controllerTypesInassembly = typeof(Startup).Assembly.GetExportedTypes()
        .Where(type => typeof(ControllerBase).IsAssignableFrom(type)).ToArray();
    builder.RegisterTypes(controllerTypesInassembly).PropertiesAutowired();

    //属性注册
    builder.RegisterType<UserService>().As<IUserService>().PropertiesAutowired();
}
```
Configure中获取
```csharp
            var containerBuilder = new ContainerBuilder();
            containerBuilder.RegisterType<UserService>().As<IUserService>().PropertiesAutowired();
            var container = containerBuilder.Build();
            var service = container.Resolve<IUserService>();//获取服务
            var info = service.GetInfo();
```
控制器中获取
```csharp
public IUserService _userService { get; set; }

/// <summary>
/// 查询用户列表
/// </summary>
/// <returns></returns>
[HttpGet]
public async Task<ActionResult<List<User>>> GetListAsync()
{
      var result = await _userService.GetListAsync();
      return Ok(result);
}
```

### 泛型注册
```csharp
builder.RegisterGeneric(typeof(NHibernateRepository<>))
       .As(typeof(IRepository<>))
       .InstancePerLifetimeScope();
```

### 程序集注册
```csharp
public void ConfigureContainer(ContainerBuilder builder)
{
    var basePath = AppDomain.CurrentDomain.BaseDirectory;//获取项目路径
    var servicesDllFile = Path.Combine(basePath, "Net5ByDocker.dll");
    var assemblysServices = Assembly.LoadFrom(servicesDllFile);//直接采用加载文件的方法
    builder.RegisterAssemblyTypes(assemblysServices)//获取程序集内所有类
        .Where(t => t.Name.EndsWith("Service") && t.IsClass)//增加注册类限定
        .PublicOnly()//限定是public访问权限的
        .AsImplementedInterfaces();

}
```

## 基础配置
```csharp
public void ConfigureContainer(ContainerBuilder containerBuilder)
{
    //反射注册
    containerBuilder.RegisterType<UserService>().As<IUserService>();
    //属性注册
    containerBuilder.RegisterType<UserService>().As<IUserService>().PropertiesAutowired();

    //注册实现 以下四种写法是等效的
    //containerBuilder.RegisterType<UserService>();
    //containerBuilder.RegisterType<UserService>().AsSelf();
    //containerBuilder.RegisterType<UserService>().As<UserService>();
    //containerBuilder.RegisterType<UserService>().As(typeof(UserService));
}
```
直接注入整个程序集
```csharp
public void ConfigureContainer(ContainerBuilder builder)
{
    var basePath = AppDomain.CurrentDomain.BaseDirectory;//获取项目路径
    var servicesDllFile = Path.Combine(basePath, "Net5ByDocker.dll");
    var assemblysServices = Assembly.LoadFrom(servicesDllFile);//直接采用加载文件的方法
    builder.RegisterAssemblyTypes(assemblysServices)//获取程序集内所有类
        .Where(t => t.Name.EndsWith("Service") && t.IsClass)//增加注册类限定
        .PublicOnly()//限定是public访问权限的
        .AsImplementedInterfaces();

}
```

## 注册方式
> 注意：需要安装组件Autofac

```csharp
    /// <summary>
    /// 用户接口
    /// </summary>
    public interface IUserService
    {
        string GetName();
    }

    /// <summary>
    /// 用户实现
    /// </summary>
    public class UserService : IUserService
    {
        public string GetName()
        {
            return "AZRNG";
        }
    }
```

### 构造函数注入
反射注册
```csharp
public void ConfigureContainer(ContainerBuilder builder)
{
    builder.RegisterType<UserService>().As<IUserService>();
    //builder.RegisterType(typeof(UserService)).As(typeof(IUserService));
}
```
使用
```csharp
        private readonly IUserService _userService;
        public UserController(IUserService  userService)
        {
            _userService = userService;
        }

        [HttpGet]
        public ActionResult GetName()
        {
            return Ok(_userService.GetName());
        }
```

### 基于名称注册
注册
```csharp
public void ConfigureContainer(ContainerBuilder builder)
{
    //命名注册  比如想将一个服务注册多次，这个时候可以使用名称来区分
    builder.RegisterType<UserService>().Named<IUserService>("userService");
}
```
Configure中获取
```csharp
AutofacContainer = app.ApplicationServices.GetAutofacRoot();
var service = AutofacContainer.ResolveNamed<IUserService>("userService");
var list = service.GetListAsync().GetAwaiter().GetResult();
```

### 属性注册

注入

### 基于动态代理AOP


### 方法注入
![image.png](/common/1612940477013-50250d61-01c1-47aa-a3d6-db5aadf175fc.png)

## 获取服务

### Configure获取服务
```csharp
public ILifetimeScope AutofacContainer { get; private set; }
public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
{
    if (env.IsDevelopment())
    {
        app.UseDeveloperExceptionPage();
    }
    #region autofac
        AutofacContainer = app.ApplicationServices.GetAutofacRoot();
    // var service=AutofacContainer.Resolve<IUserService>(); // 获取服务
    var service = AutofacContainer.ResolveNamed<IUserService>("userService");// 获取指定名称的服务
    var list = service.GetListAsync().GetAwaiter().GetResult();
    //using (var myscope = AutofacContainer.BeginLifetimeScope("myscope"))
    //{
    //    var userserice1 = myscope.Resolve<UserService>();
    //    using (var scope = myscope.BeginLifetimeScope())
    //    {
    //        var userService2 = scope.Resolve<UserService>();
    //        // 不管我们再怎么创建子容器的生命周期，得到的都是同一个对象
    //        Console.WriteLine(userserice1 == userService2);
    //    }
    //}

    #endregion
        app.UseRouting();
    app.UseAuthorization();

    app.UseEndpoints(endpoints =>
                     {
                         endpoints.MapControllers();
                     });
}
```










Netcore3.x之前的代码
```csharp
public IServiceProvider ConfigureServices(IServiceCollection services)
{
    // 第一步：替换系统默认Controller创建器（否则Controller下面无法使用属性注入）
    // 在 services.AddMvc() 之前
    services.Replace(ServiceDescriptor.Transient<IControllerActivator, ServiceBasedControllerActivator>());
    services.AddMvc();
 
    var builder = new ContainerBuilder();
    // 第二步：找到所有Controller的类型
    // 通过Autofac对Controller类型进行属性注册 PropertiesAutowired()
    var assembly = this.GetType().GetTypeInfo().Assembly;
    var manager = new ApplicationPartManager();
    manager.ApplicationParts.Add(new AssemblyPart(assembly));
    manager.FeatureProviders.Add(new ControllerFeatureProvider());
    var feature = new ControllerFeature();
    manager.PopulateFeature(feature);
    builder.RegisterTypes(feature.Controllers.Select(ti => ti.AsType()).ToArray()).PropertiesAutowired();
    // 第三步：配置 ContainerBuilder，返回 IServiceProvider 
    builder.Populate(services);
    return new AutofacServiceProvider(builder.Build());
}
```
Netcore 3.x之后
在Nuget中引入两个**：Autofac.Extras.DynamicProxy**（Autofac的动态代理，它依赖Autofac，所以可以不用单独引入Autofac）**、Autofac.Extensions.DependencyInjection**（Autofac的扩展），注意是最新版本的。
在**startup文件中增加一个方法，用来配置Autofac服务容器**
```csharp
        public void ConfigureContainer(ContainerBuilder builder)
        {
            var basePath = Microsoft.DotNet.PlatformAbstractions.ApplicationEnvironment.ApplicationBasePath;

            //直接注册某一个类和接口
            //左边的是实现类，右边的As是接口
            builder.RegisterType<AdvertisementServices>().As<IAdvertisementServices>();

            //注册要通过反射创建的组件
            var servicesDllFile = Path.Combine(basePath, "Services.dll");
            var assemblysServices = Assembly.LoadFrom(servicesDllFile);

            builder.RegisterAssemblyTypes(assemblysServices)
                      .AsImplementedInterfaces()
                      .InstancePerLifetimeScope()
                      .EnableInterfaceInterceptors();
        }
```

### 

## 参考文档
> [https://www.yuque.com/wangjie-iwmmn/hg173a/gk5rw0](https://www.yuque.com/wangjie-iwmmn/hg173a/gk5rw0)

[AutoFac三种注入方式：按类型、按名称、按键](http://www.cnblogs.com/wolegequ/archive/2012/06/03/2532605.html)
[Asp.Net Core 2.0 之旅---AutoFacIOC容器的使用教程（批量注入）](https://blog.csdn.net/huanghuangtongxue/article/details/78914306)
[Asp.Net Core 2.0 之旅---AutoFac仓储泛型的依赖注入（泛型注入）](https://blog.csdn.net/huanghuangtongxue/article/details/78937494)
[Asp.Net Core 2.0 之旅---数据访问仓储模式的事务管理（uow+rp）](https://blog.csdn.net/huanghuangtongxue/article/details/79215136)
