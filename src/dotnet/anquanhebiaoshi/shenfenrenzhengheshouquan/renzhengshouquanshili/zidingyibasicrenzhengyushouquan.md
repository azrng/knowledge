---
title: 自定义Basic认证与授权
lang: zh-CN
date: 2023-08-04
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: zidingyibasicrenzhengyushouquan
slug: yo7ig1
docsId: '64858670'
---

## 开篇语
文章内容基于陈晴阳老师的一篇文章，在原来基础上增加一些自己的见解与代码拓展。
> 本文示例环境：VS2022+.Net6


## 概述
ASP.NET Core的认证与授权已经不是什么新鲜事了，微软官方的文档对于如何在ASP.NET Core中实现认证与授权有着非常详细深入的介绍。但有时候在开发过程中，我们也往往会感觉无从下手，或者由于一开始没有进行认证授权机制的设计与规划，使得后期出现一些混乱的情况。这里我就尝试结合一个实际的例子，从0到1来介绍ASP.NET Core中如何实现自己的认证与授权机制。
当我们使用Visual Studio自带的ASP.NET Core Web API项目模板新建一个项目的时候，Visual Studio会问我们是否需要启用认证机制，如果你选择了启用，那么Visual Studio会在项目创建的时候，加入一些辅助依赖和一些辅助类，比如加入对Entity Framework以及ASP.NET Identity的依赖，以帮助你实现基于Entity Framework和ASP.NET Identity的身份认证。如果你还没有了解过ASP.NET Core的认证与授权的一些基础内容，那么当你打开这个由Visual Studio自动创建的项目的时候，肯定会一头雾水，不知从何开始，你甚至会怀疑自动创建的项目中，真的是所有的类或者方法都是必须的吗？所以，为了让本文更加简单易懂，我们还是选择不启用身份认证，直接创建一个最简单的ASP.NET Core Web API应用程序，以便后续的介绍。

## 操作
新建一个ASP.NET Core Web API应用程序，这里我是在Linux下使用JetBrains Rider新建的项目，也可以使用标准的Visual Studio或者VSCode来创建项目。创建完成后，运行程序，然后使用浏览器访问/WeatherForecast端点，就可以获得一组随机生成的天气及温度数据的数组。你也可以使用下面的curl命令来访问这个API：
```csharp
curl -X GET "http://localhost:5000/WeatherForecast" -H  "accept: text/plain"
```
现在让我们在WeatherForecastController的Get方法上设置一个断点，重新启动程序，仍然发送上述请求以命中断点，此时我们比较关心User对象的状态，打开监视器查看User对象的属性，发现它的IsAuthenticated属性为false：
![image.png](/common/1642087583469-a8c82076-b903-4ce5-82bc-989831607e39.png)
在很多情况下，我们可能并不需要在Controller的方法中获取认证用户的信息，因此也从来不会关注User对象是否真的处于已被认证的状态。但是当API需要根据用户的某些信息来执行一些特殊逻辑时，我们就需要在这里让User的认证信息处于一种合理的状态：它是已被认证的，并且包含API所需的信息。这就是本文所要讨论的ASP.NET Core的认证与授权。

