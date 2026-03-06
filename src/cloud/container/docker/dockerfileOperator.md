---
title: Dockerfile操作
lang: zh-CN
date: 2023-09-24
publish: true
author: azrng
isOriginal: false
category:
  - cloud
tag:
  - 无
filename: dockerfilecaozuo
slug: vcbhnx
docsId: '29454325'
---

## 初体验

- 准备一个项目

  这里就直接创建一个默认的API项目(基于.NetCore3.1)即可，什么都不做。

- 编写Dockerfile

  在项目根目录下增加一个Dockerfile文件，里面内容如下：

  ![图片](/common/202212111144327.webp)

  具体内容如下

  ```
  FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-buster-slim
  WORKDIR /app
  COPY . .
  EXPOSE 80
  ENTRYPOINT ["dotnet", "DockerDemo.dll"]
  ```

  设置Dockerfile的文件属性为始终复制，如下：

  ![图片](/common/202212111144648.webp)

  以文件系统的形式发布项目，指定本地目录，如下：

  ![图片](/common/202212111144320.webp)

- 将发布之后的文件拷贝到装有Docker的主机上

  将项目进行发布，把发布之后的文件拷贝到我的阿里云服务器上，用到的工具是FinalShell(一个工具完成连接服务器和上传文件，很好用)，如下：

  ![图片](/common/202212111144960.webp)

- 打包为镜像

  进入发布文件目录，执行`docker build`命令，将发布文件打包为一个镜像，如下：

  ![图片](/common/202212111144030.webp)

  上图中的mydockerdemo 是镜像名，可以自定义；通过`docker images`查看镜像是否生成，如下：

  ![图片](/common/202212111144782.webp)

- 根据镜像启动容器(里面包含我们的项目)

  镜像生成之后，就可以通过`docker run`指令根据镜像启动容器了，即启动我们的项目

  ![图片](/common/202212111144433.webp)

  ```
  docker run -d --name mydockerdemo -p 9999:80 mydockerdemo
  ```

  -d：后台模式运行；

  --name：给运行中的容器指定一个名字；

  -p：指定端口映射， 主机的端口9999映射到容器的端80，因为在容器里面我们的项目是以80 端口启动的；

  最后一个参数是上一步生成的镜像名称， 即根据此镜像启动一个容器实例。

- 测试访问看看，只要配置了云服务器的安全组和防火墙放开9999端口，那么外网就可以访问了,如下：

  ![图片](/common/202212111144833.webp)

可能有小伙伴说，也挺麻烦的；其实编写Dockerfile，打包镜像等操作都是一次性的，只要生成了镜像，后续其他环境直接根据镜像启动即可，不用再单独安装.NetCore运行时等基础设施了，打包好的镜像里包含了完整的运行环境。



## 命令介绍

![image.png](/common/1609560081425-6ae7cdce-7b4e-4cc7-81b8-8eaf43eb4441.png)
分为四个部分：基础镜像信息、维护者信息、镜像操作指令、容器启动执行指令

### 预览

Docker和我们熟悉的Git很类似，都是通过命令执行相关操作，当然也有一些界面管理工具(点按钮的那种)，但大家似乎更喜欢直接敲命令，毕竟这种方式更加灵活、更加容易理解操作本质；有大神将常用命令用一张图很好的展现出来，这里借用一下(图片来源于网络，侵删)：

![图片](/common/202212111144078.webp)cmd_logic

不熟悉Docker的小伙伴可能看见这图直接懵圈了，别急，接着往下看， 看完再回过头来瞅这张图，绝对感觉很给力。

### 常用命令实操

#### 全局命令

- **`docker version`**：查看docker版本信息。

  ![图片](/common/202212111144653.webp)

- **`docker info`**：查看docker详情信息，比如仓储信息、加速器配置信息、有多少个镜像、有多少个容器、CPU、内存等。

  ![图片](/common/202212111144239.webp)

- **`docker events`**：从docker 服务获取实时事件，通俗一点理解就是操作日志，比如对镜像、容器、网络、挂载卷等操作，就会记录对应的事件信息；**最多能返回最近的1000条日志信息**。

  先在一个终端执行命令，终端会阻塞：

  ![图片](/common/202212111145463.webp)

  开启另一个终端，执行根据镜像运行容器的命令：

  ![图片](/common/202212111145116.webp)

  此时开启的第一个终端就实时输出事件消息，如镜像拉取、容器启动、容器结束等信息，如下：

  ![图片](/common/202212111145974.webp)

  既然可以把这个命令当做操作日志理解，那肯定可以根据条件查看对应的数据，如下：

  ![图片](/common/202212111145727.webp)

  如图所示，会先显示符合条件的事件信息，然后会继续阻塞，如果对服务端有操作，信息还会实时显示。常用的参数指定如下：

  **-f** ：根据条件过滤事件，如上图指定的是镜像为hello-world相关的事件信息；

  **--since** ：从指定的时间戳后显示所有事件，可以理解为开始时间，支持多种时间格式，默认使用本地主机的时区;

  **--until** ：显示到指定的时间为止，可以理解为结束时间；

