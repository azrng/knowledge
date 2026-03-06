---
title: gRPC四种模式
lang: zh-CN
date: 2023-10-18
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: grpcsichongmoshi
slug: honcv4
docsId: '48477477'
---

## 介绍
简单 RPC（Unary RPC）、服务端流式 RPC （Server streaming RPC）、客户端流式 RPC （Client streaming RPC）、双向流式 RPC（Bi-directional streaming RPC）。它们主要有以下特点：

| **服务类型** | **特点** |
| --- | --- |
| 简单 (一元)RPC | 一般的rpc调用，传入一个请求对象，返回一个返回对象 |
| 服务端流式   RPC | 传入一个请求对象，服务端可以返回多个结果对象 |
| 客户端流式   RPC | 客户端传入多个请求对象，服务端返回一个结果对象 |
| 双向流式   RPC | 结合客户端流式RPC和服务端流式RPC，可以传入多个请求对象，返回多个结果对象 |


## 基本配置

### 组件包介绍
```
-- 服务端
Grpc.AspNetCore 一个用于在ASP.NET Core承载gRPC服务的框架，将 gRPC和ASP.NET Core 功能集成在一起，如：日志、依赖注入、身份认证和授权。

-- 客户端包
Google.Protobuf 包含适用于 C## 的 Protobuf 消息。
Grpc.Tools 包含适用于 Protobuf 文件的 C## 工具支持，将*.proto 文件生成 C## 资产。 运行时不需要工具包，因此依赖项标记为 PrivateAssets="All"。
Grpc.Net.Client，其中包含 .NET Core 客户端。
Grpc.Net.ClientFactory 与gRPC客户端集成的HttpClientFactory，允许对gRPC客户端进行集中配置，并使用DI注入到应用程序中
```
> 一个服务可以是服务端也可以是客户端


### 服务端基本配置
右键新建proto文件
```protobuf
syntax = "proto3"; //使用的协议

option csharp_namespace = "UserService.Proto"; //命名空间

service UserInfoService{ //服务名
    //登录 一元调用
	rpc Login(LoginRequest) returns(LoginResponse);
}

//登录请求类
message LoginRequest{
  string account=1;//帐号
  string password=2;//密码
}

//登录返回类
message LoginResponse{
  string name=1;//用户名
}
```
引用组件
```csharp
<PackageReference Include="Grpc.AspNetCore" Version="2.38.0" />
```
ConfigureServices中配置
```csharp
// 默认配置
services.AddGrpc();

或者

//自定义配置
services.AddGrpc(options =>
{
    options.EnableDetailedErrors = true;//启用想起错误
    options.MaxReceiveMessageSize = 2 * 1024 * 1024;//最大接受 2m
    options.MaxSendMessageSize = 5 * 1024 * 1024;//最大请求 5m
});
```
Configure中配置
```csharp
app.UseEndpoints(endpoints =>
{
    endpoints.MapGrpcService<PayService>();// 配置指定实现
    endpoints.MapControllers();
});
```

### 客户端基本配置
引用组件
```csharp
<ItemGroup>
  <PackageReference Include="Google.Protobuf" Version="3.19.1" />
  <PackageReference Include="Grpc.Net.ClientFactory" Version="2.40.0" />
  <PackageReference Include="Grpc.Tools" Version="2.42.0">
    <PrivateAssets>all</PrivateAssets>
    <IncludeAssets>runtime; build; native; contentfiles; analyzers; buildtransitive</IncludeAssets>
  </PackageReference>
  <PackageReference Include="Grpc.Net.Client" Version="2.40.0" />
</ItemGroup>
```
ConfigureServices中配置
```csharp
// 默认配置
services.AddGrpc();

//自定义配置
services.AddGrpc(options =>
{
    options.EnableDetailedErrors = true;//启用想起错误
    options.MaxReceiveMessageSize = 2 * 1024 * 1024;//最大接受 2m
    options.MaxSendMessageSize = 5 * 1024 * 1024;//最大请求 5m
});

// 要调用的grpc服务
services.AddGrpcClient<RPC.Protos.Two.Order.OrderClient>(o => o.Address = new Uri("https://localhost:6001"));
```

