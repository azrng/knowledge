---
title: Docker常用命令
lang: zh-CN
date: 2023-05-08
publish: true
author: azrng
isOriginal: true
category:
  - cloud
tag:
  - 无
filename: dockerchangyongmingling
slug: hspv90
docsId: '29454090'
---

## 1. Docker容器信息
```yaml
## 查看docker容器版本
docker version
## 查看docker容器信息
docker info
## 查看docker容器帮助文档
docker --help
```

## 2. 镜像操作

### 2.1 镜像信息
```yaml
## 列出本地images
docker images
## 含中间映像层
docker images -a
## 只显示镜像ID
docker images -q
## 含中间映像层
docker images -qa
## 显示镜像摘要信息(DIGEST列)
docker images --digests
## 显示镜像完整信息
docker images --no-trunc
## 查看镜像的分层
docker image inspect kklldog/agile_config
```

### 2.2 镜像搜索
```yaml
## 搜索仓库MySQL镜像
docker search mysql
## --filter=stars=600：只显示 starts>=600 的镜像
docker search --filter=stars=600 mysql
## --no-trunc 显示镜像完整 DESCRIPTION 描述
docker search --no-trunc mysql
## --automated ：只列出 AUTOMATED=OK 的镜像
docker search  --automated mysql
```

### 2.3 镜像下载
```yaml
## 下载Redis官方最新镜像，采用分层下载方式，相当于：docker pull redis:latest
docker pull redis
## 指定版本下载
docker pull mysql:5.7.26
## 下载仓库所有Redis镜像
docker pull -a redis
## 下载私人仓库镜像
docker pull bitnami/redis
```

### 2.4 镜像删除
```shell
# 删除镜像
docker rmi 镜像ID

# 批量删除镜像
docker rmi 镜像id 镜像ID

# 删除未被使用的镜像
docker image prune -a

# 删除全部的镜像
docker rmi $(docker images -ap)
```

### 2.5 构建镜像
生成镜像的方式
第一：本地发布，拷贝到服务器，build生成镜像
第二：本地发布，然后本地build，推送到仓库，服务器拉取
第三：服务器拉取代码，然后服务器发布，再build
```yaml
## 构建docker镜像
docker build -f /docker/dockerfile/mycentos -t mycentos:1.1
```
> -f 指定文件地址


### 2.6 镜像清理
你可以通过原生的多种 prune 命令来清理垃圾，比如
```shell
docker image prune ## 清理镜像
docker container prune ## 清理容器
docker volume prune ## 清理卷
docker builder prune ## 清理构建缓存

# 删除所有未被使用的镜像
docker image prune -a
```

### 2.7 镜像其他操作
```yaml
## 导出镜像
docker save -o 导出路径 镜像ID
## 加载本地镜像
docker load -i 镜像文件
## 修改镜像名称
docker tag 镜像ID  镜像新名称:版本

示例：
docker load -i cda.tar 进行导入
docker save cda:latest -o cda.tar  导出
```

## 3. 容器操作

### 3.1 容器启动
```shell
# 新建并启动容器，参数：-i  以交互模式运行容器；-t  为容器重新分配一个伪输入终端；--name  为容器指定一个名称
docker run -i -t --name mycentos

# 后台启动容器，参数：-d  已守护方式启动容器
docker run -d mycentos

docker run 镜像的标识|镜像名词[:tag]
docker run -it --rm -p 80:80 --name mydocker
docker run -d -p 宿主机端口:容器端口 --name 容器名称 镜像的标识|镜像名称[:tag]

docker run -d --name netcorestudy -p 8080:80 netcorestudy

# 运行容器1，并连接到自定义网络
docker run -d --name container1 --network mynetwork image1

# 运行容器2，并连接到自定义网络
docker run -d --name container2 --network mynetwork image2
```
> -d：代表使用后台交互方式
> -it 使用交互方式，进入到容器内部
> -p：宿主机端口:容器端口：为了映射当前linux的端口和容器的端口
> -P  随机指定端口;
> --name 容器名词：指定容器的名称
> -rm 代表容器停止自动删除容器
> -t：代表以交互模式启动，并为容器重新分配一个伪输入中断


