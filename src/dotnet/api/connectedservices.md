---
title: Connected Services
lang: zh-CN
date: 2023-05-29
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: connectedservices
slug: lsv2wgvgabsd6pi1
docsId: '126104582'
---

## 生成API调用代码
生成的代码将和接口对应的参数、返回值一一对应，本文底层使用的工具为NSwag.exe，其他可替代的方案还有AutoSet.exe。
本文中生成的代码将在编译过程中自动编译，类似grpc生成代码的模式，如果使用AutoSet则需要手动引入代码。
另外也可以使用NSwag对应的vs插件([https://marketplace.visualstudio.com/items?itemName=Unchase.unchaseopenapiconnectedservice](https://marketplace.visualstudio.com/items?itemName=Unchase.unchaseopenapiconnectedservice))

右键项目然后添加=>连接的服务，然后配置生成的代码，选择你想生成调用代码的API的 swagger.json文件地址，然后就可以生成调用代码，比如我们将生辰的代码提供类名称设置为TestClient，那么调用示例就是
```csharp
HttpClient httpClient = new HttpClient();
var client = new TestClient("http://192.168.2.49:7000/", httpClient);
var enums = client.ExecAsync(new ProcedureInDto { });
enums.Wait();
Console.WriteLine(JsonConvert.SerializeObject(enums.Result));
```