## 操作
以下的使用场景仅供参考，因为工作中我也只用过简单rpc模式。

### 简单RPC
实现需求：订单服务根据用户ID获取用户的详细信息数据。
右键添加proto文件并命名为UserInfoService.proto
```csharp
syntax = "proto3"; //使用的协议

import "google/protobuf/timestamp.proto";
import "google/protobuf/wrappers.proto";

option csharp_namespace = "UserService.Proto"; //命名空间

service UserInfoService{ //服务名
    //获取用户信息 一元调用
	rpc GetUserInfo(GetUserInfoRequest) returns(GetUserInfoResponse);
}

//获取用户信息请求类
message GetUserInfoRequest{
  string user_id=1;//用户ID
}

//获取用户信息返回类
message GetUserInfoResponse{
  string name=1;//用户名
  string nick_name=2;//昵称
  google.protobuf.Int32Value sex=3;//可为空性别 1男 2女 空是未知
  google.protobuf.Timestamp birthday=4;//生日
  bool isenabled=5;//是否启用
}
```

#### 服务端
安装nuget包
```csharp
<ItemGroup>
  <PackageReference Include="Grpc.AspNetCore" Version="2.40.0" />
</ItemGroup>
```
修改csproj文件去引用proto文件并且标识为服务端GrpcServices="Server"
```csharp
<ItemGroup>
  <Protobuf Include="Proto\UserInfoService.proto" GrpcServices="Server" />
</ItemGroup>

也可以将proto都存放在同一个固定位置让不同的程序引用，使用

<ItemGroup>
  <Protobuf Include="..\ShareProto\ServiceTwo\*.proto" GrpcServices="Server" Link="Protos\Server\%(RecursiveDir)%(Filename)%(Extension)" />
</ItemGroup>      
```
新建UserInfoGrpcService继承自我们的UserInfoService grpc服务，并且重写GetUserInfo方法
```csharp
public class UserInfoGrpcService : UserInfoServiceBase
{
    /// <summary>
    ///根据用户id获取用户信息(简单rpc)
    /// </summary>
    /// <param name="request"></param>
    /// <param name="context"></param>
    /// <returns></returns>
    public override Task<GetUserInfoResponse> GetUserInfo(GetUserInfoRequest request, ServerCallContext context)
    {
        var userId = request.UserId;

        Console.WriteLine("接收到的用户Id是" + userId);

        //根据用户ID去查询数据库返回结果

        return Task.FromResult(new GetUserInfoResponse
        {
            Name = "admin",
            NickName = "好好学习天天向上",
            Sex = null,
            Birthday = Timestamp.FromDateTime(DateTime.UtcNow),
            Isenabled = true
        });
    }
}
```
在startop注册grpc服务
```csharp
//启用grpc
services.AddGrpc(options =>
{
    options.EnableDetailedErrors = true;//启用内部错误输出详情
    options.MaxReceiveMessageSize = 2 * 1024 * 1024;//最大接受 2m
    options.MaxSendMessageSize = 5 * 1024 * 1024;//最大请求 5m
});
```
配置指定grpc并且暴露出grpc服务
```csharp
app.UseEndpoints(endpoints =>
{
    endpoints.MapGrpcService<UserInfoGrpcService>();
    endpoints.MapControllers();
});
```
项目目录下可以看到proto文件生成的类
![image.png](/common/1637485129266-895ecec0-327f-41ee-86b7-dbfbdc9e24bf.png)