### 认证
应用程序对于使用者的身份认定包含两部分：认证和授权。认证是指当前用户是否是系统的合法用户，而授权则是指定合法用户对于哪些系统资源具有怎样的访问权限。我们先来看如何实现认证。
在此，我们单说由ASP.NET Core应用程序本身实现的认证，不讨论具有统一Identity Provider完成身份认证的情况（比如单点登录），这样的话就能够更加清晰地了解ASP.NET Core本身的认证机制。接下来，我们尝试在ASP.NET Core应用程序上，实现Basic认证。
Basic认证需要将用户的认证信息附属在HTTP请求的Authorization的头（Header）上，认证信息是一串由用户名和密码通过BASE64编码(Id和密码冒号隔开组成字符串，然后Base64编码)后所产生的字符串，例如，当你采用Basic认证，并使用dotnet和password作为访问WeatherForecast API的用户名和密码时，你可能需要使用下面的命令行来调用WeatherForecast：
```csharp
curl --location --request GET 'http://localhost:5251/WeatherForecast/get' --header 'Authorization: Basic ZG90bmV0OnBhc3N3b3Jk'
```
在ASP.NET Core Web API中，当应用程序接收到上述请求后，就会从Request的Header里读取Authorization的信息，然后BASE64解码得到用户名和密码，然后访问数据库来确认所提供的用户名和密码是否合法，以判断认证是否成功。这部分工作通常可以采用ASP.NET Core Identity框架来实现，不过在这里，为了能够更加清晰地了解认证的整个过程，我们选择自己动手来实现。
首先，我们定义一个User对象，并且预先设计好几个用户，以便模拟存储用户信息的数据库，这个User对象的代码如下：
```csharp
public class User
{
    public string UserName { get; set; }

    public string Password { get; set; }

    public IEnumerable<string> Roles { get; set; }

    public int Age { get; set; }

    public override string ToString() => UserName;

    public static readonly User[] AllUsers =
    {
        new User
        {
            UserName = "admin", Password = "admin", Age = 29, Roles = new[] { "admin", "super_admin" }
        },
        new User
        {
            UserName = "zyp", Password = "123456", Age = 10, Roles = new[] { "admin", "super_admin" }
        },

    };
}
```
该User对象包括用户名、密码以及它的角色名称，不过暂时我们不需要关心角色信息。User对象还包含一个静态字段，我们将它作为用户信息数据库来使用。
接下来，我们模仿一下Jwt认证方式是如何操作的，首先Jwt认证的方式会先调用AddAuthentication(在命名空间Microsoft.AspNetCore.Authentication下)传递一个Scheme最后赋值给AuthenticationOptions的DefaultScheme，此处传的是Bearer，然后调用了AddJwtBearer方法。	
```csharp
services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
			.AddJwtBearer();
```
进入AddJwtBearer方法我们看到最后调用的是
```csharp
public static AuthenticationBuilder AddJwtBearer(
  this AuthenticationBuilder builder,
  string authenticationScheme,
  string? displayName,
  Action<JwtBearerOptions> configureOptions)
{
  builder.Services.TryAddEnumerable(ServiceDescriptor.Singleton<IPostConfigureOptions<JwtBearerOptions>, JwtBearerPostConfigureOptions>());
  return builder.AddScheme<JwtBearerOptions, JwtBearerHandler>(authenticationScheme, displayName, configureOptions);
}
```
我们一点一点模仿着写，首先看下JwtBearerOptions
```csharp
public class JwtBearerOptions : AuthenticationSchemeOptions
{
   //省略一堆属性
}
```
里面一堆扩展属性，我们也模仿着创建一个BasicAuthenticationOptions
```csharp
/// <summary>
/// Basic认证类  自定义认证类
/// </summary>
public class BasicAuthenticationOptions : AuthenticationSchemeOptions
{
}
```
 再看下这个处理器JwtBearerHandler，该处理器集成了一个抽象基类AuthenticationHandler，该抽象类已经包含了一些方法实现，比如HandleForbiddenAsync和HandleChallengeAsync
