---
title: NodeJs
lang: zh-CN
date: 2024-06-16
publish: true
author: azrng
isOriginal: true
category:
 - soft
tag:
 - web
---

## 概述

官网：[https://nodejs.org/en/](https://nodejs.org/en/)

## Issue

### FATAL ERROR: XXX - JavaScript heap out of memory

这意味着你的 Node.js 的 `max_old_space_size` 设置太小而无法构建此应用程序。 你可以尝试通过设置 `NODE_OPTIONS` 环境变量来增加 `max_old_space_size`。

`max_old_space_size` 以 MB 为单位，默认情况下 `max_old_space_size` 是机器内存大小的一半。该值可以大于你机器的实际内存大小。

- 对于小型项目，通常不会超过 2 GB (2048 MB)。
- 对于大型项目，通常不会超过 4 GB (4048 MB)
- 如果你在大型网站上同时启用博客功能和大量 Markdown 增强功能，通常不会超过 8 GB (8192 MB)



解决方法

1、如果你使用的是Github工作流，可以在你工作流中设置env

```yaml
- name: Build project
  env: 
    NODE_OPTIONS: --max_old_space_size=8192
  run: pnpm run build
```

2、如果你使用的是windows平台

在环境变量窗口中编辑系统级别的环境变量。新增配置：  
name: `NODE_OPTIONS`  
value: `--max-old-space-size=8192`  



记得在修改后，重新打开命令行工具生效。
