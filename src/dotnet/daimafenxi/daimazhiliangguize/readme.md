---
title: 说明
lang: zh-CN
date: 2023-08-31
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: readme
slug: dcof3vvc2ublfg7w
docsId: '134803518'
---

## 概述
微软推荐了代码质量规则和.Net API使用规则，包括最重要的FxCop规则，使用.net编译器平台(Roslyn)作为分析器实现。这些分析程序检查代码的安全性、性能和设计等问题。

## 规则

### 快速上手
在解决方案的根目录创建DesktopLint.ruleset文件，然后配置规则，并且还需要在项目文件中配置(.csproj结尾的文件中配置)
```csharp
<PropertyGroup>
	<CodeAnalysisRuleSet>$([MSBuild]::GetPathOfFileAbove('DesktopLint.ruleset'))</CodeAnalysisRuleSet>
</PropertyGroup>
```

比如配置CS4014规则，需要对调用结果应用await运算符，例如我们将其设置未不加await的时候编译直接提示错误

```xml
<?xml version="1.0" encoding="utf-8"?>
<RuleSet Name="Rules For Desktop" Description="6 Rules are enabled." ToolsVersion="16.0">
  <Rules AnalyzerId="Microsoft.CodeAnalysis.CSharp" RuleNamespace="Microsoft.CodeAnalysis.CSharp">
    <Rule Id="CS4014" Action="Error" />
  </Rules>
</RuleSet>
```
这里Rule对应的Action可选值有：None、Warning、Error、Hidden、Info等

官网资料：[https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/compiler-messages/cs4014](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/compiler-messages/cs4014)

## 资料
代码质量规则：[https://learn.microsoft.com/zh-cn/dotnet/fundamentals/code-analysis/quality-rules/](https://learn.microsoft.com/zh-cn/dotnet/fundamentals/code-analysis/quality-rules/)
FxCop分析器的文档可以在[https://docs.microsoft.com/visualstudio/code-quality/install-fxcop-analyzers](https://docs.microsoft.com/visualstudio/code-quality/install-fxcop-analyzers)
