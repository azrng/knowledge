---
title: 数据传输加密
lang: zh-CN
date: 2023-06-24
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: shujuchuanshujiami
slug: hgk2uw
docsId: '65982472'
---

## 需求
为了安全性起见，客户要求客户端必须将数据加密后才能传给服务端。
起先，准备使用非对称加密（RSA）方式，但是发现它对原始文本长度有限制。
而对称加密(AES)没有长度限制，但是使用固定密钥存在暴露的风险。

## 思路
密钥肯定每个用户不同，而要验证用户则必须登录。
因此，唯一可以安全获取密钥的时机，只能是在登录时。
而为了保证用户名密码传输安全，可以使用RSA公钥加密后传输，所有客户端使用同一公钥也没问题。
登录成功后，服务端将生成token和AES密钥返回给客户端。但是，返回的AES密钥是经过加密的，而加密密钥则是“用户名+密码”。
**这样保证了，只有刚才成功登录的客户端才能解密出AES密钥。**
以后的传输，全部使用AES加密，服务端可以根据token从缓存获取AES密钥解密。
整体流程如下图：
![](/common/1643893176902-9c5e1ef6-42e3-4e64-8dd9-37b6a4156d09.webp)
缺点：这样子的话，客户端也需要保存住用户的账号密码，因为每次传输的时候要使用到密码进行加密使用的。

## 操作

### 服务端实现
```csharp
[HttpPost("Login")]
public LoginOutput Login(LoginInput input)
{
    var userName = RsaHelper.Decrypt(input.UserName, privateKey);
    var password = RsaHelper.Decrypt(input.Password, privateKey);
    (byte[] tmpKey, byte[] tmpIV) = AesHelper.CreateKeyIV(userName + password, password + userName);

    var token = Guid.NewGuid().ToString("N"); 
    (byte[] key, byte[] iv) = AesHelper.CreateKeyIV();
    _cache.Add(token, (key, iv));
    return new LoginOutput
    {
        Token = token,
        Key = AesHelper.Encrypt(Convert.ToBase64String(key), tmpKey, tmpIV),
        IV = AesHelper.Encrypt(Convert.ToBase64String(iv), tmpKey, tmpIV)
    };
}

[HttpPost("TestMethod")]
public string TestMethod([FromQuery]string token, [FromBody]string cipherText)
{
    (byte[] key, byte[] iv) = _cache[token];
    return AesHelper.Decrypt(cipherText, key, iv);
}
```
Login用于验证用户密码并返回token和AES密钥.
TestMethod用于演示接收客户端数据如何解密，为了演示方便，直接在URL传递token。

### 客户端实现
使用xunit测试项目演示客户端操作，代码如下：
```csharp
[Fact]
public async void Test1()
{
    //登录获得AES密钥
    var response = await _httpClient.PostAsync( "/Demo/Login",
        JsonContent.Create(new WebApplication1.LoginInput{ 
            UserName = RsaHelper.Encrypt(userName, publicKey),
            Password = RsaHelper.Encrypt(password, publicKey)
        }));
    var loginResult = await response.Content.ReadFromJsonAsync<WebApplication1.LoginOutput>();

    (byte[] tmpKey, byte[] tmpIV) = AesHelper.CreateKeyIV(userName + password, password + userName);

    byte[] key =Convert.FromBase64String(AesHelper.Decrypt(loginResult.Key, tmpKey, tmpIV));
    byte[] iv = Convert.FromBase64String(AesHelper.Decrypt(loginResult.IV, tmpKey, tmpIV));

    //使用AES密钥加密
    var cipherText = AesHelper.Encrypt(PlainText, key, iv);
    _output.WriteLine(cipherText);
    response = await _httpClient.PostAsync("/Demo/TestMethod?token=" + loginResult.Token,
        JsonContent.Create(cipherText));

    var decryptResult = await response.Content.ReadAsStringAsync();

    _output.WriteLine(decryptResult);
    Assert.Equal(PlainText, decryptResult);
}
```
将大量数据（千字文）加密后传给服务。
可以看到，返回了正确的原始数据。

## 资料
[https://mp.weixin.qq.com/s/QEw9VxcikT7PVB17PMEt9g](https://mp.weixin.qq.com/s/QEw9VxcikT7PVB17PMEt9g) | 请收藏！这可能是目前最安全的数据加密传输解决方案
