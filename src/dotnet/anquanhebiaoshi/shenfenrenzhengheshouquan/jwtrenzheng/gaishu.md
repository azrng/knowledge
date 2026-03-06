---
title: 概述
lang: zh-CN
date: 2022-10-04
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: gaishu
slug: tv777z
docsId: '31306739'
---

## 开篇语
本文内容参考多位大佬的文章编写而成。

## 介绍
JWT是一个基于json的、用于在网络上声明某种主张的令牌，他是一种双方之间传递安全信息的表述性声明规范。主要用于集群分布式中。
> 作用：可以做权限验证的使用，是一种标准化的数据传输规范，但是目的不是为了数据加密和保护。

Jwt通常是用三部分组成：**头信息，消息体，签名**。

- Header(头信息)：Json对象，alg表示签名的算法，默认是HS256(HMAC SHA256)，type表示令牌的类型，统一是JWT.
- Payload(载荷)：Json对象，存放实际需要传递的数据，只建议存储不重要的信息。
- Signature(签名)：值是将前两部分的进行base64编码后使用指定算法签名生成的。

签名示例：
```csharp
HMACSHA256(
 base64UrlEncode(header) + "." + base64UrlEncode(payload),
 secret,
)
```

## 使用场景

- 授权：用于授权而并非是身份验证。通过身份验证，我们验证用户的用户名和密码是否有效，并将用户登录到系统中，通过授权，我们可以验证发送到服务器的请求是否属于通过身份验证登录的用户，从而可以授予该用户访问系统的权限，继而批准该用户使用获取的token访问路由、服务和资源。
- 信息交换：json web token是在双方之间安全地传输信息的一种好方法。因为jwt可以被签名，所以使您能够确保发送方是他们声称的那一方，由于签名使用header和payload计算的，因此还使您能验证发送的内容没有被篡改。


下面内容摘抄自网上
使用token的限制登录完全违背了token的使用初衷，如果需要注销的情况，可以直接去使用session机制。
token和刷新token是在寻求一个安全的平衡点，如果token短体验不好，长了又不安全，所以就是设置一个短的token来随意使用(每次请求都会携带)，然后刷新token存储的使用的少，更安全一点。

## 对比Token+Redis
JWT就是Json Web Token，就是Token的典型方式。JWT和Token+Redis的区别，其实都是Token，只是JWT的可靠性保障是来源于加密算法(对称加密和非对称两种)，而Token+Redis的方案是依靠的后台数据存储。这两个本质也就带来了使用上的区别：
1 JWT是去中心化的，不需要任何后台数据的共享，第三方认证、跨数据中心认证、微服务等，都适合采用JWT的方式，当然，因为是去中心化的，不是实时验证，所以本质上来说token的主动过期是做不到的(要做到就会违背初衷)
2 Token+Redis是中心化的，要能识别token必须能访问该Redis，除非是有特别需求，要求每次token都实时检测，否则的话还是选择JWT，毕竟是成熟通用的技术，沟通维护成本也低，对开发者也友好一些。
> 这点我忘记是摘录哪个大佬的文章了，所以没有给出引用地址很抱歉。


## 流程

![image.png](/common/1612660292022-8eed2159-e0aa-4cac-9256-a4772252d6f3.png)
用户通过登录去向服务系统发起请求，然后生成带一定用户信息的数据作为令牌（jwt）返回给用户，用户拿到返回过来的信息在请求接口的时候放入头部，服务系统会从头部获取到令牌后验证签名的有效性，对客户端做出相应的响应。
```csharp
Authorization: Bearer <token>
```
如果想在接口中获取jwt令牌，可以使用
```csharp
var tokenHeader = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
```
现在感觉作用就是可以通过jwt实现权限，在系统中定义好有哪些权限，然后在方法头部去设置哪些角色可以去访问这个东西。如果存放token，我的想法是把用户的信息放到jwt内部，然后前端通过登录去获取这东西，然后我返回这个东西到前台，每次调用接口时候把这个东西传出过来，然后我通过将这个解密获取到我登录时候存进去的信息。然后进行我自己的操作。
> 注意：
> 1. 生成jwt时候的key必须在16位以上，否则会因为长度不够抛出异常
> 2. jwt本身是不加密的，里面包含的信息任何人都可以读取到。
> 3. jwt的签名部分是对前两部分的签名，防止数据被篡改，


## 刷新Token

比如常用的是双Token机制
1、登录时同时返回：Token、RefreshToken，Token用于请求业务接口，RefreshToken用于刷新Token接口；
2、每一次Http请求，客户端都会判断服务器返回状态，如果是401，代表Token过期；
3、客户端使用RefreshToken，请求服务器Token刷新接口，并获取新的：Token，RefreshToken；
4、如果第3步骤成功返回，更新本地的Token、RefreshToken；如果返回失败，代表RefreshToken也过期了，提示过期并跳转至登录页面。

