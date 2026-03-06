---
title: proto文件
lang: zh-CN
date: 2023-09-29
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: protowenjian
slug: msebsn
docsId: '48013096'
---

## 介绍文件
- 定义包、库名字
- 定义服务“Service”
- 定义输入输出模型“Message”

选中项目右键新建协议缓冲区文件，后缀名是.proto。
![image.png](/common/1638090959218-2d44b271-6613-4966-94d1-8bd885cde46b.png)
简单示例
```csharp
syntax = "proto3"; //标识使用proto3协议

option csharp_namespace = "RPC.Protos.Two"; // 命名空间

package RPC.Protos.Two;// 命名空间

service Customer{ // 定义服务Customer

    //登录 
	rpc Login(LoginVm) returns(LoginResult); //定义请求和响应
}

//登录请求类
message LoginVm{
  // 定义每个字段的顺序，这也就是我们序列化的顺序，是通过数据类型和顺序来识别指定的值  
  string account=1;//帐号
  string password=2;//密码
}

//登录返回类
message LoginResult{
  string name=1;//用户名
}

```

- **syntax="proto3";**
> 文件的第一行指定了你使用的是proto3的语法：如果你不指定，protocol buffer 编译器就会认为你使用的是proto2的语法。这个语句必须出现在.proto文件的非空非注释的第一行。

- **package user;**
> 编译完成之后，包名为user

- **service 定义服务**
```
service UserService {
  rpc Login(LoginRequest) returns (LoginResponse);
}
```

- **message 定义结构体**
```
message LoginRequest {
	string username=1;
	string password=2;
}
```
> Protobuf 样式指南建议使用 underscore_separated_names 作为字段名称。 为 .NET 应用创建的新 Protobuf 消息应遵循 Protobuf 样式准则。 .NET 工具会自动生成使用 .NET 命名标准的 .NET 类型。 例如，first_name Protobuf 字段生成 FirstName .NET 属性

然后通过Grpc.Tools生成服务端代码和客户端代码

## 请求类分离
可以在一个proto里面引入多个proto文件，场景比如说用户或者订单的grpc接口比较多，那么请求类和返回类混合到一块比较乱，这个时候可以考虑将一个proto文件拆分成三个proto文件，分别存储用户服务接口、用户服务请求类、用户服务返回类，然后通过import将需要的请求类进行导入。
```protobuf
syntax = "proto3";

import "UserVm.proto";
import "UserResult.proto";

option csharp_namespace = "RPC.Protos.One";
```

## 常用类型
gRPC中定义的枚举第一个值必须为1。

### 标量值类型
| **.proto类型** | **C#类型** | 注释 |
| --- | --- | --- |
| double | double | 数值默认为0 |
| float | float | 数值默认为0 |
| int32 | int | 数值默认为0
使用可变长编码方式。编码负数时不够高效；如果你的字段可能含有负数，那么请使用sint32。 |
| int64 | long | 数值默认为0
使用可变长编码方式。编码负数时不够高效；如果你的字段可能含有负数，那么请使用sint64。 |
| uint32 | uint | 数值默认为0 |
| uint64 | ulong | 数值默认为0 |
| sint32 | int | 数值默认为0
使用可变长编码方式。有符号的整型值。编码时比通常的int32高效。 |
| sint64 | long | 数值默认为0
使用可变长编码方式。有符号的整型值。编码时比通常的int64高效。 |
| fixed32 | uint | 数值默认为0
总是4个字节。如果数值总是比2^28大的话，这个类型会比uint32高效。 |
| fixed64 | ulong | 数值默认为0
总是8个字节。如果数值总是比2^56大的话，这个类型会比uint64高效。 |
| sfixed32 | int | 数值默认为0
总是4个字节。 |
| sfixed64 | long | 数值默认为0
总是8个字节。 |
| bool | bool | bool默认为false； |
| string | string | string默认为空字符串；
一个字符串必须是UTF-8编码或者7-bit ASCII编码的文本。 |
| bytes | Google.Protobuf.ByteString |   |
| map | Google.Protobuf.Collections.MapField | 例如：map<string,string> resultMap = 1; |
| google.protobuf.Timestamp | google.protobuf.Timestamp | 需要引用一下：import public "google/protobuf/timestamp.proto";
C## 赋值方式： Time= Google.Protobuf.WellKnownTypes.Timestamp.FromDateTime(DateTime.Now) |

标量值使用具有默认值，并且该默认值不能设置为null

### 日期和时间
默认不提供和.Net的DateTimeOffset、DateTime、TimeSpan等效的日期和时间值，可以使用Protobug的一些“已知类型”扩展来指定这些类型。

| **.proto类型** | **C#类型** |  |
| --- | --- | --- |
| google.protobuf.Timestamp | DateTimeOffset | 需要引用一下：import public "google/protobuf/timestamp.proto"; |
| google.protobuf.Timestamp | DateTime | 需要引用一下：import public "google/protobuf/timestamp.proto"; |
| google.protobuf.Duration | TimeSpan | 需要引用一下：import public "google/protobuf/duration.proto"; |

```protobuf
syntax = "proto3"

import "google/protobuf/duration.proto";  
import "google/protobuf/timestamp.proto";

message Meeting {
    string subject = 1;
    google.protobuf.Timestamp start = 2;
    google.protobuf.Duration duration = 3;
}
```

