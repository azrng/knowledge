---
title: 过滤器注册方式
lang: zh-CN
date: 2022-07-19
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: guolvqizhucefangshi
slug: xhn2ow
docsId: '31414090'
---
过滤器的注册方式有：Action、Controller、全局

## Action注册方式
局部注册方式，针对控制器中的某个方法上标注特性的方式进行注册，代码如下
```csharp
[AuthonizationFilter()]
public IActionResult Index()
{
	return View();
}
```

## Controller注册方式
如果使用action方式，如果一个控制器中的好几个action方式都使用了这个过滤器，那么我们就需要一个一个action进行标注注册，所以我们直接使用控制器注册方式，必须是无参数的构造函数
```csharp
[AuthonizationFilter()]
public class FirstController : Controller
{
	private ILogger<FirstController> _logger;

	public FirstController(ILogger<FirstController> logger)
	{
		_logger = logger;
	}

	public IActionResult Index()
	{
		return View();
	}
}
```

如果要传递参数，需要通过TyperFilter标记在方法和控制器
[TypeFilter(typeof(customerAttribute))]

## 全局注册方式
比如说我们需要全局系统中的异常或者收集操作日志等，需要全局注册一个Exception来实现，就不需要一个一个action或者控制器进行注册
```csharp
services.AddMvc(options =>
{
	 //options.Filters.Add(typeof(CustomerExceptionFilter));
	 options.Filters.Add<CustomerExceptionFilter>(); 
	 options.Filters.Add(new AuthorizeFilter());
	 options.Filters.Add(typeof(AuthorizeFilter));
})
```

## 依赖注入两种方式

### ServiceFilterAttribute
将要用的ActionFilter本身注册为一个Service注册到DI容器中(必须)。通过ServiceFilter从容器中检索你的ActionFile，并且注入到需要的地方
```csharp
//步骤一
services.AddScoped(typeof(CustomResourceFilterAttribute));
//步骤二
在action上使用serviceFilter
[ServiceFilter(typeof(FilterInjectAttribute))]
[ServiceFilter(typeof(FilterInjectAttribute),IsReusable = true)]
```
ServiceFilter有一个属性叫IsReusable。从字面意思也很好理解，就是是否可重用的意思。显而易见如果这个属性设置为True，那么多个请求就会复用这个ActionFilter,但是并不是真正的单例
> 可以支持无参构造函数，可以支持依赖注入，但是必须注册服务


### TypeFilterAttribute
使用TypeFilterAttribute注入的ActionFilter并不从DI容器中查找，而是直接通过Microsoft.Extensions.DependencyInjection.ObjectFactory来实例化对象。所以我们的FilterInjectAttribute不需要提前注册到DI容器中。
```csharp
[TypeFilter(typeof(MyExceptionFilter))]
[TypeFilter(typeof(MyExceptionFilter), Arguments = new object[] { "aa", "bb" })]
```
Arguments参数是TypeFilterAttribute跟ServiceFilterAttribute的一个重要区别，ServiceFilterAttribute并没有这属性。Arguments类型为object数组。通过TypeFilterAttribute实例化的ActionFilter，如果它的构造器中的参数类型在DI容器中找不到，会继续在Arguments参数列表里按顺序获取。
> 可以支持无参构造函数，可以支持依赖注入


## 执行顺序
定义三个ActionFilter，分别注册全局，控制器，Action
执行顺序如下：
全局注册的ActionExecuting
控制器注册的ActionExecuting
Action注册的ActionExecuting
执行Action内部逻辑计算
Action注册的ActionExecuted
控制器注册的ActionExecuted
全局注册的ActionExecuted

























