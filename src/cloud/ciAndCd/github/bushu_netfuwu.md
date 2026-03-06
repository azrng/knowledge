---
title: 部署.Net服务
lang: zh-CN
date: 2022-10-16
publish: true
author: azrng
isOriginal: true
category:
  - cloud
tag:
  - 无
filename: bushu_netfuwu
slug: fqf1gk
docsId: '93513637'
---

## 发布并传到远程服务器
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

## 打包推送到镜像仓库
项目就是简单的.Net6项目，项目目录下包含有dockerfile文件，如下
```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["NetByDocker/NetByDocker.csproj", "NetByDocker/"]
RUN dotnet restore "NetByDocker/NetByDocker.csproj"  ## 还原项目的Nuget包
COPY . .
WORKDIR "/src/NetByDocker"
RUN dotnet build "NetByDocker.csproj" -c Release -o /app/build ## 在发布模式下生成项目。 生成工件将写入中间映像的 app/build/ 目录。

FROM build AS publish
RUN dotnet publish "NetByDocker.csproj" -c Release -o /app/publish ## 在发布模式下发布项目。 已发布的捆绑将写入最终映像的 app/publish/ 目录。
 
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "NetByDocker.dll"] ## 启动
```
打包推送镜像仓库的脚本配置
```yaml
## 工作流名称
name: Docker

on:
  push: ## 推送的时候触发
    branches: [ "main" ] ## 推送的分支
    ## Publish semver tags as releases.
    tags: [ 'v*.*.*' ]
  pull_request:
    branches: [ "main" ]

env:
  ## 仓库地址
  REGISTRY: registry.cn-hangzhou.aliyuncs.com
  IMAGE_NAME: zrng/myexample
  IMAGE_TAG: latest


jobs:
  build:

    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
      ## This is used to complete the identity challenge
      ## with sigstore/fulcio when running outside of PRs.
      id-token: write

    steps:
      ## 将远程仓库中的源代码领取到workfile自动化构建脚本运行的服务器
      - name: Checkout repository
        uses: actions/checkout@v3 

      ## Login against a Docker registry except on PR
      ## https://github.com/docker/login-action
      - name: login to ${{ env.REGISTRY }}
        if: github.event_name != 'pull_request'
        uses: docker/login-action@28218f9b04b4f3f62068d7b6ce6ca5b26e35336c ## 用于登录docker以便我们后续上传镜像到自己的镜像仓库
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ secrets.USERMAME }} ## 镜像仓库用户名
          password: ${{ secrets.PASSWORD }} ## 镜像仓库密码

      ## 生成和推送镜像  阿里云镜像仓库推送有问题
      ## ## https://github.com/docker/build-push-action
      ## - name: Build and push Docker image
      ##   id: build-and-push ## 构建docker镜像，推送到自己的docker镜像仓库
      ##   uses: docker/build-push-action@ac9327eae2b366085ac7f6a2d02df8aa8ead720a
      ##   with:
      ##     registry: ${{ env.REGISTRY }}
      ##     username: ${{ secrets.USERMAME }} ## 镜像仓库用户名
      ##     password: ${{ secrets.PASSWORD }} ## 镜像仓库密码
      ##     push: ${{ github.event_name != 'pull_request' }}
      ##     tags: ${{env.IMAGE_NAME}}:${{env.IMAGE_TAG}}.${{ github.run_id }}.${{ github.run_number }} #动态变量镜像TAG 使用github运行job和jobid设置tag
      ##     context: . ## 相对以远程仓库根路径的dockerfile的路径
      ##     file: ./NetByDocker/Dockerfile ## 指定Dockerfile

      - name: Build the Docker image
        run: |
          docker version
          ## 登录阿里云镜像仓库
          docker login --username=${{ secrets.USERMAME }} --password=${{ secrets.PASSWORD }} registry.cn-hangzhou.aliyuncs.com
          ## 使用Dockerfile构建镜像  ${{env.IMAGE_TAG}}.${{ github.run_id }}.${{ github.run_number }}
          docker build . --file NetByDocker/Dockerfile --tag registry.cn-hangzhou.aliyuncs.com/zrng/myexample:${{env.IMAGE_TAG}} --tag registry.cn-hangzhou.aliyuncs.com/zrng/myexample:${{ github.run_number }}
          ## 推送镜像到镜像仓库
          docker push ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{env.IMAGE_TAG}}
          docker push ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.run_number }}

      ## 列出所有镜像    
      - name: Docker Images Lst 
        run: docker images
```
因为上面的是上传到阿里云镜像仓库的所以特殊一点，如果是上传到docker官方仓库，那么直接采用下面的脚本即可
```yaml
## 工作流名称
name: Docker

on:
  push: ## 推送的时候触发
    branches: [ "main" ] ## 推送的分支
    ## Publish semver tags as releases.
    tags: [ 'v*.*.*' ]
  pull_request:
    branches: [ "main" ]

env:
  ## 仓库地址
  REGISTRY: registry.cn-hangzhou.aliyuncs.com
  ## github.repository as <account>/<repo>
  IMAGE_NAME: zrng/myexample ## 配置的写法 ${{ github.repository }}
  IMAGE_TAG: Test


jobs:
  build:

    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
      ## This is used to complete the identity challenge
      ## with sigstore/fulcio when running outside of PRs.
      id-token: write

    steps:
      ## 将远程仓库中的源代码领取到workfile自动化构建脚本运行的服务器
      - name: Checkout repository
        uses: actions/checkout@v3 

      ## Login against a Docker registry except on PR
      ## https://github.com/docker/login-action
      - name: login to ${{ env.REGISTRY }}
        if: github.event_name != 'pull_request'
        uses: docker/login-action@28218f9b04b4f3f62068d7b6ce6ca5b26e35336c ## 用于登录docker以便我们后续上传镜像到自己的镜像仓库
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ secrets.USERMAME }} ## 镜像仓库用户名
          password: ${{ secrets.PASSWORD }} ## 镜像仓库密码

      #生成和推送镜像  阿里云推送有问题
      ## https://github.com/docker/build-push-action
      - name: Build and push Docker image
        id: build-and-push ## 构建docker镜像，推送到自己的docker镜像仓库
        uses: docker/build-push-action@ac9327eae2b366085ac7f6a2d02df8aa8ead720a
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ secrets.USERMAME }} ## 镜像仓库用户名
          password: ${{ secrets.PASSWORD }} ## 镜像仓库密码
          push: ${{ github.event_name != 'pull_request' }}
          tags: ${{env.IMAGE_NAME}}:${{env.IMAGE_TAG}}.${{ github.run_id }}.${{ github.run_number }} #动态变量镜像TAG 使用github运行job和jobid设置tag
          context: . ## 相对以远程仓库根路径的dockerfile的路径
          file: ./NetByDocker/Dockerfile 

      ## 列出所有镜像    
      - name: Docker Images Lst 
        run: docker images

```

## 资料
[https://www.cnblogs.com/kawhi187/p/15224138.html](https://www.cnblogs.com/kawhi187/p/15224138.html) | github action 实现CI/CD - 九两白菜粥 - 博客园
