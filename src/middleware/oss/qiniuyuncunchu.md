---
title: 七牛云存储
lang: zh-CN
date: 2022-01-16
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: qiniuyuncunchu
slug: vwg15v
docsId: '63746249'
---

## 介绍
C## SDK 属于服务端SDK之一，主要有如下功能：

- 提供生成客户端上传所需的上传凭证的功能
- 提供文件从服务端直接上七牛的功能
- 提供对七牛空间中文件进行管理的功能
- 提供对七牛空间中文件进行处理的功能
- 提供七牛CDN相关的刷新，预取，日志功能

## 操作

### 客户端上传凭证
客户端（移动端或者Web端）上传文件的时候，需要从客户自己的业务服务器获取上传凭证，而这些上传凭证是通过服务端的SDK来生成的，然后通过客户自己的业务API分发给客户端使用。根据上传的业务需求不同，c## SDK支持丰富的上传凭证生成方式。
创建各种上传凭证之前，我们需要定义好其中鉴权对象mac：
```csharp
Mac mac = new Mac(AccessKey, SecretKey);
```

### 简单上传凭证
最简单的上传凭证只需要AccessKey，SecretKey和Bucket就可以。
```csharp
PutPolicy putPolicy = new PutPolicy();
putPolicy.Scope = Bucket;
string token = Auth.CreateUploadToken(mac, putPolicy.ToJsonString());
```
默认情况下，在不指定上传凭证的有效时间情况下，默认有效期为1个小时。也可以自行指定上传凭证的有效期，例如：
```csharp
//自定义凭证有效期（示例2小时，expires单位为秒，为上传凭证的有效时间）
PutPolicy putPolicy = new PutPolicy();
putPolicy.Scope = Bucket;
putPolicy.SetExpires(7200);
string token = Auth.CreateUploadToken(mac, putPolicy.ToJsonString());
```

### 覆盖上传的凭证
覆盖上传除了需要简单上传所需要的信息之外，还需要想进行覆盖的文件名称，这个文件名称同时可是客户端上传代码中指定的文件名，两者必须一致。
```csharp
PutPolicy putPolicy = new PutPolicy();
putPolicy.Scope = Bucket + ":" + Key;
putPolicy.SetExpires(7200);
string token = Auth.CreateUploadToken(mac, putPolicy.ToJsonString());
```

### 自定义上传回复的凭证
默认情况下，文件上传到存储之后，在没有设置returnBody或者回调相关的参数情况下，存储返回给上传端的回复格式为hash和key，例如：
```csharp
{"hash":"Ftgm-CkWePC9fzMBTRNmPMhGBcSV","key":"qiniu.jpg"}
```
有时候我们希望能自定义这个返回的JSON格式的内容，可以通过设置returnBody参数来实现，在returnBody中，我们可以使用七牛支持的魔法变量和自定义变量。
```csharp
PutPolicy putPolicy = new PutPolicy();
putPolicy.Scope = Bucket + ":" + Key;
putPolicy.ReturnBody = "{\"key\":\"$(key)\",\"hash\":\"$(etag)\",\"fsiz\":$(fsize),\"bucket\":\"$(bucket)\",\"name\":\"$(x:name)\"}";
string token = Auth.CreateUploadToken(mac, putPolicy.ToJsonString());
```
则文件上传到存储之后，收到的回复内容如下：
```csharp
{"key":"qiniu.jpg","hash":"Ftgm-CkWePC9fzMBTRNmPMhGBcSV","bucket":"if-bc","fsize":39335,"name":"qiniu"}
```

