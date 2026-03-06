---
title: CPU架构
lang: zh-CN
date: 2023-09-03
publish: true
author: azrng
isOriginal: true
category:
  - 计算机基础
tag:
  - cpu
---

## 概述
X86 和 ARM 都是CPU设计的一个架构。

* X86 用的是复杂指令集。
* ARM用的是精简指令集。



amd和Intel这俩公司的渊源很深，早期时Intel先是自己搞了个[x86架构](https://www.zhihu.com/search?q=x86%E6%9E%B6%E6%9E%84&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra=%7B%22sourceType%22%3A%22answer%22%2C%22sourceId%22%3A211243489%7D)，然后amd拿到了x86的授权也可以自己做x86了。接着intel向64位过渡的时候自己搞了个ia64（x64架构）但是因为和x86架构不兼容市场反应极差，amd率先搞了x86的64位兼容（32和64的混合架构）也就是后来的x86-64，后来Intel也拿到了生产这货的授权（i和a两家专利交叉的很严重），也搞了x86-64，因为amd先搞出来的所以x86-64也叫amd64  
目前amd和Intel是世界上最大的两家x86和x86-64的cpu厂家（intel比较给力，四分天下有其三）。除了这两家还有几家小的公司也有x86的授权，比如via，不过技术水平真的很一般。  
再说x86，arm和[mips](https://www.zhihu.com/search?q=mips&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra=%7B%22sourceType%22%3A%22answer%22%2C%22sourceId%22%3A211243489%7D)，这三个的区别和联系要从cpu早期说起，早期的cpu有两个设计思路，1是把cpu内的逻辑电路做的非常复杂，这样可以直接用cpu硬件事先复杂指令，这个叫[复杂指令集](https://www.zhihu.com/search?q=%E5%A4%8D%E6%9D%82%E6%8C%87%E4%BB%A4%E9%9B%86&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra=%7B%22sourceType%22%3A%22answer%22%2C%22sourceId%22%3A211243489%7D)cisc；另一个思路是尽可能把cpu做的简单，依靠简单指令的组合迭代完成复杂指令，这个叫[精简指令集](https://www.zhihu.com/search?q=%E7%B2%BE%E7%AE%80%E6%8C%87%E4%BB%A4%E9%9B%86&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra=%7B%22sourceType%22%3A%22answer%22%2C%22sourceId%22%3A211243489%7D)risc  
x86目前泛指x86和x86-64架构，这是因为x86-64完全兼容x86。早期的x86是[cisc](https://www.zhihu.com/search?q=cisc&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra=%7B%22sourceType%22%3A%22answer%22%2C%22sourceId%22%3A211243489%7D)的代表，后来的发展中逐步引入了[risc](https://www.zhihu.com/search?q=risc&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra=%7B%22sourceType%22%3A%22answer%22%2C%22sourceId%22%3A211243489%7D)的部分理念，将内部指令的实现大量模块化，准确来说是一个cisc外加risc部分技术的架构。  
目前x86的主要产品有Intel的至强，酷睿，奔腾，赛扬和凌动；amd的锐龙，[apu](https://www.zhihu.com/search?q=apu&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra=%7B%22sourceType%22%3A%22answer%22%2C%22sourceId%22%3A211243489%7D)等。上文提到的x64架构目前只有intel 安腾而且已经放弃了产品线。  
到目前为止intel和amd的x86架构cpu虽然指令集上有很大差别了但是还是相互兼容的，所以软件可以直接用。'
再说arm。  
arm是risc的典型代表，不过在arm的发展过程中引入了部分复杂指令（完全没有复杂指令的话操作系统跑起来异常艰难），所以是一个risc基础外加cisc技术的cpu。  
arm的主要[专利技术](https://www.zhihu.com/search?q=%E4%B8%93%E5%88%A9%E6%8A%80%E6%9C%AF&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra=%7B%22sourceType%22%3A%22answer%22%2C%22sourceId%22%3A211243489%7D)在arm公司手中，像高通，三星，苹果这些公司需要拿到arm的授权。  
另一个risc的典型处理器就是mips。mips是一个[学院派](https://www.zhihu.com/search?q=%E5%AD%A6%E9%99%A2%E6%B4%BE&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra=%7B%22sourceType%22%3A%22answer%22%2C%22sourceId%22%3A211243489%7D)的cpu，授权门槛极低，因此很多厂家都做mips或者mips衍生架构。我们平时接触到的[mips架构](https://www.zhihu.com/search?q=mips%E6%9E%B6%E6%9E%84&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra=%7B%22sourceType%22%3A%22answer%22%2C%22sourceId%22%3A211243489%7D)cpu主要用在嵌入式领域，比如[路由器](https://www.zhihu.com/search?q=%E8%B7%AF%E7%94%B1%E5%99%A8&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra=%7B%22sourceType%22%3A%22answer%22%2C%22sourceId%22%3A211243489%7D)。  

文章来自：[https://www.zhihu.com/question/63627218](https://www.zhihu.com/question/63627218)

