---
title: 扩展自定义授权
lang: zh-CN
date: 2022-04-27
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: kuozhanzidingyishouquan
slug: kt4oun
docsId: '52328260'
---

## 阅读前提
本文需要掌握一定的.NetCore认证知识的前提下阅读。
本文的代码需要在已经实现JWT认证的项目中使用。

## 目的
默认的授权方案只有根据角色授权或者组装角色成为策略授权，但是我能否实现动态授权那？比如我查询数据库然后判断该用户是否有操作该权限的方法那？并且还使用JWT进行认证的方式。

## 定义自定义策略
原来的策略授权方案配置
```csharp
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("deleteRolePolicy", policy => policy.RequireClaim("deleteRole"));

    //必须角色为admin 和user才可以访问
    options.AddPolicy("adminanduser", t => { t.RequireRole("admin").RequireRole("user").Build(); });

    //必须角色为admin并且是user才可以访问
    options.AddPolicy("AdminAndUser", t => { t.RequireRole("admin", "user").Build(); });
    //角色为admin或者user都可以访问
    options.AddPolicy("AdminOrUser", t => { t.RequireRole("admin", "user"); });

    options.AddPolicy("edit", policy =>
        policy.RequireAssertion(context => (context.User.IsInRole("admin") &&
        context.User.HasClaim(cliaim => cliaim.Type == "edit role" && cliaim.Value == "true")) ||
        context.User.IsInRole("super admin")
    ));
});
```
如果想扩展使用自定义策略，那么我们可以先看下RequireRole是如何实现的
```csharp
public AuthorizationPolicyBuilder RequireRole(IEnumerable<string> roles)
{
    if (roles == null)
        throw new ArgumentNullException(nameof(roles));
    this.Requirements.Add((IAuthorizationRequirement)new RolesAuthorizationRequirement(roles));
    return this;
}
```
所以我们也可以继承自接口IAuthorizationRequirement实现我们的自定义授权策略，然后我们看RolesAuthorizationRequirement类。
```csharp
public class RolesAuthorizationRequirement : AuthorizationHandler<RolesAuthorizationRequirement>,IAuthorizationRequirement
{
}
```
该类继承了一个AuthorizationHandler`<RolesAuthorizationRequirement>`，以及上面的接口，那么如果我们想编写咱们自定义的策略，那么就变成了
```csharp
public class PermissionHandler : AuthorizationHandler<PermissionHandler>, IAuthorizationRequirement
{
}
```
但是这样子如果我们想增加一些自定义的配置，那么就需要在这PermissionHandler里面设置了，就像RolesAuthorizationRequirement一样，在该类里面定义属性
```csharp
public IEnumerable<string> AllowedRoles { get; }
```
那么我能否去将自定义的属性拆分开那？因为格式是固定的，自定义的属性只能放到`AuthorizationHandler<T>`中，那么我们看看这个T有什么要求？
```csharp
public abstract class AuthorizationHandler<TRequirement> : IAuthorizationHandler
    where TRequirement : IAuthorizationRequirement
{
    public virtual async Task HandleAsync(AuthorizationHandlerContext context)
    {
      foreach (TRequirement requirement in context.Requirements.OfType<TRequirement>())
        await this.HandleRequirementAsync(context, requirement);
    }

    protected abstract Task HandleRequirementAsync(
      AuthorizationHandlerContext context,
      TRequirement requirement);
}
```
那么我们可以模仿着定义一个我们的AuthorizationRequirement如下
```csharp
/// <summary>
///权限需求
/// 继承 IAuthorizationRequirement是因为AuthorizationHandler中的泛型参数 TRequirement 必须继承 IAuthorizationRequirement
/// </summary>
public class PermissionRequirement : IAuthorizationRequirement
{
    /// <summary>
    /// 用户对应的角色权限集合
    /// </summary>
    public List<RolePermissionRelation> Permissions { get; set; } = new List<RolePermissionRelation>();

    /// <summary>
    /// 允许匿名访问的action url
    /// </summary>
    public string[] AllowAnonymousAction { get; set; }

    /// <summary>
    /// 认证授权类型(如果一个项目配置了多种授权方式，可以用来区别)
    /// </summary>
    public string ClaimType { get; set; } = "Bearer";
}

/// <summary>
/// 角色和url权限关系
/// </summary>
public sealed class RolePermissionRelation
{
    /// <summary>
    /// 用户或角色或其他凭据名称
    /// </summary>
    public string RoleId { get; set; }

    /// <summary>
    /// 请求Url
    /// </summary>
    public string Url { get; set; }
}
```
PermissionHandler就继承自：`AuthorizationHandler<PermissionRequirement>`并且实现抽象类的HandleRequirementAsync方法
```csharp
//IAuthorizationRequirement可以删除，因为AuthorizationHandler<T>已经继承了IAuthorizationRequirement接口
public class PermissionHandler : AuthorizationHandler<PermissionRequirement>, IAuthorizationRequirement
{
    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, PermissionRequirement requirement)
    {
        throw new NotImplementedException();
    }
}
```
然后我们在模仿着RequireRole编写一个RequirePermission的扩展方法
```csharp
/// <summary>
/// 必须的权限
/// </summary>
/// <param name="policyBuilder">策略构造器</param>
/// <param name="permission">自定义策略需求</param>
/// <returns></returns>
/// <exception cref="ArgumentNullException"></exception>
public static AuthorizationPolicyBuilder RequirePermission(this AuthorizationPolicyBuilder policyBuilder, PermissionRequirement permission)
{
    if (permission == null)
        throw new ArgumentNullException(nameof(permission));
    policyBuilder.Requirements.Add(permission);
    return policyBuilder;
}
```
然后将该策略加入到授权配置中
```csharp
//授权
services.AddAuthorization(options =>
{
    // 自定义权限需求
    var permissionRequirement = new PermissionRequirement("/home/login");
    options.AddPolicy("Permission", policy => policy.RequirePermission(permissionRequirement));
});
```
然后还需要将我们的自定义授权需求替换默认的方法
```csharp
//将自定义的授权处理器 匹配给官方授权处理器接口，这样当系统处理授权的时候，就会直接访问我们自定义的授权处理器了。
services.AddSingleton<IAuthorizationHandler, PermissionHandler>();
```
到这里我们的自定义授权策略就写好了，那么我们进行测试一下吧，我们访问我们的接口
```csharp
/// <summary>
/// 获取（授权）
/// </summary>
/// <returns></returns>
[HttpGet]
[Authorize("Permission")]
public string Get()
{
    return "成功";
}
```
呀？居然报错了，提示未实现，尴尬了，那个自定义授权处理器还没写实现方法的。