### 可为null的类型
通过导入wrappers.proto文件可以设置为null的值
```protobuf
syntax = "proto3"

import "google/protobuf/wrappers.proto"

message Person {
    // ...
    google.protobuf.Int32Value age = 5;
}
```
| **.proto类型** | **C#类型** |
| --- | --- |
| google.protobuf.BoolValue | bool? |
| google.protobuf.DoubleValue | double? |
| google.protobuf.FloatValue | float? |
| 
google.protobuf.Int32Value | int? |
| 
google.protobuf.Int64Value | long? |
| 
google.protobuf.UInt32Value | uint? |
| 
google.protobuf.UInt64Value | ulong? |
| google.protobuf.StringValue | string |
| google.protobuf.BytesValue | ByteString |


### 集合类型
比如我们要返回一个list对象，可以这样子写
```csharp
message StudentResponse {
    string name = 1;
    int32 age = 2;
    string city = 3;
}

message StudentResponseList {
    repeated StudentResponse studentResponse = 1;
}
```

## 使用proto文件

### 直接使用proto文件
将proto文件放到项目目录下一个地方，然后通过相对路径直接引入使用，例如
```csharp
<ItemGroup>
  <Protobuf Include="..\Protos\UserInfoService.proto" Link="Protos\UserInfoService.proto" GrpcServices="Server" />
</ItemGroup>
```
这个时候想使用该proto文件，服务端需要安装nuget包如下
```csharp
<ItemGroup>
  <PackageReference Include="Grpc.AspNetCore" Version="2.40.0" />
</ItemGroup>
```
客户端需要安装nuget如下
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

### 使用proto文件生成类
通过命令将proto文件进行提前编译，然后服务端和客户端直接引用该文件进行操作
新建一个类库shareProto，该类库里面protobuf文件夹下包含一个Customer.proto文件
```csharp
syntax = "proto3"; //标识使用proto3协议

package GrpcCompileProto;// 命名空间

service Customer{ // 定义服务

    //登录 一元调用
	rpc Login(LoginVm) returns(LoginResult);
}

//登录请求类
message LoginVm{
  string account=1;//帐号
  string password=2;//密码
}

//登录返回类
message LoginResult{
  string name=1;//用户名
}
```
然后在该protobuf层级下运行命令(需要准备grpc_csharp_plugin.exe和protoc.exe)，或者直接新建下面bat文件
```csharp
@echo off
title grpc csharp generate

echo starting generate grpc entities from csharp......

tools\protoc.exe -I . --csharp_out . protobuf\*.proto --grpc_out . --plugin=protoc-gen-grpc=tools\grpc_csharp_plugin.exe

echo generate finished!!!
echo.
pause
```
执行成功后会生成文件，例如
![image.png](/common/1638283199067-bbf06dc3-693d-4dd9-903f-da994e2fa696.png)
服务端项目引用该类库后再引用nuget包
```csharp
<ItemGroup>
  <PackageReference Include="Grpc.AspNetCore" Version="2.40.0" />
</ItemGroup>
```
客户端引用nuget包
```csharp
<ItemGroup>
  <PackageReference Include="Grpc.Net.Client" Version="2.40.0" />
</ItemGroup>
```
> 好处是这种方式只用编译一次，后续直接就可以用，以免有时候配置问题导致proto文件生成一直报错



## 使用技巧
下面内容摘抄自其他文章，时代久远了

### 技巧一
上面章节的操作步骤中，我们需要在服务和客户端之间复制proto，这是一个可以省略掉的步骤。
1.复制 Protos 文件夹到解决方案根目录（sln文件所在目录），放在一个公共的地方
![image.png](/common/1610000299410-b8c82980-19a8-4f2c-9784-f87f34630c32.png)
2.删除客户端和服务项目中的 Protos 文件夹
3.在客户端项目文件csproj中添加关于proto文件的描述
```csharp
<ItemGroup>
    <Protobuf Include="..\..\Protos\greet.proto" GrpcServices="Client" Link="Protos\greet.proto" />
  </ItemGroup>
```
4.在服务项目文件csproj中添加关于proto文件的描述
```csharp
<ItemGroup>
    <Protobuf Include="..\..\Protos\greet.proto" GrpcServices="Server" Link="Protos\greet.proto" />
  </ItemGroup>
```

在实际项目中，请自己计算相对路径
5.这样两个项目都是使用的一个proto文件，只用维护这一个文件即可
![image.png](/common/1610000299413-4109ccb6-8c02-496c-a0e2-ebeb50460dc1.png)

### 技巧二
我们在实际项目中使用，肯定有多个 proto 文件，难道我们每添加一个 proto 文件都要去更新 csproj文件？
我们可以使用MSBuild变量来帮我们完成，我们将 csproj 项目文件中引入proto文件信息进行修改。
服务端：
```csharp
<ItemGroup>
    <Protobuf Include="..\..\Protos\*.proto" GrpcServices="Server" Link="Protos\%(RecursiveDir)%(Filename)%(Extension)" />
</ItemGroup>
```
客户端：
```csharp
<ItemGroup>
    <Protobuf Include="..\..\Protos\*.proto" GrpcServices="Client" Link="Protos\%(RecursiveDir)%(Filename)%(Extension)" />
  </ItemGroup>
```
示例：
![image.png](/common/1610000299480-216e4387-9f4b-4487-b5a7-6a1397b44201.png)