```csharp
public class JwtBearerHandler : AuthenticationHandler<JwtBearerOptions>
{
    private OpenIdConnectConfiguration _configuration;

    public JwtBearerHandler(
      IOptionsMonitor<JwtBearerOptions> options,
      ILoggerFactory logger,
      UrlEncoder encoder,
      ISystemClock clock)
      : base(options, logger, encoder, clock)
    {
    }

    protected override Task<object> CreateEventsAsync() => Task.FromResult<object>((object)new JwtBearerEvents());

    protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        // 处理的代码	
    }
}
```
继续模仿着编写一个AuthenticationHandler，用来获取Request Header中的用户信息，并对用户信息进行验证，代码如下：
```csharp
/// <summary>
/// 继承已实现的基类
/// </summary>
public class BasicAuthenticationHandler : AuthenticationHandler<BasicAuthenticationOptions>
{
    public BasicAuthenticationHandler(IOptionsMonitor<BasicAuthenticationOptions> options,
        ILoggerFactory logger,
        UrlEncoder encoder,
        ISystemClock clock) : base(options, logger, encoder, clock)
    {
    }

    protected override Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        if (!Request.Headers.ContainsKey("Authorization"))
        {
            return Task.FromResult(AuthenticateResult.Fail("未标注Authorization请求头。"));
        }

        var authHeader = Request.Headers["Authorization"].ToString();
        if (!authHeader.StartsWith("Basic "))
        {
            return Task.FromResult(AuthenticateResult.Fail("Authorization请求头格式不正确。"));
        }

        var base64EncodedValue = authHeader["Basic ".Length..];
        var userNamePassword = Encoding.UTF8.GetString(Convert.FromBase64String(base64EncodedValue));
        var userNamePasswordArray = userNamePassword.Split(':');
        var userName = userNamePasswordArray[0];
        var password = userNamePasswordArray[1];

        //模拟查询数据库判断用户名和密码是否正确
        var user = Array.Find(User.AllUsers, u => u.UserName == userName && u.Password == password);
        if (user == null)
        {
            return Task.FromResult(AuthenticateResult.Fail("无效用户名或密码。"));
        }

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.UserName),
            new Claim(ClaimTypes.Role, string.Join(',', user.Roles)),
            new Claim(ClaimTypes.UserData, user.Age.ToString())
        };

        var claimsPrincipal = new ClaimsPrincipal(new ClaimsIdentity(claims, "Basic",
            ClaimTypes.NameIdentifier, ClaimTypes.Role));
        var ticket = new AuthenticationTicket(claimsPrincipal, new AuthenticationProperties
        {
            IsPersistent = false
        }, "Basic");

        return Task.FromResult(AuthenticateResult.Success(ticket));
    }
}
```
在上面的HandleAuthenticateAsync代码中，首先对Request Header进行合法性校验，比如是否包含Authorization的Header，以及Authorization Header的值是否合法，然后，将Authorization Header的值解析出来，通过Base64解码后得到用户名和密码，与用户信息数据库里的记录进行匹配，找到匹配的用户。接下来，基于找到的用户对象，创建ClaimsPrincipal，并基于ClaimsPrincipal创建AuthenticationTicket然后返回。
这段代码中有几点值得关注：

1. BasicAuthenticationSchemeOptions本身只是一个继承于AuthenticationSchemeOptions的POCO类。AuthenticationSchemeOptions类通常是为了向AuthenticationHandler提供一些输入参数。比如，在某个自定义的用户认证逻辑中，可能需要通过环境变量读入字符串解密的密钥信息，此时就可以在这个自定义的AuthenticationSchemeOptions中增加一个Passphrase的属性，然后在Startup.cs中，通过service.AddScheme调用将从环境变量中读取的Passphrase的值传入
2. 除了将用户名作为Identity Claim加入到ClaimsPrincipal中之外，我们还将用户的角色（Role）用逗号串联起来，作为Role Claim添加到ClaimsPrincipal中，目前我们暂时不需要涉及角色相关的内容，但是先将这部分代码放在这里以备后用。另外，我们将用户的年龄（Age）放在UserData claim中，在实际中应该是在用户对象上有该用户的出生日期，这样比较合理，然后这个出生日期应该放在DateOfBirth claim中，这里为了简单起见，就先放在UserData中了
3. ClaimsPrincipal的构造函数中，可以指定哪个Claim类型可被用作用户名称，而哪个Claim类型又可被用作用户的角色。例如上面代码中，我们选择NameIdentifier类型作为用户名，而Role类型作为用户角色，于是，在接下来的Controller代码中，由NameIdentifier这种Claim所指向的字符串值，就会被看成用户名而被绑定到Identity.Name属性上

