---
title: 安装以及配置
lang: zh-CN
date: 2023-09-24
publish: true
author: azrng
isOriginal: true
category:
  - cloud
tag:
  - k3s
---
## 说明

:::tip

在Ubuntu服务器部署K3s，集群有问题，要搭建集群不适合看此文章

:::

## k3s在线安装

更新服务器包版本

```shell
sudo apt-get update && sudo apt-get upgrade -y
sudo apt-get install -y curl
```

可以通过下面的命令进行安装k3s（执行官方的安装脚本）

```shell
# 默认地址
sudo curl -sfL https://get.k3s.io | sh -

# 国内镜像加速地址，安装特定版本
sudo curl -sfL https://rancher-mirror.rancher.cn/k3s/k3s-install.sh | INSTALL_K3S_MIRROR=cn sh -
sudo curl -sfL https://rancher-mirror.rancher.cn/k3s/k3s-install.sh | \
      INSTALL_K3S_MIRROR=cn \
      K3S_TOKEN=12345 sh -s - \
      INSTALL_K3S_EXEC="server --docker" \
      --system-default-registry=registry.cn-hangzhou.aliyuncs.com

# 安装特定版本
sudo curl -sfL https://rancher-mirror.rancher.cn/k3s/k3s-install.sh | INSTALL_K3S_VERSION=v1.25.3+k3s1  INSTALL_K3S_MIRROR=cn sh -
     
# 关于设置registry不生效，查看：https://forums.rancher.cn/t/k3s/3314     
```

![image-20231230214707056](/cloud/image-20231230214707056.png)

验证是否安装成功

```sh
sudo kubectl get nodes
```

![image-20231230214830875](/cloud/image-20231230214830875.png)

可以看到控制平面和主节点一起运行，查看创建了那些容器(pods)

```shell
sudo kubectl get pods --all-namespaces

NAMESPACE     NAME                                     READY   STATUS      RESTARTS      AGE
kube-system   helm-install-traefik-cm8dv               0/1     Completed   1             59d
kube-system   helm-install-traefik-crd-4zsbk           0/1     Completed   0             59d
kube-system   svclb-traefik-dda3bd79-lrdr9             2/2     Running     6 (9d ago)    59d
kube-system   local-path-provisioner-6f65f9b6d-9c68k   1/1     Running     5 (10h ago)   59d
kube-system   coredns-5cf45fb78d-drrdx                 1/1     Running     3 (9d ago)    59d
kube-system   metrics-server-7dbd8c95c-gdn4l           1/1     Running     5 (10h ago)   59d
kube-system   traefik-7f57b8d797-d4wls                 1/1     Running     3 (9d ago)    59d
```

可以看到可用 pod 的列表，一个基本的 K3s 设置，包括：

- **Traefik** 作为 HTTP 反向代理和负载均衡的入口控制器
- **CoreDns**管理集群和节点内的 DNS 解析
- **Local Path Provisioner**提供了一种在每个节点中利用本地存储的方法
- **Helm**我们可以使用它来打包、部署

### 添加节点(可选)

如果我们想将节点添加到集群中，需要执行指向节点主机的相同命令

```shell
# 首先在做Master的节点服务器获取token
sudo cat /var/lib/rancher/k3s/server/node-token
K108ac35d092658e48af38b9bb83843db4e42641f8b6914b6ee93e36249447b21d5::server:c7c7acbe927b401103e8950d9ad04dd5

## 在agent节点服务器上执行
curl -sfL https://rancher-mirror.oss-cn-beijing.aliyuncs.com/k3s/k3s-install.sh | INSTALL_K3S_VERSION=v1.25.3+k3s1 INSTALL_K3S_MIRROR=cn K3S_URL=http://<node-host>:6443 K3S_TOKEN=K108ac35d092658e48af38b9bb83843db4e42641f8b6914b6ee93e36249447b21d5::server:c7c7acbe927b401103e8950d9ad04dd5  sh -
```

