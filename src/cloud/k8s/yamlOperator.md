---
title: Yaml配置操作
lang: zh-CN
date: 2025-04-20
publish: true
author: azrng
isOriginal: true
category:
  - cloud
tag:
  - k3s
  - k8s
---

## 编写Yaml文件

可以使用VsCode工具，搭配插件(YAML、kubernetes-templates)插件来操作，可以通过这两个插件来实现一键生成yaml文件(pod回车、service回车等等)

## 前后端分离服务

### 创建文件

创建backend-deploy.yml文件并添加下面的内容

```yaml
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: pizzabackend
spec:
  replicas: 1
  template:
    metadata:
      labels:
        app: pizzabackend
    spec:
      containers:
      - name: pizzabackend
        image: [YOUR DOCKER USER NAME]/pizzabackend:latest
        ports:
        - containerPort: 80
        env:
        - name: ASPNETCORE_URLS
          value: http://*:80
  selector:
    matchLabels:
      app: pizzabackend
---
apiVersion: v1
kind: Service
metadata:
  name: pizzabackend
spec:
  type: ClusterIP
  ports:
  - port: 80
  selector:
    app: pizzabackend
```

将占位符 [YOUR DOCKER USER NAME] 替换为实际的 Docker 用户名。

文件描述：
第一部分定义了将部署到k8s中容器的部署规范。指定有一个副本，在哪里可以找到容器镜像，在容器上打开哪些端口，并设置了一些环境变量。还定义了引用容器和规范的标签和名称。
第二部分定义了容器作为Kubernetes ClusterIp运行(此类服务不会公开外部IP地址，只能从同一个k8s集群中运行的其他服务访问)。

### 部署并运行服务

使用命令行并转到上面backend-deploy.yml文件的同一个目录，然后运行命令

```yaml
kubectl apply -f backend-deploy.yml
```

这个命令将指示k8s运行已经创建的文件，会从docker hub下载镜像并创建容器。

这里kubectl apply 命令将快速返回。 但容器可能需要一段时间才能创建完成。 若要查看进度，请使用以下代码。

```yaml
kubectl get pods
```

在生成的输出中，你将在“名称”列下看到一个包含“pizzabackend”后跟一串随机字符的行。 一切准备就绪后，“就绪”列下会显示“1/1”，“状态”列下会显示“正在运行”。

然后这个时候去访问服务，提示404，出现这的原因是无法从外部访问后端服务。

### 创建前端服务

创建一个名字为frontend-deploy.yml的文件，并设置内容为

```yaml
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: pizzafrontend
spec:
  replicas: 1
  template:
    metadata:
      labels:
        app: pizzafrontend
    spec:
      containers:
      - name: pizzafrontend
        image: [YOUR DOCKER USER NAME]/pizzafrontend:latest
        ports:
        - containerPort: 80
        env:
        - name: ASPNETCORE_URLS
          value: http://*:80
        - name: backendUrl
          value: http://pizzabackend
  selector:
    matchLabels:
      app: pizzafrontend
---
apiVersion: v1
kind: Service
metadata:
  name: pizzafrontend
spec:
  type: LoadBalancer
  ports:
  - port: 80
  selector:
    app: pizzafrontend
```

将占位符 [YOUR DOCKER USERNAME] 替换为实际的 Docker 用户名。

此文件类似于我们为后端微服务创建的文件。 但有三点不同之处：

- 我们指定了一个不同的容器在部署的 spec.template.spec.containers.image 值下运行。
- spec.template.spec.containers.env 部分下有一个新的环境变量。 “pizzafrontend”应用程序中的代码调用后端，但由于我们还没有指定一个完全限定的域名，也不知道后端微服务的 IP 地址，因此我们使用在 Deployment 的 metadata.name 节点下指定的名称。 然后，Kubernetes 将处理其余部分。
- 在服务部分，我们为 spec.type 指定了 LoadBalancer 值。 并且端口 80 处于打开状态。 我们现在可以通过导航到 **http://localhost** 来浏览前端。


 通过下面的命令将容器部署到k8s

```yaml
kubectl apply -f frontend-deploy.yml
```

同样，可以使用 kubectl get pods 来查看部署状态。成功部署后，就可以浏览前端服务了。

## Pgsql

### 汇总文件配置

#### 不涉及持久化的方案

