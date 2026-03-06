---
title: 模型绑定和验证
lang: zh-CN
date: 2023-10-17
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: moxingbangdingheyanzheng
slug: btp3rp
docsId: '45493047'
---

## 说明
模型绑定就是接收将来自HTTP请求的数据映射到模型的过程，这个过程是自动进行的。如果找不到模型属性的值，并不会报错，而是给该属性设置默认值。
示例：比如我们有一个接口为

```csharp
[HttpGet("{id}")]
public ActionResult<Pet> GetById(int id, bool dogsOnly)
```
这个时候你的请求为：[http://localhost:5000/api/pets/2?DogsOnly=true](http://contoso.com/api/pets/2?DogsOnly=true)
路由系统选择该Action后，模型绑定会执行以下的步骤：

- 查找 `GetByID` 的第一个参数，该参数是一个名为 `id` 的整数。
- 查找 HTTP 请求中的可用源，并在路由数据中查找 `id` =“2”。
- 将字符串“2”转换为整数 2。
- 查找 `GetByID` 的下一个参数，该参数是一个名为 `dogsOnly` 的布尔值。
- 查找源，并在查询字符串中查找“DogsOnly=true”。 名称匹配不区分大小写。
- 将字符串“true”转换为布尔值 `true`。

最后会调用GetById方法，参数Id为2，参数dogsOnly为true。

## 绑定源
默认情况下，模型绑定以键值对的形式从HTTP请求中的以下源中获取数据，绑定源属性会告诉model的绑定引擎从哪里找到绑定源：

1. 表单域
2. 请求正文
3. 路由数据
4. 查询字符串参数
5. 上传的文件

对于每个参数，按照顺序扫描源。也可以直接指定源

- [FromQuery] - 从查询字符串获取值。
- [FromRoute] - 从路由数据获取值。
- [FromForm] - 从发布表单字段中获取值。
- [FromBody] - 从请求正文获取值。
- [FromHeader] - 从 HTTP 标头获取值。

示例：
```csharp
[HttpGet]
public async Task<User> GetAsync([FromQuery]string id)
    
[HttpGet]
public async Task<User> GetAsync([FromRoute]string id)
    
[HttpGet]
public async Task<User> GetAsync([FromForm]string id)
    
[HttpPost]
public async Task<ActionResult<string>> AddAsync([FromBody]AddUserVm dto)
    
public void OnGet([FromHeader(Name = "Accept-Language")] string language)
```
也可以编写自定义的值提供程序，比如从cookie中获取会话状态，参考：[https://docs.microsoft.com/zh-cn/aspnet/core/mvc/models/model-binding?view=aspnetcore-5.0#additional-sources](https://docs.microsoft.com/zh-cn/aspnet/core/mvc/models/model-binding?view=aspnetcore-5.0#additional-sources)

## 模型绑定

模型绑定顺序：[https://dev.to/prawiropanji/understanding-model-binding-in-aspnet-m0](https://dev.to/prawiropanji/understanding-model-binding-in-aspnet-m0)

### 绑定的规则

* 如果没有标记特性，且你的参数为简单类型，如int、string、double等基元类型，那么webapi那么会尝试从url中读取值，即默认为 [FromUri]特性，调试用params传递参数，params是用于查询字符串的，你的参数key和value会拼接在你的url后面
* 如果参数贴了特性[FromBody]或者你的参数为复杂类型，如class，那么webapi将会尝试强制从你的body里面读取数据，而你的对应参数值必须是序列化以后的数据，调试在body里面传递json字符串，且content-type格式设置为application/json。
* 如果你贴了特性[FromForm]，参数以表单的形式提交。也就是在你的body里面是这样的键值对形式a =1, b =1这样的形式，调试在x-www-form-urlencoded中传递键值对数据，且content-type格式设置为multipart/form-data

### 简单模型绑定
例如：bool、byte、char、DateTime、DateTimeOffset、float、enum、guid、int、TimeSpan、Url、Version等

### 复杂类型
使用复杂类型必须具有要绑定的公共默认构造函数和公共可写属性。进行模型绑定时候，将使用公共默认构造函数来实例化类。对于复杂类型的每个属性，模型绑定会查找名称模式 prefix.property_name 的源。 如果未找到，它将仅查找不含前缀的 properties_name。不过一般我们使用都是进行完全匹配，特殊需求才会做此操作。
参考资料：[https://docs.microsoft.com/zh-cn/aspnet/core/mvc/models/model-binding?view=aspnetcore-5.0#complex-types](https://docs.microsoft.com/zh-cn/aspnet/core/mvc/models/model-binding?view=aspnetcore-5.0#complex-types)

### 内置自定义模型绑定
通过`ByteArrayModelBinder` 可以实现将传输的base64编码字符串转换为字节数组。
比如:
```csharp
[HttpPost]
public void Post([FromForm] byte[] file, string filename)
{
	var trustedFileName = Path.GetRandomFileName();
	var filePath = Path.Combine("e://", trustedFileName);

	if (System.IO.File.Exists(filePath))
	{
		return;
	}

	System.IO.File.WriteAllBytes(filePath, file);
}
```
请求示例
![image.png](/common/1623573025670-a091a4da-90ce-4dec-b630-43ccaebabf91.png)
接收结果
![image.png](/common/1623573080249-e2bc5bfc-bc98-490d-99cc-c5556f26f457.png)

### 自定义模型绑定
官网文章：[https://learn.microsoft.com/zh-cn/aspnet/core/mvc/advanced/custom-model-binding?view=aspnetcore-7.0](https://learn.microsoft.com/zh-cn/aspnet/core/mvc/advanced/custom-model-binding?view=aspnetcore-7.0)

#### 请求头Token绑定
示例场景：通过请求头传递后端自定义的一种token，通过自定义模型绑定将token解析后绑定到请求模型。
> 参考资料：[https://www.cnblogs.com/jyzhu/articles/8670536.html](https://www.cnblogs.com/jyzhu/articles/8670536.html)

请求接口示例
```csharp
[HttpGet]
public ActionResult GetToken(TokenModel dto)
{
	return Ok(dto);
}
```
首先定义token模型类
```csharp
public class TokenModel
{
	public int UserID { get; set; }

	public string UserName { get; set; }
}
```
自定义模型绑定器
```csharp
public class TokenModelBinder : IModelBinder
{
	/// <summary>
	/// 请求里传递参数token
	/// </summary>
	/// <param name="bindingContext"></param>
	/// <returns></returns>
	public Task BindModelAsync(ModelBindingContext bindingContext)
	{
		//参数必须包含token
		if (!(bindingContext.ActionContext.HttpContext.Request.Headers.ContainsKey("token")))
			return Task.CompletedTask;

		var token = bindingContext.ActionContext.HttpContext.Request.Headers["token"];

		//TODO  解析token
		var result = new TokenModel()
		{
			UserID = 111,
			UserName = "azrng",
		};
		bindingContext.Result = ModelBindingResult.Success(result);
		return Task.CompletedTask;
	}
}
```
定义token框架绑定器
```csharp
public class TokenModelBinderProvider : IModelBinderProvider
{
	public IModelBinder GetBinder(ModelBinderProviderContext context)
	{
		if (context == null)
		{
			throw new ArgumentNullException(nameof(context));
		}

		if (context.Metadata.ModelType == typeof(TokenModel))
			return new TokenModelBinder();

		return null;
	}
}
```
启用绑定器
```csharp
services.AddControllers(options =>
{
    options.ModelBinderProviders.Insert(0, new TokenModelBinderProvider());
});
```
请求示例
```csharp
var client = new RestClient("http://localhost:5000/api/ModelVerify/GetToken");
client.Timeout = -1;
var request = new RestRequest(Method.GET);
request.AddHeader("token", "123456");
IRestResponse response = client.Execute(request);
Console.WriteLine(response.Content);
```
结果就是可以在GetToken方法参数获取到我们token的值。

#### 数组绑定
目的：实现将url中的`?userIds=[1,2,3]`绑定到入参的`([FromQuery] int[] userIds)`数据上面

实现IntArrayModelBinderProvider，然后调用`options.ModelBinderProviders.Add(new IntArrayModelBinderProvider());`

```sql
/// <summary>
/// 实现IntArrayModelBinderProvider：
/// </summary>
public class IntArrayModelBinderProvider : IModelBinderProvider
{
    public IModelBinder? GetBinder(ModelBinderProviderContext context)
    {
        if (context == null)
        {
            throw new ArgumentNullException(nameof(context));
        }

        if (context.Metadata.ModelType == typeof(int[]))
        {
            return new IntArrayModelBinder();
        }

        return null;
    }
}
```
模仿着ByteArrayModelBinder编写IntArrayModelBinder
```sql
public class IntArrayModelBinder : IModelBinder
{
    public Task BindModelAsync(ModelBindingContext bindingContext)
    {
        //获取传入的值
        var valueProviderResult = bindingContext.ValueProvider.GetValue(bindingContext.ModelName);

        var value = valueProviderResult.FirstValue;

        //string 转 int[]
        var model = value.Trim('[', ']').Split(',').Select(str => int.Parse(str)).ToArray();

        //绑定到参数
        bindingContext.Result = ModelBindingResult.Success(model);

        return Task.CompletedTask;
    }
}
```
添加到ModelBinderProviders中
```sql
services.AddControllers(options =>
{
    options.ModelBinderProviders.Insert(0, new IntArrayModelBinderProvider());
});
```
资料：[https://www.yuque.com/azrng/notes/btp3rp#7dLv2](#7dLv2)

#### 用IParsable进行复杂类型绑定
如果想实现 dates=1-1&dates=2-2 字符串绑定下面的接口上
```csharp
[HttpGet]
public string GetResults([FromQuery] MyDate[] dates)
{
    foreach (var date in dates)
    {
        Console.WriteLine($"Month:{date.Month} Day:{date.Day}");
    }
    return "success";
}
```
我们可以修改MyDate类继承自`IParsable<T>`
```csharp
public class MyDate : IParsable<MyDate>
{
    public int Month { get; set; }
    public int Day { get; set; }

    public void Parse(string input)
    {
        var parts = input.Split('-');
        Month = int.Parse(parts[0]);
        Day = int.Parse(parts[1]);
    }

    public static MyDate Parse(string s, IFormatProvider? provider)
    {
        var date = new MyDate();
        date.Parse(s);
        return date;
    }

    public static bool TryParse(string? s, IFormatProvider? provider, out MyDate result)
    {
        try
        {
            result = Parse(s, provider);
            return true;
        }
        catch
        {
            result = default;
            return false;
        }
    }
}
```
这样自己就可以绑定了

#### Json格式请求参数绑定

对于json格式的入参，不去创建Action类，直接像[FromQuery]一样进行绑定。
仓库地址：[https://github.com/yangzhongke/YouZack.FromJsonBody](https://github.com/yangzhongke/YouZack.FromJsonBody)

##### 安装nuget包

```csharp
Install-Package YouZack.FromJsonBody
```

##### 快速上手

在项目的Startup.cs中添加using YouZack.FromJsonBody;
然后在Configure方法的UseEndpoints()之前添加如下代码：

```csharp
app.UseFromJsonBody();
```

然后就可以在控制器中使用下面代码进行绑定

```csharp
public IActionResult Test([FromJsonBody]string phoneNumber, [FromJsonBody]string test1)
```

资料来源：[https://www.bilibili.com/read/cv10150076](https://www.bilibili.com/read/cv10150076)

## 模型校验

现在dotNetCore如果在控制器标识[ApiController],那么就会在进action前就会自动校验模型类绑定是否符合要求，如果不符合要求自动触发HTTP400错误响应。[原文](https://docs.microsoft.com/zh-cn/aspnet/core/web-api/?view=aspnetcore-5.0#automatic-http-400-responses)
```csharp
[ApiController]
[Route("[controller]")]
public class WeatherForecastController : ControllerBase
```
官网文章：[https://learn.microsoft.com/zh-cn/aspnet/core/mvc/models/validation?view=aspnetcore-7.0](https://learn.microsoft.com/zh-cn/aspnet/core/mvc/models/validation?view=aspnetcore-7.0)

### 验证特性
通过验证特性可为属性增加验证规则。不仅仅有内置的验证特性，还可以实现自定义验证特性。
定义验证规则：使用内置方法或者使用第三方库

- Data Annotations。例如 [Required]，[MaxLength]等等。 
- 自定义Atrribute。 
- 实现IValidatableObject接口。 

#### 内置验证特性
常用的有：必填、长度验证、数值范围、手机号码、邮箱，还可以使用正则验证
```csharp
public class AddModelVerify
{
	[Display(Name = "名称"), Required(ErrorMessage = "{0}不能为空")]// 非空校验 
	[MinLength(6, ErrorMessage = "名称不能小于6位")] // 最小长度校验
	[MaxLength(10, ErrorMessage = "长度不超过10个")] // 最大长度校验
	public string UserName { get; set; }

	/// <summary>
	/// 密码
	/// </summary>
	[Display(Name = "密码"), Required(ErrorMessage = "{0}不能为空")]
	[MinLength(6, ErrorMessage = "密码必须大于6位")]
	public string PassWord { get; set; }

	[Display(Name = "工号")] // 友好名称错误提示
	[Required(ErrorMessage = "{0}不能为空")]
	[StringLength(10, MinimumLength = 1, ErrorMessage = "{0}长度是{1}")]
	public string EmployeeNo { get; set; }
    
    [Range(0, 999.99)]
    public decimal Price { get; set; }
}

public IActionResult VerifyPhone([RegularExpression(@"^\d{3}-\d{3}-\d{4}$")] string phone)
```
> 除了上面这些还有其他内置特性：[https://docs.microsoft.com/zh-cn/aspnet/core/mvc/models/validation?view=aspnetcore-5.0#built-in-attributes](https://docs.microsoft.com/zh-cn/aspnet/core/mvc/models/validation?view=aspnetcore-5.0#built-in-attributes)

请求地址传入空值，输出结果：HTTP错误400
```csharp
{
  "errors": {
    "PassWord": [
      "密码不能为空",
      "密码必须大于6位"
    ],
    "UserName": [
      "名称不能为空",
      "名称不能小于6位"
    ],
    "EmployeeNo": [
      "工号不能为空",
      "工号长度是10"
    ]
  },
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.1",
  "title": "One or more validation errors occurred.",
  "status": 400,
  "traceId": "00-d16b945b3e172a42bfe5b53d08f7487b-8d87c2ca238fdc4a-00"
}
```
还有一个Remote特性感觉挺有意思，使用场景是比如在ID上标注远程特性，绑定时候自定验证ID是否有效
```csharp
[AcceptVerbs("GET", "POST")]
public IActionResult VerifyID(string id)
{
    if (!_userService.VerifyID(id))
    {
        return Json($"对象未找到");
    }
    return Json(true);
}
```
模型类使用指向操作方法的[Remote]特性注释属性
```csharp
[Remote(action: "VerifyID", controller: "Users")]
public string ID { get; set; }
```
> Remote其他用法：[https://docs.microsoft.com/zh-cn/aspnet/core/mvc/models/validation?view=aspnetcore-5.0#additional-fields](https://docs.microsoft.com/zh-cn/aspnet/core/mvc/models/validation?view=aspnetcore-5.0#additional-fields)


#### 自定义特性
对于内置验证特性无法处理的情况，我们可以创建自定义验证特性。
模拟场景：添加用户时候，设置名字和工号不能一致，出生日期必须小于当前时间
输入模型类
```csharp
public class AddUserinfoVm
{
	[Display(Name = "名称"), Required(ErrorMessage = "{0}不能为空")]
	[MinLength(6, ErrorMessage = "名称不能小于6位")]
	[MaxLength(10, ErrorMessage = "长度不超过10个")]
	public string UserName { get; set; }

	/// <summary>
	/// 密码
	/// </summary>
	[Display(Name = "密码"), Required(ErrorMessage = "{0}不能为空")]
	[MinLength(6, ErrorMessage = "密码必须大于6位")]
	public string PassWord { get; set; }

	[Display(Name = "工号")]
	[Required(ErrorMessage = "{0}不能为空")]
	[StringLength(10, MinimumLength = 1, ErrorMessage = "{0}长度是{1}")]
	public string EmployeeNo { get; set; }

	/// <summary>
	/// 出生日期
	/// </summary>
	public DateTime Birthday { get; set; }
}
```

##### 方案一
通过添加AddUserVerifyAttribute来实现
**该方法是类级别验证，不具有全局性**

::: details

```csharp
[AttributeUsage(AttributeTargets.All, AllowMultiple = false)]
public class AddUserVerifyAttribute : ValidationAttribute
{
	protected override ValidationResult IsValid(object value, ValidationContext validationContext)
	{
		var user = (AddUserinfoVm)validationContext.ObjectInstance;//user 变量表示 AddUserinfoVm 对象，其中包含表单提交中的数据
		var date = (DateTime)value;
		if (date > DateTime.Now)
		{
			return new ValidationResult("出生日期不能大于当前时间");
		}
		if (user.UserName == user.EmployeeNo)
		{
			return new ValidationResult("名称和工号不能一样");
		}
		return ValidationResult.Success;
	}
}
```
使用方法

```csharp
[AddUserVerify]
public DateTime Birthday { get; set; }
```

:::

##### 方案二(类级别)
模型类中继承IValidatableObject，并实现Validate方法。
**该方法是类级别验证，不具有全局性**

::: details

```csharp
/// <summary>
/// 属性级别的自定义验证，该方法在模型类中创建，该模型类需要继承自IValidatableObject
/// </summary>
/// <param name="validationContext"></param>
/// <returns></returns>   
public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
{
	if (Birthday > DateTime.Now)
	{
		yield return new ValidationResult("出生日期不能大于当前时间", new[] { nameof(Birthday) });
	}
	if (UserName == EmployeeNo)
	{
		yield return new ValidationResult("名称和工号不能一样", new[] { nameof(UserName), nameof(EmployeeNo) });
	}
}
```
请求参数：
```csharp
{
  "userName": "string",
  "passWord": "string",
  "employeeNo": "string",
  "birthday": "2021-06-15T14:34:52.192Z"
}
```
输出错误信息
```csharp
{
  "errors": {
    "Birthday": [
      "出生日期不能大于当前时间"
    ],
    "UserName": [
      "名称和工号不能一样"
    ],
    "EmployeeNo": [
      "名称和工号不能一样"
    ]
  },
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.1",
  "title": "One or more validation errors occurred.",
  "status": 400,
  "traceId": "00-18854d59f6b6fc48b5c4c6a6dbe3802c-ba23f594f351a64d-00"
}
```

:::

##### 方案三※

模仿现有的节点验证进行扩展

::: details

举例最小值限制

```csharp
/// <summary>
///验证最小值
/// </summary>
[AttributeUsage(AttributeTargets.All, AllowMultiple = false)]
public class ValidMinValueAttribute : ValidationAttribute
{
    private readonly int _minValue;

    public ValidMinValueAttribute(int minValue)
    {
        _minValue = minValue;
    }

    public override bool IsValid(object? value)
    {
        if (value == null)
        {
            return false;
        }
        if (value is not int valueAsInt)
        {
            return false;
        }

        if (valueAsInt <= _minValue)
        {
            return false;
        }

        return true;
    }
}
```
标注特性
```csharp
[ValidMinValue(1, ErrorMessage = "值必须大于等于1")]
public int Id { get; set; } 
```
当我们传递不合适的值时候
```sql
{
    "errors": {
        "UserId": [
            "值必须大于等于1"
        ]
    },
    "type": "https://tools.ietf.org/html/rfc7231#section-6.5.1",
    "title": "One or more validation errors occurred.",
    "status": 400,
    "traceId": "00-869a6b371a821f168a11eb06085950b6-9c9e21e35a8614c5-00"
}
```

:::

##### 方案四

通过自己编写特性，搭配过滤器实现

::: details

增加特性标注

```csharp
/// <summary>
/// 抽象根特性
/// </summary>
[AttributeUsage(AttributeTargets.All, AllowMultiple = false)]
public abstract class AbstractAttribute : Attribute
{
    /// <summary>
    /// 抽象验证方法
    /// </summary>
    /// <param name="oValue"></param>
    /// <returns></returns>
    public abstract IResultModel Validate(object oValue);
}

/// <summary>
/// 最小值校验特性 继承抽象特性，并重写Validate方法
/// </summary>
[AttributeUsage(AttributeTargets.All, AllowMultiple = false)]
public class ValidMinValue2Attribute : AbstractAttribute
{
    private readonly string _errorMessage;
    private readonly int _minValue;

    public ValidMinValue2Attribute(int minValue, string errorMessage = "最小值不符合要求")
    {
        _errorMessage = errorMessage;
        _minValue = minValue;
    }

    public override IResultModel Validate(object oValue)
    {
        if (oValue == null)
        {
            return new ResultModel
            {
                Code = "400",
                IsSuccess = false,
                Message = "参数无效"
                };
        }
        if (oValue is not int valueAsInt)
        {
            return new ResultModel
            {
                Code = "400",
                IsSuccess = false,
                Message = "参数格式不对"
                };
        }

        if (valueAsInt <= _minValue)
        {
            return new ResultModel
            {
                Code = "400",
                IsSuccess = false,
                Message = _errorMessage
                };
        }

        return new ResultModel
        {
            Code = "200",
            IsSuccess = true,
            Message = string.Empty
            };
    }
}
```
增加过滤器拦截处理
```sql
/// <summary>
/// 模型验证Action过滤器
/// </summary>
public class ModelVerifyFilter : ActionFilterAttribute
{
    // 当不关闭默认的框架验证的时候，进不来这点都已经校验返回了
    //services.Configure<ApiBehaviorOptions>(options => options.SuppressModelStateInvalidFilter = true);
    public override void OnActionExecuting(ActionExecutingContext context)
    {
        //因为我们还包含自定义的校验处理，所以这需要注释
        //if (context.ModelState.IsValid)
        //return;

        var errorResults = new List<ErrorInfo>();
        //默认的模型校验
        foreach (var (key, value) in context.ModelState)
        {
            var result = new ErrorInfo
            {
                Field = key,
            };
            foreach (var error in value.Errors)
            {
                if (!string.IsNullOrEmpty(result.Message))
                {
                    result.Message += '|';
                }

                result.Message += error.ErrorMessage;
            }

            errorResults.Add(result);
        }

        //自定义的模型校验处理
        foreach (var item in context.ActionArguments)
        {
            var type = item.Value?.GetType();
            if (type?.IsClass != true)
            {
                continue;
            }
            foreach (var property in type.GetProperties().Where(t => t.IsDefined(typeof(AbstractAttribute), true)))
            {
                foreach (AbstractAttribute attribute in property.GetCustomAttributes<AbstractAttribute>())
                {
                    var value = property.GetValue(item.Value);
                    if (value == null)
                        continue;

                    var info = attribute.Validate(value);
                    if (info.IsSuccess)
                        continue;
                    var result = new ErrorInfo
                    {
                        Field = property.Name,
                        Message = info.Message
                    };
                    errorResults.Add(result);
                }
            }
        }
        if (errorResults.Count == 0)
            return;

        context.Result = new BadRequestObjectResult(new ResultModel
        {
            Code = StatusCodes.Status400BadRequest.ToString(),
            Errors = errorResults,
            Message = "参数格式不正确"
        });
    }

    public override void OnActionExecuted(ActionExecutedContext context)
    {
    }
}
```
使用方法，在需要处理的特性上面标注
```sql
/// <summary>
/// 用户ID
/// </summary>
[ValidMinValue2(1, "用户ID必须大于等于1")]
[Required]
public int UserId { get; set; }
```

:::

### ModelState.IsValid

::: tip

如果控制器已经使用[ApiController]标识，那么该方法就不在需要,因为已经在进入Action之前已经处理了模型校验。

:::

通过该方法可以实现对请求类验证是否满足要求并做出相应的响应。
```csharp
[HttpPost]
public ActionResult Add([FromBody] AddModelVerify dto)
{
	//对请求类进行验证特性
	if (ModelState.IsValid)//指示该模型中是否有无效的值
	{
		//对请求类的值做出修改
		dto.UserName = "azrng";
		if (!TryValidateModel(dto))
		{
			//重新运行验证失败
			return Ok("修改值后验证失败");
		}
		return Ok("验证成功");
	}
	else
	{
		ModelState.AddModelError(string.Empty, "输入有误");
	}
	return Ok("");
}
```
控制器中手动再次校验
```plsql
// 定义一个类  并标注UserName长度为5
var aaa = new UserInfoRequest();
aaa.UserName = "sdafsdfskjfhsjahfj";
// 清除特定于模型的验证
ModelState.ClearValidationState(nameof(UserInfoRequest));
if (!TryValidateModel(aaa, nameof(UserInfoRequest)))
{
    // 获取测试信息的示例
   var errorInfo=ModelState.Values.Select(t => t.Errors[0].ErrorMessage).ToList();
}
```

### 禁用验证

#### 方案一
```csharp
/// <summary>
/// 创建不会将任何字段标记为无效的 IObjectModelValidator 实现。
/// </summary>
public class NullObjectModelValidator : IObjectModelValidator
{
    public void Validate(ActionContext actionContext,
        ValidationStateDictionary validationState, string prefix, object model)
    {
        // 该方法故意为空
    }
}
```
Startup.ConfigureServices中注入，以便替换依赖项注入容器中的默认 IObjectModelValidator 实现。
```csharp
services.AddSingleton<IObjectModelValidator, NullObjectModelValidator>();
```

#### 方案二(推荐)
直接在ConfigServices直接添加
```csharp
services.Configure<ApiBehaviorOptions>(options => options.SuppressModelStateInvalidFilter = true);
```

## 统一模型拦截器
::: details 增加ModelActionFiter过滤器

ASP.NET Core MVC 使用 [ModelStateInvalidFilter](https://docs.microsoft.com/zh-cn/dotnet/api/microsoft.aspnetcore.mvc.infrastructure.modelstateinvalidfilter) 操作筛选器来执行自定义验证。

```csharp
public class ModelActionFiter : ActionFilterAttribute
{
    public override void OnActionExecuted(ActionExecutedContext context)
    {
    }

    public override void OnActionExecuting(ActionExecutingContext context)
    {
        if (!context.ModelState.IsValid)
        {
            var errorResults = new List<ErrorResultDTO>();
            foreach (var item in context.ModelState)
            {
                var result = new ErrorResultDTO
                {
                    Field = item.Key,
                };
                foreach (var error in item.Value.Errors)
                {
                    if (!string.IsNullOrEmpty(result.Message))
                    {
                        result.Message += '|';
                    }
                    result.Message += error.ErrorMessage;
                }
                errorResults.Add(result);
            }
            context.Result = new BadRequestObjectResult(new
            {
                Code = StatusCodes.Status400BadRequest,
                Errors = errorResults
            });
        }
    }

    public class ErrorResultDTO
        
    {
        /// <summary>
        /// 参数领域
        /// </summary>
        public string Field { get; set; }

        /// <summary>
        /// 错误信息
        /// </summary>
        public string Message { get; set; }
    }
}
```
> 参考文档：[https://www.cnblogs.com/minskiter/p/11601873.html](https://www.cnblogs.com/minskiter/p/11601873.html)

ConfigureServices中注册过滤器并禁用默认的自动模型验证

```csharp
services.AddControllers(options =>
{
    options.Filters.Add<ModelActionFiter>(); //注册过滤器 
}).AddNewtonsoftJson().ConfigureApiBehaviorOptions(options =>
{
    //[ApiController] 默认自带有400模型验证，且优先级比较高，如果需要自定义模型验证，则需要先关闭默认的模型验证
    options.SuppressModelStateInvalidFilter = true; 
});
```
:::

或者也可以使用

::: details 注入的时候配置InvalidModelStateResponseFactory

```csharp
services.Configure<ApiBehaviorOptions>(options =>
{
    options.InvalidModelStateResponseFactory = actionContext =>
    {
        //获取验证失败的模型字段 
        var errorResults = new List<ErrorInfo>();
        foreach (var (key, value) in actionContext.ModelState.Where(e => e.Value?.Errors.Count > 0))
        {
            var errorInfo = new ErrorInfo { Field = key };
            foreach (var error in value.Errors)
            {
                if (!string.IsNullOrEmpty(errorInfo.Message))
                {
                    errorInfo.Message += '|';
                }

                errorInfo.Message += error.ErrorMessage;
            }

            errorResults.Add(errorInfo);
        }

        var result = new ResultModel
        {
            Code = StatusCodes.Status400BadRequest.ToString(), Errors = errorResults
        };

        return new BadRequestObjectResult(result);
    };
});
```

:::

两个方法都可以得到效果
```csharp
{
  "code": 400,
  "errors": [
    {
      "field": "PassWord",
      "message": "密码不能为空|密码必须大于6位"
    },
    {
      "field": "UserName",
      "message": "名称不能为空|名称不能小于6位"
    }
  ]
}
```

## 组件

### MiniValidation
在默认校验的基础上添加对单行验证调用和循环检测递归的支持
仓库地址：[https://github.com/DamianEdwards/MiniValidation](https://github.com/DamianEdwards/MiniValidation)

## 参考文档
模型绑定：[https://docs.microsoft.com/zh-cn/aspnet/core/mvc/models/model-binding?view=aspnetcore-5.0](https://docs.microsoft.com/zh-cn/aspnet/core/mvc/models/model-binding?view=aspnetcore-5.0)
禁用绑定源推理：[https://docs.microsoft.com/zh-cn/aspnet/core/web-api/?view=aspnetcore-5.0#disable-inference-rules](https://docs.microsoft.com/zh-cn/aspnet/core/web-api/?view=aspnetcore-5.0#disable-inference-rules)
禁用验证：[https://docs.microsoft.com/zh-cn/aspnet/core/mvc/models/validation?view=aspnetcore-5.0#disable-validation](https://docs.microsoft.com/zh-cn/aspnet/core/mvc/models/validation?view=aspnetcore-5.0#disable-validation)
禁用自动400响应：[https://docs.microsoft.com/zh-cn/aspnet/core/web-api/?view=aspnetcore-5.0#disable-automatic-400-response](https://docs.microsoft.com/zh-cn/aspnet/core/web-api/?view=aspnetcore-5.0#disable-automatic-400-response)
