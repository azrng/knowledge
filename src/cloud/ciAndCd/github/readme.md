---
title: 说明
lang: zh-CN
date: 2023-09-08
publish: true
author: azrng
isOriginal: true
category:
  - cloud
tag:
  - 无
filename: readme
slug: quygh0
docsId: '92758257'
---

## 概述
通过github的Action可以实现在提交代码的时候，自动将程序部署到指定的服务器上(公网服务器)。

## 服务器配置
在指定的仓库中，选择Settings=>Secrets=>Actions

![image.png](/common/1662964788789-be6dab44-c8d3-47e5-92be-8b39ffad23f6.png)

点击右上的新建就可以创建想要保存的隐私配置信息

![image.png](/common/1662964862458-55292112-dc41-4232-96cb-361d761de2f1.png)

这里我保存了一下服务器的地址、账号、密码信息

![image.png](/common/1662965030882-327a67e5-f6cb-492e-a62a-7e7430ddf13b.png)

## 部署
[Ubuntu部署.Net以及配置守护进程](https://www.yuque.com/docs/share/e1b98cea-cd77-4dcb-8f5b-a0a755b8e1bd?view=doc_embed)

## 部署脚本选择
在仓库点击Action选项卡可以工作流配置，这里有推荐写法。
![image.png](/common/1662965868627-6edb9591-e487-40e2-a526-bdf87583fea6.png)
也可以自己编写自定义的执行脚本。

脚本文档：[https://docs.github.com/cn/pages/getting-started-with-github-pages/creating-a-github-pages-site](https://docs.github.com/cn/pages/getting-started-with-github-pages/creating-a-github-pages-site)

### 发布并推送到远程服务器
将打包后的程序发布到远程服务器
```csharp
name: ASP.NET Core 6.0 Example build and deploy
  
on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

jobs:

  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3
    - name: Setup .NET
      uses: actions/setup-dotnet@v2
      with:
        dotnet-version: 6.0.x
        
    - name: Restore dependencies
      run: dotnet restore
      
    - name: Build package
      run: dotnet publish ./NetByDocker -c Release -r linux-x64 --self-contained false -o deploy
      
    - name: Upload package
      uses: garygrossgarten/github-action-scp@v0.7.3
      with:
        host: ${{ secrets.REMOTE_HOST }}
        username: ${{ secrets.REMOTE_USER }}
        password: ${{ secrets.REMOTE_PWD }}
        port: 22
        local: /home/runner/work/my-example/my-example/deploy/
        remote: "/home/project/example/"
```
local：本地地址，可以去Build package最后结尾查看。
remote：远程存放的地址

garygrossgarten配置的用法可以查看：[https://github.com/garygrossgarten/github-action-scp](https://github.com/garygrossgarten/github-action-scp)

容易出现的问题：

- 该工作流里面包含远程登录会被服务器识别为异常登录(凭据窃取)
- 那个本地地址容易写错，最后发现直接去那个Build步骤下查看

反正最终还好是部署成功了
![image.png](/common/1662969378474-f911182d-c2eb-4481-a9b8-1af708062845.png)

## 资料
GitHub docs：[https://docs.github.com/cn/actions/quickstart](https://docs.github.com/cn/actions/quickstart)
[https://blog.questionlearn.cn/archives/github-cicd](https://blog.questionlearn.cn/archives/github-cicd) | Github CICD自动化部署
