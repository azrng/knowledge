---
title: dotnet之SoapCore简单使用
lang: zh-CN
date: 2023-07-05
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: dotnetzhisoapcorejianchanshiyong
slug: qmroas
docsId: '53041047'
---
> 最近更新时间：2021年12月24日 17:01:19

最近在工作中，需要同时放出来WebAPI接口和支持Soap协议的WebService接口，在dotNetFramework时候玩过WebService，这可是好久没再碰过了，没想到现在居然遇到了。只好迎难而上。

## 介绍
本来是在ASP.NetCore中使用了组件SoapCore来使用Soap协议。
支持以下框架：

- .NET 5.0（使用 ASP.NET Core 5.0）
- .NET Core 3.1（使用 ASP.NET Core 3.1）
- .NET Core 2.1（使用 ASP.NET Core 2.1）
- .NET Standard 2.0（使用 ASP.NET Core 2.1）
> 官网：[https://github.com/DigDes/SoapCore](https://github.com/DigDes/SoapCore)


## 操作

### 准备工作
> 本文示例环境：vs2022、.Net5

为了省事，我还在之前的文章demo上面操作，地址是：[https://gitee.com/AZRNG/my-example](https://gitee.com/AZRNG/my-example) ，分支是：inmemory_soap ，当前项目已经包含一些WebAPI接口，我要实现使用Soap协议也放出这些接口，共用UserService类。
![image.png](/common/1631198779014-d0acb9fa-4253-4c31-ae04-f0258d34ad6b.png)

### 开始编写接口
环境：dotnet5.0 + SoapCore 1.1.0.10
安装组件
```bash
<PackageReference Include="SoapCore" Version="1.1.0.10" />
```
ConfigureServices中注入SoapCore
```bash
services.AddSoapCore();
```
新建User WebService
```csharp
/// <summary>
/// User WebService
/// </summary>
[ServiceContract]
public class UserContractImpl
{
    private readonly IUserService _userService;
    private readonly IMapper _mapper;

    public UserContractImpl(IUserService userService,
        IMapper mapper)
    {
        _userService = userService;
        _mapper = mapper;
    }

    /// <summary>
    /// 查询用户列表
    /// </summary>
    /// <returns></returns>
    [OperationContract]
    public async Task<List<User>> GetListAsync()
    {
        return await _userService.GetListAsync();
    }

    /// <summary>
    /// 查询详情
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    [OperationContract]
    public async Task<User> GetDetailsAsync(string id)
    {
        return await _userService.GetDetailsAsync(id);
    }

    /// <summary>
    /// 添加
    /// </summary>
    /// <param name="dto"></param>
    /// <returns></returns>
    [OperationContract]
    public async Task<string> AddAsync(AddUserVm dto)
    {
        return await _userService.AddAsync(dto);
    }

    /// <summary>
    /// 删除
    /// </summary>
    /// <param name="id"></param>
    [OperationContract]
    public async Task<int> DeleteAsync(string id)
    {
        return  await _userService.DeleteAsync(id);
    }
}
```
ConfigureServices中注入
```bash
services.AddTransient<UserContractImpl>();
```
Configure中配置终结点路由
```bash
app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();

    var binging = new BasicHttpBinding();
    binging.ReaderQuotas.MaxStringContentLength = int.MaxValue;
    endpoints.UseSoapEndpoint<UserContractImpl>("/UserContractImpl.asmx", binging, SoapSerializer.DataContractSerializer);
});
```
访问地址：[http://localhost:5000/UserContractImpl.asmx](http://localhost:5000/UserContractImpl.asmx)
![image.png](/common/1631200587824-4cbe63e5-95d1-49df-a268-a8eab8218fc6.png)

### WebApi程序客户端
新建dotnet5.0项目
![image.png](/common/1631200720902-b295068a-57d5-41e8-a633-d54e8937835b.png)
选中项目右键=>添加=>服务引用=>WCF Web Service
![image.png](/common/1631200834118-e6cce9cc-c041-4984-80fc-e96c98cc570e.png)
输入url，点击go出来服务
![image.png](/common/1631200909276-dea3e78e-1057-48e7-8eec-a19d14cee2f6.png)
下一步
![image.png](/common/1631201043068-356800d8-f4ab-4da5-887f-7fbe492e0285.png)
最后一直下一步直到完成
![image.png](/common/1631201089700-1e63df37-09c4-47fa-98d8-5ec64d480acc.png)
这个时候vs已经帮我们生成了调用的方法，后期地址有变动可以直接去修改这个代码。
ConfigureServices中注册
```csharp
services.AddSingleton<UserContractImpl>(new UserContractImplClient(UserContractImplClient.EndpointConfiguration.BasicHttpBinding));
```
> 注意：UserContractImpl就是你上面添加服务引用点击go的时候出来的名字。UserContractImplClient就是前面的名字加上Client

控制器注入
```csharp
private readonly UseService.UserContractImpl _userContractImpl;

public HomeController( UseService.UserContractImpl userContractImpl)
{
    _userContractImpl = userContractImpl;
}
```
使用里面的接口
```csharp
var result = await _userContractImpl.AddAsync(new UseService.AddUserVm
{
    Account = "123",
    PassWord = "456",
    Sex = UseService.SexEnum.Man
});
var list = await _userContractImpl.GetListAsync();
```
通过先调用添加接口然后调用查询接口可以查询到我们刚才添加到的数据。

### 控制台程序
像上面一样将Soap服务引用到项目中
事例一：直接构建UserContractImplClient
```csharp
var client = new UserContractImplClient(UserContractImplClient.EndpointConfiguration.BasicHttpBinding);
var str = await client.AddAsync(new AddUserVm
{
    Account = "23456",
    PassWord = "456",
    Sex = SexEnum.Noknow
});
var list = client.GetListAsync();
```
事例二：
```csharp
// 创建 HTTP 绑定对象
var binding = new BasicHttpBinding();
// 根据 WebService 的 URL 构建终端点对象
var endpoint = new EndpointAddress(@"http://localhost:5000/UserContractImpl.asmx");
// 创建调用接口的工厂，注意这里泛型只能传入接口
var factory = new ChannelFactory<UserContractImplChannel>(binding, endpoint);
// 从工厂获取具体的调用实例
var callClient = factory.CreateChannel();
// 调用具体的方法，这里是 GetListAsync 方法。
var result = await callClient.GetListAsync();
```
涉及到自定义绑定的接口，设置自定义请求版本等
```csharp
// 创建 HTTP 绑定对象
var binding = new CustomBinding(new TextMessageEncodingBindingElement
{
    //默认消息版本是1.2,要调用的也是1.2所以这里可以直接注释
    // MessageVersion = MessageVersion.Soap12WSAddressing10
}, new HttpTransportBindingElement
{
    //认证模式
    AuthenticationScheme = AuthenticationSchemes.Anonymous,
    MaxReceivedMessageSize = int.MaxValue
});

// 根据 WebService 的 URL 构建终端点对象
var endpoint = new EndpointAddress(@"xxxxxxx");
// 创建调用接口的工厂，注意这里泛型只能传入接口
var factory = new ChannelFactory<ServiceReference1.DocumentV2ServiceChannel>(binding, endpoint);
// 从工厂获取具体的调用实例
var callClient = factory.CreateChannel();
// 调用具体的方法，这里是 HIPMessageServerAsync 方法。
var result = await callClient.HIPMessageServerAsync("DocumentRetrieve", message);
```

## 参考文档
[https://github.com/DigDes/SoapCore](https://github.com/DigDes/SoapCore)
