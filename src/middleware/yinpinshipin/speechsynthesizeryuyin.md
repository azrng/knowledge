---
title: SpeechSynthesizer语音
lang: zh-CN
date: 2023-04-01
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: speechsynthesizeryuyin
slug: uinqzt
docsId: '84518478'
---

## 概述

语音播报等

## 操作
安装nuget包
```csharp
<PackageReference Include="System.Speech" Version="6.0.0" />
```
将文本转语音
```csharp
//实例化
using SpeechSynthesizer speechSynthesizer = new SpeechSynthesizer();
//配置音频输出
speechSynthesizer.SetOutputToDefaultAudioDevice();
//字符串转语音
speechSynthesizer.Speak("晚上好");
```
保存语音
```csharp
var filtPath = "d:\\aa.wav";
//保存文件
using var speech = new SpeechSynthesizer();
//配置音频文件，设置输出流和文本格式
speech.SetOutputToWaveFile(filtPath, new SpeechAudioFormatInfo(32000, AudioBitsPerSample.Sixteen, AudioChannel.Mono));

//创建空的prompt对象，并添加内容
var builder = new PromptBuilder();
builder.AppendText("大家好");
//输出文件
speech.Speak(builder);
```
