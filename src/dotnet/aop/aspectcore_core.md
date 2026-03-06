---
title: AspectCore.Core
lang: zh-CN
date: 2023-10-14
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: aspectcore_core
slug: gn1ybo
docsId: '77442922'
---
> 最后更新时间：2022年5月30日


## 概述
下载量：3.22M


## 操作

### AspectCore.Core搭配Polly
虽然我们完成了简单的重试、服务降级、熔断等功能。但是显然对于每个方法都去使用 Polly 编写一堆策略的话实在是太麻烦了。那么有什么办法能改进一下 Polly 的使用体验吗？答案是使用 AOP 的思想，通过在执行的方法上打上 Attribute 的方式来指定 Polly 的策略。
下面我们使用 lemon 大佬的 AspectCore AOP 组件结合 Polly 来演示下如何通过 AOP 的思想来处理重试、降级、熔断等策略。
通过 nuget 安装 AspectCore 核心类库。
```csharp
Install-Package AspectCore.Core
```
然后继续操作
```csharp
public class PollyHandleAttribute : AbstractInterceptorAttribute
{
	/// <summary>
	/// 重试次数
	/// </summary>
	public int RetryTimes { get; set; } 

	/// <summary>
	/// 是否熔断
	/// </summary>
	public bool IsCircuitBreaker { get; set; }

	/// <summary>
	/// 熔断前的异常次数
	/// </summary>
	public int ExceptionsAllowedBeforeBreaking { get; set; }

	/// <summary>
	/// 熔断时间
	/// </summary>
	public int SecondsOfBreak { get; set; }

	/// <summary>
	/// 降级方法
	/// </summary>
	public string FallbackMethod { get; set; }

	/// <summary>
	/// 一些方法级别统一计数的策略，比如熔断
	/// </summary>
	static ConcurrentDictionary<string, AsyncCircuitBreakerPolicy> policyCaches = new ConcurrentDictionary<string, AsyncCircuitBreakerPolicy>();

	public PollyHandleAttribute()
	{

	}

	public override async Task Invoke(AspectContext context, AspectDelegate next)
	{
		Context pollyCtx = new Context();
		pollyCtx["aspectContext"] = context;

		Polly.Wrap.AsyncPolicyWrap policyWarp = null;

		var retry = Policy.Handle<HttpRequestException>().RetryAsync(RetryTimes);
		var fallback = Policy.Handle<Exception>().FallbackAsync(async (fallbackContent, token) =>
		{
			AspectContext aspectContext = (AspectContext)fallbackContent["aspectContext"];
			var fallBackMethod = context.ServiceMethod.DeclaringType.GetMethod(this.FallbackMethod);
			var fallBackResult = fallBackMethod.Invoke(context.Implementation, context.Parameters);
			aspectContext.ReturnValue = fallBackResult;
		}, async (ex, t) => { });
		AsyncCircuitBreakerPolicy circuitBreaker = null;
		if (IsCircuitBreaker)
		{
			var cacheKey = $"{context.ServiceMethod.DeclaringType.ToString()}_{context.ServiceMethod.Name}";
			if (policyCaches.TryGetValue(cacheKey, out circuitBreaker))
			{
				//从缓存内获取该方法的全局熔断策略
			}
			else
			{
				circuitBreaker = Policy.Handle<Exception>().CircuitBreakerAsync(
				  exceptionsAllowedBeforeBreaking: this.ExceptionsAllowedBeforeBreaking,
				  durationOfBreak: TimeSpan.FromSeconds(this.SecondsOfBreak));

				policyCaches.TryAdd(cacheKey, circuitBreaker);
			}
		}

		if (circuitBreaker == null)
		{
			policyWarp = fallback.WrapAsync(retry);
		}
		else
		{
			policyWarp = fallback.WrapAsync(circuitBreaker.WrapAsync(retry));
		}


		await policyWarp.ExecuteAsync(ctx => next(context), pollyCtx);
	}
}
```
定义一个 PollyHandleAttribute 类，它继承自 AbstractInterceptorAttribute 类，然后实现 Invoke 方法。我们需要在 Invoke 方法内动态构造出 Polly 的相关策略，然后通过 Polly 去执行真正的方法。这里主要需要注意的是熔断策略不能每次新建，因为对于熔断来说是需要全局统计该方法的异常数量来判断是否熔断的，所以需要把熔断策略缓存起来。
这个类参考了 Edison Zhou 大佬的部分代码，原文：[Polly+AspectCore实现熔断与降级机制](https://cloud.tencent.com/developer/article/1179277)
```csharp
   public interface IMemberService
    {
        Task<MemberVM> GetMemberInfo(string id);
        MemberVM GetMemberInfoFallback(string id);
    }

public class MemberService : IMemberService
    {
        private IConsulService _consulservice;

        public MemberService(IConsulService consulService)
        {
            _consulservice = consulService;
        }

        [PollyHandle(IsCircuitBreaker = true, FallbackMethod = "GetMemberInfoFallback", ExceptionsAllowedBeforeBreaking = 5, SecondsOfBreak = 30, RetryTimes = 3)]
        public async Task<MemberVM> GetMemberInfo(string id)
        {
            var memberServiceAddresses = await _consulservice.GetServicesAsync("member_center");
            var memberServiceAddress = memberServiceAddresses.FirstOrDefault();

            using (var httpClient = new HttpClient())
            {
                httpClient.BaseAddress =
                    new Uri($"http://{memberServiceAddress.Address}:{memberServiceAddress.Port}");
                var result = await httpClient.GetAsync("/member/" + id);
                result.EnsureSuccessStatusCode();
                var json = await result.Content.ReadAsStringAsync();

                if (string.IsNullOrEmpty(json))
                {
                    return JsonConvert.DeserializeObject<MemberVM>(json);
                }
            }

            return null;
        }

        public MemberVM GetMemberInfoFallback(string id)
        {
            return null;
        }
    }
```
因为我们需要在方法上标记 PollyHandleAttribute ，所以把获取会员相关的逻辑封住进 MemberService 的 GetMemberInfo 方法内。并且在方法上打上Attribute ：
[PollyHandle(IsCircuitBreaker = true, FallbackMethod = "GetMemberInfoFallback", ExceptionsAllowedBeforeBreaking = 5, SecondsOfBreak = 30, RetryTimes = 3)] 直接通过 AOP 的方式来配置 Polly 的策略，这样就方便了很多。
上面这些配置好之后，下面开始就是如何使 aspectcore 接管 asp.net core 的依赖注入了。根据文档也很简单：
```csharp
Install-Package AspectCore.Extensions.DependencyInjection
```
通过 nuget 安装 AspectCore.Extensions.DependencyInjection 包。
```csharp
  public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.ConfigureKestrel(options =>
                    {
                        options.ListenAnyIP(6001);
                    });
                    webBuilder.UseStartup<Startup>();
                })
                .UseServiceProviderFactory(new DynamicProxyServiceProviderFactory());
```
在 CreateHostBuilder 内使用 UseServiceProviderFactory 替换 ServiceProviderFactory 为 aspectcore 的实现。
```csharp
     public void ConfigureServices(IServiceCollection services)
        {
            services.AddSingleton<IMemberService, MemberService>();

            ...

            services.ConfigureDynamicProxy();
        }
```
在 ConfigureServices 方法内配置 IMemberService 的依赖关系以及配置 aspectcore 的动态代理。

## 资料
源码地址：[https://github.com/dotnetcore/AspectCore-Framework](https://github.com/dotnetcore/AspectCore-Framework)
[https://mp.weixin.qq.com/s/aDML8lxOoxb8_aB0YA19XQ](https://mp.weixin.qq.com/s/aDML8lxOoxb8_aB0YA19XQ) | 国内开源社区巨作AspectCore-Framework入门