### 3.2 容器日志
```shell
# 查看容器日志，默认参数
docker logs container_name/container_id

# 查看redis容器日志，参数：-f 跟踪日志输出；-t 显示时间戳；--tail  仅列出最新N条容器日志；
docker logs -f -t --tail=20 redis

# 查看实时日志
docker logs -f container_name/container_id

# 查看容器redis从2019年05月21日后的最新10条日志。
docker logs --since="2019-05-21" --tail=10 redis

# 查看指定时间后的日志，只显示最后100行：
docker logs -f -t --since="2019-06-08" --tail=100 CONTAINER_ID

# 查看某时间之后的日志：
docker logs -t --since="2019-06-08" CONTAINER_ID

# 查看某时间段日志：
docker logs -t --since="2019-06-08" --until "2019-06-09" CONTAINER_ID

# 查看最近30分钟的日志:
docker logs --since 30m CONTAINER_ID
```

### 3.3 容器进入与退出
```shell
# 进入容器
docker exec -it container_name/container_id bash
# 退出容器
exit

# 仅退出容器，不关闭
# 快捷键：Ctrl + P + Q

# 直接进入centos 容器启动命令的终端，不会启动新进程，多个attach连接共享容器屏幕，参数：--sig-proxy=false  确保CTRL-D或CTRL-C不会关闭容器
docker attach --sig-proxy=false centos 

#在 centos 容器中打开新的交互模式终端，可以启动新进程，参数：-i  即使没有附加也保持STDIN 打开；-t  分配一个伪终端
docker exec -i -t  centos /bin/bash

# 以交互模式在容器中执行命令，结果返回到当前终端屏幕
docker exec -i -t centos ls -l /tmp

# 以分离模式在容器中执行命令，程序后台运行，结果不会反馈到当前终端
docker exec -d centos  touch cache.txt 
```

### 3.4 查看容器
```shell
## 查看正在运行的容器
docker ps
## 查看正在运行的容器的ID
docker ps -q
## 查看正在运行+历史运行过的容器
docker ps -a
## 显示运行容器总文件大小
docker ps -s
```

### 3.5 容器的停止与删除
```shell
##停止一个运行中的容器
docker stop redis
##杀掉一个运行中的容器
docker kill redis
##删除一个已停止的容器
docker rm redis
##删除一个运行中的容器
docker rm -f redis
##删除多个容器
docker rm -f $(docker ps -a -q)
docker ps -a -q | xargs docker rm
### -l 移除容器间的网络连接，连接名为 db
docker rm -l db 
### -v 删除容器，并删除容器挂载的数据卷
docker rm -v redis

启动容器：docker start container_name/container_id
停止容器：docker stop container_name/container_id
强制停止容器：docker kill 容器id
重启容器：docker restart container_name/container_id
重启所有容器：docker restart $(docker ps -a)
删除容器：docker rm container_name/container_id
删除正在运行的容器：docker rm -f 容器id
删除全部容器：docker rm $(docker ps -a)
```

### 3.6 根据容器生成镜像
```shell
### 基于当前redis容器创建一个新的镜像
docker commit -m="描述的信息"   -a="作者"  容器Id  TAG标签
docker commit -a="DeepInThought" -m="my redis" [redis容器ID]  myredis:1.0

## 启动
docker run -d -it --name myredis myredis:1.0

-- 生成的时候删除老的
docker run --rm --name gitlabnet5sample -d -p 8060:80 gitlabnet5sample
```
> 参数：
> -a 提交的镜像作者；
> -c 使用Dockerfile指令来创建镜像；
> -m :提交时的说明文字；
> -p :在commit时，将容器暂停


