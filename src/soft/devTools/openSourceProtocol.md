---
title: 常见开源协议
lang: zh-CN
date: 2021-02-22
publish: true
author: azrng
isOriginal: false
category:
 - soft
tag:
 - 开源协议
---
> 文章来源自微信公众号【全球技术精选】

:::info

开源≠免费 

:::

------

## 不根据协议使用开源软件可能面临的风险

2003 年 Linksys 公司（同年 3 月被思科收购）推出 WRT-54G，这款路由器采用了基于 Linux 的固件，而 Linux 使用的是 GPL 开源协议，所以思科迫于压力，开放了 WRT-54G 的源码，这使得爱好者们知道了路由器固件的实现方式，进而促成了各种相关开源项目的繁荣，其中就包括 OpenWRT

## Android 和 Linux 内核 的关系

Android 使用了 Linux 内核，而 Linux 内核采用的是 GPL 的开源协议，所以 Google 修改了 Linux 内核，使得驱动程序可以在 Linux 内核的上层运行，这样上层的代码可以绕过GPL协议。这也使得所有 Android 上的开源驱动，不经过修改无法直接用在 Linux 内核上，造成了Linux 内核的分裂，所以 Linux 内核开发小组撤下了 Android 所贡献的代码

而非内核部分，Android 开源项目 (AOSP) 许可提到了：

> 对于用户空间（非内核）软件，相比其他许可（例如宽通用公共许可证 (LGPL)），我们更倾向于 Apache 2.0（以及 BSD 和 MIT 等类似许可）
> 我们为自己的代码首选 Apache 2.0

因为 AOSP 采用了 Apache 2.0 协议，所以任何人都可以基于 AOSP 开发自己的 Android 系统，而且不需要开源，国内的一些定制 Android 系统都是基于 AOSP，具体可以参考定制Android固件列表。虽然 AOSP 是开源的，但是 Google 移动服务 GMS（Google Mobile Service）是闭源的，GMS 中包括，如果手机厂商想要使用 GMS，就必须向 Google 支付授权费。GMS 包含了 Google 自家的App 和服务，除此之外海外 Android 平台发布的 App 严重依赖 GMS，没有 GMS 可能导致软件无法使用等问题，Google

## 常见开源协议

  可以参考这张很经典的图，来自 如何选择开源许可证？- 阮一峰

![图片](/common/202212101437349.webp)

下面由紧到松介绍一下几种常见的开源许可

### GPL

GNU GPL (GNU General Public License) 是很常见一个开源协议，允许使用者自由复制、自由分发、自由修改，也可以用来盈利，但是需要保证修改后的项目以及派生作品也使用 GPL 协议，这是因为 GPL 是属于Copyleft 授权方式



> Copyleft 条款源自自由软件运动，在自由软件许可证中增加 Copyleft 条款之后，该自由软件除了允许用户自由使用、散布、改作以外，Copyleft 条款更要求作者所许可的人对改作后的派生作品要使用相同许可证授予作者

### LGPL

由于 GPL 遵循 Copyleft，所以导致商业软件无法将 GPL 授权的软件集成在自己的软件里，所以就有了GNU LGPL (GNU Lesser General Public License) ，LGPL 允许商业软件通过类库引用的方式使用 LGPL 类库而不需要开源项目的代码，**如果是修改或者衍生，则修改的代码或衍生的代码都必须采用 LGPL 协议**

### MPL

MPL (Mozilla Public License) 由 Mozilla 基金会开发并维护，可以自由使用，出售，并可自由的重新发布，MPL 允许在其授权下的源代码与其他授权的文件进行混合，但 **MPL 授权下的代码文件必须保持 MPL 授权，并且保持开源**

### Apache Licence 2.0

非盈利开源组织 Apache 采用的协议，允许代码修改、再发布，但 **每修改一个文件都必须放置版权声明**

### BSD

BSD (Berkeley Software Distribution license) 允许使用者修改和重新发布代码，也允许使用或在 BSD 代码上开发商业软件发布和销售，所以商业公司比较喜欢选择 BSD 相关的项目，但是 **不允许使用开源代码的作者、机构名字、原来产品名做市场推广**

### MIT

MIT 是最宽松的开源协议之一，除了软件中必须包含许可声明外没有任何限制

## 开源协议的选择

GitHub 推出了一个“如何选择许可证”的网站 choosealicense.com

通过 GitHub 的 Advanced Search，可以根据开源协议进行搜索，这里例举一些使用对应开源许可的项目：

GPL : Linux、Ansible (自动化运维工具)、Clash、Telegram for Android

LGPL: Go Ethereum(以太坊的官方 Go 实现)

MPL: Consul

Apache Licence 2.0: TensorFlow、Kubernetes、TypeScript、Spring Framework、Spring Boot、OkHttp、MyBatis、Dubbo、TiDB

BSD: Homebrew、Flutter、Flask、Redis、Jupyter

MIT: .NET、Vue、React、Angular、Electron、jQuery、axios、Gin

## 参考资料

从“中国 GPL 诉讼第一案”聊聊开源软件的 license 许可证
开源路由器固件历史
Linksys
开源固件的前世今生
openwrt，ddwrt，tomato这些路由器固件是怎么开发出来的？- denglj的回答 - 知乎
最流行的开源协议什么，如何选择合适的开源协议？
五种开源协议(GPL,LGPL,BSD,MIT,Apache)
“十四五”软件业开源生态加快构建
再谈Android的许可证
Android - 维基百科
Android 通用内核
可以把Android理解成是Linux的一个发行版本吗？像ubuntu那样？
linux和Android的关系
Android 正在毁掉开源，受影响的不只是华为
Mozilla公共许可证
GNU通用公共许可证 - 维基百科
GNU宽通用公共许可证
Copyleft
【开源协议】BSD、Apache2、GPL、LGPL、MIT