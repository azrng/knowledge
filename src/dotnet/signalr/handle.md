---
title: 操作
lang: zh-CN
date: 2023-07-26
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: qianhouduanfenli
slug: so0083
docsId: '32030129'
---

## 安装

安装使用JS客户端库安装singalr，@microsoft/signalr@latest，选择特定文件
CDM加速：

```
<script src="https://cdnjs.cloudflare.com/ajax/libs/microsoft-signalr/3.1.7/signalr.min.js"></script>
```

.NET 客户端可以安装 **Microsoft.AspNetCore.SignalR.Client** 这个包来支持SignalR。

## 连接

### 服务端配置

```csharp
services.AddSignalR().AddNewtonsoftJsonProtocol();

//configure方法配置
endpoints.MapHub<NotificationsHub>("/chathub");
```

### js作为客户端连接
```csharp
var connection = new signalR.HubConnectionBuilder()
                .withUrl("http://localhost:5000/chatHub")
                .configureLogging(signalR.LogLevel.Information)//配置日志，可选
                .withAutomaticReconnect()//自动重新连接重试4次(0、2、10、30s)，默认不会自动重新连接
                .withAutomaticReconnect([0, 2000, 10000])//自定义重新连接尝试次数(毫秒)
                .build();
 connection.start().then(function () {
        console.log('我连接成功了');
    }).catch(function (err) {
        return console.log("出错" + err.toString());
    });
 connection.onreconnecting(error => {//本来连接然后丢失连接触发
        console.assert(connection.state === signalR.HubConnectionState.Reconnecting);
        console.log("连接已断开");
    });
 connection.onreconnected(connectionId => {////本来连接然后丢失连接然后重新连接触发
        console.assert(connection.state === signalR.HubConnectionState.Connected);

        console.log("连接又成功了");
    });
//手动重新连接
async function start() {
    try {
        await connection.start();
        console.log("SignalR Connected.");
    } catch (err) {
        console.log(err);
        setTimeout(start, 5000);
    }
};
//手动连接
connection.onclose(start);
```

### .Net作为客户端连接

```csharp
using Microsoft.AspNetCore.SignalR.Client;

var connection = new HubConnectionBuilder()
    .WithUrl("http://localhost:5025/chathub", option =>
    {
        // 传递请求头
        option.Headers.Add("AppName", "test");
        option.Headers.Add("Namespace", "dev");
    })
    .WithAutomaticReconnect()
    .Build();

await connection.StartAsync();

Console.ReadLine();
```

## 调用

### 调用服务端

#### 服务端写法

```csharp
public async Task<string> GetTotalLength(string user, string message)
{
    return user.Length + message.Length;
}
```

#### js客户端

```js
connection.invoke("GetTotalLength", user, message).catch(function (err) {
    return console.error(err.toString());
});
```
#### .Net客户端

```csharp
var json = await _connection.InvokeAsync<string, string>("GetTotalLength");
```

### 服务端调用客户端

#### 服务端写法

```csharp
await HubContext.Clients.Client(connIds).SendAsync("ReceiveMessage", vm);
```

#### Js客户端

```csharp
connection.on("ReceiveMessage", function (user, message) {
    var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    var encodedMsg = user + " says " + msg;
    var li = document.createElement("li");
    li.textContent = encodedMsg;
    document.getElementById("messagesList").appendChild(li);
});
```
#### .Net客户端

```csharp
// 接收服务端发送的消息
connection.On<string, string>("ReceiveMessage", (user, message) =>
{
    Console.WriteLine(message);
});
```

## 传输格式

默认signalR是json传输方式，但是MessagePack是一种快速、精简的二进制序列化格式，当性能和宽带需要考虑时候，建议用这个，它会创建比json更小的信息

使用：
服务器需要安装`Microsoft.AspNetCore.SignalR.Protocols.MessagePack`js客户端需要添加包`@microsoft/signalr-protocol-msgpack`
综上一共引用的包有：

```csharp
<script src="~/lib/signalr/signalr.js"></script>
<script src="~/lib/msgpack5/msgpack5.js"></script>
<script src="~/lib/signalr/signalr-protocol-msgpack.js"></script>
```

 连接方式修改为：

