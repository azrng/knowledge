---
title: GitHub Action生成镜像并部署
lang: zh-CN
date: 2022-11-27
publish: true
author: azrng
isOriginal: true
category:
  - cloud
tag:
  - 无
filename: githubactionshengchengjingxiangbingbushu
slug: wiymg2
docsId: '96824163'
---

## 目的
通过GitHub的Actions来部署.Net服务到阿里云服务器。

## 环境准备
需要一个阿里云服务器并且该服务器还安装了docker环境，如果环境安装不清楚可以查看之前的文章。

### 创建镜像仓库
在阿里云的容器镜像服务中，创建一个镜像仓库用来存储我们测试的镜像，这里我提前创建仓库为myexample，地址为registry.cn-hangzhou.aliyuncs.com/zrng/myexample。

### 准备项目文件
本文主要讨论GitHub的Action功能，所以项目文件直接使用之前示例代码，在Github创建仓库my-example，该仓库的代码使用之前的代码(仓库地址为：[https://gitee.com/AZRNG/my-example](https://gitee.com/AZRNG/my-example))

## 隐私信息配置
在指定的仓库中，选择Settings=>Secrets=>Actions
![image.png](/common/1662964788789-be6dab44-c8d3-47e5-92be-8b39ffad23f6.png)
点击右上的新建就可以创建想要保存的隐私配置信息
![image.png](/common/1662964862458-55292112-dc41-4232-96cb-361d761de2f1.png)
这里我保存了一下镜像仓库的账号密码等信息。
![image.png](/common/1665843728374-35195900-1e1e-4bbd-8dcd-7c00d728c66a.png)

## 仓库脚本配置
在仓库的根目录新建工作流文件.github/workflows/dotnet.yml(也可以在Actions选项卡中新建)，我们将每次提交的项目生成测试镜像，在dotnet.yml中写下面内容
```dockerfile
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
> 本来在推送镜像的时候我们可以直接build-and-push来推送，但是推送到阿里云仓库有问题，我百度说是阿里云仓库必须写前面镜像地址等信息，所以没成功，所以换用其他方式来实现

上文中涉及的dockerfile文件内容如下
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
在我们提交代码并推送中可以去github的Actions选项卡中查看
![image.png](/common/1665844308787-738ddabc-da31-43b6-a4bd-9be0ffdf04ab.png)
> 因为一些笨笨的操作，错误了好多次

![image.png](/common/1665844353011-7d0d3c05-4f4b-4dd4-af52-9989a81e349b.png)
然后再去阿里云镜像仓库查看是否有我们推送上去的镜像
![image.png](/common/1665886329351-b8fb20ce-79e1-4eed-bf80-af6a635d0e29.png)
已经存在，说明我们生成镜像并推送的步骤成功了，也可以通过以下命令拉取到
```dockerfile
docker pull registry.cn-hangzhou.aliyuncs.com/zrng/myexample:latest
```

## 部署镜像
我们需要让推送成功后，在我们的阿里云服务器上拉取镜像并启动，那么先增加服务器的地址、账号、密码、端口等变量
![image.png](/common/1665845286503-fa50bdbb-50d3-4224-a441-20b362ec21cf.png)
再修改dotnet.yml文件，在最后追加内容
```yaml
## 列出所有镜像    
- name: Docker Images Lst 
run: docker images

- name: executing remote ssh commands using password
uses: appleboy/ssh-action@master
with:
  host: ${{ secrets.SERVERHOST }}
  username: ${{ secrets.SERVERUSERNAME }}
  password: ${{ secrets.SERVERPASSWORD }}
  port: ${{ secrets.SERVERPORT }}
  script: docker run --name netsample -d -p 8002:80 registry.cn-hangzhou.aliyuncs.com/zrng/myexample
```
我本来是按照上面这方案走的，结果还得考虑到停止并删除容器，以及删除镜像拉取最新的镜像，所以我索性直接使用docker-compose去处理了，我在服务器的/root/net目录，放了一个docker-compose文件，内容如下
```yaml
version: '3.4'

services: 
  netsample:
    container_name: netsample
    image: registry.cn-hangzhou.aliyuncs.com/zrng/myexample
    restart: always
    environment: 
      - ASPNETCORE_ENVIRONMENT=Production
    networks: 
      - my-bridge
    ports: 
      - "8002:80"

networks: 
  my-bridge:
    driver: bridge
```
然后在dotnet.yml文件后追加
```yaml
- name: executing remote ssh commands using password
	uses: appleboy/ssh-action@master
	with:
	  host: ${{ secrets.SERVERHOST }}
	  username: ${{ secrets.SERVERUSERNAME }}
	  password: ${{ secrets.SERVERPASSWORD }}
	  port: ${{ secrets.SERVERPORT }}
	  script: 
		cd /root/net;
		docker-compose pull && docker-compose  up -d;
```
然后我提交新增加的代码，等工作流跑结束后
![image.png](/common/1665846823299-709de572-91b1-4ab5-b6bc-47b157e6a75a.png)
访问我们项目的swagger(http://IP:8002/swagger/index.html)页面(前提是阿里云服务器的端口安全组已经设置)，既可以看到下面的效果
![image.png](/common/1665846875139-b5149b0d-f349-44f9-91fa-82db7e976cbf.png)
登录服务器后查看镜像版本，也是我们刚刚推送的镜像。


## 总结
本文完整介绍了如何使用Github Actions做CI&CD，将ASP.NET Core 6.0 程序的main分支打包并部署到阿里云Linux服务器。

如果想在每次dev提交代码后自动生成服务(不再推送镜像仓库)，那么可以稍稍修改上面的脚本使用appleboy/ssh-action@master进入某一个目录(提前拉取好项目的目录)，然后构建镜像生成容器。

## 资料
本文完整代码可以查看仓库：[https://gitee.com/AZRNG/my-example](https://gitee.com/AZRNG/my-example)
完整的dotnet.yaml文件可以查看：[https://gitee.com/AZRNG/my-example/blob/master/.github/workflows/dotnet.yml](https://gitee.com/AZRNG/my-example/blob/master/.github/workflows/dotnet.yml)