回过头来看看AddJwtBearer方法，我们可以模仿着编写出来一个，这样做的好处是，你可以为开发人员提供更多比较有针对性的配置认证机制的编程接口，这对于一个认证模块/框架的开发是一个很好的设计。
```csharp
/// <summary>
/// 自定义认证
/// </summary>
/// <param name="builder"></param>
/// <param name="configureOptions"></param>
/// <returns></returns>
public static AuthenticationBuilder AddBasicAuthentication(this AuthenticationBuilder builder, Action<BasicAuthenticationOptions> configureOptions)
{
    return builder.AddScheme<BasicAuthenticationOptions, BasicAuthenticationHandler>("Basic", configureOptions);
}
```
接下来，在Program.cs文件里，加入Authentication的支持：
```csharp
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(option =>
{
    option.SwaggerDoc("v1", new OpenApiInfo { Title = "示例", Version = "v1" });

    var path = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, Assembly.GetExecutingAssembly().GetName().Name + ".xml");
    option.IncludeXmlComments(path, true);
});

builder.Services.AddAuthentication("Basic")
    .AddBasicAuthentication(o => { });

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthentication();//认证
app.UseAuthorization();

app.MapControllers();

app.Run();
```
现在，运行应用程序，在WeatherForecastController的Get方法上设置断点，然后执行上面的curl命令，当断点被命中时，观察this.User对象可以发现，IsAuthenticated属性变为了true，Name属性也被设置为用户名：
![image.png](/common/1642087910515-d8f95832-9896-46f2-863e-419fb471d70e.png)
在curl命令中，如果我们没有指定Authorization Header，或者Authorization Header的值不正确，那么WeatherForecast API仍然可以被调用，只不过IsAuthenticated属性为false，也无法从this.User对象得到用户信息。其实，阻止未认证用户访问API并不是认证的事情，API被未认证（或者说未登录）用户访问也是合理的事情，因此，要实现对于未认证用户的访问限制，就需要进一步实现ASP.NET Core Web API的另一个安全控制组件：授权。

### 授权
与认证相比，授权的逻辑会比较复杂：认证更多是技术层面的事情，而授权则更多地与业务相关。市面上常见的认证机制顶多也就是那么几种或者十几种，而授权的方式则是多样化的，因为不同app不同业务，对于app资源访问的授权需求是不同的。最为常见的一种授权方式就是RBAC（Role Based Access Control，基于角色的访问控制），它定义了什么样的角色对于什么资源具有怎样的访问权限。在RBAC中，不同的用户都被赋予了不同的角色，而为了管理方便，又为具有相同资源访问权限的用户设计了用户组，而将访问控制设置在用户组上，更进一步，组和组之间还可以有父子关系。
请注意上面的黑体字，每一个黑体标注的词语都是授权相关的概念，在ASP.NET Core中，每一个授权需求（Authorization Requirement）对应一个实现IAuthorizationRequirement的类，并由AuthorizationHandler负责处理相应的授权逻辑。简单地理解，授权需求表示什么样的用户才能够满足被授权的要求，或者说什么样的用户才能够通过授权去访问资源。一个授权需求往往仅定义并处理一种特定的授权逻辑，ASP.NET Core允许将多个授权需求组合成授权策略（Authorization Policy）然后应用到被访问的资源上，这样的设计可以保证授权需求的设计与实现都是小粒度的，从而分离不同授权需求的关注点。在授权策略的层面，通过组合不同授权需求从而达到灵活实现授权业务的目的。
我们先来看一个常见的策略配置
```csharp
builder.Services.AddAuthorization(options =>
{
    //必须角色为admin 和user才可以访问
    options.AddPolicy("adminanduser", t => { t.RequireRole("admin").RequireRole("user").Build(); });
});
```
我们就可以模仿着RequireRole的写法来实现我们的自定义策略，下面先来看下RequireRole是如何实现的
```csharp
public AuthorizationPolicyBuilder RequireRole(IEnumerable<string> roles)
{
    if (roles == null)
        throw new ArgumentNullException(nameof(roles));
    this.Requirements.Add((IAuthorizationRequirement)new RolesAuthorizationRequirement(roles));
    return this;
}
```
再看来这RolesAuthorizationRequirement类
```csharp
public class RolesAuthorizationRequirement : AuthorizationHandler<RolesAuthorizationRequirement>,IAuthorizationRequirement
{
}
```
该类继承了一个`AuthorizationHandler<RolesAuthorizationRequirement>`，以及IAuthorizationRequirement接口。

