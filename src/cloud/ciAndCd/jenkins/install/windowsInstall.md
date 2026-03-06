---
title: windows下docker安装jenkins
lang: zh-CN
date: 2022-09-17
publish: true
author: azrng
isOriginal: true
category:
  - cloud
tag:
  - 无
filename: windowsInstall
slug: bc4ris
docsId: '30440059'
---

## 部署脚本
```sql
docker run --rm -u root -d -p 8010:8080 -v /E/Test/jenkins/jenkins_home:/var/jenkins_home  jenkinsci/blueocean
```

参考文档：[https://www.jenkins.io/zh/doc/tutorials/build-a-java-app-with-maven/](https://www.jenkins.io/zh/doc/tutorials/build-a-java-app-with-maven/)
下载地址：[https://jenkins.io/download/](https://jenkins.io/download/)
