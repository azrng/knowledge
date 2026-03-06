---
title: 权限系统
lang: zh-CN
date: 2022-05-14
publish: true
author: azrng
isOriginal: true
category:
  - 软件设计
tag:
  - 无
filename: quanxianjitong
slug: abgh1s
docsId: '77337715'
---

## 概述
RBAC(Role-based Access Control):通过预定义的角色赋予访问权限，每个角色规定了一套权限。
ABAC(Attribute-based Access Control)：通过策略授予权限，策略可能将多个属性/claims组合到一起，允许复杂的权限规则。

## 资料

“权限系统”设计剖析：https://mp.weixin.qq.com/s/Qg5yPTf7u9I27p9DawuxnA
Cerbos 授权替换RBAC实现复杂自定义授权：https://www.cerbos.dev/blog/scalable-authorization-in-asp-net