### 后端自动生成
用户登录创建token=>前端收到token然后本地存储token=>本地存储token 过期时间=>每次请求的时候用当前时间和本地缓存的token过期时间进行对比，如果还有十分钟或者一段时间就过期了=>这个时候拿着token请求一个刷新token的接口=>后端根据传过来的token验证=>生成新的token返回给前端

### 前端请求生成刷新token
用户登录成功后返回token和刷新token，token时间短，当他过期的时候，再次拿着刷新token以及token请求刷新的接口(匿名可以访问)，然后这时候拿着刷新token和数据库的刷新token比对，如果刷新token也过期了，那么就重新登录，如果成功，那么就解析该token重新生成token并且该刷新token设置为已经使用，该方法借助redis或者数据库，实现token可控制。

### 后端检测token过期自动颁发新token示例

请求的时候检测token是否即将过期，当前Token有效期不足一半时签发新的Token

```c#
public static class IdentityVerification
{
    /// <summary>
    /// 权限校验
    /// </summary>
    /// <param name="authorizationHandlerContext"></param>
    /// <returns></returns>
    public static bool Authorization(AuthorizationHandlerContext authorizationHandlerContext)
    {
        if (!authorizationHandlerContext.User.Identity!.IsAuthenticated)
        {
            return false;
        }
        if (authorizationHandlerContext.Resource is HttpContext httpContext)
        {
            IssueNewToken(httpContext);

            var module = typeof(Program).Assembly.GetName().Name!;

            Endpoint endpoint = httpContext.GetEndpoint()!;

            ControllerActionDescriptor actionDescriptor = endpoint.Metadata.GetMetadata<ControllerActionDescriptor>()!;

            var route = actionDescriptor.AttributeRouteInfo?.Template;

            var db = httpContext.RequestServices.GetRequiredService<DatabaseContext>();

            var functionId = db.TFunctionRoute.Where(t => t.Module == module && t.Route == route).Select(t => t.FunctionId).FirstOrDefault();

            if (functionId == default)
            {
                return true;
            }
            var userId = long.Parse(httpContext.GetClaimByUser("userId")!);
            var roleIds = db.TUserRole.Where(t => t.UserId == userId).Select(t => t.RoleId).ToList();

            var functionAuthorizeId = db.TFunctionAuthorize.Where(t => t.FunctionId == functionId && (roleIds.Contains(t.RoleId!.Value) || t.UserId == userId)).Select(t => t.Id).FirstOrDefault();

            if (functionAuthorizeId != default)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        return true;
    }

    /// <summary>
    /// 签发新Token
    /// </summary>
    /// <param name="httpContext"></param>
    private static void IssueNewToken(HttpContext httpContext)
    {
        IDHelper idHelper = httpContext.RequestServices.GetRequiredService<IDHelper>();

        var db = httpContext.RequestServices.GetRequiredService<DatabaseContext>();

        var nbf = Convert.ToInt64(httpContext.GetClaimByUser("nbf"));
        var exp = Convert.ToInt64(httpContext.GetClaimByUser("exp"));

        var nbfTime = DateTimeOffset.FromUnixTimeSeconds(nbf);
        var expTime = DateTimeOffset.FromUnixTimeSeconds(exp);

        var lifeSpan = nbfTime + ((expTime - nbfTime) * 0.5);

        //当前Token有效期不足一半时签发新的Token
        if (lifeSpan < DateTimeOffset.UtcNow)
        {
            var tokenId = long.Parse(httpContext.GetClaimByUser("tokenId")!);
            var userId = long.Parse(httpContext.GetClaimByUser("userId")!);

            string key = "IssueNewToken" + tokenId;

            var distLock = httpContext.RequestServices.GetRequiredService<IDistributedLock>();
            var cache = httpContext.RequestServices.GetRequiredService<IDistributedCache>();

            if (distLock.TryLock(key) != null)
            {
                var newToken = db.TUserToken.Where(t => t.LastId == tokenId && t.CreateTime > nbfTime).FirstOrDefault();

                if (newToken == null)
                {
                    var tokenInfo = db.TUserToken.Where(t => t.Id == tokenId).FirstOrDefault();

                    if (tokenInfo != null)
                    {
                        TUserToken userToken = new()
                        {
                            Id = idHelper.GetId(),
                            UserId = userId,
                            LastId = tokenId
                        };

                        var claims = new Claim[]{
                                new("tokenId",userToken.Id.ToString()),
                                new("userId",userId.ToString())
                            };

                        var configuration = httpContext.RequestServices.GetRequiredService<IConfiguration>();
                        var jwtSetting = configuration.GetRequiredSection("JWT").Get<JWTSetting>()!;
                        var jwtPrivateKey = ECDsa.Create();
                        jwtPrivateKey.ImportECPrivateKey(Convert.FromBase64String(jwtSetting.PrivateKey), out _);
                        SigningCredentials creds = new(new ECDsaSecurityKey(jwtPrivateKey), SecurityAlgorithms.EcdsaSha256);
                        JwtSecurityToken jwtSecurityToken = new(jwtSetting.Issuer, jwtSetting.Audience, claims, DateTime.UtcNow, DateTime.UtcNow + jwtSetting.Expiry, creds);

                        var token = new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken);

                        db.TUserToken.Add(userToken);

                        if (distLock.TryLock("ClearExpireToken") != null)
                        {
                            var clearTime = DateTime.UtcNow.AddDays(-7);
                            var clearList = db.TUserToken.Where(t => t.CreateTime < clearTime).ToList();
                            db.TUserToken.RemoveRange(clearList);
                        }

                        db.SaveChanges();

                        cache.Set(userToken.Id + "token", token, TimeSpan.FromMinutes(10));

                        httpContext.Response.Headers.Append("NewToken", token);
                        httpContext.Response.Headers.Append("Access-Control-Expose-Headers", "NewToken");
                    }
                }
                else
                {
                    var token = cache.GetString(newToken.Id + "token");
                    httpContext.Response.Headers.Append("NewToken", token);
                    httpContext.Response.Headers.Append("Access-Control-Expose-Headers", "NewToken");
                }
            }
        }
    }
```

