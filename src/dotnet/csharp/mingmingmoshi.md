---
title: 命名模式
lang: zh-CN
date: 2023-10-22
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 无
filename: mingmingmoshi
slug: ocphgn
docsId: '32042000'
---

## A/HC/LC模式
```csharp
prefix? + action (A) + high context (HC) + low context? (LC)
```
| name | prefix | A | HC | LC |
| :---: | :---: | :---: | :---: | :---: |
| getUser | 
 | get | User | 
 |
| getUserMessages | 
 | get | User | Messages |
| handleClickOutside | 
 | handle | Click | Outside |
| shouldDisplayMessage | should | Display | Message | 
 |


## 动作
函数名称的动词部分，是描述函数作用的最终要的部分，如：

- getXXX，表示获取数据
- setXXX，表示设值
- resetXXX，重置数据
- fetchXXX，请求数据
- removeXXX，移除数据，表示从某处删除某物
- deleteXXX，删除数据，表示完全清楚某些事物
- composeXXX，从现有数据创建新数据
- handleXXX，处理某个动作

## 前缀
前缀用来增强变量的含义，如：

- is，描述特征或状态，通常是boolean类型
- has，描述是否具有某个状态或值，通常是boolean类型
- should，反映肯定的条件，加上特定的执行动作
- min/max，描述边界或界限时使用
- prev/next，指示前一个或下一个状态

## 单复数
变量名称是单数还是复数，取决于值的单数还是复数。
