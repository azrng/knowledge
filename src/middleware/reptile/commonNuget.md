---
title: 常用组件
lang: zh-CN
date: 2022-06-19
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: changyongzujian
slug: tdr88p
docsId: '70054961'
---

## PhantomJS
PhantomJS：算是一个没有UI界面的浏览器，主要用来实现页面自动化测试，我们则利用它的页面解析功能，执行网站内容的抓取。
下载解压后将Bin文件夹中的phantomjs.exe文件复制到你爬虫项目下的任意文件夹。
下载地址：http://phantomjs.org/download.html
> 缺点：环境安装复杂，API调用不友好


## Selenium
是一个自动化测试工具，封装了很多WebDriver用于跟浏览器内核通讯，我用开发语言来调用它实现PhantomJS的自动化操作。它的下载页面里有很多东西，我们只需要Selenium Client，它支持了很多语言（C#、JAVA、Ruby、Python、NodeJS），按自己所学语言下载即可。
下载地址：http://docs.seleniumhq.org/download/
> 缺点：环境安装复杂，API调用不友好


## Shadowsocks
代理加密

