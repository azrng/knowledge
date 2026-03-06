---
title: K8s部署.NetCore
lang: zh-CN
date: 2025-01-15
publish: true
author: azrng
isOriginal: false
category:
  - cloud
tag:
  - k8s
  - docker
---

## 概述

使用Docker.Desktop工具来将.NetCore服务部署到k8s中

## 环境准备

* Docker.Desktop并开启Kubernetes
* .Net服务

## K8s环境验证

安装docker.Desktop桌面客户端，然后去设置里找到Kubernetes

![image-20250105214529874](/cloud/image-20250105214529874.png)

开启后可以底部查看运行是否正常

![image-20250105214615773](/cloud/image-20250105214615773.png)

执行命令查看当前节点信息

![image-20250105164754572](/cloud/image-20250105164754572.png)

这里我们可以看到k8s服务是正常的。

## 打包镜像

这里我已经有一个quartzui测试项目，我现在将该项目打包成镜像，正式环境中一般是需要打包然后推送，然后直接通过yaml拉取镜像仓库镜像进行部署的，执行命令打包镜像并设置执行版本

```shell
docker build -t quartzui:1.0.0 .
```

![image-20250105171824882](/cloud/image-20250105171824882.png)

查看镜像信息

```shell
docker images
```

![image-20250105171920751](/cloud/image-20250105171920751.png)

## 编写yaml文件

这里我直接使用上面已经打包好的quartzui镜像

```yaml
apiVersion: apps/v1 # api版本
kind: Deployment # 资源类型
metadata: # 元数据
  name: dotnet-task # 部署名称
  labels: # 标签
    service: dotnet # 服务名称
spec: # 配置
  replicas: 1 # 副本数
  selector: # 选择器
    matchLabels: # 匹配标签
      app: dotnet-task # 应用名称
  template: # 模板
    metadata: # 元数据
      labels:
        app: dotnet-task # 应用名称
    spec: # 配置
      containers: # 容器
        - image: quartzui:1.0.0 # 镜像地址
          name: dotnet-task # 容器名称
          imagePullPolicy: Never # 镜像拉取策略 IfNotPresent: 如果本地没有镜像则拉取 Always: 每次都拉取 Never: 从不拉取
          ports: # 端口
            - containerPort: 8080 # 容器端口
              name: task-port
          resources: # 资源
            limits: # 限制
              memory: 4Gi # 内存
              cpu: '2' # CPU
            requests: # 请求
              memory: 128Mi # 内存
              cpu: 10m # CPU
          env: [] # 环境变量
          envFrom: [] # 从环境变量中获取
---
kind: Service # 资源类型
apiVersion: v1 # api版本
metadata: # 元数据
  name: dotnet-task # 服务名称
spec: # 配置
  type: NodePort # 类型
  selector: # 选择器
    app: dotnet-task # 应用名称
  ports: # 端口
    - name: task-port # 端口名称
      port: 8081 # 端口
      targetPort: 8080 # 目标端口
      protocol: TCP # 协议
      # nodePort: 32102 # 节点端口 不写的话默认随机分配
```

解释一下

* name：可以修改
* replicas参数表示工作副本，运行成功后会运行相应的pod数量在节点中
* image：镜像名称
* imagePullPolicy：镜像拉取策略 IfNotPresent: 如果本地没有镜像则拉取



yaml的文件格式要求比较严格，如果防止写错，可以先通过[网址](https://www.bairesdev.com/tools/json2yaml/)验证下yaml格式

## 生成服务

可以执行k8s命令去生成pod

```shell
kubectl create -f quartzui-pod.yaml
```

![image-20250105174606450](/cloud/image-20250105174606450.png)

如果执行没有报错可以执行命令看到

```
kubectl get pod -o wide
```

![image-20250105205757583](/cloud/image-20250105205757583.png)

查看访问地址

```
kubectl get svc -o wide
```

![image-20250105205840698](/cloud/image-20250105205840698.png)

这个时候可以看到生成的端口为32295，那么就可以访问一下，比如我现在访问地址为http://localhost:32295/

![image-20250105210026959](/cloud/image-20250105210026959.png)

## 更新服务

当更新代码后，只需要重新发布打包镜像，记得增加版本号

```shell
 docker build -t quartzui:2.0.0 .
```

打包成功后记得修改yaml中镜像的版本号，当你yaml文件没有修改的时候，是不会触发更新pod的

```
image: quartzui:2.0.0 # 将其从1.0.0更新为新的版本2.0.0
```

保存后执行apply命令

```shell
kubectl apply -f quartzui-pod.yaml

# 其他更新方法
kubectl set image deploy pod名称 pod名字=镜像名字 
```

更新之后，可以刷新刚才打开的页面，界面已经变化了

![image-20250105212222524](/cloud/image-20250105212222524.png)

这个更新服务已经完成

## 删除服务

可以通过下面的命令去删除服务

```shell
# 查询deployment
kubectl get deployment
# 删除deployment
kubectl delete deployment dotnet-task

# 查询service
kubectl get service
# 删除service
kubectl delete service dotnet-task
```

* Service 用于定义如何访问一组 Pod
* Deployment 用于管理 Pod 的副本和更新策略。

