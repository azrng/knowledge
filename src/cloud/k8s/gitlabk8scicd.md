---
title: Gitlab和K8S自动化发布
lang: zh-CN
date: 2023-09-24
publish: true
author: azrng
isOriginal: true
category:
  - cloud
tag:
  - 无
filename: gitlabhek8szidonghuafabu
slug: ye0rclzm91y0wl9o
docsId: '110427714'
---

## 前置条件
- 一台Linux服务器，安装好Docker
- 一个K8s集群环境
- 一个Gitlab仓库，可以自己搭建或者直接使用官方仓库(中文版gitlab:[https://jihulab.com/](https://jihulab.com/))
- 一个镜像仓库，用于存储docker镜像，这里我用的华为的镜像仓库 （[https://www.huaweicloud.com/product/swr.html](https://www.huaweicloud.com/product/swr.html)）
- 本文的操作基于[https://jihulab.com/](https://jihulab.com/) 仓库进行

## 部署Gitlab-Runner

### 安装
gitlab-runner 安装参考 [https://docs.gitlab.com/runner/install/](https://docs.gitlab.com/runner/install/)
或者在 gitlab仓库的群组左侧菜单** CI/CD--Runner **页面点击"注册一个群组runner"按钮，里面有快速安装介绍

### 注册
**概述**
注册的目的是将本地安装的gitlab-runner和gitlab仓库建立连接，以便代码变动时gitlab-runner会收到通知
**快速注册命令**：
`sudo gitlab-runner register --url https://jihulab.com/ --registration-token {yourtoken}`
（在上一步**安装**中的**"注册一个群组runner"**按钮中有这条指令，里面包含了你的token）

执行完上方的注册命令后，会进入注册交互界面

1. 前两个网址和token的输入跳过，因为我们已经填了
2. description描述可以自己定义
3. tags这个需要认真填一下，这个tag将来需要在gitlab的ci文件中引用，比如你这个runner主要用于构建代码的化就填build，如果用来发布项目就填deploy等等
4. 最后会要天一个executer，这个指的是runner的基础运行环境，这里填 docker:stable

至此gitlabrunner已经注册完了


## 编写代码和Dockerfile

我创建了一个netcore项目，Dockerfile如下：
```dockerfile
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /source

EXPOSE 5000
## copy csproj and restore as distinct layers
COPY . .
RUN dotnet restore NetCoreTest/NetCoreTest.csproj 

RUN dotnet publish -c Release -o /app --no-restore

## final stage/image
FROM mcr.microsoft.com/dotnet/aspnet:6.0
WORKDIR /app
COPY --from=build /app .

ENV ASPNETCORE_URLS http://*:5000
ENV TZ Asia/Shanghai
ENTRYPOINT ["dotnet", "NetCoreTest.dll"]
```


## 设置CI/CD变量
在gitlab的**设置-CI/CD-变量**中点击**添加变量. **分别添加以下变量

- CI_REGISTRY ：  swr.cn-north-1.myhuaweicloud.com （docker仓库登录地址，具体根据自己的镜像仓库而定）
- CI_REGISTRY_PASSWORD： password  （docker仓库登录密码）
- CI_REGISTRY_USER：myname	（docker仓库登录用户名）
- CI_REGISTRY_REPOSITORY： swr.cn-north-1.myhuaweicloud.com/first  (这个是仓库的分组地址,大部分的镜像仓库都有这样一个分组地址，一般就是仓库登录地址加分组名)
- CI_KUBE_CONFIG_URL： [http://192.168.0.1:8080/mykubeconfig.yaml](http://192.168.0.246:30061/k3s.yaml)  （k8s的kubeconfig文件，如果不用密钥文件也可以用其他的加密途径，我这里为了方便直接在k8s集群中开了一个密钥文件下载服务。k8s的密钥文件默认在 /root/.kube/config，k3s在 /etc/rancher/k3s/k3s.yaml。注意修改文件中的ip地址为客户端可以访问的地址）


## 编写gitlab-ci.yaml
下面是我配置的yaml文件，如果你上面的环境变量设置的和我一样的化，可以直接用。每一行的意思都写在里面了

```yaml
#构建步骤，先执行build，然后执行deploy
stages:  
  - build
  - deploy

#设置全局的环境变量，所有的stage中都可以引用这里面的变量
variables:
  #docker 镜像地址，由Docker镜像仓库地址(CI_REGISTRY_REPOSITORY)+项目地址(CI_PROJECT_PATH_SLUG)+项目分支(CI_COMMIT_REF_SLUG):镜像版本号(CI_PIPELINE_IID)
  CI_APPLICATION_REPOSITORY: "$CI_REGISTRY_REPOSITORY/$CI_PROJECT_PATH_SLUG-$CI_COMMIT_REF_SLUG:$CI_PIPELINE_IID"
  #docker容器名称,项目地址+版本号
  CI_CONTAINER_NAME: "$CI_PROJECT_PATH_SLUG-$CI_COMMIT_REF_SLUG"
  #k8s命名空间 项目地址+项目id
  CI_NAMESPACE: "$CI_PROJECT_PATH_SLUG-$CI_PROJECT_ID"
  ## ingress访问地址 项目地址+分支+项目id+你的二级域名(我这里写死了"mynetcore.com"，可以配置到ci环境变量中)
  CI_HOST: "$CI_PROJECT_PATH_SLUG-$CI_COMMIT_REF_SLUG-$CI_PROJECT_ID.mynetcore.com"
  ## k8s镜像拉取密钥,用于访问你的私人镜像仓库
  secret_name: "gitlab-secret"

#构建镜像，并上传至镜像仓库
build-job:       
 #表示用最在最新的docker容器中运行服务
  image: docker:latest 
  #对应上面Stages中的build步骤
  stage: build   
  services:
   #在容器中再起一个docker:dind容器，后面的script命令会在该容器内运行
    - docker:dind  
  before_script:
     #登录我们自己的镜像服务
    - docker login -u "$CI_REGISTRY_USER" -p "$CI_REGISTRY_PASSWORD" $CI_REGISTRY
  script:
    - |
    #打印所有的环境变量，用于调试
    - env
    ## 构建镜像
    - docker build --pull -t "$CI_APPLICATION_REPOSITORY" .
    ## 推送镜像至仓库
    - docker push $CI_APPLICATION_REPOSITORY


#部署项目到k8s集群
deploy-job:      
  stage: deploy
  environment: production
  image: docker:stable
  script:
    - env
    - install_dependence
    - install_kubectl
    - kubectl_publish
    - publish_finish
  tags:
  #这个就表示用我们自己的gitlab-runner执行了，"deploy"就是在注册gitlabrunner中填写的tag值。上面的build步骤没有写tag，他会用官方提供的一个默认runner执行(有使用时长限制)
    - deploy


.function: &function |
  #这一步初始化一下容器的环境，更新apk包，安装基础的一些软件
  function install_dependence() {
    echo -e 'https://mirrors.aliyun.com/alpine/v3.6/main/\nhttps://mirrors.aliyun.com/alpine/v3.6/community/' > /etc/apk/repositories
    apk update
    apk add -U openssl curl tar gzip bash ca-certificates git gettext
  }

  #安装kubectl命令工具
  function install_kubectl() {
    #下载kubectl
    curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
    #给kubectl赋执行权限
    chmod +x ./kubectl && mv ./kubectl /usr/local/bin/kubectl
    #创建kubectl 的执行密钥文件夹，然后将kubectl的config配置文件下载到~/.kube/config。$CI_KUBE_CONFIG_URL 这个是我开了一个内网服务用于下载kubeconfig
    mkdir ~/.kube && curl -o ~/.kube/config $CI_KUBE_CONFIG_URL
  }

  ## 部署yaml
  function kubectl_publish(){
   #首先创建命名空间（检测命名空间是否存在，不存在则创建）
    kubectl describe namespace "$CI_NAMESPACE" || kubectl create namespace "$CI_NAMESPACE"
    ## 创建 docker镜像的访问密钥，( 检测密钥是否存在，不存在则创建"kubectl create secret...."。最后后将密钥更新到当前项目的命名空间"kubectl apply ...")
    kubectl describe secret $secret_name || kubectl create secret -n "$CI_NAMESPACE"  docker-registry $secret_name --docker-server=$CI_REGISTRY --docker-username=$CI_REGISTRY_USER --docker-password=$CI_REGISTRY_PASSWORD  -o yaml --dry-run=client  | kubectl apply -n $CI_NAMESPACE -f -
    ## 将环境变量写入到yaml文件中，然后删除掉yaml中上次部署的资源
    envsubst < kube.yaml | kubectl delete -n $CI_NAMESPACE -f - || echo "don't need delete"
    ## 将环境变量写入到yaml文件中，然后部署
    envsubst < kube.yaml | kubectl apply -n $CI_NAMESPACE -f -
  }

  #部署完成，输出一下
  function publish_finish(){
    echo "visit url is http://$CI_HOST"
    echo "Application successfully deployed."
  }
  
#这个是整个ci最先执行的语句，里面可以预定义函数和变量等
before_script:
 #执行上面的 .function: &function
  - *function
```

### kube.yaml
这个是ci脚本中引用的项目k8s的yaml模板文件,下面是我的配置：
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: $CI_CONTAINER_NAME
spec:
  replicas: 1
  selector:
    matchLabels:
      app: $CI_CONTAINER_NAME
  template:
    metadata:
      labels:
        app: $CI_CONTAINER_NAME
    spec:
      containers:
        - name: $CI_CONTAINER_NAME
          image: $CI_APPLICATION_REPOSITORY
          ports:
            - containerPort: 5000
      imagePullSecrets:
        - name: $secret_name
---
apiVersion: v1
kind: Service
metadata:
 name: $CI_CONTAINER_NAME
spec:
  type: NodePort
  ports:
    - port: 5000
      targetPort: 5000
  selector:
    app: $CI_CONTAINER_NAME
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ingress-$CI_CONTAINER_NAME
spec:
  rules:
  - host: $CI_HOST
    http:
      paths:
      - pathType: Prefix
        path: /
        backend:
          service:
            name: $CI_CONTAINER_NAME 
            port:
              number: 5000
```

