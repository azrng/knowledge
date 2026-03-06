---
title: 简单操作JWT Token
lang: zh-CN
date: 2023-09-14
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: jianchancaozuojwttoken
slug: nigoqr
docsId: '31306911'
---

## 开篇语
示例环境：vs2022、.net5  框架：WebAPI
![image.png](/common/1614697643706-a618f2c1-ea39-4d6a-8cf8-75078edbf5af.png)

## 引用组件
引用nuget包
```csharp
  <ItemGroup>
    <PackageReference Include="Microsoft.AspNetCore.Authentication.JwtBearer" Version="5.0.7" />
  </ItemGroup>
```

## 颁发
在appsettings中配置文章jwt信息
```csharp
  "JWTConfig": {
    "Secret": "sdfsdfsrty45634kkhllghtdgdfss345t678fs",//密钥长度太短会报出异常，最低16位
    "Issuer": "BlogCore",
    "Audience": "laozhang"
  }
```
在登录成功的时候我们会颁发token给前端，前端存储token并且在后续的每次请求都携带token来访问。然后新建控制器并添加下面的代码
```csharp
[HttpGet]
public ActionResult<string> Login()
{
    //前面是登录逻辑
    //登录成功
    var user = new { UserId = "112233445566", UserName = "张三", RoleId = "987654321" };

    var claims = new List<Claim>
    {
        new Claim(ClaimTypes.Name, user.UserName),
        new Claim(ClaimTypes.NameIdentifier, user.UserId),
        new Claim(ClaimTypes.Role,user.RoleId)
    };

    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWTConfig:Secret"]));
    var token = new JwtSecurityToken(
        issuer: _configuration["JWTConfig:Issuer"],
        audience: _configuration["JWTConfig:Audience"],
        claims: claims,
        notBefore: DateTime.Now,
        expires: DateTime.Now.AddHours(7), //过期时间7小时
        signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256));
    try
    {
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, $"生成token出错  {ex.Message}");
        return string.Empty;
    }
}
```
调用上面的接口会生成token，解析我们生成token如图
![image.png](/common/1625582630614-e6531c35-e9bd-47fc-986a-cae3c354d88d.png)
> 官方访问太慢，推荐该网站：[https://www.lizhanglong.com/Tools/DeserializeJwtToken](https://www.lizhanglong.com/Tools/DeserializeJwtToken)


## 获取信息
前端传递token然后后端解析token识别用户信息并处理逻辑
```csharp
[HttpGet]
[Authorize]//标识该接口需要认证才可以访问
public ActionResult<string> GetUserName()
{
    var userId = HttpContext.User.Claims.FirstOrDefault(t => t.Type == ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
    var name = HttpContext.User.Claims.FirstOrDefault(t => t.Type == ClaimTypes.Name)?.Value ?? string.Empty;
    var roleId = HttpContext.User.Claims.FirstOrDefault(t => t.Type == ClaimTypes.Role)?.Value ?? string.Empty;
    return Ok($"name:{name}  userId:{userId}  roleId:{roleId}");
}
```
请求接口，因为没有设置认证提示错误
![image.png](/common/1625582802887-b4d4e9f0-f868-4d4f-9814-e1e213909c88.png)

## 认证
在ConfigureServices中对于传输过来的jwt token进行判断认证
```csharp
services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(o =>//认证
{
    o.Challenge = JwtBearerDefaults.AuthenticationScheme;
    o.RequireHttpsMetadata = false;
    o.TokenValidationParameters = new TokenValidationParameters
    {
        //3+2

        // 是否开启签名认证
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(Configuration["JWTConfig:Secret"])),
        // 发行人验证，这里要和token类中Claim类型的发行人保持一致

        ValidateIssuer = true,
        ValidIssuer = Configuration["JWTConfig:Issuer"],//发行人

        // 接收人验证
        ValidateAudience = true,
        ValidAudience = Configuration["JWTConfig:Audience"],//验证人

        RequireExpirationTime = true,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero,//校验时间是否过期时，设置的时钟偏移量
    };
    // 增加token验证过期的时候给返回头设置提示
    o.Events = new JwtBearerEvents
    {
        //如果jwt过期  那么就先走这个失败的方法，再走OnChallenge
        OnAuthenticationFailed = content =>//过期时候的场景，会给返回头增加标识
        {
            if (content.Exception.GetType() == typeof(SecurityTokenExpiredException))
            {
                content.Response.Headers.Add("Token-Expired", "true");
            }
            return Task.CompletedTask;
        },
        OnChallenge = async context =>//验证失败自定义返回类
        {
            // 跳过默认的处理逻辑，返回下面的模型数据
            context.HandleResponse();

            context.Response.ContentType = "application/json;charset=utf-8";
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;

            //var result = new ServiceResult();//实例化返回类
            //result.IsFailed("UnAuthorized");
            //await context.Response.WriteAsync(result.ToJson());

            await context.Response.WriteAsync("验证失败");
        }

    };
});
```
> 注意：记得在Configure中开启身份认证 app.UseAuthentication();


## 获取用户信息
再次访问获取用户信息接口
![image.png](/common/1625583521852-45192eb4-4cd7-46a2-b7ea-e7044f16d36f.png)
在请求头添加【Authorization: Bearer token】进行请求。
![image.png](/common/1625583551251-7e893c5b-47ce-4f04-aa82-2e0ad4ab5415.png)
项目启动测试的时候更推荐配置使用swagger传递token进行测试

## 角色授权
修改GetUserName的授权为
```csharp
[Authorize(Roles = "超级管理员")]
```
再次访问为403资源不可用，那么我们就创建一个获取一个角色为超级管理员的token(在生成token的时候将用户的角色设置为超级管理员)，再次请求
![image.png](/common/1625583832713-97462c89-f539-4fc5-86e5-8834ed48a33b.png)
当然这个只是基本的操作，还有策略授权、自定义授权封装等,不过本文内容已经够为下次文章铺垫。

## 参考文档
> 博客园老张的哲学

