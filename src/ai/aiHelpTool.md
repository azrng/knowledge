---
title: Ai辅助工具
lang: zh-CN
date: 2026-02-09
publish: true
author:  azrng
isOriginal: true
category:
  - ai
  - tool
tag:
  - 辅助
---

## Cursor

[Cursor生成的UI太丑？四种方法减少UI拉扯](https://mp.weixin.qq.com/s/0yY6N5M4vulBS46y0MuKKg)

## Claude Code

参考资料：https://www.yuque.com/xiaoyou-nwu1w/ooi105/bwakf9w86vzuoace

### 使用技巧

```shell
# 增加思考
提示词 + ultra think 让 Claude 全自动美化  

# 通过#来设置记忆
```

#### 核心文件

```
○ 新建 claude.md → 项目记忆规则
○ 新建 todo.md → 待办任务清单

在 claude.md 设定两条规矩
  ○ 所有代办需写入 todo.md，完成后打勾。
  ○ 使用 Task 工具创建并行 子代理 提升开发效率。
```

#### 网页设计

```
● 方法一：Claude 盲盒设计  
  ○ 提示词 + ultra think 让 Claude 全自动美化  
  ○ 随机生成配色、图标、伪导航，效果不可预测
● 方法二：截图复刻 
  ○ 拖入参考网站的截图
  ○ 指令：只改样式与布局，功能不变  
  ○ 输出深色紫主题，但局部需手动打磨
● 方法三：tweakcn CSS 主题：https://tweakcn.com/  
  ○ 在 tweakcn 挑选主题 → Copy CSS + 截图交给 Claude  
  ○ 快速套用高质量样式，弹窗等局部需二次调整
● 方法四：Readdy AI 设计（推荐、收费）  
  ○ Claude 生成精简需求文档 → 粘贴到 Readdy  
  ○ Readdy AI 生成专业深色界面，可用 Selector 逐块微调  
  ○ 下载前端代码并与后端融合，最终效果专业美观
```

### MCP列表

```shell
# 查询mcp列表
claude mcp list
```

#### Context7

地址：https://context7.com/dashboard

当前项目可用：

```bash
claude mcp add --transport http context7 https://mcp.context7.com/mcp --header "CONTEXT7_API_KEY: your_api_key"
```

全局可用：

```bash
claude mcp add -s user --transport http context7 https://mcp.context7.com/mcp --header "CONTEXT7_API_KEY: your_api_key"
```

⚠️ 注意：`your_api_key` 需要到 Context7 官网申请

#### BrowserTools MCP

让 Claude 直接读取调试信息

地址：https://browsertools.agentdesk.ai/installation



1、 **安装与配置 BrowserTools**
   a. 下载浏览器插件压缩包并解压至本地。
   b. 浏览器扩展页面 → 开启“开发者模式” → **加载未打包扩展程序** → 选择解压文件夹。
   c. 在 VS终端安装服务端并启动（占用端口 **3025**）：
   \- **安装命令**：`claude mcp add browser-tools npx @agentdeskai/browser-tools-mcp@latest`
   \- **启动命令**：`npx @agentdeskai/browser-tools-server@1.2.0`
   d. `claude -c` 继续会话 → `/mcp` 确认 BrowserTools 已连接。
   e. 浏览器 DevTools → 插件设置页：
   \- **截图路径**：
   \- **端口号**：`3025` → 点击 **Test Connection** 显示 “连接成功”。

 2、**自动调试流程**  

- Claude 通过 BrowserTools 抓取错误日志 → 自动定位并修复代码。  
- 多轮“刷新网页 → 获取日志 → 修复”直至错误提示消失。  
- 调试完成：执行 `/clear` 释放上下文 → `/init` 更新记忆 → Git **存档**当前状态。

3、**元素选取器优化界面**  

- 可以直接选择制定区域的内容然后咨询模型

#### 智谱视频理解

当前项目可用：

```bash
claude mcp add zai-mcp-server --env Z_AI_API_KEY=your_api_key -- npx -y @z_ai/mcp-server
```

全局可用：

```bash
claude mcp add -s user zai-mcp-server --env Z_AI_API_KEY=your_api_key -- npx -y @z_ai/mcp-server
```

⚠️ 注意：`your_api_key` 需替换为你在智谱中生成的 API Key。

#### 智谱联网搜索

当前项目可用：

```bash
claude mcp add -t http web-search-prime https://open.bigmodel.cn/api/mcp/web_search_prime/mcp --header "Authorization: Bearer your_api_key"
```

全局可用：

```bash
claude mcp add -s user -t http web-search-prime https://open.bigmodel.cn/api/mcp/web_search_prime/mcp --header "Authorization: Bearer your_api_key"
```

⚠️ 注意：`your_api_key` 需替换为你在智谱中生成的 API Key。

#### Cloudflare部署

```shell
# 设置环境变量
export CLOUDFLARE_API_TOKEN="你的令牌"

# 文档查询服务
claude mcp add cloudflare-docs --transport sse https://docs.mcp.cloudflare.com/sse

# 部署服务器
claude mcp add cloudflare-builds https://builds.mcp.cloudflare.com/sse --transport sse -e CLOUDFLARE_API_TOKEN=$CLOUDFLARE_API_TOKEN

# 安装资源绑定服务器
claude mcp add cloudflare-bindings https://bindings.mcp.cloudflare.com/sse --transport sse -e CLOUDFLARE_API_TOKEN=$CLOUDFLARE_API_TOKEN
```

可以参考这个：https://www.yuque.com/xiaoyou-nwu1w/ooi105/vl8z9ff4espztcks

### Skills列表

skillsmp：https://skillsmp.com/zh

### 安装

```shell
# 首先安装nodejs，然后安装这个
npm i -g @anthropic-ai/claude-code@latest --registry=https://registry.npmmirror.com

# vscode的话就安装插件
Claude Code for VS Code

# 升级
claude update
```

其他资料文档：https://docs.88code.org/ClaudeCode/Windows.html



强制设置环境变量(用户级别)

```sh
# 设置用户级环境变量（永久生效）
[System.Environment]::SetEnvironmentVariable("ANTHROPIC_BASE_URL", "https://open.bigmodel.cn/api/anthropic", [System.EnvironmentVariableTarget]::User)
[System.Environment]::SetEnvironmentVariable("ANTHROPIC_AUTH_TOKEN", "xxx", [System.EnvironmentVariableTarget]::User)


# 新开一个窗口查看
echo $env:ANTHROPIC_BASE_URL
```

## Codex

### 安装

```shell
npm i -g @openai/codex --registry=https://registry.npmmirror.com

codex --version
```

