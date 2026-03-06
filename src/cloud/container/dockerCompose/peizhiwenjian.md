---
title: 配置文件
lang: zh-CN
date: 2023-09-24
publish: true
author: azrng
isOriginal: true
category:
  - cloud
tag:
  - 无
filename: peizhiwenjian
slug: gtrogb
docsId: '30405337'
---

## 说明
**Docker Compose需要搭配YAML文件使用，YAML 是一种数据序列化语言，适用于所有编程语言，后缀名为.yml**。

所以在进行实操前，需要大概的了解一下YAML的语法，不要慌，语法和Json的思路很像，大概了解一下，后续用到查文档就行啦。

### 简单说说语法

**YAML文件内容是通过空格的缩进来代表层次**，常用的数据类型有如下：

- **对象**：键值对集合；

  ```
  # yaml 对象语法
  testKey:testValue
  # Json 语法
  {"testKey":"testValue"}
  # yaml 嵌套对象
  testKey:{testKey1:testValue1,testKey2:testValue2}
  # Json 语法
  {"testKey":{"testKey1":"testValue1","testKey2":"testValue2"}}
  ```

- **数组**：一组按次序排列的数据；用-前缀表示。

  ```
  # yaml 数组语法
  -value1
  -value2
  -value3
  # Json 数组语法
  ["value1","value2","value3"]
  # yaml 数组行内语法
  testKey:[value1,value2]
  # Json 语法
  {"testKey":['value1','value2']}
  ```

- **纯量**：不可再分的值，包括字符串、整数、浮点数、日期、布尔值等。

  ```
  # yaml
  testKey:666
  # Json
  {testKey:666}
  # yaml
  isbool:true
  # Json
  {isbool:true}
  ```

常规的基本语法格式约定如下：

- 大小写敏感
- 使用空格缩进表示层级关系
- 缩进不允许使用tab，只允许空格
- 缩进的空格数不重要，只要相同层级的元素左对齐即可
- '#'表示注释

大概了解上面这些，关于日常Docker Compose用到的文件基本上够用了，如果有需要进阶的，可以去查查对应的语法。传送门：

https://yaml.org/spec/1.2.2/

https://www.runoob.com/w3cnote/yaml-intro.html

关于YAML文件内容中配置的命令和Dockerfile的命令差不多是一一对应的，稍后会简单说说。

### 实操撸文件

这里还是以一个WebApi为例，例中需要依赖Redis服务。

- **创建项目，编写例子**

  这里只是引入了一个Redis的缓存包，通过构造函数注入之后就可以直接用啦；编写了一个API接口TestCache。

  ![图片](/common/202212111150904.webp)

  这里还需要在Startup文件中注入相关服务，并指定Redis的连接地址，如下：

  ![图片](/common/202212111150980.webp)

  运行起来测试一下效果，如下：

  ![图片](/common/202212111151985.webp)

  Redis中也有值了，这里需要注意：存入Redis中的类型是Hash。

  ![图片](/common/202212111151628.webp)

