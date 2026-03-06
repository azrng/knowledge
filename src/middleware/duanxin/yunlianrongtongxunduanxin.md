---
title: 云联融通讯短信
lang: zh-CN
date: 2022-01-28
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: yunlianrongtongxunduanxin
slug: py1ok9
docsId: '65853972'
---

## 概述

## 操作
配置文件
```csharp
"SmsConfig": {
  "SMSValidCodeSecond": "600", //短信有效时间-秒-
  "SmsAddress": "app.cloopen.com", //短信服务器地址
  "SmsPort": "8883", //短信服务器端口
  "SmsAccountSid": "xxxxx", //主帐号
  "SmsAccountToken": "xxxxx", //主帐号令牌
  "SmsAppId": "xxxxx" //应用ID
},
```
发送短信
```csharp
var config = _smsConfig;
string date = DateTime.Now.ToString("yyyyMMddhhmmss");
string sigstr = (config.SmsAccountSid + config.SmsAccountToken + date).Md5Hash();
string url = string.Format("https://{0}:{1}/{2}/Accounts/{3}/SMS/TemplateSMS?sig={4}", config.SmsAddress, config.SmsPort, _softVer, config.SmsAccountSid, sigstr);

var myEncoding = Encoding.GetEncoding("utf-8");
byte[] myByte = myEncoding.GetBytes(config.SmsAccountSid + ":" + date);
string authStr = Convert.ToBase64String(myByte);
var dic = new Dictionary<string, string>
{
    { "Accept", "application/json" },
    { "Authorization",authStr}
};
var param = new SendTemplateSMSVm
{
    AppId = _smsConfig.SmsAppId,
    TemplateId = templateId,
    Datas = data,
    To = phone
};
var responseStr = await _httpClient.PostAsync<string>(url, param, dic);
_logger.LogInformation("短信发送成功，手机号码是" + phone);
```
