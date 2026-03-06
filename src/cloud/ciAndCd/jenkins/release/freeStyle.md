---
title: 构建自由风格任务
lang: zh-CN
date: 2021-06-27
publish: true
author: azrng
isOriginal: true
category:
  - cloud
tag:
  - 无
filename: freeStyle
slug: noa3fg
docsId: '32711347'
---
> 实现目的：通过jenkins在服务器部署一个简单的.Net程序


## 1. 登录并创建任务
输入任务名称并选择构建一个自由风格的任务
![image.png](/common/1624730955330-564e6e0f-b89e-4720-a4cd-43136753aec8.png)

## 2. 配置

### 2.1 常规
设置描述和丢弃规则
![image.png](/common/1624731269367-be668e6d-0e82-480e-94de-9442020693bd.png)

### 2.2 源码管理
配置源代码和凭据
![image.png](/common/1624731497867-cff66d34-fad8-4888-bc15-f517fa1424e8.png)

### 2.3 构建触发器
![image.png](/common/1624731600568-e5a1a4dc-30a0-4366-99ac-eca5465bd2fa.png)

### 2.4 构建环境
设置每次构建的时候删除之前的文件(我主要是想保持文件最新，奈何没找到拉取代码的方式，参考文档里面有方法)
![image.png](/common/1624777591978-460a7ff2-654f-4067-a42a-c46dbd31ba1c.png)

### 2.5 构建
通过执行shell脚本来来构建
![image.png](/common/1624731664605-cd023e1c-af88-4be0-b194-76d62f13d89a.png)
通过编写shell脚本来部署.NetCore项目
```shell
image_tag=`date +%Y%m%d%H%M%S`;
echo $image_tag;

## build镜像并且打上tag  dockerfile路径根据不同项目地址不同
docker build -f ./Net5ByDocker/Dockerfile -t net5bydocker:$image_tag .;
docker images;

## 停止并删除旧版 net5bydocker 容器
CID=$(docker ps | grep "net5bydocker" | awk '{print $1}')
echo $CID
if [ "$CID" != "" ];then
  docker stop $CID
  docker rm $CID
fi

## 把刚刚build出来的镜像跑起来
docker run -p 8012:80 --name net5bydocker -d net5bydocker:$image_tag;
docker ps -a;
docker logs net5bydocker;
```
> 脚本参考自：[https://www.cnblogs.com/xiaoxiaotank/p/14762665.html](https://www.cnblogs.com/xiaoxiaotank/p/14762665.html)


### 2.6 构建后操作
![image.png](/common/1624731976317-34c56b36-b5aa-4aa8-bb43-f4d0cdad591d.png)

## 3. 开始构建 
点击保存后点击立即构建，就会在下面可以看到构建历史列表(出现蓝色代表构建成功，红色代表有问题)
![image.png](/common/1624777879835-1b27aa76-e67d-4c19-970d-6c6bc41d1da2.png)
构建完成后我们查看linux服务器是否已经有刚部署项目的容器
![image.png](/common/1624778314838-53227adc-9037-4752-8875-271f1b982d35.png)


### 2.3 查看输出
通过在指定的build ID下选择输出控制台查看详细信息
![image.png](/common/1624777991962-112f230d-92b1-4608-9489-cf644647412a.png)

### 2.4 默认工作目录
通过输出信息我们可以看到jenkins默认的工作目录是我们配置的目录
```bash
/var/jenkins_home/workspace/
```
![image.png](/common/1624778083657-db0fb380-43f7-47dd-89b9-5ccadd761e9f.png)

## 4. 预览效果
通过我们的shell配置，我们访问我们的swagger地址
```bash
http://192.168.1.14:8012/swagger/index.html
```
![image.png](/common/1624778166509-8aa42a2d-73e1-4e39-a170-c0fd964f5e1a.png)
调用接口发现可以查询到数据
![image.png](/common/1624778192446-1a2fafd9-1de3-401b-afde-cccf8036dbd5.png)
这点常见的错误就是连接数据库的地址配置有问题，如果这里有问题，可以通过命令去查看docker日志
```bash
docker logs 容器Id
```

## 5. 参考文档
> GitLab+Jenkins持续集成+自动化部署： [https://www.cnblogs.com/yanjieli/p/10613212.html](https://www.cnblogs.com/yanjieli/p/10613212.html)
> xiaoxiaotank：[https://www.cnblogs.com/xiaoxiaotank/p/14762665.html](https://www.cnblogs.com/xiaoxiaotank/p/14762665.html)

