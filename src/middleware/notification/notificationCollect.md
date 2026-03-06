---
title: 其他通知服务
lang: zh-CN
date: 2022-12-01
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: jitatongzhifuwu
slug: qxp9cn
docsId: '46957557'
---

## 开篇语
之前写了一个关于捷易快信做通知服务的文章，然后收到了朋友的评论。下面我将简单了解一下朋友们推荐的服务。

## 通知组件

### EasyNotice

EasyNotice 是一个基于 .NET 开源的消息通知组件，支持多种通知方式，包括邮件通知、钉钉、飞书、企业微信。

仓库地址：https://github.com/Bryan-Cyf/EasyNotice

## Server酱

### 介绍
分为旧版本(依赖模板消息)、新版本(Turbo版)，作者推荐使用新版，因为支持多通道和客户端。

|  | 标准版 | Turbo版 |
| --- | --- | --- |
| 收费方式 | 免费 | 少量免费额度+捐赠提升额度 |
| API | 发送接口 | 发送接口和状态查询接口 |
| 登入方式 | GitHub 登入 | 微信扫码登入 |
| 通道 | 服务号 | 多通道（微信、客户端、群机器人、邮件和短信） |
| 推送内容保留时间 | 48小时 | 7天 |
| 每天 API 最大请求次数 | 500 | 1000 |

> 表格来源：[https://sct.ftqq.com/](https://sct.ftqq.com/)


### 推送渠道

- 企业微信应用消息：无需安装企业微信客户端，可在微信中直接收到消息，内容显全文
- 手机客户端：Andorid有官方测试版，iOS 可用 Bark 通道
- 群机器人：企业微信、钉钉、飞书
- 邮件和短信：通过自定义通道调用云服务实现
- 微信服务号和测试号：依赖模板消息接口（微信可能会在2021年4月底下线该接口，不建议使用）
> 个人看法：像我这种轻度自己使用的，考虑到资金缘故，能考虑的渠道也就是企业微信和钉钉了


### 使用方法
1.微信扫码登入
网址：[https://sct.ftqq.com/login](https://sct.ftqq.com/login)
2.设置消息通道
![image.png](/common/1623598793265-6d3838d7-4653-4e2a-ab98-0a434da195bf.png)
> 因为我没有企业微信等，所以我的可选项就只有下载APP了

![image.png](/common/1623598874827-24950566-68f1-4cda-ab15-6bec541c328d.png)
3.使用在线工具测试发消息
![image.png](/common/1623598956713-cf82eb15-438e-4f9e-a047-7b5dbb51ef59.png)
也可以直接调用api进行发送消息
4.查看手机收到的消息
![image.png](/common/1623599072253-e4d09128-c6f3-439f-8f3c-2615e6e02fee.png)
在软件保持后台运行的情况下，可以通过通知栏提醒收到消息。

## **WxPusher**

### 介绍
(微信推送服务)是一个使用微信公众号作为通道的，实时信息推送平台，你可以通过调用API的方式，把信息推送到微信上，无需安装额外的软件，即可做到信息实时通知。

#### 系统相关数据限制

- 消息发送频率没有做限制，但是请控制在合理范围内。不排除后期做频率限制的可能，但是这样做也是为了更好的体验，只要在合理范围内，不会受到影响；
- 消息发送，必须合法合规，发送违规违法欺诈等等非正常消息，可能被封号；
- WxPusher推送的是实时消息，时效性比较强，过期以后消息也就没有价值了，目前WxPusher会为你保留7天的数据 ，7天以后不再提供可靠性保证，会不定时清理历史消息；
- 单条消息的数据长度(字符数)限制是：content<40000;summary<100;url<400;
- 单条消息最大发送UID的数量<2000，单条消息最大发送topicIds的数量<5;
> 说明来源自：[https://wxpusher.dingliqc.com/docs/#/?id=%e9%99%90%e5%88%b6%e8%af%b4%e6%98%8e](https://wxpusher.dingliqc.com/docs/#/?id=%e9%99%90%e5%88%b6%e8%af%b4%e6%98%8e)


### 推送渠道
扫码管理微信公众号进行接收消息

### 使用方法
通过调用API接口实时推送消息到微信公众号发送给用户。
> 具体操作查看文档：[https://wxpusher.zjiecode.com/docs/#/?id=%e4%bb%8b%e7%bb%8d](https://wxpusher.zjiecode.com/docs/#/?id=%e4%bb%8b%e7%bb%8d)


## PushPlus

### 介绍
pushplus集成了微信、短信、邮件等实时信息推送平台
> 官网地址：[http://pushplus.hxtrip.com/](http://pushplus.hxtrip.com/)


#### 成本
本身是一项免费的服务，并且会免费提供下去。 服务本身的成本目前在以下几方面：

- 微信公众号认证费
- 域名费用
- 服务器和数据库费用
- https证书费用
- 人员开发费用
> 来自：[http://pushplus.hxtrip.com/doc/#成本](http://pushplus.hxtrip.com/doc/#成本)


### 推送渠道
微信、短信、邮件

### 使用方法
通过调用api接口进行消息推送
推送结果示例
![image.png](/common/1623600380900-289379cd-b51a-485c-b133-b400096265a6.png)

### 扩展应用
包含Jenkins插件、阿里云监控、华硕路由器插件

## Bark

### 介绍
Bark 是一款 iOS 应用程序，可让您将自定义通知推送到您的 iPhone。
iPhone：下载客户端使用。安卓：使用大佬开发的一个谷歌插件使用。
> GitHub：[https://github.com/Finb/Bark](https://github.com/Finb/Bark)


### 使用方法
Bark 分为客户端和服务端。其中，客户端用于接收消息；服务端用于推送消息。
网上有老哥给出了部署方案：[https://www.jianshu.com/p/dacb3c4a7c9a](https://www.jianshu.com/p/dacb3c4a7c9a)

## 结语
根据自己的需求选择最合适的服务。
