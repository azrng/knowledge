---
title: 常见概念
lang: zh-CN
date: 2021-06-30
publish: true
author: azrng
isOriginal: true
category:
  - cloud
tag:
  - 无
filename: concept
slug: gwghqg
docsId: '30728940'
---

可以基于镜像创建容器，也可以基于容器创建镜像。
从仓库拉取镜像，也可以将本地镜像推送到仓库。

## 镜像(Image)

Docker镜像是一个特殊的文件系统，包含了程序运行时候所需要的资源和环境。镜像不包含任何动态数据，其内容在构建之后也不会被改变。镜像就是模板，可以用来创建Docker容器，另外Docker提供了很简单的机制来创建镜像和更新现有的镜像，用户还可以直接从镜像仓库下载已经做好的镜像来直接使用。

### docker镜像加速原理

docker镜像实际上是由一层一层的文件系统组成的，这种层级文件系统就是UnionFS
![image.png](/common/1625064568269-4e28e7fe-cd4e-4033-a55f-34313c71839c.png)

> 图片来源自：[https://mp.weixin.qq.com/s/uVPhLmUp1fPW2vxGe_5axQ](https://mp.weixin.qq.com/s/uVPhLmUp1fPW2vxGe_5axQ)

当使用docker run启动镜像时候，实际上在镜像的顶部增加了一个新的可写层，这个可写层也叫做容器层。
![](/common/1625064661317-5f8bc597-e374-4ee2-ab0f-05cc96c55b2e.png)

> 图片来源自：[https://mp.weixin.qq.com/s/uVPhLmUp1fPW2vxGe_5axQ](https://mp.weixin.qq.com/s/uVPhLmUp1fPW2vxGe_5axQ)

总结：因为Docker镜像是分层的，因此在加载一个镜像的时候，会按照从底层到高层的顺序依次加载该镜像所需要的镜像层。在加载的过程中，如果当前镜像层已经存在，则会跳过当前镜像层。比如：已经下载过MySQL镜像，现在要下载Tomcat镜像，而这两个镜像都需要CentOS镜像层，那么下载Tomcat镜像的时候，就会跳过下载CentOS镜像层。

## 容器(Container)

容器就是运行镜像的，镜像和容器的关系，就像是面向对象程序设计中的类和实例一样，镜像是静态的定义，容器是镜像运行时的实体，容器可以被创建、启动、停止、删除、暂停等。每个容器都是互相隔离的，保证安全的平台，容器可以理解为简易版的Linux环境（包括root用户权限、镜像空间、用户空间和网络空间等）和运行再其中的应用程序。

## 仓库(Repository)

仓库就是存放镜像的地方，仓库中又包含了多个镜像，每个镜像有不同的标签，用来区分不同的镜像版本，仓库分为两种，公有和私有仓库，最大的公开仓库是Docker Hub，存放了数量庞大的镜像供用户下载，这里仓库的概念与Git类似，Registry可以理解为Github这样的托管服务。

## 数据卷

将宿主机的一个目录映射到容器的一个目录中。

### 为什么需要数据卷
数据的持久化，为了防止容器删除后数据丢失，所以需要将容器中的数据持久化到磁盘上。
方便操作，可以在宿主机中操作目录中的内容，容器内部映射的文件也会跟着改变。如果将数据存储于容器中，主机上的其他进程不方便操作这些数据。

### 数据卷持久化方式

#### bind mount
存在于主机系统中的任意位置，非 Docker 的进程或者 Docker 容器可能随时对其进行修改，存在潜在的安全风险。bind mount在不同的宿主机系统时不可移植的，比如Windows和Linux的目录结构是不一样的，bind mount所指向的host目录也不能一样。

#### volume
存于主机文件系统中的某个区域，由Docker管理文件目录（/var/lib/docker/volumes/）。非Docker进程不应该修改这些数据。卷是Docker中持久化数据的最好方式；

#### tmpfs mount
存于内存中，并不是持久化到磁盘。在容器的生命周期中，可以被容器用来存放非持久化的状态或敏感信息;

### 操作

##### 创建数据卷
docker volume create 数据卷名称
创建数据卷之后，默认会存放在一个目录下 /var/lib/docker/volums/数据卷名词/——data

##### 查看数据卷的详细信息
docker volume inspect 数据卷名称

##### 查询全部的数据卷
docker volume ls

##### 删除数据卷
docker volume rm 数据卷名称

##### 应用数据卷
```yaml
#当你映射数据时候，如果数据卷不存在，docker会帮你自动创建，会将容器内部自带的文件，存储在默认的存放路径中
docker run -v 数据卷名称:容器内部的路径 镜像ID
#直接指定一个路径作为数据卷的存放位置，这个路径下是空的，需要手动添加
docker run -v 路径:容器内部的路径 镜像ID
```

### 保存数据
#### 手动保存数据

通常手动有两种方式，一是通过命令就行拷贝，二是将容器提交为镜像。接下来通过拉取centos镜像，运行演示

- **通过命令形式**

  主机和容器之间可以通过命令进行数据拷贝，也就是说，在容器删除之前可以先进行数据拷贝，如下：

  ![图片](/common/202212111147439.webp)

  命令简述：`docker run -it --name="mycentos" centos /bin/bash`，直接根据镜像centos以交互模式启动容器，容器名称为mycentos，在容器内部执行/bin/bash命令进入到终端；具体命令在[Docker小白到实战之常用命令演示，通俗易懂](http://mp.weixin.qq.com/s?__biz=MzU1MzYwMjQ5MQ==&mid=2247485629&idx=1&sn=506fae15e0c583f0a76d5c4145dbf83a&chksm=fbf11469cc869d7fae9c795ecf099a0babb62094fcb5b94b361ca131ae0323f57f46f55e79e3&scene=21#wechat_redirect)这篇文章中已经详细说明；这里简单回顾一下根据镜像启动容器流程，如图：

  ![图片](/common/202212111147429.webp)

  上图简述：**在Docker执行启动命令时，会先从本地查找镜像，如果没有，就会去远程仓库搜索并拉取到主机，然后主机就可以根据镜像启动容器；如果远程仓库也没有找到镜像，那么就报错**。

  好了，回到今天的话题，接着说拷贝数据；

  现在通过centos镜像启动了一个容器(Linux系统)，在上面创建一些文件进行测试，如下：

  ![图片](/common/202212111148475.webp)

  现在如果将容器删除，里面对应的数据也会删除，所以需要将对应的数据拷贝到主机上，如下：

  ![图片](/common/202212111148238.webp)

  `docker cp bfb96a6afdbc:/usr/TestData /usr/TestDataHost`命令解析:

- 语法：**docker cp SRC_PATH DEST_PATH**

- **bfb96a6afdbc:/usr/TestData**对应的就是**SRC_PATH** ，表示源头，即需要拷贝的目录或文件；**bfb96a6afdbc**这是容器ID，通过这种方式限定是某个容器内的数据文件；

- **/usr/TestDataHost**对应的就是**DEST_PATH**，表示目标，即拷到什么地方；

  按照上面的语法规则，同样可以将主机上的数据文件拷贝到指定容器中，只是调换一下**SRC_PATH** 和**DEST_PATH**的位置即可，如下：

  ![图片](/common/202212111148376.webp)

- **将容器提交为镜像的方式**

  这种方式只能勉强说是一种备份，只是**通过`docker commit`命令将容器提交为镜像，从而达到备份数据的作用**；

  ![图片](/common/202212111148485.webp)

  但很明显能感觉到不灵活，数据还是在容器内。关于`docker commit`命令上次已经说过，这里就不重复截图啦。

以上两种方式都不是很好的选择，首先在时效上也不能及时备份，另外通过手动这种操作很明显效率不高，还容易出错；更重要的是苦了小伙伴们，所以必须把自动安排起来；手动这种方式，根据情况偶尔用用就可以啦。

#### 容器数据卷解放双手

##### 简单理解容器数据卷

**数据卷可以理解为目录或文件，设计目的就是为了数据的持久化和共享**；

**挂载数据卷的容器，称为数据卷容器**；数据卷完全独立于容器的生存周期，所以容器删除时，对应挂载的数据卷不会被删除。

**通过将容器内的目录挂载到主机上面，就可以让数据实时同步，不管是主机改动，还是容器里有变动，都会同步更新**。

##### 实操演示

这里先用命令的方式进行演示，关于Dockerfile中的应用会在后续的章节中说到。

`docker run`命令中**-v**的选项在上次没说，就是故意留到这里单独分享；直接在启动容器的时候挂载；语法主要有如下几种方式：

```
# 指定具体的主机路径和容器内的路径
docker run -v /宿主机路径:容器内路径 镜像名  
# 指定容器内的路径，docker默认自动指定主机路径
docker run -v 容器内路径 镜像名 
# 指定容器内的路径，并指定一个名字，主机路径docker自动指定
docker run -v 卷名:容器内路径 镜像名 
```

- **匿名挂载**：在挂载时不指定名称，会自动生成一个名称

  **指定主机目录**

  ![图片](/common/202212111148941.webp)

  命令解析如下图：

  ![图片](/common/202212111148082.webp)

  ```
  # docker run -it --name="容器名称" -v 主机绝对路径:容器绝对路径 镜像名称
  docker run -it --name="TestVolumeCentos" -v /usr/TestDataHost/DataVolumeTest:/usr/TestVolumeData centos
  ```

  现在已经将容器内的目录挂载到主机上，接下来感受一下数据同步：

  ![图片](/common/202212111148974.webp)

  通过上图演示可以看到，**不管是在主机还是在容器中修改数据，都能及时同步更新；容器停止之后，主机更新数据，容器再启动，修改的数据也会同步到容器；容器删除，挂载的数据不会被删除，还是在主机中**，这就是我们想要的。

  可以通过`docker inspect 容器`命令查看容器的详细信息，其中就有挂载卷的详细信息，如下部分截图：

  ![图片](/common/202212111148172.webp)

  **不指定主机目录**

  很多时候，我们不喜欢自己指定主机目录，而是由Docker自动指定，所以通常我们只指定容器内目录，如下：

  ![图片](/common/202212111148378.webp)

  看看Docker指定的主机路径在哪，还是通过`docker inspect 容器ID`查看详情，如下：

  ![图片](/common/202212111148152.webp)

  看看刚才在容器操作的文件数据是否同步过来：

  ![图片](/common/202212111148098.webp)

  默认情况，docker都会将挂载的主机目录指定到如上图的目录中。

  可以通过`docker volume ls`查看主机挂载的数据卷信息，如下：

  ![图片](/common/202212111148870.webp)

  通过上图可以看到，名称不直观，看不懂，所以更多时候都会在挂载的时候指定一个名称，即具名挂载。

- **具名挂载**：在挂载时指定一个名称。

  ![图片](/common/202212111148779.webp)

  这里除了挂载的时候是指定名称挂载，之后的操作和效果都一样，这里就不重复截图了；需要注意的是这种方式和指定主机的命令很像，指定路径那种形式，冒号前面是路径，如下：

  ![图片](/common/202212111148426.webp)image-20210825175448280

##### 容器间传递数据

**数据卷其实还可以通过容器继承方式进行挂载，从而实现容器之间的数据共享**，如下：

![图片](/common/202212111148286.webp)

关键命令解析：

- 先启动一个具名挂载的容器TestVolumesFromCentos，如下命令：

  ```
  docker run -it --name="TestVolumesFromCentos" -v testVolumesFrom:/usr/TestVolumeData centos
  ```

- 在启动另一个容器TestVolumesFromCentos2，挂载卷继承于TestVolumesFromCentos，如下命令：

  ```
  docker run -it --name="TestVolumesFromCentos2" --volumes-from TestVolumesFromCentos centos
  ```

  **--volumes-from 后指定继承于哪个容器**。

现在不管在哪个容器中变更数据，都会实时同步到其他容器中，从而达成了容器数据的共享和实时同步。

通过`docker inspect 容器ID`看两个容器的挂载详情都一样，截其中一个容器如下：

![图片](/common/202212111148560.webp)

其实在指定挂载的时候还可以限制容器的操作权限，比如在容器内的挂载目录下，可以限制容器内只读或可读写，如下：

![图片](/common/202212111148937.webp)

**ro：代表只读；**

**rw：代表读写；**

好了，关于容器数据卷就说到这吧，是不是听起来名字高大上，其实就是对文件或目录的操作。

##### redis安装实战

关于Redis安装在Docker中很简单，直接执行命令即可，由于之前拉取过redis的镜像，所以就直接启动容器了，如果本地没有镜像，就会去远程仓库拉取。

![图片](/common/202212111148597.webp)

![图片](/common/202212111149257.webp)

上图中可以看到，默认情况下，redis的镜像将容器内的/data目录挂载到这个主机上，而这个目录就是redis数据存放的目录，这样就达到Redis的持久化。

对于Redis而言，很多时候需要修改配置文件，总不能每次修改都要到容器内更改，我们可以将配置文件放在已挂载的目录中，然后指定启动，也可以另外针对配置文件再加一个挂载，如下：

**执行命令前，需要将配置文件提前放在主机的这个/usr/TestDataHost/redisconf目录中**。

```
docker run -d -v /usr/TestDataHost/redisconf:/usr/local/etc/redis --name myredisconfigtest redis redis-server /usr/local/etc/redis/redis.conf
```

通过`docker inspect 容器`看看挂载情况，如下：

通过挂载之后，如果需要修改配置文件，只需要在主机上修改配置文件内容即可。

## 网络

### Docker网络模式简介

**当Docker进程启动时，会在主机上创建一个名为docker0的虚拟网桥，此主机上启动的Docker容器默认会连接到这个虚拟网桥上**。这样所有容器通过这个虚拟网桥就打通了，所以这里的docker0工作方式和物理交换机很像。

在主机上可以执行命令`ip link show docker0`查看：

![图片](/common/202212111149664.webp)

**Docker在启动容器时可以指定网络模式，如果不指定，默认就是采用Bridge模式**；Docker的网络模式有如下几种：

- **Bridge(桥接)模式**：默认的网络模式，比较适用于在同一Docker Daemon主机上运行的容器，**用户也可以自定义bridge网络，优于默认的bridge网络**；如果需要不同Docker主机进行通信，可以通过操作系统网络配置，也可以使用Overlay模式。
- **Host模式**：和宿主机共用一个Network Namespace。即容器不会虚拟出自己的网卡和配置自己的IP等，而是使用宿主机的IP和端口；
- **Overlay模式**：覆盖网络可以将多个 Docker Daemon主机连接在一起，并使 swarm 服务能够相互通信；也可以让Docker Daemon主机上的两个独立容器进行通信。
- **Macvlan模式**：Macvlan 网络允许为容器分配 MAC 地址，使其在网络上显示为物理设备。Docker Deamon通过容器的 MAC 地址将流量路由到容器。
- **None模式**：Docker容器拥有自己的Network Namespace，但是并不为容器进行任何网络配置。即容器没有网卡、IP、路由等信息。**需要单独为Docker容器添加网卡、配置IP**；

Docker在启动容器的时候可以通过**--net**指定网络模式，不指定，默认就是bridge模式，如下：

```
# --net指定网络模式，这里指定为host模式
docker run -d --name testnet --net host nginx
# 通过docker inspect 容器 看网络细节，如下图
docker inspect testnet
```

![图片](/common/202212111150044.webp)

### Bridge默认模式了解一下

这里就以默认的Bridge(桥接)展开来说说，其他模式后续根据应用场景再具体细说。

这里主要看看主机和容器之间的网络、容器和容器之间的网络。

在Bridge模式下，**当启动容器时，Docker会分配一个IP给容器，并设置docker0的IP地址为容器的默认网关**；这个时候会在主机上创建一对虚拟网卡veth pair设备接口，Docker将veth pair设备的一端配置在新启动的容器中，并命名为eth0@ifxxx（容器的网卡），另一端在主机中以veth***@ifxxx这样类似的名字命名，并将这个网络设备加入到docker0网桥中。

容器没有启动时主机的网络配置如下：

![图片](/common/202212111150181.webp)

当启动容器时，Docker主机就会创建一对虚拟网卡vethpair设备接口，如下：

![图片](/common/202212111150682.webp)

可以进入到容器看看IP分配情况，如果`ip addr`命令在容器内找不到，那是因为基础镜像只包含核心命令，如果要执行其他命令，需要额外安装。可以在容器内执行如下命令进行安装。

```
apt update && apt install -y iproute2
```

安装好之后，就可以查看容器内的IP情况了，如下：

![图片](/common/202212111150302.webp)

这里有没有发现容器内的IP是和主机多出来的虚拟网卡是成对出现，这样主机网络和容器之间肯定能通；

![图片](/common/202212111150664.webp)

当然容器内部也可以ping通主机。

**那容器之间能不能访问呢？**

容器内ping命令也找不到，需要进行安装，执行如下命令：

```
apt update && install iputils-ping
```

这里新启动一个容器mynginx2，IP内部分配如下：

![图片](/common/202212111150268.webp)

**mynginx容器内能ping通mynginx2，那是因为两个容器之间共用了docker0，通过docker0进行转发**。

![图片](/common/202212111150806.webp)

大概一个网络流程如下：

![图片](/common/202212111150983.webp)

这里的Docker0就好比是交换机，形成了网络桥梁。

### 如何能通过容器名进行访问

默认情况，容器间的访问只能通过IP，不能通过容器名访问；

![图片](/common/202212111150971.webp)

这种情况对于线上项目很不灵活，比如数据库备份需要临时迁移，IP可能会不一样，所以项目中的地址要重新配置，如果能通过容器名访问，那么就不用操心更换啦，只要容器名一样即可，就好比域名和IP的关系一样，IP再怎么变，域名不变就行。

### 通过--link方式

新启动一个容器mynginx3，如下：

```
# 通过--link关联 mynginx容器
docker run -d --name mynginx3 --link mynginx nginx
```

容器启动之后，可以进入到容器测试：

```
# 进入容器
docker exec -it mynginx3 /bin/bash 
# 安装ping工具
apt update && apt install iputils-ping
```

![图片](/common/202212111150964.webp)

内部原理其实是在mynginx3内部做了个映射配置，容器mynginx3的hosts内容如下：

![图片](/common/202212111150663.webp)

这样只能在容器mynginx3内部通过mynginx容器名ping通，不能在mynginx内部通过容器名mynginx3访问，如果要达到同样的效果，就得在启动mynginx时通过--link和mynginx3关联起来。

![图片](/common/202212111150226.webp)

如果每个容器都这样的显示指定的话，感觉就有点麻烦啦，通常的做法都是通过自定义网络方式来达到这个目的。

### 通过自定义网络方式

首先新创建一个网络，如下：

![图片](/common/202212111150902.webp)

命令解析：

```
# --driver 指定网络模式，这里为bridge桥接模式
# --subnet 指定子网IP  192.168.0.0/16
# --gateway 指定网关 192.168.0.1
# my-net 创建的网络名
docker network create --driver bridge --subnet 192.168.0.0/16 --gateway 192.168.0.1 my-net
# 显示网络
docker network ls
```

让启动的容器使用自定义的网络，即在启动容器时使用**--net**指定即可：

![图片](/common/202212111150293.webp)

**启动容器时不需要--link，只需要接入到自定义网络就可以通过容器名ping通了**，如下：

![图片](/common/202212111150820.webp)

**自定义网络之所以能通过容器名ping通，那是容器内运行了一个本地DNS解析器，该解析器将请求转发到Docker内部DNS服务器当中，DNS服务器中记录了容器启动时通过--name或--net-alias参数指定的名称与容器之间的关系**。

另外还有一个点，现在分配给容器的IP是按照预先设置的子网范围进行分配的，而不是默认的docker0子网范围，执行如下命令看详细：

```
# 看容器详细信息
docker inspect testmynetnginx1
```

![图片](/common/202212111150416.webp)

### 网络常用命令

```shell
# 查看当前网络模型
docker network ls

# 创建自定义网络，并将两个容器连接到该网络。这样，它们就可以通过容器名称进行通信。
docker network create --driver bridge my-bridge

```



docker-compose中设置网络

```yaml
networks: 
  my-bridge:
    external: true
    driver: bridge

networks: 
  - my-bridge
```

* my-bridge网络配置方式1（带有external: true）：external: true表示这个网络是由外部创建的，不是通过Docker创建的。
  这意味着my-bridge网络已经存在，可能是由其他方式（例如，命令行或其他工具）创建的。在这种情况下，Docker将重用现有的网络而不是创建新的网络。通常情况下，外部网络的配置参数是在其他地方定义的，而不是在同一个docker-compose.yml文件中定义的。

* my-bridge网络配置方式2（只有driver: bridge）：driver: bridge表示创建一个名为my-bridge的Docker桥接网络。此网络是由Docker创建的，用于连接同一docker-compose.yml文件中的其他服务容器。在这种情况下，Docker会在启动容器时自动创建这个网络，并为容器分配一个IP地址。

* 区别：配置方式1中的external: true表示使用一个已经存在的外部网络，而配置方式2是创建一个新的桥接网络。配置方式1适用于与其他项目或工具集成的情况，而配置方式2适用于在同一docker-compose.yml文件中创建内部网络。在某些情况下，使用现有的外部网络可能比创建新的内部网络更方便。例如，如果您正在处理多个项目，并且这些项目都使用同一个网络，那么使用外部网络可以减少网络管理的复杂性。

此外，在Docker Compose中，使用外部网络还可以将多个docker-compose.yml文件连接到同一个网络中，从而实现容器之间的通信。因此，如果您已经有一个存在的外部网络并且符合您的需求，那么使用带有external: true选项的my-bridge网络配置方式是可行的，也可以避免不必要的网络管理和配置。但是，如果您需要更细粒度的控制和管理，则应该选择创建新的内部网络。

## 参考文档

既然遇见不如同行：[https://mp.weixin.qq.com/s/h4x3bx6njDnfSYvHIPxqvA](https://mp.weixin.qq.com/s/h4x3bx6njDnfSYvHIPxqvA)
微信公众号【Code综艺圈】

docker加入网络：https://www.cnblogs.com/nicaicai/p/17768368.html