#### 客户端
安装nuget包
```csharp
<ItemGroup>
  <PackageReference Include="Google.Protobuf" Version="3.19.1" />
  <PackageReference Include="Grpc.Net.ClientFactory" Version="2.40.0" />
  <PackageReference Include="Grpc.Tools" Version="2.42.0">
    <PrivateAssets>all</PrivateAssets>
    <IncludeAssets>runtime; build; native; contentfiles; analyzers; buildtransitive</IncludeAssets>
  </PackageReference>
  <PackageReference Include="Grpc.Net.Client" Version="2.40.0" />
</ItemGroup>
```
引用上面的grpc文件，修改csproj文件并标识为客户端GrpcServices="Client"
```csharp
//本来暂且将proto文件拷贝到客户端服务，然后设置
<ItemGroup>
  <Protobuf Include="Proto\UserInfoService.proto" GrpcServices="Client" />
</ItemGroup>


//或者将proto文件放到一个共享目录，然后采用
<ItemGroup>
    <Protobuf Include="..\ShareProto\ServiceTwo\*.proto" GrpcServices="Client" Link="Protos\Client\%(RecursiveDir)%(Filename)%(Extension)" />
</ItemGroup>
```
ConfigureServices添加该grpc服务，服务端地址为localhost:5001
```csharp
services.AddGrpcClient<UserInfoService.UserInfoServiceClient>(o =>
{
    o.Address = new Uri("https://localhost:5001");//协议必须是https
});
```
> 这个UserInfoServiceClient文件就是我们刚才引入的proto文件生成的代码

调用测试
```csharp
[ApiController]
[Route("[controller]")]
public class HomeController : ControllerBase
{
    private readonly UserInfoService.UserInfoServiceClient _userInfoServiceClient;

    public HomeController(UserInfoService.UserInfoServiceClient userInfoServiceClient)
    {
        _userInfoServiceClient = userInfoServiceClient;
    }

    [HttpGet]
    public async Task<GetUserInfoResponse> Get(string userId)
    {
        var result = await _userInfoServiceClient.GetUserInfoAsync(new GetUserInfoRequest { UserId = userId });
        return result;
    }
}
```
![image.png](/common/1637509043991-7c641c50-8785-403f-bc16-1ddaa62046ec.png)
下面的部分代码如上，因此省略。

### 服务端流式RPC
修改之前的UserInfoService.proto文件，增加一个方法参数是一个请求对象，服务器将多个结果流式传回调用方。
```csharp
syntax = "proto3"; //使用的协议

import "google/protobuf/timestamp.proto";
import "google/protobuf/wrappers.proto";

option csharp_namespace = "UserService.Proto"; //命名空间

service UserInfoService{ //服务名
    
	//获取所有信息   服务器流式处理：从客户端发送请求消息开始 
	//ResponseStream.MoveNext() 读取从服务流式处理的消息。 ResponseStream.MoveNext() 返回 false 时，服务器流式处理调用已完成。
	rpc GetAll(GetAllRequest) returns(stream CustomerResponse);
}

message GetAllRequest { }

message CustomerResponse{
	CustomerInfo customer=1;//用户信息
}

message CustomerInfo{
  string account=1;//帐号
  string name=3;//姓名
  int32 sex=4;//性别
}
```

#### 服务端
继承自UserInfoServiceBase并重写GetAll方法
```csharp
public class UserInfoGrpcService : UserInfoServiceBase
{
    /// <summary>
    /// 获取所有用户信息（服务端流式rpc）
    /// </summary>
    /// <param name="request"></param>
    /// <param name="responseStream"></param>
    /// <param name="context"></param>
    /// <returns></returns>
    public override async Task GetAll(GetAllRequest request, IServerStreamWriter<CustomerResponse> responseStream, ServerCallContext context)
    {
        for (int i = 0; i < 5; i++)
        {
            if (!context.CancellationToken.IsCancellationRequested)
            {
                await responseStream.WriteAsync(new CustomerResponse
                {
                    Customer = new CustomerInfo
                    {
                        Account = "admin" + i,
                        Name = "张三" + i,
                        Sex = 1
                    }
                }).ConfigureAwait(false);
                await Task.Delay(System.TimeSpan.FromSeconds(1));
            }
        }
    }
}
```

#### 客户端
修改之前的订单服务引用的proto文件，新建一个接口用于获取grpc服务
```csharp
/// <summary>
/// 获取所有的用户信息(服务端流式处理)
/// </summary>
/// <returns></returns>
[HttpGet]
public async Task<ActionResult<IEnumerable<CustomerResponse>>> GetAllUserInfoAsync()
{
    var result = new List<CustomerResponse>();
    var cancel = new CancellationToken();
    var request = new GetAllRequest();
    var response = _userInfoServiceClient.GetAll(request);
    while (await response.ResponseStream.MoveNext(cancel))
    {
        result.Add(response.ResponseStream.Current);
    }

    return Ok(result);
}
```
返回结果
![image.png](/common/1638090448008-7c3e303c-9a85-4d8e-bc31-0d5e3f3937bf.png)