```csharp
const connection = new signalR.HubConnectionBuilder()
    .withUrl("http://xxx/chathub")
    .withHubProtocol(new signalR.protocols.msgpack.MessagePackHubProtocol())
    .build();
```

注意：
1.MessagePack 协议区分大小写，传输参数时候必须和服务器大小写完全一致
2.MessagePack 默认传输时间格式是UTC，建议在发送之前将值转为UTC

## 认证

### Jwt认证

```csharp
services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = "JwtBearer";
    options.DefaultChallengeScheme = "JwtBearer";
}).AddJwtBearer("JwtBearer", options =>
{
    options.Audience = "Audience";
    options.TokenValidationParameters = new TokenValidationParameters
    {
        // The signing key must match!
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes("SecurityKey")),
        // Validate the JWT Issuer (iss) claim
        ValidateIssuer = true,
        ValidIssuer = "Issuer",
        // Validate the JWT Audience (aud) claim
        ValidateAudience = true,
        ValidAudience = "Audience",
        // Validate the token expiry
        ValidateLifetime = true,
        // If you want to allow a certain Account of clock drift, set that here
        ClockSkew = TimeSpan.Zero
     };
    options.Events = new JwtBearerEvents
     {
        OnMessageReceived = (context) =>{
        if (!context.HttpContext.Request.Path.HasValue)
        {
            return Task.CompletedTask;
        }
        //重点在于这里；判断是Signalr的路径
        var accessToken = context.HttpContext.Request.Query["access_token"];//这点有区别
        var path = context.HttpContext.Request.Path;
        if (!(string.IsNullOrWhiteSpace(accessToken)) && path.StartsWithSegments("/chat"))
        {
            context.Token = accessToken;
            return Task.CompletedTask;
        }
        return Task.CompletedTask;
        }
    };
});
```

## 负载均衡

引用包

```csharp
<PackageReference Include="Microsoft.AspNetCore.SignalR.StackExchangeRedis" Version="3.1.9" />
<PackageReference Include="StackExchange.Redis" Version="2.2.4" />
```

使用redis方式

```csharp
services.AddSignalR().AddStackExchangeRedis(options =>
{
    options.Configuration.ConnectTimeout = 1;
    options.Configuration.ServiceName = "localhost:6379";
    options.Configuration.DefaultDatabase = 2;
});
```

实际场景：
推送系统部署了A、B两个服务器，张三访问A服务器，李四访问B服务器，当张三通过A服务器向李四推送的时候，A服务器上是找不到李四的连接信息的，自然也就推送不过了，这个时候就需要有一个统一协调的玩意，signalr支持多种，Azure、Redis等，本节以Redis作为底板，介绍如何在Signalr中使用Redis作为底板来支持横向扩展。

> asp.net core 五 SignalR 负载均衡：[https://www.cnblogs.com/tiaoshuidenong/p/8595721.html](https://www.cnblogs.com/tiaoshuidenong/p/8595721.html)
> .NetCore SignalR 踩坑记 ：[https://mp.weixin.qq.com/s/iGEUcVe0X78z3CDdmmJKGQ](https://mp.weixin.qq.com/s/iGEUcVe0X78z3CDdmmJKGQ)
>
> 横向扩展你的ASP.NET Core SignalR 应用 ：[https://mp.weixin.qq.com/s/FueMoc3lA9Fh4rBoxXcG8A](https://mp.weixin.qq.com/s/FueMoc3lA9Fh4rBoxXcG8A)
>
> SignalR负载均衡配置要点：[http://www.manongjc.com/detail/16-ybydfigvlmbqarf.html](http://www.manongjc.com/detail/16-ybydfigvlmbqarf.html)

## 扩展

基于SignalR的消息推送与二维码描登录实现：[https://mp.weixin.qq.com/s/Jbfimr2Nxi1Brtuv4vuPig](https://mp.weixin.qq.com/s/Jbfimr2Nxi1Brtuv4vuPig)

## 资料

API设计注意事项：[https://docs.microsoft.com/zh-cn/aspnet/core/signalr/api-design?view=aspnetcore-3.1](https://docs.microsoft.com/zh-cn/aspnet/core/signalr/api-design?view=aspnetcore-3.1)

