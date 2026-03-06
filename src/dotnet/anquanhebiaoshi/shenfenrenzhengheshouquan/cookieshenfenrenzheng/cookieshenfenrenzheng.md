---
title: Cookie身份认证
lang: zh-CN
date: 2022-04-27
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: cookieshenfenrenzheng
slug: vwwwrw
docsId: '30606637'
---

### 介绍
cookie是一个保存在客户机的简单文本文件，这个文件与特定的web文档关联在一起，保存了该客户机访这个web文档时的信息，当客户机再次访问这个web文档时候这些信息可供该文档使用。

- 会话Cookie
   - 不包含过期时间，会在浏览器窗口关闭时候被永久删除。
- 持久Cookie
   - 关闭浏览器窗口后不会被删除，通常有一个到期时间，会在到期后被删除。

### 操作

#### 1.1 信息保存
登录后用户的信息存入cookie中
> 保存验证结果;  用户id可以存入NameIdentifier，账号存入GivenName，姓名存入Name

```csharp
var claims = new List<Claim>
{
	new Claim(ClaimTypes.NameIdentifier, account),
	new Claim(ClaimTypes.Name, "张三"),
	new Claim(ClaimTypes.Role, "校长")
};
var cliamsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
var claimsPrincipal = new ClaimsPrincipal(cliamsIdentity); //可以理解为证件用户

await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, claimsPrincipal,
	new AuthenticationProperties
	{
		ExpiresUtc = new DateTimeOffset(DateTime.Now.AddHours(6))
	});
```

#### 1.2 ConfigureServices引用中间件
引用验证中间件
string CookieScheme = "Cookies";
```csharp
// 配置验证
 services.AddAuthentication(CookieScheme)
       .AddCookie(CookieScheme, option =>
        {
           //登录路径：这是当用户试图访问资源但未经过身份验证时，程序将会将请求重定向到这个相对路径。
           option.LoginPath = new PathString("/account/login");  
           //禁止访问路径：当用户试图访问资源时，但未通过该资源的任何授权策略，请求将被重定向到这个相对路径
           option.AccessDeniedPath = new PathString("/account/denied");
        });
//注入上下文单例模式
 services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
```

#### 1.3 Configure里面启用认证
必须添加下面的两者
```csharp
app.UseAuthentication();//启用身份认证：识别当前请求的用户信息,一般是通过加密的Cookies实现。
app.UseAuthorization();//启用身份授权：识别当前请求是否有访问指定资源的权限，一般是根据当前请求识别的用户信息,结合角色权限相关配置来判断。
```

#### 1.4 获取信息
在登录认证通过后访问时候可以通过
```csharp
var name = this.User.Identity.Name;//获取存入的名称信息
HttpContext.User.FindFirst(u => u.Type == ClaimTypes.NameIdentifier)?.Value;
```

#### 1.5 注销用户
```csharp
 await HttpContext.SignOutAsync();
```
> cookie认证 [https://www.cnblogs.com/OpenCoder/p/8341843.html](https://www.cnblogs.com/OpenCoder/p/8341843.html)


### 全局获取
如果想在其他层获取当前用户信息，需要将IHttpContextAccessor注入进去，然后通过这个去获取，例如：
```csharp
public class UserEntityService : IUserEntityService
{
   private IHttpContextAccessor _accessor;
   private readonly IMongoCollection<UserProfile> _users;
 
   public UserEntityService(IHttpContextAccessor accessor, IDefaultMongoDatabaseProvider databaseProvider)
   {
       _accessor = accessor;
       _users = databaseProvider.GetCollection<UserProfile>(CollectionNames.UserProfiles);
   }
 
   public Task<UserProfile> GetCurrentUserAsync()
   {
       var rawUser = this._accessor.HttpContext.User;
       if (rawUser == null)
       {
          return null;
       }
       var filter = Builders<UserProfile>.Filter.Eq("UserId", rawUser.UserId);
      return _users.Find(filter).FirstOrDefaultAsync();
   }
}
```

## 资料
[https://mp.weixin.qq.com/s/c6UvdQsV1JiPiUw88qYwhw](https://mp.weixin.qq.com/s/c6UvdQsV1JiPiUw88qYwhw) | 小cookie，大智慧
本地地址：\开发\docs\小cookie，大智慧.png

[https://mp.weixin.qq.com/s/FNWl-QFM3P_mBKptVoLSiQ](https://mp.weixin.qq.com/s/FNWl-QFM3P_mBKptVoLSiQ) | 浅议.NET 6 Cookie滑动过期和JWT混合认证、授权
