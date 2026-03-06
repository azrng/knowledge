---
title: Minio
lang: zh-CN
date: 2023-10-15
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: minio
slug: oysc6o2ffu7t0wm1
docsId: '109691224'
---

## 概述
Minio 是一个基于Apache License v2.0开源协议的对象存储服务，虽然轻量，却拥有着不错的性能。它兼容亚马逊S3云存储服务接口，非常适合于存储大容量非结构化的数据。 
例如图片、视频、日志文件、备份数据和容器/虚拟机镜像等，而一个对象文件可以是任意大小，从几 kb 到最大 5T 不等。
官方文档：[http://docs.minio.org.cn/docs/master/minio-deployment-quickstart-guide](http://docs.minio.org.cn/docs/master/minio-deployment-quickstart-guide)

aws s3官网：[https://docs.aws.amazon.com/zh_cn/AmazonS3/latest/userguide/Welcome.html](https://docs.aws.amazon.com/zh_cn/AmazonS3/latest/userguide/Welcome.html)

## 概念

- Bucket（存储桶）：Bucket 是 Minio 的最顶层命名空间，类似于文件系统中的文件夹。在 Minio 中，你可以创建多个 Bucket 来组织和管理对象。
- Object（对象）：Object 是 Minio 存储的实际数据单元。每个 Object 可以是任意大小的文件，通常由文件内容、元数据和一个唯一标识符（Object Key）组成。
- Object Key（对象键）：Object Key 是每个 Object 的唯一标识符，用于区分不同的 Object。它类似于文件系统中的文件路径，由目录结构和文件名称组成，例如 "photos/2021/image.jpg"。
- Presigned URL（预签名URL）：Presigned URL 是一种带有临时访问权限的 URL，通过该 URL 可以让用户在一定时间内对特定的 Object 进行读取、写入、删除等操作。这对于授权临时访问非常有用，比如与其他用户共享文件或资源
-  Access Key 和 Secret Key（访问密钥）：Access Key 和 Secret Key 是用于身份验证的凭据。Access Key 用于标识用户或应用程序，而 Secret Key 则用于进行身份验证。这些凭据需要在使用 Minio 客户端或访问 Minio API 时进行配置。
- Region（区域）：Region 是用来表示存储桶（Bucket）在物理位置上的分布。Minio 支持将数据存储在不同的区域，以实现高可用性和数据冗余。
- Encryption（加密）：Minio 提供了对 Bucket 和 Object 的服务器端加密功能。可以使用客户端提供的加密选项，将数据在上传到 Minio 之前进行加密，以保证数据的机密性。
- Endpoint 对象存储服务的URL

## 使用

关于组件的使用可以使用AWSSDK.S3(因为都是支持s3协议)也可以直接使用Minio组件包

:::tip

基本的使用已经封装了nuget包，具体可以去查阅源码的中的内容。

:::

策略配置：[https://www.cnblogs.com/CKExp/p/15605367.html](https://www.cnblogs.com/CKExp/p/15605367.html)
官网策略配置：[https://docs.aws.amazon.com/zh_cn/AmazonS3/latest/userguide/access-policy-language-overview.html](https://docs.aws.amazon.com/zh_cn/AmazonS3/latest/userguide/access-policy-language-overview.html)

## 安装
老版本和新版本界面差距还是挺大的，如果想用来老版本的，可以选择镜像：image: minio/minio:RELEASE.2021-06-17T00-10-46Z

### docker
```bash
docker run -p 9000:9000 -p 9090:9090 \
     --net=host \
     --name minio \
     -d --restart=always \
     -e "MINIO_ACCESS_KEY=minioadmin" \
     -e "MINIO_SECRET_KEY=minioadmin" \
     -v /home/minio/data:/data \
     -v /home/minio/config:/root/.minio \
     minio/minio server \
     /data --console-address ":9090" -address ":9000"
```

### docker-compose
```yaml
  win_minio: 
    container_name: win_minio
    image: minio/minio
    command: server /data --console-address ":9001"
    ports: 
      - "9000:9000"
      - "9001:9001"
    environment: ## 账号长度必须大于等于5，密码长度必须大于等于8位
      - MINIO_ROOT_USER=admin
      - MINIO_ROOT_PASSWORD=123456789 
    volumes: 
      - D:\docker-data\minio:/data ## 持久化地址
  
  linux_minio: 
    container_name: linux_minio
    image: minio/minio
    command: server /data --console-address ":9001"
    restart: always
    ports: 
      - "9000:9000"
      - "9001:9001"
    environment: 
      - MINIO_ROOT_USER=admin
      - MINIO_ROOT_PASSWORD=123456789
    volumes: 
      - /data:/data ## 持久化地址
```
老版本的
```yaml
  old_win_minio:  ## 更熟悉的老版本
    container_name: old_win_minio
    image: minio/minio:RELEASE.2021-06-17T00-10-46Z
    command: server /data
    ports: 
      - "9000:9000"
    environment: ## 账号长度必须大于等于5，密码长度必须大于等于8位
      - MINIO_ROOT_USER=admin
      - MINIO_ROOT_PASSWORD=123456789 
    volumes: 
      - D:\docker-data\minio:/data ## 持久化地址
```

### 二进制文件安装
下载地址：[https://dl.min.io/server/minio/](https://dl.min.io/server/minio/)

```yaml
wget https://dl.min.io/server/minio/release/linux-amd64/minio
//1.下载minio源码包


chmod +x minio
//2.更改权限

./minio server /data
//启动服务 /data为我们自定义的文件目录
```

## Issue

### 桶不存在就创建

问题场景：使用AWSSDK.S3(3.7.101.39)版本在老版本的minio(minio/minio:RELEASE.2021-06-17T00-10-46Z)是没有问题，当使用较新版本minio(minio/minio:RELEASE.2022-06-25T15-50-16Z)的时候下面的方法是会报错的

```c#
/// <summary>
/// Check to see if the bucket exists and if it doesn't create the bucket.
/// </summary>
/// <param name="bucketName"></param>
Task EnsureBucketExistsAsync(string bucketName);
```

从注释上面看的话是如果不存在就创建，可是这里如果存在的话就直接报错了，或许是因为s3的处理方式和minio的处理方式不同，在这个组件中此处代码直接去PutBucket

## 资料

官网文档：https://www.minio.org.cn/docs/minio/kubernetes/upstream/