### 带回调业务服务器的凭证
上面生成的自定义上传回复的上传凭证适用于上传端（无论是客户端还是服务端）和存储服务器之间进行直接交互的情况下。在客户端上传的场景之下，有时候客户端需要在文件上传到存储之后，从业务服务器获取相关的信息，这个时候就要用到存储的上传回调及相关回调参数的设置。
```csharp
putPolicy = new PutPolicy();
putPolicy.Scope = Bucket;
putPolicy.CallbackUrl = "http://api.example.com/qiniu/upload/callback";
putPolicy.CallbackBody = "{\"key\":\"$(key)\",\"hash\":\"$(etag)\",\"fsiz\":$(fsize),\"bucket\":\"$(bucket)\",\"name\":\"$(x:name)\"}";
putPolicy.CallbackBodyType = "application/json";
upToken = Auth.CreateUploadToken(mac, putPolicy.ToJsonString());
Console.WriteLine(upToken);
```
在使用了上传回调的情况下，客户端收到的回复就是业务服务器响应七牛的JSON格式内容。通常情况下，我们建议使用application/json格式来设置callbackBody，保持数据格式的统一性。实际情况下，callbackBody也支持application/x-www-form-urlencoded格式来组织内容，这个主要看业务服务器在接收到callbackBody的内容时如果解析。例如：
```csharp
putPolicy = new PutPolicy();
putPolicy.Scope = Bucket;
putPolicy.CallbackUrl = "http://api.example.com/qiniu/upload/callback";
putPolicy.CallbackBody = "key=$(key)&hash=$(etag)&bucket=$(bucket)&fsize=$(fsize)&name=$(x:name)";
upToken = Auth.CreateUploadToken(mac, putPolicy.ToJsonString());
Console.WriteLine(upToken);
```

### 带数据处理的凭证
七牛支持在文件上传到七牛之后，立即对其进行多种指令的数据处理，这个只需要在生成的上传凭证中指定相关的处理参数即可。
```csharp
putPolicy = new PutPolicy();
string saveMp4Entry = Base64.UrlSafeBase64Encode(Bucket + ":avthumb_test_target.mp4");
string saveJpgEntry = Base64.UrlSafeBase64Encode(Bucket + ":vframe_test_target.jpg");
string avthumbMp4Fop = "avthumb/mp4|saveas/" + saveMp4Entry;
string vframeJpgFop = "vframe/jpg/offset/1|saveas/" + saveJpgEntry;
string fops = string.Join(";", new string[] { avthumbMp4Fop, vframeJpgFop });
putPolicy.Scope = Bucket;
putPolicy.PersistentOps = fops;
putPolicy.PersistentPipeline = "video-pipe";
putPolicy.PersistentNotifyUrl = "http://api.example.com/qiniu/pfop/notify";
upToken = Auth.CreateUploadToken(mac, putPolicy.ToJsonString());
Console.WriteLine(upToken);
```
队列 pipeline 请参阅创建私有队列；转码操作具体参数请参阅音视频转码；saveas 请参阅处理结果另存。

### 带自定义参数的凭证
存储支持客户端上传文件的时候定义一些自定义参数，这些参数可以在returnBody和callbackBody里面和七牛内置支持的魔法变量（即系统变量）通过相同的方式来引用。这些自定义的参数名称必须以x:开头。例如客户端上传的时候指定了自定义的参数x:name和x:age分别是string和int类型。那么可以通过下面的方式引用：
```csharp
putPolicy.ReturnBody = "{\"key\":\"$(key)\",\"hash\":\"$(etag)\",\"fsiz\":$(fsize),\"bucket\":\"$(bucket)\",\"name\":\"$(x:name)\"}";

或者
putPolicy.CallbackBody = "{\"key\":\"$(key)\",\"hash\":\"$(etag)\",\"fsiz\":$(fsize),\"bucket\":\"$(bucket)\",\"name\":\"$(x:name)\"}";
```

### 综合上传凭证
上面的生成上传凭证的方法，都是通过设置上传策略🔗相关的参数来支持的，这些参数可以通过不同的组合方式来满足不同的业务需求，可以灵活地组织你所需要的上传凭证。

### 服务端直传
服务端直传是指客户利用七牛服务端SDK从服务端直接上传文件到存锤，交互的双方一般都在机房里面，所以服务端可以自己生成上传凭证，然后利用SDK中的上传逻辑进行上传，最后从七牛云获取上传的结果，这个过程中由于双方都是业务服务器，所以很少利用到上传回调的功能，而是直接自定义returnBody来获取自定义的回复内容。

## 参考文档
微信公众号【DotNet NB】：[https://mp.weixin.qq.com/s/UfK_kLxz7x1zyokWN3CPtA](https://mp.weixin.qq.com/s/UfK_kLxz7x1zyokWN3CPtA)
