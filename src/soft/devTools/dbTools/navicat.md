---
title: Navicat
lang: zh-CN
date: 2023-07-22
publish: true
author: azrng
order: 001
category:
  - Navicat
tag:
  - dbTools
---
## 下载

* 企业版
  * 下载：[https://www.navicat.com.cn/download/navicat-premium](https://www.navicat.com.cn/download/navicat-premium)
* 精简版(可用于商业和非商业目的)
  * 对比企业版：[https://www.navicat.com.cn/products/navicat-premium-feature-matrix](https://www.navicat.com.cn/products/navicat-premium-feature-matrix)
  * 下载：[https://www.navicat.com.cn/download/navicat-premium-lite](https://www.navicat.com.cn/download/navicat-premium-lite)

## Issue

### 连接sqlserver报错

1、未发现数据源名称并且未指定默认驱动程序

![image.png](/common/1619574274261-d2044620-55b1-41cc-a657-59da802eed34.png)

原因是navicat没有安装sqlserver驱动，需要在navicat的安装目录下运行指定文件安装

![image.png](/common/1619574452414-c8cfd415-a207-459f-b710-bf0fd86ba9d4.png)

双击运行安装再次尝试连接即可。
