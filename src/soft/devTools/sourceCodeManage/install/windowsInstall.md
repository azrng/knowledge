---
title: Windows安装Git
lang: zh-CN
date: 2023-07-22
publish: true
author: azrng
order: 002
category:
  - Git
tag:
  - 无
filename: windowsanzhuanggit
---

## 安装Git
下载地址：[https://git-scm.com/downloads](https://git-scm.com/downloads)
安装该软件基本上一路下一步 

![image.png](/common/1630077415519-9b09a65e-7577-46eb-bf75-6ea5d2a72587.png)

选择要安装的路径，这里我选择安装到D盘

![image.png](/common/1630077464698-d2541384-cbd5-4476-b8dd-2ea26b356d74.png) 

直接下一步

![image.png](/common/1630077492432-8c0a6cfc-3066-4d04-9e2b-069c3ae48361.png)

下一步

![image.png](/common/1630077512196-06e958c8-43fb-4048-9920-cf400f1f46f3.png)

下一步

![image.png](/common/1630077532072-29d7c921-eda2-483a-a20e-e5b744c6a177.png)

下一步

![image.png](/common/1630077551148-d21324df-246a-40a3-a818-0032e4b51994.png)

下一步

![image.png](/common/1630077599180-3f01ba14-f118-40c6-bad5-2a7d121c93fc.png)

下一步

![image.png](/common/1630077616707-0a65f392-ad1c-4396-997a-21c540671c4b.png)

下一步

![image.png](/common/1630077634403-8d175237-da42-4efd-bde2-47e19fdbc16e.png)

下一步

![image.png](/common/1630077692234-ac8b5372-8d24-4c98-97aa-9aa8da2cf1ab.png)

下一步

![image.png](/common/1630077706317-3cfae8c1-3fbd-425c-8b81-b19c68664bfe.png)

等待安装完成

![image.png](/common/1630077738443-0b6592ed-83fe-4e90-baf3-cddef7e9f48c.png)

完成界面

![image.png](/common/1630077782048-b6e8436e-5b64-486d-9288-ba2de5160d48.png)

然后可以右键可以看到这两个就成功了

![image.png](/common/1630077822843-2baf01b4-7bdb-4b5e-ae42-11cde8e41056.png)

下面我们使用Gitee作为源代码仓库作为演示，没有注册的需要去官方([https://gitee.com/](https://gitee.com/))注册。

## 配置git的SSH
常见的拉取代码的方式分为HTTPS和git(ssh),这里我们就演示如何配置ssh方式拉取代码

![image.png](/common/1630079012774-9d756474-f807-4499-ad15-b4f5a4b86b49.png)

当不配置直接使用右键Git Bash Here拉取项目的话会提示如下错误

```csharp
git clone git@gitee.com:xxx/xxx.git
```
![image.png](/common/1630078884855-47aef56f-a168-4031-b59f-ebf02a80ac6a.png)

下面我们就开始配置git的SSH，首先我们在**命令行工具(cmd等)**使用命令检查下用户名和邮箱是否配置，这是因为Git是分布式版本控制系统，所以每个机器都必须自报家门：你的名字和email地址。

```bash
git config --global  --list
# 注意：git conifg命令中的--globdal参数，这就表示你的这台机器上所有的Git仓库都使用这个地址。也可以对每个仓库指定不同的名称和email地址
```
![image.png](/common/1630078222396-d45b82e9-b942-47e7-88b1-72880982b5b6.png)

根据输出的结果，我们知道没有配置git，那么现在开始配置用户名和邮箱

```csharp
git config --global  user.name "用户名"
git config --global  user.email "邮箱"
```
> 这里的用户名和邮箱替换成你自己的用户名和邮箱

![image.png](/common/1630078353504-4720fd55-159f-4ffe-bcac-dbdf92b6eb44.png)

执行命令生成密钥(会在当前目录下(建议生成到C盘的用户目录下)生成，选择好合适的路径)

```csharp
ssh-keygen -t rsa -C "你的邮箱"
```
然后需要按多次回车，默认都是直接回车加回车，不过每次回车的意思我也搜索出来了。
> 1. 确认秘钥的保存路径（如果不需要改路径则直接回车）；
> 2. 如果上一步置顶的保存路径下已经有秘钥文件，则需要确认是否覆盖（如果之前的秘钥不再需要则直接回车覆盖，如需要则手动拷贝到其他目录后再覆盖）；
> 3. 创建密码（如果不需要密码则直接回车）；
> 4. 确认密码；

![image.png](/common/1630078545283-cf94d243-52b3-4bf7-8e1c-7da049379409.png)

然后会在指定目录(默认是当前目录)的.ssh目录下生成2个名为id_rsa和id_rsa.pub的文件

![image.png](/common/1630078639304-eb7e1938-9f1c-4311-80de-8822843004ac.png)

用记事本打开id_rsa.pub拷贝内容或者直接使用命令

```csharp
cat .ssh\id_rsa.pub
```
将内容拷贝到Gitee平台的设置=>SSH公钥
标题可以为当前机器起一个名字，然后将拷贝的密钥粘贴到公钥位置

![image.png](/common/1630079099144-79471591-c6ee-44f8-aa43-61a47c1d9670.png)

点击确定后输入密码即可添加SSH公钥，然后我们再去拉取项目

![image.png](/common/1630079184708-8c02fbad-84f5-40b2-99fb-d32f405b02e2.png)

成功拉取项目，已经不需要密码了，后续其他操作也不再需要密码，Gitee就可以知道这个操作是你操作的。

> github或者其他的仓库操作方案类似

## 安装第三方客户端

上面我们已经安装了Git并且配置了git的SSH，但是对于我来说还是不太方便，我更喜欢可视化界面(点点点)操作。常用的客户端软件有TortoiseGit、SourceTree、VS自带的。下面我就来演示如何安装TortoiseGit以及汉化。
需要提前下载好TortoiseGit-2.9.0.0-64bit、TortoiseGit-LanguagePack-2.9.0.0-64bit-zh_CN，版本看个人爱好。
下一步，然后下一步

![image.png](/common/1630079512109-ec2a2613-eefc-41bb-a0e6-94721bebde8c.png)

这点需要注意，然后继续下一步

![image.png](/common/1630079563592-97b87dba-3c21-420e-89bc-87aec09c719f.png)

配置，这里我只修改了安装的地址，然后下一步

![image.png](/common/1630079658433-28c7246a-282e-47d2-a840-76cd18d6782b.png)

下一步，然后开始安装

![image.png](/common/1630079676532-f0ac9c4b-5916-46ee-971f-fadee45334c9.png)

安装结束

![image.png](/common/1630079702315-ce9035d7-b0d1-4cd9-b351-6f2746b4f048.png)

下面安装语言包，直接下一步

![image.png](/common/1630079734715-2cf15d05-2406-4b1f-96b0-776512e79d0e.png)

直接勾兑该选项也可以设置为中文

![image.png](/common/1630079774172-7b0edca5-05fd-48f1-9193-e4885af91449.png)

或者右键TortoiseGit=>设置=>常规设置进行修改

![image.png](/common/1630079853666-3eaeb6ae-2ace-40e2-8b33-eacb9daa870f.png)

点击右键，查看多了一些东西

![image.png](/common/1630079894971-be0ceb0a-fa21-4f6f-ad86-04865c0d463e.png)

可以直接在这里克隆项目以及操作项目

![image.png](/common/1630079939551-26946052-1ae3-418c-b5d8-10e97ae0d417.png)
