---
title: Whisper.net
lang: zh-CN
date: 2023-08-30
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: whisper_net
slug: sqb9lnu6e1msppen
docsId: '137827011'
---

## 概述

**Whisper.net** 是一个先进的语音转文本模型，基于语音识别技术，可以将语音信号转换为文本，OpenAI Whisper 的 dotnet 绑定由 whisper.cpp 实现。

支持：语音识别、自动转录、多语言支持等。

仓库地址：https://github.com/sandrohanea/whisper.net?

## 模型

ggml模型类别枚举参考：

```c#
public enum GgmlType
{
    Tiny,
    TinyEn,
    Base,
    BaseEn,
    Small,
    SmallEn,
    Medium,
    MediumEn,
    LargeV1,
    Large
}
```

它们会对应在线的模型，会根据需要自动下载。在线模型文件参考：

https://huggingface.co/ggerganov/whisper.cpp/tree/main ，找到`ggml-base-q5_1.bin`下载，请注意的是带`en`的是只识别英文的。其他的是全语言。



支持的语言列表：https://github.com/ggerganov/whisper.cpp/blob/master/whisper.cpp#L250C1-L250C71

## 操作

### 下载模型

```c#
if (!File.Exists(ggmlPath))
{
    Console.WriteLine($"准备下载模型：");
    await using var modelStream = await WhisperGgmlDownloader.GetGgmlModelAsync(GgmlType.Base);
    await using var fileWriter = File.OpenWrite(ggmlPath);
    await modelStream.CopyToAsync(fileWriter);
}
```

## Issue

### Only 16KHz sample rate is supported

看资料：https://github.com/sandrohanea/whisper.net/issues/55

## 其他开源项目

一个不开源的语音生成：https://github.com/VRCWizard/TTS-Voice-Wizard/wiki/Quickstart-Guide#installation

Whisperer 可让您为任何类型的视频/音频文件生成字幕。：https://github.com/tigros/Whisperer

## 资料

https://mp.weixin.qq.com/s/8a4czly3JMSZLsIWJSZwnA | 构建一个语音转文字的WebApi服务
