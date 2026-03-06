---
title: 四种授权模式
lang: zh-CN
date: 2023-10-19
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: sichongshouquanmoshi
slug: fuaw2x
docsId: '32032863'
---

## 描述
OAuth2.0 定义了四种授权模式：
Implicit：简化模式；直接通过浏览器的链接跳转申请令牌。
Client Credentials：客户端凭证模式；该方法通常用于服务器之间的通讯；该模式仅发生在Client与Identity Server之间。
Resource Owner Password Credentials：密码模式
Authorization Code：授权码模式；（推荐）

### Client Credentials 客户端凭证模式
![image.png](/common/1614393600194-ec343716-6367-41fd-b3cf-36681a045873.png)
 
客户端凭证模式，是最简单的授权模式，因为授权的流程仅发生在Client与Identity Server之间。
该模式的适用场景为**服务器与服务器之间的通信**。比如对于一个电子商务网站，将订单和物流系统分拆为两个服务分别部署。订单系统需要访问物流系统进行物流信息的跟踪，物流系统需要访问订单系统的快递单号信息进行物流信息的定时刷新。而这两个系统之间服务的授权就可以通过这种模式来实现。
这种模式直接根据client的id和密钥即可获取token，无需用户参与
这种模式比较适合消费api的后端服务，比如拉取一组用户信息等
不支持refresh token，主要是没有必要
请求参数：请求头添加上 client_id和client_secret的basic编码，请求体添加grant_type必须设置为client_credentials
![](/common/1556768624749-6acd7f83-4f8e-4238-8aa9-abb45b0f8807.png)

#### 适用场景
适用于没有前端的命令行应用，即在命令行下请求令牌。

### Resource Owner Password Credentials  用户密码模式
![image.png](/common/1614393600248-ceaf7a9e-424e-4640-8663-4f5758747c9e.png)
Resource Owner其实就是User，所以可以直译为用户名密码模式。密码模式相较于客户端凭证模式，多了一个参与者，就是User。通过User的用户名和密码向Identity Server申请访问令牌。这种模式下要求客户端不得储存密码。但我们并不能确保客户端是否储存了密码，所以该模式仅适用于受信任的客户端。否则会发生密码泄露的危险。**该模式不推荐使用**。
支持refresh token
使用client_id和client_secret以及用户名密码直接获取秘钥
请求地址： [http://localhost:7010/uaa/oauth/token?grant_type=password&username=lixx&password=dw123456](http://localhost:7010/uaa/oauth/token?grant_type=password&username=lixx&password=dw123456)

#### 适用场景
高度信任某个应用，允许用户把用户名和密码直接告诉应用。该应用直接使用你的密码，申请令牌。
![](/common/1556777535572-9245023d-4385-4073-8aad-cc8af2a9137a.png)

### Authorization Code 授权码模式
![image.png](/common/1614393600299-07be37d9-5cc5-45f7-8bea-d7f76a4a6aab.png)
授权码模式是一种混合模式，是目前功能最完整、流程最严密的授权模式。它主要分为两大步骤：认证和授权。 其流程为：
用户访问客户端，客户端将用户导向Identity Server。
用户填写凭证信息向客户端授权，认证服务器根据客户端指定的重定向URI，并返回一个【Authorization Code】给客户端。
客户端根据【Authorization Code】向Identity Server申请【Access Token】
支持refresh token
请求地址：http://localhost:7010/uaa/oauth/authorize?response_type=code&client_id=wx_takeout_client_id&redirect_uri=http://localhost:7010/uaa/login

实际调用示例：
```html
想去 https://resource.com/login  页面，然后导向授权服务器

查看是否登录
https://identityserver/connect/authorize?client_id=chat_js&response_type=code&scope=openid profile offline_access chat file&state=abcd123&ui_locales=zh-CN&redirect_uri=https://resource.com/login

然后没有登录跳转回登录页面
https://identityserver/Account/Login?ReturnUrl=/sso/connect/authorize/callback?client_id=chat_js&response_type=code&scope=openid%20profile%20offline_access%20chat%20file&state=abcd123&ui_locales=zh-CN&redirect_uri=https%3A%2F%2Fresource.com%2Flogin

授权服务器的登录页面进行登录
https://identityserver/Account/Login
传递帐号密码参数
Username: zyp
Password: 111111
RememberLogin: true
ReturnUrl: /sso/connect/authorize/callback?client_id=chat_js&response_type=code&scope=openid profile offline_access chat file&state=abcd123&ui_locales=zh-CN&redirect_uri=https://resource.com/login
__requestVerificationToken: CfDJ8F7esKHWmrdInMK78eNjD1CQZqmU6C4NRKcV7ATKMSDfWd74GHqIUfWu6_ug6XAKJjnfStQpgwQdTtT3wqSGKF46mhmc8MqkDH8sxB52N95QctZJE4mD8qbn8ROywv5GynlChe6Lw7WeT0gFncolKUU

然后登录成功回调到登录时候默认传过去的ReturnUrl
https://identityserver/connect/authorize/callback?client_id=chat_js&response_type=code&scope=openid profile offline_access chat file&state=abcd123&ui_locales=zh-CN&redirect_uri=https://resource.com/login

然后刚一个地址重定向redirect_uri地址并且传递过来code(这个地址是资源服务器地址)
https://resource.com/login?code=8d0af1cf5e6c01850a0cbbacb2b6fe59b179f7b3a91156fdf22f802a3ff09d67&scope=openid profile chat file offline_access&state=abcd123&session_state=r27DLN-X_qYqkn2yE2jKvFOq9Au4OqMWEhD4chvaaGM.b18321377b9fec9aba4d93ab5ad8e90e&ui_locales=zh-CN

在资源服务器地址根据获取token
https://identityserver/connect/token?t=1619685184590
post:
client_id: chat_js
grant_type: authorization_code
code: 8d0af1cf5e6c01850a0cbbacb2b6fe59b179f7b3a91156fdf22f802a3ff09d67
redirect_uri: https://resource.com/login

最后返回token
```

#### 适用场景
适用于那些有后端的 Web 应用。授权码通过前端传送，令牌则是储存在后端，而且所有与资源服务器的通信都在后端完成。这样的前后端分离，可以避免令牌泄漏。

### Implicit  简化模式
![image.png](/common/1614393600298-51685a56-9985-4624-a8b5-3ca1ef44d2b4.png)
简化模式是相对于授权码模式而言的。其不再需要【Client】的参与，所有的认证和授权都是通过浏览器来完成的。
implicit模式（隐式模式）和授权码模式(authorization_code)访问差不多，相比之下，少了一步获取code的步骤，而是直接获取token
请求： 用浏览器（此时同授权码模式，浏览器能跳转到登录页面，postman不行）
[http://localhost:7010/uaa/oauth/authorize?response_type=token&client_id=wx_takeout_client_id&redirect_uri=http://localhost:7010/uaa/login](http://localhost:7010/uaa/oauth/authorize?response_type=token&client_id=wx_takeout_client_id&redirect_uri=http://localhost:7010/uaa/login)

#### 适用场景
对于那些只有前端的应用，允许直接向前端颁发令牌，这种方式没有授权码这个中间步骤，所以称为简化模式。

## 参考文档
OAuth2.0解释：[http://www.ruanyifeng.com/blog/2019/04/oauth_design.html](http://www.ruanyifeng.com/blog/2019/04/oauth_design.html)
OAuth 2.0四种方式：[http://www.ruanyifeng.com/blog/2019/04/oauth-grant-types.html](http://www.ruanyifeng.com/blog/2019/04/oauth-grant-types.html)
