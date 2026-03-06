---
title: dotNet代码优先gRPC服务
lang: zh-CN
date: 2023-09-12
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: dotnetdaimayouxiangrpcfuwu
slug: qec2zo
docsId: '48210686'
---

## 介绍
该方式适用于多个服务之前都是**.Net项目**的场景
优点：

- 可以在 .NET 服务器和客户端之间共享 .NET 服务和数据协定类型。
- 无需在 `.proto` 文件和代码生成过程中定义协定。

## 操作

### 引用组件
创建一个共享的类库ShareProto，该类库可以被服务端和客户端进行访问，添加下面的包引用
```csharp
<PackageReference Include="protobuf-net.Grpc" Version="1.0.152" />
<PackageReference Include="protobuf-net.Grpc.AspNetCore" Version="1.0.152" />
```
protobuf-net.Grpc是一个社区项目，通过属性批注的.Net类型来定义应用的gRPC服务和消息。

### 服务端
增加一个获取支付信息的grpc服务
```csharp
[ServiceContract]
public interface IPayProto
{
    /// <summary>
    ///获取订单服务
    /// </summary>
    /// <param name="request"></param>
    /// <param name="callContext"></param>
    /// <returns></returns>
    [OperationContract]
    Task<PayResult> GetPayInfo(PayVm request, CallContext callContext = default);
}

[DataContract]
public class PayVm
{
    [DataMember(Order = 1)]
    public string PayOrderNo { get; set; }
}

[DataContract]
public class PayResult
{
    [DataMember(Order = 1)]
    public string OrderNo { get; set; }

    [DataMember(Order = 2)]
    public double Price { get; set; }
}
```
ServiceContract标识为grpc服务，OperationContract标识为服务下的端点(也可以理解为控制器下的方法)，DataContract标识为请求或者返回的对象。DataMember标识为对象下的属性。
创建PayService来实现IPayProto服务接口
```csharp
public class PayService : IPayProto
{
    public Task<PayResult> GetPayInfo(PayVm request, CallContext callContext = default)
    {
        System.Console.WriteLine($"接收到的参数是   {request.PayOrderNo}");
        return Task.Run(() => new PayResult { OrderNo = request.PayOrderNo, Price = 10.02f });
    }
}
```
如果没有实现，客户端调用的时候会提示服务没有实现
ConfigureServices中增加服务注册代码优先
```csharp
services.AddGrpc();
services.AddCodeFirstGrpc();
```
Configure中启用服务
```csharp
app.UseEndpoints(endpoints =>
{
    endpoints.MapGrpcService<PayService>();
    endpoints.MapControllers();
});
```

### 客户端
客户端引用ShareProto类库

#### 控制台
引用组件
```csharp
<PackageReference Include="Grpc.Net.Client" Version="2.38.0" />
```
调用方法
```csharp
using var channel = GrpcChannel.ForAddress("https://localhost:5001");
var client = channel.CreateGrpcService<IPayProto>();
var reply = client.GetPayInfo(new PayVm { PayOrderNo = "10" });
Console.WriteLine($"Greeting: {reply.GetAwaiter().GetResult().OrderNo}");
```

## 参考文档
> 官网：[https://protobuf-net.github.io/protobuf-net.Grpc](https://protobuf-net.github.io/protobuf-net.Grpc)
> 代码优先Grpc服务：[https://docs.microsoft.com/zh-cn/aspnet/core/grpc/code-first?view=aspnetcore-3.1](https://docs.microsoft.com/zh-cn/aspnet/core/grpc/code-first?view=aspnetcore-3.1)


