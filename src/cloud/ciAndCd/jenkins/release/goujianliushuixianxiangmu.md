---
title: 构建流水线项目
lang: zh-CN
date: 2023-07-02
publish: true
author: azrng
isOriginal: true
category:
  - cloud
tag:
  - 无
filename: goujianliushuixianxiangmu
slug: vg1nlg
docsId: '47890059'
---
> 实现目的：通过jenkins在服务器部署一个简单的.Net程序


## 介绍
一套运行在jenkins上的工作流框架，将原来独立的运行于单个或多个节点的任务连接起来，实现单个任务难以完成的复杂流程编排和可视化工作。

## 1. 登录并创建任务
输入任务名称并选择构建一个流水线任务
![image.png](/common/1624779022530-15ecf7ab-9d53-4143-994b-c12595f6a666.png)

## 2. 配置
插件
```bash
## 提供 Docker 支持（必装）
docker
Docker Pipeline
docker-build-step

## 可视化设计流水线脚本的工具（必装）
Blue Ocean

## 提供对 gitlab 支持，如果不使用可以不安装
gitlab

## 提供 Git 参数化和钩子触发构建支持，不需要可以不安装
Git Parameter
Generic Webhook Trigger
```

### 2.1 常规
设置描述和丢弃规则
![image.png](/common/1624789506154-692762cd-83a6-4f47-b1f9-e9a6f2b48cf5.png)

### 2.2 构建触发器
![image.png](/common/1624789522815-0a59afeb-84c3-4c70-be6e-5a115f275ad2.png)

### 2.3 流水线
![image.png](/common/1624789558767-aa971118-f1b9-42b5-a48d-f2bce25c54d9.png)

## 3. 开始构建 
点击保存后点击立即构建，就会在下面可以看到构建历史列表(出现蓝色代表构建成功，红色代表有问题)
![image.png](/common/1624777879835-1b27aa76-e67d-4c19-970d-6c6bc41d1da2.png)
构建完成后我们查看linux服务器是否已经有刚部署项目的容器
![image.png](/common/1624778314838-53227adc-9037-4752-8875-271f1b982d35.png)

### 2.3 查看输出
通过在指定的build ID下选择输出控制台查看详细信息
![image.png](/common/1624777991962-112f230d-92b1-4608-9489-cf644647412a.png)

### 2.4 默认工作目录
通过输出信息我们可以看到jenkins默认的工作目录是我们配置的目录
```bash
/var/jenkins_home/workspace/
```
![image.png](/common/1624778083657-db0fb380-43f7-47dd-89b9-5ccadd761e9f.png)

## 4. 预览效果
通过我们的shell配置，我们访问我们的swagger地址
```bash
http://192.168.1.14:8012/swagger/index.html
```
![image.png](/common/1624778166509-8aa42a2d-73e1-4e39-a170-c0fd964f5e1a.png)
调用接口发现可以查询到数据
![image.png](/common/1624778192446-1a2fafd9-1de3-401b-afde-cccf8036dbd5.png)
这点常见的错误就是连接数据库的地址配置有问题，如果这里有问题，可以通过命令去查看docker日志
```bash
docker logs 容器Id
```

## 5. 参考文档
> 基于Jenkins构建自动化发布镜像：[https://mp.weixin.qq.com/s/D404jNmlGO_ybpDQFehN-w](https://mp.weixin.qq.com/s/D404jNmlGO_ybpDQFehN-w)

