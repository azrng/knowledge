---
title: SSE
lang: zh-CN
date: 2023-06-20
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: sse
slug: wu9bhq
docsId: '69447450'
---

## 概述
现如今程序员对Web API的调用已经是轻车熟路。但是传统的api调用都是拉模式，也就是主动发起请求去调用一个api.
但是程序员往往对另一种很有用的模式很陌生，即推模式。

- 拉模式 - 主动调用并获取结果的模式。
- 推模式 - 订阅并接受数据推送的模式。

今天要介绍的是一个被大家忽略但却非常有用的一项技术。
基于HTTP/2的标准服务器事件推送模式，英文简称Server-Sent Events，后面简称SSE。

## Server-Sent Events
这里引用MDN上的一段解释：
> EventSource 是服务器推送的一个网络事件接口。一个EventSource实例会对HTTP服务开启一个持久化的连接，以text/event-stream` 格式发送事件, 会一直保持开启直到被要求关闭。
> 一旦连接开启，来自服务端传入的消息会以事件的形式分发至你代码中。如果接收消息中有一个事件字段，触发的事件与事件字段的值相同。如果没有事件字段存在，则将触发通用事件。
> 与 WebSockets,不同的是，服务端推送是单向的。数据信息被单向从服务端到客户端分发. 当不需要以消息形式将数据从客户端发送到服务器时，这使它们成为绝佳的选择。例如，对于处理社交媒体状态更新，新闻提要或将数据传递到客户端存储机制（如IndexedDB或Web存储）之类的，EventSource无疑是一个有效方案。

以上解释简单说明了SSE的用途，该项技术也是推模式的典型技术之一。同类型的技术是WebSockets, 和SignalR。
代码是展示一项技术的最好办法：

## 操作示例

### 客户端实现
```csharp
   //javascript 构造一个EventSource实例，代表一个服务器推送长连接。
var source = new EventSource("/api/values"); //传入支持推送模式的api url。随后展示。

//当普通消息被传递时触发。
       source.onmessage = function (event) {
           console.log('onmessage: ' + event.data);
      };

//当连接打开时触发。
       source.onopen = function(event) {
           console.log('onopen');
      };

//当出错时候触发
       source.onerror = function(event) {
           console.log('onerror');
      }
       
       //使用自定义时间时候触发。ping为自定义事件，你可以根据实际需求定义自己的事件名称。如果事件名称匹配，则该方法会被调用
       source.addEventListener("ping", function(event) {
           console.log('onping' + event.data);
      });
```

### ASP.NET Core API实现
```csharp
[HttpGet]
public async Task GetValue()
{
   //测试，debug到这里的时候你会发现，协议使用的是HTTP/2. APS.NET Core 2.1以上就默认支持HTTP/2，无需额外的配置。再Windows Server2016/Windows10+会自动提供支持。
   string requestProtocol = HttpContext.Request.Protocol;
   var response = Response;
   //响应头部添加text/event-stream，这是HTTP/2协议的一部分。
   response.Headers.Add("Content-Type", "text/event-stream");
   for (int i=0;i<100;i++)
  {
	   // event:ping event是事件字段名，冒号后面是事件名称，不要忘了\n换行符。
	   await HttpContext.Response.WriteAsync($"event:ping\n");
	   
	   // data: 是数据字段名称，冒号后面是数据字段内容。注意数据内容仅仅支持UTF-8，不支持二进制格式。
	   // data后面的数据当然可以传递JSON String的。
	   await HttpContext.Response.WriteAsync($"data:Controller {i} at {DateTime.Now}\r\r");
	   
	   // 写入数据到响应后不要忘记 FlushAsync()，因为该api方法是异步的，所以要全程异步，调用同步方法会报错。
	   await HttpContext.Response.Body.FlushAsync();
	   
	   //模拟一个1秒的延迟。
	   await Task.Delay(1000);
  }
   
   //数据发送完毕后关闭连接。
   Response.Body.Close();
}
```

## 协议字段解释
event
事件类型.如果指定了该字段,则在客户端接收到该条消息时,会在当前的EventSource对象上触发一个事件,事件类型就是该字段的字段值,你可以使用addEventListener()方法在当前EventSource对象上监听任意类型的命名事件,如果该条消息没有event字段,则会触发onmessage属性上的事件处理函数.
data
消息的数据字段.如果该条消息包含多个data字段,则客户端会用换行符把它们连接成一个字符串来作为字段值.
id
事件ID,会成为当前EventSource对象的内部属性"最后一个事件ID"的属性值.
retry
一个整数值,指定了重新连接的时间(单位为毫秒),如果该字段值不是整数,则会被忽略.
消息的例子：
```csharp
event: userconnect
data: {"username": "bobby", "time": "02:33:48"}

event: usermessage
data: {"username": "bobby", "time": "02:34:11", "text": "Hi everyone."}

event: userdisconnect
data: {"username": "bobby", "time": "02:34:23"}

event: usermessage
data: {"username": "sean", "time": "02:34:36", "text": "Bye, bobby."}
```
> 这里提醒大家去仔细阅读消息的格式。消息格式错误，将导致数据无法正确解析。


## 对比
到这里大家不难发现SSE技术其实也是一种实时服务端推送数据的技术，但是他的光环被更为闪耀的WebSockets给覆盖了。Stackoverflow上有一篇很不错的对比。大家可以搜索WebSockets vs. Server-Sent events/EventSource 总的来说，SSE能实现的功能WebSockets都能实现，但是SEE更轻量无需其他库并且服务器端也非常容易编写。同时她是基于HTTP的，自然在穿透防火墙方面也就无需太多顾虑。更多的对比结论如下（参考。
SSE 相对于 Websockets 的优势：

- 通过简单的 HTTP 而不是自定义协议传输
- 可以使用第三方库支持不支持SSE的浏览器例如IE浏览器。
- 内置支持重新连接和事件 ID
- 更简单的协议
- 企业防火墙进行数据包检查不会有问题。

Websockets 相对于 SSE 的优势：

- 实时，双向通信。
- 更多浏览器的原生支持

SSE 的理想用例：

- 股票行情流，数据监控大屏数据发送，IOT物联网设备数据发送。
- 社交平台上的状态更新等。
- 浏览器通知

SSE缺陷：

- 不支持二进制
- 最大打开连接数限制。HTTP1.1 单个浏览器只支持6个连接（也就是打开6个Tab页以上就会出问题，并且在Chrom和Firefox上无法解决）HTTP/2上默认100个。

## 总结
SSE是一项轻量级的基于HTTP/2的标准协议，除了IE浏览器（不包含Edge）以外的其他浏览器均已支持该协议。后端服务ASP.NET Core 无疑也是完美支持的，.NET程序员可以放心使用。因为SSE使用HTTP最大的优势可以避过防火墙的坑，WebSockets协议在穿透防火墙时候可能会有问题，而且有些老式的中间设备可能不认识WebSockets协议导致兼容性问题。
SSE另一个优点是无需额外的库就可以启用，而且支持自动重连。非常适合从服务器推送数据到客户端的单项应用。而不用无脑的考虑WebSockets协议。甚至可以吧SSE 和 Websokets协议联合起来使用，当仅需服务器单项传输时候采用SSE，需要双向传输时候采用Websokets。

## 资料
[https://mp.weixin.qq.com/s/DEZ3FiWGyLQ5-HwTuvjSQw](https://mp.weixin.qq.com/s/DEZ3FiWGyLQ5-HwTuvjSQw) | 基于ASP.NET Core api 的服务器事件发送
