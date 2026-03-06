---
title: Consul
lang: zh-CN
date: 2022-10-21
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: consul
slug: duatug
docsId: '31211413'
---
> 理解：将一些服务注册到consul里面，然后后期想使用，需要根据指定的接口去获取服务地址和端口（多个负载的情况下会返回一个），然后再去调用我们想调用的服务

## 描述

一个服务管理(服务注册与发现)软件。支持多数据中心下，分布式高可用的服务发现和配置共享。支持健康检查允许存储键值对。



在consul方案汇总中，每个提供服务的节点都要部署和运行consul的client agent，所有运行consul agent节点的集合构成consul cluster。Consul agent有两种运行方式：server和client。这里的server和client只是consul集群层面的区分，与搭建在cluster的应用服务无关。以server模式运行的consul agent节点用于维护consul集群的状态，官方建议每个consl cluster至少有3个或者以上的运行在server mode的agent，client节点不限。

官网：[https://www.consul.io/](https://www.consul.io/)
.NET Core微服务之基于Consul实现服务治理：[https://www.cnblogs.com/edisonchou/p/9124985.html](https://www.cnblogs.com/edisonchou/p/9124985.html)
demo：[https://www.cnblogs.com/wyt007/p/9150116.html](https://www.cnblogs.com/wyt007/p/9150116.html)

## 功能

### 服务注册

一个服务将其位置信息在“中心注册节点”注册的过程。该服务一般会将它的主机IP地址以及端口号进行注册，有时也会有服务访问的认证信息，使用协议，版本号，以及关于环境的一些细节信息。

### 服务发现

服务发现可以让一个应用或者组件发现其运行环境以及其它应用或组件的信息。用户配置一个服务发现工具就可以将实际容器跟运行配置分离开。常见配置信息包括：ip、端口号、名称等



consul客户端将自己本身通过ip和port注册到consul里面，当其他客户端需要使用对应的服务时候，consul可以通过**DNS或HTTP**的形式将服务返回给所需要的客户端，并且可以设置服务启动后多久开始注册、设置健康检查的时间间隔。

可以通过调用consul提供的API来发现服务的ip和port
浏览器输入[http://192.168.80.100:8500/v1/catalog/service/](http://192.168.80.100:8500/v1/catalog/service/)Aservice
通过其返回的结果，我们可以查看到该服务(AService)的ip和port，然后进行调用接口
如果是在集群的环境下，可能一个服务部署对应多个示例，以组成集群来实现负载均衡，那么这个时候服务发现会随机选择其中一个进行返回。
查询领导者：[http://192.168.6.29:8500/v1/status/leader](http://192.168.6.29:8500/v1/status/leader)
常用接口说明地址：[https://www.consul.io/api-docs](https://www.consul.io/api-docs)

### 健康检查
consul提供对各服务的检查功能，如果一个API站点挂掉，调用方再次从consul获取服务信息时候就会返回健康的服务信息，从而保证调用API正常。**Grpc、TCP、Http**方式都可以

### 键值对存储
可以存储键值对信息充当配置中心。比如说：动态配置，特征标记，协调，leader等。kv存储的api是基于http的。
查看所有的kv
命令：curl -v [http://192.168.130.148/v1/kv/?recurse](http://192.168.130.148/v1/kv/?recurse)
浏览器输入提示404那么就说明现在没有一个key/value存储项。
新增kv
命令：curl -X PUT -d 'edisonchou' [http://192.168.130.148:8500/v1/kv/web/vhallaccount](http://192.168.130.148:8500/v1/kv/web/vhallaccount)
key:vhallaccount, value:edisonchou
添加后可以通过下面的命令调用接口查看这个key对应的value
命令：curl [http://192.168.80.100:8500/v1/kv/web/vhallaccount](http://192.168.80.100:8500/v1/kv/web/vhallaccount)
编辑kv
命令：curl -X PUT -d 'andyai' [http://192.168.80.100:8500/v1/kv/web/vhallaccount](http://192.168.80.100:8500/v1/kv/web/vhallaccount)
删除kv
命令：curl -X DELETE [http://192.168.80.100:8500/v1/kv/web/vhallaccount](http://192.168.80.100:8500/v1/kv/web/vhallaccount)

### 多数据中心
consul支持多个开箱即用的数据中心，每个数据中心独立运行。     

### 告警值watch机制
详情看：[https://www.cnblogs.com/edisonchou/p/9148034.html](https://www.cnblogs.com/edisonchou/p/9148034.html)

## 安装
```yaml
## docker部署consul集群

#启动第1个Server节点，集群要求要有3个Server，将容器8500端口映射到主机8900端口，同时开启管理界面
docker run -d --name=consul1 -p 8900:8500 -e CONSUL_BIND_INTERFACE=eth0 consul agent --server=true --bootstrap-expect=3 --client=0.0.0.0 -ui
#启动第2个Server节点，并加入集群
docker run -d --name=consul2 -e CONSUL_BIND_INTERFACE=eth0 consul agent --server=true --client=0.0.0.0 --join 172.17.0.1
#启动第3个Server节点，并加入集群
docker run -d --name=consul3 -e CONSUL_BIND_INTERFACE=eth0 consul agent --server=true --client=0.0.0.0 --join 172.17.0.2
#启动第4个Client节点，并加入集群
docker run -d --name=consul4 -e CONSUL_BIND_INTERFACE=eth0 consul agent --server=false --client=0.0.0.0 --join 172.17.0.2
```
> docker搭建consul ：[https://www.cnblogs.com/edisonchou/p/consul_cluster_based_on_docker_introduction.html](https://www.cnblogs.com/edisonchou/p/consul_cluster_based_on_docker_introduction.html)


## 操作

### 基本配置
配置项
```yaml
  "Consul": {
    "IP": "192.168.130.148",
    "Port": 8500
  },
```
引用组件
```yaml
<PackageReference Include="Consul" Version="0.7.2.6" />
```
增加服务信息配置类
```csharp
public class ServiceEntity
{
    public string IP { get; set; }
    public int Port { get; set; }
    public string ServiceName { get; set; }
    public string ConsulIP { get; set; }
    public int ConsulPort { get; set; }
}
```
注册服务
```csharp
public static class AppBuilderExtensions
{
    public static IApplicationBuilder RegisterConsul(this IApplicationBuilder app, IHostApplicationLifetime lifetime, ServiceEntity serviceEntity)
    {
        //请求注册的consul地址
        var consulClient = new ConsulClient(x => x.Address = new Uri($"http://{serviceEntity.ConsulIP}:{serviceEntity.ConsulPort}"));
        var httpcheck = new AgentServiceCheck()
        {
            DeregisterCriticalServiceAfter = TimeSpan.FromSeconds(5),//服务启动多久后注册
            Interval = TimeSpan.FromSeconds(10),//健康检查时间间隔，或者成为心跳间隔
            HTTP = $"http://{serviceEntity.IP}:{serviceEntity.Port}/api/Health",//健康检查访问的地址
            Timeout = TimeSpan.FromSeconds(5)
        };
        //注册服务到consul
        var registration = new AgentServiceRegistration()
        {
            Checks = new[] { httpcheck },
            ID = Guid.NewGuid().ToString(),
            Name = serviceEntity.ServiceName,
            Address = serviceEntity.IP,
            Port = serviceEntity.Port,
            Tags = new[] { $"urlprefix-/{serviceEntity.ServiceName}" }//添加 urlprefix-/servicename 格式的 tag 标签，以便 Fabio 识别
        };
        consulClient.Agent.ServiceRegister(registration).Wait();//服务启动时注册，内部实现其实就是consul API进行注册
        lifetime.ApplicationStopping.Register(() =>
        {
            consulClient.Agent.ServiceDeregister(registration.ID).Wait();//服务停止时取消注册
        });
        return app;
    }
}
```

### 获取服务地址
```csharp
private async Task<string> LookupServiceAsync(string serviceName)
{
    using (var consulClient = new ConsulClient(c => c.Address = new Uri("consul url")))
    {
        var services = (await consulClient.Catalog.Service(serviceName)).Response;
        if (services != null && services.Any())
        {
            //注入负载均衡策略 根据当前的tickcount对服务器个数取模，“随机”取一个机器出来，避免“轮询”的负载均衡策略需要计数加锁问题
            var service = services.ElementAt(Environment.TickCount % services.Count());
            return service.Address + ":" + service.ServicePort;
        }
        return null;
    }
}
```

## 资料

Asp .Net Core 系列： 集成 Consul 实现 服务注册与健康检查https://www.cnblogs.com/vic-tory/p/17961740

https://mp.weixin.qq.com/s/6xGBpFxDs2EDTn7xT-8YuA | .NET服务发现(Microsoft.Extensions.ServiceDiscovery)集成Consul
