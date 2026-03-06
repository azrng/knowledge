---
title: 证书
lang: zh-CN
date: 2023-07-22
publish: true
author: azrng
order: 004
category:
  - 服务器或证书
tag:
  - certificate
filename: zhengshu
---

## Let’s Encrypt
Let’s Encrypt 是一个证书颁发机构（CA）。要从 Let’s Encrypt 获取网站域名的证书，只需要证明对域名的实际控制权即可。有两种验证方式，通过域名解析添加 TXT 记录，或是在网站添加指定的验证文件（实现访问指定地址返回要求的字符串即可，不过不支持有通配符的申请）。

证书自动申请使用Certes(https://github.com/fszlin/certes)库来实现 Let’s Encrypt 证书的自动续签。

## auto-ssl

一个自动化管理域名 SSL 证书的开源项目 Auto-SSL。

利用 GitHub Actions 以及 acme.sh，实现了自动申请 SSL 证书并保存，同时可对 SSL 证书自动续期。

GitHub：[https://github.com/danbao/auto-ssl](https://github.com/danbao/auto-ssl)

## OpenSSL

### 操作

#### 申请
 [下载openssl安装包](http://slproweb.com/products/Win32OpenSSL.html)并安装,打开命令行,输入openssl,如果提示Openssl不是内部或外部命令,需要设置一下环境变量,把Openssl的安装目录加入到path环境变量.
 另外新建一个环境变量,如以下所示,名称为：OPENSSL_CONF,指向你安装目录的openssl.cfg文件,现在输入openssl应该没有问题了.
新建一个文件夹用于放置密钥,在该目录打开命令行.
 1.申请一个私钥,在命令行中输入:
```shell
openssl genrsa -out private_ids.key 2048
```
申请一个2048位的RSA加密私钥.目录下将多了一个名为private_ids.key的文件.
 2.申请一个公钥
```shell
openssl req -new -x509 -key private_ids.key -days 3650 -out public_ids.crt
```
其中 -key private_ids.key是指定这个公钥的配对私钥,就是第一步申请的私钥.x509是X.509公钥格式标准.
 接下来会提示你输入一些信息,用于颁发机构的信息展示,如公司,所在国家,城市等
```nginx
You are about to be asked to enter information that will be incorporated
into your certificate request.
What you are about to enter is what is called a Distinguished Name or a DN.
There are quite a few fields but you can leave some blank
For some fields there will be a default value,
If you enter '.', the field will be left blank.
-----
Country Name (2 letter code) [AU]:CN
State or Province Name (full name) [Some-State]:ShangHai
Locality Name (eg, city) []:ShangHai
Organization Name (eg, company) [Internet Widgits Pty Ltd]:XXXXX
Organizational Unit Name (eg, section) []:XXXXX-XXXXX
Common Name (e.g. server FQDN or YOUR name) []:XXXXX
Email Address []:XXXXX@outlook.COM
```
如果不想每次都输入这些信息,可以使用“-config 配置文件目录”的方式指定配置文件,安装后Openssl后,有一个名为openssl.cnf的默认的配置文件在安装目录bin/cnf目录中.编辑该文件,找到req_distinguished_name
```nginx
[ req_distinguished_name ]
countryName         = Country Name (2 letter code)
countryName_default     = AU
countryName_min         = 2
countryName_max         = 2
 
stateOrProvinceName     = State or Province Name (full name)
stateOrProvinceName_default = Some-State
 
localityName            = Locality Name (eg, city)
 
0.organizationName      = Organization Name (eg, company)
0.organizationName_default  = Internet Widgits Pty Ltd
 
## we can do this but it is not needed normally :-)
#1.organizationName     = Second Organization Name (eg, company)
#1.organizationName_default = World Wide Web Pty Ltd
 
organizationalUnitName      = Organizational Unit Name (eg, section)
#organizationalUnitName_default =
 
commonName          = Common Name (e.g. server FQDN or YOUR name)
commonName_max          = 64
 
emailAddress            = Email Address
emailAddress_max        = 64
```
这里可以指定这些参数的默认值,如指定国家默认值为CN.把countryName_default改成CN就行了.申请完公钥后,目录下将多了一个public_ids.crt的文件.
 3.公钥及私钥的提取加密.由于传播安全方面的考虑,需要将公钥及私钥加密,微软支持PCK12(公钥加密技术12号标准：Public Key Cryptography Standards #12),PCK12将公钥和私钥合在一个PFX后缀文件并用密码保护,如要提取公钥和私钥需要密码确认.另一种觉的公钥私钥提取加密方式是JKS(JAVA Key Store)用于JAVA环境的公钥和私钥提取.这两种格式可以相互转换.
 在命令行中输入
```shell
openssl pkcs12 -export -in public_ids.crt -inkey private_ids.key -out ids.pfx
```
输入密码和确认密码后,当前目录会多出一个文件:ids.pfx.这就是我们要用的密钥证书了.

#### 使用密钥
将第二步生成ids.pfx文件复制服务器发布目录,如果只是为了测试,可以复制到本地项目目录.将目录信息及证书提取密码存入配置文件
```csharp
if (Environment.IsDevelopment())
{
    builder.AddDeveloperSigningCredential();
}
else
{
    builder.AddSigningCredential(new X509Certificate2(Path.Combine(Environment.CurrentDirectory, "ids.pfx"), "your_password"));
}
```
如果想调试环境也统一证书,可以把环境判断去掉,只用AddSigningCredential方式加载密钥证书.

## Certify The Web

商业版付费，免费版可以配5个域名，可以泛域名

网址：[https://certifytheweb.com/](https://certifytheweb.com/)

## Certimate

Certimate是一个用于管理SSL证书的工具，特别适合需要管理多个域名的个人或小团队。它的主要优势包括本地部署以确保数据安全、简单易用的界面以及自动化的证书申请和续期功能。

工具地址 https://github.com/usual2970/certimate

https://mp.weixin.qq.com/s/rAxM7Uc22ht-uaWzffPrsw | 一个吊炸天的免费SSL证书维护工具

## 工具

### domain-admin

domain-admin 是一个开源的域名管理平台，旨在帮助用户高效地管理和监控域名信息。它提供了一个集中式的管理界面，用户可以在其中查看和更新域名状态、解析记录、到期时间等关键信息。这个工具特别适合需要管理多个域名的个人和组织。

仓库地址：[https://github.com/dromara/domain-admin](https://github.com/dromara/domain-admin)

#### 部署

docker

```sh
# 本地文件夹和容器文件夹映射
$ docker run \
-v $(pwd)/database:/app/database \
-v $(pwd)/logs:/app/logs \
-p 8000:8000 \
--name domain-admin \
mouday/domain-admin:latest
```

docker-compose

```yaml
version: '3.3'
services:
    domain-admin:
        volumes:
            - './database:/app/database'
            - './logs:/app/logs'
        ports:
            - '8000:8000'
        container_name: domain-admin
        image: mouday/domain-admin:latest
```

## 资料

生成自签名证书：[https://learn.microsoft.com/zh-cn/dotnet/core/additional-tools/self-signed-certificates-guide#with-openssl](https://learn.microsoft.com/zh-cn/dotnet/core/additional-tools/self-signed-certificates-guide#with-openssl)
OpenSSL生成密钥证书：[https://www.cnblogs.com/osbreak/p/9486188.html](https://www.cnblogs.com/osbreak/p/9486188.html)

OpenSSL生成rsa密钥证书：[https://www.cnblogs.com/wjqhuaxia/p/13829680.html](https://www.cnblogs.com/wjqhuaxia/p/13829680.html)

https://mp.weixin.qq.com/s/hK0-tdhQan2CbmGO7RgvAw | 告别证书配置烦恼：使用Caddy或OpenResty快速配置免费的HTTPS

证书自动续期：https://mp.weixin.qq.com/s/N8W6el6ahJh8Qy6A8GLs9g