#### 镜像常用命令

**镜像(image)可以理解为一种轻量级、可独立运行的软件包，包含了应用程序及其他运行需要的基础设施**，如运行时、配置文件、依赖的库等，所以没有镜像就没法启动容器；就好比开发中没有类(class)，又怎么去根据类创建实例呢。

**镜像是只读的**，所以操作命令不多，一般就是增、删、查。

- **`docker images`**：列出Docker主机上的镜像

  ![图片](/common/202212111145089.webp)

  可以指定参数，比较常用的如下：

  ![图片](/common/202212111145466.webp)

  **-a** :列出本地所有的镜像（含中间镜像层，默认过滤掉中间镜像层）。

  **-q** :只显示镜像ID。

  **上图中的-aq就是显示所有镜像的ID，一般用于批量删除**。

- **`docker search`**：从远程仓储中搜索镜像，后面直接根镜像名称即可

  ![图片](/common/202212111145925.webp)

  可以指定条件进行搜索，如下：

  ![图片](/common/202212111145829.webp)

  **--filter**：指定条件搜索，**is-official表示是否为官方的，stars表示要找多少星星以上的**。

  对于搜索，我还是比较喜欢用界面，直观好看：

  ![图片](/common/202212111145699.webp)

- **`docker pull`**：从远程仓储中拉取镜像，**后面跟镜像名和tag即可，即指定版本拉取，如果不指定tag，默认就latest，最新的**。

  ![图片](/common/202212111145254.webp)

  **镜像的分层原理就是采用UnionFS(联合文件系统)，是一种分层、轻量级的高性能文件系统；镜像可以通过分层来进行继承，可以基于基础镜像制作出各种具体的应用镜像**，比如我们刚拉取下来的nginx镜像，这里先了解，后续我们自己制作镜像的时候就明白了。

  **`docker pull 镜像名:tag`**：指定版本拉取；

  ![图片](/common/202212111145338.webp)

- **`docker rmi`**：删除指定镜像，后面可以跟名称或镜像ID

  ![图片](/common/202212111145314.webp)

  删除指定版本，如下：

  ![图片](/common/202212111145603.webp)

  根据镜像ID删除，可以一下删除多个，中间用空格隔开：

  ![图片](/common/202212111146484.webp)

  删除全部镜像，就是找出所有镜像ID，然后删除就行了，当然肯定不是一个一个的拷贝镜像ID；**`docker images -aq`**可以显示所有镜像ID ，所以两个命令结合用即可，如下：

  ```
  docker rmi -f $(docker images -aq)
  ```

  **-f**：代表强制删除，比如一些镜像和容器有依赖，会提示不能直接删除，加上这个选项就可以强制删除。

- **`docker save`**：导出镜像，可以离线拷贝到其他主机上使用，避免没有网络不能下载镜像的场景。

  ![图片](/common/202212111146297.webp)

  生成的tar文件就可以根据需要拷贝到对应设备上加载使用，不用在线拉取，因为很多场景是不允许连外网的。

- **`docker load`**：加载镜像，根据拷贝过来的tar文件可以直接加载镜像到主机上。

  这里演示就将原来拉取的镜像删除，然后通过load命令重新加载，如下：

  ![图片](/common/202212111146363.webp)

  加载镜像，如下：

  ![图片](/common/202212111146235.webp)

  换一种写法，如下：

  ![图片](/common/202212111146690.webp)

  选项说明：

  **--input , -i** : 指定导入的文件。

  **--quiet , -q** : 简化输出信息，不显示具体加载过程。

  ![图片](/common/202212111146582.webp)

  注：这里因为是在TestDockerImage目录下执行命令，所以指定tar的文件时，就在当前目录下。

#### 容器常用命令

**容器是用镜像创建的运行实例，** 它可以被启动、开始、停止、删除，**每个容器都是相互隔离**；可以把容器看做是一个极简版的Linux环境和在其中运行程序的组合；

**容器**和镜像几乎一样，唯一的区别就是**镜像层上面加载了一个可写层**，这层称为**容器层**；

以下对容器的操作，可以指定容器名称，也可以指定容器ID，演示统一用容器ID，不再重复截图。

