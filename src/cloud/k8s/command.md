---
title: 常用命令
lang: zh-CN
date: 2024-09-18
publish: true
author: azrng
isOriginal: false
category:
  - cloud
tag:
  - k8s
  - k3s
---

## 概述

命令大全：[https://jimmysong.io/kubernetes-handbook/guide/kubectl-cheatsheet.html](https://jimmysong.io/kubernetes-handbook/guide/kubectl-cheatsheet.html)

## 系统操作

```shell
# 开启服务
systemctl start k3s

# 查询当前节点镜像
systemctl start k3s

#查询当前节点容器状态
sudo crictl ps

# 重启
sudo systemctl restart k3s
```

## 服务操作

```shell
# 查询节点服务
sudo kubectl get pods
sudo kubectl get pods -A
sudo kubectl get -owide -A

# 查询当前节点所有服务
sudo kubectl get pods --all-namespaces

# 查看节点下某一个命令空间的pod
kubectl get pods -n kubernetes-dashboard

# 查看pod所在节点
kubectl get pods --all-namespaces -o wide

# 查看服务信息：运行状态以及映射端口
sudo kubectl get svc
# 查看特定的服务
sudo kubectl get svc my-service

# 执行
sudo kubectl apply -f master-deployment.yaml
```

## 重启pod

```shell
# 重启pod，service【在修改yaml文件后，可执行】
kubectl replace --force -f /opt/yaml/netcore/apricot/apricots.yaml

# 重启etcd
systemctl  restart etcd

# 重启kube-apiserver
systemctl restart kube-apiserver

# 重启 kube-controller-manager
systemctl status kube-controller-manager

# 重启 kube-schduler
systemctl status kube-schduler
```

## 删除pod

```shell
# 删除pod
sudo kubectl delete pod  pod-name
# 根据yaml文件删除pod
sudo kubectl delete -f <文件名称>
sudo kubectl delete -f pgsql.yaml

# 强制删除
sudo kubectl delete pod <pod-name> --force

# 删除所有pod
sudo kubectl delete pods --all --force

# 使用标签选择器删除
sudo kubectl delete pods -l app=my-app
```

## 查看日志

```shell
# 查看pod信息
sudo kubectl get pods

# 查询指定pod详细信息
sudo kubectl describe pod pod-name

# 查看异常的pod节点
sudo kubectl get pods -n <名称空间> | grep -v Running

# 查看指定pod的日志
kubectl logs <pod_name>
kubectl logs -f <pod_name> #类似tail -f的方式查看(tail -f 实时查看日志文件 tail -f 日志文件log)
```
