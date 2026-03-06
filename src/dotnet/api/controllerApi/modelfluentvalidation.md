---
title: 模型验证FluentValidation
lang: zh-CN
date: 2023-10-05
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: moxingyanzhengfluentvalidation
slug: gakfwu
docsId: '68372268'
---

## 说明
用于构建强类型验证规则的.NET 库。FluentValidation的原理是通过实现`AbstractValidator<T>`来实现对T实体类的验证，通过不同的Rule来验证T中的属性。

文档：[https://fluentvalidation.net/](https://fluentvalidation.net/)

Github：[https://github.com/FluentValidation/FluentValidation](https://github.com/FluentValidation/FluentValidation)

## 操作
> 本文示例代码：vs2022、.Net6

.Net WebApi项目引用组件
```plsql
 <PackageReference Include="FluentValidation.AspNetCore" Version="11.2.1" />
```
进行注册服务
```csharp
builder.Services.AddFluentValidation(opt =>
{
    opt.RegisterValidatorsFromAssembly(Assembly.GetEntryAssembly());
});
```

### 基本操作
比如我们要实现一个登录接口，那么我们有一个模型类
```csharp
public class LoginRequest
{
    public string UserName { get; set; }

    public string Password { get; set; }
}
```
对模型类进行限制
```csharp
public class LoginValidator : AbstractValidator<LoginRequest>
{
    public LoginValidator()
    {
        RuleFor(t => t.UserName).NotNull().NotEmpty().WithMessage("用户名不能为空")
            .Length(6, 15).WithMessage("长度必须介于6-15长度之间");

        RuleFor(t => t.Password).NotNull().NotEmpty().WithMessage("密码不能为空")
            .Length(6, 15).WithMessage("长度必须介于6-15长度之间"); 
    }
}

```
这样自己就可以在传参进行模型匹配时候进行验证，不通过提示如下信息
```csharp
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.1",
  "title": "One or more validation errors occurred.",
  "status": 400,
  "traceId": "00-471f1e5929b55f95c9a79927f20ed06a-e4b0fa2aeac96abe-00",
  "errors": {
    "UserName": [
      "用户名不能为空",
      "长度必须介于6-15长度之间"
    ]
  }
}
```
关于其他更多的校验写法，可以查看官网。

### 调用方法校验
也可以将其他类注入到校验的服务中，进行调用方法校验，举例我们需要添加人员，有以下伪代码
```csharp
[Route("api/[controller]")]
[ApiController]
public class PersionController : ControllerBase
{
    /// <summary>
    /// 添加人
    /// </summary>
    /// <param name="request"></param>
    /// <returns></returns>
    [HttpPost("add")]
    public bool AddPersion(PersonRequest request)
    {
        // xxx执行添加方法

        return true;
    }
}
```
model类以及校验的类如下
```csharp
/// <summary>
/// 人员请求类
/// </summary>
public class PersonRequest
{
    public int Id { get; set; }

    /// <summary>
    /// 人员地址信息
    /// </summary>
    public PersonAddressDto Address { get; set; }
}

/// <summary>
/// Person验证
/// </summary>
public class PersonValidator : AbstractValidator<PersonRequest>
{
    public PersonValidator(IPersonService personService)
    {
        RuleFor(p => p.Address).SetValidator(new PersonAddressValidator());

        //通过调用外部方法来验证
        RuleFor(p => p.Id).Must(id => personService.IsExist(id)).WithMessage(p => $"不存在id={p.Id}的用户");
    }
}

/// <summary>
///人员地址信息
/// </summary>
public class PersonAddressDto
{
    public string Country { get; set; }
    public string Province { get; set; }
}

/// <summary>
/// Person Address验证
/// </summary>
public class PersonAddressValidator : AbstractValidator<PersonAddressDto>
{
    public PersonAddressValidator()
    {
        RuleFor(a => a.Country).NotNull().NotEmpty();
        RuleFor(a => a.Province).NotNull().NotEmpty();
    }
}
```
这个校验类中使用了服务IPersonService，代码如下
```csharp
public interface IPersonService
{
    public bool IsExist(int id);
}

public class PersonService : IPersonService
{
    public bool IsExist(int id)
    {
        return id > 0;
    }
}
```
并且将该服务注册
```csharp
builder.Services.AddFluentValidation(opt =>
{
    opt.RegisterValidatorsFromAssembly(Assembly.GetEntryAssembly());
});

//注册服务
builder.Services.AddScoped<IPersonService, PersonService>();
```
当我们启动项目后调用该接口，当我们传输id为0的时候会直接提示不存在该id的用户。

### 模板化代码封装
在上面我们发现每次新建一个验证器，就必须创建一个继承自AbstractValidator的类，每个需要验证的模型都需要需要创建一个，很繁琐，所以思考一种不需要写类的方法
```csharp
/// <summary>
/// 公共的校验
/// </summary>
/// <typeparam name="T"></typeparam>
public class CommonVaildator<T> : AbstractValidator<T>
{
    /// <summary>
    /// 长度校验
    /// </summary>
    /// <param name="expression"></param>
    /// <param name="min"></param>
    /// <param name="max"></param>
    /// <param name="Message"></param>
    public void LengthVaildator(Expression<Func<T, string>> expression, int min, int max, string Message)
    {
        RuleFor(expression).Length(min, max).WithMessage(Message);
    }

    /// <summary>
    /// 必填校验
    /// </summary>
    /// <param name="expression"></param>
    /// <param name="expression2"></param>
    /// <param name="Message"></param>
    public void MustVaildator(Expression<Func<T, string>> expression, Func<T, string, bool> expression2, string Message)
    {
        RuleFor(expression).Must(expression2).WithMessage(Message);
    }

    /// <summary>
    /// 邮箱校验
    /// </summary>
    /// <param name="expression"></param>
    /// <param name="Message"></param>
    public void EmailAddressVaildator(Expression<Func<T, string>> expression, string Message)
    {
        RuleFor(expression).EmailAddress().WithMessage(Message);
    }
}

/// <summary>
/// 校验帮助类
/// </summary>
public static class VaildatorHelper
{
    public static string ModelValidator<T>(T source, AbstractValidator<T> sourceValidator) where T : class
    {
        var results = sourceValidator.Validate(source);
        if (!results.IsValid)
            return string.Join(Environment.NewLine, results.Errors.Select(x => x.ErrorMessage).ToArray());
        else
            return "";
    }
}
```
简单封装这个后，我们就可以在用的时候再进行校验，比如
```csharp
[HttpPost("2")]
public bool Login2(LoginRequest2 request)
{
    var requestVaildator = new CommonVaildator<LoginRequest2>();
    requestVaildator.LengthVaildator(t => t.UserName, 2, 8, "长度必须大于2小于8");
    requestVaildator.MustVaildator(t => t.Sex, (user, _) => user.Sex == "男" || user.Sex == "女", "性别输入错误");
    string msg = VaildatorHelper.ModelValidator(request, requestVaildator); // 输出错误信息

    return request.UserName == "1" && request.Password == "1";
}
```
好的一点就是不用在写一对校验类了。

## 资料
[FluentValidation封装，不用写AbstractValidator](https://mp.weixin.qq.com/s/n_oCnaGuDwzCn8jiqed57w)