- **`docker run`**：根据镜像启动容器；语法如下：`docker run [OPTIONS] IMAGE [COMMAND] [ARG...]`;

  常用选项参数说明，如下：

  **--name="容器名"** : 为容器指定一个名称；

  **-d**: 后台运行容器，并返回容器ID；

  **-i**: 以交互模式运行容器，一般和 -t 同时使用；

  **-t**: 为容器重新分配一个伪输入终端，一般和 -i 同时使用；

  **-P**: 随机端口映射，容器内部端口**随机**映射到主机的端口

  **-p**: 指定端口映射，格式为：**主机端口:容器端口**

  演示如下：

  ![图片](/common/202212111146096.webp)

  上图可以看到终端阻塞了，**这种模式称为attached默认，即前台运行，与之对应的是detached模式，及后台运行**，接下来会演示。由于终端阻塞，这里另开一个终端执行`docker ps`命令看运行的容器，如下：

  ![图片](/common/202212111146496.webp)

  **前台运行模式终端很容易被关闭，启动的nginx容器也会停掉**，这种情况对于很多场景是不允许的，所以可以指定为后台模式运行，即detached模式，如下：

  ![图片](/common/202212111146434.webp)

  现在只是在容器内启动了一个nginx，并监听80端口，如果需要通过主机能访问到容器里面的nginx，还需进行端口映射，如下：

  ![图片](/common/202212111146227.webp)

  这里启动了两个nginx容器，都是监听80端口，但并没有报端口被占用的错，所以容器之间是互不影响的。通过**-p**选项进行端口映射，这下就可以通过主机的9999端口访问到容器内部的80端口，如下：

  ![图片](/common/202212111146334.webp)

  既然刚开始说可以将容器理解为简易版的Linux，那就应该可以进入容器内部操作一把，如下：

  ![图片](/common/202212111146265.webp)

  在容器里面只能执行一些核心的命令，因为是极简版，所以内部只包含重要的功能，如果需要其他功能可以自己安装扩展。

  **退出容器的两种方式：**

  a、容器中执行**exit**命令，容器停止并退出，回到主机；

  ![图片](/common/202212111146461.webp)

  b、利用组合键**ctrl+p+q**，容器不停止退出，回到主机；

  ![图片](/common/202212111147568.webp)

- **`docker ps [OPTIONS]`** ：显示主机中的容器，不加选项**默认只列出运行中的容器**；

  **-a :** 显示所有的容器，包括未运行的；

  **-n :** 列出最近创建的n个容器；

  演示如下：

  ![图片](/common/202212111147870.webp)

- 启动和停止容器的命令；

  ```
  docker start 容器id  # 启动被停止的容器
  docker stop 容器id  # 停止运行中的容器
  docker restart 容器id # 重启容器
  docker kill 容器id  # 强制停止容器
  ```

  **`docker stop`**停止容器，后面可以跟一个或多个容器ID：

  ![图片](/common/202212111147678.webp)

  **`docker start`**：启动被停止的容器，后面可以跟一个或多个容器ID：

  ![图片](/common/202212111147353.webp)

  **`docker restart`**重启命令和**`docker kill`**强制停止命令就不截图啦

- **`docker exec`和`docker attach`**两种方式进入正在运行的容器。

  很多场景容器都是后台运行，但有时需要进入容器内部进行相关配置的更改。

  **`docker exec`**：进入容器后开启一个新的终端，正常执行Linux相关命令。

  ![图片](/common/202212111147403.webp)

  **`docker attach`**：进入容器正在执行的终端，不会启动新的进程。

  ![图片](/common/202212111147541.webp)

  退出容器模式：

  **容器中执行exit命令，容器停止并退出;**

  **利用组合键ctrl+p+q，容器不停止退出;**

- **`docker logs [OPTIONS] 容器ID`**：查看指定容器的日志；

  常用OPTIONS如下：

  **-f** :跟踪日志输出

  **--since** :显示指定开始时间之后所有日志

  **-t** : 显示时间戳

  **--tail** :列出最新N条容器日志

  ![图片](/common/202212111147833.webp)

  可以指定选项，查看需要的日志，如下：

  ![图片](/common/202212111147697.webp)

- **`docker top 容器ID`**：列出指定容器内部的进程，可以看到容器内的应用进程是否正常运行，如下：

  ![图片](/common/202212111147301.webp)

- **`docker inspect 容器ID`**：查看指定容器的详细信息，比如运行状态、网络配置、挂载的卷等信息都有，如下：

  ![图片](/common/202212111147182.webp)