使用方法

```c#
builder.Services.AddAuthorizationBuilder()
    .SetDefaultPolicy(new AuthorizationPolicyBuilder().RequireAuthenticatedUser()
        .RequireAssertion(context => IdentityVerification.Authorization(context)).Build());
```

## 认证

```csharp
//全局禁止匿名访问
services.AddControllers((options) =>
{
    options.Filters.Add(new AuthorizeFilter());//添加全局的Authorize
});

// 支持对控制器、方法标注该特性进行授权
[Authorize]

// 允许匿名访问，可应用于控制器和方法
[AllowAnonymous]

// 对一个方法设置指定角色才可以访问
[Authorize(Roles = "admin")]

// 设置拥有该策略的用户才可以访问
[Authorize(Policy = "Over18")]
```

### Bearer认证
Bearer认证（也叫做令牌认证）是一种HTTP认证方案，其中包含的安全令牌的叫做Bearer Token。因此Bearer认证的核心是Token。那如何确保Token的安全是重中之重。一种方式是使用Https，另一种方式就是对Token进行加密签名。而JWT就是一种比较流行的Token编码方式。

### 原理

- 获取token
- 第一步：对token进行切割
- 第二步：对第二段解码，获取payload，检测token是否超时
- 第三步：把前两段拼接再次执行HS256加密，把加密后的密文和第三段比较。如果相等，认证通过

## 参考文档
晓晨：[https://www.cnblogs.com/stulzq/p/7417548.html](https://www.cnblogs.com/stulzq/p/7417548.html)
老张的哲学：[https://www.cnblogs.com/laozhang-is-phi/category/1413402.html](https://www.cnblogs.com/laozhang-is-phi/category/1413402.html)
[https://mp.weixin.qq.com/s/2lYgWeyIzwVYqV9L4kiomg](https://mp.weixin.qq.com/s/2lYgWeyIzwVYqV9L4kiomg) | 深入理解 JWT
[https://mp.weixin.qq.com/s/1jlzB_QlDdghqHzSiqtNlw](https://mp.weixin.qq.com/s/1jlzB_QlDdghqHzSiqtNlw) | Jwt Token 的刷新机制设计
[https://mp.weixin.qq.com/s/BGZkkq02vSX7oO7a7RJxNA](https://mp.weixin.qq.com/s/BGZkkq02vSX7oO7a7RJxNA) | ASP.NET Core 自动刷新JWT Token
[https://mp.weixin.qq.com/s/EPX55vkrOVjneEf3XEOqCA](https://mp.weixin.qq.com/s/EPX55vkrOVjneEf3XEOqCA) | 理解ASP.NET Core - 授权(Authorization)

在.net中验证jwt：https://auth0.com/blog/how-to-validate-jwt-dotnet/
无感刷新token：https://mp.weixin.qq.com/s/J20hj_KRdQ63D6zXVG0U8w