### 3.7 容器与主机间的数据拷贝
```shell
# 将rabbitmq容器中的文件copy至本地路径
docker cp container_name/container_id:/[container_path] [local_path]
# 示例
docker cp 2a202fa:/usr/share/elasticsearch/plugins/ ./es/es-with-ik-plugins/

# 将主机文件copy至rabbitmq容器
docker cp [local_path]  container_name/container_id:/[container_path]/

# 将主机文件copy至rabbitmq容器，目录重命名为[container_path]（注意与非重命名copy的区别）
docker cp [local_path]  container_name/container_id:/[container_path]
```

### 3.8 删除容器
```shell
docker rm -f container_name/container_id

# 停止并删除所有容器
docker stop $(docker ps -aq) && docker rm $(docker ps -aq)
```

### 3.9 其他操作
```shell
查询当前进程中包含dotnet关键词的进程：ps -ef | grep dotnet
限制镜像使用的内存：docker run -itd -p hostPort:containerPort --name 别名 -m 200m container_name/container_id
限制镜像使用的 cpu 数目：docker run -itd -p hostPort:containerPort --name 别名 --cpus 1 container_name/container_id
## 查看容器的进程信息
docker top 
## 查看镜像的元数据
docker inspect 
```

## 内存限制
Docker 提供的内存限制功能有以下几点：
1、容器能使用的内存和交换分区大小。
2、容器的核心内存大小。
3、容器虚拟内存的交换行为。
4、容器内存的软性限制。
5、是否杀死占用过多内存的容器。
6、容器被杀死的优先级

```csharp
-m,--memory     内存限制，格式是数字加单位，单位可以为 b,k,m,g。最小为 4M
--memory-swap   内存+交换分区大小总限制。格式同上。必须必-m设置的大
--memory-reservation    内存的软性限制。格式同上
--oom-kill-disable      是否阻止 OOM killer 杀死容器，默认没设置
--oom-score-adj         容器被 OOM killer 杀死的优先级，范围是[-1000, 1000]，默认为 0
--memory-swappiness     用于设置容器的虚拟内存控制行为。值为 0~100 之间的整数
--kernel-memory         核心内存限制。格式同上，最小为 4M
```
用户内存限制就是对容器能使用的内存和交换分区的大小作出限制。
使用时要遵循两条直观的规则：
```csharp
-m，--memory选项的参数最小为 4M。
--memory-swap不是交换分区，而是内存加交换分区的总大小，所以--memory-swap必须比-m,--memory大。
```

## CPU限制
docker run命令和 CPU 限制相关的所有选项如下：
```csharp
--cpuset-cpus=""          允许使用的 CPU 集，值可以为 0-3,0,1
-c,--cpu-shares=0   CPU     共享权值（相对权重）
cpu-period=0              限制 CPU CFS 的周期，范围从 100ms~1s，即[1000, 1000000]
--cpu-quota=0             限制 CPU CFS 配额，必须不小于1ms，即 >= 1000
--cpuset-mems=""          允许在上执行的内存节点（MEMs），只对 NUMA 系统有效
```
其中--cpuset-cpus用于设置容器可以使用的 vCPU 核。-c,--cpu-shares用于设置多个容器竞争 CPU 时，各个容器相对能分配到的 CPU 时间比例。--cpu-period和--cpu-quata用于绝对设置容器能使用 CPU 时间。

## 缓存限制
尝试 builder 的 GC，这样就不会在本地保留构建太多缓存了。你可以通过修改 docker deamon 的配置文件来开启这个功能
```csharp
{
  "builder": {
    "gc": {
      "enabled": true,
      "defaultKeepStorage": "10GB",
      "policy": [
        { "keepStorage": "10GB", "filter": ["unused-for=2200h"] },
        { "keepStorage": "50GB", "filter": ["unused-for=3300h"] },
        { "keepStorage": "100GB", "all": true }
      ]
    }
  }
}
```
文章：[https://docs.docker.com/build/cache/garbage-collection/](https://docs.docker.com/build/cache/garbage-collection/)

### 日志限制
文章：[https://mp.weixin.qq.com/s/EILo24D92Y7YPLBxQpO6Cg](https://mp.weixin.qq.com/s/EILo24D92Y7YPLBxQpO6Cg)
