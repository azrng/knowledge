---
title: 生产力提升
lang: zh-CN
date: 2023-07-22
publish: true
author: azrng
order: 007
category:
  - Visual Studio
tag:
  - 快捷键
  - 效率
filename: shengchanlidisheng
---

## Sticky Scroll
Sticky Scroll使相关的标题保持可见，从而更容易导航和理解您的代码库。现在，您可以在处理长类和方法时维护代码中的上下文

开启方式：通过选中“在编辑器顶部滚动期间显示嵌套的当前范围”复选框，在工具 > 选项 > 文本编辑器 > 常规 > 粘性滚动中启用它

效果可以参考下面的文章：[https://devblogs.microsoft.com/visualstudio/sticky-scroll-now-in-preview/](https://devblogs.microsoft.com/visualstudio/sticky-scroll-now-in-preview/)

## 大括号着色
有助于从视觉上区分代码的每组左大括号和右大括号，从而更容易查看代码的范围或找到任何缺失的大括号。C#、C++、TypeScript、JavaScript、Visual Basic 和 Razor 支持大括号对着色。您可以通过转到“工具”>“选项”>“文本编辑器”并选中“启用大括号对着色”来启用或禁用着色。

## 内联参数提示

开启前截图示例

![image-20231006103342615](/common/image-20231006103342615.png)

在工具=>选项=>搜索内联，然后全部开启

![image-20231006103504219](/common/image-20231006103504219.png)

开启后再看示例代码

![image-20231006103530950](/common/image-20231006103530950.png)

## 全局智能提示

通过工具=>选项，搜索未导入进行开启

![image-20231006103803327](/common/image-20231006103803327.png)

然后没有using的内容也可以带提示的效果，如

![image-20231006103905698](/common/image-20231006103905698.png)

## 实时显示诊断错误

在过去，我们需要写完代码编译才能知道具体的错误，最新版的 `Visual Studio` 支持 **内联诊断错误**，开启如下

![dcc89789279472416c5ba6bf3be8f2f7_vs7](/common/dcc89789279472416c5ba6bf3be8f2f7_vs7.png)

效果如下

![48d9bf8c30ba2feeb11561d617ab4507_vs8](/common/48d9bf8c30ba2feeb11561d617ab4507_vs8.png)

## 终结点资源管理器

生成一个请求的列表

详细内容参考：[https://devblogs.microsoft.com/visualstudio/web-api-development-in-visual-studio-2022/#endpoints-explorer](https://devblogs.microsoft.com/visualstudio/web-api-development-in-visual-studio-2022/#endpoints-explorer)

## 即时窗口

### 使即时窗口运行的代码不影响主流程

执行的命令后面添加,nse(no side effect的简写)即可

示例：

foo.Increase(),nse

加上nse后，执行的那句代码相当于在一个沙箱中运行，和上下文互不干扰<br />

### 访问特殊变量

$exception：当前的异常信息

适用场景：你代码的try/catch语句没有给catch语句使用Exception参数，则可以使用该特殊变量去打印异常信息。

$returnvalue：当前语句的返回值。有时候你在代码中调用了一个方法，但你并没有用一个变量来存储这个方法的返回值，而你在调试时又想知道它的返回值。此时你可以在方法执行处添加一个断点。当运行到该断点时，按 F10，然后在即时窗口可以通过 $returnvalue 打印该方法的返回值。

## 快捷键

### 搜索

`Visual Studio 2022` 提供了非常强大的 **代码搜索和功能搜索**，只需要快捷键 `Ctrl + Q` 呼出，

![image-20231006104634282](/common/image-20231006104634282.png)

退出搜索只需要使用快捷键`ESC`就可以了

## 参考资料

Visual Studio高效率：http://furion.baiqian.ltd/docs/vsfast/
