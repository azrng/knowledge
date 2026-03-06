---
title: 常见错误
lang: zh-CN
date: 2023-09-17
publish: true
author: azrng
isOriginal: true
category:
  - otherLanguage
tag:
  - 无
filename: changjiancuowu
slug: imb0b3
docsId: '30225942'
---

## No module named pip
错误：
ModuleNotFoundError: No module named ‘pip’

 
通过运行下面简单的cmd命令行语句来修复：
python -m ensurepip
python -m pip install --upgrade pip
 

## Preparing wheel metadata
安装pyinstaller失败，Preparing wheel metadata ... error

错误原因是：
先安装wheel
```csharp
pip install wheel -i https://mirrors.aliyun.com/pypi/simple/
```
然后再次安装
```csharp

pip install Pyinstaller -I https://mirrors.aliyun.com/pypi/simple/
```
