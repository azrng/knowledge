---
title: k3s其他内容安装
lang: zh-CN
date: 2023-08-05
publish: true
author: token-go
isOriginal: false
category:
  - dotNet
tag:
  - k3s
filename: k3s
docsId: '479c4bdc-c5db-4824-adbe-71502349a498'
---

## Helm

### 安装

1. 去[GitHub发布页](https://github.com/helm/helm/releases)下载需要的版本
2. 下载后解压(`tar -zxvf helm-v3.0.0-linux-amd64.tar.gz`)
3. 在解压目录中找到`helm`程序，移动到需要的目录中(`mv linux-amd64/helm /usr/local/bin/helm`)

```shell
# 安装
tar -zxvf helm-v3.17.0-linux-amd64.tar.gz
mv linux-amd64/helm /usr/local/bin/helm
chmod +x /usr/local/bin/helm

# 卸载
sudo rm /usr/local/bin/helm
```

### 错误

#### Error: Kubernetes cluster unreachable

**报错原因**: helm v3版本不再需要Tiller，而是直接访问ApiServer来与k8s交互，通过环境变量`KUBECONFIG`来读取存有ApiServre的地址与token的配置文件地址，默认地址为`~/.kube/config`

**解决方法**:

手动配置 `KUBECONFIG`环境变量

1. 临时解决: `export KUBECONFIG=/etc/rancher/k3s/k3s.yaml`
2. 永久解决:
   - 执行: `vi /etc/profile`
   - 写入内容: `export KUBECONFIG=/etc/rancher/k3s/k3s.yaml`，放在最下面就行，然后报错
   - 执行: `source /etc/profile`，然后就可以正常操作了

参考资料：[https://www.cnblogs.com/varyuan/p/14223553.html](https://www.cnblogs.com/varyuan/p/14223553.html)

## AutoK3s 

AutoK3s 是一款 K3s 集群自动化部署和管理工具，可以方便开发者自助管理多云环境中的 K3s 集群。可以用来安装K3s，也可以通过管理K3s集群。

文档地址：https://docs.rancher.cn/docs/k3s/autok3s/_index



以下是一些 autok3s 提供的功能和优势：

1. 一键式集群创建：autok3s 提供了一个简洁的命令行接口，可以通过指定一些参数和选项，快速创建一个全新的 Kubernetes 集群。
2. 多云服务提供商支持：autok3s 支持多种云服务提供商，如 AWS、Azure、阿里云等，可以方便地在这些云平台上创建和管理集群。
3. 简化配置和管理：autok3s 提供了一些默认配置和自动化选项，可以减少手动操作和配置的复杂性。
4. 集群扩展和升级：通过 autok3s，你可以通过简单的命令来扩展集群规模或者升级到新版本，而无需手动执行复杂的操作。
5. 集成其他工具：autok3s 可以与其他工具和服务进行集成，如 Traefik、Metallb 等，以增强集群的功能和性能。

### 准备工作

1.准备俩台可以相互访问的服务器

2.需要先安装dockers

3.以下教程将使用VsCode+ssh插件来进行插件图

![img](/common/3f6e1b41bcc3ca1f189628dd9a945f2b.png)

ssh连接到俩台服务器，点击打开ssh操作界面

![img](/common/622ebca928c7e3d4d71ad0dde8a5e6e8.png)

### 安装autok3s

进入需要设置master节点的服务器中然后执行docker命令启动一个autok3s的容器并且需要将docker映射进去 注：如果选择使用docker做为k3s的运行容器必须映射docker进去

```shell
sudo docker run -itd --restart=unless-stopped --name autok3s --net=host -v /var/run/docker.sock:/var/run/docker.sock cnrancher/autok3s:v0.5.2
```

容器启动完成以后访问地址 `<ip>:8080` 然后点击Core/Clusters

![img](/common/5f979423c86b26d8f65949132a58140f.png)

 点击Create创建一个Cluster

![img](/common/4ddf3e95a4ca3a067bea16976070e357.png)

 Provider选择Native

![img](/common/2975be64fdd03dda401f5c7041cb7db4.png)

安装的基本参数设置 设置master节点ip 设置node节点ip 俩台服务器密码需要一致

 ![img](/common/db60b7117f8f835ddc28cd0332523037.png)

 设置k3s options

![img](/common/cdfdf127327f9ec4630c472dd9196d45.png)

点击右下角的create

![img](/common/99d373511e213ee7714df39e2c729607.png)

 等待k3s安装部署完成 需要很长一段时间

 ![img](/common/eaae8cb2c73bd6479c53b1ea9c65dbd4.png)

## 安装kuboard管理界面

文档地址：https://kuboard.cn/install/v3/install-built-in.html

 我们可以先安装k3s的管理界面，安装我们的kuboard管理界面

```shell
docker run --restart=unless-stopped -p 8088:80 -d --name kuboard -e KUBOARD_AGENT_SERVER_TCP_PORT=8088 -e KUBOARD_ENDPOINT=https://172.27.176.1  -v /root/kuboard-data:/data  eipwork/kuboard:v3
```

然后访问`ip:8088`我们可以看到kuboard的界面

* 默认账号：admin
* 默认密码：Kuboard123

![img](/common/d90f9f730397b13e1274c8858eab59e6.png)

 登录成功进入界面 等待k3s安装完成 点击Kubernetes的添加集群

![img](/common/96455140335920f5b3774a03d8502192.png)

 点击 .kubeconfig

![img](/common/6734ed2f7194626ceb4e2310d0cedc55.png)

找到master节点下的k3s配置，路径 /etc/rancher/k3s/k3s.yaml，通过命令查看内容

```shell
sudo cat  /etc/rancher/k3s/k3s.yaml
```

修改内部的server ip为master节点的ip

```yaml
apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUJkekNDQVIyZ0F3SUJBZ0lCQURBS0JnZ3Foa2pPUFFRREFqQWpNU0V3SHdZRFZRUUREQmhyTTNNdGMyVnkKZG1WeUxXTmhRREUyTmpReU1ESTBNRGd3SGhjTk1qSXdPVEkyTVRReU5qUTRXaGNOTXpJd09USXpNVFF5TmpRNApXakFqTVNFd0h3WURWUVFEREJock0zTXRjMlZ5ZG1WeUxXTmhRREUyTmpReU1ESTBNRGd3V1RBVEJnY3Foa2pPClBRSUJCZ2dxaGtqT1BRTUJCd05DQUFRdmJOZEdiNDAvWmR4L2JiRjgzZXZObGFsUFVXTm5KMmp6UFZoT0k4VXAKR1QyeXQ1b0FCTEs2a0diWnVEbkowTE9GYnBudXZFMUkyRFl0d2RxMmh3YnFvMEl3UURBT0JnTlZIUThCQWY4RQpCQU1DQXFRd0R3WURWUjBUQVFIL0JBVXdBd0VCL3pBZEJnTlZIUTRFRmdRVXA1YU5GZlU5U0R3dFVoQlZJVTNUCkc4UTgwa293Q2dZSUtvWkl6ajBFQXdJRFNBQXdSUUloQUlxcVhMNFBVa0xsdld3T3hmZ3M2NFNhSHBobFgvaW8KVFJJME9MdnR5VmRXQWlBcFhrcndLRmZBYmFmSDNkZnNjY0dIbGYvdVpMbTJaNG1WeURRZmE4dUtPUT09Ci0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0K
    server: https://192.168.1.11:6443
  name: default
contexts:
- context:
    cluster: default
    user: default
  name: default
current-context: default
kind: Config
preferences: {}
users:
- name: default
  user:
    client-certificate-data: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUJrVENDQVRlZ0F3SUJBZ0lJQ0NjT1VkbCtEZzR3Q2dZSUtvWkl6ajBFQXdJd0l6RWhNQjhHQTFVRUF3d1kKYXpOekxXTnNhV1Z1ZEMxallVQXhOalkwTWpBeU5EQTRNQjRYRFRJeU1Ea3lOakUwTWpZME9Gb1hEVEl6TURreQpOakUwTWpZME9Gb3dNREVYTUJVR0ExVUVDaE1PYzNsemRHVnRPbTFoYzNSbGNuTXhGVEFUQmdOVkJBTVRESE41CmMzUmxiVHBoWkcxcGJqQlpNQk1HQnlxR1NNNDlBZ0VHQ0NxR1NNNDlBd0VIQTBJQUJJQWZuSncrVVVOaUdsN3QKWGhMUFZDTUpyWHIraFUvWVU4SVNoRVNtQktucng0eWZ4NUQ3TnpTdkR5YUdldjk3SVJDUGlKUktvaENFMGlnMwp1Z3I5b1RlalNEQkdNQTRHQTFVZER3RUIvd1FFQXdJRm9EQVRCZ05WSFNVRUREQUtCZ2dyQmdFRkJRY0RBakFmCkJnTlZIU01FR0RBV2dCU1lxTHlEK2tzMjhidVBSMUx2RTZDN1hGV2U5REFLQmdncWhrak9QUVFEQWdOSUFEQkYKQWlBTW5HekViQUx2K2dUZUxFc1M5T1dyOWNrRXhDMUVHT2FBSDBpemdCb2R4UUloQU1xSDFZeUU5N0ZFeXh0Kwp5aHlMaWYxb3A3alcrcHFIakRNT1VTQzg0SGtsCi0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0KLS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUJkakNDQVIyZ0F3SUJBZ0lCQURBS0JnZ3Foa2pPUFFRREFqQWpNU0V3SHdZRFZRUUREQmhyTTNNdFkyeHAKWlc1MExXTmhRREUyTmpReU1ESTBNRGd3SGhjTk1qSXdPVEkyTVRReU5qUTRXaGNOTXpJd09USXpNVFF5TmpRNApXakFqTVNFd0h3WURWUVFEREJock0zTXRZMnhwWlc1MExXTmhRREUyTmpReU1ESTBNRGd3V1RBVEJnY3Foa2pPClBRSUJCZ2dxaGtqT1BRTUJCd05DQUFSQzlKYUppZUVlSHZBVUU5NzA5d3lRUjBQbTgrWlZteis0enpNS1ZZTGYKVDl6and2NUJUUGJoazlFNXh3c3I0Zkg2Zkw5RnI0QWtsZW1HSEhicWJIQ1VvMEl3UURBT0JnTlZIUThCQWY4RQpCQU1DQXFRd0R3WURWUjBUQVFIL0JBVXdBd0VCL3pBZEJnTlZIUTRFRmdRVW1LaThnL3BMTnZHN2owZFM3eE9nCnUxeFZudlF3Q2dZSUtvWkl6ajBFQXdJRFJ3QXdSQUlnZHFhbVpNMUttUzlnT1E2d0k4SWh3UDAvY05XV1ZQeEsKNUF4eU03elRiTElDSUdBOUZWa0hPTDAyN05WaFd4MngydnNtdkNOLzZoa2RGVnhJOFMwM05IUkoKLS0tLS1FTkQgQ0VSVElGSUNBVEUtLS0tLQo=
    client-key-data: LS0tLS1CRUdJTiBFQyBQUklWQVRFIEtFWS0tLS0tCk1IY0NBUUVFSUd6VldKY1JpUkljLzFWTnc0UGRKckZFbEk2cisyUkdWWDJMQ0tsZldibnRvQW9HQ0NxR1NNNDkKQXdFSG9VUURRZ0FFZ0IrY25ENVJRMklhWHUxZUVzOVVJd210ZXY2RlQ5aFR3aEtFUktZRXFldkhqSi9Ia1BzMwpOSzhQSm9aNi8zc2hFSStJbEVxaUVJVFNLRGU2Q3YyaE53PT0KLS0tLS1FTkQgRUMgUFJJVkFURSBLRVktLS0tLQo=
```

将其复制到 KubeConfig 里面 填写名称和描述 然后点击确定

![img](/common/2af153aed61fb9a896cec686f6a7b8cd.png)

点击确认以后进入这个界面 然后选择kuboard-admin 再点击集群概要

![img](/common/45815047389565409f8c9bf4ca93900c.png)

进入到kuboard的管理界面就完成了 如果node节点的服务器并没有加入到master节点请查阅资料

![img](/common/cc1bd801d1e69ac3293a5cb3ba388284.png)

## 参考文档

https://blog.csdn.net/xiaohucxy/article/details/127062757 | k3s部署全过程kuboard管理界面_k3s 界面管理_token-go的博客-CSDN博客

使用autok3s来安装k3s：https://mp.weixin.qq.com/s/GCSWJrwJgNA9D0-l__Yojw