---
title: 简单通知服务
lang: zh-CN
date: 2023-07-09
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: jianchantongzhifuwu
slug: qigygp
docsId: '46757338'
---

## 开篇语
这两天看见有大佬分享使用钉钉和企业微信的机器人来做通知报警，然后我想到了我使用的另一个第三方软件**捷易快信**(可能大家都不知道这个东西，我也忘了我最开始是咋知道的)，该服务的优点是可以通过微信进行提醒，不过每条需要收费0.0080元，但是不要担心每月可能会赠送4元(因为我的就是)，对于我来说，够我玩了。

## 注册配置
访问网址：[http://jy.erpit.cn/login](http://jy.erpit.cn/login)
![image.png](/common/1623074832782-048ef9a4-e41c-4fbf-ad27-840cf1813f57.png)
我是直接使用的微信进行登录的，看个人爱好进行登录。
下面模拟一个服务器告警来做一个演示消息通知。
![image.png](/common/1623075258900-dda3a98c-8190-46e8-a30f-2dbfcc6d52f2.png)
> 注意看红框的内容，需要让消息接收方扫码关注该公众号


## 代码开发
查看接口文档
![image.png](/common/1623075610320-d9b28f44-5067-424a-b7b9-7abb160b5c26.png)
找到我们想要的群发消息接口
![image.png](/common/1623076386321-7f9bc26c-1136-44fc-958a-756b10641178.png)
> 也可以通过接口添加删除用户，支持给单独用户推送消息等。

下面开始编写代码，还在原来的项目上进行添加接口操作。
> 代码仓库地址：[https://gitee.com/AZRNG/my-example](https://gitee.com/AZRNG/my-example)  需要请自取

新建Model类，构建请求参数
```csharp
            var data = new SendMessageVm
            {
                App_key = "xxx",
                Secret = "xxx",
                Template_id = "xxx",
                Data = new SendMessDataVm
                {
                    First = new Details { Value = "服务告警测试" },
                    Keyword1 = new Details { Value = "告警服务器地址：上海" },
                    Keyword2 = new Details { Value = "原因：数据库连接不上" },
                    Keyword3 = new Details { Value = "当前服务：拼团活动" },
                    Remark = new Details { Value = $"当前时间{DateTime.Now:yy:MM:dd HH:mm:ss} 请工程师尽快查看！" }
                }
            };
```
> Model类有点长就不粘贴了，需要的话可以去下载源码查看。

通过post形式去请求该接口，本次示例为了方便起见，我直接使用了自己学习使用的Nuget包：**Common.RestSharpClient**
ConfigureServices注入服务
```csharp
services.AddHttpClientService();
```
控制器依赖注入服务
```csharp
        private readonly IHttpClientHelper _httpClientHelper;

        public InformController(IHttpClientHelper httpClientHelper)
        {
            _httpClientHelper = httpClientHelper;
        }
```
请求接口
```csharp
var result = await _httpClientHelper.PostAsync<string>("http://jy.erpit.cn/api/message/send", data).ConfigureAwait(false);
```
请求返回参数
![image.png](/common/1623077634012-53139f69-8c9d-4eb6-8187-1b620c0ab5af.png)
查看微信是否有消息通知
![image.png](/common/1623077689170-8326eccd-df62-4903-85db-b6384a8f522a.png)
本次示例到此结束。

## 结束
通过这次演示才发现还可以推荐用户，然后将得到您推荐用户消费金额的10%作为奖励，不过免费的已经够我用了，哈哈。我也想像那些大佬一样为社区做出一些贡献，为dotNet社区发展添砖加瓦，虽然我菜，但是我可以搬砖呀，搬砖也是做贡献的。