```yaml
# PostgreSQL 部署配置（无持久化存储版本）
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres-nostore
  labels:
    app: postgres-nostore
spec:
  selector:
    matchLabels:
      app: postgres-nostore
  replicas: 1  # 单实例部署
  strategy:
    rollingUpdate:
      maxSurge: 25%  # 滚动更新时最大可超出副本数
      maxUnavailable: 25%  # 滚动更新时最大不可用副本数
    type: RollingUpdate
  template:
    metadata:
      labels:
        app: postgres-nostore
    spec:
      containers:
        - name: postgres
          image: registry.cn-hangzhou.aliyuncs.com/zrng/postgres:16.4
          imagePullPolicy: IfNotPresent
          # 资源限制配置
          resources:
            requests:
              cpu: 500m  # 请求0.5核CPU
              memory: 512Mi  # 请求512MB内存
            limits:
              cpu: 2000m  # 限制2核CPU
              memory: 2048Mi  # 限制2GB内存
          env:
            - name: POSTGRES_PASSWORD
              value: '123456'
            - name: POSTGRES_USER
              value: 'postgres'
            - name: POSTGRES_DB
              value: 'postgres'
            - name: PGDATA
              value: /var/lib/postgresql/data/pgdata  # 设置PostgreSQL数据目录
          ports:
            - containerPort: 5432
              name: postgres-port
          # 数据卷挂载配置
          volumeMounts:
            - name: postgres-storage
              mountPath: /var/lib/postgresql/data
      volumes:
        - name: postgres-storage
          emptyDir: {}  # 使用临时存储
---
# PostgreSQL 服务配置
apiVersion: v1
kind: Service
metadata:
  name: postgres-nostore
spec:
  selector:
    app: postgres-nostore
  type: NodePort  # 使用NodePort类型，方便外部访问
  ports:
    - name: postgres
      port: 5432
      targetPort: 5432
      protocol: TCP
      nodePort: 32433  # 外部访问端口（注意：与持久化版本使用不同端口） 
```

#### 服务器本地存储方案

```shell
# PostgreSQL 部署配置
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres
  labels:
    app: postgres
spec:
  selector:
    matchLabels:
      app: postgres
  replicas: 1  # 单实例部署
  strategy:
    rollingUpdate:
      maxSurge: 25%  # 滚动更新时最大可超出副本数
      maxUnavailable: 25%  # 滚动更新时最大不可用副本数
    type: RollingUpdate
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
        - name: postgres
          image: registry.cn-hangzhou.aliyuncs.com/zrng/postgres:16.4
          imagePullPolicy: IfNotPresent
          # 资源限制配置
          resources:
            requests:
              cpu: 500m  # 请求0.5核CPU
              memory: 512Mi  # 请求512MB内存
            limits:
              cpu: 2000m  # 限制2核CPU
              memory: 2048Mi  # 限制2GB内存
          env:
            - name: POSTGRES_PASSWORD
              value: '123456'
            - name: POSTGRES_USER
              value: 'postgres'
            - name: POSTGRES_DB
              value: 'postgres'
            - name: PGDATA
              value: /var/lib/postgresql/data/pgdata  # 设置PostgreSQL数据目录
          ports:
            - containerPort: 5432
              name: postgres-port
          # 数据卷挂载配置
          volumeMounts:
            - name: vol-hostpath
              mountPath: /var/lib/postgresql/data
      volumes:
        - name: vol-hostpath
          hostPath:
            path: /data/postgres
            type: DirectoryOrCreate
---
# PostgreSQL 服务配置
apiVersion: v1
kind: Service
metadata:
  name: postgres
spec:
  selector:
    app: postgres
  type: NodePort  # 使用NodePort类型，方便外部访问
  ports:
    - name: postgres
      port: 5432
      targetPort: 5432
      protocol: TCP
      nodePort: 32430  # 外部访问端口
```

### 单独文件配置

postgresql-deployment.yaml

```shell
apiVersion: apps/v1 # 指定Kubernetes API的版本，这里是apps/v1
kind: Deployment # 定义资源对象类型
metadata: # 定义资源的元数据
  name: postgresql # 定义资源名
spec: # 定义StatefulSet的具体规格和配置
  replicas: 1 # 指定副本数
  selector: # 指定如何匹配pods
    matchLabels: # 根据标签app: postgresql匹配
      app: postgresql
  template: # 定义pod模版
    metadata: 
      name: postgresql
      labels:
        app: postgresql # 配置如何匹配services
    spec:
      # volumes: # 定义了pods可以使用的卷，将主机上的/home/data/pgdata目录挂在到pod内部
      #   - name: hostpath
      #     hostPath:
      #       path: /home/data/pgdata
      containers: # 定义了容器的配置
        - image: registry.cn-hangzhou.aliyuncs.com/zrng/postgres:16.4 # 定义容器镜像
          name: postgres16 # 定义容器名 
          imagePullPolicy: Always # 定义容器拉取策略,Always:代表每次启动容器都会尝试拉取最新镜像 IfNotPresent:如果没有才拉取
          # volumeMounts: # 定义卷挂载的配置，这里将 hostPath 卷挂载到容器的 /var/lib/postgresql/data 目录。
          #   - mountPath: /var/lib/postgresql/data
          #     name: hostpath
          ports:
            - containerPort: 5432 # 服务监听的端口
          env: # 定义环境变量
            - name: POSTGRES_USER # 用户名
              value: postgres
            - name: POSTGRES_PASSWORD # 密码
              value: "123456"
            - name: POSTGRES_DB # 数据库名
              value: sample
```

postgresql-service.yaml

