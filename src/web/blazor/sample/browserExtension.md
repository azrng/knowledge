---
title: Blazor编写浏览器插件
lang: zh-CN
date: 2024-07-06
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 插件
---
## 概述

一个创建使用Blazor去创建浏览器插件的模板

仓库网址：[https://github.com/mingyaulee/Blazor.BrowserExtension](https://github.com/mingyaulee/Blazor.BrowserExtension)

文档网站：[https://mingyaulee.github.io/Blazor.BrowserExtension](https://mingyaulee.github.io/Blazor.BrowserExtension)

## 安装

使用cli命令去安装模板

```
dotnet new install Blazor.BrowserExtension.Template
```

## 快速上手

新建项目，选择刚才的模板，新建后可以看到wwwroot目录下的mainfest.json文件，该文件存储的是插件的元信息

```json
{
  "manifest_version": 3,
  "name": "插件名称",
  "description": "插件描述",
  "version": "0.1",
  "background": {
    "service_worker": "content/BackgroundWorker.js",
    "type": "module"
  },
  "action": { // 插件点击弹框页面
    "default_popup": "popup.html"
  },
  "options_ui": { // 插件扩展选项
    "page": "options.html",
    "open_in_tab": true
  },
  "content_security_policy": {
    "extension_pages": "script-src 'self' 'wasm-unsafe-eval'; object-src 'self'"
  },
  "web_accessible_resources": [
    {
      "resources": [
        "framework/*",
        "content/*"
      ],
      "matches": [ "<all_urls>" ]
    }
  ]
}
```

