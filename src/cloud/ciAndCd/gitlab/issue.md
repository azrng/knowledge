---
title: Issue
lang: zh-CN
date: 2024-09-08
publish: true
author: azrng
isOriginal: true
category:
  - cloud
tag:
  - gitlab
---

## `failed to write new configuration file xxx/config.lock`

请检查服务器磁盘是不是已经满了，请释放些磁盘空间

## `mkdir: cannot create directop ‘/home/gitlab-runner/builds/xxxxx’: Permission denied`

用户 gitlab-runner 没有构建目录的权限，加上权限即可，或切换至 root 用户，给该文件夹上权限。