## 客户端流式RPC
客户端将连续的数据流发送到服务端，服务端返回一个响应信息，使用场景：根据id返回用户列表信息，分段上传图片
```csharp
syntax = "proto3"; //使用的协议

import "google/protobuf/timestamp.proto";
import "google/protobuf/wrappers.proto";

option csharp_namespace = "UserService.Proto"; //命名空间

service UserInfoService{ //服务名

	//批量获取用户信息  客户端流式处理：多个请求对象，服务器返回一个结果
	rpc GetUserListByUserId(stream GetUserListRequest) returns (GetUserListResponse);
}

message CustomerInfo{
  string user_id=1;//用户id
  string account=2;//帐号
  string name=3;//姓名
  int32 sex=4;//性别
}

message GetUserListRequest
{
    string  user_id = 1;
}

message GetUserListResponse
{
	repeated CustomerInfo  user_list = 1;//用户列表
}
```

#### 服务端
为了操作数据，这点新建了一个userInfo的类
```csharp
public class UserInfo
{
    /// <summary>
    ///用户ID
    /// </summary>
    public string UserId { get; set; }

    /// <summary>
    /// 帐号
    /// </summary>
    public string Acount { get; set; }

    /// <summary>
    /// 姓名
    /// </summary>
    public string Name { get; set; }

    /// <summary>
    /// 性别
    /// </summary>
    public int Sex { get; set; }
}
```
继承自UserInfoServiceBase并重写GetUserListByUserId方法
```csharp
public class UserInfoGrpcService : UserInfoServiceBase
{
    /// <summary>
    /// 根据用户id获取用户列表
    /// </summary>
    /// <param name="requestStream"></param>
    /// <param name="context"></param>
    /// <returns></returns>
    public override async Task<GetUserListResponse> GetUserListByUserId(
        IAsyncStreamReader<GetUserListRequest> requestStream, ServerCallContext context)
    {
        //模拟数据库查询
        var userList = new List<UserInfo>
        {
            new UserInfo { UserId = "11", Acount = "admin1", Name = "张三", Sex = 1 },
            new UserInfo { UserId = "22", Acount = "admin2", Name = "李四", Sex = 0 },
            new UserInfo { UserId = "33", Acount = "admin3", Name = "王五", Sex = 1 },
            new UserInfo { UserId = "44", Acount = "admin4", Name = "赵六", Sex = 0 },
        };

        //获取请求的用户ID列表
        var userIds = new List<string>();
        var cancel = context.CancellationToken;
        while (await requestStream.MoveNext(cancel))
        {
            userIds.Add(requestStream.Current.UserId);
        }

        var resultList = userList.Where(t => userIds.Contains(t.UserId));

        //拼接返回列表
        var result = new GetUserListResponse();
        foreach (var item in resultList)
        {
            result.UserList.Add(new CustomerInfo
            {
                UserId = item.UserId,
                Account = item.Acount,
                Name = item.Name,
                Sex = item.Sex
            });
        }

        return result;
    }
}
```

#### 客户端
修改之前的订单服务引用的proto文件，新建一个接口GetUserListByUserIdAsync用于获取grpc服务
```csharp
/// <summary>
/// 根据用户id获取用户信息（客户端流式处理） 
/// </summary>
/// <param name="userIds"></param>
/// <returns></returns>
[HttpPost]
public async Task<ActionResult<RepeatedField<CustomerInfo>>> GetUserListByUserIdAsync(
    IEnumerable<string> userIds)
{
    using var call = _userInfoServiceClient.GetUserListByUserId();
    var clientStream = call.RequestStream;
    //循环给服务端发送流
    foreach (var item in userIds)
    {
        await clientStream.WriteAsync(new GetUserListRequest { UserId = item });
    }

    // 发送完成之后，告诉服务端发送完成
    await clientStream.CompleteAsync();
    // 接收返回结果，并返回
    var res = await call.ResponseAsync;
    return Ok(res.UserList);
}
```
返回结果
![image.png](/common/1638094575913-5c900422-3785-4f6f-8f6e-29a1b6bbedc5.png)

