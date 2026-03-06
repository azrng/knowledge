---
title: 获取用户信息
lang: zh-CN
date: 2023-10-03
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: huoquyonghuxinxi
slug: lh3gma
docsId: '48532499'
---

## 用户信息设置
用户信息一般是保存在上下文的HttpContext的User中，然后我们可以通过下面的方法去获取
```csharp

// 保存用户信息
var identity = new ClaimsIdentity();
identity.AddClaim(new Claim("name", "zhagnsna"));
identity.AddClaim(new Claim("id", "11111"));
HttpContext.User = new ClaimsPrincipal(identity);

// 获取方法
var bb = HttpContext.User.Claims.FirstOrDefault(t=>t.Type=="id");
```

## 方案一(Redis)
条件：redis
登录成功后将用户信息存储到redis中，用户ID返回给前端，后续请求中需要获取用户信息的操作，那么就根据用户ID去redis中查询，然后获取完整信息。

## 方案二(HttpContext)
条件：使用jwt方式、cookie方式应该也行
服务层都继承一个基类，然后在该基类中获取上下文中的用户信息
缺点：只能保存jwt里面包含的信息。
```csharp
public abstract class BaseService
{
    protected virtual UserIdentityDto UserIdentity
    {
        get
        {
            var currUser = HttpContext.User;
            if (currUser.HasClaim(t => t.Type == ClaimTypes.NameIdentifier))
            {
                var dto = new UserIdentityDto
                {
                    UserId = currUser.FindFirstValue(ClaimTypes.NameIdentifier) ??
                        string.Empty,
                    UserName = currUser.FindFirstValue(ClaimTypes.Name) ??
                        string.Empty,
                };
                return dto;
            }
            throw new ArgumentNullException("登录状态无效，请检查登录状态");
        }
    }
}
```