- **编写Dockerfile文件**

  在项目根目录创建一个Dockerfile文件，内容如下：

  ![图片](/common/202212111151883.webp)

  关于Dockerfile中的内容这里就不细说了，之前有一篇文章专门分享的(点[这里](https://mp.weixin.qq.com/s?__biz=MzU1MzYwMjQ5MQ==&mid=2247485700&idx=1&sn=5b5625bde7ba831bd99946906fbd3615&chksm=fbf115d0cc869cc612e567f604ac8d1c233f739f8439df72f8bc7a194e501861efe225d44260&token=403152068&lang=zh_CN&scene=21#wechat_redirect))。这里的Dockerfile目的就是将我们的WebApi项目构建为镜像，和Redis没有关系，不过这里不是通过执行命令构建，而是通过Compose文件一起构建。

  注：这里记得将Dockerfile文件通过右键->属性->设置为始终复制，保证编译后的文件有最新文件

- **编写Compose文件**

  在项目根目录下创建docker-compose.yml文件，内容如下：

  ![图片](/common/202212111151285.webp)

  有了这个项目就可以一键启动了，这里需要稍微改一下我们原来的代码，如下：

  ![图片](/common/202212111151130.webp)

  注：这里记得将docker-compose.yml文件通过右键->属性->设置为始终复制，保证编译后的文件有最新文件。

### 体验一键启动

- **将项目先发布**，并拷贝到对应的服务器上，如下：

  ![图片](/common/202212111151952.webp)

  这里用的是我的阿里云服务器，拷贝文件如下：

  ![图片](/common/202212111151890.webp)

- **一键启动**

  在docker-compose.yml所在的目录下执行如下命令：

  ```
  docker-compose up
  ```

  下面是执行docker-compose up内部执行的步骤：

  ![图片](/common/202212111151662.webp)

  先是构建我们的程序，然后拉取依赖的Redis服务，并启动，最后启动我们的程序。(执行顺序和依赖有关系)；启动之后就可以根据docker-compose.yml文件中映射的端口访问了，如下：

  ![图片](/common/202212111151055.webp)

- **看看启动的容器名**

  ![图片](/common/202212111151701.webp)image-20211007165313310

  通过`docker ps -n 2` 查看最近启动的容器，容器的名字规则是：**`目录名_Compose文件中定义的服务名_序号`**，那小伙伴肯定会好奇为什么程序能通过myredis名字连接到redis，可以通过`docker inspect composetest_myredis_1`查看容器详情：

  ![图片](/common/202212111151741.webp)

  同样可以查看到API服务对应的容器也是用的composetest_default这个网络，这个网络是一个桥接模式，可以通过`docker network ls`看到，如下：

  ![图片](/common/202212111152075.webp)

- **docker compose常用命令**

  `docker-compose build`:构建或者重新构建服务

  `docker-compose up`:构建、启动容器，加上-d选项代表后台运行。

  `docker-compose ps`：列出所有通过Compose运行的容器

  ![图片](/common/202212111152347.webp)

  `docker-compose logs`：打印相关日志信息

  ![图片](/common/202212111152947.webp)

  `docker-compose stop/start/restart`d：可以指定服务停止、开始和重新启动

  docker-compose命令和docker的命令基本是一样的。

- **docker-compose.yml文件内容常用属性**

  **version**：指定 docker-compose.yml 文件的版本，一般都是用version 3；

  **services**：定义多个容器集合，有多少写多少；

  **build**：构建镜像，和`docker build`一样功效；

  **environment**：配置环境变量，和Dockerfile中ENV 关键字功能一样；

  ```
  # 设置环境变量
  environment:
    RACK_ENV: development
    SHOW: 'true'
  ```

  **expose**：暴露端口，和Dockerfile中的EXPOSE 关键字功能一样；

  ```
  expose:
    - "80"
    - "9999"
  ```

  **ports**：配置端口映射，和`docker run -p`一样功效

  ```
  ports:
   - "8080:80"
   - "6379:6379"
  ```

  **volumes**：指定卷挂载路径，与Dockerifle中的VOLUME 关键字功能一样

  ```
  volumes:
    - /var/lib/mysql
    - /opt/data:/var/lib/mysql
  ```

  **command**：覆盖容器启动后默认执行的命令，和Dockerfile文件中的CMD命令一样；

  ```
  command: bundle exec thin -p 3000
  ```

  **image**：指定要用的镜像，构建的时候会拉取。

  ```
  # 指定要使用redis镜像
  image: redis
  ```

上面列出了一些比较常用的，具体的可以参考官网：https://docs.docker.com/compose/compose-file/compose-file-v3/

代码地址如下：https://gitee.com/CodeZoe/microservies-demo/tree/main/DockerComposeDemo

## 网桥模型

docker引擎刚建立的时候，会新建一个docker0网桥（driver= bridge）， 新加入的容器默认都会加入这个网桥。
当执行docker-compose  up时：
① 创建名为 {project}_default 的网桥
② 定义的容器会加入{project}_default 网络。

## 网络配置

查看docker的网络列表

```sh
docker network ls
```

使用自定义网络：创建一个新的自定义网络，并将两个容器连接到该网络。这样，它们就可以通过容器名称进行通信。

```yaml
networks: 
  my-bridge:
    external: true
    driver: bridge
```

### docker-compose容器网络互通

使用docker-compose可以运行多个容器，创建一个公共的网络来让这些容器之间互相通信。

举例让多个容器都可以连接到mysql，创建一个公共网络mysql

```sh
docker network create mysql

# 查看网络列表
docker network ls
```

这个时候举例使用docker-compose创建一个mysql，且使用该mysql网络

```yaml
version: '3.8'

services:
  mysql8:
    container_name: mysql8
    image: mysql:8
    command: --default-authentication-plugin=mysql_native_password
    ports:
      - "3306:3306"
    environment:
      TZ: Asia/Shanghai
      MYSQL_ROOT_PASSWORD: 123456
    networks:
      - mysql

networks:
  mysql:
    external: true

# 自己手动创建公共网络mysql
# docker network create mysql
```

该代码指定了我们要创建的服务为mysql8，它使用最新的Mysql8镜像，并设置了Mysql的root密码。我们还将服务添加到了名为mysql的公共网络中，然后启动服务

```yaml
docker-compose up -d
```

下面就举例部署一个其他的服务，并将该服务也加入mysql网络

```yaml
version: '3.8'

services:
  wordpress:
    container_name: wordpress
    image: wordpress:latest
    ports:
      - "80:80"
    volumes:
      - ~/Docker/wordpress/html:/var/www/html
    environment:
      WORDPRESS_DB_HOST: mysql8:3306
      WORDPRESS_DB_USER: root
      WORDPRESS_DB_PASSWORD: 123456
      WORDPRESS_DB_NAME: sample
    # 连接mysql网络
    networks:
      - mysql

networks:
  mysql:
    external: true
```

该配置我们指定了mysql数据库，并且还设置了加入mysql网络，在文件的末尾，我们定义了mysql网络，并指定它的外部名称为mysql，这样我们的服务才能正确地连接到该网络，最后使用命令`docker-compose up -d`生成服务。



至此，成功地创建了一个公共网络mysql，并将我们的服务，如wordpress，连接到该网络中，实现了多docker-compose互通网络服务。

参考资料：https://www.chengzz.com/1124.html

## 脚本示例

```yaml
version: "3.4"

services:
  app:
    build: #告诉docker-compose怎样为每个服务构建镜像
      context: ./app
      dockerfile: Dockerfile
    expose:
      - "80"
    extra_hosts: #在容器内添加主机配置映射
      - "dockerhost:172.18.0.1"
    environment: #环境变量配置容器内时区
      TZ: Asia/Shanghai
    volumes: #数据映射
      - type: bind
        source: /mnt/eqidmanager/eqidlogs
        target: /app/eqidlogs
      - type: bind
        source: /home/huangjun/eqidmanager/applogs
        target: /app/logs
      - type: bind
        source: /home/huangjun/eqidmanager/EqidManager.db
        target: /app/EqidManager.db
    healthcheck: ## 配置了健康检查功能，使用docker内置的healthcheck指定轮询app内的健康检查端口
      test: ['CMD','curl','-f','http://localhost/healthcheck']
      interval: 1m30s
      timeout: 10s
      retries: 3
      start_period: 6s
    logging:
      options:
        max-size: "200k"
        max-file: "10"
  proxy:
    build:
      context: ./nginx
      dockerfile: Dockerfile
    ports:
      - "80:80"
    environment:
      TZ: Asia/Shanghai
    links: #意味着nginx启动时候会去启动app服务
　　　 - app
    logging:
      options:
        max-size: "200k"
        max-file: "10"
```
> - **services**多个服务
>    - driver 配置驱动
>    - options 可选配置
>    - **image** 镜像名称
>    - **build** 不使用镜像时候采用主动build镜像，构建哪个服务
>    - **environment** 设置容器中的环境变量
>    - **expose** 标示端口号
>    - **ports** 映射端口号到宿主机
>    - **volumes** 挂在目录到宿主机，存储docker持久化数据
>    - **depend_on** 规定service加载顺序，例如数据库服务需要在后台服务前运行
>    - **container_name** 容器名称
>    - **networks** 网络（自定义网络名称）
>    - **restart**  always每次docker启动时候重启
>    - **links** 连接目标容器（services下配置的名称）
>    - **privileged**: true：容器可获得root权限
>    - **logging**  日志选项
>    - **networks**配置自定义网络
