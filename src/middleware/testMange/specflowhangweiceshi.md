---
title: SpecFlow行为测试
lang: zh-CN
date: 2022-06-22
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: specflowhangweiceshi
slug: gxzbrx
docsId: '81120452'
---

## 介绍
SpecFlow是.Net平台下用于行为驱动开发的开源框架。它使用普通人能够理解的的软件需求描述作为软件测试的基础，并可以将它们转换为可执行代码。
详细介绍可参看官网：https://specflow.org/

## 操作

### 安装扩展
下载扩展包SpecFlow，安装并重启

### 基本操作

#### 创建项目
新建项目，选择“SpecFlow project”模板，点击“创建”按钮，在弹出的窗口中选择.NET框架和测试框架。这里我们选择MSTest作为测试框架。

#### 添加Feature文件
在解决方案资源管理器的Feature文件夹上点右键，添加"SpecFlow Feature File"，命名为BaiduAdvancedSearch.feature。
Feature是一个纯文本文件，它的作用是使用被称为Gherkin的语法，按照Given/When/Then的特定示例格式来编写软件需求描述。
执行百度高级搜索的操作的Feature描述如下：
```json
Feature: 百度高级搜索
    所有场景必须顺序执行
 
Scenario: （1）显示高级搜索页面
    Given 打开百度首页
    When 鼠标悬停在“设置”按钮
    And 点击设置菜单上的“高级搜索“按钮
    Then 弹出高级搜索页面
 
Scenario: （2）执行高级搜索
    Given 输入关键词"IO"
    When 点击高级搜索页面上的“高级搜索"按钮
    Then 搜索框显示关键词"IO"
```
我们把一个需求分成2个连续的场景（Scenario），每个场景又有多个步骤。

#### 生成Step文件
在Feature文件空白处点击右键，选择“Generate Step Definitions”菜单，在弹出窗口中设置class name为BaiduAdvancedSearchSteps,点击“Generate”按钮，然后会生成文件，文件里面包含了对应描述文件的空方法。

#### 填充代码
然后就按照方法描述填充代码。

## 资料
文章来源自：微信公众号【My IO】
