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
slug: tn9zav
docsId: '32033936'
---

## 概述
Kubernetes 是一种可移植且可扩展的开放源代码平台，用于管理和编排容器化工作负载。

- 容器的自行修复(声明性配置管理)。 例如，重启失败的容器或替换容器。
- 根据需要动态地纵向扩展或纵向缩减部署的容器计数。
- 容器的自动滚动更新和回滚。
- 管理存储。
- 管理网络流量。
- 存储并管理敏感信息，如用户名和密码。

## 管理工具

k8slens：https://k8slens.dev/

## 组件

[https://mp.weixin.qq.com/s/wVJ0adSL1GuQIz8Q98_PaQ](https://mp.weixin.qq.com/s/wVJ0adSL1GuQIz8Q98_PaQ) | 使用 C# 开发 Kubernetes 组件，获取集群资源信息
本地保存地址：开发\docs\使用 C## 开发 Kubernetes 组件，获取集群资源信息.png

## 操作

### 创建删除示例
```yaml
-- 根据文件去创建实例
kubectl apply -f backend-deploy.yml

-- 删除实例
kubectl delete pod pizzafrontend-5b6cc765c4-hjpx4
```
> 注意：当你删除实例的时候，k8s会自动重启出现故障的pod，这是因为k8s支持声明式配置管理，你在配置文件中定义的内容会不惜一切代码进行保留。


### 缩放实例
```yaml
-- 将服务deployment/pizzabackend缩放为五个实例
kubectl scale --replicas=5 deployment/pizzabackend

-- 验证五个实例是否启动并正常
kubectl get pods

-- 减少实例数
kubectl scale --replicas=1 deployment/pizzabackend
```

## 资料

Kubernetes 入门：[https://k8s.whuanle.cn](https://k8s.whuanle.cn)

k8s系列教程：https://www.cnblogs.com/edisonchou/tag/K8S/
