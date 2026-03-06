---
title: 开发隧道使用
lang: zh-CN
date: 2023-04-03
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: kaifasuidaoshiyong
slug: lyr8ad9t20n4h1eh
docsId: '120558849'
---

## 概述
首先开发隧道可以干嘛，引用官网的一句话叫做：可以在无法直接相互连接的计算机之间建立临时连接，创建一个 URL，使任何具有 Internet 连接的设备在` localhost `上运行时都可以连接到 ASP.NET Core 项目。

那么我们就可以在临时调试场景中，将当前的服务启动并生成一个外网的Url地址，让对方进行访问，不论是和第三方调试还是说和公司同事之间调试都是很方便的。

## 前提条件

- 安装了 ASP.NET 和 Web 开发工作负载的 Visual Studio 2022 版本 17.5 或更高版本。 需要登录到 Visual Studio 才能创建和使用开发隧道。 该功能在 Visual Studio for Mac 中不可用。
- 启用了开发隧道预览功能。 选择“工具”>“选项”>“环境”>“预览功能”>“为 Web 应用启用开发隧道”。

![image.png](/common/1680530669565-529e50b2-f94f-4e38-810a-eebceddbdaa5.png)

- ASP.NET Core 项目

## 操作

### 创建隧道
还以工具项目([https://gitee.com/AZRNG/my-example](https://gitee.com/AZRNG/my-example))进行举例，我们使用VS打开项目，然后再先创建隧道
![image.png](/common/1680531718729-85281a29-2408-4052-9427-92ba594934ad.png)
点击创建隧道后就设置配置，注意先登录VS
![image.png](/common/1680531786688-0c00dfc5-7f6c-4a55-bbf5-d5e67f6a7788.png)

- 设置隧道的名称
- 隧道类型
   - 临时：每次启动VS，临时隧道就会获得一个新的URL
   - 永久：每次启动VS，都是同一个URL
- Access：设置可以访问隧道的的身份验证，
   - 专用：只有创建的账户才可以访问
   - 组织：只有创建账户的同一组织下可以访问，个人账户的话效果与专用一致
   - 公共：不需要身份验证，外网都可以访问

点击确定后显示创建成功提示
![image.png](/common/1680531998250-1bac8020-59c1-45f5-9889-a1ed25cca185.png)

### 使用隧道
然后在启动项目的地方，选择使用隧道(默认会选中刚才创建的那个隧道)
![image.png](/common/1680532113360-860786c8-e8af-43b0-b2be-93e7325506df.png)
> 注意：一个项目或者解决方案可以有多个隧道，但一次只能有一个隧道处于活动(开启)状态。

如果不想开启隧道，在开发隧道里面选择无即可。

使用隧道后，我们启动项目，然后可以在输出窗口看到
![image.png](/common/1680532214897-4aac8fe7-0128-4120-bcfe-9d6af89d19f3.png)
后面这个地址就是新创建的URL，并且也会使用浏览器打开一个页面，该页面url为隧道的url而不是localhost URL，如图
![image.png](/common/1680532316470-f19bab78-06e0-48b6-8d09-9580e5052351.png)
选择继续后，我刚创建的这公共的隧道就可以使用了，只要项目继续在本地运行，这个url就可以被其他人在其他联网设备上任意访问了，通过swagger访问接口也可以正常使用
![image.png](/common/1680532618980-bb866e4c-7a14-4c1d-871a-1204ea838dde.png)

### 管理隧道
在开发隧道下可以点击显示开发隧道窗口来管理隧道
![image.png](/common/1680532692222-7aedd8c8-5b42-4f0c-8a4e-6bca84a0175e.png)
在这个界面我们可以查看、添加和删除隧道等
![image.png](/common/1680532740956-c9ef87a4-4fdd-49cd-93fc-a009d1aa8843.png)

## 参考资料
VS2022中使用开发隧道：[https://learn.microsoft.com/zh-cn/aspnet/core/test/dev-tunnels?view=aspnetcore-7.0](https://learn.microsoft.com/zh-cn/aspnet/core/test/dev-tunnels?view=aspnetcore-7.0)
