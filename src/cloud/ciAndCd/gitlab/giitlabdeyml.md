---
title: Giitlab的Yaml
lang: zh-CN
date: 2023-09-08
publish: true
author: azrng
isOriginal: true
category:
  - cloud
tag:
  - 无
filename: giitlabdeyml
slug: hzs5bn
docsId: '52072490'
---

## 通用配置

### 数组
```yaml
colors
  - red
  - blue
  - yellow
```
相当于JSON中的
```yaml
{ "colors": ["red","blue","yellow"] }
```

### 对象
```yaml
people:
  name: zhangsan
  age: 14
```
相当于JSON中的
```yaml
{
  "people": {
     "name": "zhangsan"
     "age": 14
  } 
}
```

### 数组和对象嵌套
```yaml
a:
  b:
    - d
  c: e
```
相当于JSON中
```yaml
{
  "a": {
    "b": [ "d" ],
    "c": "e"
   }
}
```

## 关键字
```yaml
stages
stage
script
tags
```
### stages

stages定义在YML文件的最外层，它的值是一个数组，用于定义一个pipeline不同的流程节点

例如我们定义如下:
```yaml
stages: ## 分段
  - install
  - eslint
  - build
  - deploy
```
**Job是pipeline的任务节点，它构成了pipeline的基本单元**
而stage/script/tags这三个关键字，都是作为Job的子属性来使用的,如下所示，install就是我们定义的一个Job

```yaml
install:
  tags:
    - sss
  stage: install
  script:
    - npm install
```
#### **stage**

是一个字符串，且是stages数组的一个子项，表示的是当前的pipeline节点。
当前stage的执行情况能在交互面板上能看的清清楚楚：

- 正在执行是蓝色
- 尚未执行是灰色
- 执行成功是绿色
- 执行失败是红色

####  **script**

它是当前pipeline节点运行的shell脚本（以项目根目录为上下文执行）。
这个script是我们控制CI流程的核心，我们所有的工作：从安装，编译到部署都是通过script中定义的shell脚本来完成的。
如果脚本执行成功，pipeline就会进入下一个Job节点，如果执行失败那么pipeline就会终止

#### **tags**

tags是当前Job的标记，**这个tags关键字是很重要，因为gitlab的runner会通过tags去判断能否执行当前这个Job**
例如我们在gitlab的面板中能看到当前激活的runner的信息

#### retry重试

* 配置在失败的情况下重试作业的次数
* 当作业失败并配置了retry，将再次处理该作业，直到达到retry关键字指定的次数。
* 如果retry设置为2，并且作业在第二次运行成功(第一次重试)，则不会再次重试。retry值必须是一个正整数，等于或者大于0，但小于或者等于2(最多两次重试，总共运行3次)

#### when控制作业运行

* on_success：前面阶段汇中所有作业都成功时才执行作业，默认值
* on_failure：当前面阶段出现失败的时候执行
* always：总是执行作业
* manual：手动执行作业
* delayed：延迟执行作业

#### allow_failure允许失败

allow_failure允许作业失败，默认值为false。启用后，如果作业失败，该作业将在用户界面中显示橙色警告，丹东市，管道的逻辑流程将任务作业成功，并且不会被阻塞。假设所有其他任务均成功，则该作业的阶段以及其管道将显示相同的橙色警告。但是被关联的提交将被标记为通过，而不会被发出警告。

#### parallel并行作业

配置要并行运行的作业实例数，此值必须大于或者等于2并且小于或等于50.

```yaml
deploy:
  stage: deploy
  script:
    - echo "hello deploy"
  parallel: 5
```









