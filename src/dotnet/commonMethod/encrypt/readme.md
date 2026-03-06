---
title: 说明
lang: zh-CN
date: 2023-09-17
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: readme
slug: yqtoo4
docsId: '91386323'
---

## 概述
密码学中应用最为广泛的的三类算法：
1、对称算法（分组密码算法）代表分组密码算法(DES和SM4)；
2、非对称算法（[公钥](https://so.csdn.net/so/search?q=%E5%85%AC%E9%92%A5&spm=1001.2101.3001.7020)密码算法）代表公钥密码算法(RSA和SM2)；
3、杂凑算法（摘要算法）代表摘要算法(HAS-256系列和SM3)；

## 开源组件

### BouncyCastle

Bouncy Castle 加密库是加密算法和协议的 .NET 实现，老版本Nuget名称[Portable.BouncyCastle](https://www.nuget.org/packages/Portable.BouncyCastle)

官网：https://www.bouncycastle.org/csharp/index.html

仓库地址：https://github.com/bcgit/bc-csharp

Nuget：[BouncyCastle.Cryptography](https://www.nuget.org/packages/BouncyCastle.Cryptography)

## 对比

#### SM1 VS AES（对称加密）
SM1是国家密码管理部门审批的分组密码算法，分组长度和密钥长度都为128比特，算法安全保密强度及相关软硬件实现性能与AES相当，该算法不公开，仅以 IP 核的形式存在于芯片中。
![45de288aaf3d30af9b419eaaa524f3a8_1.png](/common/1661957805105-b1e3914a-3aac-49d8-8651-f20dc164ac80.png)

#### SM2 VS RSA(非对称加密)
SM2算法和RSA算法都是**公钥密码算法**，SM2算法是一种更先进安全的算法，在我们国家商用密码体系中被用来替换RSA算法。SM2性能更优更安全：密码复杂度高、处理速度快、硬件性能消耗更小。
![48e32d5de04c8dcf06910dddb2ebb4f1_2-1.png](/common/1661957840025-9891560b-f6bb-4fef-bbef-4b0b2baadc2f.png)
注：1. 亚指数级算法复杂度不到指数级别的算法。
2. RSA秘钥生成慢，不建议使用。例：主频5G赫兹的话，RSA需要2-3秒的，而SM2只需要几十毫秒。

加密算法实现：[https://www.cnblogs.com/runliuv/p/17607568.html](https://www.cnblogs.com/runliuv/p/17607568.html)

#### SM3 VS SHA256(摘要算法)
SM3是**摘要加密算法**，该算法适用于商用密码应用中的数字签名和验证以及随机数的生成，是在SHA-256基础上改进实现的一种算法。SM3算法采用Merkle-Damgard结构，消息分组长度为512位，摘要值长度为256位。
![4f08c7a30ef7e4ab58d800027d10e07c_3.png](/common/1661957898812-4394b929-afae-44d0-b170-308badcb6bea.png)

加密算法实现：[https://www.cnblogs.com/runliuv/p/17604030.html](https://www.cnblogs.com/runliuv/p/17604030.html)

#### SM4 VS 3DES(对称加密)
SM4**分组密码(对称加密)算法**是我国自主设计的分组对称密码算法，用于实现数据的加密/解密运算，以保证数据和信息的机密性，是专门为无线局域网产品设计的加密算法。
![2c5ba82e4a3d4748c9700a94e9ec512b_4.png](/common/1661957980519-0c6edf50-bd10-4f16-bdf4-0c0461302120.png)

代码实现：[https://www.cnblogs.com/runliuv/p/17593661.html](https://www.cnblogs.com/runliuv/p/17593661.html)

## 资料
加密算法区别：[https://blog.csdn.net/jambeau/article/details/99761661](https://blog.csdn.net/jambeau/article/details/99761661)
[https://mp.weixin.qq.com/s/JpVQ6gRPAU1kCIo28hoXBQ](https://mp.weixin.qq.com/s/JpVQ6gRPAU1kCIo28hoXBQ) | .NET常见的4种数据加密算法详解