## 方案三(过滤器)
该方法比较灵活，可以使用redis也可以使用上下文获取的方式，通过借助一个异步的过滤器来实现
> 该方式来自：[https://www.cnblogs.com/CreateMyself/p/14979315.html](https://www.cnblogs.com/CreateMyself/p/14979315.html)

创建一个类来接收用户信息
```csharp
public class CurrentUser
{
    /// <summary>
    /// 用户id
    /// </summary>
    public string UserId { get; set; }
    /// <summary>
    /// 用户名
    /// </summary>
    public string UserName { get; set; }
}
```
比如项目我们使用JWT，则拿到声明中用户标识和用户账号，那么我们接下来我们只需要使用上述过滤器接口即可，如下：
```csharp
/// <summary>
/// 自定义授权过滤器(推荐)
/// </summary>
public class CustomerAuthorizeFilter : Attribute, IAuthorizationFilter
{
    private readonly CurrentUser _currentUser;

    public CustomerAuthorizeFilter(CurrentUser currentUser)
    {
        _currentUser = currentUser;
    }

    public void OnAuthorization(AuthorizationFilterContext context)
    {
        var user = context.HttpContext.User;

        _currentUser.UserId = user.FindFirst(t => t.Type == ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
        _currentUser.UserName = user.FindFirst(t => t.Type == ClaimTypes.Name)?.Value ?? string.Empty;
    }
}

/// <summary>
/// 自定义Action过滤器
/// </summary>
public class CustomerActionFilter : IAsyncActionFilter
{
    private readonly CurrentUser _currentUser;

    public CustomerActionFilter(CurrentUser currentUser)
    {
        _currentUser = currentUser;
    }

    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var user = context.HttpContext.User;
        _currentUser.UserId = user.FindFirst(t => t.Type == ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
        _currentUser.UserName = user.FindFirst(t => t.Type == ClaimTypes.Name)?.Value ?? string.Empty;

        await next();
    }
}
```
> 注意：上面讲述了两种方式，推荐使用授权过滤器，授权过滤器比Action过滤器更早

过滤器注入，如下：
```csharp
services.AddHttpContextAccessor();
//注册用户会话
services.AddScoped<CurrentUser>();
   
//注册全局过滤器   
services.AddControllers((options) =>
{
    options.Filters.Add(new AuthorizeFilter());//添加全局的Authorize
    //options.Filters.Add<CustomerActionFilter>(); // 自定义Action过滤器
    options.Filters.Add<CustomerAuthorizeFilter>(); // 自定义授权过滤器，推荐
});
```
获取用户信息，在需要获取的地方进行依赖注入CurrentUser即可拿到我们的用户信息。
```csharp
private readonly CurrentUser _currentUser;
public TestController(CurrentUser currentUser)
{
    _currentUser = currentUser;
}

[HttpGet]
public IResultModel<string> GetCurrentUserId()
{
    return new ResultModel<string>() { IsSuccess = true, Code = "200", Data = _currentUser.UserId };
}
```

## 方案四(属性获取)※
通过jwt认证，在需要权限访问的接口里面获取用户信息，在获取用户信息的时候会从Claim中获取用户信息，获取的数据全是通过jwt token中可以获取到的信息。
测试条件：已经生成jwt token、项目中已经配置了jwt鉴权
新建获取信息的接口和实现类
```csharp
public interface ICurrentUser
{
    /// <summary>
    /// 用户ID 
    /// </summary>
    string UserId { get; }

    /// <summary>
    /// 用户名
    /// </summary>
    string UserName { get;  }

}
public class CurrentUser : ICurrentUser
{
    private readonly IHttpContextAccessor _httpContext;

    public CurrentUser(IHttpContextAccessor httpContext)
    {
        _httpContext = httpContext;
    }

    public string UserId { get => _httpContext.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty; }
    public string UserName { get => _httpContext.HttpContext.User.FindFirstValue(ClaimTypes.Name) ?? string.Empty; }
}
```
> 注意：官方不建议使用IHttpContextAccessor，因为它依赖于`AsyncLocal<T>`异步调用对性能产生负面影响。并且不利于单元测试。

注册配置
```csharp
services.AddHttpContextAccessor();
services.AddScoped<ICurrentUser, CurrentUser>();
```
使用方法(该项目已经配置了全局需要授权)
```csharp
private readonly ICurrentUser _currentUser;
public TestController(ICurrentUser currentUser)
{
    _currentUser = currentUser;
}

[HttpGet]
public string GetCurrentUserId()
{
    return _currentUser.UserId;
}
```
查看效果
![image.png](/common/1634040801377-67c45596-41af-418d-922e-8e3c5f885a5a.png)

## 方案五(扩展参数)

### 使用中间件增加

在解析原有的jwt token数据的情况下，再从其他地方(数据库)查询信息存储到claim中
增加存储的中间件
```csharp
public class CurrentUserClaimMiddlerware
{
    private readonly RequestDelegate _next;
    public CurrentUserClaimMiddlerware(RequestDelegate next)
    {
        _next = next;
    }

    public Task Invoke(HttpContext context)
    {
        if (!context.Request.Headers?.ContainsKey("Authorization") ?? true)
            return _next.Invoke(context);

        if (!context.User.Identity.IsAuthenticated)
            return _next.Invoke(context);

        var oldClaims = context.User.Claims;
        var newClaims = new List<Claim>();
        if (oldClaims.Any(x => x.Type == ClaimTypes.NameIdentifier))
            newClaims.Add(new Claim(ClaimTypes.NameIdentifier, oldClaims.First(x => x.Type == ClaimTypes.NameIdentifier).Value));

        if (oldClaims.Any(x => x.Type == ClaimTypes.Name))
            newClaims.Add(new Claim(ClaimTypes.Name, oldClaims.First(x => x.Type == ClaimTypes.Name).Value));

        // 模拟从数据库中查询出来的数据存入Claim中
        newClaims.Add(new Claim(ClaimTypes.Email, "123456@qq.com"));

        var claimIdentiies = new List<ClaimsIdentity>();
        claimIdentiies.Add(new ClaimsIdentity(newClaims));
        context.User.AddIdentities(claimIdentiies);
        return _next.Invoke(context);
    }
}
```
注册中间件
```csharp
app.UseAuthentication(); //认证
app.UseAuthorization(); //授权
app.UseMiddleware<CurrentUserClaimMiddlerware>();
```
使用方法，这次是直接使用的IHttpContextAccessor(使用需要注册该服务)，可以按照上面的方式封装
```csharp
[ApiController]
[Route("[controller]")]
public class TestController : ControllerBase
{
    private readonly IHttpContextAccessor _httpContext;

    public TestController(IHttpContextAccessor httpContext)
    {
        _httpContext = httpContext;
    }

    [HttpGet]
    public IActionResult GetCurrentEmail()
    {
        return Ok(_httpContext.HttpContext.User.Claims.Select(t => new
        {
            t.Type,
            t.Value
        }));
    }
}
```

### 使用声明转换处理

借助接口`IClaimsTransformation`来实现声明转换操作，来实现在原有的基础上增加Claim等，当然还有其他的作用，这里只是用来扩展声明信息

参考资料：[掌握灵活的 ASP.NET Core 授权的声明转换](https://www.milanjovanovic.tech/blog/master-claims-transformation-for-flexible-aspnetcore-authorization?utm_source=newsletter&utm_medium=email&utm_campaign=tnw84)

```c#
public class CustomApppendClaims : IClaimsTransformation
{
    public Task<ClaimsPrincipal> TransformAsync(ClaimsPrincipal principal)
    {
        if (principal.HasClaim(claim => claim.Type == "no"))
        {
            return Task.FromResult(principal);
        }

        var claimsIdentity = new ClaimsIdentity();
        claimsIdentity.AddClaim(new Claim("no", "123456"));
        principal.AddIdentity(claimsIdentity);
        return Task.FromResult(principal);
    }
}
```

注入服务

```c#
// 在原来的基础上追加claim
builder.Services.AddTransient<IClaimsTransformation, CustomApppendClaims>();
```

然后从`HttpContext.User.Claims`中可以看看到`no`信息。
