---
title: Git流程和DevOps流程
lang: zh-CN
date: 2023-09-23
publish: true
author: azrng
isOriginal: true
category:
  - cloud
tag:
  - 无
filename: gitliuchenghedevopsliucheng
slug: spv5yv
docsId: '32760686'
---

## 图文展示

![](/common/1615515154454-76614852-a92b-4560-b816-f498ad0fb749.png)

## 详细流程

### 1. 开发阶段

- 开发人员从develop切出feature分支，然后经过项目经理梳理本次需求后开发人员在本分支上进行开发，自测后合并到develop分支
- 此时会打出ImageTag:develop的镜像，通过**自动部署到集成测试环境(开发环境)**
- 开发人员应该关注集成测试环境

### 2. 测试阶段

- 集成测试环境验证后，可从develop切除release-1.0.0预发布分支，此时会打出ImageTag:release-1.0.0的镜像，**自动部署到alpha环境(测试环境)**
- 此处测试人员会重点花费时间测试，发现问题，开发人员迅速响应
- 从release-1.0.0分支切除bugfix分支，修复完后迅速合并回release-1.0.0分支，同样会自动化部署到alpha，测试人员快速验证。
- ---
- 这个阶段我们得到了一个趋近于稳定的release-1.0.0分支。

### 3. 部署阶段

- 从稳定的release-1.0.0分支打出对象的git tags:v1.0.0，此处会打出ImageTag:v1.0.0的镜像，需要**手动部署到prod(生产环境)**
- 测试人员线上测试，出现修复不了的问题，迅速使用之前的ImageTag回滚
- 上线之后若发现不能回退的bug，此时需要hotfix(热修复补丁)，还是从release-1.0.0切出hoxfix分支，修复完成后合并到release-1.0.0，alpha环境测试通过。打出git tags:v1.0.0-hofix1重新部署到prod
- ---
- 确认上线成功，将release-1.0.0分支合并回develop、master分支

### 4. 意外情况

- 如果开发阶段遇到有另外的需求过来，这个时候可以直接从master分支切出一个新分，这样子和上一个需求并不影响
> 备注：
> 集成测试采用docker-compose部署；alpha,prod是采用k8s部署；从上面的Gitlab  flow 知道：
> - Git develop分支、release-分支、tag标签、master分支会打出容器镜像,
> - Git develop分支代码(ImageTag:develop)(只)会自动部署集成测试环境，
> - Git release- 分支(ImageTag:release-1.0.0)(只)会自动部署到alpha,
> - Git tag标签(ImageTag:v1.0.0) 手动点击部署到prod


## 参考文档
> 参考文档：[https://mp.weixin.qq.com/s/JSbMFLeUQyvRELvg0WymWw](https://mp.weixin.qq.com/s/JSbMFLeUQyvRELvg0WymWw)




## 资料

### 主要分支

- **master**: 项目主版本分支，原则上，所有项目主版本都应发布在该分支上。一般地，在 test 分支上测试完毕的代码将会合并到 master 上，我们默认选择该分支进行最后的打包交付。
- **develop**: 开发分支，项目开发者将会在该分支进行日常开发。开发需要提测时，将 develop 分支的代码合并到 test 分支上，供测试团队进行测试。
- **test**：测试分支，测试团队用于进行服务测试的分支。
- **staging**： 预发布分支，在 test 代码正式合并到 master 之前，可以先合并到 staging 进行更长周期的系统测试，修复过程中碰到的问题。在公司内环境中，staging 分支也用于团队外的项目演示。

上述分支我们配置的 Gitlab CI 将会在 K8S 默认创建对应的线上应用环境，并且在分支代码更新时自动运行 CI 进行环境更新。
除了上述主要分支，我们还可以创建辅助分支用于日常开发工作。

### 辅助分支

- **feature**: 当开发者需要开发一个工期较长的特定功能，同时在这期间保证 develop 分支不受影响。开发者可以从 develop 分支衍生出 feature 分支进行特定功能特性的开发，其命名格式为 feature/特性名。当特性分支开发完毕后，开发者将该分支合并回 develop 中。
- **hotfix**：特定版本主发布分支 master 出现需要紧急修复的错误，而 develop / test 分支上已经有后续版本功能的代码时，可以在 master 分支上衍生出 hotfix 分支进行问题的紧急修复，修复完毕后 hotfix 分支上的代码变更将会同时合到 master 与 develop 上，保证问题的解决。
- **release**: 发布版本分支，与 staging 功能类似，代表预发布版本 （release candidate， rc）。同时在有多现场的项目定制化场景时可以代表所在项目现场的分支（命名格式为 release/现场名），用于迭代开发一些不应归于主版本的，项目定制化需求。该类分支视情况进行合并或保留。

### 基本开发分支策略
基于上述分支，我们可以规定一套基本的标准分支策略与开发流程：
![image2020-8-19 12_55_10.png](/common/1629814361653-ca0a42e4-49ad-4a74-a22f-2a8cbf436373.png)
如图所示，研发同学主要在 develop 分支上开发，如果有需要开发一个特定功能，可以在 develop 上分出一个 feature 分支（命名格式 “feaure/特性名”）
当开发完毕需要提测时，测试同学将 develop 分支合并到 test 进行测试，如果有问题就在 develop 分支修复并由测试同学持续合并到 test 分支，直到问题修复可以发版，发版后，测试同学将 test 分支合并到 master，并打上版本号 tag，CI 将自动化将项目打包，发布。
