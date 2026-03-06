---
title: 代码行数统计
lang: zh-CN
date: 2024-02-21
publish: true
author: azrng
category:
  - soft
tag:
  - statistics
---
## 前言
什么时候会遇到需要统计代码行数？根据代码行数来算绩效吗？虽然我们确实有过这个规定，老东家有过这种奇怪规定让每个开发统计自己的代码行数，然后统计汇总上报给领导，但是这里介绍该工具的目的是用于软著等用途。
## VS Code Counter
这是一个vscode的扩展，对多种编程语言中源代码的空行、注释行和物理行进行计数。
使用方法可以参考：[https://marketplace.visualstudio.com/items?itemName=uctakeoff.vscode-counter](https://marketplace.visualstudio.com/items?itemName=uctakeoff.vscode-counter)

找一个示例项目，效果如下
![image.png](/soft/6143d4a629994bcc87fc9bec884c17ae.png)

## Cloc
Cloc 对许多编程语言中源代码的空白行、注释行和物理行进行计数。Star：17.9k
具体使用方法可以查阅仓库说明：[https://github.com/AlDanial/cloc](https://github.com/AlDanial/cloc)

