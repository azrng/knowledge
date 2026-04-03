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

Claude Code 里的 `skills/` 和 `plugins/` 并非"新旧两个名字"或"升级替换关系"，而是两个不同层次的概念：

- `skills/` 是 **Skill 的本地存放目录**，偏手动管理
- `plugins/` 是 **插件包的管理体系**，偏市场化、版本化管理
- `plugin` 里 **不只有 skill**，还可以包含 `commands`、`MCP servers` 等其他扩展能力

更准确的说法是：**Skill 是一种扩展能力类型，Plugin 是一种分发和管理格式。**

## 一、`skills/` 和 `plugins/` 目录分别负责什么？

### `skills/`：技能目录，本地/手动管理

`skills/` 目录位于用户主目录下的 `.claude/skills/`，每个 Skill 是一个独立的子目录，通常只包含：

- `SKILL.md` — 定义该 Skill 的提示词和行为说明
- 可选的辅助文件（如 `LICENSE.txt`）

以本地安装的 `frontend-design` Skill 为例，路径为 `.claude/skills/frontend-design/`：

```powershell
PS C:\Users\用户名\.claude\skills\frontend-design> ls


    目录: C:\Users\用户名\.claude\skills\frontend-design


Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
-a----          2026/4/3      9:38          10351 LICENSE.txt
-a----          2026/4/3      9:38           4482 SKILL.md
```

可以看到，整个目录只有 `LICENSE.txt` 和 `SKILL.md` 两个文件，结构非常轻量。

它的特点是：

- 核心就是提示词，内容轻量
- 管理方式直接：可以手动放入目录，也可以通过 `/install-skill` 命令安装，或通过 `/find-skills` 搜索发现
- 本质上是 Claude Code 的 **提示词扩展**

简而言之，Skill 就是一份"告诉 Claude 应该如何处理某类任务"的操作手册。

### `plugins/`：插件目录，市场/版本化管理

`plugins/` 目录位于 `.claude/plugins/`，它不是简单拿来放几个 markdown 文件的，背后是一整套插件管理机制。

以通过市场安装的 `frontend-design` 插件包为例，路径为 `.claude/plugins/marketplaces/claude-plugins-official/plugins/frontend-design/`：

```powershell
PS C:\Users\用户名\.claude\plugins\marketplaces\claude-plugins-official\plugins\frontend-design> ls


    目录: C:\Users\用户名\.claude\plugins\marketplaces\claude-plugins-official\plugins\frontend-design


Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
d-----          2026/4/3     10:27                .claude-plugin
d-----          2026/4/3     10:27                skills
-a----          2026/4/3     10:27          11560 LICENSE
-a----          2026/4/3     10:27           1008 README.md
```

可以看到，插件包的内容比 Skill 目录丰富得多，包含：

- `.claude-plugin/` — 插件元数据配置目录
- `skills/` — 该插件包含的 Skill（进一步展开后就是 `SKILL.md`）
- `LICENSE` — 许可证文件
- `README.md` — 说明文档

除了插件本身的文件，`plugins/` 目录还涉及：

- `marketplaces/` — 远程市场索引
- `installed_plugins.json` — 记录已安装插件的状态
- `cache/` — 缓存
- `blocklist.json` — 黑名单

所以它的本质不是"另一个 skill 文件夹"，而是一个完整的 **插件包管理系统**。

## 二、最容易搞混的一点：Plugin 不等于一组 Skills

一个常见的误解是：既然插件里能放 Skill，那 Plugin 不就是"把几个 Skill 打包"吗？

其实不是。Plugin 可以包含多种类型的扩展组件：

| 类型 | 示例 | 说明 |
| --- | --- | --- |
| skills | `frontend-design`、`claude-md-management` | 提示词指令扩展，和 `skills/` 目录里的那类能力本质相同 |
| commands | `claude-md-management` 里的 `revise-claude-md` | 斜杠命令（如 `/revise-claude-md`），一种快捷触发能力 |
| MCP 服务器 | `playwright` | 提供真实工具能力，比如浏览器自动化、截图、点击等 |

以三个实际安装的插件为例：

- `frontend-design`：只包含 skills
- `claude-md-management`：包含 skills + commands
- `playwright`：只包含 MCP 服务（如 `npx @playwright/mcp`），没有任何 skill

这个例子直接说明了一件事：**Plugin 可以完全不包含 Skill。** 只要它提供的是 Claude Code 可识别、可安装、可管理的扩展能力，就可以作为一个 Plugin 存在。

## 三、简明对比

| 对比项 | skills | plugins |
| --- | --- | --- |
| 存放路径 | `.claude/skills/` | `.claude/plugins/` |
| 安装方式 | 手动放入目录或 `/install-skill` 命令安装 | 从市场远程安装或本地安装 |
| 版本管理 | 较弱，通常不跟踪版本 | 有版本号和 git sha 跟踪 |
| 作用域 | 支持用户级和项目级 | 支持用户级和项目级 |
| 管理机制 | 简单目录管理 | 完整包管理系统（含市场、缓存、黑名单） |
| 能力范围 | 只支持 Skill | 可包含 Skill、Command、MCP Server 等 |

一句话总结：

> `skills/` 解决的是"把提示词能力放到本地怎么用"的问题，`plugins/` 解决的是"把扩展能力如何安装、升级、卸载、分发和管理"的问题。

## 四、两者是替代关系吗？

不是。更合理的理解是：

- `skills` 是较早期、较轻量的扩展机制
- `plugins` 是后来的、带版本管理能力的扩展机制
- 两者可以共存，同一种能力可能同时以两种方式存在

例如 `frontend-design`，就同时出现在 `.claude/skills/` 和 `.claude/plugins/` 两个体系中。

所以它们不是"只能二选一"的关系，而是：
- `skills` 偏本地、偏轻量、偏手工
- `plugins` 偏分发、偏标准化、偏生命周期管理

## 结语

只要把"**能力类型**"和"**管理方式**"分开看，区别就很清楚：

- **Skill** 回答的是"这是什么能力" — 它是提示词扩展
- **Plugin** 回答的是"这项能力怎么被打包、安装和管理" — 它是分发格式

真正核心的关系是：**Skill 可以是 Plugin 的一部分，但 Plugin 不只是 Skill。**
