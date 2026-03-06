---
title: 镜像操作
lang: zh-CN
date: 2023-09-24
publish: true
author: azrng
isOriginal: true
category:
  - cloud
tag:
  - images
---

## 镜像加速器

国内使用官方Docker Hub仓库实在是太慢了，很影响效率，如果在linux系统使用命令编辑文件：

```shell
vim /etc/docker/daemon.json
```

加入下面的内容，docker-cn镜像：

```json
{
  "registry-mirrors": ["https://registry.docker-cn.com"]
}
```

腾讯云的服务器那么请加入：

```json
{
  "registry-mirrors": ["https://mirror.ccs.tencentyun.com"]
}
```

阿里云的服务器需要加入：

```json
{
  "registry-mirrors": ["https://dv91qnkv.mirror.aliyuncs.com"]
}
```

自己的阿里云加速地址去这里看：[https://cr.console.aliyun.com/cn-qingdao/instances/mirrors](https://cr.console.aliyun.com/cn-qingdao/instances/mirrors)，还可以使用dockerproxy代理：[https://dockerproxy.com/](https://dockerproxy.com/)

wq保存退出：执行命令生效：

```shell
systemctl daemon-reload
systemctl restart docker
```

## 镜像打包上传

### 查看服务器镜像
```shell
docker images
```

### 多架构镜像

合并打包多架构的镜像：https://andrewlock.net/combining-multiple-docker-images-into-a-multi-arch-image/

### 镜像推送

#### Docker Hub
上镜像上传docker hub是需要先登录docker hub，可以在命令行中输入下面的内容
```csharp
docker login
```
> 如果需要，可以访问 [Docker Hub 网站](https://hub.docker.com/)来重置密码。

输入下面的命令将重新标记或者重命名docker镜像
```csharp
docker tag pizzafrontend [YOUR DOCKER USER NAME]/pizzafrontend
docker tag pizzabackend [YOUR DOCKER USER NAME]/pizzabackend
```
最后将docker镜像上推送到docker hub
```csharp
docker push [YOUR DOCKER USER NAME]/pizzafrontend
docker push [YOUR DOCKER USER NAME]/pizzabackend
```

#### 阿里云镜像源

具体操作方法可以登录阿里云查看镜像仓库说明

```shell
# 登录
sudo docker login --username=用户名 registry.cn-hangzhou.aliyuncs.com 

# 将指定镜像打包    
sudo docker tag [ImageId] registry.cn-hangzhou.aliyuncs.com/zrng/dotnetruntime:[镜像版本号]
```
将镜像推送到仓库
```csharp
sudo docker push registry.cn-hangzhou.aliyuncs.com/zrng/dotnetruntime:[镜像版本号]
```
然后使用镜像拉取镜像
```csharp
sudo docker pull registry.cn-hangzhou.aliyuncs.com/zrng/dotnetruntime:[镜像版本号]
```

### 镜像推送工具

#### jib
不依赖docker环境就可以创建docker或者OCI类型的镜像。
功能包含：

- 构建镜像推送到镜像仓库(dockerhub/aliyun/tencent共有仓库,harbor等私有仓库)
- 构建镜像推送到本地docker环境
- 构建镜像生成tar格式镜像文件到本地

仓库地址：[https://github.com/yuzd/jib](https://github.com/yuzd/jib)  
参考地址：[https://mp.weixin.qq.com/s/sIy0PbpPR92qTHcEOmuW6w](https://mp.weixin.qq.com/s/sIy0PbpPR92qTHcEOmuW6w)

## NetCore镜像

### 官方镜像

官网镜像地址：[https://mcr.microsoft.com/product/dotnet/sdk/about](https://mcr.microsoft.com/product/dotnet/sdk/about)  
dockerHub镜像地址：[https://hub.docker.com/_/microsoft-dotnet](https://hub.docker.com/_/microsoft-dotnet)

```yaml
aspnet镜像
包含.NET Core Runtime、ASP.NET Core框架组件、依赖项，该镜像为生产部署做了一些优化。

runtime镜像
.NetCore 运行时镜像，但不包含ASP.NET Core框架。

net5默认的
FROM mcr.microsoft.com/dotnet/aspnet:5.0 AS base
FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build

net5 console dockerfile
FROM mcr.microsoft.com/dotnet/runtime:5.0 AS base
FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build


Alpine Linux是体积最小的Linux发行版
mcr.microsoft.com/dotnet/aspnet:5.0-alpine
mcr.microsoft.com/dotnet/sdk:5.0-alpine
```

#### 修改镜像源

aspnet:8.0镜像基于 debian:12-slim 构建

:::tip

自 Debian 12 (bookworm) 开始，Debian 的容器镜像开始使用 DEB822 格式，而非之前的单行格式。
原先应该修改的 /etc/apt/sources.list 文件现在已被移除。现在，默认源的相关配置已被移至 /etc/apt/sources.list.d/debian.sources 文件。

:::

该文件默认内容为

```shell
root@12eea2be0dc9:/etc/apt/sources.list.d# cat debian.sources
Types: deb
# http://snapshot.debian.org/archive/debian/20240423T150000Z
URIs: http://deb.debian.org/debian
Suites: bookworm bookworm-updates
Components: main
Signed-By: /usr/share/keyrings/debian-archive-keyring.gpg

Types: deb
# http://snapshot.debian.org/archive/debian-security/20240423T150000Z
URIs: http://deb.debian.org/debian-security
Suites: bookworm-security
Components: main
Signed-By: /usr/share/keyrings/debian-archive-keyring.gpg
```

dockerfile中使用root用户这么操作

```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
# 不使用root运行提示  couldn't open temporary file /etc/apt/sources.list.d/sedxOZ83A: Permission denied
#USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

# 更新debian:12-slim源为 http://mirrors.aliyun.com/ 限速，这里使用中科大源： https://mirrors.ustc.edu.cn/debian/
# 设置支持导出excel
RUN sed -i 's@deb.debian.org@mirrors.ustc.edu.cn@g' /etc/apt/sources.list.d/debian.sources && \
    apt update && apt install -y libgdiplus && \
    ln -s /usr/lib/libgdiplus.so /usr/lib/gdiplus.dll
```

### alpine镜像

使用alpine构建更小的镜像(在镜像后面加 -alpine 就行了)

:::tip

aspnet:6.0-alpine3.18和aspnet:6.0-alpine的区别是前者属于Alpine Linux操作系统的特定版本号，后者指的是alpine该标签的最新版本Alpine Linux镜像。如果你的应用程序已经针对alpine3.18进行了测试和优化，那么你应该使用该特定版本以保持一致性。

:::

操作示例

```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:6.0-alpine3.18 AS base
WORKDIR /app
EXPOSE 80

# 设置地区
ENV TZ Asia/Shanghai
ENV DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=false
# 支持excel导出以及时间
RUN apk add --no-cache tzdata libstdc++ libintl icu && ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone


FROM mcr.microsoft.com/dotnet/sdk:6.0-alpine3.18 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["WebApplication8/WebApplication8.csproj", "WebApplication8/"]
RUN dotnet restore "./WebApplication8/./WebApplication8.csproj"
COPY . .
WORKDIR "/src/WebApplication8"
RUN dotnet build "./WebApplication8.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./WebApplication8.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final

WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "WebApplication8.dll"]
```
