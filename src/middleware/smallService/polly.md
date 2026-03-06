---
title: 弹性服务
lang: zh-CN
date: 2023-08-06
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - polly
---

## Resilience

使用 .NET 构建弹性云应用程序:https://www.milanjovanovic.tech/blog/building-resilient-cloud-applications-with-dotnet?utm_source=newsletter&utm_medium=email&utm_campaign=tnw89



## Polly

Polly是一个.Net弹性和瞬态故障处理库，允许开发人员通过更简单并且线程安全的方式来执行如重试(Retry)、断路(Circuit Breaker)、超时(Timeout)、隔离(Bulkhead Isolation)、缓存(Cache)、降级回退(Fallback)、策略组合(PolicyWrap)等策略。
被动策略：异常处理、结果处理
主动策略：超时处理、断路器、降级回退、缓存

> 支持的框架：[https://github.com/App-vNext/Polly/wiki/Supported-targets](https://github.com/App-vNext/Polly/wiki/Supported-targets)


### 使用步骤

- 定义要处理的异常类型或者返回值
- 定义要处理的动作(重试、熔断、降级响应等)
- 使用定义的策略来执行代码

Policy.Handle< T > 用来定义异常的类型，表示当执行的方法发生某种异常的时候定义为故障。当故障发生的时候 Polly 会为我们自动执行某种恢复策略，比如重试。
Policy.HandleResult< T > 用来定义返回值的类型，表示当执行的方法返回值达成某种条件的时候定义为故障。当故障发生的时候 Polly 会为我们自动执行某种恢复策略，比如重试。
Policy.TimeoutAsync 表示当一个操作超过设定时间时会引发一个 TimeoutRejectedException 。

### 操作
常用nuget包
```csharp
<PackageReference Include="Polly" Version="7.2.2" /> //核心包
<PackageReference Include="Polly.Extensions.Http" Version="3.0.0" /> // 基于http的一些扩展
<PackageReference Include="Microsoft.Extensions.Http.Polly" Version="6.0.0" />  // httpfactory组件包扩展
```

#### 最佳实践

- 设置失败重试的次数
- 设置带有延长时间的等待间隔(一次时间比一次时间间隔长)
- 设置降级响应
- 设置断路器

#### 失败重试(Retry)
当程序发生故障时候，可以进行自动的重试。

##### 场景

- 服务“失败”是短暂的，可愈的
- 服务是幂等的，重复调用不会有副作用。

##### 示例
网络闪断、部分服务节点异常
```csharp
[HttpGet]
public ActionResult<string> RetrySample()
{
	//手动设置重试时间
	var retry = Policy.Handle<Exception>()
		.WaitAndRetry(new[] {
			TimeSpan.FromSeconds(1),
			TimeSpan.FromSeconds(3),
			TimeSpan.FromSeconds(4)
		});

	try
	{
		retry.Execute(() =>
		{
			Console.WriteLine("开始调用接口");
			if (DateTime.Now.Minute % 2 != 0)
			{
				throw new Exception("接口异常");
			}
			Console.WriteLine("调用接口结束");
		});
	}
	catch (Exception ex)
	{
		Console.WriteLine($"异常  {ex.Message}");
	}

	return Ok("success");
}
```
执行结果：
![image.png](/common/1622359657960-e364a275-a173-4c5a-b6a5-156d4611b463.png)
其他配置

```csharp
//初始尝试后，再重试了三次后，还没有满足情况，然后直接抛出异常
var retry = Policy.Handle<Exception>()
    .Retry(3);   

//通过计算重试时间：重试3次每次间隔是2的次方
var retry = Policy
    .Handle<Exception>()
    .WaitAndRetry(3, retryAttempt =>
    TimeSpan.FromSeconds(Math.Pow(2, retryAttempt)));

//永久执行   间隔为2 3 4 5 6 7秒
var retry = Policy
    .Handle<Exception>()
    .WaitAndRetryForever((int tr) => TimeSpan.FromSeconds(tr));

//重新尝试刷新授权，场景重审政策可用于维护对第三方系统的授权，因为第三方系统token会定期失效
var authorisationEnsuringPolicy = Policy
    .HandleResult<HttpResponseMessage>(r => r.StatusCode == HttpStatusCode.Unauthorized) 
    .RetryAsync(
       retryCount: 1, // Consider how many retries. If auth lapses and you have valid credentials, one should be enough; too many tries can cause some auth systems to block or throttle the caller. 
       onRetryAsync: async (outcome, retryNumber, context) => FooRefreshAuthorizationAsync(context), 
      /* more configuration */); 

var response = authorisationEnsuringPolicy.ExecuteAsync(context => DoSomethingThatRequiresAuthorization(context), cancellationToken);

```

#### 断路(Circuit Breaker) 服务熔断
断路器模式指，在某个服务发生故障时，断路器的故障监控向调用放返回一个及时的错误响应，而不是长时间的等待。这样就不会使得调用线程因调用故障被长时间占用，从而导致整个应用程序故障。
```csharp
[HttpGet]
public ActionResult<string> CircuitBreakerSample()
{
	//使用场景：调用接口推送数据，然后对方异常，出现几次错误后，触发熔断，等一段时间才能继续执行
	var policy = Policy.Handle<Exception>()
		//请求3次，如果还是错误，那么就熔断1分钟
			.CircuitBreaker(3, TimeSpan.FromMinutes(1));

	//for循环来代替用户访问的操作
	for (int i = 0; i < 10; i++)
	{
		try
		{
			policy.Execute(() =>
			{
				Console.WriteLine($"准备执行   {DateTime.Now}");
				throw new Exception("接口值为null");
			});
		}
		catch (Exception ex)
		{
			Console.WriteLine($"接口异常{ex.Message}  { DateTime.Now  }");
		}
	}
	return Ok("success");
}
```
结果：我们请求请求某一个服务，出现几次错误后，可以直接一段时间内熔断该服务
![image.png](/common/1622371056949-5dd53bce-ddf5-461e-9ef5-5d655c3e825f.png)

#### 超时(Timeout)
超时处理是指我们为服务的请求设置一个超时时间，如果超过我们设定的时候，就会按照我们呢约定的进行处理，比如返回一个缓存的数据等，但是一般不单独使用，而是搭配其他策略一起使用，比如当请求某一个第三方服务超时后，可以直接降级去请求另一个。
```csharp
        [HttpGet]
        public ActionResult<string> TimeOutSample()
        {
            //设置3秒超时，悲观模式，超时直接报错
            var policy = Policy.Timeout(3, Polly.Timeout.TimeoutStrategy.Pessimistic);
            try
            {
                policy.Execute(() =>
                {
                    Console.WriteLine("开始");
                    Thread.Sleep(5000);
                    Console.WriteLine("结束");
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"异常 : {ex.Message}");
            }
            return Ok("success");
        }
```
> 一个是悲观策略（Pessimistic），一个是乐观策略（Optimistic）。其中，悲观策略超时后会直接抛异常，而乐观策略则不会，而只是触发CancellationTokenSource.Cancel函数，需要等待委托自行终止操作。一般情况下，我们都会用悲观策略。
> 详情：[https://github.com/App-vNext/Polly/wiki/Timeout](https://github.com/App-vNext/Polly/wiki/Timeout)

结果
![image.png](/common/1622372645523-e38acc90-0e1d-4d35-b040-58a04ea544f9.png)

#### 缓存(**Cache**)
可以实现类似于AOP的机制，当缓存命中的时候可以快速响应缓存。

#### 降级回退(Fallback)失败降级
当我们服务不可用的时候，我们可以响应一个更友好的结果而不是返回一个错误信息，让我们的程序依然可以执行下去。
比如我们的订单详情服务里面会调用会员信息服务接口。如果会员信息服务接口故障会造成订单详情服务也同样故障。这时候我们可以对会员信息服务接口进行降级，在发生故障的时候直接返回固定的信息从而保证订单详情主服务是可用的。
下面我们演示下如何使用 Polly 进行服务调用的降级处理。

```csharp
var fallback = Policy<string>.Handle<HttpRequestException>().FallbackAsync("FALLBACK")
                .WrapAsync(Policy.Handle<HttpRequestException>().RetryAsync(3));
var memberJson = await fallback.ExecuteAsync(async () =>
{
    using (var httpClient = new HttpClient())
    {
        httpClient.BaseAddress =
            new Uri($"http://{memberServiceAddress.Address}:{memberServiceAddress.Port}");
        var result = await httpClient.GetAsync("/member/" + order.MemberId);
        result.EnsureSuccessStatusCode();
        var json = await result.Content.ReadAsStringAsync();
        return json;
    }

});
if (memberJson != "FALLBACK")
{
    var member = JsonConvert.DeserializeObject<MemberVM>(memberJson);
    vm.Member = member;
}
```
首先我们使用 Policy 的 FallbackAsync("FALLBACK") 方法设置降级的返回值。当我们服务需要降级的时候会返回 "FALLBACK" 的固定值。
同时使用 WrapAsync 方法把重试策略包裹起来。这样我们就可以达到当服务调用失败的时候重试3次，如果重试依然失败那么返回值降级为固定的 "FALLBACK" 值。

#### 策略组合(PolicyWrap)
可以将上面的策略进行组合使用。

## 参考资料
GitHub：[https://github.com/App-vNext/Polly/wiki](https://github.com/App-vNext/Polly/wiki)
[https://github.com/App-vNext/Polly](https://github.com/App-vNext/Polly)
周大佬：[https://www.cnblogs.com/edisonchou/p/9159644.html](https://www.cnblogs.com/edisonchou/p/9159644.html)
polly服务熔断  [https://www.cnblogs.com/kklldog/p/netcore-with-microservices-08.html](https://www.cnblogs.com/kklldog/p/netcore-with-microservices-08.html)
[https://mp.weixin.qq.com/s/aSqovQOox4gl_LO9UtSRPA](https://mp.weixin.qq.com/s/aSqovQOox4gl_LO9UtSRPA) | ASP.NET Core中如何做服务的熔断与降级
