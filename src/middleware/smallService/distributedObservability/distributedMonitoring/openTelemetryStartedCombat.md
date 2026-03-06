---
title: OpenTelemetry快速开始
lang: zh-CN
date: 2023-09-29
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - OpenTelemetry
---
## 工具介绍
注意：该部分介绍摘抄自：[https://www.aiwanyun.cn/archives/174](https://www.aiwanyun.cn/archives/174)

Prometheus、Grafana、Node Exporter 和Alertmanager是一组用于监控和可视化系统性能的开源工具。它们通常一起使用，形成一个强大的完整的监控和告警系统。 一般来说，这四个工具一起协作，形成了一个完整的监控和告警系统。Node Exporter用于收集主机级别的指标(本文暂未使用)，Prometheus存储和查询这些指标，Grafana提供可视化界面，而Alertmanager则负责管理和发送告警。整个系统的目标是帮助管理员和开发人员实时了解系统的状态、性能和健康状况，并在必要时采取措施。 
### Prometheus 
Prometheus 是一种开源的系统监控和警报工具。它最初由 SoundCloud 开发，并成为 Cloud Native Computing Foundation（CNCF）的一部分。Prometheus 支持多维度的数据模型和强大的查询语言，使得用户可以轻松地收集和查询各种类型的监控数据。 
### Grafana
Grafana 是一个开源的数据可视化和监控平台。它提供了丰富的图表和仪表盘，可以将各种数据源的信息可视化展示。Grafana 支持多个数据源，包括 Prometheus、Graphite、InfluxDB 等，因此可以与各种监控系统集成，提供灵活且强大的可视化功能。 
### Alertmanager
Alertmanager 是 Prometheus 生态系统中的一个组件，负责处理和管理告警。当 Prometheus 检测到异常或达到某个预定的阈值时，它将生成告警并将其发送到 Alertmanager。Alertmanager 可以进行静默、分组、抑制和路由告警，并将它们发送到不同的接收端，如电子邮件、Slack 等
## .NetCore项目准备
基于我的一个示例项目进行改造，项目地址：[https://gitee.com/AZRNG/my-example](https://gitee.com/AZRNG/my-example) ，为了演示一个基本的监控效果，监控的数据也只是请求，具体生产环境需要监控什么业务，这个看具体情况了，这里需要在原来的项目基础上需要安装以下nuget包
```csharp
<PackageReference Include="OpenTelemetry.Exporter.Prometheus.AspNetCore" Version="1.7.0-alpha.1" />
<PackageReference Include="OpenTelemetry.Extensions.Hosting" Version="1.7.0" />
```
然后就可以注入服务，这里只是举例操作
```csharp
services.AddOpenTelemetry()
        .WithMetrics(builder =>
        {
            builder.AddPrometheusExporter();
            builder.AddMeter("Microsoft.AspNetCore.Hosting", "Microsoft.AspNetCore.Server.Kestrel");
        });
```
最后记得要使用服务
```csharp
app.MapPrometheusScrapingEndpoint();
```
启动项目后访问 ip+ metrics访问页面
![image.png](/soft/a5ef7ca6bc7842419734f7f403946d62.png)
然后将该示例项目使用docker部署到服务器上 ，如果要使用该示例项目，记得切换分支到develop，将项目拉取到服务器，然后进入项目目录，执行命令去生成容器

```csharp
sudo docker-compose up -d
```
部署成功截图如下
![image.png](/soft/b75760d1815c4512adbf2ff69dc18265.png)
访问地址 [http://192.168.82.163:8001/metrics](http://192.168.82.163:8001/metrics)
![image.png](/soft/e1a777ed966749399b6075b8497b464b.png)

## 安装监控和可视化程序
准备一个服务器，提前安装好了docker以及docker-compose程序，版本示例如下
![image.png](/soft/18e098d9e5704f949b2c17d3cb65d553.png)
关于Prometheus和Grafana可以通过docker进行安装到服务器中，可以参考仓库：[https://gitee.com/AZRNG/common-docker-yaml](https://gitee.com/AZRNG/common-docker-yaml)

### 安装Prometheus
因为这里我只是用于做demo演示效果，所以我并没有取考虑挂在的问题，生产环境使用记得挂载数据
```csharp
version: '3'

services:
  prometheus: ## 访问：http://localhost:9090/targets
   image: prom/prometheus:v2.37.6
   container_name: prometheus 
   command:
     - '--config.file=/etc/prometheus/prometheus.yml'
     - '--storage.tsdb.path=/prometheus'
     - '--web.console.libraries=/usr/share/prometheus/console_libraries'
     - '--web.console.templates=/usr/share/prometheus/consoles'
     - '--web.external-url=http://localhost:9090/'
     - '--web.enable-lifecycle'
     - '--storage.tsdb.retention=15d'
   volumes:
     #- /etc/localtime:/etc/localtime:ro
     - ./config/prometheus/:/etc/prometheus/
     #- ./data/prometheus:/prometheus
   ports:
     - 9090:9090
   links:
     - alertmanager:alertmanager

  alertmanager: ## 告警服务
   image: prom/alertmanager:v0.25.0
   container_name: alertmanager
   ports:
     - 9093:9093
   volumes:
    ##  - /etc/localtime:/etc/localtime:ro
     - ./config/prometheus/:/etc/alertmanager/
   command:
     - '--config.file=/etc/alertmanager/alertmanager.yml'
     - '--storage.path=/alertmanager'
```
关于prometheus.yml内容如下
```csharp
## 全局配置
global:
  scrape_interval: 15s
  evaluation_interval: 15s
  ## scrape_timeout is set to the global default (10s).
## 告警配置
alerting:
  alertmanagers:
    - static_configs:
        - targets: ['localhost:9093']
## 加载一次规则，并根据全局“评估间隔”定期评估它们。
rule_files:
  - "/config/rules.yml"
## 控制Prometheus监视哪些资源
## 默认配置中，有一个名为prometheus的作业，它会收集Prometheus服务器公开的时间序列数据。
scrape_configs:
  ## 作业名称将作为标签“job=<job_name>`添加到此配置中获取的任何数据。
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']
  - job_name: 'node' ## .NetCore服务地址
    static_configs:
      - targets: ['localhost:9100']
        labels:
          env: dev
          role: docker
```
alertmanager.yml文件，我并没有做配置，暂时搞了一个默认的
```csharp
global:
  resolve_timeout: 5m
  smtp_smarthost: 'xxx@xxx:587'
  smtp_from: 'zhaoysz@xxx'
  smtp_auth_username: 'xxx@xxx'
  smtp_auth_password: 'xxxx'
  smtp_require_tls: true
route:
  group_by: ['alertname']
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 1h
  receiver: 'test-mails'
receivers:
- name: 'test-mails'
  email_configs:
  - to: 'scottcho@qq.com'
```
rule.yml文件内容如下
```csharp
groups:
- name: example
  rules:
 ## Alert for any instance that is unreachable for >5 minutes.
  - alert: InstanceDown
    expr: up == 0
    for: 1m
    labels:
      serverity: page
    annotations:
      summary: "Instance {{ $labels.instance }} down"
      description: "{{ $labels.instance }} of job {{ $labels.job }} has been down for more than 5 minutes."

```
然后就可以运行docker-compose命令去生成容器，示例如下
![image.png](/soft/d2d7bb6e27e14bd2803e904e59a33ed1.png)

然后访问Ip地址加端口访问页面，比如http://192.168.81.139:9090/
![image.png](/soft/b2d7ba1bf55d43a6b9ac1fb9f4f94f02.png)
打开这个界面就说明安装好了，这个时候我们看下 [http://192.168.81.139:9090/targets?search=](http://192.168.81.139:9090/targets?search=)  页面
![image.png](/soft/a38c174edc274fef89b79cbd412b1d78.png)
这个node报错是因为这个地址是无效了，那么修改为真是.NetCore的服务地址，修改配置文件然后重新启动
![image.png](/soft/a7bbf3581f14433497885edf1a7c05fb.png)
重启后界面显示如下
![image.png](/soft/88a0224156124d62b0eff11ad046188a.png)

### 安装Granfana
这里直接使用docker来安装grafana
```csharp
sudo docker run --name grafana -d -p 8000:3000 grafana/grafana
```
然后访问地址 ip+ 8000，默认账号密码为admin/admin
![image.png](/soft/1408d9b04f8d4e0d81d3013e6533ec2e.png)
添加数据源
![image.png](/soft/f6e3c303aa0e40cdbe705e588ebf9ee7.png)
![image.png](/soft/1bef194077a448a38888fdd1ba4c6d46.png)
填写prometheus地址
![image.png](/soft/01c8f09ff60e42afa1c0107bf3136e18.png)

## 导入仪表盘
创建文件夹用来存放我们本地的要导入的文件
![image.png](/soft/9f7b37829273485781ba11ed142f1401.png)
![image.png](/soft/4e957a61a6b344cdb6b661a3321c198f.png)
想要在Grafana中进行数据的展示，需要导入dashborards模板，本文的模板我是从微软仓库找到的，地址为：[https://github.com/dotnet/aspire/tree/main/src/Grafana](https://github.com/dotnet/aspire/tree/main/src/Grafana)
![image.png](/soft/5d181ac981d34ddca81c5b908beb18b6.png)
分别点进去下载这两个仪表盘对应的的json文件即可，也可以去我common-docker-yaml仓库中下载
![image.png](/soft/2a1ab5af57174058a234806d03399f5c.png)
然后导入json文件
![image.png](/soft/a965f6e35c7a417fb45d584fcedb1ff2.png)
导入aspnetcore.json文件，并选择我们的netcore文件夹以及选择刚刚我们创建的Prometheus数据源

 ![image.png](/soft/43bbbc5490c342d6842b9ef485c6190e.png)
导入aspnetcore-endpoint.json文件
![image.png](/soft/fa0f036049a1452492ae4d30663d8457.png)
这个时候我们就看到了好看的仪表盘
![image.png](/soft/7f832b36c926435d9c64bcbe3eef875e.png)
![image.png](/soft/e4f53d2010424875a277b8a96045923c.png)
当我点击接口让其报错，那么就显示到界面上
![image.png](/soft/edb085bca1b04448a2ce3959c1d3b59c.png)
如果需要监控其他内容，也可以模仿着进行修改。

