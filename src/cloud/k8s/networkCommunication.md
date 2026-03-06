---
title: 网络通信
lang: zh-CN
date: 2023-07-02
publish: true
author: 云端密码
isOriginal: false
category:
  - cloud
tag:
  - 无
filename: wanglaotongxin
slug: vanehrry3qy69lvd
docsId: '131988720'
---

## 名词解释
1、网络的命名空间：Linux 在网络栈中引入网络命名空间，将独立的网络协议栈隔离到不同的命名空间中，彼此间无法通信；Docker 利用这一特性，实现不容器间的网络隔离。
2、Veth 设备对：也叫虚拟网络接口对。Veth设备对的引入是为了实现在不同网络命名空间的通信。
3、Iptables/Netfilter：Netfilter 负责在内核中执行各种挂接的规则（过滤、修改、丢弃等），运行在内核 模式中；Iptables模式是在用户模式下运行的进程，负责协助维护内核中 Netfilter 的各种规则表；通过二者的配合来实现整个 Linux 网络协议栈中灵活的数据包处理机制。
4、网桥：网桥是一个二层网络设备,通过网桥可以将 linux 支持的不同的端口连接起来,并实现类似交换机那样的多对多的通信。
5、路由：Linux 系统包含一个完整的路由功能，当IP层在处理数据发送或转发的时候，会使用路由表来决定发往哪里。

## 令人头大的网络模型
Kubernetes对集群内部的网络进行了重新抽象，以实现整个集群网络扁平化。我们可以理解网络模型时，可以完全抽离物理节点去理解，我们用图说话，先有基本印象。
![](/common/1688296133773-adcf4845-ca3d-40ed-812c-786eb33718ad.webp)
其中，重点讲解以下几个关键抽象概念。

## 一个 Service

Service 是 Kubernetes 为屏蔽这些后端实例（Pod）的动态变化和对多实例的负载均衡而引入的资源对象。Service 通常与 deployment 绑定，定义了服务的访问入口地址，应用（Pod）可以通过这个入口地址访问其背后的一组由 Pod 副本组成的集群实例。Service 与其后端 Pod 副本集群之间则是通过 Label Selector 来实现映射。
Service的类型（Type）决定了 Service 如何对外提供服务，根据类型不同，服务可以只在Kubernetes cluster中可见，也可以暴露到集群外部。Service有三种类型，ClusterIP，NodePort 和 LoadBalancer。具体的使用场景会在下文中进行阐述。
在测试环境查看：
```
$ kubectl get svc --selector app=nginx
NAME TYPE CLUSTER-IP EXTERNAL-IP PORT(S) AGE
nginx ClusterIP 172.19.0.166 <none> 80/TCP 1m
$ kubectl describe svc nginx
Name: nginx
Namespace: default
Labels: app=nginx
Annotations: <none>
Selector: app=nginx
Type: ClusterIP
IP: 172.19.0.166
Port: <unset> 80/TCP
TargetPort: 80/TCP
Endpoints: 172.16.2.125:80,172.16.2.229:80
Session Affinity: None
Events: <none>
```
上述信息中该 svc 后端代理了2个Pod实例：172.16.2.125:80，172.16.2.229:80

## 二个 IP
Kubernetes 为描述其网络模型的 IP 对象，抽象出 Cluster IP和Pod IP的概念。
Pod IP 是 Kubernetes 集群中每个 Pod 的 IP 地址。它是 Docker Engine 根据 docker0网桥的IP地址段进行分配的，是一个虚拟的二层网络。Kubernetes 中 Pod 间能够彼此直接通讯，Pod 里的容器访问另外一个Pod里的容器，是通过Pod IP所在进行通信。
Cluster IP仅作用于 Service，其没有实体对象所对应，因此 Cluster IP 无法被ping通。它的作用是为 Service 后端的实例提供统一的访问入口。当访问 Cluster IP 时，请求将被转发到后端的实例上，默认是轮询方式。Cluster IP 和 Service一样由 kube-proxy 组件维护，其实现方式主要有两种，iptables 和 IPVS。在 1.8 版本后 kubeproxy 开始支持IPVS 方式。在上例中，SVC的信息中包含了Cluster IP。
这里未列出 node ip 概念，由于其本身是物理机的网卡IP。因此可理解为nodeip就是物理机IP。

## 三个 Port
在 Kubernetes 中，涉及容器，Pod，Service，集群各等多个层级的对象间的通信，为在网络模型中区分各层级的通信端口，这里对Port进行了抽象。

### Port
该Port非一般意义上的TCP/IP中的Port概念，它是特指Kubernetes中Service的port，是Service间的访问端口，例如Mysql的Service默认3306端口。它仅对进群内容器提供访问权限，而无法从集群外部通过该端口访问服务。