- **`docker commit`：根据容器生成一个新的镜像**；容器是可编辑的，有些时候需要将已更改的容器生成一个新的镜像给其他人用。

  ![图片](/common/202212111147082.webp)

  命令说明：

  **-a** :提交的镜像作者；

  **-m** :提交时的说明文字；

  命令中**testcommitimage:v1**是自定义的镜像名和tag；

  根据新生成的镜像启动容器，则内部就会有创建的对应文件(容器内部可以根据需要任意改，这里只是演示创建文件而已)。

- **`docker export`和`docker import`**将容器方便离线导出和导入；

  ![图片](/common/202212111147245.webp)

  命令说明：

  ```
  #将容器导出为tar文件
  docker export -o testexport.tar 030aa6fcd7f3
  # -o 指定输出位置和文件名
  # 030aa6fcd7f3 这个是容器ID
  
  #根据生成的tar文件导入为镜像
  docker import testexport.tar testexportimagename:v2
  # 指定对应的tar文件
  # testexportimagename:v2 镜像名和版本, 可以自己定义
  ```

  这对命令是不是和镜像的`docker save`、`docker load`这对命令用法很相似，但两种方式不能混用，因为export导出的仅仅是容器快照，save保存的是完整的镜像文件。

- **`docker rm 容器ID`**：删除指定容器，运行中的容器默认不让删除，可以增加**-f选项**强制删除，如下：

  ![图片](/common/202212111147248.webp)

以上只是总结了平时比较常用的命令，并没有全部列出，更多细节可以进入官网：https://docs.docker.com/engine/reference/commandline/rm/；

## Dockerfile解析

使用第三方镜像肯定不是学习Docker的最终目的，最想要的还是自己构建镜像；将自己的程序、文件、环境等构建成自己想要的应用镜像，方便后续部署、启动和维护；而Dockerfile就是专门做这个事的，通过类似简单编码的形式，最终就可以构建出属于自己的镜像，所以必须学起来。

### Dockerfile简介

在日常开发过程中，需要编写对应的程序文件，最后通过编译打包生成对应的可执行文件或是类库；这里的Dockerfile文件就好比平时我们编写的程序文件，但内部的语法和关键字并没有程序那么复杂和繁多，相对来说还是很简单的，最后通过`docker build`命令就可以将对应的程序、文件、环境等构建成镜像啦。

在第一篇文章最后就简单使用了Dockerfile构建了一个镜像，这里重新认识下这个Dockerfile文件，如下图：

![图片](/common/202212111149346.webp)

**Dockerfile就是一个文本文件**，但不需要指定后缀类型；文件内容中FROM、WORKDIR、COPY等就是关键字，按照规则写好之后，就可以将指定的文件构建为镜像啦。

**构建操作统一由Docker daemon进行，它会先对文件内容语法进行初步验证(语法不对就会返回错误信息)，然后逐一运行指令，每次生成一个新的镜像层，直到执行完所有指令，就构建出最终的镜像。** Dockerfile、镜像、容器的关系如下：

![图片](/common/202212111149334.webp)

总结一下Dockerfile的知识点；

- **构建时，指令从上到下逐一执行；**
- **每条指令都会创建一个新的镜像层，每一层都是前一层变化的增量；**
- **使用#号进行注释；**
- **关键字约定都是大写，后面至少跟一个参数；**

### Dockerfile关键字

#### FROM 关键字

**指定基础镜像**， 就是新镜像是基于哪个镜像构建的。

比如建房子，可以在一块空地开始，也可以在别人打好的基石基础上开始， 甚至可以在别人弄好的毛坯房基础上装修即可。

如果要建房的话，可以FROM 空地，或者FROM 打好的基石，或者 FROM 毛坯房， 反正最后建好房就行；

这里需要注意的是，不管咋样，空地是少不了的；**构建镜像也一样，最底层肯定有一个最基础的镜像**。

建议使用官方的镜像作为基础镜像，推荐使用Alpine这种类型，因为它是严格控制的，而且体积很小。

用法如下：

```
 # FROM [--platform=<platform>] <image>[:<tag>] [AS <name>]
 ARG  CODE_VERSION=latest # 定义变量
 FROM base:${CODE_VERSION} # 指定基础镜像
```

#### MAINTAINER/LABEL 关键字

**MAINTAINER 指定维护者的相关信息，也就是构建的镜像是由谁构建的，他的邮箱是什么**；

**LABLE 就是用于给镜像打标签，以键值对的方式进行指定**，相对MAINTAINER 来说比较灵活，可以使用LABLE替代MAINTAINER。

用法如下：

```
 # LABEL <key>=<value> <key>=<value> <key>=<value> ...
 LABEL com.example.version="0.0.1-beta" 
 LABEL vendor1="ACME Incorporated"
```

#### RUN 关键字

**构建过程中需要运行的命令**， 比如在构建过程中需要执行一条命令下载对应的包，这里就需要用到RUN关键字；

