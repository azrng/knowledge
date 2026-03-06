---
title: 说明
lang: zh-CN
date: 2023-09-24
publish: true
author: azrng
isOriginal: true
category:
  - cloud
tag:
  - 无
filename: readme
slug: owc9k1
docsId: '32687884'
---

## 描述
云原生从字面上的理解是跑在云服务器上，并且程序设计的时候就考虑到将来是运行在云环境中，要充分利用云资源的优点，比如云服务的弹性和分布式优势。

![](/common/1615424719425-bc1eda14-e3f2-42b2-a8c6-193ebcfab4c3.webp)

## 云计算
云计算是指通过互联网提供的计算服务。计算服务包括常见的 IT 基础结构，例如虚拟机、存储、数据库和网络。 云服务还扩充了传统的 IT 产品/服务，包括物联网 (IoT)、机器学习 (ML) 以及人工智能 (AI) 等

优点：不必像传统数据中心那样受限于物理基础结构的限制，可以实现快速扩容等，无需等待构建新的数据中心。


### 云计算的好处
高可用侧重于确保最大可用性，而不考虑可能发生的中断或者事件。

可伸缩性是指调整资源以满足需求的能力，如果遇到突然高峰流量，并且系统不堪重负，那么拥有缩放能力就意味着可以添加更多资源，以更好地处理增加的需求。另一个好处就是，如果需求下降，你就可以较少资源，从而降低成本。
缩放分为两种类型：垂直和水平。垂直缩放侧重于增加或者减少资源容量(增加更多CPU或者RAM)，水平缩放指增加或者减少资源数量(增加服务器或者容器)。

### 云模型
私有云：自己公司搭建的云服务器，只对自己公司开放
公有云：第三方云服务商生成、控制、维护，对大家都开放
混合云：私有云和公有云都使用。

### 可管理性
云管理
云管理与管理云资源有关。 在云中，可以：
根据需要自动缩放资源部署。
基于预配置模板部署资源，无需手动配置。
监视资源的运行状况，并自动替换失败的资源。
根据配置的指标接收自动警报，以便实时了解性能。


### 云中的管理
云中的管理介绍了如何管理云环境和资源。 可以管理以下项：
通过 Web 门户。
使用命令行接口。
使用 API。
使用 PowerShell。


云服务商提供性，从基础到完整依次顺序是：
基础结构即服务 (IaaS)
平台即服务 (PaaS)
软件即服务 (SaaS)


可靠性：指系统能够在发生故障后进行恢复，然后继续正常工作
可预测性：集中在性能可预测性(为客户提供积极体验所需的资源)和成本可预测性(跟踪资源使用情况、监视资源)上。


## 微服务
本质是把一块大饼分成若干个低耦合的小饼，每个小饼负责不同的业务模块，并且这个小饼仍然可以接着拆分服务，这样子每个小饼出了问题，其他的小饼仍然可以正常对外提供服务。

## DevOps
DevOps是一种思想、一组最佳实践、以及是一种文化。是CI/CD思想的延伸，CI/CD是DevOps的基础可行，如果没有CI/CD自动化的工具和流程，DevOps是没有意义的。
意思就是开发和运维不再是分开的两个团队，而是你中有我，我中有你的一个团队。

强调的是团队通过自动化工具的协作和高效的沟通来完成软件的生命周期管理，从而更快、更频繁地交付更稳定的软件。开发关注代码，运维关注部署，效率和质量都能得到提升。

> 参考文档：[https://www.jianshu.com/p/654505d42180](https://www.jianshu.com/p/654505d42180)


## 持续交付(CD)
在不影响用户使用服务的前提下频繁把新功能发布给用户使用，要做到这点还是比较难的

## 容器化
容器化的好处就是在于运维的时候不需要关心每个服务所使用的的技术栈了，每个服务都被无差别的封装在容器内，可以被无差别的管理和维护，现在比较流行的是docker和k8s。

所以也可以简单地把云原生理解为： 云原生=微服务+DevOps+持续交付+容器化


## 参考文档
云原生电子书：[https://docs.microsoft.com/zh-cn/dotnet/architecture/cloud-native/?WT.mc_id=DT-MVP-33797](https://docs.microsoft.com/zh-cn/dotnet/architecture/cloud-native/?WT.mc_id=DT-MVP-33797)
**.NET微服务电子书：**[https://docs.microsoft.com/zh-cn/dotnet/architecture/microservices/?WT.mc_id=DT-MVP-33797](https://docs.microsoft.com/zh-cn/dotnet/architecture/microservices/?WT.mc_id=DT-MVP-33797)
**无服务器应用程序电子书：**[https://docs.microsoft.com/zh-cn/dotnet/architecture/serverless/?WT.mc_id=DT-MVP-33797](https://docs.microsoft.com/zh-cn/dotnet/architecture/serverless/?WT.mc_id=DT-MVP-33797)
**DevOps：Docker应用程序生命周期电子书：**[https://docs.microsoft.com/zh-cn/dotnet/architecture/containerized-lifecycle/?WT.mc_id=DT-MVP-33797](https://docs.microsoft.com/zh-cn/dotnet/architecture/containerized-lifecycle/?WT.mc_id=DT-MVP-33797)