接着开始编写我们的自定义策略：假设app中有的API只允许管理员访问，而有的API只允许满18周岁的用户访问，而另外的一些API需要用户既是超级管理员又满18岁。那么就可以定义两种Authorization Requirement：GreaterThan18Requirement和SuperAdminRequirement，然后设计三种Policy：第一种只包含GreaterThan18Requirement，第二种只包含SuperAdminRequirement，第三种则同时包含这两种Requirement，最后将这些不同的Policy应用到不同的API上就可以了。
回到我们的案例代码，首先定义两个Requirement：SuperAdminRequirement和GreaterThan18Requirement：
```csharp
/// <summary>
/// 只允许管理员访问
/// </summary>
public class SuperAdminRequirement : IAuthorizationRequirement
{
}
/// <summary>
/// 只允许满18周岁的用户访问
/// </summary>
public class GreaterThan18Requirement : IAuthorizationRequirement
{
}
```
然后分别实现SuperAdminAuthorizationHandle和GreaterThan18AuthorizationHandler：
```csharp
/// <summary>
/// 只允许管理员访问
/// </summary>
public class SuperAdminAuthorizationHandle : AuthorizationHandler<SuperAdminRequirement>
{
    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, SuperAdminRequirement requirement)
    {
        //通过Role claim获得用户所处的角色，如果角色中包含super_admin，则授权成功
        if (!context.User.Claims.Any(t => t.Type == ClaimTypes.Role))
            context.Fail();

        var role = context.User.Claims.First(t => t.Type == ClaimTypes.Role).Value.Split(",");
        if (!role.Contains("super_admin"))
        {
            context.Fail();
        }
        context.Succeed(requirement);
        return Task.CompletedTask;
    }
}

/// <summary>
/// 只允许满18周岁的用户访问处理类
/// </summary>
public class GreaterThan18AuthorizatonHandler : AuthorizationHandler<GreaterThan18Requirement>
{
    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, GreaterThan18Requirement requirement)
    {
        //通过UserData claim获得年龄信息，如果年龄大于18，则授权成功
        if (!context.User.Claims.Any(t => t.Type == ClaimTypes.UserData))
            context.Fail();

        var age = Convert.ToInt32(context.User.Claims.First(t => t.Type == ClaimTypes.UserData).Value);
        if (age < 18)
        {
            context.Fail();
        }
        context.Succeed(requirement);
        return Task.CompletedTask;
    }
}
```
实现逻辑也非常清晰：在GreaterThan18AuthorizationHandler中，通过UserData claim获得年龄信息，如果年龄大于18，则授权成功；在SuperAdminAuthorizationHandler中，通过Role claim获得用户所处的角色，如果角色中包含super_admin，则授权成功。接下来就需要将这两个Requirement加到所需的Policy中，然后注册到应用程序里：
```csharp
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(option =>
{
    option.SwaggerDoc("v1", new OpenApiInfo { Title = "示例", Version = "v1" });

    var path = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, Assembly.GetExecutingAssembly().GetName().Name + ".xml");
    option.IncludeXmlComments(path, true);
});

builder.Services.AddAuthentication("Basic")
       .AddBasicAuthentication();

//添加授权策略
builder.Services.AddAuthorization(options =>
{
    //只允许年龄超出18访问策略
    options.AddPolicy("AgeMustBeGreaterThan18", builder =>
    {
        builder.Requirements.Add(new GreaterThan18Requirement());
    });
    //只允许超级管理员访问策略
    options.AddPolicy("UserMustBeSuperAdmin", builder =>
    {
        builder.Requirements.Add(new SuperAdminRequirement());
    });
    //年级超过18并且是超级管理员
    options.AddPolicy("UserMustBeSuperAdminAndAgeMustBeGreaterThan18", builder =>
    {
        builder.Requirements.Add(new SuperAdminRequirement());
        builder.Requirements.Add(new GreaterThan18Requirement());
    });
});

builder.Services.AddSingleton<IAuthorizationHandler, SuperAdminAuthorizationHandle>();
builder.Services.AddSingleton<IAuthorizationHandler, GreaterThan18AuthorizatonHandler>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthentication();//认证
app.UseAuthorization();

app.MapControllers();

app.Run();
```
我们定义了三种Policy：AgeMustBeGreaterThan18、UserMustBeSuperAdmin和UserMustBeSuperAdminAndAgeMustBeGreaterThan18，最后，在API Controller或者Action上，应用AuthorizeAttribute，从而指定所需的Policy即可。比如，如果希望WeatherForecase API只有年龄大于18岁的用户才能访问，那么就可以这样做：
```csharp
/// <summary>
/// 授权(只允许年级大于18的人访问)
/// </summary>
/// <returns></returns>
[HttpGet]
[Authorize(Policy = "AgeMustBeGreaterThan18")]
public string Get2()
{
    return "success";
}

/// <summary>
/// 授权(只允许超级管理员访问)
/// </summary>
/// <returns></returns>
[HttpGet]
[Authorize(Policy = "UserMustBeSuperAdmin")]
public string Get3()
{
    return "success";
}

/// <summary>
/// 授权(只允许超级管理员并且年级大于18才可以访问)
/// </summary>
/// <returns></returns>
[HttpGet]
[Authorize(Policy = "UserMustBeSuperAdminAndAgeMustBeGreaterThan18")]
public string Get4()
{
    return "success";
}
```
运行程序,经过测试用户admin可以访问上面三个接口，而用户zyp只能访问Get3接口，其他接口访问API不成功，服务端返回403。
![image.png](/common/1642088360789-575a157c-c363-4989-813e-a3daadb0b390.png)

