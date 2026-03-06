---
title: Grafana
lang: zh-CN
date: 2023-07-27
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: grafana
slug: sim3as
docsId: '54180497'
---

## 概述
Grafana是一个跨平台的开源的度量分析和可视化工具，可以通过将采集的数据查询然后可视化的展示，并及时通知。它主要有以下六大特点：
1、展示方式：快速灵活的客户端图表，面板插件有许多不同方式的可视化指标和日志，官方库中具有丰富的仪表盘插件，比如热图、折线图、图表等多种展示方式；
2、数据源：Graphite，InfluxDB，OpenTSDB，Prometheus，Elasticsearch，CloudWatch和KairosDB等；
3、通知提醒：以可视方式定义最重要指标的警报规则，Grafana将不断计算并发送通知，在数据达到阈值时通过Slack、PagerDuty等获得通知；
4、混合展示：在同一图表中混合使用不同的数据源，可以基于每个查询指定数据源，甚至自定义数据源；
5、注释：使用来自不同数据源的丰富事件注释图表，将鼠标悬停在事件上会显示完整的事件元数据和标记；
6、过滤器：Ad-hoc过滤器允许动态创建新的键/值过滤器，这些过滤器会自动应用于使用该数据源的所有查询。
官网：[https://grafana.com/docs/grafana/v7.5/getting-started/](https://grafana.com/docs/grafana/v7.5/getting-started/)

## 仪表盘

grafana官网dotNet仪表盘地址：https://grafana.com/orgs/dotnetteam

.NetCore仪表盘：https://github.com/dotnet/aspire/tree/main/src/Grafana

## 配置

配置文档：[https://grafana.com/docs/grafana/v9.0/setup-grafana/configure-grafana/](https://grafana.com/docs/grafana/v9.0/setup-grafana/configure-grafana/)

### 分享配置

- grafana去掉侧边栏,URL后面加上参数 "&kiosk=tv"
- grafana去掉顶端菜单栏，同时也去掉侧边栏,URL后面加上参数 "&kiosk"
- 免密登录，通过编辑conf目录下的default.ini文件就可以做到，开启免密查看
```csharp
 [auth.anonymous]
 
 ## enable anonymous access
 
enabled = true         #默认false
 
## specify role for unauthenticated users
 
org_role = Viewer    #默认Viewer
```

- 页面嵌入，提示Refused to display 'XXX' in a frame because it set 'X-Frame-Options' to 'deny'
```csharp
defaults.ini配置文件修改allow_embedding = true

kiosk=tv 可以隐藏去掉grafana大盘左侧工具条
```

## 安装

直接docker安装

```sh
docker run --name grafana -d -p 8000:3000 grafana/grafana
```

## 示例
查询示例
```csharp
SELECT 
	 "患者标识",
	 transform(replace("患者来源类型",' ',''),['1','2','3'],['住院类型','门诊类型','急诊类型'],'无') as "患者来源类型",
     "住院号",
     transform(replace("就诊类型",' ',''),['1','2','3'],['住院','门诊','急诊'],'无') as "就诊类型",
      "账户名",
             "医院Code",
             "医院名称",
            "厂商ID",
             "厂商名字",
            "医生ID",
             "医生工号",
             "医生名称",
            "科室Code",
            "科室名"

from 
(
	select
	        replace("患者标识",'"','') "患者标识",
	        replace("患者来源类型",'"','') "患者来源类型",
	        replace("住院号",'"','') "住院号",
	        replace("就诊类型",'"','') "就诊类型",
	        replace("账户名",'"','') "账户名",
	        replace("医院Code",'"','') "医院Code",
	        replace("医院名称",'"','') "医院名称",
	        replace("厂商ID",'"','') "厂商ID",
	        replace("厂商名字",'"','') "厂商名字",
	        replace("医生ID",'"','') "医生ID",
	        replace("医生工号",'"','') "医生工号",
	        replace("医生名称",'"','') "医生名称",
	        replace("科室Code",'"','') "科室Code",
	        replace("科室名",'"','') "科室名"
	from
			(
 				select
				visitParamExtractRaw(replace(extra_info,'\\\\\\',''),'patientNo') "患者标识",
				visitParamExtractRaw(replace(replace(extra_info,'null',''),'\\\\\\',''),'patientSourceType') "患者来源类型",
				visitParamExtractRaw(replace(replace(extra_info,'null',''),'\\\\\\',''),'sourceNo') "住院号",
				visitParamExtractRaw(replace(replace(extra_info,'null',''),'\\\\\\',''),'visitType') "就诊类型",
				visitParamExtractRaw(replace(extra_info,'\\\\\\',''),'userName') "账户名",
				visitParamExtractRaw(replace(extra_info,'\\\\\\',''),'orgCode') "医院Code",
				visitParamExtractRaw(replace(extra_info,'\\\\\\',''),'orgName') "医院名称",
				visitParamExtractRaw(replace(extra_info,'\\\\\\',''),'clientId') "厂商ID",
				visitParamExtractRaw(replace(extra_info,'\\\\\\',''),'clientName') "厂商名字",
				visitParamExtractRaw(replace(replace(extra_info,'null',''),'\\\\\\',''),'empId') "医生ID",
				visitParamExtractRaw(replace(extra_info,'\\\\\\',''),'empCode') "医生工号",
				visitParamExtractRaw(replace(extra_info,'\\\\\\',''),'empName') "医生名称",
				visitParamExtractRaw(replace(replace(extra_info,'null',''),'\\\\\\',''),'deptCode') "科室Code",
				visitParamExtractRaw(replace(replace(replace(extra_info,'\\\\r',''),'\\\\n',''),'\\\\\\',''),'deptName') "科室名"
		from
				operation.audit_log
		where
				event = 'health-third-party-redirect'      			
			and visitParamExtractRaw( replace(extra_info,'\\\\\\',''),'patientNo') like '%$patientNo%'
			and visitParamExtractRaw( replace(extra_info,'\\\\\\',''),'userName') like '%$userName%'
			and visitParamExtractRaw( replace(extra_info,'\\\\\\',''),'empName') like '%$empName%'
			and visitParamExtractRaw( replace(extra_info,'\\\\\\',''),'deptName') like '%$deptName%'
			ORDER  by time desc
			)		
)

```

## 资料
Grafana中文热门教程：[https://mp.weixin.qq.com/s?__biz=MzAwMjg1NjY3Nw==&mid=2247507915&idx=1&sn=2227fc40992a5b8803b7e8b630551740&scene=21#wechat_redirect](https://mp.weixin.qq.com/s?__biz=MzAwMjg1NjY3Nw==&mid=2247507915&idx=1&sn=2227fc40992a5b8803b7e8b630551740&scene=21#wechat_redirect)
[
](https://mp.weixin.qq.com/s/TOWSmZPX1M82G-tCQvDUJg)