## 实现自定义策略
那我们现在就来实现PermissionHandler的HandleRequirementAsync方法，这点代码每个公司可能又不大相同，所以我就直接粘贴代码了。
```csharp
/// <summary>
/// 自定义权限授权需求处理器
///IAuthorizationRequirement可以删除，因为AuthorizationHandler<T>已经继承了IAuthorizationRequirement接口
/// </summary>
public class PermissionHandler : AuthorizationHandler<PermissionRequirement>, IAuthorizationRequirement
{
    /// <summary>
    /// 验证方案提供对象
    /// </summary>
    private readonly IAuthenticationSchemeProvider _schemes;

    private readonly IHttpContextAccessor _accessor;
    private readonly IUserService _userService;

    public PermissionHandler(IAuthenticationSchemeProvider schemes,
        IHttpContextAccessor httpContextAccessor,
        IServiceScopeFactory factory
    )
    {
        _schemes = schemes;
        _userService = factory.CreateScope().ServiceProvider.GetService<IUserService>();
        _accessor = httpContextAccessor;
    }

    protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context,
        PermissionRequirement requirement)
    {
        var httpContext = _accessor.HttpContext;
        //请求Url
        if (httpContext == null)
            return;

        //请求的url
        var questUrl = httpContext.Request.Path.Value?.ToLower();
        if (string.IsNullOrEmpty(questUrl))
        {
            context.Fail();
            return;
        }

        //如果访问的是无需授权的直接通过
        if (requirement.AllowAnonymousAction.Any(t => t.ToLower() == questUrl))
        {
            context.Succeed(requirement);
            return;
        }

        if (requirement.Permissions.Count == 0)
        {
            //获取用户权限的操作，如果要做缓存也不能设置太久的缓存
            requirement.Permissions = await _userService.GetRoleAuthAsync();
        }

        #region 验证登录

        //判断请求是否停止
        var handlers = httpContext.RequestServices.GetRequiredService<IAuthenticationHandlerProvider>();
        foreach (var scheme in await _schemes.GetRequestHandlerSchemesAsync())
        {
            if (await handlers.GetHandlerAsync(httpContext, scheme.Name) is IAuthenticationRequestHandler
                    handler && await handler.HandleRequestAsync())
            {
                context.Fail();
                return;
            }
        }

        //判断请求是否拥有凭据，即有没有登录
        var defaultAuthenticate = await _schemes.GetDefaultAuthenticateSchemeAsync();
        if (defaultAuthenticate == null)
        {
            context.Fail();
            return;
        }

        var result = await httpContext.AuthenticateAsync(defaultAuthenticate.Name);
        //result?.Principal不为空即登录成功
        if (result?.Principal == null)
        {
            context.Fail();
            return;
        }

        #endregion

        var roleIds = requirement.Permissions.Where(w => w.Url.ToLower() == questUrl).ToList();
        //权限中是否存在请求的url
        if (roleIds.Count == 0)
        {
            context.Fail();
            return;
        }

        // 获取当前用户的角色信息
        var currentUserRoles =
            (httpContext.User.Claims.FirstOrDefault(t => t.Type == ClaimTypes.Role)?.Value ?? string.Empty).Split(",");
        var isMatchRole = roleIds.Any(r => currentUserRoles.Contains(r.RoleId));

        //验证权限
        if (currentUserRoles.Length == 0 || !isMatchRole)
        {
            context.Fail();
            return;
        }

        //判断过期时间（这里仅仅是最坏验证原则，你可以不要这个if else的判断，因为我们使用的官方验证，Token过期后上边的result?.Principal 就为 null 了，进不到这里了，因此这里其实可以不用验证过期时间，只是做最后严谨判断）
        var expirationTime = httpContext.User.Claims
            .SingleOrDefault(s => s.Type == ClaimTypes.Expiration)?.Value;
        if (expirationTime != null && DateTime.Parse(expirationTime) >= DateTime.Now)
        {
            context.Succeed(requirement);
            return;
        }

        context.Fail();
        return;
    }
}
```

## 总结
多写多看才能记忆深刻。