### nodePort
nodePort为外部机器提供了访问集群内服务的方式。比如一个Web应用需要被其他用户访问，那么需要配置type=NodePort，而且配置nodePort=30001，那么其他机器就可以通过浏览器访问scheme://node:30001访问到该服务，例如[http://node:30001](http://node:30001)。

### targetPort
targetPort是容器的端口（最根本的端口入口），与制作容器时暴露的端口一致（DockerFile中EXPOSE），例如 [http://docker.io](http://docker.io) 官方的 nginx 暴露的是80端口。
举一个例子来看如何配置 Service 的 port：
```
kind: Service
apiVersion: v1
metadata:
 name: mallh5-service
 namespace: abcdocker
spec:
 selector:
 app: mallh5web
 type: NodePort
 ports:
 - protocol: TCP
 port: 3017
 targetPort: 5003
 nodePort: 31122
```
这里举出了一个service的yaml，其部署在abcdocker的namespace中。这里配置了nodePort，因此其类型Type就是NodePort，注意大小写。若没有配置nodePort，那这里需要填写ClusterIP，即表示只支持集群内部服务访问。

## 集群内部通信

### 单节点通信
集群单节点内的通信，主要包括两种情况，同一个 pod 内的多容器间通信以及同一节点不同 pod 间的通信。由于不涉及跨节点访问，因此流量不会经过物理网卡进行转发。
通过查看路由表，也能窥见一二：
```
root@node-1:/opt/bin## route -n
Kernel IP routing table
Destination Gateway Genmask Flags Metric Ref Use Iface
0.0.0.0 172.23.100.1 0.0.0.0 UG 0 0 0 eth0
10.1.0.0 0.0.0.0 255.255.0.0 U 0 0 0 flannel.1 #flannel 网络内跨节点的通信会交给 flannel.1 处理
10.1.1.0 0.0.0.0 255.255.255.0 U 0 0 0 docker0 #flannel 网络内节点内的通信会走 docker0
```

### Pod 内通信
如下图所示：
![](/common/1688296133755-6043d00f-5347-4ed8-94cf-02644df2a2ee.webp)
这种情况下，同一个pod内共享网络命名空间，容器之间通过访问 127.0.0.1:（端口）即可。图中的 veth* 即指veth对的一端（另一端未标注，但实际上是成对出现），该veth对是由 Docker Daemon 挂载在 docker0 网桥上，另一端添加到容器所属的网络命名空间，图上显示是容器中的eth0。
图中演示了 bridge 模式下的容器间通信。docker1 向 docker2 发送请求，docker1，docker2 均与 docker0 建立了 veth 对进行通讯。
当请求经过 docker0 时，由于容器和 docker0 同属于一个子网，因此请求经过 docker2与docker0的veth*对，转发到docker2，该过程并未跨节点，因此不经过eth0。

### Pod 间通信
**同节点 pod 间通信**
由于 Pod 内共享网络命名空间（由 pause 容器创建），所以本质上也是同节点容器间的通信。同时，同一 Node 中 Pod 的默认路由都是 docker0 的地址，由于它们关联在同一个 docker0 网桥上，地址网段相同，所有它们之间应当是能直接通信的。来看看实际上这一过程如何实现。如上图，Pod1 中容器 1和容器 2 共享网络命名空间，因此对pod 外的请求通过 pod1 和 Docker0 网桥的 veth对（图中挂在eth0和ethx上）实现。
![](/common/1688296133786-6d360b45-ad2a-4581-8ca6-941e4839ff7d.webp)
访问另一个pod内的容器，其请求的地址是PodIP而非容器的ip，实际上也是同一个子网间通信，直接经过veth对转发即可。

### 跨节点通信
**CNI：容器网络接口**
CNI 是一种标准，它旨在为容器平台提供网络的标准化。不同的容器平台（比如目前的 kubernetes、mesos 和 rkt）能够通过相同的接口调用不同的网络组件。
目前kubernetes支持的CNI组件种类很多，例如：bridge calico calico-ipam dhcp flannel host-local ipvlan loopback macvlan portmap ptp sample tuning vlan。在docker中，主流的跨主机通信方案主要有一下几种：
1）基于隧道的overlay网络：按隧道类型来说，不同的公司或者组织有不同的实现方案。docker原生的overlay网络就是基于vxlan隧道实现的。ovn则需要通过geneve或者stt隧道来实现的。flannel最新版本也开始默认基于vxlan实现overlay网络。
2）基于包封装的overlay网络：基于UDP封装等数据包包装方式，在docker集群上实现跨主机网络。典型实现方案有weave、flannel的早期版本。
3）基于三层实现SDN网络：基于三层协议和路由，直接在三层上实现跨主机网络，并且通过iptables实现网络的安全隔离。典型的方案为Project Calico。同时对不支持三层路由的环境，Project Calico还提供了基于IPIP封装的跨主机网络实现

**通信方式**

![](/common/1688296133781-21ed0a09-57d3-4055-9d60-087b463a5ade.webp)
集群内跨节点通信涉及到不同的子网间通信，仅靠docker0无法实现，这里需要借助CNI网络插件来实现。图中展示了使用flannel实现跨节点通信的方式。
简单说来，flannel的用户态进程flanneld会为每个node节点创建一个flannel.1的网桥，根据etcd或apiserver的全局统一的集群信息为每个node分配全局唯一的网段，避免地址冲突。同时会为docker0和flannel.1创建veth对，docker0将报文丢给flannel.1,。
Flanneld维护了一份全局node的网络表，通过flannel.1接收到请求后，根据node表，将请求二次封装为UDP包，扔给eth0，由eth0出口进入物理网路发送给目的node。
在另一端以相反的流程。Flanneld解包并发往docker0，进而发往目的Pod中的容器。

## 外部访问集群
从集群外访问集群有多种方式，比如loadbalancer，Ingress，nodeport，nodeport和loadbalancer是service的两个基本类型，是将service直接对外暴露的方式，ingress则是提供了七层负载均衡，其基本原理将外部流量转发到内部的service，再转发到后端endpoints，在平时的使用中，我们可以依据具体的业务需求选用不同的方式。这里主要介绍nodeport和ingress方式。

### Nodeport
通过将 Service 的类型设置为 NodePort，就可以在 Cluster 中的主机上通过一个指定端口暴露服务。注意通过 Cluster 中每台主机上的该指定端口都可以访问到该服务，发送到该主机端口的请求会被 Kubernetes 路由到提供服务的 Pod 上。采用这种服务类型，可以在 Kubernetes cluster 网络外通过主机 IP：端口的方式访问到服务。
![](/common/1688296133824-70fd42dd-b76e-432f-bf2d-cdf03a90af07.webp)
这里给出一个 influxdb 的例子，我们也可以针对这个模板去修改成其他的类型：
```
kind: Service
apiVersion: v1
metadata:
 name: influxdb
spec:
 type: NodePort
 ports:
 - port: 8086
 nodePort: 31112
 selector:
 name: influxdb
```

### Ingress
![](/common/1688296134110-b0b58dea-011b-40ad-bdf9-e42c07970e00.webp)
Ingress 是推荐在生产环境使用的方式，它起到了七层负载均衡器和 Http 方向代理的作用，可以根据不同的 url 把入口流量分发到不同的后端Service。外部客户端只看到 [http://foo.bar.com](http://foo.bar.com) 这个服务器，屏蔽了内部多个 Service 的实现方式。采用这种方式，简化了客户端的访问，并增加了后端实现和部署的灵活性，可以在不影响客户端的情况下对后端的服务部署进行调整。
其部署的 yaml 可以参考如下模板：
```
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
 name: test
 annotations:
 ingress.kubernetes.io/rewrite-target: /
spec:
 rules:
 - host: test.name.com
 http:
 paths:
 - path: /test
 backend:
 serviceName: service-1
 servicePort: 8118
 - path: /name
 backend:
 serviceName: service-2
 servicePort: 8228
```
这里我们定义了一个ingress模板，定义通过 [http://test.name.com](http://test.name.com) 来访问服务，在虚拟主机[http://test.name.com](http://test.name.com)下面定义了两个Path，其中/test被分发到后端服务s1，/name被分发到后端服务s2。
集群中可以定义多个ingress，来完成不同服务的转发，这里需要一个ingress controller来管理集群中的Ingress规则。Ingress Contronler 通过与 Kubernetes API 交互，动态的去感知集群中 Ingress 规则变化，然后读取它，按照自定义的规则，规则就是写明了哪个域名对应哪个service，生成一段 Nginx 配置，再写到 Nginx-ingress-control的 Pod 里，这个 Ingress Contronler 的 pod 里面运行着一个nginx服务，控制器会把生成的nginx配置写入 /etc/nginx.conf 文件中，然后 reload使用配置生效。
Kubernetes 提供的 Ingress Controller 模板如下：
```
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
 name: test
 annotations:
 ingress.kubernetes.io/rewrite-target: /
spec:
 rules:
 - host: foo.bar.com
 http:
 paths:
 - path: /foo
 backend:
 serviceName: s1
 servicePort: 80
 - path: /bar
 backend:
 serviceName: s2
 servicePort: 80
```

## 总结及展望
本文针对 Kubernetes 的网络模型，从一个 service，二个IP，三个 port 出发进行图解。详解 Kubernetes 集群内及集群外部访问方式。

## 资料
文章来自：[https://zhuanlan.zhihu.com/p/81667781](https://zhuanlan.zhihu.com/p/81667781)
