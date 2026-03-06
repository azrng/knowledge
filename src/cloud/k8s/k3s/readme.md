---
title: 说明
lang: zh-CN
date: 2022-10-11
publish: true
author: azrng
isOriginal: false
category:
  - cloud
tag:
  - k3s
---

## 概述

k3s是经过CNCF认证的由Rancher公司开发维护的一个**轻量级的 Kubernetes 发行版**，内核机制还是和 k8s 一样，但是剔除了很多外部依赖以及 K8s 的 alpha、beta 特性，同时改变了部署方式和运行方式，目的是轻量化 K8s，简单来说，`K3s 就是阉割版 K8s`，消耗资源极少。它主要用于**边缘计算、物联网**等场景。

官网文档：[https://docs.k3s.io/zh/](https://docs.k3s.io/zh/)

中文网站：[http://docs.rancher.cn/docs/k3s/quick-start/_index/](http://docs.rancher.cn/docs/k3s/quick-start/_index/)



K3s 具有以下特点：

1）安装简单，占用资源少，只需要512M内存就可以运行起来；
2）apiserver 、schedule 等组件全部简化，并以进程的形式运行在节点上，把程序都打包为单个二进制文件，每个程序只需要占用100M内存；
3）使用基于`sqlite3`的轻量级存储后端作为默认存储机制。同时支持使用etcd3、MySQL 和PostgreSQL作为存储机制；
4）默认使用 `local-path-provisioner` 提供本地存储卷；
5）默认安装了`Helm controller` 和 `Traefik Ingress controller`；
6）所有 Kubernetes control-plane 组件的操作都封装在单个二进制文件和进程中，使 K3s 具有自动化和管理包括证书分发在内的复杂集群操作的能力。
7）减少外部依赖，操作系统只需要安装较新的内核（centos7.6就可以，不需要升级内核）以及支持cgroup即可，k3s安装包已经包含了containerd、Flannel、CoreDNS，非常方便地一键式安装，不需要额外安装Docker、Flannel等组件。

## K3s架构

> 内容来自：[https://www.cnblogs.com/hujinzhong/p/15014487.html](https://www.cnblogs.com/hujinzhong/p/15014487.html)

### 单节点架构

![image-20210715093411379](/cloud/image-20210715093411379.png)

1）k3s server节点是运行k3s server命令的机器（裸机或者虚拟机），而k3s Agent 节点是运行k3s agent命令的机器。

2）单点架构只有一个控制节点（在 K3s 里叫做server node，相当于 K8s 的 master node），而且K3s的数据存储使用 sqlite 并内置在了控制节点上

3）在这种配置中，每个 agent 节点都注册到同一个 server 节点。K3s 用户可以通过调用server节点上的K3s API来操作Kubernetes资源。

### 高可用架构

![image-20210715093724991](/cloud/image-20210715093724991.png)

虽然单节点 k3s 集群可以满足各种用例，但对于 Kubernetes control-plane 的正常运行至关重要的环境，可以在高可用配置中运行 K3s。一个高可用 K3s 集群由以下几个部分组成：

1）**K3s Server 节点**：两个或者更多的server节点将为 Kubernetes API 提供服务并运行其他 control-plane 服务

2）**外部数据库**：外部数据存储（与单节点 k3s 设置中使用的嵌入式 SQLite 数据存储相反）

## 资源对象

### **Deployment**

- **定义**：Deployment 是用来描述应用的期望状态，包括应用的副本数、应用的镜像、更新策略等。
- **用途**：用于管理无状态应用的副本，确保应用始终以用户定义的状态运行。它允许你定义应用的副本数，并在需要时自动扩展或缩减副本数。
- 特点
  - 支持滚动更新，可以平滑地更新应用而不影响服务的可用性。
  - 可以设置健康检查，自动替换不健康的容器。
  - 提供版本回滚功能，如果新版本有问题，可以回滚到之前的版本。

### **Service**

- **定义**：Service 是定义一组Pods的逻辑集合，它为这些Pods提供一个统一的访问接口。
- **用途**：用于定义一组具有相同功能的Pods的访问策略，可以是内部访问（ClusterIP）或外部访问（NodePort、LoadBalancer）。
- 特点
  - 提供负载均衡，可以将请求分发到后端的多个Pods。
  - 支持服务发现，Pods不需要知道彼此的IP地址，通过Service名称就可以相互通信。
  - 支持端口映射，可以将Service的端口映射到Pods的不同端口。

#### Type类型

type类型几种 `Service` 类型：

1. **ClusterIP**：
   - 默认类型，只在 Kubernetes 集群内部可见。
   - 适合内部服务，如数据库，不需要从集群外部访问。
   - 提供了一个只对集群内部开放的稳定 IP 地址。
2. **NodePort**：
   - 通过每个节点上的端口对外提供服务。
   - 适合需要从集群外部访问，但不需要负载均衡的场景。
   - 每个节点都会开放一个静态端口（由 `NodePort` 指定），外部可以通过 `<NodeIP>:<NodePort>` 访问服务。
3. **LoadBalancer**（仅限云服务商环境）：
   - 在云服务商环境中，自动创建一个外部负载均衡器。
   - 适合需要从集群外部访问，并且需要负载均衡的场景。
4. **ExternalName**：
   - 通过 CNAME 记录将服务映射到外部服务。
   - 适合将流量路由到集群外部的服务。

#### RECLAIMPOLICY

`RECLAIMPOLICY` 是用于定义持久卷（PV）回收策略的字段，其状态和行为与 Kubernetes 中的 PV 回收策略一致。以下是常见的回收策略及其状态：

1. **Retain（保留）**
   - 当 PVC 被删除时，PV 不会被自动删除，而是进入 `Released` 状态。PV 中的数据会被保留，需要手动清理和释放。
   - 适用于存储重要数据的场景，因为数据不会自动丢失。
2. **Delete（删除）**
   - 当 PVC 被删除时，PV 也会被自动删除，同时后端存储资源也会被释放。
   - 适用于临时存储或不重要的数据，因为数据会自动丢失。
3. **Recycle（回收）**
   - 已在 Kubernetes v1.14 版本中被废弃。它会尝试清空 PV 中的数据，但不保证数据安全。



**在 StorageClass 中设置回收策略**：

```
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: example-sc
provisioner: k8s-sigs.io/nfs-subdir-external-provisioner
reclaimPolicy: Retain
```

这样动态创建的 PV 会使用指定的回收策略。

### 持久化存储

PV/PVC体系（生产推荐）

- **PV（持久卷）**：相当于存储资源的"不动产证"
- **PVC（持久卷声明）**：应用提交的"存储需求订单"



[Kubernetes数据持久化实战手册：七种武器守护你的数据资产](https://www.cnblogs.com/leojazz/p/18771735)

## 命令操作

### 服务操作

```shell
systemctl status k3s.service  # 查看k3s服务状态


# 重新启动k3s
systemctl restart k3s

# 查看节点状态
systemctl status  kubelet

journalctl -u k3s -f  # 查看实时输出日志
```

### 查看sc服务

```
kubectl get sc
```

排查默认的sc问题

```shell
kubectl get pods -n kube-system | grep local-path
kubectl describe pod local-path-provisioner-774c6665dc-5nvrd -n kube-system
```

### **Kubernetes**命令

K3s 内置了 kubectl，直接使用 kubectl 命令管理集群资源。

```shell
检查集群状态
kubectl get nodes
kubectl get pods -A
kubectl get svc -A # 查看所有的service信息
查看集群的详细信息
kubectl cluster-info
部署应用
kubectl apply -f <yaml-file>
删除资源
kubectl delete -f <yaml-file>
kubectl delete pod <pod-name>
进入 Pod 调试
kubectl exec -it <pod-name> -- /bin/bash
查看资源详情
kubectl describe pod <pod-name>
kubectl describe svc <svc-name>
```

### 关于镜像操作

```shell
# 查看已经拉取的镜像
sudo k3s ctr images ls

# 拉取镜像
sudo k3s ctr images pull <image-name>:<tag>

# 导入镜像
sudo k3s ctr images import myimage.tar
```

## 配置文件

### redis-master-deployment.yaml

这是一个Deployment（部署）的配置文件，用于定义和创建Redis主节点的副本集。Deployment是Kubernetes的资源对象，用于管理Pods的创建、更新和扩缩容等操作。在`redis-master-deployment.yaml`中，你可以定义Redis主节点的镜像、Pod的副本数、资源限制、环境变量等配置，并指定要使用的存储卷。

Deployment会创建并管理一组Pods，保证指定数量的Pods在任何时候都处于运行状态。如果Pods发生故障或被删除，Deployment会自动创建新的Pods以维持指定的副本数。因此，`redis-master-deployment.yaml`主要用于定义Redis主节点的部署规范。

### redis-master-service.yaml

`redis-master-service.yaml`：这是一个Service（服务）的配置文件，用于定义如何将Redis主节点暴露给其他应用程序或服务。Service是Kubernetes的资源对象，用于提供网络访问和负载均衡等功能。在`redis-master-service.yaml`中，你可以定义Service的类型、端口映射、选择器和负载均衡策略等配置。

Service为一组Pods提供了一个稳定的入口点，并通过Cluster IP或者LoadBalancer IP将流量分发到这组Pods上。通过Service，其他应用程序或服务可以通过Service的地址和端口访问Redis主节点。因此，`redis-master-service.yaml`主要用于定义Redis主节点的服务配置。

## 状态

pod状态：https://www.cnblogs.com/niuben/p/17427130.html

## 资料

https://mp.weixin.qq.com/s/3qBfk7CIyfjk8zXJPbycjg | K3S 入门级实战教程，和 K8S 有何不同？

https://www.cnblogs.com/hujinzhong/p/15014487.html k3s安装和部署
