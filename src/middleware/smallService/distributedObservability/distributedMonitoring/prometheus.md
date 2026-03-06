---
title: Prometheus
lang: zh-CN
date: 2023-09-27
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 监控
filename: prometheus
slug: xyfcw6
docsId: '72941081'
---

## 概述
Prometheus是一个时间序列数据库。但是，它不仅仅是一个时间序列数据库。它涵盖了可以绑定的整个生态系统工具集及其功能。也是一种开源的系统监控和警报工具。它最初由 SoundCloud 开发，并成为 Cloud Native Computing Foundation（CNCF）的一部分。主要用于对基础设施的监控，包括服务器(CPU、MEM等)、数据库(MYSQL、PostgreSQL等)、Web服务等，几乎所有东西都可以通过Prometheus进行监控。而它的数据，则是通过配置，建立与数据源的联系来获取的。

## 特点

Prometheus 具有以下核心特征：

- 多维数据模型：Prometheus 采用时序数据库作为存储，可以灵活的存储多维度的数据。
- 灵活的查询语言：Prometheus 使用了功能强大的 PromQL 查询语言，可以实时查询和聚合时序数据。
- 拉取式采集：Prometheus 通过 HTTP 协议周期性抓取被监控组件状态，而不是通过端口接收推送数据。
- 服务发现：Prometheus 支持各种服务发现机制，可以自动发现监控目标，如果需要监控的服务比较少，也可以使用静态配置。
- 多种可视化组件：如 Grafana、PromDash 等，可以用来展示监控数据，本次系列文章中使用 Grafana 做可视化展示。
- 告警管理：通过 Alertmanager 负责实现报警功能，既可以使用邮件，也能通过 Webhook 自定义告警处理方式。

## 数据写入

把数据写入prometheus有两种方式，一种是pull，一种是push。

pull是让prometheus主动去拉取我们产生的数据，只要我们暴露一个地址出来即可，这种也是比较推荐的做法。

push方式要借助pushgateway，埋点数据要先主动推送到pushgateway，后面在由pushgateway把数据写进prometheus。

默认情况下，我们会将数据暴露在 **http://ip:port/metrics** 这个地址上，然后知道要用pull的方式后，还要做什么呢？当然就是要去配置promethues的 `scrape_configs` 了。

## 操作

### prometheus-net操作

prometheus-net的工作原理是，在应用内部埋点，通过prometheus采集数据，然后通过grafana把采集到的数据展现出来。

引用组件
```csharp
Install-Package prometheus-net.AspNetCore
```

基本使用

```csharp
using Prometheus;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();
app.MapGet("/test", () =>
{
    return "OK";
});
app.MapMetrics();
app.UseHttpMetrics();
app.Run();
```

## 安装

docker-compose安装脚本：https://gitee.com/zhangzonghai/prometheus-docker-compose

### 告警服务Alertmanager

Alertmanager 是 Prometheus 生态系统中的一个组件，负责处理和管理告警。当 Prometheus 检测到异常或达到某个预定的阈值时，它将生成告警并将其发送到 Alertmanager。Alertmanager 可以进行静默、分组、抑制和路由告警，并将它们发送到不同的接收端，如电子邮件、Slack 等

### 指标收集器node Exporter

Node Exporter 是一个用于在 Unix/Linux 系统上暴露系统信息的 Prometheus Exporter。它会收集关于系统资源使用情况、性能指标等方面的信息，并将这些信息提供给 Prometheus 进行监控。Node Exporter 通常与 Prometheus 配合使用，以监控主机上的各种系统级别的指标，例如 CPU 使用率、内存使用率、磁盘空间等。 



在服务器上执行下面的命令进行包下载和安装

```sh
#arm平台
wget https://github.com/prometheus/node_exporter/releases/download/v1.6.1/node_exporter-1.6.1.linux-arm64.tar.gz
tar -xzf node_exporter-1.6.1.linux-arm64.tar.gz
cp node_exporter-1.6.1.linux-arm64/node_exporter /usr/local/bin/

#amd平台
wget https://github.com/prometheus/node_exporter/releases/download/v1.6.1/node_exporter-1.6.1.linux-amd64.tar.gz
tar -xzf node_exporter-1.6.1.linux-amd64.tar.gz
cp node_exporter-1.6.1.linux-amd64/node_exporter /usr/local/bin/
```

设置为系统服务，执行命令执行命令创建服务文件

```
cat > /etc/systemd/system/notdeexporter.service << EOF

# 内容如下

[Unit]
Description=notdeexporter
After=network.target network-online.target nss-lookup.target

[Service]
Type=simple
StandardError=journal
ExecStart = /usr/local/bin/node_exporter
ExecReload=/bin/kill -HUP $MAINPID
LimitNOFILE=512000
Restart=on-failure
RestartSec=10s

[Install]
WantedBy=multi-user.target
EOF
```

设置开启自动启动

```sh
systemctl daemon-reload
systemctl start notdeexporter
systemctl enable notdeexporter
systemctl status notdeexporter
```

当看到绿色的active(running)的时候代表安装成功。访问宿主+9100端口出来下面的界面，说明ok

![image-20240302154531240](/soft/image-20240302154531240.png)

#### 配置node_exporter

修改 Prometheus 的配置文件，添加 node_exporter 的绑定，执行命令 `vi vi /usr/local/prometheus/prometheus.yml `：

![image-20240302154730950](/soft/image-20240302154730950.png)

执行命令 `systemctl restart prometheus` 重启 Prometheus ，然后就可以在grafana等平台配置该Prometheus作为数据源了

## 参考资料

[Prometheus系列教程](https://mp.weixin.qq.com/s/AEY87HZa_x6-1w0Tpa4W2Q)

[https://mp.weixin.qq.com/s/E8XF5JDU1K5lo7N3qPEBCg](https://mp.weixin.qq.com/s/E8XF5JDU1K5lo7N3qPEBCg) | 基于Prometheus和Grafana打造业务监控看板

https://www.aiwanyun.cn/archives/174 | 搭建高级的性能监控系统

配置prometheus：https://learn.microsoft.com/zh-cn/dotnet/core/diagnostics/metrics-collection#view-metrics-in-grafana-with-opentelemetry-and-prometheus

使用 dotnet-monitor + prometheus + grafana 进行诊断：https://dev.to/rafaelpadovezi/diagnosticos-usando-dotnet-monitor-prometheus-grafana-3n7o
