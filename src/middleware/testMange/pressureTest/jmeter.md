---
title: JMeter
lang: zh-CN
date: 2023-09-10
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: jmeter
slug: wtgtg4
docsId: '70189201'
---

## 概述
Apache JMeter 可用于测试静态和动态资源、Web 动态应用程序的性能。
它可用于模拟服务器、服务器组、网络或对象上的重负载，以测试其强度或分析不同负载类型下的整体性能。

## 安装
安装Java JDK，下载地址：[https://www.oracle.com/java/technologies/downloads/](https://www.oracle.com/java/technologies/downloads/)
JMeter官网下载：[https://jmeter.apache.org/download_jmeter.cgi](https://jmeter.apache.org/download_jmeter.cgi)

## 总结报告名词解释
Throughput：吞吐量


## 操作
> 下面的JMeter基于源码包操作，版本5.4.1

### 基础软件使用

#### 启动

在安装java jdk并且下载好Jmeter后，找到里面的bin目录的jmeter.bat，双击启动即可。

#### 设置中文
默认打开后选择Options，然后点击Choose Language，然后选择中文简体即可。

#### 添加虚拟用户组
右击“Test Plan”>添加> 线程 > 线程组
![image.png](/common/1647758795922-d864773b-f497-4eb0-a85f-693edd024b5e.png)
> 线程组：JMeter是由Java实现的，并且使用一个Java线程来模拟一个用户，因此线程组（Thread Group）就是指一组用户的意思

线程组里面常用设置解释

- 名称：当前线程组配置起个名字
- 线程数：指虚拟用户数，默认的输入是“1”，则表明模拟一个虚拟用户访问被测系统，如果想模拟100个用户，则此处输入100。
- Ramp-Up时间(秒)：虚拟用户增长时长。比如你测试的是一个考勤系统，那么实际用户登录使用考勤系统的时候并不是大家喊1、2、3 - 走起，然后一起登录。实际使用场景可能是9点钟上班，那么从8:30开始，考勤系统会陆陆续续有人开始登录，直到9:10左右，那么如果完全按照用户的使用场景，设计该测试的时候此处应输入40（分钟）* 60（秒）= 2400。实际测试一般不会设置如此长的Ramp-Up时间，一般情况下，可以估计出登录频率最高的时间长度，比如此处可能从8:55到9:00登录的人最多，那这里设置成300秒，如果“线程数”输入为100，则意味着在5分钟内100用户登录完毕。
- 循环次数：该处设置一个虚拟用户做多少次的测试。默认为1，意味着一个虚拟用户做完一遍事情之后，该虚拟用户停止运行。如果选中“永远”，则意味着测试运行起来之后就根本停不下来了，除非你把它强制停止。

#### 添加被测试页面
右击刚才添加的线程组>添加>取样器> HTTP请求。
![image.png](/common/1647758783062-7bb5cb36-60da-406f-800b-c72e19ab77a6.png)
设置解释

- 名称：为要测试的页面起一个名称
- 服务器名称或IP：被测试服务器网站的名称，也可以是ip地址。

Ctrl+ S保存该配置，然后点击上面的【>】启动，点击后你发现没有啥变化，是因为这个时候已经运行结束了。点击选项>日志查看，我们看到已经执行结束
```csharp
INFO o.a.j.g.u.JMeterMenuBar: setRunning(false, *local*)
```

#### 添加结果监听器
右击刚才添加的线程组>添加>监听器>察看结果数 来查看性能测试过程中请求和响应信息。添加完毕后，保存测试脚本，再次运行。
运行结束后，点击察看结果数 > baidu ，然后就可以看到一些测试期间一些有用的信息，比如发送的请求信息和响应的数据等。
![image.png](/common/1647758832796-a263974b-963b-4cce-b411-aefcad447be8.png)

#### 添加HTTP请求头
右击刚才添加的线程组>添加>配置元件>HTTP信息头管理器，添加必要的请求头即可。
比如我们post请求的参数是Json格式，那么就需要添加
名称：Content-Type 值：application/json

### 调用接口测试

#### Post请求

操作类似于上面的添加被测试页面。
场景：要测试的接口是一个本地登录接口，Post类型，json格式
![image.png](/common/1647761253227-721d2e22-088b-4330-be03-8195c70434bd.png)

### 命令行压测

使用cli的方式进行压测

```shell
./jmeter -n -t D:\userList.jmx -l result.jtl -j test.log
```

## 压测接口示例

### 压测用户列表

关于并发线程数设置：https://www.cnblogs.com/grey-wolf/p/17765546.html#3258437914



jmeter设置如下

![image-20231022210208596](/common/image-20231022210208596.png)

这里配置的是使用300个线程(users),但是Ramp-up period 是300s，意思是在300s内将我那300个线程启动起来，也就是1s增加1个；

Loop count我这里是设置为无限，但是他并不会一直跑下去，因为上图中我设置Duration为600s，也就是说脚本总共可以跑10分钟

总结：该配置可以让该压测任务，在前300s内，会逐步从1个线程增加到300个线程，在后面的300s，就是300个线程同时去执行，这个时候压力是稳定的300线程产生的并发

### 运行

执行下面的命令行

```
./jmeter -n -t D:\码云\my-example\JMeterTest\userList.jmx -l result.jtl -j test.log
```

然后会出现如下的输出

```shell
summary +  96744 in 00:00:19 = 4992.0/s Avg:     1 Min:     0 Max:   163 Err:     0 (0.00%) Active: 20 Started: 20 Finished: 0
```

表示现在是压测开始后的第19s，96744是总共发出去的请求，4992.0/s 是这期间的tps，后面就是平均数、最小、最大、错误数



过一阵折后，会连着出现这样子的东西

```shell
summary +  96744 in 00:00:19 = 4992.0/s Avg:     1 Min:     0 Max:   163 Err:     0 (0.00%) Active: 20 Started: 20 Finished: 0
summary + 164529 in 00:00:30 = 5484.3/s Avg:     6 Min:     0 Max:   503 Err:     0 (0.00%) Active: 50 Started: 50 Finished: 0
summary = 261273 in 00:00:49 = 5291.1/s Avg:     4 Min:     0 Max:   503 Err:     0 (0.00%)
summary + 172833 in 00:00:30 = 5758.6/s Avg:    11 Min:     1 Max:   479 Err:     0 (0.00%) Active: 80 Started: 80 Finished: 0
summary = 434106 in 00:01:19 = 5467.8/s Avg:     7 Min:     0 Max:   503 Err:     0 (0.00%)
```

为+的那一行，表示的是增量，从上一行结束，过去了30s，这35s内产生了164529个请求，这期间的tpc是5484.3

为=的那一行，就是脚本从开始到目前为止，总的指标数，比如434106这个请求数，就是1:19s的时候请求数位261273+增量的172833.



## 资料
接口性能测试：[https://mp.weixin.qq.com/s/XIfN3ETbN0oWjmZsiSdcMw](https://mp.weixin.qq.com/s/XIfN3ETbN0oWjmZsiSdcMw)
[https://mp.weixin.qq.com/s/D3i0-QOqt7B2UikF5hJmFw](https://mp.weixin.qq.com/s/D3i0-QOqt7B2UikF5hJmFw) | .NET 6 EFCore WebAPI 使用 JMeter 进行吞吐量测试
jmeter教程：[https://www.cnblogs.com/du-hong/category/1149349.html](https://www.cnblogs.com/du-hong/category/1149349.html) 

[https://mp.weixin.qq.com/s/vqr0-c3DK3_ExVdRW8JTTA](https://mp.weixin.qq.com/s/vqr0-c3DK3_ExVdRW8JTTA) | 后端开发都应该了解点接口的压力测试(Apache Bench版)

jmeter进行简单压测：https://www.cnblogs.com/grey-wolf/p/17765546.html

[https://mp.weixin.qq.com/s/MRDvIbmqkj1bBuGk_Eudjw](https://mp.weixin.qq.com/s/MRDvIbmqkj1bBuGk_Eudjw) | .NET 6 EFCore WebAPI 使用 JMeter 进行吞吐量测试