### 自定义授权响应
如果我们想实现授权失败后自定义HTTP响应，那么可以这么操作
```csharp
/// <summary>
/// 自定义授权失败结果处理:自定义授权响应
/// </summary>
public class AuthorizationResultTransformer : IAuthorizationMiddlewareResultHandler
{
    private readonly IAuthorizationMiddlewareResultHandler _handler;

    public AuthorizationResultTransformer()
    {
        _handler = new AuthorizationMiddlewareResultHandler();
    }

    public async Task HandleAsync(
        RequestDelegate requestDelegate,
        HttpContext httpContext,
        AuthorizationPolicy authorizationPolicy,
        PolicyAuthorizationResult policyAuthorizationResult)
    {
        //授权失败（结果是禁止）和失败的要求，相应地更改HTTP状态代码
        if (policyAuthorizationResult.Forbidden && policyAuthorizationResult.AuthorizationFailure != null)
        {
            if (policyAuthorizationResult.AuthorizationFailure.FailedRequirements.Any(requirement => requirement is GreaterThan18Requirement))
            {
                httpContext.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                return;
            }

            // Other transformations here
        }

        await _handler.HandleAsync(requestDelegate, httpContext, authorizationPolicy, policyAuthorizationResult);
    }
}
```
然后注册
```csharp
//添加授权策略
builder.Services.AddAuthorization(options =>
{
}).AddSingleton<IAuthorizationMiddlewareResultHandler, AuthorizationResultTransformer>();
```

## 资料
快速理解ASP.NET Core的认证与授权：[https://mp.weixin.qq.com/s/wQ8t000gCOukTn9uh6pICg](https://mp.weixin.qq.com/s/wQ8t000gCOukTn9uh6pICg)