用法如下：

```
 # 两种命令方式都可以
 # RUN <command>
 # RUN ["executable", "param1", "param2"]
 # 执行命令,Linux支持的相关命令
 RUN /bin/bash -c 'source $HOME/.bashrc; echo $HOME'
 RUN ["/bin/bash", "-c", "echo hello"]
```

##### 安装操作excel使用到的包

```dockerfile
# 切换源并更新包
RUN sed -i 's@deb.debian.org@mirrors.ustc.edu.cn@g' /etc/apt/sources.list.d/debian.sources && \
    apt update && \
    apt upgrade -y libxml2 && \
    apt install -y tzdata libgdiplus && \
    ln -s /usr/lib/libgdiplus.so /usr/lib/gdiplus.dll && \
    apt clean && \
    rm -rf /var/lib/apt/lists/*


sed -i 's@deb.debian.org@mirrors.ustc.edu.cn@g' /etc/apt/sources.list.d/debian.sources  ： 更新包源
apt clean：清理 apt 缓存
rm -rf /var/lib/apt/lists/*：删除包列表
```

#### WORKDIR 关键字

根据镜像启动容器时，通常需要进入到容器内部；**则可以通过WORKDIR指定进入容器时的目录**；

用法如下：

```
 WORKDIR /path # 指定路径
```

#### ENV 关键字

可以在构建过程中设置环境变量；就好比平时我们安装完程序，需要配置环境变量，方便访问；ENV关键字就是根据需求可以设置对应的环境变量；

用法如下：

```
 # ENV <key>=<value> ...
 # 指定环境变量
 ENV PATH=/usr/local/postgres-$PG_MAJOR/bin:$PATH
```

#### ADD 关键字

**将宿主机的资源拷贝进镜像中，会自动解压缩，而且还能从远程宿主机中读取资源并拷贝到镜像中**；

用法如下：

```
 # 两种命令方式都可以
 # ADD [--chown=<user>:<group>] <src>... <dest>
 # ADD [--chown=<user>:<group>] ["<src>",... "<dest>"]
 ADD https://example.com/big.tar.xz /usr/src/things/
```

#### COPY 关键字

**将宿主机的资源拷贝到镜像中，只支持读取构建所在宿主机的资源**。相对于ADD关键字来说更加透明，操作什么就是什么。

用法如下：

```
 # 拷贝资源到容器，两种命令格式都行
 # COPY [--chown=<user>:<group>] <源地址>... <目标地址>
 # COPY [--chown=<user>:<group>] ["<源地址>",... "<目标地址>"]
 COPY requirements.txt /tmp/
```

#### VOLUME 关键字

挂载数据卷，之前在常用命令那说到通过命令的方式进行数据卷挂载，在Dockerfile中使用**VOLUME**指定挂载路径即可，根据构建出来的镜像运行容器时，默认就有构建时挂载的信息。

用法如下：

```
 # 挂载数据卷
 VOLUME ["/data"]
 VOLUME /myvol
```

#### EXPOSE 关键字

指定运行容器时对外暴露的端口；即根据镜像启动容器时，容器向外暴露端口。

用法如下：

```
 # EXPOSE <port> [<port>/<protocol>...]
 EXPOSE 80/tcp # 暴露端口
 EXPOSE 80/udp
```

#### CMD 关键字

指定启动容器时要执行的命令，只有最后一个会生效；即根据镜像启动容器时，容器需要执行啥命令。

用法如下：

```
 # 两种格式都行
 # CMD ["param1","param2"]
 # CMD command param1 param2
 # 执行命令统计 行数、字数、字节数
 CMD echo "This is a test." | wc -
 # 执行wc --help命令 
 CMD ["/usr/bin/wc","--help"]
```

#### ENTRYPOINT 关键字

指定根据镜像启动容器时要执行的命令，可以追加命令；执行时机同CMD。

用法如下：

```
 # ENTRYPOINT ["executable", "param1", "param2"]
 # ENTRYPOINT command param1 param2
 ENTRYPOINT ["top", "-b"]
```

#### ARG 关键字

通过ARG指令定义了一个变量；和写代码时定义的变量一样，根据需要，定义就行啦。

用法如下：

```
 # ARG <name>[=<default value>]
 ARG user1=someuser
 ARG buildno=1
```

#### ONBUILD 关键字

基于父镜像构建新的镜像时，父镜像的OBUILD会被触发。

## 实战演示

这里还是以.NetCore项目构建镜像为例，其他编程语言的项目同理；这次咱们一步一步的来，搞清楚每个命令的使用。

