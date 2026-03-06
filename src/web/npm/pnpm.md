---
title: Pnpm
lang: zh-CN
date: 2023-08-01
publish: true
author: azrng
isOriginal: true
category:
  - web
tag:
  - 无
filename: pnpm
slug: nm0bs4c17dpb42x2
docsId: '117071391'
---

## 操作

### 安装
```shell
# 安装
npm install -g pnpm

# 升级版本
npm update -g pnpm

# 查看版本
pnpm -v

# 设置镜像源
pnpm config set registry https://registry.npm.taobao.org/
# 后来变更地址了
pnpm config set registry https://registry.npmmirror.com

# 检查镜像源
pnpm config get registry
```
### 安装包
```csharp
pnpm install 包  // 
pnpm i 包
pnpm add 包    // -S  默认写入dependencies
pnpm add -D    // -D devDependencies
pnpm add -g    // 全局安装
```

### 移除包
```csharp
pnpm remove 包                            //移除包
pnpm remove 包 --global                   //移除全局包
```

### 更新包
```csharp
pnpm up                //更新所有依赖项
pnpm upgrade 包        //更新包
pnpm upgrade 包 --global   //更新全局包

```
