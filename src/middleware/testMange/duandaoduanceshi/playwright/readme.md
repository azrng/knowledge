---
title: 说明
lang: zh-CN
date: 2023-09-11
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: readme
slug: ckemmd
docsId: '81120416'
---

## 介绍
Playwright 是微软开源的一个基于 Node.js 的工具库，可使用相同的API调用Chromium（Google-Chrome、Microsoft-Edge）、WebKit（Apple-Safari）和Mozilla-Firefox浏览器自动执行任务。

仓库：[https://github.com/microsoft/playwright-dotnet](https://github.com/microsoft/playwright-dotnet)

文档：[https://playwright.dev/dotnet/docs/intro](https://playwright.dev/dotnet/docs/intro)

## 优点
1. 任意浏览器、任意平台、一种 API

- 跨浏览器：Playwright 支持所有现代渲染引擎，包括 Chromium、WebKit 和 Firefox。
- 跨平台：在 Windows、Linux 和 macOS 上，进行本地或 CI 测试（无头或有头）。
- 跨语言：可在 TypeScript、JavaScript、Python、.NET、Java 中使用 Playwright API。
- 测试移动 Web：Android Google Chrome 和移动 Safari 的本地移动仿真。桌面和云上运行的渲染引擎相同。

2. 弹性、没有古怪的测试

- 自动等待：Playwright 在执行操作前，将等待到元素可被操作。它还有一组丰富的检查事件。两者结合可消除对人为超时的需求 — 这是导致古怪测试的主要原因。
- Web 优先断言：Playwright 断言是专门为动态 Web 创建的。检查将自动重试，直到满足必要的条件。
- 追踪：配置测试重试策略，捕获执行踪迹，录像，截屏，以防止遗忘。

3. 无需折中、无限制：浏览器在不同进程中运行属于不同源的 Web 内容。Playwright 与现代浏览器架构保持一致，在进程外运行测试。这使得 Playwright 摆脱典型的进程内测试运行器限制。

- 复合一切：横跨多个选项卡、多个源和多个用户的测试场景。为不同用户创建具有不同上下文的场景，并且在服务器上运行它们，这些都在一个测试中进行。
- 可信事件：悬停元素，与动态控件交互，生成可信事件。Playwright 使用真正的浏览器输入管道，与真正的用户没有区别。
- 测试 Frame、穿透 Shadow DOM：Playwright 选择器穿透 Shadow DOM，允许无缝进入 Frame。

4. 完全隔离、快速执行：

- 浏览器上下文：Playwright 为每个测试创建一个浏览器上下文。浏览器上下文等同于全新的浏览器配置文件。它提供零开销的完全测试隔离。创建新浏览器上下文仅需几毫秒。
- 登录一次：保存上下文的身份认证状态，并且在所有测试中重用。避免在每个测试中重复登录，还提供独立测试的完全隔离。

5. 强大的工具：

- 代码生成：通过录制操作生成测试。将它们保存成任何语言。
- Playwright 检查器：检查页面，生成选择器，逐步完成测试执行，查看单击点，探索执行日志。
- 追踪查看器：捕获所有信息以调查测试失败。Playwright 追踪包含测试执行录屏、实时 DOM 快照、操作资源管理器、测试源等。

## 对比PuppeteerSharp
PuppeteerSharp和Playwright都是用于自动化Web浏览器的工具，它们在某些方面有所不同。以下是对比它们的一些关键点：

1. 支持的浏览器：PuppeteerSharp主要支持Chrome浏览器，而Playwright支持多种浏览器，包括Chrome、Firefox和WebKit（Safari）。
2. 编程语言支持：PuppeteerSharp是使用C#编写的，适用于C#/.NET开发者。Playwright支持多种编程语言，包括JavaScript、TypeScript、Python和.NET等。
3. 功能和API：PuppeteerSharp和Playwright提供了类似的功能和API，可以实现页面导航、截图、模拟用户输入、执行JavaScript代码等。它们都支持无界面浏览器，使得可以在后台运行或在服务器上进行自动化测试或数据抓取等任务。
4. 性能和稳定性：由于Playwright支持多种浏览器，因此在某些情况下可能会有更好的性能和稳定性。Playwright还提供了更细粒度的控制和更多的配置选项。

选择使用PuppeteerSharp还是Playwright取决于您的具体需求。如果您只需要在Windows平台上使用Chrome浏览器进行自动化，且使用C#/.NET作为开发语言，那么PuppeteerSharp可能是一个不错的选择。如果您需要跨平台支持、多浏览器支持，或者使用其他编程语言进行开发，那么Playwright可能更适合您的需求。

## 资料
系列资料：[https://timdeschryver.dev/blog?q=Playwright](https://timdeschryver.dev/blog?q=Playwright)