以下关于项目创建和发布的具体细节在第一篇最后就分享了，小伙伴可以[参考](https://mp.weixin.qq.com/s?__biz=MzU1MzYwMjQ5MQ==&mid=2247485538&idx=1&sn=1a264b5b0cb9577ddbc10dbfdf529298&chksm=fbf114b6cc869da08a707988d885f4ce99d4cf3aac57749b6b37fcf407189ae312acb0174077&token=583695816&lang=zh_CN&scene=21#wechat_redirect)，这里主要演示Dockerfile关键字。

### 准备项目和Dockerfile文件

新建一个项目，啥都不需要改，就用默认的接口演示，如下：

![图片](/common/202212111149136.webp)

Dockerfile内容如下：

```
 # 指定基础镜像，在此基础上构建自己的项目镜像
 FROM mcr.microsoft.com/dotnet/core/aspnet:3.1
 # 指定自己的工作目录，进入容器时目录
 WORKDIR /myApp
 # 将构建上下文目录下的文件拷贝到容器的当前工作目录中，即/myApp
 COPY . .
 # 容器向外暴露端口，项目以什么端口启动就暴露对应的端口
 EXPOSE 80
 # 执行命令，这里默认是以80端口启动的
 #就类似于在Linux系统的项目目录下执行 dotnet DockerfileDemo.dll 是一样的
 ENTRYPOINT ["dotnet", "DockerfileDemo.dll"]
```

**记得右键Dockerfile，选择属性，然后设置Dockerfile为始终复制**，这样后续更新变动，发布时就会自动拷贝到对应的发布目录。

### 发布

以文件的形式发布项目，并连同Dockerfile拷贝到安装好Docker的机器上进行构建(这里还是用我的云服务器)；

![图片](/common/202212111149214.webp)

**`docker build -t myimage:v1.0 .`解析**：

- **-t**：指定镜像的名字及标签，通常 name:tag 或者 name 格式，myimage就是镜像名字，v1.0就是tag；
- **-f** :指定要使用的Dockerfile路径，这里由于Dockerfile在当前路径，所以不用指定；
- **最后面的点**：**官方称为构建上下文，点表示指定为当前目录**。会把指定的这个目录下的文件发送给docker daemon进行构建，所以千万不要指定/(斜杠代表根目录，有很多文件的)。
- 其他选项参数小伙伴可以根据需要使用，以上是比较重要的。

### 启动容器

根据构建出来的镜像启动容器，看Dockerfile中的命令效果；

启动容器如下：

![图片](/common/202212111149951.webp)

**`ENTRYPOINT ["dotnet", "DockerfileDemo.dll"]`这行代码就等同于的项目目录下直接执行 dotnet DockerfileDemo.dll是一样的，目的就是启动我们的项目**。

通过`docker logs`可以查看容器内部的日志，如下：

![图片](/common/202212111149132.webp)

### 设置Dockerfile 

丰富化Dockefile文件内容并查看构建之后的细节

文件内容如下：

```
 # 指定基础镜像，在此基础上构建自己的项目镜像
 FROM mcr.microsoft.com/dotnet/core/aspnet:3.1
 # 指定维护人
 MAINTAINER CodeZYQ<1137533407@qq.com>
 # 打标签
 LABEL createname="CodeZYQ"
 # 指定自己的工作目录，进入容器时目录 app
 WORKDIR /myapp
 # 将构建上下文目录下的文件拷贝到容器中的工作目录中
 COPY . .
 # 定义变量
 ARG myPort=8080
 # 使用环境变量方式改变启动端口，拼接用到了定义的变量
 ENV ASPNETCORE_URLS=http://+:$myPort
 # 通过RUN 执行相关命令，根据需要执行相关命令
 RUN mkdir testDir
 # 挂载数据卷，这里模拟挂载日志目录
 VOLUME /Logs
 # 容器向外暴露端口，项目以什么端口启动就暴露对应的端口
 EXPOSE $myPort
 # 执行命令，这里默认是以80端口启动的
 # 就类似于在Linux系统的项目目录下执行 dotnet DockerfileDemo.dll 是一样的
 ENTRYPOINT ["dotnet", "DockerfileDemo.dll"]
```

执行如下命令，构建新的镜像：

```
 # 这里没有显示指定tag 默认就latest
 docker build -t newimage .
```

![图片](/common/202212111149148.webp)

通过`docker logs`看看容器日志，如下：

![图片](/common/202212111149439.webp)

看看数据卷挂载是否成功，进入容器，看根目录下就会多了Logs目录，也可以通过`docker inspect 容器` 看容器详细信息，如下：

![图片](/common/202212111149402.webp)

标签也打成功了：

![图片](/common/202212111149883.webp)

也可以通过`docker inspect 镜像`查看镜像内部的详细信息，执行命令`docker inspect newimage`如下：

![图片](/common/202212111149297.webp)

关于步骤和效果，在Dockerfile注释和图表中已经详细描述。

### CMD和ENTRYPOINT的区别

两个命令都是启动容器时指定执行命令和对应的参数，但两者稍有不同，如下：

- **CMD**：只能最后一个命令会生效，命令会被docker run之后的参数替换掉；
- **ENTRYPOINT**：可以追加命令，比如增加参数；

上面构建出来的newimage镜像用到的是ENTRYPOINT，所以我们先来测试一下ENTRYPOINT，如下：

![图片](/common/202212111149964.webp)

`docker run`启动容器时指定了参数 `--urls="http://+:9999"`，容器正常启动，并且参数还能生效，等同于在当前目录直接执行如下命令：

```
 dotnet DockerfileDemo.dll --urls="http://+:9999"
```

现在把ENTRYPOINT换成CMD试试，如下：

```
 # 在以上的Dockerfile中
 # 将ENTRYPOINT ["dotnet", "DockerfileDemo.dll"]换成CMD，如下：
 CMD ["dotnet", "DockerfileDemo.dll"]
```

然后重新构建一个镜像试试，测试如下：

![图片](/common/202212111149624.webp)

如上图，对于CMD而言，如果在运行容器时，后面指定参数，这个参数就会把CMD命令替换掉，不能拼接，导致命令不对，所以报错；但这样就可以执行，如下：

![图片](/common/202212111149767.webp)

如果在当前构建的上下文目录中不想要一些文件参与构建，**可以通过在.dockerignore文件中进行配置**，这个和git中的.gitignore一个道理，编写也比较简单，这里就不演示了。

对了，.NetCore的镜像列表可以参照这个地址：https://hub.docker.com/_/microsoft-dotnet-aspnet/，每个镜像都有对应的Dockerfile，感兴趣的小伙伴可以点进去看看，参考参考。

![图片](/common/202212111149893.webp)


## 操作

### 快速上手
在后端项目中创建dockerfile文件，内容如下
```csharp
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY backend.csproj .
RUN dotnet restore
COPY . .
RUN dotnet publish -c release -o /app
```
此代码将在调用时按顺序执行以下步骤：

- 拉取 mcr.microsoft.com/dotnet/sdk:6.0 映像并将其命名为 build
- 将映像中的工作目录设置为 /src
- 将在本地找到的名为 backend.csproj 的文件复制到刚创建的 /src 目录中
- 在项目中调用 dotnet restore
- 将本地工作目录中的所有内容复制到映像中
- 在项目中调用 dotnet publish

然后在最后一行的正下方输入以下内容
```csharp
FROM mcr.microsoft.com/dotnet/aspnet:6.0
WORKDIR /app
EXPOSE 80
EXPOSE 443
COPY --from=build /app .
ENTRYPOINT ["dotnet", "backend.dll"]
```

- 拉取 mcr.microsoft.com/dotnet/aspnet:6.0 映像
- 将映像中的工作目录设置为 /app
- 公开端口 80 和 443
- 将上面创建的 build 映像的 /app 目录中的所有内容复制到此映像的应用目录中
- 将此映像的入口点设置为 dotnet，并将 backend.dll 作为参数传递

然后保存dockerfile文件，打开命令行工具并导航到保存该文件的目录，运行命令去创建镜像，pizzabackend为镜像名
```csharp
docker build -t pizzabackend .
```
如果想启动该镜像，那么就可以使用命令
```csharp
docker run -it --rm -p 5200:80 --name pizzabackendcontainer pizzabackend
```

### 示例文件

官方的dockerfile文件
```csharp
#引用基础镜像，起一个别名base
FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-buster-slim AS base   
#设置工作目录为/app
WORKDIR /app
#对外暴露端口为80
EXPOSE 80
 
#引用基础镜像，起一个别名build
FROM mcr.microsoft.com/dotnet/core/sdk:3.1-buster AS build
#设置工作目录为/src
WORKDIR /src
#将指定文件拷贝到指定目录
COPY ["Demo/Demo.csproj", "Demo/"]
#恢复项目的依赖项和工具 相当于平时vs还远nuget包
RUN dotnet restore "Demo/Demo.csproj"
#拷贝当前文件夹的文件到容器/src目录
COPY . .
#设置当前工作目录
WORKDIR "/src/Demo"
#以Release形式生成项目及其依赖项到容器/app/build目录
RUN dotnet build "Demo.csproj" -c Release -o /app/build
#江商贸的build作为基础镜像，又重命名为publish
FROM build AS publish
#编辑应用程序、读取依赖项并且将生成的文件集发布到容器/app/publish目录
RUN dotnet publish "Demo.csproj" -c Release -o /app/publish
#将上面base作为基础镜像又重命名为final
FROM base AS final
#设置容器的工作目录为/app
WORKDIR /app
#拷贝/app/publish目录到当前工作目录
COPY --from=publish /app/publish .
#指定容器入口命令，容器启动时候就会运行dotnet Demo.dll
ENTRYPOINT ["dotnet", "Demo.dll"]
```
示例：适用于还未发布的项目（需要安装sdk，需要在构建过程中直接对源码进行编译并发布）
```csharp
#基于`microsoft/dotnet:latest` 最新版来构建我们的镜像
FROM microsoft/dotnet:latest
#设置工作目录为 `/app` 文件夹，即容器启动默认的文件夹
WORKDIR /app
#拷贝宿主机当前目录的内容到容器的app文件夹
COPY /. /app
#还原nuget包
RUN dotnet restore
#编辑并发布程序集到容器的out目录
RUN dotnet publish -o /out -c Release
#设置对外暴露的端口
EXPOSE 5000
#容器启动时候执行dotnet命令
ENTRYPOINT ["dotnet", "/out/CoreForDocker.dll"]
```
多阶段构建
```csharp
## 阶段一：build  
## 选择 SDK 镜像用于编译源码和生成发布文件  
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build  
WORKDIR /source  
## 复制源代码  
COPY *.csproj *.cs .  
## 生成发布文件  
RUN dotnet publish -c release -o /app  
  
## 阶段二：final  
## 使用 ASP.NET Core 运行时镜像  
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS final  
WORKDIR /app  
## 从 build 阶段复制生成好的发布文件  
COPY --from=build /app .  
ENTRYPOINT ["dotnet", "AspNetDemo.dll"]
```
> 为了提高性能，可以通过 .dockerignore文件排除上下文目录下不需要的文件和目录。


## 常用示例

### Excel操作

Excel导出需要对dockerfile文件做一些处理，详情看下面内容

#### 普通镜像包

```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80

ENV TZ Asia/Shanghai
ENV DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=false

RUN apt-get update -y && apt-get install -y --allow-unauthenticated libgdiplus \
    && ln -s /usr/lib/libgdiplus.so /usr/lib/gdiplus.dll

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
```

#### alpine3.18镜像包

```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:6.0-alpine3.18 AS base
WORKDIR /app
EXPOSE 80

ENV TZ Asia/Shanghai
ENV DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=false

RUN apk update && apk add libgdiplus icu  \
    && ln -s /usr/lib/libgdiplus.so /usr/lib/gdiplus.dll 
# 安装字体
RUN apk add ttf-freefont
```

ttf-freefont 是一个提供一系列免费 TrueType 字体（TTF）的包。这些字体涵盖了多种字符集和风格，以及常用的符号和图标。安装此包通常是为了确保在容器环境中具备显示或处理多种文字类型的能力，特别是对于涉及图形界面、文档处理、网页渲染等场景的应用程序而言。通过提供广泛的语言支持和良好的可读性，ttf-freefont 能够提升应用程序的用户体验，并确保跨平台和跨语言的一致性表现。

### 安装字体

容器内没中文字体，安装中文字体，字体可以从C:\Windows\Fonts中获取ttc,ttf字体文件
```csharp
RUN apt-get update
RUN apt-get install -y --no-install-recommends libgdiplus libc6-dev 
RUN apt-get install -y fontconfig xfonts-utils
COPY fonts/  /usr/share/fonts/
RUN mkfontscale
RUN mkfontdir
RUN fc-cache -fv
```

免费可商用字体：[free-font](https://github.com/wordshub/free-font)

### 操作图片

安装libgdiplus，使用场景：验证码、导出excel等
```shell
RUN apt-get update -y && apt-get install -y --allow-unauthenticated libgdiplus && apt-get clean && ln -s /usr/lib/libgdiplus.so /usr/lib/gdiplus.dll

# 配置自定义源然后安装包
RUN sed -i -e "s@http://[^/]* @http://mirror.sy/debian-security @" -e "s@http://[^/]*/@http://mirror.sy/@" /etc/apt/sources.list && apt update && apt-get install libgdiplus -y && ln -s /usr/lib/libgdiplus.so /usr/lib/gdiplus.dll    
```


## 资料

命令详细教程：[https://www.cnblogs.com/ityouknow/p/8595384.html](https://www.cnblogs.com/ityouknow/p/8595384.html)
[https://mp.weixin.qq.com/s/3YwRusLjT2w6tfbISoCAHw](https://mp.weixin.qq.com/s/3YwRusLjT2w6tfbISoCAHw) | 全面详解 Dockerfile 文件！

 

