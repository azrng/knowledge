---
title: Claude Code 里的 Plugins 和 Skills，到底有什么区别？
lang: zh-CN
date: 2026-04-03
publish: true
author: azrng
isOriginal: true
tag:
  - Claude Code
  - AI 编程
  - Skills
  - Plugins
--- 

## 先说结论

很多人第一次看到 Claude Code 里的 `skills/` 和 `plugins/`，很容易以为它们只是“新旧两个名字”，或者简单理解成“plugin 就是 skill 的升级版”。

但如果结合目录结构和实际安装内容来看，这个理解并不准确。

更贴切的说法是：

- `skills/` 是 **Skill 的本地存放目录**，偏手动管理。
- `plugins/` 是 **插件包的管理体系**，偏市场化、版本化管理。
- `plugin` 里 **不只有 skill**，还可以包含 `commands`、`MCP servers` 等其他扩展能力。

也就是说，`skills/` 更像“单一能力的落地点”，而 `plugins/` 更像“可安装、可升级、可卸载的扩展包系统”。

## 一、`skills/` 和 `plugins/` 目录分别负责什么？

从目录职责上看，这两者的定位并不一样。

### `skills/`：技能目录，本地/手动管理

`skills/` 目录里放的是一个个独立的 Skill。每个 Skill 通常都是一个单独的目录，里面包含：

- `SKILL.md`
- 这个 Skill 相关的说明文件
- 可能用到的辅助资源文件

它的特点是：

- 内容比较轻，核心就是提示词和说明
- 管理方式比较直接，可以手动放进去，也可以通过类似 `/install-skill` 的方式安装
- 也可以借助 `/find-skills` 一类能力去搜索发现
- 本质上它是 Claude Code 的 **提示词扩展**

换句话说，Skill 更像一份“告诉 Claude 应该如何处理某类任务”的操作手册。

### `plugins/`：插件目录，市场/版本化管理

`plugins/` 目录则不是简单拿来放几个 markdown 文件的，它背后是一整套插件管理机制。

从你提供的图里可以看出，这里面会涉及：

- `marketplaces/`
- `installed_plugins.json`
- `cache/`
- `blocklist.json`

这说明 `plugins/` 更偏向：

- 从远程市场安装
- 记录安装状态
- 管理缓存
- 维护黑名单
- 跟踪版本号和 git commit

所以它的本质不是“另一个 skill 文件夹”，而是一个更完整的 **插件包管理系统**。

## 二、最容易搞混的一点：Plugin 不等于一组 Skills

这是很多人最容易误解的地方。

不少人会认为：既然插件里能放 skill，那 plugin 不就是“把几个 skill 打包”吗？

其实不是。

根据你给的第二张图，Plugin 可以包含多种类型的扩展组件：

| 类型 | 示例 | 说明 |
| --- | --- | --- |
| skills | `frontend-design`、`claude-md-management` | 提示词指令扩展，和 `skills/` 目录里的那类能力本质相同 |
| commands | `claude-md-management` 里的 `revise-claude-md` | 斜杠命令，例如 `/revise-claude-md`，本质上也是一种快捷触发能力 |
| MCP 服务器 | `playwright` | 提供真实工具能力，比如浏览器自动化、截图、点击等 |

这意味着：

- `skills/` 只承载 Skill 这一种扩展类型
- `plugins/` 承载的是一个“插件包”，里面可以放多种扩展能力

所以准确地说，**Skill 是一种扩展类型，而 Plugin 是一种分发和管理格式。**

## 三、结合实际安装内容来看，会更容易理解

你给的图里还列了三个已安装插件的实际内容，这个例子特别有代表性：

- `frontend-design`：只包含 `skills`
- `claude-md-management`：包含 `skills + commands`
- `playwright`：只包含 MCP 服务（如 `npx @playwright/mcp`），没有任何 skill

这个例子直接说明了一件事：

**Plugin 可以完全不包含 Skill。**

只要它提供的是 Claude Code 可识别、可安装、可管理的扩展能力，它就可以作为一个 Plugin 存在。

所以如果把两者关系说得更准确一点，可以这样理解：

- `skills/` 是一个简化版能力目录，只支持 Skill
- `plugins/` 是一个完整的扩展包体系，支持 Skill、Command、MCP 等多种能力

## 四、简明对比：什么时候该说 Skill，什么时候该说 Plugin？

| 对比项 | skills | plugins |
| --- | --- | --- |
| 安装方式 | 手动或命令安装 | 从市场远程安装 |
| 版本管理 | 基本没有 | 有，通常带版本号和 git sha |
| 作用域 | 用户级、本地使用为主 | 支持更完整的用户级/项目级管理 |
| 管理机制 | 简单目录管理 | 完整包管理系统 |
| 能力范围 | 只支持 Skill | 可包含 Skill、Command、MCP Server 等 |

如果只想记一句话，可以记这个版本：

> `skills/` 解决的是“把提示词能力放到本地怎么用”的问题，`plugins/` 解决的是“把扩展能力如何安装、升级、卸载、分发和管理”的问题。

## 五、两者是替代关系吗？

也不是。

更合理的理解是：

- `skills` 是较早期、较轻量的扩展机制
- `plugins` 是后来的、带版本管理能力的扩展机制
- 两者可以共存，而且同一种能力可能同时以两种方式存在

例如图里提到的 `frontend-design`，就可能同时出现在 `skills` 和 `plugins` 体系中。

所以它们不是“只能二选一”的关系，而更像是：

- `skills` 偏本地、偏轻量、偏手工
- `plugins` 偏分发、偏标准化、偏生命周期管理

## 六、怎么用一句话给别人讲明白？

如果你要在博客里用最短的话把这件事讲清楚，可以直接写成下面这段：

> 在 Claude Code 里，`Skill` 是一种提示词能力，本质上是教 Claude 如何完成特定任务；而 `Plugin` 是一种插件包格式，用来安装和管理扩展能力。Plugin 里可以包含 Skill，但也可以包含 Commands、MCP Servers 等其他内容。因此，`skills/` 是能力目录，`plugins/` 是包管理体系，它们不是一回事。

## 结语

如果只看名字，确实很容易把 `plugins` 和 `skills` 混在一起；但只要把“**能力类型**”和“**管理方式**”分开看，区别就很清楚了。

- Skill 讲的是“这是什么能力”
- Plugin 讲的是“这项能力怎么被打包、安装和管理”

这也是为什么我更建议把它们理解成两个不同层次的概念，而不是简单地理解成“plugin 比 skill 更高级”。

真正常见的关系其实是：

**Skill 可以是 Plugin 的一部分，但 Plugin 不只是 Skill。**
