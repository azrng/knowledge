---
title: 请求示例
lang: zh-CN
date: 2023-09-01
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: qingqiushili
slug: cth3lo
docsId: '65232158'
---

## Postman
> 选择请求方式为POST ，设置headers为：Content-Type text/xml;charset=utf-8

示例一：代码中只需要一个参数
请求url:[http://localhost:5000/FileWebService.asmx](http://localhost:5000/FileWebService.asmx)
```csharp
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
   <soapenv:Header/>
   <soapenv:Body>
      <tem:GetFileUrl>
         <tem:fileId>805a9826-afb7-4375-aec6-0e7c91a8faa9</tem:fileId>
      </tem:GetFileUrl>
   </soapenv:Body>
</soapenv:Envelope>
```
> GetFileUrl是webserver的方法，fileId是入参

获取其他示例
```csharp
<?xml version="1.0" encoding="utf-8"?>
<soap12:Envelope
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:xsd="http://www.w3.org/2001/XMLSchema"
    xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
    <soap12:Body>
        <SendMessageInfo>
            <messageCode>
                MES0054
            </messageCode>
            <inputContent>
             <![CDATA[<Request><randpsw>7242e1712a6c285d2f6ce1f136572be8</randpsw><to_mobile>18838940825</to_mobile><s_content>【香港大学深圳医院】您的手机验证码为:221137</s_content></Request>]]>
            </inputContent>
        </SendMessageInfo>
    </soap12:Body>
</soap12:Envelope>
```

## .NetCore
调用的方法是HIPMessageServerAsync
```csharp
// 创建 HTTP 绑定对象         
var binding = new CustomBinding(new TextMessageEncodingBindingElement
{
    //我们调用的soap是1.2，这里要选用Soap12，若不指定 默认是1.2 Soap12
    MessageVersion = MessageVersion.Soap12WSAddressing10
}, new HttpTransportBindingElement
{
    //认证模式
    AuthenticationScheme = AuthenticationSchemes.Anonymous,
    MaxReceivedMessageSize = int.MaxValue
});

// 根据 WebService 的 URL 构建终端点对象
var endpoint = new EndpointAddress($"{url}");

// 创建调用接口的工厂，注意这里泛型只能传入接口
using var factory = new ChannelFactory<HIPServicePortType>(binding, endpoint);

// 从工厂获取具体的调用实例
var callClient = factory.CreateChannel();

// 调用具体的方法
var result = await callClient.HIPMessageServerAsync(request);
```

## HTTP方式去请求
通过http的方式请求webservice服务，传入action和message，然后返回字符串，再通过xml的方式去解析拿到对应的响应内容，再去处理响应的内容
```csharp
string requestContent = @"<?xml version=""1.0"" encoding=""utf-8""?>
<soap12:Envelope
xmlns:xsi=""http://www.w3.org/2001/XMLSchema-instance""
xmlns:xsd=""http://www.w3.org/2001/XMLSchema""
xmlns:soap12=""http://www.w3.org/2003/05/soap-envelope"">
<soap12:Body>
<HIPMessageServer
xmlns=""urn:hl7-org:v3"">
<action>{0}</action>
<message>
    <![CDATA[{1}]]>
</message>
</HIPMessageServer>
</soap12:Body>
</soap12:Envelope>";

requestContent = string.Format(requestContent, textBox2.Text, textBox3.Text);

// 创建 HttpClient 对象
using var client = new HttpClient();
// 创建 HttpRequestMessage 对象
var request = new HttpRequestMessage(HttpMethod.Post, textBox1.Text)
{
    Content = new StringContent(requestContent, Encoding.UTF8, "text/xml")
};

// 发送请求并获取响应
var response = await client.SendAsync(request);

// 读取响应内容
var responseContent = await response.Content.ReadAsStringAsync();

// 解析 XML 响应数据
var xmlDoc = new XmlDocument();
xmlDoc.LoadXml(responseContent);

// 设置命名空间前缀和 URI
var nsManager = new XmlNamespaceManager(xmlDoc.NameTable);
nsManager.AddNamespace("urn", "urn:hl7-org:v3");

// 获取 <urn:payload> 节点
var payloadNode = xmlDoc.SelectSingleNode("//urn:payload", nsManager);

// 处理返回结果
var result = payloadNode.InnerText;
```

## 资料
[https://www.cnblogs.com/nuoxin/p/15060905.html](https://www.cnblogs.com/nuoxin/p/15060905.html)：使用PostMan测试WebService服务
