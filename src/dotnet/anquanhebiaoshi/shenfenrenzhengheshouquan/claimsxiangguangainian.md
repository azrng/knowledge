---
title: Claims相关概念
lang: zh-CN
date: 2023-09-20
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: claimsxiangguangainian
slug: kga9ns
docsId: '32032890'
---

## 验证模型
ASP.NET Core 的验证模型是 claims-based authentication 。**Claim **是对被验证主体特征的一种表述，比如：登录用户名是...，email是...，用户Id是...，其中的“登录用户名”，“email”，“用户Id”就是ClaimType。
You can think of claims as being a statement about...That statement consists of a name and a value.
对应现实中的事物，比如驾照，驾照中的“身份证号码：xxx”是一个claim，“姓名：xxx”是另一个claim。
一组claims构成了一个identity，具有这些claims的identity就是 **ClaimsIdentity** ，驾照就是一种ClaimsIdentity，可以把ClaimsIdentity理解为“证件”，驾照是一种证件，护照也是一种证件。
ClaimsIdentity的持有者就是 **ClaimsPrincipal **，一个ClaimsPrincipal可以持有多个ClaimsIdentity，就比如一个人既持有驾照，又持有护照。
理解了Claim, ClaimsIdentity, ClaimsPrincipal这三个概念，就能理解生成登录Cookie为什么要用下面的代码？
```csharp
var claimsIdentity = new ClaimsIdentity(new Claim[] { new Claim(ClaimTypes.Name, loginName) }, "Basic");
var claimsPrincipal = new ClaimsPrincipal(claimsIdentity);
await context.Authentication.SignInAsync(_cookieAuthOptions.AuthenticationScheme, claimsPrincipal);
```
要用Cookie代表一个通过验证的主体，必须包含Claim, ClaimsIdentity, ClaimsPrincipal这三个信息，以一个持有合法驾照的人做比方，ClaimsPrincipal就是持有证件的人，ClaimsIdentity就是证件，"Basic"就是证件类型（这里假设是驾照），Claim就是驾照中的信息。
 
iss = Issuer Identifier：必须。提供认证信息者的唯一标识。一般是一个https的url（不包含querystring和fragment部分）。
sub = Subject Identifier：必须。iss提供的EU的标识，在iss范围内唯一。它会被RP用来标识唯一的用户。最长为255个ASCII个字符。
aud = Audience(s)：必须。标识ID Token的受众。必须包含OAuth2的client_id。
exp = Expiration time：必须。过期时间，超过此时间的ID Token会作废不再被验证通过。
iat = Issued At Time：必须。JWT的构建的时间。
auth_time = AuthenticationTime：EU完成认证的时间。如果RP发送AuthN请求的时候携带max_age的参数，则此Claim是必须的。
nonce：RP发送请求的时候提供的随机字符串，用来减缓重放攻击，也可以来关联ID Token和RP本身的Session信息。
acr = Authentication Context Class Reference：可选。表示一个认证上下文引用值，可以用来标识认证上下文类。
amr = Authentication Methods References：可选。表示一组认证方法。
azp = Authorized party：可选。结合aud使用。只有在被认证的一方和受众（aud）不一致时才使用此值，一般情况下很少使用。

## Claims(证件单元)
证件单元：比如我们需要存储一些东西，**姓名**：奥巴马；**性别**：男；**民族**：肯尼亚；**出生**：1961.08.04等这些身份信息，那么最方便的肯定是使用字段类型存储，一个key、value刚好满足我们的需求，但是我们更喜欢做成一个对象，就像下面这样子
```csharp
public class Claim
{
    public string ClaimType { get; set; }
 
    public string ClaimValue { get; set; }
}
```
这个claimType就是key，claimValue就是那个value，微软就为我们准备了一些默认的claimType
![image.png](/common/1614393556790-980f5355-b77d-4850-8f56-7ed5fdd0775e.png)