```shell
apiVersion: v1 # 定义Kubernetes资源对象，类型是service
kind: Service
metadata:
  name: postgresql
spec:
  selector:
    app: postgresql # 定义了如何匹配pods
  type: NodePort # 定义服务类型，nodePort代表可以通过节点的端口对外提供访问
  ports: 
    - port: 5434 # 定义服务监听的内部端口
      targetPort: 5432 # 目标pod监听的端口
      protocol: TCP
      nodePort: 32434 # node释放的外部端口
```

## redis

### 创建配置文件

创建配置文件redis-master-deployment.yaml

```yaml
apiVersion: apps/v1 
kind: Deployment
metadata:
  name: redis-master
  labels:
    app: redis
spec:
  selector:
    matchLabels:
      app: redis
      role: master
      tier: backend
  replicas: 1
  template:
    metadata:
      labels:
        app: redis
        role: master
        tier: backend
    spec:
      containers:
      - name: master
        image: kubeguide/redis-master
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: 6379
```

创建服务文件：redis-master-service.yaml

```yaml
apiVersion: v1
kind: Service
metadata:
  name: redis-master
  labels:
    app: redis
    role: master
    tier: backend
spec:
  ports:
  - port: 6379
    targetPort: 6379
  selector:
    app: redis
    role: master
    tier: backend
```

### 执行

执行命令更新k3s

```shell
sudo kubectl apply -f ./config/redis/redis-master-deployment.yaml
sudo kubectl apply -f ./config/redis/redis-master-service.yaml
```

然后获取当前的容器信息(pods)

```sh
sudo kubectl get pods

NAME                          READY   STATUS    RESTARTS   AGE
redis-master-7fc8b5fb-gxdxl   1/1     Running   0          46s
```

## dotNet

master-deployment.yaml

:::tip

Deployment 用于管理 Pod 的副本和更新策略

:::

```shell
apiVersion: apps/v1
kind: Deployment
metadata:
  name: net-sample
  labels:
    name: net-sample
spec:
  selector:
    matchLabels:
      name: net-sample
  replicas: 1 # 启动实例数
  template:
    metadata:
      labels:
        name: net-sample
    spec:
      containers:
        - name: net-sample
          image: registry.cn-hangzhou.aliyuncs.com/zrng/test:0.0.2 # 镜像地址
          imagePullPolicy: Always
          ports:
            - containerPort: 8080 # 端口和netcore内部端口要一致
```

master-service.yaml

:::tip

Service 用于定义如何访问一组 Pod

:::

```yaml
apiVersion: v1
kind: Service
metadata:
  name: net-sample
spec: # 表示这个service对象的配置信息
  type: NodePort
  ports: # 表示要暴漏的端口列表
    - port: 8080 # 需要暴漏的端口号
      targetPort: 8080 # 应该将请求转发到pod中监听的指定端口的容器中
  selector: # 选择哪些pod来提供服务
    name: net-sample
```

### 执行操作

```shell
sudo kubectl apply -f master-deployment.yaml

sudo kubectl apply -f master-service.yaml

# 如果需要修改yaml文件，重启pod
sudo kubectl replace --force -f master-deployment.yaml
sudo kubectl replace --force -f master-service.yaml
```

查看容器端口信息信息

```shell
sudo kubectl get svc

NAME           TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)          AGE
kubernetes     ClusterIP   10.43.0.1      <none>        443/TCP          60d
net-sample     NodePort    10.43.122.55   <none>        8080:30090/TCP   6m40s
```

正常来说，这个时候访问30090端口就可以访问页面，`http://localhost:30090/api/Test/GetDateTime`

### 单文件示例

```yaml
apiVersion: v1
items:
  - apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: dotnet-weather
      labels:
        service: dotnet
        fromApp: dotnet
    spec:
      replicas: 1
      selector:
        matchLabels:
          app: dotnet-weather
      template:
        metadata:
          labels:
            app: dotnet-weather
            service: dotnet
        spec:
          containers:
            - image: registry.cn-hangzhou.aliyuncs.com/zrng/test2:main
              name: dotnet-weather
              imagePullPolicy: IfNotPresent
              ports:
                - containerPort: 8080
                  name: weather-port
              resources:
                limits:
                  memory: 4Gi
                  cpu: '2'
                requests:
                  memory: 128Mi
                  cpu: 10m
              env: []
              envFrom: []
  - apiVersion: v1
    kind: Service
    metadata:
      name: dotnet-weather
    spec:
      selector:
        app: dotnet-weather
      ports:
        - name: weather-port
          port: 8081
          targetPort: 8080
          protocol: TCP
          nodePort: 32101
      type: NodePort
kind: List

```

最后访问示例为：`localhost:32101/WeatherForecast`

### 删除服务

```shell
# 删除deployment
kubectl delete deployment <deployment-name> -n <namespace>

# 删除service
kubectl delete svc <service-name> -n <namespace>
```

### 参考文档

https://www.cnblogs.com/study10000/p/14898471.html

