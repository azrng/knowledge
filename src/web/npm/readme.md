---
title: 说明
lang: zh-CN
date: 2023-07-27
publish: true
author: azrng
isOriginal: true
category:
  - web
tag:
  - 无
filename: shuiming
slug: xa1i0b
docsId: '90490304'
---

## 概述
包管理器

包搜索地址：[https://www.npmjs.com/](https://www.npmjs.com/)

## 基本操作
```csharp
// 删除全部依赖包 
npm uninstall *
//删除指定的依赖包 
npm uninstall xxx
//删除全局的指定依赖(xxx为依赖名称) 
npm uninstall xxx -g

//清缓存  手动删除node_modules文件夹及文件夹里面的全部文件
npm cache clean --force
```

## 安装yarn
如果提示没有yarn，那么就需要安装
```csharp
npm install yarn@latest -g
```

## 修改源仓库地址
查询当前仓库地址
```csharp
npm config get registry
```
> 默认仓库地址是：[http://registry.npmjs.org](http://registry.npmjs.org)


方案一：直接安装cnpm 安装淘宝提供的cnpm，并更改服务器地址为淘宝的国内地址
```csharp
npm install -g cnpm --registry=https://registry.npm.taobao.org
```
以后安装直接采用cpm替代npm，例如原生npm命令为：npm install uniq --save，cnpm命令为：cnpm install uniq --save

方案二：替换npm仓库地址为淘宝镜像地址（推荐） 命令
```csharp
npm config set registry https://registry.npm.taobao.org
```
查看是否更改成功：npm config get registry，以后安装时，依然用npm命令，但是实际是从淘宝国内服务器下载的

还原官网镜像
```csharp
npm config set registry https://registry.npmjs.org
```

## Issue

### ERESOLVE unable to resolve dependency tree

使用--force或--legacy-peer-deps可解决这种情况。

```shell
--force 会无视冲突，并强制获取远端npm库资源，当有资源冲突时覆盖掉原先的版本。
--legacy-peer-deps标志是在v7中引入的，目的是绕过peerDependency自动安装；
它告诉PM 忽略项目中引入的各个modules之间的相同modules但不同版本的问题并继续安装，保证各个引入的依赖之间对自身所使用的不同版本modules共存。
```

建议用--legacy-peer-deps 比较保险一点,在终端输入

```shell
npm install --legacy-peer-deps
```

回车Enter即可解决

### listen EACCES: permission denied

判断是否是端口占用的问题导致的

```shell
netstat -ano| findstr 9001
```

发现并没有程序在使用这个端口，使用管理员再次执行命令

```shell
net stop winnat
net start winnat
```





