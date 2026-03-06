---
title: k9s
lang: zh-CN
date: 2023-09-02
publish: true
author: Abin Simon
isOriginal: false
category:
  - csharp
tag:
  - 日志
  - k9s
---

## 概述

K9s 是一个用于管理 Kubernetes 集群的命令行工具，提供了交互式终端用户界面（TUI），方便用户查看和操作 Kubernetes 资源

通过 K9s，用户可以实时监控集群中各种资源（如 Pod、Deployment、Service 等）的状态变化，以直观的方式呈现信息，快速了解集群的运行情况

## 操作命令

k9s提供操作k8s集群的cli界面

```shell
# 启动
k9s
# 帮助
?

# 切换namespace
:ns 切换到namespace界面
上下键选择需要切换的ns
也可使用'/'搜索关键字

之前切换过的ns会在上方显示快捷键,之后使用
0 1 2等数字键切换

# 切换pod deploy svc ing等resource
:po  -> pod
:no  -> node
:dp  -> deployment
:svc -> service
:ing -> ingress
# 查看resource的别名
:alias 或 ctrl + a
# 查看日志
l  当前container
shift + l 之前的container
# 查看describe信息
d
# 进入容器执行命令
s
# 重启容器
ctrl + k 或
ctrl + d -> tab -> tab -> enter
# 查找
/需要查看的文字

# 编辑
e

# 退出
esc 退出当前界面,或清楚筛选
p   返回上一次的界面
ctrl + c 退出整个k9s
:wq 退出编辑界面
```

## 安装

从 [K9s 官方 GitHub 发布页面](https://github.com/derailed/k9s/releases)下载适合 Linux 的 K9s 压缩包，例如 `k9s_Linux_amd64.tar.gz`，然后解压并放置文件

```shell
tar -xzf k9s_Linux_amd64.tar.gz
sudo mv k9s /usr/local/bin/
sudo chmod +x /usr/local/bin/k9s
```

启动

```shell
k9s
```