### 双向流式RPC
请求和响应都通过流的方式进行交互
示例：通过流的方式添加用户并返回用户ID
修改之前的UserInfoService.proto文件，增加一个方法入参是连续流，服务器将多个结果流式传回调用方。
```csharp
syntax = "proto3"; //使用的协议

import "google/protobuf/timestamp.proto";
import "google/protobuf/wrappers.proto";

option csharp_namespace = "UserService.Proto"; //命名空间

service UserInfoService{ //服务名

	//批量添加用户 并返回用户ID   双向流模式，多个请求，返回多个信息
	rpc AddUserList(stream AddUserListRequest) returns (stream AddUserListResponse);
}

message AddUserListRequest
{
  string account=1;//帐号
  string name=2;//姓名
  int32 sex=3;//性别
}

message AddUserListResponse
{
    string user_id=1;//用户id
}
```

#### 服务端
继承自UserInfoServiceBase并重写AddUserList方法
```csharp
public class UserInfoGrpcService : UserInfoServiceBase
{
    /// <summary>
    /// 批量添加用户信息（双向流式处理） 
    /// </summary>
    /// <param name="requestStream"></param>
    /// <param name="responseStream"></param>
    /// <param name="context"></param>
    /// <returns></returns>
    public override async Task AddUserList(IAsyncStreamReader<AddUserListRequest> requestStream,
        IServerStreamWriter<AddUserListResponse> responseStream, ServerCallContext context)
    {
        //获取请求的用户ID列表
        var userInfos = new List<UserInfo>();
        var cancel = context.CancellationToken;
        while (await requestStream.MoveNext(cancel))
        {
            userInfos.Add(new UserInfo
            {
                UserId = Guid.NewGuid().ToString(),
                Acount = requestStream.Current.Account,
                Name = requestStream.Current.Name,
                Sex = requestStream.Current.Sex
            });
        }

        //返回用户Id
        foreach (var item in userInfos)
        {
            await responseStream.WriteAsync(new AddUserListResponse
            {
                UserId = item.UserId
            }).ConfigureAwait(false);
        }
    }
}
```

#### 客户端
修改之前的订单服务引用的proto文件，新建一个接口用于获取grpc服务
```csharp
/// <summary>
/// 根据用户id获取用户信息（双向流） 
/// </summary>
/// <param name="userIds"></param>
/// <returns></returns>
[HttpGet]
public async Task<ActionResult<RepeatedField<CustomerInfo>>> AddUserList()
{
    //模拟用户添加的数据
    var userList = new List<UserInfo>
    {
        new UserInfo { UserId = "11", Acount = "admin1", Name = "张三", Sex = 1 },
        new UserInfo { UserId = "22", Acount = "admin2", Name = "李四", Sex = 0 },
        new UserInfo { UserId = "33", Acount = "admin3", Name = "王五", Sex = 1 },
        new UserInfo { UserId = "44", Acount = "admin4", Name = "赵六", Sex = 0 },
    };

    using var call = _userInfoServiceClient.AddUserList();
    var clientStream = call.RequestStream;
    //循环给服务端发送流
    foreach (var item in userList)
    {
        await clientStream.WriteAsync(new AddUserListRequest
        {
            Account = item.Acount,
            Name = item.Name,
            Sex = item.Sex
        });
    }

    // 发送完成之后，告诉服务端发送完成
    await clientStream.CompleteAsync();


    var userIds = new List<string>();
    var cancel = new CancellationToken();
    // 接收返回结果，并返回
    while (await call.ResponseStream.MoveNext(cancel))
    {
        userIds.Add(call.ResponseStream.Current.UserId);
    }

    return Ok(userIds);
}
```
返回结果
![image.png](/common/1638103644668-75da111b-72fb-4d6c-b3e5-55542efcf025.png)

## 参考文档
> 微信公众号【Code综艺圈】: [https://mp.weixin.qq.com/s/4DGZQTCm0DOxRrM8Nna_1w](https://mp.weixin.qq.com/s/4DGZQTCm0DOxRrM8Nna_1w)

