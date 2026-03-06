---
title: Ubuntu部署.Net以及配置守护进程
lang: zh-CN
date: 2022-09-12
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: ubuntubushu_netyijipeizhishouhujincheng
slug: us9qa0
docsId: '89624158'
---

## 目的
在Ubuntu上部署.Net程序进行测试。

## 环境准备

### 安装Ubuntu
有其他文章介绍
> 该服务器需要能外网访问


### 安装.Net环境
要安装.Net环境就需要运行以下命令将 Microsoft 包签名密钥添加到您的受信任密钥列表中并添加包存储库。
```csharp
wget https://packages.microsoft.com/config/ubuntu/22.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb
rm packages-microsoft-prod.deb
```
然后执行命令
```csharp
sudo apt-get update && \
  sudo apt-get install -y dotnet-sdk-6.0
```
等待一会，环境就已经装好了，输入命令测试一下吧
```csharp
dotnet --info
```
![image.png](/common/1660575003975-e6c9121d-5040-403c-8418-57b51a7deb5b.png)

### 安装Nginx
安装nginx
```csharp
sudo apt install nginx
```
编辑nginx配置文件
```csharp
vim /etc/nginx/sites-available/default
```
Esc进入命令模式，gg跳至首行，然后dG，清空当前配置，复制粘贴下面的配置。
```csharp
server {
    listen        80;
    server_name   example.com *.example.com;
    location / {
        proxy_pass         http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection keep-alive;
        proxy_set_header   Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
    }
}
```
退出并且保存 (Esc + :wq ，然后回车） 测试配置是否正确：
```csharp
sudo nginx -t
```
没问题之后，让Nginx重新加载配置
```csharp
sudo nginx -s reload
```

### 用户以及权限
创建一个账号等下给Github Actions使用，总不能给它用root账号
```csharp
sudo adduser github

// 设置密码
passwd github
```
创建一个文件夹，后面发布后的文件就上传到这里
```csharp
sudo mkdir -p /home/project/example
```
给新账号添加该文件夹的读写权限
```csharp
sudo chown -R github /home/project/example
```
到这里其实可以手动上传发布文件到服务器测试一下，但是为了省时间还是跳过，直接用Github Actions来发布。

## 项目准备
使用VS 2022新建一个空的ASP.NET Core Web API项目，框架选择.NET 6.0。
因为需要使用Nginx，这里就简单配置中间件转发下 X-Forwarded-For 和 X-Forwarded-Proto 两个header。
```csharp
using Microsoft.AspNetCore.HttpOverrides;
...
app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
});

app.UseAuthentication();
```
本地启动一下，看到swagger页面，没什么问题。代码提交Github，接下来开始配置服务器.

## Github Actions 配置
打开Github仓库，选择如下官方提供的.NET工作流进入编辑页面
![11501ad3ea174fbc253ba9c57eddd092_640_wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1.png](/common/1661007440583-79a594ba-f34d-4ac6-9db3-e0947a1bf677.png)
使用如下配置：
```csharp
name: ASP.NET Core 6.0 Example build and deploy
  
on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

jobs:

  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3
    - name: Setup .NET
      uses: actions/setup-dotnet@v2
      with:
        dotnet-version: 6.0.x
        
    - name: Restore dependencies
      run: dotnet restore
      
    - name: Build package
      run: dotnet publish ./src/example -c Release -r linux-x64 --self-contained false -o deploy
      
    - name: Upload package
      uses: garygrossgarten/github-action-scp@v0.7.3
      with:
        host: ${{ secrets.REMOTE_HOST }}
        username: ${{ secrets.REMOTE_USER }}
        password: ${{ secrets.REMOTE_PWD }}
        port: 22
        local: /home/runner/work/playground/example/deploy/
        remote: "/home/project/example/"
```
当main分支有提交或者PR时，发布就会触发；还有几个需要说明的地方，
关于打包，这里指定了 --self-contained false，是为了减少发布的dll文件，更多publish命令，可以参考.NET application publishing overview(https://docs.microsoft.com/en-us/dotnet/core/deploying/)
你可能已经注意到yml文件有很多secrets参数，这是在仓库如下处进行配置
![cc69e60c87ce9e7daaa76531dceb05ac_640_wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1.png](/common/1661007472823-cb7f376e-e33a-4474-bf0a-58d3d9d1cdea.png)
REMOTE_HOST是服务器地址，REMOTE_USER就是上面创建新账号github，我这里使用的是 garygrossgarten/github-action-scp(https://github.com/garygrossgarten/github-action-scp) SSH上传文件到服务器，更多用法说明，直接参考文档。
提交yml文件，打开Actions，查看执行情况，可以看到已经完成了。

检查下服务器是不是已经有发布文件了
```csharp
cd /home/project/example
ls -l
```
手动运行一下
```csharp
dotnet example.dll
```
发现可以访问了，如果不能访问请检查服务器的安全组规则设置。

## systemd 守护进程
为了让服务在崩溃或者服务器重启之后，也能重新运行，这里使用systemd来管理我们的服务。创建服务定义文件：
```csharp
sudo nano /etc/systemd/system/dotnet-example.service
```
使用如下配置，Ctrl + X 退出保存。
```csharp
[Service]
WorkingDirectory=/home/project/example
ExecStart=/usr/bin/dotnet /home/project/example/example.dll
Restart=always
## Restart service after 5 seconds if the dotnet service crashes:
RestartSec=5
KillSignal=SIGINT
SyslogIdentifier=dotnet-example
User=root
Environment=ASPNETCORE_ENVIRONMENT=Production
Environment=DOTNET_PRINT_TELEMETRY_MESSAGE=false
[Install]
WantedBy=multi-user.target
```
服务启用、启动、查看状态：
```csharp
sudo systemctl daemon-reload
sudo systemctl enable dotnet-example.service
sudo systemctl start dotnet-example.service
sudo systemctl status dotnet-example.service
```
最后更新Github Actions,将如下配置添加到末尾，这里使用的是同一个人的另一个项目来执行远程命令garygrossgarten/github-action-ssh(https://github.com/garygrossgarten/github-action-ssh)
```csharp
    - name: Restart dotnet-example.service
      uses: garygrossgarten/github-action-ssh@v0.6.3
      with:
        command: sudo systemctl restart dotnet-example.service; cd /home/project/example; ls -l
        host: ${{ secrets.REMOTE_HOST }}
        username: ${{ secrets.REMOTE_USER }}
        password: ${{ secrets.REMOTE_PWD }}
```
配置生效，发布成功。

## 总结
本文完整介绍了如何使用Github Actions做CI&CD，将ASP.NET Core 6.0 程序部署到阿里云Ubantu服务器，并使用Nginx作为web服务器，systemd做守护进程。

## 资料
几秋：[https://www.cnblogs.com/netry/p/aspnetcore6-linux-nginx-github-actions-systemd.html](https://www.cnblogs.com/netry/p/aspnetcore6-linux-nginx-github-actions-systemd.html)
