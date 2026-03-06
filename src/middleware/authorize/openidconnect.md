---
title: OpenId Connect
lang: zh-CN
date: 2023-06-24
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: openidconnect
slug: crzggo
docsId: '32032079'
---

## 描述
OpenID Connect的简称是OIDC，OIDC=(Identity,Authentication)+OAuth 2.0。它在OAuth 2.0上构建了一个身份标识层，是一个基于OAuth 2.0协议的**身份认证标准协议**。JWT是作为它的底层实现支持。
OpenID Connect允许开发者验证跨网站和应用的用户，而无需拥有和管理密码文件，允许所有类型的客户,包括基于浏览器的JavaScript和本机移动应用程序,启动登录流动和接收可验证断言对登录用户的身份。
> OAuth2是一个授权协议，它无法提供完善的身份认证功能，OIDC使用OAuth2的授权服务器来为第三方客户端提供用户的身份认证，并把对应的身份认证信息传递给客户端，且可以适用于各种类型的客户端（比如服务端应用，移动APP，JS应用），且完全兼容OAuth2

（身份认证）+OAuth2.0(授权)=OpenID Connect

## 流程图 
![image.png](/common/1614393505851-fa41e35a-e1fe-41d1-a258-8b81669d8d82.png)

## OAuth和OpenID
> OpenID 是一个以用户为中心的数字身份识别框架，它具有开放、分散性。OpenID 的创建基于这样一个概念：我们可以通过 URI （又叫 URL 或网站地址）来认证一个网站的唯一身份，同理，我们也可以通过这种方式来作为用户的身份认证。

OpenID：是Authentication，认证，对用户的身份进行认证，判断用户身份是否有效，也就是让网站知道“ni 就是你所声称的那个用户”。侧重证明用户是谁？
OAuth：是Authorization，授权，是在已经知道用户身份合法的情况下，经用户授权来允许某些操作，也就是让网站知道“你能被允许做哪些事情。”侧重用户能做什么？

OpenID Connect是认证和授权的结合。
(身份验证)+ OAuth 2.0 = OpenID Connect (OIDC) = ( Authentication + Authorization + OAuth2.0)

## 其他组件

### SimpleIdServer

官网：[https://simpleidserver.com/](https://simpleidserver.com/)



推荐一个比 Identity Server 4 更优秀的认证授权开源项目:https://mp.weixin.qq.com/s/4GXpoGiHbsJlM5gbBxOPYw

## 资料

官网：[https://openid.net/certification/](https://openid.net/certification/) 
