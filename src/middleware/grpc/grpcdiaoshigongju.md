---
title: gRPC调试工具
lang: zh-CN
date: 2023-09-12
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: grpcdiaoshigongju
slug: fybkye
docsId: '48147135'
---

## 1. 开篇语
环境：windows10、.NetCore 3.x +  
该文章已经写了好久了，当初时候不懂得二进制包的用法，然后直接安装的go环境使用的，今天终于懂得了二进制文件的用法，所以可以直接跳过配置go环境的步骤，去看二进制用法。

### 1.1 go环境安装
先去下载go语言安装包，然后安装到某一个目录(随意)
![image.png](/common/1637482333425-1f07bddf-0022-44f5-a34f-106b1475d427.png)
然后验证是否安装成功，在命令行输入
```csharp
go env
```
![image.png](/common/1637482430045-868f2cbb-8cc6-4183-8a1e-6113b19da5ed.png)

## 2. 介绍
grpcurl 和 grpcui 都是调试grpc的工具，grpcurl使用命令行，类似curl工具；grpcui是通过可视化界面进行调试。两个工具是一个作者。
> 作者GitHub地址：[http://github.com/fullstorydev](http://github.com/fullstorydev)


## 3. 配置测试项目
在您的grpc项目中另外再安装下面的组件
```csharp
<ItemGroup>
  <PackageReference Include="Grpc.AspNetCore" Version="2.40.0" />
  <PackageReference Include="Grpc.AspNetCore.Server.Reflection" Version="2.40.0" />
</ItemGroup>
```
通过反射展示项目中的grpc服务，该项目里面包含了一个grpc服务
```protobuf
syntax = "proto3"; //使用的协议

import "google/protobuf/timestamp.proto";
import "google/protobuf/wrappers.proto";

option csharp_namespace = "UserService.Proto"; //命名空间

service UserInfoService{ //服务名
    //用户用户信息 一元调用
	rpc GetUserInfo(GetUserInfoRequest) returns(GetUserInfoResponse);
}

//登录请求类
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
ConfigureServices中启动grpc并且启动反射
```csharp
services.AddGrpc(options =>
{
    options.EnableDetailedErrors = true;
    options.MaxReceiveMessageSize = 2 * 1024 * 1024;//2m
    options.MaxSendMessageSize = 5 * 1024 * 1024;//5m
});

//启用grpc反射
services.AddGrpcReflection();
```
Configure中增加
```csharp
app.UseEndpoints(endpoints =>
{
    //通过反射向gRPCurl提供示例端点和消息信息的端点
    endpoints.MapGrpcReflectionService();
    //gprc服务暴露
    endpoints.MapGrpcService<UserInfoGrpcService>();
    endpoints.MapControllers();
});
```
启动项目，得到项目的运行地址是：[https://localhost:](https://localhost:7001)5001

## 4. grpcurl

### 4.1 安装

#### 4.1.1 操作二进制包
从github上下载二进制文件直接操作，地址 [https://github.com/fullstorydev/grpcurl/releases](https://github.com/fullstorydev/grpcurl/releases)
![image.png](/common/1638105481946-d4164f28-5a4b-49f3-9f03-a2d5b26f233f.png)
下载后直接当当前目录下使用命令行，显示该地址下的grpc服务
![image.png](/common/1638105859842-2a84efb3-ae48-40cd-8dc6-e0cd2dd6c204.png)

#### 4.1.2 编译源文件
在安装目录下执行，本文是在D:\Program Files\Go\bin下执行
```powershell
go install github.com/fullstorydev/grpcurl/cmd/grpcurl@latest
```
安装步骤
> 此处本应该有图片的，结果一直安装不上(应该是需要科学一下)，之前安装的时候又忘了保存图片

测试是否安装成功
```powershell
grpcurl -help
```
![image.png](/common/1625561623327-a03b2a4a-af6b-4ca0-bded-a7580fa2639a.png)

### 4.2 操作

#### 4.2.1 列出所有可用的grpc服务
```powershell
 .\grpcurl localhost:5001 list
```
![image.png](/common/1638105959936-47da0a5c-8f7a-4065-a550-4fa2a595bf4a.png)

#### 4.2.2 列表指定服务里面所有可用的端点
```powershell
 .\grpcurl localhost:5001 list UserInfoService
```
![image.png](/common/1638106012325-c7432af6-7d32-48bc-881f-96e0c2e69eff.png)

#### 4.2.3 调用服务示例
```powershell
.\grpcurl  -d '{\"user_id\":\"11\"}' localhost:5001 UserInfoService/GetUserInfo
```
![image.png](/common/1638106178316-52df4385-d172-42ec-95df-0914bee75d6e.png)
更多使用使用方法查看：[https://github.com/fullstorydev/grpcurl](https://github.com/fullstorydev/grpcurl)

## 5. grpcui

### 5.1 安装
这个东西是基于go环境进行安装的，需要提前配置go语言环境
```powershell
go get github.com/fullstorydev/grpcui
go install github.com/fullstorydev/grpcui/cmd/grpcui@latest
```
安装过程
![image.png](/common/1625556612495-8138ac2a-aa61-4fcc-a0c1-78e51d79b25d.png)
执行个命令，验证下安装结果：
```powershell
grpcui -help
```
输出：
```
Usage:
    grpcui [flags] [address]
    
......
```
表示安装成功了。或者使用grpcui -version命令。

### 5.2 项目中的配置
还使用上面的项目做测试，项目内需要配置反射操作，启动项目地址为：[https://localhost:7001](https://localhost:7001)

### 5.3 操作

#### 5.3.1 列出所有服务
```powershell
grpcui localhost:7001
```
![image.png](/common/1625566538915-00ce0abd-ddd5-4dc6-b393-acbcd09c6b5c.png)
这个时候会自动打开该地址
![image.png](/common/1625566606698-38c4eff0-ccff-4916-9ab4-0937c36efe7a.png)
通过界面直观显示该项目中所有的grpc服务以及服务的端点。

#### 5.3.2 调用示例
![image.png](/common/1625566663689-561f175c-73de-4958-bee6-bb7e7070b91b.png)
返回结果
![image.png](/common/1625566691712-45a1c4c4-0d3d-4383-9f66-828834e498ec.png)

## 6. 参考文档
> [https://docs.microsoft.com/zh-cn/aspnet/core/grpc/test-tools?view=aspnetcore-3.1](https://docs.microsoft.com/zh-cn/aspnet/core/grpc/test-tools?view=aspnetcore-3.1)
> 当时写的时候遇到了问题，多亏了SpringLeee的这两篇文章
> [https://www.cnblogs.com/myshowtime/p/14299596.html](https://www.cnblogs.com/myshowtime/p/14299596.html)
> [https://www.cnblogs.com/myshowtime/p/14304668.html](https://www.cnblogs.com/myshowtime/p/14304668.html)

