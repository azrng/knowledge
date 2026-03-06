---
title: 脚本发布包
lang: zh-CN
date: 2023-03-05
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: jiaobenfabubao
slug: nfb8wfby8lb7psf4
docsId: '116756606'
---

## 概述
通过命令去发布nuget包

## 流程
参考文档：[https://learn.microsoft.com/zh-cn/nuget/nuget-org/publish-a-package](https://learn.microsoft.com/zh-cn/nuget/nuget-org/publish-a-package)

## 命令
```shell
dotnet nuget push SettingConfig.0.0.1.nupkg --api-key xxxxxx --source https://api.nuget.org/v3/index.json
```

将执行目录下的包一下子全部发布推送

```
dotnet pack -c Release
dotnet nuget push ./bin/Release/*.nupkg --skip-duplicate -k $NUGET_API_KEY -s https://api.nuget.org/v3/index.json
```

## 资料

搭建Nuget私服：https://www.cnblogs.com/easy5weikai/p/16245232.html
Nuget多项目批量打包上传服务器的简明教程：https://www.cnblogs.com/yilezhu/p/12591174.html

