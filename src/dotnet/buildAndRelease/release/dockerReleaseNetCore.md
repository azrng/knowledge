---
title: docker部署netcore全流程
lang: zh-CN
date: 2023-09-29
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: dockerbushunetcorequanliucheng
slug: iqxvgp
docsId: '44702943'
---

## 开篇语
自己从头开始走一遍docker部署.net的流程，作为一种学习总结，以及后续会写一些在该基础之上的文章。
> 本次示例环境：vs2019、net5、docker、postman


## 创建项目
本次事例代码是用过vs2019创建的ASP.NET Core Web API项目
![image.png](/common/1620114697921-ec54ae34-14f7-494a-8838-1e02508354de.png)
目标框架是.Net5，无需身份验证，不配置HTTPS(根据个人需求勾选)，启动Docker(我习惯于后期添加)，启用OpenAPI支持(添加swagger文档)
![image.png](/common/1620113847152-b27a4e87-8ccf-4527-94a9-de6786468dde.png)

### 默认配置
创建完成后，我们查看项目目录为下
![image.png](/common/1620114885227-ae67bc3b-34e6-432d-b62c-8ef1575cbb97.png)
我们直接F5启动项目，发现直接跳转一个API文档页面
![image.png](/common/1620114980256-a86bd9cb-359f-4ca7-aa3b-9bad47194332.png)
> Swagger 是一个规范和完整的框架，用于生成、描述、调用和可视化 RESTful 风格的 Web 服务。


### 修改配置
我基于个人习惯，我修改launchSettings.json文件，删除IIS配置，删除后如下所示：
```csharp
{
  "$schema": "http://json.schemastore.org/launchsettings.json",
  "profiles": {
    "Net5ByDocker": {
      "commandName": "Project",
      "launchBrowser": true,
      "launchUrl": "swagger",
      "environmentVariables": {
        "ASPNETCORE_ENVIRONMENT": "Development"
      },
      "dotnetRunMessages": "true",
      "applicationUrl": "http://localhost:5000"
    }
  }
}
```
删除默认控制器，添加新的控制器UserController，在里面添加默认一些方法操作，如下
> 基于个人习惯的操作，也可以不删除默认控制器

```csharp
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        public static List<string> userInfo = new();

        [HttpGet]
        public IEnumerable<string> Get()
        {
            return userInfo;
        }

        [HttpPost]
        public List<string> Post([FromBody] string value)
        {
            if (!string.IsNullOrWhiteSpace(value))
                userInfo.Add(value);
            return userInfo.ToList();
        }

        [HttpDelete("{id}")]
        public List<string> Delete(string id)
        {
            if (!string.IsNullOrWhiteSpace(id))
                userInfo.Remove(id);
            return userInfo.ToList();
        }
    }
```
其他配置保持默认，启动项目
![image.png](/common/1620125723376-4c9d566d-96ab-4efc-946f-5e0a8f8c1880.png)

## 生成镜像

### 添加dockerfile
选中项目右键添加docker支持，本次部署在windows平台
![image.png](/common/1620126200751-8af1177d-27a2-4e0a-af9c-5b775bc5d897.png)
> 拉取基础镜像和sdk，还原nuget包，重新生成，发布

此时项目的目录结构为
![image.png](/common/1620126343906-3c39dff8-efbc-4923-b0be-e4e3c708bc36.png)

### 运行命令
在文件资源管理器打开文件
![image.png](/common/1620126434943-262542b9-3891-4176-a902-969110ecdbef.png)
在上层目录下运行cmd输入命令
```csharp
docker build -f .\Net5ByDocker\Dockerfile -t net5sample .
```
> 在不同的目录下命令有些许差异，这点非常感谢我的朋友**王老师**

![image.png](/common/1620126753488-31720434-e70e-4786-b066-a945f799514f.png)
> 注意：可能部分朋友在这一步会拉取官方镜像比较慢，可以配置docker加速器使用

通过docker客户端查看我们已经生成的镜像
![image.png](/common/1620126993761-4b491825-c995-428d-8b70-73cca1f61e50.png)

## 生成容器
本文通过**Terminal**软件执行命令
```csharp
docker run --name net5sampleone -d -p 8060:80 net5sample
```
> 命令简述：
> -d 后台运行
> --name  容器名称
> -p 端口映射

截至到这，我们已经把刚才的项目生成了容器，下面我们可以直接通过容器方法上面的项目

## 验证项目
通过浏览器访问地址：localhost:8060/swagger
![image.png](/common/1620127336787-2035f32c-1ee8-43cf-9f98-1365a01f939f.png)
懵逼！！！这个时候不是应该出来swagger文档的界面吗？难道我们部署的方式有问题？
让我们访问下项目的接口
![image.png](/common/1620127500213-09647065-50fa-4f69-a6dd-ba1d55139118.png)
说明我们的项目运行是正常的，仔细查看swagger配置后发现，因为为了安全默认不允许发布后出来swagger文档
![image.png](/common/1620128138104-9e5826f4-d51d-48f8-892d-332f30e05540.png)
> 如果是测试环境或者特殊情况可以通过调整swagger配置位置来显示文档


### 通过Postman访问

#### 添加用户
![image.png](/common/1620127732462-86f9b796-901c-48ad-b4fe-50e1e7e0329c.png)

#### 查询用户
![image.png](/common/1620127757485-a736e466-acf6-4bba-9e41-142896f6c372.png)

#### 删除用户
![image.png](/common/1620127785048-7e6a416c-2cdd-4168-a9af-03949f8046cb.png)
再次运行查询接口数据已经为空了。