## ClaimsIdentity(身份证)
有了证件单元(claim)后，我们可以用多个claims可以组成一个身份证，然后就是claimsIdentity，这个名字代表是通过claims组织的，又表示表示其他的用途身份(Identity)，
这个身份证(ClaimsIdentity)还有一个重要的属性就是类型(AuthenticationType),这个是用来证明我们身份的，也就是你这身份的载体形式，比如实体类的还是纸质的还是电子形式的。
```csharp
public class ClaimsIdentity
{
    public ClaimsIdentity(IEnumerable<Claim> claims){}
    
    //名字这么重要，当然不能让别人随便改啊，所以我不许 set，除了我儿子跟我姓，所以是 virtual 的
    public virtual string Name { get; }
    public string Label { get; set; }
    
    //这是我的证件类型，也很重要，同样不许 set
    public virtual string AuthenticationType { get; }
    
    public virtual void AddClaim(Claim claim);
    
    public virtual void RemoveClaim(Claim claim);
    
    public virtual void FindClaim(Claim claim);
}
```
还要对整个证件信息进行约束，比如必须包含哪些信息，整个时候我们需要抽象出来一个接口来进行一些约束，对一些必要信息进行约束。
```csharp
// 定义证件对象的基本功能。
public interface IIdentity
{
    //证件名称
    string Name { get; }
    
    // 用于标识证件的载体类型。
    string AuthenticationType { get; }
    
    //是否是合法的证件。
    bool IsAuthenticated { get; }
}
```
所以我们的ClaimsIdentity最终看起来定义的是这样子的
```csharp
public class ClaimsIdentity : IIdentity
{
    //......
}

```
这样子，我们的ClaimsIdentity(身份证)介绍完毕。

## ClaimPrincipal(证件当事人)
一个人常常有多个身份，比如又是程序员还是外卖员，这个时候我们就需要一个载体来携带这些证件了，那我们就叫做一个证件当事人(ClaimsPrincipal)。
知道功能以后，我们就可以写出来如下代码
```csharp
public class ClaimsPrincipal 
{
    //把拥有的证件都给当事人
    public ClaimsPrincipal(IEnumerable<ClaimsIdentity> identities){}
    
    //当事人的主身份呢
    public virtual IIdentity Identity { get; }
    
    public virtual IEnumerable<ClaimsIdentity> Identities { get; }
    
    public virtual void AddIdentity(ClaimsIdentity identity);
}
```
这个时候我们还需要对其进行抽象一些，作为一个当事人，应该有一个主身份，这个时候就抽离出来一个接口(IPrincipal)接口
```csharp
public interface IPrincipal
{
    //身份
    IIdentity Identity { get; }
    
    //在否属于某个角色
    bool IsInRole(string role);
}
```
最终的证件当事人应该是这样子的
```csharp
public class ClaimsPrincipal : IPrincipal 
{
   //...
}
```

### 完整示例
```csharp
//证件单元数组
var claims = new Claim[]
{
    new Claim(ClaimTypes.NameIdentifier, "123456789"),
    new Claim(ClaimTypes.Name, "张先生"),
    new Claim(ClaimTypes.GivenName, "azrng"),
    new Claim(ClaimTypes.Email, "aa@163.com"),
};
//一个身份证，包含了多个证件单元
var identityClaims = new ClaimsIdentity(claims, "card");
//证件当事人可以存储多个证件
var userPrincipal = new ClaimsPrincipal(identityClaims);
```

## Authentication(认证)
认证：类似于火车的检票员，用于鉴别用户是否购买车票(是否经过认证)，可以控制别人是否可以上车。认证里面包含一个单词叫做AuthenticationScheme，这个是用来告诉检票员采用哪种鉴别方式进行鉴别的。
注册身份验证的中间件
```csharp
public void ConfigureServices(IServiceCollection services)
{
    ...
    
    services.AddAuthentication("Cookies")
        .AddCookie("Cookies"); 
        
    ...
} 
```
AddAuthentication 这里是指定默认的认证载体类型，AddCookie 这里是注册载体类型的处理程序。
登录保存身份信息到cookie
```csharp
//证件单元
var claims = new List<Claim>()
{
    new Claim(ClaimTypes.Name,"奥巴马"),
    new Claim(ClaimTypes.NameIdentifier,"身份证号")
};

//使用证件单元创建一张身份证
var identity = new ClaimsIdentity(claims,"Cookies");

//使用身份证创建一个证件当事人，也就是奥巴马
var identityPrincipal = new ClaimsPrincipal(identity);

//奥巴马开始过安检
await HttpContext.SignInAsync("Cookies", identityPrincipal);
```
可能有些同学会有疑问，我们基于Claim的Cookie存储假如我的**证件单元**很多，就会生成一个非常大的cookie，每次传输是有性能影响的，并且Cookie是有最大限制的，怎么办呢？
其实解决办法就是我们就可以开启这个 SessionStore，将Cookie存储在服务端例如Redis等缓存中。代码如下：
```csharp
services.AddSingleton<ITicketStore, MyRedisTicketStore>();

services.AddOptions<CookieAuthenticationOptions>("Cookies")
     .Configure<ITicketStore>((o, t) => o.SessionStore = t);
```
现在，浏览器中已经存储了用户的身份啦。
> 资料：[https://www.cnblogs.com/savorboard/p/authentication.html](https://www.cnblogs.com/savorboard/p/authentication.html)


