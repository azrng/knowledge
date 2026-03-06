---
title: 强制下线
lang: zh-CN
date: 2022-08-28
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: jiangzhixiaxian
slug: sosu7e
docsId: '31329426'
---

## 方案一
- jwt验证人设置为动态的，每个用户都有自己自己的验证人，如果让用户强制下线，那么就修改该用户的验证人
- 生成token的时候，验证用户信息，然后根据user表的验证人去生成jwt
- 验证jwt的时候通过AudienceValidator方法去校验该验证人是否在数据库中存在数据，如果存在数据，那么说明验证通过。
```c
var db = services.BuildServiceProvider().GetService<IBaseQuery>().Db;

services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(o =>//认证
{
	o.Challenge = JwtBearerDefaults.AuthenticationScheme;
	o.RequireHttpsMetadata = false;
	o.TokenValidationParameters = new TokenValidationParameters
	{
		//3+2

		// 是否开启签名认证
		ValidateIssuerSigningKey = true,
		IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(config.JwtSecretKey)),
		// 发行人验证，这里要和token类中Claim类型的发行人保持一致

		ValidateIssuer = true,
		ValidIssuer = config.JwtIssuer,//发行人

		// 接收人验证
		ValidateAudience = true,
		//ValidAudience = config.JwtAudience,//验证人
		//或者
		AudienceValidator = (m, n, z) =>
		{
			var bbb = new UserInfo().Exist(db, m.FirstOrDefault());
			//m:Audience集合  n:解析后的jwt  z: token验证参数
			return m != null && bbb;
		},

		RequireExpirationTime = true,
		ValidateLifetime = true,
	};
	//2021年2月7日 13:49:04  增加token验证过期的时候给返回头设置提示
	o.Events = new JwtBearerEvents
	{
		OnAuthenticationFailed = content =>
		{
			if (content.Exception.GetType() == typeof(SecurityTokenExpiredException))
			{
				content.Response.Headers.Add("Token-Expired", "true");
			}
			return Task.CompletedTask;
		}
	};
});
```
```c
public bool Exist(ISqlSugarClient _db, string audience)
{
	var aa = _db.Queryable<User>().Any(t => t.Audience == audience);
	return aa;
}
```
经过测试，可以实现需求

## 方案二
通过将指定用户加入黑名单的形式来设置用户强制下线操作。比如将用户ID存入redis中,每次请求校验一次用户ID是否在redis中，如果在就不允许登录。
如果想实现某一个token不能用，那么就需要将某一个token存入redis，设置这个token的用户强制下线。

## 方案三
在用户表增加一个整数的列叫做JwtVersion，代表最后一次发放出来的令牌的版本号，每次登录、发放令牌、禁用用户、撤回令牌的时候都让该值进行自增，同时将jwtversion的值也放到jwt令牌中，当服务端收到客户端提交的jwt令牌去认证的时候，然后多一步和数据库中jwtversion的值进行比较，如果小于数据库版本号，那么就说明这jwt令牌过期了。

> 这个校验判断的方法可以加上缓存，在每次登录、发放令牌等操作的时候删除缓存