也可以参考文档[配置集群K3s](https://www.cnblogs.com/amsilence/p/18746708)

## k3s离线安装

### 下载 k3s 安装文件

- 从 [K3s 官方发布页面](https://github.com/k3s-io/k3s/releases)下载以下文件：
  - `k3s-airgap-images-amd64.tar.zst`（镜像文件）
  - `k3s`（二进制文件）
  - `k3s-install.sh`（安装脚本）

这里我下载了这几个文件

```
k3s 
k3s-airgap-images-amd64.tar.zst 
k3s-install.sh(从https://rancher-mirror.rancher.cn/k3s/k3s-install.sh获取)
```

### 导入镜像文件

```shell
sudo mkdir -p /var/lib/rancher/k3s/agent/images/
sudo cp k3s-airgap-images-amd64.tar.zst /var/lib/rancher/k3s/agent/images/
```

### 放置二进制文件

```shell
sudo cp k3s /usr/local/bin/
sudo chmod +x /usr/local/bin/k3s
```

**执行安装脚本**：

```shell
chmod +x k3s-install.sh
INSTALL_K3S_SKIP_DOWNLOAD=true ./k3s-install.sh
```

验证安装

```shell
kubectl get nodes
```

## 配置镜像加速地址

新增下面文件

```sh
sudo vim /etc/rancher/k3s/registries.yaml
```

将以下内容保存到文件中：

```sh
mirrors:
  mirror.aliyuncs.com:
    endpoint:
      - "https://xxxxxx.mirror.aliyuncs.com" # 这里可选用自己的加速链接

configs:
  "registry.cn-hangzhou.aliyuncs.com": # 如果有私有镜像库填这里，没有删掉即可
    auth:
      username: xxxxxx
      password: xxxxxx
```

也可以直接使用下面的脚本一键配置

```shell
mkdir -p /etc/rancher/k3s/
cat >> /etc/rancher/k3s/registries.yaml << EOF
mirrors:
  docker.io:
    endpoint:
      - "https://docker.m.daocloud.io"

  gcr.io:
    endpoint:
      - "https://gcr.m.daocloud.io"

  quay.io:
    endpoint:
      - "https://quay.m.daocloud.io"

  registry.k8s.io:
    endpoint:
      - "https://k8s.m.daocloud.io"
EOF
```

然后重启k3s服务

```shell
systemctl restart k3s
```

## k3s卸载

```sh
# 在server节点执行如下：
[root@k3s-server ~]# /usr/local/bin/k3s-uninstall.sh

# 在agent节点执行如下：
[root@k3s-agent ~]# /usr/local/bin/k3s-agent-uninstall.sh
```

## 其他内容安装(可选)

### Ingress-Nginx安装

此章节建议全部看完，再安装

#### 基本安装

1. 下载ingress-naginx yaml(裸机版)
```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.5.1/deploy/static/provider/baremetal/deploy.yaml
```

2. 修改deploy.yaml中的镜像后缀，(image地址中的"@"及后面的字符全部删掉)
3. 因为网络问题，需要单独下载yaml中的两个镜像,最简单的方法是本地代理下载下来然后传到国内镜像仓库再拉下来打tag
```bash
## 下载
docker pull registry.k8s.io/ingress-nginx/kube-webhook-certgen:v20220916-gd32f8c343
docker pull registry.k8s.io/ingress-nginx/controller:v1.5.1
## 上传，可以通过docker命令上传，我是直接打成压缩包然后通过华为云的压缩包上传的
docker save -o D:/webhook.tar registry.k8s.io/ingress-nginx/kube-webhook-certgen:v20220916-gd32f8c343
docker save -o D:/controller.tar registry.k8s.io/ingress-nginx/controller:v1.5.1
#然后在页面中处理上传

#下载镜像到k3s服务器并打tag,这是我自己打包的镜像,可以直接用
docker pull swr.cn-north-1.myhuaweicloud.com/rivenpub/kube-webhook-certgen:v20220916-gd32f8c343
docker pull swr.cn-north-1.myhuaweicloud.com/rivenpub/ingress-nginx-controller:v1.5.1
docker tag swr.cn-north-1.myhuaweicloud.com/rivenpub/kube-webhook-certgen:v20220916-gd32f8c343 registry.k8s.io/ingress-nginx/kube-webhook-certgen:v20220916-gd32f8c343
docker tag swr.cn-north-1.myhuaweicloud.com/rivenpub/ingress-nginx-controller:v1.5.1 registry.k8s.io/ingress-nginx/controller:v1.5.1
```

4. 安装`kubectl apply -f deploy.yaml`

#### HostNetWork模式
**特点：**

- 该模式会占用主机的80和443端口。每个节点最多存在一个Pod。
- 该模式使用主机的DNS配置而非集群的kube-dns等。
- 好处是主机网络接口直接进入ingress而无需经过NodePort的网络转换。

**K3S 安装注意事项**
需要禁用k3s自带的负载均衡器，否则端口冲突，k3s安装命令后面加  `sh -s - --disable servicelb  `
K3s的完整安装命令为：

```bash
curl -sfL https://rancher-mirror.oss-cn-beijing.aliyuncs.com/k3s/k3s-install.sh | INSTALL_K3S_VERSION=v1.25.3+k3s1 INSTALL_K3S_EXEC="server --docker" INSTALL_K3S_MIRROR=cn  sh -s - --disable servicelb  
```

**Yaml修改**
修改 deploy.yaml 文件中 Deployment 部分，改完后大概如下
```bash
apiVersion: apps/v1
kind: DaemonSet #修改Deployment
metadata:
  labels:
    app.kubernetes.io/component: controller
    app.kubernetes.io/instance: ingress-nginx
    app.kubernetes.io/name: ingress-nginx
    app.kubernetes.io/part-of: ingress-nginx
    app.kubernetes.io/version: 1.5.1
  name: ingress-nginx-controller
  namespace: ingress-nginx
spec:
  minReadySeconds: 0
  revisionHistoryLimit: 10
  selector:
    matchLabels:
      app.kubernetes.io/component: controller
      app.kubernetes.io/instance: ingress-nginx
      app.kubernetes.io/name: ingress-nginx
  template:
    metadata:
      labels:
        app.kubernetes.io/component: controller
        app.kubernetes.io/instance: ingress-nginx
        app.kubernetes.io/name: ingress-nginx
    spec:
      hostNetwork: true #新增的
      containers:
      - args:
        - /nginx-ingress-controller
        - --election-id=ingress-nginx-leader
        - --controller-class=k8s.io/ingress-nginx
        - --ingress-class=nginx
        - --configmap=$(POD_NAMESPACE)/ingress-nginx-controller
        - --validating-webhook=:8443
        - --validating-webhook-certificate=/usr/local/certificates/cert
        - --validating-webhook-key=/usr/local/certificates/key
        - --report-node-internal-ip-address #新增的
```


#### MetalLB
**特点**
这是个负载均衡器，可以在任何裸机集群中使用负载均衡的功能。但是云服务器基本都不支持(因为虚拟IP的缘故)
这种方式安装同样要禁用k3s的负载均衡器，所以k3s安装命令同HostNetWork模式

**ingress-nginx**
ingress-nginx 不使用裸机版的配置，改用负载均衡版：
```bash
wget https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.5.1/deploy/static/provider/cloud/deploy.yaml
```
同样修改里面的镜像后缀

**MetalLB安装：**
```bash
kubectl apply -f https://raw.githubusercontent.com/metallb/metallb/v0.13.7/config/manifests/metallb-native.yaml
```
创建config文件 metallb-config.yaml: `kubectl apply -f  metallb-config.yaml`
```yaml
---
apiVersion: metallb.io/v1beta1
kind: IPAddressPool
metadata:
  name: default
  namespace: metallb-system
spec:
  addresses:
  - 192.168.0.100-192.168.0.103  #此处的ip地址段为虚拟ip段，不与dhcp分发的ip和节点ip等重复
  autoAssign: true
---
apiVersion: metallb.io/v1beta1
kind: L2Advertisement
metadata:
  name: default
  namespace: metallb-system
spec:
  ipAddressPools:
  - default
```

**使用:**
```bash
[root@ecs-153442 k3s]## kubectl get ingress
NAME            CLASS   HOSTS           ADDRESS         PORTS   AGE
netcoretest     nginx   test.com        192.168.0.101   80      38s
[root@ecs-153442 k3s]vim /etc/hosts
#添加几行：
192.168.0.100 test.com
192.168.0.101 test.com
192.168.0.102 test.com
192.168.0.103 test.com
[root@ecs-153442 k3s]curl test.com
```


#### Ingress-Nginx使用
直接替换调ingress yaml文件中的**ingressClassName**为**nginx**即可，类似于下面
```bash
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: netcoretest
spec:
  ingressClassName: nginx  #这里写成nginx
  rules:
  - host: netcoretest.com
    http:
      paths:
      - pathType: Prefix
        path: /
        backend:
          service:
            name: netcoretest
            port:
              number: 5000
```
如果是HostNetWork模式
可以把ingress的nodeport端口固定，我固定成了30000和30001，主要是因为80端口有时候不可用
现在可以通过 http://netcoretest.com 和 http://netcoretest.com:30000 访问具体的服务了

**ingress-nginx 固定端口配置**
```bash
kubectl edit -n ingress-nginx svc/ingress-nginx-controller
```
把ports配置改成下面这样就可以了. 也可以在最开始的ingress-nginx的deploy.yaml中直接改
```yaml
 ports:
  - appProtocol: http
    name: http
    nodePort: 30000
    port: 80
    protocol: TCP
    targetPort: http
  - appProtocol: https
    name: https
    nodePort: 30001
    port: 443
    protocol: TCP
    targetPort: https
```

### K3S使用主机Docker

#### 方法一：安装时指定参数
```bash
#1.在安装时通过环境变量INSTALL_K3S_EXEC
curl -sfL https://rancher-mirror.oss-cn-beijing.aliyuncs.com/k3s/k3s-install.sh | INSTALL_K3S_VERSION=v1.25.3+k3s1 INSTALL_K3S_EXEC="server --docker" INSTALL_K3S_MIRROR=cn sh -
#2.或者直接传参
curl -sfL https://rancher-mirror.oss-cn-beijing.aliyuncs.com/k3s/k3s-install.sh | sh -s - server --docker
```

#### 方法二：安装后修改配置文件
```bash
#1.打开文件
vim /etc/systemd/system/multi-user.target.wants/k3s.service

#2.修改ExecStart那几行的值为：
/usr/local/bin/k3s server --docker --no-deploy traefik

#3.重启服务
systemctl daemon-reload
service k3s restart
```


### kubectl 客户端连接K3S
将k3s主机点上的 /etc/rancher/k3s/k3s.yaml 文件拷贝到 kubectl所在机器的 ~/.kube/config
需要注意修改 yaml文件中的ip地址为 kubectl客户端可以访问到的地址

## 资料

[https://www.cnblogs.com/hujinzhong/p/15014487.html](https://www.cnblogs.com/hujinzhong/p/15014487.html) k3s安装与部署

[https://mp.weixin.qq.com/s/opW6n5vpPNZarcnAfMGPHw](https://mp.weixin.qq.com/s/opW6n5vpPNZarcnAfMGPHw) | 使用autok3s 安装k3s 集群 和 kuboard 管理集群

https://mp.weixin.qq.com/s/4Y3DJs6FqEQZ2WZt0udMvQ | 使用 k3sup 一分钟快速搭建 K3s 集群

